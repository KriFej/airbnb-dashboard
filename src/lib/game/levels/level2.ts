// Level 2 — "Neon Rush" — Normal
// Cube → Ship transition, speed change, orbs, more obstacles

import type { Level, LevelObject } from '../types';
import { TILE, GROUND_Y, CEILING_Y } from '../constants';

let _id = 500;
function id() { return _id++; }
const T = TILE;
const GY = GROUND_Y;

function block(col: number, wT: number, hT: number): LevelObject {
  return { id: id(), type: 'block', x: col * T, y: GY - T * hT, w: T * wT, h: T * hT, solid: true };
}
function spike(col: number): LevelObject {
  return { id: id(), type: 'spike', x: col * T, y: GY - T, w: T, h: T, solid: false };
}
function spikeDown(col: number): LevelObject {
  return { id: id(), type: 'spike_down', x: col * T, y: CEILING_Y, w: T, h: T, solid: false };
}
function orb(col: number, rowAbove: number, type = 'orb_yellow'): LevelObject {
  const d = T * 0.8;
  return { id: id(), type: type as LevelObject['type'], x: col * T + T * 0.1, y: GY - T * rowAbove - d, w: d, h: d, solid: false };
}
function portal(col: number, type: LevelObject['type'], hT = 3): LevelObject {
  return { id: id(), type, x: col * T, y: GY - T * hT, w: T * 0.8, h: T * hT, solid: false };
}
function coin(col: number, rowAbove: number): LevelObject {
  const d = T * 0.7;
  return { id: id(), type: 'coin', x: col * T + T * 0.15, y: GY - T * rowAbove - d, w: d, h: d, solid: false };
}

const objects: LevelObject[] = [
  // ── Cube intro (col 0-20) ────────────────────────────────
  spike(5), spike(6),
  block(8, 2, 1),
  spike(10), spike(11),
  orb(12, 3), spike(13),
  block(15, 1, 2), spike(16),
  orb(18, 4), spike(19), spike(20),

  // ── Ship portal transition ──────────────────────── col 22
  portal(22, 'portal_ship', 3),
  // ceiling for ship section
  ...((): LevelObject[] => {
    const blocks: LevelObject[] = [];
    for (let c = 22; c <= 40; c++) {
      blocks.push({ id: id(), type: 'block', x: c * T, y: CEILING_Y, w: T, h: T, solid: true });
    }
    return blocks;
  })(),

  // ── Ship section (col 22-40) ─────────────────────────────
  block(26, 4, 1),    // platform obstacle
  spike(27), spike(28),
  { id: id(), type: 'block', x: 31 * T, y: GY - T * 2, w: T, h: GY - CEILING_Y - T, solid: true }, // wall
  { id: id(), type: 'block', x: 35 * T, y: CEILING_Y + T, w: T * 4, h: T, solid: true }, // ceiling obstacle

  coin(32, 4),

  // ── Back to cube ──────────────────────────────── col 42
  portal(42, 'portal_cube', 3),

  // ── Speed up ───────────────────────────────────── col 44
  portal(44, 'portal_speed_fast', 3),

  // ── Fast cube section (col 44-62) ───────────────────────
  spike(46), spike(47),
  block(49, 3, 1),
  spike(50), spike(51),
  orb(53, 3), spike(54),
  block(56, 1, 3), spike(57),
  orb(58, 5), spike(59), spike(60),
  spike(62),

  // ── Coin 2 ────────────────────────────────────────────────
  coin(55, 5),

  // ── Ball portal ────────────────────────────────── col 64
  portal(64, 'portal_ball', 3),

  // ── Ball section (col 64-80) ────────────────────────────
  ...((): LevelObject[] => {
    const walls: LevelObject[] = [];
    for (let c = 64; c <= 80; c++) {
      walls.push({ id: id(), type: 'block', x: c * T, y: CEILING_Y, w: T, h: T, solid: true });
    }
    return walls;
  })(),
  spike(66), spikeDown(67),
  spike(70), spikeDown(71),
  spike(74), spikeDown(75),
  orb(68, 3, 'orb_blue'),
  orb(72, 3, 'orb_blue'),
  orb(76, 3, 'orb_blue'),

  // ── Coin 3 ───────────────────────────────────────────────
  coin(73, 5),

  // ── Back to cube normal speed ──────────────────── col 82
  portal(82, 'portal_cube', 3),
  portal(83, 'portal_speed_normal', 3),

  // ── Final stretch (col 83-98) ───────────────────────────
  spike(85), spike(86),
  orb(88, 4),
  spike(89), spike(90), spike(91),
  block(93, 2, 2),
  spike(94), spike(95),

  // ── End ────────────────────────────────────────────────── col 100
  { id: id(), type: 'end_trigger', x: 100 * T, y: 0, w: 4, h: 480, solid: false },
];

const level2: Level = {
  id: 'level_2',
  name: 'Neon Rush',
  author: 'RhythmCore',
  difficulty: 'normal',
  stars: 4,
  coinCount: 3,
  musicId: 'base_after_base',
  musicBpm: 155,
  musicOffset: 0,
  bgColorTop: '#050514',
  bgColorBot: '#0d1b3e',
  groundColor: '#071429',
  lineColor: '#1a4a7a',
  length: 102 * TILE,
  version: 1,
  startMode: 'cube',
  startGravity: 1,
  startSpeed: 9,
  objects,
  practiceCheckpoints: [22 * TILE, 44 * TILE, 64 * TILE, 82 * TILE],
};

export default level2;
