# Tom's Village — Phase notes / deferred ideas

Do not implement these in the prototype. Capture useful ideas here instead.

## Decisions / divergences

- PoC starts **in the village**, not on the overworld continent (overworld map data retained under `src/world/mapdata.ts` for a later warp-out).
- Tom uses the attached character sheet (`public/sprites/tom.png`, 32×48 frames) instead of the procedural hero.
- Terrain art is **CC0 Puny World** (Shade); houses are composited atlas overlays.
- Internal resolution remains **512×448** with **16×16** tiles.

## Possible later

- Step onto a road edge / gate to warp back to the overworld
- Enter house interiors
- Sound / music (chip-tune village theme)
- Menus, inventory, combat (the cloaked NPC is waiting)
- Day/night, weather
- Settings screen
