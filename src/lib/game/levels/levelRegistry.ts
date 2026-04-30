import type { Level } from '../types';
import level1 from './level1';
import level2 from './level2';
import level3 from './level3';

export const BUILT_IN_LEVELS: Level[] = [level1, level2, level3];

export function getLevelById(id: string): Level | null {
  return BUILT_IN_LEVELS.find(l => l.id === id) ?? null;
}
