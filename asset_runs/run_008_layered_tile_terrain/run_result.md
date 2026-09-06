# Run 008 Result

状态：完成分层瓦片地形第一版，并通过 Godot 截图验收。

## 本阶段目标

从 Run 007 的单层瓦片拼图，推进到可扩展的地形分层结构：

- 草地底层
- 道路层
- 农田层
- 水源层
- 地形装饰层

这样后续可以单独修改道路、农田、水源，不再依赖整张 AI 背景图。

## 新增文件

```text
scenes/maps/P0FarmAILayeredTileTerrain.tscn
scripts/maps/p0_farm_ai_layered_tile_terrain.gd
```

继续使用 Run 007 的 AI 提取 tile atlas：

```text
assets/ai_direct/run_007/terrain_tileset_ai_extracted_32.png
```

## 地形分层

当前脚本层级：

- `GrassBase`
- `PathLayer`
- `FarmSoilLayer`
- `WaterLayer`
- `TerrainDetailLayer`

## 预览

```text
asset_runs/run_008_layered_tile_terrain/p0_farm_ai_layered_tile_terrain_final.png
```

## 通过项

- 不再使用整张 AI 背景。
- 地形按层生成，后续可独立修改。
- 道路、农田、水源都已经是 tile 组合。
- 第一版边缘装饰过密的问题已修正，改为稀疏点缀。
- Godot 可渲染 1280x720 截图。

## 当前问题

- 还不是最终 Godot TileMapLayer 资源，当前仍是脚本化 Sprite2D tile layer。
- 道路缺少真正 autotile 边缘、角落、T 字、十字过渡。
- 农田仍缺正式边缘/角落 tile。
- 水源需要专门水岸 tile，而不是从源图临时提取。
- `GRASS_BORDER` 仍然偏竖向草丛，不能作为通用边缘 tile 长期使用。

## 下一步

Run 009 应该生成正式的 terrain autotile atlas：

1. 路径 autotile：中心、上下左右边、四角、T 字、十字。
2. 农田 autotile：中心、边缘、角落，干/湿两套。
3. 水源 autotile：水面、水岸、角落、浅水边。
4. 草地装饰 tile 与地形边缘 tile 分离。
5. 注册为 Godot `TileSet` / `TileMapLayer`，不要长期用 Sprite2D 模拟。
