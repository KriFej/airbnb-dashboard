// Level editor unit tests
import { describe, it, expect } from 'vitest';
import { EditorEngine, createDefaultLevel } from '../editor/editorEngine';
import { TILE } from '../constants';

describe('EditorEngine', () => {
  it('creates a default level', () => {
    const ed = new EditorEngine();
    expect(ed.level.id).toMatch(/^custom_/);
    expect(ed.level.objects.length).toBeGreaterThan(0);
    expect(ed.state.unsaved).toBe(false);
  });

  it('places an object', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    const count = ed.objectCount;
    ed.placeObject(5 * TILE, 9 * TILE);
    expect(ed.objectCount).toBe(count + 1);
    expect(ed.state.unsaved).toBe(true);
  });

  it('snap to grid works', () => {
    const ed = new EditorEngine();
    ed.state.snapToGrid = true;
    ed.state.selectedObjectType = 'spike';
    const obj = ed.placeObject(5 * TILE + 7, 9 * TILE + 12);
    // Should snap to nearest tile
    expect(obj?.x).toBe(5 * TILE);
    expect(obj?.y).toBe(9 * TILE);
  });

  it('prevents duplicate objects at same position', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    ed.placeObject(5 * TILE, 9 * TILE);
    const count = ed.objectCount;
    ed.placeObject(5 * TILE, 9 * TILE);  // same position
    expect(ed.objectCount).toBe(count);
  });

  it('deletes object at position', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    ed.placeObject(5 * TILE, 9 * TILE);
    const count = ed.objectCount;
    ed.deleteAt(5 * TILE + 10, 9 * TILE + 10);
    expect(ed.objectCount).toBe(count - 1);
  });

  it('undo/redo works', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    const initial = ed.objectCount;
    ed.placeObject(5 * TILE, 9 * TILE);
    expect(ed.objectCount).toBe(initial + 1);
    ed.undo();
    expect(ed.objectCount).toBe(initial);
    ed.redo();
    expect(ed.objectCount).toBe(initial + 1);
  });

  it('selects object at position', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    const obj = ed.placeObject(5 * TILE, 9 * TILE);
    expect(obj).not.toBeNull();
    ed.state.selectedObjectIds.clear();
    ed.selectAt(5 * TILE + 10, 9 * TILE + 10);
    expect(ed.state.selectedObjectIds.has(obj!.id)).toBe(true);
  });

  it('duplicates selected objects', () => {
    const ed = new EditorEngine();
    ed.state.selectedObjectType = 'block';
    const obj = ed.placeObject(5 * TILE, 9 * TILE);
    expect(obj).not.toBeNull();
    ed.state.selectedObjectIds.add(obj!.id);
    const count = ed.objectCount;
    ed.duplicateSelected();
    expect(ed.objectCount).toBe(count + 1);
  });

  it('exports valid JSON', () => {
    const ed = new EditorEngine();
    const json = ed.export();
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed.id).toBeDefined();
    expect(Array.isArray(parsed.objects)).toBe(true);
  });

  it('imports JSON successfully', () => {
    const ed1 = new EditorEngine();
    const json = ed1.export();
    const ed2 = new EditorEngine();
    const success = ed2.import(json);
    expect(success).toBe(true);
    expect(ed2.level.id).toBe(ed1.level.id);
  });

  it('rejects invalid import', () => {
    const ed = new EditorEngine();
    expect(ed.import('not valid json')).toBe(false);
    expect(ed.import(JSON.stringify({ foo: 'bar' }))).toBe(false);
  });

  it('updateMeta changes level properties', () => {
    const ed = new EditorEngine();
    ed.updateMeta({ name: 'Test Level', musicBpm: 180 });
    expect(ed.level.name).toBe('Test Level');
    expect(ed.level.musicBpm).toBe(180);
  });
});

describe('createDefaultLevel', () => {
  it('has required fields', () => {
    const level = createDefaultLevel();
    expect(level.id).toBeDefined();
    expect(level.name).toBeTruthy();
    expect(Array.isArray(level.objects)).toBe(true);
    expect(level.length).toBeGreaterThan(0);
    expect(level.startMode).toBe('cube');
  });
});
