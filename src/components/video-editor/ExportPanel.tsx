"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { exportVideo, ClipSegment } from "@/lib/ffmpegClient";

interface Props {
  clips: ClipSegment[];
  files: File[];
  disabled?: boolean;
}

type ExportState = "idle" | "loading" | "done" | "error";

export function ExportPanel({ clips, files, disabled }: Props) {
  const [state, setState] = useState<ExportState>("idle");
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (state === "loading" || disabled) return;

    setState("loading");
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const blob = await exportVideo(clips, files, (pct, lbl) => {
        setProgress(pct);
        setLabel(lbl);
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setState("done");

      // Auto-trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "montage_claude.mp4";
      a.click();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      setState("error");
    }
  };

  const handleDownloadAgain = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "montage_claude.mp4";
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Warning for SharedArrayBuffer */}
      {state === "idle" && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            L&apos;export nécessite <strong className="text-amber-300">Cross-Origin Isolation</strong> (activé sur cette page).
            L&apos;encodage se fait entièrement dans le navigateur — aucun fichier n&apos;est envoyé à un serveur.
          </p>
        </div>
      )}

      {/* Progress bar */}
      {state === "loading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className="font-mono text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {state === "error" && error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-400 font-medium">Erreur d&apos;export</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {state === "done" && (
        <div className="bg-brand-tint border border-brand-500/20 rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-500" />
          <p className="text-sm text-brand-400">Vidéo exportée ! Le téléchargement a démarré automatiquement.</p>
        </div>
      )}

      {/* Export button */}
      <div className="flex gap-3">
        <button
          onClick={state === "done" ? handleDownloadAgain : handleExport}
          disabled={disabled || state === "loading"}
          className={`
            flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-full font-medium text-sm transition-all
            ${state === "loading"
              ? "bg-brand-500/40 text-brand-400 cursor-wait"
              : disabled
              ? "bg-white/5 text-muted cursor-not-allowed"
              : state === "done"
              ? "bg-brand-500/20 text-brand-400 border border-brand-500/30 hover:bg-brand-500/30"
              : "bg-brand-500 text-black hover:bg-brand-400 shadow-btn-glow"
            }
          `}
        >
          {state === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Export en cours…
            </>
          ) : state === "done" ? (
            <>
              <Download className="w-4 h-4" />
              Télécharger à nouveau
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Exporter le montage MP4
            </>
          )}
        </button>

        {state === "error" && (
          <button
            onClick={() => { setState("idle"); setError(null); }}
            className="px-4 h-12 rounded-full border border-border text-sm text-muted hover:border-border-hover hover:text-white transition-all"
          >
            Réessayer
          </button>
        )}
      </div>

      <p className="text-xs text-dim text-center">
        {clips.length} clip{clips.length > 1 ? "s" : ""} · Encodage H.264 local via FFmpeg WebAssembly
      </p>
    </div>
  );
}
