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

    if (onProgress) {
      ffmpeg.on("progress", ({ progress }) => onProgress(progress));
    }

    const baseURL = "/ffmpeg";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
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

export async function exportVideo(
  clips: ClipSegment[],
  files: File[],
  onProgress: (pct: number, label: string) => void
): Promise<Blob> {
  onProgress(0, "Chargement de FFmpeg…");
  const ffmpeg = await getFFmpeg((r) =>
    onProgress(Math.round(r * 80), "Encodage…")
  );

  // Write each unique rush file
  const writtenFiles = new Set<number>();
  for (const clip of clips) {
    if (!writtenFiles.has(clip.rushIndex)) {
      const file = files[clip.rushIndex];
      if (!file) continue;
      onProgress(5, `Chargement de ${file.name}…`);
      await ffmpeg.writeFile(`rush_${clip.rushIndex}.mp4`, await fetchFile(file));
      writtenFiles.add(clip.rushIndex);
    }
  }

  // Trim each clip
  const trimmedParts: string[] = [];
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const outName = `clip_${i}.mp4`;
    const duration = clip.end - clip.start;
    onProgress(10 + Math.round((i / clips.length) * 40), `Découpe clip ${i + 1}/${clips.length}…`);

    await ffmpeg.exec([
      "-ss", clip.start.toFixed(3),
      "-t", duration.toFixed(3),
      "-i", `rush_${clip.rushIndex}.mp4`,
      "-c:v", "libx264",
      "-c:a", "aac",
      "-preset", "ultrafast",
      "-avoid_negative_ts", "make_zero",
      outName,
    ]);

    trimmedParts.push(outName);
  }

  // Write concat list
  const concatContent = trimmedParts
    .map((f) => `file '${f}'`)
    .join("\n");
  await ffmpeg.writeFile("concat.txt", concatContent);

  onProgress(70, "Assemblage final…");
  await ffmpeg.exec([
    "-f", "concat",
    "-safe", "0",
    "-i", "concat.txt",
    "-c", "copy",
    "output.mp4",
  ]);

  onProgress(95, "Lecture du fichier final…");
  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([data], { type: "video/mp4" });

  onProgress(100, "Terminé !");
  return blob;
}
