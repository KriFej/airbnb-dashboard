// Level 3 — "Gravity Storm" — Hard
// Multi-mode: Cube, Wave, UFO, inverted gravity, faster speed

import type { Level, LevelObject } from '../types';
import { TILE, GROUND_Y, CEILING_Y } from '../constants';

let _id = 900;
function id() { return _id++; }
const T = TILE;
const GY = GROUND_Y;
const CY = CEILING_Y;

function block(col: number, wT: number, hT: number, fromTop = false): LevelObject {
  const y = fromTop ? CY + T : GY - T * hT;
  return { id: id(), type: 'block', x: col * T, y, w: T * wT, h: T * hT, solid: true };
}
function spike(col: number, down = false): LevelObject {
  const y = down ? CY : GY - T;
  const type = down ? 'spike_down' : 'spike';
  return { id: id(), type: type as LevelObject['type'], x: col * T, y, w: T, h: T, solid: false };
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
function saw(col: number, rowAbove: number): LevelObject {
  const d = T * 1.2;
  return { id: id(), type: 'saw', x: col * T - d * 0.1, y: GY - T * rowAbove - d, w: d, h: d, solid: false };
}
function ceilingBlocks(c1: number, c2: number): LevelObject[] {
  return Array.from({ length: c2 - c1 }, (_, i) => ({
    id: id(), type: 'block' as LevelObject['type'],
    x: (c1 + i) * T, y: CY, w: T, h: T, solid: true,
  }));
}

const objects: LevelObject[] = [
  // ── Cube fast intro (0-18) ───────────────────────────────
  spike(4), spike(5),
  block(7, 2, 1), spike(9),
  orb(11, 3), spike(12), spike(13),
  block(15, 1, 2), spike(16),
  spike(18), spike(19),

  // ── Wave portal + section (col 20-36) ───────────────────
  portal(20, 'portal_wave', 3),
  ...ceilingBlocks(20, 37),
  // Spikes forcing tight wave navigation
  spike(23), spike(24), spike(27, true),
  spike(28), spike(31, true), spike(32, true),
  saw(34, 2),
  coin(30, 5),

  // ── UFO portal (col 37) ──────────────────────────────────
  portal(37, 'portal_ufo', 3),
  ...ceilingBlocks(37, 52),
  // UFO obstacles
  spike(40), spike(41), spike(42, true),
  block(44, 1, 1), spike(45), spike(46, true),
  orb(48, 3, 'orb_pink'), spike(49, true),
  spike(51, true),

  // ── Gravity inversion (col 52) ───────────────────────────
  portal(52, 'portal_gravity', 3),
  portal(52, 'portal_cube', 3),
  ...ceilingBlocks(52, 66),
  // Inverted cube section
  spike(54), spike(55),
  block(57, 2, 1, true), spike(58, true), spike(59, true),
  orb(61, 5), spike(62), spike(63),

  coin(60, 7),

  // ── Reset gravity + speed fastest (col 66) ───────────────
  portal(66, 'portal_gravity', 3),
  portal(67, 'portal_speed_fastest', 3),

  // ── Final cube hell (col 68-90) ──────────────────────────
  spike(69), spike(70), spike(71),
  block(73, 3, 1), spike(74), spike(75),
  orb(76, 4), spike(77), spike(78),
  saw(79, 2),
  spike(81), spike(82), spike(83),
  block(85, 2, 3), spike(86), spike(87),
  orb(89, 5, 'orb_pink'),
  spike(90),

  coin(84, 6),

  // ── End ──────────────────────────────────────────────────
  { id: id(), type: 'end_trigger', x: 94 * T, y: 0, w: 4, h: 480, solid: false },
];

const level3: Level = {
  id: 'level_3',
  name: 'Gravity Storm',
  author: 'RhythmCore',
  difficulty: 'hard',
  stars: 6,
  coinCount: 3,
  musicId: 'polargeist',
  musicBpm: 175,
  musicOffset: 0,
  bgColorTop: '#020011',
  bgColorBot: '#130026',
  groundColor: '#0a0018',
  lineColor: '#4a1060',
  length: 96 * TILE,
  version: 1,
  startMode: 'cube',
  startGravity: 1,
  startSpeed: 12,
  objects,
  practiceCheckpoints: [20 * TILE, 37 * TILE, 52 * TILE, 66 * TILE],
};

export default level3;
