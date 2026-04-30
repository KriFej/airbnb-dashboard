// ─── Mode update functions ────────────────────────────────────────────────────
// Each mode receives: (player, input, dt) and mutates player state.
// Returns true if the player should die (wall-kill etc. handled externally).

import type { PlayerState } from '../types';
import type { InputManager } from '../engine/input';
import {
  GRAVITY, MAX_FALL, JUMP_VEL, MIN_JUMP_VEL,
  SHIP_ACCEL, SHIP_MAX_VY,
  UFO_JUMP_VEL, WAVE_SPEED,
  ROBOT_MAX_JUMP, ROBOT_CHARGE_FRAMES, SWING_ACCEL,
  GROUND_Y, CEILING_Y, PLAYER_H,
} from '../constants';

// ─── Helper: clamp ────────────────────────────────────────────────────────────
function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

// ─── CUBE ─────────────────────────────────────────────────────────────────────
// Standard jump when grounded (or on orb / pad).
export function updateCube(p: PlayerState, input: InputManager): void {
  if (p.gravDir === 1) {
    // Normal gravity
    if ((input.justPressed) && p.isGrounded) {
      p.vy = JUMP_VEL;
      p.isGrounded = false;
    }
    p.vy = Math.min(p.vy + GRAVITY, MAX_FALL);
  } else {
    // Inverted gravity
    if ((input.justPressed) && p.isCeilGrounded) {
      p.vy = -JUMP_VEL;    // upward flip
      p.isCeilGrounded = false;
    }
    p.vy = Math.max(p.vy - GRAVITY, -MAX_FALL);
  }
  // Rotation: continuous spin when airborne, snap to nearest 90° on land
  if (!p.isGrounded && !p.isCeilGrounded) {
    p.angle += 10 * p.gravDir;
  }
}

// ─── SHIP ────────────────────────────────────────────────────────────────────
// Hold to fly against gravity; release falls with gravity.
export function updateShip(p: PlayerState, input: InputManager): void {
  if (input.isHeld) {
    p.vy -= SHIP_ACCEL * p.gravDir;
  } else {
    p.vy += GRAVITY * p.gravDir;
  }
  p.vy = clamp(p.vy, -SHIP_MAX_VY, SHIP_MAX_VY);
  // Visual rotation: track velocity direction
  p.angle = clamp(p.vy * 3, -45, 45);
}

// ─── BALL ────────────────────────────────────────────────────────────────────
// Tap = flip gravity direction.
export function updateBall(p: PlayerState, input: InputManager): void {
  if (input.justPressed) {
    p.gravDir *= -1;
    p.vy = 0;
  }
  if (p.gravDir === 1) {
    p.vy = Math.min(p.vy + GRAVITY, MAX_FALL);
  } else {
    p.vy = Math.max(p.vy - GRAVITY, -MAX_FALL);
  }
  p.angle += 8 * p.gravDir;
}

// ─── UFO ─────────────────────────────────────────────────────────────────────
// Tap gives an upward impulse (can repeat in air).
export function updateUFO(p: PlayerState, input: InputManager): void {
  if (input.justPressed) {
    p.vy = UFO_JUMP_VEL * p.gravDir;
  }
  if (p.gravDir === 1) {
    p.vy = Math.min(p.vy + GRAVITY * 0.85, MAX_FALL);
  } else {
    p.vy = Math.max(p.vy - GRAVITY * 0.85, -MAX_FALL);
  }
  p.angle = clamp(p.vy * 2, -30, 30) * p.gravDir;
}

// ─── WAVE ────────────────────────────────────────────────────────────────────
// Hold = diagonal up, release = diagonal down. No gravity applied.
export function updateWave(p: PlayerState, input: InputManager): void {
  if (input.isHeld) {
    p.vy = -WAVE_SPEED * p.gravDir;
    p.angle = -45 * p.gravDir;
  } else {
    p.vy = WAVE_SPEED * p.gravDir;
    p.angle = 45 * p.gravDir;
  }
}

