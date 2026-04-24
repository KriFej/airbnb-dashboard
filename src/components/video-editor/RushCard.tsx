"use client";

import { Film, Loader2, Trash2, CheckCircle2, Mic, MicOff } from "lucide-react";
import { VideoMeta, formatDuration, formatSize } from "@/lib/videoUtils";

interface Props {
  rush: VideoMeta;
  index: number;
  thumbnail?: string;
  loading?: boolean;
  analyzed?: boolean;
  transcript?: string;
  transcribing?: boolean;
  onRemove: (index: number) => void;
}

export function RushCard({ rush, index, thumbnail, loading, analyzed, transcript, transcribing, onRemove }: Props) {
  return (
    <div className="group relative flex gap-4 bg-card border border-border rounded-xl p-4 hover:border-border-hover transition-all">
      {/* Thumbnail */}
      <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-white/5 shrink-0 flex items-center justify-center">
        {thumbnail ? (
          <img src={thumbnail} alt={rush.name} className="w-full h-full object-cover" />
        ) : loading ? (
          <Loader2 className="w-5 h-5 text-muted animate-spin" />
        ) : (
          <Film className="w-5 h-5 text-dim" />
        )}
        <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 py-0.5 text-xs text-white font-mono">
          {formatDuration(rush.duration)}
        </div>
        {analyzed && (
          <div className="absolute top-1 left-1">
            <CheckCircle2 className="w-4 h-4 text-brand-500" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{rush.name}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
          <span>{rush.width}×{rush.height}</span>
          <span>·</span>
          <span>{formatSize(rush.size)}</span>
          <span>·</span>
          <span>{formatDuration(rush.duration)}</span>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {loading ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Frames…
            </span>
          ) : analyzed ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-500">
              <CheckCircle2 className="w-3 h-3" />
              Analysé
            </span>
          ) : null}

          {transcribing ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <Loader2 className="w-3 h-3 animate-spin" />
              Transcription…
            </span>
          ) : transcript ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-400" title={transcript}>
              <Mic className="w-3 h-3" />
              Audio transcrit
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-dim">
              <MicOff className="w-3 h-3" />
              Pas de transcription
            </span>
          )}
        </div>

        {/* Transcript preview */}
        {transcript && (
          <p className="mt-1.5 text-xs text-dim italic line-clamp-2 leading-relaxed">
            &ldquo;{transcript.slice(0, 120)}{transcript.length > 120 ? "…" : ""}&rdquo;
          </p>
        )}
      </div>

      {/* Index + remove */}
      <div className="shrink-0 flex flex-col items-end gap-2">
        <span className="text-xs text-dim font-mono">#{index + 1}</span>
        <button
          onClick={() => onRemove(index)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-dim"
          title="Supprimer ce rush"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
