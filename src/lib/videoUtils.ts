export interface VideoMeta {
  name: string;
  duration: number;
  width: number;
  height: number;
  size: number;
  url: string;
  file: File;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function loadVideoMeta(file: File): Promise<VideoMeta> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({
        name: file.name.replace(/\.[^/.]+$/, ""),
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
        url,
        file,
      });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Cannot load video: ${file.name}`));
    };
  });
}

export function extractFrames(
  videoMeta: VideoMeta,
  count: number = 4,
  quality: number = 0.7
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoMeta.url;
    video.crossOrigin = "anonymous";
    video.preload = "auto";

    video.onloadeddata = async () => {
      const canvas = document.createElement("canvas");
      const maxW = 640;
      const scale = Math.min(1, maxW / videoMeta.width);
      canvas.width = Math.round(videoMeta.width * scale);
      canvas.height = Math.round(videoMeta.height * scale);
      const ctx = canvas.getContext("2d")!;

      const frames: string[] = [];
      const duration = videoMeta.duration;

      for (let i = 0; i < count; i++) {
        // Avoid first/last 5% to skip intros/outros
        const t = duration * (0.05 + (0.9 * i) / Math.max(count - 1, 1));
        await seekVideo(video, t);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", quality));
      }

      resolve(frames);
    };

    video.onerror = () => reject(new Error("Frame extraction failed"));
  });
}

function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      // Small delay so the frame is rendered
      setTimeout(resolve, 50);
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = time;
  });
}

export function generateThumbnail(videoMeta: VideoMeta): Promise<string> {
  return extractFrames(videoMeta, 1, 0.8).then((f) => f[0] ?? "");
}
