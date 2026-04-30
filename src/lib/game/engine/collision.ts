import type { PlayerState, LevelObject, Rect } from '../types';
import { PLAYER_W, PLAYER_H, HIT_MARGIN } from '../constants';

export type CollisionFace = 'top' | 'bottom' | 'left' | 'right';

export interface CollisionResult {
  face: CollisionFace;
  depth: number;
  obj: LevelObject;
}

// ─── Player hitbox ────────────────────────────────────────────────────────────
export function playerRect(p: PlayerState): Rect {
  const scale = p.isMini ? 0.55 : 1;
  const w = PLAYER_W * scale - HIT_MARGIN * 2;
  const h = PLAYER_H * scale - HIT_MARGIN * 2;
  return {
    x: p.worldX - w / 2,
    y: p.worldY - h / 2,
    w,
    h,
  };
}

// ─── AABB overlap test ────────────────────────────────────────────────────────
export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// ─── Broad-phase filter: only objects in camera view ─────────────────────────
export function filterVisible(
  objects: LevelObject[],
  cameraX: number,
  padding = 80
): LevelObject[] {
  const left = cameraX - padding;
  const right = cameraX + 800 + padding;
  return objects.filter(o => o.x + o.w >= left && o.x <= right);
}

// ─── Hazard check (instant death on overlap) ─────────────────────────────────
const HAZARD_TYPES = new Set([
  'spike', 'spike_down', 'spike_left', 'spike_right', 'saw',
]);

export function isHazard(obj: LevelObject): boolean {
  return HAZARD_TYPES.has(obj.type);
}

// ─── Solid block check ───────────────────────────────────────────────────────
const SOLID_TYPES = new Set([
  'block', 'block_half',
  'block_slope_ul', 'block_slope_ur',
]);

export function isSolid(obj: LevelObject): boolean {
  if (obj.solid !== undefined) return obj.solid;
  return SOLID_TYPES.has(obj.type);
}

// ─── Orb check ────────────────────────────────────────────────────────────────
const ORB_TYPES = new Set([
  'orb_yellow', 'orb_blue', 'orb_pink', 'orb_black', 'orb_green', 'orb_red',
]);
export function isOrb(obj: LevelObject): boolean { return ORB_TYPES.has(obj.type); }

// ─── Pad check ────────────────────────────────────────────────────────────────
const PAD_TYPES = new Set(['pad_yellow', 'pad_pink', 'pad_red']);
export function isPad(obj: LevelObject): boolean { return PAD_TYPES.has(obj.type); }

// ─── Portal check ─────────────────────────────────────────────────────────────
export function isPortal(obj: LevelObject): boolean {
  return obj.type.startsWith('portal_');
}

// ─── Single solid collision test ─────────────────────────────────────────────
// Returns the minimum-penetration-axis resolution for one solid object.
export function solidCollision(
  pr: Rect,
  obj: LevelObject
): CollisionResult | null {
  if (!rectsOverlap(pr, { x: obj.x, y: obj.y, w: obj.w, h: obj.h })) return null;

  const overlapRight  = pr.x + pr.w - obj.x;          // player right → obj left
  const overlapLeft   = obj.x + obj.w - pr.x;          // obj right → player left
  const overlapBottom = pr.y + pr.h - obj.y;           // player bottom → obj top
  const overlapTop    = obj.y + obj.h - pr.y;          // obj bottom → player top

  const minX = Math.min(overlapRight, overlapLeft);
  const minY = Math.min(overlapBottom, overlapTop);

  if (minY <= minX) {
    if (overlapBottom <= overlapTop) {
      return { face: 'top', depth: overlapBottom, obj };
    } else {
      return { face: 'bottom', depth: overlapTop, obj };
    }
  } else {
    if (overlapRight <= overlapLeft) {
      return { face: 'left', depth: overlapRight, obj };
    } else {
      return { face: 'right', depth: overlapLeft, obj };
    }
  }
}

// ─── Portal crossing: did player's X cross the portal midline this frame? ────
export function crossedPortal(
  p: PlayerState,
  obj: LevelObject
): boolean {
  const portalMid = obj.x + obj.w / 2;
  return (
    p.prevX <= portalMid &&
    p.worldX > portalMid &&
    p.worldY + PLAYER_H / 2 > obj.y &&
    p.worldY - PLAYER_H / 2 < obj.y + obj.h
  );
}
