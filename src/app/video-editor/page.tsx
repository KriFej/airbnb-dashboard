"use client";

import { useState, useCallback } from "react";
import {
  Sparkles,
  Loader2,
  Film,
  ChevronRight,
  RotateCcw,
  Wand2,
} from "lucide-react";
import { VideoDropzone } from "@/components/video-editor/VideoDropzone";
import { RushCard } from "@/components/video-editor/RushCard";
import { EditPlanView, EditPlan } from "@/components/video-editor/EditPlanView";
import { ExportPanel } from "@/components/video-editor/ExportPanel";
import {
  VideoMeta,
  loadVideoMeta,
  extractFrames,
  generateThumbnail,
} from "@/lib/videoUtils";

const STYLE_OPTIONS = [
  { value: "Dynamique et rythmé", label: "Dynamique", emoji: "⚡" },
  { value: "Cinématique et contemplatif", label: "Cinéma", emoji: "🎬" },
  { value: "Vlog décontracté et naturel", label: "Vlog", emoji: "📱" },
  { value: "Professionnel et épuré", label: "Pro", emoji: "💼" },
  { value: "Storytelling émotionnel", label: "Émotion", emoji: "❤️" },
  { value: "Action et énergie", label: "Action", emoji: "🏃" },
];

type Step = "upload" | "analyze" | "plan" | "export";

interface RushState {
  meta: VideoMeta;
  thumbnail?: string;
  frames?: string[];
  loadingFrames: boolean;
  analyzed: boolean;
}

