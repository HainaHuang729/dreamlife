# AI 素材生成指南

本文档用于指导 AI 生成《晨谷农场》的第一批像素游戏素材。所有素材先服务第一章“返乡第一块地”和阶段 0 项目骨架，不追求一次性生成全量正式美术。

## 1. 项目美术方向

核心方向：

- 当代中国乡村农场 RPG。
- 类星露谷的三分之四俯视 2D 像素风格。
- 精致像素，细节较多，但不能变成厚涂、插画或高清手绘。
- 画面重点是现代乡村生活：翻新农房、菜地、小水塘、种子摊、货箱、茶铺、卫生站、公告栏、村口小路。
- 氛围温暖、清爽、有人生活过，但不要过度梦幻、赛博、欧式中世纪或日式神社风。

必须避免：

- 真 3D 渲染感。
- 菱形等距地图。
- 低清马赛克到无法识别功能。
- 大面积渐变、柔光、厚涂笔触。
- 纯西式农场建筑、欧式城堡、魔法奇幻装饰。
- 把整个地图画死成一张背景图。

## 2. 固定规格

| 项目 | 规格 |
| --- | --- |
| 地图 tile | `16x16 px` |
| 角色 sprite | `16x32 px` |
| 角色逻辑占地 | `16x16 px` |
| 角色碰撞盒 | 脚底中心 `12x8 px` 或 `12x10 px` |
| 视角 | 三分之四俯视 2D |
| 排序 | Y-sort，以脚底或物件底边排序 |
| 推荐工作倍率 | 可让 AI 生成 2x/4x 预览，但最终必须能切回 16px 网格 |
| 透明背景 | 角色、物件、建筑、图标必须透明背景 |
| 地图素材 | 优先生成 tile sheet 和独立 sprite，不生成整张不可拆地图 |

角色画布为 `16x32 px`，但脚底的 `16x16 px` 才是逻辑占地。头部和身体可以超过占地格，用于形成俯视 RPG 的人物比例。

## 3. 启动前检查

正式批量生成资产前，必须先完成启动前检查。这个阶段的目标不是产出大量素材，而是确认 AI 输出能被项目稳定使用。

### 3.1 视觉基准板

先制作一张视觉基准板，至少包含：

- 草地。
- 泥土。
- 水体。
- 木头。
- 老宅一角。
- 玩家角色。
- 货箱。
- 公告栏。
- 一个 NPC。
- 一个 UI 小图标。

视觉基准板用于锁定：

- 色板。
- 线条粗细。
- 阴影方向。
- 像素密度。
- 角色和建筑比例。
- 现代中国乡村气质。

后续所有 AI 素材都要和视觉基准板对齐。如果新素材在色彩、角度、阴影或像素密度上明显偏离，先修提示词或人工统一，再进入资产库。

### 3.2 P0 视觉基准测试包

第一批不要直接生成整套 P0。先做一个最小测试包：

```text
1 张小 tilesheet：草地、泥路、干耕地、湿耕地
1 个玩家：向下站立、向下行走 4 帧
1 个货箱
1 个公告栏
1 个水源或打水点
1 个 UI 工具栏
1 个 Godot 测试场景截图
```

测试包必须验证：

- `16x16` 网格是否能准确切分。
- `16x32` 角色站在地块上是否舒服。
- 角色脚底 pivot 是否稳定。
- 货箱、公告栏、水源是否一眼可识别。
- 干耕地和湿耕地是否清楚不同。
- UI 是否在游戏尺寸下可读。
- Nearest 导入后是否像素清晰。

测试包通过前，不进入批量生成。

### 3.3 启动前禁止事项

启动前不要做：

- 完整四季包。
- 全套 NPC 动画。
- 后山、旅游、电商、合作社和基建资产。
- 完整室内装饰包。
- 大量建筑变体。
- 写死中文内容的公告栏、招牌和价签。

这些内容会扩大资产面，掩盖最核心的问题：比例、网格、角度、色板和游戏内可读性是否成立。

### 3.4 失败标准

出现以下情况时，素材不能入库：

- 不能按 `16px` 网格切分。
- 有 AI 乱码文字、水印或伪 logo。
- 角色脚底点每帧漂移。
- 同一批素材色板明显漂移。
- 透视角度偏向真等距、侧视或 3D。
- 建筑不像现代中国乡村。
- 图层混在一起，无法拆成 tile、sprite 或 overlay。
- 在 Godot 里实际倍率下不可读。

失败素材可以人工清理；如果清理成本高于重生成，直接重生成。

## 4. 资产元数据规则

