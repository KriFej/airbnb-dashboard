// Minimal level editor engine — grid-based, undo stack, import/export

import type { Level, LevelObject, ObjectType, EditorState, EditorTool } from '../types';
import { TILE, GROUND_Y, VIEW_H } from '../constants';

let _nextId = 10000;
function newId() { return _nextId++; }

const OBJECT_DEFAULTS: Record<ObjectType, { w: number; h: number }> = {
  block: { w: TILE, h: TILE },
  block_half: { w: TILE, h: TILE / 2 },
  block_slope_ul: { w: TILE, h: TILE },
  block_slope_ur: { w: TILE, h: TILE },
  spike: { w: TILE, h: TILE },
  spike_down: { w: TILE, h: TILE },
  spike_left: { w: TILE, h: TILE },
  spike_right: { w: TILE, h: TILE },
  saw: { w: TILE * 1.2, h: TILE * 1.2 },
  orb_yellow: { w: TILE * 0.8, h: TILE * 0.8 },
  orb_blue: { w: TILE * 0.8, h: TILE * 0.8 },
  orb_pink: { w: TILE * 0.8, h: TILE * 0.8 },
  orb_black: { w: TILE * 0.8, h: TILE * 0.8 },
  orb_green: { w: TILE * 0.8, h: TILE * 0.8 },
  orb_red: { w: TILE * 0.8, h: TILE * 0.8 },
  pad_yellow: { w: TILE, h: TILE * 0.3 },
  pad_pink: { w: TILE, h: TILE * 0.3 },
  pad_red: { w: TILE, h: TILE * 0.3 },
  portal_cube: { w: TILE * 0.8, h: TILE * 3 },
  portal_ship: { w: TILE * 0.8, h: TILE * 3 },
  portal_ball: { w: TILE * 0.8, h: TILE * 3 },
  portal_ufo: { w: TILE * 0.8, h: TILE * 3 },
  portal_wave: { w: TILE * 0.8, h: TILE * 3 },
  portal_robot: { w: TILE * 0.8, h: TILE * 3 },
  portal_spider: { w: TILE * 0.8, h: TILE * 3 },
  portal_swing: { w: TILE * 0.8, h: TILE * 3 },
  portal_gravity: { w: TILE * 0.8, h: TILE * 3 },
  portal_mini: { w: TILE * 0.8, h: TILE * 3 },
  portal_normal_size: { w: TILE * 0.8, h: TILE * 3 },
  portal_dual: { w: TILE * 0.8, h: TILE * 3 },
  portal_speed_slow: { w: TILE * 0.8, h: TILE * 3 },
  portal_speed_normal: { w: TILE * 0.8, h: TILE * 3 },
  portal_speed_fast: { w: TILE * 0.8, h: TILE * 3 },
  portal_speed_faster: { w: TILE * 0.8, h: TILE * 3 },
  portal_speed_fastest: { w: TILE * 0.8, h: TILE * 3 },
  checkpoint: { w: TILE * 0.4, h: TILE * 3 },
  coin: { w: TILE * 0.7, h: TILE * 0.7 },
  end_trigger: { w: 4, h: VIEW_H },
  decoration: { w: TILE, h: TILE },
};

// ─── Default new level ───────────────────────────────────────────────────────
export function createDefaultLevel(): Level {
  return {
    id: `custom_${Date.now()}`,
    name: 'My Level',
    author: 'Player',
    difficulty: 'normal',
    stars: 0,
    coinCount: 0,
    musicId: '',
    musicBpm: 140,
    musicOffset: 0,
    bgColorTop: '#0d0d2a',
    bgColorBot: '#1a1a4e',
    groundColor: '#0a1628',
    lineColor: '#1e4080',
    length: 100 * TILE,
    version: 1,
    startMode: 'cube',
    startGravity: 1,
    startSpeed: 9,
    objects: [
      { id: newId(), type: 'end_trigger', x: 100 * TILE, y: 0, w: 4, h: VIEW_H, solid: false },
    ],
    practiceCheckpoints: [],
  };
}

// ─── Editor class ────────────────────────────────────────────────────────────
export class EditorEngine {
  private undoStack: Level[] = [];
  private redoStack: Level[] = [];
  state: EditorState;

  constructor(level?: Level) {
    this.state = {
      level: level ?? createDefaultLevel(),
      tool: 'place',
      selectedObjectType: 'block',
      selectedObjectIds: new Set(),
      cameraX: 0,
      zoom: 1,
      snapToGrid: true,
      showGrid: true,
      unsaved: false,
    };
  }

  // ─── Undo / Redo ─────────────────────────────────────────────────────────
  private pushUndo(): void {
    this.undoStack.push(JSON.parse(JSON.stringify(this.state.level)));
    if (this.undoStack.length > 50) this.undoStack.shift();
    this.redoStack = [];
    this.state.unsaved = true;
  }

  undo(): void {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(JSON.parse(JSON.stringify(this.state.level)));
    this.state.level = this.undoStack.pop()!;
  }

  redo(): void {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(JSON.parse(JSON.stringify(this.state.level)));
    this.state.level = this.redoStack.pop()!;
  }

