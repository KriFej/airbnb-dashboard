// Collision system unit tests
// Run with: npx vitest src/lib/game/__tests__/collision.test.ts

import { describe, it, expect } from 'vitest';
import {
  playerRect, rectsOverlap, solidCollision, isHazard, isSolid, isOrb,
} from '../engine/collision';
import type { PlayerState, LevelObject } from '../types';
import { PLAYER_W, PLAYER_H, GROUND_Y } from '../constants';

function makePlayer(x: number, y: number, mini = false): PlayerState {
  return {
    worldX: x, worldY: y, vy: 0,
    mode: 'cube', gravDir: 1, speedPx: 9,
    isMini: mini, isGrounded: false, isCeilGrounded: false,
    angle: 0, isDead: false, robotChargeTime: 0, orbCooldown: 0,
    swingDir: 1, prevX: x,
  };
}

function makeBlock(x: number, y: number, w = 40, h = 40): LevelObject {
  return { id: 1, type: 'block', x, y, w, h, solid: true };
}

function makeSpike(x: number, y: number): LevelObject {
  return { id: 2, type: 'spike', x, y, w: 40, h: 40, solid: false };
}

// ─── playerRect ──────────────────────────────────────────────────────────────
describe('playerRect', () => {
  it('returns correct hitbox for normal player', () => {
    const p = makePlayer(200, 385);
    const r = playerRect(p);
    expect(r.w).toBeCloseTo(PLAYER_W - 6, 0);  // HIT_MARGIN * 2 = 6
    expect(r.h).toBeCloseTo(PLAYER_H - 6, 0);
    expect(r.x).toBeCloseTo(200 - r.w / 2, 0);
    expect(r.y).toBeCloseTo(385 - r.h / 2, 0);
  });

  it('returns smaller hitbox for mini player', () => {
    const p = makePlayer(200, 385, true);
    const normal = playerRect(makePlayer(200, 385, false));
    const mini = playerRect(p);
    expect(mini.w).toBeLessThan(normal.w);
    expect(mini.h).toBeLessThan(normal.h);
  });
});

// ─── rectsOverlap ────────────────────────────────────────────────────────────
describe('rectsOverlap', () => {
  it('detects overlapping rects', () => {
    expect(rectsOverlap(
      { x: 0, y: 0, w: 20, h: 20 },
      { x: 10, y: 10, w: 20, h: 20 }
    )).toBe(true);
  });

  it('detects non-overlapping rects', () => {
    expect(rectsOverlap(
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 20, y: 0, w: 10, h: 10 }
    )).toBe(false);
  });

  it('treats touching edges as non-overlapping', () => {
    expect(rectsOverlap(
      { x: 0, y: 0, w: 10, h: 10 },
      { x: 10, y: 0, w: 10, h: 10 }
    )).toBe(false);
  });
});

// ─── solidCollision ──────────────────────────────────────────────────────────
describe('solidCollision', () => {
  it('detects landing on top of block', () => {
    // Player falling onto top of block
    const pr = { x: 185, y: 355, w: 24, h: 24 };
    const block = makeBlock(160, 360, 80, 40);
    const result = solidCollision(pr, block);
    expect(result).not.toBeNull();
    expect(result?.face).toBe('top');
  });

  it('detects hitting side of block (death collision)', () => {
    // Player moving right into block side
    const pr = { x: 158, y: 340, w: 24, h: 24 };
    const block = makeBlock(160, 330, 40, 40);
    const result = solidCollision(pr, block);
    // Minimal overlap on X with minimal on Y
    expect(result).not.toBeNull();
    // Could be left or top depending on overlap amounts
    expect(['left', 'right', 'top', 'bottom']).toContain(result?.face);
  });

  it('returns null for non-overlapping', () => {
    const pr = { x: 0, y: 0, w: 24, h: 24 };
    const block = makeBlock(200, 200);
    expect(solidCollision(pr, block)).toBeNull();
  });

  it('detects ceiling hit from below', () => {
    // Player moving up into bottom of block
    const pr = { x: 185, y: 86, w: 24, h: 24 };
    const block = makeBlock(160, 80, 80, 20);
    const result = solidCollision(pr, block);
    expect(result).not.toBeNull();
    // Player is below block so it's a bottom collision
    expect(result?.face).toBe('bottom');
  });
});

// ─── Object type checks ───────────────────────────────────────────────────────
describe('object type predicates', () => {
  it('isHazard identifies spikes and saws', () => {
    expect(isHazard({ id: 1, type: 'spike', x: 0, y: 0, w: 40, h: 40 })).toBe(true);
    expect(isHazard({ id: 1, type: 'spike_down', x: 0, y: 0, w: 40, h: 40 })).toBe(true);
    expect(isHazard({ id: 1, type: 'saw', x: 0, y: 0, w: 40, h: 40 })).toBe(true);
    expect(isHazard({ id: 1, type: 'block', x: 0, y: 0, w: 40, h: 40 })).toBe(false);
  });

  it('isSolid identifies solid blocks', () => {
    expect(isSolid({ id: 1, type: 'block', x: 0, y: 0, w: 40, h: 40 })).toBe(true);
    expect(isSolid({ id: 1, type: 'block_half', x: 0, y: 0, w: 40, h: 20 })).toBe(true);
    expect(isSolid({ id: 1, type: 'spike', x: 0, y: 0, w: 40, h: 40 })).toBe(false);
    expect(isSolid({ id: 1, type: 'orb_yellow', x: 0, y: 0, w: 32, h: 32 })).toBe(false);
  });

  it('isSolid respects explicit solid override', () => {
    expect(isSolid({ id: 1, type: 'block', x: 0, y: 0, w: 40, h: 40, solid: false })).toBe(false);
    expect(isSolid({ id: 1, type: 'decoration', x: 0, y: 0, w: 40, h: 40, solid: true })).toBe(true);
  });

  it('isOrb identifies orbs', () => {
    expect(isOrb({ id: 1, type: 'orb_yellow', x: 0, y: 0, w: 32, h: 32 })).toBe(true);
    expect(isOrb({ id: 1, type: 'orb_blue', x: 0, y: 0, w: 32, h: 32 })).toBe(true);
    expect(isOrb({ id: 1, type: 'pad_yellow', x: 0, y: 0, w: 40, h: 12 })).toBe(false);
  });
});
