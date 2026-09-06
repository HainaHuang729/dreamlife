# 项目动作精灵 Prompt

这份文件用于给本项目更新玩家动作动画。当前项目不是直接导入一整张大 sprite sheet，而是以稳定规格的单帧 PNG 作为源素材；需要预览或归档时，再由脚本拼成 contact sheet / sprite sheet。

## 项目接入规格

来自 `stardew-tilemap-from-zero/ART_ASSET_SIZE_BIBLE.md` 和 `stardew-tilemap-from-zero/src/main.js` 的当前约束：

- 地图网格：`32x32 px`。
- 玩家运行时帧画布：`96x120 px`。
- 玩家脚点锚点：每帧固定为 `(48, 108)`，运行时按脚点锚定绘制。
- 玩家基础动作 `idle/walk/run` 和常用工具动作已迁移到 `96x120 px` 多帧；旧 `32x40/64x80` 只作为 legacy 参考。
- 村民静态帧画布：`96x120 px`，脚点锚点为 `(48, 108)`。
- 当前玩家多帧加载路径：`stardew-tilemap-from-zero/assets/game/player/<action>_<direction>_<frame>.png`，缺帧时回退到 `<action>_<direction>.png`。
- 当前村民加载路径：`stardew-tilemap-from-zero/assets/game/npcs/<npcId>--<state>_<frame>.png`，缺帧时回退到 `<npcId>--<state>.png`；对话状态优先使用 `<npcId>--talk_down_00/01.png`。
- 大图 atlas 只作为源素材归档，运行时读取拆好的单帧 PNG。

当前代码会请求这些动作 ID：

```text
idle
walk
run
inspect
hoe
seeds
wateringCan
scythe
fishingRod
fishingCatch
harvest
sleep
warp
```

方向统一为：

```text
down, up, left, right
```

暂时不要把 `axe`、`pickaxe`、`carry`、`pickUp`、`putDown`、`hurt`、`faint`、`start`、`stop`、`turn` 作为当前运行时替换资源；这些可以先作为未来动作源素材生成，但不会被当前代码自动加载。

## 通用母 Prompt

每一帧都先带上这一段，再补充 `Frame id`、`Action`、`Direction` 和具体姿势。

```text
Create one single-frame transparent PNG pixel-art character sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.

Project constraints:
- Canvas size: exactly 96 x 120 px.
- The character feet-center anchor is fixed at x = 48, y = 108.
- Leave 2-4 px transparent space under the feet for a tiny optional shadow.
- Keep the same body height, head size, palette, outline thickness, and feet anchor as every other player frame.
- The character must fit fully inside the 96 x 120 canvas.
- Transparent background only.
- No sprite sheet, no grid, no labels, no text, no UI, no scenery.

Style:
- Original character, not copied from Stardew Valley, Bloomseed, or any existing game.
- Cozy 2D farming RPG readability, warm contemporary rural China.
- Crisp square pixel art, hard pixel edges, no anti-aliasing, no blur, no painterly shading.
- Limited palette with separable color groups: skin, hair, outfit, boots, tool, held item, optional shadow.
- Practical young farmer protagonist: navy work jacket, dark pants, practical cloth shoes or boots, short black hair or simple straw-colored hat, small tool belt.
- Readable silhouette at 1x scale.

Avoid:
- Oversized chibi head, anime portrait rendering, realistic painting, 3D render, isometric diamond angle.
- Fake text, watermark, logo, extra characters, background objects.
- Random size changes, moving foot anchor, excessive squash/stretch.
```

## 村民静态设计 Prompt

用于当前村庄 NPC：林岚、何涛、柳青、楠楠、陈伯。当前推荐每个村民单独生成源图，再用脚本拆成 `96x120` 透明 PNG；不要再把 5 个人挤进同一张 atlas，容易让楠楠、陈伯和手杖这类小/细元素贴边裁切。

