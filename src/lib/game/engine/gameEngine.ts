// ─── Main Game Engine ─────────────────────────────────────────────────────────
// Fixed-step physics loop (60 Hz), fixed-camera render pass.

import type { PlayerState, Level, LevelObject, GameStateData, PlayerSnapshot } from '../types';
import { InputManager } from './input';
import { AudioManager } from '../audio/audioManager';
import { ParticleSystem } from '../renderer/particleSystem';
import {
  playerRect, solidCollision, filterVisible,
  isHazard, isSolid, isOrb, isPad, isPortal, crossedPortal,
} from './collision';
import { applyMode, applyOrbEffect, applyPadEffect, snapAngle } from '../modes/index';
import {
  renderLevel, renderProgressBar,
} from '../renderer/renderer';
import {
  VIEW_W, VIEW_H, DT, PLAYER_SCREEN_X,
  GROUND_Y, CEILING_Y, PLAYER_H, PLAYER_W,
  SPEED_TABLE,
} from '../constants';

// ─── Initial player ───────────────────────────────────────────────────────────
function makePlayer(level: Level): PlayerState {
  const ph = PLAYER_H / 2;
  return {
    worldX: PLAYER_SCREEN_X,
    worldY: GROUND_Y - ph,
    vy: 0,
    mode: level.startMode,
    gravDir: level.startGravity,
    speedPx: level.startSpeed,
    isMini: false,
    isGrounded: true,
    isCeilGrounded: false,
    angle: 0,
    isDead: false,
    robotChargeTime: 0,
    orbCooldown: 0,
    swingDir: 1,
    prevX: PLAYER_SCREEN_X,
  };
}

// ─── Snapshot / restore ───────────────────────────────────────────────────────
function snapshot(p: PlayerState): PlayerSnapshot {
  return {
    worldX: p.worldX,
    worldY: p.worldY,
    vy: p.vy,
    mode: p.mode,
    gravDir: p.gravDir,
    speedMult: p.speedPx,
    isMini: p.isMini,
  };
}

function restoreSnapshot(p: PlayerState, s: PlayerSnapshot): void {
  p.worldX = s.worldX;
  p.worldY = s.worldY;
  p.vy = s.vy;
  p.mode = s.mode;
  p.gravDir = s.gravDir;
  p.speedPx = s.speedMult;
  p.isMini = s.isMini;
  p.isDead = false;
  p.isGrounded = false;
  p.isCeilGrounded = false;
  p.angle = 0;
  p.orbCooldown = 0;
  p.robotChargeTime = 0;
}

// ─── Portal effects ──────────────────────────────────────────────────────────
function applyPortal(p: PlayerState, obj: LevelObject): void {
  switch (obj.type) {
    case 'portal_cube':    p.mode = 'cube'; break;
    case 'portal_ship':    p.mode = 'ship'; p.vy = 0; break;
    case 'portal_ball':    p.mode = 'ball'; break;
    case 'portal_ufo':     p.mode = 'ufo'; break;
    case 'portal_wave':    p.mode = 'wave'; break;
    case 'portal_robot':   p.mode = 'robot'; break;
    case 'portal_spider':  p.mode = 'spider'; break;
    case 'portal_swing':   p.mode = 'swing'; p.swingDir = 1; break;
    case 'portal_gravity': p.gravDir *= -1; p.vy = 0; break;
    case 'portal_mini':    p.isMini = true; break;
    case 'portal_normal_size': p.isMini = false; break;
    case 'portal_speed_slow':    p.speedPx = SPEED_TABLE.slow; break;
    case 'portal_speed_normal':  p.speedPx = SPEED_TABLE.normal; break;
    case 'portal_speed_fast':    p.speedPx = SPEED_TABLE.fast; break;
    case 'portal_speed_faster':  p.speedPx = SPEED_TABLE.faster; break;
    case 'portal_speed_fastest': p.speedPx = SPEED_TABLE.fastest; break;
  }
}

