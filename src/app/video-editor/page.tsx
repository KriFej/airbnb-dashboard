"use client";

import { useState, useCallback } from "react";
import {
  Loader2,
  Film,
  ChevronRight,
  RotateCcw,
  Wand2,
  Mic,
  MicOff,
  CheckCircle2,
} from "lucide-react";
import { VideoDropzone } from "@/components/video-editor/VideoDropzone";
import { RushCard } from "@/components/video-editor/RushCard";
import { EditPlanView, EditPlan } from "@/components/video-editor/EditPlanView";
import { ExportPanel } from "@/components/video-editor/ExportPanel";
import { MusicPicker } from "@/components/video-editor/MusicPicker";
import {
  VideoMeta,
  loadVideoMeta,
  extractFrames,
  generateThumbnail,
} from "@/lib/videoUtils";
import { extractAudioWav, transcribeRush } from "@/lib/audioUtils";

const STYLE_OPTIONS = [
  { value: "Dynamique et rythmé", label: "Dynamique", emoji: "⚡" },
  { value: "Cinématique et contemplatif", label: "Cinéma", emoji: "🎬" },
  { value: "Vlog décontracté et naturel", label: "Vlog", emoji: "📱" },
  { value: "Professionnel et épuré", label: "Pro", emoji: "💼" },
  { value: "Storytelling émotionnel", label: "Émotion", emoji: "❤️" },
  { value: "Action et énergie", label: "Action", emoji: "🏃" },
];

type Step = "upload" | "plan" | "export";

interface RushState {
  meta: VideoMeta;
  thumbnail?: string;
  frames?: string[];
  transcript?: string;
  loadingFrames: boolean;
  loadingAudio: boolean;
  analyzed: boolean;
}

