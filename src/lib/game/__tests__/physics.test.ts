// Physics & game mode unit tests
// Run with: npx vitest src/lib/game/__tests__/physics.test.ts

import { describe, it, expect, vi } from 'vitest';
import { updateCube, updateShip, updateBall, updateWave, updateUFO, snapAngle, applyOrbEffect } from '../modes/index';
import type { PlayerState } from '../types';
import { JUMP_VEL, GRAVITY, SHIP_ACCEL, UFO_JUMP_VEL, WAVE_SPEED } from '../constants';

// ─── Mock InputManager ────────────────────────────────────────────────────────
function mockInput(held = false, justPressed = false, justReleased = false) {
  return {
    isHeld: held,
    justPressed,
    justReleased,
    flush: vi.fn(),
    reset: vi.fn(),
  } as unknown as import('../engine/input').InputManager;
}

function makePlayer(): PlayerState {
  return {
    worldX: 200, worldY: 385, vy: 0,
    mode: 'cube', gravDir: 1, speedPx: 9,
    isMini: false, isGrounded: true, isCeilGrounded: false,
    angle: 0, isDead: false, robotChargeTime: 0, orbCooldown: 0,
    swingDir: 1, prevX: 200,
  };
}

// ─── CUBE ────────────────────────────────────────────────────────────────────
describe('cube mode', () => {
  it('jumps when grounded and just-pressed', () => {
    const p = makePlayer();
    updateCube(p, mockInput(true, true));
    expect(p.vy).toBe(JUMP_VEL);
    expect(p.isGrounded).toBe(false);
  });

  it('does not jump when airborne', () => {
    const p = makePlayer();
    p.isGrounded = false;
    updateCube(p, mockInput(true, true));
    // Gravity only
    expect(p.vy).toBe(GRAVITY);  // no jump, gravity applied
  });

  it('applies gravity each frame', () => {
    const p = makePlayer();
    p.isGrounded = false;
    p.vy = 0;
    updateCube(p, mockInput());
    expect(p.vy).toBe(GRAVITY);
    updateCube(p, mockInput());
    expect(p.vy).toBeCloseTo(GRAVITY * 2, 5);
  });

  it('rotates when airborne', () => {
    const p = makePlayer();
    p.isGrounded = false;
    p.angle = 0;
    updateCube(p, mockInput());
    expect(p.angle).toBe(10);
  });

  it('does not rotate when grounded', () => {
    const p = makePlayer();
    p.angle = 0;
    updateCube(p, mockInput());
    expect(p.angle).toBe(0);
  });

  it('inverted gravity: jumps from ceiling', () => {
    const p = makePlayer();
    p.gravDir = -1;
    p.isGrounded = false;
    p.isCeilGrounded = true;
    updateCube(p, mockInput(true, true));
    expect(p.vy).toBe(-JUMP_VEL);
  });
});

// ─── SHIP ────────────────────────────────────────────────────────────────────
describe('ship mode', () => {
  it('decreases vy when holding (flies up)', () => {
    const p = makePlayer();
    p.mode = 'ship'; p.vy = 0;
    updateShip(p, mockInput(true));
    expect(p.vy).toBe(-SHIP_ACCEL);
  });

  it('increases vy when not holding (falls)', () => {
    const p = makePlayer();
    p.mode = 'ship'; p.vy = 0;
    updateShip(p, mockInput(false));
    expect(p.vy).toBe(GRAVITY);
  });

  it('clamps velocity to max', () => {
    const p = makePlayer();
    p.mode = 'ship'; p.vy = 100;
    updateShip(p, mockInput(false));
    expect(p.vy).toBeLessThanOrEqual(12);
  });
});

