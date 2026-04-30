# Rhythm Dash — Architecture

## Vue d'ensemble

Clone spirituel de Geometry Dash, intégré dans Next.js 14 App Router.
Route : `/game`

## Stack technique

- **Rendu** : HTML5 Canvas 2D (800×480 virtuels, scalé pour remplir l'écran)
- **Physique** : boucle fixe 60 Hz, `requestAnimationFrame` + accumulateur
- **Audio** : Web Audio API (oscillateurs procéduraux + synchronisation BPM)
- **UI** : React + Tailwind (menus par-dessus le canvas)
- **Persistance** : `localStorage` via `SaveSystem`

---

## Structure des fichiers

```
src/
  lib/game/
    constants.ts          Constantes globales (TILE, GRAVITY, couleurs…)
    types.ts              Tous les types TypeScript

    engine/
      input.ts            InputManager — clavier/souris/tactile
      collision.ts        AABB, détection hazards/solides/orbes/portails
      gameEngine.ts       Moteur principal : boucle, physique, collisions

    modes/
      index.ts            updateCube / updateShip / updateBall / updateUFO /
                          updateWave / updateRobot / updateSpider / updateSwing
                          applyMode(), applyOrbEffect(), applyPadEffect()

    audio/
      audioManager.ts     AudioManager — lecture, BPM, SFX procéduraux

    renderer/
      particleSystem.ts   Système de particules (mort, orbe, traînée…)
      renderer.ts         Fonctions de rendu Canvas (bg, sol, objets, joueur)

    levels/
      levelBuilder.ts     Helpers de construction de niveau (grille → pixels)
      level1.ts           "Stereo Foundation" — Easy
      level2.ts           "Neon Rush" — Normal (cube→ship→ball)
      level3.ts           "Gravity Storm" — Hard (wave/ufo/gravité inversée)
      levelRegistry.ts    BUILT_IN_LEVELS, getLevelById()

    editor/
      editorEngine.ts     EditorEngine — placement, undo/redo, import/export

    persistence/
      saveSystem.ts       loadSave(), writeSave(), recordLevelComplete()…

    __tests__/
      collision.test.ts   Tests unitaires collision
      physics.test.ts     Tests unitaires modes/physique
      levels.test.ts      Intégrité des données de niveaux
      editor.test.ts      Tests éditeur

  components/game/
    GameCanvas.tsx        Canvas + montage engine React
    MainMenu.tsx          Sélection de niveau, stats
    LevelComplete.tsx     Écran fin de niveau
    LevelEditorUI.tsx     Interface éditeur complète

  app/game/
    page.tsx              Page principale (FSM screens)
    layout.tsx            Layout plein écran
```

---

## Boucle de jeu

```
requestAnimationFrame → accumulate dt → while(acc >= DT) update() → render()

update():
  1. applyMode(player, input)   → vy selon mode
  2. player.worldX += speedPx   → scroll horizontal
  3. player.worldY += vy        → mouvement vertical
  4. resolveWorldBounds()       → sol/plafond
  5. processObjects()           → collisions, portails, orbes, pièces
  6. check win                  → worldX >= level.length
  7. particles.update()
  8. input.flush()

render():
  1. renderBackground()         → gradient + étoiles parallaxe
  2. renderGround()             → sol et plafond
  3. renderObject() × N         → objets du niveau
  4. particles.render()
  5. renderPlayer()             → joueur (dessin selon mode)
  6. renderProgressBar()        → barre de progression
```

---

## Système de coordonnées

- **Monde** : x augmente vers la droite, y augmente vers le bas
- **Sol** : `worldY = GROUND_Y = 400px`
- **Plafond** : `worldY = CEILING_Y = 80px`
- **Joueur** : toujours à `screenX = 200px` — c'est le monde qui défile
- **Caméra** : `cameraX = player.worldX - 200`

---

## Modes de jeu

| Mode    | Mécanisme                                  |
|---------|--------------------------------------------|
| Cube    | Saut au sol sur pression                   |
| Ship    | Maintien = monte, relâche = descend        |
| Ball    | Pression = inverse la gravité              |
| UFO     | Impulsion à chaque pression (midair OK)    |
| Wave    | Maintien = diagonale haut, relâche = bas   |
| Robot   | Maintien charge la hauteur du saut         |
| Spider  | Pression = téléportation sol↔plafond       |
| Swing   | Alternance de direction à chaque pression  |

---

## Format de niveau

```typescript
interface Level {
  id: string;
  name: string;
  difficulty: Difficulty;      // easy → demon_extreme
  musicBpm: number;
  startMode: GameMode;
  startGravity: 1 | -1;
  startSpeed: number;          // pixels/frame
  objects: LevelObject[];      // plateforme, danger, orbe, portail…
  practiceCheckpoints: number[]; // worldX des checkpoints pratique
  length: number;              // pixels jusqu'à end_trigger
}
```

---

## Étendre le jeu

### Ajouter un mode de jeu
1. Ajouter le type dans `types.ts` → `GameMode`
2. Écrire `updateMyMode(p, input)` dans `modes/index.ts`
3. Ajouter le case dans `applyMode()`
4. Ajouter `renderMyMode()` dans `renderer/renderer.ts`
5. Ajouter le portail correspondant (`portal_mymode`) dans les types

### Ajouter un type d'objet
1. Ajouter le type dans `types.ts` → `ObjectType`
2. Ajouter les defaults dans `editor/editorEngine.ts` → `OBJECT_DEFAULTS`
3. Ajouter le rendu dans `renderer/renderer.ts` → `renderObject()`
4. Ajouter la détection dans `engine/collision.ts` si nécessaire
5. Gérer l'effet dans `engine/gameEngine.ts` → `processObjects()`

### Ajouter un niveau
1. Créer `levels/myLevel.ts` (suivre le pattern de `level1.ts`)
2. L'ajouter dans `levels/levelRegistry.ts` → `BUILT_IN_LEVELS`

### Tests
```bash
npx vitest run src/lib/game/__tests__/
```

---

## Performance

- Broad-phase : seuls les objets dans la fenêtre de la caméra ±80px sont traités
- Particules : pool de 400 max, réutilisation des slots morts
- Canvas : `setTransform` pour le scaling, pas de re-création de contexte
