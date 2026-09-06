# Art Resource Needs

当前代码基线：`v0.2.0`  
当前美术线：`art-0.2.18`  
当前动作线：`motion-0.2.7`

这个文件用于给美术线排后续资源。原则是先做“当前代码能直接读取、能明显提升一周目体验”的素材，再做需要额外代码适配的扩展素材。`v0.2.0` 已把 P0/P1/P2 接入层、审计清单、尺寸/锚点和 fallback 验收固定下来；已有玩家动作、村民、基础地形、建筑和直接可读资源不重复列为优先需求。

## 接入规则

- 资源根目录：`assets/game`
- 通用命名：`assets/game/<group>/<id>--<state>.png`
- `default` 状态可以省略后缀，例如 `objects/shippingBin.png`
- 运行时已有分组：`tiles`、`player`、`npcs`、`crops`、`fish`、`objects`、`buildables`、`tools`、`ui`
- 运行时已有状态：`default`、`locked`、`ruin`、`repairing`、`repaired`、`upgrade1`、`upgrade2`、`active`、`ready`、`depleted`、`completed`
- 透明 PNG，硬边像素，禁止照片感、柔焦、厚涂和水印
- 不要在素材里写中文标签；文字由代码/HUD/路牌负责

## 已有资源概况

- 玩家：`96x120`，已有待机、走路、跑步、锄地、浇水、镰刀、钓鱼等多帧动作。
- 村民：林岚、何涛、柳青、楠楠、陈伯已有 `96x120` 状态待机和 `talk_down`。
- 地形：草地、深草、耕地、土路、水面、村庄地砖、山石墙已有 base/alt/mask 资源。
- 建筑/对象：已有初始农舍、种子铺整图、杂货铺/合作商店整图、村民小屋、公共服务亭、出货箱、村情记录板、种子铺交互点、通用交互物、废墟状态、公共设施阶段图、主线/节庆交互物和山里资源点。
- 物品/UI：已有建造物、水产图鉴图标、通用 UI 图标和工具图标。

已补齐：P0 作物三态、公共设施阶段、山里资源点；P1 建造物、主线/节庆状态图、水产图标；P2 UI 和工具图标；当前地图通用交互物、废墟 `ruin/repairing` 状态和门/篱笆/耕地图块。  
后续明显缺口：四季地形换装、作物成长阶段细分、NPC 四方向走路/工作动画、玩家工具动作逐帧精修。

## P0：已接入/已补齐，保留为规格

### 1. 作物 sprites

代码当前直接读取 `crops/<cropId>--active|watered|ready.png`。`art-0.2.18` 已补齐这批资源；此表保留为后续返工和验收规格。暂时不要做多成长阶段文件，除非后续代码改为读取 stage。

| ID | 中文名 | 尺寸 | 状态 | 备注 |
|---|---|---:|---|---|
| `radish` | 萝卜 | `32x32` | `active/watered/ready` | 春季最早作物，ready 要能一眼看出红白萝卜 |
| `bokChoy` | 小白菜 | `32x32` | `active/watered/ready` | 春冬作物，叶片轮廓清楚 |
| `wheat` | 小麦 | `32x48` | `active/watered/ready` | 可略高，成熟时金黄麦穗 |
| `bean` | 豆子 | `32x48` | `active/watered/ready` | 可有小支架，但不要挡住相邻格 |
| `tomato` | 番茄 | `32x48` | `active/watered/ready` | 成熟红点明显 |
| `corn` | 玉米 | `32x48` | `active/watered/ready` | 高作物，脚点仍在格子底部 |
| `sweetPotato` | 红薯 | `32x32` | `active/watered/ready` | 成熟可露出红薯叶/藤蔓 |
| `spinach` | 菠菜 | `32x32` | `active/watered/ready` | 冬季可读，深绿但不糊成一团 |

验收重点：成熟态对玩法反馈最关键；高秆作物仍以格子底部为锚点。

### 2. 村情设施阶段 sprites

代码当前直接读取 `objects/communityFacility-<goalId>--<state>.png`。`art-0.2.18` 已补齐每个设施的 4 个状态：`ruin/repaired/upgrade1/upgrade2`。尺寸建议 `96x80`，底部对齐，交互点在设施正前方。

