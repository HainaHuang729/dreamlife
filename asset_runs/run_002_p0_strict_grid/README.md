# Run 002: P0 Strict Grid

目标：生成一套严格尺寸的 P0 控制资产，用来验证 `16x16` tile、`16x32` 玩家、底边 pivot、Y-sort 和 Godot 导入设置。

Run 001 的 AI 图保留为风格参考，但不能直接入库。Run 002 先用确定性像素绘制建立可导入、可切分、可测试的基准资产。

## 本轮交付物

```text
assets/pixel/terrain/terrain_p0_strict_tiles.png
assets/pixel/characters/char_player_down_p0.png
assets/pixel/y_sort/object_shipping_box_v1.png
assets/pixel/interaction/interaction_notice_board_empty_v1.png
assets/pixel/water/water_pickup_point_v1.png
assets/pixel/ui/ui_toolbar_p0.png
asset_runs/run_002_p0_strict_grid/contact_sheet.png
asset_runs/run_002_p0_strict_grid/metadata.json
```

## 验收标准

- `terrain_p0_strict_tiles.png` 为 6 个 `16x16` tile 横排。
- `char_player_down_p0.png` 为 5 个 `16x32` frame 横排。
- 交互物尺寸符合 metadata。
- 所有图像透明背景或明确像素区域。
- 没有伪文字。
- 可直接导入 Godot，使用 Nearest 过滤。