AI 生成图片后，进入项目时必须补充资产元数据。不要只保存图片文件，否则后续在 Godot 里会反复手调位置、碰撞和交互范围。

每个资产至少记录：

```text
asset_id
file_path
layer
tile_size
sprite_size
origin
pivot
y_sort_point
grid_footprint
collision_rect
interaction_rect
tags
```

示例：

```text
asset_id: object_shipping_box_v1
file_path: assets/pixel/y_sort/object_shipping_box_v1.png
layer: YSortObjects
sprite_size: 16x24
origin: bottom_center
pivot: bottom_center
y_sort_point: bottom_center
grid_footprint: 1x1
collision_rect: x2 y12 w12 h8
interaction_rect: x-4 y-4 w24 h28
tags: farm, sell_box, chapter_1
```

## 5. 锚点与对齐规则

所有素材必须遵守统一锚点：

| 类型 | 对齐规则 |
| --- | --- |
| 地形 tile | 左上角对齐 `16x16` 网格 |
| 地形细节 | 左上角或格中心对齐，不参与碰撞 |
| 农田 tile | 左上角对齐地块 |
| 作物 | 底部中心对齐地块中心 |
| 角色/NPC | 脚底中心作为 origin、pivot 和 Y-sort 点 |
| 小物件 | 底部中心作为 pivot 和 Y-sort 点 |
| 建筑主体 | 底边中心作为 Y-sort 点，放置锚点需在元数据里记录 |
| 前景遮挡 | 跟随所属建筑或树木主体，不单独参与碰撞 |
| UI | 按组件使用左上角或中心锚点，不参与世界 Y-sort |

建筑、树、摊位和货箱这类物件必须有清楚底边。AI 生成时如果底边被阴影、草或装饰糊住，需要人工清理。

## 6. 色板与文字规则

同一批资产必须使用统一色板，避免 AI 每批输出颜色漂移。

第一章基础色组：

| 类型 | 色彩方向 |
| --- | --- |
| 草地 | 春季嫩绿，清爽但不过饱和 |
| 泥土 | 暖棕，干湿状态差异明确 |
| 木头 | 中棕，适合农具、篱笆、货箱和摊位 |
| 水体 | 清蓝绿，有轻微乡村池塘感 |
| 建筑墙体 | 浅灰白、米白或旧砖浅色 |
| 屋顶 | 深青灰、暖红棕或旧瓦色 |
| 交互高亮 | 柔和黄色 |
| 任务提示 | 清晰但不刺眼的橙黄 |

AI 不应直接生成中文细字、招牌文字或公告内容。公告栏、茶铺招牌、卫生站牌子只生成空牌、纸张和牌匾底图；具体文字由游戏字体渲染，或后期手动补像素字。

## 7. Autotile 与边缘规则

地形不能只生成单块 tile。第一版可以不做完整 47-tile autotile，但至少要能拼出自然边缘。

最低边缘要求：

| 类型 | 必须包含 |
| --- | --- |
| 泥路 | 中心、上下左右边、内角、外角、端点 |
| 石径 | 中心、边缘、破碎变体 |
| 水边 | 中心水面、四边岸线、四角、内角 |
| 农田 | 中心、边缘、角、单格田 |
| 篱笆 | 横、竖、转角、端点、门 |
| 草地细节 | 空草地、稀疏草、荒草、小花、碎石 |

边缘 tile 必须和基础 tile 同色板、同光源、同视角，不能像来自不同素材包。

## 8. 动画帧标准

第一章动画按以下标准生成：

| 类型 | 帧数 |
| --- | --- |
| 玩家行走 | 每方向 4 帧 |
| 玩家锄地/播种/浇水/收获 | 每方向 3-4 帧，第一版可先完整做向下方向 |
| NPC 行走 | 每方向 2-4 帧 |
| 浇水水花 | 4 帧循环或一次性动画 |
| 收获弹出 | 4-6 帧 |
| 出售反馈 | 4-6 帧 |
| 雨线 | 2-4 帧循环 |
| 水面波纹 | 4 帧循环 |
| 作物高亮或轻微摇动 | 可选 2 帧 |

动画帧必须保持同一锚点，不能每帧上下跳动。

## 9. 第一批资产范围

### 9.1 地形 tile

必须生成：

- 草地。
- 荒草。
- 泥路。
- 石径。
- 干耕地。
- 湿耕地。
- 室内木地板。
- 室内墙面。

建议每种基础 tile 至少有：

- 1 个基础块。
- 2-4 个变化块。
- 边缘或转角块，尤其是泥路、石径、耕地和室内墙角。

