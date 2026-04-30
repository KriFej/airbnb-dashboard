import type { SaveData, Level } from '../types';

const SAVE_KEY = 'rhythm_game_save_v1';

const defaultSave: SaveData = {
  version: 1,
  completedLevels: [],
  starsPerLevel: {},
  coinsPerLevel: {},
  attemptsPerLevel: {},
  bestProgressPerLevel: {},
  customLevels: [],
  settings: {
    musicVolume: 0.7,
    sfxVolume: 0.8,
    showFps: false,
    practiceMode: false,
  },
};

export function loadSave(): SaveData {
  if (typeof window === 'undefined') return { ...defaultSave };
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultSave };
    return { ...defaultSave, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSave };
  }
}

export function writeSave(data: SaveData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function recordLevelComplete(
  save: SaveData,
  levelId: string,
  stars: number,
  coins: boolean[],
  attempts: number
): SaveData {
  const next = { ...save };
  if (!next.completedLevels.includes(levelId)) {
    next.completedLevels = [...next.completedLevels, levelId];
  }
  next.starsPerLevel = { ...next.starsPerLevel };
  next.starsPerLevel[levelId] = Math.max(
    next.starsPerLevel[levelId] ?? 0,
    stars
  );
  next.coinsPerLevel = { ...next.coinsPerLevel };
  const prev = next.coinsPerLevel[levelId] ?? [];
  next.coinsPerLevel[levelId] = coins.map((c, i) => c || (prev[i] ?? false));
  next.attemptsPerLevel = { ...next.attemptsPerLevel };
  next.attemptsPerLevel[levelId] = (next.attemptsPerLevel[levelId] ?? 0) + attempts;
  next.bestProgressPerLevel = { ...next.bestProgressPerLevel };
  next.bestProgressPerLevel[levelId] = 1;
  return next;
}

export function recordAttempt(
  save: SaveData,
  levelId: string,
  progress: number
): SaveData {
  const next = { ...save };
  next.bestProgressPerLevel = { ...next.bestProgressPerLevel };
  next.bestProgressPerLevel[levelId] = Math.max(
    next.bestProgressPerLevel[levelId] ?? 0,
    progress
  );
  return next;
}

export function saveCustomLevel(save: SaveData, level: Level): SaveData {
  const exists = save.customLevels.findIndex(l => l.id === level.id);
  const levels = [...save.customLevels];
  if (exists >= 0) {
    levels[exists] = level;
  } else {
    levels.push(level);
  }
  return { ...save, customLevels: levels };
}

export function deleteCustomLevel(save: SaveData, levelId: string): SaveData {
  return { ...save, customLevels: save.customLevels.filter(l => l.id !== levelId) };
}

export function exportLevel(level: Level): string {
  return JSON.stringify(level, null, 2);
}

export function importLevel(json: string): Level | null {
  try {
    const obj = JSON.parse(json);
    if (!obj.id || !obj.name || !Array.isArray(obj.objects)) return null;
    return obj as Level;
  } catch {
    return null;
  }
}
