# Art Asset Size Bible

美术线目标：用 `32x32` tile 作为地图网格单位，但不把所有素材强行做成 `32x32`。地形、人物、设施和建筑分别用不同画布尺寸，并通过占地、锚点、碰撞和排序规则接入。

## Global Rules

- 网格单位：`1 tile = 32x32 px`。
- 美术风格：32px 当代中国乡村像素 RPG，清爽、温暖、现代乡村，可读性优先。
- 所有外部素材保持像素风：硬边、清晰像素、无厚涂、无柔焦、无真实照片质感。
- 建筑视角固定为俯视农场 RPG 视角：正立面朝向屏幕下方玩家，屋顶顶面可见，侧墙厚度很薄；不要等距 45 度斜视、纯侧面或厚 3D 透视。
- 透明 PNG 是最终目标；临时测试图可以用纯色背景，但接入游戏前要转透明。
- 地形素材严格贴 `32x32` 网格；非地形素材允许向上、左右视觉溢出。
- 交互、碰撞和遮挡排序只看逻辑占地与锚点，不看整张图的最大画布。

## Asset Metadata

每个非地形素材最终都要能描述成下面这类数据：

```js
{
  id: "seed_shop",
  group: "objects",
  spriteW: 128,
  spriteH: 112,
  footprintW: 4,
  footprintH: 3,
  anchor: "bottom-left",
  anchorX: 0,
  anchorY: 112,
  sortOffsetY: 0,
  collision: [
    [0, 1], [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2]
  ]
}
```

- `spriteW/spriteH`：PNG 实际画布尺寸。
- `footprintW/footprintH`：地图逻辑占地格数。
- `anchor`：素材如何贴到地图格子，默认使用 `bottom-left`。
- `anchorX/anchorY`：素材内锚点像素坐标，通常是左下角或底部中心。
- `sortOffsetY`：遮挡排序修正。高物体但脚点较低时通常保持 `0`。
- `collision`：真正挡路的占地格；可以小于视觉面积。

## Size Classes

| Class | Use | Footprint | Sprite Canvas | Anchor | Notes |
|---|---|---:|---:|---|---|
| `tile_1x1` | 草地、道路、水、农田、山石地表 | `1x1` | `32x32` | none | 不能溢出格子 |
| `tile_variant` | 地形边缘、转角、过渡 | `1x1` | `32x32` | none | 用 autotile 或命名变体 |
| `crop_small` | 幼苗、低矮作物 | `1x1` | `32x32` | bottom-center | 允许顶部少量透明 |
| `crop_tall` | 玉米、番茄架等 | `1x1` | `32x48` | bottom-center | 碰撞仍为种植格 |
| `prop_tiny` | 石头、杂草、小箱、桶 | `1x1` | `32x32` | bottom-center | 主要用于资源点 |
| `prop_tall` | 水泵、路灯、小牌子 | `1x1` | `32x48` | bottom-center | 图像可向上溢出 |
| `prop_wide` | 长椅、包装台、小摊 | `2x1` | `64x48` | bottom-left | 碰撞通常占底部一行 |
| `facility_small` | 出货箱、公告栏、土地庙小型版 | `1x1` 或 `2x1` | `32x48` / `64x64` | bottom-left | 交互点放在正面格 |
| `facility_medium` | 电商角、合作社窗口、游客亭 | `2x2` 或 `3x2` | `64x80` / `96x80` | bottom-left | 允许招牌/屋檐向上 |
| `building_small` | 小农舍、种子铺、小杂货铺 | `3x3` 或 `4x3` | `96x112` / `128x112` | bottom-left | 门应落在底部占地格 |
| `building_large` | 合作社、村委、扩建建筑 | `5x4` 或 `6x5` | `160x144` / `192x176` | bottom-left | 需要单独碰撞矩阵 |
| `building_baked_map` | 已写进地图层的大房子 | `6x7` 到 `10x8` | `192x224` 到 `320x256` | top-left | 用整图替换 roof/wall/door 瓦片 |
| `tree` | 树、竹丛、大灌木 | `1x1` 或 `2x2` | `64x96` / `96x112` | bottom-center | 树冠视觉溢出，树干碰撞小 |
| `character` | 玩家、村民 | logical `1x1` | `96x120` | feet-center | 玩家和村民脚点统一为 `(48,108)`；旧 `32x40/64x80` 仅作为历史源 |
| `animal` | 鸡、狗、鱼影等 | logical `1x1` | `32x32` / `48x32` | feet-center | 后续扩展 |
| `ui_icon` | 工具、物品、任务图标 | none | `16x16` / `24x24` / `32x32` | none | UI 独立缩放 |

## Priority Asset List

第一轮测试素材只做这些规格，避免尺寸失控。