水面和水边归入 `Water`，田埂和接触阴影归入 `TerrainDetail`，木篱笆归入 `ObjectLow`，不要混进地形底层。

地形细节至少生成：

- 田埂。
- 接触阴影。
- 稀疏草。
- 小花。
- 碎石。
- 泥点或破碎边缘。

### 9.2 农田和作物

农田状态：

- 未开垦。
- 已翻地。
- 已浇水。
- 已播种。
- 可收获。
- 收获后。

作物：

| 作物 | 阶段 |
| --- | --- |
| 芜菁 | 种子、幼苗、成长、成熟 |
| 青豆 | 种子、幼苗、成长、成熟 |
| 小白菜 | 种子、幼苗、成长、成熟 |

作物必须在 `16x16 px` 格内可读。成熟阶段可以略高，但不要影响玩家判断脚下地块。

### 9.3 农场建筑和物件

第一批建筑主体：

- 老宅外观。
- 种子摊。

第一批 Y-sort 交互物：

- 货箱。
- 池塘打水点或打水木桩。

第一批小物：

- 水桶。
- 菜篮。
- 价签。
- 周转筐。
- 木牌。
- 花床。
- 杂草。
- 石头。
- 小灌木。
- 木篱笆。

建筑可以大于单格，但必须按 `16x16 px` 对齐。例如：

```text
老宅外观：64x64 或 80x80
种子摊：32x32 或 48x32
货箱：16x16 或 16x24
池塘打水点：32x16 或 32x32
```

货箱和打水点不是地形，也不是建筑底图；它们需要独立 sprite、交互范围和 Y-sort 或交互层配置。

### 9.4 老宅室内

必须生成：

- 床。
- 桌子。
- 椅子。
- 门。
- 书架。
- 照片墙。
- 农具挂钩。
- 厨房基础件：炉灶、水缸、案板。

室内也使用 `16x16 px` 网格。家具可以占用多格，但底边需要清楚，方便 Y-sort。

### 9.5 村子主街

第一批只生成核心识别物：

- 公告栏。
- 订单板。
- 杂货店。
- 卫生站。
- 茶铺。
- 公共广场基础地块。

村子主街暂时不需要生成完整电商角、合作社、游客中心、高铁接驳和基建系统。那些是后续章节资产。

### 9.6 角色和 NPC

玩家：

- `16x32 px` 单帧。
- 4 向站立。
- 4 向行走，每方向 4 帧。
- 锄地、播种、浇水、收获、通用交互动作。

第一批 NPC：

- 村干部或邻居。
- 茶铺老板。
- 卫生站人员。
- 种子摊或杂货店角色。

NPC 第一版至少需要 4 向站立和简单 4 向行走。重要 NPC 后续再补表情和职业动作。

### 9.7 UI 和图标

UI：

- 时间。
- 节气。
- 天气。
- 背包。
- 任务面板。
- 对话框。
- 交互提示。
- 工具栏。

图标：

- 锄头。
- 种子。
- 水壶。
- 镰刀或手套。
- 芜菁。
- 青豆。
- 小白菜。
- 金币。
- 任务标记。

UI 可以比地图素材更清晰，但仍要保持像素边缘和统一色板。

### 9.8 特效

第一批特效：

- 浇水水花。
- 收获弹出。
- 出售反馈。
- 小雨雨线。
- 交互高亮。

特效应作为独立透明 sprite 或 overlay，不要画死在地面 tile 上。

### 9.9 水体

第一章水体单独成层，至少生成：

- 池塘水面基础 tile。
- 池塘水边四边。
- 池塘水边四角。
- 水面波纹。
- 打水点水面提示或木桩附加物。

水体资产用于后续钓鱼、雨天涟漪和生态鱼塘扩展，因此不要把池塘画死进农场背景图。

## 10. 图层规则

生成素材时必须考虑以下图层：

```text
Terrain        草地、泥路、石径、室内地板和墙面
TerrainDetail  草、花、碎石、田埂、接触阴影
FarmPlot       耕地和农田状态
Crops          作物阶段
Water          池塘、水面、水边、波纹
ObjectLow      菜篮、石头、矮篱笆、低矮装饰
Building       老宅、种子摊、杂货店、卫生站、茶铺主体
YSortObjects   角色、NPC、货箱、可绕行大物件
ObjectHigh     屋顶、树冠、前景遮挡
Collision      碰撞数据，不作为美术输出
Interaction    门、公告栏、货箱、水源、NPC 触发区和状态提示
OverlayFX      雨、光照、节气和天气叠加
UI             面板、图标、对话框和提示
```

