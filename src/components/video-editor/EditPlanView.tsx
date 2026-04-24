"use client";

import { Clock, Film, Sparkles, AlignLeft, ChevronRight } from "lucide-react";
import { formatDuration } from "@/lib/videoUtils";

export interface ClipSegment {
  rushIndex: number;
  rushName: string;
  start: number;
  end: number;
  description: string;
}

export interface EditPlan {
  title: string;
  synopsis: string;
  totalDuration: number;
  clips: ClipSegment[];
  editingNotes: string;
}

interface Props {
  plan: EditPlan;
}

const CLIP_COLORS = [
  "bg-blue-500/20 border-blue-500/40 text-blue-400",
  "bg-purple-500/20 border-purple-500/40 text-purple-400",
  "bg-amber-500/20 border-amber-500/40 text-amber-400",
  "bg-pink-500/20 border-pink-500/40 text-pink-400",
  "bg-cyan-500/20 border-cyan-500/40 text-cyan-400",
  "bg-red-500/20 border-red-500/40 text-red-400",
  "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
  "bg-indigo-500/20 border-indigo-500/40 text-indigo-400",
];

const DOT_COLORS = [
  "bg-blue-400",
  "bg-purple-400",
  "bg-amber-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-red-400",
  "bg-emerald-400",
  "bg-indigo-400",
];

export function EditPlanView({ plan }: Props) {
  const totalBarDuration = plan.clips.reduce((acc, c) => acc + (c.end - c.start), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-brand-tint border border-brand-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-500/15 rounded-xl">
            <Sparkles className="w-5 h-5 text-brand-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-semibold text-xl leading-tight">{plan.title}</h2>
            <p className="text-muted text-sm mt-1 leading-relaxed">{plan.synopsis}</p>
          </div>
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1.5 bg-black/30 rounded-full px-3 py-1.5 text-sm text-white font-mono">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              {formatDuration(plan.totalDuration)}
            </div>
          </div>
        </div>
      </div>

      {/* Visual timeline */}
      <div>
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">Timeline visuelle</p>
        <div className="flex rounded-xl overflow-hidden h-10 gap-px bg-border">
          {plan.clips.map((clip, i) => {
            const width = ((clip.end - clip.start) / (totalBarDuration || 1)) * 100;
            const rushColor = CLIP_COLORS[clip.rushIndex % CLIP_COLORS.length];
            const baseClasses = "flex items-center justify-center text-xs font-medium transition-all hover:brightness-125 cursor-default relative group";
            return (
              <div
                key={i}
                className={`${baseClasses} ${rushColor} border-0`}
                style={{ width: `${width}%`, minWidth: 4 }}
                title={`${clip.description} (${formatDuration(clip.start)}→${formatDuration(clip.end)})`}
              >
                {width > 6 && (
                  <span className="truncate px-1">{i + 1}</span>
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap">
                  <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-white shadow-xl max-w-xs">
                    <p className="font-medium">{clip.rushName}</p>
                    <p className="text-muted mt-0.5">{formatDuration(clip.start)} → {formatDuration(clip.end)}</p>
                    <p className="text-muted mt-0.5 truncate">{clip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-dim mt-1 font-mono">
          <span>0:00</span>
          <span>{formatDuration(totalBarDuration)}</span>
        </div>
      </div>

      {/* Clip list */}
      <div>
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
          Séquence — {plan.clips.length} clips
        </p>
        <div className="space-y-2">
          {plan.clips.map((clip, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-border-hover transition-colors"
            >
              {/* Step number */}
              <div className="shrink-0 w-7 h-7 rounded-full bg-white/5 border border-border flex items-center justify-center text-xs font-mono text-dim">
                {i + 1}
              </div>

              {/* Rush dot */}
              <div className={`shrink-0 w-2.5 h-2.5 rounded-full ${DOT_COLORS[clip.rushIndex % DOT_COLORS.length]}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium truncate">{clip.description}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                  <Film className="w-3 h-3 shrink-0" />
                  <span className="truncate">{clip.rushName}</span>
                  <span>·</span>
                  <span className="font-mono shrink-0">
                    {formatDuration(clip.start)} → {formatDuration(clip.end)}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 text-xs font-mono text-dim bg-white/5 rounded-md px-2 py-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(clip.end - clip.start)}
                </span>
              </div>

              <ChevronRight className="w-4 h-4 text-dim shrink-0 opacity-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Editing notes */}
      {plan.editingNotes && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlignLeft className="w-4 h-4 text-muted" />
            <p className="text-xs font-medium text-muted uppercase tracking-wider">Notes du monteur IA</p>
          </div>
          <p className="text-sm text-muted leading-relaxed">{plan.editingNotes}</p>
        </div>
      )}
    </div>
  );
}
