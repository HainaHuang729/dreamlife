# Run 003: P0 Farm Greybox

目标：把 Run 002 的严格尺寸 P0 资产接入一个独立的 16px 逻辑网格农场灰盒场景，验证第一章核心空间动线。

## 交付物

```text
scenes/maps/P0FarmGreybox.tscn
scripts/maps/p0_farm_greybox.gd
scripts/maps/p0_farm_plot.gd
scripts/maps/p0_interactable.gd
scripts/player/p0_player_controller.gd
asset_runs/run_003_p0_farm_greybox/p0_farm_greybox_preview.png
```

## 场景内容

- 30x20 的 16px 农场灰盒地图。
- 中央第一块地。
- 右侧主路和下方横向村路。
- 水源/打水点。
- 货箱。
- 公告栏。
- 种子摊占位。
- 玩家 `16x32` sprite。
- UI 工具栏。

## 交互

- `WASD` / 方向键移动。
- `E` 交互。
- 靠近农田按 `E` 可切换干/湿状态。
- 货箱、公告栏、水源和种子摊已有交互 Area，并在控制台打印交互信息。

## 验收

- Godot 命令行渲染无脚本错误。
- 截图可读。
- 玩家、农田、货箱、水源、公告栏、种子摊和 UI 都能在同一画面里识别。
- 场景使用 Run 002 的严格尺寸资产，不使用整图背景。

