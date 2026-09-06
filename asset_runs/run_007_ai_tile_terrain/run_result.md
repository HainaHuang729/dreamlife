# Run 007 Result

状态：已开始从整张 AI 地形背景切换到可编辑瓦片地形图。

## 为什么切换

Run 005 / Run 006 使用完整 AI 背景叠加道具，画面精美但有明显问题：

- 道具和地形阴影融合不稳定。
- 种子摊等素材裁切容易带入原图边缘和装饰。
- 地形不能局部修改。
- 后续播种、破坏、建造、地形变化不好做。

Run 007 改为先做地形 tile atlas，再用 tile 拼地图。

## 新增资产

```text
assets/ai_direct/run_007/terrain_tileset_ai_extracted_32.png
```

规格：

```text
32px tile
8 columns x 4 rows
32 terrain tiles
```

来源：

```text
assets/ai_direct/run_005/terrain_layer_ai_direct.png
```

说明：这些 tile 是从 AI 生成地形图中提取，不是手工重绘。

## 新增场景

```text
scenes/maps/P0FarmAITileTerrain.tscn
scripts/maps/p0_farm_ai_tile_terrain.gd
```

当前场景不再使用整张 AI 背景，而是通过 `32px` tile 拼出：

- 草地
- 横向道路
- 纵向道路
- 农田
- 水源区域
- 少量泥土变化

## 预览

```text
asset_runs/run_007_ai_tile_terrain/p0_farm_ai_tile_terrain_final.png
```

## 通过项

- 地形已经从整图背景切换为瓦片拼图。
- 地形可通过 tile map 逻辑局部修改。
- 草地变体从第一版 6 个扩展到 16 个，重复感降低。
- Godot 可渲染 1280x720 预览截图。

## 当前问题

- 还不是 Godot 编辑器内完整 TileMap 资源，当前是脚本化 tile layer。
- 道路缺少完整 autotile：边缘、转角、T 字、十字路口需要单独生成。
- 农田缺少边缘和角落 tile。
- 水源只是临时 tile 拼接，还需要专门水边缘和动画帧。
- 32px 是为了保留 AI 精细度；如果坚持原始 `16x16`，后面要做一次专门缩放/重绘验收。

## 下一步

Run 008 应该做正式 terrain tileset：

1. 草地基础和草地装饰层分离。
2. 路径 autotile：中心、上下左右边缘、四角、T 字、十字。
3. 农田 autotile：中心、边缘、角落、干/湿两套。
4. 水源 autotile：水面、石岸、岸边草。
5. 再把这些 tile 注册成 Godot TileSet / TileMapLayer。
