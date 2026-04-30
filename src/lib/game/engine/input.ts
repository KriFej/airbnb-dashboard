// Unified input system: keyboard + mouse + touch

export class InputManager {
  private held = false;
  private _justPressed = false;
  private _justReleased = false;
  private keyState = new Set<string>();

  // Keys treated as "action"
  private static ACTION_KEYS = new Set(['Space', 'ArrowUp', 'KeyW', 'KeyZ']);

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.onKeyDown, { passive: false });
    window.addEventListener('keyup', this.onKeyUp, { passive: true });
    window.addEventListener('mousedown', this.onPointerDown, { passive: true });
    window.addEventListener('mouseup', this.onPointerUp, { passive: true });
    window.addEventListener('touchstart', this.onPointerDown, { passive: true });
    window.addEventListener('touchend', this.onPointerUp, { passive: true });
  }

  destroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onPointerDown);
    window.removeEventListener('mouseup', this.onPointerUp);
    window.removeEventListener('touchstart', this.onPointerDown);
    window.removeEventListener('touchend', this.onPointerUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (InputManager.ACTION_KEYS.has(e.code)) {
      e.preventDefault();
      if (!this.keyState.has(e.code)) {
        this.keyState.add(e.code);
        if (!this.held) this._justPressed = true;
        this.held = true;
      }
    }
  };

  private onKeyUp = (e: KeyboardEvent): void => {
    if (InputManager.ACTION_KEYS.has(e.code)) {
      this.keyState.delete(e.code);
      if (this.keyState.size === 0) {
        this._justReleased = true;
        this.held = false;
      }
    }
  };

  private onPointerDown = (): void => {
    if (!this.held) this._justPressed = true;
    this.held = true;
  };

  private onPointerUp = (): void => {
    if (this.keyState.size === 0) {
      this._justReleased = true;
      this.held = false;
    }
  };

  // ─── Frame-level queries ──────────────────────────────────────────────────

  /** True while action button is held down */
  get isHeld(): boolean { return this.held; }

  /** True only on the first frame of press */
  get justPressed(): boolean { return this._justPressed; }

  /** True only on the first frame of release */
  get justReleased(): boolean { return this._justReleased; }

  /** Consume single-frame flags — call once per logic step */
  flush(): void {
    this._justPressed = false;
    this._justReleased = false;
  }

  /** Hard-reset all state (use on screen transitions) */
  reset(): void {
    this.held = false;
    this._justPressed = false;
    this._justReleased = false;
    this.keyState.clear();
  }
}