  // ─── Place object ─────────────────────────────────────────────────────────
  placeObject(worldX: number, worldY: number): LevelObject | null {
    const type = this.state.selectedObjectType;
    const dims = OBJECT_DEFAULTS[type] ?? { w: TILE, h: TILE };

    let x = worldX;
    let y = worldY;
    if (this.state.snapToGrid) {
      x = Math.round(x / TILE) * TILE;
      y = Math.round(y / TILE) * TILE;
    }

    // Prevent duplicates at same position
    const exists = this.state.level.objects.some(
      o => o.type === type && o.x === x && o.y === y
    );
    if (exists) return null;

    const obj: LevelObject = {
      id: newId(),
      type,
      x, y,
      w: dims.w, h: dims.h,
      solid: type === 'block' || type === 'block_half' || type.startsWith('block_slope'),
    };

    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: [...this.state.level.objects, obj],
    };

    return obj;
  }

  // ─── Delete object(s) ────────────────────────────────────────────────────
  deleteAt(worldX: number, worldY: number): void {
    const hit = this.hitTest(worldX, worldY);
    if (!hit) return;
    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: this.state.level.objects.filter(o => o.id !== hit.id),
    };
    this.state.selectedObjectIds.delete(hit.id);
  }

  deleteSelected(): void {
    if (this.state.selectedObjectIds.size === 0) return;
    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: this.state.level.objects.filter(
        o => !this.state.selectedObjectIds.has(o.id)
      ),
    };
    this.state.selectedObjectIds.clear();
  }

  // ─── Selection ───────────────────────────────────────────────────────────
  selectAt(worldX: number, worldY: number, additive = false): void {
    const hit = this.hitTest(worldX, worldY);
    if (!additive) this.state.selectedObjectIds.clear();
    if (hit) this.state.selectedObjectIds.add(hit.id);
  }

  selectAll(): void {
    this.state.level.objects.forEach(o => this.state.selectedObjectIds.add(o.id));
  }

  clearSelection(): void {
    this.state.selectedObjectIds.clear();
  }

  // ─── Hit test ────────────────────────────────────────────────────────────
  hitTest(worldX: number, worldY: number): LevelObject | null {
    for (let i = this.state.level.objects.length - 1; i >= 0; i--) {
      const o = this.state.level.objects[i];
      if (worldX >= o.x && worldX < o.x + o.w && worldY >= o.y && worldY < o.y + o.h) {
        return o;
      }
    }
    return null;
  }

  // ─── Move selected ────────────────────────────────────────────────────────
  moveSelected(dx: number, dy: number): void {
    if (this.state.selectedObjectIds.size === 0) return;
    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: this.state.level.objects.map(o =>
        this.state.selectedObjectIds.has(o.id)
          ? { ...o, x: o.x + dx, y: o.y + dy }
          : o
      ),
    };
  }

  // ─── Duplicate selected ──────────────────────────────────────────────────
  duplicateSelected(): void {
    const selected = this.state.level.objects.filter(
      o => this.state.selectedObjectIds.has(o.id)
    );
    if (selected.length === 0) return;
    this.pushUndo();
    const copies = selected.map(o => ({ ...o, id: newId(), x: o.x + TILE, y: o.y + TILE }));
    this.state.level = {
      ...this.state.level,
      objects: [...this.state.level.objects, ...copies],
    };
    this.state.selectedObjectIds.clear();
    copies.forEach(c => this.state.selectedObjectIds.add(c.id));
  }

  // ─── Flip ─────────────────────────────────────────────────────────────────
  flipSelectedX(): void {
    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: this.state.level.objects.map(o =>
        this.state.selectedObjectIds.has(o.id)
          ? { ...o, flipX: !o.flipX }
          : o
      ),
    };
  }

  flipSelectedY(): void {
    this.pushUndo();
    this.state.level = {
      ...this.state.level,
      objects: this.state.level.objects.map(o =>
        this.state.selectedObjectIds.has(o.id)
          ? { ...o, flipY: !o.flipY }
          : o
      ),
    };
  }

  // ─── Camera ───────────────────────────────────────────────────────────────
  scrollCamera(dx: number): void {
    this.state.cameraX = Math.max(0, this.state.cameraX + dx);
  }

  setZoom(z: number): void {
    this.state.zoom = Math.max(0.25, Math.min(3, z));
  }

  // ─── Level metadata ──────────────────────────────────────────────────────
  updateMeta(patch: Partial<Level>): void {
    this.state.level = { ...this.state.level, ...patch };
    this.state.unsaved = true;
  }

  // ─── Add practice checkpoint ─────────────────────────────────────────────
  addCheckpoint(worldX: number): void {
    this.pushUndo();
    const cps = [...this.state.level.practiceCheckpoints, worldX].sort((a, b) => a - b);
    this.state.level = { ...this.state.level, practiceCheckpoints: cps };
  }

  // ─── Export ──────────────────────────────────────────────────────────────
  export(): string {
    return JSON.stringify(this.state.level, null, 2);
  }

  import(json: string): boolean {
    try {
      const parsed = JSON.parse(json);
      if (!parsed.id || !parsed.objects) return false;
      this.pushUndo();
      this.state.level = parsed as Level;
      this.state.unsaved = false;
      return true;
    } catch {
      return false;
    }
  }

  markSaved(): void {
    this.state.unsaved = false;
  }

  get level(): Level { return this.state.level; }
  get canUndo(): boolean { return this.undoStack.length > 0; }
  get canRedo(): boolean { return this.redoStack.length > 0; }
  get objectCount(): number { return this.state.level.objects.length; }
}
