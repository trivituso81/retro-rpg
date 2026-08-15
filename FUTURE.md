# Overworld — Phase notes / deferred ideas

Do not implement these in the prototype. Capture useful ideas here instead.

## Decisions / divergences

- Internal resolution is **512×448** with **16×16** tiles (wider vista than SNES 256×224, closer to how FF overworlds feel on a phone).
- Terrain art is **CC0 Puny World** (Shade), not procedural — hand-painted tiles are what make 16-bit overworlds read as 16-bit.
- Towns, castles, and caves are **2×2 landmarks** composited from the atlas (grass keyed out) and drawn as overlays.
- Mobile / portrait scaling uses **cover** (fill the screen, crop edges) so the world isn't a tiny band with huge letterbox bars. Desktop landscape stays **contain**.
- Position persists in `localStorage` (`overworld.save.v1`); triple-tap the top-right corner to reset.

## Possible later

- Stepping onto a town/cave/castle entrance warps into an interior map (destination ids already on landmarks)
- Sound / music
- NPCs, dialogue, menus, inventory, combat
- Day/night, weather
- Settings screen