// ─── BALL ────────────────────────────────────────────────────────────────────
describe('ball mode', () => {
  it('flips gravity on just-press', () => {
    const p = makePlayer();
    p.mode = 'ball'; p.gravDir = 1;
    updateBall(p, mockInput(true, true));
    expect(p.gravDir).toBe(-1);
  });

  it('flips back on next press', () => {
    const p = makePlayer();
    p.mode = 'ball'; p.gravDir = 1;
    updateBall(p, mockInput(true, true));
    updateBall(p, mockInput(false, false));
    updateBall(p, mockInput(true, true));
    expect(p.gravDir).toBe(1);
  });

  it('resets vy on gravity flip', () => {
    const p = makePlayer();
    p.mode = 'ball'; p.vy = 10;
    updateBall(p, mockInput(true, true));
    expect(p.vy).toBe(0);
  });
});

// ─── UFO ─────────────────────────────────────────────────────────────────────
describe('ufo mode', () => {
  it('gives impulse on just-press even when airborne', () => {
    const p = makePlayer();
    p.mode = 'ufo'; p.isGrounded = false; p.vy = 5;
    updateUFO(p, mockInput(true, true));
    expect(p.vy).toBe(UFO_JUMP_VEL * 1);  // gravDir 1
  });

  it('applies gravity between presses', () => {
    const p = makePlayer();
    p.mode = 'ufo'; p.vy = 0;
    updateUFO(p, mockInput());
    expect(p.vy).toBeGreaterThan(0);
  });
});

// ─── WAVE ────────────────────────────────────────────────────────────────────
describe('wave mode', () => {
  it('goes diagonally up when held', () => {
    const p = makePlayer();
    p.mode = 'wave';
    updateWave(p, mockInput(true));
    expect(p.vy).toBe(-WAVE_SPEED);
    expect(p.angle).toBe(-45);
  });

  it('goes diagonally down when released', () => {
    const p = makePlayer();
    p.mode = 'wave';
    updateWave(p, mockInput(false));
    expect(p.vy).toBe(WAVE_SPEED);
    expect(p.angle).toBe(45);
  });

  it('inverted wave goes opposite directions', () => {
    const p = makePlayer();
    p.mode = 'wave'; p.gravDir = -1;
    updateWave(p, mockInput(true));
    expect(p.vy).toBe(WAVE_SPEED);
  });
});

// ─── snapAngle ───────────────────────────────────────────────────────────────
describe('snapAngle', () => {
  it('snaps 44 to 0', () => { expect(snapAngle(44)).toBe(0); });
  it('snaps 46 to 90', () => { expect(snapAngle(46)).toBe(90); });
  it('snaps 270 to 270', () => { expect(snapAngle(270)).toBe(270); });
  it('snaps 315 to 360', () => { expect(snapAngle(315)).toBe(360); });
  it('snaps -44 to 0', () => { expect(snapAngle(-44)).toBe(0); });
  it('snaps -46 to -90', () => { expect(snapAngle(-46)).toBe(-90); });
});

// ─── Orb effects ─────────────────────────────────────────────────────────────
describe('orb effects', () => {
  it('yellow orb boosts jump velocity', () => {
    const p = makePlayer();
    p.vy = 5; p.orbCooldown = 0;
    const activated = applyOrbEffect(p, 'orb_yellow', true);
    expect(activated).toBe(true);
    expect(p.vy).toBeLessThan(0); // upward
    expect(p.orbCooldown).toBe(8);
  });

  it('does not activate if cooldown active', () => {
    const p = makePlayer();
    p.orbCooldown = 5;
    const activated = applyOrbEffect(p, 'orb_yellow', true);
    expect(activated).toBe(false);
  });

  it('does not activate if not pressed', () => {
    const p = makePlayer();
    p.orbCooldown = 0;
    const activated = applyOrbEffect(p, 'orb_yellow', false);
    expect(activated).toBe(false);
  });

  it('blue orb flips gravity', () => {
    const p = makePlayer();
    const startGrav = p.gravDir;
    applyOrbEffect(p, 'orb_blue', true);
    expect(p.gravDir).toBe(-startGrav);
  });
});
