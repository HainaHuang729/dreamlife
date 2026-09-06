# Run 004 Result

状态：AI P0 美术替换已完成，并通过 Godot 截图验收。

## AI 参考

```text
asset_runs/run_004_ai_p0_art_replace/ai_p0_art_reference_board_v1.png
```

这张图用于确定更温暖、更接近现代乡村 RPG 的色板和造型方向。由于 AI 直接输出仍不能严格满足 `16x16` / `16x32` 切分要求，本轮采用“AI 参考 + 严格尺寸重绘”的方式落地。

## 替换资产

| 资产 | 尺寸 | 用途 |
| --- | --- | --- |
| `assets/pixel/terrain/terrain_p0_ai_v1.png` | `96x16` | 6 个 `16x16` 地形 tile |
| `assets/pixel/characters/char_player_down_ai_v1.png` | `80x32` | 5 个 `16x32` 玩家向下帧 |
| `assets/pixel/y_sort/object_shipping_box_ai_v1.png` | `16x24` | 货箱 |
| `assets/pixel/interaction/interaction_notice_board_empty_ai_v1.png` | `32x48` | 空公告栏 |
| `assets/pixel/water/water_pickup_point_ai_v1.png` | `32x32` | 打水点 |
| `assets/pixel/buildings/building_seed_stall_ai_v1.png` | `48x40` | 种子摊 |
| `assets/pixel/ui/ui_toolbar_ai_v1.png` | `96x20` | 工具栏 |

## 场景接入

`scripts/maps/p0_farm_greybox.gd` 已改为引用 AI v1 资产。Run 002 控制资产仍保留，可回退。

## 预览

```text
asset_runs/run_004_ai_p0_art_replace/p0_farm_ai_preview_final.png
```

## 通过项

- 所有替换资产保持严格尺寸。
- 没有伪文字、水印或 logo。
- Godot import 成功，`.import` 文件已生成。
- Godot 渲染日志无错误。
- P0FarmGreybox 已显示 AI v1 美术替换结果。
- 种子摊已从程序绘制占位替换为 sprite。

## 当前限制

- 这仍是 P0 美术替换第一版，不是最终精修美术。
- 地形边缘和 autotile 还很基础。
- 玩家只有向下方向。
- 工具动作还没有替换成正式动画。
- 作物、播种、收获状态资产还没有进入这一轮。

## 下一步

回到 P0 第一章玩法灰盒：

1. 工具模式：锄头、种子、水壶、收获。
2. 农田状态机：空地、已翻、已播种、已浇水、可收获。
3. 背包和作物计数。
4. 货箱出售。
5. 第一次出售后公告栏状态变化。

