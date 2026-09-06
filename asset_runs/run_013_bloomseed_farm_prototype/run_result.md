# Run 013: Bloomseed 临时农场原型

目标：验证 Bloomseed 能否作为《晨谷农场》的临时瓦片地图素材，先做一个接近星露谷农场结构的小场景。

## 结果

新增 Godot 场景：

```text
scenes/maps/BloomseedFarmPrototype.tscn
scripts/maps/bloomseed_farm_prototype.gd
scripts/player/bloomseed_temp_player_controller.gd
```

场景内容：

- 40x23 格地图，每格显示为 32x32，源素材按 16x16 裁剪后 2x 放大。
- Bloomseed 草地、泥路、耕地、水池、篱笆、树、灌木、石头、木箱、木桶、工作台、鸡和玩家角色。
- 保留项目现有老宅外观作为农场建筑占位，因为 Bloomseed 缺少适合当前项目的中国乡村外部建筑。
- 玩家可 WASD 移动，E 可触发老宅、出货箱、种子箱、工作台和取水点的交互打印。

## 使用方式

```bash
godot --path "/Users/amadeus/Documents/New project 2" \
  --scene "res://scenes/maps/BloomseedFarmPrototype.tscn"
```

预览截图：

```text
asset_runs/run_013_bloomseed_farm_prototype/bloomseed_farm_preview.png
```

## 临时素材策略

Bloomseed 继续只放在：

```text
assets/third_party/temp/bloomseed/
```

本场景运行时用 `Image.load_from_file()` 读取临时 PNG，不依赖 Godot `.import` 文件。这样适合原型阶段快速试错，但不适合最终导出。正式化时应把选定子集复制到正式资产目录、生成 `.import`，再改成正常 `preload()` 或 TileSet 资源。

## 观察

Bloomseed 很适合先验证农场地表结构：草地、泥路、耕地、水池、篱笆和基础小物足够做第一章地图灰盒。

它不适合直接替代最终美术：建筑、中文乡村设施、电商/物流/卫生站/茶铺等仍需要我们自己的素材。
