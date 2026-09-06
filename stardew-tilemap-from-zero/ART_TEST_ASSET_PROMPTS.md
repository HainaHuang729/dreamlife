# Art Test Asset Prompts

这份清单用于生成第一批可评审测试素材。每个素材都必须遵守 `ART_ASSET_SIZE_BIBLE.md`，先看风格和尺寸，不急于接入游戏。

注意：文档里早期人物示例的 `32x40` 是 legacy 占位规格。当前玩家和村民运行时人物规格已统一到 `96x120`、脚点 `(48,108)`；新生成人物素材优先使用 `ART_ASSET_SIZE_BIBLE.md` 的最新人物规格。

## Batch A: Ground Tiles

### `tiles/grass_spring`

```text
Create a pixel art tile sheet for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset ids: grass_spring_a, grass_spring_b, grass_spring_c, grass_spring_flower.
Tile size: each tile is exactly 32x32 px.
Layout: 4 tiles in one row on a transparent or flat neutral background, with clear 1 px spacing.
Style: crisp square pixel art, warm clean modern rural China, high readability, no painterly blur.
Subject: spring grass variants with small weeds, tiny white/yellow wildflowers, short diagonal blades, subtle darker grass patches.
Palette: low-saturation fresh green, soft yellow flower accents, no neon green.
Constraints: no text labels, no UI, no watermark, no anti-aliased blur.
```

### `tiles/path_dirt`

```text
Create a pixel art dirt path tile sheet for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset ids: path_dirt_center, path_dirt_edge_north, path_dirt_edge_side, path_dirt_corner, path_dirt_stones.
Tile size: each tile is exactly 32x32 px.
Layout: 5 tiles in one row on a transparent or flat neutral background, with clear 1 px spacing.
Style: crisp square pixel art, warm rural China, readable at 32px scale.
Subject: compacted earth path, broken grass edges, tiny stones, subtle footprints or cart marks.
Palette: warm tan, muted brown, small gray stones, compatible with spring grass.
Constraints: no text labels, no UI, no watermark, no painterly texture.
```

### `tiles/field_tilled`

```text
Create a pixel art farm soil tile sheet for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset ids: field_dry, field_wet, field_seeded, field_sprout.
Tile size: each tile is exactly 32x32 px.
Layout: 4 tiles in one row on a transparent or flat neutral background.
Style: crisp square pixel art, 32px tile readability, no painterly blur.
Subject: tilled field with furrows, dry soil, wet darker soil, seed dots, tiny green sprout.
Palette: warm earth brown, darker wet brown, small muted green sprout.
Constraints: no labels, no UI, no watermark.
```

## Batch B: Key Props

### `objects/shipping_box`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: shipping_box.
Canvas size: 32x40 px.
Map footprint: 1x1 tile, 32 px per tile.
Anchor: bottom-center, with feet/base aligned to the tile bottom.
Style: crisp square pixel art, warm rural China, readable at small size.
Subject: wooden farm shipping box with dark outline, slightly open lid, small red shipping stamp block, sturdy front face.
Collision expectation: one tile blocked.
Background: transparent, no cast shadow outside sprite, no text label, no watermark.
```

### `objects/old_pump`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: old_pump.
Canvas size: 32x48 px.
Map footprint: 1x1 tile, 32 px per tile.
Anchor: bottom-center.
Style: crisp square pixel art, modern Chinese village utility object, no painterly blur.
Subject: old blue-gray metal water pump on a small concrete base, curved handle, small water spout, slightly worn but readable.
Collision expectation: one tile blocked, interaction from front.
Background: transparent, no label, no watermark.
```

### `objects/notice_board`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: notice_board.
Canvas size: 64x64 px.
Map footprint: 2x1 tiles, 32 px per tile.
Anchor: bottom-left.
Style: crisp square pixel art, warm rural China, readable at 32px tile scale.
Subject: village notice board with two wooden posts, dark brown frame, several yellow and white paper notices, one small red stamp-like block.
Collision expectation: both footprint tiles blocked.
Background: transparent, no readable text, no UI, no watermark.
```

### `objects/earth_shrine`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: earth_shrine.
Canvas size: 64x64 px.
Map footprint: 2x1 tiles, 32 px per tile.
Anchor: bottom-left.
Style: crisp square pixel art, respectful small countryside shrine, warm and grounded, not fantasy.
Subject: small earth god shrine with muted red tile roof, stone-gray base, cream plaque area without readable text, tiny incense stand in front.
Collision expectation: both footprint tiles blocked.
Background: transparent, no label, no watermark.
```

