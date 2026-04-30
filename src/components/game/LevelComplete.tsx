'use client';

import { useEffect, useState } from 'react';
import type { Level } from '@/lib/game/types';

interface Props {
  level: Level;
  attempts: number;
  coinsCollected: boolean[];
  onReplay: () => void;
  onMenu: () => void;
  onNext?: () => void;
}

export default function LevelComplete({
  level, attempts, coinsCollected, onReplay, onMenu, onNext,
}: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(t);
  }, []);

  const coins = coinsCollected.filter(Boolean).length;

  return (
    <div className="absolute inset-0 flex items-center justify-center"
         style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div
        className="text-center px-8 py-10 rounded-2xl max-w-sm w-full mx-4 transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a2e 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          transform: show ? 'scale(1)' : 'scale(0.8)',
          opacity: show ? 1 : 0,
          boxShadow: '0 0 60px rgba(34,197,94,0.3)',
        }}>

        {/* Banner */}
        <div className="text-3xl font-black mb-1"
             style={{ color: '#22c55e', textShadow: '0 0 20px #22c55e88' }}>
          LEVEL COMPLETE
        </div>
        <div className="text-white/50 text-sm mb-6">{level.name}</div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Stat label="Attempts" value={String(attempts)} color="#3b82f6" />
          <Stat label="Stars" value={`${level.stars} ★`} color="#fbbf24" />
          <Stat label="Coins" value={`${coins}/${level.coinCount}`} color="#f59e0b" />
        </div>

        {/* Coins visual */}
        {level.coinCount > 0 && (
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: level.coinCount }, (_, i) => (
              <div key={i}
                   className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                   style={{
                     background: coinsCollected[i] ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                     color: coinsCollected[i] ? '#000' : 'rgba(255,255,255,0.3)',
                   }}>
                ●
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onMenu}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>
            Menu
          </button>
          <button
            onClick={onReplay}
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
            style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
            Replay
          </button>
          {onNext && (
            <button
              onClick={onNext}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: '#22c55e', color: '#000' }}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xl font-black" style={{ color }}>{value}</div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}