| ID | Chinese Name | Group | Footprint | Sprite | Collision | Notes |
|---|---|---|---:|---:|---|---|
| `grass_spring` | 春草 | `tiles` | `1x1` | `32x32` | none | 3-4 个细节变体 |
| `path_dirt` | 土路 | `tiles` | `1x1` | `32x32` | none | 需要边缘破碎变体 |
| `field_tilled` | 耕地 | `tiles` | `1x1` | `32x32` | none | 干/湿两态 |
| `water_canal` | 水渠 | `tiles` | `1x1` | `32x32` | block | 3 帧水纹 |
| `grass/deepGrass/dirt/path/water/floor/wall` | 地图地形瓦片 | `tiles` | `1x1` | `32x32` | map layer | `art-0.2.8` AI 生成 base/alt；`art-0.2.11` 为 dirt/path/water/floor/wall 增加 mask；`art-0.2.13` 增加 deepGrass mask 并重调中心纹理；屋顶瓦不属于地形生成 |
| `player_farmer` | 玩家 | `player` | `1x1` | `96x120` | player body | `idle/walk/run` 和常用工具动作均为多帧 |
| `npc_story_villagers` | 林岚、何涛、柳青、楠楠、陈伯 | `npcs` | `1x1` | `96x120` | npc body | 状态待机帧和 `talk_down` 两帧，脚点 `(48,108)` |
| `shipping_box` | 出货箱 | `objects` | `1x1` | `32x40` | `[0,0]` | 顶盖可打开态 |
| `old_pump` | 旧水泵 | `objects` | `1x1` | `32x48` | `[0,0]` | 蓝灰金属 |
| `notice_board` | 村情记录板 | `objects` | `2x1` | `64x64` | `[0,0],[1,0]` | 黄纸公告要清晰 |
| `earth_shrine` | 土地庙 | `objects` | `2x1` | `64x64` | `[0,0],[1,0]` | 红瓦小庙、香炉 |
| `ecommerce_corner` | 电商助农角 | `objects` | `3x2` | `96x80` | bottom row | 纸箱、货架、二维码块 |
| `packaging_table` | 品牌包装台 | `objects` | `2x1` | `64x48` | `[0,0],[1,0]` | 包装盒、秤、小贴纸 |
| `seed_shop` | 种子铺 | `objects` | `4x3` | `128x112` | lower 2 rows | 条纹棚、门在底部 |
| `farmhouse_small` | 初始农舍 | `objects` | `4x3` | `128x128` | lower 2 rows | 红瓦、白墙、门廊 |
| `grocery_ruin` | 停业杂货铺 | `objects` | `4x3` | `128x112` | lower 2 rows | 可做 `ruin/repaired` 两态 |
| `farmhouseSmall` | 地图农舍整图 | `objects` | `7x6` | `224x192` | existing map collision | AI 建筑整图，top-left 锚点 |
| `seedShopBuilding` | 村庄种子铺整图 | `objects` | `10x8` | `320x256` | existing map collision | AI 建筑整图，top-left 锚点 |
| `villageShopBuilding` | 村庄合作商店整图 | `objects` | `10x8` | `320x256` | existing map collision | AI 建筑整图，top-left 锚点 |
| `villageSmallHouse` | 村民小屋整图 | `objects` | `7x7` | `224x224` | existing map collision | AI 建筑整图，top-left 锚点 |
| `villageServiceHouse` | 公共服务亭整图 | `objects` | `6x7` | `192x224` | existing map collision | AI 建筑整图，top-left 锚点 |

## Terrain Mask Rules

`art-0.2.13` 地形边缘使用四向邻接 mask，不改地图数据，只由运行时读取同一图层邻居决定视觉形态。

- 命名：`assets/game/tiles/<id>--m<mask>.png`，例如 `path--m6.png`。
- 适用 ID：`deepGrass / dirt / path / water / floor / wall`。
- 不适用 ID：`grass` 保留 base/alt 细节变体；`roof` 不生成地形瓦片。
- mask 位：北 `1`、东 `2`、南 `4`、西 `8`，相加得到 `m0..m15`。
- `m15` 作为完整中心瓦片文件保留，但运行时优先使用坐标相关的 `<id>.png / --alt1 / --alt2`，避免大面积中心块重复同一张图；边缘和转角才用 mask。
- `wall` mask 只用于 `ground` 图层的山石/岩壁底面，不用于建筑墙面。
- 树木后续作为 `objects/tree*` 独立 sprite，不能再用 `front roof + buildings wall` 组合充当树冠和树根。

## Character Frames

玩家和村民目标规格统一为 `96x120`，脚点位于 `(48,108)`。旧 `32x40/64x80` 人物素材只作为历史源或回退参考，不再作为当前运行时目标。源 atlas 只归档在 `asset_runs`，运行时读取拆好的单帧 PNG。