```text
Create ONE original full-body pixel-art villager sprite on a perfectly flat solid #00ff00 chroma-key background for background removal.

Output composition:
- One character only.
- No text, no labels, no UI, no scenery.
- The character faces down/front in a relaxed idle pose for a top-down 2D RPG.
- Full body visible from top hair to both feet, no cropping, no cutoff accessories.
- Character centered by feet with generous #00ff00 padding on all four sides.
- Same runtime canvas target after processing: 96 x 120 px.
- Same feet-center anchor after processing: x = 48, y = 108.
- Adult villagers should normalize to about 96 px visible height; child NPC may be about 78 px visible height inside the same canvas.
- Pixel art only: crisp chunky square pixels, hard outline, limited 16-24 color palette, no anti-aliased blur, no painterly shading.
- Original characters only; do not copy Stardew Valley or any existing game sprite.

Character options, generate one at a time:
- Lin Lan / 林岚: soil and water sample researcher, muted purple work jacket, dark plum tied-back hair, field notebook or sample satchel, practical boots.
- He Tao / 何涛: seed shop and youth workshop coordinator, blue work vest, rural shirt, apron or pouch, sturdy boots.
- Liu Qing / 柳青: shipping ledger and cold-chain route organizer, muted olive-brown jacket, crossbody ledger bag, tidy reliable courier feel without modern branding.
- Nannan / 楠楠: left-behind school child, warm yellow sweater, small backpack, brown hair, quiet hopeful expression, visibly shorter than adults.
- Uncle Chen / 陈伯: elderly villager, grey hair, earth-toned padded vest, simple trousers, walking cane held close to body.

Background:
- Perfectly flat solid #00ff00.
- No shadows, gradients, texture, floor plane, watermark, or text.
- Do not use #00ff00 inside the characters.
```

## 静态回退帧模板

用于每个动作的静态 fallback。文件名不要带帧序号；如果该动作已有多帧，运行时会优先读取 `_00..` 帧，缺帧时才回退到这个静态 PNG。

```text
[PASTE COMMON PROMPT ABOVE]

Frame id: player/<action>_<direction>.
Output filename target: stardew-tilemap-from-zero/assets/game/player/<action>_<direction>.png.
Action: <action>.
Direction: <down/up/left/right>.
Pose: <describe the representative readable pose>.

Runtime priority:
- This is the fallback representative frame for this action and direction.
- Keep it neutral enough to look acceptable if a numbered animation frame is missing.
- For walk/run, use a mid-stride pose that reads as movement without extreme limb extension.
- For tool actions, use the clearest impact or use pose, not the wind-up.

Output:
One transparent 96 x 120 PNG only.
```

## 当前运行时优先帧

先生成这些文件，能最快替换 Canvas fallback。

### Idle

```text
Frame id: player/idle_down.
Action: idle.
Direction: down.
Pose: relaxed standing pose facing the camera, calm breathing implied by slightly lifted shoulders, feet planted.
```

```text
Frame id: player/idle_up.
Action: idle.
Direction: up.
Pose: relaxed standing pose facing away, back of jacket and hair/hat readable, feet planted.
```

```text
Frame id: player/idle_left.
Action: idle.
Direction: left.
Pose: relaxed side-facing stance, nose and front boot just visible, hands near sides.
```

```text
Frame id: player/idle_right.
Action: idle.
Direction: right.
Pose: mirror of idle_left, relaxed side-facing stance, hands near sides.
```

### Walk

```text
Frame id: player/walk_down.
Action: walk.
Direction: down.
Pose: mid-walk frame facing down, one foot slightly forward, opposite arm counter-swing, body still centered on the foot anchor.
```

```text
Frame id: player/walk_up.
Action: walk.
Direction: up.
Pose: mid-walk frame facing up, back view with one heel raised and subtle shoulder counter-swing.
```

```text
Frame id: player/walk_left.
Action: walk.
Direction: left.
Pose: mid-walk side frame, front foot extended one pixel, rear foot trailing, compact arm swing.
```

```text
Frame id: player/walk_right.
Action: walk.
Direction: right.
Pose: mirror of walk_left, mid-walk side frame with compact arm swing.
```

### Run

```text
Frame id: player/run_down.
Action: run.
Direction: down.
Pose: energetic but cozy running frame facing down, slight forward lean, wider stride than walk, no combat pose.
```

```text
Frame id: player/run_up.
Action: run.
Direction: up.
Pose: energetic running frame facing away, jacket and hair/hat bounce implied, feet still anchored.
```

```text
Frame id: player/run_left.
Action: run.
Direction: left.
Pose: side-running frame, compact forward lean, readable bent knee, no speed lines.
```

```text
Frame id: player/run_right.
Action: run.
Direction: right.
Pose: mirror of run_left, side-running frame, compact forward lean, no speed lines.
```

### Inspect

```text
Frame id: player/inspect_down.
Action: inspect.
Direction: down.
Pose: farmer facing down, hands slightly raised as if checking a sign, mailbox, crate, or object in front.
```

```text
Frame id: player/inspect_up.
Action: inspect.
Direction: up.
Pose: farmer facing up, one hand lifted near chest as if examining an object ahead.
```

```text
Frame id: player/inspect_left.
Action: inspect.
Direction: left.
Pose: farmer facing left, one hand extended slightly toward an object.
```

```text
Frame id: player/inspect_right.
Action: inspect.
Direction: right.
Pose: mirror of inspect_left, one hand extended slightly toward an object.
```

