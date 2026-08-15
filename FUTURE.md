# Overworld — Phase notes / deferred ideas

Do not implement these in the prototype. Capture useful ideas here instead.

## Decisions / divergences

- Internal resolution is **512×448** with **16×16** tiles (wider vista than SNES 256×224, closer to how FF overworlds feel on a phone).
- Terrain art is **CC0 ArMM1998 Zelda-like** overworld + character (taller trees via Y-sorted overlays, multi-tile house/castle). Previous Puny World atlas kept in `public/tiles/` for reference only.
- Towns, castles, and caves are **2×2 ground footprints** with taller sprites overhanging north; drawn in a Y-sorted pass with the player.
- Mobile / portrait scaling uses **cover** (fill the screen, crop edges). Desktop landscape stays **contain**.
- D-pad hidden only for fine-pointer + hover (desktop), so iPads keep the control.
- Position persists in `localStorage` (`overworld.save.v2`); triple-tap the top-right corner to reset.

## Possible later

- Stepping onto a town/cave/castle entrance warps into an interior map (destination ids already on landmarks)
- True coast/path autotiles from the ArMM atlas edge set
- Sound / music
- NPCs, dialogue, menus, inventory, combat
- Day/night, weather
- Settings screen
- PWA install / offline (Phase 6)