AI 不需要直接生成 `Collision` 和 `Interaction` 图层，但生成物件时必须给出清楚底边、占地格和可交互面。

## 11. 可见变化资产

第一章必须能表现村庄回应玩家行为，因此要为以下状态生成差异资产：

| 初始状态 | 推进后状态 |
| --- | --- |
| 荒地、杂草、散乱石头 | 规整菜地、清楚田埂 |
| 空公告栏 | 出现助农需求纸条 |
| 普通种子摊 | 增加菜篮、价签、周转筐 |
| 普通货箱 | 出售后出现收据、空筐或任务反馈标记 |
| 茶铺或卫生站普通门面 | 出现第一笔订单提示牌 |

这些状态应作为可切换 sprite 或附加装饰，不要合并进整张地图背景。

状态命名统一使用：

```text
_empty
_active
_done
_locked
_highlight
_damaged
_upgraded
```

示例：

```text
village_notice_board_empty_v1.png
village_notice_board_active_v1.png
village_notice_board_done_v1.png
```

## 12. 命名规则

使用小写英文、下划线和版本号：

```text
terrain_grass_01.png
terrain_soil_dry_01.png
terrain_soil_wet_01.png
terrain_detail_field_ridge_01.png
water_pond_base_01.png
crop_turnip_stage_0.png
crop_turnip_stage_1.png
crop_turnip_stage_2.png
crop_turnip_stage_3.png
building_farm_home_v1.png
building_seed_stall_v1.png
object_shipping_box_v1.png
interaction_notice_board_empty_v1.png
interaction_notice_board_active_v1.png
char_player_walk_down.png
ui_icon_tool_hoe_v1.png
fx_rain_light_v1.png
```

建议目录：

```text
assets/pixel/terrain/
assets/pixel/terrain_detail/
assets/pixel/farm_plot/
assets/pixel/crops/
assets/pixel/water/
assets/pixel/objects_low/
assets/pixel/buildings/
assets/pixel/y_sort/
assets/pixel/objects_high/
assets/pixel/interaction/
assets/pixel/characters/
assets/pixel/fx/
assets/pixel/ui/
```

## 13. 通用提示词模板

### 13.1 Tile sheet 模板

```text
Create a pixel art tile sheet for a modern Chinese countryside farming RPG.
Style: three-quarter top-down 2D pixel art, Stardew Valley-like readability, detailed but clean, no painterly brushwork.
Grid: 16x16 pixel tiles, perfectly aligned to a visible 16x16 grid.
Content: [list assets here].
Use transparent background where possible.
Camera: not isometric diamond, not 3D render.
Mood: warm, fresh, contemporary rural China.
Use a consistent palette across grass, soil, wood, water, buildings, and UI highlights.
Avoid: medieval fantasy, European farm style, neon cyberpunk, blurry gradients, large soft shadows, unreadable text.
```

### 13.2 角色模板

```text
Create a 16x32 pixel art character sprite sheet for a modern Chinese countryside farming RPG.
Character: [player / tea shop owner / clinic worker / village official].
View: three-quarter top-down RPG character.
Frames: 4-direction idle and 4-direction walk, 4 walk frames per direction.
The character occupies a 16x16 logic footprint at the feet, with the body extending upward.
Use the feet center as the consistent pivot point for every frame.
Transparent background, crisp pixel edges, readable silhouette.
Avoid: realistic portrait, chibi oversized head, isometric diamond angle, 3D render, painterly shading.
```

### 13.3 建筑模板

```text
Create a pixel art building sprite for a modern Chinese countryside farming RPG.
Building: [renovated farmhouse / seed stall / village clinic / tea shop].
View: three-quarter top-down 2D, Y-sort friendly, clear bottom edge.
Grid: align to 16x16 pixel tiles.
Output size: [64x64 / 80x80 / 48x32].
Transparent background.
Design cues: contemporary rural China, practical, lived-in, clean but not luxurious.
Do not draw readable shop text; use blank signboards for game-rendered text.
Avoid: European cottage, medieval fantasy, Japanese shrine, 3D render, full scene background, fake text, watermark.
```

### 13.4 物件模板

```text
Create small pixel art object sprites for a modern Chinese countryside farming RPG.
Objects: [shipping box, basket, price tag, water bucket, wooden sign, turnover crate].
View: three-quarter top-down 2D.
Grid: 16x16 pixel alignment, each object fits within 16x16 or 16x24 unless specified.
Use bottom center as pivot for Y-sort objects.
Transparent background, clear silhouette, readable at game size.
Avoid: excessive texture noise, realistic rendering, painterly lighting, random decorative clutter, fake text.
```

