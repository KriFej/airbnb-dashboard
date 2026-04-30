import type { PlayerState, LevelObject, Level } from '../types';
import type { ParticleSystem } from './particleSystem';
import {
  VIEW_W, VIEW_H, TILE, GROUND_Y, CEILING_Y,
  PLAYER_W, PLAYER_H, GROUND_H, C,
} from '../constants';

// ─── Background stars ─────────────────────────────────────────────────────────
const STAR_COUNT = 80;
const stars: { x: number; y: number; r: number; speed: number }[] = Array.from(
  { length: STAR_COUNT },
  () => ({
    x: Math.random() * VIEW_W,
    y: Math.random() * GROUND_Y,
    r: 0.5 + Math.random() * 1.5,
    speed: 0.2 + Math.random() * 0.5,
  })
);

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  bgTop: string,
  bgBot: string
): void {
  // Sky gradient
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  grad.addColorStop(0, bgTop);
  grad.addColorStop(1, bgBot);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Parallax stars
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (const s of stars) {
    const sx = ((s.x - cameraX * s.speed) % VIEW_W + VIEW_W) % VIEW_W;
    ctx.beginPath();
    ctx.arc(sx, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function renderGround(
  ctx: CanvasRenderingContext2D,
  groundColor: string,
  lineColor: string,
  hasCeiling: boolean
): void {
  // Ground
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, GROUND_Y, VIEW_W, GROUND_H);
  // Ground surface line
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(VIEW_W, GROUND_Y);
  ctx.stroke();
  // Ground tile lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < VIEW_W; i += TILE) {
    ctx.beginPath();
    ctx.moveTo(i, GROUND_Y);
    ctx.lineTo(i, VIEW_H);
    ctx.stroke();
  }

  if (hasCeiling) {
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, 0, VIEW_W, CEILING_Y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, CEILING_Y);
    ctx.lineTo(VIEW_W, CEILING_Y);
    ctx.stroke();
  }
}

