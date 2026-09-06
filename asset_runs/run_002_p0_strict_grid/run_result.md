# Run 002 Result

状态：已生成严格尺寸 P0 控制资产，创建 Godot 测试场景，并完成命令行截图验收。

## 生成资产

| 文件 | 尺寸 | 结论 |
| --- | --- | --- |
| `assets/pixel/terrain/terrain_p0_strict_tiles.png` | `96x16` | 6 个 `16x16` tile，尺寸通过 |
| `assets/pixel/characters/char_player_down_p0.png` | `80x32` | 5 个 `16x32` frame，尺寸通过 |
| `assets/pixel/y_sort/object_shipping_box_v1.png` | `16x24` | 尺寸通过 |
| `assets/pixel/interaction/interaction_notice_board_empty_v1.png` | `32x48` | 尺寸通过 |
| `assets/pixel/water/water_pickup_point_v1.png` | `32x32` | 尺寸通过 |
| `assets/pixel/ui/ui_toolbar_p0.png` | `96x20` | 尺寸通过 |
| `asset_runs/run_002_p0_strict_grid/contact_sheet.png` | `220x140` | 本地预览图 |
| `scenes/maps/P0AssetTest.tscn` | Godot scene | 路径静态检查通过 |
| `asset_runs/run_002_p0_strict_grid/godot_preview.png` | `1280x720` | Godot 运行截图通过 |

## 通过项

- 真正满足 `16x16` tile 和 `16x32` 角色帧。
- 所有 PNG 为 RGBA。
- 没有 AI 乱码文字、水印或伪 logo。
- 文件已进入正式 `assets/pixel/...` 分层目录。
- 已生成 `metadata.json`。
- 已创建 `P0AssetTest.tscn`，以 4x 显示 P0 资产。
- 已安装并验证 Godot CLI：`4.6.2.stable.official.71f334935`。
- 已运行 Godot import，生成 `.import` 文件。
- 已通过 Godot 普通显示驱动生成 `godot_preview.png`。

## 未完成项

- 当前资产是控制基准，不是最终美术质量。
- headless/dummy 渲染器使用 `--write-movie` 会崩溃；截图需要使用普通 macOS 显示驱动。

## 结论

Run 002 通过“严格网格、尺寸和 Godot 可读性”门槛，可以作为 P0 玩法灰盒素材。Run 001 的 AI 图可继续作为风格参考，Run 002 的 PNG 是实际可导入的控制资产。

## 命令记录

```bash
godot --headless --path "/Users/amadeus/Documents/New project 2" --import
godot --path "/Users/amadeus/Documents/New project 2" \
  --scene "res://scenes/maps/P0AssetTest.tscn" \
  --write-movie "/Users/amadeus/Documents/New project 2/asset_runs/run_002_p0_strict_grid/godot_preview.png" \
  --fixed-fps 1 \
  --quit-after 2 \
  --resolution 1280x720
```

Godot 对 PNG movie 输出使用序列帧命名，本轮实际生成 `godot_preview00000000.png` 和 `godot_preview00000001.png`，并复制第二帧为 `godot_preview.png`。

## 下一步

1. 进入 P0 农场灰盒地图。
2. 使用 Run 002 资产替换临时色块。
3. 如果视觉太粗糙，基于 Run 002 尺寸继续做美术化重绘，但不得破坏尺寸和 pivot。
