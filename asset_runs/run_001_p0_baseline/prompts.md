# Run 001 Prompts

所有生成都使用同一美术约束：

```text
Style: three-quarter top-down 2D pixel art for a modern Chinese countryside farming RPG.
Mood: warm, fresh, lived-in, contemporary rural China.
Grid: 16x16 pixel tile alignment.
Character size: 16x32 pixels, feet occupy a 16x16 logic footprint.
Rendering: crisp pixel art, no painterly brushwork, no soft gradients, no 3D render, no isometric diamond map.
Text rule: do not draw readable text; use blank signboards and blank paper surfaces.
Avoid: medieval fantasy, European cottage style, cyberpunk neon, fake Chinese text, watermark, logo, blurry antialiasing.
```

## 1. 视觉基准板

```text
Create a compact pixel art visual benchmark board for a modern Chinese countryside farming RPG.
Include separate labeled-looking but textless asset samples arranged on a clean neutral background: spring grass tile, warm brown soil tile, blue-green pond water tile, medium-brown wood sample, corner of a renovated rural Chinese farmhouse, 16x32 player character facing down, small shipping box, blank village notice board, one village NPC, one 16x16 UI tool icon.
Style: three-quarter top-down 2D pixel art, detailed but clean, Stardew Valley-like readability.
Use one consistent palette, consistent light direction, and consistent pixel density.
No readable text, no watermark, no full map scene, no 3D render, no isometric diamond view.
```

## 2. P0 小 tilesheet

```text
Create a small pixel art tile sheet for a modern Chinese countryside farming RPG.
Grid: exact 16x16 pixel tiles, aligned to a visible grid.
Content: spring grass base tile, grass variation tile, dirt path center tile, dirt path edge tile, dry tilled soil tile, wet tilled soil tile.
Style: three-quarter top-down 2D pixel art, clean readable game tiles, consistent palette.
The dry and wet soil must be clearly different at game size.
No objects, no crops, no buildings, no text, no full scene background.
```

## 3. 玩家向下基础帧

```text
Create a 16x32 pixel art player character sprite sheet for a modern Chinese countryside farming RPG.
Character: young returning college student, practical countryside clothing, friendly but not chibi.
Frames: facing down idle frame plus 4 walking frames facing down.
The feet center must stay at the same pivot location across frames.
The character uses a 16x16 logic footprint at the feet, with body extending upward.
Transparent or flat chroma-key background, crisp pixel edges, readable silhouette.
No tool animation yet, no portrait, no oversized head, no isometric diamond angle, no 3D render.
```

## 4. 核心交互物

```text
Create small pixel art object sprites for a modern Chinese countryside farming RPG.
Objects: shipping box, blank village notice board, simple pond water pickup point or wooden water post.
View: three-quarter top-down 2D.
Grid: align to 16x16 pixels. Shipping box fits 16x16 or 16x24. Notice board fits 32x32 or 32x48. Water pickup point fits 32x16 or 32x32.
Each object must have a clear bottom edge for Y-sort and a readable silhouette at game size.
Blank paper and blank sign surfaces only, no readable text.
Transparent or flat chroma-key background, no cast shadow baked into terrain.
```

## 5. UI 工具栏

```text
Create a compact pixel art UI toolbar for a farming RPG.
Content: 6 empty item slots, one selected slot state, small 16x16 icons for hoe, watering can, seed bag, and hand/harvest action.
Style: crisp pixel UI, readable at small size, warm rural color palette, not vector-flat, not realistic.
Transparent background or simple flat background.
No text, no numbers, no watermark.
```