export default function VideoEditorPage() {
  const [rushes, setRushes] = useState<RushState[]>([]);
  const [style, setStyle] = useState(STYLE_OPTIONS[0].value);
  const [step, setStep] = useState<Step>("upload");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [plan, setPlan] = useState<EditPlan | null>(null);

  const handleFiles = useCallback(async (files: File[]) => {
    const newRushes: RushState[] = [];

    for (const file of files) {
      try {
        const meta = await loadVideoMeta(file);
        newRushes.push({ meta, loadingFrames: true, analyzed: false });
      } catch {
        console.warn("Cannot load:", file.name);
      }
    }

    if (newRushes.length === 0) return;

    setRushes((prev) => {
      const merged = [...prev, ...newRushes];
      // Start loading thumbnails and frames for new rushes
      const startIdx = prev.length;
      merged.slice(startIdx).forEach((rush, localIdx) => {
        const globalIdx = startIdx + localIdx;
        generateThumbnail(rush.meta).then((thumb) => {
          setRushes((r) =>
            r.map((x, i) =>
              i === globalIdx ? { ...x, thumbnail: thumb } : x
            )
          );
        });
        extractFrames(rush.meta, 4, 0.7).then((frames) => {
          setRushes((r) =>
            r.map((x, i) =>
              i === globalIdx ? { ...x, frames, loadingFrames: false } : x
            )
          );
        });
      });
      return merged;
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setRushes((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAnalyze = async () => {
    if (rushes.length === 0 || analyzing) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    setPlan(null);

    try {
      const payload = rushes.map((r) => ({
        name: r.meta.name,
        duration: r.meta.duration,
        frames: r.frames ?? [],
      }));

      const res = await fetch("/api/video/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rushes: payload, style }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Erreur API");
      }

      // Mark all rushes as analyzed
      setRushes((prev) => prev.map((r) => ({ ...r, analyzed: true })));
      setPlan(json.plan);
      setStep("plan");
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setAnalyzing(false);
    }
  };

  const allFramesReady = rushes.length > 0 && rushes.every((r) => !r.loadingFrames);
  const files = rushes.map((r) => r.meta.file);

  const reset = () => {
    rushes.forEach((r) => URL.revokeObjectURL(r.meta.url));
    setRushes([]);
    setPlan(null);
    setStep("upload");
    setAnalyzeError(null);
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <div className="border-b border-border bg-surface sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-tint rounded-xl">
              <Film className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-base leading-none">Claude Video Editor</h1>
              <p className="text-dim text-xs mt-0.5">Montage automatique par IA</p>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="hidden sm:flex items-center gap-1 text-xs">
            {(["upload", "analyze", "plan", "export"] as Step[]).map((s, i, arr) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  step === s
                    ? "bg-brand-500 text-black"
                    : ["plan", "export"].includes(step) && ["upload", "analyze"].includes(s)
                    ? "bg-brand-500/15 text-brand-400"
                    : "bg-white/5 text-dim"
                }`}>
                  {s === "upload" ? "Rushes" : s === "analyze" ? "Style" : s === "plan" ? "Plan" : "Export"}
                </div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-dim" />}
              </div>
            ))}
          </div>

          {rushes.length > 0 && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-dim hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Recommencer
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* === STEP: Upload === */}
        {(step === "upload" || step === "analyze") && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left column: Dropzone + Rush list */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h2 className="text-white font-medium mb-1">
                  {rushes.length === 0 ? "Importe tes rushes" : `${rushes.length} rush${rushes.length > 1 ? "es" : ""} importé${rushes.length > 1 ? "s" : ""}`}
                </h2>
                <p className="text-muted text-sm">
                  {rushes.length === 0
                    ? "Glisse tes fichiers vidéos bruts — Claude fera le montage à ta place."
                    : "Ajoute d'autres rushes ou passe au style de montage."}
                </p>
              </div>

              <VideoDropzone onFiles={handleFiles} disabled={analyzing} />

              {rushes.length > 0 && (
                <div className="space-y-2">
                  {rushes.map((rush, i) => (
                    <RushCard
                      key={`${rush.meta.name}-${i}`}
                      rush={rush.meta}
                      index={i}
                      thumbnail={rush.thumbnail}
                      loading={rush.loadingFrames}
                      analyzed={rush.analyzed}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right column: Style selector + Analyze button */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4 sticky top-24">
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">Style de montage</h3>
                  <p className="text-muted text-xs">Claude adaptera le rythme et les choix de coupe.</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {STYLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setStyle(opt.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left border ${
                        style === opt.value
                          ? "bg-brand-tint border-brand-500/40 text-brand-400"
                          : "border-border text-muted hover:border-border-hover hover:text-white"
                      }`}
                    >
                      <span className="text-base">{opt.emoji}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Analyze button */}
                <button
                  onClick={handleAnalyze}
                  disabled={!allFramesReady || analyzing}
                  className={`w-full h-12 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                    !allFramesReady || analyzing
                      ? "bg-white/5 text-muted cursor-not-allowed"
                      : "bg-brand-500 text-black hover:bg-brand-400 shadow-btn-glow"
                  }`}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyse en cours…
                    </>
                  ) : !allFramesReady && rushes.length > 0 ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extraction des frames…
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Monter avec Claude
                    </>
                  )}
                </button>

                {rushes.length === 0 && (
                  <p className="text-xs text-dim text-center">
                    Importe au moins un rush pour commencer
                  </p>
                )}

                {analyzeError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-xs text-red-400">{analyzeError}</p>
                    {analyzeError.includes("ANTHROPIC_API_KEY") && (
                      <p className="text-xs text-red-400/60 mt-1">
                        Ajoute <code className="font-mono">ANTHROPIC_API_KEY</code> dans ton fichier <code className="font-mono">.env.local</code>
                      </p>
                    )}
                  </div>
                )}

                {rushes.length > 0 && allFramesReady && !analyzing && (
                  <div className="text-xs text-dim space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span>{rushes.length} rush{rushes.length > 1 ? "es" : ""} prêt{rushes.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span>{rushes.reduce((a, r) => a + (r.frames?.length ?? 0), 0)} frames extraites</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                      <span>Style : {STYLE_OPTIONS.find(o => o.value === style)?.label}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === STEP: Plan === */}
        {step === "plan" && plan && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white font-semibold text-2xl">Plan de montage</h2>
                <p className="text-muted text-sm mt-1">
                  Généré par Claude à partir de {rushes.length} rush{rushes.length > 1 ? "es" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("upload")}
                  className="flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm text-muted hover:border-border-hover hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Modifier les rushes
                </button>
                <button
                  onClick={() => setStep("export")}
                  className="flex items-center gap-2 px-4 h-10 rounded-full bg-brand-500 text-black text-sm font-medium hover:bg-brand-400 shadow-btn-glow transition-all"
                >
                  Exporter
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <EditPlanView plan={plan} />

            {/* Re-analyze with different style */}
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted mb-3">Changer de style et régénérer :</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStyle(opt.value);
                      setStep("upload");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      style === opt.value
                        ? "border-brand-500/40 bg-brand-tint text-brand-400"
                        : "border-border text-dim hover:border-border-hover hover:text-white"
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === STEP: Export === */}
        {step === "export" && plan && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <button
                onClick={() => setStep("plan")}
                className="flex items-center gap-1.5 text-sm text-dim hover:text-white transition-colors mb-4"
              >
                ← Retour au plan
              </button>
              <h2 className="text-white font-semibold text-2xl">Export vidéo</h2>
              <p className="text-muted text-sm mt-1">
                L&apos;encodage se fait dans ton navigateur via FFmpeg WebAssembly.
              </p>
            </div>

            {/* Plan summary */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-white font-medium">{plan.title}</p>
                  <p className="text-muted text-xs mt-0.5">{plan.clips.length} clips · ~{Math.round(plan.totalDuration)}s</p>
                </div>
              </div>
              <ExportPanel
                clips={plan.clips}
                files={files}
                disabled={false}
              />
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Ce qui sera exporté</p>
              <div className="space-y-1.5">
                {plan.clips.map((clip, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-dim shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted truncate">{clip.description}</span>
                    <span className="shrink-0 font-mono text-dim">
                      {(clip.end - clip.start).toFixed(1)}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