// ─── GameEngine class ─────────────────────────────────────────────────────────
export class GameEngine {
  private player!: PlayerState;
  private level!: Level;
  private state!: GameStateData;
  private input: InputManager;
  private audio: AudioManager;
  private particles: ParticleSystem;

  private accumulator = 0;
  private lastTimestamp = 0;
  private animFrameId = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  // Death flash
  private deathFlashAlpha = 0;

  // Used orbs this attempt (prevent re-trigger)
  private usedOrbs = new Set<number>();
  private triggeredPortals = new Set<number>();
  private collectedCoins: boolean[] = [];

  // Callbacks to React
  private onStateChange?: (state: GameStateData) => void;
  private onDeath?: () => void;
  private onComplete?: (progress: number) => void;

  constructor() {
    this.input = new InputManager();
    this.audio = new AudioManager();
    this.particles = new ParticleSystem();
  }

  // ─── Public API ─────────────────────────────────────────────────────────
  mount(
    canvas: HTMLCanvasElement,
    callbacks: {
      onStateChange?: (s: GameStateData) => void;
      onDeath?: () => void;
      onComplete?: (progress: number) => void;
    }
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onStateChange = callbacks.onStateChange;
    this.onDeath = callbacks.onDeath;
    this.onComplete = callbacks.onComplete;
  }

  startLevel(level: Level, isPractice = false): void {
    this.level = level;
    this.player = makePlayer(level);
    this.collectedCoins = new Array(level.objects.filter(o => o.type === 'coin').length).fill(false);
    this.usedOrbs.clear();
    this.triggeredPortals.clear();
    this.deathFlashAlpha = 0;
    this.particles.clear();

    this.state = {
      screen: 'playing',
      level,
      attempts: 1,
      bestProgress: 0,
      coinsCollected: this.collectedCoins,
      isPractice,
      practiceSnapshot: null,
    };

    this.audio.play(level.musicBpm, level.musicOffset);
    this.lastTimestamp = performance.now();
    this.accumulator = 0;
    this.tick(this.lastTimestamp);
  }

  stopLevel(): void {
    cancelAnimationFrame(this.animFrameId);
    this.audio.stop();
    this.input.reset();
  }

  setPracticeMode(on: boolean): void {
    if (!this.state) return;
    this.state.isPractice = on;
  }

  setMusicVolume(v: number): void { this.audio.setMusicVolume(v); }
  setSfxVolume(v: number): void { this.audio.setSfxVolume(v); }

  destroy(): void {
    this.stopLevel();
    this.input.destroy();
    this.audio.destroy();
  }

  // ─── Game loop ───────────────────────────────────────────────────────────
  private tick = (timestamp: number): void => {
    this.animFrameId = requestAnimationFrame(this.tick);

    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;
    this.accumulator += dt;

    while (this.accumulator >= DT) {
      this.update();
      this.accumulator -= DT;
    }

    this.render();
  };

  // ─── Physics & logic step ────────────────────────────────────────────────
  private update(): void {
    const p = this.player;
    if (p.isDead) {
      this.deathFlashAlpha = Math.max(0, this.deathFlashAlpha - 0.04);
      return;
    }

    // Decrement cooldowns
    if (p.orbCooldown > 0) p.orbCooldown--;

    // Save previous X for portal crossing
    p.prevX = p.worldX;

    // ── Mode-specific vy update ──────────────────────────────
    p.isGrounded = false;
    p.isCeilGrounded = false;
    applyMode(p, this.input);

    // ── Move horizontally ────────────────────────────────────
    p.worldX += p.speedPx;

    // ── Move vertically ──────────────────────────────────────
    p.worldY += p.vy;

    // ── World bounds (ground & ceiling) ──────────────────────
    this.resolveWorldBounds(p);

    // ── Object collisions ────────────────────────────────────
    const cameraX = p.worldX - PLAYER_SCREEN_X;
    const visible = filterVisible(this.level.objects, cameraX);
    this.processObjects(p, visible);

    // ── Win check ────────────────────────────────────────────
    const progress = (p.worldX - PLAYER_SCREEN_X) / this.level.length;
    this.state.bestProgress = Math.max(this.state.bestProgress, Math.min(progress, 1));

    // ── Particle trail ───────────────────────────────────────
    this.particles.spawnTrail(PLAYER_SCREEN_X, p.worldY, '#22c55e');
    this.particles.update();

    // ── Flush input frame state ───────────────────────────────
    this.input.flush();
  }