export default function VideoEditorPage() {
  const [rushes, setRushes] = useState<RushState[]>([]);
  const [style, setStyle] = useState(STYLE_OPTIONS[0].value);
  const [step, setStep] = useState<Step>("upload");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [plan, setPlan] = useState<EditPlan | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [useAudio, setUseAudio] = useState(true);

  const handleFiles = useCallback(async (files: File[]) => {
    const newRushes: RushState[] = [];
    for (const file of files) {
      try {
        const meta = await loadVideoMeta(file);
        newRushes.push({ meta, loadingFrames: true, loadingAudio: true, analyzed: false });
      } catch {
        console.warn("Cannot load:", file.name);
      }
    }
    if (newRushes.length === 0) return;

    setRushes((prev) => {
      const startIdx = prev.length;
      const merged = [...prev, ...newRushes];

      merged.slice(startIdx).forEach((rush, localIdx) => {
        const globalIdx = startIdx + localIdx;

        // Thumbnail
        generateThumbnail(rush.meta).then((thumb) =>
          setRushes((r) => r.map((x, i) => (i === globalIdx ? { ...x, thumbnail: thumb } : x)))
        );

        // Frames (10)
        extractFrames(rush.meta, 10, 0.7).then((frames) =>
          setRushes((r) => r.map((x, i) => (i === globalIdx ? { ...x, frames, loadingFrames: false } : x)))
        );

        // Audio extraction + transcription (parallel, non-blocking)
        extractAudioWav(rush.meta.file, 300).then(async (audioBlob) => {
          if (!audioBlob) {
            setRushes((r) => r.map((x, i) => (i === globalIdx ? { ...x, loadingAudio: false } : x)));
            return;
          }
          const transcript = await transcribeRush(audioBlob);
          setRushes((r) =>
            r.map((x, i) => (i === globalIdx ? { ...x, transcript, loadingAudio: false } : x))
          );
        });
      });

      return merged;
    });
  }, []);

  const handleRemove = useCallback((index: number) => {
    setRushes((prev) => {
      URL.revokeObjectURL(prev[index].meta.url);
      return prev.filter((_, i) => i !== index);
    });
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
        transcript: useAudio ? (r.transcript ?? "") : "",
      }));

      const res = await fetch("/api/video/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rushes: payload, style }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur API");

      setRushes((prev) => prev.map((r) => ({ ...r, analyzed: true })));
      setPlan(json.plan);
      setStep("plan");
    } catch (err) {
      setAnalyzeError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    rushes.forEach((r) => URL.revokeObjectURL(r.meta.url));
    setRushes([]);
    setPlan(null);
    setStep("upload");
    setAnalyzeError(null);
    setMusicFile(null);
  };

  const allFramesReady = rushes.length > 0 && rushes.every((r) => !r.loadingFrames);
  const anyTranscribing = rushes.some((r) => r.loadingAudio);
  const transcribedCount = rushes.filter((r) => r.transcript && r.transcript.trim()).length;
  const files = rushes.map((r) => r.meta.file);

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

          <div className="hidden sm:flex items-center gap-1 text-xs">
            {(["upload", "plan", "export"] as Step[]).map((s, i, arr) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  step === s ? "bg-brand-500 text-black"
                  : (step === "plan" || step === "export") && s === "upload" ? "bg-brand-500/15 text-brand-400"
                  : step === "export" && s === "plan" ? "bg-brand-500/15 text-brand-400"
                  : "bg-white/5 text-dim"
                }`}>
                  {s === "upload" ? "Rushes" : s === "plan" ? "Plan Claude" : "Export"}
                </div>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-dim" />}
              </div>
            ))}
          </div>

          {rushes.length > 0 && (
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-dim hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              <RotateCcw className="w-3.5 h-3.5" />
              Recommencer
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* === UPLOAD + CONFIG === */}
        {step === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left */}
            <div className="lg:col-span-3 space-y-4">
              <div>
                <h2 className="text-white font-medium mb-1">
                  {rushes.length === 0 ? "Importe tes rushes" : `${rushes.length} rush${rushes.length > 1 ? "es" : ""} importé${rushes.length > 1 ? "s" : ""}`}
                </h2>
                <p className="text-muted text-sm">
                  {rushes.length === 0
                    ? "Claude analyse tes vidéos (image + son) et fait le montage automatiquement."
                    : "Ajoute d'autres rushes ou passe à l'analyse."}
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
                      transcript={rush.transcript}
                      transcribing={rush.loadingAudio}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-5 sticky top-24">

                {/* Style */}
                <div>
                  <h3 className="text-white font-medium text-sm mb-1">Style de montage</h3>
                  <div className="grid grid-cols-2 gap-2 mt-3">
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
                </div>

                {/* Audio toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setUseAudio((v) => !v)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${useAudio ? "bg-brand-500" : "bg-white/10"}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${useAudio ? "translate-x-4" : "translate-x-0.5"}`} />
                    </div>
                    <div className="flex items-center gap-2">
                      {useAudio ? <Mic className="w-4 h-4 text-brand-500" /> : <MicOff className="w-4 h-4 text-dim" />}
                      <div>
                        <p className="text-sm text-white font-medium">Analyse audio (Whisper)</p>
                        <p className="text-xs text-dim">Transcrit les dialogues pour Claude</p>
                      </div>
                    </div>
                  </label>

                  {useAudio && rushes.length > 0 && (
                    <div className="mt-2 ml-12 text-xs">
                      {anyTranscribing ? (
                        <span className="flex items-center gap-1.5 text-muted">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Transcription en cours…
                        </span>
                      ) : transcribedCount > 0 ? (
                        <span className="flex items-center gap-1.5 text-brand-500">
                          <CheckCircle2 className="w-3 h-3" />
                          {transcribedCount}/{rushes.length} transcrit{transcribedCount > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-dim">Ajoute GROQ_API_KEY pour activer</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Music */}
                <div className="border-t border-border pt-4">
                  <MusicPicker
                    musicFile={musicFile}
                    musicVolume={musicVolume}
                    onChange={setMusicFile}
                    onVolumeChange={setMusicVolume}
                  />
                </div>

                {/* CTA */}
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
                    <><Loader2 className="w-4 h-4 animate-spin" />Analyse en cours…</>
                  ) : !allFramesReady && rushes.length > 0 ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Extraction frames…</>
                  ) : (
                    <><Wand2 className="w-4 h-4" />Monter avec Claude</>
                  )}
                </button>

                {rushes.length === 0 && (
                  <p className="text-xs text-dim text-center">Importe au moins un rush</p>
                )}

                {analyzeError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                    <p className="text-xs text-red-400">{analyzeError}</p>
                    {analyzeError.includes("ANTHROPIC_API_KEY") && (
                      <p className="text-xs text-red-400/60 mt-1">
                        Ajoute <code className="font-mono">ANTHROPIC_API_KEY</code> dans <code className="font-mono">.env.local</code>
                      </p>
                    )}
                  </div>
                )}

                {allFramesReady && !analyzing && rushes.length > 0 && (
                  <ul className="text-xs text-dim space-y-1">
                    <li className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" />{rushes.length} rush{rushes.length > 1 ? "es" : ""} prêt{rushes.length > 1 ? "s" : ""}</li>
                    <li className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" />{rushes.reduce((a, r) => a + (r.frames?.length ?? 0), 0)} frames analysées</li>
                    {transcribedCount > 0 && (
                      <li className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" />{transcribedCount} audio transcrit{transcribedCount > 1 ? "s" : ""}</li>
                    )}
                    {musicFile && (
                      <li className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500" />Musique : {musicFile.name}</li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* === PLAN === */}
        {step === "plan" && plan && (
          <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-white font-semibold text-2xl">Plan de montage</h2>
                <p className="text-muted text-sm mt-1">
                  Généré par Claude · {rushes.length} rush{rushes.length > 1 ? "es" : ""}
                  {transcribedCount > 0 ? ` · ${transcribedCount} audio transcrit${transcribedCount > 1 ? "s" : ""}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep("upload")}
                  className="flex items-center gap-2 px-4 h-10 rounded-full border border-border text-sm text-muted hover:border-border-hover hover:text-white transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Modifier
                </button>
                <button
                  onClick={() => setStep("export")}
                  className="flex items-center gap-2 px-4 h-10 rounded-full bg-brand-500 text-black text-sm font-medium hover:bg-brand-400 shadow-btn-glow transition-all"
                >
                  Exporter <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <EditPlanView plan={plan} />

            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted mb-3">Changer de style et régénérer :</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setStyle(opt.value); setStep("upload"); }}
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

        {/* === EXPORT === */}
        {step === "export" && plan && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <button onClick={() => setStep("plan")} className="flex items-center gap-1.5 text-sm text-dim hover:text-white transition-colors mb-4">
                ← Retour au plan
              </button>
              <h2 className="text-white font-semibold text-2xl">Export vidéo</h2>
              <p className="text-muted text-sm mt-1">Encodage local dans le navigateur.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
              <div>
                <p className="text-white font-medium">{plan.title}</p>
                <p className="text-muted text-xs mt-0.5">{plan.clips.length} clips · ~{Math.round(plan.totalDuration)}s</p>
              </div>

              {/* Music recap */}
              {musicFile && (
                <div className="bg-brand-tint border border-brand-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-brand-400">
                  <span>🎵</span>
                  <span>{musicFile.name} — volume {Math.round(musicVolume * 100)}%</span>
                </div>
              )}

              <ExportPanel
                clips={plan.clips}
                files={files}
                musicFile={musicFile}
                musicVolume={musicVolume}
                disabled={false}
              />
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Clips à exporter</p>
              <div className="space-y-1.5">
                {plan.clips.map((clip, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center font-mono text-dim shrink-0">{i + 1}</span>
                    <span className="text-muted truncate">{clip.description}</span>
                    <span className="shrink-0 font-mono text-dim">{(clip.end - clip.start).toFixed(1)}s</span>
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
