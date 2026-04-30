// Fluent builder for creating level objects programmatically
import type { LevelObject, ObjectType } from '../types';
import { TILE, GROUND_Y } from '../constants';

let _id = 1;

function makeId() { return _id++; }

// ─── Coordinate helpers ──────────────────────────────────────────────────────
// Most helpers accept grid coordinates (multiples of TILE from level start)

function gx(col: number) { return col * TILE; }
function gy(row: number) { return row * TILE; }

// Y from GROUND: row 0 = on ground surface (top of block at ground level)
// row 1 = one tile above ground, etc.
function groundRow(row: number, h = TILE) {
  return GROUND_Y - h - row * TILE;
}

// ─── Block helpers ────────────────────────────────────────────────────────────

export function block(
  col: number, row: number,
  wTiles = 1, hTiles = 1,
  fromGround = false,
  color?: string
): LevelObject {
  const w = wTiles * TILE; const h = hTiles * TILE;
  const y = fromGround ? groundRow(row, h) : gy(row);
  return { id: makeId(), type: 'block', x: gx(col), y, w, h, color, solid: true };
}

export function halfBlock(col: number, row: number, fromGround = false): LevelObject {
  const h = TILE / 2;
  const y = fromGround ? groundRow(row, h) : gy(row) + TILE / 2;
  return { id: makeId(), type: 'block_half', x: gx(col), y, w: TILE, h, solid: true };
}

export function slopeUL(col: number, row: number, fromGround = false): LevelObject {
  const h = TILE;
  const y = fromGround ? groundRow(row, h) : gy(row);
  return { id: makeId(), type: 'block_slope_ul', x: gx(col), y, w: TILE, h, solid: true };
}

export function slopeUR(col: number, row: number, fromGround = false): LevelObject {
  const h = TILE;
  const y = fromGround ? groundRow(row, h) : gy(row);
  return { id: makeId(), type: 'block_slope_ur', x: gx(col), y, w: TILE, h, solid: true };
}

// ─── Spike helpers ────────────────────────────────────────────────────────────

export function spike(col: number, fromGround = true, count = 1): LevelObject[] {
  return Array.from({ length: count }, (_, i) => ({
    id: makeId(), type: 'spike' as ObjectType,
    x: gx(col + i),
    y: fromGround ? GROUND_Y - TILE : CEILING_Y,
    w: TILE, h: TILE, solid: false,
  }));
}

import { CEILING_Y } from '../constants';

export function spikeDown(col: number, count = 1): LevelObject[] {
  return Array.from({ length: count }, (_, i) => ({
    id: makeId(), type: 'spike_down' as ObjectType,
    x: gx(col + i),
    y: CEILING_Y,
    w: TILE, h: TILE, solid: false,
  }));
}

export function spikeOnBlock(col: number, blockTopY: number): LevelObject {
  return {
    id: makeId(), type: 'spike',
    x: gx(col), y: blockTopY - TILE,
    w: TILE, h: TILE, solid: false,
  };
}

// ─── Orbs & Pads ─────────────────────────────────────────────────────────────

export function orb(col: number, row: number, type: ObjectType = 'orb_yellow', fromGround = false): LevelObject {
  const d = TILE * 0.8; const off = (TILE - d) / 2;
  const y = fromGround ? groundRow(row, d) - TILE * 0.3 : gy(row) + off;
  return { id: makeId(), type, x: gx(col) + off, y, w: d, h: d, solid: false };
}

export function pad(col: number, type: ObjectType = 'pad_yellow'): LevelObject {
  return {
    id: makeId(), type,
    x: gx(col), y: GROUND_Y - TILE * 0.3,
    w: TILE, h: TILE * 0.3, solid: false,
  };
}

// ─── Portals ──────────────────────────────────────────────────────────────────

export function portal(col: number, type: ObjectType, hTiles = 3): LevelObject {
  const h = hTiles * TILE;
  return {
    id: makeId(), type,
    x: gx(col),
    y: GROUND_Y - h,
    w: TILE * 0.8, h, solid: false,
  };
}

// ─── Collectibles ────────────────────────────────────────────────────────────

export function coin(col: number, row: number, fromGround = false): LevelObject {
  const d = TILE * 0.7; const off = (TILE - d) / 2;
  const y = fromGround ? groundRow(row, d) - TILE * 0.2 : gy(row) + off;
  return { id: makeId(), type: 'coin', x: gx(col) + off, y, w: d, h: d, solid: false };
}

export function checkpoint(col: number): LevelObject {
  return {
    id: makeId(), type: 'checkpoint',
    x: gx(col), y: GROUND_Y - TILE * 3,
    w: TILE * 0.4, h: TILE * 3, solid: false,
  };
}

export function endTrigger(col: number): LevelObject {
  return {
    id: makeId(), type: 'end_trigger',
    x: gx(col), y: 0,
    w: 4, h: 480, solid: false,
  };
}

// ─── Saw ──────────────────────────────────────────────────────────────────────

export function saw(col: number, row: number, fromGround = false): LevelObject {
  const d = TILE * 1.2;
  const y = fromGround ? groundRow(row, d) : gy(row);
  return { id: makeId(), type: 'saw', x: gx(col) - d * 0.1, y, w: d, h: d, solid: false };
}
