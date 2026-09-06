# Run 001: P0 视觉基准测试包

目标：启动第一章 AI 素材管线，但只生成最小测试包，用来验证比例、网格、色板、视角、锚点和 Godot 可读性。测试包通过前，不批量生成全套 P0。

## 本轮交付物

```text
1 张视觉基准板
1 张 P0 小 tilesheet：草地、泥路、干耕地、湿耕地
1 个玩家向下站立帧
1 个玩家向下行走 4 帧
1 个货箱
1 个公告栏空底板
1 个水源或打水点
1 个 UI 工具栏
1 份资产 metadata 草表
1 张 Godot 测试场景截图
```

## 通过标准

- 所有 tile 能按 `16x16 px` 切分。
- 玩家为 `16x32 px`，脚底中心稳定。
- 货箱、公告栏、水源在游戏尺寸下一眼可识别。
- 干耕地和湿耕地差异明显。
- 视觉风格符合现代中国乡村，不像西式奇幻农场。
- 没有 AI 乱码文字、水印或伪 logo。
- Godot 导入使用 Nearest，无平滑缩放。
- 实际相机倍率截图可读。

## 失败处理

- 网格不准：重生成，不入库。
- 角色脚底抖动：重做 sprite sheet。
- 色板漂移：先统一色板，再继续生成。
- 伪文字：清理或重生成。
- 透视不统一：重生成，不强行修。

## 本轮输出目录

```text
asset_runs/run_001_p0_baseline/
assets/pixel/terrain/
assets/pixel/farm_plot/
assets/pixel/water/
assets/pixel/y_sort/
assets/pixel/interaction/
assets/pixel/characters/
assets/pixel/ui/
```