  // ─── World boundary collisions ───────────────────────────────────────────
  private resolveWorldBounds(p: PlayerState): void {
    const ph = (p.isMini ? PLAYER_H * 0.55 : PLAYER_H) / 2;

    if (p.gravDir === 1) {
      // Ground collision
      if (p.worldY + ph >= GROUND_Y) {
        p.worldY = GROUND_Y - ph;
        p.vy = 0;
        p.isGrounded = true;
        if (p.mode === 'cube' || p.mode === 'robot') {
          p.angle = snapAngle(p.angle);
          this.particles.spawnLanding(PLAYER_SCREEN_X, GROUND_Y);
        }
      }
      // Ceiling: die in modes where roof = kill
      if (p.worldY - ph <= CEILING_Y && p.mode !== 'spider') {
        this.triggerDeath(p);
      }
    } else {
      // Inverted: ceiling acts as ground
      if (p.worldY - ph <= CEILING_Y) {
        p.worldY = CEILING_Y + ph;
        p.vy = 0;
        p.isCeilGrounded = true;
        if (p.mode === 'cube' || p.mode === 'robot') p.angle = snapAngle(p.angle);
      }
      if (p.worldY + ph >= GROUND_Y && p.mode !== 'spider') {
        this.triggerDeath(p);
      }
    }
  }

