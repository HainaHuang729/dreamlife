# Run 003 Result

状态：P0 农场灰盒已创建，并完成 Godot 截图验收。

## 新增文件

```text
scenes/maps/P0FarmGreybox.tscn
scripts/maps/p0_farm_greybox.gd
scripts/maps/p0_farm_plot.gd
scripts/maps/p0_interactable.gd
scripts/player/p0_player_controller.gd
```

## 预览

```text
asset_runs/run_003_p0_farm_greybox/p0_farm_greybox_preview.png
```

## 通过项

- 独立场景，不影响旧 `MainFarmAscii.tscn`。
- 使用 `16x16` tile 逻辑网格。
- 使用 `16x32` 玩家控制资产。
- 地形、水体、农田、交互物、Y-sort 对象和 UI 分层明确。
- Godot 运行截图无脚本错误。
- 农田、货箱、水源、公告栏、种子摊和工具栏可读。

## 当前限制

- 种子摊还是程序绘制占位，不是正式 sprite。
- 农田交互目前只切换干/湿状态，还没有播种、成长、收获和出售链路。
- 货箱、公告栏、水源和种子摊当前只打印交互信息。
- 没有碰撞边界和建筑阻挡。
- 美术仍是控制资产，不是最终像素美术。

## 下一步

进入 P0 第一章玩法灰盒：

1. 增加工具/模式：锄头、种子、水壶、收获。
2. 农田状态机：空地、已翻、已播种、已浇水、可收获。
3. 背包和作物计数。
4. 货箱出售。
5. 第一次出售后公告栏或任务状态变化。