| goalId | 设施 | 文件 ID | 视觉阶段重点 |
|---|---|---|---|
| `childCare` | 课后托管教室 | `communityFacility-childCare` | 废旧教室 -> 亮灯教室 -> 课桌/公告 -> 菜畦和孩子活动痕迹 |
| `youthWorkshop` | 青年返乡工坊 | `communityFacility-youthWorkshop` | 空铺面 -> 工具桌 -> 包装/直播/维修 -> 完整培训工坊 |
| `elderCare` | 老人互助饭点 | `communityFacility-elderCare` | 旧灶台 -> 开火饭点 -> 餐桌和值班表 -> 稳定互助食堂 |
| `clinicRoute` | 乡医巡诊路线 | `communityFacility-clinicRoute` | 旧告示 -> 路线牌 -> 药箱/雨具 -> 完整巡诊站点 |
| `coldChain` | 冷链代收点 | `communityFacility-coldChain` | 空棚 -> 小冷柜 -> 分拣筐/电源 -> 成熟冷链代收点 |
| `waterCleanup` | 村塘清淤点 | `communityFacility-waterCleanup` | 杂物淤泥 -> 清淤工具 -> 清水边坡 -> 稳定亲水点 |

这组是设施升级反馈的核心视觉资源，后续如返工优先保证四阶段差异足够明显。

### 3. 山里资源点

代码当前直接读取 `objects/resourceNode-<resourceId>--locked|active|depleted.png`。`art-0.2.18` 已补齐这批资源。

| resourceId | 中文名 | 文件 ID | 尺寸 | 状态重点 |
|---|---|---|---:|---|
| `quarry` | 旧采石点 | `resourceNode-quarry` | `64x64` | active 有石块/矿点，depleted 剩碎石 |
| `forestEdge` | 林缘采集点 | `resourceNode-forestEdge` | `64x64` | active 有落枝/野菜，depleted 稀疏 |
| `toolShed` | 废弃工具棚 | `resourceNode-toolShed` | `64x64` 或 `96x80` | active 有旧铁件和工具，depleted 空架子 |

这组支撑春季 11 天后的山里资源线，也会影响工具升级和设施修复理解。

## P1：已接入/已补齐，保留为规格

### 4. 建造物 sprites

代码当前直接读取 `buildables/<id>--active.png` 或 `objects/<id>--active.png`，具体回退由对象描述决定。`art-0.2.18` 已按 `assets/game/buildables` 补齐这批资源。

| ID | 中文名 | 尺寸 | 备注 |
|---|---|---:|---|
| `processor` | 加工桶 | `32x48` | 木桶/小电机，和厨房加工区区分 |
| `dryer` | 晾晒架 | `64x48` | 竹架、晒盘，适合秋季加工线 |
| `flowerBox` | 花箱 | `32x32` | 装饰评分 |
| `gardenLamp` | 小路灯 | `32x48` | 夜间要能看出灯罩 |
| `bench` | 长椅 | `64x32` | 可休息，不阻挡移动 |
| `fence` | 篱笆 | `32x32` | 装饰，不作为硬碰撞 |

### 5. 主线/节庆对象状态

代码已有这些对象的状态判断。`art-0.2.18` 已补齐这批状态图。

| 对象 ID | 状态 | 建议尺寸 | 用途 |
|---|---|---:|---|
| `springFairStall` | `locked/active/completed` | `96x80` | 春集第 13-15 天入口 |
| `springSampleCrate` | `locked/active/ready/completed` | `64x48` | 春季样本箱 |
| `landShrine` | `active/ready/completed` | `64x64` | 土地庙最终收束 |
| `shop` | `locked/repaired` | `64x64` | 村庄杂货铺交互点 |
| `cooperativeDesk` | `locked/repaired/completed` | `64x48` | 合作社窗口 |
| `tourismDesk` | `locked/repaired/completed` | `64x48` | 游客服务亭 |
| `brandDesk` | `locked/repaired/completed` | `64x48` | 品牌包装台 |
| `irrigationPump` | `locked/repaired/completed` | `32x48` | 水利路线 |

注意：已有整栋建筑资源时，这些是“交互点/桌面/小设施”，不是再做一栋大建筑。

### 6. 水产图鉴图标

水产在玩法里有数据。`art-0.2.18` 已补齐 `32x32` 图鉴/背包图标；后续如果做钓鱼小游戏鱼影，再单独补 `--silhouette` 状态。