  // ─── Process level objects ───────────────────────────────────────────────
  private processObjects(p: PlayerState, objects: LevelObject[]): void {
    const pr = playerRect(p);

    for (const obj of objects) {
      // ── End trigger ────────────────────────────────────────
      if (obj.type === 'end_trigger') {
        if (p.worldX >= obj.x + PLAYER_SCREEN_X - p.worldX + obj.x) {
          // Simpler: check if player worldX surpassed level end
          const levelEndWorldX = obj.x + PLAYER_SCREEN_X;
          if (p.worldX >= levelEndWorldX) {
            this.triggerComplete();
            return;
          }
        }
        // Direct check: object X in world, player at worldX
        if (p.worldX - PLAYER_SCREEN_X + PLAYER_SCREEN_X >= obj.x) {
          const cameraX = p.worldX - PLAYER_SCREEN_X;
          if (obj.x <= cameraX + PLAYER_SCREEN_X + PLAYER_W) {
            this.triggerComplete();
            return;
          }
        }
        continue;
      }

      // ── Hazards ────────────────────────────────────────────
      if (isHazard(obj)) {
        const objScreenX = obj.x - (p.worldX - PLAYER_SCREEN_X);
        const objRect = { x: objScreenX, y: obj.y, w: obj.w, h: obj.h };
        const screenPR = { x: PLAYER_SCREEN_X - pr.w / 2, y: pr.y, w: pr.w, h: pr.h };
        if (
          screenPR.x < objRect.x + objRect.w && screenPR.x + screenPR.w > objRect.x &&
          screenPR.y < objRect.y + objRect.h && screenPR.y + screenPR.h > objRect.y
        ) {
          this.triggerDeath(p);
          return;
        }
        continue;
      }

      // ── Solid collision ────────────────────────────────────
      if (isSolid(obj)) {
        const cameraX = p.worldX - PLAYER_SCREEN_X;
        const screenObjX = obj.x - cameraX;
        const screenObj = { ...obj, x: screenObjX };
        const screenPR = { x: PLAYER_SCREEN_X - pr.w / 2, y: pr.y, w: pr.w, h: pr.h };

        const result = solidCollision(screenPR, screenObj);
        if (!result) continue;

        if (result.face === 'top') {
          // Land on block
          p.worldY -= result.depth;
          if (p.gravDir === 1) {
            p.vy = Math.min(p.vy, 0);
            p.isGrounded = true;
            if (p.mode === 'cube' || p.mode === 'robot') {
              p.angle = snapAngle(p.angle);
            }
          } else {
            p.vy = Math.max(p.vy, 0);
            this.triggerDeath(p);
            return;
          }
        } else if (result.face === 'bottom') {
          // Hit ceiling from below
          p.worldY += result.depth;
          if (p.gravDir === -1) {
            p.vy = Math.max(p.vy, 0);
            p.isCeilGrounded = true;
            if (p.mode === 'cube' || p.mode === 'robot') p.angle = snapAngle(p.angle);
          } else {
            p.vy = Math.min(p.vy, 0);
            // Wall = die in most modes (ship/wave can touch ceiling)
            if (p.mode !== 'ship' && p.mode !== 'wave') {
              this.triggerDeath(p);
              return;
            }
          }
        } else {
          // Side collision = death
          this.triggerDeath(p);
          return;
        }
        continue;
      }

      // ── Orbs ───────────────────────────────────────────────
      if (isOrb(obj) && !this.usedOrbs.has(obj.id)) {
        const cameraX = p.worldX - PLAYER_SCREEN_X;
        const orbScreenX = obj.x - cameraX;
        const orbScreenRect = { x: orbScreenX, y: obj.y, w: obj.w, h: obj.h };
        const screenPR = { x: PLAYER_SCREEN_X - pr.w / 2, y: pr.y, w: pr.w, h: pr.h };
        if (
          screenPR.x < orbScreenRect.x + orbScreenRect.w &&
          screenPR.x + screenPR.w > orbScreenRect.x &&
          screenPR.y < orbScreenRect.y + orbScreenRect.h &&
          screenPR.y + screenPR.h > orbScreenRect.y
        ) {
          const activated = applyOrbEffect(p, obj.type, this.input.justPressed || this.input.isHeld);
          if (activated) {
            this.usedOrbs.add(obj.id);
            this.audio.playSfx('orb');
            this.particles.spawnOrbActivate(PLAYER_SCREEN_X, p.worldY, '#fbbf24');
          }
        }
        continue;
      }

      // ── Pads ───────────────────────────────────────────────
      if (isPad(obj)) {
        const cameraX = p.worldX - PLAYER_SCREEN_X;
        const screenObjX = obj.x - cameraX;
        const screenObj = { ...obj, x: screenObjX };
        const screenPR = { x: PLAYER_SCREEN_X - pr.w / 2, y: pr.y, w: pr.w, h: pr.h };
        const res = solidCollision(screenPR, screenObj);
        if (res && res.face === 'top') {
          p.worldY -= res.depth;
          applyPadEffect(p, obj.type);
          this.audio.playSfx('jump');
        }
        continue;
      }

      // ── Portals ────────────────────────────────────────────
      if (isPortal(obj) && !this.triggeredPortals.has(obj.id)) {
        if (crossedPortal(p, { ...obj, x: obj.x - (p.worldX - PLAYER_SCREEN_X - PLAYER_SCREEN_X) })) {
          // Simpler crossing: check if player worldX just passed portal
          const portalWorldX = obj.x;
          if (p.prevX - PLAYER_SCREEN_X < portalWorldX && p.worldX - PLAYER_SCREEN_X >= portalWorldX) {
            const oldMode = p.mode;
            applyPortal(p, obj);
            this.triggeredPortals.add(obj.id);
            this.audio.playSfx('portal');
            this.particles.spawnPortal(PLAYER_SCREEN_X, obj.y, obj.h);
          }
        }
        continue;
      }

      // ── Coins ─────────────────────────────────────────────
      if (obj.type === 'coin') {
        const cameraX = p.worldX - PLAYER_SCREEN_X;
        const coinScreenX = obj.x - cameraX;
        const coinRect = { x: coinScreenX, y: obj.y, w: obj.w, h: obj.h };
        const screenPR = { x: PLAYER_SCREEN_X - pr.w / 2, y: pr.y, w: pr.w, h: pr.h };
        const coinIdx = this.level.objects.filter(o => o.type === 'coin').findIndex(o => o.id === obj.id);
        if (coinIdx >= 0 && !this.collectedCoins[coinIdx]) {
          if (
            screenPR.x < coinRect.x + coinRect.w && screenPR.x + screenPR.w > coinRect.x &&
            screenPR.y < coinRect.y + coinRect.h && screenPR.y + screenPR.h > coinRect.y
          ) {
            this.collectedCoins[coinIdx] = true;
            this.audio.playSfx('coin');
            this.particles.spawnCoin(PLAYER_SCREEN_X, p.worldY);
          }
        }
        continue;
      }
    }

    // ── Check end-of-level via worldX ────────────────────────
    if (p.worldX - PLAYER_SCREEN_X >= this.level.length) {
      this.triggerComplete();
    }
  }

