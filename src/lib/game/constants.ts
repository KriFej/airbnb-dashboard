// ─── Viewport & Grid ──────────────────────────────────────────────────────────
export const TILE = 40;
export const VIEW_W = 800;
export const VIEW_H = 480;
export const GROUND_H = 80;          // pixel height of the ground area
export const GROUND_Y = VIEW_H - GROUND_H; // world Y where ground surface starts (400)
export const CEILING_Y = GROUND_H;   // world Y where ceiling surface ends (80)
export const PLAYER_SCREEN_X = 200;  // fixed screen X of player

// ─── Timing ──────────────────────────────────────────────────────────────────
export const FPS = 60;
export const DT = 1 / FPS;           // seconds per frame

// ─── Player dimensions ───────────────────────────────────────────────────────
export const PLAYER_W = 30;
export const PLAYER_H = 30;
export const HIT_MARGIN = 3;         // inward hitbox shrink (forgiveness pixels)

// ─── Physics ─────────────────────────────────────────────────────────────────
export const GRAVITY = 0.85;         // px/frame²  (applied each fixed step)
export const MAX_FALL = 18;          // max vertical speed (px/frame)
export const JUMP_VEL = -14;         // initial vy on cube jump (px/frame)
export const MIN_JUMP_VEL = -8;      // minimum robot jump

// ─── Mode-specific physics ────────────────────────────────────────────────────
export const SHIP_ACCEL = 0.65;      // px/frame² thrust (against gravity)
export const SHIP_MAX_VY = 12;
export const UFO_JUMP_VEL = -10;     // impulse (always available in air)
export const WAVE_SPEED = 8;         // diagonal speed (px/frame)
export const ROBOT_MAX_JUMP = -16;   // full-charge robot jump
export const ROBOT_CHARGE_FRAMES = 25; // frames to reach max charge
export const SWING_ACCEL = 1.0;

// ─── Speed multipliers (world units per frame) ────────────────────────────────
export const SPEED_TABLE = {
  slow: 5.5,
  half: 7,
  normal: 9,
  fast: 12,
  faster: 16,
  fastest: 20,
} as const;

// ─── Colour palette ──────────────────────────────────────────────────────────
export const C = {
  BG_TOP: '#0d0d1a',
  BG_BOT: '#1a1a3e',
  GROUND: '#0a1628',
  GROUND_LINE: '#1e3a5f',
  BLOCK: '#1e3a5f',
  BLOCK_EDGE: '#2a5080',
  SPIKE: '#ff3355',
  SAW: '#ff6600',
  PLAYER_FILL: '#22c55e',
  PLAYER_EDGE: '#16a34a',
  ORB_YELLOW: '#fbbf24',
  ORB_BLUE: '#3b82f6',
  ORB_PINK: '#ec4899',
  ORB_BLACK: '#1f1f2e',
  ORB_GREEN: '#22c55e',
  ORB_RED: '#ef4444',
  PAD_YELLOW: '#f59e0b',
  PAD_PINK: '#ec4899',
  PAD_RED: '#ef4444',
  PORTAL: '#7c3aed',
  COIN: '#f59e0b',
  CHECKPOINT: '#06b6d4',
  PROGRESS_BG: 'rgba(0,0,0,0.4)',
  PROGRESS_FG: '#22c55e',
  STAR: '#fbbf24',
  UI_TEXT: '#ffffff',
  UI_DIM: 'rgba(255,255,255,0.6)',
} as const;
