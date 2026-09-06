# Run 019 Building Tileset Result

Status: generated a strict 32x32 modular building tileset and assembled four test buildings.

## Outputs

| File | Purpose |
| --- | --- |
| `assets/pixel/buildings/building_tiles_32_v1.png` | 8x8 tilesheet, 64 tiles, each 32x32 |
| `asset_runs/run_019_building_tileset/building_tile_rules.json` | Tile ids, naming, recipes, and join rules |
| `asset_runs/run_019_building_tileset/building_tiles_32_v1.tsj` | Tiled external tileset |
| `asset_runs/run_019_building_tileset/test_buildings.tmj` | Tiled map with four assembled buildings |
| `asset_runs/run_019_building_tileset/test_buildings_preview.png` | Rendered preview of cottage, farmhouse, barn, and shop |
| `asset_runs/run_019_building_tileset/contact_sheet.png` | Tilesheet plus preview overview |
| `asset_runs/run_019_building_tileset/validation.json` | Size and file validation |

## Rule Summary

- Tile size is fixed at 32x32.
- Roof, wall, foundation, porch, prop, and shadow groups are separated.
- Corners are explicit tiles; middle tiles repeat horizontally.
- Doors and windows are replacement wall tiles, so they still snap to the same grid.
- The test map uses the same source PNG through a Tiled `.tsj` tileset.

## Current Art Quality

This pass prioritizes strict modularity over final art polish. The tiles can be sliced and assembled predictably, but the roof/body language can still be refined after checking the Tiled preview.