| ID | 中文名 | 解锁条件提示 |
|---|---|---|
| `waterweed` | 水草 | 全水质 |
| `crucian` | 小鲫鱼 | 农场池塘/村塘 |
| `snail` | 田螺 | 雨天加权 |
| `riverShrimp` | 河虾 | 村塘清淤 Lv.1 |
| `carp` | 鲤鱼 | 村塘清淤 Lv.1 |
| `loach` | 泥鳅 | 水质 Lv.2 |
| `grassFish` | 草鱼 | 水质 Lv.2 |
| `mountainTrout` | 山溪鱼 | 山溪/水质 Lv.2 |
| `springRelicFish` | 老泉鱼 | 水质 Lv.3 |

路径：`assets/game/fish/<id>.png`。

## P2：已接入/已补齐，保留为规格

### 7. UI icons

代码已有 UI 分组，`art-0.2.18` 已补齐这组图标，用于减少文本依赖。

| ID | 尺寸 | 用途 |
|---|---:|---|
| `gold` | `24x24` | 金币 |
| `energy` | `24x24` | 体力 |
| `weather` | `24x24` | 天气通用入口，后续可拆晴/雨 |
| `quest` | `24x24` | Q 任务面板 |
| `inventory` | `24x24` | I 背包 |
| `calendar` | `24x24` | 日历 |
| `map` | `24x24` | M 小地图 |
| `build` | `24x24` | B 建造 |
| `journal` | `24x24` | Tab 资料 |

### 8. 工具/物品 icons

路径：`assets/game/tools/<toolId>.png`，尺寸 `32x32`。  
工具 ID：`hand`、`hoe`、`seeds`、`wateringCan`、`scythe`、`fishingRod`。

种子和作物 UI 可以先复用作物图标；如果要单独做种子袋，建议后续补 `ui/seed-<cropId>.png`，当前代码还没有直接读取这套命名。

## P3：需要后续代码适配再做

### 9. 四季地形整套换装

当前代码已经能用颜色表现四季，但外部地形资源路径没有季节后缀。若要正式做四季素材，需要先决定代码读取方案：

- 方案 A：在现有 tile 文件上做统一色调处理，由代码按季节调色，不增加资源数量。
- 方案 B：新增 `tiles/<id>--spring|summer|autumn|winter.png`，并修改 `tileVisualDescriptor()` 支持季节状态。
- 方案 C：只给草地、深草、水面、土路做四季版，建筑不随季节变化。

建议先做方案 A 或 C，避免一次性生成 `mask x season x tile` 造成资源量失控。

### 10. 作物成长阶段细分

当前代码只读取 `active/watered/ready`，没有按 `stage` 读取图片。若要做每个作物 3-5 个成长阶段，需要先把 `cropVisualDescriptor()` 改成 `stage0/stage1/.../ready`。

建议等作物基础三态完成后再做。

### 11. NPC 四方向行走/工作动画

当前村民是静态 NPC，不寻路。已有 `active/ready/completed/talk_down` 已够用。后续如果加入巡逻或日程，再补：

- `npcs/<id>--walk_down_00..03.png`
- `npcs/<id>--walk_up_00..03.png`
- `npcs/<id>--walk_left_00..03.png`
- `npcs/<id>--walk_right_00..03.png`
- `npcs/<id>--work_down_00..02.png`

## 已完成制作顺序

1. 作物成熟态 `crops/*--ready.png`
2. 作物普通/浇水态 `crops/*--active.png`、`crops/*--watered.png`
3. 六个村情设施四阶段 `objects/communityFacility-*--ruin/repaired/upgrade1/upgrade2.png`
4. 三个山里资源点 `objects/resourceNode-*--locked/active/depleted.png`
5. 建造物 `buildables/*--active.png`
6. 土地庙、春集、样本箱、合作社/品牌/旅游/水利交互点状态图
7. 水产图鉴图标
8. UI 和工具图标
9. 下一阶段：四季地形与作物成长阶段扩展，或继续精修玩家/NPC 动作

## 验收标准

- 开启 `?assets=1` 后页面加载无 console error。
- 缺某张图时仍能回退到 Canvas 色块，不影响玩法。
- 作物、设施和资源点不需要靠文字标签也能看出状态变化。
- 设施 `ruin -> repaired -> upgrade1 -> upgrade2` 的差异要明显，不能只是换颜色。
- 低水质和高水质的水产图标要形成“水变好，物种变多”的主题感。
- 新图不能改变碰撞和交互范围；所有逻辑仍以 tile/object 数据为准。