## Batch C: Medium Facilities

### `objects/ecommerce_corner`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: ecommerce_corner.
Canvas size: 96x80 px.
Map footprint: 3x2 tiles, 32 px per tile.
Anchor: bottom-left.
Style: crisp square pixel art, warm modern Chinese village, readable and not cluttered.
Subject: e-commerce farm produce corner with low shelf, stacked cardboard boxes, a few vegetable crates, a simple QR-sign-like square block, blue plastic stool, small packing tape accent.
Collision expectation: bottom row blocked; front edge is interaction side.
Background: transparent, no readable text, no watermark.
```

### `objects/packaging_table`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: packaging_table.
Canvas size: 64x48 px.
Map footprint: 2x1 tiles, 32 px per tile.
Anchor: bottom-left.
Style: crisp square pixel art, clean rural work table, high readability.
Subject: wooden packaging table with produce boxes, small scale, sticker sheets, paper labels represented as pixel blocks.
Collision expectation: both footprint tiles blocked.
Background: transparent, no readable text, no watermark.
```

## Batch D: Buildings

### `objects/seed_shop`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: seed_shop.
Canvas size: 128x112 px.
Map footprint: 4x3 tiles, 32 px per tile.
Anchor: bottom-left, with bottom edge aligned to the footprint bottom.
Style: crisp square pixel art, warm clean modern rural China, readable at 32px tile scale, no painterly blur.
Subject: small village seed shop, muted red tile roof, cream wall, striped awning, seed crates near the front, centered door on the bottom row.
Collision expectation: lower two footprint rows are blocked; roof may visually extend upward.
Background: transparent, no shadow outside the sprite, no text label, no watermark.
```

### `objects/farmhouse_small`

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: farmhouse_small.
Canvas size: 128x128 px.
Map footprint: 4x3 tiles, 32 px per tile.
Anchor: bottom-left.
Style: crisp square pixel art, clean contemporary Chinese countryside, warm and readable.
Subject: small starter farmhouse with muted red tiled roof, cream plaster walls, dark wooden door, simple window frames, small concrete doorstep, a few practical rural details such as bucket or broom.
Collision expectation: lower two footprint rows blocked; door and doorstep on bottom row.
Background: transparent, no text, no watermark.
```

### `art-0.2.7` fixed map building prompt rule

```text
Use the camera angle of a top-down farming RPG: the front facade faces the player/screen, the roof top plane is visible from above, vertical walls are short, and side wall depth is minimal.
Do not use isometric 45-degree perspective, three-quarter corner perspective, pure side view, or thick 3D render perspective.
For map-baked buildings, generate one full building sprite, not separate roof/wall/door tiles. Keep the whole building centered on a flat chroma-key background for transparency cleanup.
```

### `art-0.2.8` AI terrain atlas rule

```text
Generate AI pixel-art terrain tiles from the current color-block terrain only as a palette and category reference.
Do not generate roof tiles in this terrain batch.
Atlas columns: grass, deepGrass, dirt, path, water, floor, wall.
Rows: base, alt1, alt2.
Every tile must be top-down, seamless, borderless, with no text, no black grid lines, no hard outline, and no repeated decorative object that becomes obvious when tiled.
```

### `art-0.2.11` terrain mask rule

```text
Generate or derive Stardew-like terrain edge tiles from the existing AI terrain source, not from flat color blocks.
Asset ids: dirt--m0 through dirt--m15, path--m0 through path--m15, water--m0 through water--m15, floor--m0 through floor--m15, wall--m0 through wall--m15.
Tile size: every PNG is exactly 32x32 px.
Mask bits: north=1, east=2, south=4, west=8. m15 is the full center tile; lower masks expose grass or deep grass around missing sides.
Style: crisp top-down farming RPG pixel terrain, warm contemporary Chinese countryside, same pixel density as art-0.2.8.
Constraints: no roof tiles, no tree roots, no black grid lines, no magenta/pink placeholder edges, no text labels, no anti-aliased blur.
Layer rule: wall masks represent mountain rock ground edges only; building roofs, walls, houses, and trees must be generated as independent object sprites.
```

