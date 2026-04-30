'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorEngine } from '@/lib/game/editor/editorEngine';
import type { Level, ObjectType, EditorTool } from '@/lib/game/types';
import { TILE, VIEW_H, GROUND_Y, CEILING_Y, C } from '@/lib/game/constants';
import { renderObject, renderBackground, renderGround } from '@/lib/game/renderer/renderer';

const PALETTE_GROUPS: { label: string; types: ObjectType[] }[] = [
  { label: 'Blocks', types: ['block', 'block_half', 'block_slope_ul', 'block_slope_ur'] },
  { label: 'Hazards', types: ['spike', 'spike_down', 'saw'] },
  { label: 'Orbs', types: ['orb_yellow', 'orb_blue', 'orb_pink', 'orb_green', 'orb_red'] },
  { label: 'Pads', types: ['pad_yellow', 'pad_pink', 'pad_red'] },
  { label: 'Portals', types: ['portal_cube', 'portal_ship', 'portal_ball', 'portal_ufo', 'portal_wave', 'portal_robot', 'portal_gravity', 'portal_speed_fast', 'portal_speed_faster'] },
  { label: 'Other', types: ['coin', 'checkpoint', 'end_trigger'] },
];

interface Props {
  initialLevel?: Level;
  onBack: () => void;
  onTest: (level: Level) => void;
  onSave: (level: Level) => void;
}

