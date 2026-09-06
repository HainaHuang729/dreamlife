# Run 004: AI P0 Art Replace

目标：在不破坏 Run 002 严格尺寸、pivot 和 Godot 管线的前提下，用 AI 参考风格替换 P0 控制资产。

## 输入

```text
asset_runs/run_004_ai_p0_art_replace/ai_p0_art_reference_board_v1.png
assets/pixel/... Run 002 控制资产
```

## 输出

```text
assets/pixel/terrain/terrain_p0_ai_v1.png
assets/pixel/characters/char_player_down_ai_v1.png
assets/pixel/y_sort/object_shipping_box_ai_v1.png
assets/pixel/interaction/interaction_notice_board_empty_ai_v1.png
assets/pixel/water/water_pickup_point_ai_v1.png
assets/pixel/ui/ui_toolbar_ai_v1.png
asset_runs/run_004_ai_p0_art_replace/contact_sheet.png
asset_runs/run_004_ai_p0_art_replace/p0_farm_ai_preview.png
```

## 规则

- 不覆盖 Run 002 控制资产。
- 保持所有尺寸不变。
- 保持玩家 `16x32`、tile `16x16`。
- 保持交互物底边和 pivot 语义。
- 不生成中文细字。
- 通过 Godot 截图后，P0FarmGreybox 引用 AI v1 资产。

