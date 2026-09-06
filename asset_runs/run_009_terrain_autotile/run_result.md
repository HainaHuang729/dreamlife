# Run 009 Result

状态：完成 terrain autotile atlas 第一版，并接入 Godot `TileMapLayer`。

## 本阶段目标

Run 008 仍然是脚本化 Sprite2D tile layer。Run 009 的目标是进入 Godot 正式瓦片结构：

- 生成 terrain autotile atlas
- 创建 `TileSet`
- 创建多个 `TileMapLayer`
- 通过 atlas 坐标铺设地形

## 新增资产

```text
assets/ai_direct/run_009/terrain_autotile_atlas_32.png
```

规格：

```text
32px tile
16 columns x 6 rows
96 tiles total
```

行结构：

- Row 0：草地变体
- Row 1：道路 autotile
- Row 2：干农田 autotile
- Row 3：湿农田 autotile
- Row 4：水源 autotile
- Row 5：装饰 tile

## 新增场景

```text
scenes/maps/P0FarmTerrainAutotileTileMap.tscn
scripts/maps/p0_farm_terrain_autotile_tilemap.gd
```

## Godot 结构

脚本运行时创建：

- `TileSet`
- `TileSetAtlasSource`
- `GrassBase` `TileMapLayer`
- `PathAutotile` `TileMapLayer`
- `FarmAutotile` `TileMapLayer`
- `WaterAutotile` `TileMapLayer`
- `TerrainDetails` `TileMapLayer`

## 预览

```text
asset_runs/run_009_terrain_autotile/p0_farm_terrain_autotile_tilemap_final.png
```

## 通过项

- Godot `TileMapLayer` 已可运行。
- 地形不再依赖整图背景。
- 瓦片数据通过 atlas 坐标铺设。
- 道路、农田、水源已经有按邻居 bitmask 选择 tile 的逻辑。
- Godot 渲染截图通过。

## 当前问题

- 这只是 autotile 技术接入第一版，视觉还不够自然。
- 道路边缘过硬，缺少真实手工/AI 生成的边缘过渡 tile。
- 农田边缘仍是矩形拼接，缺少角落、土壤外溢、草土混合。
- 水源 tile 质量不足，应重新专门生成水岸 tile。
- `TileSet` 目前是运行时创建，还没有保存为 `.tres` 资源。

## 下一步

Run 010 应该专门生成高质量 terrain transition atlas：

1. 用 AI 单独生成道路边缘和角落 tile。
2. 用 AI 单独生成农田边缘和角落 tile，干/湿两套。
3. 用 AI 单独生成水岸 tile。
4. 保存 Godot `.tres` TileSet，而不是运行时创建。
5. 开始绑定农田玩法状态到 TileMapLayer。