export default function LevelEditorUI({ initialLevel, onBack, onTest, onSave }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const editorRef = useRef<EditorEngine>();
  const [, forceUpdate] = useState(0);
  const [activeTool, setActiveTool] = useState<EditorTool>('place');
  const [selectedType, setSelectedType] = useState<ObjectType>('block');
  const [mouseWorld, setMouseWorld] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Init editor
  useEffect(() => {
    editorRef.current = new EditorEngine(initialLevel);
    renderFrame();
  }, []);

  const refresh = useCallback(() => {
    forceUpdate(n => n + 1);
    renderFrame();
  }, []);

  function renderFrame() {
    const canvas = canvasRef.current;
    const ed = editorRef.current;
    if (!canvas || !ed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { zoom, cameraX } = ed.state;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(-cameraX, 0);

    // Background
    const level = ed.state.level;
    renderBackground(ctx, cameraX, level.bgColorTop, level.bgColorBot);
    renderGround(ctx, level.groundColor, level.lineColor, false);

    // Grid
    if (ed.state.showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      const startCol = Math.floor(cameraX / TILE);
      const endCol = startCol + Math.ceil(canvas.width / zoom / TILE) + 1;
      for (let c = startCol; c <= endCol; c++) {
        ctx.beginPath();
        ctx.moveTo(c * TILE, 0);
        ctx.lineTo(c * TILE, VIEW_H);
        ctx.stroke();
      }
      for (let r = 0; r <= VIEW_H / TILE; r++) {
        ctx.beginPath();
        ctx.moveTo(cameraX, r * TILE);
        ctx.lineTo(cameraX + canvas.width / zoom, r * TILE);
        ctx.stroke();
      }
    }

    // Objects
    for (const obj of level.objects) {
      renderObject(ctx, obj, cameraX, 0);
      // Selection highlight
      if (ed.state.selectedObjectIds.has(obj.id)) {
        const sx = obj.x - cameraX;
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(sx - 2, obj.y - 2, obj.w + 4, obj.h + 4);
      }
    }

    // Mouse cursor object ghost
    if (activeTool === 'place') {
      ctx.globalAlpha = 0.4;
      const ghostX = ed.state.snapToGrid
        ? Math.round(mouseWorld.x / TILE) * TILE
        : mouseWorld.x;
      const ghostY = ed.state.snapToGrid
        ? Math.round(mouseWorld.y / TILE) * TILE
        : mouseWorld.y;
      const dims = { w: TILE, h: TILE };
      const ghost: import('@/lib/game/types').LevelObject = {
        id: -1, type: selectedType, x: ghostX, y: ghostY,
        w: dims.w, h: dims.h,
      };
      renderObject(ctx, ghost, cameraX, 0);
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  // Re-render on state change
  useEffect(() => { renderFrame(); });

  function canvasCoords(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const ed = editorRef.current!;
    const x = (e.clientX - rect.left) / ed.state.zoom + ed.state.cameraX;
    const y = (e.clientY - rect.top) / ed.state.zoom;
    return { x, y };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!editorRef.current) return;
    const ed = editorRef.current;
    const { x, y } = canvasCoords(e);
    setIsDragging(true);

    if (activeTool === 'place') {
      ed.state.selectedObjectType = selectedType;
      ed.placeObject(x, y);
    } else if (activeTool === 'delete') {
      ed.deleteAt(x, y);
    } else if (activeTool === 'select') {
      ed.selectAt(x, y, e.shiftKey);
    }
    refresh();
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!editorRef.current) return;
    const { x, y } = canvasCoords(e);
    setMouseWorld({ x, y });

    if (isDragging) {
      if (activeTool === 'place') {
        editorRef.current.state.selectedObjectType = selectedType;
        editorRef.current.placeObject(x, y);
        refresh();
      } else if (activeTool === 'delete') {
        editorRef.current.deleteAt(x, y);
        refresh();
      }
    } else {
      renderFrame();
    }
  }

  function onMouseUp() { setIsDragging(false); }

  function onWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    if (!editorRef.current) return;
    if (e.ctrlKey || e.metaKey) {
      editorRef.current.setZoom(editorRef.current.state.zoom - e.deltaY * 0.001);
    } else {
      editorRef.current.scrollCamera(e.deltaY * 2);
    }
    refresh();
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const ed = editorRef.current;
      if (!ed) return;
      if (e.ctrlKey && e.key === 'z') { ed.undo(); refresh(); }
      if (e.ctrlKey && e.key === 'y') { ed.redo(); refresh(); }
      if (e.key === 'Delete' || e.key === 'Backspace') { ed.deleteSelected(); refresh(); }
      if (e.ctrlKey && e.key === 'd') { e.preventDefault(); ed.duplicateSelected(); refresh(); }
      if (e.key === 'g') { ed.state.showGrid = !ed.state.showGrid; refresh(); }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [refresh]);

  const ed = editorRef.current;

  return (
    <div className="absolute inset-0 flex" style={{ background: '#0d0d1a' }}>
      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          width={1200} height={VIEW_H}
          className="w-full h-full cursor-crosshair"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onWheel={onWheel}
          style={{ display: 'block' }}
        />

        {/* Top toolbar */}
        <div className="absolute top-3 left-3 right-3 flex gap-2 items-center">
          <button onClick={onBack}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
            ← Back
          </button>
          <div className="flex gap-1 rounded-lg overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
            {(['select', 'place', 'delete'] as EditorTool[]).map(t => (
              <button key={t} onClick={() => setActiveTool(t)}
                      className="px-3 py-1.5 text-xs font-medium transition-all capitalize"
                      style={{
                        background: activeTool === t ? '#22c55e' : 'transparent',
                        color: activeTool === t ? '#000' : 'rgba(255,255,255,0.6)',
                      }}>
                {t === 'select' ? '↖ Select' : t === 'place' ? '✦ Place' : '✕ Delete'}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <button onClick={() => { if (ed) onTest(ed.level); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
              ▶ Test
            </button>
            <button onClick={() => { if (ed) { onSave(ed.level); ed.markSaved(); refresh(); } }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: '#22c55e', color: '#000' }}>
              Save
            </button>
          </div>
        </div>

        {/* Object info */}
        <div className="absolute bottom-3 left-3 text-xs font-mono"
             style={{ color: 'rgba(255,255,255,0.4)' }}>
          World: ({Math.round(mouseWorld.x)}, {Math.round(mouseWorld.y)}) |
          Tile: ({Math.floor(mouseWorld.x / TILE)}, {Math.floor(mouseWorld.y / TILE)}) |
          Objects: {ed?.objectCount ?? 0}
          {ed?.state.unsaved && ' — Unsaved changes'}
        </div>
      </div>

      {/* Right panel: palette */}
      <div className="w-52 flex flex-col overflow-y-auto"
           style={{ background: 'rgba(0,0,0,0.6)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="p-3 border-b border-white/10">
          <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider">Objects</h3>
        </div>

        {PALETTE_GROUPS.map(group => (
          <div key={group.label} className="border-b border-white/5">
            <div className="px-3 py-1.5 text-white/30 text-[10px] uppercase tracking-wider">
              {group.label}
            </div>
            <div className="px-2 pb-2 flex flex-wrap gap-1">
              {group.types.map(type => (
                <button
                  key={type}
                  onClick={() => { setSelectedType(type); setActiveTool('place'); }}
                  title={type}
                  className="w-10 h-10 rounded text-[9px] text-center transition-all"
                  style={{
                    background: selectedType === type && activeTool === 'place'
                      ? 'rgba(34,197,94,0.3)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedType === type && activeTool === 'place'
                      ? '1px solid #22c55e'
                      : '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                  {typeIcon(type)}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Level settings */}
        <div className="p-3 border-t border-white/10 mt-auto">
          <h3 className="text-white/70 text-xs font-bold uppercase tracking-wider mb-2">Settings</h3>
          <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer mb-2">
            <input type="checkbox"
                   checked={ed?.state.showGrid ?? true}
                   onChange={e => { if (ed) { ed.state.showGrid = e.target.checked; refresh(); } }}
            />
            Show Grid (G)
          </label>
          <label className="flex items-center gap-2 text-xs text-white/50 cursor-pointer">
            <input type="checkbox"
                   checked={ed?.state.snapToGrid ?? true}
                   onChange={e => { if (ed) { ed.state.snapToGrid = e.target.checked; } }}
            />
            Snap to Grid
          </label>
        </div>

        {/* Shortcuts */}
        <div className="p-3 text-[10px] text-white/25 leading-relaxed border-t border-white/5">
          Ctrl+Z Undo<br/>
          Ctrl+D Duplicate<br/>
          Del Delete<br/>
          G Toggle grid<br/>
          Scroll Scroll<br/>
          Ctrl+Scroll Zoom
        </div>
      </div>
    </div>
  );
}

function typeIcon(type: ObjectType): string {
  const icons: Partial<Record<ObjectType, string>> = {
    block: '■', block_half: '▬', block_slope_ul: '◤', block_slope_ur: '◥',
    spike: '▲', spike_down: '▼', saw: '⚙',
    orb_yellow: '●', orb_blue: '●', orb_pink: '●', orb_green: '●', orb_red: '●',
    pad_yellow: '⬛', pad_pink: '⬛', pad_red: '⬛',
    portal_cube: '◈', portal_ship: '◈', portal_ball: '◈', portal_ufo: '◈',
    portal_wave: '◈', portal_robot: '◈', portal_gravity: '↕',
    portal_speed_fast: '▶▶', portal_speed_faster: '▶▶▶',
    coin: '◉', checkpoint: '⚑', end_trigger: '|',
  };
  return icons[type] ?? '?';
}
