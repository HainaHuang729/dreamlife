# Run 005 Result

状态：已完成真正 AI 生成素材替换，并通过 Godot 截图验收。

## 关键修正

Run 004 的问题是“AI 参考 + 手工严格重绘”，视觉结果仍像占位素材。Run 005 改为直接使用 AI 生成的像素图作为生产素材，后处理只做：

- 复制 AI 源图到项目目录
- 色键去背景
- 从 AI 素材板裁切独立 PNG
- 在 Godot 中分层摆放

本轮没有再用程序手工画像素素材替换 AI 美术。

## AI 源图

| 文件 | 用途 |
| --- | --- |
| `assets/ai_direct/run_005/terrain_layer_ai_direct.png` | AI 生成完整地形层 |
| `assets/ai_direct/run_005/props_sheet_ai_direct.png` | AI 生成道具素材板 |
| `assets/ai_direct/run_005/character_sheet_ai_direct.png` | AI 生成角色素材板 |

Run 目录也保留了源图副本：

- `asset_runs/run_005_ai_direct_art_replace/terrain_layer_ai_direct_source.png`
- `asset_runs/run_005_ai_direct_art_replace/props_sheet_ai_direct_source.png`
- `asset_runs/run_005_ai_direct_art_replace/character_sheet_ai_direct_source.png`

## 裁切后的独立资产

目录：

```text
assets/ai_direct/run_005/processed/
```

包含：

- `seed_stall_ai_direct.png`
- `notice_board_ai_direct.png`
- `shipping_box_ai_direct.png`
- `water_well_ai_direct.png`
- `fence_ai_direct.png`
- `barrel_ai_direct.png`
- `crate_hoe_ai_direct.png`
- `watering_can_ai_direct.png`
- `grass_cluster_ai_direct.png`
- `flower_cluster_white_ai_direct.png`
- `flower_cluster_yellow_ai_direct.png`
- `rocks_ai_direct.png`
- `player_down_idle_ai_direct.png`
- `player_down_walk_ai_direct.png`
- `player_left_idle_ai_direct.png`
- `player_right_walk_ai_direct.png`
- `player_up_idle_ai_direct.png`

## Godot 接入

新增场景：

```text
scenes/maps/P0FarmAIDirectPreview.tscn
```

新增脚本：

```text
scripts/maps/p0_farm_ai_direct_preview.gd
```

场景分层：

- `AI_Direct_Terrain_Layer`：完整 AI 地形层
- `AI_Direct_YSort_Props`：种子摊、公告栏、水井、货箱、杂物、角色

## 预览

最终截图：

```text
asset_runs/run_005_ai_direct_art_replace/p0_farm_ai_direct_preview_final.png
```

规格：

```text
1280x720 PNG
```

## 通过项

- 画面质量相比 Run 004 明显提升。
- 地形不再是重复占位 tile，已有草地变体、路边过渡、农田细节、水源和边界植被。
- 道具来自 AI 素材板，并已作为透明 PNG 单独接入。
- 角色来自 AI 角色素材板，不再使用 16x32 简单占位小人。
- Godot import 成功，场景可渲染。

## 当前限制

- 地形目前是完整背景层，不是严格 `16x16` 可编辑 TileMap。
- AI 角色帧还需要后续统一尺寸、锚点和动画帧表。
- 道具已透明化，但还没有逐个绑定碰撞盒和交互区域。
- 这一版用于确认“精美 AI 素材替换方向”，不是最终可编辑生产 tileset。

## 下一步

如果确认 Run 005 视觉方向可接受，下一步应做：

1. 把 AI 地形拆成可复用 TileMap / atlas。
2. 给道具逐个建立 pivot、Y-sort 原点、碰撞盒、交互区域。
3. 统一角色帧尺寸，生成 Godot AnimatedSprite2D。
4. 回到 P0 玩法：播种、浇水、成长、收获、出售。
