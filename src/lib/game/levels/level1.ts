// Level 1 — "Stereo Foundation" — Easy
// Cube-only, BPM 140, introduces basic jumping and orbs

import type { Level, LevelObject } from '../types';
import { TILE, GROUND_Y, CEILING_Y } from '../constants';

let _id = 100;
function id() { return _id++; }

const T = TILE;
const GY = GROUND_Y;    // 400

// Helper: pixel column from tile x
function px(col: number) { return col * T; }
// Block on ground surface: y = GY - T (one tile tall)
function blockGround(col: number, wT = 1, hT = 1): LevelObject {
  return {
    id: id(), type: 'block',
    x: px(col), y: GY - T * hT,
    w: T * wT, h: T * hT, solid: true,
  };
}
function spike(col: number): LevelObject {
  return {
    id: id(), type: 'spike',
    x: px(col), y: GY - T,
    w: T, h: T, solid: false,
  };
}
function spikeRow(col: number, count: number): LevelObject[] {
  return Array.from({ length: count }, (_, i) => spike(col + i));
}
function yellowOrb(col: number, rowAboveGround: number): LevelObject {
  const d = T * 0.8;
  return {
    id: id(), type: 'orb_yellow',
    x: px(col) + T * 0.1,
    y: GY - T * rowAboveGround - d,
    w: d, h: d, solid: false,
  };
}
function coin3d(col: number, rowAboveGround: number): LevelObject {
  const d = T * 0.7;
  return {
    id: id(), type: 'coin',
    x: px(col) + T * 0.15,
    y: GY - T * rowAboveGround - d,
    w: d, h: d, solid: false,
  };
}

const objects: LevelObject[] = [
  // ── intro gap ──────────────────────────────────────── cols 0-9 (free run)
  spike(6),
  spike(10),
  spike(12),

  // ── first platform section ─────────────────────────── cols 14-22
  blockGround(14, 2, 1),
  spike(17),
  blockGround(19, 3, 1),
  yellowOrb(20, 2),
  spike(22),
  spike(23),

  // ── staircase up ──────────────────────────────────── cols 26-34
  { id: id(), type: 'block', x: px(26), y: GY - T * 2, w: T, h: T * 2, solid: true },
  { id: id(), type: 'block', x: px(27), y: GY - T * 3, w: T, h: T * 3, solid: true },
  spike(28),
  { id: id(), type: 'block', x: px(29), y: GY - T * 2, w: T * 2, h: T * 2, solid: true },
  spike(31),
  spike(32),

  // ── orb sequence ──────────────────────────────────── cols 35-43
  yellowOrb(36, 3),
  spike(37),
  spike(38),
  yellowOrb(40, 4),
  spike(41),
  spike(42),
  coin3d(39, 5),

  // ── dense spikes with platform ────────────────────── cols 45-55
  blockGround(45, 4, 1),
  ...spikeRow(46, 3),
  yellowOrb(48, 2),
  spike(50),
  blockGround(52, 1, 2),
  spike(53),
  spike(54),

  // ── mid level coin reward ─────────────────────────────
  coin3d(50, 4),

  // ── double jump section ───────────────────────────── cols 57-65
  yellowOrb(58, 3),
  spike(59),
  yellowOrb(62, 5),
  spike(63),
  spike(64),

  // ── block maze ────────────────────────────────────── cols 67-78
  { id: id(), type: 'block', x: px(67), y: GY - T * 2, w: T * 2, h: T * 2, solid: true },
  spike(69),
  { id: id(), type: 'block', x: px(71), y: GY - T * 3, w: T, h: T * 3, solid: true },
  spike(72),
  { id: id(), type: 'block', x: px(74), y: GY - T * 2, w: T * 3, h: T, solid: true },
  spike(75),
  spike(76),
  yellowOrb(77, 3),

  // ── speed pick up (visual only for level 1) ───────── col 80
  { id: id(), type: 'portal_speed_fast', x: px(80), y: GY - T * 3, w: T * 0.8, h: T * 3, solid: false },

  // ── final challenge ───────────────────────────────── cols 82-94
  spike(82),
  spike(83),
  { id: id(), type: 'block', x: px(85), y: GY - T * 2, w: T * 2, h: T * 2, solid: true },
  spike(87),
  yellowOrb(88, 4),
  spike(89),
  spike(90),
  yellowOrb(92, 3),
  spike(93),
  spike(94),

  // ── final coin ────────────────────────────────────────
  coin3d(91, 6),

  // ── end trigger ──────────────────────────────────────
  { id: id(), type: 'end_trigger', x: px(98), y: 0, w: 4, h: 480, solid: false },
];

const level1: Level = {
  id: 'level_1',
  name: 'Stereo Foundation',
  author: 'RhythmCore',
  difficulty: 'easy',
  stars: 2,
  coinCount: 3,
  musicId: 'stereo_madness',
  musicBpm: 140,
  musicOffset: 0,
  bgColorTop: '#0d0d2a',
  bgColorBot: '#1a1a4e',
  groundColor: '#0a1628',
  lineColor: '#1e4080',
  length: px(100),
  version: 1,
  startMode: 'cube',
  startGravity: 1,
  startSpeed: 9,
  objects,
  practiceCheckpoints: [px(25), px(50), px(75)],
};

export default level1;
