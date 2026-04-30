'use client';

// BPM-synchronized audio manager using Web Audio API

export interface BeatEvent {
  beat: number;       // integer beat number (0-based)
  time: number;       // audio context time
  fraction: number;   // 0..1 position within current beat
}

type BeatCallback = (evt: BeatEvent) => void;

export class AudioManager {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private buffer: AudioBuffer | null = null;
  private startTime = 0;      // ctx.currentTime when playback began
  private startOffset = 0;    // seconds of audio already played (pause resume)
  private _isPlaying = false;
  private bpm = 140;
  private musicOffset = 0;    // seconds before beat 1

  private beatCallbacks: Set<BeatCallback> = new Set();
  private lastBeat = -1;
  private rafId = 0;

  private sfxGain: GainNode | null = null;
  private musicVolume = 0.7;
  private sfxVolume = 0.8;

  // ─── Init ────────────────────────────────────────────────────────────────
  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.musicVolume;
      this.gainNode.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  // ─── Load audio from URL ─────────────────────────────────────────────────
  async loadTrack(url: string): Promise<void> {
    const ctx = this.ensureContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.buffer = await ctx.decodeAudioData(arrayBuffer);
  }

  // ─── Generate a simple procedural beat track ──────────────────────────────
  generateBeepTrack(bpm: number, bars = 32): AudioBuffer {
    const ctx = this.ensureContext();
    const beatsPerBar = 4;
    const totalBeats = bars * beatsPerBar;
    const secPerBeat = 60 / bpm;
    const duration = totalBeats * secPerBeat;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, Math.ceil(duration * sampleRate), sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let beat = 0; beat < totalBeats; beat++) {
        const t0 = beat * secPerBeat;
        const isDownbeat = beat % beatsPerBar === 0;
        const freq = isDownbeat ? 440 : 330;
        const amp = isDownbeat ? 0.25 : 0.12;
        const clickDur = 0.04;
        const startSample = Math.floor(t0 * sampleRate);
        const endSample = Math.min(startSample + Math.floor(clickDur * sampleRate), data.length);
        for (let s = startSample; s < endSample; s++) {
          const t = (s - startSample) / sampleRate;
          const env = 1 - t / clickDur;
          data[s] += Math.sin(2 * Math.PI * freq * t) * amp * env;
        }
      }
    }

    return buffer;
  }

  // ─── Playback ────────────────────────────────────────────────────────────
  play(bpm: number, musicOffset = 0): void {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    this.stop();

    this.bpm = bpm;
    this.musicOffset = musicOffset;

    if (!this.buffer) {
      this.buffer = this.generateBeepTrack(bpm);
    }

    this.source = ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.loop = true;
    this.source.connect(this.gainNode!);
    this.source.start(0, this.startOffset);
    this.startTime = ctx.currentTime - this.startOffset;
    this._isPlaying = true;
    this.lastBeat = -1;
    this.tickBeat();
  }

  stop(): void {
    if (this.source) {
      try { this.source.stop(); } catch { /* already stopped */ }
      this.source.disconnect();
      this.source = null;
    }
    this._isPlaying = false;
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = 0; }
    this.startOffset = 0;
  }

  pause(): void {
    if (!this._isPlaying || !this.ctx) return;
    this.startOffset = this.ctx.currentTime - this.startTime;
    this.stop();
  }

  resume(): void {
    if (!this._isPlaying) this.play(this.bpm, this.musicOffset);
  }

  // ─── Beat detection loop ─────────────────────────────────────────────────
  private tickBeat = (): void => {
    if (!this._isPlaying || !this.ctx) return;
    const elapsed = this.ctx.currentTime - this.startTime - this.musicOffset;
    if (elapsed >= 0) {
      const secPerBeat = 60 / this.bpm;
      const beatFloat = elapsed / secPerBeat;
      const beatInt = Math.floor(beatFloat);
      if (beatInt !== this.lastBeat) {
        this.lastBeat = beatInt;
        const evt: BeatEvent = {
          beat: beatInt,
          time: this.ctx.currentTime,
          fraction: beatFloat - beatInt,
        };
        this.beatCallbacks.forEach(cb => cb(evt));
      }
    }
    this.rafId = requestAnimationFrame(this.tickBeat);
  };

  // ─── Beat fraction (0..1 within current beat) ────────────────────────────
  getBeatFraction(): number {
    if (!this.ctx || !this._isPlaying) return 0;
    const elapsed = this.ctx.currentTime - this.startTime - this.musicOffset;
    if (elapsed < 0) return 0;
    const secPerBeat = 60 / this.bpm;
    return (elapsed / secPerBeat) % 1;
  }

  // ─── Procedural SFX ──────────────────────────────────────────────────────
  playSfx(type: 'jump' | 'death' | 'orb' | 'portal' | 'coin' | 'complete'): void {
    const ctx = this.ensureContext();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(this.sfxGain!);

    const now = ctx.currentTime;
    switch (type) {
      case 'jump':
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
        break;
      case 'death':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
        break;
      case 'orb':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now); osc.stop(now + 0.12);
        break;
      case 'portal':
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(900, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
        break;
      case 'coin':
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.05);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
        break;
      case 'complete':
        [523, 659, 784, 1047].forEach((freq, i) => {
          const o2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          o2.connect(g2); g2.connect(this.sfxGain!);
          o2.frequency.value = freq;
          g2.gain.setValueAtTime(0.3, now + i * 0.12);
          g2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.3);
          o2.start(now + i * 0.12); o2.stop(now + i * 0.12 + 0.35);
        });
        break;
    }
  }

  // ─── Events ──────────────────────────────────────────────────────────────
  onBeat(cb: BeatCallback): () => void {
    this.beatCallbacks.add(cb);
    return () => this.beatCallbacks.delete(cb);
  }

  // ─── Volume ──────────────────────────────────────────────────────────────
  setMusicVolume(v: number): void {
    this.musicVolume = v;
    if (this.gainNode) this.gainNode.gain.value = v;
  }

  setSfxVolume(v: number): void {
    this.sfxVolume = v;
    if (this.sfxGain) this.sfxGain.gain.value = v;
  }

  get isPlaying(): boolean { return this._isPlaying; }

  destroy(): void {
    this.stop();
    if (this.ctx) { this.ctx.close(); this.ctx = null; }
  }
}