### 13.5 UI 图标模板

```text
Create pixel art UI icons for a farming RPG.
Icons: [hoe, watering can, seed bag, turnip, green bean, bok choy, coin, quest marker].
Size: 16x16 and optional 32x32 versions.
Style: crisp pixel art, clean silhouette, readable on light and dark UI.
Transparent background.
Avoid: realistic icon set, vector-flat style, soft gradients, tiny unreadable details.
```

## 14. 负面提示词

可在所有 AI 生成任务里加入：

```text
no 3D render, no realistic painting, no soft airbrush, no blurry image, no isometric diamond map, no medieval fantasy, no European castle, no cyberpunk neon, no anime illustration background, no full-map single background, no inconsistent perspective, no oversized UI text, no watermark, no logo, no text gibberish, no fake Chinese text
```

如果模型容易生成整张插画，还要追加：

```text
individual game assets only, sprite sheet, transparent background, grid aligned, modular tiles, no complete illustration scene
```

## 15. Godot 导入要求

像素素材导入 Godot 时使用：

```text
Texture Filter: Nearest
Mipmaps: Off
Compression: Lossless 或 Uncompressed
Pixel Snap: On
Integer scaling: On
```

不要让引擎自动平滑缩放像素图。导入后必须在游戏内用实际相机倍率检查，不能只在图片查看器里验收。

## 16. AI 生成后处理流程

AI 素材一般不能直接进入游戏，标准流程：

```text
AI 生成
  -> 选图
  -> 裁切到 16px 网格
  -> 清理透明背景
  -> 清理伪文字和水印
  -> 统一色板
  -> 修正透视和底边
  -> 标记 pivot / y_sort_point
  -> 标记 collision_rect / interaction_rect
  -> 导入 Godot
  -> 游戏内截图验收
```

如果一张图无法稳定切到网格，或透视和项目角度不一致，宁可重生成，不要强行塞进正式资产。

## 17. 验收清单

每批 AI 素材导入前检查：

- 是否符合三分之四俯视 2D，而不是菱形等距或 3D。
- 是否能按 `16x16 px` 网格切分。
- 角色是否为 `16x32 px`，脚底逻辑占地是否清楚。
- 物件是否有透明背景和清楚底边。
- 建筑是否能参与 Y-sort，底边和遮挡区域是否明确。
- 作物阶段在游戏尺寸下是否能一眼区分。
- 干耕地和湿耕地是否清楚不同。
- 公告栏、订单板、货箱、水源是否能被玩家识别为交互点。
- 是否存在多余文字、乱码、水印或 AI 伪文字。
- 是否过度噪声化，导致和角色、NPC、作物混在一起。
- 是否符合现代中国乡村，而不是西式农场或奇幻村庄。
- 是否能作为独立 sprite 或 tile 使用，而不是只能当一张插画看。
- 是否已经记录 pivot、Y-sort 点、碰撞范围和交互范围。
- 是否在 Godot 中使用 Nearest 过滤且无平滑缩放。
- 是否在实际相机倍率下截图检查过可读性。

## 18. 第一轮生成优先级

按 `P0/P1/P2` 分批生成，避免先做后期资产。

### P0：没有就不能跑通玩法

1. 地形 tile：草地、泥路、干耕地、湿耕地。
2. 农田状态：未开垦、已翻地、已浇水、已播种、可收获。
3. 三种作物阶段：芜菁、青豆、小白菜。
4. 水体：池塘水面、水边、打水点。
5. 玩家角色：4 向站立、4 向行走、向下锄地、播种、浇水、收获。
6. 核心交互物：货箱、水源、种子摊、公告栏。
7. 基础 UI：对话框、工具栏、背包、任务面板、交互提示。

### P1：增强识别和反馈

1. 老宅外观、茶铺、卫生站、杂货店。
2. 4 个核心 NPC。
3. 水桶、菜篮、价签、周转筐、木牌。
4. 晴天和小雨图标、节气和时间 UI。
5. 浇水水花、收获弹出、出售反馈、交互高亮。
6. 公告栏空状态和助农需求状态。

### P2：氛围和 polish

1. 石径、花床、碎石、杂草、小灌木、木篱笆、接触阴影。
2. 老宅室内家具：床、桌椅、书架、照片墙、农具挂钩、厨房基础件。
3. 种子摊附加菜篮、价签、周转筐。
4. 货箱出售后收据或反馈标记。
5. 茶铺和卫生站订单提示牌。
6. 雨线、水面波纹、柔和光照 overlay。

第一轮完成后，再开始生成助农集市、电商分拣、包装、快递、合作社和后山探索资产。
