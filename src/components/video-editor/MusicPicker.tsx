"use client";

import { useRef, useState } from "react";
import { Music, Upload, X, Volume2 } from "lucide-react";

interface Props {
  musicFile: File | null;
  musicVolume: number;
  onChange: (file: File | null) => void;
  onVolumeChange: (v: number) => void;
}

export function MusicPicker({ musicFile, musicVolume, onChange, onVolumeChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.type.startsWith("audio/") || /\.(mp3|wav|aac|m4a|ogg|flac)$/i.test(f.name)) {
      onChange(f);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-muted" />
          <span className="text-sm text-white font-medium">Musique de fond</span>
        </div>
        {musicFile && (
          <button
            onClick={() => onChange(null)}
            className="text-dim hover:text-white transition-colors"
            title="Supprimer la musique"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!musicFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed cursor-pointer transition-all ${
            dragging
              ? "border-brand-500/60 bg-brand-tint"
              : "border-border hover:border-brand-500/40 hover:bg-white/[0.02]"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.aac,.m4a,.ogg,.flac"
            className="hidden"
            onChange={(e) => handleFile(e.target.files)}
          />
          <Upload className="w-4 h-4 text-dim shrink-0" />
          <div>
            <p className="text-sm text-muted">Ajouter une musique</p>
            <p className="text-xs text-dim">MP3, WAV, AAC, M4A…</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border">
          <div className="p-1.5 bg-brand-tint rounded-lg">
            <Music className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{musicFile.name}</p>
            <p className="text-xs text-dim">{(musicFile.size / (1024 * 1024)).toFixed(1)} Mo</p>
          </div>
        </div>
      )}

      {/* Volume slider */}
      {musicFile && (
        <div className="flex items-center gap-3">
          <Volume2 className="w-3.5 h-3.5 text-dim shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={musicVolume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            className="flex-1 accent-brand-500 h-1.5"
          />
          <span className="text-xs font-mono text-muted w-8 text-right">
            {Math.round(musicVolume * 100)}%
          </span>
        </div>
      )}

      <p className="text-xs text-dim">
        {musicFile
          ? "La musique sera mixée sous les sons originaux."
          : "Optionnel — laisse vide pour garder le son original."}
      </p>
    </div>
  );
}