### Hoe

```text
Frame id: player/hoe_down.
Action: hoe.
Direction: down.
Pose: farmer facing down at the readable ground-impact moment, hoe angled forward inside the 96x120 canvas.
```

```text
Frame id: player/hoe_up.
Action: hoe.
Direction: up.
Pose: farmer facing up, hoe lifted or striking just ahead of the feet, tool contained inside canvas.
```

```text
Frame id: player/hoe_left.
Action: hoe.
Direction: left.
Pose: side-facing hoe strike, handle diagonal, hoe head readable near the front foot.
```

```text
Frame id: player/hoe_right.
Action: hoe.
Direction: right.
Pose: mirror of hoe_left, side-facing hoe strike, tool contained inside canvas.
```

### Seeds

```text
Frame id: player/seeds_down.
Action: seeds.
Direction: down.
Pose: farmer facing down, one hand dropping small seed pixels near the feet, small seed pouch visible.
```

```text
Frame id: player/seeds_up.
Action: seeds.
Direction: up.
Pose: farmer facing up, hand lowered toward ground ahead, tiny seed pouch readable.
```

```text
Frame id: player/seeds_left.
Action: seeds.
Direction: left.
Pose: side-facing planting pose, one hand low, seed pouch visible but not oversized.
```

```text
Frame id: player/seeds_right.
Action: seeds.
Direction: right.
Pose: mirror of seeds_left, side-facing planting pose.
```

### Watering Can

```text
Frame id: player/wateringCan_down.
Action: wateringCan.
Direction: down.
Pose: farmer facing down, blue-gray watering can tilted forward, two or three tiny water pixels inside the canvas.
```

```text
Frame id: player/wateringCan_up.
Action: wateringCan.
Direction: up.
Pose: farmer facing up, watering can tilted away from camera, small spout silhouette readable.
```

```text
Frame id: player/wateringCan_left.
Action: wateringCan.
Direction: left.
Pose: side-facing watering pose, can tilted left, short clean water stream contained inside canvas.
```

```text
Frame id: player/wateringCan_right.
Action: wateringCan.
Direction: right.
Pose: mirror of wateringCan_left, short clean water stream contained inside canvas.
```

### Scythe / Harvest

`scythe` is the selected tool action. `harvest` is used by the code after successful crop harvest or fishing catch.

```text
Frame id: player/scythe_down.
Action: scythe.
Direction: down.
Pose: farmer facing down at the widest readable farming scythe sweep, no weapon trail, no combat pose.
```

```text
Frame id: player/scythe_up.
Action: scythe.
Direction: up.
Pose: farmer facing up with scythe sweeping ahead, blade silhouette visible but contained.
```

```text
Frame id: player/scythe_left.
Action: scythe.
Direction: left.
Pose: side-facing scythe sweep, curved blade readable, no long slash effect.
```

```text
Frame id: player/scythe_right.
Action: scythe.
Direction: right.
Pose: mirror of scythe_left, curved blade readable, no long slash effect.
```

```text
Frame id: player/harvest_down.
Action: harvest.
Direction: down.
Pose: farmer facing down, arm reaching low as if picking a ripe crop, cheerful non-combat gesture.
```

```text
Frame id: player/harvest_up.
Action: harvest.
Direction: up.
Pose: farmer facing up, arm reaching toward the ground ahead, crop-picking posture.
```

```text
Frame id: player/harvest_left.
Action: harvest.
Direction: left.
Pose: side-facing crop harvest pose, one hand low and one hand balancing.
```

```text
Frame id: player/harvest_right.
Action: harvest.
Direction: right.
Pose: mirror of harvest_left, side-facing crop harvest pose.
```

### Fishing

```text
Frame id: player/fishingRod_down.
Action: fishingRod.
Direction: down.
Pose: farmer facing down, fishing rod held forward in a cast or waiting pose, rod tip visible but contained inside canvas.
```

```text
Frame id: player/fishingRod_up.
Action: fishingRod.
Direction: up.
Pose: farmer facing up, fishing rod angled away, line implied with one or two clean pixels only if readable.
```

```text
Frame id: player/fishingRod_left.
Action: fishingRod.
Direction: left.
Pose: side-facing fishing cast or waiting pose, rod angled left with compact line.
```

```text
Frame id: player/fishingRod_right.
Action: fishingRod.
Direction: right.
Pose: mirror of fishingRod_left, compact rod and line.
```

```text
Frame id: player/fishingCatch_down.
Action: fishingCatch.
Direction: down.
Pose: farmer facing down, bracing and pulling a bent fishing rod, effort readable but cozy.
```

