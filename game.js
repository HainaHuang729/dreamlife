const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const tile = 32;
const world = { width: 30, height: 20 };
const viewMode = {
  id: "threeQuarter2d",
  name: "锁定斜俯视 2D + Y-sort",
  locked: true,
  scaleX: 1,
  scaleY: 0.9,
  originX: 0,
  originY: 30,
  depthMode: "y-sort"
};
const keys = new Set();
const rng = mulberry32(1937);

const fallbackAssetManifest = {
  sprites: {
    farmhouse: { src: "assets/sprites/farmhouse.svg", widthTiles: 5, heightTiles: 4 },
    greenhouse: { src: "assets/sprites/greenhouse.svg", widthTiles: 4, heightTiles: 3 },
    seedStand: { src: "assets/sprites/seed-stand.svg", widthTiles: 3, heightTiles: 2 },
    chickenCoop: { src: "assets/sprites/chicken-coop.svg", widthTiles: 3, heightTiles: 3 },
    villageShop: { src: "assets/sprites/village-shop.svg", widthTiles: 5, heightTiles: 4 },
    clinic: { src: "assets/sprites/clinic.svg", widthTiles: 5, heightTiles: 4 },
    teahouse: { src: "assets/sprites/teahouse.svg", widthTiles: 5, heightTiles: 4 },
    visitorKiosk: { src: "assets/sprites/visitor-kiosk.svg", widthTiles: 3, heightTiles: 2 }
  },
  tilesets: {},
  maps: {}
};

const assetManifest = window.ChenguAssetManifest || fallbackAssetManifest;
const spriteDefinitions = {
  ...fallbackAssetManifest.sprites,
  ...(assetManifest.sprites || {})
};
const spriteAssets = Object.fromEntries(Object.entries(spriteDefinitions).map(([id, definition]) => {
  const image = new Image();
  image.src = definition.src;
  return [id, image];
}));

const tools = [
  { id: "hoe", name: "锄头" },
  { id: "water", name: "水壶" },
  { id: "seed", name: "种子" },
  { id: "scythe", name: "镰刀" },
  { id: "brush", name: "授粉刷" },
  { id: "axe", name: "斧头" }
];

const toolStageDefinitions = {
  1: { name: "普通工具", range: "1 格", hoeName: "普通锄头", waterName: "普通水壶", hoeCost: 2, waterCost: 1 },
  2: { name: "铜制工具", range: "横向 3 格", hoeName: "铜锄头", waterName: "铜水壶", hoeCost: 1.5, waterCost: 0.8 },
  3: { name: "铁制工具", range: "3x3", hoeName: "铁锄头", waterName: "铁水壶", hoeCost: 1.1, waterCost: 0.55 },
  4: { name: "金制智能工具", range: "5x5", hoeName: "金制锄头", waterName: "金制水壶", hoeCost: 0.8, waterCost: 0.35 }
};

const toolUpgradeDefinitions = {
  2: {
    level: 2,
    name: "铜制工具",
    range: "横向 3 格",
    money: 0,
    materials: {},
    isUnlocked: () => state.quests.helpedVillage,
    unlockText: "完成第一批助农销售"
  },
  3: {
    level: 3,
    name: "铁制工具",
    range: "3x3",
    money: 180,
    materials: { ironParts: 2 },
    isUnlocked: () => state.quests.courierStation,
    unlockText: "完成分拣打包和快递进村"
  },
  4: {
    level: 4,
    name: "金制智能工具",
    range: "5x5",
    money: 360,
    materials: { alloyParts: 2 },
    isUnlocked: () => state.quests.liveStream && state.quests.halfDayTrail,
    unlockText: "完成直播助农并开放半日徒步线"
  }
};

const materialNames = {
  ironParts: "铁件",
  alloyParts: "合金组件"
};

const sortingSteps = [
  { name: "按大小分级", score: 12, note: "把规格接近的农货放进同一批次，方便定价。" },
  { name: "剔除破损", score: 16, note: "把磕碰、过熟和品相差的挑出来，减少售后。" },
  { name: "贴溯源码", score: 14, note: "记录产地、节气和批次，让顾客知道买的是什么。" }
];

const packagingDesignDefinitions = [
  {
    id: "plain",
    name: "普通纸箱",
    protection: 0,
    brand: 0,
    cost: 0,
    isUnlocked: () => true,
    description: "能发货，但防压和品牌感都弱。"
  },
  {
    id: "buffered",
    name: "防压保鲜箱",
    protection: 8,
    brand: 2,
    cost: 36,
    isUnlocked: () => state.quests.packagedProduce,
    description: "增加缓冲和保鲜垫，降低生鲜损耗。"
  },
  {
    id: "solarTermGift",
    name: "节气故事礼盒",
    protection: 6,
    brand: 8,
    cost: 68,
    isUnlocked: () => state.quests.liveStream,
    description: "把节气、产地和村民故事印进包装，适合直播复购。"
  },
  {
    id: "ecoTravelBox",
    name: "环保伴手礼盒",
    protection: 7,
    brand: 7,
    cost: 82,
    isUnlocked: () => state.quests.halfDayTrail,
    description: "可回收包装，适合游客带走，也符合景区生态定位。"
  }
];

const aidCaseDefinitions = [
  {
    id: "unsoldGreens",
    title: "滞销菜篮上行",
    reality: "把滞销农货分级、打包后接入社区团购，不靠一次性叫卖。",
    requirements: [
      { kind: "quest", key: "packagedProduce", label: "完成分级打包" },
      { kind: "sortedBatches", count: 1, label: "分拣批次 1" },
      { kind: "mixedSellables", count: 2, label: "可发农货 2" }
    ],
    reward: 96,
    brand: 8,
    impact: 10,
    repeat: 1,
    result: "形成第一批标准社区团购菜篮。"
  },
  {
    id: "coldChainTrial",
    title: "生鲜小单冷链测试",
    reality: "先用小批量发货测损耗，再决定是否扩大订单。",
    requirements: [
      { kind: "quest", key: "courierStation", label: "快递进村" },
      { kind: "parcelsSent", count: 1, label: "已寄包裹 1" },
      { kind: "lastParcelLossAtMost", count: 16, label: "最近损耗不高于 16%" }
    ],
    reward: 118,
    brand: 10,
    impact: 12,
    feedback: 8,
    result: "快递点掌握了保温箱、发车时间和售后记录。"
  },
  {
    id: "traceableBrand",
    title: "一村一品溯源卡",
    reality: "用溯源码、节气故事和产地说明，让农产品从散货变成品牌货。",
    requirements: [
      { kind: "quest", key: "liveStream", label: "完成第一次直播" },
      { kind: "liveFeedback", count: 30, label: "好评热度 30" },
      { kind: "money", count: 60, label: "品牌打样 60 金" }
    ],
    reward: 142,
    brand: 18,
    impact: 14,
    feedback: 10,
    result: "包装、直播话术和溯源信息统一成晨谷品牌。"
  },
  {
    id: "contractFarming",
    title: "订单农业排产",
    reality: "合作社根据稳定订单安排种植、加工和发货，减少盲目扩产。",
    requirements: [
      { kind: "cooperativeFounded", label: "成立合作社" },
      { kind: "communityOrders", count: 2, label: "社区订单 2" },
      { kind: "termOrders", count: 2, label: "节气订单 2" }
    ],
    reward: 188,
    brand: 14,
    impact: 18,
    contract: 1,
    grant: { alloyParts: 1 },
    result: "合作社拿到第一份按节气排产的稳定订单。"
  }
];

const toolIcons = {
  hoe: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#8b5b32" d="M18 8h4v20h-4z" transform="rotate(38 20 18)"/>
      <path fill="#c7c0a7" d="M9 5h15v5H9z"/>
      <path fill="#817866" d="M8 9h5v12H8z"/>
      <path fill="#eee2bb" d="M10 5h13v2H10z"/>
    </svg>
  `,
  water: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#6f8fa6" d="M8 13h15v12H8z"/>
      <path fill="#9ec1d3" d="M10 10h10v4H10z"/>
      <path fill="#516d82" d="M22 15h5v4h-5z"/>
      <path fill="#9ec1d3" d="M5 15h5v3H5z"/>
      <path fill="#cce7ef" d="M11 15h8v2h-8z"/>
      <path fill="#73b7d4" d="M26 21h2v2h-2zm-4 2h2v2h-2zm6 3h2v2h-2z"/>
    </svg>
  `,
  seed: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#c99a53" d="M9 10h14l3 17H6z"/>
      <path fill="#7b4a2b" d="M10 8h12v5H10z"/>
      <path fill="#f4d37b" d="M11 15h10v6H11z"/>
      <path fill="#3f8b45" d="M15 24c-5-4-1-9 5-9 1 6-2 9-5 9z"/>
      <path fill="#245c35" d="M14 26h3v-8h-3z"/>
    </svg>
  `,
  scythe: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#8b5b32" d="M16 7h4v22h-4z" transform="rotate(-34 18 18)"/>
      <path fill="#d8d0ba" d="M8 5c8-2 14 2 17 9-6-4-12-5-18-3z"/>
      <path fill="#8f8878" d="M6 9c7 0 13 2 17 7-7-2-13-2-18 0z"/>
    </svg>
  `,
  brush: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#8b5b32" d="M17 5h4v24h-4z" transform="rotate(34 19 17)"/>
      <path fill="#c8c2af" d="M7 6h10v7H7z" transform="rotate(34 12 10)"/>
      <path fill="#d95a65" d="M5 8h7v3H5z" transform="rotate(34 8 10)"/>
      <path fill="#f0c85e" d="M4 12h8v3H4z" transform="rotate(34 8 14)"/>
      <path fill="#5f8ed6" d="M7 15h7v3H7z" transform="rotate(34 10 17)"/>
    </svg>
  `,
  axe: `
    <svg class="tool-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path fill="#8b5b32" d="M17 9h4v20h-4z" transform="rotate(28 19 19)"/>
      <path fill="#c8c2af" d="M8 6h10l5 5-5 6H8z"/>
      <path fill="#7f786a" d="M16 6h5l4 5-4 5h-5l4-5z"/>
      <path fill="#eee2bb" d="M9 7h8v2H9z"/>
    </svg>
  `
};

const cropTypes = {
  turnip: { name: "芜菁", seedName: "芜菁种子", days: 3, seedPrice: 10, sell: 24, color: "#e7dce7" },
  bean: { name: "青豆", seedName: "青豆种子", days: 4, seedPrice: 16, sell: 42, color: "#65b96f" },
  flower: { name: "花", seedName: "花种", days: 3, seedPrice: 12, sell: 18, color: "#f2d0df" }
};

const seedOrder = ["turnip", "bean", "flower"];

const flowerLoci = ["red", "yellow", "blue"];
const starterFlowerGenes = [
  { red: [1, 0], yellow: [0, 0], blue: [0, 0] },
  { red: [0, 0], yellow: [1, 0], blue: [0, 0] },
  { red: [0, 0], yellow: [0, 0], blue: [1, 0] },
  { red: [0, 0], yellow: [0, 0], blue: [0, 0] }
];

const flowerColors = {
  white: { name: "白花", color: "#f7f2df", sell: 18 },
  red: { name: "红花", color: "#d95a65", sell: 24 },
  yellow: { name: "黄花", color: "#f0c85e", sell: 24 },
  blue: { name: "蓝花", color: "#5f8ed6", sell: 26 },
  orange: { name: "橙花", color: "#e68a3f", sell: 34 },
  purple: { name: "紫花", color: "#9b6ad6", sell: 38 },
  green: { name: "绿花", color: "#72b86a", sell: 40 },
  rainbow: { name: "彩虹花", color: "#f08fc4", sell: 60 },
  aurora: { name: "星辉花", color: "#f4f1df", sell: 120 }
};

const flowerOrderDefinitions = [
  {
    id: "teaVase",
    title: "茶铺小花瓶",
    kind: "any",
    count: 2,
    reward: 68,
    isUnlocked: () => state.quests.visitedCafe || state.quests.helpedVillage,
    description: "茶铺想先摆一组桌花，让游客进门就能看到村里的花田。"
  },
  {
    id: "warmBouquet",
    title: "民宿暖色花束",
    colors: { red: 1, yellow: 1 },
    reward: 126,
    isUnlocked: () => state.quests.helpedVillage,
    description: "民宿房间需要暖色花束，适合做伴手礼照片。"
  },
  {
    id: "researchSample",
    title: "研学稀有花样本",
    colors: { rainbow: 1 },
    reward: 220,
    isUnlocked: () => state.flowerBreeding.greenhouse,
    description: "研学课想展示稳定杂交成果，需要一朵彩虹花。"
  },
  {
    id: "auroraSpecimen",
    title: "星辉花育种样本",
    colors: { aurora: 1 },
    reward: 360,
    isUnlocked: () => state.flowerBreeding.rareMutations > 0,
    description: "花卉合作社要登记稀有突变样本，申请村级新品展示。"
  }
];

const fishTypes = {
  crucian: { name: "鲫鱼", sell: 18, color: "#b5a36f", habitats: ["pond", "river"], baseWeight: 18 },
  carp: { name: "鲤鱼", sell: 30, color: "#d08c4e", habitats: ["pond"], baseWeight: 12 },
  catfish: { name: "鲶鱼", sell: 34, color: "#6d6a5e", habitats: ["pond", "river"], baseWeight: 8 },
  loach: { name: "泥鳅", sell: 16, color: "#8a6a45", habitats: ["pond"], baseWeight: 14 },
  trout: { name: "溪鳟", sell: 42, color: "#86a8b5", habitats: ["river"], baseWeight: 12 },
  sweetfish: { name: "香鱼", sell: 38, color: "#c8c4a2", habitats: ["river"], baseWeight: 10 },
  koi: { name: "锦鲤", sell: 80, color: "#f0c76c", habitats: ["pond"], baseWeight: 2 },
  snowtrout: { name: "雪山冷水鱼", sell: 88, color: "#d8f1f6", habitats: ["river"], baseWeight: 2 },
  peachfish: { name: "桃花鱼", sell: 56, color: "#ef9ab0", habitats: ["river"], baseWeight: 0, seasonalTerms: ["惊蛰", "春分", "清明"] },
  ricefish: { name: "稻花鱼", sell: 52, color: "#d9c16f", habitats: ["pond"], baseWeight: 0, seasonalTerms: ["芒种", "夏至", "小暑", "大暑"] }
};

const fishOrder = ["crucian", "carp", "catfish", "loach", "trout", "sweetfish", "koi", "snowtrout", "peachfish", "ricefish"];
const aquariumCapacity = 6;

const fishQualityDefinitions = {
  normal: { name: "普通", multiplier: 1, score: 1 },
  silver: { name: "银星", multiplier: 1.35, score: 2 },
  gold: { name: "金星", multiplier: 1.75, score: 3 },
  specimen: { name: "标本级", multiplier: 2.4, score: 5 }
};
const fishQualityOrder = ["normal", "silver", "gold", "specimen"];
const fishSellQualityOrder = ["normal", "silver", "gold", "specimen"];
const fishOrderQualityPreference = ["specimen", "gold", "silver", "normal"];

const rodDefinitions = {
  1: { name: "竹制鱼竿", catchBonus: 0, qualityBonus: 0, rareBonus: 0, energyDiscount: 0 },
  2: { name: "碳素鱼竿", catchBonus: 0.07, qualityBonus: 0.08, rareBonus: 3, energyDiscount: 1, money: 120 },
  3: { name: "智能探鱼竿", catchBonus: 0.11, qualityBonus: 0.16, rareBonus: 7, energyDiscount: 2, money: 260 }
};

const baitDefinitions = {
  grain: {
    name: "谷物鱼饵",
    cost: 24,
    uses: 4,
    unlock: () => fishJournalCount() >= 2 || state.quests.surveyedRiver,
    catchBonus: 0.04,
    qualityBonus: 0.03,
    targetFish: ["crucian", "carp", "loach", "ricefish"]
  },
  insect: {
    name: "昆虫鱼饵",
    cost: 36,
    uses: 4,
    unlock: () => state.fishing.rodLevel >= 2,
    catchBonus: 0.06,
    qualityBonus: 0.07,
    targetFish: ["catfish", "trout", "sweetfish", "peachfish"]
  },
  eco: {
    name: "生态诱饵",
    cost: 58,
    uses: 4,
    unlock: () => state.quests.halfDayTrail || state.fishing.fishPond,
    catchBonus: 0.08,
    qualityBonus: 0.1,
    targetFish: ["koi", "snowtrout", "peachfish", "ricefish"]
  }
};

const fishingOrderDefinitions = [
  {
    id: "pondFamilyMeal",
    title: "池塘家常鱼鲜",
    reward: 88,
    requirements: [{ kind: "fishAny", count: 2 }],
    isUnlocked: () => fishJournalCount() >= 2 || state.quests.surveyedRiver,
    description: "茶铺想先试一桌家常鱼鲜，看看村里水域能不能稳定供货。"
  },
  {
    id: "homestaySoup",
    title: "民宿鱼汤套餐",
    reward: 168,
    requirements: [{ kind: "fishAny", count: 3 }, { kind: "qualityScore", count: 5 }],
    isUnlocked: () => state.quests.plannedHomestay,
    description: "民宿要把夜宿游客留下来，需要一锅有品质的本地鱼汤。"
  },
  {
    id: "parentChildAngling",
    title: "亲子垂钓研学",
    reward: 230,
    requirements: [{ kind: "fishDiversity", count: 3 }],
    isUnlocked: () => state.quests.halfDayTrail,
    description: "游客中心想设计亲子垂钓课，需要展示不同水域和鱼种。"
  },
  {
    id: "snowHotpot",
    title: "雪山冷水鱼暖锅",
    reward: 280,
    requirements: [{ kind: "fish", item: "snowtrout", count: 1 }, { kind: "qualityScore", count: 3 }],
    isUnlocked: () => state.quests.halfDayTrail && ["立冬", "小雪", "大雪", "冬至", "小寒", "大寒"].includes(currentSolarTerm()),
    description: "冬季景区主推雪景暖锅，需要一条冷水鱼做招牌。"
  }
];

const solarTerms = [
  "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
  "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
  "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
  "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"
];

const seasonDefinitions = [
  {
    id: "spring",
    name: "春色",
    visual: "嫩绿草地、浅蓝河水、花点更亮",
    tint: "rgba(153, 205, 118, 0.04)",
    palette: {
      grass: ["#72a85a", "#7bb766"],
      forest: ["#2f6f45", "#3d8b53"],
      soil: "#704a2c",
      road: ["#bea06e", "#cdb47a"],
      trail: ["#9f8d62", "#af9b6e"],
      river: ["#3b9bc0", "#43a9ca"],
      snow: ["#eef7f7", "#dceef1"],
      rock: ["#7d8580", "#6d756f"],
      flowerStem: "#3b7a45",
      flowerA: "#f0d46a",
      flowerB: "#e9828d",
      pineTrunk: "#4b3322"
    }
  },
  {
    id: "summer",
    name: "夏色",
    visual: "浓绿树影、深蓝河水、土地更湿热",
    tint: "rgba(242, 190, 93, 0.045)",
    palette: {
      grass: ["#4f8a43", "#5d984a"],
      forest: ["#214c32", "#2c6640"],
      soil: "#654126",
      road: ["#b99458", "#c4a160"],
      trail: ["#8f7951", "#9d8559"],
      river: ["#2a84a8", "#3195b8"],
      snow: ["#e6f0f1", "#d2e4e7"],
      rock: ["#737a72", "#626a63"],
      flowerStem: "#2f6a37",
      flowerA: "#f0c85e",
      flowerB: "#d95a65",
      pineTrunk: "#4a2f1d"
    }
  },
  {
    id: "autumn",
    name: "秋色",
    visual: "金黄草坡、暖色林地、丰收感更强",
    tint: "rgba(211, 137, 54, 0.08)",
    palette: {
      grass: ["#8f8b4d", "#a59a58"],
      forest: ["#666735", "#866a38"],
      soil: "#6d4327",
      road: ["#c19a5b", "#d0a968"],
      trail: ["#a77c49", "#b48950"],
      river: ["#367fa1", "#3b8cab"],
      snow: ["#e7eff0", "#d8e6e8"],
      rock: ["#7b796b", "#696858"],
      flowerStem: "#5f7434",
      flowerA: "#d8a24d",
      flowerB: "#d96d74",
      pineTrunk: "#54361f"
    }
  },
  {
    id: "winter",
    name: "冬色",
    visual: "冷灰草地、青蓝河水、雪山更突出",
    tint: "rgba(160, 202, 224, 0.1)",
    palette: {
      grass: ["#8fa092", "#9fac9e"],
      forest: ["#3f5548", "#51685b"],
      soil: "#59412f",
      road: ["#a99c83", "#b6aa90"],
      trail: ["#92866d", "#9f9277"],
      river: ["#5e9bad", "#6daabb"],
      snow: ["#eef7fb", "#dbeaf0"],
      rock: ["#858987", "#737b78"],
      flowerStem: "#60765b",
      flowerA: "#d8c17a",
      flowerB: "#c8898a",
      pineTrunk: "#3f3026"
    }
  }
];

const solarTermFarmProfiles = {
  立春: { good: ["turnip", "flower"], tough: ["bean"], note: "返青期适合叶菜和花苗，豆类还偏早。" },
  雨水: { good: ["turnip", "flower"], tough: [], note: "雨水增多，浅根作物更容易缓苗。" },
  惊蛰: { good: ["bean", "flower"], tough: [], note: "气温回升，豆类和花卉开始活跃。" },
  春分: { good: ["turnip", "bean", "flower"], tough: [], note: "昼夜均衡，多数作物长势稳定。" },
  清明: { good: ["flower", "turnip"], tough: [], note: "适合青团原料、春菜和踏青花材。" },
  谷雨: { good: ["bean", "flower"], tough: [], note: "雨热渐配合，适合育苗和豆类起势。" },
  立夏: { good: ["bean", "flower"], tough: ["turnip"], note: "入夏后豆类更舒服，芜菁开始怕热。" },
  小满: { good: ["bean"], tough: ["turnip"], note: "湿热上来，豆类长势更强。" },
  芒种: { good: ["bean"], tough: ["turnip"], note: "抢收抢种，适合连片豆类订单。" },
  夏至: { good: ["bean", "flower"], tough: ["turnip"], note: "日照强，耐热作物和花材更容易出品质。" },
  小暑: { good: ["bean"], tough: ["turnip", "flower"], note: "暑气渐盛，注意花材和叶菜受热。" },
  大暑: { good: ["bean"], tough: ["turnip", "flower"], note: "高温压力大，耐热豆类相对稳定。" },
  立秋: { good: ["turnip", "flower"], tough: [], note: "暑气渐退，秋花和秋菜可以接上。" },
  处暑: { good: ["turnip", "flower"], tough: [], note: "热退后适合恢复菜地和花田。" },
  白露: { good: ["turnip", "flower"], tough: ["bean"], note: "昼夜温差增大，秋花和根茎菜更稳。" },
  秋分: { good: ["turnip", "flower"], tough: [], note: "秋高气爽，丰收节订单适配面广。" },
  寒露: { good: ["turnip"], tough: ["bean"], note: "凉意明显，豆类变慢，芜菁更稳定。" },
  霜降: { good: ["turnip"], tough: ["bean", "flower"], note: "霜风险上升，花材和豆类需要防寒。" },
  立冬: { good: ["turnip"], tough: ["bean", "flower"], note: "入冬后露地作物整体变慢，芜菁相对抗冷。" },
  小雪: { good: ["turnip"], tough: ["bean", "flower"], note: "冷空气频繁，适合规划温室和冬菜。" },
  大雪: { good: [], tough: ["turnip", "bean", "flower"], note: "寒冷明显，露地作物都会变慢。" },
  冬至: { good: ["turnip"], tough: ["bean", "flower"], note: "冬至适合热食订单，露地花豆压力较大。" },
  小寒: { good: [], tough: ["turnip", "bean", "flower"], note: "小寒严冷，作物需要设施农业支持。" },
  大寒: { good: [], tough: ["turnip", "bean", "flower"], note: "大寒仍冷，适合储备种子和年货订单。" }
};

const termOrderDefinitions = {
  立春: { id: "springBasket", title: "返青菜篮订单", kind: "crop", item: "turnip", count: 2, reward: 46, description: "卫生站想给老人送第一批返青菜。" },
  雨水: { id: "rainBasket", title: "雨水鲜菜订单", kind: "crop", item: "turnip", count: 2, reward: 48, description: "雨水节气适合做新鲜菜篮。" },
  惊蛰: { id: "awakeningFlowers", title: "惊蛰花苗订单", kind: "flowerAny", count: 1, reward: 50, description: "茶铺想用第一批花材布置门口。" },
  春分: { id: "springEquinoxSet", title: "春分均衡订单", kind: "cropAny", count: 3, reward: 64, description: "合作社要测试多品类小订单。" },
  清明: { id: "qingmingFlowers", title: "清明踏青花束", kind: "flowerAny", count: 2, reward: 72, description: "踏青导览需要几束应季花材。" },
  谷雨: { id: "grainRainBeans", title: "谷雨豆苗订单", kind: "crop", item: "bean", count: 2, reward: 78, description: "谷雨育苗活动需要青豆展示。" },
  立夏: { id: "summerBeans", title: "立夏豆类订单", kind: "crop", item: "bean", count: 2, reward: 82, description: "茶铺想做立夏豆类小食。" },
  小满: { id: "grainFullBeans", title: "小满青豆订单", kind: "crop", item: "bean", count: 3, reward: 118, description: "合作社准备做一批青豆礼盒。" },
  芒种: { id: "busyBeans", title: "芒种抢收订单", kind: "crop", item: "bean", count: 3, reward: 124, description: "村里想把抢收抢种做成直播素材。" },
  夏至: { id: "summerFish", title: "夏至河鲜订单", kind: "fishAny", count: 2, reward: 92, description: "民宿想试做夏至河鲜菜单。" },
  小暑: { id: "lesserHeatFish", title: "小暑鱼鲜订单", kind: "fishAny", count: 2, reward: 96, description: "游客想体验傍晚垂钓和农家鱼鲜。" },
  大暑: { id: "greatHeatFish", title: "大暑清凉鱼鲜", kind: "fishAny", count: 3, reward: 138, description: "暑热天适合做清凉鱼鲜套餐。" },
  立秋: { id: "autumnFlowers", title: "立秋花材订单", kind: "flowerAny", count: 2, reward: 86, description: "民宿想把秋花摆进房间。" },
  处暑: { id: "heatEndsBasket", title: "处暑恢复菜篮", kind: "cropAny", count: 3, reward: 82, description: "暑热退后，村里恢复稳定供货。" },
  白露: { id: "whiteDewFlowers", title: "白露花束订单", kind: "flowerAny", count: 3, reward: 118, description: "清晨露水适合拍摄花田宣传图。" },
  秋分: { id: "harvestBox", title: "秋分丰收礼盒", kind: "cropAny", count: 4, reward: 132, description: "丰收节需要一批混合农产品礼盒。" },
  寒露: { id: "coldDewGreens", title: "寒露安心菜篮", kind: "crop", item: "turnip", count: 4, reward: 116, description: "卫生站想给老人补一批耐寒菜。" },
  霜降: { id: "frostBasket", title: "霜降防寒菜篮", kind: "crop", item: "turnip", count: 3, reward: 98, description: "霜降前后，村里准备防寒菜篮。" },
  立冬: { id: "winterFish", title: "立冬热汤鱼鲜", kind: "fishAny", count: 2, reward: 104, description: "茶铺想做第一锅热汤鱼鲜。" },
  小雪: { id: "lesserSnowFish", title: "小雪冷水鱼订单", kind: "fishAny", count: 2, reward: 112, description: "游客对冬季冷水鱼很感兴趣。" },
  大雪: { id: "greatSnowFish", title: "大雪民宿鱼鲜", kind: "fishAny", count: 3, reward: 158, description: "雪景民宿想配一桌鱼鲜热菜。" },
  冬至: { id: "solsticeHotpot", title: "冬至热食订单", kind: "cropAny", count: 4, reward: 126, description: "冬至热食摊需要耐煮的蔬菜。" },
  小寒: { id: "lesserColdFish", title: "小寒暖锅鱼鲜", kind: "fishAny", count: 2, reward: 116, description: "小寒夜里适合做暖锅鱼鲜。" },
  大寒: { id: "yearEndBox", title: "大寒年货补单", kind: "cropAny", count: 4, reward: 138, description: "大寒之后要补一批年货礼盒。" }
};

const communityOrderDefinitions = [
  {
    id: "clinicCareBox",
    title: "卫生站安心菜篮",
    unlock: "visitedClinic",
    requirements: [{ kind: "cropAny", count: 2 }],
    reward: 58,
    description: "卫生站想把新鲜蔬菜送到行动不便的老人家里。"
  },
  {
    id: "teaTastingPack",
    title: "茶铺试吃组合",
    unlock: "visitedCafe",
    requirements: [{ kind: "cropAny", count: 1 }, { kind: "flowerAny", count: 1 }],
    reward: 74,
    description: "茶铺要把农货和花材摆成游客愿意停下来的试吃台。"
  },
  {
    id: "marketRestock",
    title: "助农集市补货",
    unlock: "helpedVillage",
    requirements: [{ kind: "cropAny", count: 3 }],
    reward: 96,
    description: "集市摊位需要稳定补货，不能只靠临时收成。"
  },
  {
    id: "homestayWelcome",
    title: "民宿迎宾物资",
    unlock: "halfDayTrail",
    requirements: [{ kind: "flowerAny", count: 1 }, { kind: "fishAny", count: 1 }],
    reward: 128,
    tourismAppeal: 5,
    description: "民宿需要一份花材和一份本地鱼鲜，把游客从看风景留到过夜。"
  },
  {
    id: "homestayBreakfast",
    title: "民宿早餐鸡蛋",
    unlock: "livestock",
    requirements: [{ kind: "egg", count: 3 }],
    reward: 118,
    tourismAppeal: 4,
    description: "民宿想把本地鸡蛋做成早餐，让住宿体验更像村里生活。"
  },
  {
    id: "craftSouvenir",
    title: "研学伴手礼补货",
    unlock: "crafts",
    requirements: [{ kind: "craft", item: "souvenirBox", count: 1 }],
    reward: 168,
    tourismAppeal: 6,
    description: "游客中心想要一批能带走的本地手作礼盒，给研学路线增加记忆点。"
  }
];

const craftItemDefinitions = {
  bambooBasket: { name: "竹编篮", sell: 46 },
  pickles: { name: "节气腌菜", sell: 58 },
  driedVeg: { name: "风干菜包", sell: 52 },
  souvenirBox: { name: "晨谷伴手礼盒", sell: 138 }
};

const craftRecipeDefinitions = {
  bambooBasket: {
    station: "bambooWorkshop",
    product: "bambooBasket",
    name: "竹编篮",
    cost: 18,
    requirements: [],
    unlock: () => state.quests.mappedBamboo || state.quests.halfDayTrail,
    lockedText: "竹编工坊：先去后山记录竹林研学点，才有稳定竹材和课程题材。",
    description: "把竹林资源做成可售卖、可上课的体验物。"
  },
  pickles: {
    station: "pickleHouse",
    product: "pickles",
    name: "节气腌菜",
    cost: 16,
    requirements: [{ kind: "cropAny", count: 2 }],
    unlock: () => state.quests.helpedVillage,
    lockedText: "腌制坊：先让助农集市跑起来，有稳定农货后再做加工。",
    description: "把易损蔬菜做成耐储存的小菜，减少原料低价出售。"
  },
  driedVeg: {
    station: "dryingYard",
    product: "driedVeg",
    name: "风干菜包",
    cost: 12,
    requirements: [{ kind: "cropAny", count: 2 }],
    unlock: () => state.quests.packagedProduce,
    lockedText: "晾晒场：先完成分级打包，干货才会按标准批次入库。",
    description: "按天气安排晾晒或烘干，把节气农货变成稳定库存。"
  },
  souvenirBox: {
    station: "craftMarket",
    product: "souvenirBox",
    name: "晨谷伴手礼盒",
    cost: 28,
    requirements: [
      { kind: "craft", item: "bambooBasket", count: 1 },
      { kind: "processedCraftAny", count: 1 },
      { kind: "flowerAny", count: 1 }
    ],
    unlock: () => state.quests.halfDayTrail,
    lockedText: "手作集市：先开放半日徒步线，游客有停留理由后再做伴手礼盒。",
    description: "把竹编、加工农货和花材组合成游客愿意带走的村庄记忆。"
  }
};

const dayPhases = [
  { id: "dawn", name: "清晨", shade: 0 },
  { id: "morning", name: "上午", shade: 0 },
  { id: "noon", name: "中午", shade: 0 },
  { id: "afternoon", name: "下午", shade: 0 },
  { id: "dusk", name: "黄昏", shade: 0.18, tint: "rgba(242, 154, 76, 0.12)" },
  { id: "night", name: "夜晚", shade: 0.36 },
  { id: "midnight", name: "凌晨", shade: 0.48 }
];

const weatherTypes = {
  sunny: { name: "晴朗", autoWater: false, effect: "光照足，适合外出和晒谷。" },
  cloudy: { name: "多云", autoWater: false, effect: "体感稳定，农活和走访都比较舒服。" },
  drizzle: { name: "小雨", autoWater: true, effect: "会润湿翻过的土地，适合省下浇水体力。" },
  rain: { name: "雨天", autoWater: true, effect: "会自动浇湿农田，但游客活动会受影响。" },
  storm: { name: "雷雨", autoWater: true, effect: "会自动浇湿农田，后续可接设施维护和防灾任务。" },
  fog: { name: "雾", autoWater: false, effect: "能见度低，适合做山路安全和导览提示。" },
  snow: { name: "雪", autoWater: false, effect: "景区观赏性提高，冬季交通和保暖压力增加。" },
  frost: { name: "霜", autoWater: false, effect: "有低温风险，后续可接温室和防寒系统。" }
};

const weatherBaseWeights = {
  sunny: 2,
  cloudy: 2,
  drizzle: 2,
  rain: 2,
  storm: 1,
  fog: 1,
  snow: 1,
  frost: 1
};

const solarTermWeatherProfiles = {
  立春: { note: "春寒回暖，晴天和小雨都常见，偶尔还会返冷。", weights: { sunny: 20, cloudy: 20, drizzle: 16, rain: 8, fog: 8, snow: 3, frost: 5 } },
  雨水: { note: "雨水增多，小雨和阴雨概率上升。", weights: { sunny: 12, cloudy: 22, drizzle: 26, rain: 16, fog: 10, frost: 3 } },
  惊蛰: { note: "气温回升，春雷和阵雨开始出现。", weights: { sunny: 16, cloudy: 18, drizzle: 18, rain: 14, storm: 8, fog: 8 } },
  春分: { note: "昼夜均衡，晴、多云、小雨比较均衡。", weights: { sunny: 22, cloudy: 22, drizzle: 14, rain: 10, storm: 4, fog: 6 } },
  清明: { note: "清明时节春雨和薄雾更容易出现，但也可能放晴踏青。", weights: { sunny: 16, cloudy: 20, drizzle: 24, rain: 14, fog: 12 } },
  谷雨: { note: "谷雨利于育苗，降雨概率继续偏高。", weights: { sunny: 14, cloudy: 20, drizzle: 24, rain: 18, storm: 5, fog: 6 } },
  立夏: { note: "入夏后晴热增多，也会有午后阵雨。", weights: { sunny: 28, cloudy: 18, drizzle: 8, rain: 10, storm: 8, fog: 3 } },
  小满: { note: "麦类渐满，湿热和阵雨都可能发生。", weights: { sunny: 22, cloudy: 20, drizzle: 10, rain: 14, storm: 10, fog: 4 } },
  芒种: { note: "抢收抢种季，晴雨交替，雷阵雨概率偏高。", weights: { sunny: 24, cloudy: 18, drizzle: 9, rain: 14, storm: 13, fog: 3 } },
  夏至: { note: "日照最长，晴热明显，但强对流也会突然出现。", weights: { sunny: 32, cloudy: 16, drizzle: 6, rain: 10, storm: 13, fog: 2 } },
  小暑: { note: "暑气上升，晴热和雷雨都更明显。", weights: { sunny: 34, cloudy: 14, drizzle: 5, rain: 11, storm: 15, fog: 1 } },
  大暑: { note: "全年最热阶段，晴热为主，午后雷雨仍有概率。", weights: { sunny: 36, cloudy: 13, drizzle: 4, rain: 10, storm: 16, fog: 1 } },
  立秋: { note: "暑气未退，晴天多，但早晚可能起雾。", weights: { sunny: 30, cloudy: 18, drizzle: 8, rain: 9, storm: 6, fog: 7 } },
  处暑: { note: "暑热渐退，晴朗和多云增加。", weights: { sunny: 32, cloudy: 20, drizzle: 7, rain: 8, storm: 4, fog: 7 } },
  白露: { note: "昼夜温差变大，清晨雾和露水更常见。", weights: { sunny: 26, cloudy: 20, drizzle: 8, rain: 8, fog: 16, frost: 2 } },
  秋分: { note: "秋高气爽概率高，但阴雨也可能影响丰收节。", weights: { sunny: 34, cloudy: 20, drizzle: 7, rain: 7, fog: 9, frost: 2 } },
  寒露: { note: "凉意增强，雾和霜的概率抬头。", weights: { sunny: 24, cloudy: 22, drizzle: 8, rain: 7, fog: 16, frost: 7 } },
  霜降: { note: "低温风险增加，霜更容易出现。", weights: { sunny: 22, cloudy: 22, drizzle: 6, rain: 6, fog: 12, frost: 16, snow: 2 } },
  立冬: { note: "入冬后阴冷、多云和霜雪概率上升。", weights: { sunny: 18, cloudy: 24, drizzle: 5, rain: 5, fog: 10, frost: 14, snow: 8 } },
  小雪: { note: "小雪时节不一定下雪，但雪和霜的倾向更高。", weights: { sunny: 14, cloudy: 24, drizzle: 4, rain: 4, fog: 8, frost: 16, snow: 16 } },
  大雪: { note: "寒冷阶段，雪天概率明显增加。", weights: { sunny: 12, cloudy: 24, drizzle: 3, rain: 3, fog: 7, frost: 16, snow: 22 } },
  冬至: { note: "冬至阴冷，霜雪概率高，也可能遇到晴冷天气。", weights: { sunny: 14, cloudy: 22, drizzle: 3, rain: 3, fog: 8, frost: 18, snow: 20 } },
  小寒: { note: "小寒严冷，霜、雪和多云更容易出现。", weights: { sunny: 12, cloudy: 23, drizzle: 2, rain: 2, fog: 7, frost: 22, snow: 20 } },
  大寒: { note: "大寒仍有强冷空气，但晴冷天气也有机会。", weights: { sunny: 13, cloudy: 22, drizzle: 2, rain: 2, fog: 6, frost: 22, snow: 20 } }
};

const traditionalFestivals = [
  {
    id: "springFestival",
    name: "春节",
    term: "立春",
    days: [1, 2, 3],
    task: "准备年货礼盒和村里年夜饭食材",
    notice: "春节活动：帮合作社准备年货礼盒，给返乡亲友和游客做第一批乡村年味订单。",
    reward: { money: 36, seeds: { bean: 2 } },
    colors: ["#d45c4b", "#f0c76c"]
  },
  {
    id: "lanternFestival",
    name: "元宵",
    term: "雨水",
    days: [2],
    task: "布置河边灯会和猜灯谜摊",
    notice: "元宵活动：河边灯会需要灯笼、灯谜和热汤圆摊，晚上可以吸引游客留宿。",
    reward: { money: 24, energy: 12 },
    colors: ["#f0c76c", "#d45c4b"]
  },
  {
    id: "qingming",
    name: "清明",
    term: "清明",
    days: [1, 2],
    task: "做青团、踏青导览和春茶预售",
    notice: "清明活动：茶铺想做青团和春茶预售，景区需要一条踏青导览路线。",
    reward: { money: 28, seeds: { turnip: 2 } },
    colors: ["#7ead6a", "#d8c17a"]
  },
  {
    id: "dragonBoat",
    name: "端午",
    term: "芒种",
    days: [2, 3],
    task: "包粽子、挂艾草、组织河边活动",
    notice: "端午活动：村里要包粽子、挂艾草，河边也能办亲水体验和安全宣传。",
    reward: { money: 30, energy: 18 },
    colors: ["#3f8b45", "#f0c76c"]
  },
  {
    id: "qixi",
    name: "七夕",
    term: "立秋",
    days: [2],
    task: "上线观星路线和双人民宿套餐",
    notice: "七夕活动：民宿想做观星套餐，需要把山谷夜游、茶点和安全路线串起来。",
    reward: { money: 32 },
    colors: ["#557ba3", "#f0c76c"]
  },
  {
    id: "harvestFestival",
    name: "秋分丰收节",
    term: "秋分",
    days: [1],
    task: "办全村丰收集市和直播助农大场",
    notice: "秋分丰收节：把农货、手作、直播和游客动线集中起来，办一场全村集市。",
    reward: { money: 42, seeds: { bean: 1, turnip: 2 } },
    colors: ["#d8a24d", "#d45c4b"]
  },
  {
    id: "midAutumn",
    name: "中秋",
    term: "秋分",
    days: [2, 3],
    task: "制作月饼礼盒和赏月民宿套餐",
    notice: "中秋活动：合作社想做月饼礼盒，民宿推出赏月套餐，适合带动夜间消费。",
    reward: { money: 38, energy: 10 },
    colors: ["#f0c76c", "#557ba3"]
  },
  {
    id: "doubleNinth",
    name: "重阳",
    term: "寒露",
    days: [2],
    task: "组织登高路线和敬老餐配送",
    notice: "重阳活动：卫生站需要敬老餐，景区可以做安全登高路线和老人友好休息点。",
    reward: { money: 34, energy: 16 },
    colors: ["#d8c17a", "#9b6c3e"]
  },
  {
    id: "winterSolstice",
    name: "冬至",
    term: "冬至",
    days: [1],
    task: "准备热食摊、暖炉民宿和冬季套餐",
    notice: "冬至活动：游客想吃热乎的，茶铺和民宿需要热食、暖炉和冬季路线提示。",
    reward: { money: 35, energy: 20 },
    colors: ["#9ec6d6", "#f0c76c"]
  }
];

const festivalActivityDefinitions = {
  springFestival: {
    recipeName: "年夜饭拼盘",
    requirements: [{ kind: "cropAny", count: 2 }, { kind: "egg", count: 1 }],
    visitorBonus: 4,
    homestayReward: 52,
    steps: ["写年货清单", "布置年夜饭桌", "安排返乡游客座位"]
  },
  lanternFestival: {
    recipeName: "热汤圆茶点",
    requirements: [{ kind: "cropAny", count: 1 }, { kind: "craftAny", count: 1 }],
    visitorBonus: 3,
    homestayReward: 42,
    steps: ["挂灯笼", "摆灯谜牌", "设置夜游回程点"]
  },
  qingming: {
    recipeName: "青团春茶盒",
    requirements: [{ kind: "cropAny", count: 1 }, { kind: "flowerAny", count: 1 }],
    visitorBonus: 3,
    homestayReward: 38,
    steps: ["整理踏青路线", "准备春茶预售单", "补充文明祭扫提示"]
  },
  dragonBoat: {
    recipeName: "端午粽礼",
    requirements: [{ kind: "cropAny", count: 2 }, { kind: "fishAny", count: 1 }],
    visitorBonus: 4,
    homestayReward: 46,
    steps: ["挂艾草", "准备亲水安全牌", "安排粽礼领取点"]
  },
  qixi: {
    recipeName: "观星双人茶点",
    requirements: [{ kind: "flowerAny", count: 1 }, { kind: "craftAny", count: 1 }],
    visitorBonus: 3,
    homestayReward: 58,
    steps: ["检查夜游灯", "布置观星座位", "确认双人民宿名单"]
  },
  harvestFestival: {
    recipeName: "丰收集市拼盘",
    requirements: [{ kind: "cropAny", count: 3 }, { kind: "craftAny", count: 1 }],
    visitorBonus: 6,
    homestayReward: 64,
    steps: ["划分集市摊位", "排直播助农时段", "安排游客动线"]
  },
  midAutumn: {
    recipeName: "赏月礼盒",
    requirements: [{ kind: "cropAny", count: 1 }, { kind: "craft", item: "souvenirBox", count: 1 }],
    visitorBonus: 5,
    homestayReward: 62,
    steps: ["摆月饼礼盒", "布置赏月桌", "确认民宿夜间安静线"]
  },
  doubleNinth: {
    recipeName: "重阳敬老餐",
    requirements: [{ kind: "cropAny", count: 2 }, { kind: "egg", count: 1 }],
    visitorBonus: 3,
    homestayReward: 44,
    steps: ["检查登高路线", "准备敬老餐", "安排志愿者送餐"]
  },
  winterSolstice: {
    recipeName: "冬至暖锅",
    requirements: [{ kind: "cropAny", count: 2 }, { kind: "fishAny", count: 1 }],
    visitorBonus: 4,
    homestayReward: 56,
    steps: ["支起热食摊", "检查暖炉民宿", "补冬季路线提示"]
  }
};

const petDefinitions = {
  cat: {
    name: "小猫",
    shortName: "猫",
    followThreshold: 3,
    homeX: 8,
    homeY: 16,
    assistText: "小猫找到一处安静拍照点，景区吸引力 +2。"
  },
  dog: {
    name: "小狗",
    shortName: "狗",
    followThreshold: 3,
    homeX: 20,
    homeY: 16,
    assistText: "小狗提前探路，少踩敏感草坡，生态压力 -1。"
  }
};

const petFestivalOutfits = {
  springFestival: { cat: "红绳铃铛", dog: "福字围巾" },
  lanternFestival: { cat: "灯穗项圈", dog: "灯会小披肩" },
  qingming: { cat: "青柳项圈", dog: "踏青绿巾" },
  dragonBoat: { cat: "艾草铃铛", dog: "粽叶围巾" },
  qixi: { cat: "星星项圈", dog: "夜游小灯牌" },
  harvestFestival: { cat: "麦穗铃铛", dog: "丰收黄巾" },
  midAutumn: { cat: "月桂项圈", dog: "赏月蓝巾" },
  doubleNinth: { cat: "茱萸小结", dog: "登高黄巾" },
  winterSolstice: { cat: "暖绒项圈", dog: "雪线围巾" }
};

const petBedLevels = {
  1: { name: "基础宠物窝", comfort: 0 },
  2: { name: "软垫宠物窝", comfort: 1, cost: 80, materials: { ironParts: 1 } },
  3: { name: "四季宠物角", comfort: 2, cost: 150, materials: { alloyParts: 1 } }
};

const villageNpcDefinitions = {
  lin: { name: "林", shortName: "林", role: "村委", color: "#557ba3", hair: "#2f3335" },
  doctor: { name: "卫生站阿姨", shortName: "医", role: "公共服务", color: "#8a5f73", hair: "#4b3426" },
  tea: { name: "茶铺老板", shortName: "茶", role: "节令加工", color: "#7b704b", hair: "#3b2a1d" },
  courier: { name: "快递小哥", shortName: "递", role: "物流", color: "#4f5f77", hair: "#2f3335" },
  artisan: { name: "手艺人周叔", shortName: "匠", role: "手作", color: "#9b6c3e", hair: "#3b2a1d" },
  tourist: { name: "游客代表", shortName: "游", role: "文旅", color: "#6f8fa6", hair: "#473421" }
};

const festivalNpcPlacements = {
  springFestival: {
    lin: { x: 10, y: 10, place: "年货摊前" },
    doctor: { x: 18, y: 8, place: "安心菜篮点" },
    tea: { x: 18, y: 16, place: "年味茶点摊" },
    courier: { x: 5, y: 15, place: "年货发货点" },
    artisan: { x: 7, y: 13, place: "春联手作摊" },
    tourist: { x: 18, y: 10, place: "返乡游客咨询处" }
  },
  lanternFestival: {
    lin: { x: 10, y: 10, place: "灯会入口" },
    doctor: { x: 18, y: 10, place: "夜游安全点" },
    tea: { x: 18, y: 16, place: "汤圆茶摊" },
    courier: { x: 5, y: 15, place: "活动物资点" },
    artisan: { x: 10, y: 15, place: "灯笼摊" },
    tourist: { x: 18, y: 9, place: "灯谜区" }
  },
  qingming: {
    lin: { x: 10, y: 8, place: "踏青集合点" },
    doctor: { x: 18, y: 8, place: "山路提醒牌" },
    tea: { x: 18, y: 16, place: "青团春茶摊" },
    courier: { x: 5, y: 15, place: "春茶预售点" },
    artisan: { x: 7, y: 13, place: "柳编体验摊" },
    tourist: { x: 18, y: 10, place: "踏青导览点" }
  },
  dragonBoat: {
    lin: { x: 10, y: 10, place: "亲水活动牌" },
    doctor: { x: 18, y: 8, place: "防暑安全点" },
    tea: { x: 18, y: 16, place: "粽子试吃摊" },
    courier: { x: 5, y: 15, place: "粽礼发货点" },
    artisan: { x: 7, y: 13, place: "艾草香囊摊" },
    tourist: { x: 18, y: 10, place: "河边活动集合点" }
  },
  qixi: {
    lin: { x: 10, y: 8, place: "观星路线牌" },
    doctor: { x: 18, y: 8, place: "夜游提醒点" },
    tea: { x: 18, y: 16, place: "双人茶点摊" },
    courier: { x: 5, y: 15, place: "民宿补给点" },
    artisan: { x: 7, y: 13, place: "手作花束摊" },
    tourist: { x: 18, y: 10, place: "观星报名点" }
  },
  harvestFestival: {
    lin: { x: 10, y: 10, place: "丰收集市口" },
    doctor: { x: 18, y: 8, place: "志愿服务点" },
    tea: { x: 18, y: 16, place: "丰收试吃摊" },
    courier: { x: 5, y: 15, place: "直播发货点" },
    artisan: { x: 7, y: 13, place: "手作集市摊" },
    tourist: { x: 18, y: 10, place: "游客问询点" }
  },
  midAutumn: {
    lin: { x: 10, y: 10, place: "赏月活动牌" },
    doctor: { x: 18, y: 8, place: "老人送餐点" },
    tea: { x: 18, y: 16, place: "月饼礼盒摊" },
    courier: { x: 5, y: 15, place: "礼盒发货点" },
    artisan: { x: 7, y: 13, place: "灯笼手作摊" },
    tourist: { x: 18, y: 10, place: "民宿预约点" }
  },
  doubleNinth: {
    lin: { x: 10, y: 8, place: "登高路线牌" },
    doctor: { x: 18, y: 8, place: "敬老餐登记点" },
    tea: { x: 18, y: 16, place: "菊花茶摊" },
    courier: { x: 5, y: 15, place: "送餐调度点" },
    artisan: { x: 7, y: 13, place: "登高纪念摊" },
    tourist: { x: 18, y: 10, place: "登高集合点" }
  },
  winterSolstice: {
    lin: { x: 10, y: 10, place: "热食摊前" },
    doctor: { x: 18, y: 8, place: "保暖提醒点" },
    tea: { x: 18, y: 16, place: "暖茶热食摊" },
    courier: { x: 5, y: 15, place: "冬季补给点" },
    artisan: { x: 7, y: 13, place: "暖手手作摊" },
    tourist: { x: 18, y: 10, place: "雪景咨询点" }
  }
};

const state = {
  map: "farm",
  selected: 0,
  totalDay: 1,
  termIndex: 0,
  dayInTerm: 1,
  phaseIndex: 0,
  weather: generateWeatherForTerm("立春"),
  money: 120,
  energy: 100,
  seeds: { turnip: 8, bean: 0, flower: 4 },
  crops: { turnip: 0, bean: 0 },
  flowers: {
    white: 0,
    red: 0,
    yellow: 0,
    blue: 0,
    orange: 0,
    purple: 0,
    green: 0,
    rainbow: 0,
    aurora: 0
  },
  flowerJournal: {},
  flowerOrders: {},
  flowerBreeding: {
    pollenGenes: null,
    pollenName: "",
    preparedGenes: null,
    greenhouse: false,
    geneTests: 0,
    rareMutations: 0
  },
  fish: {
    crucian: 0,
    carp: 0,
    catfish: 0,
    loach: 0,
    trout: 0,
    sweetfish: 0,
    koi: 0,
    snowtrout: 0,
    peachfish: 0,
    ricefish: 0
  },
  fishQuality: createFishQualityInventory(),
  aquarium: {
    crucian: 0,
    carp: 0,
    catfish: 0,
    loach: 0,
    trout: 0,
    sweetfish: 0,
    koi: 0,
    snowtrout: 0,
    peachfish: 0,
    ricefish: 0
  },
  fishJournal: {},
  fishing: {
    rodLevel: 1,
    bait: { grain: 0, insect: 0, eco: 0 },
    fishPond: false,
    pondSpecies: "",
    pondStock: 0,
    pondHarvested: 0,
    homestayOrders: {},
    totalCatches: 0,
    qualityCatches: 0,
    aquariumDecor: { plants: false, light: false },
    aquariumRewardClaimed: false
  },
  termOrders: {},
  communityOrders: {},
  npcChats: {},
  toolLevel: 1,
  materials: {
    ironParts: 0,
    alloyParts: 0
  },
  facilities: {
    parcelsSent: 0,
    visitorsServed: 0,
    lastVisitorServiceDay: 0
  },
  aidOps: {
    sortingStep: 0,
    sortedBatches: 0,
    sortingQuality: 0,
    packagingDesign: "plain",
    logisticsLoss: 18,
    lastParcelLoss: 0,
    liveFeedback: 0,
    repeatCustomers: 0
  },
  aidCases: {
    completed: {},
    brandScore: 0,
    caseImpact: 0,
    contractOrders: 0
  },
  activeSeed: "turnip",
  message: "",
  messageUntil: performance.now() + 2600,
  player: { x: 14, y: 10, dirX: 0, dirY: 1, moving: 0 },
  tiles: [],
  quests: {
    harvest: 0,
    sold: 0,
    wateredToday: 0,
    metLin: false,
    readNotice: false,
    visitedClinic: false,
    visitedCafe: false,
    visitedScenic: false,
    surveyedRiver: false,
    plannedHomestay: false,
    mappedBamboo: false,
    surveyedStoneHouse: false,
    halfDayTrail: false,
    packagedProduce: false,
    courierStation: false,
    liveStream: false,
    helpedVillage: false,
    cooperativeFounded: false
  },
  tourism: {
    exploredPoints: 0,
    routes: 0,
    appeal: 0,
    ecoPressure: 0,
    serviceAppeal: 0,
    petAssist: 0,
    ecoCare: 0,
    facilities: {
      guideSigns: false,
      restStop: false,
      ecoToilet: false,
      trashStation: false,
      solarLights: false
    }
  },
  tourismOps: {
    limitPolicy: false,
    studyRoutes: 0,
    homestayPackages: 0,
    reputation: 0,
    reviews: 0,
    lastReviewDay: 0
  },
  nature: {
    discoveries: {},
    protectionScore: 0,
    samples: 0
  },
  infrastructure: {
    water: 0,
    power: 0,
    logistics: 0,
    tech: 0,
    projects: {
      canalRepair: false,
      reservoir: false,
      smartIrrigation: false,
      solarMicrogrid: false,
      coldChain: false,
      highSpeedShuttle: false,
      droneSensors: false
    }
  },
  techOps: {
    sensorScans: 0,
    droneFlights: 0,
    pestWarnings: 0,
    pestPrevented: 0,
    precisionWatered: 0,
    breedingTrials: 0,
    resilientSeeds: 0,
    lastScanDay: 0,
    lastDroneDay: 0,
    pestRisk: 0,
    sensorReport: "尚未接入传感器"
  },
  charter: {
    yearEndMeeting: false,
    developmentCharter: false,
    longTermMode: false
  },
  livestock: {
    coopBuilt: false,
    chickens: 0,
    feed: 0,
    eggs: 0,
    manure: 0,
    fedToday: false,
    totalEggs: 0,
    fertilizerUsed: 0
  },
  crafts: {
    bambooBasket: 0,
    pickles: 0,
    driedVeg: 0,
    souvenirBox: 0
  },
  craftOps: {
    batches: 0,
    lessons: 0,
    standards: false,
    touristSales: 0,
    made: {
      bambooBasket: 0,
      pickles: 0,
      driedVeg: 0,
      souvenirBox: 0
    }
  },
  festivalOps: {
    activityScore: 0,
    visitors: 0,
    homestayBookings: 0,
    dishesCooked: 0,
    prep: {},
    menus: {}
  },
  festivalLog: {},
  pets: {
    cat: { adopted: false, affection: 0, fedToday: false, following: false, scenicFinds: 0, lastAssistDay: 0 },
    dog: { adopted: false, affection: 0, fedToday: false, following: false, scenicFinds: 0, lastAssistDay: 0 }
  },
  petLife: {
    toyOwned: false,
    bedLevel: 1,
    lastPlayDay: 0,
    homestayPhotos: 0,
    lastPhotoDay: 0,
    livestockAssists: 0,
    lastLivestockAssistDay: 0,
    eggCareBonus: 0
  }
};

const farmTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  farmTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    farmTerrain[y][x] = edge ? "fence" : rng() > 0.88 ? "flower" : "grass";
  }
}

const farmPlots = [];
for (let y = 8; y < 16; y += 1) {
  for (let x = 6; x < 17; x += 1) {
    farmTerrain[y][x] = "soil";
    farmPlots.push({ x, y });
  }
}

for (let y = 8; y <= 12; y += 1) {
  farmTerrain[y][world.width - 1] = "grass";
}

for (let x = 2; x <= 7; x += 1) {
  farmTerrain[world.height - 1][x] = "road";
}

const farmSolids = new Set(["0,0"]);
const farmStructures = [
  { id: "house", x: 21, y: 4, w: 5, h: 4, kind: "house" },
  { id: "greenhouse", x: 15, y: 3, w: 4, h: 3, kind: "greenhouse" },
  { id: "market", x: 3, y: 4, w: 3, h: 2, kind: "market" },
  { id: "chickenCoop", x: 2, y: 12, w: 3, h: 3, kind: "chickenCoop" },
  { id: "techStation", x: 2, y: 16, w: 2, h: 1, kind: "techStation" },
  { id: "bin", x: 20, y: 13, w: 2, h: 2, kind: "bin" },
  { id: "pond", x: 22, y: 13, w: 5, h: 3, kind: "pond" },
  { id: "fisheryBoard", x: 22, y: 17, w: 2, h: 1, kind: "fisheryBoard" }
];

for (const item of farmStructures) {
  for (let y = item.y; y < item.y + item.h; y += 1) {
    for (let x = item.x; x < item.x + item.w; x += 1) {
      farmSolids.add(`${x},${y}`);
    }
  }
}

const villageTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  villageTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    villageTerrain[y][x] = edge ? "fence" : "grass";
    if ((x >= 0 && x <= world.width - 1 && y >= 8 && y <= 12) || (x >= 13 && x <= 16 && y >= 0 && y <= 18)) {
      villageTerrain[y][x] = "road";
    }
    if (!edge && rng() > 0.93) villageTerrain[y][x] = "flower";
  }
}

for (let y = 8; y <= 12; y += 1) {
  villageTerrain[y][0] = "road";
  villageTerrain[y][world.width - 1] = "road";
}

for (let x = 13; x <= 16; x += 1) {
  villageTerrain[world.height - 1][x] = "road";
}

const villageStructures = [
  { id: "general", x: 4, y: 4, w: 5, h: 4, kind: "villageMarket" },
  { id: "notice", x: 14, y: 6, w: 2, h: 2, kind: "notice" },
  { id: "orderBoard", x: 17, y: 6, w: 2, h: 2, kind: "orderBoard" },
  { id: "clinic", x: 20, y: 4, w: 5, h: 4, kind: "villagerHome" },
  { id: "cafe", x: 20, y: 12, w: 5, h: 4, kind: "villagerHome" },
  { id: "fountain", x: 13, y: 11, w: 4, h: 3, kind: "fountain" },
  { id: "petAdoption", x: 9, y: 5, w: 2, h: 1, kind: "petAdoption" },
  { id: "visitorCenter", x: 17, y: 2, w: 3, h: 2, kind: "visitorCenter" },
  { id: "infrastructureBoard", x: 2, y: 4, w: 2, h: 2, kind: "infrastructureBoard" },
  { id: "toolWorkshop", x: 6, y: 13, w: 2, h: 2, kind: "toolWorkshop" },
  { id: "packing", x: 9, y: 14, w: 2, h: 1, kind: "packingTable" },
  { id: "courier", x: 2, y: 13, w: 2, h: 2, kind: "courierDepot" },
  { id: "live", x: 11, y: 13, w: 2, h: 1, kind: "liveBooth" },
  { id: "charterBoard", x: 13, y: 15, w: 2, h: 1, kind: "charterBoard" }
];

const villageSolids = new Set();
for (const item of villageStructures.filter((item) => !["petAdoption", "charterBoard"].includes(item.kind))) {
  for (let y = item.y; y < item.y + item.h; y += 1) {
    for (let x = item.x; x < item.x + item.w; x += 1) {
      villageSolids.add(`${x},${y}`);
    }
  }
}

const scenicTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  scenicTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    scenicTerrain[y][x] = edge ? "forest" : "grass";
    if (y <= 4) scenicTerrain[y][x] = "snow";
    if (y === 5 && x >= 4 && x <= 25) scenicTerrain[y][x] = "rock";
    if (x >= 13 && x <= 16 && y >= 0 && y <= 19) scenicTerrain[y][x] = "trail";
    if (y >= 9 && y <= 11) scenicTerrain[y][x] = "river";
    if (x >= 13 && x <= 16 && y >= 9 && y <= 11) scenicTerrain[y][x] = "bridge";
    if (!edge && scenicTerrain[y][x] === "grass" && y > 5 && rng() > 0.9) scenicTerrain[y][x] = "forest";
    if (!edge && scenicTerrain[y][x] === "grass" && y > 11 && rng() > 0.95) scenicTerrain[y][x] = "flower";
  }
}

const scenicStructures = [
  { id: "snowLookout", x: 5, y: 5, w: 3, h: 2, kind: "lookout" },
  { id: "riverDock", x: 20, y: 12, w: 3, h: 2, kind: "riverDock" },
  { id: "homestaySite", x: 5, y: 14, w: 5, h: 3, kind: "homestaySite" },
  { id: "trailSign", x: 14, y: 15, w: 2, h: 1, kind: "scenicSign" },
  { id: "bambooGrove", x: 23, y: 6, w: 3, h: 2, kind: "bambooGrove" },
  { id: "stoneHouse", x: 2, y: 11, w: 3, h: 2, kind: "stoneHouse" }
];

const scenicResourceDefinitions = [
  {
    id: "snowLookout",
    quest: "visitedScenic",
    title: "雪山观景台",
    marker: "雪",
    mapX: 24,
    mapY: 22,
    type: "景观核心",
    opportunity: "适合做四季观景、雪景摄影和徒步终点。",
    guardrail: "需要控制停留人数，补安全栏和天气提示。"
  },
  {
    id: "riverDock",
    quest: "surveyedRiver",
    title: "河流亲水码头",
    marker: "河",
    mapX: 72,
    mapY: 57,
    type: "亲水体验",
    opportunity: "适合垂钓体验、亲水观察和夏季清凉路线。",
    guardrail: "需要设置防滑、救援和禁渔期提醒。"
  },
  {
    id: "homestaySite",
    quest: "plannedHomestay",
    title: "老宅民宿选址",
    marker: "宿",
    mapX: 31,
    mapY: 76,
    type: "住宿节点",
    opportunity: "适合把游客从半日游留下来过夜。",
    guardrail: "需要控制夜间噪声和村民生活边界。"
  },
  {
    id: "bambooGrove",
    quest: "mappedBamboo",
    title: "竹林研学点",
    marker: "竹",
    mapX: 82,
    mapY: 32,
    type: "研学手作",
    opportunity: "适合竹编体验、夏季避暑和自然教育。",
    guardrail: "需要保留竹林更新区，避免过度踩踏。"
  },
  {
    id: "stoneHouse",
    quest: "surveyedStoneHouse",
    title: "老石屋文化点",
    marker: "史",
    mapX: 15,
    mapY: 61,
    type: "村史文化",
    opportunity: "适合做村史讲解、山间茶歇和手作展示。",
    guardrail: "需要先做结构安全检查，保留原貌。"
  },
  {
    id: "alpineLake",
    discover: "alpineLake",
    title: "高山水源地",
    marker: "源",
    mapX: 18,
    mapY: 18,
    type: "水源保护",
    opportunity: "适合做水源研学、雪山摄影和饮水安全科普。",
    guardrail: "必须设保护线，不能把水源地当普通打卡点开发。"
  },
  {
    id: "wetlandBirds",
    discover: "wetlandBirds",
    title: "河湾湿地鸟点",
    marker: "湿",
    mapX: 62,
    mapY: 76,
    type: "湿地观鸟",
    opportunity: "适合做低干扰观鸟、亲子自然观察和水质课堂。",
    guardrail: "需要木栈道和静音观测点，避免游客踩进芦苇区。"
  },
  {
    id: "terracedFields",
    discover: "terracedFields",
    title: "梯田观景坡",
    marker: "梯",
    mapX: 47,
    mapY: 67,
    type: "农耕景观",
    opportunity: "适合做四季梯田摄影、插秧体验和农事研学。",
    guardrail: "体验区和生产区要分开，不能为了游客破坏田埂和水路。"
  },
  {
    id: "oldForest",
    discover: "oldForest",
    title: "老林缘生态带",
    marker: "林",
    mapX: 88,
    mapY: 44,
    type: "森林保育",
    opportunity: "适合做林下植物观察、避暑步道和生态志愿活动。",
    guardrail: "核心林区只做观察，不做商业摊位，保留野生动物通道。"
  }
];

const tourismFacilityDefinitions = [
  {
    id: "guideSigns",
    name: "路线导览牌",
    cost: 48,
    materials: {},
    appeal: 6,
    ecoCare: 1,
    visitorBonus: 4,
    description: "把入口、分岔口、禁入区和返程方向标清楚，游客不再乱走。"
  },
  {
    id: "restStop",
    name: "山路休息点",
    cost: 80,
    materials: { ironParts: 1 },
    appeal: 8,
    ecoCare: 1,
    visitorBonus: 8,
    description: "给老人、小孩和亲子游客留出休息座椅，也减少踩踏草坡。"
  },
  {
    id: "ecoToilet",
    name: "生态厕所",
    cost: 110,
    materials: { ironParts: 1 },
    appeal: 6,
    ecoCare: 3,
    visitorBonus: 10,
    description: "把最现实的游客痛点补上，污水和异味不再压到村民生活里。"
  },
  {
    id: "trashStation",
    name: "垃圾分类点",
    cost: 95,
    materials: {},
    appeal: 4,
    ecoCare: 3,
    visitorBonus: 6,
    description: "在河边和观景点设置分类桶，让研学活动也能讲生态维护。"
  },
  {
    id: "solarLights",
    name: "太阳能路灯",
    cost: 130,
    materials: { alloyParts: 1 },
    appeal: 10,
    ecoCare: 1,
    visitorBonus: 12,
    description: "夜间返程更安全，也为后续民宿、夜游和节日活动打基础。"
  }
];

const villageUpgradeDefinitions = [
  {
    id: "marketFront",
    name: "助农集市门面",
    isUnlocked: () => state.quests.helpedVillage,
    description: "杂货店门口出现集市棚、周转筐和统一价签，村里开始从零散售卖转向组织供货。"
  },
  {
    id: "ecommerceCorner",
    name: "电商发货角",
    isUnlocked: () => state.quests.courierStation || state.quests.liveStream,
    description: "村口快递点、直播架和溯源码海报连在一起，农货开始稳定出村。"
  },
  {
    id: "cooperativeFacade",
    name: "合作社门面",
    isUnlocked: () => state.quests.cooperativeFounded,
    description: "订单板升级为合作社窗口，农户、手作和旅游订单开始统一挂靠村级品牌。"
  },
  {
    id: "tourismStreet",
    name: "旅游导览街",
    isUnlocked: () => state.quests.halfDayTrail,
    description: "游客中心、导览牌和太阳能路灯出现在主街，村子开始承接农文旅客流。"
  },
  {
    id: "publicInfrastructure",
    name: "公共基建街区",
    isUnlocked: () => infrastructureProjectCount() >= 3,
    description: "水利、电力、冷链和道路标识在村口成型，公共服务不再只靠临时安排。"
  },
  {
    id: "railwayGateway",
    name: "高铁接驳入口",
    isUnlocked: () => infrastructureHas("highSpeedShuttle"),
    description: "村口出现高铁接驳候车点，游客和县城订单进入村子的路径更清楚。"
  },
  {
    id: "longTermCommons",
    name: "长期经营公约广场",
    isUnlocked: () => state.charter.developmentCharter || state.charter.longTermMode,
    description: "年终大会后，公共广场挂出发展公约，把收益反哺、生态限流和公共服务写成长期规则。"
  }
];

const infrastructureProjectDefinitions = [
  {
    id: "canalRepair",
    name: "水渠修复",
    cost: 90,
    materials: { ironParts: 1 },
    water: 2,
    power: 0,
    logistics: 0,
    tech: 0,
    tourismAppeal: 2,
    description: "把老水渠清淤加固，旱天也能把水引到菜地边。"
  },
  {
    id: "reservoir",
    name: "蓄水池",
    cost: 120,
    materials: { ironParts: 1 },
    water: 3,
    power: 0,
    logistics: 0,
    tech: 0,
    tourismAppeal: 3,
    description: "在村边修小型蓄水池，雨季蓄水、旱季保供。"
  },
  {
    id: "smartIrrigation",
    name: "自动灌溉",
    cost: 150,
    materials: { alloyParts: 1 },
    water: 4,
    power: 0,
    logistics: 0,
    tech: 2,
    tourismAppeal: 2,
    description: "给农田接入定时滴灌，清晨会自动润湿一批翻过的土地。"
  },
  {
    id: "solarMicrogrid",
    name: "太阳能微电网",
    cost: 170,
    materials: { alloyParts: 1 },
    water: 0,
    power: 4,
    logistics: 0,
    tech: 1,
    tourismAppeal: 5,
    description: "给路灯、民宿、冷链和无人机准备稳定的清洁电力。"
  },
  {
    id: "coldChain",
    name: "冷链仓",
    cost: 190,
    materials: { alloyParts: 1 },
    water: 0,
    power: 2,
    logistics: 5,
    tech: 1,
    tourismAppeal: 3,
    description: "把生鲜暂存和预冷做起来，快递损耗明显下降。"
  },
  {
    id: "highSpeedShuttle",
    name: "高铁接驳点",
    cost: 230,
    materials: { alloyParts: 2 },
    water: 0,
    power: 1,
    logistics: 2,
    tech: 0,
    tourismAppeal: 10,
    description: "村口接驳车连到高铁站，游客和县城订单都来得更稳定。"
  },
  {
    id: "droneSensors",
    name: "无人机与土壤传感器",
    cost: 260,
    materials: { ironParts: 1, alloyParts: 1 },
    water: 1,
    power: 1,
    logistics: 1,
    tech: 6,
    tourismAppeal: 4,
    description: "无人机巡田、传感器看墒情，让科技真正减少重复劳动。"
  }
];

const scenicSolids = new Set();
for (let y = 0; y < world.height; y += 1) {
  for (let x = 0; x < world.width; x += 1) {
    if (["river", "rock", "forest"].includes(scenicTerrain[y][x])) scenicSolids.add(`${x},${y}`);
  }
}
for (const item of scenicStructures.filter((item) => !["scenicSign", "bambooGrove"].includes(item.kind))) {
  for (let y = item.y; y < item.y + item.h; y += 1) {
    for (let x = item.x; x < item.x + item.w; x += 1) {
      scenicSolids.add(`${x},${y}`);
    }
  }
}

const pastureTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  pastureTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    pastureTerrain[y][x] = edge ? "fence" : rng() > 0.86 ? "flower" : "grass";
    if (x >= 2 && x <= 7) pastureTerrain[y][x] = "road";
    if (x >= 12 && x <= 14 && y >= 6 && y <= 16) pastureTerrain[y][x] = "trail";
  }
}

const pastureStructures = [
  { id: "sheepPen", x: 5, y: 5, w: 5, h: 4, kind: "regionalInfo" },
  { id: "forageShed", x: 17, y: 4, w: 4, h: 3, kind: "regionalInfo" },
  { id: "compostYard", x: 19, y: 13, w: 4, h: 3, kind: "regionalInfo" }
];

const pastureSolids = buildRegionalSolids(pastureTerrain, pastureStructures);

const workshopTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  workshopTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    workshopTerrain[y][x] = edge ? "fence" : rng() > 0.93 ? "flower" : "grass";
    if (y >= 8 && y <= 12) workshopTerrain[y][x] = "road";
    if (x >= 8 && x <= 11 && y >= 1 && y <= 18) workshopTerrain[y][x] = "road";
  }
}

const workshopStructures = [
  { id: "bambooWorkshop", x: 4, y: 4, w: 5, h: 4, kind: "regionalInfo" },
  { id: "pickleHouse", x: 16, y: 4, w: 5, h: 4, kind: "regionalInfo" },
  { id: "dryingYard", x: 5, y: 14, w: 5, h: 3, kind: "regionalInfo" },
  { id: "craftMarket", x: 18, y: 13, w: 5, h: 3, kind: "regionalInfo" }
];

const workshopSolids = buildRegionalSolids(workshopTerrain, workshopStructures);

const waterworksTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  waterworksTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    waterworksTerrain[y][x] = edge ? "fence" : "grass";
    if (x >= 13 && x <= 16) waterworksTerrain[y][x] = "trail";
    if (y >= 8 && y <= 11) waterworksTerrain[y][x] = "river";
    if (x >= 13 && x <= 16 && y >= 8 && y <= 11) waterworksTerrain[y][x] = "bridge";
    if (!edge && waterworksTerrain[y][x] === "grass" && rng() > 0.9) waterworksTerrain[y][x] = "flower";
  }
}

const waterworksStructures = [
  { id: "pumpHouse", x: 4, y: 5, w: 4, h: 3, kind: "regionalInfo" },
  { id: "reservoirBasin", x: 20, y: 4, w: 5, h: 4, kind: "regionalInfo" },
  { id: "sluiceGate", x: 11, y: 8, w: 2, h: 2, kind: "regionalInfo" },
  { id: "solarPump", x: 20, y: 13, w: 4, h: 3, kind: "regionalInfo" }
];

const waterworksSolids = buildRegionalSolids(waterworksTerrain, waterworksStructures, ["river"]);

const wetlandTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  wetlandTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    wetlandTerrain[y][x] = edge ? "fence" : "wetland";
    if (y >= 8 && y <= 12) wetlandTerrain[y][x] = "trail";
    if ((x >= 5 && x <= 10 && y >= 4 && y <= 6) || (x >= 18 && x <= 25 && y >= 13 && y <= 15)) wetlandTerrain[y][x] = "river";
    if ((x >= 12 && x <= 15 && y >= 3 && y <= 16) || (y >= 9 && y <= 10 && x >= 3 && x <= 27)) wetlandTerrain[y][x] = "bridge";
    if (!edge && wetlandTerrain[y][x] === "wetland" && rng() > 0.88) wetlandTerrain[y][x] = "reeds";
  }
}

const wetlandStructures = [
  { id: "wetlandBirds", x: 18, y: 5, w: 4, h: 2, kind: "regionalInfo" },
  { id: "reedMarsh", x: 5, y: 13, w: 4, h: 2, kind: "regionalInfo" },
  { id: "waterQualityPost", x: 11, y: 4, w: 3, h: 2, kind: "regionalInfo" }
];

const wetlandSolids = buildRegionalSolids(wetlandTerrain, wetlandStructures, ["river"]);

const stationTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  stationTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    stationTerrain[y][x] = edge ? "fence" : "grass";
    if (y >= 8 && y <= 12) stationTerrain[y][x] = "road";
    if (x >= 10 && x <= 25 && y >= 5 && y <= 7) stationTerrain[y][x] = "road";
    if (!edge && stationTerrain[y][x] === "grass" && rng() > 0.94) stationTerrain[y][x] = "flower";
  }
}

const stationStructures = [
  { id: "stationHall", x: 16, y: 2, w: 8, h: 4, kind: "regionalInfo" },
  { id: "stationShuttle", x: 5, y: 10, w: 3, h: 2, kind: "regionalInfo" },
  { id: "stationColdChain", x: 18, y: 12, w: 3, h: 2, kind: "regionalInfo" },
  { id: "souvenirKiosk", x: 6, y: 4, w: 3, h: 2, kind: "regionalInfo" }
];

const stationSolids = buildRegionalSolids(stationTerrain, stationStructures);

const alpineTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  alpineTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    alpineTerrain[y][x] = edge ? "forest" : "snow";
    if (y >= 12) alpineTerrain[y][x] = "grass";
    if (x >= 13 && x <= 16) alpineTerrain[y][x] = "trail";
    if (y === 6 && x >= 4 && x <= 25) alpineTerrain[y][x] = "rock";
    if (x >= 3 && x <= 8 && y >= 11 && y <= 13) alpineTerrain[y][x] = "river";
    if (!edge && alpineTerrain[y][x] === "grass" && rng() > 0.92) alpineTerrain[y][x] = "flower";
  }
}
for (let y = 0; y < world.height; y += 1) {
  for (let x = 13; x <= 16; x += 1) {
    alpineTerrain[y][x] = "trail";
  }
}

const alpineStructures = [
  { id: "snowPass", x: 12, y: 3, w: 5, h: 2, kind: "regionalInfo" },
  { id: "weatherStation", x: 21, y: 5, w: 3, h: 3, kind: "regionalInfo" },
  { id: "alpineLake", x: 4, y: 12, w: 4, h: 2, kind: "regionalInfo" },
  { id: "rescueHut", x: 22, y: 13, w: 4, h: 3, kind: "regionalInfo" }
];

const alpineSolids = buildRegionalSolids(alpineTerrain, alpineStructures, ["forest", "rock", "river"]);

const terraceTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  terraceTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    terraceTerrain[y][x] = edge ? "forest" : "grass";
    if (y >= 4 && y <= 15 && x >= 4 && x <= 22 && y % 3 === 0) terraceTerrain[y][x] = "terrace";
    if (x >= 13 && x <= 16) terraceTerrain[y][x] = "trail";
    if (y >= 8 && y <= 10 && x >= 0 && x <= 16) terraceTerrain[y][x] = "trail";
    if (x >= 23 && y <= 8) terraceTerrain[y][x] = "forest";
    if (!edge && terraceTerrain[y][x] === "grass" && rng() > 0.93) terraceTerrain[y][x] = "flower";
  }
}

const terraceStructures = [
  { id: "terracedFields", x: 6, y: 5, w: 5, h: 3, kind: "regionalInfo" },
  { id: "oldForest", x: 23, y: 4, w: 4, h: 3, kind: "regionalInfo" },
  { id: "terraceView", x: 12, y: 13, w: 4, h: 2, kind: "regionalInfo" }
];

const terraceSolids = buildRegionalSolids(terraceTerrain, terraceStructures, ["forest"]);

const homeTerrain = [];
for (let y = 0; y < world.height; y += 1) {
  homeTerrain[y] = [];
  for (let x = 0; x < world.width; x += 1) {
    const edge = x === 0 || y === 0 || x === world.width - 1 || y === world.height - 1;
    homeTerrain[y][x] = edge ? "wall" : "floor";
    if (x >= 12 && x <= 17 && y >= 9 && y <= 12) homeTerrain[y][x] = "rug";
  }
}

const homeStructures = [
  { id: "homeDoor", x: 14, y: 18, w: 2, h: 1, kind: "exitHouse" },
  { id: "bed", x: 22, y: 5, w: 3, h: 2, kind: "bed" },
  { id: "table", x: 13, y: 10, w: 3, h: 2, kind: "table" },
  { id: "mentor", x: 10, y: 10, w: 1, h: 1, kind: "person" },
  { id: "stove", x: 5, y: 5, w: 2, h: 2, kind: "stove" },
  { id: "aquarium", x: 16, y: 5, w: 3, h: 2, kind: "aquarium" },
  { id: "bookshelf", x: 5, y: 13, w: 3, h: 2, kind: "bookshelf" },
  { id: "petBed", x: 7, y: 15, w: 2, h: 1, kind: "petBed" },
  { id: "petToyBox", x: 11, y: 15, w: 2, h: 1, kind: "petToyBox" },
  { id: "petBowl", x: 18, y: 15, w: 2, h: 1, kind: "petBowl" }
];

const homeSolids = new Set();
for (let x = 0; x < world.width; x += 1) {
  homeSolids.add(`${x},0`);
  homeSolids.add(`${x},${world.height - 1}`);
}
for (let y = 0; y < world.height; y += 1) {
  homeSolids.add(`0,${y}`);
  homeSolids.add(`${world.width - 1},${y}`);
}
for (const item of homeStructures.filter((item) => !["exitHouse"].includes(item.kind))) {
  for (let y = item.y; y < item.y + item.h; y += 1) {
    for (let x = item.x; x < item.x + item.w; x += 1) {
      homeSolids.add(`${x},${y}`);
    }
  }
}

for (let i = 0; i < world.width * world.height; i += 1) {
  state.tiles.push({ tilled: false, watered: false, fertilized: false, crop: null });
}

const gameControlKeys = new Set([
  "arrowleft",
  "arrowright",
  "arrowup",
  "arrowdown",
  "a",
  "d",
  "w",
  "s",
  " ",
  "spacebar",
  "q",
  "e",
  "b",
  "n"
]);

function isGameControlEvent(event, key) {
  if (event.metaKey || event.ctrlKey || event.altKey) return false;
  return gameControlKeys.has(key)
    || event.code === "Space"
    || (key >= "1" && key <= String(tools.length));
}

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (isGameControlEvent(event, key)) {
    event.preventDefault();
  }
  keys.add(key);

  if (key >= "1" && key <= String(tools.length)) {
    state.selected = Number(key) - 1;
    renderPanels();
  }

  if (key === " " || key === "spacebar" || event.code === "Space") {
    useTool();
  }

  if (key === "e") {
    interact();
  }

  if (key === "q") {
    state.activeSeed = nextSeedType();
    say(`当前种子：${seedName(state.activeSeed)}`);
    renderPanels();
  }

  if (key === "b") {
    openPanel("inventory");
    say("打开背包。");
  }

  if (key === "n") {
    advancePhase();
  }
});

document.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.tab));
});

document.querySelector("#advancePhase").addEventListener("click", advancePhase);

function openPanel(panelId) {
  const button = document.querySelector(`.tab[data-tab="${panelId}"]`);
  const panel = document.querySelector(`#${panelId}`);
  if (!button || !panel) return;
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  panel.classList.add("active");
}

function index(x, y) {
  return y * world.width + x;
}

function getPlot(x, y) {
  if (state.map !== "farm") return null;
  if (x < 0 || y < 0 || x >= world.width || y >= world.height) return null;
  return state.tiles[index(x, y)];
}

function isBlocked(x, y) {
  const terrain = currentTerrain();
  const solids = currentSolids();
  return x < 0 || y < 0 || x >= world.width || y >= world.height || terrain[y][x] === "fence" || solids.has(`${x},${y}`);
}

function frontTile() {
  const { x, y, dirX, dirY } = state.player;
  return { x: x + dirX, y: y + dirY };
}

function nextSeedType() {
  const index = seedOrder.indexOf(state.activeSeed);
  return seedOrder[(index + 1) % seedOrder.length];
}

function seedName(type) {
  return cropTypes[type].seedName || `${cropTypes[type].name}种子`;
}

function cloneFlowerGenes(genes) {
  return {
    red: [...genes.red],
    yellow: [...genes.yellow],
    blue: [...genes.blue],
    rare: Boolean(genes.rare)
  };
}

function randomStarterFlowerGenes() {
  const genes = cloneFlowerGenes(starterFlowerGenes[Math.floor(rng() * starterFlowerGenes.length)]);
  mutateFlowerGenes(genes, 0.08);
  maybeRareFlowerMutation(genes, state.flowerBreeding.greenhouse ? 0.012 : 0.004);
  return genes;
}

function createFlowerGenes(x, y) {
  if (state.flowerBreeding.preparedGenes) {
    const genes = cloneFlowerGenes(state.flowerBreeding.preparedGenes);
    state.flowerBreeding.preparedGenes = null;
    mutateFlowerGenes(genes, state.flowerBreeding.greenhouse ? 0.05 : 0.03);
    maybeRareFlowerMutation(genes, state.flowerBreeding.greenhouse ? 0.06 : 0.025);
    return genes;
  }

  const parents = nearbyReadyFlowers(x, y);
  if (parents.length === 0) return randomStarterFlowerGenes();

  const parentA = parents[Math.floor(rng() * parents.length)].crop.genes;
  const parentB = parents.length === 1
    ? parentA
    : parents[Math.floor(rng() * parents.length)].crop.genes;
  const genes = createHybridFlowerGenes(parentA, parentB);
  mutateFlowerGenes(genes, parents.length >= 2 ? 0.04 : 0.02);
  maybeRareFlowerMutation(genes, state.flowerBreeding.greenhouse ? 0.025 : 0.008);
  return genes;
}

function createHybridFlowerGenes(parentA, parentB) {
  const genes = {};
  for (const locus of flowerLoci) {
    genes[locus] = [
      parentA[locus][Math.floor(rng() * 2)],
      parentB[locus][Math.floor(rng() * 2)]
    ];
  }
  genes.rare = Boolean(parentA.rare && parentB.rare && rng() < 0.2);
  return genes;
}

function mutateFlowerGenes(genes, chance) {
  if (rng() > chance) return;
  const locus = flowerLoci[Math.floor(rng() * flowerLoci.length)];
  const allele = Math.floor(rng() * 2);
  genes[locus][allele] = genes[locus][allele] ? 0 : 1;
}

function maybeRareFlowerMutation(genes, chance) {
  if (genes.rare || rng() > chance) return;
  genes.rare = true;
  state.flowerBreeding.rareMutations += 1;
}

function nearbyReadyFlowers(x, y) {
  const flowers = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const plot = getPlot(x + dx, y + dy);
      if (plot?.crop?.type === "flower" && plot.crop.ready && plot.crop.genes) {
        flowers.push(plot);
      }
    }
  }
  return flowers;
}

function flowerPhenotype(genes) {
  if (genes.rare) return { id: "aurora", ...flowerColors.aurora };
  const hasRed = genes.red.some(Boolean);
  const hasYellow = genes.yellow.some(Boolean);
  const hasBlue = genes.blue.some(Boolean);
  if (hasRed && hasYellow && hasBlue) return { id: "rainbow", ...flowerColors.rainbow };
  if (hasRed && hasYellow) return { id: "orange", ...flowerColors.orange };
  if (hasRed && hasBlue) return { id: "purple", ...flowerColors.purple };
  if (hasYellow && hasBlue) return { id: "green", ...flowerColors.green };
  if (hasRed) return { id: "red", ...flowerColors.red };
  if (hasYellow) return { id: "yellow", ...flowerColors.yellow };
  if (hasBlue) return { id: "blue", ...flowerColors.blue };
  return { id: "white", ...flowerColors.white };
}

function flowerGeneText(genes) {
  const phenotype = flowerPhenotype(genes);
  const geneText = flowerLoci.map((locus) => genes[locus].join("")).join("/");
  return `${phenotype.name} 基因 ${geneText}`;
}

function knownFlowerColorCount() {
  return Object.keys(state.flowerJournal).length;
}

function flowerInventoryText() {
  const items = Object.entries(state.flowers)
    .filter(([, count]) => count > 0)
    .map(([id, count]) => `${flowerColors[id].name} ${count}`);
  return items.length ? items.join("，") : "暂无切花";
}

function totalFlowerColorCount() {
  return Object.keys(flowerColors).length;
}

function flowerBreedingStatusText() {
  const greenhouse = state.flowerBreeding.greenhouse ? "温室已启用" : "温室未启用";
  const pollen = state.flowerBreeding.pollenGenes ? `已采集${state.flowerBreeding.pollenName}花粉` : "未采集花粉";
  const prepared = state.flowerBreeding.preparedGenes ? `下一粒花种会按${flowerPhenotype(state.flowerBreeding.preparedGenes).name}方向育种` : "暂无定向授粉种";
  return `${greenhouse}，${pollen}，${prepared}，基因检测 ${state.flowerBreeding.geneTests} 次，稀有突变 ${state.flowerBreeding.rareMutations} 次`;
}

function currentFlowerOrder() {
  return flowerOrderDefinitions.find((order) => order.isUnlocked() && !state.flowerOrders[order.id]) || null;
}

function flowerOrderRequirementName(order) {
  if (order.kind === "any") return `任意切花 ${Math.min(itemCount(state.flowers), order.count)}/${order.count}`;
  return Object.entries(order.colors)
    .map(([id, count]) => `${flowerColors[id].name} ${Math.min(state.flowers[id] || 0, count)}/${count}`)
    .join("，");
}

function flowerOrderCompletionRatio(order) {
  if (!order) return 0;
  if (order.kind === "any") return Math.min(1, itemCount(state.flowers) / order.count);
  const total = Object.entries(order.colors).reduce((sum, [, count]) => sum + count, 0);
  const current = Object.entries(order.colors).reduce((sum, [id, count]) => sum + Math.min(state.flowers[id] || 0, count), 0);
  return total ? Math.min(1, current / total) : 0;
}

function canFulfillFlowerOrder(order) {
  if (!order) return false;
  if (order.kind === "any") return itemCount(state.flowers) >= order.count;
  return Object.entries(order.colors).every(([id, count]) => (state.flowers[id] || 0) >= count);
}

function consumeFlowerOrder(order) {
  if (order.kind === "any") {
    consumeFromInventory(state.flowers, order.count, Object.keys(flowerColors));
    return;
  }
  for (const [id, count] of Object.entries(order.colors)) {
    state.flowers[id] -= count;
  }
}

function handleFlowerOrder() {
  const order = currentFlowerOrder();
  if (!order) return false;
  if (!canFulfillFlowerOrder(order)) {
    say(`花卉订单：${order.title}。${order.description} 需要 ${flowerOrderRequirementName(order)}，奖励 ${order.reward} 金。`);
    return true;
  }
  consumeFlowerOrder(order);
  state.flowerOrders[order.id] = true;
  state.money += order.reward;
  state.quests.sold += order.kind === "any"
    ? order.count
    : Object.values(order.colors).reduce((sum, count) => sum + count, 0);
  say(`完成花卉订单：${order.title}，获得 ${order.reward} 金。花田开始有稳定的花艺销路了。`);
  return true;
}

function itemCount(items) {
  return Object.values(items).reduce((sum, count) => sum + count, 0);
}

function createFishQualityInventory() {
  const ledger = {};
  for (const fishId of fishOrder) {
    ledger[fishId] = {};
    for (const qualityId of fishQualityOrder) {
      ledger[fishId][qualityId] = 0;
    }
  }
  return ledger;
}

function fishQualityLedger(fishId) {
  if (!state.fishQuality[fishId]) {
    state.fishQuality[fishId] = {};
  }
  for (const qualityId of fishQualityOrder) {
    if (typeof state.fishQuality[fishId][qualityId] !== "number") {
      state.fishQuality[fishId][qualityId] = 0;
    }
  }
  return state.fishQuality[fishId];
}

function fishSellValue(fishId, qualityId = "normal") {
  const quality = fishQualityDefinitions[qualityId] || fishQualityDefinitions.normal;
  return Math.round(fishTypes[fishId].sell * quality.multiplier);
}

function fishQualityCount(qualityId) {
  return fishOrder.reduce((sum, fishId) => sum + fishQualityLedger(fishId)[qualityId], 0);
}

function fishQualityScore() {
  return fishOrder.reduce((sum, fishId) => {
    const ledger = fishQualityLedger(fishId);
    return sum + fishQualityOrder.reduce((qualitySum, qualityId) => (
      qualitySum + ledger[qualityId] * fishQualityDefinitions[qualityId].score
    ), 0);
  }, 0);
}

function fishQualitySummaryText() {
  const parts = fishQualityOrder
    .filter((qualityId) => fishQualityCount(qualityId) > 0)
    .map((qualityId) => `${fishQualityDefinitions[qualityId].name} ${fishQualityCount(qualityId)}`);
  return parts.length ? parts.join("，") : "暂无品质记录";
}

function fishInventoryText(items = state.fish) {
  const list = fishOrder
    .filter((id) => items[id] > 0)
    .map((id) => `${fishTypes[id].name} ${items[id]}`);
  return list.length ? list.join("，") : "暂无鱼";
}

function aquariumFishCount() {
  return itemCount(state.aquarium);
}

function aquariumDiversityCount() {
  return fishOrder.filter((id) => state.aquarium[id] > 0).length;
}

function aquariumScore() {
  const count = aquariumFishCount();
  const diversity = aquariumDiversityCount();
  const rareSpecies = fishOrder.filter((id) => state.aquarium[id] > 0 && fishTypes[id].sell >= 80).length;
  let score = count * 4 + diversity * 7 + rareSpecies * 8;
  if (state.fishing.aquariumDecor.plants) score += 8;
  if (state.fishing.aquariumDecor.light) score += 12;
  return score;
}

function aquariumRatingText() {
  const score = aquariumScore();
  if (!aquariumFishCount()) return "0 分，先放入观赏鱼";
  if (score >= 60) return `${score} 分，精品民宿鱼缸`;
  if (score >= 40) return `${score} 分，游客愿意拍照`;
  return `${score} 分，继续增加鱼种和装饰`;
}

function aquariumSummaryText() {
  const count = aquariumFishCount();
  if (!count) return "鱼缸空着，可以把钓到的鱼放进去观赏";
  return `${count}/${aquariumCapacity}：${fishInventoryText(state.aquarium)}`;
}

function fishJournalCount() {
  return Object.keys(state.fishJournal).length;
}

function fishDiversityCount(items = state.fish) {
  return fishOrder.filter((id) => items[id] > 0).length;
}

function currentRodDefinition() {
  return rodDefinitions[state.fishing.rodLevel] || rodDefinitions[1];
}

function activeBaitId() {
  return ["eco", "insect", "grain"].find((id) => state.fishing.bait[id] > 0) || "";
}

function activeBaitDefinition() {
  const baitId = activeBaitId();
  return baitId ? baitDefinitions[baitId] : null;
}

function baitSummaryText() {
  const parts = Object.keys(baitDefinitions)
    .filter((id) => state.fishing.bait[id] > 0)
    .map((id) => `${baitDefinitions[id].name} ${state.fishing.bait[id]} 次`);
  return parts.length ? parts.join("，") : "无鱼饵";
}

function fishingOrderCompletedCount() {
  return Object.values(state.fishing.homestayOrders).filter(Boolean).length;
}

function fishingSystemText() {
  const rod = currentRodDefinition();
  const bait = activeBaitDefinition();
  const pond = state.fishing.fishPond
    ? state.fishing.pondSpecies
      ? `鱼塘养殖 ${fishTypes[state.fishing.pondSpecies].name} ${state.fishing.pondStock} 尾`
      : "鱼塘已建，待投放亲鱼"
    : "鱼塘未建";
  return `${rod.name}；${bait ? `当前鱼饵 ${bait.name}` : baitSummaryText()}；${pond}`;
}

function nextRodUpgrade() {
  return rodDefinitions[state.fishing.rodLevel + 1] || null;
}

function rodUpgradeStatusText() {
  const next = nextRodUpgrade();
  if (!next) return "鱼竿已是最高级";
  if (state.fishing.rodLevel === 1) {
    return `碳素鱼竿：图鉴 ${fishJournalCount()}/3，金币 ${state.money}/${next.money}`;
  }
  return `智能探鱼竿：鱼鲜订单 ${fishingOrderCompletedCount()}/1，半日线 ${state.quests.halfDayTrail ? "已开放" : "未开放"}，金币 ${state.money}/${next.money}`;
}

function currentFishingOrder() {
  return fishingOrderDefinitions.find((order) => (
    order.isUnlocked() && !state.fishing.homestayOrders[order.id]
  )) || null;
}

function fishingRequirementName(requirement) {
  if (requirement.kind === "fishAny") return "任意鱼";
  if (requirement.kind === "fish") return fishTypes[requirement.item].name;
  if (requirement.kind === "fishDiversity") return "不同鱼种";
  if (requirement.kind === "qualityScore") return "鱼鲜品质分";
  return "鱼鲜";
}

function fishingRequirementAvailable(requirement) {
  if (requirement.kind === "fishAny") return itemCount(state.fish);
  if (requirement.kind === "fish") return state.fish[requirement.item] || 0;
  if (requirement.kind === "fishDiversity") return fishDiversityCount();
  if (requirement.kind === "qualityScore") return fishQualityScore();
  return 0;
}

function fishingRequirementProgressText(requirement) {
  return `${fishingRequirementName(requirement)} ${Math.min(fishingRequirementAvailable(requirement), requirement.count)}/${requirement.count}`;
}

function fishingOrderProgressText(order) {
  return order.requirements.map(fishingRequirementProgressText).join("，");
}

function fishingOrderCompletionRatio(order) {
  if (!order) return 0;
  const progress = order.requirements.reduce((sum, requirement) => (
    sum + Math.min(1, fishingRequirementAvailable(requirement) / requirement.count)
  ), 0);
  return Math.min(1, progress / order.requirements.length);
}

function canFulfillFishingOrder(order) {
  return order.requirements.every((requirement) => fishingRequirementAvailable(requirement) >= requirement.count);
}

function consumeFishingRequirement(requirement, preferHighQuality = false) {
  const qualityOrder = preferHighQuality ? fishOrderQualityPreference : fishSellQualityOrder;
  if (requirement.kind === "fishAny") consumeFishAny(requirement.count, qualityOrder);
  if (requirement.kind === "fish") consumeFishSpecific(requirement.item, requirement.count, qualityOrder);
}

function fishingOrderFishCount(order) {
  return order.requirements.reduce((sum, requirement) => (
    ["fishAny", "fish"].includes(requirement.kind) ? sum + requirement.count : sum
  ), 0);
}

function handleFishingOrder() {
  const order = currentFishingOrder();
  if (!order) return false;
  if (!canFulfillFishingOrder(order)) {
    say(`鱼鲜订单：${order.title}。${order.description} 需要 ${fishingOrderProgressText(order)}，奖励 ${order.reward} 金。`);
    return true;
  }
  const preferHighQuality = order.requirements.some((requirement) => requirement.kind === "qualityScore");
  for (const requirement of order.requirements) {
    consumeFishingRequirement(requirement, preferHighQuality);
  }
  state.fishing.homestayOrders[order.id] = true;
  state.money += order.reward;
  state.quests.sold += Math.max(1, fishingOrderFishCount(order));
  say(`完成鱼鲜订单：${order.title}，获得 ${order.reward} 金。垂钓体验和民宿菜单都有了真实卖点。`);
  return true;
}

function currentTermProfile() {
  return solarTermFarmProfiles[currentSolarTerm()] || solarTermFarmProfiles.春分;
}

function cropTermStatus(type, profile = currentTermProfile()) {
  if (profile.good.includes(type)) return "good";
  if (profile.tough.includes(type)) return "tough";
  return "normal";
}

function cropGrowthAmount(type, profile, weather) {
  let amount = 1;
  const status = cropTermStatus(type, profile);
  if (status === "good") amount += 0.45;
  if (status === "tough" && !(type === "flower" && state.flowerBreeding.greenhouse)) amount -= 0.35;
  if (state.techOps.breedingTrials > 0) amount += status === "tough" ? 0.18 : 0.06;
  if (weather.id === "sunny" && type === "flower") amount += 0.1;
  if (type === "flower" && state.flowerBreeding.greenhouse) amount += 0.25;
  if (["drizzle", "rain"].includes(weather.id) && type === "bean") amount += 0.1;
  if (weather.id === "storm") amount -= 0.1;
  if (["snow", "frost"].includes(weather.id) && !(type === "flower" && state.flowerBreeding.greenhouse)) {
    amount -= state.techOps.breedingTrials > 0 ? 0.08 : 0.2;
  }
  return Math.max(0.45, amount);
}

function termFarmEffectText() {
  const profile = currentTermProfile();
  const good = profile.good.length ? profile.good.map((type) => cropTypes[type].name).join("、") : "无特别加成";
  const tough = profile.tough.length ? profile.tough.map((type) => cropTypes[type].name).join("、") : "无明显受限";
  return `${profile.note} 适宜：${good}；谨慎：${tough}`;
}

function currentTermOrder() {
  return termOrderDefinitions[currentSolarTerm()];
}

function currentTermOrderKey() {
  const yearIndex = Math.floor((state.totalDay - 1) / (solarTerms.length * 3));
  return `${yearIndex}-${state.termIndex}`;
}

function isCurrentTermOrderDone() {
  return Boolean(state.termOrders[currentTermOrderKey()]);
}

function orderItemName(order) {
  if (order.kind === "crop") return cropTypes[order.item].name;
  if (order.kind === "cropAny") return "任意农产品";
  if (order.kind === "flowerAny") return "任意切花";
  if (order.kind === "fishAny") return "任意鱼";
  if (order.kind === "craft") return craftItemDefinitions[order.item].name;
  if (order.kind === "craftAny") return "任意手作";
  return "物资";
}

function availableOrderCount(order) {
  if (order.kind === "crop") return state.crops[order.item] || 0;
  if (order.kind === "cropAny") return itemCount(state.crops);
  if (order.kind === "flowerAny") return itemCount(state.flowers);
  if (order.kind === "fishAny") return itemCount(state.fish);
  if (order.kind === "craft") return state.crafts[order.item] || 0;
  if (order.kind === "craftAny") return itemCount(state.crafts);
  return 0;
}

function orderProgressText(order) {
  return `${orderItemName(order)} ${Math.min(availableOrderCount(order), order.count)}/${order.count}`;
}

function consumeFromInventory(items, count, order = Object.keys(items)) {
  let remaining = count;
  for (const id of order) {
    if (!items[id]) continue;
    const used = Math.min(items[id], remaining);
    items[id] -= used;
    remaining -= used;
    if (remaining <= 0) return true;
  }
  return remaining <= 0;
}

function consumeFishSpecific(fishId, count, qualityOrder = fishSellQualityOrder) {
  if ((state.fish[fishId] || 0) < count) return false;
  const ledger = fishQualityLedger(fishId);
  const tracked = fishQualityOrder.reduce((sum, qualityId) => sum + ledger[qualityId], 0);
  if (tracked < state.fish[fishId]) {
    ledger.normal += state.fish[fishId] - tracked;
  }
  let remaining = count;
  for (const qualityId of qualityOrder) {
    const used = Math.min(ledger[qualityId], remaining);
    ledger[qualityId] -= used;
    remaining -= used;
    if (remaining <= 0) break;
  }
  state.fish[fishId] -= count;
  return true;
}

function consumeFishAny(count, qualityOrder = fishSellQualityOrder) {
  if (itemCount(state.fish) < count) return false;
  let remaining = count;
  for (const fishId of fishOrder) {
    if (!state.fish[fishId]) continue;
    const used = Math.min(state.fish[fishId], remaining);
    consumeFishSpecific(fishId, used, qualityOrder);
    remaining -= used;
    if (remaining <= 0) return true;
  }
  return remaining <= 0;
}

function sellAllFish() {
  let earned = 0;
  let sold = 0;
  for (const fishId of fishOrder) {
    const count = state.fish[fishId] || 0;
    if (!count) continue;
    const ledger = fishQualityLedger(fishId);
    const tracked = fishQualityOrder.reduce((sum, qualityId) => sum + ledger[qualityId], 0);
    if (tracked < count) ledger.normal += count - tracked;
    for (const qualityId of fishSellQualityOrder) {
      earned += fishSellValue(fishId, qualityId) * ledger[qualityId];
      ledger[qualityId] = 0;
    }
    sold += count;
    state.fish[fishId] = 0;
  }
  return { earned, sold };
}

function sellAllEggs() {
  const count = state.livestock.eggs;
  if (!count) return { earned: 0, sold: 0 };
  state.livestock.eggs = 0;
  return { earned: count * 26, sold: count };
}

function sellAllCrafts() {
  let earned = 0;
  let sold = 0;
  for (const [id, definition] of Object.entries(craftItemDefinitions)) {
    const count = state.crafts[id] || 0;
    if (!count) continue;
    earned += definition.sell * count;
    sold += count;
    state.crafts[id] = 0;
  }
  return { earned, sold };
}

function consumeTermOrderItems(order) {
  if (order.kind === "crop") {
    state.crops[order.item] -= order.count;
    return;
  }
  if (order.kind === "cropAny") consumeFromInventory(state.crops, order.count, Object.keys(cropTypes).filter((type) => type !== "flower"));
  if (order.kind === "flowerAny") consumeFromInventory(state.flowers, order.count, Object.keys(flowerColors));
  if (order.kind === "fishAny") consumeFishAny(order.count);
  if (order.kind === "craft") state.crafts[order.item] -= order.count;
  if (order.kind === "craftAny") consumeFromInventory(state.crafts, order.count, Object.keys(craftItemDefinitions));
}

function handleTermOrder() {
  const order = currentTermOrder();
  if (!order) return false;
  if (isCurrentTermOrderDone()) {
    say(`订单板：${currentSolarTerm()}的“${order.title}”已经完成。`);
    return true;
  }
  if (availableOrderCount(order) < order.count) {
    say(`订单板：${order.title}。${order.description} 需要 ${orderProgressText(order)}，奖励 ${order.reward} 金。`);
    return true;
  }
  consumeTermOrderItems(order);
  state.money += order.reward;
  state.quests.sold += order.count;
  state.termOrders[currentTermOrderKey()] = true;
  updateStoryProgress();
  say(`完成节气订单：${order.title}。交付 ${orderItemName(order)} ${order.count}，获得 ${order.reward} 金。`);
  return true;
}

function orderCompletionRatio(order) {
  if (!order) return 0;
  return Math.min(1, availableOrderCount(order) / order.count);
}

function isCommunityOrderUnlocked(order) {
  if (order.unlock === "visitedClinic") return state.quests.visitedClinic || state.quests.helpedVillage;
  if (order.unlock === "visitedCafe") return state.quests.visitedCafe || state.quests.helpedVillage;
  if (order.unlock === "helpedVillage") return state.quests.helpedVillage;
  if (order.unlock === "halfDayTrail") return state.quests.halfDayTrail;
  if (order.unlock === "livestock") return state.livestock.coopBuilt && state.livestock.chickens > 0 && state.quests.halfDayTrail;
  if (order.unlock === "crafts") return state.crafts.souvenirBox > 0 || state.craftOps.batches >= 4;
  return true;
}

function currentCommunityOrder() {
  return communityOrderDefinitions.find((order) => (
    isCommunityOrderUnlocked(order) && !state.communityOrders[order.id]
  )) || null;
}

function requirementName(requirement) {
  if (requirement.kind === "cropAny") return "任意农产品";
  if (requirement.kind === "flowerAny") return "任意切花";
  if (requirement.kind === "fishAny") return "任意鱼";
  if (requirement.kind === "egg") return "鸡蛋";
  if (requirement.kind === "craft") return craftItemDefinitions[requirement.item].name;
  if (requirement.kind === "craftAny") return "任意手作";
  if (requirement.kind === "processedCraftAny") return "腌菜或干货";
  return "物资";
}

function requirementAvailable(requirement) {
  if (requirement.kind === "cropAny") return itemCount(state.crops);
  if (requirement.kind === "flowerAny") return itemCount(state.flowers);
  if (requirement.kind === "fishAny") return itemCount(state.fish);
  if (requirement.kind === "egg") return state.livestock.eggs;
  if (requirement.kind === "craft") return state.crafts[requirement.item] || 0;
  if (requirement.kind === "craftAny") return itemCount(state.crafts);
  if (requirement.kind === "processedCraftAny") return (state.crafts.pickles || 0) + (state.crafts.driedVeg || 0);
  return 0;
}

function requirementProgressText(requirement) {
  return `${requirementName(requirement)} ${Math.min(requirementAvailable(requirement), requirement.count)}/${requirement.count}`;
}

function communityOrderProgressText(order) {
  return order.requirements.map(requirementProgressText).join("，");
}

function communityOrderCompletionRatio(order) {
  if (!order) return 0;
  const progress = order.requirements.reduce((sum, requirement) => (
    sum + Math.min(1, requirementAvailable(requirement) / requirement.count)
  ), 0);
  return Math.min(1, progress / order.requirements.length);
}

function canFulfillRequirements(requirements) {
  return requirements.every((requirement) => requirementAvailable(requirement) >= requirement.count);
}

function consumeRequirement(requirement) {
  if (requirement.kind === "cropAny") consumeFromInventory(state.crops, requirement.count, Object.keys(state.crops));
  if (requirement.kind === "flowerAny") consumeFromInventory(state.flowers, requirement.count, Object.keys(flowerColors));
  if (requirement.kind === "fishAny") consumeFishAny(requirement.count);
  if (requirement.kind === "egg") state.livestock.eggs = Math.max(0, state.livestock.eggs - requirement.count);
  if (requirement.kind === "craft") state.crafts[requirement.item] = Math.max(0, state.crafts[requirement.item] - requirement.count);
  if (requirement.kind === "craftAny") consumeFromInventory(state.crafts, requirement.count, Object.keys(craftItemDefinitions));
  if (requirement.kind === "processedCraftAny") consumeFromInventory(state.crafts, requirement.count, ["pickles", "driedVeg"]);
}

function requirementTotalCount(requirements) {
  return requirements.reduce((sum, requirement) => sum + requirement.count, 0);
}

function completedCommunityOrderCount() {
  return Object.values(state.communityOrders).filter(Boolean).length;
}

function completedTermOrderCount() {
  return Object.values(state.termOrders).filter(Boolean).length;
}

function cooperativeCapabilityCount() {
  return [
    state.quests.packagedProduce,
    completedCommunityOrderCount() >= 1,
    aidCaseCompletedCount() >= 2,
    state.quests.courierStation,
    state.flowerBreeding.greenhouse,
    state.fishing.fishPond,
    fishingOrderCompletedCount() >= 1,
    state.craftOps.batches >= 1,
    state.quests.halfDayTrail
  ].filter(Boolean).length;
}

function cooperativeReadinessRatio() {
  const basics = [
    state.quests.helpedVillage,
    state.quests.packagedProduce,
    completedCommunityOrderCount() >= 1
  ].filter(Boolean).length;
  return basics / 3;
}

function cooperativeStatusText() {
  if (state.quests.cooperativeFounded) {
    return `已成立，能力 ${cooperativeCapabilityCount()} 项：订单、分级、花艺、鱼鲜、手作和旅游逐步纳入统一品牌`;
  }
  const items = [
    `助农集市 ${state.quests.helpedVillage ? "完成" : "未完成"}`,
    `分级打包 ${state.quests.packagedProduce ? "完成" : "未完成"}`,
    `社区订单 ${completedCommunityOrderCount()}/1`
  ];
  return `筹备中：${items.join("，")}`;
}

function canFoundCooperative() {
  return state.quests.helpedVillage
    && state.quests.packagedProduce
    && completedCommunityOrderCount() >= 1;
}

function foundCooperative() {
  state.quests.cooperativeFounded = true;
  grantMaterials({ ironParts: 1 });
  state.tourism.serviceAppeal += 3;
  updateTourismProgress();
  say("晨谷合作社成立：村民决定统一分级、统一品牌、统一接订单。获得铁件 +1，花艺温室、生态鱼塘、手作工坊和订单板都纳入合作社能力。");
}

function currentMainChapter() {
  if (state.charter.longTermMode) {
    return { id: 8, title: "长期经营模式", goal: "继续按节气经营，补齐产业、节日和村庄品质。" };
  }
  if (infrastructureProjectCount() >= infrastructureProjectDefinitions.length) {
    return { id: 8, title: "第八章：留下来的村庄", goal: "准备年度总结、村庄评级和长期发展公约。" };
  }
  if (canStartInfrastructure() || infrastructureProjectCount() > 0) {
    return { id: 7, title: "第七章：现代基础设施", goal: "补齐水利、电力、冷链、交通和数字农业。" };
  }
  if (state.quests.halfDayTrail) return { id: 6, title: "第六章：农文旅融合", goal: "补齐景区配套，把风景、鱼鲜、花艺、手作和民宿串成体验。" };
  if (state.quests.cooperativeFounded || scenicResourceCount() > 0) return { id: 5, title: "第五章：后山调查", goal: "把资源点调查清楚，再决定如何开发旅游。" };
  if (canFoundCooperative()) return { id: 4, title: "第四章：合作社成立", goal: "把分散生产变成村级统一品牌和公共能力。" };
  if (state.quests.packagedProduce || state.quests.courierStation || state.quests.liveStream) {
    return { id: 3, title: "第三章：电商助农", goal: "用分拣、包装、快递和直播解决稳定复购。" };
  }
  if (state.quests.helpedVillage) return { id: 2, title: "第二章：助农集市", goal: "把零散农货组织成能稳定售卖的小集市。" };
  return { id: 1, title: "第一章：返乡第一块地", goal: "种出第一批农产品，让农货开始流动。" };
}

function handleCommunityOrder() {
  if (!state.quests.cooperativeFounded && canFoundCooperative()) {
    foundCooperative();
    return true;
  }

  const order = currentCommunityOrder();
  if (!order) {
    if (state.quests.cooperativeFounded) {
      say(`合作社订单板：当前社区订单都处理完了。${cooperativeStatusText()}。`);
    } else if (state.quests.helpedVillage) {
      say(`合作社订单板：当前社区订单都处理完了。${cooperativeStatusText()}。`);
    } else {
      say("合作社订单板：先走访卫生站和茶铺，了解真实需求后才会贴出订单。");
    }
    return true;
  }
  if (!canFulfillRequirements(order.requirements)) {
    say(`合作社订单板：${order.title}。${order.description} 需要 ${communityOrderProgressText(order)}，奖励 ${order.reward} 金。${state.quests.cooperativeFounded ? "合作社统一接单后，收益会继续反哺公共设施。" : "完成社区订单后，可以推进合作社成立。"}`);
    return true;
  }
  for (const requirement of order.requirements) {
    consumeRequirement(requirement);
  }
  state.communityOrders[order.id] = true;
  state.money += order.reward;
  state.quests.sold += requirementTotalCount(order.requirements);
  if (order.tourismAppeal) {
    state.tourism.serviceAppeal += order.tourismAppeal;
    updateTourismProgress();
  }
  updateStoryProgress();
  say(`完成社区订单：${order.title}。获得 ${order.reward} 金，村里的公共服务和经营更稳定了。${!state.quests.cooperativeFounded && canFoundCooperative() ? "再按一次合作社订单板，可发起合作社章程。" : ""}`);
  return true;
}

function mixedSellableCount() {
  return itemCount(state.crops) + itemCount(state.flowers) + itemCount(state.fish) + state.livestock.eggs + itemCount(state.crafts);
}

function currentPackagingDesign() {
  return packagingDesignDefinitions.find((design) => design.id === state.aidOps.packagingDesign) || packagingDesignDefinitions[0];
}

function bestUnlockedPackagingDesign() {
  return packagingDesignDefinitions
    .filter((design) => design.isUnlocked())
    .at(-1) || packagingDesignDefinitions[0];
}

function nextPackagingDesign() {
  const currentIndex = packagingDesignDefinitions.findIndex((design) => design.id === state.aidOps.packagingDesign);
  return packagingDesignDefinitions
    .slice(Math.max(0, currentIndex + 1))
    .find((design) => design.isUnlocked()) || null;
}

function estimateLogisticsLoss(useSortedBatch = state.aidOps.sortedBatches > 0) {
  let loss = 18;
  const packaging = currentPackagingDesign();
  loss -= packaging.protection;
  loss -= Math.floor(state.aidOps.sortingQuality / 14);
  if (useSortedBatch) loss -= 6;
  if (state.quests.courierStation) loss -= 3;
  if (state.quests.liveStream) loss -= 2;
  if (infrastructureHas("coldChain")) loss -= 5;
  if (infrastructureHas("highSpeedShuttle")) loss -= 2;
  if (infrastructureHas("droneSensors")) loss -= 1;
  loss -= Math.floor(state.aidCases.brandScore / 25);
  if (["rain", "storm", "snow"].includes(currentWeather().id)) loss += 4;
  if (currentWeather().id === "storm") loss += 3;
  return Math.max(3, Math.min(28, loss));
}

function aidOpsSummaryText() {
  const packaging = currentPackagingDesign();
  return `分拣质量 ${state.aidOps.sortingQuality}/100，已分拣批次 ${state.aidOps.sortedBatches}，包装 ${packaging.name}，预估物流损耗 ${estimateLogisticsLoss()}%，直播反馈 ${state.aidOps.liveFeedback}，案例 ${aidCaseCompletedCount()}/${aidCaseDefinitions.length}`;
}

function aidCaseCompletedCount() {
  return aidCaseDefinitions.filter((aidCase) => state.aidCases.completed[aidCase.id]).length;
}

function currentAidCase() {
  return aidCaseDefinitions.find((aidCase) => !state.aidCases.completed[aidCase.id]) || null;
}

function aidCaseRequirementProgress(requirement) {
  if (requirement.kind === "quest") return state.quests[requirement.key] ? 1 : 0;
  if (requirement.kind === "sortedBatches") return Math.min(requirement.count, state.aidOps.sortedBatches);
  if (requirement.kind === "mixedSellables") return Math.min(requirement.count, mixedSellableCount());
  if (requirement.kind === "parcelsSent") return Math.min(requirement.count, state.facilities.parcelsSent);
  if (requirement.kind === "lastParcelLossAtMost") return state.aidOps.lastParcelLoss > 0 && state.aidOps.lastParcelLoss <= requirement.count ? 1 : 0;
  if (requirement.kind === "liveFeedback") return Math.min(requirement.count, state.aidOps.liveFeedback);
  if (requirement.kind === "money") return Math.min(requirement.count, state.money);
  if (requirement.kind === "cooperativeFounded") return state.quests.cooperativeFounded ? 1 : 0;
  if (requirement.kind === "communityOrders") return Math.min(requirement.count, completedCommunityOrderCount());
  if (requirement.kind === "termOrders") return Math.min(requirement.count, completedTermOrderCount());
  return 0;
}

function aidCaseRequirementDone(requirement) {
  if (["quest", "cooperativeFounded", "lastParcelLossAtMost"].includes(requirement.kind)) {
    return aidCaseRequirementProgress(requirement) >= 1;
  }
  return aidCaseRequirementProgress(requirement) >= requirement.count;
}

function aidCaseRequirementText(requirement) {
  if (requirement.kind === "lastParcelLossAtMost") {
    const loss = state.aidOps.lastParcelLoss || estimateLogisticsLoss();
    return `${requirement.label}：${loss}%/${requirement.count}%`;
  }
  if (["quest", "cooperativeFounded"].includes(requirement.kind)) {
    return `${requirement.label}：${aidCaseRequirementDone(requirement) ? "完成" : "未完成"}`;
  }
  return `${requirement.label}：${aidCaseRequirementProgress(requirement)}/${requirement.count}`;
}

function aidCaseProgressRatio(aidCase) {
  if (!aidCase) return 1;
  const total = aidCase.requirements.length;
  const done = aidCase.requirements.filter(aidCaseRequirementDone).length;
  return total ? done / total : 1;
}

function canCompleteAidCase(aidCase) {
  return aidCase && aidCase.requirements.every(aidCaseRequirementDone);
}

function consumeAidCaseRequirements(aidCase) {
  for (const requirement of aidCase.requirements) {
    if (requirement.kind === "sortedBatches") {
      state.aidOps.sortedBatches = Math.max(0, state.aidOps.sortedBatches - requirement.count);
    }
    if (requirement.kind === "mixedSellables") {
      consumeMixedSellables(requirement.count);
    }
    if (requirement.kind === "money") {
      state.money = Math.max(0, state.money - requirement.count);
    }
  }
}

function completeAidCase(aidCase) {
  consumeAidCaseRequirements(aidCase);
  state.aidCases.completed[aidCase.id] = true;
  state.aidCases.brandScore = Math.min(100, state.aidCases.brandScore + aidCase.brand);
  state.aidCases.caseImpact += aidCase.impact;
  state.aidCases.contractOrders += aidCase.contract || 0;
  state.aidOps.repeatCustomers += aidCase.repeat || 0;
  state.aidOps.liveFeedback = Math.min(100, state.aidOps.liveFeedback + (aidCase.feedback || 0));
  state.money += aidCase.reward;
  if (aidCase.grant) grantMaterials(aidCase.grant);
  state.aidOps.logisticsLoss = estimateLogisticsLoss();
  updateStoryProgress();
  const grantText = aidCase.grant ? `，获得${materialRewardText(aidCase.grant)}` : "";
  say(`完成真实助农案例：${aidCase.title}。${aidCase.result} 品牌力 +${aidCase.brand}，案例影响 +${aidCase.impact}，获得 ${aidCase.reward} 金${grantText}。`);
}

function tryCompleteAidCase() {
  const aidCase = currentAidCase();
  if (!aidCase) return false;
  if (!canCompleteAidCase(aidCase)) return false;
  completeAidCase(aidCase);
  return true;
}

function aidCaseStatusText() {
  const aidCase = currentAidCase();
  if (!aidCase) return `案例链完成，品牌力 ${state.aidCases.brandScore}/100，影响 ${state.aidCases.caseImpact}`;
  return `${aidCase.title}：${aidCase.requirements.map(aidCaseRequirementText).join("，")}`;
}

function aidCaseListMarkup() {
  return aidCaseDefinitions.map((aidCase) => {
    const done = state.aidCases.completed[aidCase.id];
    const current = currentAidCase();
    const active = current && current.id === aidCase.id;
    const requirementText = done ? aidCase.result : aidCase.requirements.map(aidCaseRequirementText).join("；");
    return `<li class="${done ? "done" : active ? "warn" : ""}">${aidCase.title}：${done ? "完成" : requirementText}</li>`;
  }).join("");
}

function improvePackagingDesign() {
  const next = nextPackagingDesign();
  if (!next) {
    say(`包装台：当前使用${currentPackagingDesign().name}。${currentPackagingDesign().description}`);
    return false;
  }
  if (state.money < next.cost) {
    say(`包装台：${next.name}需要 ${next.cost} 金设计和打样。${next.description}`);
    return false;
  }
  state.money -= next.cost;
  state.aidOps.packagingDesign = next.id;
  state.aidOps.logisticsLoss = estimateLogisticsLoss();
  say(`包装设计升级为${next.name}：${next.description} 花费 ${next.cost} 金。`);
  return true;
}

function runSortingMiniGame() {
  if (mixedSellableCount() <= 0) {
    if (!improvePackagingDesign()) {
      say("分拣台：先准备作物、切花或鱼，再来做分级打包。");
    }
    return;
  }
  const step = sortingSteps[state.aidOps.sortingStep];
  const diversity = [
    itemCount(state.crops) > 0,
    itemCount(state.flowers) > 0,
    itemCount(state.fish) > 0
  ].filter(Boolean).length;
  const weatherBonus = ["sunny", "cloudy"].includes(currentWeather().id) ? 2 : ["storm", "rain"].includes(currentWeather().id) ? -2 : 0;
  const gain = Math.max(6, step.score + diversity * 2 + weatherBonus);
  state.aidOps.sortingQuality = Math.min(100, state.aidOps.sortingQuality + gain);
  state.aidOps.sortingStep += 1;

  if (state.aidOps.sortingStep >= sortingSteps.length) {
    state.aidOps.sortingStep = 0;
    state.aidOps.sortedBatches += 1;
    state.aidOps.logisticsLoss = estimateLogisticsLoss(true);
    const materialText = state.aidOps.sortedBatches % 2 === 0 ? "，额外回收铁件 +1" : "";
    if (state.aidOps.sortedBatches % 2 === 0) grantMaterials({ ironParts: 1 });
    say(`完成一轮分拣小游戏：规格、品相和溯源码都处理好了。分拣质量 ${state.aidOps.sortingQuality}/100，待发批次 ${state.aidOps.sortedBatches}${materialText}。`);
    return;
  }

  say(`分拣小游戏：${step.name}。${step.note} 质量 +${gain}，下一步：${sortingSteps[state.aidOps.sortingStep].name}。`);
}

function handlePackingWorkbench() {
  if (!state.quests.helpedVillage) {
    say("分拣打包点还没启用。先完成第一批农货销售。");
    return;
  }
  if (!state.quests.packagedProduce) {
    state.quests.packagedProduce = true;
    state.aidOps.packagingDesign = "buffered";
    state.aidOps.logisticsLoss = estimateLogisticsLoss();
    grantMaterials({ ironParts: 1 });
    say("完成分拣打包：启用防压保鲜箱，给农货贴上等级和产地标签，获得铁件 +1。");
    return;
  }
  const best = bestUnlockedPackagingDesign();
  if (best.id !== state.aidOps.packagingDesign && state.money >= best.cost && mixedSellableCount() === 0) {
    improvePackagingDesign();
    return;
  }
  runSortingMiniGame();
}

function consumeMixedSellables(count) {
  let remaining = count;
  const groups = [
    { items: state.crops, order: Object.keys(state.crops) },
    { items: state.flowers, order: Object.keys(flowerColors) },
    { items: state.fish, order: fishOrder },
    { items: state.livestock, order: ["eggs"] },
    { items: state.crafts, order: Object.keys(craftItemDefinitions) }
  ];
  for (const group of groups) {
    for (const id of group.order) {
      if (!group.items[id]) continue;
      const used = Math.min(group.items[id], remaining);
      group.items[id] -= used;
      remaining -= used;
      if (remaining <= 0) return true;
    }
  }
  return remaining <= 0;
}

function sendCourierParcel() {
  const parcelSize = state.quests.liveStream ? 3 : 2;
  if (mixedSellableCount() < parcelSize) {
    say(`快递驿站：至少准备 ${parcelSize} 件作物、切花、鱼、鸡蛋或手作，才能凑成一箱标准农货包裹。`);
    return;
  }
  const usedSortedBatch = state.aidOps.sortedBatches > 0;
  const loss = estimateLogisticsLoss(usedSortedBatch);
  const packaging = currentPackagingDesign();
  consumeMixedSellables(parcelSize);
  if (usedSortedBatch) state.aidOps.sortedBatches -= 1;
  const gross = 54
    + (state.quests.liveStream ? 32 : 0)
    + Math.min(24, state.facilities.parcelsSent * 4)
    + packaging.brand * 5
    + Math.floor(state.aidCases.brandScore / 4)
    + Math.floor(state.aidOps.liveFeedback / 8);
  const lossPenalty = Math.floor(gross * loss / 100);
  const reward = Math.max(24, gross - lossPenalty);
  state.facilities.parcelsSent += 1;
  state.aidOps.logisticsLoss = loss;
  state.aidOps.lastParcelLoss = loss;
  grantMaterials({ ironParts: 1 });
  state.money += reward;
  state.quests.sold += parcelSize;
  updateStoryProgress();
  say(`快递驿站发出第 ${state.facilities.parcelsSent} 箱农货包裹，物流损耗 ${loss}%，获得 ${reward} 金和铁件 +1。${usedSortedBatch ? "已消耗 1 个分拣批次。" : "未使用分拣批次，损耗偏高。"}`);
}

function runLiveFeedback() {
  if (state.facilities.parcelsSent <= 0) {
    say("直播间：先通过快递驿站寄出一箱标准农货，再看真实反馈。");
    return;
  }
  const packaging = currentPackagingDesign();
  const score = Math.max(4, Math.round(
    10
    + packaging.brand * 3
    + state.aidCases.brandScore / 10
    + state.aidOps.sortingQuality / 12
    - state.aidOps.lastParcelLoss / 3
    + (state.quests.halfDayTrail ? 4 : 0)
  ));
  state.aidOps.liveFeedback = Math.min(100, state.aidOps.liveFeedback + score);
  if (score >= 18) state.aidOps.repeatCustomers += 1;
  const earned = 18 + score + state.aidOps.repeatCustomers * 3;
  state.money += earned;
  say(`直播间复盘：包装“${packaging.name}”、最近损耗 ${state.aidOps.lastParcelLoss}%。“好评热度” +${score}，复购 ${state.aidOps.repeatCustomers}，带来 ${earned} 金预售。`);
}

function handleVisitorCenter() {
  if (!state.quests.halfDayTrail) {
    say("游客服务中心还在筹备。先去后山调研 3 个资源点，再到景区规划牌开放半日徒步线。");
    return;
  }
  if (state.facilities.lastVisitorServiceDay === state.totalDay) {
    say("游客服务中心：今天已经接待过一批游客了。明天可以再安排导览。");
    return;
  }
  const transitBonus = infrastructureHas("highSpeedShuttle") ? 28 : 0;
  const festivalBonus = festivalVisitorBonus();
  const reputationBonus = Math.floor(state.tourismOps.reputation / 4);
  const operationBonus = state.tourismOps.studyRoutes * 8 + state.tourismOps.homestayPackages * 12;
  const petWelcomeBonus = Math.min(20, state.petLife.homestayPhotos * 5 + petFollowCount() * 3);
  const earned = 34 + state.tourism.routes * 18 + Math.floor(state.tourism.appeal / 5) + tourismFacilityVisitorBonus() + transitBonus + festivalBonus + reputationBonus + operationBonus + petWelcomeBonus;
  state.facilities.lastVisitorServiceDay = state.totalDay;
  state.facilities.visitorsServed += 1;
  state.tourism.serviceAppeal += 3;
  const reviewGain = 4 + state.tourismOps.studyRoutes * 2 + state.tourismOps.homestayPackages * 2 + (state.tourism.ecoPressure <= 3 ? 3 : -1);
  state.tourismOps.reputation = Math.min(100, state.tourismOps.reputation + Math.max(2, reviewGain));
  state.tourismOps.reviews += 1;
  state.tourismOps.lastReviewDay = state.totalDay;
  if (state.facilities.visitorsServed === 1) grantMaterials({ alloyParts: 1 });
  state.money += earned;
  updateTourismProgress();
  const materialText = state.facilities.visitorsServed === 1 ? "，获得合金组件 +1" : "";
  say(`游客服务中心接待了一批游客，安排导览、休息点和民宿咨询，配套加成 ${tourismFacilityVisitorBonus()} 金，高铁接驳加成 ${transitBonus} 金，节日加成 ${festivalBonus} 金，口碑加成 ${reputationBonus + operationBonus} 金，宠物欢迎加成 ${petWelcomeBonus} 金，获得 ${earned} 金${materialText}。游客口碑 +${Math.max(2, reviewGain)}，${tourismEcoStatusText()}。`);
}

function baseNpcPlacement(id) {
  const phase = currentPhase().id;
  if (id === "lin") {
    if (["dawn", "morning"].includes(phase)) return { x: 11, y: 8, place: "公告栏旁" };
    if (["afternoon", "dusk"].includes(phase)) return { x: 10, y: 13, place: "集市筹备点" };
    return { x: 11, y: 9, place: "村口路边" };
  }
  if (id === "doctor") {
    if (phase === "noon") return { x: 18, y: 10, place: "喷泉休息区" };
    if (["dusk", "night"].includes(phase)) return { x: 18, y: 8, place: "卫生站门口" };
    return { x: 18, y: 8, place: "安心菜篮点" };
  }
  if (id === "tea") {
    if (["dawn", "morning"].includes(phase)) return { x: 18, y: 16, place: "茶铺门口" };
    if (["afternoon", "dusk"].includes(phase)) return { x: 17, y: 15, place: "试吃摊旁" };
    return { x: 18, y: 16, place: "夜茶摊" };
  }
  if (id === "courier") {
    if (state.quests.liveStream) return { x: 12, y: 15, place: "直播发货台" };
    return { x: 5, y: 15, place: "快递驿站外" };
  }
  if (id === "artisan") {
    if (state.quests.halfDayTrail) return { x: 10, y: 15, place: "游客手作摊" };
    return { x: 7, y: 13, place: "手作摊位" };
  }
  if (id === "tourist") {
    if (["dusk", "night"].includes(phase)) return { x: 18, y: 10, place: "民宿咨询点" };
    return { x: 18, y: 9, place: "游客服务牌" };
  }
  return { x: 10, y: 10, place: "村口" };
}

function scheduledVillageNpcs() {
  const ids = ["lin", "doctor", "tea"];
  if (state.quests.packagedProduce || state.quests.courierStation || state.quests.liveStream) ids.push("courier");
  if (state.quests.helpedVillage) ids.push("artisan");
  if (state.quests.halfDayTrail) ids.push("tourist");

  const festival = currentFestival();
  return ids.map((id) => {
    const definition = villageNpcDefinitions[id];
    const placement = (festivalNpcPlacements[festival?.id] && festivalNpcPlacements[festival.id][id])
      || baseNpcPlacement(id);
    return {
      id,
      kind: "villageNpc",
      w: 1,
      h: 1,
      ...definition,
      ...placement
    };
  });
}

function villageNpcScheduleText() {
  return scheduledVillageNpcs()
    .map((npc) => `${npc.name}在${npc.place}`)
    .join("；");
}

function termOrderHintText() {
  const order = currentTermOrder();
  if (!order) return "今天没有新的节气订单。";
  if (isCurrentTermOrderDone()) return `${currentSolarTerm()}的“${order.title}”已经完成，等下个节气会刷新。`;
  return `${order.title}还缺 ${orderProgressText(order)}。${order.description}`;
}

function festivalNpcDialogue(npc, festival) {
  if (!festival) return "";
  if (npc.id === "lin") return `${festival.name}要有热闹，也要有秩序。今天先把“${festival.task}”组织顺。`;
  if (npc.id === "doctor") return `${festival.name}人多，老人、小孩和游客的安全点要提前摆出来。`;
  if (npc.id === "tea") return `${festival.name}不能只卖原料，要把节令点心、茶饮和伴手礼一起做。`;
  if (npc.id === "courier") return `${festival.name}订单会集中爆发，包装规格和发货批次要提前排好。`;
  if (npc.id === "artisan") return `${festival.name}正适合做手作体验，游客愿意带走有村里记忆的东西。`;
  if (npc.id === "tourist") return `${festival.name}氛围很好，要是路线、厕所和休息点更清楚，我会愿意住一晚。`;
  return `${festival.name}活动正在进行。`;
}

function normalNpcDialogue(npc) {
  const term = currentSolarTerm();
  const profile = currentTermProfile();
  const weather = currentWeather();
  const orderHint = termOrderHintText();
  if (state.charter.longTermMode) {
    if (npc.id === "lin") return `发展公约定下来了，下一年不是重来，而是在这个基础上继续把畜牧、手工和民宿做扎实。`;
    if (npc.id === "doctor") return `长期经营要记得公共服务，老人菜篮、夜间照明和应急点都不能因为忙旅游就松掉。`;
    if (npc.id === "tea") return `村子评级只是结果，真正留下人的是稳定的营生和让人愿意回来的生活。`;
    if (npc.id === "courier") return `冷链、接驳和合作社标准都跑顺了，后续就能做更稳定的区域订单。`;
    if (npc.id === "artisan") return `公约里给手艺和研学留了位置，手工制造业可以正式接进主线。`;
    if (npc.id === "tourist") return `这个村子不是一次性景点，有节气、有产业、有生活，我会想下个季节再来。`;
  }
  if (infrastructureComplete()) {
    if (npc.id === "lin") return `基础设施已经补齐了，现在要开年终大会，把收益分配、生态边界和公共服务写进公约。`;
    if (npc.id === "doctor") return `年终总结别只看收入，老人照护和公共卫生也要算进村庄评级。`;
    if (npc.id === "tea") return `公约要写清楚：节气活动、伴手礼和民宿能赚钱，但不能把村里的生活节奏挤没。`;
    if (npc.id === "courier") return `这一年的包裹、损耗和复购都能拿出来复盘，稳定履约就是村级品牌的底气。`;
    if (npc.id === "artisan") return `年终大会后，手作体验就该从临时摊位变成固定课程。`;
    if (npc.id === "tourist") return `如果村里有清楚的公约和稳定服务，我会更放心住下来慢慢体验。`;
  }
  if (infrastructureProjectCount() > 0) {
    if (npc.id === "lin") return `基建不是摆设备，是让水、电、路和数据真正帮大家少重复劳动。现在能力：${infrastructureBenefitsText()}。`;
    if (npc.id === "doctor") return `水利和电力稳了，老人菜篮、夜间照明和应急服务才不会靠临时凑。`;
    if (npc.id === "tea") return `有冷链和高铁接驳，茶点、鱼鲜和伴手礼就能从“当天卖完”变成稳定预订。`;
    if (npc.id === "courier") return `冷链仓和高铁接驳能把损耗压下来，最近预估物流损耗是 ${estimateLogisticsLoss()}%。`;
    if (npc.id === "artisan") return `太阳能、电商和接驳车不是替代手艺，是让手艺课、伴手礼和研学能长期排班。`;
    if (npc.id === "tourist") return `高铁下来能直接接驳到村口，路线清楚、服务稳定，我就更愿意带家人来住。`;
  }
  if (state.quests.cooperativeFounded) {
    if (npc.id === "lin") return `合作社成立后，订单板、温室、鱼塘和快递都要按同一套标准走。现在重点是把公共规则守住。`;
    if (npc.id === "doctor") return `合作社统一接单后，安心菜篮不能断供。老人需求要排进公共服务，而不是临时帮忙。`;
    if (npc.id === "tea") return `有了合作社品牌，茶铺可以把节气茶点、花束和鱼鲜套餐放进同一张菜单。`;
    if (npc.id === "courier") return `合作社统一分级后，打包规格清楚多了。复购靠的不是热闹，是稳定。`;
    if (npc.id === "artisan") return `合作社不能只有农产品，竹编、花艺、鱼鲜和手作课都能成为村里的共同品牌。`;
    if (npc.id === "tourist") return `听说村里有合作社统一运营，我更放心参加研学和民宿套餐。`;
  }
  if (npc.id === "lin") {
    return `${term}不是只看日历，要把天气、订单和大家的活排在一起。${profile.note}`;
  }
  if (npc.id === "doctor") {
    return `今天${weather.name}。老人菜篮最怕断供，${orderHint}`;
  }
  if (npc.id === "tea") {
    return `${term}可以讲成村里的节令故事。${orderHint}`;
  }
  if (npc.id === "courier") {
    return `快递进村后，节气订单最好按规格打包，少挤压，少退货。${orderHint}`;
  }
  if (npc.id === "artisan") {
    return `农忙之外还有手作营生。节气花材、竹编和游客体验能把停留时间拉长。`;
  }
  if (npc.id === "tourist") {
    return `${term}来村里看见农事和风景连在一起，比只打卡更有意思。`;
  }
  return orderHint;
}

function talkToVillageNpc(npc) {
  const key = `${state.totalDay}-${state.phaseIndex}-${npc.id}`;
  state.npcChats[key] = true;
  const festivalLine = festivalNpcDialogue(npc, currentFestival());
  say(`${npc.name}：${festivalLine || normalNpcDialogue(npc)}`);
}

function handleFishing(location) {
  const rod = currentRodDefinition();
  const energyCost = Math.max(3, (location === "river" ? 8 : 6) - rod.energyDiscount);
  const baitId = activeBaitId();
  const bait = baitId ? baitDefinitions[baitId] : null;
  if (state.energy < energyCost) {
    say("体力不够钓鱼了，先回家休息。");
    return;
  }

  spendEnergy(energyCost);
  if (baitId) {
    state.fishing.bait[baitId] -= 1;
  }
  if (rng() > fishingCatchChance(location)) {
    say(`${bait ? `${bait.name}被吃掉了，` : ""}${location === "river" ? "河面有动静，但鱼脱钩了。" : "浮漂动了一下，可惜没有钓上来。"}`);
    return;
  }

  const fishId = chooseFish(location);
  const fish = fishTypes[fishId];
  const qualityId = chooseFishQuality(location, fishId);
  const quality = fishQualityDefinitions[qualityId];
  state.fish[fishId] += 1;
  fishQualityLedger(fishId)[qualityId] += 1;
  state.fishing.totalCatches += 1;
  if (qualityId !== "normal") state.fishing.qualityCatches += 1;
  const wasKnown = state.fishJournal[fishId];
  state.fishJournal[fishId] = true;
  const baitText = bait ? `用${bait.name}` : "";
  say(`${baitText}${location === "river" ? "在河边" : "在池塘边"}钓到了${quality.name}${fish.name}。${wasKnown ? `可卖 ${fishSellValue(fishId, qualityId)} 金，也可以放进鱼缸。` : "新的鱼种已记录到图鉴。"}`);
}

function fishingCatchChance(location) {
  let chance = location === "river" ? 0.78 : 0.84;
  const weather = currentWeather().id;
  const phase = currentPhase().id;
  const rod = currentRodDefinition();
  const bait = activeBaitDefinition();
  if (["drizzle", "rain"].includes(weather)) chance += 0.06;
  if (weather === "storm") chance -= 0.12;
  if (weather === "fog") chance -= 0.04;
  if (["dawn", "dusk"].includes(phase)) chance += 0.05;
  if (phase === "noon") chance -= 0.03;
  chance += rod.catchBonus;
  if (bait) chance += bait.catchBonus;
  return Math.max(0.45, Math.min(0.95, chance));
}

function chooseFish(location) {
  const weather = currentWeather().id;
  const phase = currentPhase().id;
  const term = currentSolarTerm();
  const coldTerm = ["立冬", "小雪", "大雪", "冬至", "小寒", "大寒"].includes(term);
  const rod = currentRodDefinition();
  const bait = activeBaitDefinition();
  const choices = [];

  for (const id of fishOrder) {
    const fish = fishTypes[id];
    if (!fish.habitats.includes(location)) continue;
    let weight = fish.baseWeight;
    if (fish.seasonalTerms) {
      weight += fish.seasonalTerms.includes(term) ? 13 : -4;
    }
    if (["drizzle", "rain"].includes(weather) && ["catfish", "loach", "carp"].includes(id)) weight += 6;
    if (weather === "sunny" && ["sweetfish", "koi"].includes(id)) weight += 4;
    if (["night", "midnight"].includes(phase) && ["catfish", "loach"].includes(id)) weight += 8;
    if (["dawn", "morning"].includes(phase) && ["crucian", "trout", "sweetfish"].includes(id)) weight += 5;
    if (location === "river" && (coldTerm || ["snow", "frost"].includes(weather)) && id === "snowtrout") weight += 10 + rod.rareBonus;
    if (location === "pond" && state.quests.helpedVillage && id === "koi") weight += 3 + rod.rareBonus;
    if (bait?.targetFish.includes(id)) weight += 8;
    if (weight > 0) choices.push({ id, weight });
  }

  const total = choices.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of choices) {
    roll -= item.weight;
    if (roll <= 0) return item.id;
  }
  return choices[0].id;
}

function chooseFishQuality(location, fishId) {
  const weather = currentWeather().id;
  const phase = currentPhase().id;
  const rod = currentRodDefinition();
  const bait = activeBaitDefinition();
  let bonus = rod.qualityBonus + (bait ? bait.qualityBonus : 0);
  if (["dawn", "dusk"].includes(phase)) bonus += 0.04;
  if (["drizzle", "rain"].includes(weather)) bonus += 0.03;
  if (location === "river" && fishTypes[fishId].sell >= 80) bonus += 0.02;
  const specimenChance = Math.min(0.12, 0.01 + bonus * 0.24);
  const goldChance = Math.min(0.28, 0.05 + bonus * 0.72);
  const silverChance = Math.min(0.52, 0.18 + bonus);
  const roll = rng();
  if (roll < specimenChance) return "specimen";
  if (roll < specimenChance + goldChance) return "gold";
  if (roll < specimenChance + goldChance + silverChance) return "silver";
  return "normal";
}

function putFishInAquarium() {
  const current = aquariumFishCount();
  if (current >= aquariumCapacity) {
    handleAquariumDecorAndRating();
    return;
  }
  const fishId = fishOrder.find((id) => state.fish[id] > 0);
  if (!fishId) {
    handleAquariumDecorAndRating();
    return;
  }
  consumeFishSpecific(fishId, 1, fishSellQualityOrder);
  state.aquarium[fishId] += 1;
  say(`把${fishTypes[fishId].name}放进鱼缸了。观赏鱼 ${aquariumFishCount()}/${aquariumCapacity}，评分 ${aquariumRatingText()}。`);
}

function handleAquariumDecorAndRating() {
  const count = aquariumFishCount();
  if (!count) {
    say("鱼缸还空着。去池塘或景区河边钓鱼后，可以把鱼放进来观赏。");
    return;
  }
  if (!state.fishing.aquariumDecor.plants && count >= 2 && state.money >= 60) {
    state.money -= 60;
    state.fishing.aquariumDecor.plants = true;
    say("给鱼缸加了水草和躲避角，花费 60 金。观赏评分提升了。");
    return;
  }
  if (!state.fishing.aquariumDecor.light && fishJournalCount() >= 5 && state.money >= 100) {
    state.money -= 100;
    state.fishing.aquariumDecor.light = true;
    say("给鱼缸装上柔光灯，花费 100 金。民宿展示照片更好看了。");
    return;
  }
  if (aquariumScore() >= 60 && !state.fishing.aquariumRewardClaimed) {
    state.fishing.aquariumRewardClaimed = true;
    state.money += 130;
    state.tourism.appeal += 6;
    say("鱼缸被游客拍成民宿亮点，获得 130 金，景区吸引力 +6。");
    return;
  }
  say(`鱼缸里游着：${fishInventoryText(state.aquarium)}。观赏评分 ${aquariumRatingText()}。`);
}

function addFishToBasket(fishId, qualityId = "normal") {
  state.fish[fishId] += 1;
  fishQualityLedger(fishId)[qualityId] += 1;
  state.fishJournal[fishId] = true;
}

function canUpgradeFishingRod() {
  const nextLevel = state.fishing.rodLevel + 1;
  const next = rodDefinitions[nextLevel];
  if (!next) return false;
  if (state.money < next.money) return false;
  if (nextLevel === 2) return fishJournalCount() >= 3;
  if (nextLevel === 3) return state.quests.halfDayTrail && fishingOrderCompletedCount() >= 1;
  return false;
}

function tryUpgradeFishingRod() {
  if (!canUpgradeFishingRod()) return false;
  const nextLevel = state.fishing.rodLevel + 1;
  const next = rodDefinitions[nextLevel];
  state.money -= next.money;
  state.fishing.rodLevel = nextLevel;
  say(`渔具架：升级为${next.name}，花费 ${next.money} 金。钓鱼更稳，也更容易出高品质鱼。`);
  return true;
}

function tryBuildFishPond() {
  if (state.fishing.fishPond) return false;
  if (fishJournalCount() < 4 || state.money < 180) return false;
  state.money -= 180;
  state.fishing.fishPond = true;
  say(`${state.quests.cooperativeFounded ? "合作社" : "池塘边"}修好了小型生态鱼塘，花费 180 金。投入鲫鱼、鲤鱼或稻花鱼后，每天会慢慢扩繁。`);
  return true;
}

function tryRunFishPond() {
  if (!state.fishing.fishPond) return false;
  if (!state.fishing.pondSpecies) {
    const species = ["ricefish", "carp", "crucian"].find((fishId) => state.fish[fishId] > 0);
    if (!species) {
      say("生态鱼塘已建好。带一条鲫鱼、鲤鱼或稻花鱼来，可以投放作亲鱼。");
      return true;
    }
    consumeFishSpecific(species, 1, fishSellQualityOrder);
    state.fishing.pondSpecies = species;
    state.fishing.pondStock = 1;
    say(`把${fishTypes[species].name}投进生态鱼塘。之后每天清晨会自然扩繁，别一次性捞空。`);
    return true;
  }
  if (state.fishing.pondStock >= 3) {
    const harvest = Math.min(3, state.fishing.pondStock - 1);
    for (let i = 0; i < harvest; i += 1) {
      addFishToBasket(state.fishing.pondSpecies, rng() < 0.22 ? "silver" : "normal");
    }
    state.fishing.pondStock -= harvest;
    state.fishing.pondHarvested += harvest;
    say(`从生态鱼塘捞起 ${harvest} 条${fishTypes[state.fishing.pondSpecies].name}，保留亲鱼继续扩繁。`);
    return true;
  }
  say(`生态鱼塘正在养殖${fishTypes[state.fishing.pondSpecies].name}，当前 ${state.fishing.pondStock} 尾。达到 3 尾后可以适量捕捞。`);
  return true;
}

function hasFishPondAction() {
  if (!state.fishing.fishPond) return false;
  if (!state.fishing.pondSpecies) {
    return ["ricefish", "carp", "crucian"].some((fishId) => state.fish[fishId] > 0);
  }
  return state.fishing.pondStock >= 3;
}

function bestBaitToBuy() {
  return ["eco", "insect", "grain"].find((baitId) => (
    baitDefinitions[baitId].unlock() && state.fishing.bait[baitId] <= 0 && state.money >= baitDefinitions[baitId].cost
  )) || "";
}

function tryBuyFishingBait() {
  const baitId = bestBaitToBuy();
  if (!baitId) return false;
  const bait = baitDefinitions[baitId];
  state.money -= bait.cost;
  state.fishing.bait[baitId] += bait.uses;
  say(`渔具架：买到${bait.name} ${bait.uses} 次，花费 ${bait.cost} 金。它会自动在下次钓鱼时使用。`);
  return true;
}

function handleFisheryBoard() {
  const order = currentFishingOrder();
  if (order && canFulfillFishingOrder(order)) {
    handleFishingOrder();
    return;
  }
  if (tryUpgradeFishingRod()) return;
  if (tryBuildFishPond()) return;
  if (hasFishPondAction() && tryRunFishPond()) return;
  if (tryBuyFishingBait()) return;
  if (state.fishing.fishPond && tryRunFishPond()) return;
  if (order) {
    handleFishingOrder();
    return;
  }
  say(`渔具架：${fishingSystemText()}。${rodUpgradeStatusText()}。鱼缸评分 ${aquariumRatingText()}。`);
}

function toolLevel() {
  return Math.max(state.toolLevel, state.quests.helpedVillage ? 2 : 1);
}

function currentToolStage() {
  return toolStageDefinitions[toolLevel()] || toolStageDefinitions[1];
}

function toolStageText() {
  const stage = currentToolStage();
  return `${stage.name}，锄头/水壶范围 ${stage.range}`;
}

function toolNameForAction(tool) {
  const stage = currentToolStage();
  if (tool === "hoe") return stage.hoeName;
  if (tool === "water") return stage.waterName;
  return tools.find((item) => item.id === tool)?.name || "工具";
}

function toolEnergyCost(tool, count) {
  const stage = currentToolStage();
  if (tool === "hoe") return Math.max(1, Math.ceil(stage.hoeCost * count));
  if (tool === "water") return Math.max(1, Math.ceil(stage.waterCost * count));
  return count;
}

function toolTargets(target, tool) {
  const level = toolLevel();
  if (!["hoe", "water"].includes(tool) || level < 2) return [target];
  if (level >= 4) return squareTargets(target, 2);
  if (level >= 3) return squareTargets(target, 1);
  const { dirX, dirY } = state.player;
  if (dirY !== 0) {
    return [
      { x: target.x - 1, y: target.y },
      target,
      { x: target.x + 1, y: target.y }
    ];
  }
  if (dirX !== 0) {
    return [
      { x: target.x, y: target.y - 1 },
      target,
      { x: target.x, y: target.y + 1 }
    ];
  }
  return [target];
}

function squareTargets(center, radius) {
  const targets = [];
  for (let y = center.y - radius; y <= center.y + radius; y += 1) {
    for (let x = center.x - radius; x <= center.x + radius; x += 1) {
      targets.push({ x, y });
    }
  }
  return targets;
}

function materialsText() {
  const parts = Object.entries(materialNames)
    .map(([id, name]) => `${name} ${state.materials[id] || 0}`);
  return parts.join("，");
}

function materialRequirementText(materials) {
  if (!Object.keys(materials).length) return "无需材料";
  return Object.entries(materials)
    .map(([id, count]) => `${materialNames[id]} ${state.materials[id] || 0}/${count}`)
    .join("，");
}

function materialRewardText(materials) {
  if (!materials) return "";
  return Object.entries(materials)
    .map(([id, count]) => `${materialNames[id]} +${count}`)
    .join("，");
}

function hasMaterials(materials) {
  return Object.entries(materials).every(([id, count]) => (state.materials[id] || 0) >= count);
}

function grantMaterials(materials) {
  if (!materials) return;
  for (const [id, count] of Object.entries(materials)) {
    state.materials[id] = (state.materials[id] || 0) + count;
  }
}

function spendMaterials(materials) {
  for (const [id, count] of Object.entries(materials)) {
    state.materials[id] -= count;
  }
}

function nextToolUpgrade() {
  return toolUpgradeDefinitions[toolLevel() + 1] || null;
}

function toolUpgradeStatusText() {
  const upgrade = nextToolUpgrade();
  if (!upgrade) return "工具已经升到当前最高阶段";
  if (upgrade.level === 2) return `${upgrade.name} ${upgrade.range}：${upgrade.unlockText}后自动解锁`;
  return `${upgrade.name} ${upgrade.range}：${upgrade.unlockText}，需要 ${upgrade.money} 金、${materialRequirementText(upgrade.materials)}`;
}

function handleToolWorkshop() {
  if (!state.quests.helpedVillage) {
    say("工具工坊：先让第一批农货卖起来，村里才会帮你升级铜制工具。");
    return;
  }
  const upgrade = nextToolUpgrade();
  if (!upgrade) {
    say(`工具工坊：${toolStageText()}，已经是当前原型最高等级。`);
    return;
  }
  if (!upgrade.isUnlocked()) {
    say(`工具工坊：想升级到${upgrade.name}，先${upgrade.unlockText}。`);
    return;
  }
  if (state.money < upgrade.money || !hasMaterials(upgrade.materials)) {
    say(`工具工坊：升级到${upgrade.name}需要 ${upgrade.money} 金、${materialRequirementText(upgrade.materials)}。`);
    return;
  }
  state.money -= upgrade.money;
  spendMaterials(upgrade.materials);
  state.toolLevel = upgrade.level;
  say(`工具工坊完成升级：${upgrade.name}已解锁，锄头和水壶范围提升到 ${upgrade.range}。`);
}

function usePollinationBrush(plot) {
  if (!plot.crop || plot.crop.type !== "flower" || !plot.crop.genes) {
    say("授粉刷要对着花作物使用。成熟花可以采集花粉或定向授粉，未成熟花可以做基因检测。");
    return;
  }

  const geneText = flowerGeneText(plot.crop.genes);
  state.flowerBreeding.geneTests += 1;
  if (!plot.crop.ready) {
    say(`基因检测：${geneText}。花还没成熟，等成熟后可以采粉。`);
    return;
  }

  const phenotype = flowerPhenotype(plot.crop.genes);
  if (!state.flowerBreeding.pollenGenes) {
    state.flowerBreeding.pollenGenes = cloneFlowerGenes(plot.crop.genes);
    state.flowerBreeding.pollenName = phenotype.name;
    say(`授粉刷采集了${phenotype.name}花粉。基因检测：${geneText}。再对另一朵成熟花使用，可定向准备下一粒花种。`);
    return;
  }

  const hybrid = createHybridFlowerGenes(state.flowerBreeding.pollenGenes, plot.crop.genes);
  mutateFlowerGenes(hybrid, state.flowerBreeding.greenhouse ? 0.06 : 0.035);
  maybeRareFlowerMutation(hybrid, state.flowerBreeding.greenhouse ? 0.08 : 0.03);
  state.flowerBreeding.preparedGenes = hybrid;
  const parentName = state.flowerBreeding.pollenName;
  state.flowerBreeding.pollenGenes = null;
  state.flowerBreeding.pollenName = "";
  say(`完成定向授粉：${parentName} x ${phenotype.name}。下一次播花种会优先长出${flowerPhenotype(hybrid).name}，基因 ${flowerGeneText(hybrid)}。`);
}

function handleGreenhouse() {
  const flowerOrder = currentFlowerOrder();
  if (flowerOrder && canFulfillFlowerOrder(flowerOrder)) {
    handleFlowerOrder();
    return;
  }

  if (!state.flowerBreeding.greenhouse) {
    const colorCount = knownFlowerColorCount();
    const cost = 160;
    if (!state.quests.helpedVillage || colorCount < 3 || state.money < cost) {
      say(`花艺温室：需要助农集市启动、花色图鉴 3/3 和 ${cost} 金。当前花色 ${colorCount}/3，金币 ${state.money}/${cost}。`);
      return;
    }
    state.money -= cost;
    state.flowerBreeding.greenhouse = true;
    state.seeds.flower += 3;
    say(`${state.quests.cooperativeFounded ? "合作社花艺温室启用" : "花艺温室启用"}：花卉抗低温能力提高，稀有突变概率提升，获得花种 +3。`);
    return;
  }

  if (flowerOrder) {
    handleFlowerOrder();
    return;
  }

  state.seeds.flower += 1;
  say(`${state.quests.cooperativeFounded ? "合作社花艺温室" : "花艺温室"}：${flowerBreedingStatusText()}。温室每天可以稳定育苗，获得花种 +1。`);
}

function useTool() {
  const tool = tools[state.selected].id;
  const target = frontTile();
  const plot = getPlot(target.x, target.y);

  if (!plot) {
    if (state.map !== "farm") say("这里不能耕作，去农场再使用工具。");
    return;
  }
  if (state.energy <= 0) {
    say("体力不足，回屋睡一觉。");
    return;
  }

  if (tool === "hoe") {
    const targets = toolTargets(target, tool);
    const validTargets = targets.filter(({ x, y }) => getPlot(x, y) && currentTerrain()[y][x] === "soil");
    if (validTargets.length === 0) {
      say("这里只能在农田里耕作。");
      return;
    }
    for (const item of validTargets) {
      getPlot(item.x, item.y).tilled = true;
    }
    const weatherWatered = applyWeatherWatering(validTargets);
    const infrastructureWatered = weatherWatered ? 0 : applyInfrastructureWatering(validTargets);
    spendEnergy(toolEnergyCost(tool, validTargets.length));
    const hoeText = validTargets.length > 1
      ? `${toolNameForAction(tool)}翻好了 ${validTargets.length} 格土。`
      : "翻好了土。";
    say(weatherWatered
      ? `${hoeText}${currentWeather().name}把新土润湿了。`
      : infrastructureWatered ? `${hoeText}村里的水利系统把新土润湿了。` : hoeText);
  }

  if (tool === "water") {
    const targets = toolTargets(target, tool);
    const validTargets = targets.filter(({ x, y }) => {
      const item = getPlot(x, y);
      return item && item.tilled;
    });
    if (validTargets.length === 0) {
      say("先用锄头翻土。");
      return;
    }
    for (const item of validTargets) {
      getPlot(item.x, item.y).watered = true;
    }
    state.quests.wateredToday += validTargets.length;
    spendEnergy(toolEnergyCost(tool, validTargets.length));
    say(validTargets.length > 1 ? `${toolNameForAction(tool)}浇好了 ${validTargets.length} 格地。` : "土地湿润了。");
  }

  if (tool === "seed") {
    if (!plot.tilled) {
      say("种子需要播在翻过的土地上。");
      return;
    }
    if (plot.crop) {
      say("这里已经有作物。");
      return;
    }
    const activeSeed = state.activeSeed;
    if (state.seeds[activeSeed] <= 0) {
      say(`${seedName(activeSeed)}不够。`);
      return;
    }
    state.seeds[activeSeed] -= 1;
    plot.crop = { type: activeSeed, age: 0, ready: false };
    if (activeSeed === "flower") {
      const parents = nearbyReadyFlowers(target.x, target.y);
      plot.crop.genes = createFlowerGenes(target.x, target.y);
      const phenotype = flowerPhenotype(plot.crop.genes);
      const pollination = parents.length >= 2 ? "附近成熟花完成了杂交授粉" : parents.length === 1 ? "附近成熟花参与了自交授粉" : "基础花种会随机长出初始花色";
      const weatherWatered = applyWeatherWatering([target]);
      const infrastructureWatered = weatherWatered ? 0 : applyInfrastructureWatering([target]);
      spendEnergy(1);
      say(`播下花种。${pollination}，这株可能开出${phenotype.name}。${weatherWatered ? `${currentWeather().name}让土地保持湿润。` : infrastructureWatered ? "水利系统让土地保持湿润。" : ""}`);
      renderPanels();
      return;
    }
    const weatherWatered = applyWeatherWatering([target]);
    const infrastructureWatered = weatherWatered ? 0 : applyInfrastructureWatering([target]);
    spendEnergy(1);
    say(`播下了${cropTypes[activeSeed].name}。${weatherWatered ? `${currentWeather().name}让土地保持湿润。` : infrastructureWatered ? "水利系统让土地保持湿润。" : ""}`);
  }

  if (tool === "brush") {
    usePollinationBrush(plot);
  }

  if (tool === "scythe") {
    if (!plot.crop || !plot.crop.ready) {
      say("还没有成熟作物可收。");
      return;
    }
    const type = plot.crop.type;
    if (type === "flower") {
      const phenotype = flowerPhenotype(plot.crop.genes);
      state.flowers[phenotype.id] += 1;
      const wasKnown = state.flowerJournal[phenotype.id];
      state.flowerJournal[phenotype.id] = true;
      state.quests.harvest += 1;
      plot.crop = null;
      plot.watered = false;
      spendEnergy(2);
      say(wasKnown ? `剪下了${phenotype.name}。` : `培育出新花色：${phenotype.name}！`);
      renderPanels();
      return;
    }
    state.crops[type] += 1;
    state.quests.harvest += 1;
    plot.crop = null;
    plot.watered = false;
    spendEnergy(2);
    say(`收获了${cropTypes[type].name}。`);
  }

  if (tool === "axe") {
    if (currentTerrain()[target.y][target.x] === "flower") {
      currentTerrain()[target.y][target.x] = "grass";
      spendEnergy(3);
      say("清理出一小片草地。");
    } else {
      say("斧头可以清理野花和杂草。");
    }
  }

  renderPanels();
}

function interact() {
  const near = nearbyStructure();
  if (!near) {
    say("附近没有可互动的东西。");
    return;
  }

  if (near.kind === "market" || near.kind === "villageMarket") {
    const crop = cropTypes[state.activeSeed];
    if (state.money < crop.seedPrice) {
      say(`金币不足，${seedName(state.activeSeed)}需要 ${crop.seedPrice} 金。`);
      return;
    }
    state.money -= crop.seedPrice;
    state.seeds[state.activeSeed] += 1;
    say(`买到 1 包${seedName(state.activeSeed)}。按 Q 切换种子。`);
  }

  if (near.kind === "bin") {
    let earned = 0;
    for (const [type, count] of Object.entries(state.crops)) {
      earned += cropTypes[type].sell * count;
      state.quests.sold += count;
      state.crops[type] = 0;
    }
    for (const [colorId, count] of Object.entries(state.flowers)) {
      earned += flowerColors[colorId].sell * count;
      state.quests.sold += count;
      state.flowers[colorId] = 0;
    }
    const fishSale = sellAllFish();
    earned += fishSale.earned;
    state.quests.sold += fishSale.sold;
    const eggSale = sellAllEggs();
    earned += eggSale.earned;
    state.quests.sold += eggSale.sold;
    const craftSale = sellAllCrafts();
    earned += craftSale.earned;
    state.quests.sold += craftSale.sold;
    if (earned === 0) {
      say("没有可出售的作物、切花、鱼、鸡蛋或手作。");
      return;
    }
    state.money += earned;
    const wasHelping = state.quests.helpedVillage;
    updateStoryProgress();
    if (!wasHelping && state.quests.helpedVillage) {
      say(`售出作物，获得 ${earned} 金。第一批农货流动起来了，村里给你升级了铜锄头和铜水壶。`);
    } else {
      say(`售出作物，获得 ${earned} 金。`);
    }
  }

  if (near.kind === "house") {
    enterHouse();
  }

  if (near.kind === "greenhouse") {
    handleGreenhouse();
  }

  if (near.kind === "chickenCoop") {
    handleChickenCoop();
  }

  if (near.kind === "pond") {
    handleFishing("pond");
  }

  if (near.kind === "fisheryBoard") {
    handleFisheryBoard();
  }

  if (near.kind === "techStation") {
    handleTechStation();
  }

  if (near.kind === "notice") {
    state.quests.readNotice = true;
    const festival = currentFestival();
    if (festival && !state.festivalLog[festival.id]) {
      claimFestivalTask(festival);
      renderPanels();
      return;
    }
    if (handleTermOrder()) {
      renderPanels();
      return;
    }
    if (state.quests.halfDayTrail) {
      say("公告栏：半日徒步线开放后，村里在招募导览、保洁和民宿体验志愿者。");
    } else if (state.quests.helpedVillage) {
      say("公告栏：助农集市有了起色，下一步要把游客路线和农产品体验串起来。");
    } else {
      say("公告栏：村里想做助农集市，需要有人帮忙恢复菜地、整理供货。");
    }
  }

  if (near.kind === "orderBoard") {
    handleCommunityOrder();
  }

  if (near.kind === "visitorCenter") {
    handleVisitorCenter();
  }

  if (near.kind === "infrastructureBoard") {
    buildNextInfrastructureProject();
  }

  if (near.kind === "charterBoard") {
    handleCharterBoard();
  }

  if (near.kind === "toolWorkshop") {
    handleToolWorkshop();
  }

  if (near.kind === "villagerHome") {
    const festival = currentFestival();
    if (near.id === "clinic") {
      state.quests.visitedClinic = true;
      if (festival && festival.id === "doubleNinth") {
        say("卫生站阿姨：重阳敬老餐要清淡、热乎，还得安排志愿者送到老人家里。");
      } else {
        say("卫生站阿姨：老人们需要新鲜蔬菜，你这个大学生回来得正好。");
      }
    } else {
      state.quests.visitedCafe = true;
      if (festival) {
        say(`茶铺老板：${festival.name}正好做节令点心和伴手礼，别只卖原料，要做出村里的招牌。`);
      } else {
        say("茶铺老板：游客来了也没啥可卖，得把咱村的农货做出招牌。");
      }
    }
  }

  if (near.kind === "villageNpc") {
    talkToVillageNpc(near);
  }

  if (near.kind === "regionalInfo") {
    handleRegionalInfo(near);
  }

  if (near.kind === "fountain") {
    state.energy = Math.min(100, state.energy + 5);
    say("喷泉边很安静，体力恢复 5。");
  }

  if (near.kind === "petAdoption") {
    if (!state.pets.cat.adopted) {
      state.pets.cat.adopted = true;
      state.pets.cat.affection = 1;
      say("你领养了一只小猫。回家看看，它会在屋里等你。");
    } else if (!state.pets.dog.adopted) {
      state.pets.dog.adopted = true;
      state.pets.dog.affection = 1;
      say("你领养了一只小狗。它会和小猫一起住在家里。");
    } else {
      say("村里的小猫小狗都已经有家了。每天回家喂食和互动可以提升亲密度。");
    }
  }

  if (near.kind === "packingTable") {
    handlePackingWorkbench();
  }

  if (near.kind === "courierDepot") {
    if (!state.quests.packagedProduce) {
      say("快递点还缺标准包装。先去集市旁完成分拣打包。");
    } else if (!state.quests.courierStation) {
      state.quests.courierStation = true;
      grantMaterials({ ironParts: 1 });
      say("快递进村了：农产品能发往县城中转仓，生鲜损耗降低。获得铁件 +1。");
    } else {
      sendCourierParcel();
    }
  }

  if (near.kind === "liveBooth") {
    if (!state.quests.courierStation) {
      say("直播前要先打通快递发货，不然卖出去也送不到。");
    } else if (!state.quests.liveStream) {
      state.quests.liveStream = true;
      grantMaterials({ alloyParts: 1 });
      say("第一次直播助农完成：不卖惨，讲品质、讲产地、讲村里的故事。获得合金组件 +1。");
    } else if (tryCompleteAidCase()) {
      renderPanels();
    } else {
      runLiveFeedback();
    }
  }

  if (near.kind === "lookout") {
    state.quests.visitedScenic = true;
    updateTourismProgress();
    const petText = petExplorationAssistText();
    say(`雪山观景台已写入手绘地图：远处的雪线和村口河谷很适合做徒步路线。${scenicRouteStatusText()}${petText}`);
  }

  if (near.kind === "riverDock") {
    const wasSurveyed = state.quests.surveyedRiver;
    state.quests.surveyedRiver = true;
    updateTourismProgress();
    if (!wasSurveyed) {
      const petText = petExplorationAssistText();
      say(`河流亲水码头已写入手绘地图：这里适合垂钓体验和夏季亲水路线。${scenicRouteStatusText()} 再按 E 可以钓鱼。${petText}`);
      return;
    }
    handleFishing("river");
  }

  if (near.kind === "homestaySite") {
    if (!state.quests.plannedHomestay) {
      state.quests.plannedHomestay = true;
      updateTourismProgress();
      const petText = petExplorationAssistText();
      say(`老宅民宿选址已写入手绘地图：这里以后可以修成民宿，把游客留下来过夜。${scenicRouteStatusText()}${petText}`);
    } else {
      handlePetHomestayPhoto();
    }
  }

  if (near.kind === "scenicSign") {
    if (state.tourism.exploredPoints >= 3 && !state.quests.halfDayTrail) {
      state.quests.halfDayTrail = true;
      state.tourism.routes = 1;
      updateTourismProgress();
      say(`规划完成：第一条半日徒步线开放了。游客会从村口走到河谷和观景台。手绘地图已标出路线，资源点 ${scenicResourceCount()}/${scenicResourceDefinitions.length}。${tourismFacilityStatusText()}。`);
    } else if (state.quests.halfDayTrail) {
      buildNextTourismFacility();
    } else {
      say(`山谷景区规划：${scenicRouteStatusText()}。`);
    }
  }

  if (near.kind === "bambooGrove") {
    state.quests.mappedBamboo = true;
    updateTourismProgress();
    const petText = petExplorationAssistText();
    say(`竹林研学点已写入手绘地图：这里适合做夏季避暑步道和竹编研学课。${scenicRouteStatusText()}${petText}`);
  }

  if (near.kind === "stoneHouse") {
    state.quests.surveyedStoneHouse = true;
    updateTourismProgress();
    const petText = petExplorationAssistText();
    say(`老石屋文化点已写入手绘地图：可以保留为村史点，也可以改成山间茶歇点。${scenicRouteStatusText()}${petText}`);
  }

  if (near.kind === "exitHouse") {
    leaveHouse();
  }

  if (near.kind === "bed") {
    sleep();
  }

  if (near.kind === "person") {
    state.quests.metLin = true;
    say("林：你读完大学回来，就从帮大家把第一批菜种出来开始吧。");
  }

  if (near.kind === "petBowl") {
    feedPets();
  }

  if (near.kind === "petBed") {
    upgradePetBed();
  }

  if (near.kind === "petToyBox") {
    handlePetToyBox();
  }

  if (near.kind === "petCat") {
    interactWithPet("cat");
  }

  if (near.kind === "petDog") {
    interactWithPet("dog");
  }

  if (near.kind === "aquarium") {
    putFishInAquarium();
  }

  if (near.kind === "stove") {
    handleFestivalCooking();
  }

  if (near.kind === "bookshelf") {
    say("书架上有一本农事笔记：浇过水的作物会在睡觉后成长。");
  }

  renderPanels();
}

function handleRegionalInfo(target) {
  if (discoverNatureResource(target.id)) return;

  const recipe = craftRecipeForStation(target.id);
  if (recipe) {
    handleCraftRecipe(recipe);
    return;
  }

  const messages = {
    sheepPen: "牧场羊圈：后续可以扩展羊、牛和牧草轮作，把畜牧从鸡舍扩展到奶、毛和有机肥。",
    forageShed: "青贮草料棚：这里适合做饲料加工、雨天储草和畜牧成本管理。",
    compostYard: "堆肥场：畜禽粪肥、秸秆和落叶可以做成有机肥，和水利系统一起提高土地恢复力。",
    bambooWorkshop: "竹编工坊：后续手工制造业会从这里开始，竹篮、竹灯和研学体验都能接到景区订单。",
    pickleHouse: "腌制坊：萝卜干、豆角酱和节气小菜可以把易损农货变成更高价值的伴手礼。",
    dryingYard: "晾晒场：晴天适合晒干货，雨天要靠烘干设备，后续可以和天气系统联动。",
    craftMarket: "手作集市：游客路线成熟后，这里可以售卖文创、花束、鱼鲜小食和农货礼盒。",
    pumpHouse: "泵房：水渠、蓄水池和自动灌溉会从这里解释，村里的水利不再只靠人挑水。",
    reservoirBasin: "小型蓄水池：雨季蓄水、旱季保供，后续可以接节气天气和抗旱任务。",
    sluiceGate: "分水闸：按田块、牧场和景区补水需求分配水量，是现代水利系统的核心节点。",
    solarPump: "光伏水泵：电力系统稳定后，抽水、路灯、冷链和无人机才能一起运转。",
    reedMarsh: "芦苇缓冲带：这里能过滤水体、给鸟类留栖息地，适合做低干扰自然课堂。",
    waterQualityPost: "水质监测点：湿地开发前要先看水质和栖息地，不能只看游客量。",
    stationHall: "县城高铁站：后续高铁接驳完成后，游客、冷链礼盒和周末两日游都会从这里进入村子。",
    stationShuttle: "接驳车位：高铁接驳点建成后，游客服务中心的接待收益会更稳定。",
    stationColdChain: "冷链月台：生鲜预冷、保温箱和快速发运会降低物流损耗。",
    souvenirKiosk: "高铁伴手礼柜：手工品、花束和农货礼盒未来可以在这里形成出村销售口。",
    snowPass: "雪山垭口：这是更高阶的后山探索区，适合做季节限定摄影、登山安全和生态保护任务。",
    weatherStation: "山地气象站：后续可以提供雪、雾、暴雨预警，让景区限流和农事安排更科学。",
    alpineLake: "高山水源地：这里适合做水源保护任务，不能只为了景观开发。",
    rescueHut: "山地救援小屋：景区开发越深入，安全、应急和游客承载就越重要。",
    terraceView: "梯田观景坡：适合做摄影点，但要把游客引到硬化观景位，不能踩进生产田。"
  };
  say(messages[target.id] || "这里是新的村域节点，后续会接入更具体的任务和经营系统。");
}

function discoverNatureResource(id) {
  const resource = scenicResourceDefinitions.find((item) => item.discover === id || item.id === id);
  if (!resource || !resource.discover) return false;
  if (state.nature.discoveries[resource.discover]) {
    say(`${resource.title}已写入手绘地图：${resource.type}。保护要点：${resource.guardrail}`);
    return true;
  }
  state.nature.discoveries[resource.discover] = true;
  state.nature.samples += 1;
  state.nature.protectionScore += 2;
  state.tourism.ecoCare += 1;
  state.tourism.serviceAppeal += 4;
  updateTourismProgress();
  const petText = petExplorationAssistText();
  say(`${resource.title}已写入手绘地图：${resource.opportunity} 保护要点：${resource.guardrail} 生态保护 +2，景区吸引力提升。${petText}`);
  return true;
}

function craftRecipeForStation(stationId) {
  return Object.values(craftRecipeDefinitions).find((recipe) => recipe.station === stationId) || null;
}

function craftInventoryText() {
  const items = Object.entries(craftItemDefinitions)
    .map(([id, definition]) => `${definition.name} ${state.crafts[id] || 0}`);
  return items.join("，");
}

function craftItemCount() {
  return itemCount(state.crafts);
}

function craftStatusText() {
  if (!state.craftOps.batches) return "未开工，到村东手作工坊试做竹编、腌菜和干货";
  const standards = state.craftOps.standards ? "已完成标准化" : `标准化 ${Math.min(state.craftOps.batches, 3)}/3`;
  return `完成 ${state.craftOps.batches} 批，库存 ${craftItemCount()} 件，${standards}`;
}

function craftRecipeProgressText(recipe) {
  const parts = recipe.requirements.map(requirementProgressText);
  parts.push(`加工费 ${state.money}/${recipe.cost} 金`);
  return parts.join("，");
}

function craftWeatherBlocked(recipe) {
  if (recipe.product !== "driedVeg") return false;
  const weather = currentWeather().id;
  return ["drizzle", "rain", "storm", "fog"].includes(weather) && !infrastructureHas("solarMicrogrid");
}

function handleCraftRecipe(recipe) {
  if (!recipe.unlock()) {
    say(recipe.lockedText);
    return;
  }
  if (craftWeatherBlocked(recipe)) {
    say(`晾晒场：今天${currentWeather().name}，不适合自然晾晒。建成太阳能微电网后，可用烘干设备稳定生产。`);
    return;
  }
  if (state.energy < 4) {
    say("手作加工需要体力，今天先休息一下。");
    return;
  }
  if (state.money < recipe.cost || !canFulfillRequirements(recipe.requirements)) {
    say(`${recipe.name}：${recipe.description} 需要 ${craftRecipeProgressText(recipe)}。`);
    return;
  }

  for (const requirement of recipe.requirements) {
    consumeRequirement(requirement);
  }
  state.money -= recipe.cost;
  state.crafts[recipe.product] += 1;
  state.craftOps.batches += 1;
  state.craftOps.made[recipe.product] += 1;
  spendEnergy(4);

  let bonusText = "";
  if (!state.craftOps.standards && state.craftOps.batches >= 3) {
    state.craftOps.standards = true;
    grantMaterials({ ironParts: 1 });
    bonusText += " 连续 3 批手作完成，工坊建立了标准流程，获得铁件 +1。";
  }

  if (recipe.product === "souvenirBox") {
    state.craftOps.touristSales += 1;
    state.tourism.serviceAppeal += 5;
    if (state.quests.halfDayTrail) state.craftOps.lessons += 1;
    updateTourismProgress();
    bonusText += " 伴手礼进入游客路线，景区吸引力提升。";
  }

  say(`完成手作：${recipe.name} +1。${craftStatusText()}。${bonusText}`);
}

function nearbyStructure() {
  const { x, y } = state.player;
  return [...currentStructures(), ...currentNpcStructures(), ...currentPetStructures()].find((item) => {
    const left = item.x - 1;
    const right = item.x + item.w;
    const top = item.y - 1;
    const bottom = item.y + item.h;
    return x >= left && x <= right && y >= top && y <= bottom;
  });
}

function currentNpcStructures() {
  if (state.map !== "village") return [];
  return scheduledVillageNpcs();
}

function currentPetStructures() {
  if (state.map !== "home") return [];
  const pets = [];
  if (state.pets.cat.adopted) pets.push({ id: "cat", x: petDefinitions.cat.homeX, y: petDefinitions.cat.homeY, w: 1, h: 1, kind: "petCat" });
  if (state.pets.dog.adopted) pets.push({ id: "dog", x: petDefinitions.dog.homeX, y: petDefinitions.dog.homeY, w: 1, h: 1, kind: "petDog" });
  return pets;
}

function buildRegionalSolids(terrain, structures, blockedTerrain = []) {
  const solids = new Set();
  for (let y = 0; y < world.height; y += 1) {
    for (let x = 0; x < world.width; x += 1) {
      if (blockedTerrain.includes(terrain[y][x])) solids.add(`${x},${y}`);
    }
  }
  for (const item of structures) {
    for (let y = item.y; y < item.y + item.h; y += 1) {
      for (let x = item.x; x < item.x + item.w; x += 1) {
        solids.add(`${x},${y}`);
      }
    }
  }
  return solids;
}

function currentTerrain() {
  if (state.map === "farm") return farmTerrain;
  if (state.map === "village") return villageTerrain;
  if (state.map === "scenic") return scenicTerrain;
  if (state.map === "pasture") return pastureTerrain;
  if (state.map === "workshop") return workshopTerrain;
  if (state.map === "waterworks") return waterworksTerrain;
  if (state.map === "wetland") return wetlandTerrain;
  if (state.map === "station") return stationTerrain;
  if (state.map === "alpine") return alpineTerrain;
  if (state.map === "terrace") return terraceTerrain;
  return homeTerrain;
}

function currentSolids() {
  if (state.map === "farm") return farmSolids;
  if (state.map === "village") return villageSolids;
  if (state.map === "scenic") return scenicSolids;
  if (state.map === "pasture") return pastureSolids;
  if (state.map === "workshop") return workshopSolids;
  if (state.map === "waterworks") return waterworksSolids;
  if (state.map === "wetland") return wetlandSolids;
  if (state.map === "station") return stationSolids;
  if (state.map === "alpine") return alpineSolids;
  if (state.map === "terrace") return terraceSolids;
  return homeSolids;
}

function currentStructures() {
  if (state.map === "farm") return farmStructures;
  if (state.map === "village") return villageStructures;
  if (state.map === "scenic") return scenicStructures;
  if (state.map === "pasture") return pastureStructures;
  if (state.map === "workshop") return workshopStructures;
  if (state.map === "waterworks") return waterworksStructures;
  if (state.map === "wetland") return wetlandStructures;
  if (state.map === "station") return stationStructures;
  if (state.map === "alpine") return alpineStructures;
  if (state.map === "terrace") return terraceStructures;
  return homeStructures;
}

function mapName() {
  if (state.map === "farm") return "农场";
  if (state.map === "village") return "村子";
  if (state.map === "scenic") return "山谷景区";
  if (state.map === "pasture") return "牧场";
  if (state.map === "workshop") return "手作工坊";
  if (state.map === "waterworks") return "河湾水利";
  if (state.map === "wetland") return "河湾湿地";
  if (state.map === "station") return "高铁站";
  if (state.map === "alpine") return "雪山步道";
  if (state.map === "terrace") return "梯田林缘";
  return "家里";
}

function regionalRouteText() {
  return "农场南到牧场；村子东到手作工坊，再东到高铁站；村子南到河湾水利，水利东到湿地；村子北到景区，景区北到雪山，景区东到梯田林缘。";
}

function enterHouse() {
  state.map = "home";
  state.player.x = 15;
  state.player.y = 17;
  state.player.dirX = 0;
  state.player.dirY = -1;
  say("进入了家。靠近林、床、书架或炉灶按 E 互动。");
  renderPanels();
}

function leaveHouse() {
  state.map = "farm";
  state.player.x = 23;
  state.player.y = 8;
  state.player.dirX = 0;
  state.player.dirY = 1;
  say("离开了家。");
  renderPanels();
}

function spendEnergy(amount) {
  state.energy = Math.max(0, state.energy - amount);
}

function updateStoryProgress() {
  state.quests.helpedVillage = state.quests.harvest >= 5 && state.quests.sold >= 3;
}

function scenicResourceKnown(resource) {
  if (resource.discover) return Boolean(state.nature.discoveries[resource.discover]);
  return Boolean(state.quests[resource.quest]);
}

function scenicResourceCount() {
  return scenicResourceDefinitions.filter(scenicResourceKnown).length;
}

function natureDiscoveryCount() {
  return Object.values(state.nature.discoveries).filter(Boolean).length;
}

function natureExplorationStatusText() {
  return `新增自然点 ${natureDiscoveryCount()}/4，生态保护 ${state.nature.protectionScore}，样本记录 ${state.nature.samples}`;
}

function nextScenicResource() {
  return scenicResourceDefinitions.find((resource) => !scenicResourceKnown(resource)) || null;
}

function scenicRouteProgressRatio() {
  if (state.quests.halfDayTrail) return 1;
  return Math.min(1, scenicResourceCount() / 3);
}

function scenicRouteStatusText() {
  if (state.quests.halfDayTrail) {
    return `半日徒步线已开放，已记录 ${scenicResourceCount()}/${scenicResourceDefinitions.length} 个资源点`;
  }
  const next = nextScenicResource();
  const nextText = next ? `下一处建议调查：${next.title}` : "资源点已基本记录";
  return `开放半日线需要 3 个调研点，当前 ${scenicResourceCount()}/3。${nextText}`;
}

function scenicMapMarkup() {
  const markers = scenicResourceDefinitions.map((resource) => `
    <span
      class="scenic-marker ${scenicResourceKnown(resource) ? "known" : ""}"
      style="left: ${resource.mapX}%; top: ${resource.mapY}%"
      title="${resource.title}"
      aria-label="${resource.title}">
      ${scenicResourceKnown(resource) ? resource.marker : "?"}
    </span>
  `).join("");
  return `
    <div class="scenic-map" aria-label="后山手绘地图">
      <span class="map-label mountain">雪山</span>
      <span class="map-label river">河谷</span>
      <span class="map-label village">村口</span>
      <span class="map-label" style="left: 58%; top: 82%">湿地</span>
      <span class="map-label" style="left: 43%; top: 73%">梯田</span>
      ${state.quests.halfDayTrail ? '<span class="scenic-route-line" aria-hidden="true"></span>' : ""}
      ${markers}
    </div>
  `;
}

function scenicResourceJournalMarkup() {
  return `
    <div class="scenic-journal">
      ${scenicResourceDefinitions.map((resource) => `
        <section class="scenic-resource ${scenicResourceKnown(resource) ? "known" : ""}">
          <h3>${scenicResourceKnown(resource) ? resource.title : `未记录资源点：${resource.marker}`}</h3>
          <p>${scenicResourceKnown(resource) ? `${resource.type}：${resource.opportunity}` : "到后山靠近对应地点按 E 调研后，会写入资源点图鉴。"}</p>
          <small>${scenicResourceKnown(resource) ? `保护要点：${resource.guardrail}` : "未调研"}</small>
        </section>
      `).join("")}
    </div>
  `;
}

function builtTourismFacilities() {
  return tourismFacilityDefinitions.filter((facility) => state.tourism.facilities[facility.id]);
}

function tourismFacilityCount() {
  return builtTourismFacilities().length;
}

function nextTourismFacility() {
  return tourismFacilityDefinitions.find((facility) => !state.tourism.facilities[facility.id]) || null;
}

function tourismFacilityVisitorBonus() {
  return builtTourismFacilities().reduce((sum, facility) => sum + facility.visitorBonus, 0);
}

function tourismFacilityProgressRatio() {
  return tourismFacilityCount() / tourismFacilityDefinitions.length;
}

function tourismFacilityRequirementText(facility) {
  const parts = [`${facility.cost} 金`];
  const materialText = materialRequirementText(facility.materials);
  if (materialText !== "无") parts.push(materialText);
  return parts.join("、");
}

function tourismFacilityStatusText() {
  if (!state.quests.halfDayTrail) return "先开放半日徒步线";
  const next = nextTourismFacility();
  if (!next) return `配套已完成 ${tourismFacilityCount()}/${tourismFacilityDefinitions.length}，${tourismOperationStatusText()}`;
  return `下一项：${next.name}，需要 ${tourismFacilityRequirementText(next)}`;
}

function tourismEcoStatusText() {
  if (state.tourism.ecoPressure >= 8) return "偏高，需要先补生态厕所、垃圾分类或限流";
  if (state.tourism.ecoPressure >= 4) return "可控，但游客继续增加前要补配套";
  return "健康，当前路线承载力较稳定";
}

function tourismFacilityMarkup() {
  return `
    <div class="tourism-facility-grid">
      ${tourismFacilityDefinitions.map((facility) => `
        <section class="tourism-facility ${state.tourism.facilities[facility.id] ? "built" : ""}">
          <h3>${facility.name}</h3>
          <p>${state.tourism.facilities[facility.id] ? facility.description : `待建设：${tourismFacilityRequirementText(facility)}`}</p>
          <small>吸引力 +${facility.appeal}，生态维护 +${facility.ecoCare}，接待收益 +${facility.visitorBonus}</small>
        </section>
      `).join("")}
    </div>
  `;
}

function tourismOperationStatusText() {
  if (!state.quests.halfDayTrail) return "先开放半日徒步线";
  return `限流${state.tourismOps.limitPolicy ? "已启用" : "未启用"}，研学线 ${state.tourismOps.studyRoutes}/2，民宿套餐 ${state.tourismOps.homestayPackages}/2，口碑 ${state.tourismOps.reputation}`;
}

function tourismOperationProgressRatio() {
  return [
    state.tourismOps.limitPolicy,
    state.tourismOps.studyRoutes >= 1,
    state.tourismOps.homestayPackages >= 1,
    state.tourismOps.reputation >= 30
  ].filter(Boolean).length / 4;
}

function tourismDailyCapacity() {
  let capacity = 1 + tourismFacilityCount();
  if (infrastructureHas("highSpeedShuttle")) capacity += 1;
  if (state.tourismOps.limitPolicy) capacity = Math.max(1, capacity - 1);
  return capacity;
}

function tourismReputationName() {
  if (state.tourismOps.reputation >= 80) return "县域热门路线";
  if (state.tourismOps.reputation >= 50) return "口碑稳定";
  if (state.tourismOps.reputation >= 20) return "开始出圈";
  return "尚待积累";
}

function handleTourismOperation() {
  if (!state.quests.halfDayTrail) {
    say("景区经营：先开放半日徒步线。");
    return;
  }
  if (!state.tourismOps.limitPolicy && (state.tourism.ecoPressure >= 3 || state.facilities.visitorsServed >= 1)) {
    state.tourismOps.limitPolicy = true;
    state.tourism.ecoCare += 2;
    state.tourismOps.reputation += 6;
    updateTourismProgress();
    say("景区经营：启用预约限流和分时入山。游客少排队，村民生活边界更清楚，生态维护 +2，口碑 +6。");
    return;
  }
  if (state.tourismOps.studyRoutes < 2) {
    if (!state.quests.mappedBamboo || !state.quests.surveyedStoneHouse) {
      say("研学路线：需要先记录竹林研学点和老石屋文化点，路线才有内容。");
      return;
    }
    const cost = state.tourismOps.studyRoutes === 0 ? 70 : 110;
    if (state.money < cost) {
      say(`研学路线：设计课程牌、讲解词和安全点需要 ${cost} 金。`);
      return;
    }
    state.money -= cost;
    state.tourismOps.studyRoutes += 1;
    state.tourism.serviceAppeal += 7;
    state.tourismOps.reputation += 10;
    if (state.tourismOps.studyRoutes === 1) grantMaterials({ ironParts: 1 });
    updateTourismProgress();
    say(`研学路线第 ${state.tourismOps.studyRoutes} 版上线：竹编、村史和生态观察串成课程。口碑 +10${state.tourismOps.studyRoutes === 1 ? "，获得铁件 +1" : ""}。`);
    return;
  }
  if (state.tourismOps.homestayPackages < 2) {
    if (!state.quests.plannedHomestay) {
      say("民宿套餐：先去后山记录老宅民宿选址。");
      return;
    }
    const packageSize = 2;
    if (mixedSellableCount() < packageSize) {
      say(`民宿套餐：需要 ${packageSize} 件作物、切花、鱼、鸡蛋或手作来组合欢迎篮和晚餐菜单。`);
      return;
    }
    consumeMixedSellables(packageSize);
    state.tourismOps.homestayPackages += 1;
    state.tourism.serviceAppeal += 8;
    state.tourismOps.reputation += 12;
    state.money += 52 + state.tourismOps.homestayPackages * 18;
    updateTourismProgress();
    say(`民宿套餐第 ${state.tourismOps.homestayPackages} 版上线：欢迎篮、晚餐菜单和夜间安静线都安排好了，口碑 +12。`);
    return;
  }
  if (state.facilities.visitorsServed <= 0) {
    say("游客口碑：先到村里游客服务中心接待一批游客，再回来复盘评价。");
    return;
  }
  const reviewGain = 8
    + state.tourismOps.studyRoutes * 3
    + state.tourismOps.homestayPackages * 4
    + (state.tourism.ecoPressure <= 3 ? 5 : -2);
  state.tourismOps.reviews += 1;
  state.tourismOps.reputation = Math.min(100, state.tourismOps.reputation + Math.max(4, reviewGain));
  state.money += 24 + state.tourismOps.reputation;
  updateTourismProgress();
  say(`游客口碑复盘：评价提到路线清楚、研学有内容、民宿能留下人。口碑 +${Math.max(4, reviewGain)}，当前${tourismReputationName()} ${state.tourismOps.reputation}/100。`);
}

function buildNextTourismFacility() {
  if (!state.quests.halfDayTrail) {
    say("景区规划牌：先调研 3 个资源点，开放第一条半日徒步线。");
    return;
  }
  const facility = nextTourismFacility();
  if (!facility) {
    handleTourismOperation();
    return;
  }
  if (state.money < facility.cost || !hasMaterials(facility.materials)) {
    say(`景区规划牌：建设${facility.name}需要 ${tourismFacilityRequirementText(facility)}。${facility.description}`);
    return;
  }
  state.money -= facility.cost;
  spendMaterials(facility.materials);
  state.tourism.facilities[facility.id] = true;
  state.tourism.serviceAppeal += facility.appeal;
  state.tourism.ecoCare += facility.ecoCare;
  updateTourismProgress();
  say(`建成${facility.name}：${facility.description} 景区吸引力 +${facility.appeal}，生态维护 +${facility.ecoCare}。`);
}

function updateTourismProgress() {
  const explored = [
    state.quests.visitedScenic,
    state.quests.surveyedRiver,
    state.quests.plannedHomestay,
    state.quests.mappedBamboo,
    state.quests.surveyedStoneHouse
  ].filter(Boolean).length;
  state.tourism.exploredPoints = explored;
  state.tourism.appeal = explored * 6
    + state.tourism.routes * 18
    + state.tourism.serviceAppeal
    + state.tourism.petAssist
    + state.tourismOps.studyRoutes * 8
    + state.tourismOps.homestayPackages * 10
    + Math.floor(state.tourismOps.reputation / 5)
    + natureDiscoveryCount() * 5;
  const visitorLoad = Math.floor((state.facilities.visitorsServed + totalFestivalVisitors()) / 2)
    + Math.max(0, state.facilities.visitorsServed + totalFestivalVisitors() - tourismFacilityCount() * 2);
  state.tourism.ecoPressure = Math.max(0, state.tourism.routes * 4 + visitorLoad - explored - state.tourism.ecoCare - state.nature.protectionScore - (state.tourismOps.limitPolicy ? 2 : 0));
}

function infrastructureHas(id) {
  return Boolean(state.infrastructure.projects[id]);
}

function infrastructureProjectCount() {
  return infrastructureProjectDefinitions.filter((project) => infrastructureHas(project.id)).length;
}

function nextInfrastructureProject() {
  return infrastructureProjectDefinitions.find((project) => !infrastructureHas(project.id)) || null;
}

function canStartInfrastructure() {
  return state.quests.halfDayTrail
    && tourismFacilityCount() >= 3
    && state.tourism.ecoPressure <= 5;
}

function infrastructureReadinessText() {
  return [
    `半日徒步线 ${state.quests.halfDayTrail ? "已开放" : "未开放"}`,
    `旅游基础服务 ${Math.min(tourismFacilityCount(), 3)}/3`,
    `生态压力 ${state.tourism.ecoPressure}/5`
  ].join("，");
}

function infrastructureRequirementText(project) {
  const parts = [`${project.cost} 金`];
  const materialText = materialRequirementText(project.materials);
  if (materialText !== "无") parts.push(materialText);
  return parts.join("、");
}

function infrastructureProgressRatio() {
  return infrastructureProjectCount() / infrastructureProjectDefinitions.length;
}

function updateInfrastructureMetrics() {
  const totals = { water: 0, power: 0, logistics: 0, tech: 0 };
  for (const project of infrastructureProjectDefinitions) {
    if (!infrastructureHas(project.id)) continue;
    totals.water += project.water || 0;
    totals.power += project.power || 0;
    totals.logistics += project.logistics || 0;
    totals.tech += project.tech || 0;
  }
  state.infrastructure.water = totals.water;
  state.infrastructure.power = totals.power;
  state.infrastructure.logistics = totals.logistics;
  state.infrastructure.tech = totals.tech;
}

function infrastructureStatusText() {
  updateInfrastructureMetrics();
  if (!canStartInfrastructure()) {
    return `先稳定农文旅，再启动基建：${infrastructureReadinessText()}`;
  }
  const next = nextInfrastructureProject();
  if (!next) {
    return `现代基础设施已成型：水利 ${state.infrastructure.water}，电力 ${state.infrastructure.power}，物流 ${state.infrastructure.logistics}，科技 ${state.infrastructure.tech}`;
  }
  return `下一项：${next.name}，需要 ${infrastructureRequirementText(next)}`;
}

function infrastructureBenefitsText() {
  updateInfrastructureMetrics();
  if (infrastructureProjectCount() === 0) return "尚未启动";
  return `水利 ${state.infrastructure.water}，电力 ${state.infrastructure.power}，物流 ${state.infrastructure.logistics}，科技 ${state.infrastructure.tech}`;
}

function infrastructureProjectMarkup() {
  return `
    <div class="tourism-facility-grid">
      ${infrastructureProjectDefinitions.map((project) => `
        <section class="tourism-facility ${infrastructureHas(project.id) ? "built" : ""}">
          <h3>${project.name}</h3>
          <p>${infrastructureHas(project.id) ? project.description : `待建设：${infrastructureRequirementText(project)}`}</p>
          <small>水利 +${project.water}，电力 +${project.power}，物流 +${project.logistics}，科技 +${project.tech}</small>
        </section>
      `).join("")}
    </div>
  `;
}

function buildNextInfrastructureProject() {
  updateTourismProgress();
  if (!canStartInfrastructure()) {
    say(`村级基建板：现在还不能大规模开工。${infrastructureStatusText()}。`);
    return;
  }
  const project = nextInfrastructureProject();
  if (!project) {
    say(`村级基建板：第七章基础设施已经打通。${infrastructureStatusText()}，下一步可以准备年度总结和村庄发展公约。`);
    return;
  }
  if (state.money < project.cost || !hasMaterials(project.materials)) {
    say(`村级基建板：建设${project.name}需要 ${infrastructureRequirementText(project)}。${project.description}`);
    return;
  }
  state.money -= project.cost;
  spendMaterials(project.materials);
  state.infrastructure.projects[project.id] = true;
  state.tourism.serviceAppeal += project.tourismAppeal || 0;
  updateInfrastructureMetrics();
  updateTourismProgress();
  state.aidOps.logisticsLoss = estimateLogisticsLoss();
  const materialReward = project.id === "droneSensors" ? "合作社回收一批维护件，铁件 +1。" : "";
  if (project.id === "droneSensors") {
    grantMaterials({ ironParts: 1 });
    state.techOps.sensorReport = "设备已接入，回农场左下角停机坪读取第一组墒情和病虫害数据";
  }
  say(`建成${project.name}：${project.description} ${infrastructureBenefitsText()}。${materialReward}`);
}

function techAgricultureUnlocked() {
  return infrastructureHas("droneSensors");
}

function farmPlotStats() {
  const stats = { tilled: 0, watered: 0, dry: 0, crops: 0, ready: 0, fertilized: 0 };
  for (const plot of state.tiles) {
    if (plot.tilled) {
      stats.tilled += 1;
      if (plot.watered) stats.watered += 1;
      else stats.dry += 1;
    }
    if (plot.crop) {
      stats.crops += 1;
      if (plot.crop.ready) stats.ready += 1;
    }
    if (plot.fertilized) stats.fertilized += 1;
  }
  return stats;
}

function calculatePestRisk(stats = farmPlotStats()) {
  const weather = currentWeather().id;
  const term = currentSolarTerm();
  let risk = 12 + Math.min(28, stats.crops * 3) + Math.min(18, stats.dry * 2);
  if (["drizzle", "rain", "fog"].includes(weather)) risk += 10;
  if (weather === "storm") risk += 16;
  if (["惊蛰", "谷雨", "小满", "芒种", "小暑", "大暑"].includes(term)) risk += 12;
  if (stats.fertilized) risk -= Math.min(8, stats.fertilized * 2);
  if (state.techOps.lastDroneDay === state.totalDay) risk -= 24;
  if (state.techOps.breedingTrials > 0) risk -= Math.min(14, state.techOps.breedingTrials * 4);
  return Math.max(0, Math.min(95, risk));
}

function techRiskLevelText(risk = state.techOps.pestRisk) {
  if (risk >= 70) return "高风险";
  if (risk >= 45) return "中风险";
  if (risk >= 20) return "低风险";
  return "稳定";
}

function techAgricultureStatusText() {
  if (!techAgricultureUnlocked()) return "未接入，先完成第七章无人机与土壤传感器基建";
  const stats = farmPlotStats();
  const scan = state.techOps.lastScanDay === state.totalDay ? "今日已读数" : "今日未读数";
  const drone = state.techOps.lastDroneDay === state.totalDay ? "无人机已巡田" : "无人机待巡田";
  return `${scan}，${drone}，墒情 ${stats.watered}/${Math.max(1, stats.tilled)}，病虫害${techRiskLevelText()} ${state.techOps.pestRisk}/95`;
}

function runSensorScan() {
  const stats = farmPlotStats();
  const risk = calculatePestRisk(stats);
  state.techOps.sensorScans += 1;
  state.techOps.lastScanDay = state.totalDay;
  state.techOps.pestRisk = risk;
  state.techOps.sensorReport = `墒情 ${stats.watered}/${Math.max(1, stats.tilled)}，作物 ${stats.crops} 株，成熟 ${stats.ready} 株，病虫害${techRiskLevelText(risk)} ${risk}/95`;
  if (risk >= 45) state.techOps.pestWarnings += 1;
  say(`传感器读数完成：${state.techOps.sensorReport}。${risk >= 45 ? "建议立刻放飞无人机做巡田和生物防控。" : "当前风险可控，可以按需安排无人机精细浇灌。"}`);
}

function droneWaterDryPlots(limit) {
  let watered = 0;
  for (const plot of state.tiles) {
    if (watered >= limit) break;
    if (plot.tilled && !plot.watered) {
      plot.watered = true;
      watered += 1;
    }
  }
  state.quests.wateredToday += watered;
  state.techOps.precisionWatered += watered;
  return watered;
}

function launchDroneOperation() {
  const stats = farmPlotStats();
  if (stats.tilled === 0) {
    say("无人机停机坪：还没有可巡的农田。先翻几块地、播种或种花。");
    return;
  }
  if (state.energy < 4) {
    say("无人机巡田需要你留在地头确认航线，至少需要 4 点体力。");
    return;
  }
  const riskBefore = state.techOps.lastScanDay === state.totalDay ? state.techOps.pestRisk : calculatePestRisk(stats);
  const watered = droneWaterDryPlots(18 + state.infrastructure.tech * 2);
  state.techOps.droneFlights += 1;
  state.techOps.lastDroneDay = state.totalDay;
  if (riskBefore >= 45) state.techOps.pestPrevented += 1;
  state.techOps.pestRisk = calculatePestRisk(farmPlotStats());
  spendEnergy(4);
  say(`无人机完成巡田：精准补水 ${watered} 格，${riskBefore >= 45 ? "已按预警完成生物防控，" : "同步拍摄长势图，"}当前病虫害${techRiskLevelText()} ${state.techOps.pestRisk}/95。`);
}

function runBioBreedingTrial() {
  if (!state.flowerBreeding.greenhouse && !state.quests.cooperativeFounded) {
    say("育种记录台：需要合作社或花艺温室支撑样本登记。先推进合作社或修复花艺温室。");
    return;
  }
  if (state.money < 45) {
    say("育种记录台：做一次抗逆样本筛选需要 45 金，用于试剂、标记牌和留样。");
    return;
  }
  state.money -= 45;
  state.techOps.breedingTrials += 1;
  state.techOps.resilientSeeds += 2;
  state.seeds.bean += 1;
  state.seeds.flower += 1;
  if (state.techOps.breedingTrials % 2 === 0) state.seeds.turnip += 1;
  say(`完成第 ${state.techOps.breedingTrials} 次抗逆育种筛选：获得青豆种子 +1、花种 +1。后续作物在不适节气和霜雪天气下长势更稳。`);
}

function handleTechStation() {
  if (!techAgricultureUnlocked()) {
    say("无人机停机坪还没启用。先在村级基建板完成“无人机与土壤传感器”。");
    return;
  }
  if (state.techOps.lastScanDay !== state.totalDay) {
    runSensorScan();
    return;
  }
  if (state.techOps.lastDroneDay !== state.totalDay) {
    launchDroneOperation();
    return;
  }
  runBioBreedingTrial();
}

function livestockStatusText() {
  if (!state.livestock.coopBuilt) return "鸡舍未建，完成助农集市后可在农场左下角建设";
  return `鸡 ${state.livestock.chickens}/4，饲料 ${state.livestock.feed}，鸡蛋 ${state.livestock.eggs}，粪肥 ${state.livestock.manure}，${state.livestock.fedToday ? "今日已喂" : "今日未喂"}`;
}

function handleChickenCoop() {
  if (!state.livestock.coopBuilt) {
    const cost = 140;
    const materials = { ironParts: 1 };
    if (!state.quests.helpedVillage || state.money < cost || !hasMaterials(materials)) {
      say(`鸡舍：需要助农集市启动、${cost} 金和 ${materialRequirementText(materials)}。建好后会送来第一只鸡。`);
      return;
    }
    state.money -= cost;
    spendMaterials(materials);
    state.livestock.coopBuilt = true;
    state.livestock.chickens = 1;
    state.livestock.feed = 3;
    say("鸡舍建好了：村里送来第一只鸡和 3 份饲料。每天喂食，第二天清晨会产蛋并留下粪肥。");
    return;
  }

  if (handlePetLivestockAssist()) return;

  if (state.livestock.chickens < 4 && state.money >= 90 && state.quests.cooperativeFounded) {
    state.money -= 90;
    state.livestock.chickens += 1;
    state.livestock.feed += 1;
    say(`合作社补进一只小鸡。鸡 ${state.livestock.chickens}/4，附带饲料 +1。`);
    return;
  }

  if (!state.livestock.fedToday) {
    const needed = state.livestock.chickens;
    if (state.livestock.feed < needed) {
      const packCost = 36;
      if (state.money < packCost) {
        say(`鸡舍：饲料不足，需要 ${needed} 份。买一包饲料要 ${packCost} 金。`);
        return;
      }
      state.money -= packCost;
      state.livestock.feed += 4;
      say(`买到 4 份鸡饲料。当前饲料 ${state.livestock.feed}。再按 E 可以喂鸡。`);
      return;
    }
    state.livestock.feed -= needed;
    state.livestock.fedToday = true;
    say(`喂好了 ${needed} 只鸡。明天清晨会产蛋，也会留下可还田的粪肥。`);
    return;
  }

  if (state.livestock.manure > 0) {
    const fertilized = applyManureToFields();
    if (fertilized) {
      say(`把 ${fertilized} 份粪肥还田。施肥过的作物下次成长会更快。`);
    } else {
      say(`鸡舍：${livestockStatusText()}。先翻一些地或播种，再把粪肥还田。`);
    }
    return;
  }

  say(`鸡舍：${livestockStatusText()}。鸡蛋可出售，也可交给民宿早餐订单。`);
}

function produceLivestockDay() {
  if (!state.livestock.coopBuilt || state.livestock.chickens <= 0) return "";
  if (!state.livestock.fedToday) return "鸡昨天没吃饱，今天没有产蛋。";
  const bonusEggs = state.petLife.eggCareBonus;
  const eggs = state.livestock.chickens + bonusEggs;
  const manure = Math.max(1, Math.floor(state.livestock.chickens / 2));
  state.livestock.eggs += eggs;
  state.livestock.manure += manure;
  state.livestock.totalEggs += eggs;
  state.livestock.fedToday = false;
  state.petLife.eggCareBonus = 0;
  return `鸡舍产出 ${eggs} 枚鸡蛋和 ${manure} 份粪肥${bonusEggs ? `，宠物看护多收 ${bonusEggs} 枚蛋` : ""}。`;
}

function applyManureToFields() {
  let used = 0;
  for (const plot of state.tiles) {
    if (state.livestock.manure <= 0) break;
    if (plot.tilled && !plot.fertilized) {
      plot.fertilized = true;
      state.livestock.manure -= 1;
      state.livestock.fertilizerUsed += 1;
      used += 1;
    }
  }
  return used;
}

function infrastructureAutoWaterCapacity() {
  if (infrastructureHas("smartIrrigation")) return 14 + state.infrastructure.water * 2;
  if (infrastructureHas("reservoir")) return 6;
  if (infrastructureHas("canalRepair")) return 3;
  return 0;
}

function applyInfrastructureWatering(targets = null) {
  updateInfrastructureMetrics();
  const capacity = infrastructureAutoWaterCapacity();
  if (capacity <= 0) return 0;
  const targetPlots = targets
    ? targets.map(({ x, y }) => getPlot(x, y)).filter(Boolean)
    : state.tiles;
  let watered = 0;
  for (const plot of targetPlots) {
    if (plot.tilled && !plot.watered) {
      plot.watered = true;
      watered += 1;
      if (!targets && watered >= capacity) break;
    }
  }
  return watered;
}

function infrastructureComplete() {
  return infrastructureProjectCount() >= infrastructureProjectDefinitions.length;
}

function villageRatingBreakdown() {
  const production = Math.min(25,
    (state.quests.helpedVillage ? 8 : 0)
    + (state.quests.cooperativeFounded ? 8 : 0)
    + Math.min(9, completedCommunityOrderCount() * 3 + state.facilities.parcelsSent * 2 + aidCaseCompletedCount() * 2 + Math.floor(state.livestock.totalEggs / 3) + Math.floor(state.craftOps.batches / 2) + state.techOps.droneFlights)
  );
  const ecology = Math.max(0, Math.min(20,
    scenicResourceCount() * 2
    + tourismFacilityCount() * 2
    + Math.min(5, state.nature.protectionScore)
    + (state.tourism.ecoPressure <= 3 ? 6 : state.tourism.ecoPressure <= 5 ? 3 : 0)
  ));
  const tourism = Math.min(20,
    state.tourism.routes * 5
    + Math.floor(state.tourism.appeal / 8)
    + Math.min(5, state.facilities.visitorsServed * 2)
    + Math.min(4, state.festivalOps.homestayBookings + Math.floor(totalFestivalVisitors() / 3))
    + Math.min(4, state.tourismOps.studyRoutes + state.tourismOps.homestayPackages + Math.floor(state.tourismOps.reputation / 30))
  );
  const infrastructure = Math.min(25,
    infrastructureProjectCount() * 3
    + (infrastructureComplete() ? 4 : 0)
    + Math.min(3, state.techOps.sensorScans + state.techOps.breedingTrials)
    + Math.min(4, villageUpgradeCount())
  );
  const culture = Math.min(10,
    Object.keys(state.festivalLog).length * 2
    + Math.min(2, state.festivalOps.dishesCooked)
    + Math.min(3, knownFlowerColorCount())
    + Math.min(3, state.craftOps.batches)
    + (petFollowCount() ? 2 : 0)
    + Math.min(2, state.petLife.homestayPhotos + state.petLife.livestockAssists)
  );
  return { production, ecology, tourism, infrastructure, culture };
}

function villageRatingScore() {
  const score = villageRatingBreakdown();
  return Object.values(score).reduce((sum, value) => sum + value, 0);
}

function villageRatingName() {
  const score = villageRatingScore();
  if (score >= 85) return "A级现代乡村";
  if (score >= 70) return "B级活力乡村";
  if (score >= 55) return "C级振兴起步村";
  return "D级待提升村";
}

function charterProgressRatio() {
  return [
    infrastructureComplete(),
    state.charter.yearEndMeeting,
    state.charter.developmentCharter,
    state.charter.longTermMode
  ].filter(Boolean).length / 4;
}

function yearEndStatusText() {
  if (!infrastructureComplete()) return `先完成第七章基建项目：${infrastructureProjectCount()}/${infrastructureProjectDefinitions.length}`;
  if (!state.charter.yearEndMeeting) return `可以召开年终大会，当前预评级 ${villageRatingName()} ${villageRatingScore()}/100`;
  if (!state.charter.developmentCharter) return "年终大会已召开，下一步让村民共同通过发展公约";
  if (!state.charter.longTermMode) return "发展公约已通过，下一步开启长期经营入口";
  return `长期经营已开启，当前村庄评级 ${villageRatingName()} ${villageRatingScore()}/100`;
}

function charterMilestoneMarkup() {
  const milestones = [
    { title: "完成第七章基建", done: infrastructureComplete(), note: `${infrastructureProjectCount()}/${infrastructureProjectDefinitions.length}` },
    { title: "召开年终大会", done: state.charter.yearEndMeeting, note: villageRatingName() },
    { title: "通过发展公约", done: state.charter.developmentCharter, note: "收益、生态、公共服务" },
    { title: "开启长期经营", done: state.charter.longTermMode, note: "下一年继续建设" }
  ];
  return `
    <div class="tourism-facility-grid">
      ${milestones.map((milestone) => `
        <section class="tourism-facility ${milestone.done ? "built" : ""}">
          <h3>${milestone.title}</h3>
          <p>${milestone.done ? "已完成" : "待推进"}：${milestone.note}</p>
        </section>
      `).join("")}
    </div>
  `;
}

function handleCharterBoard() {
  if (!infrastructureComplete()) {
    say(`年终公约牌：先把第七章现代基础设施补齐。${infrastructureStatusText()}。`);
    return;
  }
  if (!state.charter.yearEndMeeting) {
    state.charter.yearEndMeeting = true;
    const score = villageRatingScore();
    const bonus = 60 + Math.floor(score / 2);
    state.money += bonus;
    say(`年终大会召开：村民一起复盘农货、电商、合作社、后山旅游和现代基建。当前评级 ${villageRatingName()} ${score}/100，获得公共基金 ${bonus} 金。`);
    return;
  }
  if (!state.charter.developmentCharter) {
    state.charter.developmentCharter = true;
    state.tourism.ecoCare += 2;
    updateTourismProgress();
    say("发展公约通过：收益反哺公共服务，景区限流保护生态，老人菜篮不断供，年轻人回来也有事做。生态维护 +2。");
    return;
  }
  if (!state.charter.longTermMode) {
    state.charter.longTermMode = true;
    state.seeds.bean += 3;
    state.seeds.flower += 3;
    grantMaterials({ alloyParts: 1 });
    say("长期经营开启：晨谷村不再只是被帮扶的村子，而是能自己运转的现代乡村。获得青豆种子 +3、花种 +3、合金组件 +1。");
    return;
  }
  say(`年终公约牌：${yearEndStatusText()}。继续按二十四节气经营，补齐畜牧、手工、民宿和节日活动。`);
}

function adoptedPetEntries() {
  return Object.entries(state.pets).filter(([, pet]) => pet.adopted);
}

function petFollowCount() {
  return adoptedPetEntries().filter(([, pet]) => pet.following).length;
}

function petComfortName() {
  return petBedLevels[state.petLife.bedLevel]?.name || petBedLevels[1].name;
}

function petComfortBonus() {
  return petBedLevels[state.petLife.bedLevel]?.comfort || 0;
}

function petAssistTotal() {
  return adoptedPetEntries().reduce((sum, [, pet]) => sum + pet.scenicFinds, 0);
}

function petFestivalOutfit(id) {
  const festival = currentFestival();
  if (!festival) return "日常项圈";
  return petFestivalOutfits[festival.id]?.[id] || "节日项圈";
}

function maybeStartFollowing(id) {
  const pet = state.pets[id];
  const definition = petDefinitions[id];
  const threshold = Math.max(2, definition.followThreshold - (state.petLife.toyOwned ? 1 : 0) - (petComfortBonus() >= 2 ? 1 : 0));
  if (pet.affection >= threshold) {
    pet.following = true;
  }
}

function petLifeStatusText() {
  const toyText = state.petLife.toyOwned ? `有玩具，今日${state.petLife.lastPlayDay === state.totalDay ? "已玩" : "未玩"}` : "未买玩具";
  return `${petComfortName()}，${toyText}，民宿合影 ${state.petLife.homestayPhotos} 次，鸡舍看护 ${state.petLife.livestockAssists} 次`;
}

function handlePetToyBox() {
  const adoptedPets = adoptedPetEntries();
  if (!adoptedPets.length) {
    say("玩具箱还用不上。先去村子杂货店旁领养小猫或小狗。");
    return;
  }
  if (!state.petLife.toyOwned) {
    const cost = 48;
    if (state.money < cost) {
      say(`宠物玩具箱：需要 ${cost} 金买逗猫棒、咬绳和小球。`);
      return;
    }
    state.money -= cost;
    state.petLife.toyOwned = true;
    for (const [id, pet] of adoptedPets) {
      pet.affection += 1;
      maybeStartFollowing(id);
    }
    say("买好了宠物玩具箱：逗猫棒、咬绳和小球放在家里。宠物亲密度 +1，跟随门槛降低。");
    return;
  }
  if (state.petLife.lastPlayDay === state.totalDay) {
    say("今天已经陪宠物玩过了。玩具箱明天还能继续用。");
    return;
  }
  state.petLife.lastPlayDay = state.totalDay;
  for (const [id, pet] of adoptedPets) {
    pet.affection += 1;
    maybeStartFollowing(id);
  }
  const tourismText = state.quests.plannedHomestay ? "，游客也会喜欢这个有生活感的家，民宿口碑 +2" : "";
  if (state.quests.plannedHomestay) state.tourismOps.reputation = Math.min(100, state.tourismOps.reputation + 2);
  say(`陪宠物玩了一会儿。${adoptedPets.map(([id]) => petDefinitions[id].name).join("、")}亲密度 +1${tourismText}。`);
}

function upgradePetBed() {
  const adoptedPets = adoptedPetEntries();
  if (!adoptedPets.length) {
    say("宠物窝空着。先领养猫狗，再升级它们的生活角。");
    return;
  }
  const nextLevel = state.petLife.bedLevel + 1;
  const upgrade = petBedLevels[nextLevel];
  if (!upgrade) {
    say(`宠物窝已经是${petComfortName()}。${petLifeStatusText()}。`);
    return;
  }
  if (state.money < upgrade.cost || !hasMaterials(upgrade.materials)) {
    say(`升级到${upgrade.name}需要 ${upgrade.cost} 金和 ${materialRequirementText(upgrade.materials)}。舒适度提高后，宠物更容易跟随，也更适合民宿合影。`);
    return;
  }
  state.money -= upgrade.cost;
  spendMaterials(upgrade.materials);
  state.petLife.bedLevel = nextLevel;
  for (const [id, pet] of adoptedPets) {
    pet.affection += 1;
    maybeStartFollowing(id);
  }
  say(`宠物窝升级为${upgrade.name}。猫狗亲密度 +1，家里的生活感更强了。`);
}

function handlePetHomestayPhoto() {
  if (!state.quests.plannedHomestay) {
    say("老宅民宿还没选址，先完成民宿调研。");
    return;
  }
  if (!petFollowCount()) {
    say("老宅民宿：带一只跟随中的宠物来，可以拍民宿生活合影，提高游客好感。");
    return;
  }
  if (state.petLife.lastPhotoDay === state.totalDay) {
    say("今天已经拍过民宿宠物合影了。明天换个时间段再拍。");
    return;
  }
  state.petLife.lastPhotoDay = state.totalDay;
  state.petLife.homestayPhotos += 1;
  const photoBonus = 18 + petFollowCount() * 8 + petComfortBonus() * 5 + (currentFestival() ? 10 : 0);
  state.money += photoBonus;
  state.tourismOps.reputation = Math.min(100, state.tourismOps.reputation + 5 + petFollowCount() * 2);
  state.tourism.serviceAppeal += 2;
  if (state.petLife.homestayPhotos % 2 === 0) state.festivalOps.homestayBookings += 1;
  updateTourismProgress();
  say(`拍了一组民宿宠物合影：院子、宠物窝和本地早餐都入镜了。获得 ${photoBonus} 金，游客口碑提升${state.petLife.homestayPhotos % 2 === 0 ? "，民宿预约 +1" : ""}。`);
}

function handlePetLivestockAssist() {
  if (!state.livestock.coopBuilt || !petFollowCount() || state.petLife.lastLivestockAssistDay === state.totalDay) return false;
  const helpers = [];
  if (state.pets.dog.following) {
    helpers.push("小狗帮忙绕鸡舍巡一圈");
    state.petLife.eggCareBonus += 1;
  }
  if (state.pets.cat.following) {
    helpers.push("小猫守着饲料桶");
    state.livestock.feed += 1;
  }
  if (!helpers.length) return false;
  state.petLife.lastLivestockAssistDay = state.totalDay;
  state.petLife.livestockAssists += 1;
  for (const [id, pet] of adoptedPetEntries().filter(([, pet]) => pet.following)) {
    pet.affection += 1;
    maybeStartFollowing(id);
  }
  say(`${helpers.join("，")}。宠物完成鸡舍看护 ${state.petLife.livestockAssists} 次${state.pets.dog.following ? "，明天可能多收 1 枚蛋" : ""}${state.pets.cat.following ? "，饲料 +1" : ""}。`);
  return true;
}

function interactWithPet(id) {
  const pet = state.pets[id];
  const definition = petDefinitions[id];
  pet.affection += 1;
  const wasFollowing = pet.following;
  maybeStartFollowing(id);
  const followText = !wasFollowing && pet.following
    ? ` ${definition.name}已经愿意跟你出门。`
    : pet.following ? ` ${definition.name}会继续跟随你出门。` : "";
  say(`你摸了摸${definition.name}。亲密度 ${pet.affection}。${followText}`);
}

function petExplorationAssistText() {
  if (state.map !== "scenic") return "";
  const parts = [];
  if (state.pets.cat.adopted && state.pets.cat.following && state.pets.cat.lastAssistDay !== state.totalDay) {
    state.pets.cat.lastAssistDay = state.totalDay;
    state.pets.cat.scenicFinds += 1;
    state.pets.cat.affection += 1;
    state.tourism.petAssist += 2;
    parts.push(petDefinitions.cat.assistText);
  }
  if (state.pets.dog.adopted && state.pets.dog.following && state.pets.dog.lastAssistDay !== state.totalDay) {
    state.pets.dog.lastAssistDay = state.totalDay;
    state.pets.dog.scenicFinds += 1;
    state.pets.dog.affection += 1;
    state.tourism.ecoCare += 1;
    parts.push(petDefinitions.dog.assistText);
  }
  if (!parts.length) return "";
  updateTourismProgress();
  return ` ${parts.join("")}`;
}

function feedPets() {
  const adoptedPets = adoptedPetEntries();
  if (!adoptedPets.length) {
    say("食盆还空着。可以先去村子杂货店旁边领养猫狗。");
    return;
  }
  const hungryPets = adoptedPets.filter(([, pet]) => !pet.fedToday);
  if (!hungryPets.length) {
    say("今天已经喂过宠物了。明天再来添食。");
    return;
  }
  for (const [id, pet] of hungryPets) {
    pet.fedToday = true;
    pet.affection += 2;
    maybeStartFollowing(id);
  }
  const followers = hungryPets.filter(([id]) => state.pets[id].following).map(([id]) => petDefinitions[id].name);
  const followText = followers.length ? `${followers.join("、")}会跟你一起出门。` : "亲密度达到 3 后，它们会愿意跟随你出门。";
  say(`喂好了 ${hungryPets.length} 只宠物。它们更亲近你了。${followText}`);
}

function villageStage() {
  if (state.charter.longTermMode) return { level: 7, name: "长期经营" };
  if (infrastructureComplete()) return { level: 6, name: "年终大会" };
  if (infrastructureProjectCount() > 0) return { level: 5, name: "现代基建" };
  if (state.quests.halfDayTrail) return { level: 4, name: "后山旅游" };
  if (state.quests.cooperativeFounded) return { level: 3, name: "合作社成立" };
  if (state.quests.helpedVillage) return { level: 2, name: "助农集市" };
  if (state.quests.metLin || state.quests.readNotice || state.quests.visitedClinic || state.quests.visitedCafe) {
    return { level: 1, name: "走访调研" };
  }
  return { level: 0, name: "返乡起步" };
}

function unlockedVillageUpgrades() {
  return villageUpgradeDefinitions.filter((upgrade) => upgrade.isUnlocked());
}

function villageUpgradeCount() {
  return unlockedVillageUpgrades().length;
}

function nextVillageUpgrade() {
  return villageUpgradeDefinitions.find((upgrade) => !upgrade.isUnlocked()) || null;
}

function villageUpgradeStatusText() {
  const next = nextVillageUpgrade();
  if (!next) return `村庄面貌已进入长期经营阶段，${villageUpgradeCount()}/${villageUpgradeDefinitions.length} 项变化完成`;
  return `已完成 ${villageUpgradeCount()}/${villageUpgradeDefinitions.length}，下一项：${next.name}`;
}

function villageUpgradeProgressRatio() {
  return villageUpgradeCount() / villageUpgradeDefinitions.length;
}

function villageUpgradeMarkup() {
  return `
    <div class="tourism-facility-grid">
      ${villageUpgradeDefinitions.map((upgrade) => `
        <section class="tourism-facility ${upgrade.isUnlocked() ? "built" : ""}">
          <h3>${upgrade.name}</h3>
          <p>${upgrade.description}</p>
          <small>${upgrade.isUnlocked() ? "已体现在村庄地图上" : "随主线推进解锁"}</small>
        </section>
      `).join("")}
    </div>
  `;
}

function petStatusText() {
  const items = [];
  if (state.pets.cat.adopted) {
    items.push(`猫 亲密度${state.pets.cat.affection}${state.pets.cat.fedToday ? " 已喂" : " 未喂"} ${state.pets.cat.following ? "跟随中" : "在家"} ${petFestivalOutfit("cat")}`);
  }
  if (state.pets.dog.adopted) {
    items.push(`狗 亲密度${state.pets.dog.affection}${state.pets.dog.fedToday ? " 已喂" : " 未喂"} ${state.pets.dog.following ? "跟随中" : "在家"} ${petFestivalOutfit("dog")}`);
  }
  return items.length ? items.join("；") : "未领养，去村子杂货店旁的领养点";
}

function petAdventureStatusText() {
  if (!adoptedPetEntries().length) return "先去村子杂货店旁领养猫或狗。";
  if (!petFollowCount()) return "喂食和抚摸把亲密度提升到 3 后，宠物会跟随出门。";
  const assists = [];
  if (state.pets.cat.following) assists.push(`小猫今日${state.pets.cat.lastAssistDay === state.totalDay ? "已" : "未"}发现拍照点`);
  if (state.pets.dog.following) assists.push(`小狗今日${state.pets.dog.lastAssistDay === state.totalDay ? "已" : "未"}探路`);
  return assists.join("；");
}

function say(message) {
  state.message = message;
  state.messageUntil = performance.now() + 3200;
  const messageNode = document.querySelector("#message");
  messageNode.textContent = message;
  messageNode.classList.remove("hidden");
}

function sleep() {
  advancePhase("bed");
}

function currentPhase() {
  return dayPhases[state.phaseIndex];
}

function nextPhaseName() {
  if (state.phaseIndex >= dayPhases.length - 1) return "清晨";
  return dayPhases[state.phaseIndex + 1].name;
}

function advancePhase(source = "manual") {
  if (state.phaseIndex < dayPhases.length - 1) {
    state.phaseIndex += 1;
    const phase = currentPhase();
    say(source === "bed" ? `休息了一会，进入${phase.name}。` : `进入${phase.name}。`);
    renderPanels();
    return;
  }
  startNewDay();
  renderPanels();
}

function startNewDay() {
  const growthProfile = currentTermProfile();
  const growthWeather = currentWeather();
  const pestText = resolveTechPestPressure();
  advanceDay();
  state.phaseIndex = 0;
  state.energy = 100;
  state.quests.wateredToday = 0;
  for (const pet of Object.values(state.pets)) {
    pet.fedToday = false;
  }
  const fishPondText = growFishPond();
  const livestockText = produceLivestockDay();
  let grownCount = 0;
  let boostedCount = 0;
  let slowedCount = 0;
  for (const plot of state.tiles) {
    if (plot.crop && plot.watered) {
      let amount = cropGrowthAmount(plot.crop.type, growthProfile, growthWeather);
      if (plot.fertilized) amount += 0.35;
      plot.crop.age += amount;
      const crop = cropTypes[plot.crop.type];
      plot.crop.ready = plot.crop.age >= crop.days;
      grownCount += 1;
      if (amount > 1.05) boostedCount += 1;
      if (amount < 0.95) slowedCount += 1;
    }
    if (plot.crop && plot.fertilized) plot.fertilized = false;
    plot.watered = false;
  }
  state.weather = generateWeatherForTerm(currentSolarTerm());
  const weatherWatered = applyWeatherWatering();
  const infrastructureWatered = weatherWatered ? 0 : applyInfrastructureWatering();
  let growthText = grownCount ? `${grownCount} 株作物在夜里成长了。` : "昨夜没有作物成长。";
  if (boostedCount) growthText += `其中 ${boostedCount} 株吃到了节气优势。`;
  if (slowedCount) growthText += `有 ${slowedCount} 株受节气或天气拖慢。`;
  if (pestText) growthText += pestText;
  if (fishPondText) growthText += fishPondText;
  if (livestockText) growthText += livestockText;
  const weatherText = weatherWatered
    ? `今日${state.weather.name}，已润湿 ${weatherWatered} 格土地。`
    : infrastructureWatered
      ? `今日天气：${state.weather.name}。水利系统已自动润湿 ${infrastructureWatered} 格土地。`
    : `今日天气：${state.weather.name}。`;
  say(`${currentSolarTerm()} 第${state.dayInTerm}日清晨。${growthText}${weatherText}`);
}

function resolveTechPestPressure() {
  if (!techAgricultureUnlocked()) return "";
  const risk = state.techOps.lastScanDay === state.totalDay ? state.techOps.pestRisk : calculatePestRisk();
  if (risk < 60) return "";
  if (state.techOps.lastDroneDay === state.totalDay) {
    state.techOps.pestPrevented += 1;
    return "昨日无人机按预警完成防控，病虫害没有扩散。";
  }
  const affected = state.tiles.find((plot) => plot.crop && !plot.crop.ready);
  if (!affected) return "昨日病虫害风险偏高，但田里没有易受影响的幼苗。";
  affected.crop.age = Math.max(0, affected.crop.age - 0.25);
  return "昨日病虫害预警没有处理，1 株作物长势被拖慢。";
}

function growFishPond() {
  if (!state.fishing.fishPond || !state.fishing.pondSpecies) return "";
  if (state.fishing.pondStock >= 6) return "生态鱼塘已经满塘，记得适量捕捞。";
  const weather = currentWeather().id;
  const growth = ["rain", "drizzle"].includes(weather) ? 2 : 1;
  const before = state.fishing.pondStock;
  state.fishing.pondStock = Math.min(6, state.fishing.pondStock + growth);
  const added = state.fishing.pondStock - before;
  return added > 0 ? `生态鱼塘新增 ${added} 尾${fishTypes[state.fishing.pondSpecies].name}。` : "";
}

function advanceDay() {
  state.totalDay += 1;
  state.dayInTerm += 1;
  if (state.dayInTerm > 3) {
    state.dayInTerm = 1;
    state.termIndex = (state.termIndex + 1) % solarTerms.length;
  }
}

function currentSolarTerm() {
  return solarTerms[state.termIndex];
}

function currentSeasonDefinition() {
  return seasonDefinitions[Math.floor(state.termIndex / 6)] || seasonDefinitions[0];
}

function seasonStatusText() {
  const season = currentSeasonDefinition();
  return `${season.name}：${season.visual}`;
}

function generateWeatherForTerm(term) {
  const profile = solarTermWeatherProfiles[term] || solarTermWeatherProfiles.春分;
  const weights = { ...weatherBaseWeights };
  for (const [id, weight] of Object.entries(profile.weights)) {
    weights[id] = (weights[id] || 0) + weight;
  }

  const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  let roll = rng() * total;
  for (const [id, weight] of Object.entries(weights)) {
    roll -= weight;
    if (roll <= 0) {
      return { id, ...weatherTypes[id], note: profile.note };
    }
  }
  return { id: "sunny", ...weatherTypes.sunny, note: profile.note };
}

function currentWeather() {
  return state.weather || generateWeatherForTerm(currentSolarTerm());
}

function weatherCanAutoWater() {
  return Boolean(currentWeather().autoWater);
}

function applyWeatherWatering(targets = null) {
  if (!weatherCanAutoWater()) return 0;
  const targetPlots = targets
    ? targets.map(({ x, y }) => getPlot(x, y)).filter(Boolean)
    : state.tiles;
  let watered = 0;
  for (const plot of targetPlots) {
    if (plot.tilled && !plot.watered) {
      plot.watered = true;
      watered += 1;
    }
  }
  return watered;
}

function weatherStatusText() {
  const weather = currentWeather();
  return `${weather.name}：${weather.effect}`;
}

function currentFestival() {
  const term = currentSolarTerm();
  return traditionalFestivals.find((festival) => (
    festival.term === term && festival.days.includes(state.dayInTerm)
  )) || null;
}

function currentFestivalActivity() {
  const festival = currentFestival();
  return festival ? festivalActivityDefinitions[festival.id] : null;
}

function festivalPrepCount(festival) {
  return state.festivalOps.prep[festival.id] || 0;
}

function festivalActivityStatusText(festival = currentFestival()) {
  if (!festival) return "暂无节日活动";
  const activity = festivalActivityDefinitions[festival.id];
  const prep = festivalPrepCount(festival);
  const menuDone = Boolean(state.festivalOps.menus[festival.id]);
  return `${festival.name}筹备 ${Math.min(prep, activity.steps.length)}/${activity.steps.length}，限定菜谱 ${menuDone ? "已完成" : activity.recipeName}`;
}

function festivalRecipeProgressText(activity) {
  return activity.requirements.map(requirementProgressText).join("，");
}

function festivalVisitorBonus() {
  const festival = currentFestival();
  if (!festival || !state.festivalLog[festival.id]) return 0;
  const activity = festivalActivityDefinitions[festival.id];
  return activity.visitorBonus * 4 + (state.festivalOps.menus[festival.id] ? 10 : 0);
}

function totalFestivalVisitors() {
  return state.festivalOps.visitors || 0;
}

function festivalRewardText(reward) {
  const parts = [];
  if (reward.money) parts.push(`${reward.money} 金`);
  if (reward.energy) parts.push(`体力 +${reward.energy}`);
  if (reward.seeds) {
    for (const [type, count] of Object.entries(reward.seeds)) {
      parts.push(`${seedName(type)} +${count}`);
    }
  }
  return parts.join("，");
}

function claimFestivalTask(festival) {
  const activity = festivalActivityDefinitions[festival.id];
  if (state.festivalLog[festival.id]) {
    say(`公告栏：${festival.name}活动已完成。${festivalActivityStatusText(festival)}。`);
    return;
  }
  const prep = festivalPrepCount(festival);
  if (prep < activity.steps.length) {
    state.festivalOps.prep[festival.id] = prep + 1;
    state.festivalOps.activityScore += 8;
    const stepText = activity.steps[prep];
    say(`${festival.name}筹备：${stepText}。进度 ${prep + 1}/${activity.steps.length}。${prep + 1 >= activity.steps.length ? "再确认一次公告栏即可完成节日活动。" : "继续按 E 做下一步。"}`);
    return;
  }
  state.festivalLog[festival.id] = true;
  if (festival.reward.money) state.money += festival.reward.money;
  if (festival.reward.energy) state.energy = Math.min(100, state.energy + festival.reward.energy);
  if (festival.reward.seeds) {
    for (const [type, count] of Object.entries(festival.reward.seeds)) {
      state.seeds[type] += count;
    }
  }
  const visitorGain = activity.visitorBonus + (state.quests.halfDayTrail ? 2 : 0) + (infrastructureHas("highSpeedShuttle") ? 2 : 0);
  state.festivalOps.visitors += visitorGain;
  state.festivalOps.homestayBookings += state.quests.plannedHomestay ? 1 : 0;
  state.tourism.serviceAppeal += activity.visitorBonus;
  updateTourismProgress();
  const rewardText = festivalRewardText(festival.reward);
  say(`${festival.notice} 完成节日协助，新增节日游客 ${visitorGain} 批${state.quests.plannedHomestay ? "，民宿预约 +1" : ""}，获得 ${rewardText}。`);
}

function handleFestivalCooking() {
  const festival = currentFestival();
  if (!festival) {
    say("炉灶还没点火。节日当天可以在这里做限定菜谱。");
    return true;
  }
  const activity = festivalActivityDefinitions[festival.id];
  if (state.festivalOps.menus[festival.id]) {
    say(`炉灶：${festival.name}限定菜谱“${activity.recipeName}”已经完成。`);
    return true;
  }
  if (!canFulfillRequirements(activity.requirements)) {
    say(`炉灶：${activity.recipeName}需要 ${festivalRecipeProgressText(activity)}。做完后可提升民宿节日套餐。`);
    return true;
  }
  for (const requirement of activity.requirements) {
    consumeRequirement(requirement);
  }
  state.festivalOps.menus[festival.id] = true;
  state.festivalOps.dishesCooked += 1;
  state.festivalOps.activityScore += 12;
  const earned = activity.homestayReward + (state.quests.plannedHomestay ? 20 : 0);
  state.money += earned;
  state.tourism.serviceAppeal += 4;
  if (state.quests.plannedHomestay) state.festivalOps.homestayBookings += 1;
  updateTourismProgress();
  say(`做成${festival.name}限定菜谱：${activity.recipeName}。民宿套餐收入 ${earned} 金，节日氛围提升。`);
  return true;
}

function updatePlayer(delta) {
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (dx !== 0 || dy !== 0) {
    if (Math.abs(dx) > Math.abs(dy)) dy = 0;
    if (dy !== 0) dx = 0;
    state.player.dirX = Math.sign(dx);
    state.player.dirY = Math.sign(dy);
    const nx = state.player.x + Math.sign(dx);
    const ny = state.player.y + Math.sign(dy);
    if (tryMapTransition(nx, ny)) {
      state.player.moving = 8;
    } else if (!isBlocked(nx, ny)) {
      state.player.x = nx;
      state.player.y = ny;
      state.player.moving = 8;
    }
    keys.delete("arrowleft");
    keys.delete("arrowright");
    keys.delete("arrowup");
    keys.delete("arrowdown");
    keys.delete("a");
    keys.delete("d");
    keys.delete("w");
    keys.delete("s");
  }

  state.player.moving = Math.max(0, state.player.moving - delta * 0.04);
}

function tryMapTransition(nx, ny) {
  const throughGate = ny >= 8 && ny <= 12;
  const throughNorthRoad = nx >= 13 && nx <= 16;
  const throughPastureGate = nx >= 2 && nx <= 7;
  if (state.map === "farm" && nx >= 23 && nx <= 24 && ny >= 6 && ny <= 7) {
    enterHouse();
    return true;
  }

  if (state.map === "farm" && ny >= world.height - 1 && throughPastureGate) {
    state.map = "pasture";
    state.player.x = 5;
    state.player.y = 1;
    state.player.dirX = 0;
    state.player.dirY = 1;
    say("走到农场南侧的牧场。");
    renderPanels();
    return true;
  }

  if (state.map === "farm" && nx >= world.width && throughGate) {
    state.map = "village";
    state.player.x = 1;
    state.player.y = 10;
    state.player.dirX = 1;
    state.player.dirY = 0;
    say("来到了村子。");
    renderPanels();
    return true;
  }

  if (state.map === "pasture" && ny <= 0 && throughPastureGate) {
    state.map = "farm";
    state.player.x = 5;
    state.player.y = world.height - 2;
    state.player.dirX = 0;
    state.player.dirY = -1;
    say("回到了农场。");
    renderPanels();
    return true;
  }

  if (state.map === "village" && nx < 0 && throughGate) {
    state.map = "farm";
    state.player.x = world.width - 2;
    state.player.y = 10;
    state.player.dirX = -1;
    state.player.dirY = 0;
    say("回到了农场。");
    renderPanels();
    return true;
  }

  if (state.map === "village" && nx >= world.width && throughGate) {
    state.map = "workshop";
    state.player.x = 1;
    state.player.y = 10;
    state.player.dirX = 1;
    state.player.dirY = 0;
    say("来到了村东手作工坊。");
    renderPanels();
    return true;
  }

  if (state.map === "village" && ny >= world.height - 1 && throughNorthRoad) {
    state.map = "waterworks";
    state.player.x = 15;
    state.player.y = 1;
    state.player.dirX = 0;
    state.player.dirY = 1;
    say("沿着村南水渠来到河湾水利区。");
    renderPanels();
    return true;
  }

  if (state.map === "waterworks" && nx >= world.width && throughGate) {
    state.map = "wetland";
    state.player.x = 1;
    state.player.y = 10;
    state.player.dirX = 1;
    state.player.dirY = 0;
    say("沿着水渠向东，进入河湾湿地。");
    renderPanels();
    return true;
  }

  if (state.map === "wetland" && nx < 0 && throughGate) {
    state.map = "waterworks";
    state.player.x = world.width - 2;
    state.player.y = 10;
    state.player.dirX = -1;
    state.player.dirY = 0;
    say("回到了河湾水利区。");
    renderPanels();
    return true;
  }

  if (state.map === "village" && ny <= 0 && throughNorthRoad) {
    state.map = "scenic";
    state.player.x = 15;
    state.player.y = world.height - 2;
    state.player.dirX = 0;
    state.player.dirY = -1;
    say("沿着北边山路来到了山谷景区。");
    renderPanels();
    return true;
  }

  if (state.map === "workshop" && nx < 0 && throughGate) {
    state.map = "village";
    state.player.x = world.width - 2;
    state.player.y = 10;
    state.player.dirX = -1;
    state.player.dirY = 0;
    say("回到了村子。");
    renderPanels();
    return true;
  }

  if (state.map === "workshop" && nx >= world.width && throughGate) {
    state.map = "station";
    state.player.x = 1;
    state.player.y = 10;
    state.player.dirX = 1;
    state.player.dirY = 0;
    say("到了县城高铁站接驳区。");
    renderPanels();
    return true;
  }

  if (state.map === "station" && nx < 0 && throughGate) {
    state.map = "workshop";
    state.player.x = world.width - 2;
    state.player.y = 10;
    state.player.dirX = -1;
    state.player.dirY = 0;
    say("回到了手作工坊。");
    renderPanels();
    return true;
  }

  if (state.map === "waterworks" && ny <= 0 && throughNorthRoad) {
    state.map = "village";
    state.player.x = 15;
    state.player.y = world.height - 2;
    state.player.dirX = 0;
    state.player.dirY = -1;
    say("回到了村子。");
    renderPanels();
    return true;
  }

  if (state.map === "scenic" && ny >= world.height - 1 && throughNorthRoad) {
    state.map = "village";
    state.player.x = 15;
    state.player.y = 1;
    state.player.dirX = 0;
    state.player.dirY = 1;
    say("回到了村子。");
    renderPanels();
    return true;
  }

  if (state.map === "scenic" && ny < 0 && throughNorthRoad) {
    state.map = "alpine";
    state.player.x = 15;
    state.player.y = world.height - 2;
    state.player.dirX = 0;
    state.player.dirY = -1;
    say("继续向北，进入雪山步道。");
    renderPanels();
    return true;
  }

  if (state.map === "scenic" && nx >= world.width && throughGate) {
    state.map = "terrace";
    state.player.x = 1;
    state.player.y = 10;
    state.player.dirX = 1;
    state.player.dirY = 0;
    say("沿着山路向东，来到梯田林缘。");
    renderPanels();
    return true;
  }

  if (state.map === "terrace" && nx < 0 && throughGate) {
    state.map = "scenic";
    state.player.x = world.width - 2;
    state.player.y = 10;
    state.player.dirX = -1;
    state.player.dirY = 0;
    say("回到了山谷景区。");
    renderPanels();
    return true;
  }

  if (state.map === "alpine" && ny >= world.height - 1 && throughNorthRoad) {
    state.map = "scenic";
    state.player.x = 15;
    state.player.y = 1;
    state.player.dirX = 0;
    state.player.dirY = 1;
    say("回到了山谷景区。");
    renderPanels();
    return true;
  }

  return false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawObliqueBackdrop();
  withWorldView(() => {
    drawTerrain();
    drawGroundDecorLayer();
    drawPlots();
    drawTarget();
    drawYSortedWorld();
    drawForegroundLayer();
  });
  drawSeasonTint();
  drawShade();
  drawWeatherEffects();
}

function withWorldView(callback) {
  if (viewMode.id !== "threeQuarter2d") {
    callback();
    return;
  }
  ctx.save();
  ctx.transform(
    viewMode.scaleX,
    0,
    0,
    viewMode.scaleY,
    viewMode.originX,
    viewMode.originY
  );
  callback();
  ctx.restore();
}

function drawObliqueBackdrop() {
  if (viewMode.id !== "threeQuarter2d") return;
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#dbe8d7");
  gradient.addColorStop(0.55, "#b7d0be");
  gradient.addColorStop(1, "#8fb09b");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(48, 64, 56, 0.18)";
  ctx.beginPath();
  ctx.moveTo(90, 560);
  ctx.lineTo(450, 410);
  ctx.lineTo(870, 520);
  ctx.lineTo(930, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();
}

function drawTerrain() {
  const terrain = currentTerrain();
  const palette = currentSeasonDefinition().palette;
  for (let y = 0; y < world.height; y += 1) {
    for (let x = 0; x < world.width; x += 1) {
      const kind = terrain[y][x];
      drawGroundTile(kind, x, y, palette);

      if (kind === "flower") {
        drawPixelFlower(x * tile + 16, y * tile + 17, palette);
      } else if (kind === "forest") {
        drawPine(x * tile + 16, y * tile + 18, palette);
      } else if (kind === "river") {
        drawRiverSparkle(x * tile, y * tile);
      } else if (kind === "wetland") {
        drawWetlandRipple(x * tile, y * tile);
      } else if (kind === "reeds") {
        drawReeds(x * tile, y * tile);
      } else if (kind === "terrace") {
        drawTerraceLine(x * tile, y * tile);
      } else if (kind === "snow") {
        drawSnowCap(x * tile, y * tile);
      }
    }
  }
  if (state.map === "farm" || state.map === "village") drawMapGate();
  if (state.map === "scenic") drawScenicGate();
  drawRegionalGates();
}

function terrainColor(kind, x, y, palette) {
  if (kind === "fence") return "#6b5736";
  if (kind === "wall") return "#6c4930";
  if (kind === "snow") return palette.snow[(x + y) % 2];
  if (kind === "rock") return palette.rock[(x + y) % 2];
  if (kind === "forest") return palette.forest[(x + y) % 2];
  if (kind === "river") return palette.river[(x + y) % 2];
  if (kind === "wetland") return (x + y) % 2 ? "#5f7f63" : "#6f8d68";
  if (kind === "reeds") return (x + y) % 2 ? "#77864a" : "#8a9654";
  if (kind === "terrace") return (x + y) % 2 ? "#78985f" : "#89a96c";
  if (kind === "bridge") return (x + y) % 2 ? "#8b613c" : "#9a7046";
  if (kind === "trail") return palette.trail[(x + y) % 2];
  if (kind === "floor") return (x + y) % 2 ? "#9b7248" : "#a97e50";
  if (kind === "rug") return (x + y) % 2 ? "#7a4543" : "#8e5650";
  if (kind === "soil") return palette.soil;
  if (kind === "road") return palette.road[(x + y) % 2];
  return palette.grass[(x + y) % 2];
}

function tileRandom(x, y, salt = 0) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt * 37.719) * 43758.5453;
  return value - Math.floor(value);
}

function drawGroundTile(kind, x, y, palette) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = terrainColor(kind, x, y, palette);
  ctx.fillRect(px, py, tile, tile);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(px, py, tile, 2);
  ctx.fillRect(px, py, 2, tile);
  ctx.fillStyle = "rgba(36, 30, 20, 0.10)";
  ctx.fillRect(px, py + tile - 4, tile, 4);

  if (kind === "grass" || kind === "flower") drawGrassTileDetail(px, py, x, y, palette);
  if (kind === "road" || kind === "trail") drawStoneTileDetail(px, py, x, y);
  if (kind === "soil") drawSoilTileDetail(px, py, x, y);
  if (kind === "river") drawWaterEdgeDetail(px, py, x, y);
}

function drawGrassTileDetail(px, py, x, y, palette) {
  const count = state.map === "farm" ? 3 : 1;
  for (let i = 0; i < count; i += 1) {
    const rx = Math.floor(tileRandom(x, y, i) * 24) + 4;
    const ry = Math.floor(tileRandom(x, y, i + 8) * 22) + 6;
    ctx.fillStyle = i % 2 ? palette.flowerStem : "rgba(54, 111, 56, 0.55)";
    ctx.fillRect(px + rx, py + ry, 2, 6);
    if (tileRandom(x, y, i + 20) > 0.78) {
      ctx.fillStyle = i % 2 ? palette.flowerA : palette.flowerB;
      ctx.fillRect(px + rx - 1, py + ry - 2, 4, 3);
    }
  }
}

function drawStoneTileDetail(px, py, x, y) {
  const stones = state.map === "farm" ? 2 : 1;
  for (let i = 0; i < stones; i += 1) {
    const rx = Math.floor(tileRandom(x, y, i + 30) * 19) + 5;
    const ry = Math.floor(tileRandom(x, y, i + 40) * 18) + 7;
    ctx.fillStyle = i % 2 ? "rgba(226, 210, 166, 0.44)" : "rgba(110, 88, 56, 0.22)";
    ctx.fillRect(px + rx, py + ry, 8, 4);
  }
}

function drawSoilTileDetail(px, py, x, y) {
  ctx.fillStyle = "rgba(69, 42, 25, 0.28)";
  ctx.fillRect(px + 5, py + 10 + Math.floor(tileRandom(x, y, 51) * 4), 22, 3);
  ctx.fillRect(px + 6, py + 21 + Math.floor(tileRandom(x, y, 52) * 3), 20, 2);
  ctx.fillStyle = "rgba(211, 155, 87, 0.24)";
  ctx.fillRect(px + 8, py + 6, 4, 2);
  ctx.fillRect(px + 21, py + 17, 3, 2);
}

function drawWaterEdgeDetail(px, py, x, y) {
  ctx.fillStyle = "rgba(215, 246, 255, 0.24)";
  ctx.fillRect(px + 4, py + 9 + Math.floor(tileRandom(x, y, 61) * 5), 18, 2);
  ctx.fillRect(px + 12, py + 22, 13, 2);
}

function drawPlots() {
  if (state.map !== "farm") return;
  for (const { x, y } of farmPlots) {
    const plot = getPlot(x, y);
    const px = x * tile;
    const py = y * tile;

    if (plot.tilled) {
      drawFarmPlotTile(px, py, plot);
    }

    if (plot.crop) {
      drawCrop(px, py, plot.crop);
    }
  }
}

function drawFarmPlotTile(px, py, plot) {
  const soilColor = plot.fertilized ? "#5f5430" : plot.watered ? "#5a3f31" : "#7b5031";
  ctx.fillStyle = "rgba(39, 23, 14, 0.24)";
  ctx.fillRect(px + 4, py + 8, tile - 6, tile - 5);
  ctx.fillStyle = soilColor;
  ctx.fillRect(px + 3, py + 4, tile - 6, tile - 7);
  ctx.fillStyle = "rgba(226, 166, 93, 0.20)";
  ctx.fillRect(px + 5, py + 5, tile - 10, 2);
  ctx.fillStyle = "rgba(30,18,12,0.34)";
  ctx.fillRect(px + 7, py + 12, tile - 14, 3);
  ctx.fillRect(px + 7, py + 21, tile - 14, 3);
  if (plot.watered) {
    ctx.fillStyle = "rgba(116, 170, 184, 0.20)";
    ctx.fillRect(px + 5, py + 6, tile - 10, tile - 12);
  }
  if (plot.fertilized) {
    ctx.fillStyle = "rgba(201, 185, 91, 0.26)";
    ctx.fillRect(px + 12, py + 9, 7, 3);
    ctx.fillRect(px + 19, py + 19, 5, 3);
  }
}

function drawCrop(px, py, crop) {
  const spec = cropTypes[crop.type];
  const stage = crop.ready ? 3 : Math.min(2, Math.floor((crop.age / spec.days) * 3));
  if (crop.type === "flower") {
    drawFlowerCrop(px, py, crop, stage);
    return;
  }
  ctx.fillStyle = "#245c35";
  ctx.fillRect(px + 15, py + 20 - stage * 3, 3, 9 + stage * 3);
  ctx.fillStyle = "#3f8b45";
  ctx.fillRect(px + 10, py + 18 - stage * 2, 8 + stage * 2, 5);
  ctx.fillRect(px + 16, py + 15 - stage * 2, 7 + stage * 3, 5);
  if (crop.ready) {
    ctx.fillStyle = spec.color;
    ctx.fillRect(px + 12, py + 10, 10, 9);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillRect(px + 14, py + 11, 3, 2);
  }
}

function drawFlowerCrop(px, py, crop, stage) {
  ctx.fillStyle = "#245c35";
  ctx.fillRect(px + 15, py + 18 - stage * 3, 3, 13 + stage * 3);
  ctx.fillStyle = "#3f8b45";
  ctx.fillRect(px + 9, py + 22 - stage * 2, 10, 5);
  ctx.fillRect(px + 16, py + 19 - stage * 2, 10, 5);
  if (stage < 2) {
    ctx.fillStyle = "#6fae62";
    ctx.fillRect(px + 13, py + 13, 8, 7);
    return;
  }
  const flower = flowerPhenotype(crop.genes);
  const cx = px + 16;
  const cy = py + 11;
  const petals = [
    [0, -6],
    [6, -1],
    [4, 6],
    [-4, 6],
    [-6, -1]
  ];
  for (const [dx, dy] of petals) {
    ctx.fillStyle = flower.color;
    ctx.fillRect(cx + dx - 4, cy + dy - 4, 8, 8);
  }
  if (flower.id === "rainbow") {
    ctx.fillStyle = "#5f8ed6";
    ctx.fillRect(cx - 8, cy - 2, 7, 7);
    ctx.fillStyle = "#f0c85e";
    ctx.fillRect(cx + 1, cy - 8, 7, 7);
    ctx.fillStyle = "#d95a65";
    ctx.fillRect(cx + 2, cy + 2, 7, 7);
  } else if (flower.id === "aurora") {
    ctx.fillStyle = "#9b6ad6";
    ctx.fillRect(cx - 8, cy - 3, 6, 6);
    ctx.fillStyle = "#73d0c4";
    ctx.fillRect(cx + 2, cy - 8, 6, 6);
    ctx.fillStyle = "#f0c76c";
    ctx.fillRect(cx + 2, cy + 3, 6, 6);
  }
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(cx - 3, cy - 3, 6, 6);
}

function drawStructures() {
  if (state.map === "farm") {
    drawHouse(21, 4);
    drawGreenhouse(15, 3);
    drawMarket(3, 4);
    drawChickenCoop(2, 12);
    drawTechStation(2, 16);
    drawBin(20, 13);
    drawPond(22, 13);
    drawFisheryBoard(22, 17);
    drawFarmInfrastructure();
    drawFarmGuides();
  } else if (state.map === "village") {
    drawVillage();
    drawVillageGuides();
  } else if (state.map === "scenic") {
    drawScenic();
    drawScenicGuides();
  } else if (state.map === "pasture") {
    drawPasture();
    drawPastureGuides();
  } else if (state.map === "workshop") {
    drawWorkshopDistrict();
    drawWorkshopGuides();
  } else if (state.map === "waterworks") {
    drawWaterworksDistrict();
    drawWaterworksGuides();
  } else if (state.map === "wetland") {
    drawWetlandReserve();
    drawWetlandGuides();
  } else if (state.map === "station") {
    drawStationDistrict();
    drawStationGuides();
  } else if (state.map === "alpine") {
    drawAlpineTrail();
    drawAlpineGuides();
  } else if (state.map === "terrace") {
    drawTerraceValley();
    drawTerraceGuides();
  } else {
    drawHomeInterior();
  }
}

function drawYSortedWorld() {
  const commands = [
    ...depthSortedStructureCommands(),
    ...depthSortedActorCommands()
  ];
  commands
    .sort((a, b) => a.y - b.y || a.x - b.x || a.order - b.order)
    .forEach((command) => command.draw());
}

function drawGroundDecorLayer() {
  if (state.map !== "farm") return;
  drawFarmStonePath();
  drawFarmFenceAccents();
  drawFarmFlowerBeds();
  drawFarmPondEdgePlants();
}

function drawForegroundLayer() {
  if (state.map !== "farm") return;
  drawForegroundGrassTufts();
}

function drawFarmStonePath() {
  const stones = [
    [12, 9], [13, 9], [14, 9], [15, 9], [16, 9], [17, 9],
    [17, 8], [18, 8], [19, 8], [20, 8], [21, 8],
    [15, 10], [15, 11], [15, 12], [15, 13]
  ];
  for (const [x, y] of stones) {
    const px = x * tile;
    const py = y * tile;
    ctx.fillStyle = "rgba(226, 214, 180, 0.62)";
    ctx.fillRect(px + 5, py + 10, 22, 13);
    ctx.fillStyle = "rgba(117, 99, 70, 0.22)";
    ctx.fillRect(px + 6, py + 20, 20, 3);
    ctx.fillStyle = "rgba(255,255,255,0.20)";
    ctx.fillRect(px + 8, py + 11, 9, 2);
  }
}

function drawFarmFenceAccents() {
  const fenceRuns = [
    { x: 6, y: 13, count: 9 },
    { x: 17, y: 13, count: 8 },
    { x: 18, y: 18, count: 7 }
  ];
  for (const run of fenceRuns) {
    for (let i = 0; i < run.count; i += 1) {
      drawSmallFencePost(run.x + i, run.y);
    }
  }
}

function drawSmallFencePost(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6e4c2f";
  ctx.fillRect(px + 3, py + 16, 5, 17);
  ctx.fillRect(px + 20, py + 16, 5, 17);
  ctx.fillStyle = "#9b6c3e";
  ctx.fillRect(px + 3, py + 20, 22, 4);
  ctx.fillRect(px + 3, py + 28, 22, 4);
}

function drawFarmFlowerBeds() {
  for (let x = 18; x <= 25; x += 1) {
    drawSmallFlowerClump(x, 17, x % 2 ? "#f0c76c" : "#d95a65");
  }
  for (let y = 4; y <= 7; y += 1) {
    drawSmallFlowerClump(20, y, y % 2 ? "#e7dce7" : "#f0c76c");
  }
}

function drawSmallFlowerClump(x, y, color) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "rgba(43, 93, 52, 0.62)";
  ctx.fillRect(px + 6, py + 16, 18, 9);
  ctx.fillStyle = color;
  ctx.fillRect(px + 7, py + 13, 4, 4);
  ctx.fillRect(px + 15, py + 11, 4, 4);
  ctx.fillRect(px + 22, py + 14, 4, 4);
}

function drawFarmPondEdgePlants() {
  for (let i = 0; i < 8; i += 1) {
    const x = 22 + (i % 5);
    const y = 12 + Math.floor(i / 5);
    const px = x * tile;
    const py = y * tile;
    ctx.fillStyle = "#567a45";
    ctx.fillRect(px + 8 + (i % 2) * 7, py + 20, 3, 12);
    ctx.fillStyle = "#d8c17a";
    if (i % 3 === 0) ctx.fillRect(px + 7 + (i % 2) * 7, py + 17, 5, 4);
  }
}

function drawForegroundGrassTufts() {
  for (let x = 0; x < world.width; x += 1) {
    if (tileRandom(x, 19, 80) < 0.25) continue;
    drawTallGrassTuft(x, 18, 0);
  }
  for (let x = 6; x <= 25; x += 2) {
    drawTallGrassTuft(x, 13, 1);
  }
}

function drawTallGrassTuft(x, y, salt) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "rgba(47, 102, 55, 0.78)";
  const offset = Math.floor(tileRandom(x, y, salt + 90) * 10);
  ctx.fillRect(px + 6 + offset, py + 22, 3, 12);
  ctx.fillRect(px + 12 + offset, py + 18, 3, 16);
  ctx.fillRect(px + 18 + offset, py + 24, 3, 10);
  ctx.fillStyle = "rgba(123, 179, 94, 0.70)";
  ctx.fillRect(px + 13 + offset, py + 17, 2, 5);
}

function depthCommand(x, y, order, draw) {
  return { x, y, order, draw };
}

function depthSortedActorCommands() {
  const commands = [
    depthCommand(state.player.x, state.player.y + 0.9, 100, drawPlayer)
  ];
  if (state.map !== "home") {
    adoptedPetEntries()
      .filter(([, pet]) => pet.following)
      .forEach(([id], index) => {
        commands.push(depthCommand(
          state.player.x + (index === 0 ? -0.25 : 0.25),
          state.player.y + 0.95 + index * 0.08,
          101 + index,
          () => drawFollowerPet(id, index)
        ));
      });
  }
  return commands;
}

function depthSortedStructureCommands() {
  if (state.map === "farm") return farmDepthCommands();
  if (state.map === "home") return homeDepthCommands();
  return [depthCommand(0, -100, 0, drawStructures)];
}

function farmDepthCommands() {
  const commands = [
    depthCommand(21, 8.1, 10, () => drawFarmObjectWithShadow(21, 4, 5, 4, () => drawHouse(21, 4))),
    depthCommand(15, 5.8, 11, () => drawFarmObjectWithShadow(15, 3, 4, 3, () => drawGreenhouse(15, 3))),
    depthCommand(3, 5.9, 12, () => drawFarmObjectWithShadow(3, 4, 3, 2, () => drawMarket(3, 4))),
    depthCommand(2, 14.9, 13, () => drawFarmObjectWithShadow(2, 12, 3, 3, () => drawChickenCoop(2, 12))),
    depthCommand(2, 17.6, 14, () => drawFarmObjectWithShadow(2, 16, 2, 2, () => drawTechStation(2, 16))),
    depthCommand(20, 14.8, 15, () => drawFarmObjectWithShadow(20, 13, 2, 2, () => drawBin(20, 13))),
    depthCommand(22, 16.2, 16, () => drawFarmObjectWithShadow(22, 13, 5, 3, () => drawPond(22, 13))),
    depthCommand(22, 17.9, 17, () => drawFarmObjectWithShadow(22, 17, 2, 1, () => drawFisheryBoard(22, 17))),
    depthCommand(0, -80, 1, drawFarmInfrastructure),
    depthCommand(0, -70, 2, drawFarmGuides)
  ];
  return commands;
}

function drawFarmObjectWithShadow(x, y, widthTiles, heightTiles, drawObject) {
  drawContactShadow(x, y, widthTiles, heightTiles);
  drawObject();
}

function drawContactShadow(x, y, widthTiles, heightTiles) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "rgba(32, 28, 20, 0.20)";
  ctx.fillRect(
    px + Math.max(4, widthTiles * 3),
    py + heightTiles * tile - 12,
    Math.max(20, widthTiles * tile - 14),
    8
  );
}

function homeDepthCommands() {
  return [
    depthCommand(14, 18.9, 1, () => drawInteriorDoor(14, 18)),
    depthCommand(22, 6.9, 2, () => drawBed(22, 5)),
    depthCommand(13, 11.8, 3, () => drawTable(13, 10)),
    depthCommand(5, 6.9, 4, () => drawStove(5, 5)),
    depthCommand(16, 6.9, 5, () => drawAquarium(16, 5)),
    depthCommand(5, 14.8, 6, () => drawBookshelf(5, 13)),
    depthCommand(10, 10.9, 7, () => drawPerson(10, 10)),
    depthCommand(7, 15.9, 8, drawPetCorner),
    depthCommand(8, 16.9, 9, drawHomePets),
    depthCommand(12, 1.9, 10, () => drawWindow(12, 1)),
    depthCommand(17, 1.9, 11, () => drawWindow(17, 1))
  ];
}

function drawSpriteAsset(id, px, py, width, height) {
  const definition = spriteDefinitions[id];
  const image = spriteAssets[id];
  const drawWidth = width || ((definition?.widthTiles || 1) * tile);
  const drawHeight = height || ((definition?.heightTiles || 1) * tile);
  const anchor = definition?.anchor || { x: 0, y: 0 };
  if (!image || !image.complete || !image.naturalWidth) return false;
  ctx.drawImage(
    image,
    Math.round(px - anchor.x * drawWidth),
    Math.round(py - anchor.y * drawHeight),
    Math.round(drawWidth),
    Math.round(drawHeight)
  );
  return true;
}

function drawMapSprite(id, x, y, widthTiles, heightTiles) {
  const definition = spriteDefinitions[id];
  return drawSpriteAsset(
    id,
    x * tile,
    y * tile,
    (widthTiles || definition?.widthTiles || 1) * tile,
    (heightTiles || definition?.heightTiles || 1) * tile
  );
}

function drawGreenhouse(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("greenhouse", x, y)) return;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 5, py + 34, 118, 26);
  ctx.fillStyle = state.flowerBreeding.greenhouse ? "rgba(174, 224, 205, 0.92)" : "rgba(148, 174, 164, 0.78)";
  ctx.fillRect(px + 12, py + 14, 104, 28);
  ctx.strokeStyle = "#f4f1df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px + 12, py + 14);
  ctx.lineTo(px + 64, py + 2);
  ctx.lineTo(px + 116, py + 14);
  ctx.stroke();
  ctx.fillStyle = state.flowerBreeding.greenhouse ? "#f08fc4" : "#8f8878";
  ctx.fillRect(px + 28, py + 32, 14, 12);
  ctx.fillStyle = state.flowerBreeding.greenhouse ? "#f0c85e" : "#7f786a";
  ctx.fillRect(px + 55, py + 28, 14, 14);
  ctx.fillStyle = state.flowerBreeding.greenhouse ? "#5f8ed6" : "#7f786a";
  ctx.fillRect(px + 82, py + 32, 14, 12);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(state.flowerBreeding.greenhouse ? "花艺温室" : "待修温室", px + 38, py + 56);
}

function drawFarmInfrastructure() {
  if (infrastructureHas("canalRepair") || infrastructureHas("reservoir")) {
    ctx.fillStyle = "#3b86a0";
    for (let x = 3; x <= 17; x += 1) {
      ctx.fillRect(x * tile + 4, 12 * tile + 12, tile - 8, 8);
    }
    ctx.fillStyle = "#b8e7f3";
    for (let x = 4; x <= 16; x += 3) {
      ctx.fillRect(x * tile + 8, 12 * tile + 14, 12, 3);
    }
  }

  if (infrastructureHas("reservoir")) {
    ctx.fillStyle = "#2f748e";
    ctx.fillRect(18 * tile + 4, 15 * tile + 4, 54, 42);
    ctx.fillStyle = "rgba(190, 231, 243, 0.7)";
    ctx.fillRect(18 * tile + 10, 15 * tile + 12, 42, 8);
  }

  if (infrastructureHas("smartIrrigation")) {
    for (let y = 7; y <= 11; y += 2) {
      for (let x = 7; x <= 15; x += 4) {
        ctx.fillStyle = "#6f817f";
        ctx.fillRect(x * tile + 14, y * tile + 8, 4, 18);
        ctx.fillStyle = "#b8e7f3";
        ctx.fillRect(x * tile + 6, y * tile + 8, 20, 4);
      }
    }
  }

  if (infrastructureHas("droneSensors")) {
    drawSoilSensors();
    if (state.techOps.lastDroneDay === state.totalDay) drawDroneInFlight();
  }
}

function drawTechStation(x, y) {
  const px = x * tile;
  const py = y * tile;
  const active = infrastructureHas("droneSensors");
  ctx.fillStyle = active ? "#4f5557" : "#6b6255";
  ctx.fillRect(px + 4, py + 6, 56, 44);
  ctx.fillStyle = active ? "#d8c17a" : "#9f9276";
  ctx.fillRect(px + 10, py + 12, 44, 32);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(active ? "H" : "待建", px + (active ? 28 : 18), py + 34);
  ctx.fillStyle = active ? "#f4f1df" : "#c7b990";
  ctx.fillRect(px + 23, py + 4, 18, 6);
  ctx.fillRect(px + 29, py - 2, 6, 18);
}

function drawSoilSensors() {
  ctx.fillStyle = "#5f8ed6";
  for (const point of [{ x: 7, y: 8 }, { x: 12, y: 10 }, { x: 16, y: 7 }]) {
    const px = point.x * tile;
    const py = point.y * tile;
    ctx.fillRect(px + 14, py + 8, 4, 18);
    ctx.fillStyle = "#f0c76c";
    ctx.fillRect(px + 10, py + 7, 12, 6);
    ctx.fillStyle = "#5f8ed6";
  }
}

function drawDroneInFlight() {
  const t = performance.now() / 900;
  const px = (9 + Math.sin(t) * 5) * tile;
  const py = (6 + Math.cos(t * 0.8) * 2) * tile;
  ctx.fillStyle = "rgba(40, 54, 62, 0.22)";
  ctx.fillRect(px - 16, py + 24, 42, 6);
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px - 5, py, 18, 10);
  ctx.fillStyle = "#5f8ed6";
  ctx.fillRect(px, py + 3, 8, 4);
  ctx.strokeStyle = "#2f4f5c";
  ctx.lineWidth = 2;
  for (const arm of [{ x: -16, y: -8 }, { x: 24, y: -8 }, { x: -16, y: 18 }, { x: 24, y: 18 }]) {
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 5);
    ctx.lineTo(px + arm.x, py + arm.y);
    ctx.stroke();
    ctx.fillStyle = "#2f4f5c";
    ctx.fillRect(px + arm.x - 5, py + arm.y - 1, 10, 2);
  }
}

function drawFarmGuides() {
  drawDirectionSign(26, 9, "村子", "right");
  drawGroundArrow(28, 10, "right");
  drawDirectionSign(22, 8, "家", "up");
  drawGroundArrow(23, 8, "up");
  drawDirectionSign(5, 17, "牧场", "down");
  drawGroundArrow(5, 18, "down");
}

function drawVillageGuides() {
  drawDirectionSign(1, 9, "农场", "left");
  drawGroundArrow(1, 10, "left");
  drawDirectionSign(16, 2, "景区", "up");
  drawGroundArrow(15, 1, "up");
  drawDirectionSign(26, 9, "工坊", "right");
  drawGroundArrow(28, 10, "right");
  drawDirectionSign(16, 17, "水利", "down");
  drawGroundArrow(15, 18, "down");
}

function drawScenicGuides() {
  drawDirectionSign(16, 17, "村子", "down");
  drawGroundArrow(15, 18, "down");
  drawDirectionSign(16, 1, "雪山", "up");
  drawGroundArrow(15, 1, "up");
  drawDirectionSign(18, 12, "河流", "right");
  drawDirectionSign(9, 14, "民宿", "left");
  drawDirectionSign(22, 6, "竹林", "right");
  drawDirectionSign(5, 11, "石屋", "left");
}

function drawPastureGuides() {
  drawDirectionSign(5, 1, "农场", "up");
  drawGroundArrow(5, 1, "up");
  drawDirectionSign(12, 8, "草料", "right");
  drawDirectionSign(18, 13, "堆肥", "right");
}

function drawWorkshopGuides() {
  drawDirectionSign(1, 9, "村子", "left");
  drawGroundArrow(1, 10, "left");
  drawDirectionSign(26, 9, "高铁", "right");
  drawGroundArrow(28, 10, "right");
  drawDirectionSign(10, 3, "手作", "up");
  drawDirectionSign(10, 15, "晾晒", "down");
}

function drawWaterworksGuides() {
  drawDirectionSign(16, 1, "村子", "up");
  drawGroundArrow(15, 1, "up");
  drawDirectionSign(9, 8, "分水", "right");
  drawDirectionSign(19, 4, "蓄水", "right");
  drawDirectionSign(26, 9, "湿地", "right");
  drawGroundArrow(28, 10, "right");
}

function drawWetlandGuides() {
  drawDirectionSign(1, 9, "水利", "left");
  drawGroundArrow(1, 10, "left");
  drawDirectionSign(17, 5, "观鸟", "right");
  drawDirectionSign(4, 13, "芦苇", "left");
  drawDirectionSign(10, 4, "水质", "up");
}

function drawStationGuides() {
  drawDirectionSign(1, 9, "工坊", "left");
  drawGroundArrow(1, 10, "left");
  drawDirectionSign(5, 9, "接驳", "down");
  drawDirectionSign(17, 11, "冷链", "down");
}

function drawAlpineGuides() {
  drawDirectionSign(16, 17, "景区", "down");
  drawGroundArrow(15, 18, "down");
  drawDirectionSign(20, 5, "气象", "right");
  drawDirectionSign(22, 12, "救援", "down");
}

function drawTerraceGuides() {
  drawDirectionSign(1, 9, "景区", "left");
  drawGroundArrow(1, 10, "left");
  drawDirectionSign(6, 5, "梯田", "right");
  drawDirectionSign(22, 4, "老林", "right");
  drawDirectionSign(12, 13, "观景", "down");
}

function drawDirectionSign(x, y, label, direction) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 7, py + 8, 18, 22);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px - 8, py - 2, 48, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px - 2, py + 12);
  drawMiniArrow(px + (direction === "left" ? -5 : 31), py + 8, direction);
}

function drawGroundArrow(x, y, direction) {
  const cx = x * tile + 16;
  const cy = y * tile + 16;
  ctx.fillStyle = "rgba(255, 225, 138, 0.88)";
  ctx.beginPath();
  if (direction === "right") {
    ctx.moveTo(cx + 10, cy);
    ctx.lineTo(cx - 6, cy - 9);
    ctx.lineTo(cx - 2, cy);
    ctx.lineTo(cx - 6, cy + 9);
  } else if (direction === "left") {
    ctx.moveTo(cx - 10, cy);
    ctx.lineTo(cx + 6, cy - 9);
    ctx.lineTo(cx + 2, cy);
    ctx.lineTo(cx + 6, cy + 9);
  } else if (direction === "up") {
    ctx.moveTo(cx, cy - 10);
    ctx.lineTo(cx - 9, cy + 6);
    ctx.lineTo(cx, cy + 2);
    ctx.lineTo(cx + 9, cy + 6);
  } else {
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(cx - 9, cy - 6);
    ctx.lineTo(cx, cy - 2);
    ctx.lineTo(cx + 9, cy - 6);
  }
  ctx.closePath();
  ctx.fill();
}

function drawMiniArrow(cx, cy, direction) {
  ctx.fillStyle = "#3b2a1d";
  ctx.beginPath();
  if (direction === "right") {
    ctx.moveTo(cx + 5, cy);
    ctx.lineTo(cx - 3, cy - 4);
    ctx.lineTo(cx - 3, cy + 4);
  } else if (direction === "left") {
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx + 3, cy - 4);
    ctx.lineTo(cx + 3, cy + 4);
  } else if (direction === "up") {
    ctx.moveTo(cx, cy - 5);
    ctx.lineTo(cx - 4, cy + 3);
    ctx.lineTo(cx + 4, cy + 3);
  } else {
    ctx.moveTo(cx, cy + 5);
    ctx.lineTo(cx - 4, cy - 3);
    ctx.lineTo(cx + 4, cy - 3);
  }
  ctx.closePath();
  ctx.fill();
}

function drawScenic() {
  drawSnowMountain();
  drawLookout(5, 5);
  drawRiverDock(20, 12);
  drawHomestaySite(5, 14);
  drawScenicSign(14, 15);
  drawBambooGrove(23, 6);
  drawStoneHouse(2, 11);
  if (state.quests.halfDayTrail) drawTourRoute();
  if (state.quests.halfDayTrail) drawTourismFacilities();
}

function drawScenicGate() {
  ctx.fillStyle = "#8b6b3d";
  ctx.fillRect(13 * tile, 19 * tile, 4 * tile, tile);
  ctx.fillStyle = "#d9c17d";
  ctx.fillRect(14 * tile + 8, 19 * tile + 6, 48, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px monospace";
  ctx.fillText("村子", 14 * tile + 18, 19 * tile + 18);
}

function drawRegionalGates() {
  if (state.map === "farm") {
    drawEdgeGate("bottom", 2, 7, "牧场");
  } else if (state.map === "village") {
    drawEdgeGate("right", 8, 12, "工坊");
    drawEdgeGate("bottom", 13, 16, "水利");
  } else if (state.map === "pasture") {
    drawEdgeGate("top", 2, 7, "农场");
  } else if (state.map === "workshop") {
    drawEdgeGate("left", 8, 12, "村子");
    drawEdgeGate("right", 8, 12, "高铁");
  } else if (state.map === "waterworks") {
    drawEdgeGate("top", 13, 16, "村子");
    drawEdgeGate("right", 8, 12, "湿地");
  } else if (state.map === "wetland") {
    drawEdgeGate("left", 8, 12, "水利");
  } else if (state.map === "station") {
    drawEdgeGate("left", 8, 12, "工坊");
  } else if (state.map === "scenic") {
    drawEdgeGate("top", 13, 16, "雪山");
    drawEdgeGate("right", 8, 12, "梯田");
  } else if (state.map === "alpine") {
    drawEdgeGate("bottom", 13, 16, "景区");
  } else if (state.map === "terrace") {
    drawEdgeGate("left", 8, 12, "景区");
  }
}

function drawEdgeGate(side, start, end, label) {
  const length = end - start + 1;
  ctx.fillStyle = "#8b6b3d";
  if (side === "top" || side === "bottom") {
    const y = side === "top" ? 0 : world.height - 1;
    ctx.fillRect(start * tile, y * tile, length * tile, tile);
    ctx.fillStyle = "#d9c17d";
    ctx.fillRect(start * tile + 8, y * tile + 6, Math.max(40, length * tile - 16), 16);
    ctx.fillStyle = "#3b2a1d";
    ctx.font = "11px monospace";
    ctx.fillText(label, start * tile + 18, y * tile + 18);
    return;
  }

  const x = side === "left" ? 0 : world.width - 1;
  ctx.fillRect(x * tile, start * tile, tile, length * tile);
  ctx.fillStyle = "#d9c17d";
  ctx.fillRect(x * tile + (side === "left" ? 6 : 4), (start + 1) * tile + 10, 20, 48);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px monospace";
  ctx.save();
  ctx.translate(x * tile + (side === "left" ? 25 : 8), (start + 2) * tile + 23);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(label, -14, 0);
  ctx.restore();
}

function drawPasture() {
  drawSheepPen(5, 5);
  drawForageShed(17, 4);
  drawCompostYard(19, 13);
  drawTinySheep(10, 11);
  drawTinySheep(14, 14);
  drawTinySheep(8, 15);
}

function drawWorkshopDistrict() {
  drawCraftWorkshop(4, 4, "竹编");
  drawCraftWorkshop(16, 4, "腌制");
  drawDryingYard(5, 14);
  drawMarketStall(18, 13, "手作");
  if (state.craftOps.batches >= 1) drawCrates(11, 12);
  if (state.craftOps.standards) drawSmallBanner(12, 6, "标准化");
  if (state.craftOps.made.souvenirBox >= 1) drawSmallBanner(19, 12, "伴手礼");
}

function drawWaterworksDistrict() {
  drawPumpHouse(4, 5);
  drawReservoirBasin(20, 4);
  drawSluiceGate(11, 8);
  drawSolarPump(20, 13);
}

function drawWetlandReserve() {
  drawBirdHide(18, 5);
  drawReedPlatform(5, 13);
  drawWaterQualityPost(11, 4);
  drawWetlandBird(23, 6);
  drawWetlandBird(8, 6);
  if (state.nature.discoveries.wetlandBirds) drawSmallBanner(17, 4, "静音观鸟");
}

function drawStationDistrict() {
  drawHighSpeedStation(16, 2);
  drawShuttleStop(5, 10);
  drawColdChainDepot(18, 12);
  drawMarketStall(6, 4, "礼盒");
  drawRailLine(10, 6);
}

function drawAlpineTrail() {
  drawSnowMountain();
  drawSnowPass(12, 3);
  drawWeatherStation(21, 5);
  drawAlpineLake(4, 12);
  drawRescueHut(22, 13);
}

function drawTerraceValley() {
  drawTerracedFields(6, 5);
  drawOldForestEdge(23, 4);
  drawTerraceViewpoint(12, 13);
  if (state.nature.discoveries.terracedFields) drawSmallBanner(7, 4, "农事研学");
  if (state.nature.discoveries.oldForest) drawSmallBanner(21, 8, "保育线");
}

function drawSheepPen(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#7a5535";
  ctx.lineWidth = 4;
  ctx.strokeRect(px + 4, py + 10, 150, 104);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 18, py + 2, 70, 18);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("牧场羊圈", px + 28, py + 15);
}

function drawForageShed(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 6, py + 30, 118, 60);
  ctx.fillStyle = "#6b5736";
  ctx.beginPath();
  ctx.moveTo(px, py + 34);
  ctx.lineTo(px + 64, py + 4);
  ctx.lineTo(px + 128, py + 34);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 18, py + 52, 34, 18);
  ctx.fillRect(px + 62, py + 48, 42, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("草料", px + 50, py + 84);
}

function drawCompostYard(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f4b36";
  ctx.fillRect(px + 6, py + 22, 116, 50);
  ctx.fillStyle = "#6f7d45";
  ctx.fillRect(px + 18, py + 12, 82, 28);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 24, py + 25, 68, 20);
  ctx.fillStyle = "#d8c17a";
  ctx.font = "10px sans-serif";
  ctx.fillText("堆肥", px + 48, py + 63);
}

function drawTinySheep(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(px + 8, py + 25, 22, 4);
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 7, py + 13, 22, 14);
  ctx.fillRect(px + 10, py + 8, 14, 10);
  ctx.fillStyle = "#3b2a1d";
  ctx.fillRect(px + 23, py + 15, 6, 7);
  ctx.fillRect(px + 12, py + 27, 3, 5);
  ctx.fillRect(px + 23, py + 27, 3, 5);
}

function drawCraftWorkshop(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 5, py + 34, 150, 82);
  ctx.fillStyle = "#57412f";
  ctx.beginPath();
  ctx.moveTo(px - 4, py + 38);
  ctx.lineTo(px + 80, py + 5);
  ctx.lineTo(px + 164, py + 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 38, py + 54, 84, 18);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "12px sans-serif";
  ctx.fillText(label, px + 64, py + 68);
  ctx.fillStyle = "#6f817f";
  ctx.fillRect(px + 24, py + 82, 34, 22);
  ctx.fillRect(px + 102, py + 82, 28, 22);
}

function drawDryingYard(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#7a5535";
  ctx.lineWidth = 3;
  ctx.strokeRect(px + 6, py + 12, 148, 72);
  ctx.fillStyle = "#d8c17a";
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(px + 18 + i * 32, py + 28, 22, 16);
    ctx.fillRect(px + 18 + i * 32, py + 54, 22, 16);
  }
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("晾晒场", px + 58, py + 82);
}

function drawPumpHouse(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 8, py + 24, 112, 62);
  ctx.fillStyle = "#3c4e5a";
  ctx.fillRect(px + 18, py + 12, 92, 18);
  ctx.fillStyle = "#b8e7f3";
  ctx.fillRect(px + 42, py + 48, 40, 8);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("泵房", px + 52, py + 76);
}

function drawReservoirBasin(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6f817f";
  ctx.fillRect(px + 2, py + 16, 156, 96);
  ctx.fillStyle = "#2f748e";
  ctx.fillRect(px + 12, py + 26, 136, 70);
  ctx.fillStyle = "rgba(190, 231, 243, 0.7)";
  ctx.fillRect(px + 24, py + 42, 90, 8);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px sans-serif";
  ctx.fillText("蓄水池", px + 56, py + 91);
}

function drawSluiceGate(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 6, 56, 48);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 13, py + 12, 38, 10);
  ctx.fillStyle = "#6f817f";
  ctx.fillRect(px + 28, py + 20, 8, 32);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("分水", px + 20, py + 49);
}

function drawSolarPump(x, y) {
  drawSolarPanels(x, y);
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 18, py + 42, 74, 34);
  ctx.fillStyle = "#b8e7f3";
  ctx.fillRect(px + 34, py + 52, 42, 8);
}

function drawBirdHide(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 8, py + 22, 110, 42);
  ctx.fillStyle = "#4f6f4a";
  ctx.fillRect(px + 14, py + 12, 96, 18);
  ctx.fillStyle = "#2f3a2f";
  ctx.fillRect(px + 24, py + 36, 18, 8);
  ctx.fillRect(px + 76, py + 36, 18, 8);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px sans-serif";
  ctx.fillText("观鸟屋", px + 42, py + 58);
}

function drawReedPlatform(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8b613c";
  ctx.fillRect(px + 4, py + 24, 118, 20);
  ctx.fillStyle = "#6f817f";
  for (let i = 0; i < 8; i += 1) {
    ctx.fillRect(px + 10 + i * 13, py + 8 + (i % 2) * 4, 4, 28);
  }
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("芦苇栈道", px + 38, py + 42);
}

function drawWaterQualityPost(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 10, py + 18, 76, 42);
  ctx.fillStyle = "#b8e7f3";
  ctx.fillRect(px + 18, py + 26, 28, 18);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 54, py + 24, 18, 22);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("水质", px + 34, py + 55);
}

function drawWetlandBird(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 12, py + 13, 16, 9);
  ctx.fillStyle = "#3b2a1d";
  ctx.fillRect(px + 25, py + 15, 5, 3);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 14, py + 22, 2, 8);
  ctx.fillRect(px + 22, py + 22, 2, 8);
}

function drawHighSpeedStation(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 8, py + 44, 240, 78);
  ctx.fillStyle = "#d8f1f3";
  ctx.fillRect(px + 20, py + 56, 210, 28);
  ctx.fillStyle = "#557ba3";
  ctx.fillRect(px + 36, py + 92, 46, 30);
  ctx.fillRect(px + 155, py + 92, 46, 30);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 70, py + 18, 112, 28);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "13px sans-serif";
  ctx.fillText("高铁晨谷站", px + 92, py + 37);
}

function drawRailLine(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#4f5557";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(px, py + 8);
  ctx.lineTo(px + 16 * tile, py + 8);
  ctx.moveTo(px, py + 24);
  ctx.lineTo(px + 16 * tile, py + 24);
  ctx.stroke();
  ctx.fillStyle = "#7f786a";
  for (let i = 0; i < 16; i += 1) {
    ctx.fillRect(px + i * 32 + 6, py + 6, 4, 24);
  }
}

function drawSnowPass(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6f817f";
  ctx.fillRect(px + 8, py + 34, 144, 18);
  ctx.fillStyle = "#edf7f8";
  ctx.fillRect(px + 18, py + 16, 120, 22);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px sans-serif";
  ctx.fillText("雪山垭口", px + 52, py + 33);
}

function drawWeatherStation(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 10, py + 32, 76, 54);
  ctx.fillStyle = "#d8f1f3";
  ctx.fillRect(px + 22, py + 42, 24, 18);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 58, py + 44, 16, 16);
  ctx.strokeStyle = "#f4f1df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px + 48, py + 32);
  ctx.lineTo(px + 48, py + 4);
  ctx.moveTo(px + 36, py + 12);
  ctx.lineTo(px + 60, py + 12);
  ctx.stroke();
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("气象", px + 34, py + 80);
}

function drawAlpineLake(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#2f748e";
  ctx.beginPath();
  ctx.ellipse(px + 66, py + 34, 58, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(221, 247, 255, 0.65)";
  ctx.fillRect(px + 34, py + 25, 48, 3);
}

function drawTerracedFields(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? "#78985f" : "#8aaa67";
    ctx.fillRect(px + i * 10, py + 12 + i * 18, 132 - i * 12, 14);
    ctx.fillStyle = "#6b5736";
    ctx.fillRect(px + i * 10, py + 25 + i * 18, 132 - i * 12, 4);
  }
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("梯田", px + 52, py + 82);
}

function drawOldForestEdge(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 5; i += 1) {
    drawPine(px + 16 + (i % 2) * 22, py + 24 + i * 12);
  }
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 8, py + 80, 80, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("老林保护线", px + 16, py + 92);
}

function drawTerraceViewpoint(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6e4c2f";
  ctx.fillRect(px + 8, py + 22, 106, 12);
  ctx.fillRect(px + 16, py + 34, 7, 38);
  ctx.fillRect(px + 96, py + 34, 7, 38);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 18, py + 10, 82, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("观景坡", px + 42, py + 23);
}

function drawRescueHut(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a4a38";
  ctx.fillRect(px + 8, py + 32, 116, 62);
  ctx.fillStyle = "#5f3f23";
  ctx.beginPath();
  ctx.moveTo(px + 2, py + 36);
  ctx.lineTo(px + 64, py + 6);
  ctx.lineTo(px + 126, py + 36);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 54, py + 48, 26, 10);
  ctx.fillRect(px + 62, py + 40, 10, 26);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("救援屋", px + 45, py + 88);
}

function drawSnowMountain() {
  ctx.fillStyle = "#8c9695";
  ctx.beginPath();
  ctx.moveTo(4 * tile, 5 * tile);
  ctx.lineTo(10 * tile, tile);
  ctx.lineTo(16 * tile, 5 * tile);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#edf7f8";
  ctx.beginPath();
  ctx.moveTo(8 * tile, 2 * tile);
  ctx.lineTo(10 * tile, tile);
  ctx.lineTo(12 * tile, 2 * tile + 18);
  ctx.lineTo(10 * tile + 4, 3 * tile);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#76817f";
  ctx.beginPath();
  ctx.moveTo(15 * tile, 5 * tile);
  ctx.lineTo(22 * tile, tile + 8);
  ctx.lineTo(27 * tile, 5 * tile);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e8f5f6";
  ctx.beginPath();
  ctx.moveTo(20 * tile, tile + 16);
  ctx.lineTo(22 * tile, tile + 8);
  ctx.lineTo(24 * tile, 2 * tile + 20);
  ctx.lineTo(22 * tile, 3 * tile);
  ctx.closePath();
  ctx.fill();
}

function drawLookout(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6e4c2f";
  ctx.fillRect(px + 6, py + 28, 84, 12);
  ctx.fillRect(px + 12, py + 40, 8, 24);
  ctx.fillRect(px + 72, py + 40, 8, 24);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 10, py + 8, 72, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px monospace";
  ctx.fillText("观景台", px + 26, py + 23);
}

function drawRiverDock(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#7a5535";
  ctx.fillRect(px + 2, py + 5, 86, 16);
  ctx.fillRect(px + 10, py + 21, 8, 36);
  ctx.fillRect(px + 68, py + 21, 8, 36);
  ctx.fillStyle = "#cdbd82";
  ctx.fillRect(px + 16, py + 32, 54, 10);
  drawFishingBobber(px + 84, py + 58);
}

function drawHomestaySite(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#795c3d";
  ctx.fillRect(px + 4, py + 34, 152, 50);
  ctx.fillStyle = "#b7a36f";
  ctx.fillRect(px + 10, py + 42, 44, 10);
  ctx.fillRect(px + 72, py + 42, 66, 10);
  ctx.fillStyle = "#d7c076";
  ctx.fillRect(px + 28, py + 8, 96, 24);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "12px monospace";
  ctx.fillText("民宿选址", px + 48, py + 24);
}

function drawScenicSign(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 2, py, 60, 24);
  ctx.fillStyle = "#d6bb75";
  ctx.fillRect(px + 7, py + 4, 50, 14);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px monospace";
  ctx.fillText("景区", px + 20, py + 15);
}

function drawBambooGrove(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 8; i += 1) {
    const bx = px + 8 + (i % 4) * 17;
    const by = py + 8 + Math.floor(i / 4) * 22;
    ctx.fillStyle = "#2d7a43";
    ctx.fillRect(bx, by - 6, 4, 34);
    ctx.fillStyle = "#75b86e";
    ctx.fillRect(bx - 5, by + 2, 14, 3);
    ctx.fillRect(bx - 4, by + 13, 12, 3);
  }
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 13, py - 5, 54, 17);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("竹林", px + 28, py + 7);
}

function drawStoneHouse(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#77766f";
  ctx.fillRect(px + 5, py + 22, 86, 42);
  ctx.fillStyle = "#55524d";
  ctx.beginPath();
  ctx.moveTo(px, py + 24);
  ctx.lineTo(px + 48, py + 2);
  ctx.lineTo(px + 96, py + 24);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#3d332b";
  ctx.fillRect(px + 40, py + 42, 18, 22);
  ctx.fillStyle = "#a7b0ad";
  ctx.fillRect(px + 15, py + 34, 18, 14);
  ctx.fillRect(px + 65, py + 34, 16, 14);
}

function drawTourRoute() {
  const route = [
    [15, 18],
    [15, 15],
    [9, 15],
    [4, 12],
    [15, 10],
    [21, 12],
    [7, 6]
  ];
  ctx.strokeStyle = "rgba(255, 225, 138, 0.85)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  route.forEach(([x, y], index) => {
    const px = x * tile + 16;
    const py = y * tile + 16;
    if (index === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.stroke();
  ctx.fillStyle = "#ffe18a";
  for (const [x, y] of route) {
    ctx.fillRect(x * tile + 12, y * tile + 12, 8, 8);
  }
}

function drawTourismFacilities() {
  const built = state.tourism.facilities;
  if (built.guideSigns) {
    drawScenicGuidePost(15, 17, "入口");
    drawScenicGuidePost(9, 15, "民宿");
    drawScenicGuidePost(21, 12, "河谷");
    drawScenicGuidePost(7, 6, "雪山");
  }
  if (built.restStop) {
    drawRestStop(10, 14);
    drawRestStop(6, 7);
  }
  if (built.ecoToilet) {
    drawEcoToilet(12, 15);
  }
  if (built.trashStation) {
    drawTrashStation(18, 12);
    drawTrashStation(8, 6);
  }
  if (built.solarLights) {
    drawSolarLamp(14, 15);
    drawSolarLamp(17, 12);
    drawSolarLamp(7, 7);
  }
}

function drawScenicGuidePost(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 14, py + 12, 5, 26);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 3, py + 7, 30, 13);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "8px sans-serif";
  ctx.fillText(label, px + 6, py + 17);
}

function drawRestStop(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6e4c2f";
  ctx.fillRect(px + 2, py + 22, 56, 8);
  ctx.fillRect(px + 8, py + 30, 6, 18);
  ctx.fillRect(px + 46, py + 30, 6, 18);
  ctx.fillStyle = "#cdbd82";
  ctx.fillRect(px + 6, py + 13, 48, 9);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "8px sans-serif";
  ctx.fillText("休息", px + 20, py + 22);
}

function drawEcoToilet(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#4f6b54";
  ctx.fillRect(px + 5, py + 8, 54, 44);
  ctx.fillStyle = "#7ead6a";
  ctx.fillRect(px + 1, py + 3, 62, 10);
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 25, py + 28, 14, 24);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("生态厕", px + 14, py + 24);
}

function drawTrashStation(x, y) {
  const px = x * tile;
  const py = y * tile;
  const colors = ["#557ba3", "#7ead6a", "#d8a24d"];
  colors.forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.fillRect(px + 4 + index * 18, py + 18, 14, 24);
    ctx.fillStyle = "#2f3335";
    ctx.fillRect(px + 3 + index * 18, py + 14, 16, 5);
  });
  ctx.fillStyle = "#f4f1df";
  ctx.font = "8px sans-serif";
  ctx.fillText("分类", px + 14, py + 12);
}

function drawHomeInterior() {
  drawInteriorDoor(14, 18);
  drawBed(22, 5);
  drawTable(13, 10);
  drawStove(5, 5);
  drawAquarium(16, 5);
  drawBookshelf(5, 13);
  drawPerson(10, 10);
  drawPetCorner();
  drawHomePets();
  drawWindow(12, 1);
  drawWindow(17, 1);
}

function drawInteriorDoor(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5a3823";
  ctx.fillRect(px, py + 2, tile * 2, tile - 2);
  ctx.fillStyle = "#d4b36a";
  ctx.fillRect(px + 9, py + 18, 4, 4);
}

function drawBed(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5b3928";
  ctx.fillRect(px, py, tile * 3, tile * 2);
  ctx.fillStyle = "#e5d7b9";
  ctx.fillRect(px + 8, py + 7, 34, 20);
  ctx.fillStyle = "#557ba3";
  ctx.fillRect(px + 8, py + 28, 78, 28);
  ctx.fillStyle = "#3d5f86";
  ctx.fillRect(px + 8, py + 44, 78, 12);
}

function drawTable(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6a4127";
  ctx.fillRect(px + 8, py + 8, 80, 44);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 4, py + 4, 88, 14);
  ctx.fillStyle = "#d7c27b";
  ctx.fillRect(px + 38, py + 22, 18, 12);
}

function drawStove(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#4f5557";
  ctx.fillRect(px + 6, py + 5, 52, 54);
  ctx.fillStyle = "#2f3335";
  ctx.fillRect(px + 12, py + 14, 40, 14);
  ctx.fillStyle = "#c66b3d";
  ctx.fillRect(px + 18, py + 38, 28, 8);
}

function drawAquarium(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#4f5f5f";
  ctx.fillRect(px + 4, py + 4, 88, 58);
  ctx.fillStyle = "#88c9d6";
  ctx.fillRect(px + 8, py + 9, 80, 43);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(px + 13, py + 13, 58, 4);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 10, py + 45, 76, 6);
  drawAquariumPlants(px, py);

  const fishInTank = fishOrder.filter((id) => state.aquarium[id] > 0);
  let index = 0;
  for (const id of fishInTank) {
    for (let count = 0; count < state.aquarium[id] && index < aquariumCapacity; count += 1) {
      drawTinyFish(px + 18 + (index % 3) * 22, py + 27 + Math.floor(index / 3) * 11, fishTypes[id].color, index % 2 ? -1 : 1);
      index += 1;
    }
  }

  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px sans-serif";
  ctx.fillText("鱼缸", px + 33, py + 63);
}

function drawAquariumPlants(px, py) {
  ctx.fillStyle = "#2f8b61";
  ctx.fillRect(px + 18, py + 34, 3, 13);
  ctx.fillRect(px + 23, py + 31, 3, 16);
  ctx.fillRect(px + 72, py + 35, 3, 12);
  ctx.fillRect(px + 77, py + 30, 3, 17);
}

function drawTinyFish(cx, cy, color, direction = 1) {
  ctx.fillStyle = color;
  ctx.fillRect(cx - 5, cy - 3, 10, 6);
  ctx.beginPath();
  if (direction > 0) {
    ctx.moveTo(cx - 5, cy);
    ctx.lineTo(cx - 10, cy - 4);
    ctx.lineTo(cx - 10, cy + 4);
  } else {
    ctx.moveTo(cx + 5, cy);
    ctx.lineTo(cx + 10, cy - 4);
    ctx.lineTo(cx + 10, cy + 4);
  }
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#1c2424";
  ctx.fillRect(cx + direction * 3, cy - 1, 2, 2);
}

function drawBookshelf(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5d3824";
  ctx.fillRect(px + 4, py + 2, 88, 58);
  ctx.fillStyle = "#8b5f39";
  ctx.fillRect(px + 8, py + 18, 80, 5);
  ctx.fillRect(px + 8, py + 39, 80, 5);
  const colors = ["#d8b65f", "#6f9ab5", "#b85d54", "#7ead6a"];
  for (let i = 0; i < 10; i += 1) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(px + 12 + i * 7, py + 8 + (i % 2) * 22, 5, 18);
  }
}

function drawWindow(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#3d2a1d";
  ctx.fillRect(px + 3, py + 4, 58, 31);
  ctx.fillStyle = "#9ec6d6";
  ctx.fillRect(px + 8, py + 8, 22, 22);
  ctx.fillRect(px + 34, py + 8, 22, 22);
}

function drawPetCorner() {
  const catBedColor = state.petLife.bedLevel >= 3 ? "#d08a52" : state.petLife.bedLevel >= 2 ? "#c77d8c" : "#b85d54";
  const dogBedColor = state.petLife.bedLevel >= 3 ? "#6aa17a" : state.petLife.bedLevel >= 2 ? "#6f91b8" : "#557ba3";
  drawPetBed(7, 15, catBedColor);
  drawPetToyBox(11, 15);
  drawPetBed(19, 15, dogBedColor);
  drawPetBowl(18, 15);
}

function drawPetBed(x, y, color) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5b3928";
  ctx.fillRect(px + 4, py + 16, 56, 22);
  ctx.fillStyle = color;
  ctx.fillRect(px + 8, py + 12, 48, 22);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fillRect(px + 15, py + 17, 20, 4);
  if (state.petLife.bedLevel >= 2) {
    ctx.fillStyle = "#f2d083";
    ctx.fillRect(px + 18, py + 25, 24, 5);
  }
  if (state.petLife.bedLevel >= 3) {
    ctx.fillStyle = "#7fb3a3";
    ctx.fillRect(px + 8, py + 8, 8, 8);
    ctx.fillRect(px + 45, py + 8, 8, 8);
  }
}

function drawPetToyBox(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = state.petLife.toyOwned ? "#8a6f4b" : "#6d5a4c";
  ctx.fillRect(px + 8, py + 20, 48, 16);
  ctx.fillStyle = "#d9b46f";
  ctx.fillRect(px + 12, py + 16, 40, 6);
  if (state.petLife.toyOwned) {
    ctx.fillStyle = "#d85f55";
    ctx.fillRect(px + 16, py + 10, 7, 7);
    ctx.fillStyle = "#5d8fd1";
    ctx.fillRect(px + 30, py + 9, 6, 15);
    ctx.fillStyle = "#f1d56b";
    ctx.fillRect(px + 43, py + 13, 9, 5);
  }
}

function drawPetBowl(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6f8fa6";
  ctx.fillRect(px + 8, py + 18, 48, 13);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 16, py + 15, 32, 7);
}

function drawHomePets() {
  if (state.pets.cat.adopted) drawCat(petDefinitions.cat.homeX, petDefinitions.cat.homeY, petFestivalOutfit("cat"));
  if (state.pets.dog.adopted) drawDog(petDefinitions.dog.homeX, petDefinitions.dog.homeY, petFestivalOutfit("dog"));
}

function drawMapGate() {
  const gateX = state.map === "farm" ? (world.width - 1) * tile : 0;
  const label = state.map === "farm" ? "村子" : "农场";
  ctx.fillStyle = "#8b6b3d";
  ctx.fillRect(gateX, 8 * tile, tile, 5 * tile);
  ctx.fillStyle = "#d9c17d";
  ctx.fillRect(gateX + (state.map === "farm" ? 4 : 6), 9 * tile + 10, 20, 48);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px monospace";
  ctx.save();
  if (state.map === "farm") {
    ctx.translate(gateX + 8, 10 * tile + 23);
  } else {
    ctx.translate(gateX + 25, 10 * tile + 23);
  }
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(label, -14, 0);
  ctx.restore();
}

function drawVillage() {
  drawVillageStreetUpgrades(villageStage());
  drawShop(4, 4);
  drawPetAdoption(9, 5);
  drawNoticeBoard(14, 6);
  drawOrderBoard(17, 6);
  drawVisitorCenter(17, 2);
  drawInfrastructureBoard(2, 4);
  drawToolWorkshop(6, 13);
  drawTownHouse(20, 4, "#8a5f73", "诊");
  drawTownHouse(20, 12, "#7b704b", "茶");
  drawFountain(13, 11);
  drawCharterBoard(13, 15);
  drawVillageProgress();
  drawCurrentFestivalDecorations();
  drawVillageNpcs();
}

function drawOrderBoard(x, y) {
  const px = x * tile;
  const py = y * tile;
  const order = currentCommunityOrder();
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 7, 56, 44);
  ctx.fillStyle = order ? "#f0d58a" : "#c6b37a";
  ctx.fillRect(px + 9, py + 12, 46, 29);
  ctx.fillStyle = order ? "#b94e45" : "#6b5736";
  ctx.fillRect(px + 13, py + 16, 38, 6);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText(order ? "订单" : "公告", px + 20, py + 36);
}

function drawVisitorCenter(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (!state.quests.halfDayTrail) {
    ctx.fillStyle = "#6b5736";
    ctx.fillRect(px + 6, py + 28, 84, 6);
    ctx.fillStyle = "#9d6b38";
    ctx.fillRect(px + 12, py + 18, 10, 20);
    ctx.fillRect(px + 70, py + 18, 10, 20);
    ctx.strokeStyle = "#d8c17a";
    ctx.lineWidth = 2;
    ctx.strokeRect(px + 22, py + 14, 48, 22);
    ctx.fillStyle = "#d8c17a";
    ctx.font = "9px sans-serif";
    ctx.fillText("游客中心", px + 26, py + 29);
    return;
  }
  drawVisitorKiosk(x, y);
}

function drawInfrastructureBoard(x, y) {
  const px = x * tile;
  const py = y * tile;
  const ready = canStartInfrastructure();
  ctx.fillStyle = ready ? "#405b5d" : "#5f4b36";
  ctx.fillRect(px + 4, py + 8, 56, 44);
  ctx.fillStyle = ready ? "#9fd2d0" : "#d8c17a";
  ctx.fillRect(px + 9, py + 13, 46, 26);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("基建", px + 20, py + 30);
  ctx.fillStyle = ready ? "#4a7f8a" : "#7a5a36";
  ctx.fillRect(px + 12, py + 35, 40, 4);
  ctx.fillStyle = infrastructureProjectCount() ? "#f0c76c" : "#6b5736";
  ctx.fillRect(px + 48, py + 8, 8, 8);
}

function drawCharterBoard(x, y) {
  const px = x * tile;
  const py = y * tile;
  const ready = infrastructureComplete();
  ctx.fillStyle = ready ? "#5f3f23" : "#6b5736";
  ctx.fillRect(px + 3, py + 4, 58, 38);
  ctx.fillStyle = ready ? "#f0d58a" : "#c6b37a";
  ctx.fillRect(px + 8, py + 9, 48, 23);
  ctx.fillStyle = state.charter.longTermMode ? "#71b889" : state.charter.developmentCharter ? "#f0c76c" : "#b94e45";
  ctx.fillRect(px + 12, py + 14, 40, 5);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText(ready ? "公约" : "年终", px + 20, py + 29);
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 16, py + 42, 5, 18);
  ctx.fillRect(px + 42, py + 42, 5, 18);
}

function drawToolWorkshop(x, y) {
  const px = x * tile;
  const py = y * tile;
  const level = toolLevel();
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 5, py + 18, 54, 38);
  ctx.fillStyle = level >= 3 ? "#9fb0b8" : "#8a5a33";
  ctx.fillRect(px + 2, py + 8, 60, 14);
  ctx.fillStyle = level >= 4 ? "#f0c76c" : "#c8c2af";
  ctx.fillRect(px + 10, py + 28, 12, 18);
  ctx.fillRect(px + 27, py + 25, 7, 21);
  ctx.fillStyle = "#7f786a";
  ctx.fillRect(px + 23, py + 24, 16, 6);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("工坊", px + 19, py + 52);
}

function drawVillageNpcs() {
  for (const npc of scheduledVillageNpcs()) {
    drawVillageNpc(npc);
  }
}

function drawVillageNpc(npc) {
  const px = npc.x * tile;
  const py = npc.y * tile;
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(px + 8, py + 27, 17, 4);
  ctx.fillStyle = npc.color;
  ctx.fillRect(px + 9, py + 15, 14, 13);
  ctx.fillStyle = "#e0b28a";
  ctx.fillRect(px + 10, py + 7, 12, 10);
  ctx.fillStyle = npc.hair;
  ctx.fillRect(px + 9, py + 5, 14, 5);
  ctx.fillRect(px + 8, py + 8, 3, 6);
  ctx.fillStyle = "#2b2018";
  ctx.fillRect(px + 13, py + 12, 2, 2);
  ctx.fillRect(px + 18, py + 12, 2, 2);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText(npc.shortName, px + 10, py + 27);

  if (currentFestival() || (currentTermOrder() && !isCurrentTermOrderDone())) {
    ctx.fillStyle = currentFestival() ? "#f0c76c" : "#d8c17a";
    ctx.fillRect(px + 20, py + 1, 10, 10);
    ctx.fillStyle = "#3b2a1d";
    ctx.font = "9px sans-serif";
    ctx.fillText(currentFestival() ? "节" : "单", px + 21, py + 10);
  }
}

function drawPetAdoption(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 2, py + 16, 60, 38);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 5, py + 4, 54, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("领养", px + 20, py + 16);
  if (!state.pets.cat.adopted) drawCatAt(px + 15, py + 35);
  if (!state.pets.dog.adopted) drawDogAt(px + 39, py + 35);
}

function drawVillageProgress() {
  const stage = villageStage();
  drawVillageStageMarker(11, 6, stage.name);

  if (state.quests.readNotice) {
    drawPosterBoard(13, 5, "助农");
  }

  if (currentTermOrder() && !isCurrentTermOrderDone()) {
    drawSmallBanner(10, 5, "节气订单");
  }

  if (state.quests.visitedClinic) {
    drawProduceBasket(19, 8);
    drawSmallBanner(21, 8, "安心菜篮");
  }

  if (state.quests.visitedCafe) {
    drawMarketStall(18, 15, "试吃");
  }

  if (state.quests.helpedVillage) {
    drawMarketStall(10, 13, "集市");
    drawCrates(9, 15);
    drawPackingTable(9, 14);
  }

  if (state.quests.packagedProduce) {
    drawCourierDepot(2, 13);
  }

  if (state.quests.courierStation) {
    drawLiveBooth(11, 13);
  }

  if (state.quests.cooperativeFounded) {
    drawSmallBanner(16, 5, "合作社");
    drawCooperativeSeal(17, 8);
    drawCrates(15, 8);
  }

  if (state.quests.halfDayTrail) {
    drawSmallBanner(18, 4, "游客服务");
    drawSolarLamp(13, 8);
    drawSolarLamp(16, 8);
    drawSolarLamp(13, 12);
    drawSolarLamp(16, 12);
  }

  if (infrastructureProjectCount() > 0) {
    drawSmallBanner(2, 6, "现代基建");
  }

  if (infrastructureHas("solarMicrogrid")) {
    drawSolarPanels(4, 12);
  }

  if (infrastructureHas("coldChain")) {
    drawColdChainDepot(4, 15);
  }

  if (infrastructureHas("highSpeedShuttle")) {
    drawShuttleStop(1, 9);
  }

  if (infrastructureComplete()) {
    drawFestivalStage(12, 16, state.charter.longTermMode ? "长营" : "大会");
  }

  if (stage.level >= 2) {
    drawFestivalFlags(8, 8);
  }

  if (stage.level >= 3) {
    drawVillageArch(12, 7, "晨谷");
  }

  if (state.quests.courierStation || state.quests.liveStream) {
    drawCommunicationTower(6, 3);
  }

  if (state.tourismOps.limitPolicy) {
    drawQueueMarker(18, 3, "预约");
  }

  if (state.tourismOps.studyRoutes > 0) {
    drawStudyRouteStand(19, 9);
  }

  if (state.tourismOps.homestayPackages > 0 || state.festivalOps.homestayBookings > 0) {
    drawHomestaySign(21, 11);
  }
}

function drawVillageStreetUpgrades(stage) {
  if (stage.level < 2) return;
  ctx.fillStyle = stage.level >= 5 ? "#8e8a76" : "#9a7d55";
  ctx.fillRect(0, 8 * tile + 6, canvas.width, 3 * tile - 12);
  ctx.fillRect(13 * tile + 6, 0, 3 * tile - 12, canvas.height);
  ctx.fillStyle = stage.level >= 5 ? "#d8d0aa" : "#d8c17a";
  for (let x = 0; x < world.width; x += 2) {
    ctx.fillRect(x * tile + 8, 9 * tile + 14, 14, 3);
  }
  for (let y = 0; y < world.height; y += 2) {
    ctx.fillRect(14 * tile + 14, y * tile + 8, 3, 14);
  }
  if (stage.level >= 5) {
    ctx.fillStyle = "rgba(95, 142, 214, 0.25)";
    ctx.fillRect(13 * tile + 6, 0, 3 * tile - 12, canvas.height);
  }
}

function drawVillageArch(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#7a4b2b";
  ctx.fillRect(px + 4, py + 8, 7, 54);
  ctx.fillRect(px + 78, py + 8, 7, 54);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 4, py + 8, 81, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 34, py + 20);
}

function drawCommunicationTower(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#4f5557";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px + 32, py + 8);
  ctx.lineTo(px + 14, py + 62);
  ctx.moveTo(px + 32, py + 8);
  ctx.lineTo(px + 50, py + 62);
  ctx.moveTo(px + 22, py + 34);
  ctx.lineTo(px + 42, py + 34);
  ctx.stroke();
  ctx.strokeStyle = "#f0c76c";
  ctx.beginPath();
  ctx.arc(px + 32, py + 10, 12, -0.6, 0.6);
  ctx.arc(px + 32, py + 10, 22, -0.45, 0.45);
  ctx.stroke();
}

function drawQueueMarker(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 8, py + 8, 48, 38);
  ctx.fillStyle = "#f0d58a";
  ctx.fillRect(px + 13, py + 13, 38, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText(label, px + 18, py + 27);
  ctx.fillStyle = "#557ba3";
  ctx.fillRect(px + 12, py + 38, 38, 4);
}

function drawStudyRouteStand(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 4, py + 9, 56, 42);
  ctx.fillStyle = "#e7d08a";
  ctx.fillRect(px + 10, py + 14, 44, 26);
  ctx.fillStyle = "#3f8b45";
  ctx.fillRect(px + 15, py + 18, 13, 12);
  ctx.fillStyle = "#9b6c3e";
  ctx.fillRect(px + 33, py + 19, 14, 11);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("研学", px + 20, py + 48);
}

function drawHomestaySign(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#7a4b2b";
  ctx.fillRect(px + 4, py + 20, 58, 30);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 9, py + 10, 48, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("民宿套餐", px + 11, py + 23);
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 15, py + 34, 12, 10);
  ctx.fillRect(px + 36, py + 34, 12, 10);
}

function drawCooperativeSeal(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 8, 56, 42);
  ctx.fillStyle = "#f0d58a";
  ctx.fillRect(px + 9, py + 13, 46, 26);
  ctx.fillStyle = "#b94e45";
  ctx.beginPath();
  ctx.arc(px + 32, py + 26, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4f1df";
  ctx.font = "9px sans-serif";
  ctx.fillText("合", px + 29, py + 30);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("章程", px + 20, py + 49);
}

function drawSolarPanels(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#3c4e5a";
  ctx.fillRect(px + 2, py + 8, 60, 24);
  ctx.fillStyle = "#6fb0c2";
  ctx.fillRect(px + 7, py + 12, 22, 16);
  ctx.fillRect(px + 34, py + 12, 22, 16);
  ctx.strokeStyle = "#f4f1df";
  ctx.lineWidth = 1;
  ctx.strokeRect(px + 7, py + 12, 22, 16);
  ctx.strokeRect(px + 34, py + 12, 22, 16);
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 28, py + 32, 5, 18);
}

function drawColdChainDepot(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 4, py + 12, 58, 42);
  ctx.fillStyle = "#d8f1f3";
  ctx.fillRect(px + 10, py + 18, 46, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("冷链", px + 20, py + 32);
  ctx.fillStyle = "#7cc8da";
  ctx.fillRect(px + 12, py + 42, 10, 8);
  ctx.fillRect(px + 42, py + 42, 10, 8);
}

function drawShuttleStop(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 8, py + 4, 48, 14);
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 14, py + 18, 5, 35);
  ctx.fillRect(px + 44, py + 18, 5, 35);
  ctx.fillStyle = "#557ba3";
  ctx.fillRect(px + 6, py + 36, 52, 17);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "8px sans-serif";
  ctx.fillText("高铁接驳", px + 12, py + 15);
}

function drawVillageStageMarker(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 2, py + 6, 92, 18);
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 8, py + 24, 5, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 12, py + 19);
}

function drawPosterBoard(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 8, 56, 42);
  ctx.fillStyle = "#e7d08a";
  ctx.fillRect(px + 10, py + 13, 44, 28);
  ctx.fillStyle = "#b94e45";
  ctx.fillRect(px + 14, py + 17, 36, 6);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 18, py + 36);
}

function drawProduceBasket(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#7a4b2b";
  ctx.fillRect(px + 5, py + 16, 54, 24);
  ctx.fillStyle = "#9d6b38";
  ctx.fillRect(px + 9, py + 12, 46, 8);
  ctx.fillStyle = "#65b96f";
  ctx.fillRect(px + 12, py + 7, 10, 10);
  ctx.fillStyle = "#e7dce7";
  ctx.fillRect(px + 26, py + 5, 12, 12);
  ctx.fillStyle = "#d96d74";
  ctx.fillRect(px + 42, py + 8, 10, 10);
}

function drawMarketStall(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a4a38";
  ctx.fillRect(px + 4, py + 25, 88, 30);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px, py + 10, 96, 16);
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px + 8, py + 10, 14, 16);
  ctx.fillRect(px + 36, py + 10, 14, 16);
  ctx.fillRect(px + 64, py + 10, 14, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 36, py + 46);
}

function drawCrates(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(px + 4, py + 8, 24, 20);
  ctx.fillRect(px + 32, py + 14, 26, 20);
  ctx.fillStyle = "#65b96f";
  ctx.fillRect(px + 9, py + 4, 8, 8);
  ctx.fillStyle = "#e7dce7";
  ctx.fillRect(px + 39, py + 10, 9, 9);
}

function drawPackingTable(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6a4127";
  ctx.fillRect(px + 2, py + 16, 60, 16);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 7, py + 4, 22, 12);
  ctx.fillRect(px + 34, py + 6, 18, 10);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("分拣", px + 17, py + 29);
}

function drawCourierDepot(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#50646a";
  ctx.fillRect(px + 6, py + 18, 52, 42);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 10, py + 8, 44, 14);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("快递", px + 22, py + 19);
  ctx.fillStyle = "#9d6b38";
  ctx.fillRect(px + 15, py + 34, 16, 14);
  ctx.fillRect(px + 34, py + 40, 14, 12);
}

function drawLiveBooth(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#4f5f77";
  ctx.fillRect(px + 6, py + 8, 52, 28);
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px + 10, py + 12, 26, 18);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 39, py + 14, 8, 8);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("直播", px + 19, py + 32);
}

function drawVisitorKiosk(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("visitorKiosk", x, y)) return;
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 8, py + 18, 80, 44);
  ctx.fillStyle = "#4f5f77";
  ctx.fillRect(px + 2, py + 8, 92, 16);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 18, py + 30, 58, 18);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText("导览", px + 35, py + 43);
}

function drawSmallBanner(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 2, py + 8, Math.min(92, label.length * 12 + 12), 18);
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 26, 5, 20);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 8, py + 21);
}

function drawSolarLamp(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#4f5557";
  ctx.fillRect(px + 14, py + 8, 4, 26);
  ctx.fillStyle = "#2f3335";
  ctx.fillRect(px + 8, py + 4, 22, 6);
  ctx.fillStyle = "#f3d779";
  ctx.fillRect(px + 10, py + 12, 18, 5);
}

function drawCurrentFestivalDecorations() {
  const festival = currentFestival();
  if (!festival) return;

  drawFestivalFlags(7, 8, festival.colors);
  drawFestivalBanner(11, 3, festival.name);
  drawFestivalCrowd(16, 9, festival);
  if (state.festivalOps.menus[festival.id]) drawFestivalFoodTable(18, 13, festival);

  if (festival.id === "springFestival") {
    drawLanternLine(3, 3);
    drawSpringCouplets(4, 4);
    drawGiftBoxes(11, 12);
  } else if (festival.id === "lanternFestival") {
    drawLanternLine(8, 3);
    drawFlowerLanterns(12, 12);
  } else if (festival.id === "qingming") {
    drawWillowDecor(3, 8);
    drawTeaTray(18, 15);
  } else if (festival.id === "dragonBoat") {
    drawAicaoBundle(9, 4);
    drawDragonBoatFloat(12, 12);
  } else if (festival.id === "qixi") {
    drawStarArch(12, 3);
    drawHomestayHearts(20, 12);
  } else if (festival.id === "harvestFestival") {
    drawGrainStacks(9, 13);
    drawFestivalStage(12, 12, "丰收");
  } else if (festival.id === "midAutumn") {
    drawMoonDisplay(12, 3);
    drawMooncakeTable(18, 15);
  } else if (festival.id === "doubleNinth") {
    drawClimbingFlags(16, 3);
    drawChrysanthemumPots(20, 8);
  } else if (festival.id === "winterSolstice") {
    drawSteamStall(18, 15, "热食");
    drawWarmLanterns(20, 4);
  }
}

function drawFestivalCrowd(x, y, festival) {
  const count = 2 + Math.min(4, festivalPrepCount(festival));
  for (let i = 0; i < count; i += 1) {
    const px = (x + (i % 3)) * tile + 2;
    const py = (y + Math.floor(i / 3)) * tile + 5;
    drawPersonSprite(px, py, 0, i % 2 ? festival.colors[0] : festival.colors[1], "#473421");
  }
  if (state.festivalLog[festival.id]) {
    drawSmallBanner(x - 1, y - 1, "客流");
  }
}

function drawFestivalFoodTable(x, y, festival) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6a4127";
  ctx.fillRect(px + 2, py + 20, 92, 18);
  ctx.fillStyle = festival.colors[0];
  ctx.fillRect(px + 8, py + 8, 20, 14);
  ctx.fillStyle = festival.colors[1];
  ctx.fillRect(px + 36, py + 7, 22, 15);
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(px + 66, py + 10, 18, 12);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("节令菜", px + 24, py + 35);
}

function drawFestivalBanner(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "rgba(95, 63, 35, 0.95)";
  ctx.fillRect(px + 2, py + 4, 124, 24);
  ctx.fillStyle = "#f2d987";
  ctx.fillRect(px + 7, py + 8, 114, 16);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "11px sans-serif";
  ctx.fillText(label, px + 48 - Math.min(label.length, 4) * 4, py + 21);
}

function drawFestivalFlags(x, y, colors = ["#f0c76c", "#d45c4b"]) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#d8c17a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + 180, py);
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(px + 12 + i * 22, py);
    ctx.lineTo(px + 22 + i * 22, py + 13);
    ctx.lineTo(px + 32 + i * 22, py);
    ctx.closePath();
    ctx.fill();
  }
}

function drawLanternLine(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#5f3f23";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.lineTo(px + 220, py + 14);
  ctx.stroke();
  for (let i = 0; i < 5; i += 1) {
    drawLantern(px + 18 + i * 45, py + 6 + i * 2);
  }
}

function drawLantern(px, py) {
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px, py, 18, 20);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 3, py + 3, 12, 14);
  ctx.fillStyle = "#8a3c2e";
  ctx.fillRect(px + 7, py + 20, 4, 6);
}

function drawSpringCouplets(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#c83f36";
  ctx.fillRect(px + 20, py + 70, 10, 38);
  ctx.fillRect(px + 126, py + 70, 10, 38);
  ctx.fillStyle = "#f0c76c";
  ctx.font = "8px sans-serif";
  ctx.fillText("福", px + 22, py + 86);
  ctx.fillText("旺", px + 128, py + 86);
}

function drawGiftBoxes(x, y) {
  const px = x * tile;
  const py = y * tile;
  const colors = ["#d45c4b", "#f0c76c", "#557ba3"];
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(px + i * 22, py + 18 - i * 3, 18, 16);
    ctx.fillStyle = "#f7e3a1";
    ctx.fillRect(px + 7 + i * 22, py + 18 - i * 3, 4, 16);
  }
}

function drawFlowerLanterns(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 ? "#f0c76c" : "#d45c4b";
    ctx.beginPath();
    ctx.arc(px + 10 + i * 26, py + 14, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff2b8";
    ctx.fillRect(px + 6 + i * 26, py + 10, 8, 8);
  }
}

function drawWillowDecor(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 14, py + 10, 8, 58);
  ctx.strokeStyle = "#6fae62";
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(px + 18, py + 18 + i * 6);
    ctx.lineTo(px + 42 + i * 3, py + 30 + i * 7);
    ctx.stroke();
  }
}

function drawTeaTray(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6a4127";
  ctx.fillRect(px + 4, py + 20, 70, 15);
  ctx.fillStyle = "#7ead6a";
  ctx.fillRect(px + 12, py + 10, 14, 10);
  ctx.fillRect(px + 34, py + 8, 16, 11);
  ctx.fillStyle = "#e4d18d";
  ctx.fillRect(px + 54, py + 11, 12, 9);
}

function drawAicaoBundle(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#2d7a43";
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.moveTo(px + 10 + i * 4, py + 34);
    ctx.lineTo(px + 5 + i * 6, py + 8);
    ctx.stroke();
  }
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 8, py + 28, 28, 7);
}

function drawDragonBoatFloat(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#7a4b2b";
  ctx.beginPath();
  ctx.moveTo(px, py + 34);
  ctx.lineTo(px + 94, py + 34);
  ctx.lineTo(px + 78, py + 52);
  ctx.lineTo(px + 14, py + 52);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px + 15, py + 20, 46, 14);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 70, py + 24, 18, 10);
}

function drawStarArch(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "#557ba3";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(px + 60, py + 58, 52, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#f0c76c";
  for (let i = 0; i < 5; i += 1) {
    ctx.fillRect(px + 14 + i * 22, py + 34 - Math.abs(2 - i) * 8, 8, 8);
  }
}

function drawHomestayHearts(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px + 20, py + 18, 10, 10);
  ctx.fillRect(px + 31, py + 18, 10, 10);
  ctx.fillRect(px + 25, py + 26, 11, 11);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 48, py + 20, 34, 12);
}

function drawGrainStacks(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = "#d8a24d";
    ctx.beginPath();
    ctx.moveTo(px + 12 + i * 26, py + 10);
    ctx.lineTo(px + 26 + i * 26, py + 45);
    ctx.lineTo(px - 2 + i * 26, py + 45);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8a5a33";
    ctx.fillRect(px + 7 + i * 26, py + 34, 10, 5);
  }
}

function drawFestivalStage(x, y, label) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 4, py + 28, 86, 28);
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(px + 10, py + 14, 74, 16);
  ctx.fillStyle = "#f0c76c";
  ctx.font = "10px sans-serif";
  ctx.fillText(label, px + 34, py + 26);
}

function drawMoonDisplay(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#f0d98c";
  ctx.beginPath();
  ctx.arc(px + 112, py + 16, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(85, 123, 163, 0.35)";
  ctx.beginPath();
  ctx.arc(px + 104, py + 11, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawMooncakeTable(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6a4127";
  ctx.fillRect(px + 4, py + 18, 72, 16);
  ctx.fillStyle = "#d8a24d";
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(px + 15 + i * 15, py + 14, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawClimbingFlags(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 12, py + 8, 5, 62);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 17, py + 9, 56, 18);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("登高", px + 32, py + 22);
}

function drawChrysanthemumPots(x, y) {
  const px = x * tile;
  const py = y * tile;
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = "#8a5a33";
    ctx.fillRect(px + i * 22, py + 24, 16, 12);
    ctx.fillStyle = i % 2 ? "#f0c76c" : "#d8c17a";
    ctx.beginPath();
    ctx.arc(px + 8 + i * 22, py + 17, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSteamStall(x, y, label) {
  drawMarketStall(x, y, label);
  const px = x * tile;
  const py = y * tile;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(px + 18 + i * 14, py + 8);
    ctx.lineTo(px + 22 + i * 14, py - 6);
    ctx.stroke();
  }
}

function drawWarmLanterns(x, y) {
  const px = x * tile;
  const py = y * tile;
  drawLantern(px + 10, py + 18);
  drawLantern(px + 46, py + 18);
}

function drawShop(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("villageShop", x, y)) return;
  ctx.fillStyle = "#9d6a3d";
  ctx.fillRect(px + 4, py + 36, 152, 84);
  ctx.fillStyle = "#4f5f77";
  ctx.beginPath();
  ctx.moveTo(px - 6, py + 40);
  ctx.lineTo(px + 80, py - 10);
  ctx.lineTo(px + 166, py + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(px + 18, py + 50, 118, 18);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "12px monospace";
  ctx.fillText("GENERAL", px + 48, py + 64);
  ctx.fillStyle = "#e7b267";
  ctx.fillRect(px + 68, py + 78, 28, 42);
  ctx.fillStyle = "#8ec0d0";
  ctx.fillRect(px + 20, py + 78, 30, 22);
  ctx.fillRect(px + 110, py + 78, 30, 22);
}

function drawNoticeBoard(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 11, py + 10, 42, 35);
  ctx.fillStyle = "#d6bb75";
  ctx.fillRect(px + 15, py + 14, 34, 24);
  ctx.fillStyle = "#4a3320";
  ctx.fillRect(px + 18, py + 20, 20, 2);
  ctx.fillRect(px + 18, py + 26, 24, 2);
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 18, py + 45, 6, 19);
  ctx.fillRect(px + 40, py + 45, 6, 19);
}

function drawTownHouse(x, y, color, mark) {
  const px = x * tile;
  const py = y * tile;
  const assetId = mark === "诊" ? "clinic" : mark === "茶" ? "teahouse" : "";
  if (assetId && drawMapSprite(assetId, x, y)) return;
  ctx.fillStyle = color;
  ctx.fillRect(px + 8, py + 34, 144, 86);
  ctx.fillStyle = "#57412f";
  ctx.beginPath();
  ctx.moveTo(px, py + 40);
  ctx.lineTo(px + 80, py - 6);
  ctx.lineTo(px + 160, py + 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#dcb35d";
  ctx.fillRect(px + 66, py + 76, 28, 44);
  ctx.fillStyle = "#9fc4c8";
  ctx.fillRect(px + 26, py + 58, 28, 22);
  ctx.fillRect(px + 106, py + 58, 28, 22);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "16px sans-serif";
  ctx.fillText(mark, px + 72, py + 30);
}

function drawFountain(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#6f817f";
  ctx.fillRect(px + 10, py + 56, 108, 16);
  ctx.fillStyle = "#2d7a99";
  ctx.beginPath();
  ctx.ellipse(px + 64, py + 54, 52, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#b8e7f3";
  ctx.fillRect(px + 61, py + 18, 6, 36);
  ctx.fillRect(px + 48, py + 34, 32, 4);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillRect(px + 42, py + 48, 44, 3);
}

function drawHouse(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("farmhouse", x, y)) return;
  ctx.fillStyle = "#8a4a38";
  ctx.fillRect(px + 4, py + 34, 152, 86);
  ctx.fillStyle = "#563129";
  ctx.beginPath();
  ctx.moveTo(px - 8, py + 42);
  ctx.lineTo(px + 80, py - 12);
  ctx.lineTo(px + 168, py + 42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e3b25a";
  ctx.fillRect(px + 68, py + 76, 28, 44);
  ctx.fillStyle = "#77a6bd";
  ctx.fillRect(px + 22, py + 58, 28, 24);
  ctx.fillRect(px + 112, py + 58, 26, 24);
}

function drawMarket(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("seedStand", x, y)) return;
  ctx.fillStyle = "#bc7e45";
  ctx.fillRect(px + 4, py + 16, 88, 46);
  ctx.fillStyle = "#f2d06b";
  ctx.fillRect(px, py + 4, 96, 18);
  ctx.fillStyle = "#7f3f35";
  ctx.fillRect(px + 10, py + 38, 18, 24);
  ctx.fillStyle = "#eff0c8";
  ctx.fillRect(px + 40, py + 32, 34, 14);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "10px monospace";
  ctx.fillText("SEED", px + 42, py + 43);
}

function drawChickenCoop(x, y) {
  const px = x * tile;
  const py = y * tile;
  if (drawMapSprite("chickenCoop", x, y)) {
    const chickenCount = state.livestock.coopBuilt ? state.livestock.chickens : 0;
    for (let i = 0; i < chickenCount; i += 1) {
      drawTinyChicken(px + 15 + i * 18, py + 96 + (i % 2) * 8);
    }
    return;
  }
  ctx.fillStyle = state.livestock.coopBuilt ? "#9d6b38" : "#75624d";
  ctx.fillRect(px + 6, py + 34, 84, 54);
  ctx.fillStyle = state.livestock.coopBuilt ? "#7a3f32" : "#5c5145";
  ctx.beginPath();
  ctx.moveTo(px + 2, py + 38);
  ctx.lineTo(px + 48, py + 10);
  ctx.lineTo(px + 94, py + 38);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 37, py + 58, 22, 30);
  ctx.fillStyle = "#6b5736";
  ctx.fillRect(px + 16, py + 48, 18, 14);
  ctx.fillRect(px + 64, py + 48, 16, 14);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText(state.livestock.coopBuilt ? "鸡舍" : "待建", px + 37, py + 82);
  const chickenCount = state.livestock.coopBuilt ? state.livestock.chickens : 0;
  for (let i = 0; i < chickenCount; i += 1) {
    drawTinyChicken(px + 15 + i * 18, py + 96 + (i % 2) * 8);
  }
}

function drawTinyChicken(cx, cy) {
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(cx, cy, 12, 10);
  ctx.fillStyle = "#f0c76c";
  ctx.fillRect(cx + 9, cy + 3, 5, 3);
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(cx + 3, cy - 3, 5, 4);
  ctx.fillStyle = "#3b2a1d";
  ctx.fillRect(cx + 8, cy + 2, 2, 2);
  ctx.fillStyle = "#8a5a33";
  ctx.fillRect(cx + 3, cy + 10, 2, 4);
  ctx.fillRect(cx + 8, cy + 10, 2, 4);
}

function drawBin(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5c6b66";
  ctx.fillRect(px + 8, py + 18, 48, 38);
  ctx.fillStyle = "#2f3937";
  ctx.fillRect(px + 4, py + 10, 56, 12);
  ctx.fillStyle = "#d2c279";
  ctx.fillRect(px + 18, py + 30, 26, 4);
}

function drawPond(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#2d6f8f";
  ctx.beginPath();
  ctx.ellipse(px + 80, py + 48, 76, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(205,244,255,0.35)";
  ctx.fillRect(px + 38, py + 36, 44, 3);
  ctx.fillRect(px + 92, py + 54, 36, 3);
  drawFishingBobber(px + 115, py + 42);
  if (state.fishing.fishPond) {
    ctx.strokeStyle = "#d8c17a";
    ctx.lineWidth = 3;
    ctx.strokeRect(px + 24, py + 18, 70, 48);
    ctx.fillStyle = "#d8c17a";
    ctx.font = "10px sans-serif";
    ctx.fillText(state.fishing.pondSpecies ? `${state.fishing.pondStock}尾` : "鱼塘", px + 46, py + 48);
  }
}

function drawFisheryBoard(x, y) {
  const px = x * tile;
  const py = y * tile;
  ctx.fillStyle = "#5f3f23";
  ctx.fillRect(px + 5, py + 2, 54, 25);
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 10, py + 6, 44, 13);
  ctx.fillStyle = "#3b2a1d";
  ctx.font = "9px sans-serif";
  ctx.fillText("渔具", px + 20, py + 17);
  ctx.strokeStyle = "#c8c2af";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(px + 52, py + 29);
  ctx.lineTo(px + 62, py + 3);
  ctx.stroke();
  drawTinyFish(px + 14, py + 30, "#d08c4e");
}

function drawFishingBobber(cx, cy) {
  const bob = Math.sin(performance.now() / 240) * 2;
  ctx.fillStyle = "#f4f1df";
  ctx.fillRect(cx - 3, cy - 5 + bob, 6, 5);
  ctx.fillStyle = "#d45c4b";
  ctx.fillRect(cx - 3, cy + bob, 6, 5);
  ctx.strokeStyle = "rgba(244, 241, 223, 0.55)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy + bob, 12, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPlayer() {
  const px = state.player.x * tile;
  const py = state.player.y * tile;
  const bob = state.player.moving > 0 ? Math.sin(state.player.moving) * 2 : 0;
  drawPersonSprite(px, py, bob, "#304c75", "#613b24");
}

function drawPerson(x, y) {
  drawPersonSprite(x * tile, y * tile, 0, "#7b5fa3", "#d8b15a");
  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px monospace";
  ctx.fillText("林", x * tile + 10, y * tile - 3);
}

function drawPersonSprite(px, py, bob, shirt, hair) {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(px + 8, py + 25, 18, 5);
  ctx.fillStyle = shirt;
  ctx.fillRect(px + 10, py + 13 + bob, 12, 14);
  ctx.fillStyle = "#e7b07d";
  ctx.fillRect(px + 10, py + 5 + bob, 12, 10);
  ctx.fillStyle = hair;
  ctx.fillRect(px + 8, py + 2 + bob, 16, 5);
  ctx.fillStyle = "#2a2f38";
  ctx.fillRect(px + 8, py + 26 + bob, 5, 5);
  ctx.fillRect(px + 19, py + 26 + bob, 5, 5);
}

function drawFollowerPets() {
  if (state.map === "home") return;
  const followers = adoptedPetEntries().filter(([, pet]) => pet.following);
  followers.forEach(([id], index) => {
    drawFollowerPet(id, index);
  });
}

function drawFollowerPet(id, index) {
  const side = index === 0 ? -1 : 1;
  const px = state.player.x * tile + 16 - state.player.dirX * 18 + side * 16;
  const py = state.player.y * tile + 22 - state.player.dirY * 13 + index * 7;
  if (id === "cat") drawCatAt(px, py, petFestivalOutfit(id));
  if (id === "dog") drawDogAt(px, py, petFestivalOutfit(id));
}

function drawCat(x, y, outfit = "") {
  drawCatAt(x * tile + 16, y * tile + 20, outfit);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px monospace";
  ctx.fillText("猫", x * tile + 10, y * tile - 3);
}

function drawDog(x, y, outfit = "") {
  drawDogAt(x * tile + 16, y * tile + 21, outfit);
  ctx.fillStyle = "#f4f1df";
  ctx.font = "10px monospace";
  ctx.fillText("狗", x * tile + 10, y * tile - 3);
}

function drawCatAt(cx, cy, outfit = "") {
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(cx - 9, cy + 8, 18, 4);
  ctx.fillStyle = "#6f6a64";
  ctx.fillRect(cx - 8, cy - 3, 16, 12);
  ctx.fillRect(cx - 6, cy - 12, 12, 10);
  ctx.fillStyle = "#4f4b47";
  ctx.beginPath();
  ctx.moveTo(cx - 6, cy - 11);
  ctx.lineTo(cx - 10, cy - 17);
  ctx.lineTo(cx - 2, cy - 12);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 6, cy - 11);
  ctx.lineTo(cx + 10, cy - 17);
  ctx.lineTo(cx + 2, cy - 12);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#2a2f38";
  ctx.fillRect(cx - 4, cy - 8, 2, 2);
  ctx.fillRect(cx + 3, cy - 8, 2, 2);
  ctx.fillStyle = "#6f6a64";
  ctx.fillRect(cx + 8, cy + 1, 9, 4);
  drawPetOutfit(cx, cy, outfit, "cat");
}

function drawDogAt(cx, cy, outfit = "") {
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(cx - 11, cy + 8, 22, 4);
  ctx.fillStyle = "#9a6b42";
  ctx.fillRect(cx - 10, cy - 2, 20, 12);
  ctx.fillRect(cx - 7, cy - 12, 14, 11);
  ctx.fillStyle = "#6f472c";
  ctx.fillRect(cx - 11, cy - 10, 5, 9);
  ctx.fillRect(cx + 6, cy - 10, 5, 9);
  ctx.fillStyle = "#2a2f38";
  ctx.fillRect(cx - 4, cy - 8, 2, 2);
  ctx.fillRect(cx + 3, cy - 8, 2, 2);
  ctx.fillStyle = "#9a6b42";
  ctx.fillRect(cx + 10, cy + 1, 10, 4);
  drawPetOutfit(cx, cy, outfit, "dog");
}

function drawPetOutfit(cx, cy, outfit, id) {
  if (!outfit) return;
  const festival = currentFestival();
  const color = festival?.colors?.[0] || "#d8c17a";
  ctx.fillStyle = color;
  if (id === "cat") {
    ctx.fillRect(cx - 6, cy - 2, 12, 3);
    if (festival) ctx.fillRect(cx + 5, cy + 1, 4, 5);
  } else {
    ctx.fillRect(cx - 7, cy - 2, 14, 4);
    if (festival) ctx.fillRect(cx + 5, cy + 2, 5, 6);
  }
}

function drawTarget() {
  const target = frontTile();
  const tool = tools[state.selected].id;
  const targets = toolTargets(target, tool).filter(({ x, y }) => getPlot(x, y));
  if (!targets.length) return;
  ctx.strokeStyle = "#ffe18a";
  ctx.lineWidth = 2;
  for (const item of targets) {
    ctx.strokeRect(item.x * tile + 4, item.y * tile + 4, tile - 8, tile - 8);
  }
}

function drawPixelFlower(cx, cy, palette = currentSeasonDefinition().palette) {
  ctx.fillStyle = palette.flowerStem;
  ctx.fillRect(cx - 1, cy, 2, 9);
  ctx.fillStyle = palette.flowerA;
  ctx.fillRect(cx - 5, cy - 3, 4, 4);
  ctx.fillRect(cx + 1, cy - 3, 4, 4);
  ctx.fillStyle = palette.flowerB;
  ctx.fillRect(cx - 2, cy - 6, 4, 4);
}

function drawPine(cx, cy, palette = currentSeasonDefinition().palette) {
  ctx.fillStyle = palette.pineTrunk;
  ctx.fillRect(cx - 2, cy + 5, 4, 8);
  ctx.fillStyle = palette.forest[0];
  ctx.beginPath();
  ctx.moveTo(cx, cy - 12);
  ctx.lineTo(cx - 11, cy + 6);
  ctx.lineTo(cx + 11, cy + 6);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = palette.forest[1];
  ctx.beginPath();
  ctx.moveTo(cx, cy - 3);
  ctx.lineTo(cx - 13, cy + 12);
  ctx.lineTo(cx + 13, cy + 12);
  ctx.closePath();
  ctx.fill();
}

function drawRiverSparkle(px, py) {
  ctx.fillStyle = "rgba(221, 247, 255, 0.5)";
  ctx.fillRect(px + 6, py + 9, 14, 2);
  ctx.fillRect(px + 17, py + 22, 10, 2);
}

function drawWetlandRipple(px, py) {
  ctx.fillStyle = "rgba(190, 231, 210, 0.28)";
  ctx.fillRect(px + 7, py + 11, 12, 2);
  ctx.fillRect(px + 18, py + 24, 8, 2);
}

function drawReeds(px, py) {
  ctx.fillStyle = "#5f6f3e";
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(px + 7 + i * 6, py + 8 + (i % 2) * 4, 3, 20);
  }
  ctx.fillStyle = "#d8c17a";
  ctx.fillRect(px + 7, py + 8, 3, 5);
  ctx.fillRect(px + 19, py + 12, 3, 5);
}

function drawTerraceLine(px, py) {
  ctx.fillStyle = "rgba(94, 74, 44, 0.35)";
  ctx.fillRect(px + 3, py + 24, tile - 6, 3);
  ctx.fillStyle = "rgba(214, 230, 170, 0.35)";
  ctx.fillRect(px + 7, py + 10, tile - 14, 2);
}

function drawSnowCap(px, py) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
  ctx.fillRect(px + 6, py + 7, 7, 3);
  ctx.fillRect(px + 20, py + 19, 6, 3);
}

function drawSeasonTint() {
  const tint = currentSeasonDefinition().tint;
  if (!tint) return;
  ctx.fillStyle = tint;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawShade() {
  const phase = currentPhase();
  if (phase.tint) {
    ctx.fillStyle = phase.tint;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (!phase.shade) return;
  ctx.fillStyle = `rgba(18, 26, 54, ${phase.shade})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawWeatherEffects() {
  const weather = currentWeather();
  if (weather.id === "cloudy") {
    ctx.fillStyle = "rgba(72, 82, 82, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (weather.id === "sunny") {
    ctx.fillStyle = "rgba(255, 224, 128, 0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  if (weather.id === "fog") {
    drawFogOverlay();
  }
  if (weather.id === "drizzle" || weather.id === "rain" || weather.id === "storm") {
    drawRainOverlay(weather.id);
  }
  if (weather.id === "snow") {
    drawSnowOverlay();
  }
  if (weather.id === "frost") {
    drawFrostOverlay();
  }
}

function drawRainOverlay(kind) {
  const speed = kind === "drizzle" ? 9 : 16;
  const spacing = kind === "drizzle" ? 42 : 28;
  const length = kind === "drizzle" ? 9 : 17;
  const offset = Math.floor(performance.now() / speed) % spacing;
  ctx.strokeStyle = kind === "storm" ? "rgba(190, 224, 255, 0.58)" : "rgba(170, 215, 236, 0.45)";
  ctx.lineWidth = kind === "drizzle" ? 1 : 2;
  ctx.beginPath();
  for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
    for (let x = -40; x < canvas.width + 40; x += spacing) {
      const sx = x + ((y / spacing) % 2) * 16 + offset;
      const sy = y + offset;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 7, sy + length);
    }
  }
  ctx.stroke();

  if (kind === "storm" && Math.floor(performance.now() / 180) % 18 === 0) {
    ctx.fillStyle = "rgba(255, 246, 190, 0.16)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawFogOverlay() {
  const offset = Math.floor(performance.now() / 80) % 96;
  for (let i = -1; i < 8; i += 1) {
    ctx.fillStyle = `rgba(225, 232, 220, ${i % 2 ? 0.12 : 0.08})`;
    ctx.fillRect((i % 2) * -80 + offset, i * 90 + 20, canvas.width + 160, 30);
  }
}

function drawSnowOverlay() {
  const offset = Math.floor(performance.now() / 90) % 32;
  ctx.fillStyle = "rgba(245, 250, 255, 0.82)";
  for (let y = -32; y < canvas.height + 32; y += 34) {
    for (let x = -20; x < canvas.width + 20; x += 45) {
      const sx = x + ((y / 34) % 2) * 20;
      ctx.fillRect(sx + offset * 0.4, y + offset, 3, 3);
    }
  }
}

function drawFrostOverlay() {
  ctx.fillStyle = "rgba(216, 238, 245, 0.12)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(236, 250, 255, 0.25)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 28, 18);
    ctx.lineTo(x + 10, 35);
    ctx.stroke();
  }
}

function renderPanels() {
  renderStatus();
  renderHotbar();

  const activeSeed = cropTypes[state.activeSeed];
  const storyDone = state.quests.metLin && state.quests.readNotice && state.quests.visitedClinic && state.quests.visitedCafe && state.quests.helpedVillage;
  const mainChapter = currentMainChapter();
  const stage = villageStage();
  const villageUpgradeProgress = Math.round(villageUpgradeProgressRatio() * 100);
  const petSummary = petStatusText();
  const festival = currentFestival();
  const festivalText = festival ? `${festival.name}：${festival.task}` : "暂无，按二十四节气轮换";
  const festivalActivity = currentFestivalActivity();
  const festivalActivityCard = festival && festivalActivity ? `
    <article class="notice-card festival-card ${state.festivalLog[festival.id] && state.festivalOps.menus[festival.id] ? "done-card" : ""}">
      <div class="notice-card-kicker">节日氛围 · ${festival.name}</div>
      <h2>${state.festivalLog[festival.id] ? "节日活动已办起来" : festival.task}</h2>
      <p>${festivalActivityStatusText(festival)}。</p>
      <div class="order-meter" aria-label="节日活动进度">
        <span style="width: ${Math.round(((festivalPrepCount(festival) + (state.festivalLog[festival.id] ? 1 : 0) + (state.festivalOps.menus[festival.id] ? 1 : 0)) / (festivalActivity.steps.length + 2)) * 100)}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>节日游客 ${state.festivalOps.visitors}</span>
        <span>民宿预约 ${state.festivalOps.homestayBookings}</span>
      </div>
      <small>到村子公告栏按 E 做三步节日筹备；节日当天回家靠近炉灶按 E 做限定菜谱：${festivalRecipeProgressText(festivalActivity)}。</small>
    </article>
  ` : "";
  const flowerColorCount = knownFlowerColorCount();
  const flowerOrder = currentFlowerOrder();
  const flowerOrderCard = flowerOrder ? `
    <article class="notice-card flower-card">
      <div class="notice-card-kicker">花艺温室 · 花卉订单</div>
      <h2>${flowerOrder.title}</h2>
      <p>${flowerOrder.description}</p>
      <div class="order-meter" aria-label="花卉订单进度">
        <span style="width: ${Math.round(flowerOrderCompletionRatio(flowerOrder) * 100)}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${flowerOrderRequirementName(flowerOrder)}</span>
        <span>奖励 ${flowerOrder.reward} 金</span>
      </div>
      <small>带齐切花到农场花艺温室按 E 交付；授粉刷可检测基因和定向授粉。</small>
    </article>
  ` : "";
  const fishingOrder = currentFishingOrder();
  const fishingOrderCard = fishingOrder ? `
    <article class="notice-card fishing-card">
      <div class="notice-card-kicker">渔具架 · 鱼鲜订单</div>
      <h2>${fishingOrder.title}</h2>
      <p>${fishingOrder.description}</p>
      <div class="order-meter" aria-label="鱼鲜订单进度">
        <span style="width: ${Math.round(fishingOrderCompletionRatio(fishingOrder) * 100)}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${fishingOrderProgressText(fishingOrder)}</span>
        <span>奖励 ${fishingOrder.reward} 金</span>
      </div>
      <small>到农场池塘边渔具架按 E 交付、升级鱼竿、购买鱼饵或管理生态鱼塘。</small>
    </article>
  ` : "";
  const weather = currentWeather();
  const packaging = currentPackagingDesign();
  const activeAidCase = currentAidCase();
  const aidCard = `
    <article class="notice-card aid-card">
      <div class="notice-card-kicker">真实助农 · 分拣物流</div>
      <h2>${packaging.name}</h2>
      <p>${packaging.description}</p>
      <div class="order-meter" aria-label="分拣质量">
        <span style="width: ${state.aidOps.sortingQuality}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>分拣质量 ${state.aidOps.sortingQuality}/100</span>
        <span>损耗 ${estimateLogisticsLoss()}%</span>
      </div>
      <small>分拣台按 E 做三步分拣；快递驿站按 E 发货；直播间按 E 完成真实案例或查看反馈。</small>
    </article>
  `;
  const aidCaseCard = `
    <article class="notice-card aid-card ${activeAidCase ? "" : "done-card"}">
      <div class="notice-card-kicker">真实助农案例 · 电商合作社</div>
      <h2>${activeAidCase ? activeAidCase.title : "案例链完成"}</h2>
      <p>${activeAidCase ? activeAidCase.reality : "滞销上行、冷链小单、品牌溯源和订单农业已经串成闭环。"}</p>
      <div class="order-meter" aria-label="真实助农案例进度">
        <span style="width: ${Math.round(aidCaseProgressRatio(activeAidCase) * 100)}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>品牌力 ${state.aidCases.brandScore}/100</span>
        <span>影响 ${state.aidCases.caseImpact}</span>
      </div>
      <small>${activeAidCase ? activeAidCase.requirements.map(aidCaseRequirementText).join("；") : `稳定订单 ${state.aidCases.contractOrders} 单，继续直播可做复盘收益。`}</small>
    </article>
  `;
  const upgrade = nextToolUpgrade();
  const upgradeCard = upgrade ? `
    <article class="notice-card tool-card">
      <div class="notice-card-kicker">工具工坊 · 下一次升级</div>
      <h2>${upgrade.name} ${upgrade.range}</h2>
      <p>${upgrade.unlockText}后，可把锄头和水壶升级到${upgrade.range}范围。</p>
      <div class="notice-card-foot">
        <span>${upgrade.isUnlocked() ? "条件已解锁" : upgrade.unlockText}</span>
        <span>${upgrade.money ? `${state.money}/${upgrade.money} 金` : "自动解锁"}</span>
      </div>
      <small>材料：${materialRequirementText(upgrade.materials)}。${upgrade.level === 2 ? "完成助农集市后自动升级。" : "到村子工具工坊按 E 升级。"}</small>
    </article>
  ` : `
    <article class="notice-card tool-card done-card">
      <div class="notice-card-kicker">工具工坊 · 当前最高</div>
      <h2>${toolStageText()}</h2>
      <p>当前原型的工具升级已经完成，后续可以扩展自动化农机和无人机。</p>
    </article>
  `;
  const termOrder = currentTermOrder();
  const termOrderDone = isCurrentTermOrderDone();
  const termOrderText = termOrder
    ? `${termOrder.title}：${termOrderDone ? "已完成" : `${orderProgressText(termOrder)}，奖励 ${termOrder.reward} 金`}`
    : "暂无";
  const termOrderPercent = termOrder ? Math.round(orderCompletionRatio(termOrder) * 100) : 0;
  const communityOrder = currentCommunityOrder();
  const hasLockedCommunityOrders = communityOrderDefinitions.some((order) => (
    !state.communityOrders[order.id] && !isCommunityOrderUnlocked(order)
  ));
  const communityOrderPercent = communityOrder ? Math.round(communityOrderCompletionRatio(communityOrder) * 100) : 0;
  const communityOrderText = communityOrder
    ? `${communityOrder.title}：${communityOrderProgressText(communityOrder)}，奖励 ${communityOrder.reward} 金`
    : hasLockedCommunityOrders ? "先走访卫生站、茶铺或推进旅游后刷新" : "当前可接社区订单已完成";
  const termOrderCard = termOrder ? `
    <article class="notice-card ${termOrderDone ? "done-card" : ""}">
      <div class="notice-card-kicker">村子公告栏 · ${currentSolarTerm()}订单</div>
      <h2>${termOrder.title}</h2>
      <p>${termOrder.description}</p>
      <div class="order-meter" aria-label="订单进度">
        <span style="width: ${termOrderDone ? 100 : termOrderPercent}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${termOrderDone ? "已完成" : orderProgressText(termOrder)}</span>
        <span>奖励 ${termOrder.reward} 金</span>
      </div>
      <small>${termOrderDone ? "等下个节气刷新新订单。" : "带齐物资，到村子公告栏按 E 交付。"}</small>
    </article>
  ` : "";
  const communityOrderCard = communityOrder ? `
    <article class="notice-card facility-card">
      <div class="notice-card-kicker">合作社订单板 · 社区订单</div>
      <h2>${communityOrder.title}</h2>
      <p>${communityOrder.description}</p>
      <div class="order-meter" aria-label="社区订单进度">
        <span style="width: ${communityOrderPercent}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${communityOrderProgressText(communityOrder)}</span>
        <span>奖励 ${communityOrder.reward} 金</span>
      </div>
      <small>到村子合作社订单板按 E 交付。后续订单会随走访、集市和旅游开发刷新。</small>
    </article>
  ` : "";
  const cooperativePercent = Math.round(cooperativeReadinessRatio() * 100);
  const cooperativeCard = `
    <article class="notice-card cooperative-card ${state.quests.cooperativeFounded ? "done-card" : ""}">
      <div class="notice-card-kicker">主线第四章 · 合作社成立</div>
      <h2>${state.quests.cooperativeFounded ? "晨谷合作社已成立" : "筹备村级合作社"}</h2>
      <p>${state.quests.cooperativeFounded ? "村里的订单、分级、品牌和公共设施开始统一运营。" : "先证明集市、标准化分拣和社区订单都能跑通，再让村民一起签下合作社章程。"}</p>
      <div class="order-meter" aria-label="合作社筹备进度">
        <span style="width: ${state.quests.cooperativeFounded ? 100 : cooperativePercent}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${cooperativeStatusText()}</span>
        <span>${state.quests.cooperativeFounded ? `${cooperativeCapabilityCount()} 项能力` : `${cooperativePercent}%`}</span>
      </div>
      <small>${state.quests.cooperativeFounded ? "后续花艺温室、生态鱼塘、快递和旅游服务都按合作社品牌归口。" : "条件满足后，到村子合作社订单板按 E 发起成立。"}</small>
    </article>
  `;
  const villageUpgradeCard = `
    <article class="notice-card cooperative-card ${villageUpgradeCount() >= villageUpgradeDefinitions.length ? "done-card" : ""}">
      <div class="notice-card-kicker">主线村庄 · 建筑更新</div>
      <h2>${stage.name} · ${villageUpgradeStatusText()}</h2>
      <p>村庄建筑和主街会随主线节点变化：从集市棚、快递直播、合作社门面，到旅游导览、公共基建、高铁接驳和发展公约广场。</p>
      <div class="order-meter" aria-label="村庄建筑更新进度">
        <span style="width: ${villageUpgradeProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>建筑变化 ${villageUpgradeCount()}/${villageUpgradeDefinitions.length}</span>
        <span>${mainChapter.title}</span>
      </div>
      ${villageUpgradeMarkup()}
      <small>这些变化是主线进度的可视化反馈，回到村子地图能直接看到门面、路牌、铺装和公共设施变化。</small>
    </article>
  `;
  const scenicProgress = Math.round(scenicRouteProgressRatio() * 100);
  const scenicCard = `
    <article class="notice-card scenic-card ${state.quests.halfDayTrail ? "done-card" : ""}">
      <div class="notice-card-kicker">主线第五章 · 后山手绘地图</div>
      <h2>${state.quests.halfDayTrail ? "半日徒步线已开放" : "调查后山资源点"}</h2>
      <p>${scenicRouteStatusText()}</p>
      ${scenicMapMarkup()}
      <div class="order-meter" aria-label="后山路线规划进度">
        <span style="width: ${scenicProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>资源点 ${scenicResourceCount()}/${scenicResourceDefinitions.length}</span>
        <span>路线 ${state.tourism.routes ? "已开放" : `${scenicProgress}%`}</span>
      </div>
      ${scenicResourceJournalMarkup()}
      <small>${state.quests.halfDayTrail ? "继续补齐资源点图鉴，后续可接民宿、研学和生态配套。" : "从村子北侧进入山谷景区，靠近资源点按 E 调研；满 3 个点后到景区规划牌开放路线。"}</small>
    </article>
  `;
  const natureCard = `
    <article class="notice-card scenic-card ${natureDiscoveryCount() >= 4 ? "done-card" : ""}">
      <div class="notice-card-kicker">自然风光 · 扩展探索</div>
      <h2>${natureExplorationStatusText()}</h2>
      <p>河湾湿地、梯田林缘、高山水源地和老林缘生态带会把景区从“看风景”扩展成“边开发边保护”的自然系统。</p>
      <div class="order-meter" aria-label="自然风光探索进度">
        <span style="width: ${Math.min(100, natureDiscoveryCount() * 25)}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>吸引力 +${natureDiscoveryCount() * 5}</span>
        <span>生态保护 ${state.nature.protectionScore}</span>
      </div>
      <small>路线：河湾水利向东进入湿地；山谷景区向东进入梯田林缘；雪山步道可记录高山水源地。</small>
    </article>
  `;
  const tourismFacilityProgress = Math.round(tourismFacilityProgressRatio() * 100);
  const tourismOperationProgress = Math.round(tourismOperationProgressRatio() * 100);
  const tourismCard = `
    <article class="notice-card tourism-card ${tourismFacilityCount() >= tourismFacilityDefinitions.length ? "done-card" : ""}">
      <div class="notice-card-kicker">主线第六章 · 农文旅配套</div>
      <h2>${state.quests.halfDayTrail ? `景区配套 ${tourismFacilityCount()}/${tourismFacilityDefinitions.length}` : "等待半日线开放"}</h2>
      <p>${state.quests.halfDayTrail ? `${tourismFacilityStatusText()}。生态状态：${tourismEcoStatusText()}。` : "先完成后山调研并开放半日徒步线，再建设服务和生态配套。"}</p>
      <div class="order-meter" aria-label="旅游配套建设进度">
        <span style="width: ${tourismFacilityProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>吸引力 ${state.tourism.appeal}</span>
        <span>生态压力 ${state.tourism.ecoPressure}</span>
      </div>
      ${tourismFacilityMarkup()}
      <small>${state.quests.halfDayTrail ? "到后山景区规划牌按 E 按顺序建设配套。配套会增加游客收益，并抵消过度客流带来的生态压力。" : "景区配套不会提前建设，先调研再开发。"}</small>
    </article>
  `;
  const tourismOpsCard = `
    <article class="notice-card tourism-card ${state.tourismOps.reputation >= 50 && state.tourismOps.homestayPackages >= 1 ? "done-card" : ""}">
      <div class="notice-card-kicker">旅游经营 · 口碑和套餐</div>
      <h2>${state.quests.halfDayTrail ? tourismReputationName() : "等待半日线开放"}</h2>
      <p>${tourismOperationStatusText()}。</p>
      <div class="order-meter" aria-label="旅游经营进度">
        <span style="width: ${tourismOperationProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>承载 ${tourismDailyCapacity()} 批/日</span>
        <span>评价 ${state.tourismOps.reviews} 次</span>
      </div>
      <small>${state.quests.halfDayTrail ? "基础景区配套建完后，到后山景区规划牌按 E 继续做限流、研学路线、民宿套餐和口碑复盘。" : "先调研后山资源点并开放半日徒步线。"}</small>
    </article>
  `;
  const infrastructureProgress = Math.round(infrastructureProgressRatio() * 100);
  const infrastructureCard = `
    <article class="notice-card infrastructure-card ${infrastructureProjectCount() >= infrastructureProjectDefinitions.length ? "done-card" : ""}">
      <div class="notice-card-kicker">主线第七章 · 现代基础设施</div>
      <h2>${canStartInfrastructure() ? `基建项目 ${infrastructureProjectCount()}/${infrastructureProjectDefinitions.length}` : "等待农文旅稳定"}</h2>
      <p>${infrastructureStatusText()}。</p>
      <div class="order-meter" aria-label="现代基础设施进度">
        <span style="width: ${infrastructureProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>${infrastructureBenefitsText()}</span>
        <span>${infrastructureProgress}%</span>
      </div>
      ${infrastructureProjectMarkup()}
      <small>${canStartInfrastructure() ? "到村子左上角村级基建板按 E，按顺序推进水利、电力、冷链、交通和数字农业。" : "先开放半日徒步线、建设 3 项旅游基础服务，并把生态压力控制在 5 以下。"}</small>
    </article>
  `;
  const techCard = `
    <article class="notice-card infrastructure-card ${state.techOps.droneFlights >= 1 && state.techOps.breedingTrials >= 1 ? "done-card" : ""}">
      <div class="notice-card-kicker">科技农业 · 无人机和传感器</div>
      <h2>${techAgricultureUnlocked() ? techRiskLevelText() : "等待数字农业基建"}</h2>
      <p>${techAgricultureStatusText()}。</p>
      <div class="order-meter" aria-label="科技农业进度">
        <span style="width: ${techAgricultureUnlocked() ? Math.min(100, state.techOps.sensorScans * 22 + state.techOps.droneFlights * 28 + state.techOps.breedingTrials * 30) : 0}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>巡田 ${state.techOps.droneFlights} 次</span>
        <span>育种 ${state.techOps.breedingTrials} 次</span>
      </div>
      <small>${techAgricultureUnlocked() ? "到农场左下角无人机停机坪按 E：先读传感器，再放飞无人机；当天都完成后可做抗逆育种筛选。" : "先完成第七章最后一项“无人机与土壤传感器”。"}</small>
    </article>
  `;
  const ratingBreakdown = villageRatingBreakdown();
  const charterProgress = Math.round(charterProgressRatio() * 100);
  const charterCard = `
    <article class="notice-card charter-card ${state.charter.longTermMode ? "done-card" : ""}">
      <div class="notice-card-kicker">主线第八章 · 留下来的村庄</div>
      <h2>${state.charter.longTermMode ? "长期经营已开启" : `村庄评级 ${villageRatingName()}`}</h2>
      <p>${yearEndStatusText()}。</p>
      <div class="order-meter" aria-label="第八章进度">
        <span style="width: ${charterProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>总分 ${villageRatingScore()}/100</span>
        <span>${charterProgress}%</span>
      </div>
      <small>生产 ${ratingBreakdown.production}，生态 ${ratingBreakdown.ecology}，文旅 ${ratingBreakdown.tourism}，基建 ${ratingBreakdown.infrastructure}，文化生活 ${ratingBreakdown.culture}。</small>
      ${charterMilestoneMarkup()}
      <small>${infrastructureComplete() ? "到村子中下方年终公约牌按 E，召开大会、通过公约并开启长期经营。" : "先完成第七章全部基建项目。"}</small>
    </article>
  `;
  const livestockProgress = state.livestock.coopBuilt
    ? Math.min(100, Math.round((state.livestock.chickens / 4) * 100))
    : 0;
  const livestockCard = `
    <article class="notice-card livestock-card ${state.livestock.totalEggs >= 6 && state.livestock.fertilizerUsed >= 3 ? "done-card" : ""}">
      <div class="notice-card-kicker">畜牧业 · 鸡舍</div>
      <h2>${state.livestock.coopBuilt ? `鸡舍 ${state.livestock.chickens}/4` : "建设鸡舍"}</h2>
      <p>${livestockStatusText()}。</p>
      <div class="order-meter" aria-label="畜牧业进度">
        <span style="width: ${livestockProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>累计鸡蛋 ${state.livestock.totalEggs}</span>
        <span>还田 ${state.livestock.fertilizerUsed}</span>
      </div>
      <small>到农场左下角鸡舍按 E：建鸡舍、买鸡、买饲料、喂鸡或把粪肥还田。鸡蛋可出售，也可交民宿早餐订单。</small>
    </article>
  `;
  const craftProgress = Math.min(100, Math.round((Math.min(state.craftOps.batches, 4) / 4) * 100));
  const craftCard = `
    <article class="notice-card craft-card ${state.craftOps.made.souvenirBox > 0 || state.communityOrders.craftSouvenir ? "done-card" : ""}">
      <div class="notice-card-kicker">手工制造业 · 工坊</div>
      <h2>${state.craftOps.batches ? `手作批次 ${state.craftOps.batches}` : "开启手作工坊"}</h2>
      <p>${craftStatusText()}。</p>
      <div class="order-meter" aria-label="手工制造业进度">
        <span style="width: ${craftProgress}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>库存 ${craftItemCount()} 件</span>
        <span>${state.craftOps.standards ? "标准化完成" : "待标准化"}</span>
      </div>
      <small>村子东侧进入手作工坊：竹编工坊、腌制坊、晾晒场和手作集市都可按 E 制作。手作可出售、发快递，也可组合成游客伴手礼。</small>
    </article>
  `;
  const adoptedPets = adoptedPetEntries();
  const bestPetAffection = adoptedPets.reduce((best, [, pet]) => Math.max(best, pet.affection), 0);
  const petProgress = adoptedPets.length ? Math.min(100, Math.round((bestPetAffection / 3) * 100)) : 0;
  const petOutfitSummary = adoptedPets.map(([id]) => `${petDefinitions[id].shortName}${petFestivalOutfit(id)}`).join("、") || "暂无";
  const petLifeProgress = Math.min(100, Math.round((
    (state.petLife.toyOwned ? 25 : 0)
    + (state.petLife.bedLevel - 1) * 20
    + Math.min(25, state.petLife.homestayPhotos * 12)
    + Math.min(10, state.petLife.livestockAssists * 5)
  )));
  const petCard = `
    <article class="notice-card pet-card ${state.petLife.toyOwned && state.petLife.bedLevel >= 2 && state.petLife.homestayPhotos && state.petLife.livestockAssists ? "done-card" : ""}">
      <div class="notice-card-kicker">生活伙伴 · 猫狗</div>
      <h2>${adoptedPets.length ? `${petComfortName()} · ${petFollowCount()}/${adoptedPets.length} 跟随` : "领养猫狗"}</h2>
      <p>${petLifeStatusText()}。${petAdventureStatusText()}</p>
      <div class="order-meter" aria-label="宠物生活进度">
        <span style="width: ${adoptedPets.length ? Math.max(petProgress, petLifeProgress) : 0}%"></span>
      </div>
      <div class="notice-card-foot">
        <span>合影 ${state.petLife.homestayPhotos} 次</span>
        <span>看护 ${state.petLife.livestockAssists} 次</span>
      </div>
      <small>${adoptedPets.length ? `家里宠物窝按 E 升级，玩具箱按 E 购买或陪玩；带宠物去老宅民宿可合影，去鸡舍可看护。节日装扮：${petOutfitSummary}。` : "到村子杂货店旁领养点按 E，可以先领养小猫，再领养小狗。"}</small>
    </article>
  `;
  document.querySelector("#inventory").innerHTML = `
    <ul class="stat-list">
      <li>当前位置：${mapName()}</li>
      <li>画面视角：${viewMode.name}</li>
      <li>地图路线：${regionalRouteText()}</li>
      <li>身份：返乡大学生</li>
      <li>主线：乡村振兴 ${storyDone ? "已启动" : "进行中"}</li>
      <li>主线章节：${mainChapter.title}，${mainChapter.goal}</li>
      <li>村庄阶段：${stage.name}</li>
      <li>村庄建筑更新：${villageUpgradeStatusText()}</li>
      <li>合作社状态：${cooperativeStatusText()}</li>
      <li>时间阶段：${currentPhase().name}，下一阶段：${nextPhaseName()}</li>
      <li>今日天气：${weatherStatusText()}</li>
      <li>四季色彩：${seasonStatusText()}</li>
      <li>节气天气倾向：${weather.note}</li>
      <li>节气农事：${termFarmEffectText()}</li>
      <li>节气订单：${termOrderText}</li>
      <li>社区订单：${communityOrderText}</li>
      <li>当前节日：${festivalText}</li>
      <li>节日活动：${festival ? festivalActivityStatusText(festival) : `累计游客 ${state.festivalOps.visitors}，限定菜谱 ${state.festivalOps.dishesCooked}`}</li>
      <li>村民行程：${villageNpcScheduleText()}</li>
      <li>建筑功能：快递包裹 ${state.facilities.parcelsSent} 箱，游客接待 ${state.facilities.visitorsServed} 批</li>
      <li>助农作业：${aidOpsSummaryText()}</li>
      <li>真实助农案例：${aidCaseStatusText()}</li>
      <li>花艺育种：${flowerBreedingStatusText()}</li>
      <li>花卉订单：${flowerOrder ? `${flowerOrder.title}：${flowerOrderRequirementName(flowerOrder)}` : "当前可接花卉订单已完成或待解锁"}</li>
      <li>工具阶段：${toolStageText()}</li>
      <li>升级材料：${materialsText()}</li>
      <li>下一次升级：${toolUpgradeStatusText()}</li>
      <li>旅游开发：资源点 ${state.tourism.exploredPoints}/5，路线 ${state.tourism.routes}</li>
      <li>旅游配套：${tourismFacilityCount()}/${tourismFacilityDefinitions.length}，${tourismFacilityStatusText()}</li>
      <li>旅游经营：${tourismOperationStatusText()}</li>
      <li>游客口碑：${tourismReputationName()} ${state.tourismOps.reputation}/100，承载 ${tourismDailyCapacity()} 批/日</li>
      <li>后山手绘地图：${scenicRouteStatusText()}</li>
      <li>自然风光探索：${natureExplorationStatusText()}</li>
      <li>景区吸引力：${state.tourism.appeal}，生态压力：${state.tourism.ecoPressure}</li>
      <li>生态状态：${tourismEcoStatusText()}</li>
      <li>现代基建：${infrastructureProjectCount()}/${infrastructureProjectDefinitions.length}，${infrastructureStatusText()}</li>
      <li>基建能力：${infrastructureBenefitsText()}</li>
      <li>科技农业：${techAgricultureStatusText()}</li>
      <li>传感器报告：${state.techOps.sensorReport}</li>
      <li>村庄评级：${villageRatingName()}，${villageRatingScore()}/100</li>
      <li>年终公约：${yearEndStatusText()}</li>
      <li>畜牧业：${livestockStatusText()}</li>
      <li>手工制造业：${craftStatusText()}</li>
      <li>手作库存：${craftInventoryText()}</li>
      <li>宠物：${petSummary}</li>
      <li>宠物探索：后山辅助 ${petAssistTotal()} 次，${petAdventureStatusText()}</li>
      <li>宠物生活：${petLifeStatusText()}</li>
      <li>当前工具：${tools[state.selected].name}</li>
      <li>当前种子：${seedName(state.activeSeed)}，按 Q 切换</li>
      <li>种子：芜菁 ${state.seeds.turnip}，青豆 ${state.seeds.bean}，花种 ${state.seeds.flower}</li>
      <li>芜菁：${state.crops.turnip}，青豆：${state.crops.bean}</li>
      <li>鸡蛋：${state.livestock.eggs}，粪肥：${state.livestock.manure}</li>
      <li>切花：${flowerInventoryText()}</li>
      <li>花色图鉴：${flowerColorCount}/${totalFlowerColorCount()}，靠近成熟花播种可遗传杂交</li>
      <li>钓鱼系统：${fishingSystemText()}</li>
      <li>鱼竿升级：${rodUpgradeStatusText()}</li>
      <li>鱼鲜订单：${fishingOrder ? `${fishingOrder.title}：${fishingOrderProgressText(fishingOrder)}` : "当前可接鱼鲜订单已完成或待解锁"}</li>
      <li>鱼篓：${fishInventoryText()}</li>
      <li>鱼类品质：${fishQualitySummaryText()}</li>
      <li>鱼缸：${aquariumSummaryText()}</li>
      <li>鱼缸评分：${aquariumRatingText()}</li>
      <li>鱼类图鉴：${fishJournalCount()}/${fishOrder.length}</li>
      <li>市场价格：${activeSeed.seedPrice} 金；成熟售价：${activeSeed.sell} 金</li>
    </ul>
  `;

  document.querySelector("#tasks").innerHTML = `
    ${aidCard}
    ${aidCaseCard}
    ${upgradeCard}
    ${flowerOrderCard}
    ${fishingOrderCard}
    ${festivalActivityCard}
    ${termOrderCard}
    ${cooperativeCard}
    ${villageUpgradeCard}
    ${scenicCard}
    ${natureCard}
    ${tourismCard}
    ${tourismOpsCard}
    ${infrastructureCard}
    ${techCard}
    ${charterCard}
    ${livestockCard}
    ${craftCard}
    ${petCard}
    ${communityOrderCard}
    <ul class="task-list">
      <li class="${state.quests.metLin ? "done" : ""}">回家后和林聊聊：${state.quests.metLin ? "完成" : "未完成"}</li>
      <li class="${state.quests.readNotice ? "done" : ""}">去村子公告栏了解需求：${state.quests.readNotice ? "完成" : "未完成"}</li>
      <li class="${state.quests.visitedClinic ? "done" : ""}">拜访卫生站，了解老人需求：${state.quests.visitedClinic ? "完成" : "未完成"}</li>
      <li class="${state.quests.visitedCafe ? "done" : ""}">拜访茶铺，了解农货销路：${state.quests.visitedCafe ? "完成" : "未完成"}</li>
      <li class="${state.quests.visitedScenic ? "done" : ""}">勘察雪山观景点：${state.quests.visitedScenic ? "完成" : "未完成"}</li>
      <li class="${state.quests.surveyedRiver ? "done" : ""}">调研河流亲水路线：${state.quests.surveyedRiver ? "完成" : "未完成"}</li>
      <li class="${state.quests.plannedHomestay ? "done" : ""}">查看民宿选址：${state.quests.plannedHomestay ? "完成" : "未完成"}</li>
      <li class="${state.quests.mappedBamboo ? "done" : ""}">记录竹林研学点：${state.quests.mappedBamboo ? "完成" : "未完成"}</li>
      <li class="${state.quests.surveyedStoneHouse ? "done" : ""}">记录老石屋文化点：${state.quests.surveyedStoneHouse ? "完成" : "未完成"}</li>
      <li class="${state.quests.halfDayTrail ? "done" : ""}">规划第一条半日徒步线：${state.quests.halfDayTrail ? "完成" : `${state.tourism.exploredPoints}/3`}</li>
      <li class="${scenicResourceCount() >= scenicResourceDefinitions.length ? "done" : ""}">补齐后山资源点图鉴：${scenicResourceCount()}/${scenicResourceDefinitions.length}</li>
      <li class="${state.nature.discoveries.wetlandBirds ? "done" : ""}">记录河湾湿地鸟点：${state.nature.discoveries.wetlandBirds ? "完成" : "未完成"}</li>
      <li class="${state.nature.discoveries.terracedFields ? "done" : ""}">记录梯田观景坡：${state.nature.discoveries.terracedFields ? "完成" : "未完成"}</li>
      <li class="${state.nature.discoveries.oldForest ? "done" : ""}">记录老林缘生态带：${state.nature.discoveries.oldForest ? "完成" : "未完成"}</li>
      <li class="${state.nature.protectionScore >= 6 ? "done" : ""}">自然保护分达到 6：${state.nature.protectionScore}/6</li>
      <li class="${tourismFacilityCount() >= 1 ? "done" : ""}">建设第一项景区配套：${tourismFacilityCount()}/${tourismFacilityDefinitions.length}</li>
      <li class="${tourismFacilityCount() >= 3 ? "done" : ""}">补齐 3 项旅游基础服务：${tourismFacilityCount()}/3</li>
      <li class="${state.quests.halfDayTrail && state.tourism.ecoPressure <= 3 ? "done" : ""}">把景区生态压力控制在 3 以下：${state.tourism.ecoPressure}/3</li>
      <li class="${state.tourismOps.limitPolicy ? "done" : ""}">建立景区预约限流：${state.tourismOps.limitPolicy ? "完成" : "未完成"}</li>
      <li class="${state.tourismOps.studyRoutes >= 1 ? "done" : ""}">上线 1 条研学路线：${state.tourismOps.studyRoutes}/1</li>
      <li class="${state.tourismOps.homestayPackages >= 1 ? "done" : ""}">上线 1 个民宿套餐：${state.tourismOps.homestayPackages}/1</li>
      <li class="${state.tourismOps.reputation >= 30 ? "done" : ""}">游客口碑达到 30：${state.tourismOps.reputation}/30</li>
      <li class="${canStartInfrastructure() ? "done" : ""}">启动第七章现代基础设施：${infrastructureReadinessText()}</li>
      <li class="${infrastructureHas("canalRepair") ? "done" : ""}">修复村里水渠：${infrastructureHas("canalRepair") ? "完成" : "未完成"}</li>
      <li class="${infrastructureHas("smartIrrigation") ? "done" : ""}">接入自动灌溉：${infrastructureHas("smartIrrigation") ? "完成" : "未完成"}</li>
      <li class="${infrastructureHas("coldChain") ? "done" : ""}">建设冷链仓降低物流损耗：${infrastructureHas("coldChain") ? "完成" : "未完成"}</li>
      <li class="${infrastructureHas("highSpeedShuttle") ? "done" : ""}">打通高铁站接驳：${infrastructureHas("highSpeedShuttle") ? "完成" : "未完成"}</li>
      <li class="${infrastructureHas("droneSensors") ? "done" : ""}">引入无人机与土壤传感器：${infrastructureHas("droneSensors") ? "完成" : "未完成"}</li>
      <li class="${state.techOps.sensorScans >= 1 ? "done" : ""}">读取 1 次土壤传感器：${state.techOps.sensorScans}/1</li>
      <li class="${state.techOps.droneFlights >= 1 ? "done" : ""}">完成 1 次无人机巡田：${state.techOps.droneFlights}/1</li>
      <li class="${state.techOps.pestPrevented >= 1 ? "done" : ""}">处理 1 次病虫害预警：${state.techOps.pestPrevented}/1</li>
      <li class="${state.techOps.breedingTrials >= 1 ? "done" : ""}">完成 1 次抗逆育种筛选：${state.techOps.breedingTrials}/1</li>
      <li class="${infrastructureProjectCount() >= infrastructureProjectDefinitions.length ? "done" : ""}">完成第七章基建项目：${infrastructureProjectCount()}/${infrastructureProjectDefinitions.length}</li>
      <li class="${state.charter.yearEndMeeting ? "done" : ""}">召开年终乡村振兴大会：${state.charter.yearEndMeeting ? "完成" : infrastructureComplete() ? "可召开" : "等待基建完成"}</li>
      <li class="${villageRatingScore() >= 70 ? "done" : ""}">村庄评级达到 B 级以上：${villageRatingName()} ${villageRatingScore()}/100</li>
      <li class="${state.charter.developmentCharter ? "done" : ""}">通过村庄发展公约：${state.charter.developmentCharter ? "完成" : state.charter.yearEndMeeting ? "待通过" : "未召开大会"}</li>
      <li class="${state.charter.longTermMode ? "done" : ""}">开启长期经营入口：${state.charter.longTermMode ? "完成" : "未开启"}</li>
      <li class="${state.livestock.coopBuilt ? "done" : ""}">建设鸡舍：${state.livestock.coopBuilt ? "完成" : "未完成"}</li>
      <li class="${state.livestock.chickens >= 2 ? "done" : ""}">养到 2 只鸡：${state.livestock.chickens}/2</li>
      <li class="${state.livestock.totalEggs >= 3 ? "done" : ""}">累计收获 3 枚鸡蛋：${state.livestock.totalEggs}/3</li>
      <li class="${state.livestock.fertilizerUsed >= 3 ? "done" : ""}">粪肥还田 3 格：${state.livestock.fertilizerUsed}/3</li>
      <li class="${state.craftOps.made.bambooBasket >= 1 ? "done" : ""}">制作 1 个竹编篮：${state.craftOps.made.bambooBasket}/1</li>
      <li class="${state.craftOps.made.pickles >= 1 ? "done" : ""}">制作 1 份节气腌菜：${state.craftOps.made.pickles}/1</li>
      <li class="${state.craftOps.made.driedVeg >= 1 ? "done" : ""}">制作 1 份风干菜包：${state.craftOps.made.driedVeg}/1</li>
      <li class="${state.craftOps.made.souvenirBox >= 1 || state.communityOrders.craftSouvenir ? "done" : ""}">组合 1 份晨谷伴手礼盒：${state.craftOps.made.souvenirBox + (state.communityOrders.craftSouvenir ? 1 : 0)}/1</li>
      <li class="${state.craftOps.standards ? "done" : ""}">完成手作标准化 3 批：${Math.min(state.craftOps.batches, 3)}/3</li>
      <li class="${state.quests.harvest >= 5 ? "done" : ""}">恢复菜地，收获 5 个作物：${Math.min(state.quests.harvest, 5)}/5</li>
      <li class="${state.quests.sold >= 3 ? "done" : ""}">筹备助农集市，出售 3 个作物：${Math.min(state.quests.sold, 3)}/3</li>
      <li class="${toolLevel() >= 2 ? "done" : ""}">解锁铜制工具横向 3 格：${toolLevel() >= 2 ? "完成" : "完成第一批助农销售"}</li>
      <li class="${toolLevel() >= 3 ? "done" : ""}">升级铁制工具 3x3：${toolLevel() >= 3 ? "完成" : toolUpgradeDefinitions[3].isUnlocked() ? materialRequirementText(toolUpgradeDefinitions[3].materials) : toolUpgradeDefinitions[3].unlockText}</li>
      <li class="${toolLevel() >= 4 ? "done" : ""}">升级金制智能工具 5x5：${toolLevel() >= 4 ? "完成" : toolUpgradeDefinitions[4].isUnlocked() ? materialRequirementText(toolUpgradeDefinitions[4].materials) : toolUpgradeDefinitions[4].unlockText}</li>
      <li class="${state.quests.packagedProduce ? "done" : ""}">滞销农产品分级打包：${state.quests.packagedProduce ? "完成" : "未完成"}</li>
      <li class="${state.aidOps.sortedBatches >= 1 ? "done" : ""}">完成 1 轮三步分拣小游戏：${state.aidOps.sortedBatches}/1</li>
      <li class="${state.aidOps.packagingDesign !== "plain" ? "done" : ""}">完成包装设计：${state.aidOps.packagingDesign !== "plain" ? packaging.name : "未升级"}</li>
      <li class="${state.quests.courierStation ? "done" : ""}">快递进村，打通发货：${state.quests.courierStation ? "完成" : "未完成"}</li>
      <li class="${state.aidOps.lastParcelLoss > 0 && state.aidOps.lastParcelLoss <= 12 ? "done" : ""}">把最近物流损耗压到 12% 以下：${state.aidOps.lastParcelLoss || estimateLogisticsLoss()}%</li>
      <li class="${state.facilities.parcelsSent >= 1 ? "done" : ""}">用快递驿站寄出 1 箱标准农货：${state.facilities.parcelsSent}/1</li>
      <li class="${state.quests.liveStream ? "done" : ""}">第一次直播助农：${state.quests.liveStream ? "完成" : "未完成"}</li>
      <li class="${state.aidOps.liveFeedback >= 30 ? "done" : ""}">直播间好评热度达到 30：${state.aidOps.liveFeedback}/30</li>
      <li class="${aidCaseCompletedCount() >= 1 ? "done" : ""}">完成 1 个真实助农案例：${aidCaseCompletedCount()}/1</li>
      <li class="${state.aidCases.brandScore >= 30 ? "done" : ""}">晨谷农产品品牌力达到 30：${state.aidCases.brandScore}/30</li>
      <li class="${state.aidCases.contractOrders >= 1 ? "done" : ""}">完成 1 单订单农业排产：${state.aidCases.contractOrders}/1</li>
      ${aidCaseListMarkup()}
      <li class="${state.facilities.visitorsServed >= 1 ? "done" : ""}">游客服务中心接待 1 批游客：${state.facilities.visitorsServed}/1</li>
      ${festival ? `<li class="${state.festivalLog[festival.id] ? "done" : ""}">${festival.name}限时活动：${state.festivalLog[festival.id] ? "完成" : festival.task}</li>` : ""}
      ${festival ? `<li class="${festivalPrepCount(festival) >= festivalActivity.steps.length ? "done" : ""}">${festival.name}三步筹备：${Math.min(festivalPrepCount(festival), festivalActivity.steps.length)}/${festivalActivity.steps.length}</li>` : ""}
      ${festival ? `<li class="${state.festivalOps.menus[festival.id] ? "done" : ""}">${festival.name}限定菜谱：${state.festivalOps.menus[festival.id] ? "完成" : festivalActivity.recipeName}</li>` : ""}
      <li class="${state.festivalOps.homestayBookings >= 1 ? "done" : ""}">节日民宿预约 1 单：${state.festivalOps.homestayBookings}/1</li>
      ${termOrder ? `<li class="${termOrderDone ? "done" : ""}">完成${currentSolarTerm()}节气订单：${termOrderDone ? "完成" : orderProgressText(termOrder)}</li>` : ""}
      ${communityOrder
    ? `<li>完成社区订单：${communityOrderProgressText(communityOrder)}</li>`
    : `<li class="${hasLockedCommunityOrders ? "" : "done"}">社区订单：${hasLockedCommunityOrders ? "先走访解锁" : "完成"}</li>`}
      <li class="${state.quests.cooperativeFounded ? "done" : ""}">成立村级合作社：${state.quests.cooperativeFounded ? "完成" : cooperativeStatusText()}</li>
      <li class="${villageUpgradeCount() >= 3 ? "done" : ""}">村庄建筑完成 3 项主线变化：${villageUpgradeCount()}/3</li>
      <li class="${villageUpgradeCount() >= villageUpgradeDefinitions.length ? "done" : ""}">村庄面貌进入长期经营阶段：${villageUpgradeCount()}/${villageUpgradeDefinitions.length}</li>
      <li class="${cooperativeCapabilityCount() >= 4 ? "done" : ""}">合作社形成 4 项公共能力：${cooperativeCapabilityCount()}/4</li>
      <li class="${flowerColorCount >= 3 ? "done" : ""}">培育 3 种不同颜色的花：${flowerColorCount}/3</li>
      <li class="${state.flowerBreeding.greenhouse ? "done" : ""}">修复花艺温室：${state.flowerBreeding.greenhouse ? "完成" : `${flowerColorCount}/3 花色，金币 ${state.money}/160`}</li>
      <li class="${state.flowerBreeding.geneTests >= 3 ? "done" : ""}">用授粉刷做 3 次基因检测：${state.flowerBreeding.geneTests}/3</li>
      <li class="${state.flowerBreeding.preparedGenes ? "done" : ""}">完成一次定向授粉：${state.flowerBreeding.preparedGenes ? flowerPhenotype(state.flowerBreeding.preparedGenes).name : "未完成"}</li>
      ${flowerOrder ? `<li>完成花卉订单：${flowerOrderRequirementName(flowerOrder)}</li>` : "<li class=\"done\">当前可接花卉订单：完成或待解锁</li>"}
      <li class="${state.flowerBreeding.rareMutations >= 1 ? "done" : ""}">培育 1 次稀有突变花：${state.flowerBreeding.rareMutations}/1</li>
      <li class="${fishJournalCount() >= 3 ? "done" : ""}">钓到 3 种不同的鱼：${fishJournalCount()}/3</li>
      <li class="${state.fishing.rodLevel >= 2 ? "done" : ""}">升级碳素鱼竿：${state.fishing.rodLevel >= 2 ? "完成" : rodUpgradeStatusText()}</li>
      <li class="${state.fishing.qualityCatches >= 2 ? "done" : ""}">钓到 2 条高品质鱼：${state.fishing.qualityCatches}/2</li>
      <li class="${state.fishing.fishPond ? "done" : ""}">建设生态鱼塘：${state.fishing.fishPond ? "完成" : `鱼类图鉴 ${fishJournalCount()}/4，金币 ${state.money}/180`}</li>
      <li class="${state.fishing.pondHarvested >= 2 ? "done" : ""}">从生态鱼塘收获 2 条鱼：${state.fishing.pondHarvested}/2</li>
      ${fishingOrder ? `<li>完成鱼鲜订单：${fishingOrderProgressText(fishingOrder)}</li>` : "<li class=\"done\">当前可接鱼鲜订单：完成或待解锁</li>"}
      <li class="${aquariumFishCount() >= 1 ? "done" : ""}">把鱼放进家里的鱼缸：${aquariumFishCount()}/${aquariumCapacity}</li>
      <li class="${aquariumScore() >= 40 ? "done" : ""}">鱼缸观赏评分达到 40：${aquariumScore()}/40</li>
      <li class="${state.pets.cat.adopted ? "done" : ""}">领养小猫：${state.pets.cat.adopted ? `亲密度 ${state.pets.cat.affection}` : "未领养"}</li>
      <li class="${state.pets.dog.adopted ? "done" : ""}">领养小狗：${state.pets.dog.adopted ? `亲密度 ${state.pets.dog.affection}` : "未领养"}</li>
      <li class="${petFollowCount() >= 1 ? "done" : ""}">让任意宠物跟随出门：${petFollowCount() >= 1 ? "完成" : `${bestPetAffection}/3 亲密度`}</li>
      <li class="${petAssistTotal() >= 1 ? "done" : ""}">带宠物完成 1 次后山探索辅助：${petAssistTotal()}/1</li>
      <li class="${state.petLife.toyOwned ? "done" : ""}">给宠物准备玩具箱：${state.petLife.toyOwned ? "完成" : `金币 ${state.money}/48`}</li>
      <li class="${state.petLife.bedLevel >= 2 ? "done" : ""}">升级宠物窝：${petComfortName()}</li>
      <li class="${state.petLife.homestayPhotos >= 1 ? "done" : ""}">拍 1 次民宿宠物合影：${state.petLife.homestayPhotos}/1</li>
      <li class="${state.petLife.livestockAssists >= 1 ? "done" : ""}">让宠物协助鸡舍看护：${state.petLife.livestockAssists}/1</li>
      <li class="${weather.autoWater ? "done" : ""}">观察今日天气：${weather.name}${weather.autoWater ? "，可自动润湿农田" : "，需要自己安排浇水"}</li>
      <li class="${state.quests.wateredToday >= 6 ? "done" : ""}">今日浇水 6 格：${Math.min(state.quests.wateredToday, 6)}/6</li>
      <li class="${storyDone ? "done" : ""}">主线第一章：让村里的第一批农货流动起来。</li>
      <li class="${state.energy <= 15 ? "warn" : ""}">点击“下一阶段”或按 N 自主推进时间；凌晨之后进入新一天清晨。</li>
    </ul>
  `;
}

function renderStatus() {
  const festival = currentFestival();
  const dayText = `${currentSeasonDefinition().name} · ${currentSolarTerm()} 第${state.dayInTerm}日${festival ? ` · ${festival.name}` : ""}`;
  document.querySelector("#day").textContent = dayText;
  document.querySelector("#time").textContent = `${currentPhase().name} · ${currentWeather().name}`;
  document.querySelector("#energy").textContent = `体力 ${Math.round(state.energy)}`;
  document.querySelector("#money").textContent = `金币 ${state.money}`;
}

function renderHotbar() {
  document.querySelector("#hotbar").innerHTML = tools.map((tool, index) => `
    <button class="slot ${state.selected === index ? "active" : ""}" type="button" data-slot="${index}" title="${tool.name}" aria-label="${tool.name}">
      <small>${index + 1}</small>
      <span>${toolIcons[tool.id]}</span>
    </button>
  `).join("");

  document.querySelectorAll(".slot").forEach((button) => {
    button.addEventListener("click", () => {
      state.selected = Number(button.dataset.slot);
      renderPanels();
    });
  });
}

function mulberry32(seed) {
  return function next() {
    let t = seed += 0x6d2b79f5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

let last = performance.now();
function frame(now) {
  const delta = now - last;
  last = now;
  updatePlayer(delta);
  if (state.messageUntil && now > state.messageUntil) {
    state.messageUntil = 0;
    document.querySelector("#message").classList.add("hidden");
  }
  draw();
  renderStatus();
  requestAnimationFrame(frame);
}

renderPanels();
requestAnimationFrame(frame);
