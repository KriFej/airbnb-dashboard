"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, Film } from "lucide-react";

interface Props {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm", "video/mpeg", "video/x-matroska"];

export function VideoDropzone({ onFiles, disabled }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const videos = Array.from(files).filter((f) => {
        const isVideo = f.type.startsWith("video/") || ACCEPTED.includes(f.type) ||
          /\.(mp4|mov|avi|webm|mkv|m4v|mts|mxf)$/i.test(f.name);
        return isVideo;
      });
      if (videos.length > 0) onFiles(videos);
    },
    [onFiles]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      handle(e.dataTransfer.files);
    },
    [disabled, handle]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed
        transition-all duration-200 cursor-pointer select-none p-12
        ${dragging
          ? "border-brand-500 bg-brand-tint scale-[1.01]"
          : disabled
          ? "border-border opacity-40 cursor-not-allowed"
          : "border-border hover:border-brand-500/60 hover:bg-white/[0.02]"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mkv,.mts,.mxf"
        multiple
        className="hidden"
        onChange={(e) => handle(e.target.files)}
        disabled={disabled}
      />

      <div className={`p-5 rounded-2xl transition-colors ${dragging ? "bg-brand-500/20" : "bg-white/5"}`}>
        {dragging ? (
          <Film className="w-10 h-10 text-brand-500" />
        ) : (
          <Upload className="w-10 h-10 text-dim" />
        )}
      </div>

      <div className="text-center">
        <p className="text-white font-medium text-lg">
          {dragging ? "Dépose tes rushes ici" : "Glisse tes rushes ici"}
        </p>
        <p className="text-muted text-sm mt-1">
          ou clique pour sélectionner · MP4, MOV, AVI, MKV, WebM
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-dim">
        <Film className="w-3.5 h-3.5" />
        <span>Plusieurs fichiers acceptés simultanément</span>
      </div>
    </div>
  );
}
