"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

export async function getFFmpeg(
  onProgress?: (ratio: number) => void
): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const ffmpeg = new FFmpeg();
    if (onProgress) ffmpeg.on("progress", ({ progress }) => onProgress(progress));

    const baseURL = "/ffmpeg";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  })();

  return loadingPromise;
}

export interface ClipSegment {
  rushIndex: number;
  rushName: string;
  start: number;
  end: number;
  description: string;
}

export interface ExportOptions {
  clips: ClipSegment[];
  files: File[];
  musicFile?: File | null;
  musicVolume?: number;   // 0–1, default 0.3
  transitions?: boolean;  // xfade crossfade between clips
  onProgress: (pct: number, label: string) => void;
}

const TRANSITION_DURATION = 0.5; // seconds

export async function exportVideo(options: ExportOptions): Promise<Blob> {
  const {
    clips,
    files,
    musicFile = null,
    musicVolume = 0.3,
    transitions = true,
    onProgress,
  } = options;

  onProgress(0, "Chargement de FFmpeg…");
  const ffmpeg = await getFFmpeg();

  // 1. Write each unique rush file
  const written = new Set<number>();
  for (const clip of clips) {
    if (!written.has(clip.rushIndex)) {
      const file = files[clip.rushIndex];
      if (!file) continue;
      onProgress(5, `Chargement de ${file.name}…`);
      await ffmpeg.writeFile(`rush_${clip.rushIndex}.mp4`, await fetchFile(file));
      written.add(clip.rushIndex);
    }
  }

  // 2. Trim each clip to a re-encoded segment (needed for xfade alignment)
  const clipDurations: number[] = [];
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const dur = clip.end - clip.start;
    clipDurations.push(dur);
    onProgress(
      10 + Math.round((i / clips.length) * 35),
      `Découpe clip ${i + 1}/${clips.length}…`
    );
    await ffmpeg.exec([
      "-ss", clip.start.toFixed(3),
      "-t", dur.toFixed(3),
      "-i", `rush_${clip.rushIndex}.mp4`,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "ultrafast",
      "-r", "30",
      "-avoid_negative_ts", "make_zero",
      `clip_${i}.mp4`,
    ]);
  }

  onProgress(50, "Assemblage des clips…");

  let assembledName = "assembled.mp4";

  if (clips.length === 1) {
    // Single clip — just rename
    await ffmpeg.exec(["-i", "clip_0.mp4", "-c", "copy", assembledName]);
  } else if (transitions && clips.length >= 2) {
    // --- xfade chain ---
    const inputs = clips.map((_, i) => ["-i", `clip_${i}.mp4`]).flat();

    let filterV = "";
    let filterA = "";
    let prevV = "[0:v]";
    let prevA = "[0:a]";
    let offset = 0;

    for (let i = 1; i < clips.length; i++) {
      // offset = cumulative duration of all previous clips minus overlapping transitions
      offset += clipDurations[i - 1] - TRANSITION_DURATION;
      const isLast = i === clips.length - 1;
      const vOut = isLast ? "[vout]" : `[v${i}]`;
      const aOut = isLast ? "[aout]" : `[a${i}]`;

      filterV += `${prevV}[${i}:v]xfade=transition=fade:duration=${TRANSITION_DURATION}:offset=${offset.toFixed(3)}${vOut};`;
      filterA += `${prevA}[${i}:a]acrossfade=d=${TRANSITION_DURATION}${aOut};`;

      prevV = vOut;
      prevA = aOut;
    }

    // Remove trailing semicolons
    const filterComplex = (filterV + filterA).replace(/;$/, "");

    await ffmpeg.exec([
      ...inputs,
      "-filter_complex", filterComplex,
      "-map", "[vout]",
      "-map", "[aout]",
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "ultrafast",
      assembledName,
    ]);
  } else {
    // Simple concat (no transitions)
    const concatContent = clips.map((_, i) => `file 'clip_${i}.mp4'`).join("\n");
    await ffmpeg.writeFile("concat.txt", concatContent);
    await ffmpeg.exec([
      "-f", "concat",
      "-safe", "0",
      "-i", "concat.txt",
      "-c", "copy",
      assembledName,
    ]);
  }

  // 3. Mix background music if provided
  if (musicFile) {
    onProgress(80, "Mixage de la musique…");
    await ffmpeg.writeFile("music_src", await fetchFile(musicFile));

    await ffmpeg.exec([
      "-i", assembledName,
      "-i", "music_src",
      "-filter_complex",
      `[1:a]volume=${musicVolume}[music];[0:a][music]amix=inputs=2:duration=first:dropout_transition=2[aout]`,
      "-map", "0:v",
      "-map", "[aout]",
      "-c:v", "copy",
      "-c:a", "aac",
      "-shortest",
      "output.mp4",
    ]);
  } else {
    // Rename assembled to output
    await ffmpeg.exec(["-i", assembledName, "-c", "copy", "output.mp4"]);
  }

  onProgress(95, "Lecture du fichier final…");
  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data], { type: "video/mp4" });

  onProgress(100, "Terminé !");
  return blob;
}
