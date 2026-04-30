// ─── Core primitives ─────────────────────────────────────────────────────────
export interface Vec2 { x: number; y: number }
export interface Rect { x: number; y: number; w: number; h: number }

// ─── Game modes ──────────────────────────────────────────────────────────────
export type GameMode =
  | 'cube' | 'ship' | 'ball' | 'ufo' | 'wave'
  | 'robot' | 'spider' | 'swing' | 'platformer';

// ─── Object types ─────────────────────────────────────────────────────────────
export type ObjectType =
  // Solids
  | 'block' | 'block_half' | 'block_slope_ul' | 'block_slope_ur'
  // Hazards
  | 'spike' | 'spike_down' | 'spike_left' | 'spike_right' | 'saw'
  // Orbs
  | 'orb_yellow' | 'orb_blue' | 'orb_pink' | 'orb_black' | 'orb_green' | 'orb_red'
  // Pads
  | 'pad_yellow' | 'pad_pink' | 'pad_red'
  // Mode portals
  | 'portal_cube' | 'portal_ship' | 'portal_ball' | 'portal_ufo'
  | 'portal_wave' | 'portal_robot' | 'portal_spider' | 'portal_swing'
  // Effect portals
  | 'portal_gravity' | 'portal_mini' | 'portal_normal_size' | 'portal_dual'
  | 'portal_speed_slow' | 'portal_speed_normal' | 'portal_speed_fast'
  | 'portal_speed_faster' | 'portal_speed_fastest'
  // Collectibles & utility
  | 'checkpoint' | 'coin' | 'end_trigger' | 'decoration';

// ─── Level object ─────────────────────────────────────────────────────────────
export interface LevelObject {
  id: number;
  type: ObjectType;
  x: number;       // world-space px (left edge)
  y: number;       // world-space px (top edge)
  w: number;       // px
  h: number;       // px
  angle?: number;  // degrees
  flipX?: boolean;
  flipY?: boolean;
  color?: string;
  solid?: boolean; // explicit override (false = trigger-only)
  groupId?: number;
  data?: Record<string, unknown>;
}

// ─── Player snapshot (for checkpoints / replays) ─────────────────────────────
export interface PlayerSnapshot {
  worldX: number;
  worldY: number;
  vy: number;
  mode: GameMode;
  gravDir: number;
  speedMult: number;
  isMini: boolean;
}

// ─── Level data ───────────────────────────────────────────────────────────────
export type Difficulty =
  | 'auto' | 'easy' | 'normal' | 'hard' | 'harder' | 'insane'
  | 'demon_easy' | 'demon' | 'demon_insane' | 'demon_extreme';

export interface LevelMeta {
  id: string;
  name: string;
  author: string;
  difficulty: Difficulty;
  stars: number;
  coinCount: number;       // 0–3
  musicId: string;
  musicBpm: number;
  musicOffset: number;    // seconds before beat 1
  bgColorTop: string;
  bgColorBot: string;
  groundColor: string;
  lineColor: string;
  length: number;         // total world width in px (end trigger X)
  version: number;
}

export interface Level extends LevelMeta {
  startMode: GameMode;
  startGravity: number;   // 1 = down, -1 = up
  startSpeed: number;     // speed multiplier key of SPEED_TABLE
  objects: LevelObject[];
  practiceCheckpoints: number[]; // worldX positions
}

// ─── Player state ────────────────────────────────────────────────────────────
export interface PlayerState {
  worldX: number;
  worldY: number;
  vy: number;
  mode: GameMode;
  gravDir: number;
  speedPx: number;        // horizontal speed in px/frame
  isMini: boolean;
  isGrounded: boolean;
  isCeilGrounded: boolean;// touching ceiling in inverted gravity
  angle: number;          // visual rotation degrees
  isDead: boolean;
  robotChargeTime: number;
  orbCooldown: number;    // frames since last orb use
  swingDir: number;       // +1 or -1 for swing mode
  prevX: number;          // X last frame (portal crossing detection)
}

// ─── Particles ────────────────────────────────────────────────────────────────
export type ParticleShape = 'square' | 'circle' | 'spark';
export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;    // 0..1 remaining
  size: number;
  color: string;
  shape: ParticleShape;
}

// ─── Game screen FSM ─────────────────────────────────────────────────────────
export type GameScreen =
  | 'main_menu' | 'level_select' | 'playing' | 'dead'
  | 'complete' | 'editor' | 'settings';

// ─── Top-level game state ────────────────────────────────────────────────────
export interface GameStateData {
  screen: GameScreen;
  level: Level | null;
  attempts: number;
  bestProgress: number;   // 0..1
  coinsCollected: boolean[];
  isPractice: boolean;
  practiceSnapshot: PlayerSnapshot | null;
}

// ─── Save data ───────────────────────────────────────────────────────────────
export interface SaveData {
  version: number;
  completedLevels: string[];
  starsPerLevel: Record<string, number>;
  coinsPerLevel: Record<string, boolean[]>;
  attemptsPerLevel: Record<string, number>;
  bestProgressPerLevel: Record<string, number>;
  customLevels: Level[];
  settings: {
    musicVolume: number;
    sfxVolume: number;
    showFps: boolean;
    practiceMode: boolean;
  };
}

// ─── Editor state ─────────────────────────────────────────────────────────────
export type EditorTool = 'select' | 'place' | 'delete' | 'trigger';
export interface EditorState {
  level: Level;
  tool: EditorTool;
  selectedObjectType: ObjectType;
  selectedObjectIds: Set<number>;
  cameraX: number;
  zoom: number;
  snapToGrid: boolean;
  showGrid: boolean;
  unsaved: boolean;
}