```text
Frame id: player/fishingCatch_up.
Action: fishingCatch.
Direction: up.
Pose: farmer facing up, pulling back on a bent fishing rod, compact silhouette.
```

```text
Frame id: player/fishingCatch_left.
Action: fishingCatch.
Direction: left.
Pose: side-facing reeling pose, rod slightly bent, no fish or water drawn.
```

```text
Frame id: player/fishingCatch_right.
Action: fishingCatch.
Direction: right.
Pose: mirror of fishingCatch_left, side-facing reeling pose.
```

### Sleep / Warp

These are short feedback poses used by the current motion system. Generate them only if replacing every current runtime action.

```text
Frame id: player/sleep_down.
Action: sleep.
Direction: down.
Pose: farmer facing down, tired relaxed posture with lowered shoulders, not collapsed, non-violent.
```

```text
Frame id: player/warp_down.
Action: warp.
Direction: down.
Pose: farmer facing down, slight surprised transition pose, feet anchored, no magical effect outside canvas.
```

For `sleep` and `warp`, reuse the closest direction frame for `up/left/right` unless the runtime later needs direction-specific silhouettes.

## 多帧源素材模板

如果要生成真正的动作动画源，请仍然生成单帧 PNG，而不是大 sheet。每帧使用两位序号。

```text
[PASTE COMMON PROMPT ABOVE]

Frame id: player/<action>_<direction>_<frameNumber>.
Output filename target: stardew-tilemap-from-zero/assets/source/player_frames/<action>_<direction>_<frameNumber>.png.
Action: <action>.
Direction: <down/up/left/right>.
Frame count in this animation: <N>.
Frame number: <00-based frame index>.
Pose: <specific pose for this frame>.

Consistency:
- Match player/idle_down as the design reference.
- The feet-center anchor stays at x = 48, y = 108 in every frame.
- Do not resize the character between frames.
- Do not change clothing, hair, boots, skin tone, outline thickness, or palette.

Output:
One transparent 96 x 120 PNG only.
```

Recommended source frame counts:

| Action | Directions | Frames | Runtime status |
|---|---|---:|---|
| `idle` | down/up/left/right | 2 | runtime plays `_00/_01` and falls back to static |
| `walk` | down/up/left/right | 4 | runtime loops `_00..03` |
| `run` | down/up/left/right | 6 | runtime loops `_00..05` |
| `inspect` | down/up/left/right | 4 | runtime plays once by action duration |
| `hoe` | down/up/left/right | 5 | runtime plays once by action duration |
| `seeds` | down/up/left/right | 1 | static fallback only for now |
| `wateringCan` | down/up/left/right | 5 | runtime plays once by action duration |
| `scythe` | down/up/left/right | 6 | runtime plays once by action duration |
| `fishingRod` | down/up/left/right | 6 | runtime plays cast and holds the final waiting frame |
| `fishingCatch` | down/up/left/right | 6 | runtime loops during catch/reel phase |
| `harvest` | down/up/left/right | 5 | runtime plays once by action duration |

## 未来动作 backlog

下面这些动作来自完整农场 RPG 动作需求，但当前代码还没有稳定加载路径。可以先作为源素材生成，不要放进 `assets/game/player/` 覆盖当前运行时资源。

| Future action | Directions | Frames | Notes |
|---|---|---:|---|
| `startMove` | down/up/left/right | 2 | weight shift before walking |
| `stopMove` | down/up/left/right | 2 | small settling pose |
| `turn` | transition pairs | 1-2 | down-left, down-right, up-left, up-right, left-up, left-down, right-up, right-down |
| `carryIdle` | down/up/left/right | 2 | crate or large crop |
| `carryWalk` | down/up/left/right | 4 | slower heavy walk |
| `pickUp` | down/up/left/right | 4 | bend, grab, lift, settle |
| `putDown` | down/up/left/right | 4 | lower, place, release, recover |
| `axe` | down/up/left/right | 5 | not currently in tool list |
| `pickaxe` | down/up/left/right | 5 | not currently in tool list |
| `hurt` | down/up/left/right | 3 | non-violent recoil |
| `faint` | down only | 6 | tired collapse |

## 可选 Sheet 拼接规则

只有在需要交付预览图或训练参考图时才拼 sheet。源文件仍然是单帧 PNG。

```text
source_cell_width = 32
source_cell_height = 40
anchor_x = 16
anchor_y = 36
spacing = 0 or 2 for preview only
margin = 0 or 2 for preview only
background = transparent
labels = false
```

关键约束句：

```text
Every source frame is a standalone transparent 96 x 120 PNG, with the feet-center anchor fixed at x = 48, y = 108; do not generate a large sheet as the game source.
```