| Action | Directions | Frames | File Pattern |
|---|---|---:|---|
| `idle` | down/up/left/right | 2 | `player/idle_down_00.png` |
| `walk` | down/up/left/right | 4 | `player/walk_down_00.png` |
| `run` | down/up/left/right | 6 | `player/run_down_00.png`，缺帧时回退 `player/run_down.png` |
| `inspect` | down/up/left/right | 4 | `player/inspect_down_00.png` |
| `hoe` | down/up/left/right | 5 | `player/hoe_down_00.png` |
| `wateringCan` | down/up/left/right | 5 | `player/wateringCan_down_00.png` |
| `scythe` | down/up/left/right | 6 | `player/scythe_down_00.png` |
| `fishingRod` | down/up/left/right | 6 | `player/fishingRod_down_00.png`，抛竿后停在等待姿势 |
| `fishingCatch` | down/up/left/right | 6 | `player/fishingCatch_down_00.png`，命中后循环 reel/pull |
| `harvest` | down/up/left/right | 5 | `player/harvest_down_00.png` |
| `seeds/sleep/warp` | down/up/left/right | 1 | `player/seeds_down.png` 等静态回退 |
| `npc_static` | down/front | 2 | `npcs/<id>--active_00.png` / `_01.png`，缺帧回退 `npcs/<id>--active.png` (`96x120`) |
| `talk_down` | down/front | 2 | `npcs/<id>--talk_down_00.png` / `_01.png`，缺帧回退 `npcs/<id>--talk_down.png` |
| `work` | down/left/right | 3 | 预留：`npcs/<id>/work_down_00.png` |

单帧文件规则：

- 每个动作帧是一个独立透明 PNG，不裁切 sheet。
- 文件名使用两位帧序号：`walk_down_00.png`、`walk_down_01.png`。
- 同一角色的所有帧必须保持完全相同的画布尺寸和脚点位置。
- 单帧生成时必须在 prompt 里写清楚 `Frame id`，例如 `player/walk_down_02`。
- 当前代码支持 `assets/game/player/<action>_<direction>_<frame>.png`，缺帧时回退到 `<action>_<direction>.png`。
- 当前 NPC 静态图支持 `assets/game/npcs/<id>--<state>_<frame>.png`，运行时按 `96x120` 和脚点 `(48,108)` 绘制；缺帧时回退到 `assets/game/npcs/<id>--<state>.png`。

## Building Anchors

大建筑统一使用 `bottom-left` 锚点：

- 地图对象坐标 `(x, y)` 表示建筑占地矩形的左下角起点，实际渲染位置为 `x * 32, (y + footprintH) * 32 - spriteH`。
- 视觉屋顶可以向上溢出，但门、台阶、招牌下沿要落在占地底部 1-2 行。
- 玩家走到建筑前方时，玩家应盖在建筑底部前景小物件之上；玩家走到建筑后方时，建筑应盖住玩家。后续代码接入用 `sortY = object.y * 32 + footprintH * 32 + sortOffsetY`。

当前 `art-0.2.7` 接入的地图内固定建筑使用 `top-left` 锚点，因为它们替换的是已经写进 `buildings` 图层的矩形瓦片区域。配置里的 `(x, y)` 表示原 roof/wall/door 矩形左上角，PNG 画布尺寸直接等于该矩形的 tile 尺寸。

## Generation Prompt Template

生成单个建筑或设施时，用这个模板，不要只写“做一个像素建筑”。

```text
Create a transparent PNG pixel art sprite for a top-down 3/4 contemporary Chinese countryside farming RPG.
Asset id: seed_shop.
Canvas size: 128x112 px.
Map footprint: 4x3 tiles, 32 px per tile.
Anchor: bottom-left, with the bottom edge aligned to the footprint bottom.
Style: crisp square pixel art, warm clean modern rural China, readable at 32px tile scale, no painterly blur.
Subject: small village seed shop, muted red tile roof, cream wall, striped awning, seed crates near the front, centered door on the bottom row.
Collision expectation: lower two footprint rows are blocked; roof may visually extend upward.
Background: transparent, no shadow outside the sprite, no text label, no watermark.
```

## Review Checklist

- 素材是否能在 `32x32` 网格上对齐？
- 是否能一眼看出用途，而不是依赖文字标签？
- 建筑的门和交互面是否落在占地底部？
- 视觉高度是否过高，遮住太多可操作区域？
- 同类素材的像素密度是否一致？
- 调色是否仍属于清爽温暖的现代中国乡村，而不是欧美农场或幻想小镇？
- 是否有透明背景、硬边像素、无抗锯齿污染？