### `art-0.2.13` terrain density correction rule

```text
Refine the terrain set for lower repetition and less visible grid structure.
Asset ids: grass/deepGrass/dirt/path/water/floor/wall base, alt1, alt2; deepGrass/dirt/path/water/floor/wall m0 through m15.
Tile size: every PNG is exactly 32x32 px.
Center rule: full center areas should use base/alt variants chosen by map coordinates; masks are for edges and corners.
Visual fixes: grass must avoid obvious stamped leaf clusters, deepGrass must blend into grass with organic edges, water must use short horizontal waves instead of diagonal stripes, floor joints must be low contrast and broken rather than a tile grid, path speckles must be sparse.
Constraints: no roof tiles, no tree roots, no black grid lines, no magenta/pink placeholder edges, no text labels, no anti-aliased blur.
```

## Batch E: Characters

动作帧不生成 sprite sheet。每一帧都是一个独立透明 PNG，方便逐帧修改、替换和验收。下面是第一批代表帧；同一动作的后续帧只替换 `Frame id` 和 `Pose` 描述。

### `player/idle_down_00`

```text
Create a single-frame transparent PNG pixel art character sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: player/idle_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: farmer standing idle facing down, relaxed neutral stance.
Style: crisp square pixel art, readable at small size, not anime portrait, no painterly blur.
Subject: young farmer in navy work jacket, dark pants, practical shoes, short black hair or simple straw-colored hat, warm skin tone.
Consistency: leave 2-4 px transparent space under feet for shadow; keep body centered for animation alignment.
Background: transparent, no label, no watermark.
```

### `player/walk_down_00`

```text
Create a single-frame transparent PNG pixel art character sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: player/walk_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: farmer facing down, first walking frame, left foot slightly forward, subtle arm counter-swing.
Style: crisp square pixel art, readable at small size, not anime portrait, no painterly blur.
Subject: same young farmer design as player/idle_down_00: navy work jacket, dark pants, practical shoes, short black hair or simple straw-colored hat.
Consistency: preserve the same head size, clothing colors, outline thickness, and feet anchor as idle_down_00.
Background: transparent, no label, no watermark.
```

### `player/hoe_down_00`

```text
Create a single-frame transparent PNG pixel art character sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: player/hoe_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: farmer facing down, beginning hoe swing, body leaning slightly forward, hoe handle visible but contained inside the 32x40 frame.
Style: crisp square pixel art, readable at small size, not anime portrait, no painterly blur.
Subject: same young farmer design as player/idle_down_00.
Consistency: preserve the same palette and feet anchor; tool silhouette must read clearly at 1x scale.
Background: transparent, no label, no watermark.
```

### `player/water_down_00`

```text
Create a single-frame transparent PNG pixel art character sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: player/water_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: farmer facing down, holding a small blue-gray watering can in front, pre-pour pose.
Style: crisp square pixel art, readable at small size, not anime portrait, no painterly blur.
Subject: same young farmer design as player/idle_down_00.
Consistency: preserve the same palette and feet anchor; watering can must be readable but not oversized.
Background: transparent, no label, no watermark.
```

### `npcs/shopkeeper_idle_down_00`

```text
Create a single-frame transparent PNG pixel art NPC sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: npcs/shopkeeper_idle_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: older village shopkeeper standing idle facing down, calm friendly posture.
Style: crisp square pixel art, warm rural China, readable at small size.
Subject: older village shopkeeper, practical muted green/brown clothes, gray hair, simple cloth shoes.
Consistency: leave 2-4 px transparent space under feet; keep silhouette distinct from player.
Background: transparent, no label, no watermark.
```

### `npcs/shopkeeper_talk_down_00`

```text
Create a single-frame transparent PNG pixel art NPC sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Frame id: npcs/shopkeeper_talk_down_00.
Canvas size: exactly 32x40 px.
Anchor: feet-center at roughly x=16, y=36.
Pose: same older shopkeeper facing down, one hand raised in a small talking gesture.
Style: crisp square pixel art, warm rural China, readable at small size.
Subject: same older village shopkeeper design as shopkeeper_idle_down_00.
Consistency: preserve clothing colors, head size, outline thickness, and feet anchor.
Background: transparent, no label, no watermark.
```
