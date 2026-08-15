# Overworld — Phase notes / deferred ideas

Do not implement these in the prototype. Capture useful ideas here instead.

## Decisions / divergences

- Internal resolution is **512×448** with **16×16** tiles (wider vista than SNES 256×224, closer to how FF overworlds feel on a phone).
- Terrain art is **CC0 Puny World** (Shade), not procedural — hand-painted tiles are what make 16-bit overworlds read as 16-bit.
- Towns, castles, and caves are **2×2 landmarks** composited from the atlas (grass keyed out) and drawn as overlays.
- Mobile scaling uses **max fit** (fractional OK) so the game fills phone width instead of a tiny integer letterbox.

## Possible later

- Stepping onto a town/cave/castle entrance warps into an interior map (destination ids already on landmarks)
- Sound / music
- NPCs, dialogue, menus, inventory, combat
- Day/night, weather
- Settings screen
