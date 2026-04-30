'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BUILT_IN_LEVELS } from '@/lib/game/levels/levelRegistry';
import { loadSave, writeSave, recordLevelComplete, recordAttempt, saveCustomLevel } from '@/lib/game/persistence/saveSystem';
import type { Level, SaveData } from '@/lib/game/types';

// Dynamic imports — all canvas/audio code must be client-side only
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), { ssr: false });
const MainMenu = dynamic(() => import('@/components/game/MainMenu'), { ssr: false });
const LevelEditorUI = dynamic(() => import('@/components/game/LevelEditorUI'), { ssr: false });

type Screen = 'menu' | 'playing' | 'editor';

export default function GamePage() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [activeLevel, setActiveLevel] = useState<Level | null>(null);
  const [isPractice, setIsPractice] = useState(false);
  const [saveData, setSaveData] = useState<SaveData>(() => loadSave());
  const [editorLevel, setEditorLevel] = useState<Level | null>(null);
  const [deaths, setDeaths] = useState(0);
  const [allLevels, setAllLevels] = useState<Level[]>([...BUILT_IN_LEVELS]);

  // Persist save to localStorage on change
  useEffect(() => { writeSave(saveData); }, [saveData]);

  // Merge custom levels
  useEffect(() => {
    setAllLevels([...BUILT_IN_LEVELS, ...saveData.customLevels]);
  }, [saveData.customLevels]);

  const handlePlay = useCallback((level: Level, practice: boolean) => {
    setActiveLevel(level);
    setIsPractice(practice);
    setDeaths(0);
    setScreen('playing');
  }, []);

  const handleDeath = useCallback(() => {
    setDeaths(d => d + 1);
    if (activeLevel) {
      setSaveData(prev => {
        const next = recordAttempt(prev, activeLevel.id, 0);
        return next;
      });
    }
  }, [activeLevel]);

  const handleComplete = useCallback((progress: number) => {
    if (!activeLevel) return;
    setSaveData(prev =>
      recordLevelComplete(prev, activeLevel.id, activeLevel.stars, [], deaths)
    );
  }, [activeLevel, deaths]);

  const handleEditorSave = useCallback((level: Level) => {
    setSaveData(prev => saveCustomLevel(prev, level));
    setAllLevels(prev => {
      const idx = prev.findIndex(l => l.id === level.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = level;
        return next;
      }
      return [...prev, level];
    });
  }, []);

  const handleEditorTest = useCallback((level: Level) => {
    setActiveLevel(level);
    setIsPractice(true);
    setScreen('playing');
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      {screen === 'menu' && (
        <MainMenu
          levels={allLevels}
          save={saveData}
          onPlay={handlePlay}
          onEditor={() => setScreen('editor')}
        />
      )}

      {screen === 'playing' && activeLevel && (
        <GameCanvas
          key={`${activeLevel.id}-${isPractice}`}
          level={activeLevel}
          isPractice={isPractice}
          onDeath={handleDeath}
          onComplete={handleComplete}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'editor' && (
        <LevelEditorUI
          initialLevel={editorLevel ?? undefined}
          onBack={() => setScreen('menu')}
          onTest={handleEditorTest}
          onSave={handleEditorSave}
        />
      )}
    </div>
  );
}