  // ─── Death ───────────────────────────────────────────────────────────────
  private triggerDeath(p: PlayerState): void {
    if (p.isDead) return;
    p.isDead = true;
    this.deathFlashAlpha = 1;
    this.audio.playSfx('death');
    this.particles.spawnDeath(PLAYER_SCREEN_X, p.worldY, '#22c55e');
    this.state.attempts++;
    this.onDeath?.();

    // Reset after brief delay
    setTimeout(() => this.respawn(), 300);
  }

  private respawn(): void {
    if (this.state.isPractice && this.state.practiceSnapshot) {
      restoreSnapshot(this.player, this.state.practiceSnapshot);
      // Keep coins/orbs from checkpoint onwards
    } else {
      // Reset all
      this.player = makePlayer(this.level);
      this.usedOrbs.clear();
      this.triggeredPortals.clear();
      this.collectedCoins.fill(false);
    }
    this.deathFlashAlpha = 0;
    this.onStateChange?.(this.state);
  }

  // ─── Complete ────────────────────────────────────────────────────────────
  private triggerComplete(): void {
    this.state.screen = 'complete';
    this.audio.stop();
    this.audio.playSfx('complete');
    this.onComplete?.(this.state.bestProgress);
    this.onStateChange?.(this.state);
  }

  // ─── Practice checkpoint ─────────────────────────────────────────────────
  saveCheckpoint(): void {
    if (!this.state.isPractice) return;
    this.state.practiceSnapshot = snapshot(this.player);
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  private render(): void {
    if (!this.ctx || !this.canvas) return;

    // Scale canvas to fill window
    const { width, height } = this.canvas;
    const scaleX = width / VIEW_W;
    const scaleY = height / VIEW_H;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (width - VIEW_W * scale) / 2;
    const offsetY = (height - VIEW_H * scale) / 2;

    this.ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    // Detect ceiling requirement
    const hasCeiling = this.level.objects.some(
      o => o.type === 'block' && o.y <= CEILING_Y + 10
    );

    renderLevel(
      this.ctx,
      this.level,
      this.player,
      this.particles,
      this.audio.getBeatFraction(),
      this.deathFlashAlpha,
      hasCeiling
    );

    renderProgressBar(
      this.ctx,
      Math.min(this.state.bestProgress, 1),
      this.state.attempts,
      this.state.isPractice
    );

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ─── Accessors ───────────────────────────────────────────────────────────
  get currentState(): GameStateData | null { return this.state ?? null; }
  get inputManager(): InputManager { return this.input; }
  get audioManager(): AudioManager { return this.audio; }
  get bestProgress(): number { return this.state?.bestProgress ?? 0; }
}
