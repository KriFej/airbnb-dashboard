import type { Particle, ParticleShape } from '../types';

export class ParticleSystem {
  private particles: Particle[] = [];

  // ─── Emitters ─────────────────────────────────────────────────────────────

  /** Cube death burst */
  spawnDeath(x: number, y: number, color: string): void {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.spawn({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1, size: 4 + Math.random() * 6,
        color, shape: 'square',
        maxLife: 0.6 + Math.random() * 0.4,
      });
    }
    // Sparks
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      this.spawn({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1, size: 2 + Math.random() * 3,
        color: '#ffffff', shape: 'spark',
        maxLife: 0.3 + Math.random() * 0.3,
      });
    }
  }

  /** Orb activation ring */
  spawnOrbActivate(x: number, y: number, color: string): void {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      this.spawn({
        x, y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        life: 1, size: 5,
        color, shape: 'circle',
        maxLife: 0.4,
      });
    }
  }

  /** Portal entry flash */
  spawnPortal(x: number, y: number, h: number): void {
    for (let i = 0; i < 16; i++) {
      const py = y + Math.random() * h;
      this.spawn({
        x, y: py,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 4,
        life: 1, size: 3 + Math.random() * 5,
        color: '#7c3aed', shape: 'circle',
        maxLife: 0.5,
      });
    }
  }

  /** Coin collect sparkle */
  spawnCoin(x: number, y: number): void {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      this.spawn({
        x, y,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3 - 2,
        life: 1, size: 3,
        color: '#f59e0b', shape: 'spark',
        maxLife: 0.5,
      });
    }
  }

  /** Continuous trail while running */
  spawnTrail(x: number, y: number, color: string): void {
    if (Math.random() > 0.4) return;
    this.spawn({
      x: x + (Math.random() - 0.5) * 6,
      y: y + (Math.random() - 0.5) * 6,
      vx: -1 - Math.random() * 2,
      vy: (Math.random() - 0.5),
      life: 1, size: 4 + Math.random() * 3,
      color, shape: 'square',
      maxLife: 0.25,
    });
  }

  /** Landing dust puff */
  spawnLanding(x: number, y: number): void {
    for (let i = 0; i < 6; i++) {
      this.spawn({
        x: x + (Math.random() - 0.5) * 20,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -1 - Math.random() * 2,
        life: 1, size: 3 + Math.random() * 4,
        color: '#94a3b8', shape: 'circle',
        maxLife: 0.3,
      });
    }
  }

  // ─── Core ─────────────────────────────────────────────────────────────────
  private spawn(p: Particle & { maxLife: number }): void {
    // Re-use dead slots
    const dead = this.particles.findIndex(q => q.life <= 0);
    const entry = { ...p };
    if (dead >= 0) {
      this.particles[dead] = entry;
    } else if (this.particles.length < 400) {
      this.particles.push(entry);
    }
  }

  update(): void {
    const decay = 1 / 60;
    for (const p of this.particles) {
      if (p.life <= 0) continue;
      // Use size field as maxLife for decay rate
      const rate = decay / ((p as Particle & { maxLife: number }).maxLife || 0.5);
      p.life = Math.max(0, p.life - rate);
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;  // mild gravity on particles
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      if (p.life <= 0) continue;
      const alpha = p.life;
      const sz = p.size * p.life;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;

      switch (p.shape) {
        case 'square':
          ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(p.x, p.y, sz / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'spark': {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
          ctx.stroke();
          break;
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  clear(): void { this.particles = []; }

  get count(): number { return this.particles.filter(p => p.life > 0).length; }
}