// ─── ROBOT ───────────────────────────────────────────────────────────────────
// Hold to charge jump height; release to jump. Only works when grounded.
export function updateRobot(p: PlayerState, input: InputManager): void {
  if (p.gravDir === 1) {
    if (input.isHeld && p.isGrounded) {
      p.robotChargeTime = Math.min(p.robotChargeTime + 1, ROBOT_CHARGE_FRAMES);
    }
    if (input.justReleased && p.isGrounded) {
      const t = p.robotChargeTime / ROBOT_CHARGE_FRAMES;
      p.vy = MIN_JUMP_VEL + (ROBOT_MAX_JUMP - MIN_JUMP_VEL) * t;
      p.robotChargeTime = 0;
      p.isGrounded = false;
    }
    p.vy = Math.min(p.vy + GRAVITY, MAX_FALL);
  } else {
    if (input.isHeld && p.isCeilGrounded) {
      p.robotChargeTime = Math.min(p.robotChargeTime + 1, ROBOT_CHARGE_FRAMES);
    }
    if (input.justReleased && p.isCeilGrounded) {
      const t = p.robotChargeTime / ROBOT_CHARGE_FRAMES;
      p.vy = -MIN_JUMP_VEL + (ROBOT_MAX_JUMP - MIN_JUMP_VEL) * t;
      p.robotChargeTime = 0;
      p.isCeilGrounded = false;
    }
    p.vy = Math.max(p.vy - GRAVITY, -MAX_FALL);
  }
  if (!p.isGrounded && !p.isCeilGrounded) {
    p.angle += 10 * p.gravDir;
  }
}

// ─── SPIDER ──────────────────────────────────────────────────────────────────
// Tap = teleport to opposite surface; gravity flips accordingly.
export function updateSpider(p: PlayerState, input: InputManager): void {
  const ph = p.isMini ? PLAYER_H * 0.275 : PLAYER_H / 2;
  if (input.justPressed) {
    if (p.gravDir === 1) {
      // Teleport to ceiling
      p.worldY = CEILING_Y + ph + 2;
      p.vy = 0;
      p.gravDir = -1;
      p.isCeilGrounded = true;
      p.isGrounded = false;
    } else {
      // Teleport to floor
      p.worldY = GROUND_Y - ph - 2;
      p.vy = 0;
      p.gravDir = 1;
      p.isGrounded = true;
      p.isCeilGrounded = false;
    }
  }
  if (p.gravDir === 1) {
    p.vy = Math.min(p.vy + GRAVITY, MAX_FALL);
  } else {
    p.vy = Math.max(p.vy - GRAVITY, -MAX_FALL);
  }
  p.angle += 6 * p.gravDir;
}

// ─── SWING ───────────────────────────────────────────────────────────────────
// Alternating thrust direction on each press.
export function updateSwing(p: PlayerState, input: InputManager): void {
  if (input.justPressed) {
    p.swingDir *= -1;
  }
  if (input.isHeld) {
    p.vy -= SWING_ACCEL * p.swingDir * p.gravDir;
  } else {
    p.vy += GRAVITY * p.gravDir;
  }
  p.vy = clamp(p.vy, -SHIP_MAX_VY, SHIP_MAX_VY);
  p.angle = clamp(p.vy * 3, -50, 50);
}

// ─── MODE DISPATCH ────────────────────────────────────────────────────────────
export function applyMode(p: PlayerState, input: InputManager): void {
  switch (p.mode) {
    case 'cube':    updateCube(p, input); break;
    case 'ship':    updateShip(p, input); break;
    case 'ball':    updateBall(p, input); break;
    case 'ufo':     updateUFO(p, input); break;
    case 'wave':    updateWave(p, input); break;
    case 'robot':   updateRobot(p, input); break;
    case 'spider':  updateSpider(p, input); break;
    case 'swing':   updateSwing(p, input); break;
    default:        updateCube(p, input); break;
  }
}

// ─── Snap rotation to nearest 90° (cube landing) ────────────────────────────
export function snapAngle(angle: number): number {
  return Math.round(angle / 90) * 90;
}

// ─── Apply orb effect ─────────────────────────────────────────────────────────
export function applyOrbEffect(
  p: PlayerState,
  orbType: string,
  pressed: boolean
): boolean {
  if (!pressed || p.orbCooldown > 0) return false;
  switch (orbType) {
    case 'orb_yellow': p.vy = JUMP_VEL * 1.1 * p.gravDir; break;
    case 'orb_blue':   p.gravDir *= -1; p.vy = JUMP_VEL * 0.8; break;
    case 'orb_pink':   p.vy = JUMP_VEL * 0.9 * p.gravDir; break;
    case 'orb_black':  p.gravDir *= -1; p.vy = GRAVITY; break;
    case 'orb_green':  p.vy = JUMP_VEL * p.gravDir; break;
    case 'orb_red':    p.vy = JUMP_VEL * 1.3 * p.gravDir; break;
    default: return false;
  }
  p.orbCooldown = 8;
  return true;
}

// ─── Apply pad effect (automatic, no press needed) ───────────────────────────
export function applyPadEffect(p: PlayerState, padType: string): void {
  switch (padType) {
    case 'pad_yellow': p.vy = JUMP_VEL * 1.1 * p.gravDir; break;
    case 'pad_pink':   p.vy = JUMP_VEL * 0.8 * p.gravDir; break;
    case 'pad_red':    p.vy = JUMP_VEL * 1.4 * p.gravDir; break;
  }
  p.isGrounded = false;
}
