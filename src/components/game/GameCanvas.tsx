'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/game/engine/gameEngine';
import type { Level, GameStateData } from '@/lib/game/types';
import LevelComplete from './LevelComplete';

interface Props {
  level: Level;
  isPractice: boolean;
  onDeath: () => void;
  onComplete: (progress: number) => void;
  onBack: () => void;
}

export default function GameCanvas({ level, isPractice, onDeath, onComplete, onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameStateData | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const [attempts, setAttempts] = useState(1);

  const handleComplete = useCallback((progress: number) => {
    setShowComplete(true);
    onComplete(progress);
  }, [onComplete]);

  // Mount engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine();
    engineRef.current = engine;

    engine.mount(canvas, {
      onStateChange: setGameState,
      onDeath: () => {
        setAttempts(a => a + 1);
        onDeath();
      },
      onComplete: handleComplete,
    });

    engine.startLevel(level, isPractice);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [level, isPractice]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    });
    observer.observe(canvas);
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;

    return () => observer.disconnect();
  }, []);

  // Pause/escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onBack();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onBack]);

  const handleReplay = useCallback(() => {
    setShowComplete(false);
    setAttempts(1);
    engineRef.current?.startLevel(level, isPractice);
  }, [level, isPractice]);

  return (
    <div className="absolute inset-0 bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'none' }}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium z-10"
        style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
        ✕ ESC
      </button>

      {/* Practice checkpoint button */}
      {isPractice && (
        <button
          onClick={() => engineRef.current?.saveCheckpoint()}
          className="absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-bold z-10"
          style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' }}>
          ✦ Save Checkpoint
        </button>
      )}

      {/* Complete overlay */}
      {showComplete && gameState && (
        <LevelComplete
          level={level}
          attempts={attempts}
          coinsCollected={gameState.coinsCollected}
          onReplay={handleReplay}
          onMenu={onBack}
        />
      )}
    </div>
  );
}