// ─── Object rendering ─────────────────────────────────────────────────────────
export function renderObject(
  ctx: CanvasRenderingContext2D,
  obj: LevelObject,
  cameraX: number,
  beatFraction: number
): void {
  const sx = obj.x - cameraX;
  const sy = obj.y;

  // Skip if out of view
  if (sx + obj.w < -10 || sx > VIEW_W + 10) return;

  ctx.save();
  ctx.translate(sx + obj.w / 2, sy + obj.h / 2);
  if (obj.angle) ctx.rotate((obj.angle * Math.PI) / 180);
  if (obj.flipX) ctx.scale(-1, 1);
  if (obj.flipY) ctx.scale(1, -1);

  const hw = obj.w / 2;
  const hh = obj.h / 2;

  switch (obj.type) {
    case 'block':
    case 'block_half': {
      ctx.fillStyle = obj.color || C.BLOCK;
      ctx.fillRect(-hw, -hh, obj.w, obj.h);
      ctx.strokeStyle = C.BLOCK_EDGE;
      ctx.lineWidth = 2;
      ctx.strokeRect(-hw + 1, -hh + 1, obj.w - 2, obj.h - 2);
      // Inner detail line
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-hw + 4, -hh + 4, obj.w - 8, obj.h - 8);
      break;
    }

    case 'block_slope_ul':
    case 'block_slope_ur': {
      ctx.fillStyle = obj.color || C.BLOCK;
      ctx.beginPath();
      if (obj.type === 'block_slope_ul') {
        ctx.moveTo(-hw, hh);
        ctx.lineTo(hw, hh);
        ctx.lineTo(hw, -hh);
      } else {
        ctx.moveTo(-hw, hh);
        ctx.lineTo(hw, hh);
        ctx.lineTo(-hw, -hh);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = C.BLOCK_EDGE;
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
    }

    case 'spike':
    case 'spike_down': {
      ctx.fillStyle = obj.color || C.SPIKE;
      ctx.beginPath();
      if (obj.type === 'spike') {
        ctx.moveTo(-hw, hh);
        ctx.lineTo(hw, hh);
        ctx.lineTo(0, -hh);
      } else {
        ctx.moveTo(-hw, -hh);
        ctx.lineTo(hw, -hh);
        ctx.lineTo(0, hh);
      }
      ctx.closePath();
      ctx.fill();
      // Bright edge
      ctx.strokeStyle = 'rgba(255,100,100,0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }

    case 'spike_left':
    case 'spike_right': {
      ctx.fillStyle = obj.color || C.SPIKE;
      ctx.beginPath();
      if (obj.type === 'spike_left') {
        ctx.moveTo(hw, -hh);
        ctx.lineTo(hw, hh);
        ctx.lineTo(-hw, 0);
      } else {
        ctx.moveTo(-hw, -hh);
        ctx.lineTo(-hw, hh);
        ctx.lineTo(hw, 0);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,100,100,0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }

    case 'saw': {
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.06;
      const r = (obj.w / 2) * pulse;
      ctx.save();
      ctx.rotate(Date.now() * 0.002);
      // Teeth
      const teeth = 10;
      ctx.fillStyle = obj.color || C.SAW;
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a1 = (i / teeth) * Math.PI * 2;
        const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
        const a3 = ((i + 1) / teeth) * Math.PI * 2;
        ctx.lineTo(Math.cos(a1) * r * 0.6, Math.sin(a1) * r * 0.6);
        ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
        ctx.lineTo(Math.cos(a3) * r * 0.6, Math.sin(a3) * r * 0.6);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'orb_yellow':
    case 'orb_blue':
    case 'orb_pink':
    case 'orb_black':
    case 'orb_green':
    case 'orb_red': {
      const orbColors: Record<string, string> = {
        orb_yellow: C.ORB_YELLOW, orb_blue: C.ORB_BLUE,
        orb_pink: C.ORB_PINK, orb_black: C.ORB_BLACK,
        orb_green: C.ORB_GREEN, orb_red: '#ef4444',
      };
      const oc = obj.color || orbColors[obj.type];
      const r = (obj.w / 2) * (1 + beatFraction * 0.1);
      // Glow
      const grd = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.5);
      grd.addColorStop(0, oc + 'cc');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2); ctx.fill();
      // Body
      ctx.fillStyle = oc;
      ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
      // Inner circle
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2); ctx.fill();
      break;
    }

    case 'pad_yellow':
    case 'pad_pink':
    case 'pad_red': {
      const padColors: Record<string, string> = {
        pad_yellow: C.PAD_YELLOW, pad_pink: C.PAD_PINK, pad_red: C.PAD_RED,
      };
      const pc = obj.color || padColors[obj.type];
      ctx.fillStyle = pc;
      ctx.fillRect(-hw, -hh, obj.w, obj.h);
      // Arrow up
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(0, -hh + 4);
      ctx.lineTo(hw - 6, hh - 4);
      ctx.lineTo(-hw + 6, hh - 4);
      ctx.closePath();
      ctx.fill();
      break;
    }

    default:
      if (obj.type.startsWith('portal_')) {
        renderPortal(ctx, obj, hw, hh, beatFraction);
      }
      break;
  }

  ctx.restore();

  // Checkpoint flag
  if (obj.type === 'checkpoint') {
    ctx.save();
    ctx.translate(sx, sy);
    // Flag pole
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(obj.w / 2, obj.h);
    ctx.lineTo(obj.w / 2, 0);
    ctx.stroke();
    // Flag
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(obj.w / 2, 2);
    ctx.lineTo(obj.w - 4, obj.h * 0.4);
    ctx.lineTo(obj.w / 2, obj.h * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Coin
  if (obj.type === 'coin') {
    ctx.save();
    ctx.translate(sx + obj.w / 2, sy + obj.h / 2);
    ctx.rotate(Date.now() * 0.002);
    const r = obj.w / 2;
    ctx.fillStyle = C.COIN;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(-r * 0.15, -r * 0.15, r * 0.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderPortal(
  ctx: CanvasRenderingContext2D,
  obj: LevelObject,
  hw: number,
  hh: number,
  beat: number
): void {
  const pulse = 1 + beat * 0.08;
  const modeColors: Record<string, string> = {
    portal_cube: '#22c55e', portal_ship: '#3b82f6', portal_ball: '#ec4899',
    portal_ufo: '#f59e0b', portal_wave: '#8b5cf6', portal_robot: '#ef4444',
    portal_spider: '#14b8a6', portal_swing: '#f97316',
    portal_gravity: '#06b6d4', portal_mini: '#a78bfa',
    portal_speed_slow: '#6366f1', portal_speed_normal: '#22c55e',
    portal_speed_fast: '#f59e0b', portal_speed_faster: '#ef4444',
    portal_speed_fastest: '#dc2626',
  };
  const pc = modeColors[obj.type] || C.PORTAL;

  // Outer ring
  ctx.strokeStyle = pc;
  ctx.lineWidth = 3 * pulse;
  ctx.beginPath();
  ctx.ellipse(0, 0, hw * pulse, hh * pulse, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Inner fill
  ctx.fillStyle = pc + '33';
  ctx.beginPath();
  ctx.ellipse(0, 0, hw * 0.85, hh * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();

  // Label
  const labels: Record<string, string> = {
    portal_cube: '■', portal_ship: '▲', portal_ball: '●',
    portal_ufo: '◆', portal_wave: '～', portal_robot: 'R',
    portal_spider: 'S', portal_swing: 'Ω',
    portal_gravity: '↕', portal_mini: 'mini',
    portal_speed_slow: '½×', portal_speed_normal: '1×',
    portal_speed_fast: '2×', portal_speed_faster: '3×',
    portal_speed_fastest: '4×',
  };
  const label = labels[obj.type] || '?';
  ctx.fillStyle = pc;
  ctx.font = `bold ${Math.min(hw, 14)}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 0, 0);
}

// ─── Player rendering ─────────────────────────────────────────────────────────
export function renderPlayer(
  ctx: CanvasRenderingContext2D,
  p: PlayerState,
  beatFraction: number
): void {
  const scale = p.isMini ? 0.55 : 1;
  const w = PLAYER_W * scale;
  const h = PLAYER_H * scale;

  ctx.save();
  ctx.translate(200, p.worldY);  // player always drawn at PLAYER_SCREEN_X = 200
  ctx.rotate((p.angle * Math.PI) / 180);

  const pulse = 1 + beatFraction * 0.05;

  switch (p.mode) {
    case 'cube': renderCube(ctx, w * pulse, h * pulse); break;
    case 'ship': renderShip(ctx, w * pulse, h * pulse, p.vy); break;
    case 'ball': renderBall(ctx, w * pulse, p.gravDir); break;
    case 'ufo':  renderUFO(ctx, w * pulse, h * pulse); break;
    case 'wave': renderWave(ctx, w * pulse, h * pulse); break;
    case 'robot': renderRobot(ctx, w * pulse, h * pulse, p.robotChargeTime); break;
    case 'spider': renderSpider(ctx, w * pulse, h * pulse); break;
    case 'swing': renderSwing(ctx, w * pulse, h * pulse); break;
    default:     renderCube(ctx, w, h); break;
  }

  ctx.restore();
}

function renderCube(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hw = w / 2; const hh = h / 2;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(-hw + 3, -hh + 3, w, h);
  // Body
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.fillRect(-hw, -hh, w, h);
  // Edge
  ctx.strokeStyle = C.PLAYER_EDGE;
  ctx.lineWidth = 2;
  ctx.strokeRect(-hw, -hh, w, h);
  // Inner square
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-hw + 5, -hh + 5, w - 10, h - 10);
  // Corner dots
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  const d = 3;
  [[-hw + 6, -hh + 6], [hw - 6, -hh + 6],
   [-hw + 6, hh - 6], [hw - 6, hh - 6]].forEach(([cx, cy]) => {
    ctx.beginPath(); ctx.arc(cx, cy, d, 0, Math.PI * 2); ctx.fill();
  });
}

function renderShip(
  ctx: CanvasRenderingContext2D, w: number, h: number, vy: number
): void {
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.beginPath();
  ctx.moveTo(w / 2, 0);
  ctx.lineTo(-w / 2, -h / 3);
  ctx.lineTo(-w / 2 + 8, 0);
  ctx.lineTo(-w / 2, h / 3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = C.PLAYER_EDGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  // Engine glow
  const thrustIntensity = Math.abs(vy) / 12;
  const gc = ctx.createRadialGradient(-w / 2 + 4, 0, 0, -w / 2 + 4, 0, w * 0.4);
  gc.addColorStop(0, `rgba(251,191,36,${0.6 + thrustIntensity * 0.4})`);
  gc.addColorStop(1, 'transparent');
  ctx.fillStyle = gc;
  ctx.beginPath();
  ctx.arc(-w / 2 + 4, 0, w * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function renderBall(ctx: CanvasRenderingContext2D, w: number, gravDir: number): void {
  const r = w / 2;
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  // Inner pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2); ctx.stroke();
  // Gravity arrow
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.2 * gravDir);
  ctx.lineTo(-r * 0.25, r * 0.15 * gravDir);
  ctx.lineTo(r * 0.25, r * 0.15 * gravDir);
  ctx.closePath(); ctx.fill();
}

function renderUFO(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  // Saucer body
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.beginPath();
  ctx.ellipse(0, h * 0.1, w / 2, h * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  // Dome
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.ellipse(0, -h * 0.1, w * 0.3, h * 0.3, 0, Math.PI, 0);
  ctx.fill();
  // Glow underneath
  const grd = ctx.createRadialGradient(0, h * 0.3, 0, 0, h * 0.3, w * 0.4);
  grd.addColorStop(0, 'rgba(74,222,128,0.5)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.ellipse(0, h * 0.3, w * 0.4, h * 0.15, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(0, h * 0.1, w / 2, h * 0.3, 0, 0, Math.PI * 2); ctx.stroke();
}

function renderWave(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.save();
  ctx.rotate(Math.PI / 4);
  const s = w * 0.7;
  ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.strokeRect(-s / 2, -s / 2, s, s);
  ctx.restore();
  // Sparkle trail
  ctx.fillStyle = 'rgba(34,197,94,0.4)';
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(-w * 0.3 * i, 0, (4 - i) * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderRobot(
  ctx: CanvasRenderingContext2D, w: number, h: number, chargeTime: number
): void {
  const hw = w / 2; const hh = h / 2;
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.fillRect(-hw, -hh, w, h);
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.strokeRect(-hw, -hh, w, h);
  // Head detail
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-hw + 4, -hh + 4, w - 8, h * 0.4);
  // Eyes
  ctx.fillStyle = chargeTime > 0 ? '#fbbf24' : 'rgba(255,255,255,0.7)';
  ctx.beginPath(); ctx.arc(-hw * 0.3, -hh * 0.2, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(hw * 0.3, -hh * 0.2, 3, 0, Math.PI * 2); ctx.fill();
  // Charge bar
  if (chargeTime > 0) {
    const t = chargeTime / 25;
    ctx.fillStyle = `hsl(${120 - t * 120},100%,50%)`;
    ctx.fillRect(-hw, hh - 5, w * t, 5);
  }
}

function renderSpider(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hw = w / 2; const hh = h / 2;
  ctx.fillStyle = C.PLAYER_FILL;
  // Body
  ctx.beginPath(); ctx.arc(0, 0, hw * 0.7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(0, 0, hw * 0.7, 0, Math.PI * 2); ctx.stroke();
  // Legs (4 pairs)
  ctx.strokeStyle = C.PLAYER_FILL; ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const baseAngle = (i / 4) * Math.PI - Math.PI / 8;
    const lx = Math.cos(baseAngle) * hw * 0.6;
    const ly = Math.sin(baseAngle) * hh * 0.6;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + Math.cos(baseAngle) * hw * 0.8, ly + Math.sin(baseAngle) * hh + 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-lx, ly);
    ctx.lineTo(-lx - Math.cos(baseAngle) * hw * 0.8, ly + Math.sin(baseAngle) * hh + 4);
    ctx.stroke();
  }
}

function renderSwing(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const hw = w / 2; const hh = h / 2;
  ctx.fillStyle = C.PLAYER_FILL;
  ctx.beginPath();
  ctx.moveTo(0, -hh);
  ctx.lineTo(hw, hh);
  ctx.lineTo(0, hh * 0.3);
  ctx.lineTo(-hw, hh);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = C.PLAYER_EDGE; ctx.lineWidth = 2;
  ctx.stroke();
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
export function renderProgressBar(
  ctx: CanvasRenderingContext2D,
  progress: number,
  attempts: number,
  isPractice: boolean
): void {
  const barW = VIEW_W - 40;
  const barH = 6;
  const barX = 20;
  const barY = 12;

  ctx.fillStyle = C.PROGRESS_BG;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 3);
  ctx.fill();

  ctx.fillStyle = C.PROGRESS_FG;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW * progress, barH, 3);
  ctx.fill();

  // Percentage
  const pct = Math.floor(progress * 100);
  ctx.fillStyle = C.UI_TEXT;
  ctx.font = 'bold 13px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${pct}%`, VIEW_W / 2, barY + barH / 2);

  // Attempts counter
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = C.UI_DIM;
  const label = isPractice ? `✦ Practice  ${attempts} attempts` : `${attempts} attempts`;
  ctx.fillText(label, barX, VIEW_H - 20);
}

// ─── Death flash overlay ─────────────────────────────────────────────────────
export function renderDeathFlash(
  ctx: CanvasRenderingContext2D,
  alpha: number
): void {
  ctx.fillStyle = `rgba(255,50,50,${alpha})`;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

// ─── Full level render pass ───────────────────────────────────────────────────
export function renderLevel(
  ctx: CanvasRenderingContext2D,
  level: Level,
  player: PlayerState,
  particles: ParticleSystem,
  beatFraction: number,
  deathFlash: number,
  hasCeiling: boolean
): void {
  const cameraX = player.worldX - 200;

  renderBackground(ctx, cameraX, level.bgColorTop, level.bgColorBot);
  renderGround(ctx, level.groundColor, level.lineColor, hasCeiling);

  // Level objects
  for (const obj of level.objects) {
    renderObject(ctx, obj, cameraX, beatFraction);
  }

  particles.render(ctx);
  renderPlayer(ctx, player, beatFraction);

  if (deathFlash > 0) renderDeathFlash(ctx, deathFlash);
}
