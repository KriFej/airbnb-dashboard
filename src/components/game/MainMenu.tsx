'use client';

import type { Level, SaveData } from '@/lib/game/types';

interface Props {
  onPlay: (level: Level, practice: boolean) => void;
  onEditor: () => void;
  levels: Level[];
  save: SaveData;
}

const DIFF_COLORS: Record<string, string> = {
  auto: '#94a3b8', easy: '#22c55e', normal: '#3b82f6',
  hard: '#f59e0b', harder: '#ef4444', insane: '#8b5cf6',
  demon_easy: '#ec4899', demon: '#ef4444', demon_insane: '#dc2626', demon_extreme: '#7f1d1d',
};

export default function MainMenu({ onPlay, onEditor, levels, save }: Props) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center"
         style={{ background: 'linear-gradient(180deg, #0d0d2a 0%, #1a1a4e 100%)' }}>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-black tracking-widest mb-2"
            style={{ color: '#22c55e', textShadow: '0 0 30px #22c55e88, 0 0 60px #22c55e44' }}>
          RHYTHM DASH
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Press · Survive · Master
        </p>
      </div>

      {/* Level list */}
      <div className="flex flex-col gap-3 w-full max-w-md px-4 mb-8">
        {levels.map(level => {
          const best = save.bestProgressPerLevel[level.id] ?? 0;
          const completed = save.completedLevels.includes(level.id);
          const attempts = save.attemptsPerLevel[level.id] ?? 0;
          const stars = save.starsPerLevel[level.id] ?? 0;
          const diffColor = DIFF_COLORS[level.difficulty] ?? '#94a3b8';

          return (
            <div key={level.id}
                 className="rounded-xl overflow-hidden border border-white/10"
                 style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{level.name}</h3>
                    <p className="text-white/50 text-xs mt-0.5">by {level.author}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: diffColor + '33', color: diffColor }}>
                      {level.difficulty.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 10 }, (_, i) => (
                        <span key={i} style={{ color: i < level.stars ? '#fbbf24' : '#374151', fontSize: '10px' }}>★</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all"
                       style={{ width: `${best * 100}%`, background: completed ? '#22c55e' : '#3b82f6' }} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-white/40 text-xs flex gap-3">
                    {best > 0 && <span>Best: {Math.floor(best * 100)}%</span>}
                    {attempts > 0 && <span>{attempts} attempts</span>}
                    {completed && <span style={{ color: '#22c55e' }}>✓ Completed</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onPlay(level, true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}>
                      Practice
                    </button>
                    <button
                      onClick={() => onPlay(level, false)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                      style={{ background: '#22c55e', color: '#000' }}>
                      Play
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor button */}
      <button
        onClick={onEditor}
        className="px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
        style={{ background: 'rgba(139,92,246,0.2)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>
        ✏ Level Editor
      </button>

      <p className="mt-8 text-white/20 text-xs">
        SPACE / CLICK / TAP to jump
      </p>
    </div>
  );
}
