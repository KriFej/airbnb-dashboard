// Level data integrity tests
import { describe, it, expect } from 'vitest';
import level1 from '../levels/level1';
import level2 from '../levels/level2';
import level3 from '../levels/level3';
import { BUILT_IN_LEVELS, getLevelById } from '../levels/levelRegistry';
import type { Level } from '../types';

function validateLevel(level: Level): string[] {
  const errors: string[] = [];

  if (!level.id) errors.push('Missing id');
  if (!level.name) errors.push('Missing name');
  if (!level.author) errors.push('Missing author');
  if (!level.objects || !Array.isArray(level.objects)) errors.push('Invalid objects array');
  if (level.length <= 0) errors.push('Invalid length');
  if (level.musicBpm <= 0) errors.push('Invalid BPM');
  if (!['cube','ship','ball','ufo','wave','robot','spider','swing','platformer'].includes(level.startMode)) {
    errors.push(`Invalid startMode: ${level.startMode}`);
  }
  if (level.startGravity !== 1 && level.startGravity !== -1) {
    errors.push(`Invalid startGravity: ${level.startGravity}`);
  }

  // Check for end trigger
  const hasEnd = level.objects.some(o => o.type === 'end_trigger');
  if (!hasEnd) errors.push('Missing end_trigger');

  // Check all objects have required fields
  for (const obj of level.objects) {
    if (typeof obj.id !== 'number') errors.push(`Object missing id: ${JSON.stringify(obj)}`);
    if (!obj.type) errors.push(`Object missing type: id=${obj.id}`);
    if (typeof obj.x !== 'number' || typeof obj.y !== 'number') {
      errors.push(`Object invalid position: id=${obj.id}`);
    }
    if (typeof obj.w !== 'number' || obj.w <= 0) {
      errors.push(`Object invalid width: id=${obj.id}`);
    }
    if (typeof obj.h !== 'number' || obj.h <= 0) {
      errors.push(`Object invalid height: id=${obj.id}`);
    }
  }

  // Check for duplicate IDs
  const ids = level.objects.map(o => o.id);
  const unique = new Set(ids);
  if (ids.length !== unique.size) errors.push('Duplicate object IDs');

  return errors;
}

describe('Level 1: Stereo Foundation', () => {
  it('passes validation', () => {
    const errors = validateLevel(level1);
    expect(errors).toEqual([]);
  });

  it('has correct metadata', () => {
    expect(level1.id).toBe('level_1');
    expect(level1.difficulty).toBe('easy');
    expect(level1.startMode).toBe('cube');
    expect(level1.coinCount).toBe(3);
  });

  it('has correct number of coins', () => {
    const coins = level1.objects.filter(o => o.type === 'coin');
    expect(coins.length).toBe(level1.coinCount);
  });

  it('length matches end trigger position', () => {
    const end = level1.objects.find(o => o.type === 'end_trigger');
    expect(end).toBeDefined();
    expect(end!.x).toBeLessThanOrEqual(level1.length + 40);
  });
});

describe('Level 2: Neon Rush', () => {
  it('passes validation', () => {
    const errors = validateLevel(level2);
    expect(errors).toEqual([]);
  });

  it('has mode portals', () => {
    const portals = level2.objects.filter(o => o.type.startsWith('portal_'));
    expect(portals.length).toBeGreaterThan(0);
  });

  it('has practice checkpoints', () => {
    expect(level2.practiceCheckpoints.length).toBeGreaterThan(0);
  });
});

describe('Level 3: Gravity Storm', () => {
  it('passes validation', () => {
    const errors = validateLevel(level3);
    expect(errors).toEqual([]);
  });

  it('has gravity portal', () => {
    const hasGravity = level3.objects.some(o => o.type === 'portal_gravity');
    expect(hasGravity).toBe(true);
  });

  it('is harder than level 1', () => {
    const difficultyOrder = ['easy', 'normal', 'hard', 'harder', 'insane'];
    expect(difficultyOrder.indexOf(level3.difficulty as string))
      .toBeGreaterThan(difficultyOrder.indexOf(level1.difficulty as string));
  });
});

describe('Level registry', () => {
  it('contains 3 built-in levels', () => {
    expect(BUILT_IN_LEVELS).toHaveLength(3);
  });

  it('getLevelById returns correct level', () => {
    expect(getLevelById('level_1')).toBe(level1);
    expect(getLevelById('level_2')).toBe(level2);
    expect(getLevelById('level_3')).toBe(level3);
    expect(getLevelById('nonexistent')).toBeNull();
  });

  it('all levels have unique IDs', () => {
    const ids = BUILT_IN_LEVELS.map(l => l.id);
    expect(new Set(ids).size).toBe(BUILT_IN_LEVELS.length);
  });
});
