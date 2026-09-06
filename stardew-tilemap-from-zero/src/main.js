const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const APP_VERSION = "0.2.0";
const ART_VERSION = "art-0.2.18";
const ART_MOTION_VERSION = "motion-0.2.7";

const ui = {
  appShell: document.querySelector(".app-shell"),
  bootOverlay: document.querySelector("#bootOverlay"),
  appVersionBadge: document.querySelector("#appVersionBadge"),
  artVersionBadge: document.querySelector("#artVersionBadge"),
  assetAuditStatus: document.querySelector("#assetAuditStatus"),
  assetAuditSummary: document.querySelector("#assetAuditSummary"),
  assetAuditList: document.querySelector("#assetAuditList"),
  refreshAssetAuditBtn: document.querySelector("#refreshAssetAuditBtn"),
  copyAssetManifestBtn: document.querySelector("#copyAssetManifestBtn"),
  mapName: document.querySelector("#mapName"),
  tileReadout: document.querySelector("#tileReadout"),
  facingReadout: document.querySelector("#facingReadout"),
  actionHint: document.querySelector("#actionHint"),
  gameHudDay: document.querySelector("#gameHudDay"),
  gameHudSeason: document.querySelector("#gameHudSeason"),
  gameHudTime: document.querySelector("#gameHudTime"),
  gameHudWeather: document.querySelector("#gameHudWeather"),
  gameHudEnergy: document.querySelector("#gameHudEnergy"),
  gameHudGold: document.querySelector("#gameHudGold"),
  gameHudObjective: document.querySelector("#gameHudObjective"),
  log: document.querySelector("#log"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  resetBtn: document.querySelector("#resetBtn"),
  unstuckBtn: document.querySelector("#unstuckBtn"),
  skipTestBtn: document.querySelector("#skipTestBtn"),
  testSkipSelect: document.querySelector("#testSkipSelect"),
  saveStatus: document.querySelector("#saveStatus"),
  saveSlotLabel: document.querySelector("#saveSlotLabel"),
  saveSlotSelect: document.querySelector("#saveSlotSelect"),
  saveSlotInfo: document.querySelector("#saveSlotInfo"),
  exportSaveBtn: document.querySelector("#exportSaveBtn"),
  importSaveBtn: document.querySelector("#importSaveBtn"),
  clearSlotBtn: document.querySelector("#clearSlotBtn"),
  saveJsonOutput: document.querySelector("#saveJsonOutput"),
  sleepBtn: document.querySelector("#sleepBtn"),
  dayReadout: document.querySelector("#dayReadout"),
  timeReadout: document.querySelector("#timeReadout"),
  energyReadout: document.querySelector("#energyReadout"),
  weatherReadout: document.querySelector("#weatherReadout"),
  tomorrowWeatherReadout: document.querySelector("#tomorrowWeatherReadout"),
  seasonReadout: document.querySelector("#seasonReadout"),
  seasonDayReadout: document.querySelector("#seasonDayReadout"),
  calendarGrid: document.querySelector("#calendarGrid"),
  eventReadout: document.querySelector("#eventReadout"),
  eventList: document.querySelector("#eventList"),
  seasonCropList: document.querySelector("#seasonCropList"),
  storyPhase: document.querySelector("#storyPhase"),
  storyProgress: document.querySelector("#storyProgress"),
  storyObjectiveList: document.querySelector("#storyObjectiveList"),
  storyTargetHint: document.querySelector("#storyTargetHint"),
  storyNextHint: document.querySelector("#storyNextHint"),
  taskTreeProgress: document.querySelector("#taskTreeProgress"),
  taskTreeList: document.querySelector("#taskTreeList"),
  firstYearCheckProgress: document.querySelector("#firstYearCheckProgress"),
  firstYearCheckSummary: document.querySelector("#firstYearCheckSummary"),
  firstYearCheckList: document.querySelector("#firstYearCheckList"),
  playthroughCheckProgress: document.querySelector("#playthroughCheckProgress"),
  playthroughCheckSummary: document.querySelector("#playthroughCheckSummary"),
  playthroughCheckpointList: document.querySelector("#playthroughCheckpointList"),
  guideProgress: document.querySelector("#guideProgress"),
  guideCurrentStep: document.querySelector("#guideCurrentStep"),
  guideStepList: document.querySelector("#guideStepList"),
  guideHint: document.querySelector("#guideHint"),
  alertCount: document.querySelector("#alertCount"),
  alertList: document.querySelector("#alertList"),
  minimap: document.querySelector("#minimap"),
  minimapMapName: document.querySelector("#minimapMapName"),
  minimapHoverReadout: document.querySelector("#minimapHoverReadout"),
  minimapTargetReadout: document.querySelector("#minimapTargetReadout"),
  clearMinimapTargetBtn: document.querySelector("#clearMinimapTargetBtn"),
  dynamicObjectCount: document.querySelector("#dynamicObjectCount"),
  dynamicCropStatus: document.querySelector("#dynamicCropStatus"),
  dynamicMachineStatus: document.querySelector("#dynamicMachineStatus"),
  dynamicObjectList: document.querySelector("#dynamicObjectList"),
  farmScoreValue: document.querySelector("#farmScoreValue"),
  farmScoreMeter: document.querySelector("#farmScoreMeter"),
  farmScoreRank: document.querySelector("#farmScoreRank"),
  farmScoreList: document.querySelector("#farmScoreList"),
  farmScoreNextGoal: document.querySelector("#farmScoreNextGoal"),
  buildModeStatus: document.querySelector("#buildModeStatus"),
  buildItemSelect: document.querySelector("#buildItemSelect"),
  buildItemInfo: document.querySelector("#buildItemInfo"),
  buildModeBtn: document.querySelector("#buildModeBtn"),
  buildShopBtn: document.querySelector("#buildShopBtn"),
  quickBuyBuildOneBtn: document.querySelector("#quickBuyBuildOneBtn"),
  quickBuyBuildFiveBtn: document.querySelector("#quickBuyBuildFiveBtn"),
  buildInventoryList: document.querySelector("#buildInventoryList"),
  buildCurrentMapCount: document.querySelector("#buildCurrentMapCount"),
  buildPlacedCount: document.querySelector("#buildPlacedCount"),
  buildPlacedList: document.querySelector("#buildPlacedList"),
  currentTool: document.querySelector("#currentTool"),
  toolButtons: document.querySelector("#toolButtons"),
  bottomToolHud: document.querySelector("#bottomToolHud"),
  bottomToolSlots: document.querySelector("#bottomToolSlots"),
  bottomToolName: document.querySelector("#bottomToolName"),
  bottomToolMeta: document.querySelector("#bottomToolMeta"),
  inventoryOverlay: document.querySelector("#inventoryOverlay"),
  inventoryOverlayCloseBtn: document.querySelector("#inventoryOverlayCloseBtn"),
  inventoryOverlayGold: document.querySelector("#inventoryOverlayGold"),
  inventoryCurrentTool: document.querySelector("#inventoryCurrentTool"),
  inventoryCurrentSeed: document.querySelector("#inventoryCurrentSeed"),
  inventoryWaterStatus: document.querySelector("#inventoryWaterStatus"),
  inventoryEnergyStatus: document.querySelector("#inventoryEnergyStatus"),
  inventoryOverlaySeedList: document.querySelector("#inventoryOverlaySeedList"),
  inventoryOverlayCropList: document.querySelector("#inventoryOverlayCropList"),
  inventoryOverlayGoodsList: document.querySelector("#inventoryOverlayGoodsList"),
  inventoryOverlayFishList: document.querySelector("#inventoryOverlayFishList"),
  inventoryOverlayResourceList: document.querySelector("#inventoryOverlayResourceList"),
  inventoryOverlayShipmentList: document.querySelector("#inventoryOverlayShipmentList"),
  inventoryOverlayGoodsShipmentList: document.querySelector("#inventoryOverlayGoodsShipmentList"),
  inventoryOverlayFishShipmentList: document.querySelector("#inventoryOverlayFishShipmentList"),
  systemMenuOverlay: document.querySelector("#systemMenuOverlay"),
  systemMenuVersion: document.querySelector("#systemMenuVersion"),
  systemMenuArtVersion: document.querySelector("#systemMenuArtVersion"),
  systemMenuCloseBtn: document.querySelector("#systemMenuCloseBtn"),
  systemContinueBtn: document.querySelector("#systemContinueBtn"),
  systemSaveBtn: document.querySelector("#systemSaveBtn"),
  systemLoadBtn: document.querySelector("#systemLoadBtn"),
  systemSleepBtn: document.querySelector("#systemSleepBtn"),
  systemUnstuckBtn: document.querySelector("#systemUnstuckBtn"),
  systemSoundBtn: document.querySelector("#systemSoundBtn"),
  systemDevPanelBtn: document.querySelector("#systemDevPanelBtn"),
  journalOverlay: document.querySelector("#journalOverlay"),
  journalCloseBtn: document.querySelector("#journalCloseBtn"),
  journalTabs: document.querySelector("#journalTabs"),
  journalContent: document.querySelector("#journalContent"),
  buildOverlay: document.querySelector("#buildOverlay"),
  buildOverlayCloseBtn: document.querySelector("#buildOverlayCloseBtn"),
  buildOverlayContent: document.querySelector("#buildOverlayContent"),
  taskOverlay: document.querySelector("#taskOverlay"),
  taskOverlayCloseBtn: document.querySelector("#taskOverlayCloseBtn"),
  taskOverlayTabs: document.querySelector("#taskOverlayTabs"),
  taskOverlayContent: document.querySelector("#taskOverlayContent"),
  seedSelect: document.querySelector("#seedSelect"),
  goldCount: document.querySelector("#goldCount"),
  seedCount: document.querySelector("#seedCount"),
  cropCount: document.querySelector("#cropCount"),
  shipmentCount: document.querySelector("#shipmentCount"),
  waterCount: document.querySelector("#waterCount"),
  abilityCount: document.querySelector("#abilityCount"),
  soundToggle: document.querySelector("#soundToggle"),
  effectStatus: document.querySelector("#effectStatus"),
  inventoryGold: document.querySelector("#inventoryGold"),
  seedInventoryList: document.querySelector("#seedInventoryList"),
  cropInventoryList: document.querySelector("#cropInventoryList"),
  goodsInventoryList: document.querySelector("#goodsInventoryList"),
  fishInventoryList: document.querySelector("#fishInventoryList"),
  resourceInventoryList: document.querySelector("#resourceInventoryList"),
  shipmentInventoryList: document.querySelector("#shipmentInventoryList"),
  goodsShipmentInventoryList: document.querySelector("#goodsShipmentInventoryList"),
  fishShipmentInventoryList: document.querySelector("#fishShipmentInventoryList"),
  collectionProgress: document.querySelector("#collectionProgress"),
  collectionList: document.querySelector("#collectionList"),
  achievementCount: document.querySelector("#achievementCount"),
  achievementList: document.querySelector("#achievementList"),
  albumProgress: document.querySelector("#albumProgress"),
  albumList: document.querySelector("#albumList"),
  questList: document.querySelector("#questList"),
  orderStatus: document.querySelector("#orderStatus"),
  orderTitle: document.querySelector("#orderTitle"),
  orderProgress: document.querySelector("#orderProgress"),
  orderReward: document.querySelector("#orderReward"),
  upgradeCount: document.querySelector("#upgradeCount"),
  upgradeList: document.querySelector("#upgradeList"),
  editorToggle: document.querySelector("#editorToggle"),
  editorUndoBtn: document.querySelector("#editorUndoBtn"),
  editorRedoBtn: document.querySelector("#editorRedoBtn"),
  editorHistoryStatus: document.querySelector("#editorHistoryStatus"),
  layerSelect: document.querySelector("#layerSelect"),
  tilePalette: document.querySelector("#tilePalette"),
  toolSelect: document.querySelector("#toolSelect"),
  objectSelect: document.querySelector("#objectSelect"),
  objectReadout: document.querySelector("#objectReadout"),
  objectTextInput: document.querySelector("#objectTextInput"),
  objectItemsInput: document.querySelector("#objectItemsInput"),
  warpTargetMapSelect: document.querySelector("#warpTargetMapSelect"),
  warpTargetInput: document.querySelector("#warpTargetInput"),
  applyObjectBtn: document.querySelector("#applyObjectBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importBtn: document.querySelector("#importBtn"),
  resetMapBtn: document.querySelector("#resetMapBtn"),
  mapJsonOutput: document.querySelector("#mapJsonOutput"),
  copyJsonBtn: document.querySelector("#copyJsonBtn"),
  dialogBox: document.querySelector("#dialogBox"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogContent: document.querySelector("#dialogContent"),
  dialogNextBtn: document.querySelector("#dialogNextBtn"),
  dialogCloseBtn: document.querySelector("#dialogCloseBtn"),
};

const minimapCtx = ui.minimap.getContext("2d");

const TILE_SIZE = 32;
const VIEW_SCALE = 2;
const DEFAULT_PLAYER_SPEED = 142;
const RUN_SPEED_MULTIPLIER = 1.65;
const CROP_MAP_ID = "farm";
const DEFAULT_NPC_MAP_ID = "village";
const DEFAULT_MAP_RULES = {
  canFarm: false,
  canBuild: false,
  showsCrops: false,
  showsNpcs: false,
  canRefillWater: false,
};
const MAP_RULES = {
  farm: { canFarm: true, canBuild: true, showsCrops: true, showsNpcs: true, canRefillWater: true },
  house: { canFarm: false, canBuild: false, showsCrops: false, showsNpcs: false, canRefillWater: false },
  village: { canFarm: false, canBuild: false, showsCrops: false, showsNpcs: true, canRefillWater: true },
  mountain: { canFarm: false, canBuild: false, showsCrops: false, showsNpcs: false, canRefillWater: false },
};
const SAVE_KEY = "tilemap-from-zero-save";
const SAVE_SLOT_PREFIX = `${SAVE_KEY}-slot-`;
const ACTIVE_SAVE_SLOT_KEY = `${SAVE_KEY}-active-slot`;
const SAVE_SLOT_IDS = ["slot1", "slot2", "slot3"];
const SAVE_SLOT_LABELS = {
  slot1: "槽 1",
  slot2: "槽 2",
  slot3: "槽 3",
};
const DEFAULT_SAVE_SLOT = "slot1";
const EDITOR_HISTORY_LIMIT = 60;
const AUTO_SAVE_DELAY = 700;
const DAY_START_MINUTES = 6 * 60;
const MAX_ENERGY = 30;
const WATERING_CAN_CAPACITY = 5;
const IRRIGATION_WATER_BONUS = 3;
const VISUAL_EFFECT_LIMIT = 32;
const SCREEN_EFFECT_LIMIT = 4;
const BENCH_REST_ENERGY = 6;
const BENCH_REST_MINUTES = 20;
const LAMP_LIGHT_START_MINUTES = 18 * 60;
const EVENING_START_MINUTES = 18 * 60;
const NIGHT_START_MINUTES = 21 * 60;
const LATE_NIGHT_START_MINUTES = 23 * 60;
const DAYS_PER_SOLAR_TERM = 5;
const SOLAR_TERMS_PER_SEASON = 6;
const SOLAR_TERMS_PER_YEAR = 24;
const SEASON_LENGTH = DAYS_PER_SOLAR_TERM * SOLAR_TERMS_PER_SEASON;
const YEAR_LENGTH = DAYS_PER_SOLAR_TERM * SOLAR_TERMS_PER_YEAR;
const SEASONS = {
  spring: { id: "spring", label: "春季", color: "#70b77e" },
  summer: { id: "summer", label: "夏季", color: "#e7b34d" },
  autumn: { id: "autumn", label: "秋季", color: "#c97d54" },
  winter: { id: "winter", label: "冬季", color: "#75b9d8" },
};
const SEASON_IDS = Object.keys(SEASONS);
const SOLAR_TERMS = [
  "立春",
  "雨水",
  "惊蛰",
  "春分",
  "清明",
  "谷雨",
  "立夏",
  "小满",
  "芒种",
  "夏至",
  "小暑",
  "大暑",
  "立秋",
  "处暑",
  "白露",
  "秋分",
  "寒露",
  "霜降",
  "立冬",
  "小雪",
  "大雪",
  "冬至",
  "小寒",
  "大寒",
].map((name, index) => ({
  id: `term${index + 1}`,
  name,
  index,
  seasonId: SEASON_IDS[Math.floor(index / SOLAR_TERMS_PER_SEASON)],
}));
const CALENDAR_EVENTS = [
  {
    id: "springStartMeetup",
    solarTermIndex: 0,
    dayOfTerm: 1,
    title: "开耕小会",
    marker: "耕",
    description: "立春第一天，村口会讨论今年第一块地怎么恢复。",
  },
  {
    id: "rainWaterPatrol",
    solarTermIndex: 1,
    dayOfTerm: 2,
    title: "雨水巡田",
    marker: "雨",
    description: "雨水第二天，适合检查水壶、水源和低洼地。",
  },
  {
    id: "springSeedMarket",
    solarTermIndex: 2,
    dayOfTerm: 3,
    title: "春集种子会",
    marker: "集",
    description: "惊蛰第三天，村口春集出售早豆试种包、春季补给和工具材料。",
    shopDiscount: 0.8,
  },
  {
    id: "springBasketTrial",
    solarTermIndex: 3,
    dayOfTerm: 3,
    title: "春分菜篮试送",
    marker: "篮",
    description: "春分第三天，睡觉结算出货收益 +10%。",
    shipmentMultiplier: 1.1,
  },
  {
    id: "qingmingRoadNote",
    solarTermIndex: 4,
    dayOfTerm: 2,
    title: "清明修路记录",
    marker: "路",
    description: "清明第二天，村口会提示后续道路和集市筹备。",
  },
  {
    id: "grainRainSupply",
    solarTermIndex: 5,
    dayOfTerm: 5,
    title: "谷雨补种日",
    marker: "补",
    description: "谷雨第五天，种子售价 9 折。",
    shopDiscount: 0.9,
  },
  {
    id: "summerPlantingNotice",
    solarTermIndex: 6,
    dayOfTerm: 1,
    title: "立夏换茬",
    marker: "夏",
    description: "立夏第一天，夏季作物开始成为主力。",
  },
  {
    id: "grainTrialHarvest",
    solarTermIndex: 7,
    dayOfTerm: 3,
    title: "小满试收",
    marker: "麦",
    description: "小满第三天，睡觉结算出货收益 +15%。",
    shipmentMultiplier: 1.15,
  },
  {
    id: "awnSeedRush",
    solarTermIndex: 8,
    dayOfTerm: 1,
    title: "芒种抢种",
    marker: "种",
    description: "芒种第一天，种子售价 85 折。",
    shopDiscount: 0.85,
  },
  {
    id: "summerSolsticeMarket",
    solarTermIndex: 9,
    dayOfTerm: 5,
    title: "夏至夜市",
    marker: "市",
    description: "夏至第五天，睡觉结算出货收益 +20%。",
    shipmentMultiplier: 1.2,
  },
  {
    id: "minorHeatSupply",
    solarTermIndex: 10,
    dayOfTerm: 2,
    title: "小暑补给",
    marker: "暑",
    description: "小暑第二天，种子售价 9 折。",
    shopDiscount: 0.9,
  },
  {
    id: "majorHeatWaterTalk",
    solarTermIndex: 11,
    dayOfTerm: 4,
    title: "大暑水渠议事",
    marker: "水",
    description: "大暑第四天，村里开始讨论水渠、灌溉和后续基建。",
  },
  {
    id: "autumnStartPlan",
    solarTermIndex: 12,
    dayOfTerm: 1,
    title: "立秋收成计划",
    marker: "秋",
    description: "立秋第一天，秋季作物和批量出货成为重点。",
  },
  {
    id: "heatEndDrying",
    solarTermIndex: 13,
    dayOfTerm: 2,
    title: "处暑晒场",
    marker: "晒",
    description: "处暑第二天，适合准备晾晒、加工和耐储存作物。",
  },
  {
    id: "harvestFair",
    solarTermIndex: 14,
    dayOfTerm: 3,
    title: "收获节",
    marker: "收",
    description: "白露第三天，睡觉结算出货收益 +25%。",
    shipmentMultiplier: 1.25,
  },
  {
    id: "autumnEquinoxMarket",
    solarTermIndex: 15,
    dayOfTerm: 1,
    title: "秋分集市",
    marker: "集",
    description: "秋分第一天，种子售价 9 折。",
    shopDiscount: 0.9,
  },
  {
    id: "coldDewBasket",
    solarTermIndex: 16,
    dayOfTerm: 4,
    title: "寒露菜篮",
    marker: "篮",
    description: "寒露第四天，睡觉结算出货收益 +15%。",
    shipmentMultiplier: 1.15,
  },
  {
    id: "frostDescentPrep",
    solarTermIndex: 17,
    dayOfTerm: 5,
    title: "霜降备冬",
    marker: "冬",
    description: "霜降第五天，村民会提醒冬季作物和仓储准备。",
  },
  {
    id: "winterStartNotice",
    solarTermIndex: 18,
    dayOfTerm: 1,
    title: "立冬换季会",
    marker: "冬",
    description: "立冬第一天，冬季经营从稳产和总结开始。",
  },
  {
    id: "minorSnowSeedSwap",
    solarTermIndex: 19,
    dayOfTerm: 2,
    title: "小雪换种",
    marker: "换",
    description: "小雪第二天，种子售价 85 折。",
    shopDiscount: 0.85,
  },
  {
    id: "majorSnowStorage",
    solarTermIndex: 20,
    dayOfTerm: 3,
    title: "大雪仓储检查",
    marker: "仓",
    description: "大雪第三天，适合查看待出货、加工品和年终库存。",
  },
  {
    id: "winterSolsticeDinner",
    solarTermIndex: 21,
    dayOfTerm: 5,
    title: "冬至团圆单",
    marker: "团",
    description: "冬至第五天，睡觉结算出货收益 +20%。",
    shipmentMultiplier: 1.2,
  },
  {
    id: "minorColdReview",
    solarTermIndex: 22,
    dayOfTerm: 2,
    title: "小寒年度回看",
    marker: "评",
    description: "小寒第二天，村里开始准备年终评价。",
  },
  {
    id: "majorColdYearEnd",
    solarTermIndex: 23,
    dayOfTerm: 5,
    title: "大寒年终会",
    marker: "年",
    description: "大寒第五天，一周目进入年度总结和下一年方向选择。",
  },
];
const SOLAR_TERM_CROP_NOTES = [
  "立春到谷雨：优先萝卜、小白菜和豆子，先跑通短周期现金流。",
  "立夏到大暑：小麦、番茄、豆子和玉米接力，注意水壶和补种节奏。",
  "立秋到霜降：红薯、玉米、番茄适合批量出货，也要准备加工原料。",
  "立冬到大寒：菠菜、小白菜、小麦和红薯撑住冬季收入，顺手做年终库存。",
];
const DEFAULT_CROP_ID = "radish";
const CROP_TYPES = {
  radish: {
    id: "radish",
    name: "萝卜",
    seedName: "萝卜种子",
    unlockDay: 1,
    growStages: 2,
    seedPrice: 5,
    sellPrice: 15,
    seasons: ["spring", "autumn"],
    sproutColor: "#d8f0b0",
    cropColor: "#f07f78",
    accentColor: "#fff0a5",
  },
  bokChoy: {
    id: "bokChoy",
    name: "小白菜",
    seedName: "小白菜种子",
    unlockDay: 1,
    growStages: 2,
    seedPrice: 6,
    sellPrice: 18,
    seasons: ["spring", "winter"],
    sproutColor: "#bddf75",
    cropColor: "#87b95f",
    accentColor: "#e8f7b8",
  },
  wheat: {
    id: "wheat",
    name: "小麦",
    seedName: "小麦种子",
    unlockDay: 31,
    growStages: 3,
    seedPrice: 8,
    sellPrice: 24,
    seasons: ["summer", "autumn", "winter"],
    sproutColor: "#c8d57b",
    cropColor: "#d8aa45",
    accentColor: "#f7df88",
  },
  bean: {
    id: "bean",
    name: "豆子",
    seedName: "豆子种子",
    unlockDay: 36,
    growStages: 4,
    seedPrice: 12,
    sellPrice: 36,
    seasons: ["spring", "summer"],
    sproutColor: "#7fc46b",
    cropColor: "#69b35a",
    accentColor: "#d5f0a0",
  },
  tomato: {
    id: "tomato",
    name: "番茄",
    seedName: "番茄种子",
    unlockDay: 31,
    growStages: 4,
    seedPrice: 14,
    sellPrice: 42,
    seasons: ["summer", "autumn"],
    sproutColor: "#75b86f",
    cropColor: "#d9574f",
    accentColor: "#ffd27a",
  },
  corn: {
    id: "corn",
    name: "玉米",
    seedName: "玉米种子",
    unlockDay: 36,
    growStages: 5,
    seedPrice: 16,
    sellPrice: 50,
    seasons: ["summer", "autumn"],
    sproutColor: "#8fbf5b",
    cropColor: "#e7c451",
    accentColor: "#fff3a0",
  },
  sweetPotato: {
    id: "sweetPotato",
    name: "红薯",
    seedName: "红薯苗",
    unlockDay: 61,
    growStages: 4,
    seedPrice: 13,
    sellPrice: 40,
    seasons: ["autumn", "winter"],
    sproutColor: "#8fc26a",
    cropColor: "#b96b58",
    accentColor: "#f2c18a",
  },
  spinach: {
    id: "spinach",
    name: "菠菜",
    seedName: "菠菜种子",
    unlockDay: 91,
    growStages: 3,
    seedPrice: 10,
    sellPrice: 30,
    seasons: ["winter", "spring"],
    sproutColor: "#71b76a",
    cropColor: "#4f9660",
    accentColor: "#d9f0a2",
  },
};
const CROP_IDS = Object.keys(CROP_TYPES);
const CROP_RENDER_SPECS = {
  wheat: { width: 32, height: 48 },
  bean: { width: 32, height: 48 },
  tomato: { width: 32, height: 48 },
  corn: { width: 32, height: 48 },
};
const RESOURCE_TYPES = {
  stone: { id: "stone", name: "石料", color: "#8a7a66" },
  wood: { id: "wood", name: "木料", color: "#8a5b37" },
  coal: { id: "coal", name: "煤", color: "#363331" },
  scrap: { id: "scrap", name: "旧铁件", color: "#8cb7d7" },
  copperOre: { id: "copperOre", name: "铜矿", color: "#c08a4a" },
  wildGreens: { id: "wildGreens", name: "山野菜", color: "#70b77e" },
};
const RESOURCE_IDS = Object.keys(RESOURCE_TYPES);
const RESOURCE_NODE_TYPES = {
  quarry: {
    id: "quarry",
    name: "旧采石点",
    description: "山路旁的碎石坡，能捡到修设施用的石料、铜矿和煤。",
    energy: 3,
    maxPerDay: 3,
    rewards: { stone: 6, copperOre: 1, coal: 1 },
    effectColor: "#8a7a66",
  },
  forestEdge: {
    id: "forestEdge",
    name: "林缘采集点",
    description: "林边有落枝、藤蔓和春季野菜，适合补充早期资源。",
    energy: 2,
    maxPerDay: 3,
    rewards: { wood: 6, wildGreens: 1 },
    effectColor: "#70b77e",
  },
  toolShed: {
    id: "toolShed",
    name: "废弃工具棚",
    description: "旧工具棚里能拆出铁件，也可以用铜矿和旧件做基础工具升级。",
    energy: 3,
    maxPerDay: 1,
    rewards: { scrap: 2, copperOre: 1, coal: 1 },
    effectColor: "#8cb7d7",
  },
};
const RESOURCE_NODE_IDS = Object.keys(RESOURCE_NODE_TYPES);
const MATERIAL_SOURCE_HINTS = {
  gold: "出售作物、加工品、水产或完成订单",
  crops: "在农场播种、浇水、成熟后用镰刀收获",
  goods: "修复加工设施后把作物加工成成品",
  stone: "第 11 天后去山里旧采石点采集",
  wood: "第 11 天后去山里林缘采集点采集",
  coal: "旧采石点或废弃工具棚可获得",
  scrap: "山里废弃工具棚可获得",
  copperOre: "旧采石点或废弃工具棚可获得",
  wildGreens: "山里林缘采集点可获得",
};
const WATER_QUALITY_LEVELS = [
  { id: 0, name: "污浊", description: "水色发灰，只能钓到耐污的小鱼、田螺和少量水草。" },
  { id: 1, name: "转清", description: "村塘开始恢复，河虾和鲤鱼重新出现。" },
  { id: 2, name: "清澈", description: "水渠和山溪连起来，泥鳅、草鱼和山溪鱼开始回游。" },
  { id: 3, name: "活水", description: "山泉活水恢复，稀有老泉鱼会在山溪出现。" },
];
const WATER_QUALITY_MAX = WATER_QUALITY_LEVELS.length - 1;
const WATER_QUALITY_COLORS = {
  0: "#526f68",
  1: "#3d8190",
  2: "#327fa6",
  3: "#3a9ec0",
};
const SEASONAL_WATER_QUALITY_COLORS = {
  spring: {
    0: "#526f68",
    1: "#3d8190",
    2: "#327fa6",
    3: "#3a9ec0",
  },
  summer: {
    0: "#4f7567",
    1: "#2f8790",
    2: "#2386ad",
    3: "#23a8c3",
  },
  autumn: {
    0: "#596a59",
    1: "#4f7e7f",
    2: "#3c728e",
    3: "#4595a9",
  },
  winter: {
    0: "#64757b",
    1: "#6c90a0",
    2: "#79aabd",
    3: "#8bc8d8",
  },
};
const FISH_TYPES = {
  waterweed: {
    id: "waterweed",
    name: "水草",
    locations: ["farmPond", "villagePond", "mountainStream"],
    minWaterQuality: 0,
    difficulty: 0.12,
    sellPrice: 4,
    weight: 4,
    color: "#5f9460",
  },
  crucian: {
    id: "crucian",
    name: "小鲫鱼",
    locations: ["farmPond", "villagePond"],
    seasons: ["spring", "summer", "autumn", "winter"],
    minWaterQuality: 0,
    difficulty: 0.25,
    sellPrice: 12,
    weight: 8,
    color: "#d8c17a",
  },
  snail: {
    id: "snail",
    name: "田螺",
    locations: ["farmPond", "villagePond"],
    seasons: ["spring", "summer", "autumn"],
    minWaterQuality: 0,
    difficulty: 0.18,
    sellPrice: 8,
    weight: 6,
    weatherBonus: { rainy: 4 },
    color: "#8a7a66",
  },
  riverShrimp: {
    id: "riverShrimp",
    name: "河虾",
    locations: ["villagePond"],
    seasons: ["spring", "summer", "autumn"],
    minWaterQuality: 1,
    difficulty: 0.34,
    sellPrice: 22,
    weight: 6,
    color: "#f0a078",
  },
  carp: {
    id: "carp",
    name: "鲤鱼",
    locations: ["villagePond"],
    seasons: ["summer", "autumn"],
    minWaterQuality: 1,
    difficulty: 0.42,
    sellPrice: 30,
    weight: 5,
    color: "#e7b34d",
  },
  loach: {
    id: "loach",
    name: "泥鳅",
    locations: ["villagePond", "mountainStream"],
    seasons: ["summer", "autumn", "winter"],
    minWaterQuality: 2,
    difficulty: 0.52,
    sellPrice: 36,
    weight: 4,
    weatherBonus: { rainy: 5 },
    color: "#9b7b54",
  },
  grassFish: {
    id: "grassFish",
    name: "草鱼",
    locations: ["villagePond"],
    seasons: ["summer", "autumn"],
    minWaterQuality: 2,
    difficulty: 0.56,
    sellPrice: 42,
    weight: 4,
    color: "#70b77e",
  },
  mountainTrout: {
    id: "mountainTrout",
    name: "山溪鱼",
    locations: ["mountainStream"],
    seasons: ["spring", "summer", "autumn"],
    minWaterQuality: 2,
    difficulty: 0.62,
    sellPrice: 48,
    weight: 5,
    color: "#75b9d8",
  },
  springRelicFish: {
    id: "springRelicFish",
    name: "老泉鱼",
    locations: ["mountainStream"],
    seasons: ["winter", "spring"],
    minWaterQuality: 3,
    difficulty: 0.76,
    sellPrice: 88,
    weight: 2,
    color: "#d8c17a",
  },
};
const FISH_IDS = Object.keys(FISH_TYPES);
const SPRING_SAMPLE_BUNDLE = {
  cropCosts: { radish: 1, bokChoy: 1, bean: 1 },
  resourceCosts: { wildGreens: 1, stone: 3 },
  rewardGold: 160,
  rewardSeeds: { wheat: 6, bean: 3 },
  rewardResources: { wood: 8, copperOre: 1 },
};
const SPRING_FAIR_EVENT_ID = "springSeedMarket";
const SPRING_FAIR_START_DAY = 13;
const SPRING_FAIR_END_DAY = 15;
const SPRING_FAIR_ITEMS = [
  { id: "radishPack", label: "萝卜种子包 x10", gold: 40, seeds: { radish: 10 } },
  { id: "bokChoyPack", label: "小白菜种子包 x8", gold: 42, seeds: { bokChoy: 8 } },
  { id: "beanTrial", label: "早豆试种包 x6", gold: 36, seeds: { bean: 6 }, unlockSeeds: ["bean"] },
  { id: "resourcePack", label: "山路补给包", gold: 32, resources: { wood: 8, stone: 8 } },
  { id: "toolPartsPack", label: "工具材料包", gold: 70, resources: { copperOre: 3, coal: 2, scrap: 2 } },
];
const BRAND_PACK_GOOD_ID = "brandGiftBox";
const PROCESSING_RECIPES = {
  radishSoup: {
    id: "radishSoup",
    name: "萝卜汤",
    inputCropId: "radish",
    inputCount: 2,
    sellPrice: 45,
    stations: ["kitchen", "processor"],
    description: "把 2 个萝卜煮成更高价值的汤。",
  },
  wheatBread: {
    id: "wheatBread",
    name: "小麦面包",
    inputCropId: "wheat",
    inputCount: 2,
    sellPrice: 70,
    stations: ["kitchen", "processor"],
    description: "把 2 个小麦烤成面包。",
  },
  beanCan: {
    id: "beanCan",
    name: "豆子罐头",
    inputCropId: "bean",
    inputCount: 2,
    sellPrice: 105,
    stations: ["kitchen", "processor"],
    description: "把 2 个豆子做成便于出货的罐头。",
  },
  driedRadish: {
    id: "driedRadish",
    name: "萝卜干",
    inputCropId: "radish",
    inputCount: 3,
    sellPrice: 62,
    stations: ["dryer"],
    description: "把 3 个萝卜晾晒成耐储存的萝卜干。",
  },
  driedWheat: {
    id: "driedWheat",
    name: "干麦束",
    inputCropId: "wheat",
    inputCount: 3,
    sellPrice: 96,
    stations: ["dryer"],
    description: "把 3 个小麦整理成更高价值的干麦束。",
  },
  driedBeans: {
    id: "driedBeans",
    name: "干豆",
    inputCropId: "bean",
    inputCount: 3,
    sellPrice: 142,
    stations: ["dryer"],
    description: "把 3 个豆子晾成适合出货的干豆。",
  },
  [BRAND_PACK_GOOD_ID]: {
    id: BRAND_PACK_GOOD_ID,
    name: "品牌礼盒",
    inputCropId: DEFAULT_CROP_ID,
    inputCount: 0,
    sellPrice: 180,
    stations: ["brand"],
    description: "消耗任意 2 个作物和 1 个普通加工品，包装成高价值品牌礼盒。",
  },
};
const PROCESSED_GOOD_IDS = Object.keys(PROCESSING_RECIPES);
const MACHINE_PROCESSING_DAYS = 1;
const BUILDABLE_ITEMS = {
  processor: {
    id: "processor",
    name: "加工桶",
    price: 90,
    objectType: "processor",
    category: "facilities",
    machine: true,
    description: "可摆放设施，用来隔夜加工成品。",
  },
  dryer: {
    id: "dryer",
    name: "晾晒架",
    price: 75,
    objectType: "dryer",
    category: "facilities",
    machine: true,
    description: "可摆放设施，用来隔夜制作干货。",
  },
  flowerBox: {
    id: "flowerBox",
    name: "花箱",
    price: 25,
    objectType: "flowerBox",
    category: "decorations",
    machine: false,
    description: "农场装饰，不阻挡移动。",
  },
  gardenLamp: {
    id: "gardenLamp",
    name: "小路灯",
    price: 35,
    objectType: "gardenLamp",
    category: "decorations",
    machine: false,
    description: "用于标记道路边缘，不阻挡移动。",
  },
  bench: {
    id: "bench",
    name: "长椅",
    price: 40,
    objectType: "bench",
    category: "decorations",
    machine: false,
    description: "安静的农场摆件，不阻挡移动。",
  },
  fence: {
    id: "fence",
    name: "篱笆",
    price: 12,
    objectType: "fence",
    category: "decorations",
    machine: false,
    description: "可自由摆放的装饰篱笆，不阻挡移动。",
  },
};
const BUILDABLE_IDS = Object.keys(BUILDABLE_ITEMS);
const SEASON_FLOWER_COLORS = {
  spring: ["#f07f78", "#e7b34d", "#75b9d8"],
  summer: ["#ffb35d", "#f4e07a", "#d86f4c"],
  autumn: ["#c97d54", "#e7b34d", "#b86642"],
  winter: ["#d9edf7", "#9fc8df", "#f4ecd8"],
};
const MAILBOX_LETTERS = [
  {
    id: "welcome",
    day: 1,
    from: "镇长",
    title: "欢迎来到农场",
    body: "农场已经交到你手上。先从锄地、播种和浇水开始，慢慢把这里恢复起来。",
  },
  {
    id: "miraSeedSample",
    day: 2,
    from: "林岚",
    title: "土壤样本补给",
    body: "昨天的土壤状态不错。我留了几包萝卜种子在信箱里，继续扩大试种面积吧。",
    rewardSeeds: { radish: 3 },
  },
  {
    id: "theoMarketNote",
    day: 3,
    from: "何涛",
    title: "种子铺折扣记录",
    body: "种子铺今天会开始供应小麦种子。这是给新农场主的一点采购补贴。",
    rewardGold: 25,
  },
  {
    id: "linaShippingTip",
    day: 4,
    from: "柳青",
    title: "出货箱提示",
    body: "睡前可以把作物放进出货箱，第二天会统一结算。放错了也能在睡觉前撤回。",
  },
  {
    id: "beanTrial",
    day: 5,
    from: "林岚",
    title: "豆子试种",
    body: "豆子成熟更慢，但售价更高。先用这两包种子试一小块地。",
    rewardSeeds: { bean: 2 },
  },
  {
    id: "springBasketInvite",
    day: 12,
    from: "柳青",
    title: "安心菜篮试单",
    body: "卫生站想试做一批安心菜篮。春季小白菜和萝卜都适合，你可以先准备稳定的出货记录。",
    rewardSeeds: { bokChoy: 4 },
  },
  {
    id: "qingmingPathNotice",
    day: 22,
    from: "村委会",
    title: "清明路边整理",
    body: "村口旧路边已经清出一块空地。第一年不急着大建，先把基础出货和集市线跑稳。",
    rewardGold: 20,
  },
  {
    id: "summerCropGuide",
    day: 31,
    from: "何涛",
    title: "夏季种子表",
    body: "立夏后小麦和番茄会成为主力。豆子和玉米也会陆续适合播种，但别一次买空金币。",
    rewardSeeds: { wheat: 3, tomato: 2 },
  },
  {
    id: "waterChannelNote",
    day: 45,
    from: "柳青",
    title: "水渠旧账",
    body: "大暑前后大家会重新讨论水渠。等建造入口修复后，水利会成为减少重复浇水的关键。",
    rewardGold: 30,
  },
  {
    id: "cornTrial",
    day: 51,
    from: "何涛",
    title: "玉米试种",
    body: "夏末到秋季可以试种玉米。成长慢一点，但集市和出货箱都认这个品类。",
    rewardSeeds: { corn: 2 },
  },
  {
    id: "autumnWarehouse",
    day: 61,
    from: "村委会",
    title: "秋季仓储提醒",
    body: "立秋后村里会更关注批量出货。红薯耐放，适合为合作社和冬季订单做准备。",
    rewardSeeds: { sweetPotato: 3 },
  },
  {
    id: "harvestFairPrep",
    day: 73,
    from: "林岚",
    title: "收获节准备",
    body: "白露附近会有收获节加成。把成熟作物提前放入出货箱，睡觉结算时收益会更好。",
  },
  {
    id: "processingReminder",
    day: 82,
    from: "柳青",
    title: "加工线预告",
    body: "等加工桶和晾晒架修好，原料就不只能直接卖了。秋季以后可以开始考虑加工品库存。",
    rewardGold: 35,
  },
  {
    id: "winterSeedGuide",
    day: 91,
    from: "何涛",
    title: "冬季仍然能种",
    body: "立冬后不是只能等年终。菠菜、小白菜和部分耐寒作物还能继续撑起稳定现金流。",
    rewardSeeds: { spinach: 4 },
  },
  {
    id: "yearEndReviewNotice",
    day: 106,
    from: "村委会",
    title: "年终评价准备",
    body: "小寒后会开始统计第一年的生产、经济、社区和建设情况。不要只看金币，村庄变化也会计入评价。",
  },
  {
    id: "majorColdLetter",
    day: 120,
    from: "镇长",
    title: "第一年年终会",
    body: "大寒最后一天，一周目会进入年度总结。下一年要不要扩大集市、修水利、做合作社，都要从今年的成果里长出来。",
    rewardGold: 80,
  },
];
const WEATHER = {
  sunny: { label: "晴天", waterCrops: false },
  rainy: { label: "雨天", waterCrops: true },
};
const TOOL_COSTS = {
  hoe: { energy: 1, minutes: 10 },
  seeds: { energy: 1, minutes: 10 },
  wateringCan: { energy: 1, minutes: 10 },
  scythe: { energy: 1, minutes: 10 },
  fishingRod: { energy: 2, minutes: 15 },
};
const TOOL_UPGRADE_IDS = ["hoe", "wateringCan", "scythe"];
const TOOL_MAX_LEVEL = 3;
const RESOURCE_TOOL_UPGRADES = {
  hoe: {
    label: "锄头升级",
    costs: {
      2: { gold: 40, resources: { wood: 6, copperOre: 2 } },
      3: { gold: 90, resources: { wood: 10, copperOre: 4, coal: 2 } },
    },
  },
  wateringCan: {
    label: "水壶升级",
    waterBonus: 1,
    costs: {
      2: { gold: 50, resources: { copperOre: 3, scrap: 1 } },
      3: { gold: 110, resources: { copperOre: 5, scrap: 3, coal: 2 } },
    },
  },
  scythe: {
    label: "镰刀升级",
    costs: {
      2: { gold: 40, resources: { stone: 5, copperOre: 2 } },
      3: { gold: 90, resources: { stone: 8, copperOre: 4, scrap: 2 } },
    },
  },
};
const keys = new Set();
const debug = {
  collision: false,
  grid: false,
  testSkipActive: false,
};

const editor = {
  enabled: false,
  layer: "ground",
  tileId: 3,
  objectType: "sign",
  tool: "paint",
  hoverTile: null,
  selectedObjectTile: null,
  isPainting: false,
  historyDraft: null,
  undoStack: [],
  redoStack: [],
  lastSafetyWarning: "",
};

const interaction = {
  warpCooldown: 0,
};

const fishing = {
  active: false,
  phase: "idle",
  fishId: null,
  locationId: null,
  targetTile: null,
  waitTimer: 0,
  barY: 0.58,
  fishY: 0.48,
  fishVelocity: 0,
  moveTimer: 0,
  progress: 0,
  perfect: true,
  elapsed: 0,
};

const minimapState = {
  hoverTile: null,
  target: null,
  visible: false,
};

const dialogState = {
  pages: [],
  index: 0,
};

const buildShop = {
  tab: "upgrades",
};

let activeSaveSlot = DEFAULT_SAVE_SLOT;
const toolFeedbacks = [];
const visualEffects = [];
const screenEffects = [];
const motion = {
  playerAction: "idle",
  playerActionStartedAt: 0,
  playerActionUntil: 0,
  playerMoving: false,
  playerRunning: false,
  playerStepClock: 0,
  lastNpcTalkId: null,
  lastNpcTalkUntil: 0,
};
let audioContext = null;

const SOUND_PATTERNS = {
  select: [{ frequency: 520, duration: 0.055, gain: 0.035 }],
  dialog: [{ frequency: 420, duration: 0.045, gain: 0.026 }],
  error: [{ frequency: 160, duration: 0.09, gain: 0.045 }],
  hoe: [{ frequency: 180, duration: 0.075, gain: 0.045 }],
  plant: [
    { frequency: 440, duration: 0.055, gain: 0.032 },
    { frequency: 660, delay: 0.052, duration: 0.06, gain: 0.028 },
  ],
  water: [
    { frequency: 620, duration: 0.04, gain: 0.026 },
    { frequency: 500, delay: 0.05, duration: 0.05, gain: 0.022 },
  ],
  harvest: [
    { frequency: 660, duration: 0.055, gain: 0.035 },
    { frequency: 880, delay: 0.055, duration: 0.06, gain: 0.03 },
  ],
  coin: [
    { frequency: 760, duration: 0.05, gain: 0.032 },
    { frequency: 980, delay: 0.052, duration: 0.065, gain: 0.028 },
  ],
  ship: [{ frequency: 320, duration: 0.08, gain: 0.036 }],
  quest: [
    { frequency: 540, duration: 0.06, gain: 0.034 },
    { frequency: 720, delay: 0.06, duration: 0.06, gain: 0.032 },
    { frequency: 960, delay: 0.12, duration: 0.08, gain: 0.028 },
  ],
  warp: [
    { frequency: 300, duration: 0.08, gain: 0.034 },
    { frequency: 540, delay: 0.07, duration: 0.11, gain: 0.03 },
  ],
  sleep: [{ frequency: 260, duration: 0.16, gain: 0.028 }],
};

const EFFECT_DURATIONS = {
  hoe: 420,
  plant: 620,
  water: 580,
  harvest: 720,
  error: 420,
  coin: 700,
  ship: 680,
  quest: 1050,
  warp: 760,
  sleep: 1200,
};

const TOOLS = [
  { id: "hand", key: "1", name: "手", hint: "查看" },
  { id: "hoe", key: "2", name: "锄头", hint: "锄地" },
  { id: "seeds", key: "3", name: "种子", hint: "播种" },
  { id: "wateringCan", key: "4", name: "水壶", hint: "浇水" },
  { id: "scythe", key: "5", name: "镰刀", hint: "收获" },
  { id: "fishingRod", key: "6", name: "钓竿", hint: "面对水面钓鱼" },
];

const toolsById = Object.fromEntries(TOOLS.map((tool) => [tool.id, tool]));
const toolsByKey = Object.fromEntries(TOOLS.map((tool) => [tool.key, tool]));
const TOOL_SHORT_LABELS = {
  hand: "手",
  hoe: "锄",
  seeds: "种",
  wateringCan: "水",
  scythe: "镰",
  fishingRod: "钓",
};
const FEATURE_DEFS = {
  villageMarket: {
    label: "村庄杂货铺",
    requirement: "把第一批作物投入出货箱并睡觉结算后，村里才会重新整理杂货铺。",
  },
  processing: {
    label: "加工设施",
    requirement: "完成电商助农试单并发货结算后，才能修复加工设施。",
  },
  construction: {
    label: "建造与扩建",
    requirement: "完成柳青的出货记录任务后，木匠才会重新开放建造服务。",
  },
  cooperative: {
    label: "合作社",
    requirement: "完成第一批加工品出货结算后，合作社旧窗口才会重新开放。",
  },
  tourism: {
    label: "游客服务",
    requirement: "第一年年终会后选择“乡村旅游”路线，游客服务才会修复。",
  },
  brand: {
    label: "品牌包装",
    requirement: "第一年年终会后选择“品牌农产品”路线，品牌包装台才会修复。",
  },
  irrigation: {
    label: "水利工程",
    requirement: "第一年年终会后选择“水利与扩建”路线，旧水泵才会修复。",
  },
};
const CODELINE_RELEASES = {
  "0.1.20": "对齐美术线 v0.1.19 合并后的一周目验收入口，保留色块 fallback。",
  "0.1.21": "固定美术资源 ID 契约，集中维护 tile、NPC、作物、鱼类、设施、工具和 UI 图标命名。",
  "0.1.22": "整理内容数据索引，方便后续配置化和美术查表。",
  "0.1.23": "补第二年路线起步闭环，合作社、旅游、品牌和水利各有连续目标。",
  "0.1.24": "补四季节庆互动说明、限定奖励和 NPC 节庆反馈。",
  "0.1.25": "补农场分区建造提示和可用性检查。",
  "0.1.26": "固定一年推荐节奏和数值验收目标。",
  "0.1.27": "补视觉状态适配层，稳定暴露对象、NPC、作物、设施和资源点状态。",
  "0.1.28": "补美术接入验收工具，开发面板可扫描当前地图资源、缺失状态和资源清单。",
  "0.1.29": "补一周目完整通关验收入口一致性，统一任务面板、路牌、小地图和土地庙目标提示。",
  "0.1.30": "补春季前 15 天体验调优，强化开荒、山里资源和春集窗口。",
  "0.1.31": "补村民支线剧情 V3，每个主要村民新增后续任务、能力奖励和完成后的个人反馈。",
  "0.1.32": "收口商店和出货箱库存显示，移除零库存行，并把种子铺迁到村庄专门商铺。",
  "0.1.33": "拆分村庄种子铺和杂货铺职责，种子铺只买种子，杂货铺只收购已有库存，并统一导航文案。",
  "0.1.34": "验收商铺路线，统一 Q 面板、路牌、小地图和缺种提示到村庄种子铺，杂货铺只作为修复后收购点。",
  "0.1.35": "强化开局 1-5 天闭环，引导第一次去村庄种子铺补货，并保持缺种、缺水、无出货物品为轻提示。",
  "0.1.36": "补春季样本和春集安全提示，样本缺口显示来源，春集窗口同步任务、路牌和小地图高亮。",
  "0.1.37": "升级出货箱和杂货铺，出货箱支持总览与一键撤回，杂货铺支持卖全部可见库存。",
  "0.1.38": "补钓鱼和水质早期入口，村塘水质牌说明污染阶段和清淤后鱼类解锁。",
  "0.1.39": "串联村民支线和村情目标，村情板显示对应 NPC、设施变化和现实议题。",
  "0.1.40": "完成春季 30 天推荐路线验收，固定第一次出货、杂货铺、山里资源、春集、样本包和夏季资金目标。",
  "0.1.41": "补夏秋冬内容密度，强化季节台词、节气订单和公告提示的季度目标感。",
  "0.1.42": "强化土地庙一周目收束，按主线、村情、水质和第二年路线分类提示缺口，并扩展一周目回顾文本。",
  "0.1.43": "轻量整理导航文案，路牌保留村庄种子铺坐标提示，避免再扩大商铺专项改动。",
  "0.1.44": "补开局村庄初访导览，第一次进村用日志和浮字提示关键地点，不弹窗打断移动。",
  "0.1.45": "轻量补种子铺作物信息，显示成长、售价和当季推荐，不扩大商铺系统。",
  "0.1.46": "强化春季样本箱信息，交互时显示缺口来源和奖励。",
  "0.1.47": "补山里资源节奏提示，资源点显示今日剩余次数和工具升级所需资源。",
  "0.1.48": "调整春集错过后的处理方式，移除保底购买入口，样本包可后续年份继续完成。",
  "0.1.49": "补春季月底验收提醒，春季 26-30 天集中检查杂货铺、资源点、春集、样本包和夏季资金。",
  "0.1.50": "补夏季启动提示，夏季初引导稳定供货、社区订单和村民支线成为主目标。",
  "0.1.51": "种子铺 V2：展示种子成长阶段、售价、适季和金币差额提示。",
  "0.1.52": "春季样本包改为跨年内容，不再作为春季通关验收的硬阻塞，也不新增临时购买入口。",
  "0.1.53": "重排春季前 15 天目标，开荒、出货、修铺、山里资源和春集形成早期节奏。",
  "0.1.54": "强化山里资源与工具升级线，资源点、工具棚和升级消耗作为中期成长入口。",
  "0.1.55": "钓鱼与水质进入早期主线视野，农场池塘、村塘和山溪按水质解锁水产。",
  "0.1.56": "村民支线继续绑定设施解锁和能力奖励，未接支线仍只在 NPC 对话后显示。",
  "0.1.57": "补夏季主线口径，稳定供货、社区订单和助农集市成为夏季核心。",
  "0.1.58": "补秋季加工与合作社口径，电商试单、加工品和合作社合同构成产业链。",
  "0.1.59": "补冬季年终与第二年选择口径，年终会后进入四条第二年路线。",
  "0.1.60": "土地庙一周目收束定稿，最终追问前回顾设施、村民、水质、经济和第二年路线。",
  "0.1.61": "种子铺收口：只显示当前季可购买种子，不显示非本季预告组；确认村庄设施采用坏损、修复、强化一、强化二的阶段路线。",
  "0.1.62": "种子铺后续预留：继续保持简洁商品列表，后续新品和折扣只跟随设施强化解锁。",
  "0.1.63": "村庄设施阶段模型：新增坏损/未建、修复可用、强化一、强化二的统一等级字段。",
  "0.1.64": "设施修复 V1：村情目标完成后对应设施进入修复可用状态，地图、路牌和手册同步显示。",
  "0.1.65": "设施强化一：已修复设施可消耗金币、作物和资源升级到强化一，获得更明确的公共服务反馈。",
  "0.1.66": "设施强化二：设施可继续消耗加工品和高阶资源升级到强化二，作为第二年和土地庙进度储备。",
  "0.1.67": "设施剧情绑定：设施阶段文本接入对应 NPC 和现实议题，让升级不只显示数值。",
  "0.1.68": "设施经济平衡：修复、强化一、强化二分别使用不同资源结构，避免前期一次性修满。",
  "0.1.69": "设施美术接入契约：社区设施暴露 ruin、repaired、upgrade1、upgrade2 稳定视觉状态。",
  "0.1.70": "一周目设施验收：基础设施修复作为第一年目标，强化一为可达目标，强化二保留到第二年继续推进。",
  "0.1.71": "设施目标入口：Q 任务面板、村情记录板、路牌和小地图统一指向当前可修复或可强化设施。",
  "0.1.72": "设施目标验收补漏：设施入口覆盖未开放、可修复、已修复、强化一和强化二，并显示缺口来源。",
  "0.1.73": "设施强化反馈 V2：地图、变化手册和村民对话同步显示设施修复与强化阶段变化。",
  "0.1.74": "设施奖励实装：托管、工坊、饭点、巡诊、冷链和清淤分别影响奖励、成本、体力、收益和水质。",
  "0.1.75": "第二年路线加入设施强化二目标，土地庙缺口会提示当前路线推荐强化哪座设施。",
  "0.1.76": "水质与钓鱼联动到村塘清淤等级，图鉴显示水质、地点、季节和设施条件。",
  "0.1.77": "补村民设施后续支线，支线仍需先和对应 NPC 对话接取后才显示在任务面板。",
  "0.1.78": "季节目标接入设施节奏，夏季修复、秋季产业、冬季强化和年终会形成一周目推进线。",
  "0.1.79": "土地庙一周目回顾强化，列出修复设施、强化设施、帮助的人、水质变化和第二年路线。",
  "0.1.80": "一周目完整验收版：固定春夏秋冬推荐路线、设施升级路线和土地庙最终缺口检查。",
  "0.1.81": "工具动作时序：运行时接入玩家工具多帧表，一次性动作按持续时间播放完整 wind-up/impact/recover。",
  "0.1.82": "美术资源审计 V2：开发面板同时显示当前地图资源和 P0/P1/P2 后续预期资源。",
  "0.1.83": "作物美术接入：作物 PNG 支持底部锚点和高矮规格，缺图继续使用色块 fallback。",
  "0.1.84": "村情设施四阶段接入：社区设施可读取 ruin/repaired/upgrade1/upgrade2 四阶段 PNG。",
  "0.1.85": "山里资源点与建造物接入：资源点三态和建造物 active 图改用稳定资源路径。",
  "0.1.86": "水产与水质表现：水产图鉴尝试显示 fish 图标，缺图回退颜色圆点。",
  "0.1.87": "一周目节奏回归：验收春夏秋冬和土地庙节点的目标入口与资源节奏。",
  "0.1.88": "村民剧情与任务提示补厚：设施强化后的 NPC 反馈优先引用实际完成设施。",
  "0.1.89": "土地庙最终收束打磨：缺口提示压缩为主线、村情、水质、路线设施和第二年路线。",
  "0.1.90": "一周目可玩验收版：P0/P1/P2 资源接入状态和最短路线写入 README，fallback 与 assets=1 均可运行。",
  "0.1.91": "美术接入验收：资源审计显示尺寸、锚点和当前地图/P0-P2 覆盖，便于检查遮挡和排序。",
  "0.1.92": "P1 资源缺口收口：建造物、节庆主线物、水产、UI 和工具图标进入正式资源契约。",
  "0.1.93": "钓鱼与水质体验 V3：图鉴和钓鱼提示突出水质阶段、地点、季节和下一批鱼类。",
  "0.1.94": "设施升级体验 V3：设施等级、奖励、村民反馈、村庄变化和土地庙回顾统一展示。",
  "0.1.95": "一周目自然游玩平衡：春季起步资金、种子、体力、山里资源和出货节奏进入验收口径。",
  "0.1.96": "村民支线后续验收：已接支线继续显示在 Q 面板，奖励优先服务工具、种子、设施和体力成长。",
  "0.1.97": "节庆互动 V2 验收：四季节庆以限定商店、订单、剧情对话和奖励服务一周目节奏。",
  "0.1.98": "存档与测试安全：旧存档 normalize、测试跳过不自动保存、导入导出和快捷键回归纳入验收。",
  "0.1.99": "数据整理准备：作物、鱼类、设施、任务、节庆和资源契约在常量区形成稳定查表口径。",
  "0.2.0": "一周目可演示版本：无外部素材仍可玩，有素材时作物、设施、资源点、水产和 UI 表现完整。",
};
const ART_ASSET_CONTRACT_VERSION = "0.2.0";
const ART_ASSET_BASE_PATH = "./assets/game";
const ART_ASSET_LOADING_ENABLED =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("assets") === "1";
const ART_ASSET_GROUPS = {
  tiles: ["grass", "deepGrass", "dirt", "path", "water", "wall", "floor", "cropPlot"],
  player: ["idle", "walk", "run", "inspect", "hoe", "seeds", "wateringCan", "scythe", "fishingRod", "fishingCatch", "harvest", "sleep", "warp"],
  npcs: ["mira", "theo", "lina", "nannan", "uncleChen"],
  crops: CROP_IDS,
  fish: FISH_IDS,
  objects: [
    "sign",
    "directionSign",
    "farmhouseSmall",
    "seedShopBuilding",
    "villageShopBuilding",
    "villageSmallHouse",
    "villageServiceHouse",
    "seedShop",
    "shop",
    "shippingBin",
    "mailbox",
    "bed",
    "well",
    "ruin",
    "landShrine",
    "resourceNode",
    "springFairStall",
    "springSampleCrate",
    "issueBoard",
    "communityFacility",
    "marketStall",
    "basketPoint",
    "tastingTable",
    "ecommerceDesk",
    "cooperativeDesk",
    "tourismDesk",
    "brandDesk",
    "irrigationPump",
  ],
  buildables: BUILDABLE_IDS,
  tools: TOOLS.map((tool) => tool.id),
  ui: ["gold", "energy", "weather", "quest", "inventory", "calendar", "map", "build", "journal"],
};
const VISUAL_STATES = {
  default: "default",
  locked: "locked",
  ruin: "ruin",
  repairing: "repairing",
  repaired: "repaired",
  upgrade1: "upgrade1",
  upgrade2: "upgrade2",
  active: "active",
  ready: "ready",
  depleted: "depleted",
  completed: "completed",
};
const CONTENT_DATA_INDEX = {
  crops: CROP_IDS,
  fish: FISH_IDS,
  buildables: BUILDABLE_IDS,
  tools: TOOLS.map((tool) => tool.id),
  features: Object.keys(FEATURE_DEFS),
  secondYearRoutes: ["cooperative", "tourism", "irrigation", "brand"],
};
const FESTIVAL_DEFS = {
  springSeedMarket: {
    id: "springSeedMarket",
    eventId: "springSeedMarket",
    title: "春集种子会",
    mapId: "village",
    targetLabel: "春集种子摊",
    limitedShop: "早豆试种包、春季补给、工具材料",
    order: "春季样本箱开放登记，可当年提交，也可后续年份补齐。",
    reward: "高收益早豆种子、工具材料和夏季启动提醒。",
    npcLine: "今天春集开摊，村里人会更关心你有没有为夏天留一口气。",
  },
  summerSolsticeMarket: {
    id: "summerSolsticeMarket",
    eventId: "summerSolsticeMarket",
    title: "夏至夜市",
    mapId: "village",
    targetLabel: "村庄广场",
    limitedShop: "夏季补种、夜市菜篮和茶铺试吃",
    order: "当天出货收益提高，适合把稳定供货成果拿给村里看。",
    reward: "现金流加成、社区订单反馈和夏季 NPC 台词。",
    npcLine: "夜市不是为了热闹一天，是让大家看见每天都有菜能到。",
  },
  harvestFair: {
    id: "harvestFair",
    eventId: "harvestFair",
    title: "秋收会",
    mapId: "village",
    targetLabel: "合作社窗口",
    limitedShop: "秋季包装、加工样品和合作社合同提示",
    order: "当天出货收益提高，适合提交加工品和合作社样品。",
    reward: "合作社信用、加工路线反馈和秋季 NPC 台词。",
    npcLine: "秋收会看的是一条链：谁种、谁包、谁运、谁分账。",
  },
  majorColdYearEnd: {
    id: "majorColdYearEnd",
    eventId: "majorColdYearEnd",
    title: "冬年终会",
    mapId: "farm",
    targetLabel: "床 / 系统菜单睡觉",
    limitedShop: "无商店，重点是年度总结和第二年方向",
    order: "睡觉后查看年终会，确认村庄变化、现实议题和路线选择。",
    reward: "年终补助、第二年路线和土地庙最终前置。",
    npcLine: "年终会要回答的不是赚了多少，而是谁的日子被照看到了。",
  },
};
const YEAR_ONE_BALANCE_TARGETS = [
  "春季：第一次出货、修复杂货铺、参加春集，样本包可跨年补齐，保留约 200g 夏季启动资金。",
  "夏季：稳定供货和社区订单，至少完成 1 个村民支线与 1 个村情目标。",
  "秋季：修复加工、跑通加工品出货，加入合作社并完成首张合同。",
  "冬季：补齐村情目标、合作社合同和 300g 现金，睡到大寒年终会。",
];
const STORY_PHASES = [
  {
    id: "springFirstField",
    seasonId: "spring",
    title: "春季：返乡第一块地",
    summary: "恢复老宅前的第一块菜地，跑通种植、收获、出货和村庄第一处修复。",
    rewardText: "解锁村庄反馈、杂货铺修复和第一批村民信任。",
    completeText: "春季基础生产线已跑通，村子开始相信农场可以重新运转。",
  },
  {
    id: "summerMarketPrep",
    seasonId: "summer",
    title: "夏季：助农集市筹备",
    summary: "把个人种地变成稳定供给：采购种子、完成村民任务，修复建造入口。",
    rewardText: "解锁建造公告牌、社区订单和稳定集市准备。",
    completeText: "夏季集市筹备完成，可以开始考虑设施、装饰和固定升级。",
  },
  {
    id: "autumnCoopTrial",
    seasonId: "autumn",
    title: "秋季：合作社与加工试运行",
    summary: "扩大出货规模，修复加工设施，准备把原料升级为更高价值的加工品。",
    rewardText: "解锁加工品、合作社样品和节气批量合同。",
    completeText: "秋季产业链初步成型，农场已经不只是卖原料。",
  },
  {
    id: "winterYearEnd",
    seasonId: "winter",
    title: "冬季：年终整理",
    summary: "稳定现金流、补齐社区任务，准备大寒年终会和第二年方向选择。",
    rewardText: "解锁年终评价、第二年方向选择和土地庙最终追问。",
    completeText: "第一年进入收束阶段，接下来要做年度总结和下一年路线。",
  },
];
const PLAYTHROUGH_CHECKPOINTS = [
  {
    id: "spring",
    skipValue: "spring",
    title: "春季完成",
    description: "验收第一章是否能从开荒走到村庄修复和山里资源点；春集与样本包允许后续年份补齐。",
    target: "完成第一次出货，修复停业杂货铺，采集山里资源，并准备夏季启动资金。",
    entry: "农场出货箱 16,20；村庄公告栏 16,13；村庄杂货铺 24,20；山里资源点；村庄春集摊位和样本箱。",
    needs: "至少 3 个可收获作物、出货结算、山里资源点采集记录，以及 200g 左右夏季启动资金。",
    reward: "杂货铺恢复、山里资源线和夏季启动节奏；春集与春季样本箱可在后续年份继续完成。",
    saveImpact: "测试跳过到此节点不会自动保存；手动保存才写入当前槽。",
    notice: "公告：春天先卖出第一筐菜、找到资源、修回第一个铺面，让夏天不是空手开局。",
    signHint: `验收提示：春季先确认出货箱、村庄公告栏、停业杂货铺、山里资源点都能找到；春集摊位和样本箱属于可后续补齐内容。`,
  },
  {
    id: "summer",
    skipValue: "summer",
    title: "夏季集市",
    description: "验收助农集市是否能把个人种植接到村庄订单。",
    target: "完成村民任务、推进村情目标、修复木匠公告牌并跑通社区订单。",
    entry: "村庄广场 NPC；村情记录板 14,17；木匠公告牌 31,20；菜篮点和试吃桌。",
    needs: "累计 8 个收获、1 个村民任务、1 个村情目标、至少 5 包种子。",
    reward: "建造入口、稳定集市、电商助农角和番茄种子奖励。",
    saveImpact: "测试状态只更新内存和 HUD，不覆盖正式存档。",
    notice: "公告：集市不是临时卖一次菜，而是让老人、茶铺和卫生站知道每天都有供应。",
    signHint: "验收提示：夏季路牌应把玩家指向村庄广场、木匠公告牌和社区订单点。",
  },
  {
    id: "autumn",
    skipValue: "autumn",
    title: "秋季加工",
    description: "验收电商、加工和合作社是否形成第一条产业链。",
    target: "完成电商试单，修复加工设施，结算加工品出货，加入合作社试运行。",
    entry: "村庄电商助农角；农场加工桶 18,20；村庄合作社窗口 33,17。",
    needs: "累计 18 个收获、2 个村民任务、加工品 1 个、合作社样品。",
    reward: "加工品收入、合作社批量合同、合作社路线前置条件。",
    saveImpact: "测试跳过后仍需手动保存；自动保存会被拦截。",
    notice: "公告：秋季开始检查分拣、包装、加工和统一账本，不能只看原料卖价。",
    signHint: "验收提示：秋季路牌应能引向电商助农角、加工桶和合作社窗口。",
  },
  {
    id: "winter",
    skipValue: "winter",
    title: "冬季年终",
    description: "验收第一年收束是否能从经营数据落到村庄变化。",
    target: "完成冬季目标，睡到大寒第五天，查看年终会和第二年方向。",
    entry: "农场床或系统菜单睡觉按钮；合作社窗口；村情记录板；出货箱。",
    needs: "累计 30 个收获、3 个村民任务、2 张合作社合同、1 座设施强化二、300g。",
    reward: "年终补助、年度总结、第二年方向选择和土地庙最终前置。",
    saveImpact: "年终正式游玩可自动保存；测试跳过节点不会自动写入槽位。",
    notice: "公告：年终会要说明这一年改变了谁的日常，而不只是列出收入。",
    signHint: "验收提示：冬季路牌应提醒玩家补村情目标、合作社合同和年终睡觉入口。",
  },
  {
    id: "shrine",
    skipValue: "shrine",
    title: "土地庙最终",
    description: "验收一周目核心内容和第二年首个里程碑是否能收束到主题问答。",
    target: "完成全部土地庙缺口，前往山里的旧土地庙追问原因。",
    entry: "农场北侧山路；山地图旧土地庙 21,9。",
    needs: "一周目主线、全部村情目标、年终会、第二年方向、路线推荐设施强化二和路线起步闭环。",
    reward: "土地庙最终问答，解释一代代人离开、回来、修复的循环主题。",
    saveImpact: "测试跳过会直接打开土地庙状态，但仍不自动保存。",
    notice: "公告：土地庙不收供品，只检查村庄是否真的有人被照看过。",
    signHint: "验收提示：最终节点应由小地图、山路路牌和土地庙缺口共同指向。",
  },
];
const PLAYTHROUGH_REPAIR_NOTES = {
  spring: `若卡住，按 Q 看当前目标；先完成出货和杂货铺修复，再去山里采集资源，春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天参加春集并买早豆。样本包可后续年份继续补齐。`,
  summer: "若卡住，按 Q 或看村庄路牌；先找林岚、何涛或柳青完成一个任务，再去村情记录板推进一项公共目标。",
  autumn: "若卡住，按 Q 跟随电商助农角、加工桶和合作社窗口；先完成社区订单和电商试单，再回农场修复加工桶。",
  winter: "若卡住，按 Q 查看年终缺口；优先补金币、合作社合同、村情目标和至少一座设施强化二，冬季可继续种小白菜和菠菜。",
  shrine: "若卡住，去土地庙查看缺口；Q 面板、小地图推荐点和土地庙会指向当前路线推荐设施或下一个主线目标。",
};
const PLAYTHROUGH_REQUIREMENTS = {
  spring: [
    { label: "第一次出货结算", isMet: () => state.story.firstShipmentSettled },
    { label: "村庄反馈已查看", isMet: () => state.story.villageFeedbackSeen },
    { label: "杂货铺已修复", isMet: () => state.story.chapterOneCompleted },
    { label: "山里资源点已采集", isMet: () => state.story.mountainResourceVisited },
    { label: "夏季启动资金 200g", isMet: () => state.inventory.gold >= 200 },
  ],
  summer: [
    { label: "收获达到 8 个", isMet: () => state.inventory.harvestedCrops >= 8 },
    { label: "村民任务完成 1 个", isMet: () => completedQuestCount() >= 1 },
    { label: "助农集市筹备完成", isMet: () => state.story.marketPrepCompleted },
    { label: "社区订单跑通", isMet: () => state.story.communityOrdersCompleted },
  ],
  autumn: [
    { label: "电商试单发货", isMet: () => state.story.ecommerceTrialShipped },
    { label: "加工设施修复", isMet: () => state.story.processingRepaired },
    { label: "加工品出货结算", isMet: () => state.story.firstProcessedShipmentSettled },
    { label: "加入合作社", isMet: () => state.story.cooperativeJoined },
  ],
  winter: [
    { label: "收获达到 30 个", isMet: () => state.inventory.harvestedCrops >= 30 },
    { label: "村民任务完成 3 个", isMet: () => completedQuestCount() >= 3 },
    { label: "合作社合同完成 2 张", isMet: () => completedCooperativeContractCount() >= 2 },
    { label: "设施强化二完成 1 座", isMet: () => villageFacilityCountAtLevel(3) >= 1 },
    { label: "金币达到 300g", isMet: () => state.inventory.gold >= 300 },
    { label: "大寒年终会已查看", isMet: () => state.story.viewedYearEnd },
  ],
  shrine: [
    { label: "年终会已完成", isMet: () => state.story.viewedYearEnd },
    { label: "第二年方向已选择", isMet: () => Boolean(state.story.secondYearPlan) },
    { label: "全部村情目标完成", isMet: () => completedVillageIssueGoalCount() >= VILLAGE_ISSUE_GOAL_IDS.length },
    { label: "路线推荐设施强化二", isMet: () => routeFacilityUpgradeComplete() },
    { label: "第二年路线起步闭环完成", isMet: () => currentRouteMilestoneComplete() },
    { label: "土地庙最终追问开放", isMet: () => landShrineFinalReady() },
  ],
};
const QUEST_ORDER = [
  "harvestForMira",
  "deliverRadishForMira",
  "pondSampleForMira",
  "clearWaterRecordForMira",
  "buySeedsForTheo",
  "youthWorkshopForTheo",
  "marketShelfForTheo",
  "workshopApprenticeForTheo",
  "shipCropsForLina",
  "clinicRouteForLina",
  "coldChainForLina",
  "cooperativeLedgerForLina",
  "coldChainLedgerForLina",
  "childCareForNannan",
  "schoolGardenForNannan",
  "classroomGardenForNannan",
  "elderMealForChen",
  "winterPantryForChen",
  "mealRouteForChen",
];
const COMMUNITY_ORDERS = {
  basketPoint: {
    id: "basketPoint",
    objectType: "basketPoint",
    title: "安心菜篮",
    progressKey: "basketOrderDelivered",
    rewardKey: "basketOrderRewardClaimed",
    target: 3,
    rewardGold: 45,
    rewardSeeds: { bokChoy: 2 },
    description: "给老人和卫生站准备第一批稳定菜篮，提交任意作物。",
  },
  tastingTable: {
    id: "tastingTable",
    objectType: "tastingTable",
    title: "茶铺试吃",
    progressKey: "tastingOrderDelivered",
    rewardKey: "tastingOrderRewardClaimed",
    target: 2,
    rewardGold: 35,
    rewardSeeds: { bean: 1 },
    description: "给茶铺准备少量试吃样本，提交任意作物。",
  },
};
const ECOMMERCE_TRIAL_ORDER = {
  target: 4,
  rewardGold: 140,
  rewardSeeds: { corn: 2 },
};
const COOPERATIVE_TRIAL = {
  cropTarget: 5,
  goodTarget: 1,
  rewardGold: 220,
  rewardSeeds: { sweetPotato: 3 },
};
const COOPERATIVE_CONTRACT = {
  cropBaseTarget: 6,
  goodBaseTarget: 2,
  cropRewardBase: 120,
  goodRewardBase: 210,
};
const COOPERATIVE_EXPANSION = {
  dividendEveryContracts: 3,
  dividendGold: 260,
  dividendSeeds: { corn: 2, sweetPotato: 2 },
  dividendBuild: { processor: 1 },
};
const TOURISM_ORDER = {
  cropTarget: 3,
  goodTarget: 1,
  scoreTarget: 55,
  rewardGold: 180,
  rewardSeeds: { tomato: 2 },
  rewardBuild: { flowerBox: 2, gardenLamp: 1 },
};
const BRAND_PACKAGING = {
  cropInputCount: 2,
  goodInputCount: 1,
  rewardGold: 180,
  rewardSeeds: { spinach: 3 },
  rewardBuild: { flowerBox: 1 },
};
const IRRIGATION_PROJECT = {
  costGold: 160,
  capacityBonus: IRRIGATION_WATER_BONUS,
  zone: { x: 10, y: 24, w: 18, h: 11 },
  rewardSeeds: { bokChoy: 3, spinach: 2 },
};
const FARM_BUILD_REGIONS = {
  starterField: {
    id: "starterField",
    name: "右上开局区",
    bounds: { x: 12, y: 8, w: 22, h: 16 },
    use: "开局耕种、基础装饰和临时设施。",
    unlockText: "开局可用。",
    isUnlocked: () => true,
  },
  southField: {
    id: "southField",
    name: "南侧菜地",
    bounds: { x: 10, y: 24, w: 18, h: 12 },
    use: "扩大耕地、连续播种和水渠覆盖。",
    unlockText: "完成助农集市准备或第一段水渠工程后推荐使用。",
    isUnlocked: () => state.story.marketPrepCompleted || state.story.irrigationFirstProjectCompleted || state.upgrades?.southField,
  },
  westProcessing: {
    id: "westProcessing",
    name: "西侧加工区",
    bounds: { x: 2, y: 13, w: 12, h: 14 },
    use: "加工桶、晾晒架和出货前整理。",
    unlockText: "修复加工设施后推荐使用。",
    isUnlocked: () => state.story.processingRepaired || state.story.firstProcessedGoodCollected || state.upgrades?.westProcessing,
  },
  irrigationZone: {
    id: "irrigationZone",
    name: "水渠覆盖区",
    bounds: IRRIGATION_PROJECT.zone,
    use: "水渠工程完成后，睡觉会自动浇水的重点农田。",
    unlockText: "完成第一段水渠工程后开放。",
    isUnlocked: () => state.story.irrigationFirstProjectCompleted,
  },
};
const RECOVERY_NODE_TARGET = 8;
const SECOND_YEAR_PLANS = {
  cooperative: {
    id: "cooperative",
    name: "合作社扩张",
    summary: "优先做更大的批量合同、稳定供应和社员分红。",
    rewardGold: 180,
    rewardSeeds: { corn: 3, sweetPotato: 3 },
    rewardBuild: { processor: 1 },
    hint: "第二年重点：完成更多合作社合同，扩大加工设施。",
  },
  tourism: {
    id: "tourism",
    name: "乡村旅游",
    summary: "优先修复游客服务、装饰农场和提高评价吸引力。",
    rewardGold: 160,
    rewardSeeds: { tomato: 3, spinach: 2 },
    rewardBuild: { flowerBox: 3, gardenLamp: 2, bench: 1 },
    hint: "第二年重点：布置农场、修复游客服务，提升农场评价。",
  },
  irrigation: {
    id: "irrigation",
    name: "水利与扩建",
    summary: "优先补水源、扩大耕地和降低日常体力压力。",
    rewardGold: 220,
    rewardSeeds: { bokChoy: 4, spinach: 4 },
    rewardBuild: { dryer: 1 },
    hint: "第二年重点：扩建耕地和水源，准备大面积种植。",
  },
  brand: {
    id: "brand",
    name: "品牌农产品",
    summary: "优先做加工品、包装、复购和更高单价的农产品路线。",
    rewardGold: 200,
    rewardSeeds: { tomato: 3, corn: 2 },
    rewardBuild: { processor: 1, dryer: 1 },
    hint: "第二年重点：加工品库存、电商复购和高价值出货。",
  },
};
const SECOND_YEAR_ROUTE_STEPS = {
  cooperative: [
    {
      id: "join",
      title: "加入合作社扩张",
      detail: "先修复合作社窗口并完成入社样品。",
      reward: "合作社路线合同开始累计。",
      isDone: () => state.story.cooperativeJoined,
    },
    {
      id: "contracts",
      title: "完成 3 张扩张合同",
      detail: () => `${cooperativeExpansionProgress()}/${COOPERATIVE_EXPANSION.dividendEveryContracts}`,
      reward: "触发社员分红资格。",
      isDone: () => cooperativeExpansionProgress() >= COOPERATIVE_EXPANSION.dividendEveryContracts,
    },
    {
      id: "streak",
      title: "连续供货 3 张",
      detail: () => `${state.story.cooperativeExpansionBestStreak ?? 0}/3`,
      reward: "稳定供货记录写入土地庙进度。",
      isDone: () => (state.story.cooperativeExpansionBestStreak ?? 0) >= 3,
    },
    {
      id: "dividend",
      title: "领取一次社员分红",
      detail: () => `${state.story.cooperativeExpansionDividendClaimedTiers?.length ?? 0}/1`,
      reward: "金币、种子和加工设施奖励。",
      isDone: () => (state.story.cooperativeExpansionDividendClaimedTiers?.length ?? 0) > 0,
    },
  ],
  tourism: [
    {
      id: "repair",
      title: "修复游客服务亭",
      detail: "村庄广场面对游客服务旧亭按 E。",
      reward: "开启游客礼篮和试吃提交。",
      isDone: () => state.story.tourismRepaired,
    },
    {
      id: "decor",
      title: "布置 3 件装饰",
      detail: () => `${placedDecorationCount()}/3`,
      reward: "提高游客路线评价。",
      isDone: () => placedDecorationCount() >= 3,
    },
    {
      id: "order",
      title: "完成第一批游客订单",
      detail: () => `评价 ${farmScoreTotal()}/${TOURISM_ORDER.scoreTarget}`,
      reward: "游客反馈、金币和装饰奖励。",
      isDone: () => state.story.tourismFirstOrderCompleted,
    },
  ],
  brand: [
    {
      id: "repair",
      title: "修复品牌包装台",
      detail: "村庄集市面对品牌包装旧台按 E。",
      reward: "开启品牌礼盒制作。",
      isDone: () => state.story.brandRepaired,
    },
    {
      id: "pack",
      title: "制作 1 个品牌礼盒",
      detail: () => `库存 ${state.inventory.goods[BRAND_PACK_GOOD_ID] ?? 0}`,
      reward: "品牌礼盒进入出货链。",
      isDone: () => state.story.brandFirstPackCreated,
    },
    {
      id: "shipment",
      title: "结算第一批品牌礼盒",
      detail: "投入出货箱并睡觉结算。",
      reward: "高价值出货、种子和装饰奖励。",
      isDone: () => state.story.brandFirstShipmentSettled,
    },
  ],
  irrigation: [
    {
      id: "repair",
      title: "修复水利水泵",
      detail: "农场旧水泵面对按 E。",
      reward: "开启第一段水渠工程。",
      isDone: () => state.story.irrigationRepaired,
    },
    {
      id: "project",
      title: "完成第一段水渠工程",
      detail: () => `${state.story.irrigationFirstProjectCompleted ? "已完成" : `${state.inventory.gold}/${IRRIGATION_PROJECT.costGold}g`}`,
      reward: "水壶容量提高，覆盖区自动浇水。",
      isDone: () => state.story.irrigationFirstProjectCompleted,
    },
    {
      id: "planting",
      title: "水渠覆盖区种下 4 株",
      detail: () => `${irrigationZoneCropCount()}/4`,
      reward: "证明扩建区能稳定生产。",
      isDone: () => irrigationZoneCropCount() >= 4,
    },
  ],
};
const SECOND_YEAR_ROUTE_FACILITY_GOALS = {
  cooperative: "coldChain",
  tourism: "elderCare",
  irrigation: "waterCleanup",
  brand: "youthWorkshop",
};
const ACHIEVEMENTS = [
  {
    id: "firstHarvest",
    title: "第一份收获",
    description: "收获任意 1 个作物。",
    isUnlocked: () => state.inventory.harvestedCrops > 0 || CROP_IDS.some((cropId) => state.collection.harvested[cropId]),
  },
  {
    id: "firstShipment",
    title: "第一次出货",
    description: "把任意作物投入出货箱。",
    isUnlocked: () => CROP_IDS.some((cropId) => state.collection.shipped[cropId]),
  },
  {
    id: "mailReader",
    title: "查看来信",
    description: "阅读邮箱里的任意一封信。",
    isUnlocked: () => state.mailbox.readIds.length > 0,
  },
  {
    id: "helpfulNeighbor",
    title: "邻里帮手",
    description: "完成任意 1 个 NPC 任务。",
    isUnlocked: () => Object.values(state.quests).some((quest) => quest.status === "completed"),
  },
  {
    id: "firstUpgrade",
    title: "开始扩建",
    description: "购买任意 1 个农场扩建。",
    isUnlocked: () => Object.values(state.upgrades).some(Boolean),
  },
  {
    id: "completeCropJournal",
    title: "作物图鉴完成",
    description: "收获并出货所有作物。",
    isUnlocked: () => {
      const progress = collectionProgress();
      return progress.completed >= progress.total;
    },
  },
  {
    id: "firstYearComplete",
    title: "第一年完成",
    description: "参加大寒年终会，完成一周目年度总结。",
    isUnlocked: () => state.story.viewedYearEnd,
  },
];
const VILLAGE_ALBUM_ENTRIES = [
  {
    id: "firstShipment",
    title: "第一筐菜出村",
    description: "第一次出货结算后，村庄广场开始贴出反馈。",
    isUnlocked: () => state.story.firstShipmentSettled,
  },
  {
    id: "chapterOne",
    title: "杂货铺重新开门",
    description: "修复村庄杂货铺，第一章从个人农田转向村庄协作。",
    isUnlocked: () => state.story.chapterOneCompleted,
  },
  {
    id: "marketPrep",
    title: "助农集市搭棚",
    description: "临时摊位、菜篮点和试吃桌让村庄主街重新有人停留。",
    isUnlocked: () => state.story.marketPrepCompleted,
  },
  {
    id: "stableMarket",
    title: "稳定集市运行",
    description: "社区订单跑通后，电商助农角出现在村庄主街。",
    isUnlocked: () => state.story.communityOrdersCompleted,
  },
  {
    id: "processing",
    title: "加工桶重新转动",
    description: "农场开始把原料变成加工品，收入不再只看当天菜价。",
    isUnlocked: () => state.story.processingRepaired || state.story.firstProcessedGoodCollected,
  },
  {
    id: "cooperative",
    title: "合作社试运行",
    description: "合作社窗口恢复，散户出货开始合到同一本账上。",
    isUnlocked: () => state.story.cooperativeJoined,
  },
  {
    id: "villageIssues",
    title: "公共生活被照看",
    description: "托管、青年、饭点、巡诊、冷链和水质等村情目标形成可见变化。",
    isUnlocked: () => completedVillageIssueGoalCount() >= VILLAGE_ISSUE_GOAL_IDS.length,
  },
  {
    id: "childCare",
    title: "托管教室亮灯",
    description: "放学后的孩子有了写作业、吃热饭和等家人的地方。",
    isUnlocked: () => villageIssueGoalComplete("childCare"),
  },
  {
    id: "youthWorkshop",
    title: "青年工坊开课",
    description: "留下来的年轻人开始学习包装、直播、维修和账本。",
    isUnlocked: () => villageIssueGoalComplete("youthWorkshop"),
  },
  {
    id: "elderCare",
    title: "互助饭点开火",
    description: "独居老人每天有没有来吃饭，终于有人能及时知道。",
    isUnlocked: () => villageIssueGoalComplete("elderCare"),
  },
  {
    id: "clinicRoute",
    title: "巡诊路线贴出",
    description: "取药、复诊和雨天出行开始有固定安排。",
    isUnlocked: () => villageIssueGoalComplete("clinicRoute"),
  },
  {
    id: "coldChain",
    title: "冷链代收点通电",
    description: "农产品不必当天低价甩卖，村里有了降低损耗的余地。",
    isUnlocked: () => villageIssueGoalComplete("coldChain"),
  },
  {
    id: "waterCleanup",
    title: "村塘转清",
    description: "清淤后水产重新出现，水边不再只是绕开的地方。",
    isUnlocked: () => villageIssueGoalComplete("waterCleanup"),
  },
  {
    id: "yearEnd",
    title: "大寒年终会",
    description: "第一年结束，村庄把这一轮改变写进年终总结。",
    isUnlocked: () => state.story.viewedYearEnd,
  },
  {
    id: "landShrine",
    title: "土地庙旧事",
    description: "完成一周目核心内容后，土地庙说出代代往复的旧事。",
    isUnlocked: () => state.story.landShrineFinalRevealed,
  },
];
const NPC_STAGE_DIALOGUES = {
  mira: {
    spring: "林岚看着第一块地说：春天先别贪多，能稳定种、浇、收、卖，就是最重要的证据。",
    summer: "林岚说夏天要把地里的收成接到村里的桌子上，集市稳定了，土壤记录才有下一页。",
    autumn: "林岚把加工样品夹进笔记本：秋天要证明这片地不只能卖原料，也能留下价值。",
    winter: "林岚提醒你整理账本。大寒前后，村里会问这一年到底改变了谁的日子。",
    yearEnd: "林岚说第二年不要只扩大田块，也要守住第一年修起来的公共生活。",
    cooperative: "林岚说合作社路线要把土壤、订单和公共服务一起记账，不能只看谁交得最多。",
    tourism: "林岚提醒游客路线不能踩坏田埂。让别人看见村庄，也要让村庄还能安静生活。",
    brand: "林岚说品牌故事不能只写包装文案，也要写清楚这片地怎样养活了人。",
    irrigation: "林岚把水渠画进土壤笔记。水通了，才知道哪块地能长期稳定。",
  },
  theo: {
    spring: "何涛说春天的种子账很简单：先买得起、种得下、卖得出去。",
    summer: "何涛在货架旁贴了补货表。夏天的目标不是多买，而是让补给不断档。",
    autumn: "何涛开始记录加工和合作社价格。他说年轻人留下来，得看见账本里有未来。",
    winter: "何涛说冬天也不能让货架空着，小白菜和菠菜能帮现金流撑到年终。",
    yearEnd: "何涛把旧车票压进账本里。他说第二年要让回来的人不只是帮忙，而是有份额。",
    cooperative: "何涛说合作社路线最重要的是分账透明。年轻人留下来，要看见公平和成长。",
    tourism: "何涛担心旅游热闹过后只留下临时活。他想把导览、维修和接待都做成能学的岗位。",
    brand: "何涛对品牌路线很上心。他说如果包装能讲清楚来处，种子铺也能变成培训点。",
    irrigation: "何涛说水利路线看起来慢，但能让大家少赌天气，账本上的风险会小很多。",
  },
  lina: {
    spring: "柳青说第一筐菜不大，但能让村口那条路重新和农场连起来。",
    summer: "柳青提醒你：社区订单看起来小，却能让老人、茶铺和卫生站每天都知道菜会到。",
    autumn: "柳青把加工品出货单单独夹出来。她说远路上的货更怕散，合作社能让它们有名字。",
    winter: "柳青说年终前要清出货箱，别让该结算的东西留到第二年。",
    yearEnd: "柳青说路不只是把货送出去，也该把照看和回访送回来。",
    cooperative: "柳青说合作社路线会让运输更稳。货合在一起，回访也能合在一起做。",
    tourism: "柳青提醒旅游路线要有垃圾、厕所和急救记录。路上人多了，责任也多了。",
    brand: "柳青说品牌礼盒最怕好看但不耐运。包装、冷链和售后要一起算。",
    irrigation: "柳青说水渠修好后，雨天和旱天的出货波动都会小一点，路上也少些临时补救。",
  },
  nannan: {
    spring: "楠楠春天常在广场数路过的人。她说如果农场忙起来，村里晚上也许会亮一点。",
    summer: "楠楠说暑热的时候等人最难熬。托管教室要是开门，她想在那里写完作业再回家。",
    autumn: "楠楠把落叶夹进作业本。她说秋天的作文题还是家乡，但她现在能写的东西多了。",
    winter: "楠楠冬天会早早站到有灯的地方。她说等人的时候，热饭比糖更重要。",
    yearEnd: "楠楠说如果第二年还有农事课，她想学会认每个节气的菜。",
    cooperative: "楠楠听大人说合作社能分红。她问分红能不能给托管教室添一排书架。",
    tourism: "楠楠想给游客讲自己的作文，但她也希望广场晚上不要太吵。",
    brand: "楠楠说如果作物有品牌，她想在盒子里放一张孩子们画的节气卡。",
    irrigation: "楠楠说水渠像一条细路。她想知道水是不是也会记得回家的方向。",
  },
  uncleChen: {
    spring: "陈伯春天坐在广场边，看谁家地又翻起来。他说地动了，人心也会动一点。",
    summer: "陈伯说夏天最怕老人忘了吃饭，也怕年轻人只在节日回来一趟。",
    autumn: "陈伯看着合作社窗口说，菜价稳一点，村里照看人的余力就多一点。",
    winter: "陈伯冬天最关心饭点和巡诊路线。他说冷天里，小事会变成大事。",
    yearEnd: "陈伯说第一年能走到年终会，说明村子还没有把人全都等丢。",
    cooperative: "陈伯说合作社要记得慢一点的人。分红和订单都不能只顾跑得快的户。",
    tourism: "陈伯说游客来了是好事，但山路、厕所和休息点要先想到老人和孩子。",
    brand: "陈伯说品牌不能只往外卖，也要让村里人吃得起、讲得出这东西从哪来。",
    irrigation: "陈伯说水渠修好，老人浇地就少跑几趟。省下的力气也是日子。",
  },
};
const NPC_PLAYTHROUGH_STAGE_LINES = {
  spring: [
    "村里人说，春天的目标不是把地铺满，而是证明第一块地能从播种走到出货。",
    "公告栏旁有人提醒：第一筐菜卖出去后，先去村里看看大家怎么反馈。",
    "春季样本箱旁贴着纸条：样本记录可以以后补齐，春天先把生产节奏跑起来。",
    "山路口新钉了一块木牌：第 11 天后旧采石点和林缘采集点会恢复每日采集。",
  ],
  summer: [
    "夏天的集市棚不怕小，怕的是今天有、明天断。稳定供应比一次热闹更重要。",
    "村庄路牌新添了广场、木匠公告牌和社区订单点，方便回访。",
    "茶铺老板开始问每天能不能稳定送菜。夏天的目标是把个人农田变成村里的日常供应。",
    "何涛在种子摊边写下补货表：小麦、番茄、豆子和玉米要接力，不要让田空着。",
  ],
  autumn: [
    "秋天大家开始问加工、包装和合作社。卖得远之前，先要分得清、包得住。",
    "公告栏把电商助农角、加工桶和合作社窗口写在同一行，提醒这是一条链。",
    "柳青说秋天最怕货散、账散、人也散。合作社窗口要把这些合到一本账上。",
    "晒场旁多了加工提示：原料卖不远，加工品才能撑住秋后的价格。",
  ],
  winter: [
    "冬天的目标会更像账本：谁被照看过，哪条路修好了，哪些订单还能持续。",
    "年终会前，路牌会提醒补齐村情目标和合作社合同，再回家睡到大寒。",
    "陈伯说冬天不是停下来，而是看这一年有没有人被真正照看过。",
    "楠楠在托管教室门口写下节气表，提醒你大寒前把村情和年终账补齐。",
  ],
};
const VILLAGE_ISSUE_GOALS = {
  childCare: {
    id: "childCare",
    title: "课后托管教室",
    issue: "留守儿童",
    description: "整理村委会空屋，给放学后没人接的孩子一个能写作业、吃热饭、等家里人的地方。",
    costGold: 30,
    cropCost: 2,
    goodCost: 0,
    requirement: "完成第一章后开放。",
    isUnlocked: () => state.story.chapterOneCompleted,
    result: "课后托管教室开始试运行。孩子们放学后不用在路口等到天黑。",
  },
  youthWorkshop: {
    id: "youthWorkshop",
    title: "青年返乡工坊",
    issue: "年轻人留不住",
    description: "把废弃铺面整理成小工坊，提供包装、直播、维修和账本培训，让留下来不只是干苦活。",
    costGold: 70,
    cropCost: 0,
    goodCost: 1,
    requirement: "完成助农集市准备后开放。",
    isUnlocked: () => state.story.marketPrepCompleted,
    result: "青年返乡工坊开出第一期培训表。有人开始把“回来看看”改成“试着留下”。",
  },
  elderCare: {
    id: "elderCare",
    title: "老人互助饭点",
    issue: "老人照护",
    description: "用集市剩余食材和邻里值班表，给独居老人准备稳定热饭和每日照看。",
    costGold: 55,
    cropCost: 2,
    goodCost: 0,
    requirement: "完成 2 个社区订单后开放。",
    isUnlocked: () => state.story.communityOrdersCompleted,
    result: "老人互助饭点开始登记。每天至少有人知道谁没来吃饭、谁需要帮忙。",
  },
  clinicRoute: {
    id: "clinicRoute",
    title: "乡医巡诊路线",
    issue: "医疗与交通",
    description: "把村里常见病、慢病取药和雨天出行记录整理成巡诊路线，让卫生服务能到人家门口。",
    costGold: 85,
    cropCost: 2,
    goodCost: 1,
    requirement: "完成电商试单后开放。",
    isUnlocked: () => state.story.ecommerceTrialShipped,
    result: "乡医巡诊路线排出来了。去卫生站不再只靠家里有没有人能送。",
  },
  coldChain: {
    id: "coldChain",
    title: "冷链代收点",
    issue: "农业收入不稳",
    description: "建立小型冷藏和代收点，降低损耗，让农产品不必在当天低价甩卖。",
    costGold: 125,
    cropCost: 0,
    goodCost: 2,
    requirement: "修复加工设施并加入合作社后开放。",
    isUnlocked: () => state.story.processingRepaired && state.story.cooperativeJoined,
    result: "冷链代收点开始运行。村里第一次有了能跟时间讨价还价的地方。",
  },
  waterCleanup: {
    id: "waterCleanup",
    title: "村塘清淤",
    issue: "水污染",
    description: "清理村塘杂物和旧排水口，让孩子敢靠近水边，也让水产重新成为饭桌和集市的一部分。",
    costGold: 60,
    cropCost: 0,
    goodCost: 0,
    resourceCost: { wood: 4, stone: 6 },
    requirement: "完成春季样本包后开放。",
    isUnlocked: () => state.story.springSampleBundleCompleted,
    result: "村塘第一段清淤完成。水色从污浊转清，河虾和鲤鱼又能钓到了。",
  },
};
const VILLAGE_ISSUE_GOAL_IDS = Object.keys(VILLAGE_ISSUE_GOALS);
const COMMUNITY_FACILITY_MAX_LEVEL = 3;
const COMMUNITY_FACILITY_LEVELS = {
  0: { label: "坏损/未建", visualState: VISUAL_STATES.ruin, summary: "还只是旧址或废墟，需要先在村情记录板推进修复。" },
  1: { label: "修复可用", visualState: VISUAL_STATES.repaired, summary: "基础功能已经恢复，可以服务村民日常。" },
  2: { label: "强化一", visualState: VISUAL_STATES.upgrade1, summary: "设施开始稳定运行，能承接更多人和更高频次的使用。" },
  3: { label: "强化二", visualState: VISUAL_STATES.upgrade2, summary: "设施进入成熟阶段，成为第二年路线和土地庙回顾的重要证据。" },
};
const COMMUNITY_FACILITY_UPGRADE_COSTS = {
  2: { gold: 90, cropCost: 2, goodCost: 0, resourceCost: { wood: 4, stone: 4 } },
  3: { gold: 160, cropCost: 0, goodCost: 1, resourceCost: { wood: 6, stone: 6, copperOre: 2 } },
};
const COMMUNITY_FACILITY_DEFS = {
  childCare: {
    goalId: "childCare",
    name: "课后托管教室",
    shortLabel: "托",
    color: "#75b9d8",
    x: 17,
    y: 12,
    result: "旧教室重新亮灯。放学后的孩子可以在这里写作业、吃热饭、等家里人。",
  },
  youthWorkshop: {
    goalId: "youthWorkshop",
    name: "青年返乡工坊",
    shortLabel: "青",
    color: "#70b77e",
    x: 28,
    y: 12,
    result: "工坊开始试课。包装、直播、维修和账本培训让年轻人看到不止一种留下来的方式。",
  },
  elderCare: {
    goalId: "elderCare",
    name: "老人互助饭点",
    shortLabel: "饭",
    color: "#e7b34d",
    x: 18,
    y: 18,
    result: "饭点每天登记来吃饭的人。谁没来、谁需要帮忙，终于有人能及时知道。",
  },
  clinicRoute: {
    goalId: "clinicRoute",
    name: "乡医巡诊路线",
    shortLabel: "医",
    color: "#d98777",
    x: 27,
    y: 18,
    result: "巡诊路线贴在广场上。慢病取药、雨天出行和老人复诊都有了固定安排。",
  },
  coldChain: {
    goalId: "coldChain",
    name: "冷链代收点",
    shortLabel: "冷",
    color: "#8cb7d7",
    x: 36,
    y: 16,
    result: "冷链代收点开始运行。菜不必当天低价甩卖，村里第一次能跟损耗抢时间。",
  },
  waterCleanup: {
    goalId: "waterCleanup",
    name: "村塘清淤点",
    shortLabel: "水",
    color: "#3d8190",
    x: 31,
    y: 24,
    result: "村塘边的杂物被清走。水色转清，孩子和老人都愿意在水边多停一会儿。",
  },
};
const COMMUNITY_FACILITY_IDS = Object.keys(COMMUNITY_FACILITY_DEFS);
const VILLAGE_ISSUE_CONTACTS = {
  childCare: "楠楠 / 林岚",
  youthWorkshop: "何涛",
  elderCare: "陈伯",
  clinicRoute: "陈伯 / 柳青",
  coldChain: "柳青",
  waterCleanup: "林岚",
};
const COMMUNITY_FACILITY_STAGE_FEEDBACK = {
  childCare: {
    1: "托管教室开始亮灯，放学后的等待有了固定屋檐。",
    2: "托管教室排出值班表，作业、热饭和接送开始有稳定安排。",
    3: "托管教室变成孩子和老人都认得的公共空间，第二年也能承接更多农事课。",
  },
  youthWorkshop: {
    1: "青年工坊开始试课，包装、维修和账本培训有了第一张表。",
    2: "青年工坊能稳定开课，留下来的人开始看见技术和分工。",
    3: "青年工坊成了第二年路线的人才入口，年轻人不再只是在节日回来帮忙。",
  },
  elderCare: {
    1: "互助饭点开始登记，每天有人知道谁没来吃饭。",
    2: "互助饭点能稳定备餐，老人不用临时凑一口热饭。",
    3: "互助饭点形成邻里照看网络，冬天和雨天也有人能及时搭把手。",
  },
  clinicRoute: {
    1: "巡诊路线贴在广场上，取药和复诊有了固定安排。",
    2: "巡诊路线开始按户更新，慢病、雨天和出行困难都被记进表里。",
    3: "巡诊路线成为村里公共服务的一部分，第二年扩展不再只看生产。",
  },
  coldChain: {
    1: "冷链代收点通电，农产品不必当天低价甩卖。",
    2: "冷链代收点开始分批入库，订单损耗和临时压价都少了一些。",
    3: "冷链代收点能支撑合作社和品牌路线，让村里有了议价余地。",
  },
  waterCleanup: {
    1: "村塘第一段清淤完成，河虾和鲤鱼重新出现。",
    2: "村塘水色更稳，沟渠和池塘重新连成活水线。",
    3: "村塘清淤成为土地庙回顾里的证据：水回来，故事也多了一条能流动的路。",
  },
};
const NPC_FACILITY_FEEDBACKS = {
  mira: [
    { goalId: "waterCleanup", level: 3, line: "林岚把村塘水样、土壤样本和土地庙边的老记录放在一起。她说水清到这一步，说明大家终于愿意先把浑的地方看清楚。" },
    { goalId: "waterCleanup", level: 2, line: "林岚说村塘水色稳定后，土壤记录也有了另一列：水会把看不见的改变带回来。" },
    { goalId: "childCare", level: 2, line: "林岚说托管教室排出值班表后，土壤记录不再只是产量表，也写进了孩子放学后的时间。" },
  ],
  theo: [
    { goalId: "youthWorkshop", level: 3, line: "何涛说青年工坊强化到这一步，留下来不再只是情怀，而是有技术、有分工、有账可算。" },
    { goalId: "youthWorkshop", level: 2, line: "何涛把工坊课表贴在种子铺旁。他说年轻人要留下来，得看见下一项能学会的本事。" },
    { goalId: "coldChain", level: 2, line: "何涛说冷链稳定后，种子铺的补货也敢排长一点，不用每天都被损耗追着跑。" },
  ],
  lina: [
    { goalId: "coldChain", level: 3, line: "柳青说冷链代收点成熟后，合作社和品牌路线终于有了底气：货能等价钱，人也能等机会。" },
    { goalId: "clinicRoute", level: 2, line: "柳青每次排车都会看一眼巡诊路线。她说物流不只送货，也是在确认谁没有被落下。" },
    { goalId: "coldChain", level: 2, line: "柳青把冷链分批表贴到窗口。她说损耗少一点，出货箱里的数字才更像回到人身边。" },
  ],
  nannan: [
    { goalId: "childCare", level: 3, line: "楠楠说托管教室现在有农事课，也有等家里人的灯。她第一次觉得等待不是一个人的事。" },
    { goalId: "childCare", level: 2, line: "楠楠把《家乡》作文贴在托管教室门口。她说教室每天都有人开门，心里就不那么空。" },
  ],
  uncleChen: [
    { goalId: "elderCare", level: 3, line: "陈伯说互助饭点能撑过冬天，说明村里不是只会修房子，也开始记得每天谁该吃上一口热饭。" },
    { goalId: "clinicRoute", level: 2, line: "陈伯说巡诊路线强化后，老人不用等到病重才被看见，取药和复诊都有了准点。" },
    { goalId: "elderCare", level: 2, line: "陈伯每天看饭点登记。他说谁没来吃饭，比谁多卖一筐菜更该早一点知道。" },
  ],
};

function createDefaultVillageIssueGoals() {
  return Object.fromEntries(VILLAGE_ISSUE_GOAL_IDS.map((goalId) => [goalId, false]));
}

function createDefaultVillageFacilityLevels() {
  return Object.fromEntries(VILLAGE_ISSUE_GOAL_IDS.map((goalId) => [goalId, 0]));
}

function normalizeVillageIssueGoals(value = {}) {
  value = value && typeof value === "object" ? value : {};
  return Object.fromEntries(VILLAGE_ISSUE_GOAL_IDS.map((goalId) => [goalId, value[goalId] === true]));
}

function normalizeVillageFacilityLevels(value = {}, issueGoals = {}) {
  value = value && typeof value === "object" ? value : {};
  return Object.fromEntries(
    VILLAGE_ISSUE_GOAL_IDS.map((goalId) => {
      const raw = Math.floor(Number(value[goalId] ?? 0));
      const migrated = issueGoals[goalId] === true && raw <= 0 ? 1 : raw;
      return [goalId, Math.max(0, Math.min(COMMUNITY_FACILITY_MAX_LEVEL, migrated))];
    }),
  );
}

function communityFacilityDef(goalId = "childCare") {
  return COMMUNITY_FACILITY_DEFS[goalId] ?? COMMUNITY_FACILITY_DEFS.childCare;
}

function directionSign(storyId, x, y, name, lines) {
  return { type: "directionSign", x, y, name, storyId, lines };
}

const NPC_VILLAGE_LAYOUT = {
  mira: { mapId: "village", x: 20, y: 14 },
  theo: { mapId: "village", x: 12, y: 15 },
  lina: { mapId: "village", x: 26, y: 15 },
  nannan: { mapId: "village", x: 17, y: 16 },
  uncleChen: { mapId: "village", x: 23, y: 15 },
};

function npcDefaultLayout(npcId) {
  return NPC_VILLAGE_LAYOUT[npcId] ?? { mapId: DEFAULT_NPC_MAP_ID, x: 20, y: 14 };
}

function createDefaultNpcs() {
  return [
    {
      id: "mira",
      name: "林岚",
      ...npcDefaultLayout("mira"),
      color: "#7a4d8f",
      hairColor: "#5a2f55",
      questIds: ["harvestForMira", "deliverRadishForMira", "pondSampleForMira", "clearWaterRecordForMira"],
      dialog: {
        hello: "你好，我是林岚。农场看起来慢慢有样子了。",
        idle: "这些样本很有帮助。继续扩建你的农场吧。",
        daily: [
          "我每天都会看一眼土壤颜色。这里的地力恢复得比我预想更快。",
          "成熟作物不要放太久，及时收获能让下一轮播种更顺。",
          "如果想扩大产量，先把水井和耕地扩建排上日程。",
        ],
        sunny: ["晴天适合锄地和规划田块，水壶的水量要多留意。"],
        rainy: ["雨天会帮作物自动浇水，可以把体力留给锄地或跑商店。"],
        lowEnergy: ["你看起来有点累。体力低的时候，睡一觉比硬撑更划算。"],
        readyCrops: ["我看到田里有成熟作物了，镰刀应该马上能派上用场。"],
      },
    },
    {
      id: "theo",
      name: "何涛",
      ...npcDefaultLayout("theo"),
      color: "#4f7ca8",
      hairColor: "#2b4058",
      questIds: ["buySeedsForTheo", "youthWorkshopForTheo", "marketShelfForTheo", "workshopApprenticeForTheo"],
      dialog: {
        hello: "我是何涛，负责记录种子铺的补给。",
        idle: "商店会慢慢补齐更多种子，记得每天看看。",
        daily: [
          "种子价格目前是固定的，先用低价作物稳定现金流。",
          "小麦第 3 天解锁，豆子第 5 天解锁，越晚的种子成长更慢但利润更高。",
          "买种子前看一眼背包，别把金币全压在一种作物上。",
        ],
        sunny: ["晴天客流会多一点，种子铺的补给记录也更完整。"],
        rainy: ["雨天买种子很划算，回去播下后就不用再浇第一遍水。"],
        lowEnergy: ["账本上没有体力这一栏，但我能看出来你该休息了。"],
        readyCrops: ["有成熟作物时，卖一部分换金币，再补种子会比较稳。"],
      },
    },
    {
      id: "lina",
      name: "柳青",
      ...npcDefaultLayout("lina"),
      color: "#6f8f4d",
      hairColor: "#40572f",
      questIds: ["shipCropsForLina", "clinicRouteForLina", "coldChainForLina", "cooperativeLedgerForLina", "coldChainLedgerForLina"],
      dialog: {
        hello: "我是柳青，帮大家整理出货箱记录。",
        idle: "出货箱里的东西会在睡觉后结算。",
        daily: [
          "睡前检查出货箱，能避免忘记结算。",
          "订单只看待出货数量，放进去以后订单状态会同步更新。",
          "想当天卖现金就去商店，想顺便做订单就用出货箱。",
        ],
        sunny: ["晴天路好走，把库存搬到出货箱会省些时间。"],
        rainy: ["雨天箱子也照常结算，别担心作物会被淋坏。"],
        lowEnergy: ["如果体力快见底，先把作物投入箱子，再回屋睡觉。"],
        readyCrops: ["成熟作物收下来后，可以直接投入出货箱等明天结算。"],
        shipments: ["出货箱里已经有待结算作物了，睡觉后金币会到账。"],
      },
    },
    {
      id: "nannan",
      name: "楠楠",
      ...npcDefaultLayout("nannan"),
      color: "#d8aa45",
      hairColor: "#503328",
      questIds: ["childCareForNannan", "schoolGardenForNannan", "classroomGardenForNannan"],
      dialog: {
        hello: "我叫楠楠。放学以后，我常在广场这边等奶奶。",
        idle: "大人说村里慢慢会有托管教室。要是真的亮灯，我就不用一直在路口等了。",
        daily: [
          "今天老师说要写一篇《家乡》。我想写菜地、水井，还有晚上会亮的小路灯。",
          "我不怕一个人等，就是有时候天黑得太快。",
          "如果托管教室开了，我想在那里放一本自己的作业本。",
        ],
        rainy: ["下雨的时候，等人的时间会变得很长。"],
        sunny: ["晴天广场人多一点，我就能听见更多消息。"],
      },
    },
    {
      id: "uncleChen",
      name: "陈伯",
      ...npcDefaultLayout("uncleChen"),
      color: "#8a7a66",
      hairColor: "#d6d0c4",
      questIds: ["elderMealForChen", "winterPantryForChen", "mealRouteForChen"],
      dialog: {
        hello: "我是陈伯。腿脚慢，消息也慢，但村里的变化我看得清。",
        idle: "老人饭点、巡诊路线、冷链代收点，这些听着不像大事，可都是让人安心的小事。",
        daily: [
          "年轻人能留下，老人就不用总把电话攥在手里。",
          "路修得再宽，也得有人愿意回来走。",
          "农产品卖得出去，村里才有余力照看走得慢的人。",
        ],
        rainy: ["雨天去卫生站不容易。要是巡诊路线排起来，很多人会少熬一熬。"],
        sunny: ["晴天坐在广场，看谁家烟囱冒烟，也能知道今天大家过得怎么样。"],
      },
    },
  ];
}

function createDefaultQuests() {
  return {
    harvestForMira: {
      id: "harvestForMira",
      title: "收获 3 个作物交给林岚",
      npcId: "mira",
      type: "harvest",
      status: "notStarted",
      target: 3,
      rewardSeeds: 5,
      rewardSeedCropId: DEFAULT_CROP_ID,
      rewardMaxEnergy: 5,
      progress: 0,
      dialog: {
        offer: "我需要 3 个作物样本，看看这片地适合种什么。",
        active: "继续收获作物，我会根据样本判断土壤状态。",
        ready: "你带来了足够的作物。谢谢，这是一些新种子。",
        completed: "第一批作物样本已经记录好了。",
      },
    },
    buySeedsForTheo: {
      id: "buySeedsForTheo",
      title: "购买 5 个任意种子",
      npcId: "theo",
      type: "purchase",
      status: "notStarted",
      target: 5,
      rewardGold: 20,
      rewardSeeds: 0,
      rewardSeedCropId: DEFAULT_CROP_ID,
      rewardSeedUnlocks: ["wheat"],
      progress: 0,
      dialog: {
        offer: "种子铺需要一点流通记录。帮我购买 5 个任意种子。",
        active: "买种子的记录会自动同步到我的账本。",
        ready: "采购记录够了。这点金币给你补贴下一轮播种。",
        completed: "采购记录很清楚，商店补货会更稳。",
      },
    },
    youthWorkshopForTheo: {
      id: "youthWorkshopForTheo",
      title: "帮何涛完成青年工坊补给",
      npcId: "theo",
      type: "purchase",
      status: "notStarted",
      target: 8,
      rewardGold: 35,
      rewardSeeds: 2,
      rewardSeedCropId: "corn",
      rewardToolUpgrades: { hoe: 1 },
      rewardSeedUnlocks: ["corn"],
      progress: 0,
      unlockIssueGoalId: "youthWorkshop",
      unlockHint: "完成何涛的种子记录，并把助农集市准备跑通后开放。",
      isUnlocked: () => state.quests.buySeedsForTheo?.status === "completed" && state.story.marketPrepCompleted,
      dialog: {
        offer: "我想把废铺面改成青年工坊。先帮我做 8 个种子的采购流通记录，证明培训、包装和补给能接上。",
        active: "继续买种子，记录够了以后，工坊第一期课表就能贴出来。",
        ready: "补给记录够了。青年工坊可以先开包装和账本课，这是给你的补贴。",
        completed: "青年工坊已经开课。留下来不该只是吃苦，也该学得到新的活法。",
      },
    },
    marketShelfForTheo: {
      id: "marketShelfForTheo",
      title: "帮何涛整理种子铺稳定货架",
      npcId: "theo",
      type: "purchase",
      status: "notStarted",
      target: 10,
      rewardGold: 55,
      rewardSeeds: 2,
      rewardSeedCropId: "tomato",
      rewardToolUpgrades: { hoe: 1 },
      rewardSeedUnlocks: ["tomato"],
      progress: 0,
      unlockHint: "完成青年工坊补给，并跑通社区订单后开放。",
      isUnlocked: () => state.quests.youthWorkshopForTheo?.status === "completed" && state.story.communityOrdersCompleted,
      dialog: {
        offer: "青年工坊想把种子铺的货架分成春夏秋冬四栏。再帮我做 10 个种子的采购记录，货架就能按季节稳定补货。",
        active: "继续买种子。记录够了以后，种子铺不再只靠临时进货。",
        ready: "采购记录够了。番茄种子可以先上架，货架也能给新来的年轻人练手。",
        completed: "种子铺的稳定货架已经摆好。何涛说，能看见下个月的货，人才敢想留下来的事。",
      },
    },
    workshopApprenticeForTheo: {
      id: "workshopApprenticeForTheo",
      title: "帮何涛开工坊学徒课",
      npcId: "theo",
      type: "purchase",
      status: "notStarted",
      target: 12,
      rewardGold: 90,
      rewardSeeds: 2,
      rewardSeedCropId: "tomato",
      rewardToolUpgrades: { hoe: 1 },
      rewardSeedUnlocks: ["tomato"],
      progress: 0,
      unlockHint: "青年返乡工坊达到强化一后开放。",
      isUnlocked: () => villageFacilityLevel("youthWorkshop") >= 2,
      dialog: {
        offer: "工坊开始稳定开课了。再做 12 次种子采购记录，我们可以让学徒练完整的补货、定价和账本。",
        active: "采购记录够了，工坊的学徒课就能从模拟变成真账。",
        ready: "记录够了。工坊会拿这些账本做第一堂实操课。",
        completed: "何涛说，年轻人不是只缺岗位，也缺一条能学会、能犯错、能留下来的路。",
      },
    },
    shipCropsForLina: {
      id: "shipCropsForLina",
      title: "投入 4 个作物到出货箱",
      npcId: "lina",
      type: "shipment",
      status: "notStarted",
      target: 4,
      rewardSeeds: 2,
      rewardSeedCropId: "wheat",
      rewardToolUpgrades: { scythe: 1 },
      progress: 0,
      dialog: {
        offer: "出货箱还缺一批测试记录。投入 4 个任意作物就行。",
        active: "把作物放进出货箱后，记录会自动增加。",
        ready: "出货记录够了。这些小麦种子给你试种。",
        completed: "出货流程已经跑通了。",
      },
    },
    clinicRouteForLina: {
      id: "clinicRouteForLina",
      title: "帮柳青整理巡诊路线出货记录",
      npcId: "lina",
      type: "shipment",
      status: "notStarted",
      target: 6,
      rewardGold: 60,
      rewardSeeds: 2,
      rewardSeedCropId: "spinach",
      rewardWateringCanCapacity: 2,
      rewardToolUpgrades: { wateringCan: 1 },
      rewardSeedUnlocks: ["spinach"],
      progress: 0,
      unlockIssueGoalId: "clinicRoute",
      unlockHint: "完成柳青的出货记录，并发出第一笔电商试单后开放。",
      isUnlocked: () => state.quests.shipCropsForLina?.status === "completed" && state.story.ecommerceTrialShipped,
      dialog: {
        offer: "卫生站想把慢病取药和雨天复诊排成固定路线。先帮我做 6 个作物出货记录，我好对照哪几户需要顺路回访。",
        active: "作物进出货箱后，我会把路线、老人名单和卫生站需求一起核对。",
        ready: "路线记录齐了。乡医巡诊可以贴到广场上，这是给你的路费补贴。",
        completed: "巡诊路线已经贴出来。路不只送货，也开始把照看送回来。",
      },
    },
    coldChainForLina: {
      id: "coldChainForLina",
      title: "帮柳青完成冷链代收试运行",
      npcId: "lina",
      type: "shipment",
      status: "notStarted",
      target: 8,
      rewardGold: 100,
      rewardSeeds: 2,
      rewardSeedCropId: "sweetPotato",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["sweetPotato"],
      progress: 0,
      unlockIssueGoalId: "coldChain",
      unlockHint: "修复加工设施、加入合作社，并完成巡诊路线支线后开放。",
      isUnlocked: () =>
        state.quests.clinicRouteForLina?.status === "completed" &&
        state.story.processingRepaired &&
        state.story.cooperativeJoined,
      dialog: {
        offer: "合作社要试一个小冷链代收点。先用 8 个作物跑一次出货节奏，看损耗能不能降下来。",
        active: "继续把作物投入出货箱。只要记录稳定，冷链代收点就能先开一格。",
        ready: "试运行记录通过。以后菜不必当天低价甩卖，村里终于有了缓冲。",
        completed: "冷链代收点已经运转。价格、损耗和时间不再只压在种地的人身上。",
      },
    },
    cooperativeLedgerForLina: {
      id: "cooperativeLedgerForLina",
      title: "帮柳青核对合作社分账单",
      npcId: "lina",
      type: "shipment",
      status: "notStarted",
      target: 12,
      rewardGold: 120,
      rewardSeeds: 2,
      rewardSeedCropId: "sweetPotato",
      rewardToolUpgrades: { scythe: 1 },
      rewardSeedUnlocks: ["sweetPotato"],
      progress: 0,
      unlockHint: "完成冷链代收试运行，并加入合作社后开放。",
      isUnlocked: () => state.quests.coldChainForLina?.status === "completed" && state.story.cooperativeJoined,
      dialog: {
        offer: "合作社第一次分账最容易出误会。用 12 个出货记录帮我核对一次，让大家知道钱从哪里来、怎么分出去。",
        active: "继续把作物投入出货箱。记录越完整，分账时越少靠猜。",
        ready: "分账记录够了。合作社可以把第一张明细贴出来，这是你的跑单补贴。",
        completed: "柳青把分账单贴在公告栏上。她说公开不是形式，是让人重新相信一起做事。",
      },
    },
    coldChainLedgerForLina: {
      id: "coldChainLedgerForLina",
      title: "帮柳青核对冷链损耗单",
      npcId: "lina",
      type: "shipment",
      status: "notStarted",
      target: 14,
      rewardGold: 130,
      rewardSeeds: 2,
      rewardSeedCropId: "sweetPotato",
      rewardToolUpgrades: { scythe: 1 },
      rewardSeedUnlocks: ["sweetPotato"],
      progress: 0,
      unlockHint: "冷链代收点达到强化一后开放。",
      isUnlocked: () => villageFacilityLevel("coldChain") >= 2,
      dialog: {
        offer: "冷链跑起来以后，真正要看的不是多卖了多少，而是少损耗了多少。用 14 个出货记录帮我核一张损耗单。",
        active: "继续把作物投入出货箱。记录越完整，冷链的议价依据越硬。",
        ready: "损耗单核完了。合作社终于能拿数据去谈价，而不是只靠求人收货。",
        completed: "柳青把冷链表贴在代收点旁。她说，少烂一筐菜，有时候就是多留一个人。",
      },
    },
    deliverRadishForMira: {
      id: "deliverRadishForMira",
      title: "给林岚交付 2 个萝卜",
      npcId: "mira",
      type: "delivery",
      status: "notStarted",
      target: 2,
      requiredCropId: DEFAULT_CROP_ID,
      rewardGold: 25,
      rewardSeeds: 1,
      rewardSeedCropId: "bean",
      rewardToolUpgrades: { hoe: 1 },
      rewardSeedUnlocks: ["bean"],
      progress: 0,
      dialog: {
        offer: "如果你有 2 个萝卜，带给我做一组口感记录。",
        active: "交付任务会检查你背包里的萝卜数量。",
        ready: "萝卜数量够了。我收下样本，这是报酬。",
        completed: "萝卜样本已经送到厨房了。",
      },
    },
    pondSampleForMira: {
      id: "pondSampleForMira",
      title: "帮林岚整理村塘水样",
      npcId: "mira",
      type: "harvest",
      status: "notStarted",
      target: 12,
      rewardGold: 80,
      rewardSeeds: 2,
      rewardSeedCropId: "spinach",
      rewardWateringCanCapacity: 1,
      rewardSeedUnlocks: ["spinach"],
      progress: 0,
      unlockIssueGoalId: "waterCleanup",
      unlockHint: "完成林岚的萝卜样本，并完成春季样本包后开放。",
      isUnlocked: () => state.quests.deliverRadishForMira?.status === "completed" && state.story.springSampleBundleCompleted,
      dialog: {
        offer: "春季样本留够以后，我想对照村塘水样。再收获 12 个作物，看看清淤前后水和土的变化。",
        active: "继续收获作物。我会把产量、浇水次数和村塘水色一起记下来。",
        ready: "样本够了。村塘清淤可以先动起来，水质好了，鱼也会慢慢回来。",
        completed: "林岚的水样表贴在土地庙旁。她说水清一点，村里的故事就多一条能继续流动的路。",
      },
    },
    clearWaterRecordForMira: {
      id: "clearWaterRecordForMira",
      title: "帮林岚复查清水记录",
      npcId: "mira",
      type: "harvest",
      status: "notStarted",
      target: 16,
      rewardGold: 120,
      rewardSeeds: 2,
      rewardSeedCropId: "spinach",
      rewardWateringCanCapacity: 1,
      rewardSeedUnlocks: ["spinach"],
      progress: 0,
      unlockHint: "村塘清淤点达到强化一后开放。",
      isUnlocked: () => villageFacilityLevel("waterCleanup") >= 2,
      dialog: {
        offer: "村塘清淤后，水样不能只看一天。再收获 16 个作物，我要对照地里和池塘的变化。",
        active: "继续收获作物。清水记录要配合田里的产量一起看。",
        ready: "记录够了。水质、田块和村里的饭桌终于能放在一张表里。",
        completed: "林岚把复查表夹进土地庙的旧账里。她说，水好了以后，人会先从小事上相信变化。",
      },
    },
    childCareForNannan: {
      id: "childCareForNannan",
      title: "给楠楠准备 2 份小白菜",
      npcId: "nannan",
      type: "delivery",
      status: "notStarted",
      target: 2,
      requiredCropId: "bokChoy",
      rewardGold: 30,
      rewardSeeds: 2,
      rewardSeedCropId: "bokChoy",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["bokChoy"],
      progress: 0,
      unlockIssueGoalId: "childCare",
      unlockHint: "完成第一章、村庄杂货铺重新开门后开放。",
      isUnlocked: () => state.story.chapterOneCompleted,
      dialog: {
        offer: "托管教室还没真正开起来。老师说如果有 2 份小白菜，晚饭表就能先试一次。",
        active: "我会在广场等。你背包里有 2 份小白菜时，再来找我就行。",
        ready: "这些菜够了。今晚教室会亮灯，我也能在桌子上写完作业。",
        completed: "托管教室试了一晚。楠楠说，等人这件事终于没有那么冷了。",
      },
    },
    schoolGardenForNannan: {
      id: "schoolGardenForNannan",
      title: "给楠楠准备教室小菜畦",
      npcId: "nannan",
      type: "delivery",
      status: "notStarted",
      target: 2,
      requiredCropId: "bean",
      rewardGold: 40,
      rewardSeeds: 3,
      rewardSeedCropId: "bean",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["bean"],
      progress: 0,
      unlockHint: "托管教室试运行后，完成林岚的萝卜样本即可开放。",
      isUnlocked: () =>
        state.quests.childCareForNannan?.status === "completed" &&
        state.quests.deliverRadishForMira?.status === "completed",
      dialog: {
        offer: "老师说教室后面能留一小条菜畦。要是有 2 份豆子，我们就能从搭架子开始学。",
        active: "豆子要记得留给我。教室小菜畦不大，但大家都能轮流照看。",
        ready: "豆子够了。楠楠说她想把第一根竹竿写上自己的名字。",
        completed: "教室后面多了一排小豆架。楠楠终于有一件放学后不用等大人也能继续做的事。",
      },
    },
    classroomGardenForNannan: {
      id: "classroomGardenForNannan",
      title: "帮楠楠扩一排教室菜畦",
      npcId: "nannan",
      type: "delivery",
      status: "notStarted",
      target: 3,
      requiredCropId: "bokChoy",
      rewardGold: 60,
      rewardSeeds: 3,
      rewardSeedCropId: "bokChoy",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["bokChoy"],
      progress: 0,
      unlockHint: "托管教室达到强化一后开放。",
      isUnlocked: () => villageFacilityLevel("childCare") >= 2,
      dialog: {
        offer: "托管教室现在每天都亮灯。老师说菜畦能再扩一排，如果有 3 份小白菜，我们就能轮流照看。",
        active: "小白菜准备好以后来找我。教室后面的地不大，但大家都能有一小块。",
        ready: "菜够了。楠楠说她想把照看表贴在门口，谁浇了水都能被看见。",
        completed: "托管教室的菜畦多了一排。孩子们终于不只是等人，也开始照看自己的小地方。",
      },
    },
    elderMealForChen: {
      id: "elderMealForChen",
      title: "给陈伯准备 2 个红薯",
      npcId: "uncleChen",
      type: "delivery",
      status: "notStarted",
      target: 2,
      requiredCropId: "sweetPotato",
      rewardGold: 45,
      rewardSeeds: 2,
      rewardSeedCropId: "spinach",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["spinach"],
      progress: 0,
      unlockIssueGoalId: "elderCare",
      unlockHint: "完成安心菜篮和茶铺试吃这两个社区订单后开放。",
      isUnlocked: () => state.story.communityOrdersCompleted,
      dialog: {
        offer: "互助饭点想试一锅热汤。要是能有 2 个红薯，老人们晚上会暖和些。",
        active: "红薯耐放，也顶饱。你准备好 2 个红薯再来找我。",
        ready: "红薯够了。今晚饭点不只是分饭，也会顺便点一点人头。",
        completed: "陈伯说饭点开火以后，村里终于有人知道谁今天没来吃饭。",
      },
    },
    winterPantryForChen: {
      id: "winterPantryForChen",
      title: "帮陈伯备一批冬储菜",
      npcId: "uncleChen",
      type: "delivery",
      status: "notStarted",
      target: 2,
      requiredCropId: "spinach",
      rewardGold: 70,
      rewardSeeds: 2,
      rewardSeedCropId: "sweetPotato",
      rewardMaxEnergy: 5,
      rewardWateringCanCapacity: 1,
      rewardSeedUnlocks: ["sweetPotato"],
      progress: 0,
      unlockHint: "完成互助饭点后，在冬季或解锁菠菜种子后开放。",
      isUnlocked: () =>
        state.quests.elderMealForChen?.status === "completed" &&
        (currentSeasonId() === "winter" || state.abilities.unlockedSeeds?.spinach),
      dialog: {
        offer: "冬天最怕饭点断火。要是能备 2 份菠菜，厨房就能先排一周的菜谱。",
        active: "菠菜轻，但能让汤有颜色。准备好 2 份再来找我。",
        ready: "菜够了。这个冬天，饭点至少不用每天临时凑。",
        completed: "陈伯把冬储表压在饭点门口。他说有了表，大家就知道明天还会有人开火。",
      },
    },
    mealRouteForChen: {
      id: "mealRouteForChen",
      title: "帮陈伯排饭点巡看表",
      npcId: "uncleChen",
      type: "delivery",
      status: "notStarted",
      target: 3,
      requiredCropId: "spinach",
      rewardGold: 80,
      rewardSeeds: 2,
      rewardSeedCropId: "spinach",
      rewardMaxEnergy: 5,
      rewardSeedUnlocks: ["spinach"],
      progress: 0,
      unlockHint: "老人互助饭点达到强化一后开放。",
      isUnlocked: () => villageFacilityLevel("elderCare") >= 2,
      dialog: {
        offer: "饭点稳定以后，还得知道谁没来。帮我备 3 份菠菜，我把巡看表排起来。",
        active: "菠菜准备好就来找我。饭点不是只管吃饭，也管没人开口的时候有没有人发现。",
        ready: "菜够了。今天开始，每天饭点都会多看一眼空着的凳子。",
        completed: "陈伯把巡看表贴在饭点门口。他说，有人记得你没来，就是村子还在。",
      },
    },
  };
}

function normalizeNpcs(value) {
  const defaults = createDefaultNpcs();
  if (!Array.isArray(value)) return defaults;
  return defaults.map((npc) => {
    const saved = value.find((item) => item.id === npc.id) ?? {};
    const savedQuestIds = Array.isArray(saved.questIds) ? saved.questIds : [];
    const questIds = [...npc.questIds, ...savedQuestIds.filter((questId) => !npc.questIds.includes(questId))];
    const layout = npcDefaultLayout(npc.id);
    return {
      ...npc,
      ...saved,
      mapId: layout.mapId,
      x: layout.x,
      y: layout.y,
      color: saved.color ?? npc.color,
      hairColor: saved.hairColor ?? npc.hairColor,
      questIds,
      dialog: { ...npc.dialog, ...(saved.dialog ?? {}) },
    };
  });
}

function normalizeQuest(questId, value = {}) {
  value = value && typeof value === "object" ? value : {};
  const defaults = createDefaultQuests()[questId];
  if (!defaults) return value;
  const status = value.status ?? defaults.status;
  const unlockIssueGoalId = VILLAGE_ISSUE_GOALS[value.unlockIssueGoalId] ? value.unlockIssueGoalId : defaults.unlockIssueGoalId;
  return {
    ...defaults,
    ...value,
    id: questId,
    status,
    target: Math.max(1, Number(value.target ?? defaults.target)),
    progress: Math.max(0, Number(value.progress ?? defaults.progress ?? 0)),
    rewardGold: Math.max(0, Number(value.rewardGold ?? defaults.rewardGold ?? 0)),
    rewardSeeds: Math.max(0, Number(value.rewardSeeds ?? defaults.rewardSeeds ?? 0)),
    rewardSeedCropId: cropDef(value.rewardSeedCropId ?? defaults.rewardSeedCropId).id,
    rewardMaxEnergy: Math.max(0, Number(value.rewardMaxEnergy ?? defaults.rewardMaxEnergy ?? 0)),
    rewardWateringCanCapacity: Math.max(0, Number(value.rewardWateringCanCapacity ?? defaults.rewardWateringCanCapacity ?? 0)),
    rewardToolUpgrades: normalizeToolUpgradeRewards(value.rewardToolUpgrades ?? defaults.rewardToolUpgrades),
    rewardSeedUnlocks: normalizeSeedUnlockRewards(value.rewardSeedUnlocks ?? defaults.rewardSeedUnlocks),
    requiredCropId: value.requiredCropId ? cropDef(value.requiredCropId).id : defaults.requiredCropId,
    unlockIssueGoalId,
    unlockHint: String(value.unlockHint ?? defaults.unlockHint ?? ""),
    isUnlocked: defaults.isUnlocked,
    dialog: { ...defaults.dialog, ...(value.dialog ?? {}) },
  };
}

function normalizeQuestCollection(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const normalized = {};
  for (const questId of QUEST_ORDER) {
    normalized[questId] = normalizeQuest(questId, value[questId]);
  }
  return normalized;
}

function createDefaultStoryState() {
  return {
    firstFieldHoed: 0,
    firstFieldPlanted: 0,
    firstFieldWatered: 0,
    sleptAfterWatering: false,
    firstShipmentSettled: false,
    villageFeedbackSeen: false,
    firstFeedbackRewardClaimed: false,
    firstVillageVisitSeen: false,
    firstSeedShopVisited: false,
    chapterOneCompleted: false,
    chapterOneRewardClaimed: false,
    mountainResourceVisited: false,
    springFairVisited: false,
    springSampleBundleCompleted: false,
    springSampleRewardClaimed: false,
    waterQuality: 0,
    marketPrepCompleted: false,
    marketPrepRewardClaimed: false,
    basketOrderDelivered: 0,
    basketOrderRewardClaimed: false,
    tastingOrderDelivered: 0,
    tastingOrderRewardClaimed: false,
    communityOrdersCompleted: false,
    communityOrdersRewardClaimed: false,
    ecommerceDeskSeen: false,
    ecommerceTrialSubmitted: 0,
    ecommerceTrialPacked: false,
    ecommerceTrialShipped: false,
    ecommerceTrialRewardClaimed: false,
    processingRepaired: false,
    firstMachineStarted: false,
    firstProcessedGoodCollected: false,
    firstProcessedShipmentSettled: false,
    firstProcessedShipmentRewardClaimed: false,
    cooperativeRepaired: false,
    cooperativeCropSubmitted: 0,
    cooperativeGoodSubmitted: 0,
    cooperativeJoined: false,
    cooperativeRewardClaimed: false,
    cooperativeContracts: { submitted: {}, claimedKeys: [] },
    cooperativeExpansionStartCount: null,
    cooperativeExpansionLastContractKey: null,
    cooperativeExpansionStreak: 0,
    cooperativeExpansionBestStreak: 0,
    cooperativeExpansionDividendClaimedTiers: [],
    viewedYearEnd: false,
    yearEndRewardClaimed: false,
    secondYearPlan: null,
    secondYearPlanRewardClaimed: false,
    tourismRepaired: false,
    tourismCropSubmitted: 0,
    tourismGoodSubmitted: 0,
    tourismFirstOrderCompleted: false,
    tourismRewardClaimed: false,
    brandRepaired: false,
    brandFirstPackCreated: false,
    brandFirstShipmentSettled: false,
    brandFirstShipmentRewardClaimed: false,
    irrigationRepaired: false,
    irrigationFirstProjectCompleted: false,
    irrigationRewardClaimed: false,
    summerStartGuideSeen: false,
    landShrineFinalRevealed: false,
    villageIssueGoals: createDefaultVillageIssueGoals(),
    villageFacilityLevels: createDefaultVillageFacilityLevels(),
  };
}

function normalizeCooperativeContracts(value = {}) {
  const source = value && typeof value === "object" ? value : {};
  const submittedSource = source.submitted && typeof source.submitted === "object" ? source.submitted : {};
  const submitted = {};
  for (const [key, count] of Object.entries(submittedSource)) {
    if (/^y\d+-t\d+$/.test(key)) submitted[key] = Math.max(0, Math.floor(Number(count) || 0));
  }
  const claimedKeys = Array.isArray(source.claimedKeys)
    ? [...new Set(source.claimedKeys.filter((key) => /^y\d+-t\d+$/.test(key)))]
    : [];
  return { submitted, claimedKeys };
}

function normalizeCooperativeExpansionTiers(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((tier) => Math.floor(Number(tier) || 0)).filter((tier) => tier > 0))].sort((a, b) => a - b);
}

function normalizeStoryState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const rawVillageIssueGoals = normalizeVillageIssueGoals(value.villageIssueGoals);
  const villageFacilityLevels = normalizeVillageFacilityLevels(value.villageFacilityLevels, rawVillageIssueGoals);
  const villageIssueGoals = Object.fromEntries(
    VILLAGE_ISSUE_GOAL_IDS.map((goalId) => [goalId, rawVillageIssueGoals[goalId] || villageFacilityLevels[goalId] > 0]),
  );
  return {
    ...createDefaultStoryState(),
    firstFieldHoed: Math.max(0, Number(value.firstFieldHoed ?? 0)),
    firstFieldPlanted: Math.max(0, Number(value.firstFieldPlanted ?? 0)),
    firstFieldWatered: Math.max(0, Number(value.firstFieldWatered ?? 0)),
    sleptAfterWatering: value.sleptAfterWatering === true,
    firstShipmentSettled: value.firstShipmentSettled === true,
    villageFeedbackSeen: value.villageFeedbackSeen === true,
    firstFeedbackRewardClaimed: value.firstFeedbackRewardClaimed === true,
    firstVillageVisitSeen: value.firstVillageVisitSeen === true,
    firstSeedShopVisited: value.firstSeedShopVisited === true,
    chapterOneCompleted: value.chapterOneCompleted === true,
    chapterOneRewardClaimed: value.chapterOneRewardClaimed === true,
    mountainResourceVisited: value.mountainResourceVisited === true,
    springFairVisited: value.springFairVisited === true,
    springSampleBundleCompleted: value.springSampleBundleCompleted === true,
    springSampleRewardClaimed: value.springSampleRewardClaimed === true,
    waterQuality: normalizeWaterQuality(value.waterQuality),
    marketPrepCompleted: value.marketPrepCompleted === true,
    marketPrepRewardClaimed: value.marketPrepRewardClaimed === true,
    basketOrderDelivered: Math.max(0, Number(value.basketOrderDelivered ?? 0)),
    basketOrderRewardClaimed: value.basketOrderRewardClaimed === true,
    tastingOrderDelivered: Math.max(0, Number(value.tastingOrderDelivered ?? 0)),
    tastingOrderRewardClaimed: value.tastingOrderRewardClaimed === true,
    communityOrdersCompleted: value.communityOrdersCompleted === true,
    communityOrdersRewardClaimed: value.communityOrdersRewardClaimed === true,
    ecommerceDeskSeen: value.ecommerceDeskSeen === true,
    ecommerceTrialSubmitted: Math.min(ECOMMERCE_TRIAL_ORDER.target, Math.max(0, Number(value.ecommerceTrialSubmitted ?? 0))),
    ecommerceTrialPacked: value.ecommerceTrialPacked === true,
    ecommerceTrialShipped: value.ecommerceTrialShipped === true,
    ecommerceTrialRewardClaimed: value.ecommerceTrialRewardClaimed === true,
    processingRepaired: value.processingRepaired === true,
    firstMachineStarted: value.firstMachineStarted === true,
    firstProcessedGoodCollected: value.firstProcessedGoodCollected === true,
    firstProcessedShipmentSettled: value.firstProcessedShipmentSettled === true,
    firstProcessedShipmentRewardClaimed: value.firstProcessedShipmentRewardClaimed === true,
    cooperativeRepaired: value.cooperativeRepaired === true,
    cooperativeCropSubmitted: Math.max(0, Number(value.cooperativeCropSubmitted ?? 0)),
    cooperativeGoodSubmitted: Math.max(0, Number(value.cooperativeGoodSubmitted ?? 0)),
    cooperativeJoined: value.cooperativeJoined === true,
    cooperativeRewardClaimed: value.cooperativeRewardClaimed === true,
    cooperativeContracts: normalizeCooperativeContracts(value.cooperativeContracts),
    cooperativeExpansionStartCount: Number.isFinite(value.cooperativeExpansionStartCount)
      ? Math.max(0, Math.floor(value.cooperativeExpansionStartCount))
      : null,
    cooperativeExpansionLastContractKey: /^y\d+-t\d+$/.test(value.cooperativeExpansionLastContractKey ?? "")
      ? value.cooperativeExpansionLastContractKey
      : null,
    cooperativeExpansionStreak: Math.max(0, Math.floor(Number(value.cooperativeExpansionStreak ?? 0))),
    cooperativeExpansionBestStreak: Math.max(0, Math.floor(Number(value.cooperativeExpansionBestStreak ?? 0))),
    cooperativeExpansionDividendClaimedTiers: normalizeCooperativeExpansionTiers(value.cooperativeExpansionDividendClaimedTiers),
    viewedYearEnd: value.viewedYearEnd === true,
    yearEndRewardClaimed: value.yearEndRewardClaimed === true,
    secondYearPlan: SECOND_YEAR_PLANS[value.secondYearPlan] ? value.secondYearPlan : null,
    secondYearPlanRewardClaimed: value.secondYearPlanRewardClaimed === true,
    tourismRepaired: value.tourismRepaired === true,
    tourismCropSubmitted: Math.max(0, Number(value.tourismCropSubmitted ?? 0)),
    tourismGoodSubmitted: Math.max(0, Number(value.tourismGoodSubmitted ?? 0)),
    tourismFirstOrderCompleted: value.tourismFirstOrderCompleted === true,
    tourismRewardClaimed: value.tourismRewardClaimed === true,
    brandRepaired: value.brandRepaired === true,
    brandFirstPackCreated: value.brandFirstPackCreated === true,
    brandFirstShipmentSettled: value.brandFirstShipmentSettled === true,
    brandFirstShipmentRewardClaimed: value.brandFirstShipmentRewardClaimed === true,
    irrigationRepaired: value.irrigationRepaired === true,
    irrigationFirstProjectCompleted: value.irrigationFirstProjectCompleted === true,
    irrigationRewardClaimed: value.irrigationRewardClaimed === true,
    summerStartGuideSeen: value.summerStartGuideSeen === true,
    landShrineFinalRevealed: value.landShrineFinalRevealed === true,
    villageIssueGoals,
    villageFacilityLevels,
  };
}

function addStoryProgress(key, amount = 1) {
  state.story[key] = Math.max(0, Number(state.story[key] ?? 0)) + amount;
}

function grantFirstFeedbackReward() {
  if (!state.story.firstShipmentSettled || state.story.firstFeedbackRewardClaimed) return "";
  state.story.firstFeedbackRewardClaimed = true;
  state.inventory.gold += 20;
  addSeedCount("bokChoy", 3);
  addLog("村民反馈奖励：+20g，+3 小白菜种子。");
  return "茶铺和卫生站先预付了一点菜篮经费：获得 20g 和 3 包小白菜种子。";
}

function completeChapterOne() {
  if (state.story.chapterOneCompleted) return "";
  state.story.chapterOneCompleted = true;
  let rewardText = "";
  if (!state.story.chapterOneRewardClaimed) {
    state.story.chapterOneRewardClaimed = true;
    state.inventory.gold += 40;
    addSeedCount(DEFAULT_CROP_ID, 5);
    rewardText = "章节奖励：获得 40g 和 5 包萝卜种子。";
    addLog("第一章奖励：+40g，+5 萝卜种子。");
  }
  addLog("第一章完成：返乡第一块地。");
  addScreenEffect("quest", "第一章完成");
  return `第一章完成：返乡第一块地。\n\n第一批菜已经卖出，村庄广场有了反馈，杂货铺也重新开门。\n下一步进入“助农集市”：继续收获作物，完成村民任务，让村里的订单和建造服务重新运转。${rewardText ? `\n\n${rewardText}` : ""}`;
}

function marketObjectDefaults() {
  return [
    { type: "marketStall", x: 9, y: 12, storyId: "marketStall", name: "助农集市摊位" },
    { type: "basketPoint", x: 15, y: 15, storyId: "basketPoint", name: "安心菜篮点" },
    { type: "tastingTable", x: 25, y: 15, storyId: "tastingTable", name: "茶铺试吃桌" },
    {
      type: "sign",
      x: 20,
      y: 16,
      storyId: "marketNotice",
      text: "助农集市开始筹备：菜篮点、试吃桌和临时摊位已经摆出来了。",
    },
  ];
}

function ensureMarketSetup() {
  if (!state.story.marketPrepCompleted || !maps.village) return;
  const village = maps.village;
  rect(village.layers.ground, 8, 12, 8, 4, TILE.floor);
  rect(village.layers.ground, 19, 15, 8, 3, TILE.floor);
  for (const object of marketObjectDefaults()) {
    if (!village.objects.some((item) => item.storyId === object.storyId)) village.objects.push({ ...object });
  }
}

function stableMarketObjectDefaults() {
  return [
    { type: "ecommerceDesk", x: 7, y: 15, storyId: "ecommerceDesk", name: "电商助农角" },
    {
      type: "sign",
      x: 12,
      y: 16,
      storyId: "stableMarketNotice",
      text: "社区订单完成后，助农集市进入稳定运行。下一步是分拣、包装、快递和复购记录。",
    },
  ];
}

function communityFacilityObject(def) {
  return {
    type: "communityFacility",
    x: def.x,
    y: def.y,
    name: def.name,
    goalId: def.goalId,
    storyId: `villageIssue:${def.goalId}`,
  };
}

function ensureVillageIssueGoalFacilities() {
  if (!maps.village || !state.story?.villageIssueGoals) return;
  const village = maps.village;
  for (const goalId of VILLAGE_ISSUE_GOAL_IDS) {
    const goal = VILLAGE_ISSUE_GOALS[goalId];
    const visible = villageIssueGoalComplete(goalId) || villageFacilityLevel(goalId) > 0 || goal.isUnlocked();
    if (!visible) continue;
    const def = communityFacilityDef(goalId);
    rect(village.layers.ground, Math.max(1, def.x - 1), def.y, 3, 2, TILE.floor);
    rect(village.layers.collision, Math.max(1, def.x - 1), def.y, 3, 2, 0);
    if (!village.objects.some((item) => item.storyId === `villageIssue:${goalId}` || (item.type === "communityFacility" && item.goalId === goalId))) {
      village.objects.push(communityFacilityObject(def));
    }
  }
}

function tourismServiceRuinDefault() {
  return {
    type: "ruin",
    x: 34,
    y: 17,
    storyId: "tourismService",
    name: "游客服务旧亭",
    featureId: "tourism",
    repairedType: "tourismDesk",
    repairedName: "游客服务亭",
    hint: "旧亭子还能修成游客接待点。第一年年终会后选择乡村旅游路线，才能重新开放。",
  };
}

function tourismServiceDeskDefault() {
  return { type: "tourismDesk", x: 34, y: 17, storyId: "tourismService", name: "游客服务亭" };
}

function ensureTourismSetup() {
  if (!maps.village || (!state.story.viewedYearEnd && state.story.secondYearPlan !== "tourism")) return;
  const village = maps.village;
  if (village.objects.some((object) => object.storyId === "tourismService" || object.type === "tourismDesk")) return;
  village.objects.push(state.story.tourismRepaired ? tourismServiceDeskDefault() : tourismServiceRuinDefault());
}

function brandPackagingRuinDefault() {
  return {
    type: "ruin",
    x: 11,
    y: 17,
    storyId: "brandPackaging",
    name: "品牌包装旧台",
    featureId: "brand",
    repairedType: "brandDesk",
    repairedName: "品牌包装台",
    hint: "旧包装台可以重新做品牌礼盒。第一年年终会后选择品牌农产品路线，才能修复。",
  };
}

function brandPackagingDeskDefault() {
  return { type: "brandDesk", x: 11, y: 17, storyId: "brandPackaging", name: "品牌包装台" };
}

function ensureBrandSetup() {
  if (!maps.village || (!state.story.viewedYearEnd && state.story.secondYearPlan !== "brand")) return;
  const village = maps.village;
  if (village.objects.some((object) => object.storyId === "brandPackaging" || object.type === "brandDesk")) return;
  village.objects.push(state.story.brandRepaired ? brandPackagingDeskDefault() : brandPackagingRuinDefault());
}

function irrigationPumpRuinDefault() {
  return {
    type: "ruin",
    x: 22,
    y: 22,
    storyId: "irrigationPump",
    name: "旧水泵",
    featureId: "irrigation",
    repairedType: "irrigationPump",
    repairedName: "水利水泵",
    hint: "旧水泵能把水引到农田边。第一年年终会后选择水利与扩建路线，才能修复。",
  };
}

function irrigationPumpDefault() {
  return { type: "irrigationPump", x: 22, y: 22, storyId: "irrigationPump", name: "水利水泵" };
}

function ensureIrrigationSetup() {
  if (!maps.farm || (!state.story.viewedYearEnd && state.story.secondYearPlan !== "irrigation")) return;
  const farm = maps.farm;
  if (farm.width <= 22 || farm.height <= 22) return;
  if (farm.objects.some((object) => object.storyId === "irrigationPump" || object.type === "irrigationPump")) return;
  farm.objects.push(state.story.irrigationRepaired ? irrigationPumpDefault() : irrigationPumpRuinDefault());
}

function ensureStableMarketSetup() {
  if (!state.story.communityOrdersCompleted || !maps.village) return;
  ensureMarketSetup();
  const village = maps.village;
  rect(village.layers.ground, 6, 14, 8, 4, TILE.floor);
  rect(village.layers.ground, 8, 12, 10, 5, TILE.floor);
  for (const object of stableMarketObjectDefaults()) {
    if (!village.objects.some((item) => item.storyId === object.storyId)) village.objects.push({ ...object });
  }
}

function completeMarketPrep() {
  if (!state.story.chapterOneCompleted || state.story.marketPrepCompleted) return "";
  state.story.marketPrepCompleted = true;
  ensureMarketSetup();
  let rewardText = "";
  if (!state.story.marketPrepRewardClaimed) {
    state.story.marketPrepRewardClaimed = true;
    state.inventory.gold += 60;
    addSeedCount("wheat", 2);
    rewardText = "阶段奖励：获得 60g 和 2 包小麦种子。";
    addLog("助农集市奖励：+60g，+2 小麦种子。");
  }
  addLog("助农集市准备完成，村庄主街出现临时摊位。");
  addScreenEffect("quest", "助农集市");
  return `助农集市准备完成。\n\n村口已经摆出临时摊位，广场增加了安心菜篮点和茶铺试吃桌。村里的需求不再只是公告文字，开始变成能看见的公共空间。\n下一步可以继续做社区订单、扩展建造和加工设施。${rewardText ? `\n\n${rewardText}` : ""}`;
}

function communityOrderDefForObject(object) {
  return Object.values(COMMUNITY_ORDERS).find((order) => order.objectType === object?.type) ?? null;
}

function communityOrderProgress(order) {
  return Math.min(order.target, Math.max(0, Number(state.story[order.progressKey] ?? 0)));
}

function communityOrderComplete(order) {
  return communityOrderProgress(order) >= order.target;
}

function communityOrderRewardKey(order) {
  return order.rewardKey;
}

function communityOrderRewardText(order) {
  const seedText = Object.entries(order.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  return [`+${effectiveCommunityOrderGoldReward(order)}g`, seedText].filter(Boolean).join("，");
}

function grantCommunityOrderReward(order) {
  const rewardKey = communityOrderRewardKey(order);
  if (!communityOrderComplete(order) || state.story[rewardKey]) return "";
  state.story[rewardKey] = true;
  state.inventory.gold += effectiveCommunityOrderGoldReward(order);
  for (const [cropId, count] of Object.entries(order.rewardSeeds ?? {})) {
    addSeedCount(cropId, count);
  }
  addLog(`${order.title}完成奖励：${communityOrderRewardText(order)}。`);
  addScreenEffect("quest", order.title);
  playSound("quest");
  return `${order.title}完成，奖励 ${communityOrderRewardText(order)}。`;
}

function completedCommunityOrderCount() {
  return Object.values(COMMUNITY_ORDERS).filter((order) => communityOrderComplete(order)).length;
}

function ecommerceTrialSubmittedCount() {
  return Math.min(ECOMMERCE_TRIAL_ORDER.target, Math.max(0, Number(state.story.ecommerceTrialSubmitted ?? 0)));
}

function ecommerceTrialRewardText() {
  const seedText = Object.entries(ECOMMERCE_TRIAL_ORDER.rewardSeeds)
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  return [`+${ECOMMERCE_TRIAL_ORDER.rewardGold}g`, seedText].filter(Boolean).join("，");
}

function processingShipmentRewardText() {
  return "+120g，+1 晾晒架";
}

function completeProcessingRepair(repaired) {
  if (state.story.processingRepaired) return "";
  state.story.processingRepaired = true;
  addLog("加工设施修复完成，农场可以开始做加工品。");
  addScreenEffect("quest", "加工设施");
  return `加工设施修复完成。\n\n${repaired.name}已经可以使用。现在可以把作物投入加工桶，睡觉后领取成品，再把加工品投入出货箱结算。加工品会成为后续电商订单和秋季合作社试运行的基础。`;
}

function grantFirstProcessedShipmentReward() {
  if (!state.story.firstProcessedShipmentSettled || state.story.firstProcessedShipmentRewardClaimed) return "";
  state.story.firstProcessedShipmentRewardClaimed = true;
  state.inventory.gold += 120;
  state.build.inventory.dryer = (state.build.inventory.dryer ?? 0) + 1;
  addLog(`第一批加工品出货奖励：${processingShipmentRewardText()}。`);
  addScreenEffect("quest", "加工出货");
  playSound("quest");
  return `第一批加工品出货完成，奖励 ${processingShipmentRewardText()}。晾晒架已经放入建造库存，可以在建造模式中摆放。`;
}

function cooperativeCropSubmittedCount() {
  return Math.min(COOPERATIVE_TRIAL.cropTarget, Math.max(0, Number(state.story.cooperativeCropSubmitted ?? 0)));
}

function cooperativeGoodSubmittedCount() {
  return Math.min(COOPERATIVE_TRIAL.goodTarget, Math.max(0, Number(state.story.cooperativeGoodSubmitted ?? 0)));
}

function cooperativeTrialComplete() {
  return (
    cooperativeCropSubmittedCount() >= COOPERATIVE_TRIAL.cropTarget &&
    cooperativeGoodSubmittedCount() >= COOPERATIVE_TRIAL.goodTarget
  );
}

function cooperativeRewardText() {
  const seedText = Object.entries(COOPERATIVE_TRIAL.rewardSeeds)
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  return [`+${COOPERATIVE_TRIAL.rewardGold}g`, seedText].filter(Boolean).join("，");
}

function cooperativeContractKey(day = state.day) {
  const season = seasonInfoForDay(day);
  return `y${season.year}-t${season.solarTermIndex}`;
}

function cooperativeContractForDay(day = state.day) {
  const season = seasonInfoForDay(day);
  const kind = season.solarTermIndex % 2 === 0 ? "crop" : "good";
  const target =
    kind === "crop"
      ? COOPERATIVE_CONTRACT.cropBaseTarget + season.index * 2
      : COOPERATIVE_CONTRACT.goodBaseTarget + Math.floor(season.index / 2);
  const rewardGold =
    kind === "crop"
      ? COOPERATIVE_CONTRACT.cropRewardBase + season.index * 45
      : COOPERATIVE_CONTRACT.goodRewardBase + season.index * 70;
  const rewardSeeds = {};
  const seasonalCrops = CROP_IDS.filter((cropId) => isCropInSeason(cropId, season.id));
  const seedCropId = seasonalCrops[season.solarTermInSeason % Math.max(1, seasonalCrops.length)] ?? DEFAULT_CROP_ID;
  rewardSeeds[seedCropId] = kind === "crop" ? 2 : 3;
  return {
    key: cooperativeContractKey(day),
    kind,
    title: `${season.solarTerm.name}合作社${kind === "crop" ? "原料统货单" : "加工品样品单"}`,
    target,
    rewardGold,
    rewardSeeds,
    description:
      kind === "crop"
        ? "合作社按节气收一批统货原料，任意作物都可提交。"
        : "合作社需要验证加工稳定性，任意加工品都可提交。",
  };
}

function cooperativeContractSubmitted(contract = cooperativeContractForDay()) {
  return Math.min(contract.target, Math.max(0, Number(state.story.cooperativeContracts?.submitted?.[contract.key] ?? 0)));
}

function cooperativeContractComplete(contract = cooperativeContractForDay()) {
  return cooperativeContractSubmitted(contract) >= contract.target;
}

function cooperativeContractClaimed(contract = cooperativeContractForDay()) {
  return state.story.cooperativeContracts?.claimedKeys?.includes(contract.key) === true;
}

function cooperativeContractRewardText(contract = cooperativeContractForDay()) {
  const seedText = Object.entries(contract.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  return [`+${contract.rewardGold}g`, seedText].filter(Boolean).join("，");
}

function completedCooperativeContractCount() {
  return state.story.cooperativeContracts?.claimedKeys?.length ?? 0;
}

function cooperativeExpansionEnabled() {
  return state.story.secondYearPlan === "cooperative";
}

function ensureCooperativeExpansionStart(includeCurrentContract = false) {
  if (!cooperativeExpansionEnabled()) return;
  if (Number.isFinite(state.story.cooperativeExpansionStartCount)) return;
  const currentCount = completedCooperativeContractCount();
  state.story.cooperativeExpansionStartCount = includeCurrentContract ? Math.max(0, currentCount - 1) : currentCount;
}

function cooperativeExpansionProgress() {
  ensureCooperativeExpansionStart();
  const start = Math.max(0, Number(state.story.cooperativeExpansionStartCount ?? completedCooperativeContractCount()));
  return Math.max(0, completedCooperativeContractCount() - start);
}

function cooperativeContractOrderIndex(key) {
  const match = String(key ?? "").match(/^y(\d+)-t(\d+)$/);
  if (!match) return null;
  return (Number(match[1]) - 1) * SOLAR_TERMS_PER_YEAR + Number(match[2]);
}

function cooperativeExpansionDividendText(tierCount = 1) {
  const parts = [];
  if (COOPERATIVE_EXPANSION.dividendGold > 0) parts.push(`+${COOPERATIVE_EXPANSION.dividendGold * tierCount}g`);
  const seedText = Object.entries(COOPERATIVE_EXPANSION.dividendSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count * tierCount} ${cropDef(cropId).seedName}`)
    .join("、");
  if (seedText) parts.push(seedText);
  const buildText = Object.entries(COOPERATIVE_EXPANSION.dividendBuild ?? {})
    .filter(([, count]) => count > 0)
    .map(([itemId, count]) => `${count * tierCount} ${buildableDef(itemId).name}`)
    .join("、");
  if (buildText) parts.push(buildText);
  return parts.join("，") || "无";
}

function grantCooperativeExpansionDividends(progress) {
  const earnedTier = Math.floor(progress / COOPERATIVE_EXPANSION.dividendEveryContracts);
  if (earnedTier <= 0) return "";
  const claimed = new Set(state.story.cooperativeExpansionDividendClaimedTiers ?? []);
  const newTiers = [];
  for (let tier = 1; tier <= earnedTier; tier += 1) {
    if (!claimed.has(tier)) newTiers.push(tier);
  }
  if (newTiers.length === 0) return "";

  for (const tier of newTiers) claimed.add(tier);
  state.story.cooperativeExpansionDividendClaimedTiers = [...claimed].sort((a, b) => a - b);
  state.inventory.gold += COOPERATIVE_EXPANSION.dividendGold * newTiers.length;
  for (const [cropId, count] of Object.entries(COOPERATIVE_EXPANSION.dividendSeeds ?? {})) addSeedCount(cropId, count * newTiers.length);
  for (const [itemId, count] of Object.entries(COOPERATIVE_EXPANSION.dividendBuild ?? {})) {
    if (BUILDABLE_ITEMS[itemId]) state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + count * newTiers.length;
  }
  const text = `合作社扩张分红：${cooperativeExpansionDividendText(newTiers.length)}。`;
  addLog(text);
  return text;
}

function recordCooperativeExpansionContract(contract) {
  if (!cooperativeExpansionEnabled()) return "";
  ensureCooperativeExpansionStart(true);
  const currentIndex = cooperativeContractOrderIndex(contract.key);
  const lastIndex = cooperativeContractOrderIndex(state.story.cooperativeExpansionLastContractKey);
  const nextStreak = currentIndex !== null && lastIndex !== null && currentIndex === lastIndex + 1 ? state.story.cooperativeExpansionStreak + 1 : 1;
  state.story.cooperativeExpansionLastContractKey = contract.key;
  state.story.cooperativeExpansionStreak = nextStreak;
  state.story.cooperativeExpansionBestStreak = Math.max(state.story.cooperativeExpansionBestStreak ?? 0, nextStreak);
  const progress = cooperativeExpansionProgress();
  const dividendText = grantCooperativeExpansionDividends(progress);
  const streakText = `合作社扩张进度 ${progress}/${COOPERATIVE_EXPANSION.dividendEveryContracts}，连续供货 ${state.story.cooperativeExpansionStreak} 张。`;
  return dividendText ? `${streakText}\n${dividendText}` : streakText;
}

function completeCooperativeRepair(repaired) {
  if (state.story.cooperativeRepaired) return "";
  state.story.cooperativeRepaired = true;
  addLog("合作社窗口修复完成，可以提交入社样品。");
  addScreenEffect("quest", "合作社窗口");
  return `合作社窗口修复完成。\n\n${repaired.name}已经重新开放。合作社需要先看到稳定样品：提交 ${COOPERATIVE_TRIAL.cropTarget} 个任意作物和 ${COOPERATIVE_TRIAL.goodTarget} 个任意加工品，就能登记第一年试运行名册。`;
}

function completeCooperativeTrial() {
  if (!cooperativeTrialComplete() || state.story.cooperativeJoined) return "";
  state.story.cooperativeJoined = true;
  let rewardText = "";
  if (!state.story.cooperativeRewardClaimed) {
    state.story.cooperativeRewardClaimed = true;
    state.inventory.gold += COOPERATIVE_TRIAL.rewardGold;
    for (const [cropId, count] of Object.entries(COOPERATIVE_TRIAL.rewardSeeds)) addSeedCount(cropId, count);
    rewardText = `入社奖励：${cooperativeRewardText()}。`;
    addLog(`合作社入社奖励：${cooperativeRewardText()}。`);
  }
  addLog("合作社样品通过，已加入第一年试运行名册。");
  addScreenEffect("quest", "加入合作社");
  playSound("quest");
  return `合作社样品通过。\n\n村里确认农场可以同时供应原料和加工品，你已经加入第一年试运行名册。后续可以继续做批量订单、复购记录和年终评价。${rewardText ? `\n\n${rewardText}` : ""}`;
}

function grantCooperativeContractReward(contract = cooperativeContractForDay()) {
  if (!state.story.cooperativeJoined || !cooperativeContractComplete(contract) || cooperativeContractClaimed(contract)) return "";
  state.story.cooperativeContracts.claimedKeys.push(contract.key);
  state.inventory.gold += contract.rewardGold;
  for (const [cropId, count] of Object.entries(contract.rewardSeeds ?? {})) addSeedCount(cropId, count);
  const rewardText = cooperativeContractRewardText(contract);
  const expansionText = recordCooperativeExpansionContract(contract);
  addLog(`${contract.title}完成奖励：${rewardText}。`);
  addScreenEffect("quest", "合作社合同");
  playSound("quest");
  return `${contract.title}完成，奖励 ${rewardText}。${expansionText ? `\n${expansionText}` : "下一张合同会在下一个节气自动刷新。"}`;
}

function tourismCropSubmittedCount() {
  return Math.min(TOURISM_ORDER.cropTarget, Math.max(0, Number(state.story.tourismCropSubmitted ?? 0)));
}

function tourismGoodSubmittedCount() {
  return Math.min(TOURISM_ORDER.goodTarget, Math.max(0, Number(state.story.tourismGoodSubmitted ?? 0)));
}

function tourismScoreReady() {
  return farmScoreTotal() >= TOURISM_ORDER.scoreTarget;
}

function tourismOrderComplete() {
  return (
    tourismScoreReady() &&
    tourismCropSubmittedCount() >= TOURISM_ORDER.cropTarget &&
    tourismGoodSubmittedCount() >= TOURISM_ORDER.goodTarget
  );
}

function tourismRewardText() {
  const parts = [];
  if (TOURISM_ORDER.rewardGold > 0) parts.push(`+${TOURISM_ORDER.rewardGold}g`);
  const seedText = Object.entries(TOURISM_ORDER.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  if (seedText) parts.push(seedText);
  const buildText = Object.entries(TOURISM_ORDER.rewardBuild ?? {})
    .filter(([, count]) => count > 0)
    .map(([itemId, count]) => `${count} ${buildableDef(itemId).name}`)
    .join("、");
  if (buildText) parts.push(buildText);
  return parts.join("，") || "无";
}

function completeTourismRepair(repaired) {
  if (state.story.tourismRepaired) return "";
  state.story.tourismRepaired = true;
  addLog("游客服务亭修复完成，可以承接第一批游客订单。");
  addScreenEffect("quest", "游客服务");
  return `游客服务亭修复完成。\n\n${repaired.name}已经重新开放。先准备 ${TOURISM_ORDER.cropTarget} 个任意作物、${TOURISM_ORDER.goodTarget} 个任意加工品，并把农场评价提升到 ${TOURISM_ORDER.scoreTarget} 分，就能接待第一批游客。`;
}

function completeTourismOrder() {
  if (!tourismOrderComplete() || state.story.tourismFirstOrderCompleted) return "";
  state.story.tourismFirstOrderCompleted = true;
  if (!state.story.tourismRewardClaimed) {
    state.story.tourismRewardClaimed = true;
    state.inventory.gold += TOURISM_ORDER.rewardGold;
    for (const [cropId, count] of Object.entries(TOURISM_ORDER.rewardSeeds ?? {})) addSeedCount(cropId, count);
    for (const [itemId, count] of Object.entries(TOURISM_ORDER.rewardBuild ?? {})) {
      if (BUILDABLE_ITEMS[itemId]) state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + count;
    }
  }
  addLog(`第一批游客订单完成，奖励 ${tourismRewardText()}。`);
  addScreenEffect("quest", "游客订单");
  playSound("quest");
  return `第一批游客订单完成。\n\n游客带走了农场试吃礼篮，也留下了第一批口碑。奖励 ${tourismRewardText()}。后续可以扩展游客团、纪念品和评价复访。`;
}

function brandInputGoodIds() {
  return PROCESSED_GOOD_IDS.filter((goodId) => goodId !== BRAND_PACK_GOOD_ID);
}

function totalBrandInputGoodCount() {
  return brandInputGoodIds().reduce((sum, goodId) => sum + (state.inventory.goods[goodId] ?? 0), 0);
}

function brandRewardText() {
  const parts = [];
  if (BRAND_PACKAGING.rewardGold > 0) parts.push(`+${BRAND_PACKAGING.rewardGold}g`);
  const seedText = Object.entries(BRAND_PACKAGING.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  if (seedText) parts.push(seedText);
  const buildText = Object.entries(BRAND_PACKAGING.rewardBuild ?? {})
    .filter(([, count]) => count > 0)
    .map(([itemId, count]) => `${count} ${buildableDef(itemId).name}`)
    .join("、");
  if (buildText) parts.push(buildText);
  return parts.join("，") || "无";
}

function completeBrandRepair(repaired) {
  if (state.story.brandRepaired) return "";
  state.story.brandRepaired = true;
  addLog("品牌包装台修复完成，可以制作品牌礼盒。");
  addScreenEffect("quest", "品牌包装");
  return `品牌包装台修复完成。\n\n${repaired.name}已经重新开放。现在可以消耗 ${BRAND_PACKAGING.cropInputCount} 个任意作物和 ${BRAND_PACKAGING.goodInputCount} 个普通加工品，制作高价值的${processedGoodDef(BRAND_PACK_GOOD_ID).name}。礼盒可以直接卖给商店，也可以投入出货箱统一结算。`;
}

function grantFirstBrandShipmentReward() {
  if (!state.story.brandFirstShipmentSettled || state.story.brandFirstShipmentRewardClaimed) return "";
  state.story.brandFirstShipmentRewardClaimed = true;
  state.inventory.gold += BRAND_PACKAGING.rewardGold;
  for (const [cropId, count] of Object.entries(BRAND_PACKAGING.rewardSeeds ?? {})) addSeedCount(cropId, count);
  for (const [itemId, count] of Object.entries(BRAND_PACKAGING.rewardBuild ?? {})) {
    if (BUILDABLE_ITEMS[itemId]) state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + count;
  }
  addLog(`第一批品牌礼盒出货奖励：${brandRewardText()}。`);
  addScreenEffect("quest", "品牌出货");
  playSound("quest");
  return `第一批品牌礼盒完成出货，奖励 ${brandRewardText()}。品牌路线已经跑通“原料 -> 加工 -> 包装 -> 高价值出货”的基础闭环。`;
}

function irrigationZoneContains(tile) {
  const zone = IRRIGATION_PROJECT.zone;
  return tile.x >= zone.x && tile.y >= zone.y && tile.x < zone.x + zone.w && tile.y < zone.y + zone.h;
}

function irrigationRewardText() {
  const seedText = Object.entries(IRRIGATION_PROJECT.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  return [`水壶容量 +${IRRIGATION_PROJECT.capacityBonus}`, seedText].filter(Boolean).join("，");
}

function wateringCanCapacityForStory(story = state.story, abilities = state.abilities) {
  return (
    WATERING_CAN_CAPACITY +
    (story?.irrigationFirstProjectCompleted ? IRRIGATION_PROJECT.capacityBonus : 0) +
    Math.max(0, Number(abilities?.wateringCanBonus ?? 0))
  );
}

function applyIrrigationProjectMapChanges() {
  const map = maps.farm;
  if (!map) return;
  const zone = IRRIGATION_PROJECT.zone;
  rect(map.layers.ground, zone.x, zone.y - 1, zone.w, 1, TILE.path);
  rect(map.layers.ground, zone.x - 1, zone.y, 1, Math.min(zone.h, 9), TILE.path);
  rect(map.layers.collision, zone.x, zone.y - 1, zone.w, 1, 0);
  rect(map.layers.collision, zone.x - 1, zone.y, 1, Math.min(zone.h, 9), 0);
  if (map.layers.ground[22]?.[22] !== undefined) map.layers.ground[22][22] = TILE.floor;
  if (map.layers.collision[22]?.[22] !== undefined) map.layers.collision[22][22] = 0;
}

function completeIrrigationRepair(repaired) {
  if (state.story.irrigationRepaired) return "";
  state.story.irrigationRepaired = true;
  applyIrrigationProjectMapChanges();
  addLog("水利水泵修复完成，可以启动第一段水渠工程。");
  addScreenEffect("quest", "水利工程");
  return `水利水泵修复完成。\n\n${repaired.name}已经重新接上水源。下一步投入 ${IRRIGATION_PROJECT.costGold}g 启动第一段水渠工程；完成后水壶容量会提高，睡觉后会自动浇灌农田核心区域。`;
}

function completeIrrigationProject() {
  if (!state.story.irrigationRepaired) return showIrrigationDialog("先修复旧水泵。");
  if (state.story.irrigationFirstProjectCompleted) return showIrrigationDialog("第一段水渠工程已经完成。");
  if (state.inventory.gold < IRRIGATION_PROJECT.costGold) {
    const message = `金币不足，需要 ${IRRIGATION_PROJECT.costGold}g。`;
    addLog(message);
    playSound("error");
    showIrrigationDialog(message);
    return false;
  }

  state.inventory.gold -= IRRIGATION_PROJECT.costGold;
  state.story.irrigationFirstProjectCompleted = true;
  state.story.waterQuality = Math.max(currentWaterQuality(), 2);
  state.story.irrigationRewardClaimed = true;
  for (const [cropId, count] of Object.entries(IRRIGATION_PROJECT.rewardSeeds ?? {})) addSeedCount(cropId, count);
  state.wateringCanWater = wateringCanCapacityForStory();
  applyIrrigationProjectMapChanges();
  updateAllHud();
  const message = `第一段水渠工程完成。${irrigationRewardText()}。`;
  addLog(message);
  addScreenEffect("quest", "水渠工程");
  addVisualEffect(playerTile(), "water", { duration: 1000 });
  playSound("quest");
  showIrrigationDialog(message);
  scheduleAutosave("水渠工程完成");
  return true;
}

function placedDecorationCount() {
  return placedBuildableEntries().filter((entry) => entry.def.category === "decorations").length;
}

function irrigationZoneCropCount() {
  return state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj)).length;
}

function secondYearRouteFacilityStepDef(planId = state.story.secondYearPlan) {
  const goalId = routeFacilityGoalId(planId);
  if (!goalId) return null;
  const def = communityFacilityDef(goalId);
  return {
    id: "facilityUpgrade2",
    title: `${def.name}强化二`,
    detail: () => `${villageFacilityLevel(goalId)}/${COMMUNITY_FACILITY_MAX_LEVEL} · ${villageFacilityNextRequirementText(goalId)}`,
    reward: "对应路线、地图变化和土地庙回顾都会记录这座成熟设施。",
    isDone: () => routeFacilityUpgradeComplete(planId),
  };
}

function secondYearRouteStepDefs(planId = state.story.secondYearPlan) {
  const steps = SECOND_YEAR_ROUTE_STEPS[planId] ?? [];
  const facilityStep = secondYearRouteFacilityStepDef(planId);
  return facilityStep ? [...steps, facilityStep] : steps;
}

function routeStepDetail(step) {
  return typeof step.detail === "function" ? step.detail() : step.detail ?? "";
}

function secondYearRouteProgress(planId = state.story.secondYearPlan) {
  const steps = secondYearRouteStepDefs(planId);
  const doneSteps = steps.filter((step) => step.isDone());
  return {
    planId,
    done: doneSteps.length,
    total: steps.length,
    next: steps.find((step) => !step.isDone()) ?? null,
    steps,
  };
}

function secondYearRouteProgressText(planId = state.story.secondYearPlan) {
  const progress = secondYearRouteProgress(planId);
  if (progress.total <= 0) return "0/0";
  return `${progress.done}/${progress.total}`;
}

function currentRouteMilestoneComplete() {
  const progress = secondYearRouteProgress();
  return progress.total > 0 && progress.done >= progress.total;
}

function landShrineFinalReady() {
  return (
    state.story.chapterOneCompleted &&
    state.story.mountainResourceVisited &&
    state.story.springFairVisited &&
    state.story.springSampleBundleCompleted &&
    state.story.marketPrepCompleted &&
    state.story.communityOrdersCompleted &&
    state.story.ecommerceTrialShipped &&
    state.story.processingRepaired &&
    state.story.cooperativeJoined &&
    completedVillageIssueGoalCount() >= VILLAGE_ISSUE_GOAL_IDS.length &&
    state.story.viewedYearEnd &&
    Boolean(state.story.secondYearPlan) &&
    routeFacilityUpgradeComplete() &&
    currentRouteMilestoneComplete()
  );
}

function landShrineCurrentHint() {
  if (landShrineFinalReady()) return "你已经把这一轮能做的事做到了头。现在可以问我，为什么我知道这些。";
  if (state.story.firstFieldHoed <= 0) return "地若荒久，第一锄不要急着求收成。";
  if (state.story.firstFieldPlanted <= 0) return "种子落下去之前，地只是在等人承认它还有用。";
  if (!state.story.firstShipmentSettled) return "菜要走出去，村口的路才会重新有人踩。";
  if (!state.story.villageFeedbackSeen) return "卖出去的第一筐菜，会比你先到村里。";
  if (!state.story.chapterOneCompleted) return "铺子不开，不是没人想买，是没人敢先相信。";
  if (!state.story.mountainResourceVisited) return "山里旧路不是给你迷路的，是让你知道修复也要石料、木料和铁件。";
  if (!state.story.springFairVisited) return `惊蛰前后有春集，春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天去村庄摊位，早豆试种包会帮你补上样本和夏季资金。`;
  if (!state.story.springSampleBundleCompleted) return "样本不急在同一个春天补齐。哪一年把它交上去，村里都会记得这一季究竟长出了什么。";
  if (!state.story.marketPrepCompleted) return "一户人的田，撑不起一条街；街上有人等第一张桌子。";
  if (!state.story.communityOrdersCompleted) return "菜篮和试吃不是大买卖，却能让人知道你每天都还在。";
  if (!state.story.ecommerceTrialShipped) return "货去得远，先要分得清、包得住、发得出。";
  if (!state.story.processingRepaired) return "一只旧桶不认生人，只认稳定的原料。";
  if (!state.story.cooperativeJoined) return "散户的菜容易散，合在账本里才像一条河。";
  if (completedVillageIssueGoalCount() < VILLAGE_ISSUE_GOAL_IDS.length) return "村情记录板上还有没点亮的名字。土地不会只记产量，也记谁被照看过、哪条水又清起来。";
  if (!state.story.viewedYearEnd) return "四季走完，才知道这片地留下了什么。";
  if (!state.story.secondYearPlan) return "路不会替人选。合作、游客、水渠、招牌，各有各的代价。";
  if (!routeFacilityUpgradeComplete()) {
    const def = routeFacilityGoalDef();
    return `第二年路线还缺一座成熟设施。先把${def?.name ?? "推荐设施"}推进到强化二，路才算真正落在村里。`;
  }
  if (!currentRouteMilestoneComplete()) {
    const progress = secondYearRouteProgress();
    const next = progress.next;
    return `${secondYearPlanDef()?.name ?? "第二年路线"}还没走稳。下一步：${next?.title ?? "完成当前路线目标"}。`;
  }
  if (state.story.secondYearPlan === "cooperative") return "合社不是把人绑在一起，是让每家少怕一点风雨。";
  if (state.story.secondYearPlan === "tourism") return "外人来看风景，本地人看的是年景。";
  if (state.story.secondYearPlan === "brand") return "换了名字的作物，还是从同一片泥里长出来。";
  if (state.story.secondYearPlan === "irrigation") return "水走通了，人就会以为自己第一次想到这件事。";
  return "山风吹过旧瓦，像有人把很久以前的话又说了一遍。";
}

function landShrineProgressText() {
  const done = [
    state.story.firstShipmentSettled,
    state.story.chapterOneCompleted,
    state.story.mountainResourceVisited,
    state.story.springFairVisited,
    state.story.springSampleBundleCompleted,
    state.story.marketPrepCompleted,
    state.story.communityOrdersCompleted,
    state.story.ecommerceTrialShipped,
    state.story.processingRepaired,
    state.story.cooperativeJoined,
    completedVillageIssueGoalCount() >= VILLAGE_ISSUE_GOAL_IDS.length,
    state.story.viewedYearEnd,
    Boolean(state.story.secondYearPlan),
    routeFacilityUpgradeComplete(),
    currentRouteMilestoneComplete(),
  ].filter(Boolean).length;
  return `一周目回响：${done}/15`;
}

function landShrineMissingCategories() {
  const missing = [];
  const springMilestones = [
    state.story.firstShipmentSettled,
    state.story.chapterOneCompleted,
    state.story.mountainResourceVisited,
    state.story.springFairVisited,
    state.story.springSampleBundleCompleted,
  ];
  if (springMilestones.some((done) => !done)) {
    missing.push({
      title: "春季与样本档案",
      progress: `${springMilestones.filter(Boolean).length}/${springMilestones.length}`,
      action: "补第一次出货、杂货铺、山里采集、春集或样本箱。",
    });
  }
  if (!state.story.marketPrepCompleted || !state.story.communityOrdersCompleted) {
    missing.push({
      title: "夏季集市",
      progress: `${[state.story.marketPrepCompleted, state.story.communityOrdersCompleted].filter(Boolean).length}/2`,
      action: "完成村民任务、木匠公告牌、安心菜篮和茶铺试吃。",
    });
  }
  if (!state.story.ecommerceTrialShipped || !state.story.processingRepaired || !state.story.cooperativeJoined) {
    missing.push({
      title: "秋季产业",
      progress: `${[state.story.ecommerceTrialShipped, state.story.processingRepaired, state.story.cooperativeJoined].filter(Boolean).length}/3`,
      action: "完成电商试单、农场加工桶和合作社样品。",
    });
  }
  const nonWaterIssueIds = VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => goalId !== "waterCleanup");
  const completedNonWaterIssues = nonWaterIssueIds.filter((goalId) => villageIssueGoalComplete(goalId)).length;
  if (completedNonWaterIssues < nonWaterIssueIds.length) {
    missing.push({
      title: "村情目标",
      progress: `${completedNonWaterIssues}/${nonWaterIssueIds.length}`,
      action: "在村情记录板推进托管、青年、饭点、巡诊和冷链。",
    });
  }
  if (!villageIssueGoalComplete("waterCleanup")) {
    missing.push({
      title: "水质修复",
      progress: `${currentWaterQuality()}/${WATER_QUALITY_MAX}`,
      action: "完成村塘清淤；水质越好，鱼类越多。",
    });
  }
  if (!state.story.viewedYearEnd) {
    missing.push({
      title: "冬季年终",
      progress: "0/1",
      action: "推进到大寒第五天后睡觉，查看第一年年度总结。",
    });
  }
  if (!state.story.secondYearPlan) {
    missing.push({
      title: "第二年方向",
      progress: "0/1",
      action: "年终会后选择合作社、旅游、水利或品牌路线。",
    });
  }
  if (state.story.secondYearPlan && !routeFacilityUpgradeComplete()) {
    const goalId = routeFacilityGoalId();
    const def = routeFacilityGoalDef();
    missing.push({
      title: "设施强化二",
      progress: goalId ? `${villageFacilityLevel(goalId)}/${COMMUNITY_FACILITY_MAX_LEVEL}` : "0/1",
      action: `把${def?.name ?? "对应设施"}推进到强化二；入口：${goalId ? villageFacilityEntryText(goalId) : "村情记录板"}。`,
    });
  }
  if (state.story.secondYearPlan && !currentRouteMilestoneComplete()) {
    const progress = secondYearRouteProgress();
    const next = progress.next;
    missing.push({
      title: "第二年路线",
      progress: `${progress.done}/${progress.total}`,
      action: `继续“${secondYearPlanDef()?.name ?? "当前路线"}”：${next?.title ?? "路线起步目标"}。`,
    });
  }
  return missing;
}

function landShrineMissingText(item) {
  if (!item) return landShrineCurrentHint();
  if (typeof item === "string") return item;
  return `${item.title} ${item.progress}：${item.action}`;
}

function showLandShrineFinalDialog() {
  state.story.landShrineFinalRevealed = true;
  state.story.waterQuality = WATER_QUALITY_MAX;
  updateAllHud();
  addLog("土地庙说出了旧事。");
  playSound("quest");
  scheduleAutosave("土地庙最终问答");
  showPagedDialog("旧土地庙", [
    "你问它：为什么你会知道这些？",
    `它先让你回看这一年：${oneYearReviewLines().join(" / ")}`,
    "土地庙没有立刻回答。风从山路上过，像翻旧账本。",
    "它说：我不知道未来。我只是见过太多遍过去。",
    "一代人回来开荒，一代人修路，一代人把粮食卖远，一代人又重新问：这片地还能不能养活人。",
    "也有人没有离开：孩子在广场等，老人守着灶台，年轻人把车票夹在账本里。你修的不是一串功能，是这些人每天要过的日子。",
    "名字换了，屋子塌了又修，集市散了又聚。可人在土地上讨生活的故事，总是一遍一遍回来。",
    "你不是第一个，也不会是最后一个。但这一轮，是你亲手种出来的。下一轮的人，会从你修好的灯下开始。",
  ]);
}

function showLandShrineDialog() {
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const hint = document.createElement("p");
  hint.textContent = landShrineCurrentHint();
  panel.append(hint);

  const progress = document.createElement("p");
  progress.className = "dialog-note";
  progress.textContent = landShrineProgressText();
  panel.append(progress);

  const objective = currentIncompleteStoryObjective();
  const targetLine = storyTargetLine(currentStoryTargetInfo(objective));
  if (targetLine) {
    const target = document.createElement("p");
    target.className = "dialog-note";
    target.textContent = `当前推荐：${objective?.label ?? "继续主线"}。${targetLine}`;
    panel.append(target);
  }

  const missing = landShrineMissingCategories();
  if (missing.length > 0) {
    const section = document.createElement("section");
    section.className = "shop-section";
    const title = document.createElement("h3");
    title.textContent = "还缺什么";
    section.append(title);
    for (const line of missing) {
      const item = document.createElement("p");
      item.className = "dialog-note";
      item.textContent = landShrineMissingText(line);
      section.append(item);
    }
    panel.append(section);
  }

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(createShopButton("查看一周目回顾", false, () => showPagedDialog("一周目回顾", oneYearReviewLines())));
  if (landShrineFinalReady()) {
    actions.append(
      createShopButton(
        state.story.landShrineFinalRevealed ? "再听一遍旧事" : "问它为什么知道这些",
        false,
        () => showLandShrineFinalDialog(),
      ),
    );
  } else if (state.story.landShrineFinalRevealed) {
    actions.append(createShopButton("再听一遍旧事", false, () => showLandShrineFinalDialog()));
  }
  panel.append(actions);

  showDialog("旧土地庙", panel);
}

function beginTestSkip(label) {
  cancelAutosave();
  debug.testSkipActive = true;
  if (editor.enabled) {
    ui.editorToggle.checked = false;
    setEditorEnabled(false);
  }
  if (state.build.placing) setBuildPlacement(false);
  closeDialog();
  keys.clear();
  state.timeMinutes = DAY_START_MINUTES;
  state.energy = maxEnergy();
  state.selectedTool = "hand";
  state.wateringCanWater = wateringCanCapacityForStory();
  state.weather = WEATHER[state.weather] ? state.weather : "sunny";
  state.story.villageIssueGoals = normalizeVillageIssueGoals(state.story.villageIssueGoals);
  addLog(`测试跳过：准备进入${label}。`);
}

function finishTestSkip(label, mapId, tileX, tileY, facing = "down") {
  state.tomorrowWeather = nextWeatherForDay(state.day + 1);
  state.dailyOrder = createDailyOrder(state.day);
  normalizeQuestState();
  syncAbilityRewardsFromCompletedQuests();
  state.energy = maxEnergy();
  state.wateringCanWater = wateringCanCapacityForStory();
  ensureVillageAccess();
  ensureMountainAccess();
  ensureMapIdentityDetails();
  ensureDirectionSigns();
  ensureMarketSetup();
  ensureStableMarketSetup();
  ensureTourismSetup();
  ensureBrandSetup();
  ensureIrrigationSetup();
  ensureVillageIssueGoalFacilities();
  forceRepairUnlockedRuinsForTest();
  state.mapId = maps[mapId] ? mapId : "farm";
  state.player.x = tileX * TILE_SIZE + TILE_SIZE / 2;
  state.player.y = tileY * TILE_SIZE + TILE_SIZE / 2;
  state.player.facing = facing;
  interaction.warpCooldown = 0.45;
  ensurePlayerCanMove("测试跳过脱困");
  addVisualEffect(playerTile(), "quest", { color: "#d8c17a", duration: 900 });
  addScreenEffect("quest", label);
  addLog(`测试跳过：已进入${label}。`);
  setSaveStatus("测试跳过：当前状态未自动保存");
  updateAllHud();
}

function setTestQuestCompleted(questId) {
  const quest = state.quests[questId];
  if (!quest) return;
  quest.status = "completed";
  quest.progress = quest.target;
}

function grantMinimumSeedCounts(counts) {
  for (const [cropId, count] of Object.entries(counts)) {
    state.inventory.seeds[cropId] = Math.max(state.inventory.seeds[cropId] ?? 0, count);
  }
}

function grantMinimumCropCounts(counts) {
  for (const [cropId, count] of Object.entries(counts)) {
    state.inventory.crops[cropId] = Math.max(state.inventory.crops[cropId] ?? 0, count);
    if (count > 0) state.collection.harvested[cropId] = true;
  }
}

function grantMinimumGoodCounts(counts) {
  for (const [goodId, count] of Object.entries(counts)) {
    state.inventory.goods[goodId] = Math.max(state.inventory.goods[goodId] ?? 0, count);
  }
}

function forceRepairUnlockedRuinsForTest() {
  for (const map of Object.values(maps)) {
    if (!Array.isArray(map.objects)) continue;
    map.objects = map.objects.map((object) => {
      if (object.type !== "ruin" || !featureUnlocked(object.featureId)) return object;
      return repairedObjectFromRuin(object) ?? object;
    });
  }
}

function skipToSpringCompleteTest() {
  beginTestSkip("春季完成节点");
  state.day = 30;
  Object.assign(state.story, {
    firstFieldHoed: Math.max(3, state.story.firstFieldHoed ?? 0),
    firstFieldPlanted: Math.max(3, state.story.firstFieldPlanted ?? 0),
    firstFieldWatered: Math.max(3, state.story.firstFieldWatered ?? 0),
    sleptAfterWatering: true,
    firstShipmentSettled: true,
    villageFeedbackSeen: true,
    firstFeedbackRewardClaimed: true,
    chapterOneCompleted: true,
    chapterOneRewardClaimed: true,
    mountainResourceVisited: true,
    springFairVisited: true,
    springSampleBundleCompleted: true,
    springSampleRewardClaimed: true,
  });
  state.inventory.gold = Math.max(state.inventory.gold ?? 0, 220);
  state.inventory.harvestedCrops = Math.max(state.inventory.harvestedCrops ?? 0, 6);
  grantMinimumSeedCounts({ radish: 6, wheat: 3, bokChoy: 2 });
  grantMinimumCropCounts({ radish: 3, bokChoy: 1, bean: 1 });
  addResources({ stone: 8, wood: 8, coal: 2, scrap: 2, copperOre: 3, wildGreens: 2 });
  state.abilities.unlockedSeeds.bean = true;
  setTestQuestCompleted("harvestForMira");
  state.collection.shipped.radish = true;
  finishTestSkip("春季完成节点", "village", 22, 17, "up");
}

function skipToSummerMarketTest() {
  beginTestSkip("夏季集市节点");
  state.day = 45;
  Object.assign(state.story, {
    firstFieldHoed: Math.max(6, state.story.firstFieldHoed ?? 0),
    firstFieldPlanted: Math.max(6, state.story.firstFieldPlanted ?? 0),
    firstFieldWatered: Math.max(6, state.story.firstFieldWatered ?? 0),
    sleptAfterWatering: true,
    firstShipmentSettled: true,
    villageFeedbackSeen: true,
    firstFeedbackRewardClaimed: true,
    chapterOneCompleted: true,
    chapterOneRewardClaimed: true,
    mountainResourceVisited: true,
    springFairVisited: true,
    springSampleBundleCompleted: true,
    springSampleRewardClaimed: true,
    marketPrepCompleted: true,
    marketPrepRewardClaimed: true,
  });
  state.inventory.gold = Math.max(state.inventory.gold ?? 0, 240);
  state.inventory.harvestedCrops = Math.max(state.inventory.harvestedCrops ?? 0, 10);
  grantMinimumSeedCounts({ radish: 6, wheat: 5, tomato: 3, bean: 2, bokChoy: 2 });
  grantMinimumCropCounts({ radish: 2, wheat: 2, bokChoy: 2 });
  setTestQuestCompleted("harvestForMira");
  setTestQuestCompleted("buySeedsForTheo");
  finishTestSkip("夏季集市节点", "village", 16, 15, "right");
}

function skipToAutumnProcessingTest() {
  beginTestSkip("秋季加工节点");
  state.day = 80;
  Object.assign(state.story, {
    firstFieldHoed: Math.max(9, state.story.firstFieldHoed ?? 0),
    firstFieldPlanted: Math.max(9, state.story.firstFieldPlanted ?? 0),
    firstFieldWatered: Math.max(9, state.story.firstFieldWatered ?? 0),
    sleptAfterWatering: true,
    firstShipmentSettled: true,
    villageFeedbackSeen: true,
    firstFeedbackRewardClaimed: true,
    chapterOneCompleted: true,
    chapterOneRewardClaimed: true,
    mountainResourceVisited: true,
    springFairVisited: true,
    springSampleBundleCompleted: true,
    springSampleRewardClaimed: true,
    marketPrepCompleted: true,
    marketPrepRewardClaimed: true,
    basketOrderDelivered: Math.max(COMMUNITY_ORDERS.basketPoint.target, state.story.basketOrderDelivered ?? 0),
    basketOrderRewardClaimed: true,
    tastingOrderDelivered: Math.max(COMMUNITY_ORDERS.tastingTable.target, state.story.tastingOrderDelivered ?? 0),
    tastingOrderRewardClaimed: true,
    communityOrdersCompleted: true,
    communityOrdersRewardClaimed: true,
    ecommerceDeskSeen: true,
    ecommerceTrialSubmitted: ECOMMERCE_TRIAL_ORDER.target,
    ecommerceTrialPacked: true,
    ecommerceTrialShipped: true,
    ecommerceTrialRewardClaimed: true,
    processingRepaired: true,
    firstMachineStarted: true,
    firstProcessedGoodCollected: true,
  });
  state.inventory.gold = Math.max(state.inventory.gold ?? 0, 360);
  state.inventory.harvestedCrops = Math.max(state.inventory.harvestedCrops ?? 0, 22);
  grantMinimumSeedCounts({ corn: 4, sweetPotato: 4, spinach: 3, bokChoy: 4 });
  grantMinimumCropCounts({ corn: 3, sweetPotato: 3, bokChoy: 3 });
  grantMinimumGoodCounts({ preservedJar: 1, driedVeg: 1 });
  setTestQuestCompleted("harvestForMira");
  setTestQuestCompleted("buySeedsForTheo");
  setTestQuestCompleted("shipCropsForLina");
  finishTestSkip("秋季加工节点", "farm", 21, 21, "right");
}

function skipToWinterYearEndTest() {
  beginTestSkip("冬季年终节点");
  state.day = YEAR_LENGTH;
  Object.assign(state.story, {
    firstFieldHoed: Math.max(12, state.story.firstFieldHoed ?? 0),
    firstFieldPlanted: Math.max(12, state.story.firstFieldPlanted ?? 0),
    firstFieldWatered: Math.max(12, state.story.firstFieldWatered ?? 0),
    sleptAfterWatering: true,
    firstShipmentSettled: true,
    villageFeedbackSeen: true,
    firstFeedbackRewardClaimed: true,
    chapterOneCompleted: true,
    chapterOneRewardClaimed: true,
    mountainResourceVisited: true,
    springFairVisited: true,
    springSampleBundleCompleted: true,
    springSampleRewardClaimed: true,
    marketPrepCompleted: true,
    marketPrepRewardClaimed: true,
    basketOrderDelivered: Math.max(COMMUNITY_ORDERS.basketPoint.target, state.story.basketOrderDelivered ?? 0),
    basketOrderRewardClaimed: true,
    tastingOrderDelivered: Math.max(COMMUNITY_ORDERS.tastingTable.target, state.story.tastingOrderDelivered ?? 0),
    tastingOrderRewardClaimed: true,
    communityOrdersCompleted: true,
    communityOrdersRewardClaimed: true,
    ecommerceDeskSeen: true,
    ecommerceTrialSubmitted: ECOMMERCE_TRIAL_ORDER.target,
    ecommerceTrialPacked: true,
    ecommerceTrialShipped: true,
    ecommerceTrialRewardClaimed: true,
    processingRepaired: true,
    firstMachineStarted: true,
    firstProcessedGoodCollected: true,
    firstProcessedShipmentSettled: true,
    firstProcessedShipmentRewardClaimed: true,
    cooperativeRepaired: true,
    cooperativeCropSubmitted: Math.max(COOPERATIVE_TRIAL.cropTarget, state.story.cooperativeCropSubmitted ?? 0),
    cooperativeGoodSubmitted: Math.max(COOPERATIVE_TRIAL.goodTarget, state.story.cooperativeGoodSubmitted ?? 0),
    cooperativeJoined: true,
    cooperativeRewardClaimed: true,
    viewedYearEnd: false,
    secondYearPlan: null,
  });
  state.story.villageIssueGoals.childCare = true;
  state.story.villageIssueGoals.elderCare = true;
  state.inventory.gold = Math.max(state.inventory.gold ?? 0, 420);
  state.inventory.harvestedCrops = Math.max(state.inventory.harvestedCrops ?? 0, 34);
  grantMinimumSeedCounts({ bokChoy: 6, spinach: 6, sweetPotato: 3 });
  grantMinimumCropCounts({ bokChoy: 4, spinach: 3, sweetPotato: 2 });
  grantMinimumGoodCounts({ preservedJar: 2, driedVeg: 2 });
  for (const questId of ["harvestForMira", "buySeedsForTheo", "shipCropsForLina", "deliverRadishForMira"]) {
    setTestQuestCompleted(questId);
  }
  state.story.cooperativeContracts = {
    submitted: { "y1-t20": 3, "y1-t21": 3 },
    claimedKeys: ["y1-t20", "y1-t21"],
  };
  finishTestSkip("冬季年终节点", "farm", 19, 24, "up");
}

function runSelectedTestSkip() {
  const target = ui.testSkipSelect?.value ?? "shrine";
  if (target === "spring") {
    skipToSpringCompleteTest();
    return;
  }
  if (target === "summer") {
    skipToSummerMarketTest();
    return;
  }
  if (target === "autumn") {
    skipToAutumnProcessingTest();
    return;
  }
  if (target === "winter") {
    skipToWinterYearEndTest();
    return;
  }
  skipToLandShrineTest();
}

function skipToLandShrineTest() {
  cancelAutosave();
  debug.testSkipActive = true;
  if (editor.enabled) {
    ui.editorToggle.checked = false;
    setEditorEnabled(false);
  }
  if (state.build.placing) setBuildPlacement(false);

  state.day = Math.max(state.day, YEAR_LENGTH + 1);
  state.timeMinutes = DAY_START_MINUTES;
  state.energy = maxEnergy();
  state.selectedTool = "hand";
  state.selectedSeed = DEFAULT_CROP_ID;
  state.weather = WEATHER[state.weather] ? state.weather : "sunny";
  state.tomorrowWeather = nextWeatherForDay(state.day + 1);
  state.dailyOrder = createDailyOrder(state.day);

  Object.assign(state.story, {
    firstFieldHoed: Math.max(1, state.story.firstFieldHoed ?? 0),
    firstFieldPlanted: Math.max(1, state.story.firstFieldPlanted ?? 0),
    firstFieldWatered: Math.max(1, state.story.firstFieldWatered ?? 0),
    sleptAfterWatering: true,
    firstShipmentSettled: true,
    villageFeedbackSeen: true,
    firstFeedbackRewardClaimed: true,
    chapterOneCompleted: true,
    chapterOneRewardClaimed: true,
    mountainResourceVisited: true,
    springFairVisited: true,
    springSampleBundleCompleted: true,
    springSampleRewardClaimed: true,
    marketPrepCompleted: true,
    marketPrepRewardClaimed: true,
    basketOrderDelivered: Math.max(COMMUNITY_ORDERS.basketPoint.target, state.story.basketOrderDelivered ?? 0),
    basketOrderRewardClaimed: true,
    tastingOrderDelivered: Math.max(COMMUNITY_ORDERS.tastingTable.target, state.story.tastingOrderDelivered ?? 0),
    tastingOrderRewardClaimed: true,
    communityOrdersCompleted: true,
    communityOrdersRewardClaimed: true,
    ecommerceDeskSeen: true,
    ecommerceTrialSubmitted: ECOMMERCE_TRIAL_ORDER.target,
    ecommerceTrialPacked: true,
    ecommerceTrialShipped: true,
    ecommerceTrialRewardClaimed: true,
    processingRepaired: true,
    firstMachineStarted: true,
    firstProcessedGoodCollected: true,
    firstProcessedShipmentSettled: true,
    firstProcessedShipmentRewardClaimed: true,
    cooperativeRepaired: true,
    cooperativeCropSubmitted: Math.max(COOPERATIVE_TRIAL.cropTarget, state.story.cooperativeCropSubmitted ?? 0),
    cooperativeGoodSubmitted: Math.max(COOPERATIVE_TRIAL.goodTarget, state.story.cooperativeGoodSubmitted ?? 0),
    cooperativeJoined: true,
    cooperativeRewardClaimed: true,
    viewedYearEnd: true,
    yearEndRewardClaimed: true,
    secondYearPlan: "cooperative",
    secondYearPlanRewardClaimed: true,
    cooperativeExpansionStartCount: 0,
    cooperativeExpansionLastContractKey: "y2-t3",
    cooperativeExpansionStreak: Math.max(3, state.story.cooperativeExpansionStreak ?? 0),
    cooperativeExpansionBestStreak: Math.max(3, state.story.cooperativeExpansionBestStreak ?? 0),
    cooperativeExpansionDividendClaimedTiers: [1],
    villageIssueGoals: createDefaultVillageIssueGoals(),
  });
  for (const goalId of VILLAGE_ISSUE_GOAL_IDS) state.story.villageIssueGoals[goalId] = true;
  state.story.cooperativeContracts = {
    submitted: { "y2-t1": 4, "y2-t2": 5, "y2-t3": 4 },
    claimedKeys: ["y2-t1", "y2-t2", "y2-t3"],
  };

  state.inventory.gold = Math.max(state.inventory.gold ?? 0, 500);
  state.inventory.harvestedCrops = Math.max(state.inventory.harvestedCrops ?? 0, 24);
  for (const cropId of CROP_IDS) {
    state.inventory.seeds[cropId] = Math.max(state.inventory.seeds[cropId] ?? 0, 8);
    state.inventory.crops[cropId] = Math.max(state.inventory.crops[cropId] ?? 0, 4);
    state.collection.harvested[cropId] = true;
    state.collection.shipped[cropId] = true;
  }
  for (const goodId of PROCESSED_GOOD_IDS) {
    state.inventory.goods[goodId] = Math.max(state.inventory.goods[goodId] ?? 0, goodId === BRAND_PACK_GOOD_ID ? 1 : 2);
  }
  for (const itemId of BUILDABLE_IDS) state.build.inventory[itemId] = Math.max(state.build.inventory[itemId] ?? 0, 2);
  for (const quest of Object.values(state.quests)) {
    quest.status = "completed";
    quest.progress = quest.target;
  }
  syncAbilityRewardsFromCompletedQuests();
  state.energy = maxEnergy();
  state.wateringCanWater = wateringCanCapacityForStory();
  state.mailbox.readIds = MAILBOX_LETTERS.map((letter) => letter.id);
  state.mailbox.claimedIds = MAILBOX_LETTERS.map((letter) => letter.id);

  ensureVillageAccess();
  ensureMountainAccess();
  ensureMapIdentityDetails();
  ensureDirectionSigns();
  ensureMarketSetup();
  ensureStableMarketSetup();
  ensureTourismSetup();
  ensureBrandSetup();
  ensureIrrigationSetup();
  ensureVillageIssueGoalFacilities();
  forceRepairUnlockedRuinsForTest();
  enforceEarlyRuinState();
  state.mapId = "mountain";
  state.player.x = 21 * TILE_SIZE + TILE_SIZE / 2;
  state.player.y = 10 * TILE_SIZE + TILE_SIZE / 2;
  state.player.facing = "up";
  interaction.warpCooldown = 0.45;
  closeDialog();
  ensurePlayerCanMove("测试跳过脱困");
  addVisualEffect({ x: 21, y: 9 }, "quest", { color: "#d8c17a", duration: 1100 });
  addScreenEffect("quest", "土地庙测试");
  addLog("测试跳过：已进入土地庙最终问答状态。");
  setSaveStatus("测试跳过：当前状态未自动保存");
  updateAllHud();
  showLandShrineDialog();
}

function completeCommunityOrders() {
  if (state.story.communityOrdersCompleted || completedCommunityOrderCount() < 2) return "";
  state.story.communityOrdersCompleted = true;
  ensureStableMarketSetup();
  let rewardText = "";
  if (!state.story.communityOrdersRewardClaimed) {
    state.story.communityOrdersRewardClaimed = true;
    state.inventory.gold += 80;
    addSeedCount("tomato", 2);
    rewardText = "阶段奖励：获得 80g 和 2 包番茄种子。";
    addLog("社区订单阶段奖励：+80g，+2 番茄种子。");
  }
  addLog("社区订单完成，集市进入稳定运行。");
  addScreenEffect("quest", "集市稳定");
  return `社区订单完成。\n\n安心菜篮和茶铺试吃都跑通了，村口临时摊位升级为稳定集市。广场新增“电商助农角”，下一步可以开始做分拣、包装、快递和复购记录。${rewardText ? `\n\n${rewardText}` : ""}`;
}

function completedQuestCount() {
  return Object.values(state.quests ?? {}).filter((quest) => quest.status === "completed").length;
}

function hasFirstShipment() {
  return CROP_IDS.some((cropId) => state.collection?.shipped?.[cropId]) || totalCropCount(state.inventory?.shippedCrops) > 0;
}

function syncStoryProgressFromState() {
  const hasSettledShipmentRecord =
    state.day > 1 &&
    CROP_IDS.some((cropId) => state.collection?.shipped?.[cropId]) &&
    totalCropCount(state.inventory.shippedCrops) + totalGoodCount(state.inventory.shippedGoods) === 0;
  if (hasSettledShipmentRecord) state.story.firstShipmentSettled = true;
  if (state.inventory.harvestedCrops > 0 || state.day > 1) state.story.sleptAfterWatering = true;
  if (hasMapObject("shop", (_object, map) => map.id === "village")) {
    state.story.chapterOneCompleted = true;
    state.story.chapterOneRewardClaimed = true;
  }
  if (state.story.marketPrepCompleted) ensureMarketSetup();
  if (hasMapObject("upgradeBoard")) {
    state.story.marketPrepCompleted = true;
    state.story.marketPrepRewardClaimed = true;
    ensureMarketSetup();
  }
  if (completedCommunityOrderCount() >= 2) state.story.communityOrdersCompleted = true;
  if (state.story.communityOrdersCompleted) ensureStableMarketSetup();
  if (fixedProcessingFacilityReady()) state.story.processingRepaired = true;
  if (hasMapObject("cooperativeDesk", (_object, map) => map.id === "village")) state.story.cooperativeRepaired = true;
  if (hasMapObject("tourismDesk", (_object, map) => map.id === "village")) state.story.tourismRepaired = true;
  if (hasMapObject("brandDesk", (_object, map) => map.id === "village")) state.story.brandRepaired = true;
  if (hasMapObject("irrigationPump", (_object, map) => map.id === "farm")) state.story.irrigationRepaired = true;
  if (state.story.viewedYearEnd || state.story.secondYearPlan === "tourism") ensureTourismSetup();
  if (state.story.viewedYearEnd || state.story.secondYearPlan === "brand") ensureBrandSetup();
  if (state.story.viewedYearEnd || state.story.secondYearPlan === "irrigation") ensureIrrigationSetup();
  if (state.story.secondYearPlan === "cooperative") ensureCooperativeExpansionStart();
  if (state.story.irrigationFirstProjectCompleted) applyIrrigationProjectMapChanges();
  ensureVillageIssueGoalFacilities();
  if (ownedOrShippedGoodsCount() > 0) {
    state.story.firstMachineStarted = true;
    state.story.firstProcessedGoodCollected = true;
  }
  if ((state.inventory.goods[BRAND_PACK_GOOD_ID] ?? 0) > 0 || (state.inventory.shippedGoods[BRAND_PACK_GOOD_ID] ?? 0) > 0) {
    state.story.brandFirstPackCreated = true;
  }
  syncAbilityRewardsFromCompletedQuests();
}

function featureUnlocked(featureId) {
  if (!featureId) return true;
  if (featureId === "villageMarket") return state.story.firstShipmentSettled;
  if (featureId === "processing") return state.story.processingRepaired || state.story.ecommerceTrialShipped;
  if (featureId === "construction") return state.quests?.shipCropsForLina?.status === "completed";
  if (featureId === "cooperative") return state.story.cooperativeRepaired || state.story.firstProcessedShipmentSettled;
  if (featureId === "tourism") return state.story.tourismRepaired || state.story.secondYearPlan === "tourism";
  if (featureId === "brand") return state.story.brandRepaired || state.story.secondYearPlan === "brand";
  if (featureId === "irrigation") return state.story.irrigationRepaired || state.story.secondYearPlan === "irrigation";
  return false;
}

function featureRequirementText(featureId) {
  return FEATURE_DEFS[featureId]?.requirement ?? "这个功能会在后续主线中解锁。";
}

function ruinStatusText(ruin) {
  const feature = FEATURE_DEFS[ruin.featureId];
  const repairedName = ruin.repairedName ?? feature?.label ?? "后续设施";
  return `${ruin.name ?? "废墟"} · 未来修复为：${repairedName}\n解锁条件：${featureRequirementText(ruin.featureId)}\n${ruin.hint ?? "先推进主线，后续会回来修复这里。"}`;
}

function ruinShortLabel(ruin) {
  const labels = {
    villageMarket: "铺",
    construction: "木",
    processing: "加",
    cooperative: "社",
    tourism: "游",
    brand: "牌",
    irrigation: "水",
  };
  if (labels[ruin.featureId]) return labels[ruin.featureId];
  const typeLabels = {
    shop: "铺",
    upgradeBoard: "木",
    processor: "加",
    dryer: "晒",
    cooperativeDesk: "社",
    tourismDesk: "游",
    brandDesk: "牌",
    irrigationPump: "水",
  };
  return typeLabels[ruin.repairedType] ?? "墟";
}

function repairedObjectFromRuin(ruin) {
  const type = ruin.repairedType;
  if (!type) return null;
  const base = {
    type,
    x: ruin.x,
    y: ruin.y,
    name: String(ruin.repairedName ?? ruin.name ?? "已修复设施"),
  };
  if (typeof ruin.storyId === "string") base.storyId = ruin.storyId;
  if (type === "shop") return base;
  if (type === "upgradeBoard") return base;
  if (type === "shippingBin") return base;
  if (type === "well") return base;
  if (type === "kitchen") return base;
  if (type === "cooperativeDesk") return base;
  if (type === "tourismDesk") return base;
  if (type === "brandDesk") return base;
  if (type === "irrigationPump") return base;
  if (type === "processor" || type === "dryer") {
    return {
      ...base,
      machineId: String(ruin.machineId ?? `${state.mapId}:${ruin.x},${ruin.y}`),
    };
  }
  if (type === "sign") return { type, x: ruin.x, y: ruin.y, text: String(ruin.text ?? ruin.repairedName ?? "已修复。") };
  return null;
}

function repairRuin(ruin) {
  const featureId = ruin.featureId;
  const requirement = featureRequirementText(featureId);
  if (!featureUnlocked(featureId)) {
    showDialog(ruin.name ?? "废墟", ruinStatusText(ruin));
    addLog(`${ruin.name ?? "废墟"}暂未解锁：${requirement}`);
    playSound("error");
    return false;
  }

  const repaired = repairedObjectFromRuin(ruin);
  if (!repaired) {
    showDialog(ruin.name ?? "废墟", ruinStatusText(ruin));
    addLog(`${ruin.name ?? "废墟"}是后续章节内容。`);
    return false;
  }

  const map = currentMap();
  const index = map.objects.indexOf(ruin);
  if (index === -1) return false;
  map.objects[index] = repaired;
  if (isMachineBuildableObject(repaired)) {
    const machineId = machineIdForObject(repaired);
    if (!state.machines[machineId]) state.machines[machineId] = createMachineState(machineId);
  }
  const chapterText = state.mapId === "village" && repaired.type === "shop" ? completeChapterOne() : "";
  const marketText = repaired.type === "upgradeBoard" ? completeMarketPrep() : "";
  const processingText = featureId === "processing" ? completeProcessingRepair(repaired) : "";
  const cooperativeText = featureId === "cooperative" ? completeCooperativeRepair(repaired) : "";
  const tourismText = featureId === "tourism" ? completeTourismRepair(repaired) : "";
  const brandText = featureId === "brand" ? completeBrandRepair(repaired) : "";
  const irrigationText = featureId === "irrigation" ? completeIrrigationRepair(repaired) : "";
  const progressText = chapterText || marketText || processingText || cooperativeText || tourismText || brandText || irrigationText;
  const progressTitle = chapterText
    ? "第一章完成"
    : marketText
      ? "助农集市"
      : processingText
        ? "加工设施"
        : cooperativeText
          ? "合作社窗口"
          : tourismText
            ? "游客服务"
            : brandText
              ? "品牌包装"
              : irrigationText
                ? "水利工程"
                : "修复完成";
  updateAllHud();
  addLog(`已修复：${repaired.name}`);
  addVisualEffect({ x: repaired.x, y: repaired.y }, "quest", { color: "#e7b34d", duration: 1000 });
  playSound("quest");
  showDialog(progressTitle, progressText || `${repaired.name}已经可以使用。`);
  scheduleAutosave("修复废墟");
  return true;
}

function makeCropCounts(fill = 0) {
  return Object.fromEntries(CROP_IDS.map((cropId) => [cropId, fill]));
}

function makeGoodCounts(fill = 0) {
  return Object.fromEntries(PROCESSED_GOOD_IDS.map((goodId) => [goodId, fill]));
}

function makeResourceCounts(fill = 0) {
  return Object.fromEntries(RESOURCE_IDS.map((resourceId) => [resourceId, fill]));
}

function makeFishCounts(fill = 0) {
  return Object.fromEntries(FISH_IDS.map((fishId) => [fishId, fill]));
}

function normalizeCropCounts(value, fallbackRadish = 0) {
  const counts = makeCropCounts();
  if (typeof value === "number") {
    counts[DEFAULT_CROP_ID] = Math.max(0, value);
    return counts;
  }
  if (value && typeof value === "object") {
    for (const cropId of CROP_IDS) {
      counts[cropId] = Math.max(0, Number(value[cropId] ?? 0));
    }
    return counts;
  }
  counts[DEFAULT_CROP_ID] = Math.max(0, fallbackRadish);
  return counts;
}

function normalizeGoodCounts(value) {
  const counts = makeGoodCounts();
  if (value && typeof value === "object") {
    for (const goodId of PROCESSED_GOOD_IDS) {
      counts[goodId] = Math.max(0, Number(value[goodId] ?? 0));
    }
  }
  return counts;
}

function normalizeResourceCounts(value) {
  const counts = makeResourceCounts();
  if (value && typeof value === "object") {
    for (const resourceId of RESOURCE_IDS) {
      counts[resourceId] = Math.max(0, Number(value[resourceId] ?? 0));
    }
  }
  return counts;
}

function normalizeFishCounts(value) {
  const counts = makeFishCounts();
  if (typeof value === "number") {
    counts.crucian = Math.max(0, Math.floor(value));
    return counts;
  }
  if (value && typeof value === "object") {
    for (const fishId of FISH_IDS) {
      counts[fishId] = Math.max(0, Number(value[fishId] ?? 0));
    }
  }
  return counts;
}

function createMachineState(id) {
  return {
    id,
    recipeId: null,
    readyGoodId: null,
    remainingDays: 0,
  };
}

function createDefaultMachines() {
  return {};
}

function normalizeMachineState(value = {}, fallbackId = "machine") {
  const id = String(value.id ?? fallbackId);
  const readyGoodId = PROCESSED_GOOD_IDS.includes(value.readyGoodId) ? value.readyGoodId : null;
  const recipeId = readyGoodId ? null : PROCESSED_GOOD_IDS.includes(value.recipeId) ? value.recipeId : null;
  const remainingDays = recipeId ? Math.max(0, Math.floor(Number(value.remainingDays ?? MACHINE_PROCESSING_DAYS))) : 0;
  return {
    id,
    recipeId,
    readyGoodId,
    remainingDays,
  };
}

function normalizeMachines(value = {}) {
  const machines = createDefaultMachines();
  if (value && typeof value === "object") {
    for (const [machineId, machine] of Object.entries(value)) {
      machines[machineId] = normalizeMachineState(machine, machineId);
    }
  }
  return machines;
}

function makeBuildableCounts(fill = 0) {
  return Object.fromEntries(BUILDABLE_IDS.map((itemId) => [itemId, fill]));
}

function normalizeBuildableCounts(value) {
  const counts = makeBuildableCounts();
  if (value && typeof value === "object") {
    for (const itemId of BUILDABLE_IDS) {
      counts[itemId] = Math.max(0, Math.floor(Number(value[itemId] ?? 0)));
    }
  }
  return counts;
}

function createDefaultBuildState() {
  return {
    selectedItem: "processor",
    placing: false,
    hoverTile: null,
    nextId: 1,
    inventory: makeBuildableCounts(),
  };
}

function normalizeBuildState(value = {}) {
  value = value && typeof value === "object" ? value : {};
  return {
    selectedItem: BUILDABLE_ITEMS[value.selectedItem] ? value.selectedItem : "processor",
    placing: false,
    hoverTile: null,
    nextId: Math.max(1, Math.floor(Number(value.nextId ?? 1))),
    inventory: normalizeBuildableCounts(value.inventory),
  };
}

function buildableDef(itemId) {
  return BUILDABLE_ITEMS[itemId] ?? BUILDABLE_ITEMS.processor;
}

function buildableIdsForCategory(category) {
  return BUILDABLE_IDS.filter((itemId) => buildableDef(itemId).category === category);
}

function buildableShopTabForItem(itemId) {
  return buildableDef(itemId).category === "decorations" ? "decorations" : "facilities";
}

function buildableGroupLabel(itemId) {
  return buildableDef(itemId).category === "decorations" ? "装饰" : "设施";
}

function buildableRecommendedRegionId(itemId) {
  if (itemId === "processor" || itemId === "dryer") return "westProcessing";
  if (itemId === "gardenLamp" || itemId === "bench") return "starterField";
  if (itemId === "flowerBox" || itemId === "fence") return "southField";
  return "starterField";
}

function farmBuildRegionForTile(tile) {
  if (!tile) return null;
  return (
    Object.values(FARM_BUILD_REGIONS).find((region) => {
      const { x, y, w, h } = region.bounds;
      return tile.x >= x && tile.x < x + w && tile.y >= y && tile.y < y + h;
    }) ?? null
  );
}

function buildRegionUnlocked(region) {
  return !region || region.isUnlocked();
}

function buildRegionRecommendationText(itemId) {
  const region = FARM_BUILD_REGIONS[buildableRecommendedRegionId(itemId)];
  if (!region) return "推荐：农场空地。";
  return `推荐：${region.name}；用途：${region.use}`;
}

function buildMapAvailabilityText() {
  if (canBuildOnCurrentMap()) return "当前地图可放置";
  return "需回农场放置";
}

function buildRegionPlacementStatus(def, tile) {
  const region = farmBuildRegionForTile(tile);
  if (!region) return { ok: true, text: "农场空地" };
  if (!buildRegionUnlocked(region)) return { ok: false, text: `${region.name}未解锁` };
  return { ok: true, text: region.name };
}

function totalBuildableInventory(category = null) {
  return BUILDABLE_IDS.reduce((sum, itemId) => {
    const def = buildableDef(itemId);
    if (category && def.category !== category) return sum;
    return sum + (state.build.inventory[itemId] ?? 0);
  }, 0);
}

function buildableCategorySummary(category) {
  return buildableIdsForCategory(category)
    .map((itemId) => {
      const def = buildableDef(itemId);
      return `${def.name} ${state.build.inventory[itemId] ?? 0}`;
    })
    .join(" / ");
}

function totalCropCount(counts) {
  return CROP_IDS.reduce((sum, cropId) => sum + (counts?.[cropId] ?? 0), 0);
}

function totalGoodCount(counts) {
  return PROCESSED_GOOD_IDS.reduce((sum, goodId) => sum + (counts?.[goodId] ?? 0), 0);
}

function cropValue(counts) {
  return CROP_IDS.reduce((sum, cropId) => sum + (counts?.[cropId] ?? 0) * cropDef(cropId).sellPrice, 0);
}

function processedGoodDef(goodId) {
  return PROCESSING_RECIPES[goodId] ?? PROCESSING_RECIPES.radishSoup;
}

function recipeIdsForStation(stationId) {
  return PROCESSED_GOOD_IDS.filter((recipeId) => processedGoodDef(recipeId).stations?.includes(stationId));
}

function stationIdForObject(object) {
  if (object?.type === "dryer") return "dryer";
  if (object?.type === "processor") return "processor";
  return "kitchen";
}

function stationNameForObject(object) {
  if (object?.type === "dryer") return object.name ?? "晾晒架";
  if (object?.type === "processor") return object.name ?? "加工桶";
  return "厨房加工台";
}

function stationVerbForObject(object) {
  return object?.type === "dryer" ? "晾晒" : "加工";
}

function goodsValue(counts) {
  return PROCESSED_GOOD_IDS.reduce((sum, goodId) => sum + (counts?.[goodId] ?? 0) * processedGoodDef(goodId).sellPrice, 0);
}

function eventDayOfYear(event) {
  return event.solarTermIndex * DAYS_PER_SOLAR_TERM + event.dayOfTerm;
}

function quarterEveEvent(season) {
  return {
    id: `seasonEve-${season.id}`,
    dayOfSeason: season.length,
    title: "换季前夜",
    marker: "季",
    description: `明天进入${SEASONS[SEASON_IDS[(season.index + 1) % SEASON_IDS.length]].label}，适合检查种子和待出货作物。`,
  };
}

function calendarEventsForDay(day = state.day) {
  const season = seasonInfoForDay(day);
  const events = CALENDAR_EVENTS.filter((event) => eventDayOfYear(event) === season.dayOfYear);
  if (season.dayOfSeason === season.length) events.push(quarterEveEvent(season));
  return events;
}

function calendarEventForSeasonDay(dayOfSeason, seasonIndex = seasonInfoForDay().index) {
  const yearDay = seasonIndex * SEASON_LENGTH + dayOfSeason;
  const event = CALENDAR_EVENTS.find((item) => eventDayOfYear(item) === yearDay);
  if (event) return event;
  if (dayOfSeason === SEASON_LENGTH) {
    return quarterEveEvent({ ...SEASONS[SEASON_IDS[seasonIndex]], index: seasonIndex, length: SEASON_LENGTH });
  }
  return null;
}

function calendarEventForDay(day = state.day) {
  return calendarEventsForDay(day)[0] ?? null;
}

function festivalDefForEvent(eventOrId) {
  const eventId = typeof eventOrId === "string" ? eventOrId : eventOrId?.id;
  return Object.values(FESTIVAL_DEFS).find((festival) => festival.eventId === eventId) ?? null;
}

function currentFestivalDef(day = state.day) {
  for (const event of calendarEventsForDay(day)) {
    const festival = festivalDefForEvent(event);
    if (festival) return festival;
  }
  return null;
}

function festivalSummaryText(festival = currentFestivalDef()) {
  if (!festival) return "";
  return `${festival.title}：${festival.limitedShop}。今日重点：${festival.order}奖励：${festival.reward}`;
}

function eventLabel(event) {
  return event ? event.title : "今日无事件";
}

function shopDiscountForDay(day = state.day) {
  return calendarEventForDay(day)?.shopDiscount ?? 1;
}

function seedUnitPrice(cropId, day = state.day) {
  return Math.max(1, Math.round(cropDef(cropId).seedPrice * shopDiscountForDay(day)));
}

function shipmentMultiplierForDay(day = state.day) {
  return calendarEventForDay(day)?.shipmentMultiplier ?? 1;
}

function fishDef(fishId) {
  return FISH_TYPES[fishId] ?? FISH_TYPES.waterweed;
}

function fishValue(counts = makeFishCounts()) {
  return FISH_IDS.reduce((sum, fishId) => sum + (counts?.[fishId] ?? 0) * fishDef(fishId).sellPrice, 0);
}

function totalFishCount(counts = makeFishCounts()) {
  return FISH_IDS.reduce((sum, fishId) => sum + (counts?.[fishId] ?? 0), 0);
}

function shipmentIncomeValue(cropCounts, goodCounts = makeGoodCounts(), day = state.day, fishCounts = makeFishCounts()) {
  const baseValue = Math.round((cropValue(cropCounts) + goodsValue(goodCounts) + fishValue(fishCounts)) * shipmentMultiplierForDay(day));
  return effectiveSaleIncome(baseValue);
}

function cropCountSummary(counts) {
  const parts = CROP_IDS.filter((cropId) => (counts?.[cropId] ?? 0) > 0).map(
    (cropId) => `${cropDef(cropId).name} ${counts[cropId]}`,
  );
  return parts.length > 0 ? parts.join("、") : "无";
}

function goodsCountSummary(counts) {
  const parts = PROCESSED_GOOD_IDS.filter((goodId) => (counts?.[goodId] ?? 0) > 0).map(
    (goodId) => `${processedGoodDef(goodId).name} ${counts[goodId]}`,
  );
  return parts.length > 0 ? parts.join("、") : "无";
}

function fishCountSummary(counts) {
  const parts = FISH_IDS.filter((fishId) => (counts?.[fishId] ?? 0) > 0).map(
    (fishId) => `${fishDef(fishId).name} ${counts[fishId]}`,
  );
  return parts.length > 0 ? parts.join("、") : "无";
}

function cropDef(cropId) {
  return CROP_TYPES[cropId] ?? CROP_TYPES[DEFAULT_CROP_ID];
}

function seasonInfoForDay(day = state.day) {
  const safeDay = Math.max(1, Math.floor(day || 1));
  const zeroBased = safeDay - 1;
  const dayOfYear = (zeroBased % YEAR_LENGTH) + 1;
  const yearZero = dayOfYear - 1;
  const seasonIndex = Math.floor(yearZero / SEASON_LENGTH) % SEASON_IDS.length;
  const solarTermIndex = Math.floor(yearZero / DAYS_PER_SOLAR_TERM) % SOLAR_TERMS_PER_YEAR;
  const solarTerm = SOLAR_TERMS[solarTermIndex];
  const year = Math.floor(zeroBased / YEAR_LENGTH) + 1;
  const id = SEASON_IDS[seasonIndex];
  return {
    ...SEASONS[id],
    index: seasonIndex,
    year,
    dayOfYear,
    yearLength: YEAR_LENGTH,
    dayOfSeason: (yearZero % SEASON_LENGTH) + 1,
    length: SEASON_LENGTH,
    solarTerm,
    solarTermIndex,
    solarTermInSeason: (solarTermIndex % SOLAR_TERMS_PER_SEASON) + 1,
    dayOfTerm: (yearZero % DAYS_PER_SOLAR_TERM) + 1,
    termLength: DAYS_PER_SOLAR_TERM,
  };
}

function currentSeasonId() {
  return seasonInfoForDay().id;
}

function seasonLabel(seasonId) {
  return SEASONS[seasonId]?.label ?? seasonId;
}

function seasonFlowerColors(seasonId = currentSeasonId()) {
  return SEASON_FLOWER_COLORS[seasonId] ?? SEASON_FLOWER_COLORS.spring;
}

function minutesInCurrentDay() {
  return ((state.timeMinutes % 1440) + 1440) % 1440;
}

function isLampLitTime() {
  const minutes = minutesInCurrentDay();
  return minutes >= LAMP_LIGHT_START_MINUTES || minutes < DAY_START_MINUTES;
}

function lampGlowStrength() {
  return isLampLitTime() ? 1 : 0.38;
}

function timeOfDayLabel(minutes = state.timeMinutes) {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  if (minutes >= LATE_NIGHT_START_MINUTES || normalized < DAY_START_MINUTES) return "深夜";
  if (normalized >= NIGHT_START_MINUTES) return "夜晚";
  if (normalized >= EVENING_START_MINUTES) return "傍晚";
  if (normalized < 9 * 60) return "清晨";
  return "白天";
}

function timeOfDayOverlayAlpha() {
  const minutes = minutesInCurrentDay();
  let alpha = 0;
  if (minutes >= EVENING_START_MINUTES && minutes < NIGHT_START_MINUTES) {
    alpha = ((minutes - EVENING_START_MINUTES) / (NIGHT_START_MINUTES - EVENING_START_MINUTES)) * 0.26;
  } else if (minutes >= NIGHT_START_MINUTES) {
    alpha = 0.3 + Math.min(0.12, ((minutes - NIGHT_START_MINUTES) / (3 * 60)) * 0.12);
  } else if (minutes < DAY_START_MINUTES) {
    alpha = 0.42;
  } else if (minutes < 8 * 60) {
    alpha = ((8 * 60 - minutes) / (2 * 60)) * 0.12;
  }
  return state.mapId === "house" ? alpha * 0.45 : alpha;
}

function cropSeasonText(cropId) {
  return cropDef(cropId).seasons.map(seasonLabel).join(" / ");
}

function seasonCropSummary(seasonId = currentSeasonId()) {
  const crops = CROP_IDS.filter((cropId) => isCropInSeason(cropId, seasonId)).map((cropId) => cropDef(cropId).name);
  return crops.length > 0 ? crops.join("、") : "暂无";
}

function isCropInSeason(cropId, seasonId = currentSeasonId()) {
  return cropDef(cropId).seasons.includes(seasonId);
}

function isCropUnlocked(cropId) {
  const def = cropDef(cropId);
  return state.day >= def.unlockDay || seedManuallyUnlocked(def.id);
}

function isSeedAvailable(cropId) {
  return isCropUnlocked(cropId) && isCropInSeason(cropId);
}

function recommendedSeedIdsForSeason(seasonId = currentSeasonId()) {
  const recommendations = {
    spring: ["radish", "bokChoy", "bean"],
    summer: ["wheat", "tomato", "bean", "corn"],
    autumn: ["sweetPotato", "corn", "tomato", "wheat"],
    winter: ["spinach", "bokChoy", "wheat"],
  };
  return recommendations[seasonId] ?? [DEFAULT_CROP_ID];
}

function seedRecommendationText(cropId) {
  const def = cropDef(cropId);
  const profit = def.sellPrice - seedUnitPrice(def.id);
  const tags = [];
  if (recommendedSeedIdsForSeason().includes(def.id)) tags.push("推荐");
  if (def.growStages <= 2) tags.push("短周期");
  return `${def.growStages} 阶成长 · 售价 ${def.sellPrice}g · 预计单株差价 ${profit}g${tags.length > 0 ? ` · ${tags.join("/")}` : ""}`;
}

function seedShopUnavailableReason(cropId, cost = 0) {
  const def = cropDef(cropId);
  if (!isCropUnlocked(def.id)) return `${def.seedName}第 ${def.unlockDay} 天解锁。`;
  if (!isCropInSeason(def.id)) return `${def.seedName}适合${cropSeasonText(def.id)}播种。`;
  if (cost > 0 && state.inventory.gold < cost) return `金币不足，还差 ${cost - state.inventory.gold}g。`;
  return "";
}

function cropUnlockText(cropId) {
  const def = cropDef(cropId);
  if (!isCropUnlocked(def.id)) return `第 ${def.unlockDay} 天解锁`;
  return isCropInSeason(def.id) ? `当季：${cropSeasonText(def.id)}` : `非本季：${cropSeasonText(def.id)}`;
}

function createDefaultInventory() {
  return {
    gold: 70,
    seeds: { ...makeCropCounts(), [DEFAULT_CROP_ID]: 12, bokChoy: 3 },
    crops: makeCropCounts(),
    shippedCrops: makeCropCounts(),
    goods: makeGoodCounts(),
    shippedGoods: makeGoodCounts(),
    fish: makeFishCounts(),
    shippedFish: makeFishCounts(),
    resources: makeResourceCounts(),
    harvestedCrops: 0,
  };
}

function normalizeInventory(value = {}) {
  const defaults = createDefaultInventory();
  const inventory = {
    gold: Number.isFinite(value.gold) ? value.gold : defaults.gold,
    seeds: normalizeCropCounts(value.seeds, defaults.seeds[DEFAULT_CROP_ID]),
    crops: normalizeCropCounts(value.crops),
    shippedCrops: normalizeCropCounts(value.shippedCrops),
    goods: normalizeGoodCounts(value.goods),
    shippedGoods: normalizeGoodCounts(value.shippedGoods),
    fish: normalizeFishCounts(value.fish),
    shippedFish: normalizeFishCounts(value.shippedFish),
    resources: normalizeResourceCounts(value.resources),
    harvestedCrops: Math.max(0, Number(value.harvestedCrops ?? 0)),
  };
  inventory.harvestedCrops = Math.max(
    inventory.harvestedCrops,
    totalCropCount(inventory.crops) + totalCropCount(inventory.shippedCrops),
  );
  return inventory;
}

function resourceDef(resourceId) {
  return RESOURCE_TYPES[resourceId] ?? RESOURCE_TYPES.stone;
}

function normalizeWaterQuality(value) {
  const level = Math.floor(Number(value ?? 0));
  return Math.max(0, Math.min(WATER_QUALITY_MAX, Number.isFinite(level) ? level : 0));
}

function currentWaterQuality() {
  let level = normalizeWaterQuality(state.story?.waterQuality);
  if (villageIssueGoalComplete("waterCleanup")) level = Math.max(level, 1);
  if (state.story?.villageFacilityLevels) level = Math.max(level, villageFacilityLevel("waterCleanup"));
  if (state.story?.irrigationFirstProjectCompleted) level = Math.max(level, 2);
  if (state.story?.landShrineFinalRevealed) level = Math.max(level, 3);
  return normalizeWaterQuality(level);
}

function waterQualityDef(level = currentWaterQuality()) {
  return WATER_QUALITY_LEVELS[normalizeWaterQuality(level)] ?? WATER_QUALITY_LEVELS[0];
}

function waterQualityLabel(level = currentWaterQuality()) {
  const def = waterQualityDef(level);
  return `${def.name} Lv.${def.id}`;
}

function resourceCountSummary(counts = state.inventory.resources) {
  const parts = RESOURCE_IDS.filter((resourceId) => (counts?.[resourceId] ?? 0) > 0).map(
    (resourceId) => `${resourceDef(resourceId).name} ${counts[resourceId]}`,
  );
  return parts.join("、") || "无";
}

function resourceCostText(costs = {}) {
  return RESOURCE_IDS.filter((resourceId) => (costs?.[resourceId] ?? 0) > 0)
    .map((resourceId) => `${costs[resourceId]} ${resourceDef(resourceId).name}`)
    .join(" + ") || "无";
}

function cropCostText(costs = {}) {
  return CROP_IDS.filter((cropId) => (costs?.[cropId] ?? 0) > 0)
    .map((cropId) => `${costs[cropId]} ${cropDef(cropId).name}`)
    .join(" + ") || "无";
}

function hasResourceCosts(costs = {}) {
  return RESOURCE_IDS.every((resourceId) => (state.inventory.resources[resourceId] ?? 0) >= (costs[resourceId] ?? 0));
}

function hasCropCosts(costs = {}) {
  return CROP_IDS.every((cropId) => (state.inventory.crops[cropId] ?? 0) >= (costs[cropId] ?? 0));
}

function addResources(counts = {}) {
  for (const [resourceId, count] of Object.entries(counts)) {
    if (!RESOURCE_TYPES[resourceId] || count <= 0) continue;
    state.inventory.resources[resourceId] = (state.inventory.resources[resourceId] ?? 0) + count;
  }
}

function consumeResources(counts = {}) {
  if (!hasResourceCosts(counts)) return false;
  for (const [resourceId, count] of Object.entries(counts)) {
    if (!RESOURCE_TYPES[resourceId] || count <= 0) continue;
    state.inventory.resources[resourceId] -= count;
  }
  return true;
}

function consumeCropsByType(counts = {}) {
  if (!hasCropCosts(counts)) return false;
  for (const [cropId, count] of Object.entries(counts)) {
    if (!CROP_TYPES[cropId] || count <= 0) continue;
    state.inventory.crops[cropId] -= count;
  }
  return true;
}

function seedRewardText(seeds = {}) {
  return CROP_IDS.filter((cropId) => (seeds?.[cropId] ?? 0) > 0)
    .map((cropId) => `${seeds[cropId]} ${cropDef(cropId).seedName}`)
    .join("、") || "无";
}

function resourceRewardText(rewards = {}) {
  return RESOURCE_IDS.filter((resourceId) => (rewards?.[resourceId] ?? 0) > 0)
    .map((resourceId) => `${rewards[resourceId]} ${resourceDef(resourceId).name}`)
    .join("、") || "无";
}

function resourceNodeDef(objectOrId) {
  const resourceId = typeof objectOrId === "string" ? objectOrId : objectOrId?.resourceId;
  return RESOURCE_NODE_TYPES[resourceId] ?? RESOURCE_NODE_TYPES.quarry;
}

function normalizeResourceNodeDailyState(object) {
  if (!object) return;
  if (object.lastGatherDay !== state.day) {
    object.lastGatherDay = state.day;
    object.gatheredToday = 0;
  }
  object.gatheredToday = Math.max(0, Math.floor(Number(object.gatheredToday ?? 0)));
}

function resourceNodeGatheredToday(object) {
  normalizeResourceNodeDailyState(object);
  return Math.max(0, Number(object?.gatheredToday ?? 0));
}

function resourceNodeRemaining(object) {
  const def = resourceNodeDef(object);
  return Math.max(0, def.maxPerDay - resourceNodeGatheredToday(object));
}

function resourceNodeBlockedReason(object) {
  if (state.mapId !== "mountain") return "山里资源点只能在山地图采集。";
  if (state.day < 11) return "山路还没清出来，第 11 天后再来采集资源。";
  const def = resourceNodeDef(object);
  if (resourceNodeRemaining(object) <= 0) return "今天已经采完，睡一觉后会恢复。";
  if (state.energy < def.energy) return `体力不足，需要 ${def.energy}。`;
  return "";
}

function springFairIsOpen() {
  const season = seasonInfoForDay();
  return season.id === "spring" && season.dayOfSeason >= SPRING_FAIR_START_DAY && season.dayOfSeason <= SPRING_FAIR_END_DAY;
}

function springFairWindowResolved() {
  const season = seasonInfoForDay();
  return state.story.springFairVisited || season.year > 1 || season.id !== "spring" || season.dayOfSeason > SPRING_FAIR_END_DAY;
}

function springSampleBundleUnlocked() {
  return state.day >= 21 || state.story.springSampleBundleCompleted;
}

function springFairItemRewardText(item) {
  const parts = [];
  if (item.seeds) parts.push(seedRewardText(item.seeds));
  if (item.resources) parts.push(resourceRewardText(item.resources));
  if (item.unlockSeeds) parts.push(`解锁 ${item.unlockSeeds.map((cropId) => cropDef(cropId).seedName).join("、")}`);
  return parts.filter((part) => part && part !== "无").join(" / ") || "补给";
}

function springFairItemBlockedReason(item) {
  if (!springFairIsOpen()) return `春集只在春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天开放。`;
  if (state.inventory.gold < item.gold) return `金币不足，需要 ${item.gold}g。`;
  return "";
}

function springOpeningGuide() {
  const season = seasonInfoForDay();
  if (season.year !== 1 || season.id !== "spring" || season.dayOfSeason > 15) return "";
  if (season.dayOfSeason <= 4) {
    return "春季开局：先锄出小片土地，种下初始萝卜和小白菜，每天浇水，体力低时及时睡觉。";
  }
  if (season.dayOfSeason <= 10) {
    return "雨水阶段：第一次收获后先出货并去村庄看反馈，尽早修复杂货铺、接村民支线。";
  }
  if (season.dayOfSeason <= 12) {
    return "惊蛰前段：山里资源点已开放，优先去林缘采山野菜、去旧采石点拿石料，样本包后面会用到。";
  }
  return "春集窗口：第 13-15 天去村庄春集种子摊，优先买早豆试种包和工具材料。";
}

function springSampleReserveWarning(cropId) {
  return "";
}

function springSampleInventoryGuidance(cropId, count = state.inventory.crops[cropId] ?? 0) {
  return "";
}

const SPRING_SAMPLE_SOURCE_TEXT = {
  radish: "农场开垦后播种萝卜，成熟后用镰刀收获",
  bokChoy: "村庄种子铺补小白菜种子，农场播种收获",
  bean: `春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天去春集买早豆试种包`,
  wildGreens: "第 11 天后去山里林缘采集点采集",
  stone: "第 11 天后去山里旧采石点采集",
};

function springSampleRequirementDetails() {
  if (!springSampleBundleUnlocked()) {
    return [{ label: "开放时间", owned: 0, required: 1, missing: 1, source: "清明后开放（春季第 21 天）" }];
  }
  const cropDetails = Object.entries(SPRING_SAMPLE_BUNDLE.cropCosts).map(([cropId, required]) => {
    const owned = state.inventory.crops[cropId] ?? 0;
    return {
      label: cropDef(cropId).name,
      owned,
      required,
      missing: Math.max(0, required - owned),
      source: SPRING_SAMPLE_SOURCE_TEXT[cropId] ?? "农场种植并收获后保留",
    };
  });
  const resourceDetails = Object.entries(SPRING_SAMPLE_BUNDLE.resourceCosts).map(([resourceId, required]) => {
    const owned = state.inventory.resources[resourceId] ?? 0;
    return {
      label: resourceDef(resourceId).name,
      owned,
      required,
      missing: Math.max(0, required - owned),
      source: SPRING_SAMPLE_SOURCE_TEXT[resourceId] ?? "山里资源点采集",
    };
  });
  return [...cropDetails, ...resourceDetails];
}

function springSampleBundleMissingDetailText() {
  const missing = springSampleRequirementDetails().filter((item) => item.missing > 0);
  return missing
    .map((item) => `${item.label} ${item.owned}/${item.required}，去：${item.source}`)
    .join("；");
}

function springSampleBundleMissingText() {
  if (!springSampleBundleUnlocked()) return "清明后开放（春季第 21 天）";
  const missing = [];
  for (const [cropId, count] of Object.entries(SPRING_SAMPLE_BUNDLE.cropCosts)) {
    const owned = state.inventory.crops[cropId] ?? 0;
    if (owned < count) missing.push(`${cropDef(cropId).name} ${owned}/${count}`);
  }
  for (const [resourceId, count] of Object.entries(SPRING_SAMPLE_BUNDLE.resourceCosts)) {
    const owned = state.inventory.resources[resourceId] ?? 0;
    if (owned < count) missing.push(`${resourceDef(resourceId).name} ${owned}/${count}`);
  }
  return missing.length > 0 ? missing.join("、") : "";
}

function springSampleResourceMissingText() {
  const missing = Object.entries(SPRING_SAMPLE_BUNDLE.resourceCosts)
    .map(([resourceId, required]) => {
      const owned = state.inventory.resources[resourceId] ?? 0;
      return owned < required ? `${resourceDef(resourceId).name} ${owned}/${required}` : "";
    })
    .filter(Boolean);
  return missing.join("、");
}

function resourceNodeTodaySummary() {
  const mountain = maps.mountain;
  if (!mountain?.objects) return "";
  return mountain.objects
    .filter((object) => object.type === "resourceNode")
    .map((object) => {
      const def = resourceNodeDef(object);
      return `${def.name} ${resourceNodeRemaining(object)}/${def.maxPerDay}`;
    })
    .join("；");
}

function springEndChecklistItems() {
  return [
    { label: "第一次出货", done: state.story.firstShipmentSettled, hint: "农场出货箱投入作物后睡觉结算" },
    { label: "杂货铺修复", done: state.story.chapterOneCompleted, hint: "村庄停业杂货铺" },
    { label: "山里资源", done: state.story.mountainResourceVisited, hint: "北侧山路资源点" },
    { label: "夏季资金 200g", done: state.inventory.gold >= 200, hint: `当前 ${state.inventory.gold}/200g，可出货或卖作物补足` },
  ];
}

function springEndChecklistText() {
  const items = springEndChecklistItems();
  const missing = items.filter((item) => !item.done);
  if (missing.length === 0) return "春季月底检查全部完成，可以准备进入夏季稳定供货。";
  return `春季月底检查还缺：${missing.map((item) => `${item.label}（${item.hint}）`).join("；")}`;
}

function summerStartupGuideText() {
  return "夏季启动：先去村庄种子铺补小麦/番茄/豆子/玉米，保持每日浇水和出货；主线转向稳定供货、社区订单和村民支线。";
}

function springSampleBundleReady() {
  return springSampleBundleUnlocked() && hasCropCosts(SPRING_SAMPLE_BUNDLE.cropCosts) && hasResourceCosts(SPRING_SAMPLE_BUNDLE.resourceCosts);
}

function springSampleBundleRewardText() {
  const parts = [`${SPRING_SAMPLE_BUNDLE.rewardGold}g`];
  const seeds = seedRewardText(SPRING_SAMPLE_BUNDLE.rewardSeeds);
  const resources = resourceRewardText(SPRING_SAMPLE_BUNDLE.rewardResources);
  if (seeds !== "无") parts.push(seeds);
  if (resources !== "无") parts.push(resources);
  return parts.join(" / ");
}

function resourceToolUpgradeCost(toolId) {
  if (!RESOURCE_TOOL_UPGRADES[toolId]) return null;
  const nextLevel = toolLevel(toolId) + 1;
  if (nextLevel > TOOL_MAX_LEVEL) return null;
  const cost = RESOURCE_TOOL_UPGRADES[toolId].costs[nextLevel];
  return cost ? { level: nextLevel, gold: cost.gold ?? 0, resources: cost.resources ?? {} } : null;
}

function resourceToolUpgradeCostText(toolId) {
  const cost = resourceToolUpgradeCost(toolId);
  if (!cost) return "已满级";
  const parts = [];
  if (cost.gold > 0) parts.push(`${cost.gold}g`);
  const resources = resourceCostText(cost.resources);
  if (resources !== "无") parts.push(resources);
  return parts.join(" + ") || "免费";
}

function resourceToolUpgradeBlockedReason(toolId) {
  const cost = resourceToolUpgradeCost(toolId);
  if (!cost) return "已经达到最高等级。";
  const missing = [];
  if (state.inventory.gold < cost.gold) missing.push(`金币 ${state.inventory.gold}/${cost.gold}`);
  for (const [resourceId, count] of Object.entries(cost.resources)) {
    const owned = state.inventory.resources[resourceId] ?? 0;
    if (owned < count) missing.push(`${resourceDef(resourceId).name} ${owned}/${count}`);
  }
  return missing.join("、");
}

function makeToolLevels(defaultLevel = 1) {
  return Object.fromEntries(TOOL_UPGRADE_IDS.map((toolId) => [toolId, defaultLevel]));
}

function createDefaultAbilities() {
  return {
    maxEnergyBonus: 0,
    wateringCanBonus: 0,
    toolLevels: makeToolLevels(1),
    unlockedSeeds: makeCropCounts(false),
  };
}

function normalizeToolLevel(value, fallback = 1) {
  const level = Math.floor(Number(value ?? fallback));
  return Math.max(1, Math.min(TOOL_MAX_LEVEL, Number.isFinite(level) ? level : fallback));
}

function normalizeToolLevels(value = {}) {
  value = value && typeof value === "object" ? value : {};
  return Object.fromEntries(TOOL_UPGRADE_IDS.map((toolId) => [toolId, normalizeToolLevel(value[toolId])]));
}

function normalizeSeedUnlocks(value = {}) {
  value = value && typeof value === "object" ? value : {};
  return Object.fromEntries(CROP_IDS.map((cropId) => [cropId, value[cropId] === true]));
}

function normalizeAbilities(value = {}) {
  value = value && typeof value === "object" ? value : {};
  return {
    maxEnergyBonus: Math.max(0, Math.floor(Number(value.maxEnergyBonus ?? 0))),
    wateringCanBonus: Math.max(0, Math.floor(Number(value.wateringCanBonus ?? 0))),
    toolLevels: normalizeToolLevels(value.toolLevels),
    unlockedSeeds: normalizeSeedUnlocks(value.unlockedSeeds),
  };
}

function maxEnergy(abilities = state.abilities) {
  return MAX_ENERGY + Math.max(0, Number(abilities?.maxEnergyBonus ?? 0)) + facilityEnergyBonus();
}

function normalizeSeedUnlockRewards(value = []) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((cropId) => cropDef(cropId).id))];
}

function normalizeToolUpgradeRewards(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const rewards = {};
  for (const toolId of TOOL_UPGRADE_IDS) {
    const amount = Math.max(0, Math.floor(Number(value[toolId] ?? 0)));
    if (amount > 0) rewards[toolId] = amount;
  }
  return rewards;
}

function toolLevel(toolId, abilities = state.abilities) {
  return normalizeToolLevel(abilities?.toolLevels?.[toolId]);
}

function toolNameWithLevel(toolId) {
  const tool = toolsById[toolId] ?? toolsById.hand;
  if (!TOOL_UPGRADE_IDS.includes(tool.id)) return tool.name;
  return `${tool.name} Lv.${toolLevel(tool.id)}`;
}

function seedManuallyUnlocked(cropId, abilities = state.abilities) {
  return abilities?.unlockedSeeds?.[cropDef(cropId).id] === true;
}

function toolCostFor(toolId) {
  const base = TOOL_COSTS[toolId];
  if (!base) return null;
  const level = toolLevel(toolId);
  const energyDiscount = level >= 2 ? 1 : 0;
  return {
    energy: Math.max(1, base.energy - energyDiscount),
    minutes: Math.max(5, base.minutes - (level - 1) * 2),
  };
}

function ensureCurrentEnergyWithinMax() {
  state.energy = Math.max(0, Math.min(maxEnergy(), state.energy));
}

function ensureCurrentWaterWithinCapacity() {
  state.wateringCanWater = Math.max(0, Math.min(wateringCanCapacityForStory(), state.wateringCanWater));
}

function normalizeWateringCanWater(value, story = state.story, abilities = state.abilities) {
  const capacity = wateringCanCapacityForStory(story, abilities);
  if (!Number.isFinite(value)) return capacity;
  return Math.max(0, Math.min(capacity, Math.floor(value)));
}

function createDefaultMailState() {
  return { readIds: [], claimedIds: [] };
}

function normalizeMailState(value = {}) {
  const knownIds = new Set(MAILBOX_LETTERS.map((letter) => letter.id));
  const readIds = Array.isArray(value.readIds) ? value.readIds.filter((id) => knownIds.has(id)) : [];
  const claimedIds = Array.isArray(value.claimedIds) ? value.claimedIds.filter((id) => knownIds.has(id)) : [];
  return {
    readIds: [...new Set(readIds)],
    claimedIds: [...new Set(claimedIds)],
  };
}

function createDefaultCollection() {
  return {
    harvested: makeCropCounts(false),
    shipped: makeCropCounts(false),
  };
}

function normalizeCollection(value = {}) {
  const collection = createDefaultCollection();
  const harvested = value.harvested && typeof value.harvested === "object" ? value.harvested : {};
  const shipped = value.shipped && typeof value.shipped === "object" ? value.shipped : {};
  for (const cropId of CROP_IDS) {
    collection.harvested[cropId] = harvested[cropId] === true;
    collection.shipped[cropId] = shipped[cropId] === true;
  }
  return collection;
}

function createDefaultAchievements() {
  return { unlockedIds: [] };
}

function normalizeAchievements(value = {}) {
  const knownIds = new Set(ACHIEVEMENTS.map((achievement) => achievement.id));
  const unlockedIds = Array.isArray(value.unlockedIds) ? value.unlockedIds.filter((id) => knownIds.has(id)) : [];
  return { unlockedIds: [...new Set(unlockedIds)] };
}

function createDefaultSettings() {
  return {
    soundEnabled: true,
    effectsEnabled: true,
  };
}

function normalizeSettings(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const defaults = createDefaultSettings();
  return {
    soundEnabled: value.soundEnabled === undefined ? defaults.soundEnabled : value.soundEnabled !== false,
    effectsEnabled: value.effectsEnabled === undefined ? defaults.effectsEnabled : value.effectsEnabled !== false,
  };
}

function inferCollectionFromInventory() {
  for (const cropId of CROP_IDS) {
    if ((state.inventory.crops[cropId] ?? 0) > 0 || (state.inventory.shippedCrops[cropId] ?? 0) > 0) {
      state.collection.harvested[cropId] = true;
    }
    if ((state.inventory.shippedCrops[cropId] ?? 0) > 0) {
      state.collection.shipped[cropId] = true;
    }
  }
}

function addSeedCount(cropId, count) {
  const id = cropDef(cropId).id;
  state.inventory.seeds[id] = (state.inventory.seeds[id] ?? 0) + count;
}

function addCropCount(cropId, count) {
  const id = cropDef(cropId).id;
  state.inventory.crops[id] = (state.inventory.crops[id] ?? 0) + count;
}

function addGoodCount(goodId, count) {
  const id = processedGoodDef(goodId).id;
  state.inventory.goods[id] = (state.inventory.goods[id] ?? 0) + count;
}

function addFishCount(fishId, count) {
  const id = fishDef(fishId).id;
  state.inventory.fish[id] = (state.inventory.fish[id] ?? 0) + count;
}

function consumeAnyCrops(count) {
  if (totalCropCount(state.inventory.crops) < count) return false;
  let remaining = count;
  for (const cropId of CROP_IDS) {
    const take = Math.min(remaining, state.inventory.crops[cropId] ?? 0);
    state.inventory.crops[cropId] -= take;
    remaining -= take;
    if (remaining <= 0) return true;
  }
  return remaining <= 0;
}

function consumeAnyGoods(count) {
  if (totalGoodCount(state.inventory.goods) < count) return false;
  let remaining = count;
  for (const goodId of PROCESSED_GOOD_IDS) {
    const take = Math.min(remaining, state.inventory.goods[goodId] ?? 0);
    state.inventory.goods[goodId] -= take;
    remaining -= take;
    if (remaining <= 0) return true;
  }
  return remaining <= 0;
}

function markCropHarvested(cropId) {
  state.collection.harvested[cropDef(cropId).id] = true;
}

function markCropShipped(cropId) {
  const id = cropDef(cropId).id;
  state.collection.harvested[id] = true;
  state.collection.shipped[id] = true;
}

function createDailyOrder(day) {
  const season = seasonInfoForDay(day);
  const seasonalNames = {
    spring: ["开荒菜篮", "茶铺试吃", "春耕补给单", "卫生站鲜菜单"],
    summer: ["夏日集市单", "茶铺凉菜单", "水渠工队餐单", "夜市备货单", "托管教室餐单"],
    autumn: ["秋收统货单", "晒场备货单", "合作社样品单", "收获节补货单", "冷链试运行单"],
    winter: ["冬储菜篮", "年终慰问单", "热汤食材单", "仓储检查单", "互助饭点单"],
  };
  const names = seasonalNames[season.id] ?? seasonalNames.spring;
  const cropPool = CROP_IDS.filter((cropId) => isCropInSeason(cropId, season.id));
  const recommendedCropId = cropPool[(season.dayOfTerm + day) % Math.max(1, cropPool.length)] ?? DEFAULT_CROP_ID;
  const rewardSeedCropId = cropPool[(day + season.index) % Math.max(1, cropPool.length)] ?? DEFAULT_CROP_ID;
  const earlySpring = season.id === "spring" && season.dayOfSeason <= 15;
  const baseTarget = earlySpring ? 2 + ((day - 1) % 2) : 3 + ((day - 1) % 4);
  const lateYearBonus = season.dayOfYear > 60 && season.id !== "winter" ? 1 : 0;
  const targetCap = season.id === "spring" ? 4 : season.id === "winter" ? 4 : 6;
  const target = Math.min(targetCap, baseTarget + lateYearBonus);
  const rewardGold = target * (season.id === "spring" ? 18 : season.id === "winter" ? 26 : 16 + season.index * 4);
  const rewardSeeds = day % 5 === 0 ? 3 : day % 2 === 0 ? 1 : 0;
  return {
    day,
    title: `${season.solarTerm.name} · ${cropDef(recommendedCropId).name} · ${names[(season.dayOfTerm + day) % names.length]}`,
    recommendedCropId,
    target,
    shipped: 0,
    rewardGold,
    rewardSeeds,
    rewardSeedCropId,
    completed: false,
  };
}

const TILE = {
  empty: 0,
  grass: 1,
  grassDark: 2,
  dirt: 3,
  water: 4,
  path: 5,
  floor: 6,
  wall: 7,
  roof: 8,
  fence: 9,
  door: 10,
  crop1: 11,
  crop2: 12,
};

const tileMeta = {
  [TILE.empty]: { name: "empty", walkable: true },
  [TILE.grass]: { name: "grass", walkable: true },
  [TILE.grassDark]: { name: "grass-dark", walkable: true },
  [TILE.dirt]: { name: "dirt", walkable: true },
  [TILE.water]: { name: "water", walkable: false },
  [TILE.path]: { name: "path", walkable: true },
  [TILE.floor]: { name: "floor", walkable: true },
  [TILE.wall]: { name: "wall", walkable: false },
  [TILE.roof]: { name: "roof", walkable: false },
  [TILE.fence]: { name: "fence", walkable: false },
  [TILE.door]: { name: "door", walkable: true },
  [TILE.crop1]: { name: "sprout", walkable: false },
  [TILE.crop2]: { name: "crop", walkable: false },
};

const tileColors = {
  [TILE.empty]: "#121711",
  [TILE.grass]: "#66a95b",
  [TILE.grassDark]: "#477d49",
  [TILE.dirt]: "#966744",
  [TILE.water]: "#3a7fa0",
  [TILE.path]: "#c4a267",
  [TILE.floor]: "#9d7858",
  [TILE.wall]: "#876653",
  [TILE.roof]: "#8d4a43",
  [TILE.fence]: "#7b5130",
  [TILE.door]: "#51311f",
  [TILE.crop1]: "#78b65f",
  [TILE.crop2]: "#e0c65e",
};
const mapTilePalettes = {
  farm: {
    [TILE.empty]: "#151912",
    [TILE.grass]: "#58a45b",
    [TILE.grassDark]: "#3d7d46",
    [TILE.dirt]: "#9a693d",
    [TILE.water]: "#2f7395",
    [TILE.path]: "#c2a15e",
    [TILE.floor]: "#a87645",
    [TILE.wall]: "#83513e",
    [TILE.roof]: "#8c4851",
    [TILE.fence]: "#704b2c",
    [TILE.door]: "#4d2d1f",
  },
  house: {
    [TILE.empty]: "#19130f",
    [TILE.floor]: "#b68a58",
    [TILE.wall]: "#6b4a3a",
    [TILE.roof]: "#7a3e45",
    [TILE.door]: "#352013",
  },
  village: {
    [TILE.empty]: "#171713",
    [TILE.grass]: "#7d9462",
    [TILE.grassDark]: "#5f744f",
    [TILE.dirt]: "#7e6b55",
    [TILE.water]: "#4d7885",
    [TILE.path]: "#8f8d80",
    [TILE.floor]: "#7a7d78",
    [TILE.wall]: "#6d6860",
    [TILE.roof]: "#a45f4e",
    [TILE.fence]: "#665448",
    [TILE.door]: "#342821",
  },
  mountain: {
    [TILE.empty]: "#0f1513",
    [TILE.grass]: "#2e6048",
    [TILE.grassDark]: "#1d4238",
    [TILE.dirt]: "#5d513e",
    [TILE.water]: "#244f68",
    [TILE.path]: "#6b6450",
    [TILE.floor]: "#6e6a5b",
    [TILE.wall]: "#4b5560",
    [TILE.roof]: "#2f3e46",
    [TILE.fence]: "#4a3526",
    [TILE.door]: "#1f2626",
  },
};
const ART_EXPECTED_ASSET_BATCHES = [
  {
    id: "p0-crops",
    priority: "P0",
    title: "作物三态",
    items: CROP_IDS.flatMap((cropId) =>
      [VISUAL_STATES.active, "watered", VISUAL_STATES.ready].map((stateId) => ({
        group: "crops",
        id: cropId,
        state: stateId,
        label: `${cropDef(cropId).name} · ${stateId}`,
      })),
    ),
  },
  {
    id: "p0-community-facilities",
    priority: "P0",
    title: "村情设施四阶段",
    items: COMMUNITY_FACILITY_IDS.flatMap((goalId) =>
      [VISUAL_STATES.ruin, VISUAL_STATES.repaired, VISUAL_STATES.upgrade1, VISUAL_STATES.upgrade2].map((stateId) => ({
        group: "objects",
        id: `communityFacility-${goalId}`,
        state: stateId,
        label: `${communityFacilityDef(goalId).name} · ${stateId}`,
      })),
    ),
  },
  {
    id: "p0-resource-nodes",
    priority: "P0",
    title: "山里资源点三态",
    items: RESOURCE_NODE_IDS.flatMap((resourceId) =>
      [VISUAL_STATES.locked, VISUAL_STATES.active, VISUAL_STATES.depleted].map((stateId) => ({
        group: "objects",
        id: `resourceNode-${resourceId}`,
        state: stateId,
        label: `${RESOURCE_NODE_TYPES[resourceId].name} · ${stateId}`,
      })),
    ),
  },
  {
    id: "p1-buildables",
    priority: "P1",
    title: "建造物 active 图",
    items: BUILDABLE_IDS.map((itemId) => ({
      group: "buildables",
      id: itemId,
      state: VISUAL_STATES.active,
      label: `${buildableDef(itemId).name} · active`,
    })),
  },
  {
    id: "p1-story-objects",
    priority: "P1",
    title: "主线与节庆对象状态",
    items: [
      ...[VISUAL_STATES.locked, VISUAL_STATES.active, VISUAL_STATES.completed].map((stateId) => ({
        group: "objects",
        id: "springFairStall",
        state: stateId,
        label: `春集摊位 · ${stateId}`,
      })),
      ...[VISUAL_STATES.locked, VISUAL_STATES.active, VISUAL_STATES.ready, VISUAL_STATES.completed].map((stateId) => ({
        group: "objects",
        id: "springSampleCrate",
        state: stateId,
        label: `春季样本箱 · ${stateId}`,
      })),
      ...[VISUAL_STATES.active, VISUAL_STATES.ready, VISUAL_STATES.completed].map((stateId) => ({
        group: "objects",
        id: "landShrine",
        state: stateId,
        label: `土地庙 · ${stateId}`,
      })),
      ...[VISUAL_STATES.locked, VISUAL_STATES.repaired].map((stateId) => ({
        group: "objects",
        id: "shop",
        state: stateId,
        label: `村庄杂货铺交互点 · ${stateId}`,
      })),
      ...["cooperativeDesk", "tourismDesk", "brandDesk", "irrigationPump"].flatMap((id) =>
        [VISUAL_STATES.locked, VISUAL_STATES.repaired, VISUAL_STATES.completed].map((stateId) => ({
          group: "objects",
          id,
          state: stateId,
          label: `${id} · ${stateId}`,
        })),
      ),
    ],
  },
  {
    id: "p1-fish-icons",
    priority: "P1",
    title: "水产图鉴图标",
    items: FISH_IDS.map((fishId) => ({
      group: "fish",
      id: fishId,
      state: VISUAL_STATES.default,
      label: fishDef(fishId).name,
    })),
  },
  {
    id: "p2-ui-icons",
    priority: "P2",
    title: "UI 图标",
    items: ART_ASSET_GROUPS.ui.map((id) => ({
      group: "ui",
      id,
      state: VISUAL_STATES.default,
      label: `UI · ${id}`,
    })),
  },
  {
    id: "p2-tool-icons",
    priority: "P2",
    title: "工具图标",
    items: TOOLS.map((tool) => ({
      group: "tools",
      id: tool.id,
      state: VISUAL_STATES.default,
      label: tool.name,
    })),
  },
];
const RELEASE_2_0_ACCEPTANCE_DEFS = [
  {
    id: "fallback",
    title: "无素材 fallback",
    detail: "不加 ?assets=1 时继续使用 Canvas 色块，移动、工具、对话和存档都不依赖 PNG。",
  },
  {
    id: "assets",
    title: "美术资源模式",
    detail: "加 ?assets=1 后，作物、设施、资源点、建造物、水产、UI 和工具图标按稳定路径尝试加载。",
  },
  {
    id: "firstYear",
    title: "一周目主线",
    detail: "春夏秋冬到土地庙最终缺口都有 Q 面板、路牌、小地图或土地庙入口。",
  },
  {
    id: "waterFish",
    title: "水质与水产",
    detail: "水质从污浊到活水会逐步解锁水产，图鉴显示地点、季节、水质和设施条件。",
  },
  {
    id: "facilities",
    title: "设施强化",
    detail: "六个村情设施都有旧址、修复、强化一、强化二语义，并影响奖励、台词和回顾。",
  },
  {
    id: "saveSafety",
    title: "存档与测试安全",
    detail: "测试跳过不自动写入正式槽位，旧存档缺字段由 normalize 补齐。",
  },
];
const seasonalMapTilePalettes = {
  spring: {
    farm: {
      [TILE.empty]: "#121711",
      [TILE.grass]: "#6eb560",
      [TILE.grassDark]: "#4a884d",
      [TILE.dirt]: "#9c6b45",
      [TILE.path]: "#ceb071",
      [TILE.floor]: "#ad7e55",
      [TILE.wall]: "#8a674f",
      [TILE.roof]: "#9a4f49",
      [TILE.fence]: "#7b5230",
      [TILE.door]: "#52311f",
    },
    village: {
      [TILE.empty]: "#141711",
      [TILE.grass]: "#8aa96a",
      [TILE.grassDark]: "#637f54",
      [TILE.dirt]: "#806d58",
      [TILE.path]: "#a59b7f",
      [TILE.floor]: "#85877b",
      [TILE.wall]: "#756b60",
      [TILE.roof]: "#ad6250",
      [TILE.fence]: "#6c5846",
      [TILE.door]: "#3b2b20",
    },
    mountain: {
      [TILE.empty]: "#0e1513",
      [TILE.grass]: "#3d7352",
      [TILE.grassDark]: "#254e3f",
      [TILE.dirt]: "#695a42",
      [TILE.path]: "#766d55",
      [TILE.floor]: "#747060",
      [TILE.wall]: "#536169",
      [TILE.roof]: "#34474d",
      [TILE.fence]: "#513929",
      [TILE.door]: "#202827",
    },
  },
  summer: {
    farm: {
      [TILE.empty]: "#15180f",
      [TILE.grass]: "#6aa84c",
      [TILE.grassDark]: "#527f3e",
      [TILE.dirt]: "#a87443",
      [TILE.path]: "#d6b96e",
      [TILE.floor]: "#b8844c",
      [TILE.wall]: "#8c6249",
      [TILE.roof]: "#9d5743",
      [TILE.fence]: "#805832",
      [TILE.door]: "#573520",
    },
    village: {
      [TILE.empty]: "#18170f",
      [TILE.grass]: "#929d58",
      [TILE.grassDark]: "#707a45",
      [TILE.dirt]: "#856f50",
      [TILE.path]: "#aea37a",
      [TILE.floor]: "#8d8875",
      [TILE.wall]: "#716b5b",
      [TILE.roof]: "#b26343",
      [TILE.fence]: "#6b5742",
      [TILE.door]: "#38291d",
    },
    mountain: {
      [TILE.empty]: "#0f1710",
      [TILE.grass]: "#3e6c43",
      [TILE.grassDark]: "#294a34",
      [TILE.dirt]: "#66583d",
      [TILE.path]: "#766d50",
      [TILE.floor]: "#74705d",
      [TILE.wall]: "#4f5a5b",
      [TILE.roof]: "#35474a",
      [TILE.fence]: "#503a26",
      [TILE.door]: "#202826",
    },
  },
  autumn: {
    farm: {
      [TILE.empty]: "#17130e",
      [TILE.grass]: "#a08d4d",
      [TILE.grassDark]: "#78673c",
      [TILE.dirt]: "#98613c",
      [TILE.path]: "#c99155",
      [TILE.floor]: "#aa7046",
      [TILE.wall]: "#885944",
      [TILE.roof]: "#a14e3b",
      [TILE.fence]: "#794927",
      [TILE.door]: "#51301f",
    },
    village: {
      [TILE.empty]: "#18140f",
      [TILE.grass]: "#9a8751",
      [TILE.grassDark]: "#76653e",
      [TILE.dirt]: "#80634b",
      [TILE.path]: "#9e7f5a",
      [TILE.floor]: "#7f7562",
      [TILE.wall]: "#6c6256",
      [TILE.roof]: "#b05b3c",
      [TILE.fence]: "#684a35",
      [TILE.door]: "#34251c",
    },
    mountain: {
      [TILE.empty]: "#141310",
      [TILE.grass]: "#586a3d",
      [TILE.grassDark]: "#3e4b32",
      [TILE.dirt]: "#67533d",
      [TILE.path]: "#79644a",
      [TILE.floor]: "#736755",
      [TILE.wall]: "#55575b",
      [TILE.roof]: "#3b4243",
      [TILE.fence]: "#513724",
      [TILE.door]: "#222421",
    },
  },
  winter: {
    farm: {
      [TILE.empty]: "#10161a",
      [TILE.grass]: "#d9e5de",
      [TILE.grassDark]: "#b8cbc4",
      [TILE.dirt]: "#8d8175",
      [TILE.path]: "#d9d1be",
      [TILE.floor]: "#a08f7a",
      [TILE.wall]: "#74736a",
      [TILE.roof]: "#845d62",
      [TILE.fence]: "#665342",
      [TILE.door]: "#3f332b",
    },
    village: {
      [TILE.empty]: "#12161a",
      [TILE.grass]: "#dbe4dc",
      [TILE.grassDark]: "#becac3",
      [TILE.dirt]: "#898177",
      [TILE.path]: "#d1cec2",
      [TILE.floor]: "#8f9188",
      [TILE.wall]: "#72726c",
      [TILE.roof]: "#8c665f",
      [TILE.fence]: "#62574e",
      [TILE.door]: "#332b25",
    },
    mountain: {
      [TILE.empty]: "#0f171b",
      [TILE.grass]: "#b7c9c2",
      [TILE.grassDark]: "#8ea29d",
      [TILE.dirt]: "#756e66",
      [TILE.path]: "#aaa596",
      [TILE.floor]: "#8a8980",
      [TILE.wall]: "#6b747a",
      [TILE.roof]: "#465058",
      [TILE.fence]: "#5a4d43",
      [TILE.door]: "#20292b",
    },
  },
};
const seasonalTileColors = {
  spring: {
    [TILE.grass]: "#62aa59",
    [TILE.grassDark]: "#3f8247",
    [TILE.dirt]: "#9c6b43",
    [TILE.path]: "#c9aa6c",
    [TILE.crop1]: "#75ba61",
    [TILE.crop2]: "#dfc95d",
  },
  summer: {
    [TILE.grass]: "#5f9f42",
    [TILE.grassDark]: "#4d8439",
    [TILE.dirt]: "#a3713f",
    [TILE.path]: "#d2b56b",
    [TILE.crop1]: "#6faa4e",
    [TILE.crop2]: "#e2b852",
  },
  autumn: {
    [TILE.grass]: "#8d8a45",
    [TILE.grassDark]: "#70663a",
    [TILE.dirt]: "#93633b",
    [TILE.path]: "#c28a50",
    [TILE.crop1]: "#9a8f43",
    [TILE.crop2]: "#d99145",
  },
  winter: {
    [TILE.grass]: "#d7e3db",
    [TILE.grassDark]: "#b8c8c2",
    [TILE.dirt]: "#897f75",
    [TILE.path]: "#d8d2bf",
    [TILE.crop1]: "#9eb7ad",
    [TILE.crop2]: "#d8e8df",
  },
};

const ART = {
  ink: "#2e241b",
  paper: "#f4ecd8",
  paperDim: "#d8cbb0",
  woodDark: "#4b3324",
  wood: "#7a5137",
  woodLight: "#b98145",
  bamboo: "#7fa567",
  tileRed: "#a9503f",
  roofBlue: "#49646c",
  villageStone: "#85877b",
  gold: "#e7b34d",
  green: "#70b77e",
  blue: "#75b9d8",
  clay: "#c08a4a",
  red: "#d95f4b",
  shadow: "rgba(33, 22, 13, 0.28)",
  outline: "rgba(35, 25, 18, 0.7)",
};

function waterQualityColorForSeason(level = currentWaterQuality(), seasonId = currentSeasonId()) {
  return (
    SEASONAL_WATER_QUALITY_COLORS[seasonId]?.[normalizeWaterQuality(level)] ??
    WATER_QUALITY_COLORS[normalizeWaterQuality(level)] ??
    tileColors[TILE.water]
  );
}

function tileColorForMap(tileId, mapId = state.mapId) {
  if (tileId === TILE.water) return waterQualityColorForSeason();
  return (
    seasonalMapTilePalettes[currentSeasonId()]?.[mapId]?.[tileId] ??
    seasonalTileColors[currentSeasonId()]?.[tileId] ??
    mapTilePalettes[mapId]?.[tileId] ??
    tileColors[tileId] ??
    "#ff00ff"
  );
}

const STARTER_FARM_AREA = { x: 34, y: 2, w: 20, h: 19 };

function tileInRect(tileX, tileY, area) {
  return tileX >= area.x && tileY >= area.y && tileX < area.x + area.w && tileY < area.y + area.h;
}

function clearFarmArea(map, x, y, w, h, groundTile = TILE.grass) {
  const { ground, collision } = map?.layers ?? {};
  if (!ground || !collision) return;
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      if (ground[row]?.[col] === undefined) continue;
      if (ground[row][col] !== TILE.water && ground[row][col] !== TILE.floor && ground[row][col] !== TILE.path) {
        ground[row][col] = groundTile;
      }
      if (collision[row]?.[col] !== undefined && ground[row][col] !== TILE.water) collision[row][col] = 0;
    }
  }
}

function applyStarterFarmBounds(map) {
  const { ground, collision } = map?.layers ?? {};
  if (!ground || !collision) return;
  for (let row = 1; row < map.height - 1; row += 1) {
    for (let col = 1; col < map.width - 1; col += 1) {
      const insideStarter = tileInRect(col, row, STARTER_FARM_AREA);
      if (insideStarter) {
        if (ground[row][col] !== TILE.water) collision[row][col] = 0;
        continue;
      }
      if (ground[row][col] !== TILE.water) {
        ground[row][col] = (col * 7 + row * 5) % 4 === 0 ? TILE.grassDark : TILE.grass;
      }
      collision[row][col] = 1;
    }
  }
}

const FARM_UPGRADES = {
  fieldExpansion: {
    id: "fieldExpansion",
    name: "扩展农场范围",
    cost: 120,
    description: "清开老宅南侧和中部荒草，获得更大的可开垦范围。土地仍需要自己用锄头开垦。",
    apply(map) {
      clearFarmArea(map, 22, 18, 22, 15);
      clearFarmArea(map, 10, 28, 16, 7);
      rect(map.layers.ground, 22, 22, 22, 2, TILE.path);
      rect(map.layers.ground, 32, 18, 2, 17, TILE.path);
      rect(map.layers.collision, 22, 22, 22, 2, 0);
      rect(map.layers.collision, 32, 18, 2, 17, 0);
    },
  },
  well: {
    id: "well",
    name: "水井",
    cost: 150,
    description: "在农田边增加一口水井，作为固定装饰和未来水源入口。",
    apply(map) {
      map.layers.ground[23][35] = TILE.floor;
      map.layers.collision[23][35] = 1;
      if (!map.objects.some((obj) => obj.type === "well" && obj.x === 35 && obj.y === 23)) {
        map.objects.push({ type: "well", x: 35, y: 23, name: "水井" });
      }
    },
  },
};
const UPGRADE_IDS = Object.keys(FARM_UPGRADES);
const editableTileIds = Object.values(TILE);
const MAP_LAYER_IDS = ["ground", "buildings", "front", "collision"];
const EDITABLE_OBJECT_TYPES = [
  "sign",
  "chest",
  "seedShop",
  "shop",
  "shippingBin",
  "kitchen",
  "processor",
  "dryer",
  "flowerBox",
  "gardenLamp",
  "bench",
  "fence",
  "marketStall",
  "basketPoint",
  "tastingTable",
  "ecommerceDesk",
  "cooperativeDesk",
  "tourismDesk",
  "brandDesk",
  "irrigationPump",
  "landShrine",
  "resourceNode",
  "springFairStall",
  "springSampleCrate",
  "issueBoard",
  "communityFacility",
  "directionSign",
  "ruin",
  "warp",
  "bed",
  "mailbox",
];
const IMPORT_OBJECT_TYPES = new Set([...EDITABLE_OBJECT_TYPES, "upgradeBoard", "well"]);

function makeLayer(width, height, fill = TILE.empty) {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

function rect(layer, x, y, w, h, tileId) {
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      if (layer[row]?.[col] !== undefined) layer[row][col] = tileId;
    }
  }
}

function clearFixedFenceRun(map, x, y, w, h) {
  const { buildings, collision } = map?.layers ?? {};
  if (!buildings || !collision) return;
  for (let row = y; row < y + h; row += 1) {
    for (let col = x; col < x + w; col += 1) {
      if (buildings[row]?.[col] === TILE.fence) buildings[row][col] = TILE.empty;
      if (collision[row]?.[col] !== undefined) collision[row][col] = 0;
    }
  }
}

function removeFixedFarmFences(map = maps.farm) {
  clearFixedFenceRun(map, 4, 16, 14, 1);
  clearFixedFenceRun(map, 4, 17, 1, 8);
  clearFixedFenceRun(map, 17, 17, 1, 8);
  clearFixedFenceRun(map, 4, 25, 14, 1);
  clearFixedFenceRun(map, 27, 23, 17, 1);
  clearFixedFenceRun(map, 27, 31, 17, 1);
  clearFixedFenceRun(map, 27, 24, 1, 7);
  clearFixedFenceRun(map, 43, 24, 1, 7);
}

function moveFarmObject(map, predicate, patch) {
  if (!map?.objects) return;
  const object = map.objects.find(predicate);
  if (!object) return;
  Object.assign(object, patch);
}

function removeFarmSeedShop(map = maps.farm) {
  if (!map?.objects) return;
  map.objects = map.objects.filter((obj) => {
    if (obj.type === "seedShop") return false;
    return !(obj.type === "shop" && String(obj.name ?? "种子铺").includes("种子"));
  });
}

function organizeFarmLayout(map = maps.farm) {
  if (!map?.objects) return;
  moveFarmObject(map, (obj) => obj.type === "mailbox", { x: 42, y: 12, name: "邮箱" });
  moveFarmObject(map, (obj) => obj.type === "chest", { x: 37, y: 15 });
  moveFarmObject(map, (obj) => obj.type === "shippingBin", { x: 48, y: 15, name: "出货箱" });
  removeFarmSeedShop(map);
  moveFarmObject(
    map,
    (obj) => obj.featureId === "processing" || obj.machineId === "farmProcessor" || obj.type === "processor",
    { x: 45, y: 16 },
  );
  moveFarmObject(
    map,
    (obj) => obj.featureId === "construction" || obj.type === "upgradeBoard",
    { x: 50, y: 16 },
  );
  moveFarmObject(map, (obj) => obj.type === "warp" && obj.toMap === "house", { x: 40, y: 10, toMap: "house", to: { x: 7, y: 8 } });
  moveFarmObject(map, (obj) => obj.type === "warp" && obj.toMap === "mountain", { x: 42, y: 2, toMap: "mountain", to: { x: 20, y: 24 } });
  moveFarmObject(map, (obj) => obj.type === "warp" && obj.toMap === "village", { x: 53, y: 19, toMap: "village", to: { x: 3, y: 14 } });
  moveFarmObject(
    map,
    (obj) => obj.type === "sign" && String(obj.text ?? "").includes("农场入口"),
    { x: 38, y: 13, text: "开局只清出右上角一小片。没有现成耕地，草地需要自己用锄头开垦。" },
  );
  moveFarmObject(
    map,
    (obj) => obj.type === "sign" && String(obj.text ?? "").includes("东边小路"),
    { x: 52, y: 18, text: "东边小路通向村庄：种子铺、NPC、杂货铺、木匠公告牌、广场和池塘都在那里。" },
  );
  moveFarmObject(
    map,
    (obj) => obj.type === "sign" && String(obj.text ?? "").includes("土地庙"),
    { x: 42, y: 5, text: "北边山路通向旧土地庙。路不好走，但有时能听到几句提醒。" },
  );
}

function addTreeCluster(layers, x, y) {
  const { buildings, front, collision } = layers;
  if (buildings?.[y + 1]?.[x] === undefined || front?.[y]?.[x] === undefined || front?.[y + 1]?.[x] === undefined) return;
  buildings[y + 1][x] = TILE.wall;
  front[y][x - 1] = TILE.roof;
  front[y][x] = TILE.roof;
  front[y][x + 1] = TILE.roof;
  front[y + 1][x - 1] = TILE.roof;
  front[y + 1][x + 1] = TILE.roof;
  collision[y + 1][x] = 1;
}

function applyFarmMapIdentity(map) {
  if (!map?.layers) return;
  const { ground, buildings, front, collision } = map.layers;
  rect(ground, 48, 5, 4, 4, TILE.water);
  rect(collision, 48, 5, 4, 4, 1);
  rect(ground, 38, 14, 16, 2, TILE.path);
  rect(collision, 38, 14, 16, 2, 0);
  rect(ground, 41, 11, 2, 5, TILE.path);
  rect(collision, 41, 11, 2, 5, 0);
  rect(ground, 42, 2, 2, 12, TILE.path);
  rect(collision, 42, 2, 2, 12, 0);
  rect(ground, 37, 6, 7, 5, TILE.floor);
  rect(collision, 37, 6, 7, 5, 0);
  rect(ground, 46, 13, 7, 2, TILE.floor);
  rect(collision, 46, 13, 7, 2, 0);
  for (const [x, y] of [
    [25, 9],
    [28, 13],
    [30, 22],
    [16, 28],
    [47, 25],
  ]) {
    addTreeCluster({ buildings, front, collision }, x, y);
  }
}

function applyVillageMapIdentity(map) {
  if (!map?.layers) return;
  const { ground, buildings, front, collision } = map.layers;
  rect(ground, 13, 9, 16, 10, TILE.floor);
  rect(ground, 2, 13, 36, 3, TILE.path);
  rect(ground, 19, 5, 3, 21, TILE.path);
  rect(ground, 5, 17, 10, 3, TILE.floor);
  rect(ground, 24, 16, 12, 3, TILE.floor);
  rect(ground, 29, 20, 8, 5, TILE.water);
  rect(collision, 29, 20, 8, 5, 1);
  rect(buildings, 3, 20, 7, 2, TILE.roof);
  rect(buildings, 3, 22, 7, 4, TILE.wall);
  rect(collision, 3, 20, 7, 6, 1);
  buildings[26][6] = TILE.door;
  collision[26][6] = 0;
  rect(buildings, 33, 9, 6, 7, TILE.empty);
  rect(collision, 33, 9, 6, 7, 0);
}

function applyMountainMapIdentity(map) {
  if (!map?.layers) return;
  const { ground, buildings, front, collision } = map.layers;
  rect(ground, 2, 2, 38, 3, TILE.wall);
  rect(collision, 2, 2, 38, 3, 1);
  rect(ground, 18, 22, 5, 7, TILE.path);
  rect(ground, 12, 18, 18, 5, TILE.path);
  rect(ground, 10, 12, 5, 8, TILE.path);
  rect(ground, 14, 10, 14, 5, TILE.path);
  rect(ground, 17, 7, 8, 6, TILE.floor);
  rect(collision, 17, 7, 8, 6, 0);
  rect(ground, 3, 7, 8, 3, TILE.wall);
  rect(collision, 3, 7, 8, 3, 1);
  rect(ground, 31, 7, 7, 4, TILE.wall);
  rect(collision, 31, 7, 7, 4, 1);
  rect(ground, 5, 24, 8, 3, TILE.wall);
  rect(collision, 5, 24, 8, 3, 1);
  rect(ground, 4, 4, 7, 4, TILE.water);
  rect(collision, 4, 4, 7, 4, 1);
  rect(ground, 30, 16, 6, 5, TILE.water);
  rect(collision, 30, 16, 6, 5, 1);
  for (const [x, y] of [
    [6, 12],
    [9, 16],
    [13, 8],
    [27, 8],
    [30, 12],
    [33, 23],
    [15, 25],
    [26, 25],
    [35, 25],
    [37, 20],
  ]) {
    addTreeCluster({ buildings, front, collision }, x, y);
  }
}

function ensureMapIdentityDetails() {
  applyFarmMapIdentity(maps.farm);
  applyVillageMapIdentity(maps.village);
  applyMountainMapIdentity(maps.mountain);
}

function buildFarmMap() {
  const width = 56;
  const height = 38;
  const ground = makeLayer(width, height, TILE.grass);
  const buildings = makeLayer(width, height);
  const front = makeLayer(width, height);
  const collision = makeLayer(width, height, 0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if ((x * 13 + y * 7) % 11 === 0) ground[y][x] = TILE.grassDark;
      if (x < 2 || y < 2 || x > width - 3 || y > height - 3) {
        ground[y][x] = TILE.water;
        collision[y][x] = 1;
      }
    }
  }

  applyFarmMapIdentity({ layers: { ground, buildings, front, collision }, width, height });
  applyStarterFarmBounds({ layers: { ground, buildings, front, collision }, width, height });

  rect(buildings, 37, 5, 7, 1, TILE.roof);
  rect(buildings, 37, 6, 7, 4, TILE.wall);
  buildings[10][40] = TILE.door;
  rect(collision, 37, 5, 7, 6, 1);
  collision[10][40] = 0;

  // 固定围栏已移除；需要篱笆时使用建造商店购买并自由摆放。

  const treeTiles = [
    [25, 9],
    [28, 13],
    [30, 22],
    [16, 28],
    [47, 25],
    [12, 22],
  ];
  for (const [x, y] of treeTiles) {
    buildings[y + 1][x] = TILE.wall;
    front[y][x - 1] = TILE.roof;
    front[y][x] = TILE.roof;
    front[y][x + 1] = TILE.roof;
    front[y + 1][x - 1] = TILE.roof;
    front[y + 1][x + 1] = TILE.roof;
    collision[y + 1][x] = 1;
  }

  rect(collision, 0, 0, width, 1, 1);
  rect(collision, 0, height - 1, width, 1, 1);
  rect(collision, 0, 0, 1, height, 1);
  rect(collision, width - 1, 0, 1, height, 1);

  return {
    id: "farm",
    name: "Farm",
    width,
    height,
    tileSize: TILE_SIZE,
    spawn: { x: 42, y: 15 },
    layers: { ground, buildings, front, collision },
    objects: [
      { type: "sign", x: 38, y: 13, text: "开局只清出右上角一小片。没有现成耕地，草地需要自己用锄头开垦。" },
      { type: "chest", x: 37, y: 15, items: ["wood", "stone", "parsnip seeds"] },
      { type: "shippingBin", x: 48, y: 15, name: "出货箱" },
      {
        type: "ruin",
        x: 45,
        y: 16,
        name: "废弃加工桶",
        featureId: "processing",
        repairedType: "processor",
        repairedName: "加工桶",
        machineId: "farmProcessor",
        hint: "旧加工桶还能修，但现在先把第一批菜种出来。",
      },
      {
        type: "ruin",
        x: 50,
        y: 16,
        name: "旧扩建公告牌",
        featureId: "construction",
        repairedType: "upgradeBoard",
        repairedName: "扩建公告牌",
        hint: "公告牌还没修好，第一周先完成种植和出货。",
      },
      { type: "mailbox", x: 42, y: 12, name: "邮箱" },
      { type: "warp", x: 40, y: 10, toMap: "house", to: { x: 7, y: 8 } },
      directionSign("farmCrossroadsSign", 45, 15, "农场路牌", [
        "北：山路 / 旧土地庙",
        "东：村庄种子铺 / 村庄小路",
        "西：农舍 / 出货箱 / 邮箱",
        "南：待清开的荒地 / 扩展范围",
      ]),
      { type: "sign", x: 42, y: 5, text: "北边山路通向旧土地庙。路不好走，但有时能听到几句提醒。" },
      directionSign("farmMountainSign", 42, 4, "山路路牌", ["北：山里资源点 / 旧土地庙", "南：农场小清场 / 农舍"]),
      { type: "warp", x: 42, y: 2, toMap: "mountain", to: { x: 20, y: 24 } },
      { type: "sign", x: 52, y: 18, text: "东边小路通向村庄：种子铺、NPC、杂货铺、木匠公告牌、广场和池塘都在那里。" },
      directionSign("farmVillageSign", 52, 16, "村口路牌", ["东：村庄入口", "西：农场小清场 / 农舍", "南：待清开的荒地"]),
      { type: "warp", x: 53, y: 19, toMap: "village", to: { x: 3, y: 14 } },
    ],
  };
}

function buildHouseMap() {
  const width = 18;
  const height = 14;
  const ground = makeLayer(width, height, TILE.floor);
  const buildings = makeLayer(width, height);
  const front = makeLayer(width, height);
  const collision = makeLayer(width, height, 0);

  rect(buildings, 0, 0, width, 1, TILE.wall);
  rect(buildings, 0, height - 1, width, 1, TILE.wall);
  rect(buildings, 0, 0, 1, height, TILE.wall);
  rect(buildings, width - 1, 0, 1, height, TILE.wall);
  rect(collision, 0, 0, width, 1, 1);
  rect(collision, 0, height - 1, width, 1, 1);
  rect(collision, 0, 0, 1, height, 1);
  rect(collision, width - 1, 0, 1, height, 1);
  buildings[13][8] = TILE.door;
  collision[13][8] = 0;
  rect(buildings, 3, 3, 4, 2, TILE.wall);
  rect(collision, 3, 3, 4, 2, 1);

  return {
    id: "house",
    name: "Farm House",
    width,
    height,
    tileSize: TILE_SIZE,
    spawn: { x: 7, y: 8 },
    layers: { ground, buildings, front, collision },
    objects: [
      { type: "kitchen", x: 4, y: 6, name: "厨房加工台" },
      { type: "bed", x: 12, y: 5, name: "床" },
      { type: "sign", x: 5, y: 6, text: "屋内地图：这是另一个 Tilemap。" },
      { type: "warp", x: 8, y: 13, toMap: "farm", to: { x: 40, y: 11 } },
    ],
  };
}

function buildVillageMap() {
  const width = 42;
  const height = 30;
  const ground = makeLayer(width, height, TILE.grass);
  const buildings = makeLayer(width, height);
  const front = makeLayer(width, height);
  const collision = makeLayer(width, height, 0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if ((x * 5 + y * 11) % 13 === 0) ground[y][x] = TILE.grassDark;
      if (x < 1 || y < 1 || x > width - 2 || y > height - 2) {
        ground[y][x] = TILE.water;
        collision[y][x] = 1;
      }
    }
  }

  rect(ground, 2, 13, 36, 3, TILE.path);
  rect(ground, 19, 5, 3, 21, TILE.path);
  rect(ground, 14, 10, 14, 8, TILE.floor);
  rect(ground, 8, 6, 8, 5, TILE.floor);
  rect(ground, 27, 6, 8, 5, TILE.floor);
  rect(ground, 29, 20, 8, 5, TILE.water);
  rect(collision, 29, 20, 8, 5, 1);

  rect(buildings, 7, 4, 10, 2, TILE.roof);
  rect(buildings, 7, 6, 10, 5, TILE.wall);
  buildings[11][12] = TILE.door;
  rect(collision, 7, 4, 10, 7, 1);
  collision[11][12] = 0;

  rect(buildings, 26, 4, 10, 2, TILE.roof);
  rect(buildings, 26, 6, 10, 5, TILE.wall);
  buildings[11][31] = TILE.door;
  rect(collision, 26, 4, 10, 7, 1);
  collision[11][31] = 0;

  for (const [x, y] of [
    [6, 20],
    [9, 23],
    [12, 21],
    [34, 14],
    [37, 17],
    [25, 24],
  ]) {
    buildings[y + 1][x] = TILE.wall;
    front[y][x - 1] = TILE.roof;
    front[y][x] = TILE.roof;
    front[y][x + 1] = TILE.roof;
    front[y + 1][x - 1] = TILE.roof;
    front[y + 1][x + 1] = TILE.roof;
    collision[y + 1][x] = 1;
  }

  applyVillageMapIdentity({ layers: { ground, buildings, front, collision } });

  return {
    id: "village",
    name: "Village",
    width,
    height,
    tileSize: TILE_SIZE,
    spawn: { x: 3, y: 14 },
    layers: { ground, buildings, front, collision },
    objects: [
      { type: "warp", x: 2, y: 14, toMap: "farm", to: { x: 52, y: 19 } },
      directionSign("villageEntranceSign", 4, 16, "村口路牌", [
        "西：回农场",
        "东：村庄广场 / 池塘",
        "北：村庄种子铺 / 杂货铺 / 木匠公告牌",
      ]),
      { type: "sign", x: 18, y: 9, text: "村庄广场：开局多数功能建筑还没修复。先从第一块地、村庄种子铺和农场出货箱开始。" },
      directionSign("villageSquareSign", 21, 16, "广场路牌", [
        "北：广场水井",
        "西北：村庄种子铺 / 村情记录板",
        "东北：停业杂货铺 / 木匠公告牌",
        "东：合作社 / 木匠公告牌",
        "西南：春集种子摊 / 春季样本箱",
      ]),
      {
        type: "sign",
        x: 16,
        y: 13,
        storyId: "firstShipmentFeedback",
        text: "公告栏还空着。第一批菜卖出去后，这里会贴出村民反馈。",
      },
      { type: "seedShop", x: 12, y: 12, name: "村庄种子铺" },
      {
        type: "ruin",
        x: 31,
        y: 12,
        name: "停业杂货铺",
        featureId: "villageMarket",
        repairedType: "shop",
        repairedName: "村庄杂货铺",
        hint: "门口还堆着旧木板。第一次出货睡觉结算后，何涛会帮忙重新开门。",
      },
      {
        type: "ruin",
        x: 28,
        y: 16,
        name: "木匠旧公告牌",
        featureId: "construction",
        repairedType: "upgradeBoard",
        repairedName: "木匠公告牌",
        hint: "木匠工具还没运回来。第一周先证明农场能稳定出货。",
      },
      {
        type: "ruin",
        x: 24,
        y: 17,
        name: "合作社旧窗口",
        featureId: "cooperative",
        repairedType: "cooperativeDesk",
        repairedName: "合作社窗口",
        hint: "窗口里还堆着旧账本。先完成加工品出货，让村里看到稳定样品。",
      },
      tourismServiceRuinDefault(),
      { type: "bench", x: 18, y: 17, name: "广场长椅" },
      { type: "gardenLamp", x: 22, y: 17, name: "广场路灯" },
      { type: "well", x: 20, y: 11, name: "广场水井" },
      { type: "issueBoard", x: 14, y: 17, name: "村情记录板" },
      { type: "springFairStall", x: 18, y: 14, name: "春集种子摊", storyId: "springFairStall" },
      { type: "springSampleCrate", x: 15, y: 18, name: "春季样本箱", storyId: "springSampleCrate" },
      { type: "sign", x: 30, y: 19, text: "村庄池塘：面对水边或水井，切换水壶后按 Space 可以补水。" },
      { type: "sign", x: 30, y: 21, storyId: "waterQualitySign", text: "村塘水质牌：现在水还浑，清淤后会有更多鱼回来。" },
    ],
  };
}

function buildMountainMap() {
  const width = 42;
  const height = 30;
  const ground = makeLayer(width, height, TILE.grassDark);
  const buildings = makeLayer(width, height);
  const front = makeLayer(width, height);
  const collision = makeLayer(width, height, 0);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if ((x * 9 + y * 5) % 7 === 0) ground[y][x] = TILE.grass;
      if (x < 1 || y < 1 || x > width - 2 || y > height - 2) {
        ground[y][x] = TILE.wall;
        collision[y][x] = 1;
      }
    }
  }

  rect(ground, 18, 22, 5, 7, TILE.path);
  rect(ground, 12, 18, 18, 5, TILE.path);
  rect(ground, 10, 12, 5, 8, TILE.path);
  rect(ground, 14, 10, 14, 5, TILE.path);
  rect(ground, 17, 7, 8, 6, TILE.floor);
  rect(collision, 17, 7, 8, 6, 0);

  rect(ground, 4, 4, 7, 4, TILE.water);
  rect(collision, 4, 4, 7, 4, 1);
  rect(ground, 30, 16, 6, 5, TILE.water);
  rect(collision, 30, 16, 6, 5, 1);

  for (const [x, y] of [
    [6, 12],
    [9, 16],
    [13, 8],
    [27, 8],
    [30, 12],
    [33, 23],
    [15, 25],
    [26, 25],
  ]) {
    buildings[y + 1][x] = TILE.wall;
    front[y][x - 1] = TILE.roof;
    front[y][x] = TILE.roof;
    front[y][x + 1] = TILE.roof;
    front[y + 1][x - 1] = TILE.roof;
    front[y + 1][x + 1] = TILE.roof;
    collision[y + 1][x] = 1;
  }

  applyMountainMapIdentity({ layers: { ground, buildings, front, collision } });

  return {
    id: "mountain",
    name: "Mountain Shrine",
    width,
    height,
    tileSize: TILE_SIZE,
    spawn: { x: 20, y: 24 },
    layers: { ground, buildings, front, collision },
    objects: [
      { type: "warp", x: 20, y: 28, toMap: "farm", to: { x: 19, y: 3 } },
      directionSign("mountainEntranceSign", 21, 24, "山路路牌", ["北：旧土地庙", "南：回农场", "西：林缘采集点", "东：旧采石点 / 废弃工具棚"]),
      { type: "resourceNode", x: 12, y: 18, resourceId: "forestEdge", name: "林缘采集点", storyId: "mountainResource:forestEdge" },
      { type: "resourceNode", x: 27, y: 20, resourceId: "quarry", name: "旧采石点", storyId: "mountainResource:quarry" },
      { type: "resourceNode", x: 28, y: 12, resourceId: "toolShed", name: "废弃工具棚", storyId: "mountainResource:toolShed" },
      { type: "landShrine", x: 21, y: 9, name: "旧土地庙" },
      directionSign("mountainShrineSign", 18, 10, "土地庙路牌", ["东：旧土地庙", "南：下山回农场"]),
      { type: "sign", x: 18, y: 14, text: "山里旧路：土地庙不收供品，只留下几句像是见过很多遍的话。" },
    ],
  };
}

const maps = {
  farm: buildFarmMap(),
  house: buildHouseMap(),
  village: buildVillageMap(),
  mountain: buildMountainMap(),
};

function createDefaultUpgrades() {
  return Object.fromEntries(UPGRADE_IDS.map((upgradeId) => [upgradeId, false]));
}

function normalizeUpgrades(value = {}) {
  value = value && typeof value === "object" ? value : {};
  const upgrades = createDefaultUpgrades();
  for (const upgradeId of UPGRADE_IDS) {
    upgrades[upgradeId] = value[upgradeId] === true;
  }
  return upgrades;
}

function resetMapsToBase() {
  maps.farm = buildFarmMap();
  maps.house = buildHouseMap();
  maps.village = buildVillageMap();
  maps.mountain = buildMountainMap();
}

function ensureVillageAccess() {
  if (!maps.village) maps.village = buildVillageMap();
  const farm = maps.farm;
  if (farm?.layers?.ground && farm?.layers?.collision) {
    organizeFarmLayout(farm);
    const hasVillageWarp = farm.objects.some((obj) => obj.type === "warp" && obj.toMap === "village");
    if (!hasVillageWarp) {
      rect(farm.layers.ground, 46, 18, 8, 3, TILE.path);
      if (farm.layers.collision[19]?.[53] !== undefined) farm.layers.collision[19][53] = 0;
      farm.objects.push({ type: "warp", x: 53, y: 19, toMap: "village", to: { x: 3, y: 14 } });
    }
    if (!farm.objects.some((obj) => obj.type === "sign" && String(obj.text ?? "").includes("东边小路"))) {
      farm.objects.push({ type: "sign", x: 50, y: 18, text: "东边小路通向村庄：种子铺、NPC、杂货铺、木匠公告牌、广场和池塘都在那里。" });
    }
  }

  const village = maps.village;
  if (!village.objects.some((obj) => obj.type === "warp" && obj.toMap === "farm")) {
    village.objects.push({ type: "warp", x: 2, y: 14, toMap: "farm", to: { x: 52, y: 19 } });
  }
  if (!village.objects.some((obj) => obj.storyId === "firstShipmentFeedback")) {
    village.objects.push({
      type: "sign",
      x: 16,
      y: 13,
      storyId: "firstShipmentFeedback",
      text: "公告栏还空着。第一批菜卖出去后，这里会贴出村民反馈。",
    });
  }
  if (!village.objects.some((obj) => obj.type === "issueBoard")) {
    village.objects.push({ type: "issueBoard", x: 14, y: 17, name: "村情记录板" });
  }
  if (!village.objects.some((obj) => obj.type === "seedShop")) {
    village.objects.push({ type: "seedShop", x: 9, y: 14, name: "村庄种子铺" });
  }
  if (!village.objects.some((obj) => obj.type === "springFairStall")) {
    village.objects.push({ type: "springFairStall", x: 18, y: 14, name: "春集种子摊", storyId: "springFairStall" });
  }
  if (!village.objects.some((obj) => obj.type === "springSampleCrate")) {
    village.objects.push({ type: "springSampleCrate", x: 15, y: 18, name: "春季样本箱", storyId: "springSampleCrate" });
  }
  if (!village.objects.some((obj) => obj.storyId === "waterQualitySign")) {
    village.objects.push({ type: "sign", x: 30, y: 21, storyId: "waterQualitySign", text: "村塘水质牌：现在水还浑，清淤后会有更多鱼回来。" });
  }
  alignVillageCoreObjectPositions(village);
}

function alignVillageCoreObjectPositions(village = maps.village) {
  if (!village?.objects) return;
  const seedShop = village.objects.find((obj) => obj.type === "seedShop");
  if (seedShop) Object.assign(seedShop, { x: 12, y: 12, name: seedShop.name ?? "村庄种子铺" });

  const grocery = village.objects.find(
    (obj) => obj.featureId === "villageMarket" || obj.repairedType === "shop" || obj.type === "shop",
  );
  if (grocery) Object.assign(grocery, { x: 31, y: 12 });

  const carpenter = village.objects.find(
    (obj) => obj.featureId === "construction" || obj.repairedType === "upgradeBoard" || obj.type === "upgradeBoard",
  );
  if (carpenter) Object.assign(carpenter, { x: 28, y: 16 });
}

function ensureMountainAccess() {
  if (!maps.mountain) maps.mountain = buildMountainMap();
  const farm = maps.farm;
  if (farm?.layers?.ground && farm?.layers?.collision) {
    organizeFarmLayout(farm);
    rect(farm.layers.ground, 18, 2, 3, 6, TILE.path);
    rect(farm.layers.collision, 18, 2, 3, 6, 0);
    if (!farm.objects.some((obj) => obj.type === "warp" && obj.toMap === "mountain")) {
      farm.objects.push({ type: "warp", x: 19, y: 2, toMap: "mountain", to: { x: 20, y: 24 } });
    }
    if (!farm.objects.some((obj) => obj.type === "sign" && String(obj.text ?? "").includes("土地庙"))) {
      farm.objects.push({ type: "sign", x: 18, y: 6, text: "北边山路通向旧土地庙。路不好走，但有时能听到几句提醒。" });
    }
  }

  const mountain = maps.mountain;
  if (!mountain.objects.some((obj) => obj.type === "warp" && obj.toMap === "farm")) {
    mountain.objects.push({ type: "warp", x: 20, y: 28, toMap: "farm", to: { x: 19, y: 3 } });
  }
  if (!mountain.objects.some((obj) => obj.type === "landShrine")) {
    mountain.objects.push({ type: "landShrine", x: 21, y: 9, name: "旧土地庙" });
  }
  const resourceNodes = [
    { type: "resourceNode", x: 12, y: 18, resourceId: "forestEdge", name: "林缘采集点", storyId: "mountainResource:forestEdge" },
    { type: "resourceNode", x: 27, y: 20, resourceId: "quarry", name: "旧采石点", storyId: "mountainResource:quarry" },
    { type: "resourceNode", x: 28, y: 12, resourceId: "toolShed", name: "废弃工具棚", storyId: "mountainResource:toolShed" },
  ];
  for (const node of resourceNodes) {
    if (!mountain.objects.some((obj) => obj.storyId === node.storyId || (obj.type === "resourceNode" && obj.resourceId === node.resourceId))) {
      mountain.objects.push(node);
    }
  }
}

function ensureDirectionSigns() {
  const groups = {
    farm: [
      directionSign("farmCrossroadsSign", 22, 19, "农场路牌", ["北：山路 / 旧土地庙", "东：村庄种子铺 / 村庄小路", "西：农舍 / 出货箱 / 邮箱", "南：农田 / 扩展地块"]),
      directionSign("farmMountainSign", 18, 5, "山路路牌", ["北：山里资源点 / 旧土地庙", "南：农场主路 / 农舍"]),
      directionSign("farmVillageSign", 49, 20, "村口路牌", ["东：村庄入口", "西：农场主路 / 农舍", "南：农田边路"]),
    ],
    village: [
      directionSign("villageEntranceSign", 4, 16, "村口路牌", ["西：回农场", "东：村庄广场 / 池塘", "北：村庄种子铺 / 杂货铺 / 木匠公告牌"]),
      directionSign("villageSquareSign", 21, 16, "广场路牌", ["北：广场水井", "西北：村庄种子铺 / 村情记录板", "东北：停业杂货铺 / 木匠公告牌", "西南：春集种子摊 / 春季样本箱"]),
    ],
    mountain: [
      directionSign("mountainEntranceSign", 21, 24, "山路路牌", ["北：旧土地庙", "南：回农场", "西：林缘采集点", "东：旧采石点 / 废弃工具棚"]),
      directionSign("mountainShrineSign", 18, 10, "土地庙路牌", ["东：旧土地庙", "南：下山回农场"]),
    ],
  };
  for (const [mapId, signs] of Object.entries(groups)) {
    const map = maps[mapId];
    if (!map?.objects) continue;
    for (const sign of signs) {
      const existing = map.objects.find((obj) => obj.storyId === sign.storyId);
      if (existing) {
        Object.assign(existing, { ...sign, lines: [...sign.lines] });
      } else {
        map.objects.push({ ...sign, lines: [...sign.lines] });
      }
    }
  }
}

function replaceFunctionalObjectWithRuin(map, predicate, ruinData) {
  if (!map?.objects) return;
  const index = map.objects.findIndex(predicate);
  if (index === -1) return;
  const existing = map.objects[index];
  map.objects[index] = {
    type: "ruin",
    x: existing.x,
    y: existing.y,
    ...ruinData,
  };
}

function enforceEarlyRuinState() {
  if (!featureUnlocked("processing")) {
    replaceFunctionalObjectWithRuin(
      maps.farm,
      (obj) => obj.type === "processor" && obj.machineId === "farmProcessor",
      {
        name: "废弃加工桶",
        featureId: "processing",
        repairedType: "processor",
        repairedName: "加工桶",
        machineId: "farmProcessor",
        hint: "旧加工桶还能修，但现在先把第一批菜种出来。",
      },
    );
  }
  if (!featureUnlocked("construction")) {
    replaceFunctionalObjectWithRuin(
      maps.farm,
      (obj) => obj.type === "upgradeBoard",
      {
        name: "旧扩建公告牌",
        featureId: "construction",
        repairedType: "upgradeBoard",
        repairedName: "扩建公告牌",
        hint: "公告牌还没修好，第一周先完成种植和出货。",
      },
    );
    replaceFunctionalObjectWithRuin(
      maps.village,
      (obj) => obj.type === "upgradeBoard",
      {
        name: "木匠旧公告牌",
        featureId: "construction",
        repairedType: "upgradeBoard",
        repairedName: "木匠公告牌",
        hint: "木匠工具还没运回来。第一周先证明农场能稳定出货。",
      },
    );
  }
  if (!featureUnlocked("villageMarket")) {
    replaceFunctionalObjectWithRuin(
      maps.village,
      (obj) => obj.type === "shop",
      {
        name: "停业杂货铺",
        featureId: "villageMarket",
        repairedType: "shop",
        repairedName: "村庄杂货铺",
        hint: "门口还堆着旧木板。第一次出货睡觉结算后，何涛会帮忙重新开门。",
      },
    );
  }
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloneMapForSave(map) {
  return cloneValue({
    id: map.id,
    name: map.name,
    width: map.width,
    height: map.height,
    tileSize: map.tileSize,
    spawn: map.spawn,
    layers: map.layers,
    objects: map.objects,
  });
}

function serializeMaps() {
  return Object.fromEntries(Object.entries(maps).map(([mapId, map]) => [mapId, cloneMapForSave(map)]));
}

function restoreSavedMaps(savedMaps) {
  const result = { any: false, farm: false };
  if (!savedMaps || typeof savedMaps !== "object") return result;
  for (const [mapId, savedMap] of Object.entries(savedMaps)) {
    if (!maps[mapId]) continue;
    try {
      const restored = validateImportedMap({ ...savedMap, id: mapId });
      const nextMap = { ...restored, id: mapId };
      assertMapCriticalTilesOpen(nextMap, mapId);
      maps[mapId] = nextMap;
      result.any = true;
      if (mapId === "farm") result.farm = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "未知错误";
      addLog(`${mapId} 地图读取失败，已保留默认地图：${message}`);
    }
  }
  return result;
}

function applyFarmUpgrades() {
  const map = maps.farm;
  for (const upgradeId of UPGRADE_IDS) {
    if (state.upgrades[upgradeId]) FARM_UPGRADES[upgradeId].apply(map);
  }
}

function tileCenter(tileX, tileY) {
  return {
    x: tileX * TILE_SIZE + TILE_SIZE / 2,
    y: tileY * TILE_SIZE + TILE_SIZE / 2,
  };
}

const startPosition = tileCenter(maps.farm.spawn.x, maps.farm.spawn.y);

const state = {
  mapId: "farm",
  player: {
    x: startPosition.x,
    y: startPosition.y,
    w: 18,
    h: 24,
    speed: DEFAULT_PLAYER_SPEED,
    facing: "down",
  },
  dynamicObjects: [],
  selectedTool: "hand",
  selectedSeed: DEFAULT_CROP_ID,
  wateringCanWater: WATERING_CAN_CAPACITY,
  inventory: createDefaultInventory(),
  abilities: createDefaultAbilities(),
  day: 1,
  timeMinutes: DAY_START_MINUTES,
  energy: MAX_ENERGY,
  weather: "sunny",
  tomorrowWeather: "rainy",
  dailyOrder: createDailyOrder(1),
  machines: createDefaultMachines(),
  build: createDefaultBuildState(),
  npcs: createDefaultNpcs(),
  quests: createDefaultQuests(),
  upgrades: createDefaultUpgrades(),
  mailbox: createDefaultMailState(),
  collection: createDefaultCollection(),
  achievements: createDefaultAchievements(),
  settings: createDefaultSettings(),
  story: createDefaultStoryState(),
  camera: { x: 0, y: 0 },
  message: "",
};

let autosaveTimer = null;
let inventoryOverlayOpen = false;
let systemMenuOpen = false;
let devPanelVisible = false;
let journalOverlayOpen = false;
let journalActiveTab = "calendar";
let buildOverlayOpen = false;
let taskOverlayOpen = false;
let taskActiveTab = "current";

const JOURNAL_TABS = [
  { id: "calendar", label: "日历" },
  { id: "collection", label: "图鉴" },
  { id: "achievements", label: "成就" },
  { id: "album", label: "村庄变化" },
  { id: "alerts", label: "邮件 / 提醒" },
];

const TASK_TABS = [
  { id: "current", label: "当前目标" },
  { id: "mainline", label: "主线树" },
  { id: "sidequests", label: "已接支线" },
  { id: "playthrough", label: "通关验收" },
];

function currentMap() {
  return maps[state.mapId];
}

function mapRulesFor(mapId = state.mapId) {
  return MAP_RULES[mapId] ?? DEFAULT_MAP_RULES;
}

function currentMapRules() {
  return mapRulesFor(state.mapId);
}

function canFarmOnMap(mapId = state.mapId) {
  return mapRulesFor(mapId).canFarm;
}

function canFarmOnCurrentMap() {
  return canFarmOnMap(state.mapId);
}

function canBuildOnMap(mapId = state.mapId) {
  return mapRulesFor(mapId).canBuild;
}

function canBuildOnCurrentMap() {
  return canBuildOnMap(state.mapId);
}

function objectBelongsToMap(object, mapId = state.mapId) {
  return Boolean(object && (!object.mapId || object.mapId === mapId));
}

function dynamicObjectMapId(object) {
  if (object?.type === "crop") return CROP_MAP_ID;
  return maps[object?.mapId] ? object.mapId : CROP_MAP_ID;
}

function dynamicObjectBelongsToMap(object, mapId = state.mapId) {
  return Boolean(object && dynamicObjectMapId(object) === mapId);
}

function npcMapId(npc) {
  return maps[npc?.mapId] ? npc.mapId : DEFAULT_NPC_MAP_ID;
}

function npcBelongsToMap(npc, mapId = state.mapId) {
  return Boolean(npc && npcMapId(npc) === mapId);
}

function addLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  ui.log.append(li);
  while (ui.log.children.length > 9) ui.log.firstElementChild.remove();
}

function resetDialogPaging() {
  dialogState.pages = [];
  dialogState.index = 0;
  ui.dialogNextBtn.hidden = true;
}

function showDialog(title, content) {
  resetDialogPaging();
  ui.dialogTitle.textContent = title;
  ui.dialogContent.replaceChildren();
  if (content instanceof Node) {
    ui.dialogContent.append(content);
  } else if (Array.isArray(content)) {
    const list = document.createElement("ul");
    for (const item of content) {
      const li = document.createElement("li");
      li.textContent = item;
      list.append(li);
    }
    ui.dialogContent.append(list);
  } else {
    ui.dialogContent.textContent = content;
  }
  ui.dialogBox.hidden = false;
  keys.clear();
  playSound("dialog");
}

function renderPagedDialog() {
  ui.dialogContent.replaceChildren();
  const page = dialogState.pages[dialogState.index] ?? "";
  const paragraph = document.createElement("p");
  paragraph.className = "dialog-page";
  paragraph.textContent = page;
  ui.dialogContent.append(paragraph);

  if (dialogState.pages.length > 1) {
    const progress = document.createElement("span");
    progress.className = "dialog-progress";
    progress.textContent = `${dialogState.index + 1}/${dialogState.pages.length}`;
    ui.dialogContent.append(progress);
  }

  ui.dialogNextBtn.hidden = false;
  ui.dialogNextBtn.textContent = dialogState.index < dialogState.pages.length - 1 ? "继续" : "完成";
}

function showPagedDialog(title, pages) {
  const normalizedPages = pages.flatMap((page) => (Array.isArray(page) ? page : [page])).map((page) => String(page ?? "").trim()).filter(Boolean);
  if (normalizedPages.length === 0) {
    showDialog(title, "");
    return;
  }
  ui.dialogTitle.textContent = title;
  dialogState.pages = normalizedPages;
  dialogState.index = 0;
  ui.dialogBox.hidden = false;
  keys.clear();
  renderPagedDialog();
  playSound("dialog");
}

function advanceDialog() {
  if (dialogState.pages.length === 0) return false;
  if (dialogState.index < dialogState.pages.length - 1) {
    dialogState.index += 1;
    renderPagedDialog();
    playSound("dialog");
    return true;
  }
  closeDialog();
  return true;
}

function closeDialog() {
  ui.dialogBox.hidden = true;
  resetDialogPaging();
  canvas.focus();
}

function ensureAudioContext() {
  if (!state.settings.soundEnabled) return null;
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!audioContext) audioContext = new AudioContextCtor();
  if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  return audioContext;
}

function playSound(type) {
  const context = ensureAudioContext();
  const pattern = SOUND_PATTERNS[type];
  if (!context || !pattern) return;
  const now = context.currentTime;
  for (const note of pattern) {
    const start = now + (note.delay ?? 0);
    const duration = note.duration ?? 0.06;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = note.wave ?? "triangle";
    oscillator.frequency.setValueAtTime(note.frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(note.gain ?? 0.03, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }
}

function addVisualEffect(tile, type, options = {}) {
  if (!state.settings.effectsEnabled || !isTileInMap(tile)) return;
  visualEffects.push({
    x: tile.x,
    y: tile.y,
    type,
    color: options.color,
    label: options.label ?? "",
    createdAt: performance.now(),
    duration: options.duration ?? EFFECT_DURATIONS[type] ?? 600,
  });
  while (visualEffects.length > VISUAL_EFFECT_LIMIT) visualEffects.shift();
}

function addScreenEffect(type, label = "") {
  if (!state.settings.effectsEnabled) return;
  screenEffects.push({
    type,
    label,
    createdAt: performance.now(),
    duration: EFFECT_DURATIONS[type] ?? 800,
  });
  while (screenEffects.length > SCREEN_EFFECT_LIMIT) screenEffects.shift();
}

function renderToolButtons() {
  ui.toolButtons.innerHTML = "";
  if (ui.bottomToolSlots) ui.bottomToolSlots.innerHTML = "";
  for (const tool of TOOLS) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tool-button";
    button.dataset.toolId = tool.id;
    button.innerHTML = `<kbd>${tool.key}</kbd><span class="tool-button-label">${toolNameWithLevel(tool.id)}</span>`;
    button.title = `${tool.key}: ${tool.hint}`;
    button.addEventListener("click", () => selectTool(tool.id));
    ui.toolButtons.append(button);

    if (ui.bottomToolSlots) {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "bottom-tool-slot";
      slot.dataset.toolId = tool.id;
      slot.innerHTML = `<kbd>${tool.key}</kbd><span>${TOOL_SHORT_LABELS[tool.id] ?? tool.name}</span>`;
      slot.title = `${tool.key}: ${tool.hint}`;
      slot.setAttribute("aria-label", `${tool.key} ${tool.name}`);
      slot.addEventListener("click", () => selectTool(tool.id));
      ui.bottomToolSlots.append(slot);
    }
  }
}

function renderSeedOptions() {
  const selectedSeed = cropDef(state.selectedSeed).id;
  ui.seedSelect.innerHTML = "";
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const option = document.createElement("option");
    option.value = cropId;
    const unlockText = isCropUnlocked(cropId) ? "" : ` · 第 ${def.unlockDay} 天/任务解锁`;
    option.textContent = `${def.seedName} (${state.inventory.seeds[cropId] ?? 0})${unlockText}`;
    option.selected = cropId === selectedSeed;
    ui.seedSelect.append(option);
  }
}

function updateToolHud() {
  const tool = toolsById[state.selectedTool] ?? toolsById.hand;
  const capacity = wateringCanCapacityForStory();
  const upgradedTools = TOOL_UPGRADE_IDS.filter((toolId) => toolLevel(toolId) > 1).map((toolId) => toolNameWithLevel(toolId));
  ui.currentTool.textContent = toolNameWithLevel(tool.id);
  ui.goldCount.textContent = `${state.inventory.gold}g`;
  ui.seedCount.textContent = String(totalCropCount(state.inventory.seeds));
  ui.cropCount.textContent = String(totalCropCount(state.inventory.crops) + totalGoodCount(state.inventory.goods) + totalFishCount(state.inventory.fish));
  ui.shipmentCount.textContent = String(
    totalCropCount(state.inventory.shippedCrops) + totalGoodCount(state.inventory.shippedGoods) + totalFishCount(state.inventory.shippedFish),
  );
  ui.waterCount.textContent = `${state.wateringCanWater}/${capacity}`;
  ui.abilityCount.textContent = `体力${maxEnergy()} · 水质${waterQualityLabel()} · ${upgradedTools.length > 0 ? upgradedTools.join("/") : "工具Lv1"}`;
  if (ui.bottomToolName) ui.bottomToolName.textContent = toolNameWithLevel(tool.id);
  if (ui.bottomToolMeta) ui.bottomToolMeta.textContent = "I 背包 · Space 使用";
  renderSeedOptions();
  for (const button of ui.toolButtons.querySelectorAll(".tool-button")) {
    const buttonToolId = button.dataset.toolId;
    const label = button.querySelector(".tool-button-label");
    const buttonTool = toolsById[buttonToolId];
    const cost = toolCostFor(buttonToolId);
    if (label) label.textContent = toolNameWithLevel(buttonToolId);
    if (buttonTool) button.title = `${buttonTool.key}: ${buttonTool.hint}${cost ? ` · 体力 ${cost.energy} · ${cost.minutes} 分钟` : ""}`;
    button.classList.toggle("is-selected", buttonToolId === tool.id);
  }
  if (ui.bottomToolSlots) {
    for (const slot of ui.bottomToolSlots.querySelectorAll(".bottom-tool-slot")) {
      const slotToolId = slot.dataset.toolId;
      const slotTool = toolsById[slotToolId];
      const cost = toolCostFor(slotToolId);
      if (slotTool) slot.title = `${slotTool.key}: ${slotTool.hint}${cost ? ` · 体力 ${cost.energy} · ${cost.minutes} 分钟` : ""}`;
      slot.classList.toggle("is-selected", slotToolId === tool.id);
      slot.setAttribute("aria-pressed", slotToolId === tool.id ? "true" : "false");
    }
  }
}

function updateFeedbackHud() {
  ui.soundToggle.checked = state.settings.soundEnabled;
  ui.effectStatus.textContent = state.settings.effectsEnabled ? "视觉开启" : "视觉关闭";
  updateSystemMenuHud();
}

function updateSystemMenuHud() {
  if (ui.systemSoundBtn) {
    ui.systemSoundBtn.textContent = state.settings.soundEnabled ? "关闭音效" : "开启音效";
    ui.systemSoundBtn.setAttribute("aria-pressed", state.settings.soundEnabled ? "true" : "false");
  }
  if (ui.systemDevPanelBtn) {
    ui.systemDevPanelBtn.textContent = devPanelVisible ? "隐藏开发面板 (F2)" : "显示开发面板 (F2)";
    ui.systemDevPanelBtn.setAttribute("aria-pressed", devPanelVisible ? "true" : "false");
  }
}

function setSystemMenuVisible(visible) {
  systemMenuOpen = Boolean(visible);
  if (ui.systemMenuOverlay) ui.systemMenuOverlay.hidden = !systemMenuOpen;
  if (systemMenuOpen) updateSystemMenuHud();
}

function toggleSystemMenu() {
  setSystemMenuVisible(!systemMenuOpen);
}

function setDevPanelVisible(visible, options = {}) {
  devPanelVisible = Boolean(visible);
  if (ui.appShell) ui.appShell.classList.toggle("is-dev-panel-visible", devPanelVisible);
  updateSystemMenuHud();
  if (!options.silent) addLog(`开发面板：${devPanelVisible ? "显示" : "隐藏"}。`);
}

function toggleDevPanel() {
  setDevPanelVisible(!devPanelVisible);
}

function closeTopOverlay() {
  if (fishing.active) {
    cancelFishing();
    return true;
  }
  if (!ui.dialogBox.hidden) {
    closeDialog();
    return true;
  }
  if (inventoryOverlayOpen) {
    setInventoryOverlayVisible(false);
    return true;
  }
  if (taskOverlayOpen) {
    setTaskOverlayVisible(false);
    return true;
  }
  if (journalOverlayOpen) {
    setJournalOverlayVisible(false);
    return true;
  }
  if (buildOverlayOpen) {
    setBuildOverlayVisible(false);
    return true;
  }
  if (state.build.placing) {
    setBuildPlacement(false);
    return true;
  }
  if (systemMenuOpen) {
    setSystemMenuVisible(false);
    return true;
  }
  return false;
}

function setInventoryListVisible(container, visible) {
  if (!container) return;
  const block = container.parentElement;
  if (block) {
    block.hidden = !visible;
    block.setAttribute("aria-hidden", visible ? "false" : "true");
  }
}

function renderNamedCountList(container, ids, counts, labelForId) {
  if (!container) return 0;
  container.innerHTML = "";
  let rendered = 0;
  for (const id of ids) {
    const count = Number(counts?.[id] ?? 0);
    if (count <= 0) continue;
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = labelForId(id);
    const value = document.createElement("strong");
    value.textContent = String(count);
    item.append(label, value);
    container.append(item);
    rendered += 1;
  }
  setInventoryListVisible(container, rendered > 0);
  return rendered;
}

function renderCountList(container, counts, labelType) {
  return renderNamedCountList(container, CROP_IDS, counts, (cropId) => {
    const def = cropDef(cropId);
    return labelType === "seed" ? def.seedName : def.name;
  });
}

function renderGoodCountList(container, counts) {
  return renderNamedCountList(container, PROCESSED_GOOD_IDS, counts, (goodId) => processedGoodDef(goodId).name);
}

function renderResourceCountList(container, counts) {
  return renderNamedCountList(container, RESOURCE_IDS, counts, (resourceId) => resourceDef(resourceId).name);
}

function renderFishCountList(container, counts) {
  return renderNamedCountList(container, FISH_IDS, counts, (fishId) => fishDef(fishId).name);
}

function updateInventoryHud() {
  const capacity = wateringCanCapacityForStory();
  const selectedSeed = cropDef(state.selectedSeed);
  const seedCount = state.inventory.seeds[selectedSeed.id] ?? 0;
  if (ui.inventoryGold) ui.inventoryGold.textContent = `${state.inventory.gold}g`;
  if (ui.inventoryOverlayGold) ui.inventoryOverlayGold.textContent = `${state.inventory.gold}g`;
  if (ui.inventoryCurrentTool) ui.inventoryCurrentTool.textContent = toolNameWithLevel(state.selectedTool);
  if (ui.inventoryCurrentSeed) ui.inventoryCurrentSeed.textContent = `${selectedSeed.seedName} ${seedCount}`;
  if (ui.inventoryWaterStatus) ui.inventoryWaterStatus.textContent = `${state.wateringCanWater}/${capacity}`;
  if (ui.inventoryEnergyStatus) ui.inventoryEnergyStatus.textContent = `${state.energy}/${maxEnergy()}`;
  renderCountList(ui.seedInventoryList, state.inventory.seeds, "seed");
  renderCountList(ui.cropInventoryList, state.inventory.crops, "crop");
  renderGoodCountList(ui.goodsInventoryList, state.inventory.goods);
  renderFishCountList(ui.fishInventoryList, state.inventory.fish);
  renderResourceCountList(ui.resourceInventoryList, state.inventory.resources);
  renderCountList(ui.shipmentInventoryList, state.inventory.shippedCrops, "shipment");
  renderGoodCountList(ui.goodsShipmentInventoryList, state.inventory.shippedGoods);
  renderFishCountList(ui.fishShipmentInventoryList, state.inventory.shippedFish);
  renderCountList(ui.inventoryOverlaySeedList, state.inventory.seeds, "seed");
  renderCountList(ui.inventoryOverlayCropList, state.inventory.crops, "crop");
  renderGoodCountList(ui.inventoryOverlayGoodsList, state.inventory.goods);
  renderFishCountList(ui.inventoryOverlayFishList, state.inventory.fish);
  renderResourceCountList(ui.inventoryOverlayResourceList, state.inventory.resources);
  renderCountList(ui.inventoryOverlayShipmentList, state.inventory.shippedCrops, "shipment");
  renderGoodCountList(ui.inventoryOverlayGoodsShipmentList, state.inventory.shippedGoods);
  renderFishCountList(ui.inventoryOverlayFishShipmentList, state.inventory.shippedFish);
}

function setInventoryOverlayVisible(visible) {
  inventoryOverlayOpen = Boolean(visible);
  if (ui.inventoryOverlay) ui.inventoryOverlay.hidden = !inventoryOverlayOpen;
  if (inventoryOverlayOpen) updateInventoryHud();
}

function toggleInventoryOverlay() {
  setInventoryOverlayVisible(!inventoryOverlayOpen);
}

function normalizeJournalTab(tabId) {
  return JOURNAL_TABS.some((tab) => tab.id === tabId) ? tabId : JOURNAL_TABS[0].id;
}

function cloneForJournal(node) {
  if (!node) return null;
  const clone = node.cloneNode(true);
  if (clone.nodeType === Node.ELEMENT_NODE) {
    clone.removeAttribute("id");
    clone.hidden = false;
    clone.removeAttribute("aria-hidden");
    for (const child of clone.querySelectorAll("[id]")) child.removeAttribute("id");
    for (const child of clone.querySelectorAll("[hidden]")) {
      child.hidden = false;
      child.removeAttribute("aria-hidden");
    }
  }
  return clone;
}

function journalSection(title, meta = "") {
  const section = document.createElement("section");
  section.className = "journal-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  if (meta) {
    const copy = document.createElement("p");
    copy.className = "journal-meta";
    copy.textContent = meta;
    section.append(copy);
  }
  return section;
}

function appendJournalClone(parent, node) {
  const clone = cloneForJournal(node);
  if (clone) parent.append(clone);
}

function fishLocationLabel(locationId) {
  return {
    farmPond: "农场池塘",
    villagePond: "村庄池塘",
    mountainStream: "山溪",
  }[locationId] ?? locationId;
}

function fishSeasonLabel(def) {
  if (!def?.seasons || def.seasons.length === SEASON_IDS.length) return "全年";
  return def.seasons.map((seasonId) => SEASONS[seasonId]?.label ?? seasonId).join("、");
}

function waterQualityRequirementText(level) {
  const normalized = normalizeWaterQuality(level);
  if (normalized <= 0) return "污浊水质也可见";
  if (normalized === 1) return "村塘清淤 Lv.1 后出现";
  if (normalized === 2) return "村塘清淤 Lv.2 或水渠工程后出现";
  return "村塘清淤 Lv.3 或土地庙最终收束后出现";
}

function fishIconDescriptor(fishId) {
  const def = fishDef(fishId);
  return {
    group: "fish",
    id: fishId,
    state: VISUAL_STATES.default,
    label: def.name,
    assetKey: `fish/${fishId}`,
    assetPath: artAssetPath("fish", fishId),
    fallbackColor: def.color,
  };
}

function fishIconElement(fishId) {
  const descriptor = fishIconDescriptor(fishId);
  const icon = document.createElement("span");
  icon.className = "fish-icon";
  icon.style.setProperty("--fish-color", descriptor.fallbackColor);
  const image = getArtAsset(descriptor.assetPath);
  if (image) {
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = "";
    icon.append(img);
  }
  return icon;
}

function renderJournalCalendar() {
  const content = document.createDocumentFragment();
  const calendar = journalSection("日历", `${ui.seasonReadout.textContent} · ${formatTime(state.timeMinutes)} · ${WEATHER[state.weather]?.label ?? state.weather}`);
  appendJournalClone(calendar, ui.seasonDayReadout);
  appendJournalClone(calendar, ui.eventReadout);
  appendJournalClone(calendar, ui.calendarGrid);
  content.append(calendar);

  const events = journalSection("节气事件");
  appendJournalClone(events, ui.eventList);
  content.append(events);

  const crops = journalSection("当季作物");
  appendJournalClone(crops, ui.seasonCropList);
  content.append(crops);
  return content;
}

function renderJournalCollection() {
  const progress = collectionProgress();
  const content = document.createDocumentFragment();
  const crops = journalSection("作物图鉴", `${progress.completed}/${progress.total}`);
  appendJournalClone(crops, ui.collectionList);
  content.append(crops);

  const fish = journalSection("水产图鉴", `当前水质：${waterQualityLabel()}。水质越好，可见水产越多。`);
  const locationSummary = document.createElement("p");
  locationSummary.className = "journal-meta";
  locationSummary.textContent = ["farmPond", "villagePond", "mountainStream"]
    .map((locationId) => `${fishLocationLabel(locationId)} ${fishUnlockSummaryForLocation(locationId).label}`)
    .join(" · ");
  fish.append(locationSummary);
  const list = document.createElement("ul");
  list.className = "collection-list";
  for (const fishId of FISH_IDS) {
    const def = fishDef(fishId);
    const caught = (state.inventory.fish[fishId] ?? 0) + (state.inventory.shippedFish[fishId] ?? 0);
    const available = currentWaterQuality() >= def.minWaterQuality;
    const item = document.createElement("li");
    item.classList.toggle("is-complete", caught > 0);
    const label = document.createElement("span");
    label.className = "fish-collection-label";
    label.append(fishIconElement(fishId), document.createTextNode(def.name));
    const status = document.createElement("span");
    status.className = "collection-status";
    status.textContent = `${caught > 0 ? `已获得 ${caught}` : available ? "可钓" : `水质 ${def.minWaterQuality} 解锁`} / ${def.sellPrice}g / 地点：${def.locations.map(fishLocationLabel).join("、")} / 季节：${fishSeasonLabel(def)} / 条件：${waterQualityRequirementText(def.minWaterQuality)}`;
    item.append(label, status);
    list.append(item);
  }
  fish.append(list);
  content.append(fish);
  return content;
}

function renderJournalAchievements() {
  const content = document.createDocumentFragment();
  const achievements = journalSection("成就", ui.achievementCount.textContent);
  appendJournalClone(achievements, ui.achievementList);
  content.append(achievements);

  const score = journalSection("农场评价", `${ui.farmScoreValue.textContent} · ${ui.farmScoreRank.textContent}`);
  appendJournalClone(score, ui.farmScoreList);
  appendJournalClone(score, ui.farmScoreNextGoal);
  content.append(score);
  return content;
}

function renderJournalAlbum() {
  const content = document.createDocumentFragment();
  const album = journalSection(
    "村庄变化手册",
    `${ui.albumProgress.textContent} · 记录触发来源、完成状态和实际改变。`,
  );
  appendJournalClone(album, ui.albumList);
  content.append(album);

  const issues = journalSection(
    "现实议题进度",
    `村情目标 ${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length} · 水质：${waterQualityLabel()}`,
  );
  const issueList = document.createElement("ul");
  issueList.className = "album-list";
  for (const goalId of VILLAGE_ISSUE_GOAL_IDS) {
    const goal = VILLAGE_ISSUE_GOALS[goalId];
    const item = document.createElement("li");
    item.classList.toggle("is-unlocked", villageIssueGoalComplete(goalId));
    const copy = document.createElement("div");
    copy.className = "album-copy";
    const title = document.createElement("strong");
    title.textContent = `${goal.issue} · ${goal.title}`;
    const detail = document.createElement("span");
    detail.textContent = villageIssueGoalComplete(goalId) ? goal.result : `未完成。入口：村庄广场村情记录板；需求：${villageIssueGoalCostText(goal)}。`;
    copy.append(title, detail);
    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = villageIssueGoalComplete(goalId) ? "已改变" : "待推进";
    item.append(copy, status);
    issueList.append(item);
  }
  issues.append(issueList);
  content.append(issues);
  return content;
}

function renderJournalAlerts() {
  const content = document.createDocumentFragment();
  const letters = availableMailLetters();
  const mail = journalSection("邮件", `${unreadMailCount()} 封未读。阅读和领取附件仍在农舍邮箱完成。`);
  const mailList = document.createElement("ul");
  mailList.className = "alert-list";
  if (letters.length === 0) {
    const empty = document.createElement("li");
    empty.dataset.level = "ok";
    empty.textContent = "邮箱里现在没有信件。";
    mailList.append(empty);
  }
  for (const letter of [...letters].reverse()) {
    const read = state.mailbox.readIds.includes(letter.id);
    const rewardText = mailRewardText(letter);
    const rewardState = rewardText === "无" ? "无附件" : state.mailbox.claimedIds.includes(letter.id) ? "附件已领取" : `附件 ${rewardText}`;
    const item = document.createElement("li");
    item.dataset.level = read ? "ok" : "high";
    item.textContent = `${read ? "已读" : "未读"} · 第 ${letter.day} 天 · ${letter.from} · ${letter.title} · ${rewardState}`;
    mailList.append(item);
  }
  mail.append(mailList);
  content.append(mail);

  const alerts = journalSection("提醒", `${ui.alertCount.textContent} 项需要关注`);
  appendJournalClone(alerts, ui.alertList);
  content.append(alerts);
  return content;
}

function renderJournalOverlay(tabId = journalActiveTab) {
  if (!ui.journalContent || !ui.journalTabs) return;
  journalActiveTab = normalizeJournalTab(tabId);
  for (const button of ui.journalTabs.querySelectorAll("button[data-tab]")) {
    const active = button.dataset.tab === journalActiveTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  }
  ui.journalContent.replaceChildren();
  const content =
    journalActiveTab === "collection"
      ? renderJournalCollection()
      : journalActiveTab === "achievements"
        ? renderJournalAchievements()
        : journalActiveTab === "album"
          ? renderJournalAlbum()
          : journalActiveTab === "alerts"
            ? renderJournalAlerts()
            : renderJournalCalendar();
  ui.journalContent.append(content);
}

function updateJournalOverlay() {
  if (journalOverlayOpen) renderJournalOverlay(journalActiveTab);
}

function selectJournalTab(tabId) {
  renderJournalOverlay(tabId);
}

function setJournalOverlayVisible(visible, tabId = journalActiveTab) {
  journalOverlayOpen = Boolean(visible);
  journalActiveTab = normalizeJournalTab(tabId);
  if (ui.journalOverlay) ui.journalOverlay.hidden = !journalOverlayOpen;
  if (journalOverlayOpen) {
    updateAllHud();
    keys.clear();
  } else {
    canvas.focus();
  }
}

function toggleJournalOverlay() {
  setJournalOverlayVisible(!journalOverlayOpen, journalOverlayOpen ? journalActiveTab : "calendar");
}

function buildOverlaySection(title, meta = "") {
  const section = document.createElement("section");
  section.className = "build-overlay-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  if (meta) {
    const copy = document.createElement("p");
    copy.className = "journal-meta";
    copy.textContent = meta;
    section.append(copy);
  }
  return section;
}

function buildOverlayButton(label, onClick, { disabled = false, title = "" } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = disabled;
  if (title) button.title = title;
  if (!disabled) button.addEventListener("click", onClick);
  return button;
}

function renderBuildOverlayItemRow(itemId) {
  const def = buildableDef(itemId);
  const owned = state.build.inventory[def.id] ?? 0;
  const selected = state.build.selectedItem === def.id;
  const constructionUnlocked = featureUnlocked("construction");
  const canPlaceHere = constructionUnlocked && canBuildOnCurrentMap();
  const row = document.createElement("div");
  row.className = "build-overlay-row";
  row.classList.toggle("is-selected", selected);

  const copy = document.createElement("div");
  copy.className = "build-overlay-copy";
  const title = document.createElement("strong");
  title.textContent = `${def.name}${selected ? " · 当前" : ""}`;
  const meta = document.createElement("span");
  meta.textContent = `${buildableGroupLabel(def.id)} · ${def.price}g · 库存 ${owned} · ${buildMapAvailabilityText()}`;
  const description = document.createElement("small");
  description.textContent = `${def.description} · ${buildRegionRecommendationText(def.id)}`;
  copy.append(title, meta, description);

  const actions = document.createElement("div");
  actions.className = "build-overlay-actions";
  actions.append(
    buildOverlayButton("选择", () => {
      selectBuildItem(def.id);
      renderBuildOverlay();
    }),
    buildOverlayButton(
      `买 1`,
      () => {
        selectBuildItem(def.id);
        buyBuildable(def.id, 1, { openShop: false });
        renderBuildOverlay();
      },
      { disabled: !constructionUnlocked || state.inventory.gold < def.price, title: constructionUnlocked ? "金币不足" : featureRequirementText("construction") },
    ),
    buildOverlayButton(
      `买 5`,
      () => {
        selectBuildItem(def.id);
        buyBuildable(def.id, 5, { openShop: false });
        renderBuildOverlay();
      },
      { disabled: !constructionUnlocked || state.inventory.gold < def.price * 5, title: constructionUnlocked ? "金币不足" : featureRequirementText("construction") },
    ),
    buildOverlayButton(
      "放置",
      () => {
        selectBuildItem(def.id);
        setBuildOverlayVisible(false);
        setBuildPlacement(true);
      },
      {
        disabled: !canPlaceHere || owned <= 0,
        title: owned <= 0 ? "库存不足" : canPlaceHere ? "进入放置模式" : "回到农场放置",
      },
    ),
  );

  row.append(copy, actions);
  return row;
}

function renderBuildOverlayItemSection(category) {
  const label = category === "decorations" ? "装饰" : "设施";
  const section = buildOverlaySection(label, `库存：${buildableCategorySummary(category)}`);
  const list = document.createElement("div");
  list.className = "build-overlay-list";
  for (const itemId of buildableIdsForCategory(category)) list.append(renderBuildOverlayItemRow(itemId));
  section.append(list);
  return section;
}

function renderBuildOverlayPlacedSection() {
  const placed = placedBuildableEntries();
  const currentMapPlaced = placed.filter((entry) => entry.mapId === state.mapId);
  const section = buildOverlaySection("已摆放", `当前地图 ${currentMapPlaced.length} · 全部 ${placed.length}`);
  const list = document.createElement("div");
  list.className = "build-overlay-list";
  if (placed.length === 0) {
    const empty = document.createElement("p");
    empty.className = "journal-meta";
    empty.textContent = "还没有摆放设施或装饰。购买库存后，回到农场放置。";
    section.append(empty);
    return section;
  }

  for (const entry of [...currentMapPlaced, ...placed.filter((item) => item.mapId !== state.mapId)].slice(0, 10)) {
    const row = document.createElement("div");
    row.className = "build-overlay-row";
    const copy = document.createElement("div");
    copy.className = "build-overlay-copy";
    const title = document.createElement("strong");
    title.textContent = entry.def.name;
    const meta = document.createElement("span");
    meta.textContent = `${entry.map.name} (${entry.object.x}, ${entry.object.y}) · ${buildableGroupLabel(entry.itemId)}`;
    copy.append(title, meta);

    const machine = isMachineBuildableObject(entry.object) ? machineStateForObject(entry.object) : null;
    const blockedReason = recoverBlockedReason(entry.object, machine);
    const actions = document.createElement("div");
    actions.className = "build-overlay-actions";
    actions.append(
      buildOverlayButton(entry.mapId === state.mapId ? "定位" : "切换定位", () => {
        setBuildOverlayVisible(false);
        focusBuildableEntry(entry);
      }),
      buildOverlayButton(
        "移动",
        () => {
          setBuildOverlayVisible(false);
          recoverBuildableObject(entry.object, { mapId: entry.mapId, startPlacement: true });
        },
        { disabled: Boolean(blockedReason), title: blockedReason || "回收并进入放置模式" },
      ),
      buildOverlayButton(
        "回收",
        () => {
          recoverBuildableObject(entry.object, { mapId: entry.mapId });
          renderBuildOverlay();
        },
        { disabled: Boolean(blockedReason), title: blockedReason || "回收到建造库存" },
      ),
    );

    row.append(copy, actions);
    list.append(row);
  }
  section.append(list);
  return section;
}

function renderBuildOverlay() {
  if (!ui.buildOverlayContent) return;
  const selectedDef = buildableDef(state.build.selectedItem);
  const constructionUnlocked = featureUnlocked("construction");
  ui.buildOverlayContent.replaceChildren();

  const summary = document.createElement("div");
  summary.className = "build-overlay-summary";
  summary.innerHTML = `
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
    <span>当前 <strong>${selectedDef.name}</strong></span>
    <span>库存 <strong>${state.build.inventory[selectedDef.id] ?? 0}</strong></span>
    <span>状态 <strong>${constructionUnlocked ? (state.build.placing ? "放置中" : "可建造") : "未解锁"}</strong></span>
  `;
  ui.buildOverlayContent.append(summary);

  if (!constructionUnlocked) {
    const locked = buildOverlaySection("建造未开放", featureRequirementText("construction"));
    ui.buildOverlayContent.append(locked);
    return;
  }

  ui.buildOverlayContent.append(renderBuildOverlayItemSection("facilities"));
  ui.buildOverlayContent.append(renderBuildOverlayItemSection("decorations"));
  ui.buildOverlayContent.append(renderBuildOverlayPlacedSection());
}

function updateBuildOverlay() {
  if (buildOverlayOpen) renderBuildOverlay();
}

function setBuildOverlayVisible(visible) {
  buildOverlayOpen = Boolean(visible);
  if (ui.buildOverlay) ui.buildOverlay.hidden = !buildOverlayOpen;
  if (buildOverlayOpen) {
    renderBuildOverlay();
    keys.clear();
  } else {
    canvas.focus();
  }
}

function toggleBuildOverlay() {
  setBuildOverlayVisible(!buildOverlayOpen);
}

function normalizeTaskTab(tabId) {
  return TASK_TABS.some((tab) => tab.id === tabId) ? tabId : TASK_TABS[0].id;
}

function taskOverlaySection(title, meta = "") {
  const section = document.createElement("section");
  section.className = "task-overlay-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  if (meta) {
    const copy = document.createElement("p");
    copy.className = "journal-meta";
    copy.textContent = meta;
    section.append(copy);
  }
  return section;
}

function taskOverlayList() {
  const list = document.createElement("ul");
  list.className = "task-overlay-list";
  return list;
}

function taskOverlayRow(title, details = [], statusText = "", status = "") {
  const row = document.createElement("li");
  row.className = "task-overlay-row";
  if (status) row.dataset.status = status;

  const copy = document.createElement("span");
  copy.className = "task-overlay-copy";
  const label = document.createElement("strong");
  label.textContent = title;
  copy.append(label);

  for (const detailText of details.filter(Boolean)) {
    const detail = document.createElement("small");
    detail.textContent = detailText;
    copy.append(detail);
  }

  if (statusText) {
    const statusNode = document.createElement("span");
    statusNode.className = "task-overlay-status";
    statusNode.textContent = statusText;
    row.append(copy, statusNode);
  } else {
    row.append(copy);
  }
  return row;
}

function taskStatusForQuest(quest) {
  if (quest.status === "completed") return "ok";
  if (quest.status === "readyToTurnIn") return "ready";
  return "warn";
}

function renderTaskCurrent() {
  const content = document.createDocumentFragment();
  const phase = currentStoryPhase();
  const season = seasonInfoForDay();
  const objective = currentIncompleteStoryObjective();
  const target = currentStoryTargetInfo(objective);
  const targetLine = storyTargetLine(target);

  const overview = taskOverlaySection(
    "当前目标",
    `${phase.title} · ${season.label} · ${season.solarTerm.name} · 第 ${state.day} 天`,
  );
  const list = taskOverlayList();
  list.append(
    taskOverlayRow("当前季度主线", [phase.summary], phase.rewardText ? "有阶段回报" : "", objective ? "warn" : "ok"),
    taskOverlayRow(
      objective ? objective.label : "本阶段目标已完成",
      [objective ? objective.hint : phase.completeText],
      objective ? `${objective.current}/${objective.target}` : "完成",
      objective ? "warn" : "ok",
    ),
    taskOverlayRow("下一步行动", [objective ? objective.hint : "查看土地庙、路牌或进入下一阶段。"], "", objective ? "warn" : "ok"),
    taskOverlayRow("目标位置", [targetLine || "当前阶段没有明确地点，可查看路牌或土地庙提示。"], target ? "已定位" : "待确认", target ? "ok" : "blocked"),
    taskOverlayRow("推荐工具", [target?.tool || "按 E 交互；农田操作用底部工具栏切换工具。"], "", target?.tool ? "ok" : "warn"),
  );
  overview.append(list);
  content.append(overview);

  const mapHint = taskOverlaySection("小地图推荐点", "未手动设置目标时，小地图会优先高亮当前主线推荐位置。");
  const mapList = taskOverlayList();
  mapList.append(
    taskOverlayRow(
      target ? target.label : "暂无推荐点",
      [
        target
          ? `${maps[target.mapId]?.name ?? target.mapId} (${target.x},${target.y})${target.action ? ` · ${target.action}` : ""}`
          : "当前阶段已完成，推荐查看任务树或土地庙缺口。",
      ],
      target ? "推荐" : "",
      target ? "ok" : "warn",
    ),
  );
  mapHint.append(mapList);
  content.append(mapHint);

  const facilityGuidance = currentVillageFacilityGuidance();
  const facilitySection = taskOverlaySection(
    "设施修复 / 强化",
    "这里显示当前最适合处理的一座村庄设施；修复在村情记录板推进，强化在设施本体推进。",
  );
  const facilityList = taskOverlayList();
  if (facilityGuidance) {
    facilityList.append(
      taskOverlayRow(
        facilityGuidance.title,
        [facilityGuidance.detail, facilityGuidance.effect, storyTargetLine(facilityGuidance.target)],
        facilityGuidance.statusText,
        facilityGuidance.status,
      ),
      taskOverlayRow(
        "设施状态",
        [villageFacilityStateSummary(), "五种状态都会在村情记录板显示入口；可强化设施会在小地图和路牌同步推荐。"],
        "",
        villageFacilityCountAtLevel(1) > 0 ? "ok" : "warn",
      ),
      taskOverlayRow(
        "设施等级进度",
        [
          `已修复 ${villageFacilityCountAtLevel(1)}/${VILLAGE_ISSUE_GOAL_IDS.length}`,
          `强化一 ${villageFacilityCountAtLevel(2)}/${VILLAGE_ISSUE_GOAL_IDS.length}`,
          `强化二 ${villageFacilityCountAtLevel(3)}/${VILLAGE_ISSUE_GOAL_IDS.length}`,
        ],
        "",
        villageFacilityCountAtLevel(1) > 0 ? "ok" : "warn",
      ),
    );
  } else {
    facilityList.append(
      taskOverlayRow(
        "所有设施已完成强化路线",
        [`已修复 ${villageFacilityCountAtLevel(1)}/${VILLAGE_ISSUE_GOAL_IDS.length}`, "土地庙会在最终回顾中记录这些变化。"],
        "完成",
        "ok",
      ),
    );
  }
  facilitySection.append(facilityList);
  content.append(facilitySection);

  const consistency = taskOverlaySection("入口一致性", guidanceConsistencySummary());
  const consistencyList = taskOverlayList();
  for (const item of guidanceConsistencyItems()) {
    consistencyList.append(taskOverlayRow(item.label, [item.detail], item.status === "ok" ? "正常" : "关注", item.status));
  }
  consistency.append(consistencyList);
  content.append(consistency);
  return content;
}

function renderTaskMainline() {
  const content = document.createDocumentFragment();
  const phase = currentStoryPhase();
  const objectives = currentStoryObjectives();
  const doneCount = objectives.filter((objective) => objective.done).length;
  const section = taskOverlaySection("主线树", `${phase.title} · 只显示当前季度/阶段主线 · ${doneCount}/${objectives.length}`);
  const list = taskOverlayList();
  for (const objective of objectives) {
    const target = currentStoryTargetInfo(objective);
    list.append(
      taskOverlayRow(
        objective.label,
        [objective.hint, storyTargetLine(target)],
        objective.target === 1 ? (objective.done ? "完成" : "未完成") : `${objective.current}/${objective.target}`,
        objective.done ? "ok" : "warn",
      ),
    );
  }
  section.append(list);
  content.append(section);
  return content;
}

function renderTaskSidequests() {
  const content = document.createDocumentFragment();
  const quests = acceptedQuests();
  const section = taskOverlaySection("已接支线", "只有和对应村民对话接取过的支线会显示在这里。");

  if (quests.length === 0) {
    const empty = document.createElement("p");
    empty.className = "journal-meta";
    empty.textContent = "还没有接取支线。去村庄和林岚、何涛、柳青、楠楠或陈伯对话后，支线才会出现在任务面板。";
    section.append(empty);
    content.append(section);
    return content;
  }

  const list = taskOverlayList();
  for (const quest of quests) {
    const npc = state.npcs.find((item) => item.id === quest.npcId);
    list.append(
      taskOverlayRow(
        `${npc?.name ?? "村民"}：${quest.title}`,
        [
          questGoalText(quest),
          `进度 ${getQuestProgress(quest)}/${quest.target} · ${questDisplayStatusLabel(quest)}`,
          `奖励 ${questRewardText(quest)}`,
          questFacilityText(quest),
        ],
        questDisplayStatusLabel(quest),
        taskStatusForQuest(quest),
      ),
    );
  }
  section.append(list);
  content.append(section);
  return content;
}

function renderTaskPlaythrough() {
  const content = document.createDocumentFragment();
  const states = playthroughCheckpointStates();
  const okCount = states.filter((checkpoint) => checkpoint.status === "ok").length;
  const current = currentPlaythroughCheckpoint(states);
  const summary = taskOverlaySection(
    "通关验收",
    `${okCount}/${states.length} 个节点完成 · 当前验收：${current.title} · 这里只读展示，测试跳过仍在 F2 开发面板。`,
  );
  const list = taskOverlayList();
  for (const checkpoint of states) {
    list.append(
      taskOverlayRow(
        checkpoint.title,
        [
          checkpoint.description,
          `当前目标：${checkpoint.target}`,
          `入口位置：${checkpoint.entry}`,
          `需要：${checkpoint.needs}`,
          `完成奖励：${checkpoint.reward}`,
          `存档影响：${checkpoint.saveImpact}`,
          `下一步入口：${currentGuidanceActionLine()}`,
          guidanceConsistencySummary(),
          `验收状态：${checkpoint.doneCount}/${checkpoint.total} · ${playthroughRequirementLine(checkpoint)}`,
        ],
        firstYearCheckStatusLabel(checkpoint.status),
        checkpoint.status,
      ),
    );
  }
  summary.append(list);
  content.append(summary);

  const releaseSection = taskOverlaySection("v0.2.0 演示验收", release20ReadinessSummary());
  const releaseList = taskOverlayList();
  for (const item of release20AcceptanceItems()) {
    releaseList.append(taskOverlayRow(item.title, [item.detail, item.meta], firstYearCheckStatusLabel(item.status), item.status));
  }
  releaseSection.append(releaseList);
  content.append(releaseSection);
  return content;
}

function renderTaskOverlay(tabId = taskActiveTab) {
  if (!ui.taskOverlayContent || !ui.taskOverlayTabs) return;
  taskActiveTab = normalizeTaskTab(tabId);
  for (const button of ui.taskOverlayTabs.querySelectorAll("button[data-tab]")) {
    const active = button.dataset.tab === taskActiveTab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  }
  ui.taskOverlayContent.replaceChildren();
  const content =
    taskActiveTab === "mainline"
      ? renderTaskMainline()
      : taskActiveTab === "sidequests"
        ? renderTaskSidequests()
        : taskActiveTab === "playthrough"
          ? renderTaskPlaythrough()
          : renderTaskCurrent();
  ui.taskOverlayContent.append(content);
}

function updateTaskOverlay() {
  if (taskOverlayOpen) renderTaskOverlay(taskActiveTab);
}

function selectTaskTab(tabId) {
  renderTaskOverlay(tabId);
}

function setTaskOverlayVisible(visible, tabId = taskActiveTab) {
  taskOverlayOpen = Boolean(visible);
  taskActiveTab = normalizeTaskTab(tabId);
  if (ui.taskOverlay) ui.taskOverlay.hidden = !taskOverlayOpen;
  if (taskOverlayOpen) {
    renderTaskOverlay(taskActiveTab);
    keys.clear();
  } else {
    canvas.focus();
  }
}

function toggleTaskOverlay() {
  setTaskOverlayVisible(!taskOverlayOpen, taskOverlayOpen ? taskActiveTab : "current");
}

function cropStateCounts() {
  const crops = state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID));
  return {
    total: crops.length,
    ready: crops.filter((crop) => crop.ready).length,
    watered: crops.filter((crop) => crop.watered && !crop.ready).length,
    growing: crops.filter((crop) => !crop.ready).length,
    byType: Object.fromEntries(CROP_IDS.map((cropId) => [cropId, crops.filter((crop) => crop.cropId === cropId).length])),
  };
}

function machineIdForMapObject(mapId, object) {
  return object.machineId ?? `${mapId}:${object.x},${object.y}`;
}

function machineEntries() {
  const entries = [];
  for (const [mapId, map] of Object.entries(maps)) {
    for (const object of map.objects) {
      if (!objectBelongsToMap(object, mapId)) continue;
      if (!isMachineBuildableObject(object)) continue;
      const machineId = machineIdForMapObject(mapId, object);
      if (!state.machines[machineId]) state.machines[machineId] = createMachineState(machineId);
      entries.push({ mapId, map, object, machine: state.machines[machineId] });
    }
  }
  return entries;
}

function placedBuildableEntries() {
  const entries = [];
  for (const [mapId, map] of Object.entries(maps)) {
    for (const object of map.objects) {
      if (!objectBelongsToMap(object, mapId)) continue;
      const itemId = buildableItemIdForObject(object);
      if (!itemId || !isPlacedBuildableObject(object)) continue;
      entries.push({
        mapId,
        map,
        object,
        itemId,
        def: buildableDef(itemId),
      });
    }
  }
  return entries.sort((a, b) => {
    if (a.mapId !== b.mapId) return a.mapId.localeCompare(b.mapId);
    if (a.object.y !== b.object.y) return a.object.y - b.object.y;
    return a.object.x - b.object.x;
  });
}

function findBuildableFocusPosition(map, object) {
  const offsets = [
    [0, 1],
    [-1, 0],
    [1, 0],
    [0, -1],
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ];
  for (const [dx, dy] of offsets) {
    const tile = { x: object.x + dx, y: object.y + dy };
    if (tile.x < 0 || tile.y < 0 || tile.x >= map.width || tile.y >= map.height) continue;
    const position = tileCenter(tile.x, tile.y);
    if (canOccupy(map, position.x, position.y)) return { tile, position };
  }
  return findSafePlayerPosition(map, { x: object.x, y: object.y });
}

function faceTile(tile) {
  const player = playerTile();
  const dx = tile.x - player.x;
  const dy = tile.y - player.y;
  if (Math.abs(dx) > Math.abs(dy)) state.player.facing = dx > 0 ? "right" : "left";
  else if (dy !== 0) state.player.facing = dy > 0 ? "down" : "up";
}

function focusBuildableEntry(entry) {
  const map = maps[entry.mapId];
  if (!map) {
    addLog("定位失败：目标地图不存在。");
    playSound("error");
    return false;
  }
  const position = findBuildableFocusPosition(map, entry.object);
  if (!position) {
    addLog(`定位失败：${entry.def.name}附近没有可站立位置。`);
    playSound("error");
    return false;
  }

  if (editor.enabled) setEditorEnabled(false);
  if (state.build.placing) setBuildPlacement(false);
  closeDialog();
  state.mapId = entry.mapId;
  state.player.x = position.position.x;
  state.player.y = position.position.y;
  faceTile({ x: entry.object.x, y: entry.object.y });
  interaction.warpCooldown = 0.45;
  keys.clear();
  state.build.hoverTile = null;
  editor.hoverTile = null;
  updateAllHud();
  addToolFeedback({ x: entry.object.x, y: entry.object.y }, "定位", "good");
  addVisualEffect({ x: entry.object.x, y: entry.object.y }, "warp");
  addLog(`已定位到${entry.def.name}：${map.name} (${entry.object.x}, ${entry.object.y})。`);
  playSound("select");
  scheduleAutosave("定位建造对象");
  return true;
}

function appendDynamicStatusItem(title, detail, status = "idle") {
  const item = document.createElement("li");
  item.dataset.status = status;
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("span");
  copy.textContent = detail;
  item.append(heading, copy);
  ui.dynamicObjectList.append(item);
}

function updateDynamicHud() {
  const crops = cropStateCounts();
  const machines = machineEntries();
  const readyMachines = machines.filter((entry) => entry.machine.readyGoodId).length;
  const workingMachines = machines.filter((entry) => entry.machine.recipeId).length;

  ui.dynamicObjectCount.textContent = String(crops.total + machines.length);
  ui.dynamicCropStatus.textContent = `${crops.ready}/${crops.total}`;
  ui.dynamicMachineStatus.textContent = `${readyMachines}/${machines.length}`;
  ui.dynamicObjectList.innerHTML = "";

  appendDynamicStatusItem(
    "作物",
    crops.total > 0
      ? `总计 ${crops.total} 株，成熟 ${crops.ready}，已浇水 ${crops.watered}，生长中 ${crops.growing}。`
      : "当前地图没有种下的作物。",
    crops.ready > 0 ? "ready" : "idle",
  );

  for (const cropId of CROP_IDS) {
    const count = crops.byType[cropId] ?? 0;
    if (count <= 0) continue;
    appendDynamicStatusItem(cropDef(cropId).name, `${count} 株动态作物对象。`, "idle");
  }

  if (machines.length === 0) {
    appendDynamicStatusItem("加工设施", "当前没有加工设施对象。", "idle");
    return;
  }

  appendDynamicStatusItem(
    "加工设施",
    `总计 ${machines.length} 台，可领取 ${readyMachines}，加工中 ${workingMachines}，空闲 ${machines.length - readyMachines - workingMachines}。`,
    readyMachines > 0 ? "ready" : workingMachines > 0 ? "working" : "idle",
  );

  for (const entry of machines) {
    const { map, object, machine } = entry;
    const status = machine.readyGoodId ? "ready" : machine.recipeId ? "working" : "idle";
    appendDynamicStatusItem(
      object.name ?? "加工桶",
      `${map.name} (${object.x}, ${object.y}) · ${machineStatusText(machine)}`,
      status,
    );
  }
}

function createMiniActionButton(label, onClick, { disabled = false, title = "", danger = false } = {}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = danger ? "mini-action is-danger" : "mini-action";
  button.textContent = label;
  button.disabled = disabled;
  if (title) button.title = title;
  if (!disabled) button.addEventListener("click", onClick);
  return button;
}

function updateBuildHud() {
  const selectedDef = buildableDef(state.build.selectedItem);
  const selectedOwned = state.build.inventory[selectedDef.id] ?? 0;
  const buyOneCost = selectedDef.price;
  const buyFiveCost = selectedDef.price * 5;

  ui.buildModeStatus.textContent = state.build.placing ? "放置中" : "关闭";
  ui.buildModeBtn.textContent = state.build.placing ? "取消放置" : "放置模式";
  ui.buildModeBtn.classList.toggle("is-active", state.build.placing);
  ui.buildItemInfo.textContent = `${buildableGroupLabel(selectedDef.id)} · ${selectedDef.name} · ${selectedDef.price}g · 库存 ${selectedOwned} · ${selectedDef.description}`;
  ui.quickBuyBuildOneBtn.textContent = `买 1 (${buyOneCost}g)`;
  ui.quickBuyBuildOneBtn.disabled = state.inventory.gold < buyOneCost;
  ui.quickBuyBuildOneBtn.title = ui.quickBuyBuildOneBtn.disabled ? "金币不足" : `购买 1 个${selectedDef.name}`;
  ui.quickBuyBuildFiveBtn.textContent = `买 5 (${buyFiveCost}g)`;
  ui.quickBuyBuildFiveBtn.disabled = state.inventory.gold < buyFiveCost;
  ui.quickBuyBuildFiveBtn.title = ui.quickBuyBuildFiveBtn.disabled ? "金币不足" : `购买 5 个${selectedDef.name}`;
  ui.buildItemSelect.innerHTML = "";

  for (const itemId of BUILDABLE_IDS) {
    const def = buildableDef(itemId);
    const option = document.createElement("option");
    option.value = itemId;
    option.textContent = `${buildableGroupLabel(itemId)} / ${def.name} (${state.build.inventory[itemId] ?? 0})`;
    option.selected = itemId === state.build.selectedItem;
    ui.buildItemSelect.append(option);
  }

  ui.buildInventoryList.innerHTML = "";
  for (const itemId of BUILDABLE_IDS) {
    const def = buildableDef(itemId);
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = `${buildableGroupLabel(itemId)} · ${def.name}`;
    const value = document.createElement("strong");
    value.textContent = String(state.build.inventory[itemId] ?? 0);
    item.append(label, value);
    ui.buildInventoryList.append(item);
  }

  const placed = placedBuildableEntries();
  const currentMapPlaced = placed.filter((entry) => entry.mapId === state.mapId);
  ui.buildCurrentMapCount.textContent = String(currentMapPlaced.length);
  ui.buildPlacedCount.textContent = String(placed.length);
  ui.buildPlacedList.innerHTML = "";

  if (placed.length === 0) {
    const item = document.createElement("li");
    item.dataset.status = "idle";
    const heading = document.createElement("strong");
    heading.textContent = "未放置";
    const copy = document.createElement("span");
    copy.textContent = "建造商店购买后，在农场放置的对象会显示在这里。";
    item.append(heading, copy);
    ui.buildPlacedList.append(item);
    return;
  }

  const visibleEntries = [...currentMapPlaced, ...placed.filter((entry) => entry.mapId !== state.mapId)].slice(0, 8);
  for (const entry of visibleEntries) {
    const item = document.createElement("li");
    item.dataset.status = entry.def.category === "decorations" ? "idle" : "working";
    const heading = document.createElement("strong");
    heading.textContent = entry.def.name;
    const copy = document.createElement("span");
    copy.textContent = `${entry.map.name} (${entry.object.x}, ${entry.object.y}) · ${buildableGroupLabel(entry.itemId)}`;
    const machine = isMachineBuildableObject(entry.object) ? machineStateForObject(entry.object) : null;
    const blockedReason = recoverBlockedReason(entry.object, machine);
    const actions = document.createElement("div");
    actions.className = "build-row-actions";
    actions.append(
      createMiniActionButton(entry.mapId === state.mapId ? "定位" : "切换定位", () => focusBuildableEntry(entry)),
      createMiniActionButton("移动", () => recoverBuildableObject(entry.object, { mapId: entry.mapId, startPlacement: true }), {
        disabled: Boolean(blockedReason),
        title: blockedReason || "回收并进入放置模式",
      }),
      createMiniActionButton("回收", () => recoverBuildableObject(entry.object, { mapId: entry.mapId }), {
        disabled: Boolean(blockedReason),
        title: blockedReason || "回收到建造库存",
        danger: true,
      }),
    );
    item.append(heading, copy, actions);
    ui.buildPlacedList.append(item);
  }

  if (placed.length > visibleEntries.length) {
    const item = document.createElement("li");
    item.dataset.status = "idle";
    const heading = document.createElement("strong");
    heading.textContent = "更多";
    const copy = document.createElement("span");
    copy.textContent = `还有 ${placed.length - visibleEntries.length} 个已摆放对象未显示。`;
    item.append(heading, copy);
    ui.buildPlacedList.append(item);
  }
}

function collectionProgress() {
  let completed = 0;
  for (const cropId of CROP_IDS) {
    if (state.collection.harvested[cropId]) completed += 1;
    if (state.collection.shipped[cropId]) completed += 1;
  }
  return { completed, total: CROP_IDS.length * 2 };
}

function updateCollectionHud() {
  const progress = collectionProgress();
  ui.collectionProgress.textContent = `${progress.completed}/${progress.total}`;
  ui.collectionList.innerHTML = "";
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const harvested = state.collection.harvested[cropId];
    const shipped = state.collection.shipped[cropId];
    const item = document.createElement("li");
    item.classList.toggle("is-complete", harvested && shipped);

    const label = document.createElement("span");
    label.textContent = def.name;
    const status = document.createElement("span");
    status.className = "collection-status";
    status.textContent = `${harvested ? "已收获" : "未收获"} / ${shipped ? "已出货" : "未出货"}`;

    item.append(label, status);
    ui.collectionList.append(item);
  }
}

function updateAchievementHud() {
  let unlockedAny = false;
  for (const achievement of ACHIEVEMENTS) {
    if (state.achievements.unlockedIds.includes(achievement.id)) continue;
    if (!achievement.isUnlocked()) continue;
    state.achievements.unlockedIds.push(achievement.id);
    unlockedAny = true;
    addLog(`成就解锁：${achievement.title}`);
  }
  if (unlockedAny) scheduleAutosave("成就解锁");

  ui.achievementCount.textContent = `${state.achievements.unlockedIds.length}/${ACHIEVEMENTS.length}`;
  ui.achievementList.innerHTML = "";
  for (const achievement of ACHIEVEMENTS) {
    const unlocked = state.achievements.unlockedIds.includes(achievement.id);
    const item = document.createElement("li");
    item.classList.toggle("is-unlocked", unlocked);

    const copy = document.createElement("div");
    copy.className = "achievement-copy";
    const title = document.createElement("strong");
    title.textContent = achievement.title;
    const description = document.createElement("span");
    description.textContent = achievement.description;
    copy.append(title, description);

    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = unlocked ? "已解锁" : "未解锁";

    item.append(copy, status);
    ui.achievementList.append(item);
  }
}

function villageAlbumLockedHint(entryId) {
  return {
    firstShipment: "面对农场出货箱投入作物，睡觉结算后记录。",
    chapterOne: "第一次出货反馈后，到村庄修复停业杂货铺。",
    marketPrep: "完成村民任务并修复木匠公告牌，村口会开始搭棚。",
    stableMarket: "完成安心菜篮和茶铺试吃两类社区订单。",
    processing: "完成电商助农试单后，回农场修复并使用加工桶。",
    cooperative: "加工品出货结算后，到村庄合作社窗口提交样品。",
    villageIssues: "去村庄广场村情记录板，完成全部公共目标。",
    childCare: "在村情记录板推进“课后托管教室”。",
    youthWorkshop: "在村情记录板推进“青年返乡工坊”。",
    elderCare: "在村情记录板推进“老人互助饭点”。",
    clinicRoute: "在村情记录板推进“乡医巡诊路线”。",
    coldChain: "在村情记录板推进“冷链代收点”。",
    waterCleanup: "在村情记录板推进“村塘清淤”。",
    yearEnd: "推进到第一年大寒第五天并睡觉，查看年终会。",
    landShrine: "完成土地庙全部缺口后，在山里旧土地庙追问原因。",
  }[entryId] ?? "继续推进主线、村情目标或土地庙缺口。";
}

function villageAlbumEntryDescription(entry) {
  if (VILLAGE_ISSUE_GOALS[entry.id]) {
    const level = villageFacilityLevel(entry.id);
    if (level <= 0) return entry.description;
    return `${entry.description} 阶段：${villageFacilityStageLabel(entry.id)}。${communityFacilityStageFeedback(entry.id, level)}`;
  }
  if (entry.id === "villageIssues") {
    return `${entry.description} 当前设施：${villageFacilityStateSummary()}。`;
  }
  return entry.description;
}

function updateVillageAlbumHud() {
  const unlockedEntries = VILLAGE_ALBUM_ENTRIES.filter((entry) => entry.isUnlocked());
  ui.albumProgress.textContent = `${unlockedEntries.length}/${VILLAGE_ALBUM_ENTRIES.length}`;
  ui.albumList.innerHTML = "";
  for (const entry of VILLAGE_ALBUM_ENTRIES) {
    const unlocked = entry.isUnlocked();
    const item = document.createElement("li");
    item.classList.toggle("is-unlocked", unlocked);

    const copy = document.createElement("div");
    copy.className = "album-copy";
    const title = document.createElement("strong");
    title.textContent = entry.title;
    const description = document.createElement("span");
    description.textContent = unlocked
      ? `已经改变：${villageAlbumEntryDescription(entry)}`
      : `触发来源：${villageAlbumLockedHint(entry.id)}`;
    copy.append(title, description);

    const status = document.createElement("span");
    status.className = "achievement-status";
    status.textContent = unlocked ? "已记录" : "未记录";

    item.append(copy, status);
    ui.albumList.append(item);
  }
}

function readyCropCount() {
  return state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID) && obj.ready).length;
}

function collectAlerts() {
  const alerts = [];
  const unread = unreadMailCount();
  if (unread > 0) alerts.push({ level: "high", text: `邮箱有 ${unread} 封未读信件。` });

  const readyQuests = Object.values(state.quests).filter((quest) => quest.status === "readyToTurnIn");
  if (readyQuests.length > 0) alerts.push({ level: "high", text: `${readyQuests.length} 个任务可以交付。` });

  const readyCrops = readyCropCount();
  if (readyCrops > 0) alerts.push({ level: "high", text: `${readyCrops} 株作物已经成熟，可用镰刀收获。` });

  const readyMachines = machineEntries().filter((entry) => entry.machine.readyGoodId).length;
  if (readyMachines > 0) alerts.push({ level: "high", text: `${readyMachines} 台加工设施有成品可领取。` });
  if (state.story.ecommerceTrialShipped && !state.story.processingRepaired) {
    alerts.push({ level: "high", text: "电商试单已结算，农场废弃加工桶可以修复了。" });
  }
  if (state.story.firstProcessedShipmentSettled && !state.story.cooperativeRepaired) {
    alerts.push({ level: "high", text: "第一批加工品已结算，村庄合作社旧窗口可以修复了。" });
  }
  if (state.story.cooperativeJoined) {
    const contract = cooperativeContractForDay();
    if (!cooperativeContractClaimed(contract)) {
      alerts.push({
        level: "normal",
        text: `${contract.title}进度 ${cooperativeContractSubmitted(contract)}/${contract.target}，本节气内可继续提交。`,
      });
    }
  }
  if (cooperativeExpansionEnabled()) {
    const progress = cooperativeExpansionProgress();
    const remainder = progress % COOPERATIVE_EXPANSION.dividendEveryContracts;
    const nextDividend = remainder === 0 ? COOPERATIVE_EXPANSION.dividendEveryContracts : COOPERATIVE_EXPANSION.dividendEveryContracts - remainder;
    alerts.push({
      level: nextDividend === 1 ? "high" : "normal",
      text: `合作社扩张：已完成 ${progress} 张路线合同，连续供货 ${state.story.cooperativeExpansionStreak} 张，距下次分红还需 ${nextDividend} 张。`,
    });
  }
  if (state.story.springSampleBundleCompleted && !villageIssueGoalComplete("waterCleanup")) {
    alerts.push({
      level: hasResourceCosts(VILLAGE_ISSUE_GOALS.waterCleanup.resourceCost) && state.inventory.gold >= VILLAGE_ISSUE_GOALS.waterCleanup.costGold ? "high" : "normal",
      text: `村塘清淤可在村情记录板推进。当前水质：${waterQualityLabel()}，提升后会出现河虾和鲤鱼。`,
    });
  }
  if (villageIssueGoalComplete("waterCleanup") && currentWaterQuality() === 1) {
    alerts.push({ level: "normal", text: "水质已转清，村庄池塘新增河虾和鲤鱼；后续水渠工程会继续提升水质。" });
  }
  if (state.story.irrigationFirstProjectCompleted && currentWaterQuality() === 2) {
    alerts.push({ level: "normal", text: "水渠工程让水质更稳定，山溪鱼和泥鳅开始出现；最终活水仍要等土地庙收束。" });
  }

  const pendingShipments = totalCropCount(state.inventory.shippedCrops);
  const pendingGoods = totalGoodCount(state.inventory.shippedGoods);
  const pendingFish = totalFishCount(state.inventory.shippedFish);
  if (pendingShipments + pendingGoods + pendingFish > 0) {
    alerts.push({
      level: "high",
      text: `出货箱有 ${pendingShipments + pendingGoods + pendingFish} 个待结算物品，预计 ${shipmentIncomeValue(
        state.inventory.shippedCrops,
        state.inventory.shippedGoods,
        state.day,
        state.inventory.shippedFish,
      )}g。`,
    });
  }

  const season = seasonInfoForDay();
  const event = calendarEventForDay();
  if (event) {
    alerts.push({ level: "high", text: `今日事件：${event.title}。${event.description}` });
  }
  const festival = currentFestivalDef();
  if (festival) {
    alerts.push({ level: "high", text: festivalSummaryText(festival) });
  }
  const openingGuide = springOpeningGuide();
  if (openingGuide) {
    alerts.push({ level: season.dayOfSeason >= SPRING_FAIR_START_DAY ? "high" : "normal", text: openingGuide });
  }
  if (springFairIsOpen() && !state.story.springFairVisited) {
    alerts.push({ level: "high", text: "春集种子会开放中，去村庄春集种子摊可以买早豆试种包和工具材料。" });
  }
  if (season.year === 1 && season.id === "spring" && season.dayOfSeason >= 26) {
    alerts.push({ level: "high", text: springEndChecklistText() });
  }
  if (season.year === 1 && season.id === "summer" && season.dayOfSeason <= 5) {
    alerts.push({ level: state.story.marketPrepCompleted ? "normal" : "high", text: summerStartupGuideText() });
  }
  if (season.dayOfSeason === season.length) {
    alerts.push({ level: "high", text: `今天是${season.label}最后一天，明天会换季。` });
  } else if (season.dayOfTerm === season.termLength) {
    const nextTerm = seasonInfoForDay(state.day + 1).solarTerm;
    alerts.push({ level: "normal", text: `今天是${season.solarTerm.name}最后一天，明天进入${nextTerm.name}。` });
  }
  if (season.year === 1 && season.dayOfYear === YEAR_LENGTH && !state.story.viewedYearEnd) {
    alerts.push({ level: "high", text: "今天是第一年最后一天，睡觉后会进入年终评价。" });
  }
  if (state.story.viewedYearEnd && !state.story.secondYearPlan) {
    alerts.push({ level: "high", text: "第二年方向尚未选择，可在邮箱或年终会弹窗里选择。" });
  }
  if (state.story.secondYearPlan === "tourism" && !state.story.tourismRepaired) {
    alerts.push({ level: "high", text: "已选择乡村旅游路线，村庄游客服务旧亭可以修复。" });
  } else if (state.story.tourismRepaired && !state.story.tourismFirstOrderCompleted) {
    alerts.push({
      level: tourismScoreReady() ? "high" : "normal",
      text: `游客订单进度：评价 ${farmScoreTotal()}/${TOURISM_ORDER.scoreTarget}，作物 ${tourismCropSubmittedCount()}/${TOURISM_ORDER.cropTarget}，加工品 ${tourismGoodSubmittedCount()}/${TOURISM_ORDER.goodTarget}。`,
    });
  }
  if (state.story.secondYearPlan === "brand" && !state.story.brandRepaired) {
    alerts.push({ level: "high", text: "已选择品牌农产品路线，村庄品牌包装旧台可以修复。" });
  } else if (state.story.brandRepaired && !state.story.brandFirstShipmentSettled) {
    alerts.push({
      level: state.story.brandFirstPackCreated ? "high" : "normal",
      text: `品牌路线进度：礼盒库存 ${state.inventory.goods[BRAND_PACK_GOOD_ID] ?? 0}，待出货 ${
        state.inventory.shippedGoods[BRAND_PACK_GOOD_ID] ?? 0
      }。`,
    });
  }
  if (state.story.secondYearPlan === "irrigation" && !state.story.irrigationRepaired) {
    alerts.push({ level: "high", text: "已选择水利与扩建路线，农场旧水泵可以修复。" });
  } else if (state.story.irrigationRepaired && !state.story.irrigationFirstProjectCompleted) {
    alerts.push({
      level: state.inventory.gold >= IRRIGATION_PROJECT.costGold ? "high" : "normal",
      text: `水渠工程需要 ${IRRIGATION_PROJECT.costGold}g，当前 ${state.inventory.gold}g。`,
    });
  } else if (state.story.irrigationFirstProjectCompleted) {
    const zoneCount = state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj)).length;
    if (zoneCount > 0) alerts.push({ level: "normal", text: `水渠覆盖区有 ${zoneCount} 株作物，睡觉后会自动浇水。` });
  }

  if (state.timeMinutes >= LATE_NIGHT_START_MINUTES) {
    alerts.push({ level: "high", text: "已经深夜了，建议回屋睡觉，避免继续消耗体力。" });
  } else if (state.timeMinutes >= NIGHT_START_MINUTES) {
    alerts.push({ level: "normal", text: "天色已晚，小路灯会自动亮起。" });
  }

  if (state.selectedTool === "seeds" && !isCropInSeason(state.selectedSeed)) {
    alerts.push({ level: "normal", text: `${cropDef(state.selectedSeed).seedName}不适合在${season.label}播种。` });
  }

  state.dailyOrder = normalizeDailyOrder(state.dailyOrder);
  if (state.dailyOrder.completed) {
    alerts.push({ level: "high", text: "今日订单已达标，睡觉后会发放奖励。" });
  } else {
    alerts.push({ level: "normal", text: `今日订单进度 ${state.dailyOrder.shipped}/${state.dailyOrder.target}。` });
  }

  if (state.wateringCanWater <= 1) {
    alerts.push({ level: "normal", text: `水壶水量偏低：${state.wateringCanWater}/${wateringCanCapacityForStory()}。` });
  }

  if (state.energy <= 5) {
    alerts.push({ level: "normal", text: `体力偏低：${state.energy}/${maxEnergy()}。` });
  }

  if (alerts.length === 0) alerts.push({ level: "ok", text: "当前没有紧急事项。" });
  return alerts;
}

function updateAlertHud() {
  const alerts = collectAlerts();
  const actionableCount = alerts.filter((alert) => alert.level !== "ok").length;
  ui.alertCount.textContent = String(actionableCount);
  ui.alertList.innerHTML = "";
  for (const alert of alerts) {
    const item = document.createElement("li");
    item.dataset.level = alert.level;
    item.textContent = alert.text;
    ui.alertList.append(item);
  }
}

function updateUpgradeHud() {
  const purchased = UPGRADE_IDS.filter((upgradeId) => state.upgrades[upgradeId]).length;
  ui.upgradeCount.textContent = `${purchased}/${UPGRADE_IDS.length}`;
  ui.upgradeList.innerHTML = "";
  for (const upgradeId of UPGRADE_IDS) {
    const upgrade = FARM_UPGRADES[upgradeId];
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = upgrade.name;
    const value = document.createElement("strong");
    value.textContent = state.upgrades[upgradeId] ? "已完成" : `${upgrade.cost}g`;
    item.append(label, value);
    ui.upgradeList.append(item);
  }
}

function farmScorePart(label, value, max, detail) {
  return {
    label,
    value: Math.min(max, Math.max(0, Math.round(value))),
    max,
    detail,
  };
}

function farmScoreBreakdown() {
  const cropCounts = cropStateCounts();
  const inventoryValue =
    state.inventory.gold +
    cropValue(state.inventory.crops) +
    cropValue(state.inventory.shippedCrops) +
    goodsValue(state.inventory.goods) +
    goodsValue(state.inventory.shippedGoods) +
    fishValue(state.inventory.fish) +
    fishValue(state.inventory.shippedFish);
  const placed = placedBuildableEntries();
  const facilities = placed.filter((entry) => entry.def.category === "facilities").length;
  const decorations = placed.filter((entry) => entry.def.category === "decorations").length;
  const completedQuests = Object.values(state.quests).filter((quest) => quest.status === "completed").length;
  const unlockedAchievements = state.achievements.unlockedIds.length;
  const cooperativeContracts = completedCooperativeContractCount();
  const repairedFeatures = repairedVillageFeatureCount();
  const purchasedUpgrades = UPGRADE_IDS.filter((upgradeId) => state.upgrades[upgradeId]).length;
  const collection = collectionProgress();

  return [
    farmScorePart(
      "作物经营",
      state.inventory.harvestedCrops * 3 + cropCounts.ready * 2 + cropCounts.watered + totalCropCount(state.inventory.crops),
      30,
      `累计收获 ${state.inventory.harvestedCrops}，田里 ${cropCounts.total} 株`,
    ),
    farmScorePart("经济储备", inventoryValue / 30, 20, `金币与库存估值 ${Math.round(inventoryValue)}g`),
    farmScorePart(
      "建造布置",
      facilities * 5 + decorations * 3 + totalBuildableInventory() * 1,
      20,
      `设施 ${facilities}，装饰 ${decorations}，库存 ${totalBuildableInventory()}`,
    ),
    farmScorePart(
      "社区进度",
      completedQuests * 4 + cooperativeContracts * 3 + repairedFeatures * 2 + unlockedAchievements * 1.5,
      20,
      `任务 ${completedQuests}，合同 ${cooperativeContracts}，修复 ${repairedFeatures}/${RECOVERY_NODE_TARGET}，成就 ${unlockedAchievements}`,
    ),
    farmScorePart(
      "扩建图鉴",
      purchasedUpgrades * 2 + (collection.completed / collection.total) * 4,
      10,
      `扩建 ${purchasedUpgrades}/${UPGRADE_IDS.length}，图鉴 ${collection.completed}/${collection.total}`,
    ),
  ];
}

function farmScoreRank(score) {
  if (score >= 85) return "星级农场";
  if (score >= 65) return "成熟农场";
  if (score >= 45) return "稳步发展";
  if (score >= 25) return "起步农场";
  return "新手农场";
}

function farmScoreTotal(parts = farmScoreBreakdown()) {
  return parts.reduce((sum, part) => sum + part.value, 0);
}

function yearEndRewardForScore(score) {
  if (score >= 85) {
    return { gold: 500, seeds: { corn: 4, sweetPotato: 4 }, build: { processor: 1, dryer: 1 } };
  }
  if (score >= 65) {
    return { gold: 320, seeds: { sweetPotato: 3, spinach: 3 }, build: { dryer: 1 } };
  }
  if (score >= 45) {
    return { gold: 200, seeds: { bokChoy: 4, spinach: 3 }, build: {} };
  }
  if (score >= 25) {
    return { gold: 120, seeds: { radish: 6 }, build: {} };
  }
  return { gold: 70, seeds: { radish: 3 }, build: {} };
}

function yearEndRewardText(reward) {
  const parts = [];
  if (reward.gold > 0) parts.push(`+${reward.gold}g`);
  const seedText = Object.entries(reward.seeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  if (seedText) parts.push(seedText);
  const buildText = Object.entries(reward.build ?? {})
    .filter(([, count]) => count > 0)
    .map(([itemId, count]) => `${count} ${buildableDef(itemId).name}`)
    .join("、");
  if (buildText) parts.push(buildText);
  return parts.join("，") || "无";
}

function grantYearEndReward(score) {
  if (state.story.yearEndRewardClaimed) return "";
  const reward = yearEndRewardForScore(score);
  state.story.yearEndRewardClaimed = true;
  state.inventory.gold += reward.gold;
  for (const [cropId, count] of Object.entries(reward.seeds ?? {})) addSeedCount(cropId, count);
  for (const [itemId, count] of Object.entries(reward.build ?? {})) {
    if (BUILDABLE_ITEMS[itemId]) state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + count;
  }
  const text = yearEndRewardText(reward);
  addLog(`年终评价奖励：${text}。`);
  return text;
}

function repairedVillageFeatureCount() {
  return [
    state.story.chapterOneCompleted,
    state.story.marketPrepCompleted,
    state.story.communityOrdersCompleted,
    state.story.processingRepaired,
    state.story.cooperativeJoined,
    state.story.tourismFirstOrderCompleted,
    state.story.brandFirstShipmentSettled,
    state.story.irrigationFirstProjectCompleted,
  ].filter(Boolean).length;
}

function yearEndResultText(score) {
  if (score >= 85) return "村里把农场评为年度样板。第二年可以直接考虑更大的合作社合同、旅游服务和品牌化路线。";
  if (score >= 65) return "农场已经能稳定支撑村里的基础订单。第二年重点可以放在扩建、加工效率和更高价值作物。";
  if (score >= 45) return "第一年已经跑通生产闭环，但库存、加工和社区合同还有明显提升空间。第二年先稳住现金流。";
  if (score >= 25) return "农场完成了起步恢复，不过村庄功能还没有完全转起来。第二年建议先补齐主线修复和出货节奏。";
  return "这一年更像重新站稳脚跟。第二年从稳定播种、浇水、出货开始，先把第一条经济循环跑顺。";
}

function completedVillageIssueResults() {
  return VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageIssueGoalComplete(goalId)).map((goalId) => VILLAGE_ISSUE_GOALS[goalId].result);
}

function completedVillageIssueSummary() {
  const results = completedVillageIssueResults();
  if (results.length === 0) return "村情目标尚未形成可见变化。";
  return results.join(" / ");
}

function facilityReviewSummary(minLevel = 1) {
  const entries = VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageFacilityLevel(goalId) >= minLevel).map((goalId) => {
    const def = communityFacilityDef(goalId);
    return `${def.name} ${villageFacilityStageLabel(goalId)}`;
  });
  return entries.join(" / ") || "暂无";
}

function oneYearReviewLines() {
  const phase = currentStoryPhase();
  const route = secondYearPlanDef();
  const missing = landShrineFinalReady()
    ? "已经满足土地庙最终追问条件。"
    : landShrineMissingCategories().map(landShrineMissingText).join(" / ") || landShrineCurrentHint();
  const collection = collectionProgress();
  const fishCount = totalFishCount(state.inventory.fish) + totalFishCount(state.inventory.shippedFish);
  return [
    `当前阶段：${phase.title}。`,
    `主线进度：${landShrineProgressText()}。`,
    `农场：累计收获 ${state.inventory.harvestedCrops}，金币 ${state.inventory.gold}g，作物图鉴 ${collection.completed}/${collection.total}。`,
    `村庄：功能修复 ${repairedVillageFeatureCount()}/${RECOVERY_NODE_TARGET}，村情目标 ${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length}。`,
    `设施修复：${facilityReviewSummary(1)}。`,
    `设施强化：强化一 ${villageFacilityCountAtLevel(2)}，强化二 ${villageFacilityCountAtLevel(3)}；路线推荐：${routeFacilityRequirementText()}。`,
    `协作：村民任务 ${completedQuestCount()}，合作社合同 ${completedCooperativeContractCount()}。`,
    `水与水产：水质 ${waterQualityLabel()}，已获得水产 ${fishCount}。`,
    `第二年方向：${route ? route.name : "未选择"}；路线起步闭环：${secondYearRouteProgressText()}，${currentRouteMilestoneComplete() ? "完成" : "未完成"}。`,
    `已经改变：${completedVillageIssueSummary()}`,
    `土地庙提示：${missing}`,
  ];
}

function buildYearEndReport() {
  const parts = farmScoreBreakdown();
  const score = farmScoreTotal(parts);
  const rewardText = grantYearEndReward(score);
  state.story.viewedYearEnd = true;
  const repairedCount = repairedVillageFeatureCount();
  const shippedGoods = totalGoodCount(state.inventory.shippedGoods);
  const lines = [
    `第一年结束。年度评价：${score}/100 · ${farmScoreRank(score)}。`,
    yearEndResultText(score),
    "",
    `累计收获：${state.inventory.harvestedCrops} 个作物。`,
    `当前金币：${state.inventory.gold}g。`,
    `完成村民任务：${completedQuestCount()} 个。`,
    `合作社合同：${completedCooperativeContractCount()} 张。`,
    `村庄恢复节点：${repairedCount}/${RECOVERY_NODE_TARGET}。`,
    `村情目标：${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length}。`,
    `设施阶段：强化一 ${villageFacilityCountAtLevel(2)}，强化二 ${villageFacilityCountAtLevel(3)}。`,
    `水质与水产：${waterQualityLabel()}，水产库存 ${totalFishCount(state.inventory.fish)}，待出货水产 ${totalFishCount(state.inventory.shippedFish)}。`,
    `加工与待出货：背包加工品 ${totalGoodCount(state.inventory.goods)}，待结算加工品 ${shippedGoods}。`,
    `现实变化：${completedVillageIssueSummary()}`,
    "",
    `评分明细：${parts.map((part) => `${part.label} ${part.value}/${part.max}`).join(" / ")}`,
  ];
  if (rewardText) lines.push("", `年终补助：${rewardText}。`);
  lines.push("", "第二年目标：扩大稳定供应、完成更多合作社合同，并逐步修复旅游、水利和品牌化内容。");
  return lines.join("\n");
}

function shouldShowYearEnd(previousSeason) {
  return previousSeason.year === 1 && previousSeason.dayOfYear === YEAR_LENGTH && !state.story.viewedYearEnd;
}

function secondYearPlanDef(planId = state.story.secondYearPlan) {
  return SECOND_YEAR_PLANS[planId] ?? null;
}

function secondYearPlanRewardText(plan) {
  const parts = [];
  if ((plan.rewardGold ?? 0) > 0) parts.push(`+${plan.rewardGold}g`);
  const seedText = Object.entries(plan.rewardSeeds ?? {})
    .filter(([, count]) => count > 0)
    .map(([cropId, count]) => `${count} ${cropDef(cropId).seedName}`)
    .join("、");
  if (seedText) parts.push(seedText);
  const buildText = Object.entries(plan.rewardBuild ?? {})
    .filter(([, count]) => count > 0)
    .map(([itemId, count]) => `${count} ${buildableDef(itemId).name}`)
    .join("、");
  if (buildText) parts.push(buildText);
  return parts.join("，") || "无";
}

function grantSecondYearPlanReward(plan) {
  if (state.story.secondYearPlanRewardClaimed) return "";
  state.story.secondYearPlanRewardClaimed = true;
  state.inventory.gold += plan.rewardGold ?? 0;
  for (const [cropId, count] of Object.entries(plan.rewardSeeds ?? {})) addSeedCount(cropId, count);
  for (const [itemId, count] of Object.entries(plan.rewardBuild ?? {})) {
    if (BUILDABLE_ITEMS[itemId]) state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + count;
  }
  return secondYearPlanRewardText(plan);
}

function selectSecondYearPlan(planId) {
  const plan = secondYearPlanDef(planId);
  if (!plan) return false;
  if (!state.story.viewedYearEnd) {
    showDialog("第二年方向", "先完成第一年年终会，再选择第二年发展方向。");
    return false;
  }
  if (state.story.secondYearPlan && state.story.secondYearPlan !== plan.id) {
    showSecondYearPlanDialog(`已选择“${secondYearPlanDef().name}”，本轮暂不更改方向。`);
    return false;
  }
  state.story.secondYearPlan = plan.id;
  if (plan.id === "cooperative") ensureCooperativeExpansionStart();
  if (plan.id === "tourism") ensureTourismSetup();
  if (plan.id === "brand") ensureBrandSetup();
  if (plan.id === "irrigation") ensureIrrigationSetup();
  const rewardText = grantSecondYearPlanReward(plan);
  updateAllHud();
  addLog(`第二年方向：${plan.name}。`);
  if (rewardText) addLog(`方向启动补助：${rewardText}。`);
  addScreenEffect("quest", "第二年方向");
  playSound("quest");
  showSecondYearPlanDialog(`已选择“${plan.name}”。${rewardText ? `\n启动补助：${rewardText}。` : ""}`);
  scheduleAutosave("第二年方向选择");
  return true;
}

function showSecondYearPlanDialog(message = "") {
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const selected = secondYearPlanDef();
  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>年度 <strong>第二年</strong></span>
    <span>方向 <strong>${selected ? selected.name : "未选择"}</strong></span>
    <span>补助 <strong>${state.story.secondYearPlanRewardClaimed ? "已领取" : "待选择"}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = selected
    ? `${selected.summary}\n${selected.hint}`
    : "选择第二年的发展方向。V1 先记录路线、发放启动补助，并改变当前主线目标；后续系统会沿这条路线继续扩展。";
  note.style.whiteSpace = "pre-line";
  panel.append(note);

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "发展方向";
  section.append(title);

  for (const plan of Object.values(SECOND_YEAR_PLANS)) {
    const row = document.createElement("div");
    row.className = "shop-row";
    if (selected?.id === plan.id) row.classList.add("is-complete");
    const info = document.createElement("span");
    info.textContent = `${plan.name} · ${plan.summary} · 启动补助：${secondYearPlanRewardText(plan)}`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton(
        selected?.id === plan.id ? "已选择" : "选择",
        Boolean(selected),
        () => selectSecondYearPlan(plan.id),
        selected ? "本轮已选择方向" : "",
      ),
    );
    row.append(actions);
    section.append(row);
  }
  panel.append(section);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("第二年方向", panel);
  return true;
}

function showYearEndDialog(yearEndText, sleepText) {
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const report = document.createElement("p");
  report.textContent = `${yearEndText}\n\n-----\n${sleepText}`;
  report.style.whiteSpace = "pre-line";
  panel.append(report);

  if (!state.story.secondYearPlan) {
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(createShopButton("选择第二年方向", false, () => showSecondYearPlanDialog()));
    panel.append(actions);
  }

  showDialog("第一年年终会", panel);
}

function farmScoreNextGoal(parts) {
  const weakPart = parts.find((part) => part.value < part.max);
  if (!weakPart) return "评价已满：可以继续扩展地图、NPC 或更多作物内容。";
  if (weakPart.label === "作物经营") return "下一步：继续浇水、收获，并扩大田地规模。";
  if (weakPart.label === "经济储备") return "下一步：把作物或加工品卖出，积累更多金币。";
  if (weakPart.label === "建造布置") return "下一步：购买设施或装饰，并在农场里摆放。";
  if (weakPart.label === "社区进度") return "下一步：推进 NPC 任务，顺手解锁更多成就。";
  return "下一步：购买农场扩建，并补全作物图鉴。";
}

function updateFarmScoreHud() {
  const parts = farmScoreBreakdown();
  const score = parts.reduce((sum, part) => sum + part.value, 0);
  ui.farmScoreValue.textContent = `${score}/100`;
  ui.farmScoreMeter.style.width = `${score}%`;
  ui.farmScoreRank.textContent = farmScoreRank(score);
  ui.farmScoreNextGoal.textContent = farmScoreNextGoal(parts);
  ui.farmScoreList.innerHTML = "";

  for (const part of parts) {
    const item = document.createElement("li");
    const row = document.createElement("span");
    row.className = "score-row";
    const label = document.createElement("span");
    label.textContent = part.label;
    const value = document.createElement("strong");
    value.textContent = `${part.value}/${part.max}`;
    row.append(label, value);

    const detail = document.createElement("small");
    detail.textContent = part.detail;
    item.append(row, detail);
    ui.farmScoreList.append(item);
  }
}

function updateAllHud() {
  ui.saveStatus.dataset.test = debug.testSkipActive ? "true" : "false";
  updateSaveSlotHud();
  updateToolHud();
  updateFeedbackHud();
  updateInventoryHud();
  updateDynamicHud();
  updateBuildHud();
  updateCollectionHud();
  updateAchievementHud();
  updateVillageAlbumHud();
  updateFarmScoreHud();
  updateAssetAuditHud();
  updateUpgradeHud();
  updateDayHud();
  updateGameStatusHud();
  updateCalendarHud();
  updateStoryHud();
  updateTaskTreeHud();
  updateFirstYearCheckHud();
  updatePlaythroughHud();
  updateGuideHud();
  updateOrderHud();
  updateQuestHud();
  updateAlertHud();
  updateJournalOverlay();
  updateBuildOverlay();
  updateTaskOverlay();
}

function selectSeed(cropId) {
  if (!CROP_TYPES[cropId]) return;
  state.selectedSeed = cropId;
  updateToolHud();
  addLog(`切换种子：${cropDef(cropId).seedName}`);
  scheduleAutosave("种子选择");
}

function setSoundEnabled(enabled) {
  state.settings.soundEnabled = enabled;
  updateFeedbackHud();
  addLog(`操作音效：${enabled ? "开启" : "关闭"}。`);
  if (enabled) playSound("select");
  scheduleAutosave("反馈设置");
}

function formatTime(totalMinutes) {
  const minutesInDay = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(minutesInDay / 60);
  const minutes = minutesInDay % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function updateDayHud() {
  const season = seasonInfoForDay();
  const events = calendarEventsForDay();
  const cropNote = SOLAR_TERM_CROP_NOTES[season.index] ?? "";
  ui.dayReadout.textContent = `第 ${state.day} 天`;
  ui.timeReadout.textContent = `${formatTime(state.timeMinutes)} · ${timeOfDayLabel()}`;
  ui.energyReadout.textContent = `${state.energy}/${maxEnergy()}`;
  ui.weatherReadout.textContent = WEATHER[state.weather]?.label ?? state.weather;
  ui.tomorrowWeatherReadout.textContent = WEATHER[state.tomorrowWeather]?.label ?? state.tomorrowWeather;
  ui.seasonReadout.textContent = `第 ${season.year} 年 · ${season.label} · ${season.solarTerm.name}`;
  ui.seasonReadout.style.color = season.color;
  ui.seasonDayReadout.textContent = `${season.solarTerm.name}第 ${season.dayOfTerm}/${season.termLength} 天 · 本季第 ${season.dayOfSeason}/${season.length} 天 · 年度第 ${season.dayOfYear}/${season.yearLength} 天`;
  ui.eventReadout.textContent = `${events.length > 0 ? `今日：${events.map((event) => `${event.title} · ${event.description}`).join(" / ")}` : "今日无事件"}${cropNote ? ` · 作物提示：${cropNote}` : ""}`;
}

function gameStatusObjectiveText() {
  const objective = currentIncompleteStoryObjective();
  if (!objective) return "当前：阶段目标已完成 · 按 Q 查看任务";
  const target = currentStoryTargetInfo(objective);
  if (!target) return `当前：${objective.label} · 按 Q 查看任务`;
  const mapName = maps[target.mapId]?.name ?? target.mapId;
  return `当前：${objective.label} · ${mapName} · ${target.label}`;
}

function updateGameStatusHud() {
  if (!ui.gameHudDay) return;
  const season = seasonInfoForDay();
  ui.gameHudDay.textContent = `第 ${state.day} 天`;
  ui.gameHudSeason.textContent = `${season.label} · ${season.solarTerm.name}`;
  ui.gameHudTime.textContent = formatTime(state.timeMinutes);
  ui.gameHudWeather.textContent = WEATHER[state.weather]?.label ?? state.weather;
  ui.gameHudEnergy.textContent = `${state.energy}/${maxEnergy()}`;
  ui.gameHudGold.textContent = `${state.inventory.gold}g`;
  ui.gameHudObjective.textContent = gameStatusObjectiveText();
}

function updateCalendarHud() {
  const season = seasonInfoForDay();
  ui.calendarGrid.innerHTML = "";
  for (let day = 1; day <= SEASON_LENGTH; day += 1) {
    const event = calendarEventForSeasonDay(day, season.index);
    const termIndex = season.index * SOLAR_TERMS_PER_SEASON + Math.floor((day - 1) / DAYS_PER_SOLAR_TERM);
    const term = SOLAR_TERMS[termIndex];
    const dayOfTerm = ((day - 1) % DAYS_PER_SOLAR_TERM) + 1;
    const item = document.createElement("span");
    item.className = "calendar-day";
    if (day < season.dayOfSeason) item.classList.add("is-past");
    if (day === season.dayOfSeason) item.classList.add("is-current");
    if (event) item.classList.add("has-event");
    item.textContent = event ? `${dayOfTerm}${event.marker}` : dayOfTerm === 1 ? term.name : String(dayOfTerm);
    item.title = event
      ? `${season.label}第 ${day} 天 · ${term.name}第 ${dayOfTerm}/${DAYS_PER_SOLAR_TERM} 天 · ${event.title}：${event.description}`
      : `${season.label}第 ${day} 天 · ${term.name}第 ${dayOfTerm}/${DAYS_PER_SOLAR_TERM} 天`;
    ui.calendarGrid.append(item);
  }

  ui.eventList.innerHTML = "";
  const seasonEvents = [];
  for (let day = 1; day <= SEASON_LENGTH; day += 1) {
    const event = calendarEventForSeasonDay(day, season.index);
    if (event) seasonEvents.push({ ...event, dayOfSeason: day });
  }
  for (const event of seasonEvents) {
    const item = document.createElement("li");
    if (event.dayOfSeason === season.dayOfSeason) item.classList.add("is-current");
    const label = document.createElement("span");
    const termIndex = season.index * SOLAR_TERMS_PER_SEASON + Math.floor((event.dayOfSeason - 1) / DAYS_PER_SOLAR_TERM);
    const dayOfTerm = ((event.dayOfSeason - 1) % DAYS_PER_SOLAR_TERM) + 1;
    label.textContent = `${SOLAR_TERMS[termIndex].name} ${dayOfTerm}/${DAYS_PER_SOLAR_TERM} · ${event.title}`;
    const detail = document.createElement("strong");
    detail.textContent = event.description;
    item.append(label, detail);
    ui.eventList.append(item);
  }

  ui.seasonCropList.innerHTML = "";
  const crops = CROP_IDS.filter((cropId) => isCropInSeason(cropId, season.id));
  if (crops.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "本季没有推荐播种作物";
    ui.seasonCropList.append(empty);
    return;
  }
  for (const cropId of crops) {
    const def = cropDef(cropId);
    const item = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = def.name;
    const status = document.createElement("strong");
    status.textContent = isCropUnlocked(cropId) ? `${def.seedPrice}g` : `第 ${def.unlockDay} 天`;
    item.append(label, status);
    ui.seasonCropList.append(item);
  }
}

function nextWeatherForDay(day) {
  return day % 4 === 0 || day % 7 === 0 ? "rainy" : "sunny";
}

function spendEnergyMinutes(cost) {
  if (!cost) return true;
  const before = state.timeMinutes;
  state.energy -= cost.energy;
  state.timeMinutes += cost.minutes;
  updateDayHud();
  updateAlertHud();
  if (before < NIGHT_START_MINUTES && state.timeMinutes >= NIGHT_START_MINUTES) addLog("天色暗下来了，小路灯已经亮起。");
  if (before < LATE_NIGHT_START_MINUTES && state.timeMinutes >= LATE_NIGHT_START_MINUTES) addLog("已经深夜了，建议尽快回屋睡觉。");
  if (state.timeMinutes >= 24 * 60) addLog("已经很晚了，该睡觉了。");
  return true;
}

function spendForTool(toolId) {
  return spendEnergyMinutes(toolCostFor(toolId));
}

function hasEnergyForTool(toolId) {
  const cost = toolCostFor(toolId);
  if (!cost || state.energy >= cost.energy) return true;
  addLog("体力不足，先睡觉恢复。");
  return false;
}

function growCropsOvernight() {
  let grown = 0;
  for (const obj of state.dynamicObjects) {
    if (!isCropOnMap(obj, CROP_MAP_ID)) continue;
    const def = cropDef(obj.cropId);
    if (obj.ready) {
      obj.watered = false;
      continue;
    }
    if (!obj.watered) continue;
    obj.stage += 1;
    obj.watered = false;
    obj.ready = obj.stage >= def.growStages;
    grown += 1;
  }
  return grown;
}

function waterCropsFromWeather() {
  if (!WEATHER[state.weather]?.waterCrops) return 0;
  let watered = 0;
  for (const obj of state.dynamicObjects) {
    if (!isCropOnMap(obj, CROP_MAP_ID) || obj.ready || obj.watered) continue;
    obj.watered = true;
    watered += 1;
  }
  return watered;
}

function waterCropsFromIrrigation() {
  if (!state.story.irrigationFirstProjectCompleted) return 0;
  let watered = 0;
  for (const obj of state.dynamicObjects) {
    if (!isCropOnMap(obj, CROP_MAP_ID) || obj.ready || obj.watered) continue;
    if (!irrigationZoneContains(obj)) continue;
    obj.watered = true;
    watered += 1;
  }
  return watered;
}

function advanceMachinesOvernight() {
  let completed = 0;
  for (const machine of Object.values(state.machines)) {
    if (!machine.recipeId || machine.readyGoodId) continue;
    machine.remainingDays = Math.max(0, machine.remainingDays - 1);
    if (machine.remainingDays === 0) {
      machine.readyGoodId = machine.recipeId;
      machine.recipeId = null;
      completed += 1;
    }
  }
  return completed;
}

function sleepToNextDay() {
  if (editor.enabled) {
    addLog("编辑模式下不会推进日程。");
    return;
  }
  const previousSeason = seasonInfoForDay();
  const grown = growCropsOvernight();
  const machineCompleted = advanceMachinesOvernight();
  const orderResult = settleDailyOrder();
  const shipped = totalCropCount(state.inventory.shippedCrops);
  const shippedGoods = totalGoodCount(state.inventory.shippedGoods);
  const shippedFish = totalFishCount(state.inventory.shippedFish);
  const shippedBrandPacks = state.inventory.shippedGoods[BRAND_PACK_GOOD_ID] ?? 0;
  const todayEvent = calendarEventForDay();
  const shipmentIncome = shipmentIncomeValue(state.inventory.shippedCrops, state.inventory.shippedGoods, state.day, state.inventory.shippedFish);
  const baseShipmentIncome = cropValue(state.inventory.shippedCrops) + goodsValue(state.inventory.shippedGoods) + fishValue(state.inventory.shippedFish);
  const eventIncomeText =
    shipmentIncome > baseShipmentIncome && todayEvent ? `${todayEvent.title}加成 +${shipmentIncome - baseShipmentIncome}g。` : "";
  const firstShipmentSettledNow = shipmentIncome > 0 && !state.story.firstShipmentSettled;
  const firstProcessedShipmentSettledNow = shippedGoods > 0 && !state.story.firstProcessedShipmentSettled;
  const firstBrandShipmentSettledNow = shippedBrandPacks > 0 && !state.story.brandFirstShipmentSettled;
  if (grown > 0) state.story.sleptAfterWatering = true;
  if (firstShipmentSettledNow) state.story.firstShipmentSettled = true;
  if (firstProcessedShipmentSettledNow) state.story.firstProcessedShipmentSettled = true;
  if (firstBrandShipmentSettledNow) state.story.brandFirstShipmentSettled = true;
  const processingRewardText = firstProcessedShipmentSettledNow ? grantFirstProcessedShipmentReward() : "";
  const brandRewardText = firstBrandShipmentSettledNow ? grantFirstBrandShipmentReward() : "";
  if (shipmentIncome > 0) {
    state.inventory.gold += shipmentIncome;
    state.inventory.shippedCrops = makeCropCounts();
    state.inventory.shippedGoods = makeGoodCounts();
    state.inventory.shippedFish = makeFishCounts();
  }
  const yearEndText = shouldShowYearEnd(previousSeason) ? buildYearEndReport() : "";
  state.day += 1;
  state.timeMinutes = DAY_START_MINUTES;
  state.energy = maxEnergy();
  state.weather = state.tomorrowWeather;
  state.tomorrowWeather = nextWeatherForDay(state.day + 1);
  state.dailyOrder = createDailyOrder(state.day);
  const rainWatered = waterCropsFromWeather();
  const currentSeason = seasonInfoForDay();
  const seasonChangeText =
    previousSeason.id !== currentSeason.id ? `进入${currentSeason.label}了。当季作物：${seasonCropSummary(currentSeason.id)}。` : "";
  const summerStartText =
    currentSeason.year === 1 && currentSeason.id === "summer" && previousSeason.id !== "summer" && !state.story.summerStartGuideSeen
      ? summerStartupGuideText()
      : "";
  if (summerStartText) state.story.summerStartGuideSeen = true;
  const solarTermChangeText =
    previousSeason.solarTermIndex !== currentSeason.solarTermIndex
      ? `节气进入${currentSeason.solarTerm.name}（第 ${currentSeason.dayOfTerm}/${currentSeason.termLength} 天）。`
      : "";
  const irrigationWatered = waterCropsFromIrrigation();
  updateAllHud();
  addLog(`睡到第 ${state.day} 天，${grown} 株作物成长，${machineCompleted} 台设施完成加工，出货收入 ${shipmentIncome}g。`);
  if (irrigationWatered > 0) addLog(`水渠自动浇水 ${irrigationWatered} 株。`);
  if (eventIncomeText) addLog(eventIncomeText);
  if (firstShipmentSettledNow) addLog("第一批出货完成结算，村庄广场会出现反馈。");
  if (firstProcessedShipmentSettledNow) addLog("第一批加工品完成出货结算，加工线进入稳定试运行。");
  if (firstBrandShipmentSettledNow) addLog("第一批品牌礼盒完成出货结算，品牌路线进入试运行。");
  if (yearEndText) addLog("第一年年终会完成，年度评价已记录。");
  if (solarTermChangeText) addLog(solarTermChangeText);
  if (seasonChangeText) addLog(seasonChangeText);
  if (summerStartText) addLog(summerStartText);
  addScreenEffect("sleep", `第 ${state.day} 天`);
  playSound("sleep");
  const sleepText = `体力恢复了。\n${grown > 0 ? `${grown} 株浇过水的作物成长了。` : "没有浇水的作物不会成长。"}\n${
    machineCompleted > 0 ? `${machineCompleted} 台加工设施完成了，可以去领取成品。\n` : ""
  }${
    shipmentIncome > 0
      ? `出货 ${shipped} 个作物、${shippedGoods} 个加工品、${shippedFish} 个水产，收入 ${shipmentIncome}g。${eventIncomeText ? `\n${eventIncomeText}` : ""}`
      : "昨晚没有出货。"
  }\n${processingRewardText ? `${processingRewardText}\n` : ""}${brandRewardText ? `${brandRewardText}\n` : ""}${firstShipmentSettledNow ? "村庄广场会贴出第一批出货反馈，去东边村子看看。\n" : ""}${orderResult}\n${
    solarTermChangeText ? `${solarTermChangeText}\n` : ""
  }${seasonChangeText ? `${seasonChangeText}\n` : ""}${
    summerStartText ? `${summerStartText}\n` : ""
  }${
    rainWatered > 0
      ? `今天下雨，${rainWatered} 株作物已自动浇水。`
      : `今天天气：${WEATHER[state.weather]?.label ?? state.weather}。`
  }${irrigationWatered > 0 ? `\n水渠额外浇水 ${irrigationWatered} 株。` : ""}`;
  if (yearEndText) showYearEndDialog(yearEndText, sleepText);
  else showDialog("新的一天", sleepText);
  scheduleAutosave("睡觉结算");
}

function selectTool(toolId) {
  if (!toolsById[toolId]) return;
  if (systemMenuOpen || taskOverlayOpen || journalOverlayOpen || buildOverlayOpen) return;
  state.selectedTool = toolId;
  updateToolHud();
  addLog(`切换工具：${toolsById[toolId].name}`);
  playSound("select");
  scheduleAutosave("工具选择");
}

function getQuestProgress(quest) {
  if (!quest) return 0;
  if (quest.status === "readyToTurnIn" || quest.status === "completed") return quest.target;
  if (quest.type === "harvest") return Math.min(state.inventory.harvestedCrops, quest.target);
  if (quest.type === "delivery") return Math.min(state.inventory.crops[quest.requiredCropId] ?? 0, quest.target);
  return Math.min(quest.progress ?? 0, quest.target);
}

function normalizeQuestState() {
  for (const quest of Object.values(state.quests)) {
    if (quest.status === "active" && getQuestProgress(quest) >= quest.target) {
      quest.status = "readyToTurnIn";
    }
  }
}

function questUnlocked(quest) {
  if (!quest) return false;
  if (quest.status !== "notStarted") return true;
  return typeof quest.isUnlocked === "function" ? quest.isUnlocked() : true;
}

function questHasBeenAccepted(quest) {
  return Boolean(quest && quest.status !== "notStarted");
}

function acceptedQuests() {
  return QUEST_ORDER.map((questId) => state.quests[questId]).filter(questHasBeenAccepted);
}

function questStatusLabel(status) {
  return {
    notStarted: "未开始",
    active: "进行中",
    readyToTurnIn: "可交付",
    completed: "已完成",
  }[status] ?? status;
}

function questDisplayStatusLabel(quest) {
  if (quest?.status === "notStarted" && !questUnlocked(quest)) return "未开放";
  return questStatusLabel(quest?.status);
}

function questUnlockHint(quest) {
  return String(quest?.unlockHint ?? "先推进前置剧情。");
}

function questFacilityText(quest) {
  const goalId = quest?.unlockIssueGoalId;
  if (!goalId || !VILLAGE_ISSUE_GOALS[goalId]) return "";
  const facility = communityFacilityDef(goalId);
  return villageIssueGoalComplete(goalId) ? `${facility.name}已运行` : `解锁${facility.name}`;
}

function questToolRewardText(quest) {
  return Object.entries(quest?.rewardToolUpgrades ?? {})
    .filter(([, count]) => count > 0)
    .map(([toolId, count]) => `${toolsById[toolId]?.name ?? toolId} Lv+${count}`)
    .join(" / ");
}

function questSeedUnlockRewardText(quest) {
  return (quest?.rewardSeedUnlocks ?? [])
    .map((cropId) => cropDef(cropId).seedName)
    .filter(Boolean)
    .join("、");
}

function questRewardText(quest) {
  const parts = [];
  const gold = effectiveQuestGoldReward(quest);
  if (gold > 0) parts.push(`+${gold}g`);
  if ((quest.rewardSeeds ?? 0) > 0) parts.push(`+${quest.rewardSeeds} ${cropDef(quest.rewardSeedCropId).seedName}`);
  if ((quest.rewardMaxEnergy ?? 0) > 0) parts.push(`每日体力 +${quest.rewardMaxEnergy}`);
  if ((quest.rewardWateringCanCapacity ?? 0) > 0) parts.push(`水壶容量 +${quest.rewardWateringCanCapacity}`);
  const toolText = questToolRewardText(quest);
  if (toolText) parts.push(toolText);
  const seedUnlockText = questSeedUnlockRewardText(quest);
  if (seedUnlockText) parts.push(`解锁 ${seedUnlockText}`);
  const facilityText = questFacilityText(quest);
  if (facilityText) parts.push(facilityText);
  return parts.join(" / ") || "无";
}

function dialogLines(value) {
  if (Array.isArray(value)) return value.map((line) => String(line ?? "").trim()).filter(Boolean);
  const line = String(value ?? "").trim();
  return line ? [line] : [];
}

function pickDialogLine(value, seed = 0) {
  const lines = dialogLines(value);
  if (lines.length === 0) return "";
  return lines[Math.abs((state.day + seed) % lines.length)];
}

function npcSeasonStagePages(npc) {
  const lines = NPC_STAGE_DIALOGUES[npc.id];
  if (!lines) return [];
  const key = state.story.secondYearPlan && lines[state.story.secondYearPlan]
    ? state.story.secondYearPlan
    : state.story.viewedYearEnd || seasonInfoForDay().year > 1
      ? "yearEnd"
      : currentSeasonId();
  const seasonalExtras = NPC_PLAYTHROUGH_STAGE_LINES[key] ?? [];
  const festivalExtras = dialogLines(currentFestivalDef()?.npcLine);
  return [...dialogLines(lines[key] ?? lines.spring), ...dialogLines(seasonalExtras), ...festivalExtras];
}

function npcContextPages(npc) {
  const pages = [];
  if (state.energy <= 5) pages.push(pickDialogLine(npc.dialog.lowEnergy, npc.x));
  if (state.weather === "rainy") pages.push(pickDialogLine(npc.dialog.rainy, npc.y));
  if (state.weather === "sunny") pages.push(pickDialogLine(npc.dialog.sunny, npc.y));
  if (readyCropCount() > 0) pages.push(pickDialogLine(npc.dialog.readyCrops, npc.x + npc.y));
  if (npc.id === "lina" && totalCropCount(state.inventory.shippedCrops) > 0) {
    pages.push(pickDialogLine(npc.dialog.shipments, state.day));
  }
  pages.push(pickDialogLine(npc.dialog.daily, npc.x + state.day));
  return pages.filter(Boolean).slice(0, 3);
}

function questProgressText(quest) {
  return `当前进度：${getQuestProgress(quest)}/${quest.target}`;
}

function questGoalText(quest) {
  if (quest.type === "delivery") return `目标：交付 ${quest.target} 个${cropDef(quest.requiredCropId).name}`;
  if (quest.type === "purchase") return `目标：购买 ${quest.target} 个任意种子`;
  if (quest.type === "shipment") return `目标：投入 ${quest.target} 个任意作物到出货箱`;
  return `目标：收获 ${quest.target} 个作物`;
}

function npcFacilityFeedbackPages(npc) {
  const entries = NPC_FACILITY_FEEDBACKS[npc.id] ?? [];
  const routeGoalId = routeFacilityGoalId();
  const routeMatched = routeGoalId
    ? entries.find((entry) => entry.goalId === routeGoalId && villageFacilityLevel(entry.goalId) >= entry.level)
    : null;
  const matched = routeMatched ?? entries.find((entry) => villageFacilityLevel(entry.goalId) >= entry.level);
  return matched ? [matched.line] : [];
}

function npcPersonalStoryPages(npc) {
  const facilityFeedback = npcFacilityFeedbackPages(npc);
  if (facilityFeedback.length > 0) return facilityFeedback;

  const issueCount = completedVillageIssueGoalCount();
  if (npc.id === "mira") {
    if (state.quests.pondSampleForMira?.status === "completed") {
      return ["林岚把村塘水样、土壤样本和土地庙边的老记录放在一起。她说，水变清不是奇迹，是大家终于愿意先把浑的地方看清楚。"];
    }
    if (issueCount >= VILLAGE_ISSUE_GOAL_IDS.length) {
      return ["林岚说：土壤数据终于不只是产量表了。孩子、老人和留下来的人都在这张表里有了位置。"];
    }
    if (villageIssueGoalComplete("childCare")) {
      return ["林岚小时候也在村口等过外出务工的父母。托管教室开起来后，她第一次觉得土壤记录和人的日子连在了一起。"];
    }
    return ["林岚随身带着一本旧土壤笔记。她说父母在外打工那几年，她最熟悉的不是城市，而是每天等车时脚边的泥土。"];
  }
  if (npc.id === "theo") {
    if (state.quests.marketShelfForTheo?.status === "completed") {
      return ["何涛现在每天先看稳定货架。他说货架上有下一季的种子，年轻人才不会只盯着下一班离开的车。"];
    }
    if (issueCount >= VILLAGE_ISSUE_GOAL_IDS.length) {
      return ["何涛把新账本放进抽屉：如果留下来的人能学技术、分利润、看见前路，种子铺才不只是卖种子的地方。"];
    }
    if (villageIssueGoalComplete("youthWorkshop")) {
      return ["何涛以前最想离开这里，因为他只看见苦活。青年工坊开课后，他开始认真记录哪些工作值得年轻人留下。"];
    }
    return ["何涛的货架背面贴着一张旧车票。他说那是他第一次去城里找工作时留下的，后来发现回乡并不等于失败，只是得有新的活法。"];
  }
  if (npc.id === "lina") {
    if (state.quests.cooperativeLedgerForLina?.status === "completed") {
      return ["柳青把合作社分账单贴得很低，老人和孩子都能看见。她说公开账本以后，出货箱终于不再只是一个黑箱。"];
    }
    if (issueCount >= VILLAGE_ISSUE_GOAL_IDS.length) {
      return ["柳青说：路通了、饭点亮着、冷链有电，出货箱里的数字才像真正回到了人身边。"];
    }
    if (villageIssueGoalComplete("elderCare") || villageIssueGoalComplete("clinicRoute")) {
      return ["柳青每次整理出货单，都会顺手看一眼老人互助饭点和巡诊路线。她说物流不只送货，也是在确认人有没有被落下。"];
    }
    return ["柳青从小认识每一条去镇上的路。她母亲常年在外跑运输，她比谁都清楚：路能把货送出去，也会把人越送越远。"];
  }
  if (npc.id === "nannan") {
    if (state.quests.schoolGardenForNannan?.status === "completed") {
      return ["楠楠放学后会先去看教室后面的小豆架。她说等不是一件事，照看才是一件事。"];
    }
    if (villageIssueGoalComplete("childCare")) {
      return ["楠楠说托管教室有一盏新灯。她把第一篇《家乡》作文写完后，贴在了教室门口。"];
    }
    return ["楠楠放学后总在广场等人。她不是剧情里的“问题”，她只是每天都要具体地等到天黑。"];
  }
  if (npc.id === "uncleChen") {
    if (state.quests.winterPantryForChen?.status === "completed") {
      return ["陈伯开始按冬储表点菜。他说日子最怕临时凑，饭点能提前一天知道锅里有什么，就是踏实。"];
    }
    if (villageIssueGoalComplete("elderCare") && villageIssueGoalComplete("clinicRoute")) {
      return ["陈伯说互助饭点和巡诊路线排起来以后，老人之间不再只靠互相猜谁还好不好。"];
    }
    return ["陈伯记得很多年轻人离开时的样子。他说村庄不是突然空下来的，是一户一户慢慢少了晚饭的声音。"];
  }
  return [];
}

function npcQuestPages(npc, quest, mode) {
  const pages = [...dialogLines(npc.dialog.hello), ...npcSeasonStagePages(npc), ...npcPersonalStoryPages(npc).slice(0, 1), ...npcContextPages(npc)];
  if (mode === "offer") {
    pages.push(quest.dialog.offer, questGoalText(quest), questProgressText(quest), `奖励：${questRewardText(quest)}`);
    if (quest.status === "readyToTurnIn") pages.push("目标已达成，再次对话即可交付。");
    return pages;
  }
  if (mode === "active") {
    pages.push(quest.dialog.active, questProgressText(quest), "完成后再来找我。");
    return pages;
  }
  if (mode === "ready") {
    pages.push(quest.dialog.ready, `奖励：${questRewardText(quest)}`);
    return pages;
  }
  if (mode === "completed") {
    pages.push(quest.dialog.completed);
    return pages;
  }
  return pages;
}

function npcIdlePages(npc) {
  const completedLines = (npc.questIds ?? [])
    .map((questId) => state.quests[questId])
    .filter((quest) => quest?.status === "completed")
    .map((quest) => quest.dialog.completed);
  return [...npcSeasonStagePages(npc), ...npcPersonalStoryPages(npc), ...npcContextPages(npc), ...completedLines.slice(-1), ...dialogLines(npc.dialog.idle)];
}

function nextNpcQuest(npc) {
  for (const questId of npc.questIds ?? []) {
    const quest = state.quests[questId];
    if (!quest || quest.status === "completed") continue;
    return questUnlocked(quest) ? quest : null;
  }
  return null;
}

function nextLockedNpcQuest(npc) {
  return (npc.questIds ?? [])
    .map((questId) => state.quests[questId])
    .find((quest) => quest && quest.status !== "completed" && !questUnlocked(quest));
}

function npcLockedQuestPages(npc, quest) {
  return [
    ...npcIdlePages(npc),
    `${quest.title}还没开放。${questUnlockHint(quest)}`,
    `暗示：${npc.name}可能需要你先推进对应设施或主线，再回来面对他说话。支线只有接取后才会出现在 Q 任务面板。`,
  ];
}

function updateQuestHud() {
  normalizeQuestState();
  ui.questList.innerHTML = "";
  const quests = acceptedQuests();

  if (quests.length === 0) {
    const card = document.createElement("article");
    card.className = "quest-item";
    card.dataset.status = "empty";

    const heading = document.createElement("div");
    heading.className = "quest-item-heading";
    const title = document.createElement("strong");
    title.textContent = "尚未接取支线";
    const status = document.createElement("span");
    status.textContent = "找村民";
    heading.append(title, status);

    const meta = document.createElement("p");
    meta.className = "quest-meta";
    meta.textContent = "去村庄和林岚、何涛、柳青、楠楠、陈伯对话，接取后才会显示具体支线。";

    card.append(heading, meta);
    ui.questList.append(card);
    return;
  }

  for (const quest of quests) {
    const npc = state.npcs.find((item) => item.id === quest.npcId);
    const card = document.createElement("article");
    card.className = "quest-item";
    card.dataset.status = quest.status;

    const heading = document.createElement("div");
    heading.className = "quest-item-heading";
    const title = document.createElement("strong");
    title.textContent = quest.title;
    const status = document.createElement("span");
    status.textContent = questDisplayStatusLabel(quest);
    heading.append(title, status);

    const meta = document.createElement("p");
    meta.className = "quest-meta";
    meta.textContent = `${npc?.name ?? "NPC"} · ${questUnlocked(quest) ? `进度 ${getQuestProgress(quest)}/${quest.target}` : questUnlockHint(quest)} · 奖励 ${questRewardText(quest)}`;

    card.append(heading, meta);
    ui.questList.append(card);
  }
}

function hasMapObject(type, predicate = () => true) {
  return Object.values(maps).some((map) => map.objects?.some((object) => object.type === type && predicate(object, map)));
}

function hasPendingOrSettledShipment() {
  return hasFirstShipment() || totalCropCount(state.inventory.shippedCrops) > 0 || totalGoodCount(state.inventory.shippedGoods) > 0;
}

function ownedOrShippedGoodsCount() {
  return totalGoodCount(state.inventory.goods) + totalGoodCount(state.inventory.shippedGoods);
}

function fixedProcessingFacilityReady() {
  return hasMapObject(
    "processor",
    (object, map) => map.id === "farm" && object.machineId === "farmProcessor" && object.type === "processor",
  );
}

function storyObjective(label, current, target, hint) {
  const safeTarget = Math.max(1, Number(target) || 1);
  const safeCurrent = Math.max(0, Math.min(safeTarget, Number(current) || 0));
  return {
    label,
    current: safeCurrent,
    target: safeTarget,
    done: safeCurrent >= safeTarget,
    hint,
  };
}

function storyFlag(label, done, hint) {
  return storyObjective(label, done ? 1 : 0, 1, hint);
}

function storyTarget(mapId, x, y, label, action = "", tool = "") {
  return { mapId, x, y, label, action, tool };
}

function objectTarget(mapId, predicate, label, action = "", tool = "", fallback = { x: 0, y: 0 }) {
  const map = maps[mapId];
  const object = map?.objects?.find((item) => objectBelongsToMap(item, mapId) && predicate(item));
  return storyTarget(mapId, object?.x ?? fallback.x, object?.y ?? fallback.y, label, action, tool);
}

function seedShopTarget() {
  return objectTarget("village", (item) => item.type === "seedShop", "村庄种子铺", "从农场东边小路进村，面对村庄种子铺按 E 买种子", "", { x: 12, y: 12 });
}

function currentQuestTarget() {
  const quest = QUEST_ORDER.map((questId) => state.quests[questId]).find((item) => item && item.status !== "completed");
  const npc = state.npcs.find((item) => item.id === quest?.npcId) ?? state.npcs.find((item) => item.id === "mira");
  if (!npc) return storyTarget("village", 21, 16, "村庄广场", "找林岚、何涛或柳青接取/交付任务");
  const action = quest?.status === "readyToTurnIn" ? `找 ${npc.name} 交付任务` : `面对 ${npc.name} 按 E 对话`;
  return storyTarget(npc.mapId ?? "village", npc.x, npc.y, npc.name, action);
}

function issueBoardTarget(action = "面对村情记录板按 E 推进公共目标") {
  return objectTarget("village", (item) => item.type === "issueBoard", "村情记录板", action, "", { x: 14, y: 17 });
}

function communityFacilityTarget(goalId, action = "") {
  const def = communityFacilityDef(goalId);
  return storyTarget("village", def.x, def.y, def.name, action || `面对${def.name}按 E 查看设施阶段`);
}

function villageFacilityNextRequirementText(goalId) {
  const goal = VILLAGE_ISSUE_GOALS[goalId];
  const level = villageFacilityLevel(goalId);
  if (level <= 0) {
    if (!goal) return "需要先开放村情目标";
    if (!goal.isUnlocked()) return goal.requirement;
    return `修复需要 ${villageIssueGoalCostText(goal)} · ${facilityCostReadinessText(villageIssueGoalCostObject(goal))}`;
  }
  const cost = villageFacilityUpgradeCost(goalId);
  if (!cost) return "已到强化二";
  return `下一阶段：${COMMUNITY_FACILITY_LEVELS[level + 1].label} · 需要 ${villageFacilityUpgradeCostText(cost)} · ${facilityCostReadinessText(cost)}`;
}

function villageFacilityNextEffectText(goalId) {
  const level = villageFacilityLevel(goalId);
  if (level >= COMMUNITY_FACILITY_MAX_LEVEL) return `${COMMUNITY_FACILITY_LEVELS[level].summary} · ${facilityRewardEffectText(goalId, level)}`;
  const nextLevel = level + 1;
  return `${COMMUNITY_FACILITY_LEVELS[nextLevel]?.summary ?? COMMUNITY_FACILITY_LEVELS[level].summary} · ${facilityRewardEffectText(goalId, nextLevel)}`;
}

function communityFacilityStageFeedback(goalId, level = villageFacilityLevel(goalId)) {
  if (level <= 0) return VILLAGE_ISSUE_GOALS[goalId]?.description ?? "";
  const feedback = COMMUNITY_FACILITY_STAGE_FEEDBACK[goalId]?.[level];
  if (feedback) return feedback;
  return communityFacilityDef(goalId).result;
}

function villageFacilityProgressText(goalId) {
  const def = communityFacilityDef(goalId);
  return `${def.name} · ${villageFacilityStageLabel(goalId)} · ${villageFacilityNextRequirementText(goalId)}`;
}

function villageFacilityCountAtLevel(minLevel) {
  return VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageFacilityLevel(goalId) >= minLevel).length;
}

function routeFacilityGoalId(planId = state.story.secondYearPlan) {
  return SECOND_YEAR_ROUTE_FACILITY_GOALS[planId] ?? null;
}

function routeFacilityGoalDef(planId = state.story.secondYearPlan) {
  const goalId = routeFacilityGoalId(planId);
  return goalId ? communityFacilityDef(goalId) : null;
}

function routeFacilityUpgradeComplete(planId = state.story.secondYearPlan) {
  const goalId = routeFacilityGoalId(planId);
  return Boolean(goalId && villageFacilityLevel(goalId) >= COMMUNITY_FACILITY_MAX_LEVEL);
}

function routeFacilityRequirementText(planId = state.story.secondYearPlan) {
  const goalId = routeFacilityGoalId(planId);
  if (!goalId) return "第二年路线暂未选择推荐设施。";
  const def = communityFacilityDef(goalId);
  return `${def.name}强化二 ${villageFacilityLevel(goalId)}/${COMMUNITY_FACILITY_MAX_LEVEL}`;
}

function facilityStageBonus(goalId, level2Value, level3Value) {
  const level = villageFacilityLevel(goalId);
  if (level >= 3) return level3Value;
  if (level >= 2) return level2Value;
  return 0;
}

function facilityQuestRewardMultiplier() {
  return 1 + facilityStageBonus("childCare", 0.1, 0.2);
}

function facilityCommunityRewardMultiplier() {
  return facilityQuestRewardMultiplier();
}

function facilityBuildDiscountMultiplier() {
  return Math.max(0.7, 1 - facilityStageBonus("youthWorkshop", 0.1, 0.2));
}

function facilityEnergyBonus() {
  return facilityStageBonus("elderCare", 4, 8) + facilityStageBonus("clinicRoute", 6, 12);
}

function facilitySaleMultiplier() {
  return 1 + facilityStageBonus("coldChain", 0.08, 0.15);
}

function effectiveGoldAmount(base, multiplier = 1) {
  return Math.max(0, Math.round(Math.max(0, Number(base ?? 0)) * multiplier));
}

function effectiveQuestGoldReward(quest) {
  return effectiveGoldAmount(quest?.rewardGold ?? 0, facilityQuestRewardMultiplier());
}

function effectiveCommunityOrderGoldReward(order) {
  return effectiveGoldAmount(order?.rewardGold ?? 0, facilityCommunityRewardMultiplier());
}

function effectiveSaleIncome(baseValue) {
  return effectiveGoldAmount(baseValue, facilitySaleMultiplier());
}

function buildableEffectivePrice(def) {
  return Math.max(1, effectiveGoldAmount(def?.price ?? 1, facilityBuildDiscountMultiplier()));
}

function facilityRewardEffectText(goalId, level = villageFacilityLevel(goalId)) {
  if (goalId === "childCare") return level >= 3 ? "任务和社区奖励 +20%" : level >= 2 ? "任务和社区奖励 +10%" : "强化后提高任务和社区奖励";
  if (goalId === "youthWorkshop") return level >= 3 ? "建造购买成本 -20%" : level >= 2 ? "建造购买成本 -10%" : "强化后降低建造成本";
  if (goalId === "elderCare") return level >= 3 ? "每日体力上限 +8" : level >= 2 ? "每日体力上限 +4" : "强化后提供饭点体力加成";
  if (goalId === "clinicRoute") return level >= 3 ? "每日体力上限 +12" : level >= 2 ? "每日体力上限 +6" : "强化后提高体力上限";
  if (goalId === "coldChain") return level >= 3 ? "出售和出货收益 +15%" : level >= 2 ? "出售和出货收益 +8%" : "强化后降低损耗、提高出货收益";
  if (goalId === "waterCleanup") return level >= 3 ? "水质稳定到 Lv.3" : level >= 2 ? "水质稳定到 Lv.2" : "修复后水质提升并解锁基础鱼类";
  return COMMUNITY_FACILITY_LEVELS[level]?.summary ?? "";
}

function villageFacilityStateLabel(goalId) {
  const goal = VILLAGE_ISSUE_GOALS[goalId];
  const level = villageFacilityLevel(goalId);
  if (level >= COMMUNITY_FACILITY_MAX_LEVEL) return "强化二";
  if (level === 2) return "强化一";
  if (level === 1) return "已修复";
  return goal?.isUnlocked() ? "可修复" : "未开放";
}

function villageFacilityStateCounts() {
  return VILLAGE_ISSUE_GOAL_IDS.reduce(
    (counts, goalId) => {
      const label = villageFacilityStateLabel(goalId);
      counts[label] = (counts[label] ?? 0) + 1;
      return counts;
    },
    { 未开放: 0, 可修复: 0, 已修复: 0, 强化一: 0, 强化二: 0 },
  );
}

function villageFacilityStateSummary() {
  const counts = villageFacilityStateCounts();
  return `未开放 ${counts["未开放"]} · 可修复 ${counts["可修复"]} · 已修复 ${counts["已修复"]} · 强化一 ${counts["强化一"]} · 强化二 ${counts["强化二"]}`;
}

function buildVillageFacilityGuidance(goalId, kind, blocked = "") {
  const goal = VILLAGE_ISSUE_GOALS[goalId];
  const def = communityFacilityDef(goalId);
  const level = villageFacilityLevel(goalId);
  const nextLevel = Math.min(COMMUNITY_FACILITY_MAX_LEVEL, level + 1);
  const repairAction = `修复${def.name}：${blocked || facilityCostReadinessText(villageIssueGoalCostObject(goal))}；${villageFacilityEntryText(goalId)}`;
  const upgradeAction = `强化${def.name}到 Lv.${nextLevel}：${blocked || facilityCostReadinessText(villageFacilityUpgradeCost(goalId))}；${villageFacilityEntryText(goalId)}`;
  const isRepair = kind === "repair" || kind === "lockedRepair";
  const ready = !blocked && kind !== "lockedRepair";
  const title = isRepair ? `修复：${goal.title}` : `强化：${def.name}`;
  const statusText =
    kind === "lockedRepair"
      ? "未开放"
      : ready
        ? isRepair
          ? "可修复"
          : `可强化到 Lv.${nextLevel}`
        : blocked;
  const detail = `${goal.issue} · ${villageFacilityStageLabel(goalId)} · ${villageFacilityNextRequirementText(goalId)} · ${villageFacilityEntryText(goalId)}`;
  return {
    goalId,
    kind,
    goal,
    def,
    title,
    detail,
    statusText,
    status: kind === "lockedRepair" ? "blocked" : ready ? "ok" : "warn",
    target: isRepair ? issueBoardTarget(repairAction) : communityFacilityTarget(goalId, upgradeAction),
    effect: villageFacilityNextEffectText(goalId),
  };
}

function currentVillageFacilityGuidance() {
  const repairCandidates = VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => !villageIssueGoalComplete(goalId));
  const readyRepair = repairCandidates.find((goalId) => {
    const goal = VILLAGE_ISSUE_GOALS[goalId];
    return goal.isUnlocked() && !villageIssueGoalBlockedReason(goal);
  });
  if (readyRepair) return buildVillageFacilityGuidance(readyRepair, "repair");

  const upgradeCandidates = VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageFacilityLevel(goalId) > 0 && villageFacilityLevel(goalId) < COMMUNITY_FACILITY_MAX_LEVEL);
  const readyUpgrade = upgradeCandidates.find((goalId) => !villageFacilityUpgradeBlockedReason(goalId));
  if (readyUpgrade) return buildVillageFacilityGuidance(readyUpgrade, "upgrade");

  const blockedRepair = repairCandidates.find((goalId) => {
    const goal = VILLAGE_ISSUE_GOALS[goalId];
    return goal.isUnlocked();
  });
  if (blockedRepair) return buildVillageFacilityGuidance(blockedRepair, "repair", villageIssueGoalBlockedReason(VILLAGE_ISSUE_GOALS[blockedRepair]));

  const blockedUpgrade = upgradeCandidates.find((goalId) => villageFacilityUpgradeBlockedReason(goalId) !== "已满级");
  if (blockedUpgrade) return buildVillageFacilityGuidance(blockedUpgrade, "upgrade", villageFacilityUpgradeBlockedReason(blockedUpgrade));

  const lockedRepair = repairCandidates[0];
  if (lockedRepair) return buildVillageFacilityGuidance(lockedRepair, "lockedRepair", VILLAGE_ISSUE_GOALS[lockedRepair].requirement);

  return null;
}

function currentIncompleteStoryObjective() {
  return currentStoryObjectives().find((item) => !item.done) ?? null;
}

function currentStoryTargetInfo(objective = currentIncompleteStoryObjective()) {
  const label = objective?.label ?? "";
  if (!label) return null;
  if (label.includes("路线推荐设施")) {
    const goalId = routeFacilityGoalId();
    return goalId
      ? communityFacilityTarget(goalId, `把${communityFacilityDef(goalId).name}推进到强化二`)
      : issueBoardTarget("先选择第二年路线，再查看推荐设施");
  }
  if (label.includes("设施") && label.includes("强化")) {
    return currentVillageFacilityGuidance()?.target ?? issueBoardTarget("查看当前可修复或可强化设施");
  }
  if (label.includes("整理")) return storyTarget("farm", 44, 16, "右上角清场草地", "按 2 切换锄头，在草地按 Space", "锄头");
  if (label.includes("播种")) return storyTarget("farm", 44, 16, "新开垦泥土地", "按 3 切换种子，在泥土地按 Space", "种子");
  if (label.includes("浇水")) return storyTarget("farm", 44, 16, "作物地块", "按 4 切换水壶，对作物按 Space", "水壶");
  if (label.includes("睡到") || label.includes("年终会")) return storyTarget("house", 12, 5, "床", "面对床按 E，或打开系统菜单睡觉");
  if (label.includes("累计收获")) return storyTarget("farm", 44, 16, "成熟作物", "按 5 切换镰刀，站在作物上或面对作物按 Space", "镰刀");
  if (label.includes("第一次出货") || label.includes("加工品出货")) {
    return objectTarget("farm", (item) => item.type === "shippingBin", "出货箱", "面对出货箱按 E 投入作物或加工品", "", { x: 16, y: 20 });
  }
  if (label.includes("查看村庄反馈")) {
    return objectTarget("village", (item) => item.storyId === "firstShipmentFeedback", "村庄公告栏", "面对公告栏按 E 查看反馈", "", { x: 16, y: 13 });
  }
  if (label.includes("村庄杂货铺")) {
    return objectTarget("village", (item) => item.type === "shop" || item.featureId === "villageMarket", "停业杂货铺", "面对废墟按 E 修复", "", { x: 31, y: 12 });
  }
  if (label.includes("山里资源点")) {
    return objectTarget("mountain", (item) => item.type === "resourceNode" && item.resourceId === "quarry", "旧采石点", "第 11 天后面对资源点按 E，采石料、铜矿和煤", "", { x: 27, y: 20 });
  }
  if (label.includes("春集")) {
    return objectTarget("village", (item) => item.type === "springFairStall", "春集种子摊", `春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天面对摊位按 E，优先买早豆试种包`, "", { x: 18, y: 14 });
  }
  if (label.includes("春季样本")) {
    const missing = springSampleBundleMissingDetailText() || springSampleBundleMissingText();
    return objectTarget(
      "village",
      (item) => item.type === "springSampleCrate",
      "春季样本箱",
      state.story.springSampleBundleCompleted ? "春季样本已提交" : `清明后可提交样本；可跨年继续。还缺：${missing || "材料齐全，面对样本箱按 E"}`,
      "",
      { x: 15, y: 18 },
    );
  }
  if (label.includes("夏季启动资金")) {
    return objectTarget("farm", (item) => item.type === "shippingBin", "出货箱", "出售作物、加工品或春集余货，保留夏季资金", "", { x: 16, y: 20 });
  }
  if (label.includes("村民任务")) return currentQuestTarget();
  if (label.includes("村情目标")) {
    return currentVillageFacilityGuidance()?.target ?? issueBoardTarget("面对记录板按 E 推进公共目标");
  }
  if (label.includes("木匠") || label.includes("建造")) {
    return objectTarget("village", (item) => item.type === "upgradeBoard" || item.featureId === "construction", "木匠公告牌", "面对公告牌按 E 修复或打开建造商店", "", { x: 31, y: 20 });
  }
  if (label.includes("购买") || label.includes("种子")) {
    return seedShopTarget();
  }
  if (label.includes("加工设施") || label.includes("加工") || label.includes("加工品")) {
    return objectTarget("farm", (item) => item.type === "processor" || item.featureId === "processing", "加工桶", "面对加工桶按 E 修复、启动或领取成品", "", { x: 18, y: 20 });
  }
  if (label.includes("合作社") || label.includes("合同")) {
    return objectTarget("village", (item) => item.type === "cooperativeDesk" || item.featureId === "cooperative", "合作社窗口", "面对合作社窗口按 E 提交样品或合同", "", { x: 33, y: 17 });
  }
  if (label.includes("选择第二年方向")) {
    return objectTarget("farm", (item) => item.type === "mailbox", "邮箱", "年终会后查看方向选择，或在弹窗里选择", "", { x: 20, y: 14 });
  }
  if (label.includes("游客服务")) {
    return objectTarget("village", (item) => item.type === "tourismDesk" || item.featureId === "tourism", "游客服务亭", "面对游客服务亭按 E 修复或提交游客订单", "", { x: 34, y: 18 });
  }
  if (label.includes("品牌")) {
    return objectTarget("village", (item) => item.type === "brandDesk" || item.featureId === "brand", "品牌包装台", "面对品牌包装台按 E 制作礼盒", "", { x: 11, y: 17 });
  }
  if (label.includes("水利") || label.includes("水壶容量")) {
    return objectTarget("farm", (item) => item.type === "irrigationPump" || item.featureId === "irrigation", "水利水泵", "面对水泵按 E 启动水渠工程", "", { x: 22, y: 22 });
  }
  if (label.includes("农场评价")) return storyTarget("farm", 21, 18, "农场路牌", "按主线卡补齐作物、建造、社区和图鉴");
  if (label.includes("金币")) return objectTarget("farm", (item) => item.type === "shippingBin", "出货箱", "出售或出货作物和加工品积累金币", "", { x: 16, y: 20 });
  return storyTarget(state.mapId, currentMap().spawn.x, currentMap().spawn.y, "当前地图出生点", "查看主线卡和路牌确认下一步");
}

function storyTargetLine(target) {
  if (!target) return "";
  const mapName = maps[target.mapId]?.name ?? target.mapId;
  const action = target.action ? `；${target.action}` : "";
  const tool = target.tool ? `；工具：${target.tool}` : "";
  return `去哪里：${mapName} · ${target.label} (${target.x},${target.y})${action}${tool}`;
}

function currentGuidanceSnapshot(objective = currentIncompleteStoryObjective()) {
  const target = currentStoryTargetInfo(objective);
  const checkpoint = currentPlaythroughCheckpoint();
  const missingShrine = landShrineMissingCategories()[0] ?? null;
  return {
    objective,
    target,
    targetLine: storyTargetLine(target),
    checkpoint,
    checkpointLine: checkpoint ? `${checkpoint.title}：${playthroughRequirementLine(checkpoint)}` : "",
    shrineLine: landShrineFinalReady() ? "土地庙最终追问已开放。" : missingShrine ? landShrineMissingText(missingShrine) : landShrineCurrentHint(),
  };
}

function currentGuidanceActionLine(snapshot = currentGuidanceSnapshot()) {
  if (snapshot.targetLine) return `${snapshot.objective?.label ?? "当前目标"} · ${snapshot.targetLine}`;
  if (snapshot.checkpointLine) return snapshot.checkpointLine;
  return snapshot.shrineLine;
}

function guidanceConsistencyItems(snapshot = currentGuidanceSnapshot()) {
  const facilityGuidance = currentVillageFacilityGuidance();
  return [
    {
      label: "Q 任务面板",
      status: snapshot.objective ? "ok" : "warn",
      detail: snapshot.objective ? `当前目标：${snapshot.objective.label}` : "当前阶段目标已完成，查看下一阶段或土地庙缺口。",
    },
    {
      label: "路牌",
      status: "ok",
      detail: snapshot.objective ? `路牌会显示：${snapshot.objective.label}` : "路牌会显示当前阶段已完成和地图规则。",
    },
    {
      label: "小地图",
      status: snapshot.target ? "ok" : "blocked",
      detail: snapshot.targetLine || "当前目标缺少可定位点，需要补地图目标。",
    },
    {
      label: "土地庙",
      status: "ok",
      detail: snapshot.shrineLine,
    },
    {
      label: "设施入口",
      status: facilityGuidance?.target ? "ok" : "warn",
      detail: facilityGuidance
        ? `${facilityGuidance.title} · ${facilityGuidance.statusText} · ${storyTargetLine(facilityGuidance.target)}`
        : `全部设施暂无待处理目标 · ${villageFacilityStateSummary()}`,
    },
  ];
}

function guidanceConsistencySummary(snapshot = currentGuidanceSnapshot()) {
  const items = guidanceConsistencyItems(snapshot);
  const blocked = items.filter((item) => item.status === "blocked").length;
  const warn = items.filter((item) => item.status === "warn").length;
  if (blocked > 0) return `入口一致性：${blocked} 项阻塞，优先补小地图/目标定位。`;
  if (warn > 0) return `入口一致性：${warn} 项提示，当前仍可继续推进。`;
  return "入口一致性：Q 任务、路牌、小地图和土地庙指向一致。";
}

function currentStoryPhase() {
  const season = seasonInfoForDay();
  if (season.year > 1 || state.story.viewedYearEnd) {
    const plan = secondYearPlanDef();
    return {
      id: "secondYearDirection",
      seasonId: season.id,
      title: plan ? `第二年：${plan.name}` : "第二年：方向选择",
      summary: plan ? plan.summary : "第一年已经结束，先确定第二年的发展路线。",
      completeText: plan ? plan.hint : "在邮箱或年终会弹窗中选择第二年方向。",
    };
  }
  return STORY_PHASES.find((phase) => phase.seasonId === season.id) ?? STORY_PHASES[0];
}

function currentStoryObjectives() {
  const phase = currentStoryPhase();
  if (phase.id === "secondYearDirection") {
    const plan = secondYearPlanDef();
    const contractTarget = plan?.id === "cooperative" ? 4 : 2;
    const scoreTarget = plan?.id === "tourism" ? 70 : 60;
    const currentScore = farmScoreTotal();
    const routeProgress = secondYearRouteProgress(plan?.id);
    const objectives = [
      storyFlag("选择第二年方向", Boolean(plan), "在邮箱或年终会弹窗里选择合作社、旅游、水利或品牌路线。"),
      storyObjective(
        "完成当前路线起步闭环",
        routeProgress.done,
        Math.max(1, routeProgress.total),
        routeProgress.next ? `下一步：${routeProgress.next.title}。${routeStepDetail(routeProgress.next)}` : "路线起步闭环已完成，土地庙会记录这条路。",
      ),
      storyObjective("完成合作社合同", completedCooperativeContractCount(), contractTarget, "继续在合作社窗口提交当前节气合同。"),
      storyObjective("完成全部村情目标", completedVillageIssueGoalCount(), VILLAGE_ISSUE_GOAL_IDS.length, "去村庄广场查看村情记录板，推进托管、青年、照护、巡诊、冷链和水质目标。"),
      storyObjective(
        "完成路线推荐设施强化二",
        routeFacilityUpgradeComplete(plan?.id) ? 1 : 0,
        1,
        `${routeFacilityRequirementText(plan?.id)}。回访已修复设施，投入加工品和高阶资源，把它推进到强化二。`,
      ),
      storyObjective("农场评价达到目标", currentScore, scoreTarget, "通过作物、建造、社区和图鉴提升农场评价。"),
      storyObjective("金币达到 600g", state.inventory.gold, 600, "第二年需要更高现金流，优先卖出作物和加工品。"),
    ];
    if (plan?.id === "cooperative") {
      objectives.splice(
        1,
        0,
        storyFlag("加入合作社扩张", state.story.cooperativeJoined, "先修复合作社窗口并完成入社样品。"),
        storyObjective("完成 3 张扩张合同", cooperativeExpansionProgress(), COOPERATIVE_EXPANSION.dividendEveryContracts, "选择合作社路线后，继续完成节气合同累计扩张进度。"),
        storyObjective("连续供货 3 张", state.story.cooperativeExpansionBestStreak, 3, "尽量连续完成相邻节气合同，形成稳定供货记录。"),
        storyFlag("领取一次社员分红", state.story.cooperativeExpansionDividendClaimedTiers.length > 0, "每完成 3 张路线合同自动发放一次分红。"),
      );
    }
    if (plan?.id === "tourism") {
      objectives.splice(
        1,
        0,
        storyFlag("修复游客服务亭", state.story.tourismRepaired, "去村庄广场面对游客服务旧亭按 E 修复。"),
        storyObjective("布置 3 件农场装饰", placedDecorationCount(), 3, "在建造面板购买花箱、路灯、长椅或篱笆，回农场放置。"),
        storyFlag("完成第一批游客订单", state.story.tourismFirstOrderCompleted, "在游客服务亭提交作物礼篮和加工试吃。"),
      );
    }
    if (plan?.id === "brand") {
      objectives.splice(
        1,
        0,
        storyFlag("修复品牌包装台", state.story.brandRepaired, "去村庄集市面对品牌包装旧台按 E 修复。"),
        storyFlag("制作 1 个品牌礼盒", state.story.brandFirstPackCreated, "在品牌包装台消耗作物和普通加工品制作礼盒。"),
        storyFlag("结算第一批品牌礼盒", state.story.brandFirstShipmentSettled, "把品牌礼盒投入出货箱，睡觉后完成结算。"),
      );
    }
    if (plan?.id === "irrigation") {
      objectives.splice(
        1,
        0,
        storyFlag("修复水利水泵", state.story.irrigationRepaired, "回到农场旧水泵处按 E 修复。"),
        storyFlag("完成第一段水渠工程", state.story.irrigationFirstProjectCompleted, "在水利水泵投入金币启动水渠工程。"),
        storyObjective("水渠覆盖区种下 4 株", irrigationZoneCropCount(), 4, "在农场南侧水渠覆盖区开垦、播种，测试扩建区稳定生产。"),
        storyObjective("水壶容量达到 8", wateringCanCapacityForStory(), WATERING_CAN_CAPACITY + IRRIGATION_PROJECT.capacityBonus, "完成水渠工程后水壶容量提升。"),
      );
    }
    return objectives;
  }
  const harvestCount = state.inventory.harvestedCrops;
  const completedQuests = completedQuestCount();
  const constructionReady = hasMapObject("upgradeBoard");
  const processingReady = state.story.processingRepaired || fixedProcessingFacilityReady();
  const goodsCount = ownedOrShippedGoodsCount();

  if (phase.id === "springFirstField") {
    return [
      storyObjective("整理 3 格土地", state.story.firstFieldHoed, 3, "切换锄头，在草地上按 Space，把荒地整理成可播种泥土。"),
      storyObjective("亲手播种 3 株", state.story.firstFieldPlanted, 3, "切换种子，在脚下泥土地按 Space 播种。"),
      storyObjective("完成 3 次浇水", state.story.firstFieldWatered, 3, "切换水壶，对作物按 Space；水不够就面对水源补水。"),
      storyFlag("第一次到村庄", state.story.firstVillageVisitSeen, "从农场东边小路进村。第一次进村只会出现日志/浮字导览，不会弹窗打断移动。"),
      storyFlag("第一次查看村庄种子铺", state.story.firstSeedShopVisited, "从农场东边小路进村，面对村庄种子铺按 E，确认后续种子补货入口。"),
      storyFlag("睡到次日看作物成长", state.story.sleptAfterWatering, "作物浇水后回屋睡觉，第二天会推进成长。"),
      storyObjective("累计收获 3 个作物", harvestCount, 3, "作物成熟后切换镰刀，站在作物上或面对作物按 Space 收获。"),
      storyFlag("完成第一次出货结算", state.story.firstShipmentSettled, "面对出货箱按 E 投入作物，然后睡觉结算收入。"),
      storyFlag("查看村庄反馈", state.story.villageFeedbackSeen, "第一次出货结算后走东边小路去村庄广场，看公告栏反馈。"),
      storyFlag("修复村庄杂货铺", hasMapObject("shop", (_object, map) => map.id === "village"), "看完反馈后，面对停业杂货铺按 E 修复，村庄开始恢复。"),
      storyFlag("开放山里资源点", state.story.mountainResourceVisited, "第 11 天后从农场北侧山路去山里，面对旧采石点、林缘采集点或废弃工具棚按 E 采集。"),
      storyFlag("春集窗口", springFairWindowResolved(), `春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天到村庄春集种子摊购买早豆或工具材料；错过也不阻塞夏季。`),
      storyObjective("准备夏季启动资金 200g", state.inventory.gold, 200, "春末尽量保留 200g 左右，用来进入夏季后补种和推进助农集市。"),
    ];
  }

  if (phase.id === "summerMarketPrep") {
    return [
      storyObjective("累计收获 8 个作物", harvestCount, 8, "夏季开始供应小麦、番茄、豆子和玉米，扩大种植面积。"),
      storyObjective("完成 1 个村民任务", completedQuests, 1, "和林岚、何涛、柳青对话，接取并交付任务。"),
      storyObjective("推进 1 个村情目标", completedVillageIssueGoalCount(), 1, "去村庄广场查看村情记录板，先从托管教室或青年工坊开始。"),
      storyObjective("完成 1 座设施强化一", villageFacilityCountAtLevel(2), 1, "村情目标修复后，回访对应设施，投入金币、作物和资源强化到 Lv.2。"),
      storyFlag("修复木匠公告牌", constructionReady, "达到建造条件后，面对旧公告牌按 E 修复。"),
      storyFlag("购买或保留 5 包种子", totalCropCount(state.inventory.seeds) >= 5, "在村庄种子铺补充库存，准备连续播种。"),
    ];
  }

  if (phase.id === "autumnCoopTrial") {
    return [
      storyObjective("累计收获 18 个作物", harvestCount, 18, "秋季适合批量出货，红薯和玉米能补稳定收入。"),
      storyObjective("完成 2 个村民任务", completedQuests, 2, "继续推进 NPC 任务，让合作社有基础记录。"),
      storyFlag("修复加工设施", state.story.processingRepaired || processingReady, "完成电商试单后，面对废弃加工桶按 E 修复。"),
      storyFlag("启动第一批加工", state.story.firstMachineStarted, "把作物投入加工桶或厨房加工台，先做出第一批加工品。"),
      storyObjective("获得 1 个加工品", state.story.firstProcessedGoodCollected ? 1 : goodsCount, 1, "加工桶隔夜完成后回来领取成品。"),
      storyFlag("结算 1 次加工品出货", state.story.firstProcessedShipmentSettled, "把加工品投入出货箱，睡觉后结算更高收入。"),
      storyFlag("加入合作社试运行", state.story.cooperativeJoined, "修复村庄合作社旧窗口，提交作物和加工品样品。"),
      storyObjective("完成 2 个村情目标", completedVillageIssueGoalCount(), 2, "村庄恢复不只看经济，也要推进照护、教育和公共服务。"),
      storyObjective("完成 1 座设施强化一", villageFacilityCountAtLevel(2), 1, "秋季开始把工坊、冷链或饭点推进到强化一，让产业链和公共服务都有实际回报。"),
      storyObjective("完成 1 张合作社合同", completedCooperativeContractCount(), 1, "入社后查看合作社窗口，完成当前节气批量合同。"),
    ];
  }

  return [
    storyObjective("累计收获 30 个作物", harvestCount, 30, "冬季仍可种小白菜和菠菜，保持现金流。"),
    storyObjective("完成 3 个村民任务", completedQuests, 3, "年终评价会看社区协作，不只看金币。"),
    storyObjective("完成全部村情目标", completedVillageIssueGoalCount(), VILLAGE_ISSUE_GOAL_IDS.length, "村情记录板上的公共目标会影响一周目主题表达，也是土地庙最终追问条件。"),
    storyObjective("完成 1 座设施强化二", villageFacilityCountAtLevel(3), 1, "冬季适合补材料，把至少一座公共设施推进到强化二，为第二年路线打底。"),
    storyObjective("完成 2 张合作社合同", completedCooperativeContractCount(), 2, "合作社合同会提高年终社区评价。"),
    storyObjective("金币达到 300g", state.inventory.gold, 300, "通过商店出售、出货箱结算和订单奖励积累资金。"),
    storyFlag(
      "完成大寒年终会",
      state.story.viewedYearEnd,
      "推进到第一年大寒第五天并睡觉，查看年度总结。",
    ),
  ];
}

function updateStoryHud() {
  const phase = currentStoryPhase();
  const season = seasonInfoForDay();
  const objectives = currentStoryObjectives();
  const doneCount = objectives.filter((objective) => objective.done).length;
  const nextObjective = objectives.find((objective) => !objective.done);

  ui.storyPhase.textContent = season.solarTerm.name;
  ui.storyProgress.textContent = `${phase.title} · ${doneCount}/${objectives.length}`;
  ui.storyObjectiveList.innerHTML = "";

  for (const objective of objectives) {
    const item = document.createElement("li");
    item.dataset.done = objective.done ? "true" : "false";
    const label = document.createElement("span");
    label.textContent = objective.label;
    const progress = document.createElement("strong");
    progress.textContent = objective.target === 1 ? (objective.done ? "完成" : "未完成") : `${objective.current}/${objective.target}`;
    item.append(label, progress);
    ui.storyObjectiveList.append(item);
  }

  const rewardText = phase.rewardText ? `阶段回报：${phase.rewardText}` : "";
  const targetInfo = nextObjective ? currentStoryTargetInfo(nextObjective) : null;
  const targetLine = storyTargetLine(targetInfo);
  ui.storyTargetHint.textContent = targetLine || "去哪里：本阶段已完成，可查看路牌、任务和土地庙回顾。";
  ui.storyNextHint.textContent = nextObjective
    ? `${nextObjective.hint}${targetLine ? ` · ${targetLine}` : ""}${rewardText ? ` · ${rewardText}` : ""}`
    : `${phase.completeText}${rewardText ? ` · ${rewardText}` : ""}`;
}

function taskTreeNode(label, done, detail = "") {
  return { label, done, detail };
}

function routeStepTaskTreeNodes(planId = state.story.secondYearPlan) {
  return secondYearRouteStepDefs(planId).map((step) => taskTreeNode(step.title, step.isDone(), routeStepDetail(step)));
}

function questTaskTreeDetail(quest) {
  const npc = state.npcs.find((item) => item.id === quest.npcId);
  const facilityText = questFacilityText(quest);
  if (quest.status === "completed") return facilityText || "完成";
  if (quest.status === "readyToTurnIn") return `可交付 · 找${npc?.name ?? "村民"}`;
  const progress = `${getQuestProgress(quest)}/${quest.target}`;
  return facilityText ? `${progress} · ${facilityText}` : progress;
}

function acceptedQuestTaskTreeSection() {
  const quests = acceptedQuests();
  if (quests.length === 0) return null;
  return {
    title: "已接支线",
    nodes: quests.map((quest) => {
      const npc = state.npcs.find((item) => item.id === quest.npcId);
      return taskTreeNode(`${npc?.name ?? "村民"}：${quest.title}`, quest.status === "completed", questTaskTreeDetail(quest));
    }),
  };
}

function villageFacilityTaskTreeSection() {
  const guidance = currentVillageFacilityGuidance();
  if (!guidance && villageFacilityCountAtLevel(COMMUNITY_FACILITY_MAX_LEVEL) === 0) return null;
  const nodes = [
    taskTreeNode("修复设施", villageFacilityCountAtLevel(1) >= 1, `${villageFacilityCountAtLevel(1)}/${VILLAGE_ISSUE_GOAL_IDS.length}`),
    taskTreeNode("强化一", villageFacilityCountAtLevel(2) >= 1, `${villageFacilityCountAtLevel(2)}/${VILLAGE_ISSUE_GOAL_IDS.length}`),
    taskTreeNode("强化二", villageFacilityCountAtLevel(3) >= 1, `${villageFacilityCountAtLevel(3)}/${VILLAGE_ISSUE_GOAL_IDS.length}`),
  ];
  if (guidance) {
    nodes.unshift(taskTreeNode(guidance.title, false, `${guidance.statusText} · ${storyTargetLine(guidance.target)}`));
  }
  nodes.push(taskTreeNode("五态入口检查", true, villageFacilityStateSummary()));
  return { title: "设施修复 / 强化", nodes };
}

function taskTreeSections() {
  const villageShopRepaired = hasMapObject("shop", (_object, map) => map.id === "village");
  const constructionReady = hasMapObject("upgradeBoard");
  const goodsCount = ownedOrShippedGoodsCount();
  const route = secondYearPlanDef();
  const shrineMissing = landShrineMissingCategories();
  const sectionsByPhase = {
    springFirstField: {
      title: "春季：第一块地",
      nodes: [
        taskTreeNode("整理土地", state.story.firstFieldHoed >= 3, `${Math.min(state.story.firstFieldHoed, 3)}/3`),
        taskTreeNode("播种", state.story.firstFieldPlanted >= 3, `${Math.min(state.story.firstFieldPlanted, 3)}/3`),
        taskTreeNode("浇水成长", state.story.firstFieldWatered >= 3 && state.story.sleptAfterWatering, `${Math.min(state.story.firstFieldWatered, 3)}/3`),
        taskTreeNode("收获 3 个作物", state.inventory.harvestedCrops >= 3, `${Math.min(state.inventory.harvestedCrops, 3)}/3`),
        taskTreeNode("第一次出货", state.story.firstShipmentSettled),
        taskTreeNode("看村庄反馈", state.story.villageFeedbackSeen),
        taskTreeNode("修复杂货铺", villageShopRepaired),
        taskTreeNode("山里资源点", state.story.mountainResourceVisited),
        taskTreeNode("春集窗口", springFairWindowResolved(), state.story.springFairVisited ? "已参加" : springFairIsOpen() ? "开放中" : "可后续年份再遇到"),
        taskTreeNode("夏季启动资金", state.inventory.gold >= 200, `${Math.min(state.inventory.gold, 200)}/200g`),
      ],
    },
    summerMarketPrep: {
      title: "夏季：助农集市",
      nodes: [
        taskTreeNode("累计收获 8 个", state.inventory.harvestedCrops >= 8, `${Math.min(state.inventory.harvestedCrops, 8)}/8`),
        taskTreeNode("完成村民任务", completedQuestCount() >= 1, `${Math.min(completedQuestCount(), 1)}/1`),
        taskTreeNode("推进村情目标", completedVillageIssueGoalCount() >= 1, `${Math.min(completedVillageIssueGoalCount(), 1)}/1`),
        taskTreeNode("修复木匠公告牌", constructionReady),
        taskTreeNode("助农集市搭棚", state.story.marketPrepCompleted),
        taskTreeNode("社区订单跑通", state.story.communityOrdersCompleted, `${completedCommunityOrderCount()}/2`),
      ],
    },
    autumnCoopTrial: {
      title: "秋季：加工与合作社",
      nodes: [
        taskTreeNode("电商助农试单", state.story.ecommerceTrialShipped),
        taskTreeNode("修复加工桶", state.story.processingRepaired),
        taskTreeNode("启动第一批加工", state.story.firstMachineStarted),
        taskTreeNode("获得加工品", state.story.firstProcessedGoodCollected || goodsCount >= 1, String(goodsCount)),
        taskTreeNode("加工品出货", state.story.firstProcessedShipmentSettled),
        taskTreeNode("加入合作社", state.story.cooperativeJoined),
        taskTreeNode("完成合作社合同", completedCooperativeContractCount() >= 1, `${completedCooperativeContractCount()}/1`),
      ],
    },
    winterYearEnd: {
      title: "冬季：年终收束",
      nodes: [
        taskTreeNode("累计收获 30 个", state.inventory.harvestedCrops >= 30, `${Math.min(state.inventory.harvestedCrops, 30)}/30`),
        taskTreeNode("完成 3 个村民任务", completedQuestCount() >= 3, `${Math.min(completedQuestCount(), 3)}/3`),
        taskTreeNode("完成全部村情目标", completedVillageIssueGoalCount() >= VILLAGE_ISSUE_GOAL_IDS.length, `${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length}`),
        taskTreeNode("完成 2 张合作社合同", completedCooperativeContractCount() >= 2, `${completedCooperativeContractCount()}/2`),
        taskTreeNode("金币达到 300g", state.inventory.gold >= 300, `${Math.min(state.inventory.gold, 300)}/300g`),
        taskTreeNode("大寒年终会", state.story.viewedYearEnd),
      ],
    },
    secondYearDirection: {
      title: "第二年：路线与土地庙",
      nodes: [
        taskTreeNode("选择第二年方向", Boolean(route), route?.name ?? "未选择"),
        ...routeStepTaskTreeNodes(route?.id),
        taskTreeNode("完成路线起步闭环", currentRouteMilestoneComplete(), route ? secondYearRouteProgressText(route.id) : ""),
        taskTreeNode("土地庙缺口清零", shrineMissing.length === 0, shrineMissing.length > 0 ? `还缺 ${shrineMissing.length} 类` : "完成"),
        taskTreeNode("土地庙最终追问", state.story.landShrineFinalRevealed),
      ],
    },
  };
  const phaseId = currentStoryPhase().id;
  const currentMainlineSection = sectionsByPhase[phaseId] ?? sectionsByPhase.springFirstField;
  const sideQuestSection = acceptedQuestTaskTreeSection();
  const facilitySection = villageFacilityTaskTreeSection();
  return [currentMainlineSection, facilitySection, sideQuestSection].filter(Boolean);
}

function updateTaskTreeHud() {
  const sections = taskTreeSections();
  const total = sections.reduce((sum, section) => sum + section.nodes.length, 0);
  const done = sections.reduce((sum, section) => sum + section.nodes.filter((node) => node.done).length, 0);
  ui.taskTreeProgress.textContent = `${done}/${total}`;
  ui.taskTreeList.innerHTML = "";

  for (const section of sections) {
    const doneCount = section.nodes.filter((node) => node.done).length;
    const item = document.createElement("li");
    item.dataset.status = doneCount === section.nodes.length ? "ok" : doneCount > 0 ? "warn" : "blocked";

    const heading = document.createElement("div");
    heading.className = "task-tree-heading";
    const title = document.createElement("strong");
    title.textContent = section.title;
    const progress = document.createElement("span");
    progress.textContent = `${doneCount}/${section.nodes.length}`;
    heading.append(title, progress);
    item.append(heading);

    const branch = document.createElement("div");
    branch.className = "task-tree-branch";
    for (const node of section.nodes) {
      const step = document.createElement("span");
      step.dataset.done = node.done ? "true" : "false";
      step.textContent = `${node.done ? "✓" : "○"} ${node.label}${node.detail ? ` · ${node.detail}` : ""}`;
      branch.append(step);
    }
    item.append(branch);
    ui.taskTreeList.append(item);
  }
}

function taskTreeNodeStatus(node) {
  return node.done ? "完成" : "未完成";
}

function appendTaskDialogSection(panel, titleText) {
  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = titleText;
  section.append(title);
  panel.append(section);
  return section;
}

function showTaskPanelDialog() {
  setTaskOverlayVisible(true, "current");
  addLog("打开任务面板。");
}

function firstYearCheckStatusLabel(status) {
  return {
    ok: "正常",
    warn: "关注",
    blocked: "阻塞",
  }[status] ?? status;
}

function release20AcceptanceItems() {
  const expected = expectedAssetDescriptors();
  const expectedStatuses = expected.map((descriptor) => artDescriptorRuntimeStatus(descriptor));
  const loadedOrFallback = expectedStatuses.filter((status) => status === "loaded" || status === "fallback").length;
  const assetCoverageOk = !ART_ASSET_LOADING_ENABLED || loadedOrFallback >= Math.floor(expected.length * 0.85);
  const shortcutReady = Boolean(ui.taskOverlay && ui.journalOverlay && ui.minimapOverlay && ui.buildOverlay && ui.systemMenu);
  const currentTargetReady = Boolean(currentStoryTargetInfo(currentIncompleteStoryObjective()) || currentStoryPhase().id === "secondYearDirection");
  const waterReady = FISH_IDS.some((fishId) => fishDef(fishId).minWaterQuality >= 2) && waterQualitySignText().includes("下一批");
  const facilityReady = VILLAGE_ISSUE_GOAL_IDS.every((goalId) => communityFacilityDef(goalId) && typeof villageFacilityLevel(goalId) === "number");
  const saveReady = typeof normalizeInventory === "function" && typeof normalizeStoryState === "function" && typeof normalizeQuestCollection === "function";
  const statusById = {
    fallback: "ok",
    assets: assetCoverageOk ? "ok" : "warn",
    firstYear: currentTargetReady ? "ok" : "warn",
    waterFish: waterReady ? "ok" : "warn",
    facilities: facilityReady ? "ok" : "blocked",
    saveSafety: saveReady && !debug.testSkipActive ? "ok" : "warn",
  };
  return RELEASE_2_0_ACCEPTANCE_DEFS.map((item) => ({
    ...item,
    status: statusById[item.id] ?? "warn",
    meta:
      item.id === "assets"
        ? `资源覆盖 ${loadedOrFallback}/${expected.length} · ${ART_ASSET_LOADING_ENABLED ? "assets=1" : "fallback"}`
        : item.id === "firstYear"
          ? guidanceConsistencySummary()
          : item.id === "waterFish"
            ? `当前水质：${waterQualityLabel()}`
            : item.id === "facilities"
              ? villageFacilityStateSummary()
              : item.id === "saveSafety" && debug.testSkipActive
                ? "测试跳过状态中，不会自动保存"
                : "可验收",
  }));
}

function release20ReadinessStatus() {
  const items = release20AcceptanceItems();
  if (items.some((item) => item.status === "blocked")) return "blocked";
  if (items.some((item) => item.status === "warn")) return "warn";
  return "ok";
}

function release20ReadinessSummary() {
  const items = release20AcceptanceItems();
  const ok = items.filter((item) => item.status === "ok").length;
  const warn = items.filter((item) => item.status === "warn").length;
  const blocked = items.filter((item) => item.status === "blocked").length;
  return `v0.2.0 演示验收 ${ok}/${items.length}；关注 ${warn}，阻塞 ${blocked}。`;
}

function firstYearCheckItems() {
  const phase = currentStoryPhase();
  const objective = currentIncompleteStoryObjective();
  const guidance = currentGuidanceSnapshot(objective);
  const target = guidance.target;
  const targetLine = guidance.targetLine;
  const guidanceItems = guidanceConsistencyItems(guidance);
  const guidanceBlocked = guidanceItems.some((item) => item.status === "blocked");
  const guidanceWarn = guidanceItems.some((item) => item.status === "warn");
  const albumUnlocked = VILLAGE_ALBUM_ENTRIES.filter((entry) => entry.isUnlocked()).length;
  const order = normalizeDailyOrder(state.dailyOrder);
  const missingShrine = landShrineMissingCategories();
  const seasonalOrderOk = order.target <= (currentSeasonId() === "winter" ? 4 : 6);
  const shrineDetail = landShrineFinalReady()
    ? "最终追问已开放。"
    : missingShrine.length > 0
      ? `还缺 ${missingShrine.length} 类：${landShrineMissingText(missingShrine[0])}`
      : landShrineCurrentHint();
  return [
    {
      label: "1 通关节点",
      status: state.story.viewedYearEnd ? "ok" : "warn",
      detail: `${phase.title} · ${objective ? `下一步：${objective.label}` : "本阶段目标已完成"}`,
      suggestion: "用测试跳过可分段检查春夏秋冬和土地庙；正式游玩按主线卡逐步推进。",
    },
    {
      label: "2 目标入口",
      status: guidanceBlocked ? "blocked" : guidanceWarn ? "warn" : "ok",
      detail: targetLine || guidanceConsistencySummary(guidance),
      suggestion: target ? guidanceConsistencySummary(guidance) : "需要给当前目标补对象、路牌或小地图推荐点。",
    },
    {
      label: "3 NPC 剧情",
      status: state.npcs.length >= 5 && Object.keys(NPC_STAGE_DIALOGUES).length >= 5 ? "ok" : "warn",
      detail: `${seasonLabel(currentSeasonId())}阶段台词已启用；当前 NPC ${state.npcs.length} 个。`,
      suggestion: "面对林岚、何涛、柳青、楠楠、陈伯按 E，可看到季节、任务和路线台词。",
    },
    {
      label: "4 村庄变化",
      status: albumUnlocked >= 4 || state.story.viewedYearEnd ? "ok" : "warn",
      detail: `变化手册 ${albumUnlocked}/${VILLAGE_ALBUM_ENTRIES.length}；村情目标 ${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length}。`,
      suggestion: "去村庄广场的村情记录板推进目标，完成后地图、路牌和手册都会更新。",
    },
    {
      label: "5 季节数值",
      status: seasonalOrderOk ? "ok" : "blocked",
      detail: `${seasonLabel(currentSeasonId())}订单目标 ${order.target}，奖励 ${orderRewardText(order)}。冬季目标上限 4。`,
      suggestion: "优先种当季推荐作物；冬季保留小白菜和菠菜，避免后期空转。",
    },
    {
      label: "6 土地庙收束",
      status: landShrineFinalReady() ? "ok" : "warn",
      detail: shrineDetail,
      suggestion: "去山里的土地庙查看缺口；最终追问会在主线、村情和第二年路线满足后开放。",
    },
    {
      label: "7 存档安全",
      status: debug.testSkipActive ? "warn" : "ok",
      detail: debug.testSkipActive ? "测试跳过状态不会自动保存；只有手动保存会写入槽位。" : "自动保存正常；旧存档字段会通过 normalize 补齐。",
      suggestion: debug.testSkipActive ? "当前状态栏会保持测试提示，确认无误后再手动保存。" : "正式游玩可继续依赖自动保存，测试跳过不会覆盖正式槽位。",
    },
    {
      label: "8 v0.2.0 演示",
      status: release20ReadinessStatus(),
      detail: release20ReadinessSummary(),
      suggestion: "正式演示走 Q 任务、Tab 资料、M 小地图、B 建造、F2 资源审计；素材缺失仍应回到色块 fallback。",
    },
  ];
}

function updateFirstYearCheckHud() {
  const checks = firstYearCheckItems();
  const okCount = checks.filter((item) => item.status === "ok").length;
  ui.firstYearCheckProgress.textContent = `${okCount}/${checks.length}`;
  const blockedCount = checks.filter((item) => item.status === "blocked").length;
  const warnCount = checks.filter((item) => item.status === "warn").length;
  ui.firstYearCheckSummary.textContent =
    blockedCount > 0
      ? `有 ${blockedCount} 项阻塞，优先看红色检查项。`
      : warnCount > 0
        ? `有 ${warnCount} 项需要关注，但主线可继续推进。`
        : "第一年关键路径状态正常。";
  ui.firstYearCheckList.innerHTML = "";
  for (const check of checks) {
    const item = document.createElement("li");
    item.dataset.status = check.status;
    const copy = document.createElement("span");
    copy.className = "check-copy";
    const main = document.createElement("span");
    main.textContent = `${check.label} · ${check.detail}`;
    copy.append(main);
    if (check.suggestion) {
      const suggestion = document.createElement("small");
      suggestion.textContent = check.suggestion;
      copy.append(suggestion);
    }
    const status = document.createElement("strong");
    status.textContent = firstYearCheckStatusLabel(check.status);
    item.append(copy, status);
    ui.firstYearCheckList.append(item);
  }
}

function playthroughRequirementProgress(checkpointId) {
  const requirements = PLAYTHROUGH_REQUIREMENTS[checkpointId] ?? [];
  const items = requirements.map((requirement) => {
    let done = false;
    try {
      done = requirement.isMet();
    } catch {
      done = false;
    }
    return { ...requirement, done };
  });
  return {
    items,
    doneCount: items.filter((item) => item.done).length,
    total: items.length,
    firstUnmet: items.find((item) => !item.done) ?? null,
  };
}

function playthroughCheckpointStates() {
  let previousIncomplete = false;
  return PLAYTHROUGH_CHECKPOINTS.map((checkpoint) => {
    const progress = playthroughRequirementProgress(checkpoint.id);
    const complete = progress.total > 0 && progress.doneCount >= progress.total;
    const status = complete ? "ok" : previousIncomplete ? "blocked" : "warn";
    if (!complete) previousIncomplete = true;
    return { ...checkpoint, ...progress, complete, status };
  });
}

function currentPlaythroughCheckpoint(states = playthroughCheckpointStates()) {
  return states.find((checkpoint) => checkpoint.status !== "ok") ?? states[states.length - 1];
}

function playthroughRequirementLine(checkpoint) {
  if (checkpoint.complete) return "验收项已完成。";
  const unmet = checkpoint.firstUnmet?.label ?? "继续推进当前主线目标";
  const note = PLAYTHROUGH_REPAIR_NOTES[checkpoint.id] ?? "查看主线卡、小地图和路牌确认下一步。";
  return `待完成：${unmet}。${note}`;
}

function updatePlaythroughHud() {
  const states = playthroughCheckpointStates();
  const okCount = states.filter((checkpoint) => checkpoint.status === "ok").length;
  const current = currentPlaythroughCheckpoint(states);
  const objective = currentIncompleteStoryObjective();
  const guidance = currentGuidanceSnapshot(objective);
  const targetLine = guidance.targetLine;
  ui.playthroughCheckProgress.textContent = `${okCount}/${states.length}`;
  ui.playthroughCheckSummary.textContent =
    `${okCount}/${states.length} 个验收节点完成；当前验收：${current.title}。${targetLine || current.signHint}；${guidanceConsistencySummary(guidance)}；测试跳过不自动保存。`;
  ui.playthroughCheckpointList.innerHTML = "";

  for (const checkpoint of states) {
    const item = document.createElement("li");
    item.dataset.status = checkpoint.status;
    item.dataset.selected = checkpoint.skipValue === ui.testSkipSelect.value ? "true" : "false";

    const copy = document.createElement("span");
    copy.className = "check-copy";
    const main = document.createElement("span");
    main.textContent = `${checkpoint.title} · ${checkpoint.description}`;
    copy.append(main);

    for (const line of [
      `当前目标：${checkpoint.target}`,
      `入口位置：${checkpoint.entry}`,
      `需要：${checkpoint.needs}`,
      `完成奖励：${checkpoint.reward}`,
      `存档影响：${checkpoint.saveImpact}`,
      `公告文本：${checkpoint.notice}`,
      `下一步入口：${currentGuidanceActionLine(guidance)}`,
      `验收状态：${checkpoint.doneCount}/${checkpoint.total} · ${playthroughRequirementLine(checkpoint)}`,
    ]) {
      const detail = document.createElement("small");
      detail.textContent = line;
      copy.append(detail);
    }

    const status = document.createElement("strong");
    status.textContent = firstYearCheckStatusLabel(checkpoint.status);
    item.append(copy, status);
    ui.playthroughCheckpointList.append(item);
  }
}

function guideStep(label, done, progress, hint) {
  return {
    label,
    done,
    progress,
    hint,
  };
}

function firstDayGuideSteps() {
  const pendingShipmentCount = totalCropCount(state.inventory.shippedCrops) + totalGoodCount(state.inventory.shippedGoods);
  const villageShopRepaired = hasMapObject("shop", (_object, map) => map.id === "village");
  return [
    guideStep(
      "整理 3 格土地",
      state.story.firstFieldHoed >= 3,
      `${Math.min(state.story.firstFieldHoed, 3)}/3`,
      "按 2 切换锄头，站在右上角清场的草地上按 Space，把荒地整理成泥土。",
    ),
    guideStep(
      "播种 3 株作物",
      state.story.firstFieldPlanted >= 3,
      `${Math.min(state.story.firstFieldPlanted, 3)}/3`,
      "按 3 切换种子，站在泥土地上按 Space。当前种子可在工具卡里选择。",
    ),
    guideStep(
      "给作物浇水",
      state.story.firstFieldWatered >= 3,
      `${Math.min(state.story.firstFieldWatered, 3)}/3`,
      "按 4 切换水壶，站在作物上或面对作物按 Space；没水就去池塘或水井补水。",
    ),
    guideStep(
      "第一次到村庄",
      state.story.firstVillageVisitSeen,
      state.story.firstVillageVisitSeen ? "已到达" : "未到达",
      "从农场东边小路进入村庄。第一次进村会用日志提示种子铺、杂货铺废墟、村情记录板、春集/样本箱和池塘位置。",
    ),
    guideStep(
      "去村庄种子铺补货",
      state.story.firstSeedShopVisited,
      state.story.firstSeedShopVisited ? "已查看" : "未查看",
      "从农场东边小路进入村庄，面对村庄种子铺按 E。缺种提示、任务面板和路牌都会指向这里。",
    ),
    guideStep(
      "睡到第二天",
      state.story.sleptAfterWatering,
      state.story.sleptAfterWatering ? "完成" : "未完成",
      "回到老宅床边按 E，或打开系统菜单选择“睡觉到明天”，浇过水的作物会成长。",
    ),
    guideStep(
      "收获 3 个作物",
      state.inventory.harvestedCrops >= 3,
      `${Math.min(state.inventory.harvestedCrops, 3)}/3`,
      "作物成熟后按 5 切换镰刀，站在成熟作物上或面对成熟作物按 Space。",
    ),
    guideStep(
      "把作物投入出货箱",
      pendingShipmentCount > 0 || state.story.firstShipmentSettled,
      state.story.firstShipmentSettled ? "已结算" : `${pendingShipmentCount}/1`,
      "面对农场出货箱按 E，选择作物投入。投入后还需要睡觉才会真正结算。",
    ),
    guideStep(
      "完成第一次出货结算",
      state.story.firstShipmentSettled,
      state.story.firstShipmentSettled ? "完成" : "未完成",
      "投入出货箱后睡觉到明天。金币到账后，村庄广场会出现反馈。",
    ),
    guideStep(
      "去村庄看反馈",
      state.story.villageFeedbackSeen,
      state.story.villageFeedbackSeen ? "完成" : "未完成",
      "从农场东边小路进入村庄，查看广场公告；第一次查看会得到菜篮奖励。",
    ),
    guideStep(
      "修复村庄杂货铺",
      villageShopRepaired,
      villageShopRepaired ? "完成" : "未完成",
      "看完反馈后，面对停业杂货铺按 E 修复。修复后村庄进入下一步恢复。",
    ),
  ];
}

function marketGuideSteps() {
  const miraQuest = state.quests.harvestForMira;
  const linaQuest = state.quests.shipCropsForLina;
  const constructionReady = hasMapObject("upgradeBoard");
  return [
    guideStep(
      "和林岚接作物样本任务",
      miraQuest?.status !== "notStarted",
      miraQuest?.status === "completed" ? "已完成" : miraQuest?.status !== "notStarted" ? "已接受" : "未开始",
      "去村庄主路附近找林岚，面对她按 E，接下作物样本任务。",
    ),
    guideStep(
      "完成 1 个村民任务",
      completedQuestCount() >= 1,
      `${Math.min(completedQuestCount(), 1)}/1`,
      "先完成林岚的样本任务：累计收获 3 个作物后再和她对话交付。",
    ),
    guideStep(
      "准备 5 包种子",
      totalCropCount(state.inventory.seeds) >= 5,
      `${Math.min(totalCropCount(state.inventory.seeds), 5)}/5`,
      "去村庄种子铺补货，或者保留村民奖励的种子，为集市供货做准备。",
    ),
    guideStep(
      "累计收获 8 个作物",
      state.inventory.harvestedCrops >= 8,
      `${Math.min(state.inventory.harvestedCrops, 8)}/8`,
      "扩大菜地，继续播种、浇水、睡觉和收获，让供应量稳定下来。",
    ),
    guideStep(
      "和柳青接出货记录任务",
      linaQuest?.status !== "notStarted",
      linaQuest?.status === "completed" ? "已完成" : linaQuest?.status !== "notStarted" ? "已接受" : "未开始",
      "去找柳青，接下出货记录任务。木匠公告牌需要更稳定的出货记录才会恢复。",
    ),
    guideStep(
      "完成柳青出货记录",
      linaQuest?.status === "completed",
      linaQuest?.status === "completed" ? "完成" : `${getQuestProgress(linaQuest)}/4`,
      "把 4 个任意作物投入出货箱，任务达标后回去找柳青交付。",
    ),
    guideStep(
      "修复木匠公告牌",
      constructionReady,
      constructionReady ? "完成" : "未完成",
      "柳青的出货任务完成后，面对旧公告牌按 E 修复，建造和扩建线会正式打开。",
    ),
    guideStep(
      "村口出现助农集市",
      state.story.marketPrepCompleted,
      state.story.marketPrepCompleted ? "完成" : "未完成",
      "木匠公告牌修复后，村庄主街会摆出临时摊位、菜篮点和试吃桌。",
    ),
  ];
}

function communityOrderGuideSteps() {
  const basketOrder = COMMUNITY_ORDERS.basketPoint;
  const tastingOrder = COMMUNITY_ORDERS.tastingTable;
  return [
    guideStep(
      "完成安心菜篮订单",
      communityOrderComplete(basketOrder),
      `${communityOrderProgress(basketOrder)}/${basketOrder.target}`,
      "去村庄广场的安心菜篮点，面对菜篮按 E，提交任意作物。",
    ),
    guideStep(
      "完成茶铺试吃订单",
      communityOrderComplete(tastingOrder),
      `${communityOrderProgress(tastingOrder)}/${tastingOrder.target}`,
      "去茶铺试吃桌，面对桌子按 E，提交任意作物。",
    ),
    guideStep(
      "完成 2 个社区订单",
      completedCommunityOrderCount() >= 2,
      `${completedCommunityOrderCount()}/2`,
      "两个社区订单都完成后，集市从临时摊位进入稳定运行。",
    ),
    guideStep(
      "保留或购买 5 包种子",
      totalCropCount(state.inventory.seeds) >= 5,
      `${Math.min(totalCropCount(state.inventory.seeds), 5)}/5`,
      "社区订单会消耗库存，继续准备种子，保证下一轮供应。",
    ),
  ];
}

function ecommerceGuideSteps() {
  const processingReady = state.story.processingRepaired || fixedProcessingFacilityReady();
  const goodsCount = ownedOrShippedGoodsCount();
  return [
    guideStep(
      "查看电商助农角",
      state.story.ecommerceDeskSeen,
      state.story.ecommerceDeskSeen ? "完成" : "未完成",
      "去村庄主街新出现的电商助农角，面对桌子按 E，了解下一章方向。",
    ),
    guideStep(
      "提交 4 个试单作物",
      ecommerceTrialSubmittedCount() >= ECOMMERCE_TRIAL_ORDER.target,
      `${ecommerceTrialSubmittedCount()}/${ECOMMERCE_TRIAL_ORDER.target}`,
      "在电商助农角提交任意作物，凑齐第一笔外地试单。",
    ),
    guideStep(
      "完成分拣包装",
      state.story.ecommerceTrialPacked,
      state.story.ecommerceTrialPacked ? "完成" : "未完成",
      "试单作物凑齐后，在电商助农角点击分拣包装。",
    ),
    guideStep(
      "发货结算外地试单",
      state.story.ecommerceTrialShipped,
      state.story.ecommerceTrialShipped ? "完成" : "未完成",
      "包装完成后，在电商助农角点击发货结算，拿到第一笔外地订单反馈。",
    ),
    guideStep(
      "修复加工设施",
      state.story.processingRepaired || processingReady,
      state.story.processingRepaired || processingReady ? "完成" : "未完成",
      "外地试单结算后，回农场面对废弃加工桶按 E 修复。",
    ),
    guideStep(
      "启动第一批加工",
      state.story.firstMachineStarted,
      state.story.firstMachineStarted ? "完成" : "未完成",
      "修复加工桶后，提交 2 个萝卜、小麦或豆子开始加工；厨房加工台也会同步开放。",
    ),
    guideStep(
      "领取第一个加工品",
      state.story.firstProcessedGoodCollected || goodsCount > 0,
      state.story.firstProcessedGoodCollected || goodsCount > 0 ? "完成" : "未完成",
      "加工桶需要睡一晚，第二天面对加工桶按 E 领取成品。",
    ),
    guideStep(
      "出货加工品结算",
      state.story.firstProcessedShipmentSettled,
      state.story.firstProcessedShipmentSettled ? "完成" : "未完成",
      "把加工品投入出货箱并睡觉结算，完成后会得到晾晒架奖励。",
    ),
    guideStep(
      "修复合作社窗口",
      state.story.cooperativeRepaired,
      state.story.cooperativeRepaired ? "完成" : "未完成",
      "第一批加工品出货后，去村庄广场面对合作社旧窗口按 E 修复。",
    ),
    guideStep(
      "提交合作社样品",
      state.story.cooperativeJoined,
      state.story.cooperativeJoined
        ? "完成"
        : `${cooperativeCropSubmittedCount()}/${COOPERATIVE_TRIAL.cropTarget} 作物 · ${cooperativeGoodSubmittedCount()}/${COOPERATIVE_TRIAL.goodTarget} 加工品`,
      "合作社窗口需要任意作物和任意加工品，完成后进入第一年试运行名册。",
    ),
    guideStep(
      "完成当前节气合同",
      state.story.cooperativeJoined && cooperativeContractClaimed(),
      state.story.cooperativeJoined
        ? `${cooperativeContractSubmitted()}/${cooperativeContractForDay().target}`
        : "未入社",
      "入社后，合作社窗口会按当前节气生成批量合同；提交指定类型的作物或加工品。",
    ),
    guideStep(
      "参加第一年年终会",
      state.story.viewedYearEnd,
      state.story.viewedYearEnd ? "完成" : `${Math.min(seasonInfoForDay().dayOfYear, YEAR_LENGTH)}/${YEAR_LENGTH}`,
      "推进到第一年大寒第五天，睡觉后会弹出年度评价和一周目总结。",
    ),
  ];
}

function secondYearGuideSteps() {
  const plan = secondYearPlanDef();
  const steps = [
    guideStep(
      "选择第二年方向",
      Boolean(plan),
      plan ? plan.name : "未选择",
      "打开邮箱，选择第二年发展方向；年终会弹窗未关闭时也可以直接选择。",
    ),
    guideStep(
      "领取方向启动补助",
      state.story.secondYearPlanRewardClaimed,
      state.story.secondYearPlanRewardClaimed ? "完成" : "未领取",
      "选择方向后会立即发放对应金币、种子和建造库存补助。",
    ),
    guideStep(
      "完成第二年第一张合同",
      state.story.cooperativeJoined && cooperativeContractClaimed(),
      state.story.cooperativeJoined
        ? `${cooperativeContractSubmitted()}/${cooperativeContractForDay().target}`
        : "未入社",
      "无论选择哪条路线，合作社合同仍是第二年的稳定现金流。",
    ),
    guideStep(
      "农场评价达到 60",
      farmScoreTotal() >= 60,
      `${Math.min(farmScoreTotal(), 60)}/60`,
      plan?.hint ?? "先选择路线，再按路线扩展农场。",
    ),
  ];
  if (plan?.id === "cooperative") {
    steps.splice(
      2,
      0,
      guideStep(
        "确认合作社入社",
        state.story.cooperativeJoined,
        state.story.cooperativeJoined ? "完成" : `${cooperativeCropSubmittedCount()}/${COOPERATIVE_TRIAL.cropTarget} 作物 · ${cooperativeGoodSubmittedCount()}/${COOPERATIVE_TRIAL.goodTarget} 加工品`,
        "先在合作社窗口提交样品，加入试运行名册后才能稳定接合同。",
      ),
      guideStep(
        "完成 3 张扩张合同",
        cooperativeExpansionProgress() >= COOPERATIVE_EXPANSION.dividendEveryContracts,
        `${cooperativeExpansionProgress()}/${COOPERATIVE_EXPANSION.dividendEveryContracts}`,
        "选择合作社路线后，继续在合作社窗口完成节气合同。",
      ),
      guideStep(
        "拿到第一次社员分红",
        state.story.cooperativeExpansionDividendClaimedTiers.length > 0,
        `${state.story.cooperativeExpansionDividendClaimedTiers.length} 次`,
        `每 ${COOPERATIVE_EXPANSION.dividendEveryContracts} 张路线合同自动发放分红：${cooperativeExpansionDividendText()}。`,
      ),
    );
  }
  if (plan?.id === "tourism") {
    steps.splice(
      2,
      0,
      guideStep(
        "修复游客服务亭",
        state.story.tourismRepaired,
        state.story.tourismRepaired ? "完成" : "未修复",
        "去村庄广场右侧，面对游客服务旧亭按 E 修复。",
      ),
      guideStep(
        "完成第一批游客订单",
        state.story.tourismFirstOrderCompleted,
        state.story.tourismFirstOrderCompleted
          ? "完成"
          : `${tourismCropSubmittedCount()}/${TOURISM_ORDER.cropTarget} 作物 · ${tourismGoodSubmittedCount()}/${TOURISM_ORDER.goodTarget} 加工品`,
        `游客服务亭需要农场评价 ${TOURISM_ORDER.scoreTarget}，再提交礼篮和试吃。`,
      ),
    );
  }
  if (plan?.id === "brand") {
    steps.splice(
      2,
      0,
      guideStep(
        "修复品牌包装台",
        state.story.brandRepaired,
        state.story.brandRepaired ? "完成" : "未修复",
        "去村庄集市左侧，面对品牌包装旧台按 E 修复。",
      ),
      guideStep(
        "制作第一份品牌礼盒",
        state.story.brandFirstPackCreated,
        state.story.brandFirstPackCreated ? "完成" : `${totalCropCount(state.inventory.crops)} 作物 · ${totalBrandInputGoodCount()} 普通加工品`,
        `品牌礼盒需要 ${BRAND_PACKAGING.cropInputCount} 个作物和 ${BRAND_PACKAGING.goodInputCount} 个普通加工品。`,
      ),
      guideStep(
        "结算品牌礼盒出货",
        state.story.brandFirstShipmentSettled,
        state.story.brandFirstShipmentSettled ? "完成" : `${state.inventory.shippedGoods[BRAND_PACK_GOOD_ID] ?? 0} 待出货`,
        "把品牌礼盒投入出货箱并睡觉，完成品牌路线第一笔高价值结算。",
      ),
    );
  }
  if (plan?.id === "irrigation") {
    steps.splice(
      2,
      0,
      guideStep(
        "修复水利水泵",
        state.story.irrigationRepaired,
        state.story.irrigationRepaired ? "完成" : "未修复",
        "回到农场水渠旧泵，面对旧水泵按 E 修复。",
      ),
      guideStep(
        "启动第一段水渠工程",
        state.story.irrigationFirstProjectCompleted,
        state.story.irrigationFirstProjectCompleted ? "完成" : `${state.inventory.gold}/${IRRIGATION_PROJECT.costGold}g`,
        "修复水泵后投入金币，换取水壶容量提升和覆盖区自动浇水。",
      ),
      guideStep(
        "利用自动灌溉区",
        state.story.irrigationFirstProjectCompleted && state.dynamicObjects.some((obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj)),
        `${state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj)).length} 株`,
        "把作物种在农田核心区域，睡觉后水渠会自动浇水。",
      ),
    );
  }
  return steps;
}

function currentGuideSteps() {
  if (state.story.viewedYearEnd) return secondYearGuideSteps();
  if (state.story.communityOrdersCompleted) return ecommerceGuideSteps();
  if (state.story.marketPrepCompleted) return communityOrderGuideSteps();
  return state.story.chapterOneCompleted ? marketGuideSteps() : firstDayGuideSteps();
}

function updateGuideHud() {
  const steps = currentGuideSteps();
  const completedCount = steps.filter((step) => step.done).length;
  const currentStep = steps.find((step) => !step.done);

  ui.guideProgress.textContent = `${completedCount}/${steps.length}`;
  ui.guideCurrentStep.textContent = currentStep
    ? currentStep.label
    : state.story.viewedYearEnd
      ? "第二年方向已启动"
      : state.story.communityOrdersCompleted
        ? "加工试运行完成"
        : state.story.marketPrepCompleted
          ? "社区订单已完成"
          : state.story.chapterOneCompleted
            ? "助农集市准备完成"
            : "第一章闭环已完成";
  ui.guideHint.textContent = currentStep ? currentStep.hint : "可以继续推进季节目标、修复废墟、扩展建造和加工内容。";
  ui.guideStepList.innerHTML = "";

  for (const step of steps) {
    const item = document.createElement("li");
    item.dataset.done = step.done ? "true" : "false";
    const label = document.createElement("span");
    label.textContent = step.label;
    const progress = document.createElement("strong");
    progress.textContent = step.progress;
    item.append(label, progress);
    ui.guideStepList.append(item);
  }
}

function advanceQuests(type, count) {
  let completedAny = false;
  for (const quest of Object.values(state.quests)) {
    if (quest.type !== type || quest.status !== "active") continue;
    if (type !== "harvest" && type !== "delivery") {
      quest.progress = Math.min(quest.target, (quest.progress ?? 0) + count);
    }
    if (getQuestProgress(quest) >= quest.target) {
      quest.status = "readyToTurnIn";
      completedAny = true;
    }
  }
  if (completedAny) addLog("有任务目标已达成，可以找对应 NPC 交付。");
}

function normalizeDailyOrder(order) {
  const fallback = createDailyOrder(state.day);
  const normalized = { ...fallback, ...(order ?? {}) };
  normalized.day = state.day;
  normalized.shipped = Math.min(normalized.shipped ?? 0, normalized.target);
  normalized.recommendedCropId = cropDef(normalized.recommendedCropId ?? fallback.recommendedCropId).id;
  normalized.rewardSeedCropId = cropDef(normalized.rewardSeedCropId ?? fallback.rewardSeedCropId).id;
  normalized.completed = normalized.shipped >= normalized.target;
  return normalized;
}

function orderRewardText(order) {
  const parts = [];
  if (order.rewardGold > 0) parts.push(`+${order.rewardGold}g`);
  if (order.rewardSeeds > 0) parts.push(`+${order.rewardSeeds} ${cropDef(order.rewardSeedCropId).seedName}`);
  return parts.join(" / ") || "无";
}

function updateOrderHud() {
  state.dailyOrder = normalizeDailyOrder(state.dailyOrder);
  const order = state.dailyOrder;
  ui.orderTitle.textContent = order.title;
  ui.orderStatus.textContent = order.completed ? "已达标" : "进行中";
  ui.orderProgress.textContent = `${order.shipped}/${order.target}`;
  ui.orderReward.textContent = orderRewardText(order);
}

function syncOrderProgressFromShipments(logCompletion = false) {
  state.dailyOrder = normalizeDailyOrder(state.dailyOrder);
  const wasCompleted = state.dailyOrder.completed;
  state.dailyOrder.shipped = Math.min(state.dailyOrder.target, totalCropCount(state.inventory.shippedCrops));
  state.dailyOrder.completed = state.dailyOrder.shipped >= state.dailyOrder.target;
  if (logCompletion && !wasCompleted && state.dailyOrder.completed) addLog("今日订单已达标，睡觉时发放奖励。");
  updateOrderHud();
}

function settleDailyOrder() {
  syncOrderProgressFromShipments();
  const order = state.dailyOrder;
  if (!order.completed) return "今日订单未完成。";
  state.inventory.gold += order.rewardGold;
  addSeedCount(order.rewardSeedCropId, order.rewardSeeds);
  return `今日订单完成，奖励 ${orderRewardText(order)}。`;
}

function tileAtPixel(px, py) {
  return {
    x: Math.floor(px / TILE_SIZE),
    y: Math.floor(py / TILE_SIZE),
  };
}

function screenToWorld(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const cssX = clientX - rect.left;
  const cssY = clientY - rect.top;
  return {
    x: state.camera.x + cssX / VIEW_SCALE,
    y: state.camera.y + cssY / VIEW_SCALE,
  };
}

function worldToTile(worldX, worldY) {
  return {
    x: Math.floor(worldX / TILE_SIZE),
    y: Math.floor(worldY / TILE_SIZE),
  };
}

function tileFromPointer(event) {
  const world = screenToWorld(event.clientX, event.clientY);
  const tile = worldToTile(world.x, world.y);
  const map = currentMap();
  if (tile.x < 0 || tile.y < 0 || tile.x >= map.width || tile.y >= map.height) return null;
  return tile;
}

function updateEditorReadout() {
  if (!editor.enabled) return;
  if (editor.hoverTile) {
    ui.tileReadout.textContent = `${editor.hoverTile.x}, ${editor.hoverTile.y}`;
  }
  ui.facingReadout.textContent = `${editor.layer}:${editor.tool}`;
  updateObjectReadout();
}

function selectedObject() {
  if (!editor.selectedObjectTile) return null;
  return objectAtTile(editor.selectedObjectTile.x, editor.selectedObjectTile.y);
}

function updateObjectReadout() {
  if (!ui.objectReadout) return;
  const tile = editor.hoverTile;
  const coord = tile ? `${tile.x}, ${tile.y}` : "-";
  const existing = tile ? objectAtTile(tile.x, tile.y) : null;
  const selected = selectedObject();
  const selectedCoord = editor.selectedObjectTile ? `${editor.selectedObjectTile.x}, ${editor.selectedObjectTile.y}` : "-";
  ui.objectReadout.textContent = `对象：${editor.objectType} @ ${coord}${existing ? ` · 当前 ${existing.type}` : ""} · 选中 ${
    selected ? `${selected.type} @ ${selectedCoord}` : "-"
  }`;
}

function setSelectedObjectTile(tile) {
  editor.selectedObjectTile = tile ? { x: tile.x, y: tile.y } : null;
  syncObjectFields();
  updateObjectReadout();
}

function syncObjectFields() {
  const obj = selectedObject();
  ui.applyObjectBtn.disabled = !obj;
  ui.objectTextInput.disabled = !obj;
  ui.objectItemsInput.disabled = !obj;
  ui.warpTargetMapSelect.disabled = !obj || obj.type !== "warp";
  ui.warpTargetInput.disabled = !obj || obj.type !== "warp";

  if (!obj) {
    ui.objectTextInput.value = "";
    ui.objectItemsInput.value = "";
    ui.warpTargetMapSelect.value = "farm";
    ui.warpTargetInput.value = "";
    return;
  }

  ui.objectTextInput.value = obj.text ?? obj.name ?? "";
  ui.objectItemsInput.value = Array.isArray(obj.items) ? obj.items.join(", ") : Array.isArray(obj.lines) ? obj.lines.join(", ") : "";
  if (obj.type === "warp") {
    ui.warpTargetMapSelect.value = obj.toMap;
    ui.warpTargetInput.value = `${obj.to.x}, ${obj.to.y}`;
  } else {
    ui.warpTargetMapSelect.value = "farm";
    ui.warpTargetInput.value = "";
  }
}

function isSolidTile(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return true;
  if (ART_ASSET_LOADING_ENABLED && map.layers.collision[y][x] === 1 && isLegacyTreeRootTile(map, x, y)) return false;
  if (map.layers.collision[y][x] === 1) return true;
  return state.dynamicObjects.some((obj) => dynamicObjectBelongsToMap(obj) && obj.type !== "crop" && obj.x === x && obj.y === y && obj.blocksMovement);
}

function canOccupy(map, nextX, nextY) {
  const left = nextX - state.player.w / 2;
  const right = nextX + state.player.w / 2 - 1;
  const top = nextY - state.player.h / 2;
  const bottom = nextY + state.player.h / 2 - 1;
  const corners = [
    tileAtPixel(left, top),
    tileAtPixel(right, top),
    tileAtPixel(left, bottom),
    tileAtPixel(right, bottom),
  ];
  return corners.every((corner) => !isSolidTile(map, corner.x, corner.y));
}

function findSafePlayerPosition(map, preferredTile = map.spawn) {
  const origin = {
    x: Math.max(0, Math.min(map.width - 1, preferredTile.x)),
    y: Math.max(0, Math.min(map.height - 1, preferredTile.y)),
  };
  const maxRadius = Math.max(map.width, map.height);
  for (let radius = 0; radius <= maxRadius; radius += 1) {
    for (let y = origin.y - radius; y <= origin.y + radius; y += 1) {
      for (let x = origin.x - radius; x <= origin.x + radius; x += 1) {
        if (Math.max(Math.abs(x - origin.x), Math.abs(y - origin.y)) !== radius) continue;
        if (x < 0 || y < 0 || x >= map.width || y >= map.height) continue;
        const center = tileCenter(x, y);
        if (canOccupy(map, center.x, center.y)) return { tile: { x, y }, position: center };
      }
    }
  }
  return null;
}

function relocatePlayerToSafeTile(reason = "脱困", { force = false, autosave = true } = {}) {
  const map = currentMap();
  if (!force && canOccupy(map, state.player.x, state.player.y)) return false;
  let safe = findSafePlayerPosition(map, map.spawn);
  if (!safe) {
    const spawn = { ...map.spawn };
    if (map.layers.collision[spawn.y]?.[spawn.x] !== undefined) map.layers.collision[spawn.y][spawn.x] = 0;
    safe = { tile: spawn, position: tileCenter(spawn.x, spawn.y) };
  }
  state.player.x = safe.position.x;
  state.player.y = safe.position.y;
  interaction.warpCooldown = 0.45;
  keys.clear();
  updateAllHud();
  addLog(`${reason}：已移动到 ${map.name} ${safe.tile.x}, ${safe.tile.y}。`);
  if (autosave) scheduleAutosave(reason);
  return true;
}

function ensurePlayerCanMove(reason = "位置修正") {
  return relocatePlayerToSafeTile(reason, { force: false });
}

function unstuckPlayer() {
  if (editor.enabled) {
    editor.enabled = false;
    editor.isPainting = false;
    syncEditorControls();
  }
  closeDialog();
  relocatePlayerToSafeTile("手动脱困", { force: true });
}

function isRunKeyDown() {
  return keys.has("shift");
}

function playerMoveSpeed() {
  return state.player.speed * (isRunKeyDown() ? RUN_SPEED_MULTIPLIER : 1);
}

function setPlayerMotion(action, duration = 420) {
  const now = performance.now();
  motion.playerAction = action;
  motion.playerActionStartedAt = now;
  motion.playerActionUntil = now + duration;
}

function setNpcTalkMotion(npc, duration = 1600) {
  motion.lastNpcTalkId = npc?.id ?? null;
  motion.lastNpcTalkUntil = performance.now() + duration;
}

function updateMotion(dt) {
  motion.playerStepClock += dt * (motion.playerRunning ? 1.45 : 1);
  if (performance.now() > motion.playerActionUntil && !fishing.active) motion.playerAction = motion.playerMoving ? "walk" : "idle";
  if (performance.now() > motion.lastNpcTalkUntil) motion.lastNpcTalkId = null;
}

function currentPlayerMotionAction() {
  if (fishing.active) return fishing.phase === "waiting" ? "fishingRod" : "fishingCatch";
  if (performance.now() <= motion.playerActionUntil) return motion.playerAction;
  if (motion.playerMoving) return motion.playerRunning ? "run" : "walk";
  return "idle";
}

function movePlayer(dt) {
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (dx === 0 && dy === 0) {
    motion.playerMoving = false;
    motion.playerRunning = false;
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) state.player.facing = dx > 0 ? "right" : "left";
  else state.player.facing = dy > 0 ? "down" : "up";

  const len = Math.hypot(dx, dy);
  const speed = playerMoveSpeed();
  motion.playerMoving = true;
  motion.playerRunning = isRunKeyDown();
  dx = (dx / len) * speed * dt;
  dy = (dy / len) * speed * dt;

  const map = currentMap();
  if (canOccupy(map, state.player.x + dx, state.player.y)) state.player.x += dx;
  if (canOccupy(map, state.player.x, state.player.y + dy)) state.player.y += dy;
}

function facingTile() {
  const base = tileAtPixel(state.player.x, state.player.y + 8);
  const offset = {
    down: [0, 1],
    up: [0, -1],
    left: [-1, 0],
    right: [1, 0],
  }[state.player.facing];
  return { x: base.x + offset[0], y: base.y + offset[1] };
}

function playerTile() {
  return tileAtPixel(state.player.x, state.player.y + 8);
}

function playerCollisionTiles() {
  const { x, y, w, h } = state.player;
  const points = [
    tileAtPixel(x - w / 2, y - h / 2),
    tileAtPixel(x + w / 2 - 1, y - h / 2),
    tileAtPixel(x - w / 2, y + h / 2 - 1),
    tileAtPixel(x + w / 2 - 1, y + h / 2 - 1),
    playerTile(),
  ];
  const seen = new Set();
  return points.filter((tile) => {
    const key = `${tile.x},${tile.y}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function playerOverlapsTile(tileX, tileY) {
  return playerCollisionTiles().some((tile) => tile.x === tileX && tile.y === tileY);
}

function isCollisionBlocked(map, tileX, tileY) {
  return map.layers.collision[tileY]?.[tileX] === 1;
}

function protectedCollisionReason(mapId, map, tileX, tileY, { includePlayer = true } = {}) {
  if (includePlayer && mapId === state.mapId && playerOverlapsTile(tileX, tileY)) return "玩家当前位置";
  if (map.spawn.x === tileX && map.spawn.y === tileY) return "出生点";
  if (map.objects.some((obj) => obj.type === "warp" && obj.x === tileX && obj.y === tileY)) return "传送入口";

  for (const [sourceMapId, sourceMap] of Object.entries(maps)) {
    for (const obj of sourceMap.objects) {
      if (obj.type !== "warp" || obj.toMap !== mapId) continue;
      if (obj.to?.x === tileX && obj.to?.y === tileY) return `${sourceMap.name} 的传送落点`;
    }
  }
  return "";
}

function warnUnsafeCollisionEdit(tileX, tileY, reason) {
  const key = `${state.mapId}:${tileX},${tileY}:${reason}`;
  if (editor.lastSafetyWarning === key) return;
  editor.lastSafetyWarning = key;
  addLog(`安全编辑：不能把 ${reason} ${tileX}, ${tileY} 设为阻挡。`);
}

function canPaintBlockingCollision(tileX, tileY) {
  const map = currentMap();
  const reason = protectedCollisionReason(state.mapId, map, tileX, tileY);
  if (!reason) return true;
  warnUnsafeCollisionEdit(tileX, tileY, reason);
  return false;
}

function objectAtTile(tileX, tileY) {
  return currentMap().objects.find((obj) => objectBelongsToMap(obj) && obj.x === tileX && obj.y === tileY);
}

function featureIdForObject(object) {
  if (!object) return null;
  if (object.featureId) return object.featureId;
  if (object.type === "shop" && state.mapId === "village") return "villageMarket";
  if (object.type === "upgradeBoard") return "construction";
  if (object.type === "kitchen" || object.type === "processor" || object.type === "dryer") return "processing";
  if (object.type === "cooperativeDesk") return "cooperative";
  if (object.type === "tourismDesk") return "tourism";
  if (object.type === "brandDesk") return "brand";
  if (object.type === "irrigationPump") return "irrigation";
  return null;
}

function objectFeatureUnlocked(object) {
  const featureId = featureIdForObject(object);
  if (featureId === "processing" && object?.type !== "ruin") return state.story.processingRepaired;
  return featureUnlocked(featureId);
}

function showLockedObjectDialog(object) {
  const featureId = featureIdForObject(object);
  const title = object.name ?? FEATURE_DEFS[featureId]?.label ?? "暂未开放";
  const requirement =
    featureId === "processing" && state.story.ecommerceTrialShipped && !state.story.processingRepaired
      ? "先回农场修复废弃加工桶，厨房和加工设施才会正式启用。"
      : featureRequirementText(featureId);
  const message = object.hint ? `${object.hint}\n${requirement}` : requirement;
  showDialog(title, message);
  addLog(`${title}暂未开放：${requirement}`);
  playSound("error");
}

function npcAtTile(tileX, tileY) {
  if (!currentMapRules().showsNpcs) return undefined;
  return state.npcs.find((npc) => npcBelongsToMap(npc) && npc.x === tileX && npc.y === tileY);
}

function cropMapId(crop) {
  return crop.type === "crop" ? CROP_MAP_ID : undefined;
}

function isCropOnMap(crop, mapId = state.mapId) {
  return crop.type === "crop" && mapRulesFor(mapId).showsCrops && cropMapId(crop) === mapId;
}

function cropAtTile(tileX, tileY) {
  return state.dynamicObjects.find((obj) => isCropOnMap(obj) && obj.x === tileX && obj.y === tileY);
}

function machineIdForObject(object) {
  return object.machineId ?? `${state.mapId}:${object.x},${object.y}`;
}

function machineStateForObject(object) {
  const machineId = machineIdForObject(object);
  if (!state.machines[machineId]) state.machines[machineId] = createMachineState(machineId);
  return state.machines[machineId];
}

function machineStatusText(machine) {
  if (machine.readyGoodId) return `${processedGoodDef(machine.readyGoodId).name}已完成`;
  if (machine.recipeId) return `${processedGoodDef(machine.recipeId).name}加工中，还需 ${machine.remainingDays} 天`;
  return "空闲";
}

function isTileInMap(tile, map = currentMap()) {
  return tile && tile.x >= 0 && tile.y >= 0 && tile.x < map.width && tile.y < map.height;
}

function addToolFeedback(tile, text, type = "info") {
  if (!tile || !isTileInMap(tile)) return;
  toolFeedbacks.push({
    x: tile.x,
    y: tile.y,
    text,
    type,
    createdAt: performance.now(),
    duration: 1200,
  });
  while (toolFeedbacks.length > 16) toolFeedbacks.shift();
  if (type === "bad") {
    addVisualEffect(tile, "error");
    playSound("error");
  }
}

function normalizeCropObject(obj) {
  const cropId = cropDef(obj.cropId).id;
  const def = cropDef(cropId);
  const stage = Math.max(0, Number(obj.stage ?? 0));
  return {
    ...obj,
    type: "crop",
    mapId: CROP_MAP_ID,
    cropId,
    stage,
    watered: obj.watered ?? false,
    ready: obj.ready ?? stage >= def.growStages,
    blocksMovement: false,
  };
}

function createShopButton(label, disabled, onClick, disabledReason = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.disabled = disabled;
  if (disabled && disabledReason) button.title = disabledReason;
  if (!disabled) button.addEventListener("click", onClick);
  return button;
}

function availableMailLetters() {
  return MAILBOX_LETTERS.filter((letter) => letter.day <= state.day);
}

function unreadMailCount() {
  return availableMailLetters().filter((letter) => !state.mailbox.readIds.includes(letter.id)).length;
}

function mailRewardText(letter) {
  const parts = [];
  if ((letter.rewardGold ?? 0) > 0) parts.push(`+${letter.rewardGold}g`);
  if (letter.rewardSeeds) {
    for (const cropId of CROP_IDS) {
      const count = letter.rewardSeeds[cropId] ?? 0;
      if (count > 0) parts.push(`+${count} ${cropDef(cropId).seedName}`);
    }
  }
  return parts.join(" / ") || "无";
}

function grantMailReward(letter) {
  if (state.mailbox.claimedIds.includes(letter.id)) return false;
  if ((letter.rewardGold ?? 0) > 0) state.inventory.gold += letter.rewardGold;
  if (letter.rewardSeeds) {
    for (const [cropId, count] of Object.entries(letter.rewardSeeds)) {
      if (count > 0) addSeedCount(cropId, count);
    }
  }
  state.mailbox.claimedIds.push(letter.id);
  updateAllHud();
  return true;
}

function readMailboxLetter(letterId) {
  const letter = MAILBOX_LETTERS.find((item) => item.id === letterId);
  if (!letter || letter.day > state.day) {
    showMailboxDialog("这封信现在还不能阅读。");
    return;
  }

  if (!state.mailbox.readIds.includes(letter.id)) state.mailbox.readIds.push(letter.id);
  const rewardText = mailRewardText(letter);
  const granted = rewardText !== "无" ? grantMailReward(letter) : false;

  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>寄件人 <strong>${letter.from}</strong></span>
    <span>日期 <strong>第 ${letter.day} 天</strong></span>
    <span>奖励 <strong>${rewardText}</strong></span>
  `;
  panel.append(stats);

  const body = document.createElement("p");
  body.textContent = letter.body;
  panel.append(body);

  const feedback = document.createElement("div");
  feedback.className = "shop-message";
  feedback.textContent = rewardText === "无" ? "这封信没有附件。" : granted ? `已领取奖励：${rewardText}。` : "奖励已领取。";
  panel.append(feedback);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(createShopButton("返回邮箱", false, () => showMailboxDialog()));
  panel.append(actions);

  addLog(`阅读信件：${letter.title}`);
  if (granted) playSound("coin");
  showDialog(letter.title, panel);
  scheduleAutosave("阅读邮箱");
}

function showMailboxDialog(message = "") {
  const letters = availableMailLetters();
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>今天 <strong>第 ${state.day} 天</strong></span>
    <span>可读 <strong>${letters.length}</strong></span>
    <span>未读 <strong>${unreadMailCount()}</strong></span>
  `;
  panel.append(stats);

  if (letters.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "邮箱里现在没有信件。";
    panel.append(empty);
  }

  if (state.story.viewedYearEnd && !state.story.secondYearPlan) {
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = "年终会后续 · 第二年发展方向 · 未选择";
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(createShopButton("选择方向", false, () => showSecondYearPlanDialog()));
    row.append(actions);
    panel.append(row);
  }

  for (const letter of letters) {
    const row = document.createElement("div");
    row.className = "shop-row";
    if (state.mailbox.readIds.includes(letter.id)) row.classList.add("is-complete");

    const info = document.createElement("span");
    const readState = state.mailbox.readIds.includes(letter.id) ? "已读" : "未读";
    const rewardText = mailRewardText(letter);
    const rewardState = rewardText === "无" ? "无附件" : state.mailbox.claimedIds.includes(letter.id) ? "已领取" : `奖励 ${rewardText}`;
    info.textContent = `${readState} · 第 ${letter.day} 天 · ${letter.from} · ${letter.title} · ${rewardState}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(createShopButton(readState === "已读" ? "重读" : "阅读", false, () => readMailboxLetter(letter.id)));
    row.append(actions);
    panel.append(row);
  }

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("邮箱", panel);
}

function gatherResourceNode(object) {
  const def = resourceNodeDef(object);
  const blockedReason = resourceNodeBlockedReason(object);
  if (blockedReason) {
    addLog(blockedReason);
    playSound("error");
    showResourceNodeDialog(object, blockedReason);
    return false;
  }

  normalizeResourceNodeDailyState(object);
  object.gatheredToday += 1;
  addResources(def.rewards);
  state.story.mountainResourceVisited = true;
  spendEnergyMinutes({ energy: def.energy, minutes: 15 });
  updateAllHud();

  const rewardText = resourceRewardText(def.rewards);
  addLog(`${def.name}采集：${rewardText}。`);
  addToolFeedback({ x: object.x, y: object.y }, `+${rewardText}`, "good");
  addVisualEffect({ x: object.x, y: object.y }, "quest", { color: def.effectColor, duration: 900 });
  playSound("quest");
  showResourceNodeDialog(object, `采集获得：${rewardText}。`);
  scheduleAutosave("山里采集");
  return true;
}

function upgradeToolWithResources(toolId, sourceObject = null) {
  const cost = resourceToolUpgradeCost(toolId);
  const blockedReason = resourceToolUpgradeBlockedReason(toolId);
  if (!cost || blockedReason) {
    const message = blockedReason || "无法升级工具。";
    addLog(message);
    playSound("error");
    if (sourceObject) showResourceNodeDialog(sourceObject, message);
    return false;
  }

  state.inventory.gold -= cost.gold;
  consumeResources(cost.resources);
  state.abilities.toolLevels[toolId] = cost.level;
  if (toolId === "wateringCan") {
    state.abilities.wateringCanBonus += RESOURCE_TOOL_UPGRADES.wateringCan.waterBonus ?? 0;
    state.wateringCanWater = wateringCanCapacityForStory();
  }
  ensureCurrentEnergyWithinMax();
  ensureCurrentWaterWithinCapacity();
  updateAllHud();

  const message = `${RESOURCE_TOOL_UPGRADES[toolId].label}完成：${toolsById[toolId]?.name ?? toolId} Lv.${cost.level}。`;
  addLog(message);
  addToolFeedback(sourceObject ? { x: sourceObject.x, y: sourceObject.y } : playerTile(), "工具升级", "good");
  addVisualEffect(sourceObject ? { x: sourceObject.x, y: sourceObject.y } : playerTile(), "quest", { color: "#8cb7d7", duration: 900 });
  playSound("quest");
  if (sourceObject) showResourceNodeDialog(sourceObject, message);
  scheduleAutosave("资源工具升级");
  return true;
}

function showResourceNodeDialog(object, message = "") {
  const def = resourceNodeDef(object);
  const remaining = resourceNodeRemaining(object);
  const blockedReason = resourceNodeBlockedReason(object);
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>今日次数 <strong>${remaining}/${def.maxPerDay}</strong></span>
    <span>体力消耗 <strong>${def.energy}</strong></span>
    <span>库存资源 <strong>${resourceCountSummary()}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = `${def.description} 每次采集约耗时 15 分钟，奖励：${resourceRewardText(def.rewards)}。`;
  panel.append(intro);

  const route = document.createElement("p");
  route.className = "dialog-note";
  route.textContent = `山里资源今日剩余：${resourceNodeTodaySummary() || "暂无资源点"}。工具升级和设施修复会消耗这些资源。`;
  panel.append(route);

  const gatherRow = document.createElement("div");
  gatherRow.className = "shop-row";
  const gatherInfo = document.createElement("span");
  gatherInfo.textContent = remaining > 0 ? `还可采集 ${remaining} 次` : "今天已经采完";
  gatherRow.append(gatherInfo);
  const gatherActions = document.createElement("div");
  gatherActions.className = "shop-actions";
  gatherActions.append(createShopButton("采集一次", Boolean(blockedReason), () => gatherResourceNode(object), blockedReason));
  gatherRow.append(gatherActions);
  panel.append(gatherRow);

  if (def.id === "toolShed") {
    const upgradeSection = document.createElement("section");
    upgradeSection.className = "shop-section";
    const title = document.createElement("h3");
    title.textContent = "工具升级";
    upgradeSection.append(title);
    for (const toolId of TOOL_UPGRADE_IDS) {
      const cost = resourceToolUpgradeCost(toolId);
      const reason = resourceToolUpgradeBlockedReason(toolId);
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.textContent = cost
        ? `${toolNameWithLevel(toolId)} -> Lv.${cost.level} · ${resourceToolUpgradeCostText(toolId)}`
        : `${toolNameWithLevel(toolId)} · 已满级`;
      row.append(info);
      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(createShopButton(cost ? "升级" : "满级", Boolean(reason), () => upgradeToolWithResources(toolId, object), reason));
      row.append(actions);
      upgradeSection.append(row);
    }
    panel.append(upgradeSection);
  }

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(object.name ?? def.name, panel);
}

function buySpringFairItem(itemId) {
  const item = SPRING_FAIR_ITEMS.find((entry) => entry.id === itemId);
  if (!item) return false;
  const blockedReason = springFairItemBlockedReason(item);
  if (blockedReason) {
    addLog(blockedReason);
    playSound("error");
    showSpringFairDialog(blockedReason);
    return false;
  }

  state.inventory.gold -= item.gold;
  let purchasedSeeds = 0;
  for (const [cropId, count] of Object.entries(item.seeds ?? {})) {
    addSeedCount(cropId, count);
    purchasedSeeds += count;
  }
  addResources(item.resources ?? {});
  for (const cropId of item.unlockSeeds ?? []) {
    state.abilities.unlockedSeeds[cropDef(cropId).id] = true;
  }
  if (purchasedSeeds > 0) advanceQuests("purchase", purchasedSeeds);
  state.story.springFairVisited = true;
  updateAllHud();

  const message = `购买${item.label}，花费 ${item.gold}g，获得：${springFairItemRewardText(item)}。`;
  addLog(message);
  playSound("coin");
  showSpringFairDialog(message);
  scheduleAutosave("春集购买");
  return true;
}

function showSpringFairDialog(message = "") {
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const open = springFairIsOpen();
  if (open && !state.story.springFairVisited) {
    state.story.springFairVisited = true;
    updateAllHud();
    scheduleAutosave("参加春集");
  }

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>日期 <strong>第 ${state.day} 天</strong></span>
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
    <span>状态 <strong>${open ? "开放中" : "未开放"}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = open
    ? `春集从春季第 ${SPRING_FAIR_START_DAY} 天开到第 ${SPRING_FAIR_END_DAY} 天，适合补早豆试种包、春季种子和工具材料。`
    : `春集种子会在春季第 ${SPRING_FAIR_START_DAY}-${SPRING_FAIR_END_DAY} 天开放。来村口摊位可以买到早豆试种包和工具材料。`;
  panel.append(intro);

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "春集商品";
  section.append(title);
  for (const item of SPRING_FAIR_ITEMS) {
    const reason = springFairItemBlockedReason(item);
    const row = document.createElement("div");
    row.className = "shop-row";
    if (!open) row.classList.add("is-locked");
    const info = document.createElement("span");
    info.textContent = `${item.label} · ${item.gold}g · ${springFairItemRewardText(item)}`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(createShopButton("购买", Boolean(reason), () => buySpringFairItem(item.id), reason));
    row.append(actions);
    section.append(row);
  }
  panel.append(section);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("春集种子会", panel);
}

function completeSpringSampleBundle() {
  if (state.story.springSampleBundleCompleted) {
    showSpringSampleBundleDialog("春季样本已经提交。");
    return false;
  }
  if (!springSampleBundleReady()) {
    const message = `样本还不够：${springSampleBundleMissingText()}。`;
    addLog(message);
    playSound("error");
    showSpringSampleBundleDialog(message);
    return false;
  }

  consumeCropsByType(SPRING_SAMPLE_BUNDLE.cropCosts);
  consumeResources(SPRING_SAMPLE_BUNDLE.resourceCosts);
  state.inventory.gold += SPRING_SAMPLE_BUNDLE.rewardGold;
  for (const [cropId, count] of Object.entries(SPRING_SAMPLE_BUNDLE.rewardSeeds)) addSeedCount(cropId, count);
  addResources(SPRING_SAMPLE_BUNDLE.rewardResources);
  state.story.springSampleBundleCompleted = true;
  state.story.springSampleRewardClaimed = true;
  updateAllHud();

  const message = `春季样本包完成，奖励：${springSampleBundleRewardText()}。`;
  addLog(message);
  addVisualEffect(playerTile(), "quest", { color: "#70b77e", duration: 1000 });
  playSound("quest");
  showSpringSampleBundleDialog(message);
  scheduleAutosave("春季样本包");
  return true;
}

function showSpringSampleBundleDialog(message = "") {
  const completed = state.story.springSampleBundleCompleted;
  const unlocked = springSampleBundleUnlocked();
  const ready = springSampleBundleReady();
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>状态 <strong>${completed ? "已完成" : ready ? "可提交" : unlocked ? "收集中" : "未开放"}</strong></span>
    <span>作物 <strong>${cropCostText(SPRING_SAMPLE_BUNDLE.cropCosts)}</strong></span>
    <span>资源 <strong>${resourceCostText(SPRING_SAMPLE_BUNDLE.resourceCosts)}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent =
    "春季样本箱用来记录本季作物和山里采集样本，可以当年提交，也可以后续年份补齐。提交后会给夏季启动资金和小麦种子。";
  panel.append(intro);

  const detailList = document.createElement("ul");
  detailList.className = "inventory-list";
  for (const item of springSampleRequirementDetails()) {
    const line = document.createElement("li");
    line.textContent =
      item.missing > 0
        ? `${item.label}：${item.owned}/${item.required} · 去哪拿：${item.source}`
        : `${item.label}：${item.owned}/${item.required} · 已够`;
    detailList.append(line);
  }
  panel.append(detailList);

  const row = document.createElement("div");
  row.className = "shop-row";
  const info = document.createElement("span");
  info.textContent = completed
    ? `已记录春季样本 · 奖励已发放：${springSampleBundleRewardText()}`
    : ready
      ? `材料齐全 · 奖励：${springSampleBundleRewardText()}`
      : `缺少：${springSampleBundleMissingText()}`;
  row.append(info);
  const actions = document.createElement("div");
  actions.className = "shop-actions";
  const reason = completed ? "已经提交。" : ready ? "" : springSampleBundleMissingText();
  actions.append(createShopButton(completed ? "已完成" : "提交样本", completed || !ready, () => completeSpringSampleBundle(), reason));
  row.append(actions);
  panel.append(row);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("春季样本箱", panel);
}

const SHOP_DIALOG_MODES = {
  seeds: "seeds",
  grocery: "grocery",
};
const shopDialogState = {
  title: "村庄种子铺",
  mode: SHOP_DIALOG_MODES.seeds,
};

function visibleSellCropIds() {
  return CROP_IDS.filter((cropId) => (state.inventory.crops[cropId] ?? 0) > 0);
}

function visibleSellGoodIds() {
  return PROCESSED_GOOD_IDS.filter((goodId) => (state.inventory.goods[goodId] ?? 0) > 0);
}

function visibleSellInventoryValue() {
  const cropValueTotal = visibleSellCropIds().reduce((sum, cropId) => {
    const def = cropDef(cropId);
    return sum + (state.inventory.crops[def.id] ?? 0) * def.sellPrice;
  }, 0);
  const goodValueTotal = visibleSellGoodIds().reduce((sum, goodId) => {
    const def = processedGoodDef(goodId);
    return sum + (state.inventory.goods[def.id] ?? 0) * def.sellPrice;
  }, 0);
  return effectiveSaleIncome(cropValueTotal + goodValueTotal);
}

function sellVisibleInventory() {
  const cropIds = visibleSellCropIds();
  const goodIds = visibleSellGoodIds();
  const income = visibleSellInventoryValue();
  const count =
    cropIds.reduce((sum, cropId) => sum + (state.inventory.crops[cropId] ?? 0), 0) +
    goodIds.reduce((sum, goodId) => sum + (state.inventory.goods[goodId] ?? 0), 0);
  if (count <= 0 || income <= 0) {
    const message = "没有可出售的可见库存。";
    addLog(message);
    playSound("error");
    showShopDialog(message, "村庄杂货铺", SHOP_DIALOG_MODES.grocery);
    return false;
  }
  for (const cropId of cropIds) state.inventory.crops[cropId] = 0;
  for (const goodId of goodIds) state.inventory.goods[goodId] = 0;
  state.inventory.gold += income;
  updateAllHud();
  const reserveWarnings = cropIds.map((cropId) => springSampleReserveWarning(cropId)).filter(Boolean);
  const message = `卖出当前可见库存 ${count} 件，获得 ${income}g。${reserveWarnings.length > 0 ? ` ${reserveWarnings.join(" ")}` : ""}`;
  addLog(message);
  playSound("coin");
  showShopDialog(message, "村庄杂货铺", SHOP_DIALOG_MODES.grocery);
  scheduleAutosave("杂货铺卖全部可见库存");
  return true;
}

function showShopDialog(message = "", title = shopDialogState.title, mode = shopDialogState.mode) {
  const dialogMode = mode === SHOP_DIALOG_MODES.grocery ? SHOP_DIALOG_MODES.grocery : SHOP_DIALOG_MODES.seeds;
  shopDialogState.title = title || (dialogMode === SHOP_DIALOG_MODES.grocery ? "村庄杂货铺" : "村庄种子铺");
  shopDialogState.mode = dialogMode;
  const showSeedPurchases = dialogMode === SHOP_DIALOG_MODES.seeds;
  const showInventorySales = dialogMode === SHOP_DIALOG_MODES.grocery;

  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const event = calendarEventForDay();
  const discount = shopDiscountForDay();

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
    <span>种子 <strong>${totalCropCount(state.inventory.seeds)}</strong></span>
    <span>事件 <strong>${eventLabel(event)}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = showSeedPurchases
    ? `这里只出售当季已解锁种子。当前：${seasonInfoForDay().label}，当季作物：${seasonCropSummary()}。推荐：${recommendedSeedIdsForSeason()
        .filter((cropId) => isSeedAvailable(cropId))
        .map((cropId) => cropDef(cropId).seedName)
        .join("、") || "按当前目标补货"}。${
        discount < 1 ? `今日${event.title}，种子 ${Math.round(discount * 10)} 折。` : ""
      }`
    : "杂货铺只收购你背包里已有的作物和加工品；库存为 0 的物品不会显示。";
  panel.append(intro);

  if (showInventorySales) {
    const visibleValue = visibleSellInventoryValue();
    const bulkActions = document.createElement("div");
    bulkActions.className = "shop-actions";
    bulkActions.append(
      createShopButton("卖全部可见库存", visibleValue <= 0, () => sellVisibleInventory(), "背包里没有可出售库存"),
    );
    panel.append(bulkActions);
  }

  if (showSeedPurchases) {
    const seasonId = currentSeasonId();
    const section = document.createElement("section");
    section.className = "shop-section";
    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = `${seasonLabel(seasonId)}种子`;
    section.append(sectionTitle);
    const seasonCropIds = CROP_IDS.filter((cropId) => isCropInSeason(cropId, seasonId));
    for (const cropId of seasonCropIds) {
      const def = cropDef(cropId);
      const seedCount = state.inventory.seeds[def.id] ?? 0;
      const unitPrice = seedUnitPrice(def.id);
      const buyOneCost = unitPrice;
      const buyFiveCost = unitPrice * 5;
      const canBuyNow = isSeedAvailable(def.id);
      const priceText = unitPrice < def.seedPrice ? `${unitPrice}g（原价 ${def.seedPrice}g）` : `${unitPrice}g`;
      const row = document.createElement("div");
      row.className = "shop-row";
      if (!canBuyNow) row.classList.add("is-locked");
      const info = document.createElement("span");
      info.textContent = `${def.seedName} · ${priceText} · ${cropUnlockText(def.id)} · ${seedRecommendationText(def.id)} · 拥有 ${seedCount}`;
      row.append(info);

      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(
        createShopButton(
          "买 1 (" + buyOneCost + "g)",
          !canBuyNow || state.inventory.gold < buyOneCost,
          () => buySeeds(def.id, 1),
          seedShopUnavailableReason(def.id, buyOneCost),
        ),
        createShopButton(
          "买 5 (" + buyFiveCost + "g)",
          !canBuyNow || state.inventory.gold < buyFiveCost,
          () => buySeeds(def.id, 5),
          seedShopUnavailableReason(def.id, buyFiveCost),
        ),
      );
      row.append(actions);
      section.append(row);
    }
    panel.append(section);

  }

  const sellSection = document.createElement("section");
  sellSection.className = "shop-section";
  const sellTitle = document.createElement("h3");
  sellTitle.textContent = "出售作物";
  sellSection.append(sellTitle);
  let sellCropRowCount = 0;
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const cropCount = state.inventory.crops[def.id] ?? 0;
    if (cropCount <= 0) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    const sampleGuidance = springSampleInventoryGuidance(def.id, cropCount);
    info.textContent = `${def.name} · 售价 ${def.sellPrice}g · 拥有 ${cropCount}${sampleGuidance ? ` · ${sampleGuidance}` : ""}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("卖 1", cropCount <= 0, () => sellCrops(def.id, 1), "作物不足"),
      createShopButton("卖全部", cropCount <= 0, () => sellAllCrops(def.id), "作物不足"),
    );
    row.append(actions);
    sellSection.append(row);
    sellCropRowCount += 1;
  }
  if (showInventorySales && sellCropRowCount > 0) panel.append(sellSection);

  const goodsSellSection = document.createElement("section");
  goodsSellSection.className = "shop-section";
  const goodsSellTitle = document.createElement("h3");
  goodsSellTitle.textContent = "出售加工品";
  goodsSellSection.append(goodsSellTitle);
  let sellGoodRowCount = 0;
  for (const goodId of PROCESSED_GOOD_IDS) {
    const def = processedGoodDef(goodId);
    const goodCount = state.inventory.goods[def.id] ?? 0;
    if (goodCount <= 0) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name} · 售价 ${def.sellPrice}g · 拥有 ${goodCount}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("卖 1", goodCount <= 0, () => sellGoods(def.id, 1), "加工品不足"),
      createShopButton("卖全部", goodCount <= 0, () => sellAllGoods(def.id), "加工品不足"),
    );
    row.append(actions);
    goodsSellSection.append(row);
    sellGoodRowCount += 1;
  }
  if (showInventorySales && sellGoodRowCount > 0) panel.append(goodsSellSection);

  if (showInventorySales && sellCropRowCount + sellGoodRowCount === 0) {
    const empty = document.createElement("p");
    empty.textContent = "背包里暂时没有可出售的作物或加工品。";
    panel.append(empty);
  }

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(shopDialogState.title, panel);
}

function showCommunityOrderDialog(object, message = "") {
  const order = communityOrderDefForObject(object);
  if (!order) return false;
  if (!state.story.marketPrepCompleted) {
    showDialog(object.name ?? "集市", "集市还在准备中。先完成出货记录并修复木匠公告牌。");
    return false;
  }

  const progress = communityOrderProgress(order);
  const complete = communityOrderComplete(order);
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>进度 <strong>${progress}/${order.target}</strong></span>
    <span>库存作物 <strong>${totalCropCount(state.inventory.crops)}</strong></span>
    <span>奖励 <strong>${communityOrderRewardText(order)}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = complete
    ? `${order.description} 这笔社区订单已经完成。`
    : `${order.description} 还需要提交 ${order.target - progress} 个作物。`;
  panel.append(note);

  const cropSection = document.createElement("section");
  cropSection.className = "shop-section";
  const cropTitle = document.createElement("h3");
  cropTitle.textContent = "提交作物";
  cropSection.append(cropTitle);

  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const cropCount = state.inventory.crops[cropId] ?? 0;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${cropCount}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("提交 1", complete || cropCount <= 0, () => submitCommunityOrderCrop(order.id, cropId, 1), complete ? "订单已完成" : "库存不足"),
      createShopButton(
        "补足订单",
        complete || cropCount <= 0,
        () => submitCommunityOrderCrop(order.id, cropId, Math.min(cropCount, order.target - progress)),
        complete ? "订单已完成" : "库存不足",
      ),
    );
    row.append(actions);
    cropSection.append(row);
  }
  panel.append(cropSection);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(order.title, panel);
  return true;
}

function showEcommerceDialog(message = "") {
  if (!state.story.communityOrdersCompleted) {
    showDialog("电商助农角", "集市还没有稳定运行。先完成安心菜篮和茶铺试吃两个社区订单。");
    return false;
  }
  state.story.ecommerceDeskSeen = true;
  const submitted = ecommerceTrialSubmittedCount();
  const target = ECOMMERCE_TRIAL_ORDER.target;
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>试单 <strong>${submitted}/${target}</strong></span>
    <span>包装 <strong>${state.story.ecommerceTrialPacked ? "完成" : "未完成"}</strong></span>
    <span>发货 <strong>${state.story.ecommerceTrialShipped ? "完成" : "未完成"}</strong></span>
    <span>奖励 <strong>${ecommerceTrialRewardText()}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  if (state.story.ecommerceTrialShipped) {
    note.textContent = "第一笔外地试单已经发出。后续可以扩展分拣品质、包装方案、物流损耗和复购反馈。";
  } else if (state.story.ecommerceTrialPacked) {
    note.textContent = "作物已经完成分拣包装，可以发货结算。";
  } else if (submitted >= target) {
    note.textContent = "试单作物已经备齐，下一步进行分拣包装。";
  } else {
    note.textContent = `提交 ${target} 个任意作物作为外地试单。试单会消耗背包作物。`;
  }
  panel.append(note);

  if (!state.story.ecommerceTrialPacked && !state.story.ecommerceTrialShipped) {
    const cropSection = document.createElement("section");
    cropSection.className = "shop-section";
    const cropTitle = document.createElement("h3");
    cropTitle.textContent = "提交试单作物";
    cropSection.append(cropTitle);

    for (const cropId of CROP_IDS) {
      const def = cropDef(cropId);
      const cropCount = state.inventory.crops[def.id] ?? 0;
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.textContent = `${def.name}：库存 ${cropCount}`;
      row.append(info);

      const remaining = target - submitted;
      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(
        createShopButton("提交 1", submitted >= target || cropCount <= 0, () => submitEcommerceTrialCrop(def.id, 1), submitted >= target ? "试单已备齐" : "库存不足"),
        createShopButton(
          "补足试单",
          submitted >= target || cropCount <= 0,
          () => submitEcommerceTrialCrop(def.id, Math.min(cropCount, remaining)),
          submitted >= target ? "试单已备齐" : "库存不足",
        ),
      );
      row.append(actions);
      cropSection.append(row);
    }
    panel.append(cropSection);
  }

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(
    createShopButton(
      "分拣包装",
      submitted < target || state.story.ecommerceTrialPacked || state.story.ecommerceTrialShipped,
      () => packEcommerceTrial(),
      submitted < target ? "试单作物不足" : "已经包装",
    ),
    createShopButton(
      "发货结算",
      !state.story.ecommerceTrialPacked || state.story.ecommerceTrialShipped,
      () => shipEcommerceTrial(),
      state.story.ecommerceTrialShipped ? "已经发货" : "先完成分拣包装",
    ),
  );
  panel.append(actions);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("电商助农角", panel);
  updateAllHud();
  scheduleAutosave("查看电商助农角");
  return true;
}

function submitEcommerceTrialCrop(cropId, count) {
  if (state.story.ecommerceTrialPacked || state.story.ecommerceTrialShipped) {
    showEcommerceDialog("试单已经进入包装或发货阶段，不能继续追加作物。");
    return false;
  }
  const def = cropDef(cropId);
  const remaining = ECOMMERCE_TRIAL_ORDER.target - ecommerceTrialSubmittedCount();
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.crops[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showEcommerceDialog(message);
    return false;
  }
  state.inventory.crops[def.id] -= safeCount;
  state.story.ecommerceTrialSubmitted = ecommerceTrialSubmittedCount() + safeCount;
  const message = `提交 ${safeCount} 个${def.name}到外地试单。`;
  updateAllHud();
  addLog(message);
  playSound("ship");
  showEcommerceDialog(message);
  scheduleAutosave("电商试单提交");
  return true;
}

function packEcommerceTrial() {
  if (state.story.ecommerceTrialPacked || state.story.ecommerceTrialShipped) return false;
  if (ecommerceTrialSubmittedCount() < ECOMMERCE_TRIAL_ORDER.target) {
    showEcommerceDialog("试单作物还不够，先提交 4 个任意作物。");
    return false;
  }
  state.story.ecommerceTrialPacked = true;
  updateAllHud();
  addLog("外地试单已完成分拣包装。");
  addScreenEffect("quest", "分拣包装");
  playSound("quest");
  showEcommerceDialog("分拣包装完成：规格统一，损耗降低，可以发货。");
  scheduleAutosave("电商试单包装");
  return true;
}

function shipEcommerceTrial() {
  if (state.story.ecommerceTrialShipped) return false;
  if (!state.story.ecommerceTrialPacked) {
    showEcommerceDialog("先完成分拣包装，再发货结算。");
    return false;
  }
  state.story.ecommerceTrialShipped = true;
  if (!state.story.ecommerceTrialRewardClaimed) {
    state.story.ecommerceTrialRewardClaimed = true;
    state.inventory.gold += ECOMMERCE_TRIAL_ORDER.rewardGold;
    for (const [cropId, count] of Object.entries(ECOMMERCE_TRIAL_ORDER.rewardSeeds)) {
      addSeedCount(cropId, count);
    }
  }
  const message = `第一笔外地试单发货完成，获得 ${ecommerceTrialRewardText()}。`;
  updateAllHud();
  addLog(message);
  addScreenEffect("quest", "试单发货");
  playSound("quest");
  showEcommerceDialog(message);
  scheduleAutosave("电商试单发货");
  return true;
}

function showCooperativeDialog(message = "") {
  if (!state.story.cooperativeRepaired) {
    showDialog("合作社旧窗口", featureRequirementText("cooperative"));
    return false;
  }
  if (state.story.cooperativeJoined) return showCooperativeContractDialog(message);
  return showCooperativeTrialDialog(message);
}

function showCooperativeTrialDialog(message = "") {
  const cropSubmitted = cooperativeCropSubmittedCount();
  const goodSubmitted = cooperativeGoodSubmittedCount();
  const complete = cooperativeTrialComplete();
  if (complete && !state.story.cooperativeJoined) {
    message = completeCooperativeTrial() || message;
  }
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>作物样品 <strong>${cropSubmitted}/${COOPERATIVE_TRIAL.cropTarget}</strong></span>
    <span>加工样品 <strong>${goodSubmitted}/${COOPERATIVE_TRIAL.goodTarget}</strong></span>
    <span>状态 <strong>${state.story.cooperativeJoined ? "已入社" : complete ? "可登记" : "收集中"}</strong></span>
    <span>奖励 <strong>${cooperativeRewardText()}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = state.story.cooperativeJoined
    ? "合作社试运行名册已经登记。后续可以扩展批量合同、品类评级和年终分红。"
    : `提交 ${COOPERATIVE_TRIAL.cropTarget} 个任意作物和 ${COOPERATIVE_TRIAL.goodTarget} 个任意加工品，证明农场能稳定供应原料与成品。`;
  panel.append(note);

  const cropSection = document.createElement("section");
  cropSection.className = "shop-section";
  const cropTitle = document.createElement("h3");
  cropTitle.textContent = "提交作物样品";
  cropSection.append(cropTitle);
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const cropCount = state.inventory.crops[def.id] ?? 0;
    const remaining = COOPERATIVE_TRIAL.cropTarget - cropSubmitted;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${cropCount}`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("提交 1", complete || remaining <= 0 || cropCount <= 0, () => submitCooperativeCrop(def.id, 1), complete ? "样品已完成" : "库存不足"),
      createShopButton(
        "补足作物",
        complete || remaining <= 0 || cropCount <= 0,
        () => submitCooperativeCrop(def.id, Math.min(cropCount, remaining)),
        complete ? "样品已完成" : "库存不足",
      ),
    );
    row.append(actions);
    cropSection.append(row);
  }
  panel.append(cropSection);

  const goodSection = document.createElement("section");
  goodSection.className = "shop-section";
  const goodTitle = document.createElement("h3");
  goodTitle.textContent = "提交加工样品";
  goodSection.append(goodTitle);
  for (const goodId of PROCESSED_GOOD_IDS) {
    const def = processedGoodDef(goodId);
    const goodCount = state.inventory.goods[def.id] ?? 0;
    const remaining = COOPERATIVE_TRIAL.goodTarget - goodSubmitted;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${goodCount} · 出货价 ${def.sellPrice}g`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("提交 1", complete || remaining <= 0 || goodCount <= 0, () => submitCooperativeGood(def.id, 1), complete ? "样品已完成" : "库存不足"),
    );
    row.append(actions);
    goodSection.append(row);
  }
  panel.append(goodSection);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("合作社窗口", panel);
  updateAllHud();
  scheduleAutosave("查看合作社窗口");
  return true;
}

function showCooperativeContractDialog(message = "") {
  const contract = cooperativeContractForDay();
  const submitted = cooperativeContractSubmitted(contract);
  const complete = cooperativeContractComplete(contract);
  let claimed = cooperativeContractClaimed(contract);
  if (complete && !claimed) {
    message = grantCooperativeContractReward(contract) || message;
    claimed = cooperativeContractClaimed(contract);
  }

  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>合同 <strong>${contract.kind === "crop" ? "原料" : "加工品"}</strong></span>
    <span>进度 <strong>${submitted}/${contract.target}</strong></span>
    <span>状态 <strong>${claimed ? "已结算" : complete ? "可结算" : "进行中"}</strong></span>
    <span>奖励 <strong>${cooperativeContractRewardText(contract)}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = `${contract.description} 当前合同周期：${seasonInfoForDay().solarTerm.name}，剩余 ${
    DAYS_PER_SOLAR_TERM - seasonInfoForDay().dayOfTerm + 1
  } 天。`;
  panel.append(note);

  if (cooperativeExpansionEnabled()) {
    const progress = cooperativeExpansionProgress();
    const remainder = progress % COOPERATIVE_EXPANSION.dividendEveryContracts;
    const nextDividend = remainder === 0 ? COOPERATIVE_EXPANSION.dividendEveryContracts : COOPERATIVE_EXPANSION.dividendEveryContracts - remainder;
    const expansionSection = document.createElement("section");
    expansionSection.className = "shop-section";
    const expansionTitle = document.createElement("h3");
    expansionTitle.textContent = "合作社扩张";
    const expansionStats = document.createElement("div");
    expansionStats.className = "shop-stats";
    expansionStats.innerHTML = `
      <span>路线合同 <strong>${progress}</strong></span>
      <span>连续供货 <strong>${state.story.cooperativeExpansionStreak}</strong></span>
      <span>最佳连签 <strong>${state.story.cooperativeExpansionBestStreak}</strong></span>
      <span>已分红 <strong>${state.story.cooperativeExpansionDividendClaimedTiers.length}</strong></span>
    `;
    const expansionNote = document.createElement("p");
    expansionNote.textContent = `选择合作社扩张后，每完成 ${COOPERATIVE_EXPANSION.dividendEveryContracts} 张节气合同发放一次社员分红：${cooperativeExpansionDividendText()}。距下次分红还需 ${nextDividend} 张合同。`;
    expansionSection.append(expansionTitle, expansionStats, expansionNote);
    panel.append(expansionSection);
  }

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = contract.kind === "crop" ? "提交合同作物" : "提交合同加工品";
  section.append(title);

  if (contract.kind === "crop") {
    for (const cropId of CROP_IDS) {
      const def = cropDef(cropId);
      const cropCount = state.inventory.crops[def.id] ?? 0;
      const remaining = contract.target - submitted;
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.textContent = `${def.name}：库存 ${cropCount} · 售价 ${def.sellPrice}g`;
      row.append(info);
      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(
        createShopButton("提交 1", claimed || submitted >= contract.target || cropCount <= 0, () => submitCooperativeContractCrop(def.id, 1), claimed ? "合同已结算" : "库存不足"),
        createShopButton(
          "补足合同",
          claimed || submitted >= contract.target || cropCount <= 0,
          () => submitCooperativeContractCrop(def.id, Math.min(cropCount, remaining)),
          claimed ? "合同已结算" : "库存不足",
        ),
      );
      row.append(actions);
      section.append(row);
    }
  } else {
    for (const goodId of PROCESSED_GOOD_IDS) {
      const def = processedGoodDef(goodId);
      const goodCount = state.inventory.goods[def.id] ?? 0;
      const remaining = contract.target - submitted;
      const row = document.createElement("div");
      row.className = "shop-row";
      const info = document.createElement("span");
      info.textContent = `${def.name}：库存 ${goodCount} · 出货价 ${def.sellPrice}g`;
      row.append(info);
      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(
        createShopButton("提交 1", claimed || submitted >= contract.target || goodCount <= 0, () => submitCooperativeContractGood(def.id, 1), claimed ? "合同已结算" : "库存不足"),
        createShopButton(
          "补足合同",
          claimed || submitted >= contract.target || goodCount <= 0,
          () => submitCooperativeContractGood(def.id, Math.min(goodCount, remaining)),
          claimed ? "合同已结算" : "库存不足",
        ),
      );
      row.append(actions);
      section.append(row);
    }
  }
  panel.append(section);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("合作社批量合同", panel);
  updateAllHud();
  scheduleAutosave("查看合作社合同");
  return true;
}

function submitCooperativeCrop(cropId, count) {
  if (state.story.cooperativeJoined) return showCooperativeDialog("合作社样品已经通过，不需要继续提交。");
  const def = cropDef(cropId);
  const remaining = COOPERATIVE_TRIAL.cropTarget - cooperativeCropSubmittedCount();
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.crops[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showCooperativeDialog(message);
    return false;
  }
  state.inventory.crops[def.id] -= safeCount;
  state.story.cooperativeCropSubmitted = cooperativeCropSubmittedCount() + safeCount;
  const completionText = completeCooperativeTrial();
  const message = completionText || `提交 ${safeCount} 个${def.name}到合作社样品。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(completionText ? "quest" : "ship");
  showCooperativeDialog(message);
  scheduleAutosave("合作社样品提交");
  return true;
}

function submitCooperativeGood(goodId, count) {
  if (state.story.cooperativeJoined) return showCooperativeDialog("合作社样品已经通过，不需要继续提交。");
  const def = processedGoodDef(goodId);
  const remaining = COOPERATIVE_TRIAL.goodTarget - cooperativeGoodSubmittedCount();
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.goods[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showCooperativeDialog(message);
    return false;
  }
  state.inventory.goods[def.id] -= safeCount;
  state.story.cooperativeGoodSubmitted = cooperativeGoodSubmittedCount() + safeCount;
  const completionText = completeCooperativeTrial();
  const message = completionText || `提交 ${safeCount} 个${def.name}到合作社样品。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(completionText ? "quest" : "ship");
  showCooperativeDialog(message);
  scheduleAutosave("合作社样品提交");
  return true;
}

function setCooperativeContractSubmitted(contract, count) {
  state.story.cooperativeContracts.submitted[contract.key] = Math.min(contract.target, Math.max(0, count));
}

function submitCooperativeContractCrop(cropId, count) {
  const contract = cooperativeContractForDay();
  if (contract.kind !== "crop") return showCooperativeContractDialog("当前合同收加工品，不收作物。");
  if (cooperativeContractClaimed(contract)) return showCooperativeContractDialog("当前节气合同已经结算。");
  const def = cropDef(cropId);
  const remaining = contract.target - cooperativeContractSubmitted(contract);
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.crops[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showCooperativeContractDialog(message);
    return false;
  }
  state.inventory.crops[def.id] -= safeCount;
  setCooperativeContractSubmitted(contract, cooperativeContractSubmitted(contract) + safeCount);
  const rewardText = cooperativeContractComplete(contract) ? grantCooperativeContractReward(contract) : "";
  const message = rewardText || `提交 ${safeCount} 个${def.name}到${contract.title}。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(rewardText ? "quest" : "ship");
  showCooperativeContractDialog(message);
  scheduleAutosave("合作社合同提交");
  return true;
}

function submitCooperativeContractGood(goodId, count) {
  const contract = cooperativeContractForDay();
  if (contract.kind !== "good") return showCooperativeContractDialog("当前合同收作物，不收加工品。");
  if (cooperativeContractClaimed(contract)) return showCooperativeContractDialog("当前节气合同已经结算。");
  const def = processedGoodDef(goodId);
  const remaining = contract.target - cooperativeContractSubmitted(contract);
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.goods[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showCooperativeContractDialog(message);
    return false;
  }
  state.inventory.goods[def.id] -= safeCount;
  setCooperativeContractSubmitted(contract, cooperativeContractSubmitted(contract) + safeCount);
  const rewardText = cooperativeContractComplete(contract) ? grantCooperativeContractReward(contract) : "";
  const message = rewardText || `提交 ${safeCount} 个${def.name}到${contract.title}。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(rewardText ? "quest" : "ship");
  showCooperativeContractDialog(message);
  scheduleAutosave("合作社合同提交");
  return true;
}

function showTourismDialog(message = "") {
  if (!state.story.tourismRepaired) {
    showDialog("游客服务旧亭", featureRequirementText("tourism"));
    return false;
  }
  if (tourismOrderComplete() && !state.story.tourismFirstOrderCompleted) {
    message = completeTourismOrder() || message;
  }

  const score = farmScoreTotal();
  const cropSubmitted = tourismCropSubmittedCount();
  const goodSubmitted = tourismGoodSubmittedCount();
  const complete = state.story.tourismFirstOrderCompleted;
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>评价 <strong>${score}/${TOURISM_ORDER.scoreTarget}</strong></span>
    <span>作物礼篮 <strong>${cropSubmitted}/${TOURISM_ORDER.cropTarget}</strong></span>
    <span>加工试吃 <strong>${goodSubmitted}/${TOURISM_ORDER.goodTarget}</strong></span>
    <span>状态 <strong>${complete ? "已接待" : tourismOrderComplete() ? "可接待" : "准备中"}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = complete
    ? "第一批游客已经完成接待。后续可以扩展游客团、纪念品、路线评分和复访。"
    : `第一批游客需要看到农场评价达到 ${TOURISM_ORDER.scoreTarget}，并准备作物礼篮与加工试吃。奖励：${tourismRewardText()}。`;
  panel.append(note);

  const cropSection = document.createElement("section");
  cropSection.className = "shop-section";
  const cropTitle = document.createElement("h3");
  cropTitle.textContent = "提交作物礼篮";
  cropSection.append(cropTitle);
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const cropCount = state.inventory.crops[def.id] ?? 0;
    const remaining = TOURISM_ORDER.cropTarget - cropSubmitted;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${cropCount}`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("提交 1", complete || remaining <= 0 || cropCount <= 0, () => submitTourismCrop(def.id, 1), complete ? "订单已完成" : "库存不足"),
      createShopButton(
        "补足礼篮",
        complete || remaining <= 0 || cropCount <= 0,
        () => submitTourismCrop(def.id, Math.min(cropCount, remaining)),
        complete ? "订单已完成" : "库存不足",
      ),
    );
    row.append(actions);
    cropSection.append(row);
  }
  panel.append(cropSection);

  const goodSection = document.createElement("section");
  goodSection.className = "shop-section";
  const goodTitle = document.createElement("h3");
  goodTitle.textContent = "提交加工试吃";
  goodSection.append(goodTitle);
  for (const goodId of PROCESSED_GOOD_IDS) {
    const def = processedGoodDef(goodId);
    const goodCount = state.inventory.goods[def.id] ?? 0;
    const remaining = TOURISM_ORDER.goodTarget - goodSubmitted;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${goodCount} · 出货价 ${def.sellPrice}g`;
    row.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("提交 1", complete || remaining <= 0 || goodCount <= 0, () => submitTourismGood(def.id, 1), complete ? "订单已完成" : "库存不足"),
    );
    row.append(actions);
    goodSection.append(row);
  }
  panel.append(goodSection);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("游客服务亭", panel);
  updateAllHud();
  scheduleAutosave("查看游客服务");
  return true;
}

function submitTourismCrop(cropId, count) {
  if (state.story.tourismFirstOrderCompleted) return showTourismDialog("第一批游客订单已经完成。");
  const def = cropDef(cropId);
  const remaining = TOURISM_ORDER.cropTarget - tourismCropSubmittedCount();
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.crops[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showTourismDialog(message);
    return false;
  }
  state.inventory.crops[def.id] -= safeCount;
  state.story.tourismCropSubmitted = tourismCropSubmittedCount() + safeCount;
  const completionText = completeTourismOrder();
  const message = completionText || `提交 ${safeCount} 个${def.name}到游客礼篮。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(completionText ? "quest" : "ship");
  showTourismDialog(message);
  scheduleAutosave("游客订单提交");
  return true;
}

function submitTourismGood(goodId, count) {
  if (state.story.tourismFirstOrderCompleted) return showTourismDialog("第一批游客订单已经完成。");
  const def = processedGoodDef(goodId);
  const remaining = TOURISM_ORDER.goodTarget - tourismGoodSubmittedCount();
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.goods[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showTourismDialog(message);
    return false;
  }
  state.inventory.goods[def.id] -= safeCount;
  state.story.tourismGoodSubmitted = tourismGoodSubmittedCount() + safeCount;
  const completionText = completeTourismOrder();
  const message = completionText || `提交 ${safeCount} 个${def.name}到游客试吃。`;
  updateAllHud();
  addLog(message.split("\n")[0]);
  playSound(completionText ? "quest" : "ship");
  showTourismDialog(message);
  scheduleAutosave("游客订单提交");
  return true;
}

function showBrandDialog(message = "") {
  if (!state.story.brandRepaired) {
    showDialog("品牌包装旧台", featureRequirementText("brand"));
    return false;
  }

  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const rawCropCount = totalCropCount(state.inventory.crops);
  const inputGoodCount = totalBrandInputGoodCount();
  const brandCount = state.inventory.goods[BRAND_PACK_GOOD_ID] ?? 0;
  const pendingBrandCount = state.inventory.shippedGoods[BRAND_PACK_GOOD_ID] ?? 0;
  const canMake = CROP_IDS.some((cropId) => (state.inventory.crops[cropId] ?? 0) >= BRAND_PACKAGING.cropInputCount) && inputGoodCount >= BRAND_PACKAGING.goodInputCount;

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>原料作物 <strong>${rawCropCount}</strong></span>
    <span>普通加工品 <strong>${inputGoodCount}</strong></span>
    <span>礼盒库存 <strong>${brandCount}</strong></span>
    <span>待出货 <strong>${pendingBrandCount}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = state.story.brandFirstShipmentSettled
    ? "第一批品牌礼盒已经完成出货。后续可以把品牌包装接到复购、展会和更高单价订单。"
    : `每个${processedGoodDef(BRAND_PACK_GOOD_ID).name}需要 ${BRAND_PACKAGING.cropInputCount} 个任意作物和 ${BRAND_PACKAGING.goodInputCount} 个普通加工品，出货价 ${processedGoodDef(BRAND_PACK_GOOD_ID).sellPrice}g。首次出货结算奖励：${brandRewardText()}。`;
  panel.append(note);

  const makeSection = document.createElement("section");
  makeSection.className = "shop-section";
  const makeTitle = document.createElement("h3");
  makeTitle.textContent = "制作品牌礼盒";
  makeSection.append(makeTitle);

  const row = document.createElement("div");
  row.className = "shop-row";
  const selectors = document.createElement("div");
  selectors.className = "field-grid";

  const cropLabel = document.createElement("label");
  const cropText = document.createElement("span");
  cropText.textContent = "作物原料";
  const cropSelect = document.createElement("select");
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const count = state.inventory.crops[def.id] ?? 0;
    const option = document.createElement("option");
    option.value = def.id;
    option.textContent = `${def.name} (${count})`;
    option.disabled = count < BRAND_PACKAGING.cropInputCount;
    cropSelect.append(option);
  }
  const firstAvailableCropOption = Array.from(cropSelect.options).find((option) => !option.disabled);
  if (firstAvailableCropOption) cropSelect.value = firstAvailableCropOption.value;
  cropLabel.append(cropText, cropSelect);

  const goodLabel = document.createElement("label");
  const goodText = document.createElement("span");
  goodText.textContent = "加工内芯";
  const goodSelect = document.createElement("select");
  for (const goodId of brandInputGoodIds()) {
    const def = processedGoodDef(goodId);
    const count = state.inventory.goods[def.id] ?? 0;
    const option = document.createElement("option");
    option.value = def.id;
    option.textContent = `${def.name} (${count})`;
    option.disabled = count < BRAND_PACKAGING.goodInputCount;
    goodSelect.append(option);
  }
  const firstAvailableGoodOption = Array.from(goodSelect.options).find((option) => !option.disabled);
  if (firstAvailableGoodOption) goodSelect.value = firstAvailableGoodOption.value;
  goodLabel.append(goodText, goodSelect);
  selectors.append(cropLabel, goodLabel);
  row.append(selectors);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(
    createShopButton(
      "包装 1 个礼盒",
      !canMake,
      () => createBrandPack(cropSelect.value, goodSelect.value),
      rawCropCount < BRAND_PACKAGING.cropInputCount ? "作物不足" : "普通加工品不足",
    ),
    createShopButton("投入出货箱 1", brandCount <= 0, () => shipGoods(BRAND_PACK_GOOD_ID, 1), "礼盒库存不足"),
    createShopButton("投入全部礼盒", brandCount <= 0, () => shipAllGoods(BRAND_PACK_GOOD_ID), "礼盒库存不足"),
  );
  row.append(actions);
  makeSection.append(row);
  panel.append(makeSection);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("品牌包装台", panel);
  updateAllHud();
  scheduleAutosave("查看品牌包装台");
  return true;
}

function createBrandPack(cropId, goodId) {
  if (!state.story.brandRepaired) return showBrandDialog("品牌包装台还没有修复。");
  const crop = cropDef(cropId);
  const good = processedGoodDef(goodId);
  if (good.id === BRAND_PACK_GOOD_ID || !brandInputGoodIds().includes(good.id)) {
    const message = "品牌礼盒需要普通加工品作为内芯。";
    addLog(message);
    playSound("error");
    showBrandDialog(message);
    return false;
  }
  if ((state.inventory.crops[crop.id] ?? 0) < BRAND_PACKAGING.cropInputCount) {
    const message = `${crop.name}不足，需要 ${BRAND_PACKAGING.cropInputCount} 个。`;
    addLog(message);
    playSound("error");
    showBrandDialog(message);
    return false;
  }
  if ((state.inventory.goods[good.id] ?? 0) < BRAND_PACKAGING.goodInputCount) {
    const message = `${good.name}不足，需要 ${BRAND_PACKAGING.goodInputCount} 个。`;
    addLog(message);
    playSound("error");
    showBrandDialog(message);
    return false;
  }

  state.inventory.crops[crop.id] -= BRAND_PACKAGING.cropInputCount;
  state.inventory.goods[good.id] -= BRAND_PACKAGING.goodInputCount;
  addGoodCount(BRAND_PACK_GOOD_ID, 1);
  state.story.brandFirstPackCreated = true;
  updateAllHud();
  const message = `制作 1 个${processedGoodDef(BRAND_PACK_GOOD_ID).name}：消耗 ${BRAND_PACKAGING.cropInputCount} 个${crop.name}和 ${BRAND_PACKAGING.goodInputCount} 个${good.name}。`;
  addLog(message);
  addVisualEffect(playerTile(), "quest", { color: "#d8c17a", duration: 900 });
  playSound("quest");
  showBrandDialog(message);
  scheduleAutosave("制作品牌礼盒");
  return true;
}

function showIrrigationDialog(message = "") {
  if (!state.story.irrigationRepaired) {
    showDialog("旧水泵", featureRequirementText("irrigation"));
    return false;
  }

  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const projectDone = state.story.irrigationFirstProjectCompleted;
  const zone = IRRIGATION_PROJECT.zone;
  const zoneCropCount = state.dynamicObjects.filter((obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj)).length;
  const zoneWateredCount = state.dynamicObjects.filter(
    (obj) => isCropOnMap(obj, CROP_MAP_ID) && irrigationZoneContains(obj) && obj.watered && !obj.ready,
  ).length;
  const capacity = wateringCanCapacityForStory();

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>工程 <strong>${projectDone ? "已完成" : "待启动"}</strong></span>
    <span>水壶 <strong>${state.wateringCanWater}/${capacity}</strong></span>
    <span>灌溉区 <strong>${zoneCropCount} 株</strong></span>
    <span>已浇水 <strong>${zoneWateredCount}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = projectDone
    ? `第一段水渠覆盖农田核心区域（${zone.x},${zone.y} 起 ${zone.w}x${zone.h}）。每天睡觉后，未浇水且未成熟的覆盖区作物会自动浇水。`
    : `启动第一段水渠需要 ${IRRIGATION_PROJECT.costGold}g。完成后${irrigationRewardText()}，并每天自动浇灌农田核心区域。`;
  panel.append(note);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(
    createShopButton(
      "启动水渠工程",
      projectDone || state.inventory.gold < IRRIGATION_PROJECT.costGold,
      () => completeIrrigationProject(),
      projectDone ? "工程已完成" : `需要 ${IRRIGATION_PROJECT.costGold}g`,
    ),
    createShopButton(
      "补满水壶",
      state.wateringCanWater >= capacity,
      () => refillWateringCan({ type: "irrigationPump", label: "水利水泵", tile: { x: 22, y: 22 } }),
      "水壶已满",
    ),
  );
  panel.append(actions);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("水利水泵", panel);
  updateAllHud();
  scheduleAutosave("查看水利水泵");
  return true;
}

function submitCommunityOrderCrop(orderId, cropId, count) {
  const order = COMMUNITY_ORDERS[orderId];
  const def = cropDef(cropId);
  if (!order) return false;
  if (communityOrderComplete(order)) {
    showCommunityOrderDialog({ type: order.objectType, name: order.title }, "这笔订单已经完成。");
    return false;
  }
  const remaining = order.target - communityOrderProgress(order);
  const safeCount = Math.min(Math.max(1, count), remaining);
  if ((state.inventory.crops[def.id] ?? 0) < safeCount) {
    const message = `${def.name}库存不足。`;
    addLog(message);
    playSound("error");
    showCommunityOrderDialog({ type: order.objectType, name: order.title }, message);
    return false;
  }

  state.inventory.crops[def.id] -= safeCount;
  state.story[order.progressKey] = communityOrderProgress(order) + safeCount;
  let message = `提交 ${safeCount} 个${def.name}到${order.title}。`;
  const rewardText = grantCommunityOrderReward(order);
  if (rewardText) message = `${message} ${rewardText}`;
  const completionText = completeCommunityOrders();
  if (completionText) message = `${message} ${completionText}`;
  updateAllHud();
  addLog(message);
  addVisualEffect(playerTile(), "quest", { color: "#70b77e", duration: 900 });
  playSound("ship");
  if (completionText) showDialog("集市稳定运行", completionText);
  else showCommunityOrderDialog({ type: order.objectType, name: order.title }, message);
  scheduleAutosave("社区订单");
  return true;
}

function buySeeds(cropId, count) {
  const def = cropDef(cropId);
  if (!isCropUnlocked(def.id)) {
    const message = `${def.seedName} 要到第 ${def.unlockDay} 天才会出售。`;
    addLog(message);
    playSound("error");
    showShopDialog(message);
    return false;
  }
  if (!isCropInSeason(def.id)) {
    const message = `${def.seedName}不是${seasonInfoForDay().label}商品，适合季节：${cropSeasonText(def.id)}。`;
    addLog(message);
    playSound("error");
    showShopDialog(message);
    return false;
  }
  const cost = count * seedUnitPrice(def.id);
  if (state.inventory.gold < cost) {
    const message = `金币不足，需要 ${cost}g。`;
    addLog(message);
    playSound("error");
    showShopDialog(message);
    return false;
  }
  state.inventory.gold -= cost;
  addSeedCount(def.id, count);
  advanceQuests("purchase", count);
  updateAllHud();
  const discountText = shopDiscountForDay() < 1 ? `（${calendarEventForDay().title}折扣）` : "";
  const message = `购买 ${count} 个${def.seedName}，花费 ${cost}g${discountText}。`;
  addLog(message);
  playSound("coin");
  showShopDialog(message);
  scheduleAutosave("购买种子");
  return true;
}

function sellCrops(cropId, count) {
  const def = cropDef(cropId);
  if ((state.inventory.crops[def.id] ?? 0) < count) {
    const message = "作物不足，不能出售。";
    addLog(message);
    playSound("error");
    showShopDialog(message);
    return false;
  }
  const income = effectiveSaleIncome(count * def.sellPrice);
  state.inventory.crops[def.id] -= count;
  state.inventory.gold += income;
  updateAllHud();
  const reserveWarning = springSampleReserveWarning(def.id);
  const message = `出售 ${count} 个${def.name}，获得 ${income}g。${reserveWarning ? ` ${reserveWarning}` : ""}`;
  addLog(message);
  playSound("coin");
  showShopDialog(message);
  scheduleAutosave("出售作物");
  return true;
}

function sellAllCrops(cropId) {
  const def = cropDef(cropId);
  const count = state.inventory.crops[def.id] ?? 0;
  if (count <= 0) return sellCrops(def.id, 1);
  return sellCrops(def.id, count);
}

function sellGoods(goodId, count) {
  const def = processedGoodDef(goodId);
  if ((state.inventory.goods[def.id] ?? 0) < count) {
    const message = "加工品不足，不能出售。";
    addLog(message);
    playSound("error");
    showShopDialog(message);
    return false;
  }
  const income = effectiveSaleIncome(count * def.sellPrice);
  state.inventory.goods[def.id] -= count;
  state.inventory.gold += income;
  updateAllHud();
  const message = `出售 ${count} 个${def.name}，获得 ${income}g。`;
  addLog(message);
  playSound("coin");
  showShopDialog(message);
  scheduleAutosave("出售加工品");
  return true;
}

function sellAllGoods(goodId) {
  const def = processedGoodDef(goodId);
  const count = state.inventory.goods[def.id] ?? 0;
  if (count <= 0) return sellGoods(def.id, 1);
  return sellGoods(def.id, count);
}

function showProcessingDialog(message = "") {
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const recipeIds = recipeIdsForStation("kitchen");

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>作物 <strong>${totalCropCount(state.inventory.crops)}</strong></span>
    <span>加工品 <strong>${totalGoodCount(state.inventory.goods)}</strong></span>
    <span>入口 <strong>厨房</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = "加工会消耗作物，产出更高价值的成品；成品可投入出货箱隔夜结算。";
  panel.append(intro);

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "加工配方";
  section.append(title);

  for (const recipeId of recipeIds) {
    const recipe = processedGoodDef(recipeId);
    const inputCount = state.inventory.crops[recipe.inputCropId] ?? 0;
    const outputCount = state.inventory.goods[recipe.id] ?? 0;
    const maxCraft = Math.floor(inputCount / recipe.inputCount);
    const row = document.createElement("div");
    row.className = "shop-row";
    if (maxCraft <= 0) row.classList.add("is-locked");

    const info = document.createElement("span");
    info.textContent = `${recipe.name} · 消耗 ${recipe.inputCount} ${cropDef(recipe.inputCropId).name} · 出货价 ${recipe.sellPrice}g · 已有 ${outputCount}`;
    row.append(info);

    const description = document.createElement("small");
    description.textContent = recipe.description;
    row.append(description);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("制作 1", maxCraft <= 0, () => processRecipe(recipe.id, 1), "材料不足"),
      createShopButton("制作全部", maxCraft <= 0, () => processRecipe(recipe.id, maxCraft), "材料不足"),
    );
    row.append(actions);
    section.append(row);
  }
  panel.append(section);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("厨房加工台", panel);
}

function processRecipe(recipeId, count) {
  const recipe = processedGoodDef(recipeId);
  const safeCount = Math.max(1, Math.floor(count));
  const required = recipe.inputCount * safeCount;
  if ((state.inventory.crops[recipe.inputCropId] ?? 0) < required) {
    const message = `${cropDef(recipe.inputCropId).name}不足，需要 ${required} 个。`;
    addLog(message);
    playSound("error");
    showProcessingDialog(message);
    return false;
  }
  state.inventory.crops[recipe.inputCropId] -= required;
  addGoodCount(recipe.id, safeCount);
  state.story.firstMachineStarted = true;
  state.story.firstProcessedGoodCollected = true;
  updateAllHud();
  const message = `制作 ${safeCount} 个${recipe.name}，消耗 ${required} 个${cropDef(recipe.inputCropId).name}。`;
  addLog(message);
  addVisualEffect(playerTile(), "harvest", { color: "#e7b34d" });
  playSound("coin");
  showProcessingDialog(message);
  scheduleAutosave("加工制作");
  return true;
}

function showProcessorDialog(object, message = "") {
  const machine = machineStateForObject(object);
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const stationId = stationIdForObject(object);
  const stationName = stationNameForObject(object);
  const stationVerb = stationVerbForObject(object);
  const recipeIds = recipeIdsForStation(stationId);

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>状态 <strong>${machineStatusText(machine)}</strong></span>
    <span>作物 <strong>${totalCropCount(state.inventory.crops)}</strong></span>
    <span>成品 <strong>${totalGoodCount(state.inventory.goods)}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = `${stationName}会占用一天：今天投入材料，睡觉后完成，第二天回来领取成品。`;
  panel.append(intro);

  if (machine.readyGoodId) {
    const ready = processedGoodDef(machine.readyGoodId);
    const readyRow = document.createElement("div");
    readyRow.className = "shop-row is-complete";
    const info = document.createElement("span");
    info.textContent = `${ready.name} 已完成 · 出货价 ${ready.sellPrice}g`;
    readyRow.append(info);
    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(createShopButton("领取", false, () => collectMachineOutput(object)));
    readyRow.append(actions);
    panel.append(readyRow);
  } else if (machine.recipeId) {
    const current = processedGoodDef(machine.recipeId);
    const working = document.createElement("p");
    working.textContent = `${current.name}正在加工中，还需要 ${machine.remainingDays} 天。`;
    panel.append(working);
  } else {
    const section = document.createElement("section");
    section.className = "shop-section";
    const title = document.createElement("h3");
    title.textContent = `选择${stationVerb}`;
    section.append(title);

    for (const recipeId of recipeIds) {
      const recipe = processedGoodDef(recipeId);
      const inputCount = state.inventory.crops[recipe.inputCropId] ?? 0;
      const canStart = inputCount >= recipe.inputCount;
      const row = document.createElement("div");
      row.className = "shop-row";
      if (!canStart) row.classList.add("is-locked");

      const info = document.createElement("span");
      info.textContent = `${recipe.name} · 消耗 ${recipe.inputCount} ${cropDef(recipe.inputCropId).name} · 拥有 ${inputCount} · 出货价 ${recipe.sellPrice}g`;
      row.append(info);

      const description = document.createElement("small");
      description.textContent = `${recipe.description} ${stationName}需要隔夜完成。`;
      row.append(description);

      const actions = document.createElement("div");
      actions.className = "shop-actions";
      actions.append(createShopButton("开始加工", !canStart, () => startMachineProcessing(object, recipe.id), "材料不足"));
      row.append(actions);
      section.append(row);
    }
    panel.append(section);
  }

  appendBuildableManagement(panel, object, machine);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(stationName, panel);
}

function buildableItemIdForObject(object) {
  if (object?.buildItemId && BUILDABLE_ITEMS[object.buildItemId]) return object.buildItemId;
  return BUILDABLE_IDS.find((itemId) => buildableDef(itemId).objectType === object?.type) ?? null;
}

function isMachineBuildableObject(object) {
  const itemId = buildableItemIdForObject(object);
  return Boolean(itemId && buildableDef(itemId).machine);
}

function isPlacedBuildableObject(object) {
  const itemId = buildableItemIdForObject(object);
  return Boolean(
    itemId &&
      ((typeof object.placedId === "string" && object.placedId.includes(":placed:")) ||
        (typeof object.machineId === "string" && object.machineId.includes(":placed:"))),
  );
}

function buildableObjectName(object) {
  const itemId = buildableItemIdForObject(object);
  return object?.name ?? (itemId ? buildableDef(itemId).name : object?.type ?? "对象");
}

function recoverBlockedReason(object, machine = null) {
  if (!isPlacedBuildableObject(object)) return "固定对象不能回收。";
  if (!isMachineBuildableObject(object)) return "";
  const machineState = machine ?? machineStateForObject(object);
  if (machineState.readyGoodId) return "先领取成品，再移动设施。";
  if (machineState.recipeId) return "加工中不能移动。";
  return "";
}

function sameBuildableObject(item, object, mapId) {
  if (!objectBelongsToMap(item, mapId)) return false;
  return item === object || (object.machineId && item.machineId === object.machineId) || (object.placedId && item.placedId === object.placedId);
}

function resolveBuildableObjectLocation(object, preferredMapId = state.mapId) {
  const preferredMap = maps[preferredMapId];
  if (preferredMap) {
    const match = preferredMap.objects.find((item) => sameBuildableObject(item, object, preferredMapId));
    if (match) return { mapId: preferredMapId, map: preferredMap, object: match };
  }

  for (const [mapId, map] of Object.entries(maps)) {
    const match = map.objects.find((item) => sameBuildableObject(item, object, mapId));
    if (match) return { mapId, map, object: match };
  }

  return null;
}

function appendBuildableManagement(panel, object, machine = null) {
  const itemId = buildableItemIdForObject(object);
  const displayName = buildableObjectName(object);
  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "建造管理";
  section.append(title);

  const row = document.createElement("div");
  row.className = "shop-row";
  if (!isPlacedBuildableObject(object)) row.classList.add("is-locked");
  const info = document.createElement("span");
  const blockedReason = recoverBlockedReason(object, machine);
  info.textContent = isPlacedBuildableObject(object)
    ? blockedReason || `${displayName}可以回收到建造库存，也可以直接进入移动放置。`
    : `${displayName}是固定对象，不能回收到建造库存。`;
  row.append(info);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  const disabled = Boolean(blockedReason);
  actions.append(
    createShopButton("回收", disabled, () => recoverBuildableObject(object), blockedReason || "回收到库存"),
    createShopButton("移动", disabled, () => recoverBuildableObject(object, { startPlacement: true }), blockedReason || "回收并进入放置模式"),
  );
  row.append(actions);
  section.append(row);
  panel.append(section);

  if (itemId && !isPlacedBuildableObject(object)) {
    const note = document.createElement("small");
    note.textContent = `通过建造商店购买的${buildableDef(itemId).name}可以回收；地图固定对象只用于场景。`;
    section.append(note);
  }
}

function buildableObjectEffectText(object, def) {
  if (object.type === "bench") return `长椅可以休息 ${BENCH_REST_MINUTES} 分钟，恢复最多 ${BENCH_REST_ENERGY} 点体力，同时计入农场评价的装饰分。`;
  if (object.type === "gardenLamp") return isLampLitTime()
    ? "小路灯已点亮，夜间会在地图上显示暖色光晕，并计入农场评价。"
    : "小路灯会在 18:00 后自动变亮，也会提高农场评价的装饰分。";
  if (object.type === "flowerBox") return `${seasonLabel(currentSeasonId())}花箱会跟随季节切换花色，用来标记农场装饰区，并提高农场评价。`;
  if (object.type === "fence") return "篱笆是可摆放装饰，用来划分农田边界，不会阻挡玩家移动，并计入装饰分。";
  if (def?.category === "decorations") return "装饰用于布置农场，不阻挡玩家移动，并计入农场评价。";
  return "这个建造对象可以管理放置状态。";
}

function restAtBench(object) {
  if (state.energy >= maxEnergy()) {
    const message = "体力已经满了，不需要休息。";
    addLog(message);
    addToolFeedback({ x: object.x, y: object.y }, "体力已满", "info");
    showBuildableObjectDialog(object, message);
    return false;
  }

  const beforeEnergy = state.energy;
  state.energy = Math.min(maxEnergy(), state.energy + BENCH_REST_ENERGY);
  state.timeMinutes += BENCH_REST_MINUTES;
  const restored = state.energy - beforeEnergy;
  const message = `坐在长椅上休息 ${BENCH_REST_MINUTES} 分钟，恢复 ${restored} 点体力。`;
  updateAllHud();
  addLog(message);
  if (state.timeMinutes >= 24 * 60) addLog("已经很晚了，该睡觉了。");
  addToolFeedback({ x: object.x, y: object.y }, `+${restored} 体力`, "good");
  addVisualEffect({ x: object.x, y: object.y }, "quest", { color: "#70b77e", duration: 900 });
  playSound("sleep");
  scheduleAutosave("长椅休息");
  showBuildableObjectDialog(object, message);
  return true;
}

function appendDecorationAction(panel, object) {
  if (object.type !== "bench") return;

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "装饰功能";
  section.append(title);

  const row = document.createElement("div");
  row.className = "shop-row";
  const info = document.createElement("span");
  info.textContent = `恢复最多 ${BENCH_REST_ENERGY} 点体力，消耗 ${BENCH_REST_MINUTES} 分钟。`;
  row.append(info);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(createShopButton("休息", state.energy >= maxEnergy(), () => restAtBench(object), "体力已满"));
  row.append(actions);
  section.append(row);
  panel.append(section);
}

function showBuildableObjectDialog(object, message = "") {
  const itemId = buildableItemIdForObject(object);
  const def = itemId ? buildableDef(itemId) : null;
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>类型 <strong>${def ? buildableGroupLabel(def.id) : "对象"}</strong></span>
    <span>位置 <strong>${object.x},${object.y}</strong></span>
    <span>库存 <strong>${def ? state.build.inventory[def.id] ?? 0 : 0}</strong></span>
  `;
  panel.append(stats);

  const intro = document.createElement("p");
  intro.textContent = buildableObjectEffectText(object, def);
  panel.append(intro);

  appendDecorationAction(panel, object);
  appendBuildableManagement(panel, object);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(buildableObjectName(object), panel);
}

function recoverBuildableObject(object, options = {}) {
  const location = resolveBuildableObjectLocation(object, options.mapId);
  const targetObject = location?.object ?? object;
  const itemId = buildableItemIdForObject(targetObject);
  const machine = isMachineBuildableObject(targetObject) ? machineStateForObject(targetObject) : null;
  const blockedReason = recoverBlockedReason(targetObject, machine);
  if (!itemId || blockedReason) {
    const message = blockedReason || "这个对象不能回收。";
    addLog(message);
    playSound("error");
    if (isMachineBuildableObject(targetObject)) showProcessorDialog(targetObject, message);
    else showBuildableObjectDialog(targetObject, message);
    return false;
  }

  if (!location) {
    const message = "这个对象已经不在地图上。";
    addLog(message);
    playSound("error");
    showDialog("建造管理", message);
    updateAllHud();
    return false;
  }

  if (options.startPlacement && editor.enabled) setEditorEnabled(false);
  const machineId = isMachineBuildableObject(targetObject) ? machineIdForObject(targetObject) : null;
  const map = location.map;
  map.objects = map.objects.filter((item) => {
    if (item === targetObject) return false;
    if (machineId && item.machineId === machineId) return false;
    if (!machineId && targetObject.placedId && item.placedId === targetObject.placedId) return false;
    return true;
  });
  if (machineId) delete state.machines[machineId];
  if (options.startPlacement && location.mapId !== state.mapId) state.mapId = location.mapId;
  state.build.inventory[itemId] = (state.build.inventory[itemId] ?? 0) + 1;
  state.build.selectedItem = itemId;
  state.build.placing = options.startPlacement === true;
  state.build.hoverTile = null;
  if (options.startPlacement) {
    const focus = findBuildableFocusPosition(map, targetObject);
    if (focus) {
      state.player.x = focus.position.x;
      state.player.y = focus.position.y;
      faceTile({ x: targetObject.x, y: targetObject.y });
    }
  }
  updateAllHud();
  syncEditorControls();
  const def = buildableDef(itemId);
  const message = options.startPlacement
    ? `已回收${def.name}，进入放置模式。`
    : `已回收${def.name}到建造库存。`;
  addLog(message);
  if (location.mapId === state.mapId) {
    addToolFeedback({ x: targetObject.x, y: targetObject.y }, "回收", "good");
    addVisualEffect({ x: targetObject.x, y: targetObject.y }, "harvest", { color: "#c08a4a" });
  }
  playSound("ship");
  if (options.startPlacement) closeDialog();
  else showDialog("建造管理", message);
  scheduleAutosave(options.startPlacement ? `移动${buildableGroupLabel(itemId)}` : `回收${buildableGroupLabel(itemId)}`);
  return true;
}

function appendProcessorManagement(panel, object, machine) {
  appendBuildableManagement(panel, object, machine);
}

function startMachineProcessing(object, recipeId) {
  const machine = machineStateForObject(object);
  if (machine.recipeId || machine.readyGoodId) {
    const message = `这台${stationNameForObject(object)}还没有空出来。`;
    addLog(message);
    playSound("error");
    showProcessorDialog(object, message);
    return false;
  }

  const recipe = processedGoodDef(recipeId);
  if ((state.inventory.crops[recipe.inputCropId] ?? 0) < recipe.inputCount) {
    const message = `${cropDef(recipe.inputCropId).name}不足，需要 ${recipe.inputCount} 个。`;
    addLog(message);
    playSound("error");
    showProcessorDialog(object, message);
    return false;
  }

  state.inventory.crops[recipe.inputCropId] -= recipe.inputCount;
  machine.recipeId = recipe.id;
  machine.readyGoodId = null;
  machine.remainingDays = MACHINE_PROCESSING_DAYS;
  state.story.firstMachineStarted = true;
  updateAllHud();
  const message = `开始${stationVerbForObject(object)}${recipe.name}，明天可以领取。`;
  addLog(message);
  addVisualEffect({ x: object.x, y: object.y }, "harvest", { color: "#d98777" });
  playSound("select");
  showProcessorDialog(object, message);
  scheduleAutosave("开始设施加工");
  return true;
}

function collectMachineOutput(object) {
  const machine = machineStateForObject(object);
  if (!machine.readyGoodId) {
    const message = machine.recipeId ? "还在加工中，明天再来。" : `${stationNameForObject(object)}里没有成品。`;
    addLog(message);
    playSound("error");
    showProcessorDialog(object, message);
    return false;
  }

  const good = processedGoodDef(machine.readyGoodId);
  addGoodCount(good.id, 1);
  machine.readyGoodId = null;
  machine.remainingDays = 0;
  state.story.firstProcessedGoodCollected = true;
  updateAllHud();
  const message = `领取 1 个${good.name}。`;
  addLog(message);
  addVisualEffect({ x: object.x, y: object.y }, "harvest", { color: "#e7b34d" });
  playSound("coin");
  showProcessorDialog(object, message);
  scheduleAutosave("领取加工品");
  return true;
}

function renderBuildShopTabs(panel, activeTab) {
  const tabs = document.createElement("div");
  tabs.className = "shop-tabs";
  for (const [tabId, label] of [
    ["upgrades", "扩建"],
    ["facilities", "设施"],
    ["decorations", "装饰"],
  ]) {
    const count =
      tabId === "upgrades"
        ? `${UPGRADE_IDS.filter((upgradeId) => state.upgrades[upgradeId]).length}/${UPGRADE_IDS.length}`
        : totalBuildableInventory(tabId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shop-tab";
    button.classList.toggle("is-active", activeTab === tabId);
    button.textContent = `${label} ${count}`;
    button.addEventListener("click", () => {
      buildShop.tab = tabId;
      showUpgradeDialog("", tabId);
    });
    tabs.append(button);
  }
  panel.append(tabs);
}

function renderUpgradeShopSection(panel) {
  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "农场扩建";
  section.append(title);

  for (const upgradeId of UPGRADE_IDS) {
    const upgrade = FARM_UPGRADES[upgradeId];
    const done = state.upgrades[upgradeId];
    const row = document.createElement("div");
    row.className = "shop-row";
    if (done) row.classList.add("is-complete");

    const info = document.createElement("span");
    info.textContent = `${upgrade.name} · ${done ? "已完成" : `${upgrade.cost}g`} · ${upgrade.description}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton(
        done ? "已购买" : "购买",
        done || state.inventory.gold < upgrade.cost,
        () => buyUpgrade(upgradeId),
        done ? "已经完成" : "金币不足",
      ),
    );
    row.append(actions);
    section.append(row);
  }
  panel.append(section);
}

function renderBuildableShopSection(panel, category) {
  const buildSection = document.createElement("section");
  buildSection.className = "shop-section";
  const buildTitle = document.createElement("h3");
  buildTitle.textContent = category === "decorations" ? "农场装饰" : "可摆放设施";
  buildSection.append(buildTitle);

  const summary = document.createElement("p");
  summary.textContent = `本类库存：${buildableCategorySummary(category)}`;
  buildSection.append(summary);

  for (const itemId of buildableIdsForCategory(category)) {
    const def = buildableDef(itemId);
    const owned = state.build.inventory[def.id] ?? 0;
    const price = buildableEffectivePrice(def);
    const row = document.createElement("div");
    row.className = "shop-row";

    const info = document.createElement("span");
    info.textContent = `${def.name} · ${price}g${price < def.price ? `（工坊折扣，原价 ${def.price}g）` : ""} · 库存 ${owned} · ${def.description}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    const buyOneCost = price;
    const buyFiveCost = price * 5;
    actions.append(
      createShopButton(`买 1 (${buyOneCost}g)`, state.inventory.gold < buyOneCost, () => buyBuildable(def.id, 1), "金币不足"),
      createShopButton(`买 5 (${buyFiveCost}g)`, state.inventory.gold < buyFiveCost, () => buyBuildable(def.id, 5), "金币不足"),
    );
    row.append(actions);
    buildSection.append(row);
  }
  panel.append(buildSection);
}

function showUpgradeDialog(message = "", tab = buildShop.tab) {
  buildShop.tab = ["facilities", "decorations"].includes(tab) ? tab : "upgrades";
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const purchased = UPGRADE_IDS.filter((upgradeId) => state.upgrades[upgradeId]).length;
  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
    <span>已完成 <strong>${purchased}/${UPGRADE_IDS.length}</strong></span>
    <span>设施库存 <strong>${totalBuildableInventory("facilities")}</strong></span>
    <span>装饰库存 <strong>${totalBuildableInventory("decorations")}</strong></span>
  `;
  panel.append(stats);

  renderBuildShopTabs(panel, buildShop.tab);

  const intro = document.createElement("p");
  if (buildShop.tab === "upgrades") {
    intro.textContent = "扩建会修改固定地图位置，购买后立即生效，并随存档保存。";
  } else if (buildShop.tab === "decorations") {
    intro.textContent = "装饰会进入建造库存，开启放置模式后点击农场空格摆放；装饰不阻挡移动。";
  } else {
    intro.textContent = "设施会进入建造库存，按 B 开启放置模式后点击农场空格摆放。";
  }
  panel.append(intro);

  if (buildShop.tab === "upgrades") renderUpgradeShopSection(panel);
  else renderBuildableShopSection(panel, buildShop.tab);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("建造商店", panel);
}

function openBuildShopFromHud() {
  if (!featureUnlocked("construction")) {
    showDialog("建造商店未开放", featureRequirementText("construction"));
    addLog(`建造商店暂未开放：${featureRequirementText("construction")}`);
    playSound("error");
    return;
  }
  if (state.build.placing) setBuildPlacement(false);
  keys.clear();
  showUpgradeDialog("", buildShop.tab);
  addLog("从建造卡打开建造商店。");
}

function buyUpgrade(upgradeId) {
  const upgrade = FARM_UPGRADES[upgradeId];
  if (!upgrade) return false;
  if (!featureUnlocked("construction")) {
    const message = featureRequirementText("construction");
    addLog(`扩建暂未开放：${message}`);
    playSound("error");
    showDialog("扩建未开放", message);
    return false;
  }
  if (state.upgrades[upgradeId]) {
    const message = `${upgrade.name}已经完成。`;
    playSound("error");
    showUpgradeDialog(message);
    return false;
  }
  if (state.inventory.gold < upgrade.cost) {
    const message = `金币不足，需要 ${upgrade.cost}g。`;
    addLog(message);
    playSound("error");
    showUpgradeDialog(message);
    return false;
  }
  state.inventory.gold -= upgrade.cost;
  state.upgrades[upgradeId] = true;
  upgrade.apply(maps.farm);
  updateAllHud();
  const message = `完成扩建：${upgrade.name}，花费 ${upgrade.cost}g。`;
  addLog(message);
  addScreenEffect("quest", upgrade.name);
  playSound("quest");
  showUpgradeDialog(message, "upgrades");
  scheduleAutosave("购买扩建");
  return true;
}

function buyBuildable(itemId, count = 1, options = {}) {
  const def = buildableDef(itemId);
  const safeCount = Math.max(1, Math.floor(Number(count) || 1));
  const cost = buildableEffectivePrice(def) * safeCount;
  const openShop = options.openShop !== false;
  if (!featureUnlocked("construction")) {
    const message = featureRequirementText("construction");
    addLog(`建造暂未开放：${message}`);
    playSound("error");
    if (openShop) showDialog("建造未开放", message);
    else updateAllHud();
    return false;
  }
  if (state.inventory.gold < cost) {
    const message = `金币不足，需要 ${cost}g。`;
    addLog(message);
    playSound("error");
    if (openShop) showUpgradeDialog(message, buildableShopTabForItem(def.id));
    else updateAllHud();
    return false;
  }
  state.inventory.gold -= cost;
  state.build.inventory[def.id] = (state.build.inventory[def.id] ?? 0) + safeCount;
  updateAllHud();
  const message = `购买 ${safeCount} 个${def.name}，花费 ${cost}g。可在建造卡开启放置模式后点击农场空格放下。`;
  addLog(message);
  playSound("coin");
  if (openShop) showUpgradeDialog(message, buildableShopTabForItem(def.id));
  scheduleAutosave(`购买${buildableGroupLabel(def.id)}`);
  return true;
}

function buySelectedBuildable(count) {
  const success = buyBuildable(state.build.selectedItem, count, { openShop: false });
  if (success) updateCanvasCursor();
  return success;
}

function setBuildPlacement(enabled) {
  if (enabled && editor.enabled) {
    showDialog("建造", "先关闭编辑模式，再进入放置模式。");
    addLog("编辑模式下不能进入建造放置。");
    return false;
  }
  if (enabled && !canBuildOnCurrentMap()) {
    showDialog("建造", "当前地图不能建造。请回到农场空地放置设施或装饰。");
    addLog("建造放置只能在农场进行。");
    playSound("error");
    return false;
  }
  if (enabled && (state.build.inventory[state.build.selectedItem] ?? 0) <= 0) {
    const def = buildableDef(state.build.selectedItem);
    showDialog("建造", `没有可放置的${def.name}。可以在扩建公告牌购买。`);
    addLog(`${def.name}库存不足，不能进入放置模式。`);
    playSound("error");
    return false;
  }
  state.build.placing = enabled;
  state.build.hoverTile = null;
  if (enabled && buildOverlayOpen) setBuildOverlayVisible(false);
  keys.clear();
  canvas.focus();
  syncEditorControls();
  updateBuildHud();
  addLog(enabled ? "建造放置模式已开启，点击农场空格放下对象。" : "建造放置模式已关闭。");
  return true;
}

function toggleBuildPlacement() {
  return setBuildPlacement(!state.build.placing);
}

function selectBuildItem(itemId) {
  if (!BUILDABLE_ITEMS[itemId]) return;
  state.build.selectedItem = itemId;
  if (state.build.placing && (state.build.inventory[itemId] ?? 0) <= 0) state.build.placing = false;
  updateBuildHud();
  updateCanvasCursor();
  scheduleAutosave("建造选择");
}

function buildPlacementStatus(tile) {
  const def = buildableDef(state.build.selectedItem);
  const map = currentMap();
  if (!tile || !isTileInMap(tile, map)) return { ok: false, text: "超出地图" };
  if (!canBuildOnCurrentMap()) return { ok: false, text: "只能放在农场" };
  if ((state.build.inventory[def.id] ?? 0) <= 0) return { ok: false, text: `${def.name}不足` };
  if (objectAtTile(tile.x, tile.y)) return { ok: false, text: "已有对象" };
  if (cropAtTile(tile.x, tile.y)) return { ok: false, text: "已有作物" };
  if (npcAtTile(tile.x, tile.y)) return { ok: false, text: "NPC 占用" };
  const player = playerTile();
  if (player.x === tile.x && player.y === tile.y) return { ok: false, text: "玩家脚下" };
  if (map.spawn.x === tile.x && map.spawn.y === tile.y) return { ok: false, text: "出生点" };
  if (map.layers.collision[tile.y]?.[tile.x] === 1) return { ok: false, text: "被阻挡" };
  if (map.layers.ground[tile.y]?.[tile.x] === TILE.water) return { ok: false, text: "不能放水上" };
  const regionStatus = buildRegionPlacementStatus(def, tile);
  if (!regionStatus.ok) return regionStatus;
  return { ok: true, text: `放置${def.name}` };
}

function placeSelectedBuildable(tile) {
  const status = buildPlacementStatus(tile);
  const def = buildableDef(state.build.selectedItem);
  if (!status.ok) {
    addLog(`不能放置${def.name}：${status.text}。`);
    addToolFeedback(tile ?? playerTile(), status.text, "bad");
    return false;
  }

  const placedId = `${state.mapId}:placed:${def.id}:${state.build.nextId}`;
  state.build.nextId += 1;
  state.build.inventory[def.id] -= 1;
  const object = {
    type: def.objectType,
    x: tile.x,
    y: tile.y,
    name: def.name,
    buildItemId: def.id,
    placedId,
  };
  if (def.machine) {
    object.machineId = placedId;
    state.machines[placedId] = createMachineState(placedId);
  }
  currentMap().objects.push(object);
  if ((state.build.inventory[def.id] ?? 0) <= 0) state.build.placing = false;
  updateAllHud();
  updateCanvasCursor();
  addLog(`已放置${def.name}：${tile.x}, ${tile.y}`);
  addToolFeedback(tile, `放置${def.name}`, "good");
  addVisualEffect(tile, "harvest", { color: "#c08a4a" });
  playSound("quest");
  scheduleAutosave(`放置${buildableGroupLabel(def.id)}`);
  return true;
}

function buildPlacementHint() {
  const def = buildableDef(state.build.selectedItem);
  const inventory = state.build.inventory[def.id] ?? 0;
  const status = buildPlacementStatus(state.build.hoverTile);
  if (!state.build.hoverTile) return `建造：${def.name}库存 ${inventory} · 移动鼠标选择格子，点击放置，Esc 取消`;
  return status.ok ? `点击放置${def.name} · 库存 ${inventory}` : `不可放置${def.name}：${status.text}`;
}

function pendingShipmentCount() {
  return totalCropCount(state.inventory.shippedCrops) + totalGoodCount(state.inventory.shippedGoods) + totalFishCount(state.inventory.shippedFish);
}

function pendingShipmentOverviewText() {
  const parts = [];
  const crops = cropCountSummary(state.inventory.shippedCrops);
  const goods = goodsCountSummary(state.inventory.shippedGoods);
  const fish = fishCountSummary(state.inventory.shippedFish);
  if (crops !== "无") parts.push(`作物：${crops}`);
  if (goods !== "无") parts.push(`加工品：${goods}`);
  if (fish !== "无") parts.push(`水产：${fish}`);
  return parts.join("；") || "暂无待出货";
}

function withdrawAllShipments() {
  const pending = pendingShipmentCount();
  if (pending <= 0) {
    const message = "没有待出货物品可撤回。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  const cropCount = totalCropCount(state.inventory.shippedCrops);
  for (const cropId of CROP_IDS) {
    const count = state.inventory.shippedCrops[cropId] ?? 0;
    if (count > 0) {
      addCropCount(cropId, count);
      state.inventory.shippedCrops[cropId] = 0;
    }
  }
  for (const goodId of PROCESSED_GOOD_IDS) {
    const count = state.inventory.shippedGoods[goodId] ?? 0;
    if (count > 0) {
      addGoodCount(goodId, count);
      state.inventory.shippedGoods[goodId] = 0;
    }
  }
  for (const fishId of FISH_IDS) {
    const count = state.inventory.shippedFish[fishId] ?? 0;
    if (count > 0) {
      addFishCount(fishId, count);
      state.inventory.shippedFish[fishId] = 0;
    }
  }
  syncOrderProgressFromShipments();
  retractShipmentQuests(cropCount);
  updateAllHud();
  const message = `已撤回全部待出货物品，共 ${pending} 件。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("撤回全部出货");
  return true;
}

function showShippingDialog(message = "") {
  const panel = document.createElement("div");
  panel.className = "shop-panel";
  const estimatedIncome = shipmentIncomeValue(state.inventory.shippedCrops, state.inventory.shippedGoods, state.day, state.inventory.shippedFish);
  const baseIncome = cropValue(state.inventory.shippedCrops) + goodsValue(state.inventory.shippedGoods) + fishValue(state.inventory.shippedFish);
  const bonusIncome = Math.max(0, estimatedIncome - baseIncome);
  const event = calendarEventForDay();

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>库存 <strong>${totalCropCount(state.inventory.crops) + totalGoodCount(state.inventory.goods) + totalFishCount(state.inventory.fish)}</strong></span>
    <span>待出货 <strong>${pendingShipmentCount()}</strong></span>
    <span>基础收入 <strong>${baseIncome}g</strong></span>
    <span>节气加成 <strong>${bonusIncome}g</strong></span>
    <span>预计收入 <strong>${estimatedIncome}g</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  state.dailyOrder = normalizeDailyOrder(state.dailyOrder);
  note.textContent = `投入出货箱的物品会在睡觉后按售价结算。${
    estimatedIncome > baseIncome && event ? `${event.title}加成：+${estimatedIncome - baseIncome}g。` : ""
  }今日订单：${state.dailyOrder.shipped}/${state.dailyOrder.target}。待出货作物：${cropCountSummary(
    state.inventory.shippedCrops,
  )}。待出货成品：${goodsCountSummary(state.inventory.shippedGoods)}。待出货水产：${fishCountSummary(state.inventory.shippedFish)}。`;
  panel.append(note);

  const overview = document.createElement("p");
  overview.className = "dialog-note";
  overview.textContent = `待出货总览：${pendingShipmentOverviewText()}。`;
  panel.append(overview);

  const bulkActions = document.createElement("div");
  bulkActions.className = "shop-actions";
  bulkActions.append(createShopButton("撤回全部待出货", pendingShipmentCount() <= 0, () => withdrawAllShipments(), "待出货为空"));
  panel.append(bulkActions);

  const cropSection = document.createElement("section");
  cropSection.className = "shop-section";
  const cropTitle = document.createElement("h3");
  cropTitle.textContent = "出货作物";
  cropSection.append(cropTitle);
  let cropRowCount = 0;
  for (const cropId of CROP_IDS) {
    const def = cropDef(cropId);
    const cropCount = state.inventory.crops[cropId] ?? 0;
    const shippedCount = state.inventory.shippedCrops[cropId] ?? 0;
    if (cropCount <= 0 && shippedCount <= 0) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    const sampleGuidance = springSampleInventoryGuidance(def.id, cropCount);
    info.textContent = `${def.name}：库存 ${cropCount}，待出货 ${shippedCount}，售价 ${def.sellPrice}g${sampleGuidance ? `，${sampleGuidance}` : ""}`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("投入 1", cropCount <= 0, () => shipCrops(cropId, 1), "库存不足"),
      createShopButton("投入全部", cropCount <= 0, () => shipAllCrops(cropId), "库存不足"),
      createShopButton("撤回 1", shippedCount <= 0, () => withdrawShippedCrops(cropId, 1), "待出货为空"),
      createShopButton("撤回全部", shippedCount <= 0, () => withdrawAllShippedCrops(cropId), "待出货为空"),
    );
    row.append(actions);
    cropSection.append(row);
    cropRowCount += 1;
  }
  if (cropRowCount > 0) panel.append(cropSection);

  const goodsSection = document.createElement("section");
  goodsSection.className = "shop-section";
  const goodsTitle = document.createElement("h3");
  goodsTitle.textContent = "出货加工品";
  goodsSection.append(goodsTitle);
  let goodRowCount = 0;
  for (const goodId of PROCESSED_GOOD_IDS) {
    const def = processedGoodDef(goodId);
    const goodCount = state.inventory.goods[def.id] ?? 0;
    const shippedCount = state.inventory.shippedGoods[def.id] ?? 0;
    if (goodCount <= 0 && shippedCount <= 0) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${goodCount}，待出货 ${shippedCount}，售价 ${def.sellPrice}g`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("投入 1", goodCount <= 0, () => shipGoods(goodId, 1), "库存不足"),
      createShopButton("投入全部", goodCount <= 0, () => shipAllGoods(goodId), "库存不足"),
      createShopButton("撤回 1", shippedCount <= 0, () => withdrawShippedGoods(goodId, 1), "待出货为空"),
      createShopButton("撤回全部", shippedCount <= 0, () => withdrawAllShippedGoods(goodId), "待出货为空"),
    );
    row.append(actions);
    goodsSection.append(row);
    goodRowCount += 1;
  }
  if (goodRowCount > 0) panel.append(goodsSection);

  const fishSection = document.createElement("section");
  fishSection.className = "shop-section";
  const fishTitle = document.createElement("h3");
  fishTitle.textContent = "出货水产";
  fishSection.append(fishTitle);
  let fishRowCount = 0;
  for (const fishId of FISH_IDS) {
    const def = fishDef(fishId);
    const fishCount = state.inventory.fish[def.id] ?? 0;
    const shippedCount = state.inventory.shippedFish[def.id] ?? 0;
    if (fishCount <= 0 && shippedCount <= 0) continue;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${def.name}：库存 ${fishCount}，待出货 ${shippedCount}，售价 ${def.sellPrice}g，水质 ${def.minWaterQuality}+`;
    row.append(info);

    const actions = document.createElement("div");
    actions.className = "shop-actions";
    actions.append(
      createShopButton("投入 1", fishCount <= 0, () => shipFish(fishId, 1), "库存不足"),
      createShopButton("投入全部", fishCount <= 0, () => shipAllFish(fishId), "库存不足"),
      createShopButton("撤回 1", shippedCount <= 0, () => withdrawShippedFish(fishId, 1), "待出货为空"),
      createShopButton("撤回全部", shippedCount <= 0, () => withdrawAllShippedFish(fishId), "待出货为空"),
    );
    row.append(actions);
    fishSection.append(row);
    fishRowCount += 1;
  }
  if (fishRowCount > 0) panel.append(fishSection);

  if (cropRowCount + goodRowCount + fishRowCount === 0) {
    const empty = document.createElement("p");
    empty.textContent = "背包里暂时没有可出货物品；投入过的待出货物品也会在这里显示。";
    panel.append(empty);
  }

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("出货箱", panel);
}

function shipCrops(cropId, count) {
  const def = cropDef(cropId);
  if ((state.inventory.crops[def.id] ?? 0) < count) {
    const message = "作物不足，不能出货。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.crops[def.id] -= count;
  state.inventory.shippedCrops[def.id] = (state.inventory.shippedCrops[def.id] ?? 0) + count;
  markCropShipped(def.id);
  syncOrderProgressFromShipments(true);
  advanceQuests("shipment", count);
  updateAllHud();
  const reserveWarning = springSampleReserveWarning(def.id);
  const message = `投入 ${count} 个${def.name}，睡觉后结算。${reserveWarning ? ` ${reserveWarning}` : ""}`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("投入出货箱");
  return true;
}

function shipAllCrops(cropId) {
  const def = cropDef(cropId);
  const count = state.inventory.crops[def.id] ?? 0;
  if (count <= 0) return shipCrops(def.id, 1);
  return shipCrops(def.id, count);
}

function retractShipmentQuests(count) {
  const pendingShipmentCount = totalCropCount(state.inventory.shippedCrops);
  for (const quest of Object.values(state.quests)) {
    if (quest.type !== "shipment" || !["active", "readyToTurnIn"].includes(quest.status)) continue;
    quest.progress = Math.min(quest.target, Math.max((quest.progress ?? 0) - count, pendingShipmentCount, 0));
    if (quest.status === "readyToTurnIn" && getQuestProgress(quest) < quest.target) quest.status = "active";
  }
}

function withdrawShippedCrops(cropId, count) {
  const def = cropDef(cropId);
  if ((state.inventory.shippedCrops[def.id] ?? 0) < count) {
    const message = "待出货数量不足，不能撤回。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.shippedCrops[def.id] -= count;
  addCropCount(def.id, count);
  syncOrderProgressFromShipments();
  retractShipmentQuests(count);
  updateAllHud();
  const message = `撤回 ${count} 个${def.name}。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("撤回出货");
  return true;
}

function withdrawAllShippedCrops(cropId) {
  const def = cropDef(cropId);
  const count = state.inventory.shippedCrops[def.id] ?? 0;
  if (count <= 0) return withdrawShippedCrops(def.id, 1);
  return withdrawShippedCrops(def.id, count);
}

function shipGoods(goodId, count) {
  const def = processedGoodDef(goodId);
  if ((state.inventory.goods[def.id] ?? 0) < count) {
    const message = "加工品不足，不能出货。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.goods[def.id] -= count;
  state.inventory.shippedGoods[def.id] = (state.inventory.shippedGoods[def.id] ?? 0) + count;
  updateAllHud();
  const message = `投入 ${count} 个${def.name}，睡觉后结算。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("投入出货箱");
  return true;
}

function shipAllGoods(goodId) {
  const def = processedGoodDef(goodId);
  const count = state.inventory.goods[def.id] ?? 0;
  if (count <= 0) return shipGoods(def.id, 1);
  return shipGoods(def.id, count);
}

function withdrawShippedGoods(goodId, count) {
  const def = processedGoodDef(goodId);
  if ((state.inventory.shippedGoods[def.id] ?? 0) < count) {
    const message = "待出货加工品数量不足，不能撤回。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.shippedGoods[def.id] -= count;
  addGoodCount(def.id, count);
  updateAllHud();
  const message = `撤回 ${count} 个${def.name}。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("撤回出货");
  return true;
}

function withdrawAllShippedGoods(goodId) {
  const def = processedGoodDef(goodId);
  const count = state.inventory.shippedGoods[def.id] ?? 0;
  if (count <= 0) return withdrawShippedGoods(def.id, 1);
  return withdrawShippedGoods(def.id, count);
}

function shipFish(fishId, count) {
  const def = fishDef(fishId);
  if ((state.inventory.fish[def.id] ?? 0) < count) {
    const message = "水产不足，不能出货。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.fish[def.id] -= count;
  state.inventory.shippedFish[def.id] = (state.inventory.shippedFish[def.id] ?? 0) + count;
  updateAllHud();
  const message = `投入 ${count} 个${def.name}，睡觉后结算。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("投入出货箱");
  return true;
}

function shipAllFish(fishId) {
  const def = fishDef(fishId);
  const count = state.inventory.fish[def.id] ?? 0;
  if (count <= 0) return shipFish(def.id, 1);
  return shipFish(def.id, count);
}

function withdrawShippedFish(fishId, count) {
  const def = fishDef(fishId);
  if ((state.inventory.shippedFish[def.id] ?? 0) < count) {
    const message = "待出货水产数量不足，不能撤回。";
    addLog(message);
    playSound("error");
    showShippingDialog(message);
    return false;
  }
  state.inventory.shippedFish[def.id] -= count;
  addFishCount(def.id, count);
  updateAllHud();
  const message = `撤回 ${count} 个${def.name}。`;
  addLog(message);
  playSound("ship");
  showShippingDialog(message);
  scheduleAutosave("撤回出货");
  return true;
}

function withdrawAllShippedFish(fishId) {
  const def = fishDef(fishId);
  const count = state.inventory.shippedFish[def.id] ?? 0;
  if (count <= 0) return withdrawShippedFish(def.id, 1);
  return withdrawShippedFish(def.id, count);
}

function waterCrop(tile) {
  const crop = cropAtTile(tile.x, tile.y);
  if (!crop) return false;
  const def = cropDef(crop.cropId);
  const capacity = wateringCanCapacityForStory();

  if (state.wateringCanWater <= 0) {
    addLog("水壶没水了，需要补水。");
    addToolFeedback(tile, "没水", "bad");
    return false;
  }

  if (crop.ready) {
    addLog(`${def.name}已成熟，需要镰刀收获。`);
    addToolFeedback(tile, "已成熟", "bad");
    return false;
  }

  if (crop.watered) {
    addLog(`${def.name}今天已经浇过水。`);
    addToolFeedback(tile, "已浇水", "info");
    return false;
  }

  crop.watered = true;
  state.wateringCanWater -= 1;
  addStoryProgress("firstFieldWatered");
  updateAllHud();
  addLog(`${def.name}已浇水，水量 ${state.wateringCanWater}/${capacity}。`);
  addToolFeedback(tile, "浇水", "good");
  addVisualEffect(tile, "water");
  playSound("water");
  scheduleAutosave("浇水");
  return true;
}

function harvestCrop(tile) {
  const crop = cropAtTile(tile.x, tile.y);
  if (!crop) return false;
  const def = cropDef(crop.cropId);
  if (!crop.ready) {
    addLog(`${def.name}还没成熟。`);
    addToolFeedback(tile, "未成熟", "bad");
    return false;
  }
  state.dynamicObjects = state.dynamicObjects.filter((obj) => obj !== crop);
  addCropCount(def.id, 1);
  state.inventory.harvestedCrops += 1;
  markCropHarvested(def.id);
  advanceQuests("harvest", 1);
  updateAllHud();
  addLog(`收获${def.name}：${tile.x}, ${tile.y}`);
  addToolFeedback(tile, `+1 ${def.name}`, "good");
  addVisualEffect(tile, "harvest", { color: def.cropColor });
  playSound("harvest");
  scheduleAutosave("收获作物");
  return true;
}

function hoeTile(tile) {
  const map = currentMap();
  const groundTile = map.layers.ground[tile.y]?.[tile.x];
  const crop = cropAtTile(tile.x, tile.y);
  if (!canFarmOnCurrentMap()) {
    addLog("这里不能开垦农田，请回农场操作。");
    addToolFeedback(tile, "回农场开垦", "bad");
    return false;
  }
  if (crop) {
    addLog("这块地上有作物，不能恢复草地。");
    addToolFeedback(tile, "已有作物", "bad");
    return false;
  }
  if (map.layers.collision[tile.y]?.[tile.x] === 1) {
    addLog("这里被阻挡，不能锄地。");
    addToolFeedback(tile, "被阻挡", "bad");
    return false;
  }
  if (groundTile === TILE.dirt) {
    map.layers.ground[tile.y][tile.x] = TILE.grass;
    addLog(`泥土恢复为草地：${tile.x}, ${tile.y}`);
    addToolFeedback(tile, "恢复草地", "good");
    addVisualEffect(tile, "plant", { color: "#70b77e" });
    playSound("hoe");
    scheduleAutosave("恢复草地");
    return true;
  }
  if (groundTile !== TILE.grass && groundTile !== TILE.grassDark) {
    addLog("这里只能锄草地。");
    addToolFeedback(tile, "需要草地", "bad");
    return false;
  }
  map.layers.ground[tile.y][tile.x] = TILE.dirt;
  addStoryProgress("firstFieldHoed");
  addLog(`锄出泥土：${tile.x}, ${tile.y}`);
  addToolFeedback(tile, "锄地", "good");
  addVisualEffect(tile, "hoe");
  playSound("hoe");
  scheduleAutosave("锄地");
  return true;
}

function plantSeed(tile) {
  const map = currentMap();
  const def = cropDef(state.selectedSeed);
  if (!canFarmOnCurrentMap()) {
    addLog("这里只能游览或互动，不能播种。");
    addToolFeedback(tile, "回农场播种", "bad");
    return false;
  }
  const crop = cropAtTile(tile.x, tile.y);
  if (crop) {
    addLog(crop.ready ? "脚下作物已成熟，切换到镰刀收获。" : "脚下作物还在生长，切换到水壶浇水。");
    addToolFeedback(tile, "已有作物", "bad");
    return false;
  }
  if ((state.inventory.seeds[def.id] ?? 0) <= 0) {
    addLog(`${def.seedName}不足，可去村庄种子铺补货。`);
    addToolFeedback(tile, "种子不足", "bad");
    return false;
  }
  if (!isCropInSeason(def.id)) {
    addLog(`${def.seedName}不能在${seasonInfoForDay().label}播种。`);
    addToolFeedback(tile, "非本季", "bad");
    return false;
  }
  if (map.layers.ground[tile.y]?.[tile.x] !== TILE.dirt) {
    addLog("只能在泥土格子上播种。");
    addToolFeedback(tile, "需要泥土", "bad");
    return false;
  }
  if (map.layers.collision[tile.y]?.[tile.x] === 1) {
    addLog("这里已经被占用了。");
    addToolFeedback(tile, "被占用", "bad");
    return false;
  }
  state.dynamicObjects.push({
    type: "crop",
    mapId: CROP_MAP_ID,
    cropId: def.id,
    x: tile.x,
    y: tile.y,
    stage: 0,
    watered: false,
    ready: false,
    blocksMovement: false,
  });
  state.inventory.seeds[def.id] -= 1;
  addStoryProgress("firstFieldPlanted");
  updateAllHud();
  addLog(`种下${def.name}：${tile.x}, ${tile.y}`);
  addToolFeedback(tile, `播种${def.name}`, "good");
  addVisualEffect(tile, "plant", { color: def.sproutColor });
  playSound("plant");
  scheduleAutosave("播种");
  return true;
}

function cropTargetTile() {
  const underfoot = playerTile();
  if (cropAtTile(underfoot.x, underfoot.y)) return underfoot;
  return facingTile();
}

function toolTargetInfo(toolId = state.selectedTool) {
  const underfoot = playerTile();
  const front = facingTile();
  if (toolId === "hand") return { toolId, tile: front, label: "交互目标", source: "front" };
  if (toolId === "hoe") return { toolId, tile: underfoot, label: "锄地目标", source: "underfoot" };
  if (toolId === "seeds") return { toolId, tile: underfoot, label: "播种目标", source: "underfoot" };
  if (toolId === "wateringCan") {
    const source = nearbyWaterSource();
    if (source && state.wateringCanWater < wateringCanCapacityForStory()) {
      return { toolId, tile: source.tile, label: "补水目标", source: "water", waterSource: source };
    }
    const target = cropTargetTile();
    return { toolId, tile: target, label: "浇水目标", source: target.x === underfoot.x && target.y === underfoot.y ? "underfoot" : "front" };
  }
  if (toolId === "scythe") {
    const target = cropTargetTile();
    return { toolId, tile: target, label: "收获目标", source: target.x === underfoot.x && target.y === underfoot.y ? "underfoot" : "front" };
  }
  if (toolId === "fishingRod") return { toolId, tile: front, label: "钓鱼目标", source: "front" };
  return { toolId, tile: front, label: "目标", source: "front" };
}

function toolTargetStatus(info = toolTargetInfo()) {
  const map = currentMap();
  const tile = info.tile;
  if (!isTileInMap(tile, map)) return { state: "blocked", text: "超出地图" };

  if (info.toolId === "hand") {
    const npc = npcAtTile(tile.x, tile.y);
    const object = objectAtTile(tile.x, tile.y);
    if (npc) return { state: "ready", text: `对话 ${npc.name}` };
    if (object) return { state: "ready", text: objectActionHint(object).replace(/^E[ /：]*/, "") };
    return { state: "neutral", text: "" };
  }

  const crop = cropAtTile(tile.x, tile.y);
  const groundTile = map.layers.ground[tile.y]?.[tile.x];
  const blocked = map.layers.collision[tile.y]?.[tile.x] === 1;

  if (info.toolId === "hoe") {
    if (!canFarmOnCurrentMap()) return { state: "blocked", text: "回农场开垦" };
    if (blocked) return { state: "blocked", text: "被阻挡" };
    if (crop) return { state: "blocked", text: "已有作物" };
    if (groundTile === TILE.dirt) return { state: "ready", text: "可恢复草地" };
    if (groundTile === TILE.grass || groundTile === TILE.grassDark) return { state: "ready", text: "可锄地" };
    return { state: "blocked", text: "需要草地或泥土" };
  }

  if (info.toolId === "seeds") {
    const def = cropDef(state.selectedSeed);
    if (!canFarmOnCurrentMap()) return { state: "blocked", text: "回农场播种" };
    if ((state.inventory.seeds[def.id] ?? 0) <= 0) return { state: "blocked", text: "种子不足" };
    if (!isCropInSeason(def.id)) return { state: "blocked", text: `非${seasonInfoForDay().label}作物` };
    if (crop) return { state: "blocked", text: "已有作物" };
    if (blocked) return { state: "blocked", text: "被阻挡" };
    if (groundTile === TILE.dirt) return { state: "ready", text: `可播种${def.name}` };
    return { state: "blocked", text: "需要泥土" };
  }

  if (info.toolId === "wateringCan") {
    if (info.waterSource) return { state: "ready", text: `补水：${info.waterSource.label}` };
    if (state.wateringCanWater <= 0) return { state: "blocked", text: "水壶没水" };
    if (!crop) return { state: "neutral", text: "没有作物" };
    const def = cropDef(crop.cropId);
    if (crop.ready) return { state: "blocked", text: `${def.name}已成熟` };
    if (crop.watered) return { state: "neutral", text: "已浇水" };
    return { state: "ready", text: `可浇水${def.name}` };
  }

  if (info.toolId === "scythe") {
    if (!crop) return { state: "neutral", text: "没有作物" };
    const def = cropDef(crop.cropId);
    if (!crop.ready) return { state: "blocked", text: `${def.name}未成熟` };
    return { state: "ready", text: `可收获${def.name}` };
  }

  if (info.toolId === "fishingRod") {
    const target = fishingLocationForTile(tile);
    if (!target) return { state: "blocked", text: "面对水面" };
    return { state: "ready", text: `${target.label} · ${fishingLocationStatusText(target.id)}` };
  }

  return { state: "neutral", text: "" };
}

function waterSourceAt(tile) {
  if (!currentMapRules().canRefillWater) return null;
  const map = currentMap();
  const object = objectAtTile(tile.x, tile.y);
  if (object?.type === "well") return { type: "well", label: object.name ?? "水井", tile: { ...tile } };
  if (object?.type === "irrigationPump" && state.story.irrigationRepaired) {
    return { type: "irrigationPump", label: object.name ?? "水利水泵", tile: { ...tile } };
  }
  if (map.layers.ground[tile.y]?.[tile.x] === TILE.water) return { type: "water", label: "水边", tile: { ...tile } };
  return null;
}

function nearbyWaterSource() {
  const front = facingTile();
  return waterSourceAt(front) ?? waterSourceAt(playerTile());
}

function fishingLocationForTile(tile) {
  if (!tile || currentMap().layers.ground[tile.y]?.[tile.x] !== TILE.water) return null;
  if (state.mapId === "farm") return { id: "farmPond", label: "农场池塘" };
  if (state.mapId === "village") return { id: "villagePond", label: "村庄池塘" };
  if (state.mapId === "mountain") return { id: "mountainStream", label: "山里溪流" };
  return null;
}

function fishingWaterTarget() {
  const front = facingTile();
  const location = fishingLocationForTile(front);
  return location ? { tile: front, location } : null;
}

function fishAvailableAt(locationId) {
  const quality = currentWaterQuality();
  return FISH_IDS.map((fishId) => fishDef(fishId)).filter((def) => {
    if (!def.locations.includes(locationId)) return false;
    if (quality < def.minWaterQuality) return false;
    if (def.seasons && !def.seasons.includes(currentSeasonId())) return false;
    if (def.weather && !def.weather.includes(state.weather)) return false;
    return true;
  });
}

function fishUnlockSummaryForLocation(locationId) {
  const relevant = FISH_IDS.map((fishId) => fishDef(fishId)).filter((def) => def.locations.includes(locationId));
  const available = relevant.filter((def) => fishAvailableAt(locationId).some((item) => item.id === def.id));
  const next = relevant
    .filter((def) => def.minWaterQuality > currentWaterQuality())
    .sort((a, b) => a.minWaterQuality - b.minWaterQuality || a.sellPrice - b.sellPrice)[0];
  return {
    available,
    total: relevant.length,
    next,
    label: `${available.length}/${relevant.length}`,
  };
}

function fishingLocationStatusText(locationId) {
  const summary = fishUnlockSummaryForLocation(locationId);
  const names = summary.available
    .slice(0, 4)
    .map((fish) => fish.name)
    .join("、");
  const next = summary.next ? `；下一批：水质 Lv.${summary.next.minWaterQuality}+ ${summary.next.name}` : "；鱼类已全部回归";
  return `水质 ${waterQualityLabel()} · 可见 ${summary.label}${names ? `（${names}）` : ""}${next}`;
}

function chooseFishForLocation(locationId) {
  const candidates = fishAvailableAt(locationId);
  if (candidates.length === 0) return fishDef("waterweed");
  const weighted = candidates.map((def) => ({
    def,
    weight: Math.max(1, (def.weight ?? 1) + (def.weatherBonus?.[state.weather] ?? 0)),
  }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.def;
  }
  return weighted[weighted.length - 1].def;
}

function fishingBarHeight(def = fishDef(fishing.fishId)) {
  return Math.max(0.18, Math.min(0.36, 0.34 - def.difficulty * 0.12 + currentWaterQuality() * 0.018));
}

function startFishing() {
  if (fishing.active) return false;
  const target = fishingWaterTarget();
  if (!target) {
    setPlayerMotion("fishingRod", 360);
    addLog("需要面对水面才能钓鱼。");
    addToolFeedback(facingTile(), "面对水面", "bad");
    return false;
  }
  const def = chooseFishForLocation(target.location.id);
  const quality = currentWaterQuality();
  fishing.active = true;
  fishing.phase = "waiting";
  fishing.fishId = def.id;
  fishing.locationId = target.location.id;
  fishing.targetTile = { ...target.tile };
  fishing.waitTimer = Math.max(0.55, 1.35 - quality * 0.18 + Math.random() * 0.75);
  fishing.barY = 0.58;
  fishing.fishY = 0.2 + Math.random() * 0.6;
  fishing.fishVelocity = 0;
  fishing.moveTimer = 0;
  fishing.progress = 0.34;
  fishing.perfect = true;
  fishing.elapsed = 0;
  setPlayerMotion("fishingRod", PLAYER_ACTION_DURATIONS.fishingRod);
  addLog(`在${target.location.label}抛竿，水质：${waterQualityLabel()}。`);
  if (target.location.id === "villagePond" && quality <= 0) {
    addLog("村塘水质还浑，只会出现基础水产；去村情记录板清淤后鱼类会增加。");
    addToolFeedback(target.tile, "水质污浊", "info");
  }
  addToolFeedback(target.tile, "抛竿", "info");
  addVisualEffect(target.tile, "water", { duration: 800 });
  return true;
}

function completeFishing(success) {
  const def = fishDef(fishing.fishId);
  const targetTile = fishing.targetTile ? { ...fishing.targetTile } : playerTile();
  if (success) {
    setPlayerMotion("harvest", PLAYER_ACTION_DURATIONS.harvest);
    addFishCount(def.id, 1);
    updateAllHud();
    const perfectText = fishing.perfect ? "完美收杆，品质更好。" : "钓上来了。";
    addLog(`钓到${def.name}。${perfectText}`);
    addToolFeedback(targetTile, `+${def.name}`, "good");
    addVisualEffect(targetTile, "quest", { color: def.color, duration: 900 });
    playSound("quest");
    scheduleAutosave("钓鱼成功");
  } else {
    setPlayerMotion("fishingRod", 420);
    addLog("鱼脱钩了。");
    addToolFeedback(targetTile, "脱钩", "bad");
    playSound("error");
  }
  fishing.active = false;
  fishing.phase = "idle";
  fishing.fishId = null;
  keys.delete(" ");
}

function cancelFishing() {
  if (!fishing.active) return false;
  addLog("收起钓竿。");
  setPlayerMotion("inspect", PLAYER_ACTION_DURATIONS.inspect);
  fishing.active = false;
  fishing.phase = "idle";
  fishing.fishId = null;
  return true;
}

function updateFishing(dt) {
  if (!fishing.active) return;
  if (fishing.phase === "waiting") {
    fishing.waitTimer -= dt;
    if (fishing.waitTimer <= 0) {
      fishing.phase = "catch";
      setPlayerMotion("fishingCatch", PLAYER_ACTION_DURATIONS.fishingCatch);
      addLog("HIT! 按住 Space 让绿色钓鱼条覆盖鱼。");
      addToolFeedback(fishing.targetTile, "HIT!", "good");
      playSound("select");
    }
    return;
  }

  const def = fishDef(fishing.fishId);
  const barHeight = fishingBarHeight(def);
  const holding = keys.has(" ") || keys.has("enter") || keys.has("e");
  fishing.elapsed += dt;
  fishing.barY += (holding ? -0.72 : 0.54) * dt;
  fishing.barY = Math.max(0, Math.min(1 - barHeight, fishing.barY));

  fishing.moveTimer -= dt;
  if (fishing.moveTimer <= 0) {
    const jump = (Math.random() * 2 - 1) * (0.34 + def.difficulty * 0.58);
    fishing.fishVelocity = jump;
    fishing.moveTimer = Math.max(0.18, 0.72 - def.difficulty * 0.32 + Math.random() * 0.42);
  }
  fishing.fishY += fishing.fishVelocity * dt;
  fishing.fishVelocity *= Math.pow(0.08, dt);
  if (fishing.fishY < 0.04) {
    fishing.fishY = 0.04;
    fishing.fishVelocity = Math.abs(fishing.fishVelocity) * 0.45;
  }
  if (fishing.fishY > 0.96) {
    fishing.fishY = 0.96;
    fishing.fishVelocity = -Math.abs(fishing.fishVelocity) * 0.45;
  }

  const covered = fishing.fishY >= fishing.barY && fishing.fishY <= fishing.barY + barHeight;
  if (!covered && fishing.elapsed > 0.2) fishing.perfect = false;
  fishing.progress += (covered ? 0.43 : -0.28 - def.difficulty * 0.18) * dt;
  fishing.progress = Math.max(0, Math.min(1, fishing.progress));
  if (fishing.progress >= 1) completeFishing(true);
  if (fishing.progress <= 0) completeFishing(false);
}

function refillWateringCan(source) {
  const label = source?.label ?? "水源";
  const capacity = wateringCanCapacityForStory();
  if (state.wateringCanWater >= capacity) {
    addLog("水壶已经装满。");
    addToolFeedback(source?.tile ?? playerTile(), "已满", "info");
    return false;
  }
  state.wateringCanWater = capacity;
  updateAllHud();
  addLog(`水壶已补满：${label}`);
  addToolFeedback(source?.tile ?? playerTile(), "补满水", "good");
  addVisualEffect(source?.tile ?? playerTile(), "water");
  playSound("water");
  scheduleAutosave("补水");
  return true;
}

function groundNameAt(tile) {
  const tileId = currentMap().layers.ground[tile.y]?.[tile.x];
  return tileMeta[tileId]?.name ?? `tile ${tileId}`;
}

function cropStatusText(crop) {
  const def = cropDef(crop.cropId);
  if (crop.ready) return `${def.name}已成熟`;
  if (crop.watered) return `${def.name}已浇水`;
  return `${def.name}生长中`;
}

function villageIssueGoalComplete(goalId) {
  return state.story.villageIssueGoals?.[goalId] === true;
}

function villageFacilityLevel(goalId) {
  if (!state.story.villageFacilityLevels) state.story.villageFacilityLevels = createDefaultVillageFacilityLevels();
  const raw = Math.floor(Number(state.story.villageFacilityLevels[goalId] ?? 0));
  const migrated = villageIssueGoalComplete(goalId) && raw <= 0 ? 1 : raw;
  return Math.max(0, Math.min(COMMUNITY_FACILITY_MAX_LEVEL, migrated));
}

function villageFacilityStageDef(goalId) {
  return COMMUNITY_FACILITY_LEVELS[villageFacilityLevel(goalId)] ?? COMMUNITY_FACILITY_LEVELS[0];
}

function villageFacilityStageLabel(goalId) {
  const level = villageFacilityLevel(goalId);
  return `Lv.${level} · ${villageFacilityStageDef(goalId).label}`;
}

function villageFacilityUpgradeCost(goalId) {
  const nextLevel = villageFacilityLevel(goalId) + 1;
  return COMMUNITY_FACILITY_UPGRADE_COSTS[nextLevel] ?? null;
}

function villageFacilityUpgradeCostText(cost) {
  if (!cost) return "已满级";
  const parts = [];
  if (cost.gold > 0) parts.push(`${cost.gold}g`);
  if (cost.cropCost > 0) parts.push(`${cost.cropCost} 任意作物`);
  if (cost.goodCost > 0) parts.push(`${cost.goodCost} 任意加工品`);
  const resources = resourceCostText(cost.resourceCost);
  if (resources !== "无") parts.push(resources);
  return parts.join(" + ") || "无";
}

function villageIssueGoalCostObject(goal) {
  return {
    gold: goal?.costGold ?? 0,
    cropCost: goal?.cropCost ?? 0,
    goodCost: goal?.goodCost ?? 0,
    resourceCost: goal?.resourceCost ?? {},
  };
}

function facilityCostShortfallLines(cost = {}) {
  const lines = [];
  const gold = cost.gold ?? 0;
  const cropCost = cost.cropCost ?? 0;
  const goodCost = cost.goodCost ?? 0;
  if (gold > state.inventory.gold) lines.push(`金币 ${state.inventory.gold}/${gold}，${MATERIAL_SOURCE_HINTS.gold}`);
  if (cropCost > totalCropCount(state.inventory.crops)) {
    lines.push(`作物 ${totalCropCount(state.inventory.crops)}/${cropCost}，${MATERIAL_SOURCE_HINTS.crops}`);
  }
  if (goodCost > totalGoodCount(state.inventory.goods)) {
    lines.push(`加工品 ${totalGoodCount(state.inventory.goods)}/${goodCost}，${MATERIAL_SOURCE_HINTS.goods}`);
  }
  for (const resourceId of RESOURCE_IDS) {
    const required = cost.resourceCost?.[resourceId] ?? 0;
    const owned = state.inventory.resources?.[resourceId] ?? 0;
    if (required > owned) lines.push(`${resourceDef(resourceId).name} ${owned}/${required}，${MATERIAL_SOURCE_HINTS[resourceId] ?? "山里资源点采集"}`);
  }
  return lines;
}

function facilityCostReadinessText(cost = {}) {
  const missing = facilityCostShortfallLines(cost);
  return missing.length > 0 ? `缺：${missing.join("；")}` : "材料齐全";
}

function villageFacilityEntryText(goalId) {
  const goal = VILLAGE_ISSUE_GOALS[goalId];
  const def = communityFacilityDef(goalId);
  const level = villageFacilityLevel(goalId);
  if (level <= 0 && !goal?.isUnlocked()) return `入口：未开放，${goal?.requirement ?? "先推进前置目标"}`;
  if (level <= 0) return "入口：村庄广场村情记录板，按 E 推进修复";
  if (level >= COMMUNITY_FACILITY_MAX_LEVEL) return `入口：村庄 ${def.x},${def.y}，按 E 查看强化二成果`;
  return `入口：村庄 ${def.x},${def.y}，按 E 查看并强化`;
}

function villageFacilityUpgradeBlockedReason(goalId) {
  const level = villageFacilityLevel(goalId);
  if (level <= 0) return "需要先在村情记录板修复";
  if (level >= COMMUNITY_FACILITY_MAX_LEVEL) return "已满级";
  const cost = villageFacilityUpgradeCost(goalId);
  if (!cost) return "已满级";
  if (state.inventory.gold < cost.gold) return "金币不足";
  if (totalCropCount(state.inventory.crops) < cost.cropCost) return "作物不足";
  if (totalGoodCount(state.inventory.goods) < cost.goodCost) return "加工品不足";
  if (!hasResourceCosts(cost.resourceCost)) return "资源不足";
  return "";
}

function completedVillageIssueGoalCount() {
  return VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageIssueGoalComplete(goalId)).length;
}

function villageIssueGoalCostText(goal) {
  const parts = [];
  if (goal.costGold > 0) parts.push(`${goal.costGold}g`);
  if (goal.cropCost > 0) parts.push(`${goal.cropCost} 任意作物`);
  if (goal.goodCost > 0) parts.push(`${goal.goodCost} 任意加工品`);
  const resources = resourceCostText(goal.resourceCost);
  if (resources !== "无") parts.push(resources);
  return parts.join(" + ") || "无";
}

function villageIssueGoalBlockedReason(goal) {
  if (villageIssueGoalComplete(goal.id)) return "已推进";
  if (!goal.isUnlocked()) return goal.requirement;
  if (state.inventory.gold < goal.costGold) return "金币不足";
  if (totalCropCount(state.inventory.crops) < goal.cropCost) return "作物不足";
  if (totalGoodCount(state.inventory.goods) < goal.goodCost) return "加工品不足";
  if (!hasResourceCosts(goal.resourceCost)) return "资源不足";
  return "";
}

function villageIssueGoalRouteText(goal) {
  const facility = communityFacilityDef(goal.id);
  const npc = VILLAGE_ISSUE_CONTACTS[goal.id] ?? "村民";
  return `对应 NPC：${npc} · 设施变化：${facility.name} (${facility.x},${facility.y}) · 阶段：${villageFacilityStageLabel(goal.id)} · 议题：${goal.issue}`;
}

function completeVillageIssueGoal(goalId) {
  const goal = VILLAGE_ISSUE_GOALS[goalId];
  if (!goal) return false;
  const blocked = villageIssueGoalBlockedReason(goal);
  if (blocked) {
    addLog(`不能推进${goal.title}：${blocked}`);
    playSound("error");
    showIssueBoardDialog(blocked);
    return false;
  }

  state.inventory.gold -= goal.costGold;
  consumeAnyCrops(goal.cropCost);
  consumeAnyGoods(goal.goodCost);
  consumeResources(goal.resourceCost);
  state.story.villageIssueGoals[goal.id] = true;
  if (!state.story.villageFacilityLevels) state.story.villageFacilityLevels = createDefaultVillageFacilityLevels();
  state.story.villageFacilityLevels[goal.id] = Math.max(1, villageFacilityLevel(goal.id));
  if (goal.id === "waterCleanup") state.story.waterQuality = Math.max(currentWaterQuality(), 1);
  ensureVillageIssueGoalFacilities();
  updateAllHud();
  const facility = communityFacilityDef(goal.id);
  if (state.mapId === "village") addVisualEffect({ x: facility.x, y: facility.y }, "quest", { color: facility.color, duration: 1100 });
  addLog(`村情目标完成：${goal.title}`);
  addScreenEffect("quest", "村情目标");
  playSound("quest");
  showIssueBoardDialog(goal.result);
  scheduleAutosave(`村情目标：${goal.title}`);
  return true;
}

function applyVillageFacilityStageEffect(goalId, level) {
  if (goalId === "waterCleanup") {
    state.story.waterQuality = Math.max(currentWaterQuality(), Math.min(WATER_QUALITY_MAX, level));
  }
}

function upgradeVillageFacility(goalId) {
  const def = communityFacilityDef(goalId);
  const blocked = villageFacilityUpgradeBlockedReason(goalId);
  if (blocked) {
    addLog(`不能强化${def.name}：${blocked}`);
    playSound("error");
    showCommunityFacilityDialog({ type: "communityFacility", goalId, name: def.name, x: def.x, y: def.y });
    return false;
  }
  const cost = villageFacilityUpgradeCost(goalId);
  const nextLevel = villageFacilityLevel(goalId) + 1;
  const previousMaxEnergy = maxEnergy();
  state.inventory.gold -= cost.gold;
  consumeAnyCrops(cost.cropCost);
  consumeAnyGoods(cost.goodCost);
  consumeResources(cost.resourceCost);
  if (!state.story.villageFacilityLevels) state.story.villageFacilityLevels = createDefaultVillageFacilityLevels();
  state.story.villageFacilityLevels[goalId] = nextLevel;
  applyVillageFacilityStageEffect(goalId, nextLevel);
  if (maxEnergy() > previousMaxEnergy) state.energy = Math.min(maxEnergy(), state.energy + (maxEnergy() - previousMaxEnergy));
  ensureVillageIssueGoalFacilities();
  updateAllHud();
  const message = `${def.name}完成${COMMUNITY_FACILITY_LEVELS[nextLevel].label}。${COMMUNITY_FACILITY_LEVELS[nextLevel].summary}`;
  addLog(message);
  if (state.mapId === "village") addVisualEffect({ x: def.x, y: def.y }, "quest", { color: def.color, duration: 1100 });
  addScreenEffect("quest", def.name);
  playSound("quest");
  showCommunityFacilityDialog({ type: "communityFacility", goalId, name: def.name, x: def.x, y: def.y }, message);
  scheduleAutosave(`设施强化：${def.name}`);
  return true;
}

function waterQualitySignText() {
  const quality = currentWaterQuality();
  const available = FISH_IDS.map((fishId) => fishDef(fishId))
    .filter((def) => def.locations.includes("villagePond") && def.minWaterQuality <= quality)
    .map((def) => def.name);
  const next = FISH_IDS.map((fishId) => fishDef(fishId))
    .filter((def) => def.locations.includes("villagePond") && def.minWaterQuality > quality)
    .sort((a, b) => a.minWaterQuality - b.minWaterQuality)[0];
  const cleanupHint = villageIssueGoalComplete("waterCleanup")
    ? `村塘清淤点当前 ${villageFacilityStageLabel("waterCleanup")}。继续强化清淤点、水渠工程或土地庙收束都能改善水质。`
    : "去村情记录板推进“村塘清淤”，水质提升后会解锁新水产。";
  return `村塘水质：${waterQualityLabel()}。\n当前能见水产：${available.join("、") || "水草"}。\n${
    next ? `下一批鱼类：水质达到 ${next.minWaterQuality}+ 后可见 ${next.name}。` : "鱼类已经全部回来了。"
  }\n${cleanupHint}`;
}

function storySignText(object) {
  if (object.storyId === "waterQualitySign") return waterQualitySignText();
  if (object.storyId !== "firstShipmentFeedback") return object.text;
  if (!state.story.firstShipmentSettled) return object.text;
  return "第一批农产品已经从农场出货。\n茶铺和卫生站都留下了需求：希望后面能有稳定菜篮、试吃小单和节气订单。\n种子摊补上了菜篮和价签，出货箱旁也多了周转筐。\n村里的杂货铺可以开始修复了。";
}

function readSign(object) {
  const title = object.storyId === "firstShipmentFeedback" ? "村民反馈" : object.storyId === "waterQualitySign" ? "村塘水质牌" : "告示牌";
  const rewardText = object.storyId === "firstShipmentFeedback" ? grantFirstFeedbackReward() : "";
  showDialog(title, `${storySignText(object)}${rewardText ? `\n\n${rewardText}` : ""}`);
  if (object.storyId === "firstShipmentFeedback" && state.story.firstShipmentSettled && !state.story.villageFeedbackSeen) {
    state.story.villageFeedbackSeen = true;
    addLog("查看了第一批出货后的村庄反馈。");
    addVisualEffect({ x: object.x, y: object.y }, "quest", { color: "#70b77e", duration: 900 });
    playSound("quest");
    updateAllHud();
    scheduleAutosave("查看村庄反馈");
    return;
  }
  addLog("读了告示牌。");
}

function showIssueBoardNotes() {
  showPagedDialog("村情记录板", [
    "这块板子不是任务栏，而是村里把难处写下来，免得所有变化只看见金币和建筑。",
    "留守儿童：父母长期外出务工，孩子的接送、陪伴和学习压力常常落到老人、老师和邻里身上。农场恢复后，村里需要的不只是收入，也需要让家庭有机会重新在一起生活。",
    "年轻人留不住：收入不稳定、职业路径窄、公共服务少，都会让年轻人觉得留下来没有未来。合作社、品牌、旅游和电商如果只增加工作量，却不给人尊严和成长空间，还是留不住人。",
    "老人照护：很多老人还在种地、看孩子、守房子。医疗、交通、陪伴和冬天取暖都是现实问题；村庄恢复不能只修铺子，也要让日常照护更可靠。",
    "农业收入：原料价格低、行情波动大、物流和损耗吃掉利润。单靠多种几块地并不能解决问题，稳定订单、加工、仓储、品牌和议价能力才会慢慢改变收入结构。",
    "水污染：池塘和沟渠没人清，排水口坏了，水产会先消失，孩子也会被告知别靠近水边。清淤不是装饰，它会改变饭桌、集市和土地庙后来能说的话。",
    "公共服务：学校、卫生站、班车、快递点、网络和水利设施看起来不像主线剧情，却决定一个地方能不能长期住人。后续内容会把这些问题逐步做成可推进的村庄目标。",
  ]);
  addLog("查看村情记录板。");
}

function showIssueBoardDialog(message = "") {
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>村情目标 <strong>${completedVillageIssueGoalCount()}/${VILLAGE_ISSUE_GOAL_IDS.length}</strong></span>
    <span>设施 <strong>${villageFacilityStateSummary()}</strong></span>
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
    <span>水质 <strong>${waterQualityLabel()}</strong></span>
    <span>物资 <strong>${totalCropCount(state.inventory.crops)} 作物 / ${totalGoodCount(state.inventory.goods)} 加工品 / ${resourceCountSummary()}</strong></span>
  `;
  panel.append(stats);

  const note = document.createElement("p");
  note.textContent = "这些目标不能一次性解决问题，只是让村庄恢复从“能卖东西”继续走向“能长期生活”。";
  panel.append(note);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(createShopButton("阅读现实背景", false, () => showIssueBoardNotes()));
  panel.append(actions);

  const changedSection = document.createElement("section");
  changedSection.className = "shop-section";
  const changedTitle = document.createElement("h3");
  changedTitle.textContent = "已改变了什么";
  changedSection.append(changedTitle);
  const results = completedVillageIssueResults();
  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "dialog-note";
    empty.textContent = "暂无完成变化。先从可推进目标里选择一项，村庄地图会出现对应设施。";
    changedSection.append(empty);
  } else {
    for (const result of results) {
      const item = document.createElement("p");
      item.className = "dialog-note";
      item.textContent = result;
      changedSection.append(item);
    }
  }
  panel.append(changedSection);

  const section = document.createElement("section");
  section.className = "shop-section";
  const title = document.createElement("h3");
  title.textContent = "可推进目标";
  section.append(title);

  for (const goalId of VILLAGE_ISSUE_GOAL_IDS) {
    const goal = VILLAGE_ISSUE_GOALS[goalId];
    const complete = villageIssueGoalComplete(goal.id);
    const blocked = villageIssueGoalBlockedReason(goal);
    const facilityLevel = villageFacilityLevel(goal.id);
    const facilityVisible = goal.isUnlocked() || complete || facilityLevel > 0;
    const row = document.createElement("div");
    row.className = "shop-row";
    const info = document.createElement("span");
    info.textContent = `${goal.title} · ${goal.issue} · ${villageFacilityStateLabel(goal.id)} · ${villageFacilityStageLabel(goal.id)} · ${
      complete ? "修复完成" : goal.isUnlocked() ? `修复需要 ${villageIssueGoalCostText(goal)}` : goal.requirement
    }`;
    row.append(info);

    const detail = document.createElement("small");
    detail.textContent = `${complete ? goal.result : goal.description} · ${villageIssueGoalRouteText(goal)} · ${villageFacilityEntryText(
      goal.id,
    )} · ${villageFacilityNextRequirementText(
      goal.id,
    )} · 下一效果：${villageFacilityNextEffectText(goal.id)}`;
    row.append(detail);

    const rowActions = document.createElement("div");
    rowActions.className = "shop-actions";
    rowActions.append(createShopButton(complete ? "已完成" : "推进", Boolean(blocked), () => completeVillageIssueGoal(goal.id), blocked));
    rowActions.append(
      createShopButton(
        facilityLevel > 0 ? (facilityLevel >= COMMUNITY_FACILITY_MAX_LEVEL ? "查看设施" : "查看/强化") : "查看旧址",
        !facilityVisible,
        () => showCommunityFacilityDialog({ type: "communityFacility", goalId: goal.id, name: communityFacilityDef(goal.id).name }),
        facilityVisible ? "" : goal.requirement,
      ),
    );
    row.append(rowActions);
    section.append(row);
  }
  panel.append(section);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog("村情记录板", panel);
  addLog("查看村情记录板。");
}

function showCommunityFacilityDialog(object, message = "") {
  const def = communityFacilityDef(object.goalId);
  const goal = VILLAGE_ISSUE_GOALS[def.goalId];
  const level = villageFacilityLevel(def.goalId);
  const stage = villageFacilityStageDef(def.goalId);
  const nextCost = villageFacilityUpgradeCost(def.goalId);
  const upgradeReason = villageFacilityUpgradeBlockedReason(def.goalId);
  const panel = document.createElement("div");
  panel.className = "shop-panel";

  const stats = document.createElement("div");
  stats.className = "shop-stats";
  stats.innerHTML = `
    <span>议题 <strong>${goal.issue}</strong></span>
    <span>阶段 <strong>${villageFacilityStageLabel(def.goalId)}</strong></span>
    <span>状态 <strong>${villageFacilityStateLabel(def.goalId)}</strong></span>
    <span>金币 <strong>${state.inventory.gold}g</strong></span>
  `;
  panel.append(stats);

  const text = document.createElement("p");
  text.textContent = level > 0
    ? `${def.result} ${stage.summary} ${communityFacilityStageFeedback(def.goalId, level)} 当前效果：${facilityRewardEffectText(def.goalId)}。`
    : `${goal.description} ${stage.summary}`;
  panel.append(text);

  const upgradeRow = document.createElement("div");
  upgradeRow.className = "shop-row";
  const upgradeInfo = document.createElement("span");
  upgradeInfo.textContent = level >= COMMUNITY_FACILITY_MAX_LEVEL
    ? "设施已到强化二。"
    : level <= 0
      ? `下一步：先完成村情目标“${goal.title}” · ${villageFacilityEntryText(def.goalId)} · ${villageFacilityNextRequirementText(def.goalId)}`
      : `下一阶段：${COMMUNITY_FACILITY_LEVELS[level + 1].label} · 需要 ${villageFacilityUpgradeCostText(nextCost)} · ${facilityCostReadinessText(nextCost)}`;
  upgradeRow.append(upgradeInfo);

  const entry = document.createElement("small");
  entry.textContent = `${villageFacilityEntryText(def.goalId)} · 下一效果：${villageFacilityNextEffectText(def.goalId)}`;
  upgradeRow.append(entry);
  const upgradeActions = document.createElement("div");
  upgradeActions.className = "shop-actions";
  upgradeActions.append(
    createShopButton(
      level >= COMMUNITY_FACILITY_MAX_LEVEL ? "已满级" : level <= 0 ? "未修复" : `强化到 Lv.${level + 1}`,
      Boolean(upgradeReason),
      () => upgradeVillageFacility(def.goalId),
      upgradeReason,
    ),
  );
  upgradeRow.append(upgradeActions);
  panel.append(upgradeRow);

  const actions = document.createElement("div");
  actions.className = "shop-actions";
  actions.append(createShopButton("查看村情记录板", false, () => showIssueBoardDialog()));
  panel.append(actions);

  if (message) {
    const feedback = document.createElement("div");
    feedback.className = "shop-message";
    feedback.textContent = message;
    panel.append(feedback);
  }

  showDialog(object.name ?? def.name, panel);
  addLog(`查看${object.name ?? def.name}。`);
}

function currentStoryRouteLine() {
  const objective = currentStoryObjectives().find((item) => !item.done);
  if (!objective) return "当前目标：本阶段已完成，查看主线卡选择下一步。";
  const target = currentStoryTargetInfo(objective);
  return `当前目标：${objective.label}${target ? ` · ${storyTargetLine(target)}` : ""}`;
}

function villageFacilityRouteLines() {
  const guidance = currentVillageFacilityGuidance();
  const currentLine = guidance
    ? [`设施目标：${guidance.title} · ${guidance.statusText} · ${storyTargetLine(guidance.target)}`]
    : [];
  const levelLines = VILLAGE_ISSUE_GOAL_IDS.filter((goalId) => villageFacilityLevel(goalId) > 0).map((goalId) => {
    const def = communityFacilityDef(goalId);
    return `设施：${def.name}在 ${def.x},${def.y} · ${villageFacilityStageLabel(goalId)}`;
  });
  return [...currentLine, ...levelLines];
}

function directionSignDynamicLines(object) {
  const base = Array.isArray(object.lines) && object.lines.length > 0 ? object.lines : ["北：山路 / 土地庙", "东：村庄", "西：农田 / 出货箱"];
  const mapLine =
    state.mapId === "farm"
      ? "农场规则：这里可以耕种和建造。"
      : state.mapId === "village"
        ? "村庄规则：这里推进任务、商店、废墟和村情目标，不种作物。"
        : state.mapId === "mountain"
          ? "山路规则：这里用于探索和土地庙提示，不种作物。"
          : "室内规则：这里用于休息、邮箱或厨房互动。";
  const routeLine = currentStoryRouteLine();
  const checkpointLine = currentPlaythroughCheckpoint()?.signHint ?? "";
  const consistencyLine = guidanceConsistencySummary();
  const facilityLines = state.mapId === "village" ? villageFacilityRouteLines().slice(0, 5) : [];
  return [routeLine, mapLine, consistencyLine, checkpointLine, ...facilityLines, ...base].filter(Boolean);
}

function showDirectionSignDialog(object) {
  const lines = directionSignDynamicLines(object);
  showDialog(object.name ?? "路牌", lines);
  addLog(`查看${object.name ?? "路牌"}。`);
}

function objectActionHint(object) {
  if (object.type === "ruin") {
    if (featureUnlocked(object.featureId) && object.repairedType) return `E：修复${object.repairedName ?? object.name ?? "设施"}`;
    return `E：查看${object.name ?? "废墟"}`;
  }
  if (object.type === "sign" && object.storyId === "firstShipmentFeedback" && state.story.firstShipmentSettled) return "E：查看村民反馈";
  if (object.type === "sign") return "E：阅读告示牌";
  if (object.type === "chest") return "E：打开箱子";
  if (object.type === "seedShop") return "E：打开种子铺";
  if (object.type === "shop") return objectFeatureUnlocked(object) ? "E：打开杂货铺" : "E：查看停业店铺";
  if (object.type === "shippingBin") return "E：打开出货箱";
  if (object.type === "kitchen") return objectFeatureUnlocked(object) ? "E：打开厨房加工台" : "E：查看未启用厨房";
  if (object.type === "processor") {
    if (!objectFeatureUnlocked(object)) return "E：查看未启用加工桶";
    const machine = machineStateForObject(object);
    if (isPlacedBuildableObject(object) && !machine.readyGoodId && !machine.recipeId) return "E：打开加工桶 / 回收移动";
    return machine.readyGoodId ? "E：领取加工桶成品" : "E：打开加工桶";
  }
  if (object.type === "dryer") {
    if (!objectFeatureUnlocked(object)) return "E：查看未启用晾晒架";
    const machine = machineStateForObject(object);
    if (isPlacedBuildableObject(object) && !machine.readyGoodId && !machine.recipeId) return "E：打开晾晒架 / 回收移动";
    return machine.readyGoodId ? "E：领取晾晒成品" : "E：打开晾晒架";
  }
  if (object.type === "bench") {
    const manage = isPlacedBuildableObject(object) ? " / 回收移动" : "";
    return state.energy < maxEnergy() ? `E：长椅休息 +${BENCH_REST_ENERGY} 体力${manage}` : `E：查看长椅${manage}`;
  }
  if (object.type === "gardenLamp") {
    const manage = isPlacedBuildableObject(object) ? " / 回收移动" : "";
    return isLampLitTime() ? `E：查看点亮的小路灯${manage}` : `E：查看小路灯${manage}`;
  }
  if (object.type === "flowerBox") {
    const manage = isPlacedBuildableObject(object) ? " / 回收移动" : "";
    return `E：查看${seasonLabel(currentSeasonId())}花箱${manage}`;
  }
  if (object.type === "fence") {
    const manage = isPlacedBuildableObject(object) ? " / 回收移动" : "";
    return `E：查看篱笆${manage}`;
  }
  if (buildableItemIdForObject(object)) {
    return isPlacedBuildableObject(object) ? "E：查看装饰 / 回收移动" : `E：查看${buildableObjectName(object)}`;
  }
  if (object.type === "upgradeBoard") return objectFeatureUnlocked(object) ? "E：打开建造商店" : "E：查看未修复公告牌";
  if (object.type === "warp") return "站上去自动传送，或按 E 传送";
  if (object.type === "well") return "E / 水壶 Space：补满水壶";
  if (object.type === "bed") return "E：睡觉到明天";
  if (object.type === "mailbox") return unreadMailCount() > 0 ? `E：查看邮箱（${unreadMailCount()} 封未读）` : "E：查看邮箱";
  if (object.type === "marketStall") return "E：查看助农集市摊位";
  if (object.type === "basketPoint") {
    const order = COMMUNITY_ORDERS.basketPoint;
    return communityOrderComplete(order) ? "E：查看安心菜篮结果" : `E：提交安心菜篮 ${communityOrderProgress(order)}/${order.target}`;
  }
  if (object.type === "tastingTable") {
    const order = COMMUNITY_ORDERS.tastingTable;
    return communityOrderComplete(order) ? "E：查看试吃结果" : `E：提交茶铺试吃 ${communityOrderProgress(order)}/${order.target}`;
  }
  if (object.type === "ecommerceDesk") return state.story.ecommerceDeskSeen ? "E：查看电商助农角" : "E：了解电商助农";
  if (object.type === "cooperativeDesk") {
    if (state.story.cooperativeJoined) {
      const contract = cooperativeContractForDay();
      if (cooperativeExpansionEnabled() && cooperativeContractClaimed(contract)) {
        return `E：查看合作社扩张 ${cooperativeExpansionProgress()} 张`;
      }
      return cooperativeContractClaimed(contract)
        ? "E：查看已结算合作社合同"
        : `E：合作社合同 ${cooperativeContractSubmitted(contract)}/${contract.target}`;
    }
    return state.story.cooperativeJoined
      ? "E：查看合作社登记"
      : `E：提交合作社样品 ${cooperativeCropSubmittedCount()}/${COOPERATIVE_TRIAL.cropTarget} 作物`;
  }
  if (object.type === "tourismDesk") {
    return state.story.tourismFirstOrderCompleted
      ? "E：查看游客服务记录"
      : `E：游客订单 ${tourismCropSubmittedCount()}/${TOURISM_ORDER.cropTarget} 作物`;
  }
  if (object.type === "brandDesk") {
    return state.story.brandFirstShipmentSettled
      ? "E：查看品牌出货记录"
      : `E：制作品牌礼盒 ${state.inventory.goods[BRAND_PACK_GOOD_ID] ?? 0} 个`;
  }
  if (object.type === "irrigationPump") {
    return state.story.irrigationFirstProjectCompleted ? "E：查看水渠状态 / 补水" : "E：启动水渠工程";
  }
  if (object.type === "resourceNode") {
    const def = resourceNodeDef(object);
    if (state.day < 11) return `E：查看${def.name}（第11天后开放）`;
    const remaining = resourceNodeRemaining(object);
    return remaining > 0 ? `E：采集${def.name} ${remaining}/${def.maxPerDay}` : `E：查看${def.name}（今日已采完）`;
  }
  if (object.type === "springFairStall") {
    return springFairIsOpen() ? "E：参加春集种子会" : "E：查看春集预告";
  }
  if (object.type === "springSampleCrate") {
    if (!springSampleBundleUnlocked()) return "E：查看春季样本箱预告";
    return state.story.springSampleBundleCompleted ? "E：查看春季样本记录" : "E：提交春季样本";
  }
  if (object.type === "landShrine") {
    return landShrineFinalReady() ? "E：问土地庙为什么知道这些" : "E：听土地庙提示";
  }
  if (object.type === "issueBoard") return "E：查看村情记录";
  if (object.type === "communityFacility") return `E：查看${object.name ?? communityFacilityDef(object.goalId).name}`;
  if (object.type === "directionSign") return `E：查看${object.name ?? "路牌"}`;
  return `E：交互 ${object.type}`;
}

function editorActionHint() {
  const hover = editor.hoverTile;
  const coord = hover ? `${hover.x}, ${hover.y}` : "移动鼠标选择格子";
  if (editor.layer === "objects") {
    if (editor.tool === "select") return `选择对象：${coord}`;
    if (editor.tool === "erase") return `删除对象：${coord}`;
    return `放置 ${editor.objectType}：${coord}`;
  }
  if (editor.tool === "select") return "选择工具只用于 objects 图层";
  if (editor.layer === "collision") return editor.tool === "erase" ? `清除阻挡：${coord}` : `设置阻挡：${coord}`;
  if (editor.tool === "erase") return `清除 ${editor.layer}：${coord}`;
  return `绘制 ${editor.layer} tile ${editor.tileId}：${coord}`;
}

function gameplayActionHint() {
  const underfoot = playerTile();
  const front = facingTile();
  const map = currentMap();
  const frontNpc = npcAtTile(front.x, front.y);
  const frontObject = objectAtTile(front.x, front.y);
  const underfootCrop = cropAtTile(underfoot.x, underfoot.y);
  const groundTile = map.layers.ground[underfoot.y]?.[underfoot.x];
  const isBlocked = map.layers.collision[underfoot.y]?.[underfoot.x] === 1;

  if (frontNpc) return `E：和 ${frontNpc.name} 对话`;
  if (state.selectedTool === "hand") {
    if (frontObject) return objectActionHint(frontObject);
    return `脚下 ${groundNameAt(underfoot)} · Shift 跑步 · Q 任务面板 · 1-6 切换工具`;
  }

  if (state.selectedTool === "hoe") {
    if (!canFarmOnCurrentMap()) return "锄头只能在农场地块使用";
    if ((groundTile === TILE.grass || groundTile === TILE.grassDark) && !isBlocked) return "Space：锄脚下草地";
    if (groundTile === TILE.dirt && !underfootCrop && !isBlocked) return "Space：把脚下泥土恢复成草地";
    if (underfootCrop) return `脚下有${cropStatusText(underfootCrop)}，不能锄地`;
    return "锄头：站到草地或空泥土地上按 Space";
  }

  if (state.selectedTool === "seeds") {
    const def = cropDef(state.selectedSeed);
    if (!canFarmOnCurrentMap()) return "种子只能在农场地块播种";
    if ((state.inventory.seeds[def.id] ?? 0) <= 0) return `${def.seedName}不足，可去村庄种子铺购买`;
    if (!isCropInSeason(def.id)) return `${def.seedName}适合${cropSeasonText(def.id)}播种`;
    if (underfootCrop) return `脚下已有${cropStatusText(underfootCrop)}`;
    if (groundTile === TILE.dirt && !isBlocked) return `Space：播种${def.name}`;
    return "种子：站到泥土地上按 Space";
  }

  if (state.selectedTool === "wateringCan") {
    const source = nearbyWaterSource();
    const capacity = wateringCanCapacityForStory();
    if (source && state.wateringCanWater < capacity) return `Space：在${source.label}补水`;
    if (state.wateringCanWater <= 0) return "水壶没水了，面对水边或水井补水";
    const target = cropTargetTile();
    const crop = cropAtTile(target.x, target.y);
    if (!crop && source) return `水壶已满 ${state.wateringCanWater}/${capacity}`;
    if (!crop) return "水壶：站在作物上或面对作物";
    if (crop.ready) return `${cropDef(crop.cropId).name}已成熟，切换镰刀收获`;
    if (crop.watered) return `${cropDef(crop.cropId).name}今天已经浇水`;
    return `Space：给${cropDef(crop.cropId).name}浇水`;
  }

  if (state.selectedTool === "scythe") {
    const target = cropTargetTile();
    const crop = cropAtTile(target.x, target.y);
    if (!crop) return "镰刀：站在成熟作物上或面对成熟作物";
    if (!crop.ready) return `${cropDef(crop.cropId).name}还没成熟`;
    return `Space：收获${cropDef(crop.cropId).name}`;
  }

  if (state.selectedTool === "fishingRod") {
    const target = fishingWaterTarget();
    if (!target) return "钓竿：面对池塘、村塘或山溪水面按 Space";
    const names = fishAvailableAt(target.location.id)
      .slice(0, 3)
      .map((fish) => fish.name)
      .join("、");
    return `Space：在${target.location.label}钓鱼 · 水质${waterQualityLabel()} · 可见 ${names || "暂无鱼"}`;
  }

  return "E 交互，Space 使用当前工具，Q 任务面板，Shift 跑步";
}

function updateActionHint() {
  if (fishing.active) {
    ui.actionHint.textContent =
      fishing.phase === "waiting" ? "钓鱼：等待 HIT，Esc 收杆" : "钓鱼：按住 Space 钓鱼条上升，松开下降，Esc 收杆";
    return;
  }
  ui.actionHint.textContent = editor.enabled ? editorActionHint() : state.build.placing ? buildPlacementHint() : gameplayActionHint();
}

function useSelectedTool() {
  const tile = playerTile();
  if (state.selectedTool === "hand") {
    setPlayerMotion("inspect", PLAYER_ACTION_DURATIONS.inspect);
    addLog("当前工具是手。切换到锄头、种子、水壶或镰刀后按 Space 使用工具。");
    addToolFeedback(facingTile(), "使用 E 交互", "info");
    return;
  }
  if (state.selectedTool === "wateringCan") {
    const source = nearbyWaterSource();
    if (source && state.wateringCanWater < wateringCanCapacityForStory()) {
      refillWateringCan(source);
      return;
    }
  }
  if (!hasEnergyForTool(state.selectedTool)) {
    addToolFeedback(toolTargetInfo().tile, "体力不足", "bad");
    return;
  }
  let used = false;
  if (state.selectedTool === "hoe") used = hoeTile(tile);
  if (state.selectedTool === "seeds") used = plantSeed(tile);
  if (state.selectedTool === "wateringCan") {
    const target = cropTargetTile();
    used = waterCrop(target);
    if (!used && !cropAtTile(target.x, target.y)) {
      addLog("附近没有可浇水的作物。");
      addToolFeedback(target, "没有作物", "bad");
    }
  }
  if (state.selectedTool === "scythe") {
    const target = cropTargetTile();
    used = harvestCrop(target);
    if (!used && !cropAtTile(target.x, target.y)) {
      addLog("附近没有可收获的作物。");
      addToolFeedback(target, "没有作物", "bad");
    }
  }
  if (state.selectedTool === "fishingRod") used = startFishing();
  if (used) {
    if (state.selectedTool !== "fishingRod") setPlayerMotion(state.selectedTool, PLAYER_ACTION_DURATIONS[state.selectedTool] ?? 520);
    spendForTool(state.selectedTool);
  }
}

function grantQuestReward(quest) {
  const gold = effectiveQuestGoldReward(quest);
  if (gold > 0) state.inventory.gold += gold;
  if ((quest.rewardSeeds ?? 0) > 0) addSeedCount(quest.rewardSeedCropId, quest.rewardSeeds);
  if ((quest.rewardMaxEnergy ?? 0) > 0) {
    state.abilities.maxEnergyBonus += quest.rewardMaxEnergy;
    state.energy = Math.min(maxEnergy(), state.energy + quest.rewardMaxEnergy);
  }
  if ((quest.rewardWateringCanCapacity ?? 0) > 0) {
    state.abilities.wateringCanBonus += quest.rewardWateringCanCapacity;
    state.wateringCanWater = wateringCanCapacityForStory();
  }
  for (const [toolId, count] of Object.entries(quest.rewardToolUpgrades ?? {})) {
    if (!TOOL_UPGRADE_IDS.includes(toolId) || count <= 0) continue;
    state.abilities.toolLevels[toolId] = Math.min(TOOL_MAX_LEVEL, toolLevel(toolId) + count);
  }
  for (const cropId of quest.rewardSeedUnlocks ?? []) {
    state.abilities.unlockedSeeds[cropDef(cropId).id] = true;
  }
}

function syncAbilityRewardsFromCompletedQuests() {
  const minimum = createDefaultAbilities();
  for (const quest of Object.values(state.quests ?? {})) {
    if (quest.status !== "completed") continue;
    minimum.maxEnergyBonus += quest.rewardMaxEnergy ?? 0;
    minimum.wateringCanBonus += quest.rewardWateringCanCapacity ?? 0;
    for (const [toolId, count] of Object.entries(quest.rewardToolUpgrades ?? {})) {
      if (!TOOL_UPGRADE_IDS.includes(toolId)) continue;
      minimum.toolLevels[toolId] = Math.min(TOOL_MAX_LEVEL, (minimum.toolLevels[toolId] ?? 1) + count);
    }
    for (const cropId of quest.rewardSeedUnlocks ?? []) {
      minimum.unlockedSeeds[cropDef(cropId).id] = true;
    }
  }
  state.abilities.maxEnergyBonus = Math.max(state.abilities.maxEnergyBonus ?? 0, minimum.maxEnergyBonus);
  state.abilities.wateringCanBonus = Math.max(state.abilities.wateringCanBonus ?? 0, minimum.wateringCanBonus);
  for (const toolId of TOOL_UPGRADE_IDS) {
    state.abilities.toolLevels[toolId] = Math.max(toolLevel(toolId), minimum.toolLevels[toolId] ?? 1);
  }
  for (const cropId of CROP_IDS) {
    if (minimum.unlockedSeeds[cropId]) state.abilities.unlockedSeeds[cropId] = true;
  }
  ensureCurrentEnergyWithinMax();
  ensureCurrentWaterWithinCapacity();
}

function unlockQuestFacility(quest) {
  const goalId = quest?.unlockIssueGoalId;
  if (!goalId || !VILLAGE_ISSUE_GOALS[goalId]) return "";
  const facility = communityFacilityDef(goalId);
  if (villageIssueGoalComplete(goalId)) return `${facility.name}已经在村子里运行。`;
  if (!state.story.villageIssueGoals) state.story.villageIssueGoals = createDefaultVillageIssueGoals();
  state.story.villageIssueGoals[goalId] = true;
  if (goalId === "waterCleanup") state.story.waterQuality = Math.max(currentWaterQuality(), 1);
  ensureVillageIssueGoalFacilities();
  if (state.mapId === "village") {
    addVisualEffect({ x: facility.x, y: facility.y }, "quest", { color: facility.color, duration: 1100 });
  }
  addLog(`支线解锁设施：${facility.name}`);
  return `设施解锁：${facility.name}。\n\n${facility.result}`;
}

function turnInQuest(questId) {
  const quest = state.quests[questId];
  if (!quest || quest.status !== "readyToTurnIn") return false;
  if (quest.type === "delivery") {
    const owned = state.inventory.crops[quest.requiredCropId] ?? 0;
    if (owned < quest.target) {
      quest.status = "active";
      updateAllHud();
      showDialog("任务", `背包里的${cropDef(quest.requiredCropId).name}不足，先准备 ${quest.target} 个。`);
      playSound("error");
      return false;
    }
    state.inventory.crops[quest.requiredCropId] -= quest.target;
  }
  quest.status = "completed";
  grantQuestReward(quest);
  const facilityText = unlockQuestFacility(quest);
  updateAllHud();
  const npc = state.npcs.find((item) => item.id === quest.npcId);
  const pages = npc ? npcQuestPages(npc, quest, "ready") : [quest.dialog.ready, `奖励：${questRewardText(quest)}`];
  if (facilityText) pages.push(facilityText);
  showPagedDialog(npc?.name ?? "任务", pages);
  addLog(`任务完成：${quest.title}`);
  addScreenEffect("quest", "任务完成");
  playSound("quest");
  scheduleAutosave("任务完成");
  return true;
}

function interactWithNpc(npc) {
  normalizeQuestState();
  setPlayerMotion("inspect", 420);
  setNpcTalkMotion(npc);
  const quest = nextNpcQuest(npc);
  const lockedQuest = nextLockedNpcQuest(npc);

  if (!quest) {
    showPagedDialog(npc.name, lockedQuest ? npcLockedQuestPages(npc, lockedQuest) : npcIdlePages(npc));
    addLog(`和 ${npc.name} 交谈。`);
    return;
  }

  if (quest.status === "notStarted") {
    quest.status = "active";
    normalizeQuestState();
    updateAllHud();
    showPagedDialog(npc.name, npcQuestPages(npc, quest, "offer"));
    addLog(`接受任务：${quest.title}`);
    scheduleAutosave("接受任务");
    return;
  }

  if (quest.status === "active") {
    showPagedDialog(npc.name, npcQuestPages(npc, quest, "active"));
    addLog(`任务进度：${getQuestProgress(quest)}/${quest.target}`);
    return;
  }

  if (quest.status === "readyToTurnIn") {
    turnInQuest(quest.id);
    return;
  }

  showPagedDialog(npc.name, npcQuestPages(npc, quest, "completed"));
  addLog(`和 ${npc.name} 交谈。`);
}

function interact() {
  const target = facingTile();
  const npc = npcAtTile(target.x, target.y);
  if (npc) {
    interactWithNpc(npc);
    return;
  }

  const object = objectAtTile(target.x, target.y);
  if (!object) {
    return;
  }
  setPlayerMotion(object.type === "bed" ? "sleep" : object.type === "warp" ? "warp" : "inspect", 520);

  if (object.type === "ruin") {
    repairRuin(object);
    return;
  }
  if (object.type === "sign") {
    readSign(object);
  }
  if (object.type === "chest") {
    showDialog("箱子", object.items);
    addLog(`打开箱子：${object.items.join("、")}`);
  }
  if (object.type === "seedShop") {
    if (!state.story.firstSeedShopVisited) {
      state.story.firstSeedShopVisited = true;
      addVisualEffect({ x: object.x, y: object.y }, "quest", { color: "#e7b34d", duration: 700 });
      updateAllHud();
      scheduleAutosave("第一次查看村庄种子铺");
    }
    showShopDialog("", object.name ?? "村庄种子铺", SHOP_DIALOG_MODES.seeds);
    addLog("打开村庄种子铺。");
  }
  if (object.type === "shop") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showShopDialog("", object.name ?? "村庄杂货铺", SHOP_DIALOG_MODES.grocery);
    addLog("打开村庄杂货铺。");
  }
  if (object.type === "shippingBin") {
    showShippingDialog();
    addLog("打开出货箱。");
  }
  if (object.type === "kitchen") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showProcessingDialog();
    addLog("打开厨房加工台。");
  }
  if (object.type === "processor" || object.type === "dryer") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showProcessorDialog(object);
    addLog(`打开${stationNameForObject(object)}。`);
  }
  if (buildableItemIdForObject(object) && !isMachineBuildableObject(object)) {
    showBuildableObjectDialog(object);
    addLog(`查看${buildableObjectName(object)}。`);
  }
  if (object.type === "upgradeBoard") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showUpgradeDialog();
    addLog("打开建造商店。");
  }
  if (object.type === "well") refillWateringCan({ type: "well", label: object.name ?? "水井" });
  if (object.type === "bed") {
    addLog("躺下休息。");
    sleepToNextDay();
  }
  if (object.type === "mailbox") {
    showMailboxDialog();
    addLog("查看邮箱。");
  }
  if (object.type === "marketStall") {
    showDialog("助农集市摊位", "临时摊位已经搭起来了。这里会承接村民的菜篮、试吃和节气小单。");
    addLog("查看助农集市摊位。");
  }
  if (object.type === "basketPoint") {
    showCommunityOrderDialog(object);
    addLog("查看安心菜篮点。");
  }
  if (object.type === "tastingTable") {
    showCommunityOrderDialog(object);
    addLog("查看茶铺试吃桌。");
  }
  if (object.type === "ecommerceDesk") {
    state.story.ecommerceDeskSeen = true;
    showEcommerceDialog();
    addLog("查看电商助农角。");
  }
  if (object.type === "cooperativeDesk") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showCooperativeDialog();
    addLog("查看合作社窗口。");
  }
  if (object.type === "tourismDesk") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showTourismDialog();
    addLog("查看游客服务亭。");
  }
  if (object.type === "brandDesk") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showBrandDialog();
    addLog("查看品牌包装台。");
  }
  if (object.type === "irrigationPump") {
    if (!objectFeatureUnlocked(object)) {
      showLockedObjectDialog(object);
      return;
    }
    showIrrigationDialog();
    addLog("查看水利水泵。");
  }
  if (object.type === "resourceNode") {
    showResourceNodeDialog(object);
    addLog(`查看${object.name ?? resourceNodeDef(object).name}。`);
  }
  if (object.type === "springFairStall") {
    showSpringFairDialog();
    addLog("查看春集种子会。");
  }
  if (object.type === "springSampleCrate") {
    showSpringSampleBundleDialog();
    addLog("查看春季样本箱。");
  }
  if (object.type === "landShrine") {
    showLandShrineDialog();
    addLog("查看土地庙。");
  }
  if (object.type === "issueBoard") showIssueBoardDialog();
  if (object.type === "communityFacility") showCommunityFacilityDialog(object);
  if (object.type === "directionSign") showDirectionSignDialog(object);
  if (object.type === "warp") warpTo(object.toMap, object.to.x, object.to.y);
}

function plantOrGrowCrop() {
  plantSeed(playerTile());
}

function maybeTriggerVillageFeedback() {
  if (state.mapId !== "village") return;
  if (!state.story.firstShipmentSettled || state.story.villageFeedbackSeen) return;
  const sign = maps.village.objects.find((object) => object.storyId === "firstShipmentFeedback");
  if (!sign) return;
  const rewardText = grantFirstFeedbackReward();
  state.story.villageFeedbackSeen = true;
  addLog("村庄广场贴出了第一批出货反馈。");
  addVisualEffect({ x: sign.x, y: sign.y }, "quest", { color: "#70b77e", duration: 1000 });
  playSound("quest");
  updateAllHud();
  showDialog("村庄反馈", `${storySignText(sign)}${rewardText ? `\n\n${rewardText}` : ""}`);
  scheduleAutosave("查看村庄反馈");
}

function maybeShowVillageIntro() {
  if (state.mapId !== "village" || state.story.firstVillageVisitSeen) return;
  state.story.firstVillageVisitSeen = true;
  addLog("第一次到村庄：左上是种子铺，右上是停业杂货铺；村情记录板在 14,17；春集和样本箱在广场西南；池塘在东南。");
  addToolFeedback(playerTile(), "初访村庄", "info");
  updateAllHud();
  scheduleAutosave("第一次进村导览");
}

function warpTo(mapId, tileX, tileY) {
  state.mapId = mapId;
  state.player.x = tileX * TILE_SIZE + TILE_SIZE / 2;
  state.player.y = tileY * TILE_SIZE + TILE_SIZE / 2;
  interaction.warpCooldown = 0.45;
  closeDialog();
  ensurePlayerCanMove("传送落点修正");
  addVisualEffect(playerTile(), "warp");
  addScreenEffect("warp", maps[mapId].name);
  playSound("warp");
  addLog(`传送到 ${maps[mapId].name}`);
  scheduleAutosave("传送");
  maybeShowVillageIntro();
  maybeTriggerVillageFeedback();
}

function checkAutoWarp(dt) {
  interaction.warpCooldown = Math.max(0, interaction.warpCooldown - dt);
  if (interaction.warpCooldown > 0) return;

  const tile = playerTile();
  const object = objectAtTile(tile.x, tile.y);
  if (object?.type === "warp") warpTo(object.toMap, object.to.x, object.to.y);
}

function serializedGameState() {
  return {
    version: 1,
    appVersion: APP_VERSION,
    savedAt: new Date().toISOString(),
    mapId: state.mapId,
    player: state.player,
    dynamicObjects: state.dynamicObjects,
    selectedTool: state.selectedTool,
    selectedSeed: state.selectedSeed,
    wateringCanWater: state.wateringCanWater,
    inventory: state.inventory,
    abilities: state.abilities,
    day: state.day,
    timeMinutes: state.timeMinutes,
    energy: state.energy,
    weather: state.weather,
    tomorrowWeather: state.tomorrowWeather,
    dailyOrder: state.dailyOrder,
    machines: state.machines,
    build: {
      selectedItem: state.build.selectedItem,
      nextId: state.build.nextId,
      inventory: state.build.inventory,
    },
    npcs: state.npcs,
    quests: state.quests,
    upgrades: state.upgrades,
    mailbox: state.mailbox,
    collection: state.collection,
    achievements: state.achievements,
    settings: state.settings,
    story: state.story,
    maps: serializeMaps(),
  };
}

function normalizeSaveSlotId(slotId) {
  return SAVE_SLOT_IDS.includes(slotId) ? slotId : DEFAULT_SAVE_SLOT;
}

function saveSlotLabel(slotId = activeSaveSlot) {
  return SAVE_SLOT_LABELS[normalizeSaveSlotId(slotId)];
}

function saveKeyForSlot(slotId = activeSaveSlot) {
  return `${SAVE_SLOT_PREFIX}${normalizeSaveSlotId(slotId)}`;
}

function currentSaveKey() {
  return saveKeyForSlot(activeSaveSlot);
}

function readSavePayload(raw) {
  const save = JSON.parse(raw);
  if (!save || typeof save !== "object") throw new Error("存档 JSON 顶层必须是对象。");
  return save;
}

function saveSlotRaw(slotId = activeSaveSlot) {
  const raw = localStorage.getItem(saveKeyForSlot(slotId));
  if (raw) return raw;
  if (slotId === DEFAULT_SAVE_SLOT) return localStorage.getItem(SAVE_KEY);
  return null;
}

function saveSlotSummary(slotId) {
  const raw = saveSlotRaw(slotId);
  if (!raw) return `${saveSlotLabel(slotId)}：空`;
  try {
    const save = readSavePayload(raw);
    const gold = save.inventory?.gold ?? 0;
    const day = save.day ?? "?";
    const map = maps[save.mapId]?.name ?? save.mapId ?? "未知地图";
    const savedAt = save.savedAt ? new Date(save.savedAt).toLocaleString("zh-CN", { hour12: false }) : "旧存档";
    return `${saveSlotLabel(slotId)}：第 ${day} 天 · ${gold}g · ${map} · ${savedAt}`;
  } catch {
    return `${saveSlotLabel(slotId)}：存档损坏`;
  }
}

function updateSaveSlotHud() {
  ui.saveSlotLabel.textContent = saveSlotLabel(activeSaveSlot);
  ui.saveSlotSelect.value = activeSaveSlot;
  ui.saveSlotInfo.textContent = saveSlotSummary(activeSaveSlot);
  for (const option of ui.saveSlotSelect.options) {
    option.textContent = saveSlotSummary(option.value);
  }
}

function migrateLegacySaveIfNeeded() {
  if (localStorage.getItem(saveKeyForSlot(DEFAULT_SAVE_SLOT))) return;
  const legacy = localStorage.getItem(SAVE_KEY);
  if (!legacy) return;
  localStorage.setItem(saveKeyForSlot(DEFAULT_SAVE_SLOT), legacy);
}

function initializeSaveSystem() {
  migrateLegacySaveIfNeeded();
  activeSaveSlot = normalizeSaveSlotId(localStorage.getItem(ACTIVE_SAVE_SLOT_KEY));
  localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, activeSaveSlot);
  updateSaveSlotHud();
}

function saveClockLabel() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function setSaveStatus(text) {
  ui.saveStatus.dataset.test = debug.testSkipActive ? "true" : "false";
  ui.saveStatus.textContent = text;
}

function cancelAutosave() {
  if (!autosaveTimer) return;
  clearTimeout(autosaveTimer);
  autosaveTimer = null;
}

function writeSave({ log = false, label = "已保存" } = {}) {
  const payload = JSON.stringify(serializedGameState());
  localStorage.setItem(currentSaveKey(), payload);
  if (activeSaveSlot === DEFAULT_SAVE_SLOT) localStorage.setItem(SAVE_KEY, payload);
  localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, activeSaveSlot);
  updateSaveSlotHud();
  setSaveStatus(`${label}到${saveSlotLabel()}：${saveClockLabel()}`);
  if (log) addLog(`存档已写入 ${saveSlotLabel()}。`);
}

function scheduleAutosave(reason = "状态更新") {
  if (debug.testSkipActive) {
    setSaveStatus(`测试跳过：已拦截自动保存（${reason}）`);
    return;
  }
  cancelAutosave();
  setSaveStatus(`自动保存等待中：${reason}`);
  autosaveTimer = setTimeout(() => {
    autosaveTimer = null;
    writeSave({ label: "自动保存" });
  }, AUTO_SAVE_DELAY);
}

function saveGame() {
  debug.testSkipActive = false;
  cancelAutosave();
  writeSave({ log: true, label: "手动保存" });
}

function applyLoadedSave(save) {
  debug.testSkipActive = false;
  clearEditorHistory();
  resetMapsToBase();
  const restoredMaps = restoreSavedMaps(save.maps);
  state.mapId = maps[save.mapId] ? save.mapId : "farm";
  const savedPlayer = save.player && typeof save.player === "object" ? save.player : {};
  state.player = { ...state.player, ...savedPlayer };
  state.player.speed = Math.max(DEFAULT_PLAYER_SPEED, Number(state.player.speed) || DEFAULT_PLAYER_SPEED);
  state.selectedTool = save.selectedTool && toolsById[save.selectedTool] ? save.selectedTool : "hand";
  state.selectedSeed = CROP_TYPES[save.selectedSeed] ? save.selectedSeed : DEFAULT_CROP_ID;
  state.story = normalizeStoryState(save.story);
  state.abilities = normalizeAbilities(save.abilities);
  state.wateringCanWater = normalizeWateringCanWater(save.wateringCanWater, state.story, state.abilities);
  state.inventory = normalizeInventory(save.inventory ?? {});
  state.day = save.day ?? 1;
  state.timeMinutes = save.timeMinutes ?? DAY_START_MINUTES;
  const savedEnergy = Number(save.energy);
  state.energy = Number.isFinite(savedEnergy) ? Math.max(0, Math.min(maxEnergy(), savedEnergy)) : maxEnergy();
  state.weather = WEATHER[save.weather] ? save.weather : "sunny";
  state.tomorrowWeather = WEATHER[save.tomorrowWeather] ? save.tomorrowWeather : nextWeatherForDay(state.day + 1);
  state.dailyOrder = save.dailyOrder?.day === state.day ? normalizeDailyOrder(save.dailyOrder) : createDailyOrder(state.day);
  state.machines = normalizeMachines(save.machines);
  state.build = normalizeBuildState(save.build);
  state.npcs = normalizeNpcs(save.npcs);
  state.quests = normalizeQuestCollection(save.quests);
  state.upgrades = normalizeUpgrades(save.upgrades);
  state.mailbox = normalizeMailState(save.mailbox);
  state.collection = normalizeCollection(save.collection);
  state.achievements = normalizeAchievements(save.achievements);
  state.settings = normalizeSettings(save.settings);
  inferCollectionFromInventory();
  syncStoryProgressFromState();
  if (!restoredMaps.farm) applyFarmUpgrades();
  ensureVillageAccess();
  ensureMountainAccess();
  ensureMapIdentityDetails();
  ensureDirectionSigns();
  removeFixedFarmFences(maps.farm);
  enforceEarlyRuinState();
  state.dynamicObjects = (save.dynamicObjects ?? []).map((obj) => (obj.type === "crop" ? normalizeCropObject(obj) : obj));
  ensurePlayerCanMove("读档脱困");
  updateAllHud();
}

function loadGame() {
  cancelAutosave();
  const raw = saveSlotRaw(activeSaveSlot);
  if (!raw) {
    addLog(`${saveSlotLabel()} 没有存档。`);
    setSaveStatus(`读取失败：${saveSlotLabel()} 为空`);
    return;
  }
  try {
    applyLoadedSave(readSavePayload(raw));
    localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, activeSaveSlot);
    setSaveStatus(`已读取${saveSlotLabel()}：${saveClockLabel()}`);
    addLog(`已读取 ${saveSlotLabel()}。`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    addLog(`读取失败：${message}`);
    setSaveStatus(`读取失败：${saveSlotLabel()}`);
    showDialog("读取失败", message);
  }
}

function resetGame() {
  debug.testSkipActive = false;
  cancelAutosave();
  clearEditorHistory();
  localStorage.removeItem(currentSaveKey());
  if (activeSaveSlot === DEFAULT_SAVE_SLOT) localStorage.removeItem(SAVE_KEY);
  resetMapsToBase();
  state.mapId = "farm";
  const spawn = tileCenter(maps.farm.spawn.x, maps.farm.spawn.y);
  state.player.x = spawn.x;
  state.player.y = spawn.y;
  state.player.speed = DEFAULT_PLAYER_SPEED;
  state.player.facing = "down";
  state.dynamicObjects = [];
  state.selectedTool = "hand";
  state.selectedSeed = DEFAULT_CROP_ID;
  state.wateringCanWater = WATERING_CAN_CAPACITY;
  state.inventory = createDefaultInventory();
  state.abilities = createDefaultAbilities();
  state.day = 1;
  state.timeMinutes = DAY_START_MINUTES;
  state.energy = maxEnergy();
  state.weather = "sunny";
  state.tomorrowWeather = "rainy";
  state.dailyOrder = createDailyOrder(1);
  state.machines = createDefaultMachines();
  state.build = createDefaultBuildState();
  state.npcs = createDefaultNpcs();
  state.quests = createDefaultQuests();
  state.upgrades = createDefaultUpgrades();
  state.mailbox = createDefaultMailState();
  state.collection = createDefaultCollection();
  state.achievements = createDefaultAchievements();
  state.settings = createDefaultSettings();
  state.story = createDefaultStoryState();
  updateAllHud();
  setSaveStatus(`${saveSlotLabel()} 已重置，自动保存待机`);
  addLog(`已重置演示状态，并清除 ${saveSlotLabel()}。`);
}

function selectSaveSlot(slotId) {
  cancelAutosave();
  activeSaveSlot = normalizeSaveSlotId(slotId);
  localStorage.setItem(ACTIVE_SAVE_SLOT_KEY, activeSaveSlot);
  updateSaveSlotHud();
  setSaveStatus(`已切换到${saveSlotLabel()}，点击读取可载入该槽`);
  addLog(`当前存档槽：${saveSlotLabel()}。`);
}

function exportSaveJson() {
  ui.saveJsonOutput.value = JSON.stringify(serializedGameState(), null, 2);
  addLog(`已导出当前游戏状态，可导入到任意存档槽。`);
}

function importSaveJson() {
  cancelAutosave();
  try {
    const save = readSavePayload(ui.saveJsonOutput.value);
    applyLoadedSave(save);
    writeSave({ label: "导入保存" });
    setSaveStatus(`已导入到${saveSlotLabel()}：${saveClockLabel()}`);
    addLog(`存档 JSON 已导入 ${saveSlotLabel()}。`);
    closeDialog();
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    addLog(`导入存档失败：${message}`);
    setSaveStatus(`导入失败：${saveSlotLabel()}`);
    showDialog("导入存档失败", message);
  }
}

function clearCurrentSaveSlot() {
  cancelAutosave();
  localStorage.removeItem(currentSaveKey());
  if (activeSaveSlot === DEFAULT_SAVE_SLOT) localStorage.removeItem(SAVE_KEY);
  ui.saveJsonOutput.value = "";
  updateSaveSlotHud();
  setSaveStatus(`${saveSlotLabel()} 已清除`);
  addLog(`${saveSlotLabel()} 已清除，当前游戏画面不变。`);
}

function mapSnapshotsEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function updateEditorHistoryHud() {
  ui.editorUndoBtn.disabled = editor.undoStack.length === 0;
  ui.editorRedoBtn.disabled = editor.redoStack.length === 0;
  ui.editorHistoryStatus.textContent =
    editor.undoStack.length === 0 && editor.redoStack.length === 0
      ? "无可撤销操作"
      : `可撤销 ${editor.undoStack.length} · 可重做 ${editor.redoStack.length}`;
}

function recordEditorHistory(mapId, before, after, label) {
  if (!maps[mapId] || !before || !after || mapSnapshotsEqual(before, after)) {
    updateEditorHistoryHud();
    return false;
  }
  editor.undoStack.push({ mapId, before, after, label });
  if (editor.undoStack.length > EDITOR_HISTORY_LIMIT) editor.undoStack.shift();
  editor.redoStack = [];
  updateEditorHistoryHud();
  scheduleAutosave(label);
  return true;
}

function beginEditorHistory(label) {
  if (editor.historyDraft) return;
  editor.historyDraft = {
    mapId: state.mapId,
    label,
    before: cloneMapForSave(currentMap()),
  };
}

function endEditorHistory() {
  if (!editor.historyDraft) return;
  const draft = editor.historyDraft;
  editor.historyDraft = null;
  if (!maps[draft.mapId]) return;
  recordEditorHistory(draft.mapId, draft.before, cloneMapForSave(maps[draft.mapId]), draft.label);
}

function cancelEditorHistoryDraft() {
  editor.historyDraft = null;
}

function clearEditorHistory() {
  editor.undoStack = [];
  editor.redoStack = [];
  cancelEditorHistoryDraft();
  updateEditorHistoryHud();
}

function restoreEditorHistorySnapshot(entry, snapshot, actionLabel) {
  maps[entry.mapId] = cloneMapForSave(snapshot);
  state.mapId = entry.mapId;
  editor.hoverTile = null;
  editor.isPainting = false;
  cancelEditorHistoryDraft();
  setSelectedObjectTile(null);
  closeDialog();
  if (!ensurePlayerCanMove(`${actionLabel}脱困`)) updateAllHud();
  ui.mapJsonOutput.value = exportCurrentMap();
  addLog(`${actionLabel}：${entry.label}`);
  scheduleAutosave(actionLabel);
}

function undoEditorChange() {
  const entry = editor.undoStack.pop();
  if (!entry) return;
  editor.redoStack.push(entry);
  restoreEditorHistorySnapshot(entry, entry.before, "撤销");
  updateEditorHistoryHud();
}

function redoEditorChange() {
  const entry = editor.redoStack.pop();
  if (!entry) return;
  editor.undoStack.push(entry);
  restoreEditorHistorySnapshot(entry, entry.after, "重做");
  updateEditorHistoryHud();
}

function resetCurrentMap() {
  cancelAutosave();
  const mapId = maps[state.mapId] ? state.mapId : "farm";
  const before = cloneMapForSave(maps[mapId]);
  state.mapId = mapId;
  if (mapId === "farm") {
    maps.farm = buildFarmMap();
    applyFarmUpgrades();
  } else if (mapId === "house") {
    maps.house = buildHouseMap();
  } else if (mapId === "village") {
    maps.village = buildVillageMap();
  } else if (mapId === "mountain") {
    maps.mountain = buildMountainMap();
  }
  ensureMountainAccess();
  ensureMapIdentityDetails();
  ensureDirectionSigns();
  if (state.story.marketPrepCompleted) ensureMarketSetup();
  if (state.story.communityOrdersCompleted) ensureStableMarketSetup();
  ensureTourismSetup();
  ensureBrandSetup();
  ensureIrrigationSetup();
  if (state.story.irrigationFirstProjectCompleted) applyIrrigationProjectMapChanges();
  ensureVillageIssueGoalFacilities();

  editor.hoverTile = null;
  editor.isPainting = false;
  editor.lastSafetyWarning = "";
  setSelectedObjectTile(null);
  closeDialog();
  if (!ensurePlayerCanMove("重置地图脱困")) updateAllHud();
  ui.mapJsonOutput.value = exportCurrentMap();
  addLog(`${currentMap().name} 已恢复为默认地图。`);
  recordEditorHistory(mapId, before, cloneMapForSave(maps[mapId]), "重置当前地图");
}

function paintTile(tileX, tileY) {
  const map = currentMap();
  if (editor.layer === "objects") {
    placeMapObject(tileX, tileY);
    return;
  }
  if (!map.layers[editor.layer]?.[tileY] || map.layers[editor.layer][tileY][tileX] === undefined) return;
  if (editor.layer === "collision") {
    if (!canPaintBlockingCollision(tileX, tileY)) return;
    if (map.layers.collision[tileY][tileX] === 1) return;
    map.layers.collision[tileY][tileX] = 1;
    editor.lastSafetyWarning = "";
    return;
  }
  if (map.layers[editor.layer][tileY][tileX] === editor.tileId) return;
  map.layers[editor.layer][tileY][tileX] = editor.tileId;
  editor.lastSafetyWarning = "";
}

function clearTile(tileX, tileY) {
  const map = currentMap();
  if (editor.layer === "objects") {
    clearMapObject(tileX, tileY);
    return;
  }
  if (!map.layers[editor.layer]?.[tileY] || map.layers[editor.layer][tileY][tileX] === undefined) return;
  if (map.layers[editor.layer][tileY][tileX] === 0) return;
  map.layers[editor.layer][tileY][tileX] = 0;
  editor.lastSafetyWarning = "";
}

function defaultWarpTarget() {
  if (state.mapId === "house" || state.mapId === "village" || state.mapId === "mountain") return { toMap: "farm", to: { ...maps.farm.spawn } };
  return { toMap: "house", to: { x: 7, y: 8 } };
}

function createObjectForTile(type, tileX, tileY) {
  if (type === "sign") {
    return { type, x: tileX, y: tileY, text: `新告示牌：${tileX}, ${tileY}` };
  }
  if (type === "chest") {
    return { type, x: tileX, y: tileY, items: ["wood", "stone"] };
  }
  if (type === "seedShop") {
    return { type, x: tileX, y: tileY, name: "村庄种子铺" };
  }
  if (type === "shop") {
    return { type, x: tileX, y: tileY, name: "村庄杂货铺" };
  }
  if (type === "shippingBin") {
    return { type, x: tileX, y: tileY, name: "出货箱" };
  }
  if (type === "kitchen") {
    return { type, x: tileX, y: tileY, name: "厨房加工台" };
  }
  if (type === "processor") {
    return { type, x: tileX, y: tileY, name: "加工桶", machineId: `${state.mapId}:${tileX},${tileY}` };
  }
  if (type === "dryer") {
    return { type, x: tileX, y: tileY, name: "晾晒架", machineId: `${state.mapId}:${tileX},${tileY}` };
  }
  if (type === "flowerBox") {
    return { type, x: tileX, y: tileY, name: "花箱" };
  }
  if (type === "gardenLamp") {
    return { type, x: tileX, y: tileY, name: "小路灯" };
  }
  if (type === "bench") {
    return { type, x: tileX, y: tileY, name: "长椅" };
  }
  if (type === "fence") {
    return { type, x: tileX, y: tileY, name: "篱笆" };
  }
  if (type === "marketStall") {
    return { type, x: tileX, y: tileY, name: "助农集市摊位" };
  }
  if (type === "basketPoint") {
    return { type, x: tileX, y: tileY, name: "安心菜篮点" };
  }
  if (type === "tastingTable") {
    return { type, x: tileX, y: tileY, name: "茶铺试吃桌" };
  }
  if (type === "ecommerceDesk") {
    return { type, x: tileX, y: tileY, name: "电商助农角" };
  }
  if (type === "cooperativeDesk") {
    return { type, x: tileX, y: tileY, name: "合作社窗口" };
  }
  if (type === "tourismDesk") {
    return { type, x: tileX, y: tileY, name: "游客服务亭" };
  }
  if (type === "brandDesk") {
    return { type, x: tileX, y: tileY, name: "品牌包装台" };
  }
  if (type === "irrigationPump") {
    return { type, x: tileX, y: tileY, name: "水利水泵" };
  }
  if (type === "landShrine") {
    return { type, x: tileX, y: tileY, name: "旧土地庙" };
  }
  if (type === "resourceNode") {
    return {
      type,
      x: tileX,
      y: tileY,
      resourceId: "quarry",
      name: RESOURCE_NODE_TYPES.quarry.name,
      storyId: `mountainResource:quarry:${tileX},${tileY}`,
    };
  }
  if (type === "springFairStall") {
    return { type, x: tileX, y: tileY, name: "春集种子摊", storyId: "springFairStall" };
  }
  if (type === "springSampleCrate") {
    return { type, x: tileX, y: tileY, name: "春季样本箱", storyId: "springSampleCrate" };
  }
  if (type === "issueBoard") {
    return { type, x: tileX, y: tileY, name: "村情记录板" };
  }
  if (type === "communityFacility") {
    const def = communityFacilityDef();
    return { type, x: tileX, y: tileY, name: def.name, goalId: def.goalId, storyId: `villageIssue:${def.goalId}` };
  }
  if (type === "directionSign") {
    return { type, x: tileX, y: tileY, name: "路牌", lines: ["北：山路 / 土地庙", "东：村庄", "西：农田 / 出货箱"] };
  }
  if (type === "ruin") {
    return {
      type,
      x: tileX,
      y: tileY,
      name: "待修复废墟",
      featureId: "cooperative",
      hint: "这个地点会在后续主线中修复。",
    };
  }
  if (type === "bed") {
    return { type, x: tileX, y: tileY, name: "床" };
  }
  if (type === "mailbox") {
    return { type, x: tileX, y: tileY, name: "邮箱" };
  }
  if (type === "warp") {
    return { type, x: tileX, y: tileY, ...defaultWarpTarget() };
  }
  return { type: "sign", x: tileX, y: tileY, text: `新告示牌：${tileX}, ${tileY}` };
}

function placeMapObject(tileX, tileY) {
  const map = currentMap();
  map.objects = map.objects.filter((obj) => !(obj.x === tileX && obj.y === tileY));
  const nextObject = createObjectForTile(editor.objectType, tileX, tileY);
  map.objects.push(nextObject);
  if (isMachineBuildableObject(nextObject)) {
    const machineId = machineIdForObject(nextObject);
    if (!state.machines[machineId]) state.machines[machineId] = createMachineState(machineId);
  }
  setSelectedObjectTile({ x: tileX, y: tileY });
}

function clearMapObject(tileX, tileY) {
  const map = currentMap();
  const removed = objectAtTile(tileX, tileY);
  if (isMachineBuildableObject(removed)) delete state.machines[machineIdForObject(removed)];
  map.objects = map.objects.filter((obj) => !(obj.x === tileX && obj.y === tileY));
  if (editor.selectedObjectTile?.x === tileX && editor.selectedObjectTile?.y === tileY) setSelectedObjectTile(null);
  else syncObjectFields();
  updateObjectReadout();
}

function selectMapObject(tileX, tileY) {
  const obj = objectAtTile(tileX, tileY);
  setSelectedObjectTile(obj ? { x: tileX, y: tileY } : null);
  addLog(obj ? `选中对象：${obj.type} @ ${tileX}, ${tileY}` : `这里没有对象：${tileX}, ${tileY}`);
}

function parseWarpTarget(value) {
  const match = value.trim().match(/^(-?\d+)\s*,\s*(-?\d+)$/);
  if (!match) return null;
  return { x: Number(match[1]), y: Number(match[2]) };
}

function applyObjectProperties() {
  const obj = selectedObject();
  if (!obj || !editor.selectedObjectTile) {
    addLog("没有选中的对象。");
    return;
  }
  const before = cloneMapForSave(currentMap());

  const text = ui.objectTextInput.value.trim();
  if (obj.type === "sign") obj.text = text || "新告示牌";
  if (
    [
      "seedShop",
      "shop",
      "shippingBin",
      "kitchen",
      "processor",
      "dryer",
      "flowerBox",
      "gardenLamp",
      "bench",
      "fence",
      "marketStall",
      "basketPoint",
      "tastingTable",
      "ecommerceDesk",
      "cooperativeDesk",
      "tourismDesk",
      "brandDesk",
      "irrigationPump",
      "landShrine",
      "resourceNode",
      "springFairStall",
      "springSampleCrate",
      "issueBoard",
      "communityFacility",
      "directionSign",
      "ruin",
      "well",
      "upgradeBoard",
      "bed",
      "mailbox",
    ].includes(
      obj.type,
    )
  ) {
    obj.name = text || obj.name;
  }
  if (obj.type === "chest") {
    obj.items = ui.objectItemsInput.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (obj.type === "directionSign") {
    obj.lines = ui.objectItemsInput.value
      .split(",")
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (obj.type === "warp") {
    const targetMapId = ui.warpTargetMapSelect.value;
    const targetMap = maps[targetMapId];
    const target = parseWarpTarget(ui.warpTargetInput.value);
    if (!targetMap || !target || target.x < 0 || target.y < 0 || target.x >= targetMap.width || target.y >= targetMap.height) {
      showDialog("对象属性", "传送目标需要是目标地图范围内的坐标，例如 7, 8。");
      addLog("传送目标无效。");
      return;
    }
    obj.toMap = targetMapId;
    obj.to = target;
  }

  syncObjectFields();
  updateObjectReadout();
  addLog(`已更新对象：${obj.type} @ ${editor.selectedObjectTile.x}, ${editor.selectedObjectTile.y}`);
  recordEditorHistory(state.mapId, before, cloneMapForSave(currentMap()), "对象属性");
}

function applyEditorTool(tile) {
  if (!tile) return;
  if (editor.tool === "select") {
    if (editor.layer === "objects") selectMapObject(tile.x, tile.y);
    return;
  }
  if (editor.tool === "erase") clearTile(tile.x, tile.y);
  else paintTile(tile.x, tile.y);
}

function editorActionLabel() {
  if (editor.layer === "objects") return editor.tool === "erase" ? "删除对象" : "放置对象";
  if (editor.layer === "collision") return editor.tool === "erase" ? "清除碰撞" : "编辑碰撞";
  return editor.tool === "erase" ? "擦除地图" : "绘制地图";
}

function exportCurrentMap() {
  const map = currentMap();
  return JSON.stringify(
    {
      id: map.id,
      name: map.name,
      width: map.width,
      height: map.height,
      tileSize: map.tileSize,
      spawn: map.spawn,
      layers: map.layers,
      objects: map.objects,
    },
    null,
    2,
  );
}

function readInteger(value, label) {
  if (!Number.isInteger(value)) throw new Error(`${label} 必须是整数。`);
  return value;
}

function validateLayer(layer, width, height, layerName) {
  if (!Array.isArray(layer) || layer.length !== height) {
    throw new Error(`${layerName} 图层高度应为 ${height}。`);
  }
  return layer.map((row, y) => {
    if (!Array.isArray(row) || row.length !== width) {
      throw new Error(`${layerName} 第 ${y} 行宽度应为 ${width}。`);
    }
    return row.map((tile, x) => {
      if (!Number.isInteger(tile)) throw new Error(`${layerName} ${x},${y} 不是整数瓦片。`);
      return tile;
    });
  });
}

function validateSpawn(spawn, width, height) {
  if (!spawn || typeof spawn !== "object") throw new Error("spawn 缺失。");
  const x = readInteger(spawn.x, "spawn.x");
  const y = readInteger(spawn.y, "spawn.y");
  if (x < 0 || y < 0 || x >= width || y >= height) throw new Error("spawn 坐标超出地图范围。");
  return { x, y };
}

function normalizeBuildableObjectExtras(obj) {
  const extras = {};
  if (obj.buildItemId && BUILDABLE_ITEMS[obj.buildItemId]) extras.buildItemId = obj.buildItemId;
  if (typeof obj.placedId === "string") extras.placedId = obj.placedId;
  return extras;
}

function normalizeImportedObject(obj, width, height, index, selfMapId) {
  if (!obj || typeof obj !== "object") throw new Error(`objects[${index}] 不是对象。`);
  if (!IMPORT_OBJECT_TYPES.has(obj.type)) throw new Error(`objects[${index}] 类型不支持：${obj.type}`);
  const x = readInteger(obj.x, `objects[${index}].x`);
  const y = readInteger(obj.y, `objects[${index}].y`);
  if (x < 0 || y < 0 || x >= width || y >= height) throw new Error(`objects[${index}] 坐标超出地图范围。`);

  if (obj.type === "sign") {
    const sign = { type: "sign", x, y, text: String(obj.text ?? "新告示牌") };
    if (typeof obj.storyId === "string") sign.storyId = obj.storyId;
    return sign;
  }
  if (obj.type === "chest") {
    const items = Array.isArray(obj.items) ? obj.items.map((item) => String(item)) : [];
    return { type: "chest", x, y, items };
  }
  if (obj.type === "seedShop") return { type: "seedShop", x, y, name: String(obj.name ?? "村庄种子铺") };
  if (obj.type === "shop") return { type: "shop", x, y, name: String(obj.name ?? "村庄杂货铺") };
  if (obj.type === "shippingBin") return { type: "shippingBin", x, y, name: String(obj.name ?? "出货箱") };
  if (obj.type === "kitchen") return { type: "kitchen", x, y, name: String(obj.name ?? "厨房加工台") };
  if (obj.type === "processor") {
    return {
      type: "processor",
      x,
      y,
      name: String(obj.name ?? "加工桶"),
      machineId: String(obj.machineId ?? `${selfMapId}:${x},${y}`),
      ...normalizeBuildableObjectExtras(obj),
    };
  }
  if (obj.type === "dryer") {
    return {
      type: "dryer",
      x,
      y,
      name: String(obj.name ?? "晾晒架"),
      machineId: String(obj.machineId ?? `${selfMapId}:${x},${y}`),
      ...normalizeBuildableObjectExtras(obj),
    };
  }
  if (obj.type === "flowerBox") return { type: "flowerBox", x, y, name: String(obj.name ?? "花箱"), ...normalizeBuildableObjectExtras(obj) };
  if (obj.type === "gardenLamp") return { type: "gardenLamp", x, y, name: String(obj.name ?? "小路灯"), ...normalizeBuildableObjectExtras(obj) };
  if (obj.type === "bench") return { type: "bench", x, y, name: String(obj.name ?? "长椅"), ...normalizeBuildableObjectExtras(obj) };
  if (obj.type === "fence") return { type: "fence", x, y, name: String(obj.name ?? "篱笆"), ...normalizeBuildableObjectExtras(obj) };
  if (obj.type === "marketStall") {
    const result = { type: "marketStall", x, y, name: String(obj.name ?? "助农集市摊位") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "basketPoint") {
    const result = { type: "basketPoint", x, y, name: String(obj.name ?? "安心菜篮点") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "tastingTable") {
    const result = { type: "tastingTable", x, y, name: String(obj.name ?? "茶铺试吃桌") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "ecommerceDesk") {
    const result = { type: "ecommerceDesk", x, y, name: String(obj.name ?? "电商助农角") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "cooperativeDesk") {
    const result = { type: "cooperativeDesk", x, y, name: String(obj.name ?? "合作社窗口") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "tourismDesk") {
    const result = { type: "tourismDesk", x, y, name: String(obj.name ?? "游客服务亭") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "brandDesk") {
    const result = { type: "brandDesk", x, y, name: String(obj.name ?? "品牌包装台") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "irrigationPump") {
    const result = { type: "irrigationPump", x, y, name: String(obj.name ?? "水利水泵") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "landShrine") {
    const result = { type: "landShrine", x, y, name: String(obj.name ?? "旧土地庙") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "resourceNode") {
    const resourceId = RESOURCE_NODE_TYPES[obj.resourceId] ? obj.resourceId : "quarry";
    const result = {
      type: "resourceNode",
      x,
      y,
      resourceId,
      name: String(obj.name ?? RESOURCE_NODE_TYPES[resourceId].name),
      storyId: typeof obj.storyId === "string" ? obj.storyId : `mountainResource:${resourceId}:${x},${y}`,
      lastGatherDay: Math.max(0, Math.floor(Number(obj.lastGatherDay ?? 0))),
      gatheredToday: Math.max(0, Math.floor(Number(obj.gatheredToday ?? 0))),
    };
    return result;
  }
  if (obj.type === "springFairStall") {
    const result = { type: "springFairStall", x, y, name: String(obj.name ?? "春集种子摊") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "springSampleCrate") {
    const result = { type: "springSampleCrate", x, y, name: String(obj.name ?? "春季样本箱") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "issueBoard") {
    const result = { type: "issueBoard", x, y, name: String(obj.name ?? "村情记录板") };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "communityFacility") {
    const def = communityFacilityDef(COMMUNITY_FACILITY_DEFS[obj.goalId] ? obj.goalId : "childCare");
    const result = {
      type: "communityFacility",
      x,
      y,
      name: String(obj.name ?? def.name),
      goalId: def.goalId,
      storyId: typeof obj.storyId === "string" ? obj.storyId : `villageIssue:${def.goalId}`,
    };
    return result;
  }
  if (obj.type === "directionSign") {
    const lines = Array.isArray(obj.lines) ? obj.lines.map((line) => String(line)).filter(Boolean) : ["北：山路 / 土地庙", "东：村庄", "西：农田 / 出货箱"];
    const result = { type: "directionSign", x, y, name: String(obj.name ?? "路牌"), lines };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "ruin") {
    const repairedType = IMPORT_OBJECT_TYPES.has(obj.repairedType) && obj.repairedType !== "ruin" ? obj.repairedType : undefined;
    const featureId = FEATURE_DEFS[obj.featureId] ? obj.featureId : "cooperative";
    const result = {
      type: "ruin",
      x,
      y,
      name: String(obj.name ?? "待修复废墟"),
      featureId,
      repairedType,
      repairedName: obj.repairedName ? String(obj.repairedName) : undefined,
      machineId: obj.machineId ? String(obj.machineId) : undefined,
      hint: String(obj.hint ?? featureRequirementText(featureId)),
      text: obj.text ? String(obj.text) : undefined,
    };
    if (typeof obj.storyId === "string") result.storyId = obj.storyId;
    return result;
  }
  if (obj.type === "upgradeBoard") return { type: "upgradeBoard", x, y, name: String(obj.name ?? "扩建公告牌") };
  if (obj.type === "well") return { type: "well", x, y, name: String(obj.name ?? "水井") };
  if (obj.type === "bed") return { type: "bed", x, y, name: String(obj.name ?? "床") };
  if (obj.type === "mailbox") return { type: "mailbox", x, y, name: String(obj.name ?? "邮箱") };
  if (obj.type === "warp") {
    const targetMap = obj.toMap === selfMapId ? { width, height } : maps[obj.toMap];
    if (!targetMap) throw new Error(`objects[${index}].toMap 无效：${obj.toMap}`);
    const to = validateSpawn(obj.to, targetMap.width, targetMap.height);
    return { type: "warp", x, y, toMap: obj.toMap, to };
  }
  throw new Error(`objects[${index}] 类型不支持。`);
}

function assertMapCriticalTilesOpen(map, mapId, { includeIncomingWarps = true } = {}) {
  if (isCollisionBlocked(map, map.spawn.x, map.spawn.y)) {
    throw new Error(`spawn ${map.spawn.x},${map.spawn.y} 不能是阻挡格。`);
  }

  for (const obj of map.objects) {
    if (obj.type !== "warp") continue;
    if (isCollisionBlocked(map, obj.x, obj.y)) {
      throw new Error(`传送入口 ${obj.x},${obj.y} 不能是阻挡格。`);
    }
    if (obj.toMap === mapId) {
      if (obj.to.x < 0 || obj.to.y < 0 || obj.to.x >= map.width || obj.to.y >= map.height) {
        throw new Error(`传送落点 ${obj.to.x},${obj.to.y} 超出地图范围。`);
      }
      if (isCollisionBlocked(map, obj.to.x, obj.to.y)) {
        throw new Error(`传送落点 ${obj.to.x},${obj.to.y} 不能是阻挡格。`);
      }
    }
  }

  if (!includeIncomingWarps) return;
  for (const [sourceMapId, sourceMap] of Object.entries(maps)) {
    if (sourceMapId === mapId) continue;
    for (const obj of sourceMap.objects) {
      if (obj.type !== "warp" || obj.toMap !== mapId) continue;
      if (obj.to.x < 0 || obj.to.y < 0 || obj.to.x >= map.width || obj.to.y >= map.height) {
        throw new Error(`${sourceMap.name} 的传送落点 ${obj.to.x},${obj.to.y} 超出地图范围。`);
      }
      if (isCollisionBlocked(map, obj.to.x, obj.to.y)) {
        throw new Error(`${sourceMap.name} 的传送落点 ${obj.to.x},${obj.to.y} 不能是阻挡格。`);
      }
    }
  }
}

function validateImportedMap(data) {
  if (!data || typeof data !== "object") throw new Error("JSON 顶层必须是地图对象。");
  const width = readInteger(data.width, "width");
  const height = readInteger(data.height, "height");
  if (width <= 0 || height <= 0 || width > 200 || height > 200) throw new Error("地图尺寸需要在 1-200 之间。");
  if (!data.layers || typeof data.layers !== "object") throw new Error("layers 缺失。");
  const mapId = typeof data.id === "string" && data.id ? data.id : state.mapId;

  const layers = {};
  for (const layerName of MAP_LAYER_IDS) {
    layers[layerName] = validateLayer(data.layers[layerName], width, height, layerName);
  }
  if (!Array.isArray(data.objects)) throw new Error("objects 必须是数组。");
  const objects = data.objects.map((obj, index) => normalizeImportedObject(obj, width, height, index, mapId));

  const importedMap = {
    id: mapId,
    name: typeof data.name === "string" && data.name ? data.name : "Imported Map",
    width,
    height,
    tileSize: TILE_SIZE,
    spawn: validateSpawn(data.spawn, width, height),
    layers,
    objects,
  };
  assertMapCriticalTilesOpen(importedMap, importedMap.id, { includeIncomingWarps: false });
  return importedMap;
}

function importMapJson() {
  try {
    const imported = validateImportedMap(JSON.parse(ui.mapJsonOutput.value));
    const targetId = maps[imported.id] ? imported.id : state.mapId;
    const before = cloneMapForSave(maps[targetId]);
    const nextMap = {
      ...imported,
      id: targetId,
      objects: imported.objects.map((obj) =>
        obj.type === "warp" && obj.toMap === imported.id ? { ...obj, toMap: targetId } : obj,
      ),
    };
    assertMapCriticalTilesOpen(nextMap, targetId);
    maps[targetId] = nextMap;
    state.mapId = targetId;
    const spawn = tileCenter(imported.spawn.x, imported.spawn.y);
    if (!canOccupy(maps[targetId], state.player.x, state.player.y)) {
      state.player.x = spawn.x;
      state.player.y = spawn.y;
    }
    ensurePlayerCanMove("导入地图脱困");
    closeDialog();
    updateAllHud();
    addLog(`已导入 ${maps[targetId].name} JSON。`);
    recordEditorHistory(targetId, before, cloneMapForSave(maps[targetId]), "导入地图");
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    addLog(`导入失败：${message}`);
    showDialog("导入失败", message);
  }
}

function writeExport() {
  ui.mapJsonOutput.value = exportCurrentMap();
  addLog(`已导出 ${currentMap().name} JSON。`);
}

async function copyExport() {
  if (!ui.mapJsonOutput.value) writeExport();
  try {
    await navigator.clipboard.writeText(ui.mapJsonOutput.value);
    addLog("地图 JSON 已复制。");
  } catch {
    ui.mapJsonOutput.select();
    addLog("浏览器阻止自动复制，已选中 JSON。");
  }
}

function renderTilePalette() {
  ui.tilePalette.innerHTML = "";
  for (const tileId of editableTileIds) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tile-swatch";
    button.dataset.tileId = String(tileId);
    button.title = `${tileId}: ${tileMeta[tileId]?.name ?? "unknown"} · ${seasonLabel(currentSeasonId())}`;
    button.textContent = String(tileId);
    button.style.backgroundColor = tileColorForMap(tileId);
    if (tileId === editor.tileId) button.classList.add("is-selected");
    button.addEventListener("click", () => {
      editor.tileId = tileId;
      renderTilePalette();
    });
    ui.tilePalette.append(button);
  }
}

function syncEditorControls() {
  ui.editorToggle.checked = editor.enabled;
  ui.layerSelect.value = editor.layer;
  ui.toolSelect.value = editor.tool;
  ui.objectSelect.value = editor.objectType;
  updateCanvasCursor();
  updateBuildHud();
  syncObjectFields();
  updateObjectReadout();
  updateEditorHistoryHud();
}

function updateCanvasCursor() {
  if (editor.enabled) {
    canvas.style.cursor = "crosshair";
    return;
  }
  if (state.build.placing) {
    const status = state.build.hoverTile ? buildPlacementStatus(state.build.hoverTile) : { ok: true };
    canvas.style.cursor = status.ok ? "copy" : "not-allowed";
    return;
  }
  canvas.style.cursor = "default";
}

function setEditorEnabled(enabled) {
  if (!enabled) endEditorHistory();
  if (enabled) state.build.placing = false;
  editor.enabled = enabled;
  editor.isPainting = false;
  keys.clear();
  canvas.focus();
  syncEditorControls();
  addLog(enabled ? "编辑模式已开启，玩家移动暂停。" : "编辑模式已关闭，玩家移动恢复。");
  if (!enabled) ensurePlayerCanMove("退出编辑模式脱困");
}

function drawObjectShadow(cx = 16, cy = 27, rx = 12, ry = 4, alpha = 0.24) {
  ctx.fillStyle = `rgba(24, 17, 10, ${alpha})`;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPixelStrokeRect(x, y, w, h, color = ART.outline) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

function drawMiniLabel(text, x = 16, y = 24, color = ART.paper, size = 8) {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawMarketAwning(x, y, w, h, baseColor, stripeColor = ART.paperDim) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = stripeColor;
  for (let sx = x + 3; sx < x + w - 2; sx += 11) {
    ctx.fillRect(sx, y, 5, h);
  }
  drawPixelStrokeRect(x, y, w, h, "rgba(45, 31, 20, 0.58)");
}

function drawSmallCrate(x, y, w = 8, h = 6, color = ART.wood) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(245, 225, 180, 0.18)";
  ctx.fillRect(x + 1, y + 1, w - 2, 1);
  ctx.fillStyle = "rgba(42, 27, 17, 0.28)";
  ctx.fillRect(x + 1, y + h - 2, w - 2, 1);
}

function drawNoticePaper(x, y, w, h, accent = ART.green) {
  ctx.fillStyle = ART.paper;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = accent;
  ctx.fillRect(x + w - 3, y + 1, 2, h - 2);
  ctx.fillStyle = "rgba(44, 30, 18, 0.45)";
  ctx.fillRect(x + 2, y + 3, Math.max(2, w - 7), 1);
  ctx.fillRect(x + 2, y + h - 4, Math.max(2, w - 9), 1);
}

function drawTile(tileId, x, y, mapId = state.mapId, map = null, layerName = "ground", tileGridX = null, tileGridY = null) {
  const size = TILE_SIZE;
  if (tileId === TILE.empty) {
    return;
  }
  const tileX = Number.isFinite(tileGridX) ? tileGridX : Math.floor(x / TILE_SIZE);
  const tileY = Number.isFinite(tileGridY) ? tileGridY : Math.floor(y / TILE_SIZE);
  const tileMap = map ?? maps?.[mapId] ?? null;
  const mask = terrainMaskForTile(tileMap, layerName, tileX, tileY, tileId);
  if (mask !== null && mask !== 15 && drawRasterAssetIfReady(maskedTileVisualDescriptor(tileId, mapId, tileX, tileY, mask), x, y, TILE_SIZE, TILE_SIZE)) return;
  if (drawRasterAssetIfReady(tileVisualDescriptor(tileId, mapId, tileX, tileY), x, y, TILE_SIZE, TILE_SIZE)) return;

  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = tileColorForMap(tileId, mapId);
  ctx.fillRect(0, 0, size, size);

  if (tileId === TILE.grass || tileId === TILE.grassDark) {
    const grassLight = currentSeasonId() === "winter" ? "rgba(255,255,255,0.22)" : "rgba(246, 234, 190, 0.16)";
    ctx.strokeStyle = grassLight;
    ctx.beginPath();
    ctx.moveTo(7, 24);
    ctx.lineTo(10, 19);
    ctx.moveTo(23, 23);
    ctx.lineTo(26, 18);
    ctx.stroke();
    if (tileId === TILE.grassDark) {
      ctx.fillStyle = currentSeasonId() === "autumn" ? "rgba(201, 130, 61, 0.18)" : "rgba(42, 88, 45, 0.16)";
      ctx.fillRect(3, 7, 3, 2);
      ctx.fillRect(18, 26, 4, 2);
    }
  }

  if (mapId === "village" && (tileId === TILE.floor || tileId === TILE.path)) {
    ctx.strokeStyle = "rgba(244, 236, 216, 0.16)";
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(size, 16);
    ctx.moveTo(16, 0);
    ctx.lineTo(16, size);
    ctx.stroke();
  }

  if (mapId === "farm" && tileId === TILE.dirt) {
    ctx.strokeStyle = "rgba(62, 38, 20, 0.28)";
    for (let yy = 8; yy < size; yy += 8) {
      ctx.beginPath();
      ctx.moveTo(4, yy);
      ctx.lineTo(size - 4, yy + 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(245, 218, 157, 0.12)";
    ctx.fillRect(6, 5, 7, 1);
    ctx.fillRect(18, 24, 8, 1);
  }

  if (mapId === "mountain" && tileId === TILE.wall) {
    ctx.strokeStyle = "rgba(230, 240, 245, 0.12)";
    ctx.beginPath();
    ctx.moveTo(5, 8);
    ctx.lineTo(15, 17);
    ctx.lineTo(11, 28);
    ctx.moveTo(22, 5);
    ctx.lineTo(28, 18);
    ctx.stroke();
  }

  if (tileId === TILE.water) {
    const wave = Math.sin(performance.now() / 520 + x * 0.03 + y * 0.02) * 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.fillRect(0, 0, size, 4);
    ctx.strokeStyle = "rgba(230, 247, 255, 0.4)";
    ctx.beginPath();
    ctx.moveTo(4, 11 + wave);
    ctx.quadraticCurveTo(12, 7 + wave, 20, 11 + wave);
    ctx.quadraticCurveTo(25, 14 + wave, 30, 11 + wave);
    ctx.moveTo(2, 23 - wave);
    ctx.quadraticCurveTo(10, 19 - wave, 18, 23 - wave);
    ctx.quadraticCurveTo(24, 26 - wave, 31, 22 - wave);
    ctx.stroke();
  }

  if (tileId === TILE.path || tileId === TILE.dirt) {
    ctx.fillStyle = "rgba(41, 29, 17, 0.16)";
    ctx.fillRect(5, 8, 4, 3);
    ctx.fillRect(20, 22, 5, 3);
    ctx.fillRect(13, 15, 3, 2);
  }

  if (tileId === TILE.wall) {
    ctx.strokeStyle = "rgba(30, 18, 12, 0.28)";
    for (let yy = 8; yy < size; yy += 8) {
      ctx.beginPath();
      ctx.moveTo(0, yy);
      ctx.lineTo(size, yy);
      ctx.stroke();
    }
  }

  if (tileId === TILE.roof) {
    ctx.fillStyle = tileColorForMap(TILE.roof, mapId);
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(size / 2, 2);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fill();
  }

  if (tileId === TILE.fence) {
    ctx.fillStyle = tileColorForMap(TILE.fence, mapId);
    ctx.fillRect(4, 6, 5, 22);
    ctx.fillRect(23, 6, 5, 22);
    ctx.fillRect(0, 12, 32, 5);
    ctx.fillRect(0, 22, 32, 4);
  }

  if (tileId === TILE.door) {
    ctx.fillStyle = tileColorForMap(TILE.door, mapId);
    ctx.fillRect(7, 4, 18, 28);
    ctx.fillStyle = "#d7b56d";
    ctx.fillRect(20, 17, 3, 3);
  }

  ctx.restore();
}

function drawObjects(map, layerName, minX, minY, maxX, maxY) {
  const layer = map.layers[layerName];
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const tileId = layer[y]?.[x] ?? TILE.empty;
      if (
        tileId &&
        !shouldSkipDedicatedBuildingTile(map.id, layerName, x, y, tileId) &&
        !shouldSkipLegacyTreeRootTile(map, layerName, x, y, tileId) &&
        !shouldSkipLegacyFrontRoofTile(layerName, tileId)
      ) {
        drawTile(tileId, x * TILE_SIZE, y * TILE_SIZE, map.id, map, layerName, x, y);
      }
    }
  }
}

function shouldSkipLegacyFrontRoofTile(layerName, tileId) {
  return ART_ASSET_LOADING_ENABLED && layerName === "front" && tileId === TILE.roof;
}

function isLegacyTreeRootTile(map, tileX, tileY) {
  const front = map?.layers?.front;
  return (
    front?.[tileY - 1]?.[tileX - 1] === TILE.roof &&
    front?.[tileY - 1]?.[tileX] === TILE.roof &&
    front?.[tileY - 1]?.[tileX + 1] === TILE.roof &&
    front?.[tileY]?.[tileX - 1] === TILE.roof &&
    front?.[tileY]?.[tileX + 1] === TILE.roof
  );
}

function shouldSkipLegacyTreeRootTile(map, layerName, tileX, tileY, tileId) {
  return ART_ASSET_LOADING_ENABLED && layerName === "buildings" && tileId === TILE.wall && isLegacyTreeRootTile(map, tileX, tileY);
}

const artAssetCache = new Map();
const artAssetFailures = new Set();

function visualStateId(stateId = VISUAL_STATES.default) {
  return VISUAL_STATES[stateId] ?? stateId ?? VISUAL_STATES.default;
}

function artAssetPath(group, id, stateId = VISUAL_STATES.default) {
  const stateSuffix = visualStateId(stateId);
  const suffix = stateSuffix && stateSuffix !== VISUAL_STATES.default ? `--${stateSuffix}` : "";
  return `${ART_ASSET_BASE_PATH}/${group}/${id}${suffix}.png?v=${ART_VERSION}`;
}

const PLAYER_ACTION_FRAME_COUNTS = {
  idle: 2,
  walk: 4,
  run: 6,
  inspect: 4,
  hoe: 5,
  wateringCan: 5,
  scythe: 6,
  fishingRod: 6,
  fishingCatch: 6,
  harvest: 5,
};

const PLAYER_ACTION_DURATIONS = {
  inspect: 520,
  hoe: 620,
  wateringCan: 700,
  scythe: 680,
  fishingRod: 900,
  fishingCatch: 780,
  harvest: 620,
};

function playerAnimationFrameCount(action) {
  return PLAYER_ACTION_FRAME_COUNTS[action] ?? 1;
}

function playerAnimationFrameIndex(action) {
  const frameCount = playerAnimationFrameCount(action);
  if (frameCount <= 1) return 0;
  if (action === "idle") return Math.floor(performance.now() / 520) % frameCount;
  if (action !== "walk" && action !== "run") {
    if (action === "fishingCatch" && fishing.active && fishing.phase !== "waiting") {
      return Math.floor(motion.playerStepClock * 9) % frameCount;
    }
    const duration = Math.max(1, motion.playerActionUntil - motion.playerActionStartedAt);
    const progress = Math.max(0, Math.min(0.999, (performance.now() - motion.playerActionStartedAt) / duration));
    return Math.min(frameCount - 1, Math.floor(progress * frameCount));
  }
  const fps = action === "run" ? 11 : 8;
  return Math.floor(motion.playerStepClock * fps) % frameCount;
}

function playerSpriteMetrics(action) {
  return { width: 96, height: 120, anchorX: 48, anchorY: 108 };
}

function playerAssetPath(action, facing) {
  const frameCount = playerAnimationFrameCount(action);
  if (frameCount <= 1) {
    return `${ART_ASSET_BASE_PATH}/player/${action}_${facing}.png?v=${ART_MOTION_VERSION}`;
  }
  const frame = String(playerAnimationFrameIndex(action)).padStart(2, "0");
  return `${ART_ASSET_BASE_PATH}/player/${action}_${facing}_${frame}.png?v=${ART_MOTION_VERSION}`;
}

function playerFallbackAssetPath(action, facing) {
  return `${ART_ASSET_BASE_PATH}/player/${action}_${facing}.png?v=${ART_MOTION_VERSION}`;
}

function getArtAsset(path) {
  if (!ART_ASSET_LOADING_ENABLED || !path || artAssetFailures.has(path) || typeof Image === "undefined") return null;
  let image = artAssetCache.get(path);
  if (!image) {
    image = new Image();
    image.addEventListener("error", () => artAssetFailures.add(path), { once: true });
    image.src = path;
    artAssetCache.set(path, image);
  }
  return image.complete && image.naturalWidth > 0 ? image : null;
}

function drawRasterAssetIfReady(descriptor, x, y, width = TILE_SIZE, height = TILE_SIZE) {
  const image = getArtAsset(descriptor?.assetPath);
  if (!image) return false;
  const previousSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, x, y, width, height);
  ctx.imageSmoothingEnabled = previousSmoothing;
  return true;
}

function drawAnchoredRasterAssetIfReady(descriptor, x, y) {
  const image = getArtAsset(descriptor?.assetPath);
  if (!image) return false;
  const width = descriptor.width ?? image.naturalWidth;
  const height = descriptor.height ?? image.naturalHeight;
  const anchorX = descriptor.anchorX ?? Math.round(width / 2);
  const anchorY = descriptor.anchorY ?? Math.max(0, height - 4);
  const previousSmoothing = ctx.imageSmoothingEnabled;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, x - anchorX, y - anchorY, width, height);
  ctx.imageSmoothingEnabled = previousSmoothing;
  return true;
}

const DEDICATED_BUILDING_TILE_IDS = new Set([TILE.roof, TILE.wall, TILE.door]);
const DEDICATED_BUILDING_SPRITES = {
  farm: [
    {
      id: "farmhouseSmall",
      label: "AI 农舍",
      x: 37,
      y: 5,
      widthTiles: 7,
      heightTiles: 6,
      width: 224,
      height: 192,
    },
  ],
  village: [
    {
      id: "seedShopBuilding",
      label: "AI 村庄种子铺",
      x: 7,
      y: 4,
      widthTiles: 10,
      heightTiles: 8,
      width: 320,
      height: 256,
    },
    {
      id: "villageShopBuilding",
      label: "AI 村庄合作商店",
      x: 26,
      y: 4,
      widthTiles: 10,
      heightTiles: 8,
      width: 320,
      height: 256,
    },
    {
      id: "villageSmallHouse",
      label: "AI 村民小屋",
      x: 3,
      y: 20,
      widthTiles: 7,
      heightTiles: 7,
      width: 224,
      height: 224,
    },
  ],
};

function currentMapDedicatedBuildingSprites(mapId = state.mapId) {
  return DEDICATED_BUILDING_SPRITES[mapId] ?? [];
}

function buildingSpriteDescriptor(sprite) {
  return {
    group: "objects",
    id: sprite.id,
    state: VISUAL_STATES.default,
    assetKey: `objects/${sprite.id}`,
    assetPath: artAssetPath("objects", sprite.id),
    fallbackColor: "#b76f3f",
    label: sprite.label ?? sprite.id,
  };
}

function buildingSpriteContainsTile(sprite, tileX, tileY) {
  return (
    tileX >= sprite.x &&
    tileX < sprite.x + sprite.widthTiles &&
    tileY >= sprite.y &&
    tileY < sprite.y + sprite.heightTiles
  );
}

function dedicatedBuildingSpriteForTile(mapId, layerName, tileX, tileY, tileId) {
  if (!ART_ASSET_LOADING_ENABLED || !["buildings", "front"].includes(layerName) || !DEDICATED_BUILDING_TILE_IDS.has(tileId)) {
    return null;
  }
  for (const sprite of currentMapDedicatedBuildingSprites(mapId)) {
    if (!buildingSpriteContainsTile(sprite, tileX, tileY)) continue;
    if (!getArtAsset(buildingSpriteDescriptor(sprite).assetPath)) return null;
    return sprite;
  }
  return null;
}

function shouldSkipDedicatedBuildingTile(mapId, layerName, tileX, tileY, tileId) {
  return Boolean(dedicatedBuildingSpriteForTile(mapId, layerName, tileX, tileY, tileId));
}

function buildingSpriteIntersectsView(sprite, minX, minY, maxX, maxY) {
  return (
    sprite.x <= maxX &&
    sprite.x + sprite.widthTiles - 1 >= minX &&
    sprite.y <= maxY &&
    sprite.y + sprite.heightTiles - 1 >= minY
  );
}

function drawDedicatedBuildingSprites(map, minX, minY, maxX, maxY) {
  if (!ART_ASSET_LOADING_ENABLED) return;
  for (const sprite of currentMapDedicatedBuildingSprites(map.id)) {
    if (!buildingSpriteIntersectsView(sprite, minX, minY, maxX, maxY)) continue;
    drawRasterAssetIfReady(
      buildingSpriteDescriptor(sprite),
      sprite.x * TILE_SIZE,
      sprite.y * TILE_SIZE,
      sprite.width,
      sprite.height,
    );
  }
}

function dedicatedBuildingInteractionSpriteId(object, mapId) {
  if (!ART_ASSET_LOADING_ENABLED || mapId !== "village" || !object) return null;
  if (object.type === "seedShop") return "seedShopBuilding";
  if (object.type === "shop" || object.featureId === "villageMarket" || object.repairedType === "shop") {
    return "villageShopBuilding";
  }
  return null;
}

function dedicatedBuildingInteractionSprite(object, mapId) {
  const spriteId = dedicatedBuildingInteractionSpriteId(object, mapId);
  if (!spriteId) return null;
  const sprite = currentMapDedicatedBuildingSprites(mapId).find((item) => item.id === spriteId);
  if (!sprite || !getArtAsset(buildingSpriteDescriptor(sprite).assetPath)) return null;
  return sprite;
}

function drawDedicatedBuildingInteractionMarker(object, mapId, x, y) {
  if (!dedicatedBuildingInteractionSprite(object, mapId)) return false;
  const isSeedShop = object.type === "seedShop";
  const isRepairableMarket = object.featureId === "villageMarket" && featureUnlocked("villageMarket");
  const label = isSeedShop ? "籽" : object.type === "shop" ? "铺" : isRepairableMarket ? "修" : "旧";

  ctx.save();
  ctx.translate(x, y);
  drawObjectShadow(16, 27, 9, 3, 0.18);
  ctx.fillStyle = "rgba(42, 35, 24, 0.78)";
  ctx.fillRect(7, 16, 18, 12);
  ctx.fillStyle = isSeedShop ? ART.green : isRepairableMarket ? ART.gold : "#8c6841";
  ctx.fillRect(8, 17, 16, 3);
  drawPixelStrokeRect(7, 16, 18, 12, "rgba(244, 236, 216, 0.36)");
  ctx.fillStyle = "#f4ecd8";
  ctx.font = "700 9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 16, 24);
  if (isRepairableMarket && state.settings.effectsEnabled) {
    const pulse = (Math.sin(performance.now() / 260 + object.x) + 1) / 2;
    ctx.strokeStyle = `rgba(231, 179, 77, ${0.28 + pulse * 0.45})`;
    ctx.strokeRect(5.5, 14.5, 21, 15);
  }
  ctx.restore();
  return true;
}

const ART_OBJECT_RENDER_SPECS = {
  shippingBin: { width: 32, height: 40 },
  irrigationPump: { width: 32, height: 48 },
  issueBoard: { width: 64, height: 64 },
  seedShop: { width: 128, height: 112 },
  springFairStall: { width: 96, height: 80 },
  springSampleCrate: { width: 64, height: 48 },
  landShrine: { width: 64, height: 64 },
  shop: { width: 64, height: 64 },
  cooperativeDesk: { width: 64, height: 48 },
  tourismDesk: { width: 64, height: 48 },
  brandDesk: { width: 64, height: 48 },
};
const RESOURCE_NODE_RENDER_SPECS = {
  quarry: { width: 64, height: 64 },
  forestEdge: { width: 64, height: 64 },
  toolShed: { width: 96, height: 80 },
};
const BUILDABLE_RENDER_SPECS = {
  processor: { width: 32, height: 48 },
  dryer: { width: 64, height: 48 },
  flowerBox: { width: 32, height: 32 },
  gardenLamp: { width: 32, height: 48 },
  bench: { width: 64, height: 32 },
  fence: { width: 32, height: 32 },
};

function objectRasterRenderSpec(object) {
  if (object?.type === "communityFacility") return { width: 96, height: 80 };
  if (object?.type === "resourceNode") return RESOURCE_NODE_RENDER_SPECS[resourceNodeDef(object).id] ?? { width: 64, height: 64 };
  const buildableItemId = buildableItemIdForObject(object);
  if (buildableItemId) return BUILDABLE_RENDER_SPECS[buildableItemId] ?? { width: TILE_SIZE, height: TILE_SIZE };
  return ART_OBJECT_RENDER_SPECS[objectAssetId(object)] ?? { width: TILE_SIZE, height: TILE_SIZE };
}

function drawObjectRasterAssetIfReady(object, mapId, x, y) {
  const descriptor = objectVisualDescriptor(object, mapId);
  const spec = objectRasterRenderSpec(object);
  const drawX = Math.round(x + TILE_SIZE / 2 - spec.width / 2);
  const drawY = Math.round(y + TILE_SIZE - spec.height);
  return drawRasterAssetIfReady(descriptor, drawX, drawY, spec.width, spec.height);
}

function objectAssetId(object) {
  if (!object) return "unknown";
  const buildableItemId = buildableItemIdForObject(object);
  if (buildableItemId) return buildableItemId;
  if (object.type === "resourceNode") return `resourceNode-${resourceNodeDef(object).id}`;
  if (object.type === "communityFacility") return `communityFacility-${object.goalId ?? "generic"}`;
  if (object.type === "ruin") return `ruin-${object.featureId ?? "generic"}`;
  return object.type ?? "object";
}

function objectVisualState(object, mapId = state.mapId) {
  if (!object) return VISUAL_STATES.default;
  if (object.type === "ruin") return featureUnlocked(object.featureId) ? VISUAL_STATES.repairing : VISUAL_STATES.ruin;
  if (object.type === "resourceNode") {
    if (state.day < 11) return VISUAL_STATES.locked;
    return resourceNodeRemaining(object) > 0 ? VISUAL_STATES.active : VISUAL_STATES.depleted;
  }
  if (object.type === "springFairStall") {
    if (state.story.springFairVisited) return VISUAL_STATES.completed;
    return springFairIsOpen() ? VISUAL_STATES.active : VISUAL_STATES.locked;
  }
  if (object.type === "springSampleCrate") {
    if (state.story.springSampleBundleCompleted) return VISUAL_STATES.completed;
    return springSampleBundleReady() ? VISUAL_STATES.ready : springSampleBundleUnlocked() ? VISUAL_STATES.active : VISUAL_STATES.locked;
  }
  if (object.type === "landShrine") {
    if (state.story.landShrineFinalRevealed) return VISUAL_STATES.completed;
    return landShrineFinalReady() ? VISUAL_STATES.ready : VISUAL_STATES.active;
  }
  if (object.type === "communityFacility") return villageFacilityStageDef(object.goalId).visualState;
  if (object.type === "seedShop") return VISUAL_STATES.active;
  if (object.type === "shop" && mapId === "village") return state.story.chapterOneCompleted ? VISUAL_STATES.repaired : VISUAL_STATES.locked;
  if (object.type === "cooperativeDesk") return state.story.cooperativeJoined ? VISUAL_STATES.completed : featureUnlocked("cooperative") ? VISUAL_STATES.repaired : VISUAL_STATES.locked;
  if (object.type === "tourismDesk") return state.story.tourismFirstOrderCompleted ? VISUAL_STATES.completed : featureUnlocked("tourism") ? VISUAL_STATES.repaired : VISUAL_STATES.locked;
  if (object.type === "brandDesk") return state.story.brandFirstShipmentSettled ? VISUAL_STATES.completed : featureUnlocked("brand") ? VISUAL_STATES.repaired : VISUAL_STATES.locked;
  if (object.type === "irrigationPump") return state.story.irrigationFirstProjectCompleted ? VISUAL_STATES.completed : featureUnlocked("irrigation") ? VISUAL_STATES.repaired : VISUAL_STATES.locked;
  if (buildableItemIdForObject(object)) return VISUAL_STATES.active;
  return VISUAL_STATES.default;
}

function objectVisualDescriptor(object, mapId = state.mapId) {
  const stateId = objectVisualState(object, mapId);
  const id = objectAssetId(object);
  const group = buildableItemIdForObject(object) ? "buildables" : "objects";
  const spec = objectRasterRenderSpec(object);
  return {
    group,
    id,
    state: stateId,
    assetKey: `${group}/${id}--${stateId}`,
    assetPath: artAssetPath(group, id, stateId),
    width: spec.width,
    height: spec.height,
    anchorX: Math.round(spec.width / 2),
    anchorY: spec.height,
    fallbackColor: minimapObjectColor(object?.type),
    label: minimapObjectLabel(object),
  };
}

function npcAnimationFrameIndex(npc) {
  return Math.floor((performance.now() + npc.x * 73 + npc.y * 41) / 650) % 2;
}

function npcAssetPath(npcId, stateId, frameIndex = null) {
  const stateSuffix = visualStateId(stateId);
  const suffix = stateSuffix && stateSuffix !== VISUAL_STATES.default ? `--${stateSuffix}` : "";
  const frameSuffix = frameIndex === null ? "" : `_${String(frameIndex).padStart(2, "0")}`;
  return `${ART_ASSET_BASE_PATH}/npcs/${npcId}${suffix}${frameSuffix}.png?v=${ART_VERSION}`;
}

function npcVisualDescriptor(npc, animated = true) {
  const quest = Object.values(state.quests).find((item) => item.npcId === npc.id);
  const isTalking = motion.lastNpcTalkId === npc.id;
  const stateId = isTalking ? "talk_down" : quest?.status === "completed" ? VISUAL_STATES.completed : quest?.status === "readyToTurnIn" ? VISUAL_STATES.ready : VISUAL_STATES.active;
  const frameIndex = animated ? npcAnimationFrameIndex(npc) : null;
  const frameKey = frameIndex === null ? "" : `_${String(frameIndex).padStart(2, "0")}`;
  return {
    group: "npcs",
    id: npc.id,
    state: stateId,
    assetKey: `npcs/${npc.id}--${stateId}${frameKey}`,
    assetPath: npcAssetPath(npc.id, stateId, frameIndex),
    width: 96,
    height: 120,
    anchorX: 48,
    anchorY: 108,
    fallbackColor: npc.color ?? "#7a4d8f",
    label: npc.name,
  };
}

function playerVisualDescriptor() {
  const action = currentPlayerMotionAction();
  const facing = state.player.facing ?? "down";
  const metrics = playerSpriteMetrics(action);
  return {
    group: "player",
    id: action,
    state: facing,
    assetKey: `player/${action}_${facing}`,
    assetPath: playerAssetPath(action, facing),
    ...metrics,
    fallbackColor: "#314d7f",
    label: "玩家",
  };
}

function playerFallbackVisualDescriptor() {
  const action = currentPlayerMotionAction();
  const facing = state.player.facing ?? "down";
  const metrics = playerSpriteMetrics(action);
  return {
    group: "player",
    id: action,
    state: facing,
    assetKey: `player/${action}_${facing}`,
    assetPath: playerFallbackAssetPath(action, facing),
    ...metrics,
    fallbackColor: "#314d7f",
    label: "玩家",
  };
}

function tileAssetId(tileId) {
  if (tileId === TILE.grass) return "grass";
  if (tileId === TILE.grassDark) return "deepGrass";
  if (tileId === TILE.dirt) return "dirt";
  if (tileId === TILE.water) return "water";
  if (tileId === TILE.path) return "path";
  if (tileId === TILE.floor) return "floor";
  if (tileId === TILE.wall) return "wall";
  if (tileId === TILE.roof) return "roof";
  if (tileId === TILE.fence) return "fence";
  if (tileId === TILE.door) return "door";
  if (tileId === TILE.crop1 || tileId === TILE.crop2) return "cropPlot";
  return tileMeta[tileId]?.name ?? "unknown";
}

const TERRAIN_MASK_BITS = {
  north: 1,
  east: 2,
  south: 4,
  west: 8,
};

const MASKED_TERRAIN_ASSET_IDS = new Set(["deepGrass", "dirt", "path", "water", "floor", "wall"]);

function terrainFamily(tileId) {
  const id = tileAssetId(tileId);
  return MASKED_TERRAIN_ASSET_IDS.has(id) ? id : null;
}

function terrainNeighborMatches(map, layerName, tileX, tileY, family) {
  const tileId = map?.layers?.[layerName]?.[tileY]?.[tileX] ?? TILE.empty;
  return terrainFamily(tileId) === family;
}

function terrainMaskForTile(map, layerName, tileX, tileY, tileId) {
  if (!ART_ASSET_LOADING_ENABLED) return null;
  const family = terrainFamily(tileId);
  if (!family || !map?.layers?.[layerName]) return null;
  if (family === "wall" && layerName !== "ground") return null;

  let mask = 0;
  if (terrainNeighborMatches(map, layerName, tileX, tileY - 1, family)) mask |= TERRAIN_MASK_BITS.north;
  if (terrainNeighborMatches(map, layerName, tileX + 1, tileY, family)) mask |= TERRAIN_MASK_BITS.east;
  if (terrainNeighborMatches(map, layerName, tileX, tileY + 1, family)) mask |= TERRAIN_MASK_BITS.south;
  if (terrainNeighborMatches(map, layerName, tileX - 1, tileY, family)) mask |= TERRAIN_MASK_BITS.west;
  return mask;
}

function maskedTileVisualDescriptor(tileId, mapId = state.mapId, tileX = 0, tileY = 0, mask = 0) {
  const id = tileAssetId(tileId);
  const stateId = `m${Math.max(0, Math.min(15, mask))}`;
  return {
    group: "tiles",
    id,
    state: stateId,
    assetKey: `tiles/${id}--${stateId}`,
    assetPath: artAssetPath("tiles", id, stateId),
    fallbackColor: tileColorForMap(tileId, mapId),
    label: `${tileMeta[tileId]?.name ?? id} ${stateId}`,
  };
}

function tileVariantState(tileId, tileX = 0, tileY = 0) {
  if (![TILE.grass, TILE.grassDark, TILE.dirt, TILE.path, TILE.water, TILE.floor, TILE.wall].includes(tileId)) return VISUAL_STATES.default;
  const index = Math.abs((tileX * 17 + tileY * 31 + tileId * 7) % 3);
  if (index === 1) return "alt1";
  if (index === 2) return "alt2";
  return VISUAL_STATES.default;
}

function tileVisualDescriptor(tileId, mapId = state.mapId, tileX = 0, tileY = 0) {
  const id = tileAssetId(tileId);
  const stateId = tileVariantState(tileId, tileX, tileY);
  return {
    group: "tiles",
    id,
    state: stateId,
    assetKey: `tiles/${id}--${stateId}`,
    assetPath: artAssetPath("tiles", id, stateId),
    fallbackColor: tileColorForMap(tileId, mapId),
    label: tileMeta[tileId]?.name ?? id,
  };
}

function cropVisualDescriptor(crop) {
  const stateId = crop.ready ? VISUAL_STATES.ready : crop.watered ? "watered" : VISUAL_STATES.active;
  const spec = CROP_RENDER_SPECS[crop.cropId ?? DEFAULT_CROP_ID] ?? { width: 32, height: 32 };
  return {
    group: "crops",
    id: crop.cropId ?? DEFAULT_CROP_ID,
    state: stateId,
    assetKey: `crops/${crop.cropId ?? DEFAULT_CROP_ID}--${stateId}`,
    assetPath: artAssetPath("crops", crop.cropId ?? DEFAULT_CROP_ID, stateId),
    width: spec.width,
    height: spec.height,
    anchorX: Math.round(spec.width / 2),
    anchorY: spec.height,
    fallbackColor: cropDef(crop.cropId).cropColor,
    label: cropDef(crop.cropId).name,
  };
}

function artDescriptorKey(descriptor) {
  return `${descriptor.group}/${descriptor.id}/${descriptor.state}`;
}

function uniqueArtDescriptors(descriptors) {
  const seen = new Set();
  const unique = [];
  for (const descriptor of descriptors.filter(Boolean)) {
    const key = artDescriptorKey(descriptor);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(descriptor);
  }
  return unique.sort((a, b) => `${a.group}/${a.id}`.localeCompare(`${b.group}/${b.id}`));
}

function currentMapArtDescriptors() {
  const map = currentMap();
  const visibleTileDescriptors = [];
  for (const layerName of ["ground", "buildings", "front"]) {
    const layer = map.layers[layerName];
    for (let y = 0; y < layer.length; y += 1) {
      const row = layer[y];
      for (let x = 0; x < row.length; x += 1) {
        const tileId = row[x];
        if (!tileId) continue;
        if (
          shouldSkipDedicatedBuildingTile(map.id, layerName, x, y, tileId) ||
          shouldSkipLegacyTreeRootTile(map, layerName, x, y, tileId) ||
          shouldSkipLegacyFrontRoofTile(layerName, tileId)
        ) {
          continue;
        }
        const mask = terrainMaskForTile(map, layerName, x, y, tileId);
        if (mask !== null && mask !== 15) visibleTileDescriptors.push(maskedTileVisualDescriptor(tileId, map.id, x, y, mask));
        visibleTileDescriptors.push(tileVisualDescriptor(tileId, map.id, x, y));
      }
    }
  }
  const descriptors = [
    ...visibleTileDescriptors,
    ...currentMapDedicatedBuildingSprites(map.id).map(buildingSpriteDescriptor),
    playerVisualDescriptor(),
    ...map.objects.filter((object) => objectBelongsToMap(object, map.id)).map((object) => objectVisualDescriptor(object, map.id)),
    ...state.dynamicObjects.filter((object) => isCropOnMap(object, map.id)).map(cropVisualDescriptor),
  ];
  if (currentMapRules().showsNpcs) {
    descriptors.push(...state.npcs.filter((npc) => npcBelongsToMap(npc)).map(npcVisualDescriptor));
  }
  return uniqueArtDescriptors(descriptors);
}

function expectedAssetRenderSpec(item) {
  if (item.group === "crops") {
    const spec = CROP_RENDER_SPECS[item.id] ?? { width: 32, height: 32 };
    return { ...spec, anchorX: Math.round(spec.width / 2), anchorY: spec.height };
  }
  if (item.group === "objects" && item.id.startsWith("communityFacility-")) return { width: 96, height: 80, anchorX: 48, anchorY: 80 };
  if (item.group === "objects" && item.id.startsWith("resourceNode-")) {
    const resourceId = item.id.replace("resourceNode-", "");
    const spec = RESOURCE_NODE_RENDER_SPECS[resourceId] ?? { width: 64, height: 64 };
    return { ...spec, anchorX: Math.round(spec.width / 2), anchorY: spec.height };
  }
  if (item.group === "buildables") {
    const spec = BUILDABLE_RENDER_SPECS[item.id] ?? { width: 32, height: 32 };
    return { ...spec, anchorX: Math.round(spec.width / 2), anchorY: spec.height };
  }
  if (item.group === "fish" || item.group === "ui" || item.group === "tools") return { width: 32, height: 32, anchorX: 16, anchorY: 32 };
  return {};
}

function expectedAssetDescriptors() {
  return ART_EXPECTED_ASSET_BATCHES.flatMap((batch) =>
    batch.items.map((item) => ({
      ...item,
      ...expectedAssetRenderSpec(item),
      priority: batch.priority,
      batchId: batch.id,
      batchTitle: batch.title,
      assetKey: `${item.group}/${item.id}${item.state === VISUAL_STATES.default ? "" : `--${item.state}`}`,
      assetPath: artAssetPath(item.group, item.id, item.state),
      fallbackColor: "#8a7a66",
    })),
  );
}

function descriptorRenderSpecText(descriptor) {
  if (!descriptor?.width || !descriptor?.height) return "";
  const anchor = descriptor.anchorX && descriptor.anchorY ? ` · 锚点 ${descriptor.anchorX},${descriptor.anchorY}` : "";
  return `${descriptor.width}x${descriptor.height}${anchor}`;
}

function manifestDescriptor(descriptor) {
  return {
    group: descriptor.group,
    id: descriptor.id,
    state: descriptor.state,
    priority: descriptor.priority,
    label: descriptor.label,
    path: descriptor.assetPath,
    width: descriptor.width,
    height: descriptor.height,
    anchorX: descriptor.anchorX,
    anchorY: descriptor.anchorY,
    status: artDescriptorRuntimeStatus(descriptor),
  };
}

function artContractManifest() {
  const expected = expectedAssetDescriptors();
  const expectedStatuses = expected.map((descriptor) => artDescriptorRuntimeStatus(descriptor));
  const expectedMissing = expected.filter((descriptor, index) => {
    const status = expectedStatuses[index];
    return status === "missing" || status === "unchecked";
  });
  return {
    appVersion: APP_VERSION,
    artVersion: ART_VERSION,
    motionVersion: ART_MOTION_VERSION,
    contractVersion: ART_ASSET_CONTRACT_VERSION,
    basePath: ART_ASSET_BASE_PATH,
    loadingEnabled: ART_ASSET_LOADING_ENABLED,
    states: Object.values(VISUAL_STATES),
    groups: ART_ASSET_GROUPS,
    pathPattern: "assets/game/<group>/<id>--<state>.png；default 状态也可提供 <id>.png；地形 mask 使用 tiles/<id>--m0..m15.png",
    fallback: "素材缺失或未启用 ?assets=1 时，Canvas 色块绘制继续作为 fallback。",
    currentMap: {
      id: state.mapId,
      name: maps[state.mapId]?.name ?? state.mapId,
      assetCount: currentMapArtDescriptors().length,
    },
    expectedSummary: {
      total: expected.length,
      loaded: expectedStatuses.filter((status) => status === "loaded").length,
      missingOrUnchecked: expectedMissing.length,
      gaps: expectedMissing.map((descriptor) => ({
        priority: descriptor.priority,
        label: descriptor.label,
        path: descriptor.assetPath,
      })),
    },
    currentMapAssets: currentMapArtDescriptors().map(manifestDescriptor),
    expectedAssetBatches: ART_EXPECTED_ASSET_BATCHES.map((batch) => ({
      id: batch.id,
      priority: batch.priority,
      title: batch.title,
      assets: expectedAssetDescriptors()
        .filter((descriptor) => descriptor.batchId === batch.id)
        .map(manifestDescriptor),
    })),
  };
}

function assetManifestText() {
  return JSON.stringify(artContractManifest(), null, 2);
}

function artDescriptorRuntimeStatus(descriptor) {
  if (!ART_ASSET_LOADING_ENABLED) return "fallback";
  if (artAssetFailures.has(descriptor.assetPath)) return "missing";
  const image = getArtAsset(descriptor.assetPath);
  if (image) return "loaded";
  return artAssetCache.has(descriptor.assetPath) ? "loading" : "unchecked";
}

function artDescriptorStatusLabel(status) {
  if (status === "loaded") return "已加载";
  if (status === "missing") return "缺失";
  if (status === "loading") return "加载中";
  if (status === "unchecked") return "未检查";
  return "fallback";
}

function updateAssetAuditHud() {
  if (!ui.assetAuditStatus || !ui.assetAuditSummary || !ui.assetAuditList) return;
  const descriptors = currentMapArtDescriptors();
  const statuses = descriptors.map((descriptor) => artDescriptorRuntimeStatus(descriptor));
  const loaded = statuses.filter((status) => status === "loaded").length;
  const missing = statuses.filter((status) => status === "missing").length + artAssetFailures.size;
  const expectedDescriptors = expectedAssetDescriptors();
  const expectedStatuses = expectedDescriptors.map((descriptor) => artDescriptorRuntimeStatus(descriptor));
  const expectedLoaded = expectedStatuses.filter((status) => status === "loaded").length;
  const expectedMissing = expectedStatuses.filter((status) => status === "missing" || status === "unchecked").length;
  const mode = ART_ASSET_LOADING_ENABLED ? "assets=1" : "fallback";
  ui.assetAuditStatus.textContent = ART_ASSET_LOADING_ENABLED ? `${loaded}/${descriptors.length}` : "fallback";
  ui.assetAuditSummary.textContent = `代码 ${APP_VERSION} · 美术 ${ART_VERSION} · 动作 ${ART_MOTION_VERSION} · 契约 ${ART_ASSET_CONTRACT_VERSION} · ${mode} · 当前地图 ${loaded}/${descriptors.length} · 预期 ${expectedLoaded}/${expectedDescriptors.length} · 缓存 ${artAssetCache.size} · 缺失 ${missing + expectedMissing}`;
  ui.assetAuditList.replaceChildren();

  const appendSection = (title, summary) => {
    const item = document.createElement("li");
    item.className = "asset-audit-section";
    item.dataset.status = "section";
    const heading = document.createElement("strong");
    heading.textContent = title;
    const note = document.createElement("small");
    note.textContent = summary;
    item.append(heading, note);
    ui.assetAuditList.append(item);
  };

  const appendDescriptor = (descriptor, descriptorStatus, meta = "") => {
    const status = descriptorStatus ?? artDescriptorRuntimeStatus(descriptor);
    const item = document.createElement("li");
    item.dataset.status = status;

    const title = document.createElement("strong");
    title.textContent = `${artDescriptorStatusLabel(status)} · ${descriptor.label || descriptor.id} · ${descriptor.state}`;
    const specText = descriptorRenderSpecText(descriptor);
    const metaText = [meta, specText].filter(Boolean).join(" · ");
    if (metaText) {
      const small = document.createElement("small");
      small.textContent = metaText;
      item.append(title, small);
    } else {
      item.append(title);
    }
    const path = document.createElement("code");
    path.textContent = descriptor.assetPath;
    item.append(path);
    ui.assetAuditList.append(item);
  };

  appendSection("当前地图资源", `${maps[state.mapId]?.name ?? state.mapId} · ${loaded}/${descriptors.length} 已加载 · 当前地图会实际尝试绘制这些资源。`);
  const visibleDescriptors = descriptors.slice(0, 18);
  for (const descriptor of visibleDescriptors) {
    appendDescriptor(descriptor, artDescriptorRuntimeStatus(descriptor), descriptor.group);
  }

  if (descriptors.length > visibleDescriptors.length) {
    const item = document.createElement("li");
    item.dataset.status = "fallback";
    item.textContent = `还有 ${descriptors.length - visibleDescriptors.length} 项，当前只显示前 ${visibleDescriptors.length} 项。`;
    ui.assetAuditList.append(item);
  }

  appendSection("后续预期资源", `P0/P1/P2 · ${expectedLoaded}/${expectedDescriptors.length} 已加载 · 复制资源清单会输出完整路径和缺口。`);
  const expectedVisible = expectedDescriptors
    .map((descriptor, index) => ({ descriptor, status: expectedStatuses[index] }))
    .sort((a, b) => {
      const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
      const missingWeight = (status) => (status === "missing" || status === "unchecked" ? 0 : 1);
      return (
        missingWeight(a.status) - missingWeight(b.status) ||
        (priorityOrder[a.descriptor.priority] ?? 9) - (priorityOrder[b.descriptor.priority] ?? 9) ||
        a.descriptor.assetPath.localeCompare(b.descriptor.assetPath)
      );
    })
    .slice(0, 42);
  for (const { descriptor, status } of expectedVisible) {
    appendDescriptor(descriptor, status, `${descriptor.priority} · ${descriptor.batchTitle}`);
  }
  if (expectedDescriptors.length > expectedVisible.length) {
    const item = document.createElement("li");
    item.dataset.status = "fallback";
    item.textContent = `还有 ${expectedDescriptors.length - expectedVisible.length} 项预期资源，复制清单可查看完整列表。`;
    ui.assetAuditList.append(item);
  }
}

function refreshAssetAudit() {
  updateAssetAuditHud();
  addLog(`美术验收已扫描当前地图：${currentMapArtDescriptors().length} 个资源描述。`);
}

async function copyAssetManifest() {
  const text = assetManifestText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      addLog("已复制美术资源清单。");
      return true;
    }
  } catch (_error) {
    // file:// 下 clipboard 可能不可用，退回到存档 JSON 文本框便于复制。
  }
  if (ui.saveJsonOutput) ui.saveJsonOutput.value = text;
  addLog("浏览器不允许直接复制，资源清单已写入存档 JSON 文本框。");
  return false;
}

function drawDynamicObjects(minX, minY, maxX, maxY) {
  for (const obj of state.dynamicObjects) {
    if (!isCropOnMap(obj)) continue;
    if (obj.x < minX || obj.x > maxX || obj.y < minY || obj.y > maxY) continue;
    const def = cropDef(obj.cropId);
    if (drawAnchoredRasterAssetIfReady(cropVisualDescriptor(obj), obj.x * TILE_SIZE + TILE_SIZE / 2, obj.y * TILE_SIZE + TILE_SIZE)) continue;
    drawTile(obj.ready ? TILE.crop2 : TILE.crop1, obj.x * TILE_SIZE, obj.y * TILE_SIZE);
    ctx.fillStyle = obj.ready ? def.cropColor : def.sproutColor;
    ctx.fillRect(obj.x * TILE_SIZE + 13, obj.y * TILE_SIZE + 7, 6, 14);
    ctx.fillStyle = def.accentColor;
    ctx.fillRect(obj.x * TILE_SIZE + 10, obj.y * TILE_SIZE + 9, 4, 4);
    ctx.fillRect(obj.x * TILE_SIZE + 18, obj.y * TILE_SIZE + 13, 4, 4);
    if (obj.ready && state.settings.effectsEnabled) {
      const pulse = (Math.sin(performance.now() / 280 + obj.x * 0.7 + obj.y * 0.4) + 1) / 2;
      ctx.strokeStyle = `rgba(231, 179, 77, ${0.28 + pulse * 0.42})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(obj.x * TILE_SIZE + 6.5, obj.y * TILE_SIZE + 5.5, TILE_SIZE - 13, TILE_SIZE - 11);
      ctx.fillStyle = `rgba(244, 236, 216, ${0.42 + pulse * 0.32})`;
      ctx.fillRect(obj.x * TILE_SIZE + 23, obj.y * TILE_SIZE + 6, 3, 3);
    }
    if (obj.watered && !obj.ready) {
      ctx.fillStyle = "rgba(88, 154, 207, 0.55)";
      ctx.fillRect(obj.x * TILE_SIZE + 5, obj.y * TILE_SIZE + 25, 22, 3);
    }
  }
}

function drawMapObjects(map, minX, minY, maxX, maxY) {
  for (const obj of map.objects) {
    if (!objectBelongsToMap(obj, map.id)) continue;
    if (obj.x < minX || obj.x > maxX || obj.y < minY || obj.y > maxY) continue;
    const x = obj.x * TILE_SIZE;
    const y = obj.y * TILE_SIZE;
    if (drawDedicatedBuildingInteractionMarker(obj, map.id, x, y)) continue;
    if (drawObjectRasterAssetIfReady(obj, map.id, x, y)) continue;

    ctx.save();
    ctx.translate(x, y);

    if (obj.type === "ruin") {
      const canRepair = featureUnlocked(obj.featureId) && obj.repairedType;
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.beginPath();
      ctx.ellipse(16, 25, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4d463d";
      ctx.fillRect(5, 17, 8, 9);
      ctx.fillRect(16, 12, 6, 14);
      ctx.fillRect(23, 20, 5, 6);
      ctx.fillStyle = "#7d735f";
      ctx.fillRect(6, 14, 7, 4);
      ctx.fillRect(15, 9, 9, 4);
      ctx.fillRect(22, 17, 6, 3);
      ctx.fillStyle = canRepair ? "#e7b34d" : "#8c6841";
      ctx.fillRect(10, 7, 12, 5);
      ctx.fillStyle = "#2b2924";
      ctx.fillRect(12, 9, 8, 1);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "700 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ruinShortLabel(obj), 16, 22);
      if (canRepair && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 260 + obj.x) + 1) / 2;
        ctx.strokeStyle = `rgba(231, 179, 77, ${0.35 + pulse * 0.42})`;
        ctx.strokeRect(4.5, 4.5, 23, 23);
      }
    }

    if (obj.type === "sign") {
      drawObjectShadow(16, 28, 10, 3, 0.2);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(14, 13, 4, 17);
      ctx.fillStyle = ART.woodLight;
      ctx.fillRect(5, 5, 22, 13);
      drawPixelStrokeRect(5, 5, 22, 13);
      ctx.fillStyle = "rgba(44, 30, 18, 0.45)";
      ctx.fillRect(8, 9, 16, 2);
      if (obj.storyId === "firstShipmentFeedback") {
        if (state.story.firstShipmentSettled) {
          drawNoticePaper(8, 7, 7, 8, ART.gold);
          drawNoticePaper(17, 8, 7, 7, ART.green);
          if (!state.story.villageFeedbackSeen && state.settings.effectsEnabled) {
            const pulse = (Math.sin(performance.now() / 220) + 1) / 2;
            ctx.strokeStyle = `rgba(112, 183, 126, ${0.4 + pulse * 0.45})`;
            ctx.strokeRect(4.5, 4.5, 23, 13);
          }
        } else {
          ctx.fillStyle = "rgba(244, 236, 216, 0.35)";
          ctx.fillRect(9, 8, 14, 2);
        }
      }
    }

    if (obj.type === "landShrine") {
      const ready = landShrineFinalReady();
      drawObjectShadow(16, 27, 13, 4, 0.28);
      ctx.fillStyle = "#63584a";
      ctx.fillRect(7, 14, 18, 13);
      ctx.fillStyle = "#9a8a72";
      ctx.fillRect(5, 11, 22, 5);
      ctx.fillStyle = "#8d4f3d";
      ctx.beginPath();
      ctx.moveTo(3, 11);
      ctx.lineTo(16, 4);
      ctx.lineTo(29, 11);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = ART.gold;
      ctx.fillRect(13, 16, 6, 9);
      ctx.fillStyle = ART.ink;
      ctx.fillRect(14, 18, 4, 1);
      ctx.fillRect(14, 21, 4, 1);
      ctx.fillStyle = ready ? ART.paper : "#b89a63";
      ctx.beginPath();
      ctx.arc(16, 9, 2.5, 0, Math.PI * 2);
      ctx.fill();
      drawPixelStrokeRect(7, 14, 18, 13, "rgba(28, 22, 18, 0.54)");
      if ((ready || state.story.landShrineFinalRevealed) && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 360) + 1) / 2;
        ctx.strokeStyle = `rgba(216, 193, 122, ${0.28 + pulse * 0.42})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(4.5, 4.5, 23, 24);
        ctx.fillStyle = `rgba(216, 193, 122, ${0.1 + pulse * 0.14})`;
        ctx.beginPath();
        ctx.arc(16, 16, 15 + pulse * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (obj.type === "resourceNode") {
      const def = resourceNodeDef(obj);
      const remaining = state.day >= 11 ? resourceNodeRemaining(obj) : 0;
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.beginPath();
      ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      if (def.id === "forestEdge") {
        ctx.fillStyle = "#4f6f3f";
        ctx.fillRect(4, 16, 24, 10);
        ctx.fillStyle = "#70b77e";
        ctx.fillRect(7, 11, 7, 8);
        ctx.fillRect(17, 9, 8, 10);
        ctx.fillStyle = "#8a5b37";
        ctx.fillRect(8, 23, 16, 4);
        ctx.fillStyle = "#d8c17a";
        ctx.fillRect(22, 13, 4, 4);
      } else if (def.id === "toolShed") {
        ctx.fillStyle = "#4f3827";
        ctx.fillRect(5, 13, 22, 14);
        ctx.fillStyle = "#6e6a5b";
        ctx.fillRect(4, 9, 24, 6);
        ctx.fillStyle = "#8cb7d7";
        ctx.fillRect(8, 18, 5, 6);
        ctx.fillStyle = "#c08a4a";
        ctx.fillRect(18, 16, 6, 8);
        ctx.fillStyle = "#f4ecd8";
        ctx.font = "8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("工", 16, 27);
      } else {
        ctx.fillStyle = "#5b5f66";
        ctx.fillRect(5, 19, 22, 7);
        ctx.fillStyle = "#8a7a66";
        ctx.fillRect(7, 15, 8, 7);
        ctx.fillRect(16, 12, 9, 10);
        ctx.fillStyle = "#c08a4a";
        ctx.fillRect(21, 17, 4, 4);
        ctx.fillStyle = "#363331";
        ctx.fillRect(10, 21, 4, 3);
      }
      if (remaining > 0 && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 300 + obj.x) + 1) / 2;
        ctx.strokeStyle = `rgba(231, 179, 77, ${0.22 + pulse * 0.36})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(4.5, 7.5, 23, 21);
        ctx.fillStyle = def.effectColor;
        ctx.fillRect(24, 6, 4, 4);
      }
    }

    if (obj.type === "springFairStall") {
      const open = springFairIsOpen();
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.beginPath();
      ctx.ellipse(16, 27, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6f4931";
      ctx.fillRect(4, 14, 24, 14);
      ctx.fillStyle = open ? "#e7b34d" : "#8c6841";
      ctx.fillRect(2, 7, 28, 5);
      ctx.fillStyle = "#f07f78";
      ctx.fillRect(5, 7, 5, 5);
      ctx.fillStyle = "#70b77e";
      ctx.fillRect(16, 7, 5, 5);
      ctx.fillStyle = "#d8c17a";
      ctx.fillRect(7, 19, 6, 5);
      ctx.fillStyle = "#87b95f";
      ctx.fillRect(18, 18, 6, 6);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("春", 16, 27);
      if (open && !state.story.springFairVisited && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 240) + 1) / 2;
        ctx.strokeStyle = `rgba(231, 179, 77, ${0.32 + pulse * 0.44})`;
        ctx.strokeRect(3.5, 6.5, 25, 22);
      }
    }

    if (obj.type === "springSampleCrate") {
      const completed = state.story.springSampleBundleCompleted;
      const ready = springSampleBundleReady();
      ctx.fillStyle = "rgba(0, 0, 0, 0.24)";
      ctx.beginPath();
      ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6f4931";
      ctx.fillRect(5, 14, 22, 13);
      ctx.fillStyle = completed ? "#70b77e" : ready ? "#e7b34d" : "#8a5b37";
      ctx.fillRect(4, 11, 24, 5);
      ctx.fillStyle = "#f4ecd8";
      ctx.fillRect(8, 18, 5, 4);
      ctx.fillStyle = "#87b95f";
      ctx.fillRect(15, 17, 4, 5);
      ctx.fillStyle = "#8a7a66";
      ctx.fillRect(21, 19, 5, 4);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(completed ? "录" : "样", 16, 28);
      if (ready && !completed && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 260) + 1) / 2;
        ctx.strokeStyle = `rgba(112, 183, 126, ${0.28 + pulse * 0.42})`;
        ctx.strokeRect(4.5, 10.5, 23, 18);
      }
    }

    if (obj.type === "issueBoard") {
      drawObjectShadow(16, 28, 11, 3, 0.22);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(6, 8, 20, 18);
      ctx.fillStyle = ART.wood;
      ctx.fillRect(4, 6, 24, 16);
      drawPixelStrokeRect(4, 6, 24, 16);
      drawNoticePaper(7, 9, 8, 10, ART.red);
      drawNoticePaper(17, 10, 7, 9, ART.blue);
      ctx.fillStyle = ART.red;
      ctx.fillRect(24, 8, 2, 12);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(9, 22, 3, 8);
      ctx.fillRect(20, 22, 3, 8);
    }

    if (obj.type === "directionSign") {
      ctx.fillStyle = "#5f4229";
      ctx.fillRect(14, 9, 4, 21);
      ctx.fillStyle = "#b98145";
      ctx.fillRect(6, 6, 20, 7);
      ctx.beginPath();
      ctx.moveTo(26, 6);
      ctx.lineTo(31, 9.5);
      ctx.lineTo(26, 13);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(1, 15, 20, 7);
      ctx.beginPath();
      ctx.moveTo(1, 15);
      ctx.lineTo(-4, 18.5);
      ctx.lineTo(1, 22);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("路", 16, 12);
      ctx.fillText("牌", 12, 21);
    }

    if (obj.type === "communityFacility") {
      const def = communityFacilityDef(obj.goalId);
      const level = villageFacilityLevel(obj.goalId);
      const stageText = level >= 3 ? "二" : level >= 2 ? "一" : level >= 1 ? "修" : "旧";
      ctx.save();
      ctx.globalAlpha = level <= 0 ? 0.18 : 0.24 + level * 0.08;
      ctx.fillStyle = level <= 0 ? "#6a6259" : def.color;
      ctx.fillRect(1, 4, 30, 25);
      ctx.restore();
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.beginPath();
      ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = level <= 0 ? "#3f3a35" : "#4f3827";
      ctx.fillRect(5, 13, 22, 15);
      ctx.fillStyle = level <= 0 ? "#6a6259" : def.color;
      ctx.fillRect(3, 8, 26, 7);
      if (level >= 2) {
        ctx.fillStyle = "#f2d37b";
        ctx.fillRect(5, 6, 22, 2);
      }
      if (level >= 3) {
        ctx.fillStyle = "#8cb7d7";
        ctx.fillRect(7, 4, 18, 2);
      }
      ctx.fillStyle = level <= 0 ? "#6a6259" : "#f2d37b";
      ctx.fillRect(21, 7, 9, 8);
      ctx.fillStyle = "#f4ecd8";
      ctx.fillRect(8, 11, 16, 2);
      ctx.fillStyle = "#8a5b37";
      ctx.fillRect(8, 19, 6, 8);
      ctx.fillRect(19, 18, 5, 9);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(level <= 0 ? "旧" : def.shortLabel, 16, 27);
      ctx.font = "6px sans-serif";
      ctx.fillStyle = level <= 0 ? "#f4ecd8" : "#1d2018";
      ctx.fillText(`L${level}`, 25.5, 13);
      ctx.fillStyle = "#f4ecd8";
      ctx.fillText(stageText, 16, 7);
    }

    if (obj.type === "chest") {
      ctx.fillStyle = "#6c4325";
      ctx.fillRect(5, 11, 22, 15);
      ctx.fillStyle = "#9a632f";
      ctx.fillRect(6, 8, 20, 8);
      ctx.fillStyle = "#e0b758";
      ctx.fillRect(14, 16, 4, 4);
    }

    if (obj.type === "shop" || obj.type === "seedShop") {
      const dedicatedSeedShop = obj.type === "seedShop";
      const groceryShop = obj.type === "shop";
      const starterStallUpdated = map.id === "farm" && state.story.firstShipmentSettled;
      drawObjectShadow(16, 28, 13, 4, 0.24);
      ctx.fillStyle = ART.wood;
      ctx.fillRect(4, 12, 24, 16);
      drawPixelStrokeRect(4, 12, 24, 16);
      drawMarketAwning(3, 6, 26, 7, dedicatedSeedShop || groceryShop || starterStallUpdated ? ART.green : ART.red, ART.paperDim);
      drawMiniLabel(dedicatedSeedShop ? "籽" : groceryShop ? "铺" : starterStallUpdated ? "菜" : "种", 16, 24);
      if (dedicatedSeedShop || groceryShop || starterStallUpdated) {
        drawSmallCrate(1, 23, 8, 5);
        drawSmallCrate(23, 22, 8, 6);
        ctx.fillStyle = "#88bd66";
        ctx.fillRect(3, 21, 4, 3);
        ctx.fillRect(25, 20, 4, 3);
        ctx.fillStyle = ART.gold;
        ctx.fillRect(10, 14, 5, 4);
        ctx.fillRect(18, 14, 5, 4);
      }
    }

    if (obj.type === "marketStall") {
      const stableMarket = state.story.communityOrdersCompleted;
      ctx.fillStyle = "#6f4931";
      ctx.fillRect(4, 14, 24, 14);
      ctx.fillStyle = stableMarket ? "#70b77e" : "#d95f4b";
      ctx.fillRect(2, 7, 28, 5);
      ctx.fillStyle = "#f1d07a";
      ctx.fillRect(5, 7, 5, 5);
      ctx.fillRect(16, 7, 5, 5);
      ctx.fillStyle = "#8a5b37";
      ctx.fillRect(6, 21, 7, 5);
      ctx.fillRect(19, 20, 7, 6);
      ctx.fillStyle = "#87b95f";
      ctx.fillRect(8, 18, 4, 3);
      ctx.fillStyle = "#f07f78";
      ctx.fillRect(21, 17, 4, 4);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(stableMarket ? "稳" : "集", 16, 18);
      if (stableMarket) {
        ctx.fillStyle = "#f4ecd8";
        ctx.fillRect(7, 4, 18, 3);
        ctx.fillStyle = "#2b2924";
        ctx.fillRect(10, 5, 12, 1);
      }
    }

    if (obj.type === "basketPoint") {
      ctx.fillStyle = "#8a5b37";
      ctx.fillRect(6, 15, 20, 12);
      ctx.fillStyle = "#b2783f";
      ctx.fillRect(4, 18, 24, 4);
      ctx.fillStyle = "#87b95f";
      ctx.fillRect(8, 12, 5, 5);
      ctx.fillRect(18, 13, 5, 4);
      ctx.fillStyle = "#f07f78";
      ctx.fillRect(14, 11, 4, 5);
      ctx.strokeStyle = "#d8c17a";
      ctx.beginPath();
      ctx.arc(16, 15, 9, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    if (obj.type === "tastingTable") {
      ctx.fillStyle = "#6f4931";
      ctx.fillRect(4, 17, 24, 7);
      ctx.fillRect(7, 24, 4, 5);
      ctx.fillRect(21, 24, 4, 5);
      ctx.fillStyle = "#f4ecd8";
      ctx.fillRect(8, 13, 6, 4);
      ctx.fillRect(18, 12, 6, 5);
      ctx.fillStyle = "#d98777";
      ctx.fillRect(10, 11, 3, 3);
      ctx.fillStyle = "#e7b34d";
      ctx.beginPath();
      ctx.arc(22, 10, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (obj.type === "ecommerceDesk") {
      drawObjectShadow(16, 28, 13, 4, 0.22);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(4, 16, 24, 10);
      ctx.fillStyle = ART.wood;
      ctx.fillRect(3, 14, 26, 5);
      drawPixelStrokeRect(4, 16, 24, 10);
      ctx.fillStyle = "#315f7d";
      ctx.fillRect(8, 8, 16, 8);
      ctx.fillStyle = ART.blue;
      ctx.fillRect(10, 10, 12, 4);
      ctx.fillStyle = ART.paper;
      ctx.fillRect(11, 12, 10, 1);
      drawMiniLabel("网", 16, 25);
      drawSmallCrate(5, 25, 7, 4, ART.gold);
      drawSmallCrate(21, 24, 7, 5, ART.gold);
      if (!state.story.ecommerceDeskSeen && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 260) + 1) / 2;
        ctx.strokeStyle = `rgba(117, 185, 216, ${0.32 + pulse * 0.42})`;
        ctx.strokeRect(5.5, 6.5, 21, 21);
      }
    }

    if (obj.type === "cooperativeDesk") {
      drawObjectShadow(16, 28, 13, 4, 0.22);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(3, 13, 26, 15);
      drawPixelStrokeRect(3, 13, 26, 15);
      ctx.fillStyle = state.story.cooperativeJoined ? ART.green : ART.wood;
      ctx.fillRect(5, 7, 22, 8);
      ctx.fillStyle = ART.paper;
      ctx.fillRect(7, 9, 18, 3);
      drawSmallCrate(7, 18, 6, 5, ART.gold);
      drawSmallCrate(19, 18, 6, 5, ART.gold);
      drawMiniLabel(state.story.cooperativeJoined ? "合" : "样", 16, 27);
      if (!state.story.cooperativeJoined && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 300) + 1) / 2;
        ctx.strokeStyle = `rgba(112, 183, 126, ${0.24 + pulse * 0.36})`;
        ctx.strokeRect(4.5, 6.5, 23, 22);
      }
    }

    if (obj.type === "tourismDesk") {
      drawObjectShadow(16, 28, 13, 4, 0.22);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(4, 14, 24, 14);
      drawPixelStrokeRect(4, 14, 24, 14);
      ctx.fillStyle = state.story.tourismFirstOrderCompleted ? ART.blue : "#d98777";
      ctx.fillRect(3, 8, 26, 7);
      ctx.fillStyle = ART.paper;
      ctx.fillRect(7, 10, 18, 3);
      ctx.fillStyle = ART.green;
      ctx.fillRect(7, 19, 5, 5);
      ctx.fillStyle = ART.gold;
      ctx.fillRect(14, 18, 5, 6);
      ctx.fillStyle = ART.paperDim;
      ctx.fillRect(22, 20, 5, 4);
      drawMiniLabel(state.story.tourismFirstOrderCompleted ? "游" : "客", 16, 27);
      if (!state.story.tourismFirstOrderCompleted && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 320) + 1) / 2;
        ctx.strokeStyle = `rgba(117, 185, 216, ${0.24 + pulse * 0.38})`;
        ctx.strokeRect(4.5, 7.5, 23, 21);
      }
    }

    if (obj.type === "brandDesk") {
      drawObjectShadow(16, 28, 13, 4, 0.22);
      ctx.fillStyle = ART.woodDark;
      ctx.fillRect(4, 15, 24, 13);
      drawPixelStrokeRect(4, 15, 24, 13);
      ctx.fillStyle = state.story.brandFirstShipmentSettled ? ART.gold : ART.wood;
      ctx.fillRect(3, 10, 26, 6);
      ctx.fillStyle = ART.paper;
      ctx.fillRect(7, 12, 18, 2);
      drawSmallCrate(7, 20, 7, 5, ART.clay);
      drawSmallCrate(13, 18, 6, 7, ART.green);
      drawSmallCrate(21, 19, 5, 6, "#d98777");
      drawMiniLabel(state.story.brandFirstShipmentSettled ? "牌" : "包", 16, 28);
      if (!state.story.brandFirstShipmentSettled && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 310) + 1) / 2;
        ctx.strokeStyle = `rgba(216, 193, 122, ${0.24 + pulse * 0.38})`;
        ctx.strokeRect(4.5, 8.5, 23, 21);
      }
    }

    if (obj.type === "irrigationPump") {
      drawObjectShadow(16, 28, 12, 4, 0.23);
      ctx.fillStyle = "#3e4c52";
      ctx.fillRect(7, 12, 18, 15);
      drawPixelStrokeRect(7, 12, 18, 15);
      ctx.fillStyle = state.story.irrigationFirstProjectCompleted ? ART.blue : "#8c929a";
      ctx.fillRect(5, 9, 22, 6);
      ctx.fillStyle = "#31546d";
      ctx.fillRect(10, 16, 12, 7);
      ctx.fillStyle = ART.gold;
      ctx.fillRect(22, 18, 7, 3);
      ctx.fillRect(26, 18, 3, 10);
      ctx.strokeStyle = state.story.irrigationFirstProjectCompleted ? ART.blue : "#5b5f66";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(16, 10, 6, 0, Math.PI * 2);
      ctx.stroke();
      drawMiniLabel(state.story.irrigationFirstProjectCompleted ? "渠" : "泵", 16, 28);
      if (!state.story.irrigationFirstProjectCompleted && state.settings.effectsEnabled) {
        const pulse = (Math.sin(performance.now() / 300) + 1) / 2;
        ctx.strokeStyle = `rgba(117, 185, 216, ${0.22 + pulse * 0.4})`;
        ctx.strokeRect(5.5, 7.5, 22, 21);
      }
    }

    if (obj.type === "shippingBin") {
      const firstShipmentSettled = map.id === "farm" && state.story.firstShipmentSettled;
      drawObjectShadow(16, 29, 13, 4, 0.24);
      ctx.fillStyle = "#4e3627";
      ctx.fillRect(5, 10, 22, 18);
      drawPixelStrokeRect(5, 10, 22, 18);
      ctx.fillStyle = ART.wood;
      ctx.fillRect(3, 8, 26, 5);
      ctx.fillStyle = ART.gold;
      ctx.fillRect(8, 15, 16, 3);
      ctx.fillRect(8, 21, 12, 3);
      if (firstShipmentSettled) {
        drawSmallCrate(2, 22, 8, 6);
        drawSmallCrate(22, 22, 8, 6);
        ctx.fillStyle = "#f07f78";
        ctx.fillRect(4, 20, 3, 3);
        ctx.fillStyle = "#87b95f";
        ctx.fillRect(24, 20, 4, 3);
        ctx.fillStyle = ART.paper;
        ctx.fillRect(10, 6, 12, 4);
        ctx.fillStyle = ART.ink;
        ctx.fillRect(12, 8, 8, 1);
      }
    }

    if (obj.type === "kitchen") {
      ctx.fillStyle = "#594034";
      ctx.fillRect(4, 10, 24, 18);
      ctx.fillStyle = "#8e6f5a";
      ctx.fillRect(5, 7, 22, 6);
      ctx.fillStyle = "#d8d1bf";
      ctx.fillRect(9, 12, 14, 6);
      ctx.fillStyle = "#3a3f42";
      ctx.fillRect(11, 20, 10, 5);
      ctx.fillStyle = "#e7b34d";
      ctx.beginPath();
      ctx.arc(16, 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (obj.type === "processor") {
      const machine = state.machines[machineIdForObject(obj)];
      ctx.fillStyle = "#5b3c2a";
      ctx.fillRect(7, 9, 18, 19);
      ctx.fillStyle = "#8f5d38";
      ctx.fillRect(5, 7, 22, 6);
      ctx.fillRect(6, 23, 20, 4);
      ctx.fillStyle = "#c08a4a";
      ctx.fillRect(9, 12, 14, 3);
      ctx.fillRect(9, 19, 14, 3);
      if (machine?.readyGoodId) {
        const pulse = (Math.sin(performance.now() / 240) + 1) / 2;
        ctx.fillStyle = `rgba(231, 179, 77, ${0.6 + pulse * 0.35})`;
        ctx.beginPath();
        ctx.arc(16, 5, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (machine?.recipeId) {
        ctx.fillStyle = "rgba(244, 236, 216, 0.62)";
        ctx.fillRect(13, 3, 2, 4);
        ctx.fillRect(18, 1, 2, 5);
      }
    }

    if (obj.type === "dryer") {
      const machine = state.machines[machineIdForObject(obj)];
      ctx.fillStyle = "#5c4630";
      ctx.fillRect(5, 10, 22, 4);
      ctx.fillRect(6, 20, 20, 4);
      ctx.fillStyle = "#8a643b";
      ctx.fillRect(7, 6, 4, 22);
      ctx.fillRect(21, 6, 4, 22);
      ctx.fillStyle = "#d4a85e";
      ctx.fillRect(10, 13, 12, 2);
      ctx.fillRect(10, 17, 12, 2);
      ctx.fillStyle = "#d98777";
      ctx.fillRect(12, 9, 3, 3);
      ctx.fillRect(17, 21, 3, 3);
      if (machine?.readyGoodId) {
        const pulse = (Math.sin(performance.now() / 240) + 1) / 2;
        ctx.fillStyle = `rgba(231, 179, 77, ${0.58 + pulse * 0.36})`;
        ctx.fillRect(14, 3, 5, 5);
      } else if (machine?.recipeId) {
        ctx.fillStyle = "rgba(244, 236, 216, 0.58)";
        ctx.fillRect(13, 4, 2, 4);
        ctx.fillRect(18, 5, 2, 4);
      }
    }

    if (obj.type === "flowerBox") {
      const flowerColors = seasonFlowerColors();
      ctx.fillStyle = "#6f4931";
      ctx.fillRect(5, 18, 22, 8);
      ctx.fillStyle = "#8c5d3d";
      ctx.fillRect(4, 16, 24, 4);
      ctx.fillStyle = currentSeasonId() === "winter" ? "#6e8790" : "#4f8b58";
      ctx.fillRect(7, 13, 18, 4);
      for (const [index, fx] of [9, 16, 23].entries()) {
        ctx.fillStyle = flowerColors[index];
        ctx.beginPath();
        ctx.arc(fx, 12, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (obj.type === "gardenLamp") {
      const glow = lampGlowStrength();
      const pulse = state.settings.effectsEnabled ? (Math.sin(performance.now() / 360 + obj.x * 0.5) + 1) / 2 : 0;
      ctx.fillStyle = `rgba(231, 179, 77, ${0.12 * glow + pulse * 0.08 * glow})`;
      ctx.beginPath();
      ctx.arc(16, 9, 11 + 8 * glow + pulse * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a3a2b";
      ctx.fillRect(14, 11, 4, 16);
      ctx.fillStyle = "#6b5540";
      ctx.fillRect(10, 26, 12, 3);
      ctx.fillStyle = isLampLitTime() ? "#ffd66d" : "#b99149";
      ctx.fillRect(11, 5, 10, 8);
      ctx.fillStyle = `rgba(231, 179, 77, ${0.18 + 0.24 * glow})`;
      ctx.beginPath();
      ctx.arc(16, 9, 8 + 3 * glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f4ecd8";
      ctx.fillRect(13, 7, 6, 3);
    }

    if (obj.type === "bench") {
      ctx.fillStyle = "#5f3f2a";
      ctx.fillRect(7, 13, 18, 5);
      ctx.fillRect(6, 20, 20, 5);
      ctx.fillStyle = "#8a5b37";
      ctx.fillRect(5, 11, 22, 3);
      ctx.fillRect(5, 18, 22, 3);
      ctx.fillStyle = "#3d2f25";
      ctx.fillRect(8, 25, 3, 4);
      ctx.fillRect(21, 25, 3, 4);
    }

    if (obj.type === "fence") {
      ctx.fillStyle = "#3d2b1e";
      ctx.fillRect(7, 12, 4, 16);
      ctx.fillRect(21, 12, 4, 16);
      ctx.fillStyle = "#7a5137";
      ctx.fillRect(5, 13, 22, 4);
      ctx.fillRect(5, 21, 22, 4);
      ctx.fillStyle = "#b98145";
      ctx.fillRect(8, 9, 2, 4);
      ctx.fillRect(22, 9, 2, 4);
    }

    if (obj.type === "upgradeBoard") {
      ctx.fillStyle = "#4f3827";
      ctx.fillRect(6, 8, 20, 18);
      ctx.fillStyle = "#b98145";
      ctx.fillRect(4, 5, 24, 14);
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("UP", 16, 16);
      ctx.fillStyle = "#5f4229";
      ctx.fillRect(14, 20, 4, 10);
    }

    if (obj.type === "well") {
      ctx.fillStyle = "#5b5f66";
      ctx.fillRect(6, 13, 20, 13);
      ctx.fillStyle = "#8c929a";
      ctx.fillRect(4, 10, 24, 5);
      ctx.fillStyle = "#31546d";
      ctx.fillRect(10, 16, 12, 7);
      ctx.fillStyle = "#7a5137";
      ctx.fillRect(8, 4, 3, 10);
      ctx.fillRect(21, 4, 3, 10);
      ctx.fillRect(8, 3, 16, 3);
    }

    if (obj.type === "bed") {
      ctx.fillStyle = "#6b4a36";
      ctx.fillRect(4, 8, 24, 20);
      ctx.fillStyle = "#b96b58";
      ctx.fillRect(7, 11, 18, 14);
      ctx.fillStyle = "#f4ecd8";
      ctx.fillRect(8, 12, 8, 6);
      ctx.fillStyle = "rgba(70, 39, 31, 0.32)";
      ctx.fillRect(7, 22, 18, 3);
    }

    if (obj.type === "mailbox") {
      ctx.fillStyle = "#5a3b27";
      ctx.fillRect(14, 15, 4, 14);
      ctx.fillStyle = "#356384";
      ctx.fillRect(7, 8, 18, 11);
      ctx.fillStyle = "#487fa6";
      ctx.beginPath();
      ctx.moveTo(7, 10);
      ctx.quadraticCurveTo(16, 3, 25, 10);
      ctx.lineTo(25, 13);
      ctx.lineTo(7, 13);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = unreadMailCount() > 0 ? "#e7b34d" : "#f4ecd8";
      ctx.fillRect(21, 5, 3, 9);
      ctx.fillStyle = "rgba(244, 236, 216, 0.58)";
      ctx.fillRect(10, 13, 9, 2);
    }

    ctx.restore();
  }
}

function drawPlayer() {
  const { x, y } = state.player;
  if (drawAnchoredRasterAssetIfReady(playerVisualDescriptor(), x, y)) return;
  if (drawAnchoredRasterAssetIfReady(playerFallbackVisualDescriptor(), x, y)) return;
  const action = currentPlayerMotionAction();
  const facing = state.player.facing ?? "down";
  const step = Math.sin(motion.playerStepClock * Math.PI * (action === "run" ? 7.5 : 5.5));
  const bob = action === "walk" || action === "run" ? Math.round(Math.abs(step) * (action === "run" ? 3 : 2)) : action === "idle" ? Math.round(Math.sin(performance.now() / 620) * 0.6) : 0;
  const swing = action === "walk" || action === "run" ? step : action === "inspect" ? 0.6 : 0;
  const actionPulse = Math.sin(Math.min(1, Math.max(0, (motion.playerActionUntil - performance.now()) / 520)) * Math.PI);
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y - bob));
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(0, 13 + bob, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  const side = facing === "left" ? -1 : 1;
  const bodyColor = action === "run" ? "#2f5d8f" : "#314d7f";
  const shirtShade = "#20365f";
  const skin = "#efc98e";
  const hair = "#593d2f";

  ctx.fillStyle = "#24314e";
  ctx.fillRect(-5, 8, 4, 6 + Math.max(0, swing) * 2);
  ctx.fillRect(2, 8, 4, 6 + Math.max(0, -swing) * 2);
  ctx.fillStyle = "#314d7f";
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-7, -7, 14, 18);
  ctx.fillStyle = shirtShade;
  ctx.fillRect(-7, 2, 14, 3);

  ctx.fillStyle = skin;
  ctx.fillRect(-6, -20, 12, 12);
  ctx.fillStyle = hair;
  ctx.fillRect(-8, -22, 16, 6);
  ctx.fillStyle = facing === "left" ? "#17294a" : ART.paper;
  ctx.fillRect(-4, -16, 2, 2);
  ctx.fillStyle = facing === "right" ? "#17294a" : ART.paper;
  ctx.fillRect(3, -16, 2, 2);

  ctx.fillStyle = skin;
  const armLift = ["hoe", "seeds", "wateringCan", "scythe", "fishingRod", "fishingCatch", "harvest", "inspect"].includes(action);
  if (armLift) {
    const lift = Math.round(actionPulse * 5);
    ctx.fillRect(-10, -5 - lift, 4, 11);
    ctx.fillRect(6, -5 - lift, 4, 11);
  } else {
    ctx.fillRect(-10, -5 + swing * 2, 4, 10);
    ctx.fillRect(6, -5 - swing * 2, 4, 10);
  }

  ctx.save();
  ctx.translate(side * 11, -3);
  ctx.fillStyle = ART.gold;
  if (action === "hoe") {
    ctx.fillRect(-1, -9, 2, 18);
    ctx.fillStyle = "#8c929a";
    ctx.fillRect(side > 0 ? -1 : -7, -11, 7, 3);
  } else if (action === "seeds") {
    ctx.fillStyle = "#d8c17a";
    ctx.fillRect(-3, -4, 6, 6);
    ctx.fillStyle = ART.green;
    ctx.fillRect(-1, -7, 3, 3);
  } else if (action === "wateringCan") {
    ctx.fillStyle = ART.blue;
    ctx.fillRect(-5, -4, 9, 7);
    ctx.fillStyle = "rgba(190, 230, 245, 0.78)";
    ctx.fillRect(side * 5, -1, 5, 2);
  } else if (action === "scythe" || action === "harvest") {
    ctx.fillStyle = "#d8d1bf";
    ctx.fillRect(-1, -10, 2, 17);
    ctx.beginPath();
    ctx.arc(side * 3, -9, 6, Math.PI * 0.1, Math.PI * 0.75);
    ctx.strokeStyle = "#d8d1bf";
    ctx.stroke();
  } else if (action === "fishingRod" || action === "fishingCatch") {
    ctx.strokeStyle = "#7a5137";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 5);
    ctx.lineTo(side * 14, -20);
    ctx.stroke();
    ctx.strokeStyle = "rgba(244, 236, 216, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(side * 14, -20);
    ctx.lineTo(side * 20, 4);
    ctx.stroke();
  } else if (action === "inspect") {
    ctx.fillStyle = ART.paper;
    ctx.fillRect(-4, -7, 8, 6);
  }
  ctx.restore();
  ctx.restore();
}

function drawNpcs(minX, minY, maxX, maxY) {
  if (!currentMapRules().showsNpcs) return;
  for (const npc of state.npcs) {
    if (!npcBelongsToMap(npc)) continue;
    if (npc.x < minX || npc.x > maxX || npc.y < minY || npc.y > maxY) continue;
    const x = npc.x * TILE_SIZE + TILE_SIZE / 2;
    const y = npc.y * TILE_SIZE + TILE_SIZE / 2;
    const descriptor = npcVisualDescriptor(npc);
    const fallbackDescriptor = npcVisualDescriptor(npc, false);
    if (drawAnchoredRasterAssetIfReady(descriptor, x, y) || drawAnchoredRasterAssetIfReady(fallbackDescriptor, x, y)) {
      ctx.fillStyle = "#f4ecd8";
      ctx.font = "8px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(npc.name, x, y - descriptor.anchorY - 4);
      continue;
    }

    const talking = motion.lastNpcTalkId === npc.id;
    const idleWave = Math.sin(performance.now() / (talking ? 180 : 720) + npc.x * 0.7 + npc.y * 0.4);
    const bob = talking ? Math.round(Math.abs(idleWave) * 1.4) : Math.round(idleWave * 0.6);
    const dxToPlayer = state.player.x - x;
    const dyToPlayer = state.player.y - y;
    const face = talking
      ? Math.abs(dxToPlayer) > Math.abs(dyToPlayer)
        ? dxToPlayer > 0 ? "right" : "left"
        : dyToPlayer > 0 ? "down" : "up"
      : "down";

    ctx.save();
    ctx.translate(x, y - bob);
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 13 + bob, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = npc.color ?? "#7a4d8f";
    ctx.fillRect(-7, -6, 14, 17);
    ctx.fillStyle = "rgba(244, 236, 216, 0.16)";
    ctx.fillRect(-7, 0, 14, 2);
    ctx.fillStyle = "#f0c79a";
    ctx.fillRect(-6, -19, 12, 12);
    ctx.fillStyle = npc.hairColor ?? "#5a2f55";
    ctx.fillRect(-8, -22, 16, 6);
    ctx.fillStyle = face === "left" ? "#17294a" : ART.paper;
    ctx.fillRect(-4, -16, 2, 2);
    ctx.fillStyle = face === "right" ? "#17294a" : ART.paper;
    ctx.fillRect(3, -16, 2, 2);
    ctx.fillStyle = "#f0c79a";
    const armOffset = talking ? Math.round(idleWave * 2) : 0;
    ctx.fillRect(-10, -4 + armOffset, 4, 9);
    ctx.fillRect(6, -4 - armOffset, 4, 9);
    if (talking) {
      ctx.fillStyle = "rgba(231, 179, 77, 0.85)";
      ctx.fillRect(10, -26, 4, 4);
    }
    ctx.fillStyle = "#f4ecd8";
    ctx.font = "8px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, 0, -26);
    ctx.restore();
  }
}

function drawDebug(map, minX, minY, maxX, maxY) {
  if (debug.grid) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let x = minX; x <= maxX + 1; x += 1) {
      ctx.beginPath();
      ctx.moveTo(x * TILE_SIZE, minY * TILE_SIZE);
      ctx.lineTo(x * TILE_SIZE, (maxY + 1) * TILE_SIZE);
      ctx.stroke();
    }
    for (let y = minY; y <= maxY + 1; y += 1) {
      ctx.beginPath();
      ctx.moveTo(minX * TILE_SIZE, y * TILE_SIZE);
      ctx.lineTo((maxX + 1) * TILE_SIZE, y * TILE_SIZE);
      ctx.stroke();
    }
  }

  if (debug.collision) {
    ctx.fillStyle = "rgba(199, 77, 68, 0.42)";
    for (let y = minY; y <= maxY; y += 1) {
      for (let x = minX; x <= maxX; x += 1) {
        if (isSolidTile(map, x, y)) ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}

function minimapTileColor(tileId, mapId = state.mapId) {
  return tileColorForMap(tileId, mapId);
}

function minimapObjectColor(type) {
  if (type === "warp") return "#75b9d8";
  if (type === "seedShop" || type === "shop" || type === "shippingBin" || type === "mailbox") return "#e7b34d";
  if (type === "kitchen") return "#d98777";
  if (type === "processor") return "#c08a4a";
  if (type === "dryer") return "#d4a85e";
  if (type === "flowerBox") return "#f07f78";
  if (type === "gardenLamp") return "#e7b34d";
  if (type === "bench") return "#8a5b37";
  if (type === "fence") return "#7a5137";
  if (type === "marketStall") return "#d95f4b";
  if (type === "basketPoint") return "#70b77e";
  if (type === "tastingTable") return "#e7b34d";
  if (type === "ecommerceDesk") return "#75b9d8";
  if (type === "cooperativeDesk") return "#70b77e";
  if (type === "tourismDesk") return "#75b9d8";
  if (type === "brandDesk") return "#d8c17a";
  if (type === "irrigationPump") return "#75b9d8";
  if (type === "landShrine") return "#d8c17a";
  if (type === "resourceNode") return "#8a7a66";
  if (type === "springFairStall") return "#e7b34d";
  if (type === "springSampleCrate") return "#70b77e";
  if (type === "issueBoard") return "#d95f4b";
  if (type === "communityFacility") return "#70b77e";
  if (type === "directionSign") return "#b98145";
  if (type === "ruin") return "#8c6841";
  if (type === "well") return "#8cb7d7";
  if (type === "bed") return "#d98777";
  return "#f4ecd8";
}

function minimapObjectLabel(object) {
  if (!object) return "";
  const labels = {
    warp: "地图入口",
    seedShop: "村庄种子铺",
    shop: "村庄杂货铺",
    shippingBin: "出货箱",
    mailbox: "邮箱",
    bed: "床",
    well: "水源",
    kitchen: "厨房",
    processor: "加工桶",
    dryer: "晾晒架",
    upgradeBoard: "建造公告牌",
    cooperativeDesk: "合作社",
    tourismDesk: "游客服务",
    brandDesk: "品牌包装",
    irrigationPump: "水利水泵",
    landShrine: "土地庙",
    resourceNode: "山里资源点",
    springFairStall: "春集种子摊",
    springSampleCrate: "春季样本箱",
    issueBoard: "村情记录板",
    communityFacility: "村庄设施",
    directionSign: "路牌",
    ruin: "待修复废墟",
  };
  return object.name ?? labels[object.type] ?? object.type;
}

function minimapTileLabel(map, tile) {
  if (!map || !tile) return "";
  if (map.spawn.x === tile.x && map.spawn.y === tile.y) return "出生点";
  if (mapRulesFor(map.id).showsNpcs) {
    const npc = state.npcs.find((item) => npcBelongsToMap(item, map.id) && item.x === tile.x && item.y === tile.y);
    if (npc) return `NPC ${npc.name}`;
  }
  const object = map.objects.find((item) => objectBelongsToMap(item, map.id) && item.x === tile.x && item.y === tile.y);
  if (object) return minimapObjectLabel(object);
  if (mapRulesFor(map.id).showsCrops) {
    const crop = state.dynamicObjects.find((item) => isCropOnMap(item, map.id) && item.x === tile.x && item.y === tile.y);
    if (crop) return crop.ready ? `成熟${cropDef(crop.cropId).name}` : `${cropDef(crop.cropId).name}生长中`;
  }
  return "";
}

function minimapDirectionText(target) {
  if (!target || target.mapId !== state.mapId) return "跨地图";
  const player = playerTile();
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const distance = Math.round(Math.hypot(dx, dy));
  if (distance === 0) return "已到达";
  const vertical = dy < 0 ? "北" : dy > 0 ? "南" : "";
  const horizontal = dx < 0 ? "西" : dx > 0 ? "东" : "";
  return `${vertical}${horizontal || ""} ${distance} 格`;
}

function drawMinimapPoint(ox, oy, scale, tile, color, radius = 0.72) {
  minimapCtx.fillStyle = color;
  minimapCtx.beginPath();
  minimapCtx.arc(ox + (tile.x + 0.5) * scale, oy + (tile.y + 0.5) * scale, Math.max(3, scale * radius), 0, Math.PI * 2);
  minimapCtx.fill();
  minimapCtx.strokeStyle = "rgba(16, 18, 14, 0.72)";
  minimapCtx.lineWidth = 1;
  minimapCtx.stroke();
}

function minimapMetrics(map = currentMap()) {
  const w = ui.minimap.width;
  const h = ui.minimap.height;
  const pad = 10;
  const scale = Math.min((w - pad * 2) / map.width, (h - pad * 2) / map.height);
  const mapW = map.width * scale;
  const mapH = map.height * scale;
  return {
    w,
    h,
    scale,
    mapW,
    mapH,
    ox: Math.floor((w - mapW) / 2),
    oy: Math.floor((h - mapH) / 2),
  };
}

function minimapTileFromPointer(event) {
  const map = currentMap();
  const metrics = minimapMetrics(map);
  const rect = ui.minimap.getBoundingClientRect();
  const px = ((event.clientX - rect.left) / rect.width) * ui.minimap.width;
  const py = ((event.clientY - rect.top) / rect.height) * ui.minimap.height;
  const x = Math.floor((px - metrics.ox) / metrics.scale);
  const y = Math.floor((py - metrics.oy) / metrics.scale);
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return null;
  return { x, y };
}

function minimapTargetText(target = minimapState.target) {
  const effectiveTarget = target ?? currentStoryTargetInfo();
  if (!effectiveTarget) return "未设置";
  const prefix = target ? "手动" : "推荐";
  const map = maps[effectiveTarget.mapId];
  const label = effectiveTarget.label ?? minimapTileLabel(map, effectiveTarget);
  const route = minimapDirectionText(effectiveTarget);
  return `${prefix} ${map?.name ?? effectiveTarget.mapId} ${effectiveTarget.x},${effectiveTarget.y}${label ? ` · ${label}` : ""} · ${route}`;
}

function drawMinimapTargetMarker(ox, oy, scale, target, strokeStyle, fillStyle, radius = 1.1) {
  if (!target || target.mapId !== state.mapId) return;
  const tx = ox + (target.x + 0.5) * scale;
  const ty = oy + (target.y + 0.5) * scale;
  minimapCtx.strokeStyle = strokeStyle;
  minimapCtx.fillStyle = fillStyle;
  minimapCtx.lineWidth = 2;
  minimapCtx.beginPath();
  minimapCtx.arc(tx, ty, Math.max(5, scale * radius), 0, Math.PI * 2);
  minimapCtx.fill();
  minimapCtx.stroke();
  minimapCtx.beginPath();
  minimapCtx.moveTo(tx - 5, ty);
  minimapCtx.lineTo(tx + 5, ty);
  minimapCtx.moveTo(tx, ty - 5);
  minimapCtx.lineTo(tx, ty + 5);
  minimapCtx.stroke();
}

function manualAndStoryTargetsMatch(storyTarget) {
  return (
    minimapState.target &&
    storyTarget &&
    minimapState.target.mapId === storyTarget.mapId &&
    minimapState.target.x === storyTarget.x &&
    minimapState.target.y === storyTarget.y
  );
}

function updateMinimapReadout() {
  const hoverLabel = minimapTileLabel(currentMap(), minimapState.hoverTile);
  ui.minimapHoverReadout.textContent = minimapState.hoverTile
    ? `${minimapState.hoverTile.x},${minimapState.hoverTile.y}${hoverLabel ? ` · ${hoverLabel}` : ""}`
    : "-";
  ui.minimapTargetReadout.textContent = minimapTargetText();
}

function setMinimapTarget(tile) {
  if (!tile) return false;
  minimapState.target = { mapId: state.mapId, x: tile.x, y: tile.y };
  updateMinimapReadout();
  const label = minimapTileLabel(currentMap(), tile);
  addLog(`小地图目标：${currentMap().name} ${tile.x}, ${tile.y}${label ? ` · ${label}` : ""} · ${minimapDirectionText(minimapState.target)}`);
  addToolFeedback(tile, "目标", "info");
  return true;
}

function clearMinimapTarget() {
  if (!minimapState.target) return false;
  minimapState.target = null;
  updateMinimapReadout();
  addLog("小地图目标已清除。");
  return true;
}

function setGameMinimapVisible(visible) {
  minimapState.visible = Boolean(visible);
  addLog(`游戏内小地图已${minimapState.visible ? "显示" : "隐藏"}。`);
}

function toggleGameMinimap() {
  setGameMinimapVisible(!minimapState.visible);
}

function drawMinimap(map, viewW, viewH) {
  const { w, h, scale, ox, oy } = minimapMetrics(map);

  ui.minimapMapName.textContent = map.name;
  updateMinimapReadout();
  minimapCtx.clearRect(0, 0, w, h);
  minimapCtx.fillStyle = "#10140e";
  minimapCtx.fillRect(0, 0, w, h);

  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const px = ox + x * scale;
      const py = oy + y * scale;
      const size = Math.ceil(scale);
      minimapCtx.fillStyle = minimapTileColor(map.layers.ground[y][x], map.id);
      minimapCtx.fillRect(px, py, size, size);
      const buildingTile = map.layers.buildings[y][x];
      const frontTile = map.layers.front[y][x];
      if (buildingTile) {
        minimapCtx.fillStyle = minimapTileColor(buildingTile, map.id);
        minimapCtx.fillRect(px, py, size, size);
      }
      if (frontTile) {
        minimapCtx.fillStyle = minimapTileColor(frontTile, map.id);
        minimapCtx.fillRect(px, py, size, size);
      }
      if (map.layers.collision[y][x] === 1) {
        minimapCtx.fillStyle = "rgba(22, 18, 14, 0.26)";
        minimapCtx.fillRect(px, py, size, size);
      }
    }
  }

  if (mapRulesFor(map.id).showsCrops) {
    for (const crop of state.dynamicObjects) {
      if (!isCropOnMap(crop, map.id)) continue;
      minimapCtx.fillStyle = crop.ready ? cropDef(crop.cropId).cropColor : cropDef(crop.cropId).sproutColor;
      minimapCtx.fillRect(ox + crop.x * scale, oy + crop.y * scale, Math.max(2, scale), Math.max(2, scale));
    }
  }

  drawMinimapPoint(ox, oy, scale, map.spawn, "#f4ecd8", 0.8);

  if (mapRulesFor(map.id).showsNpcs) {
    minimapCtx.fillStyle = "#b98cff";
    for (const npc of state.npcs) {
      if (!npcBelongsToMap(npc, map.id)) continue;
      minimapCtx.beginPath();
      minimapCtx.arc(ox + (npc.x + 0.5) * scale, oy + (npc.y + 0.5) * scale, Math.max(2.5, scale * 0.65), 0, Math.PI * 2);
      minimapCtx.fill();
    }
  }

  for (const obj of map.objects) {
    if (!objectBelongsToMap(obj, map.id)) continue;
    const color = obj.type === "communityFacility" ? communityFacilityDef(obj.goalId).color : minimapObjectColor(obj.type);
    const important = [
      "warp",
      "seedShop",
      "shop",
      "shippingBin",
      "landShrine",
      "resourceNode",
      "springFairStall",
      "springSampleCrate",
      "issueBoard",
      "communityFacility",
      "directionSign",
      "ruin",
      "cooperativeDesk",
      "upgradeBoard",
    ].includes(obj.type);
    if (important) {
      const facilityRadius = obj.type === "communityFacility" ? 0.78 + villageFacilityLevel(obj.goalId) * 0.12 : null;
      drawMinimapPoint(ox, oy, scale, obj, color, facilityRadius ?? (obj.type === "warp" ? 0.85 : 0.72));
    } else {
      minimapCtx.fillStyle = color;
      minimapCtx.fillRect(
        ox + (obj.x + 0.2) * scale,
        oy + (obj.y + 0.2) * scale,
        Math.max(3, scale * 0.6),
        Math.max(3, scale * 0.6),
      );
    }
  }

  const storyTargetInfo = currentStoryTargetInfo();
  if (storyTargetInfo && !manualAndStoryTargetsMatch(storyTargetInfo)) {
    drawMinimapTargetMarker(ox, oy, scale, storyTargetInfo, "#e7b34d", "rgba(231, 179, 77, 0.22)", 1.18);
  }
  drawMinimapTargetMarker(ox, oy, scale, minimapState.target, "#70b77e", "rgba(112, 183, 126, 0.28)", 1.1);

  if (minimapState.hoverTile) {
    minimapCtx.strokeStyle = "rgba(244, 236, 216, 0.72)";
    minimapCtx.lineWidth = 1;
    minimapCtx.strokeRect(ox + minimapState.hoverTile.x * scale, oy + minimapState.hoverTile.y * scale, Math.max(3, scale), Math.max(3, scale));
  }

  const playerTileX = state.player.x / TILE_SIZE;
  const playerTileY = state.player.y / TILE_SIZE;
  minimapCtx.fillStyle = "#f4ecd8";
  minimapCtx.beginPath();
  minimapCtx.arc(ox + playerTileX * scale, oy + playerTileY * scale, Math.max(3.5, scale * 0.72), 0, Math.PI * 2);
  minimapCtx.fill();
  minimapCtx.strokeStyle = "#151814";
  minimapCtx.lineWidth = 1;
  minimapCtx.stroke();

  minimapCtx.strokeStyle = "rgba(244, 236, 216, 0.76)";
  minimapCtx.lineWidth = 1;
  minimapCtx.strokeRect(
    ox + (state.camera.x / TILE_SIZE) * scale,
    oy + (state.camera.y / TILE_SIZE) * scale,
    (viewW / TILE_SIZE) * scale,
    (viewH / TILE_SIZE) * scale,
  );
}

function drawCollisionOverlay(map, minX, minY, maxX, maxY) {
  ctx.fillStyle = "rgba(199, 77, 68, 0.34)";
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (map.layers.collision[y]?.[x] === 1) ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawObjectPreview(type, tileX, tileY, options = {}) {
  const x = tileX * TILE_SIZE;
  const y = tileY * TILE_SIZE;
  const tint = options.tint ?? "rgba(231, 179, 77, 0.34)";

  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.beginPath();
  ctx.ellipse(x + TILE_SIZE / 2, y + 24, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (type === "processor") {
    ctx.fillStyle = "#5b3c2a";
    ctx.fillRect(x + 7, y + 9, 18, 19);
    ctx.fillStyle = "#8f5d38";
    ctx.fillRect(x + 5, y + 7, 22, 6);
    ctx.fillRect(x + 6, y + 23, 20, 4);
    ctx.fillStyle = "#c08a4a";
    ctx.fillRect(x + 9, y + 12, 14, 3);
    ctx.fillRect(x + 9, y + 19, 14, 3);
    ctx.restore();
    return;
  }

  if (type === "dryer") {
    ctx.fillStyle = "#5c4630";
    ctx.fillRect(x + 5, y + 10, 22, 4);
    ctx.fillRect(x + 6, y + 20, 20, 4);
    ctx.fillStyle = "#8a643b";
    ctx.fillRect(x + 7, y + 6, 4, 22);
    ctx.fillRect(x + 21, y + 6, 4, 22);
    ctx.fillStyle = "#d4a85e";
    ctx.fillRect(x + 10, y + 13, 12, 2);
    ctx.fillRect(x + 10, y + 17, 12, 2);
    ctx.restore();
    return;
  }

  if (type === "flowerBox") {
    const flowerColors = seasonFlowerColors();
    ctx.fillStyle = "#6f4931";
    ctx.fillRect(x + 5, y + 18, 22, 8);
    ctx.fillStyle = "#8c5d3d";
    ctx.fillRect(x + 4, y + 16, 24, 4);
    ctx.fillStyle = currentSeasonId() === "winter" ? "#6e8790" : "#4f8b58";
    ctx.fillRect(x + 7, y + 13, 18, 4);
    for (const [index, fx] of [9, 16, 23].entries()) {
      ctx.fillStyle = flowerColors[index];
      ctx.beginPath();
      ctx.arc(x + fx, y + 12, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  if (type === "gardenLamp") {
    const glow = lampGlowStrength();
    ctx.fillStyle = `rgba(231, 179, 77, ${0.12 + 0.16 * glow})`;
    ctx.beginPath();
    ctx.arc(x + 16, y + 9, 10 + 7 * glow, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a3a2b";
    ctx.fillRect(x + 14, y + 11, 4, 16);
    ctx.fillStyle = "#6b5540";
    ctx.fillRect(x + 10, y + 26, 12, 3);
    ctx.fillStyle = isLampLitTime() ? "#ffd66d" : "#b99149";
    ctx.fillRect(x + 11, y + 5, 10, 8);
    ctx.fillStyle = "#f4ecd8";
    ctx.fillRect(x + 13, y + 7, 6, 3);
    ctx.restore();
    return;
  }

  if (type === "bench") {
    ctx.fillStyle = "#5f3f2a";
    ctx.fillRect(x + 7, y + 13, 18, 5);
    ctx.fillRect(x + 6, y + 20, 20, 5);
    ctx.fillStyle = "#8a5b37";
    ctx.fillRect(x + 5, y + 11, 22, 3);
    ctx.fillRect(x + 5, y + 18, 22, 3);
    ctx.fillStyle = "#3d2f25";
    ctx.fillRect(x + 8, y + 25, 3, 4);
    ctx.fillRect(x + 21, y + 25, 3, 4);
    ctx.restore();
    return;
  }

  if (type === "fence") {
    ctx.fillStyle = "#3d2b1e";
    ctx.fillRect(x + 7, y + 12, 4, 16);
    ctx.fillRect(x + 21, y + 12, 4, 16);
    ctx.fillStyle = "#7a5137";
    ctx.fillRect(x + 5, y + 13, 22, 4);
    ctx.fillRect(x + 5, y + 21, 22, 4);
    ctx.fillStyle = "#b98145";
    ctx.fillRect(x + 8, y + 9, 2, 4);
    ctx.fillRect(x + 22, y + 9, 2, 4);
    ctx.restore();
    return;
  }

  if (type === "ruin") {
    ctx.fillStyle = "#4d463d";
    ctx.fillRect(x + 5, y + 17, 8, 9);
    ctx.fillRect(x + 16, y + 12, 6, 14);
    ctx.fillRect(x + 23, y + 20, 5, 6);
    ctx.fillStyle = "#7d735f";
    ctx.fillRect(x + 6, y + 14, 7, 4);
    ctx.fillRect(x + 15, y + 9, 9, 4);
    ctx.fillRect(x + 22, y + 17, 6, 3);
    ctx.fillStyle = "#8c6841";
    ctx.fillRect(x + 10, y + 7, 12, 5);
    ctx.restore();
    return;
  }

  ctx.fillStyle = tint;
  ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.82)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4.5, y + 4.5, TILE_SIZE - 9, TILE_SIZE - 9);
  ctx.fillStyle = "#f4ecd8";
  ctx.font = "8px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(type.slice(0, 4).toUpperCase(), x + TILE_SIZE / 2, y + 19);
  ctx.restore();
}

function toolStateColor(stateName) {
  if (stateName === "ready") return "#70b77e";
  if (stateName === "blocked") return "#c76050";
  return "#e7b34d";
}

function drawTileLabel(tile, text, color, yOffset = -4) {
  if (!text) return;
  const x = tile.x * TILE_SIZE + TILE_SIZE / 2;
  const y = tile.y * TILE_SIZE + yOffset;
  ctx.save();
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const width = Math.min(92, Math.max(38, ctx.measureText(text).width + 12));
  ctx.fillStyle = "rgba(16, 18, 14, 0.78)";
  ctx.fillRect(x - width / 2, y - 9, width, 18);
  ctx.strokeStyle = color;
  ctx.strokeRect(x - width / 2 + 0.5, y - 8.5, width - 1, 17);
  ctx.fillStyle = "#f4ecd8";
  ctx.fillText(text, x, y + 1, width - 8);
  ctx.restore();
}

function drawGameplayToolOverlay(map, minX, minY, maxX, maxY) {
  if (editor.enabled || state.build.placing) return;
  const info = toolTargetInfo();
  const tile = info.tile;
  if (!isTileInMap(tile, map)) return;
  if (tile.x < minX || tile.x > maxX || tile.y < minY || tile.y > maxY) return;

  const status = toolTargetStatus(info);
  if (info.toolId === "hand" && !status.text) return;
  const color = toolStateColor(status.state);
  const x = tile.x * TILE_SIZE;
  const y = tile.y * TILE_SIZE;
  const player = playerTile();

  ctx.save();
  ctx.fillStyle = `${color}33`;
  ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  if (info.source === "front") {
    ctx.strokeStyle = `${color}aa`;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(player.x * TILE_SIZE + TILE_SIZE / 2, player.y * TILE_SIZE + TILE_SIZE / 2);
    ctx.lineTo(x + TILE_SIZE / 2, y + TILE_SIZE / 2);
    ctx.stroke();
  }
  ctx.restore();

  drawTileLabel(tile, status.text || info.label, color);
}

function buildPlacementColors(status) {
  return status.ok
    ? { color: "#70b77e", fill: "rgba(112, 183, 126, 0.2)", line: "rgba(112, 183, 126, 0.92)" }
    : { color: "#c76050", fill: "rgba(199, 96, 80, 0.2)", line: "rgba(199, 96, 80, 0.94)" };
}

function drawBuildFootprint(tile, status) {
  const { color, fill, line } = buildPlacementColors(status);
  const x = tile.x * TILE_SIZE;
  const y = tile.y * TILE_SIZE;
  const corner = 8;

  ctx.save();
  ctx.fillStyle = fill;
  ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  ctx.strokeStyle = line;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x + 3, y + 3 + corner);
  ctx.lineTo(x + 3, y + 3);
  ctx.lineTo(x + 3 + corner, y + 3);
  ctx.moveTo(x + TILE_SIZE - 3 - corner, y + 3);
  ctx.lineTo(x + TILE_SIZE - 3, y + 3);
  ctx.lineTo(x + TILE_SIZE - 3, y + 3 + corner);
  ctx.moveTo(x + 3, y + TILE_SIZE - 3 - corner);
  ctx.lineTo(x + 3, y + TILE_SIZE - 3);
  ctx.lineTo(x + 3 + corner, y + TILE_SIZE - 3);
  ctx.moveTo(x + TILE_SIZE - 3 - corner, y + TILE_SIZE - 3);
  ctx.lineTo(x + TILE_SIZE - 3, y + TILE_SIZE - 3);
  ctx.lineTo(x + TILE_SIZE - 3, y + TILE_SIZE - 3 - corner);
  ctx.stroke();

  if (status.ok) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 18);
    ctx.lineTo(x + 14, y + 23);
    ctx.lineTo(x + 23, y + 10);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "rgba(199, 96, 80, 0.82)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    for (let offset = -TILE_SIZE; offset <= TILE_SIZE * 2; offset += 8) {
      ctx.beginPath();
      ctx.moveTo(x + offset, y + TILE_SIZE);
      ctx.lineTo(x + offset + TILE_SIZE, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 10);
    ctx.lineTo(x + 22, y + 22);
    ctx.moveTo(x + 22, y + 10);
    ctx.lineTo(x + 10, y + 22);
    ctx.stroke();
  }

  ctx.restore();
}

function drawBuildPlacementOverlay(map, minX, minY, maxX, maxY) {
  if (!state.build.placing || editor.enabled || !state.build.hoverTile) return;
  const tile = state.build.hoverTile;
  if (!isTileInMap(tile, map)) return;
  if (tile.x < minX || tile.x > maxX || tile.y < minY || tile.y > maxY) return;

  const status = buildPlacementStatus(tile);
  const def = buildableDef(state.build.selectedItem);
  const { color } = buildPlacementColors(status);

  ctx.save();
  ctx.globalAlpha = status.ok ? 0.78 : 0.38;
  drawObjectPreview(def.objectType, tile.x, tile.y, { tint: status.ok ? "rgba(112, 183, 126, 0.3)" : "rgba(199, 96, 80, 0.28)" });
  ctx.restore();

  drawBuildFootprint(tile, status);
  drawTileLabel(tile, `${def.name}：${status.text}`, color);
}

function drawMinimapTargetOverlay(map, minX, minY, maxX, maxY) {
  const target = minimapState.target;
  if (!target || target.mapId !== state.mapId) return;
  if (!isTileInMap(target, map)) return;
  if (target.x < minX || target.x > maxX || target.y < minY || target.y > maxY) return;

  const x = target.x * TILE_SIZE;
  const y = target.y * TILE_SIZE;
  const pulse = (Math.sin(performance.now() / 220) + 1) / 2;

  ctx.save();
  ctx.strokeStyle = `rgba(112, 183, 126, ${0.72 + pulse * 0.24})`;
  ctx.fillStyle = `rgba(112, 183, 126, ${0.12 + pulse * 0.12})`;
  ctx.lineWidth = 2;
  ctx.fillRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  ctx.strokeRect(x + 4, y + 4, TILE_SIZE - 8, TILE_SIZE - 8);
  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE / 2, y + 3);
  ctx.lineTo(x + TILE_SIZE / 2, y + TILE_SIZE - 3);
  ctx.moveTo(x + 3, y + TILE_SIZE / 2);
  ctx.lineTo(x + TILE_SIZE - 3, y + TILE_SIZE / 2);
  ctx.stroke();
  ctx.restore();

  drawTileLabel(target, "目标", "#70b77e", -8);
}

function feedbackColor(type) {
  if (type === "good") return "#70b77e";
  if (type === "bad") return "#c76050";
  return "#e7b34d";
}

function drawToolFeedbacks() {
  const now = performance.now();
  for (let i = toolFeedbacks.length - 1; i >= 0; i -= 1) {
    if (now - toolFeedbacks[i].createdAt > toolFeedbacks[i].duration) toolFeedbacks.splice(i, 1);
  }
  for (const feedback of toolFeedbacks) {
    const age = (now - feedback.createdAt) / feedback.duration;
    const alpha = Math.max(0, 1 - age);
    const color = feedbackColor(feedback.type);
    ctx.save();
    ctx.globalAlpha = alpha;
    drawTileLabel({ x: feedback.x, y: feedback.y }, feedback.text, color, -12 - age * 18);
    ctx.restore();
  }
}

function drawVisualEffects() {
  const now = performance.now();
  for (let i = visualEffects.length - 1; i >= 0; i -= 1) {
    if (now - visualEffects[i].createdAt > visualEffects[i].duration) visualEffects.splice(i, 1);
  }

  for (const effect of visualEffects) {
    const age = (now - effect.createdAt) / effect.duration;
    const alpha = Math.max(0, 1 - age);
    const cx = effect.x * TILE_SIZE + TILE_SIZE / 2;
    const cy = effect.y * TILE_SIZE + TILE_SIZE / 2;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;

    if (effect.type === "hoe") {
      ctx.fillStyle = "rgba(180, 129, 69, 0.82)";
      for (let i = 0; i < 4; i += 1) {
        const angle = i * Math.PI * 0.5 + 0.45;
        const spread = 4 + age * 13;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * spread, cy + Math.sin(angle) * spread + 4, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (effect.type === "plant") {
      const color = effect.color ?? "#d8f0b0";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(cx - 4, cy + 1 - age * 5, 4 + age * 3, 2.5, -0.45, 0, Math.PI * 2);
      ctx.ellipse(cx + 4, cy + 1 - age * 5, 4 + age * 3, 2.5, 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#f4ecd8";
      ctx.beginPath();
      ctx.moveTo(cx, cy + 8);
      ctx.lineTo(cx, cy - 3 - age * 6);
      ctx.stroke();
    } else if (effect.type === "water") {
      ctx.strokeStyle = "rgba(117, 185, 216, 0.9)";
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy + 4, 5 + age * 17 + i * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(188, 221, 239, 0.9)";
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.arc(cx - 8 + i * 8, cy - 8 + age * 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (effect.type === "harvest") {
      const color = effect.color ?? "#e7b34d";
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2;
        const inner = 4 + age * 5;
        const outer = 10 + age * 14;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
        ctx.lineTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(cx, cy - 4 - age * 8, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (effect.type === "error") {
      const shake = Math.sin(age * Math.PI * 10) * 2;
      ctx.strokeStyle = "rgba(199, 96, 80, 0.95)";
      ctx.strokeRect(effect.x * TILE_SIZE + 4 + shake, effect.y * TILE_SIZE + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    } else if (effect.type === "warp") {
      ctx.strokeStyle = "rgba(117, 185, 216, 0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + age * 22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 18 - age * 12, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = effect.color ?? "#e7b34d";
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + age * 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawTimeOfDayOverlay(viewW, viewH) {
  const alpha = timeOfDayOverlayAlpha();
  if (alpha <= 0) return;

  ctx.save();
  ctx.fillStyle = `rgba(16, 24, 48, ${alpha})`;
  ctx.fillRect(0, 0, viewW, viewH);
  if (isLampLitTime()) {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = `rgba(231, 179, 77, ${Math.min(0.08, alpha * 0.22)})`;
    ctx.fillRect(0, 0, viewW, viewH);
  }
  ctx.restore();
}

function drawScreenEffects(viewW, viewH) {
  const now = performance.now();
  for (let i = screenEffects.length - 1; i >= 0; i -= 1) {
    if (now - screenEffects[i].createdAt > screenEffects[i].duration) screenEffects.splice(i, 1);
  }

  for (const effect of screenEffects) {
    const age = (now - effect.createdAt) / effect.duration;
    const peak = Math.sin(Math.min(1, age) * Math.PI);
    const alpha = Math.max(0, peak);

    ctx.save();
    if (effect.type === "warp") {
      ctx.fillStyle = `rgba(16, 18, 14, ${0.56 * alpha})`;
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.strokeStyle = `rgba(117, 185, 216, ${0.82 * alpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(viewW / 2, viewH / 2, 26 + age * 90, 0, Math.PI * 2);
      ctx.stroke();
    } else if (effect.type === "sleep") {
      ctx.fillStyle = `rgba(244, 236, 216, ${0.34 * alpha})`;
      ctx.fillRect(0, 0, viewW, viewH);
    } else if (effect.type === "quest") {
      ctx.fillStyle = `rgba(231, 179, 77, ${0.18 * alpha})`;
      ctx.fillRect(0, 0, viewW, viewH);
    }

    if (effect.label) {
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(244, 236, 216, ${0.9 * alpha})`;
      ctx.fillText(effect.label, viewW / 2, viewH / 2 + 34);
    }
    ctx.restore();
  }
}

function drawFishingOverlay(viewW, viewH) {
  if (!fishing.active) return;
  const def = fishDef(fishing.fishId);
  const panelW = 128;
  const panelH = 178;
  const x = viewW - panelW - 18;
  const y = 18;

  ctx.save();
  ctx.fillStyle = "rgba(18, 22, 18, 0.84)";
  ctx.fillRect(x, y, panelW, panelH);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.72)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, panelW - 1, panelH - 1);

  ctx.fillStyle = "#f4ecd8";
  ctx.font = "700 9px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(fishing.phase === "waiting" ? "等待咬钩" : `HIT! ${def.name}`, x + panelW / 2, y + 14);
  ctx.font = "8px sans-serif";
  ctx.fillStyle = "#c9d2b7";
  ctx.fillText(`水质：${waterQualityLabel()}`, x + panelW / 2, y + 27);

  const trackX = x + 28;
  const trackY = y + 38;
  const trackW = 38;
  const trackH = 112;
  ctx.fillStyle = "#253027";
  ctx.fillRect(trackX, trackY, trackW, trackH);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.34)";
  ctx.strokeRect(trackX + 0.5, trackY + 0.5, trackW - 1, trackH - 1);

  if (fishing.phase === "waiting") {
    const pulse = (Math.sin(performance.now() / 150) + 1) / 2;
    ctx.fillStyle = `rgba(117, 185, 216, ${0.25 + pulse * 0.35})`;
    ctx.beginPath();
    ctx.arc(trackX + trackW / 2, trackY + trackH * 0.52, 7 + pulse * 4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const barH = fishingBarHeight(def) * trackH;
    const barY = trackY + fishing.barY * trackH;
    ctx.fillStyle = "rgba(112, 183, 126, 0.78)";
    ctx.fillRect(trackX + 4, barY, trackW - 8, barH);
    ctx.strokeStyle = "#d8f0b0";
    ctx.strokeRect(trackX + 4.5, barY + 0.5, trackW - 9, barH - 1);

    const fishY = trackY + fishing.fishY * trackH;
    ctx.fillStyle = def.color;
    ctx.beginPath();
    ctx.ellipse(trackX + trackW / 2, fishY, 8, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b2924";
    ctx.fillRect(trackX + trackW / 2 + 3, fishY - 1, 2, 2);
  }

  const progX = x + 88;
  const progY = trackY;
  const progW = 14;
  const progH = trackH;
  ctx.fillStyle = "#302824";
  ctx.fillRect(progX, progY, progW, progH);
  ctx.fillStyle = "#e7b34d";
  ctx.fillRect(progX, progY + progH * (1 - fishing.progress), progW, progH * fishing.progress);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.38)";
  ctx.strokeRect(progX + 0.5, progY + 0.5, progW - 1, progH - 1);

  ctx.fillStyle = "#c9d2b7";
  ctx.font = "8px sans-serif";
  ctx.fillText(fishing.phase === "waiting" ? "准备 Space" : "按住 Space 上升", x + panelW / 2, y + panelH - 18);
  ctx.fillText("Esc 收杆", x + panelW / 2, y + panelH - 7);
  ctx.restore();
}

function drawGameMinimapOverlay(viewW, viewH) {
  if (!minimapState.visible) return;
  const outerW = Math.min(164, Math.max(122, viewW * 0.22));
  const pad = 6;
  const mapW = outerW - pad * 2;
  const mapH = Math.round(mapW * (ui.minimap.height / ui.minimap.width));
  const outerH = mapH + pad * 2;
  const x = 10;
  const y = Math.min(112, Math.max(10, viewH - outerH - 88));

  ctx.save();
  ctx.fillStyle = "rgba(16, 18, 14, 0.86)";
  ctx.fillRect(x, y, outerW, outerH);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.58)";
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, outerW - 1, outerH - 1);

  ctx.drawImage(ui.minimap, x + pad, y + pad, mapW, mapH);
  ctx.strokeStyle = "rgba(244, 236, 216, 0.24)";
  ctx.strokeRect(x + pad + 0.5, y + pad + 0.5, mapW - 1, mapH - 1);
  ctx.restore();
}

function drawEditorOverlay(map, minX, minY, maxX, maxY) {
  if (!editor.enabled) return;
  drawCollisionOverlay(map, minX, minY, maxX, maxY);

  if (!editor.hoverTile) return;
  const { x, y } = editor.hoverTile;
  if (x < minX || x > maxX || y < minY || y > maxY) return;

  ctx.save();
  ctx.globalAlpha = 0.62;
  if (editor.layer === "objects") {
    if (editor.tool === "erase") {
      ctx.fillStyle = "rgba(244, 236, 216, 0.16)";
      ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    } else {
      drawObjectPreview(editor.objectType, x, y);
    }
  } else if (editor.layer === "collision") {
    ctx.fillStyle = editor.tool === "erase" ? "rgba(112, 183, 126, 0.55)" : "rgba(199, 77, 68, 0.62)";
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  } else if (editor.tool === "erase") {
    ctx.fillStyle = "rgba(244, 236, 216, 0.16)";
    ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  } else {
    drawTile(editor.tileId, x * TILE_SIZE, y * TILE_SIZE);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = editor.tool === "erase" ? "#f4ecd8" : "#e7b34d";
  ctx.lineWidth = 2;
  ctx.strokeRect(x * TILE_SIZE + 1, y * TILE_SIZE + 1, TILE_SIZE - 2, TILE_SIZE - 2);
  ctx.restore();
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr * VIEW_SCALE, 0, 0, dpr * VIEW_SCALE, 0, 0);
}

function updateVersionHud() {
  const label = `v${APP_VERSION}`;
  ui.appVersionBadge.textContent = label;
  if (ui.artVersionBadge) ui.artVersionBadge.textContent = `美术 ${ART_VERSION}`;
  if (ui.systemMenuVersion) ui.systemMenuVersion.textContent = label;
  if (ui.systemMenuArtVersion) ui.systemMenuArtVersion.textContent = `美术线 ${ART_VERSION} · 动作 ${ART_MOTION_VERSION}`;
  document.title = `Tilemap From Zero ${label}`;
}

function hideBootOverlay() {
  window.__tilemapBooted = true;
  if (ui.bootOverlay) ui.bootOverlay.hidden = true;
}

function on(target, eventName, handler, options) {
  if (!target) {
    console.warn(`跳过缺失 UI 事件绑定：${eventName}`);
    return false;
  }
  target.addEventListener(eventName, handler, options);
  return true;
}

function render() {
  const map = currentMap();
  const viewW = canvas.width / ((window.devicePixelRatio || 1) * VIEW_SCALE);
  const viewH = canvas.height / ((window.devicePixelRatio || 1) * VIEW_SCALE);
  state.camera.x = Math.max(0, Math.min(state.player.x - viewW / 2, map.width * TILE_SIZE - viewW));
  state.camera.y = Math.max(0, Math.min(state.player.y - viewH / 2, map.height * TILE_SIZE - viewH));

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  ctx.save();
  ctx.translate(-Math.floor(state.camera.x), -Math.floor(state.camera.y));

  const minX = Math.max(0, Math.floor(state.camera.x / TILE_SIZE) - 1);
  const minY = Math.max(0, Math.floor(state.camera.y / TILE_SIZE) - 1);
  const maxX = Math.min(map.width - 1, Math.ceil((state.camera.x + viewW) / TILE_SIZE) + 1);
  const maxY = Math.min(map.height - 1, Math.ceil((state.camera.y + viewH) / TILE_SIZE) + 1);

  drawObjects(map, "ground", minX, minY, maxX, maxY);
  drawObjects(map, "buildings", minX, minY, maxX, maxY);
  drawDedicatedBuildingSprites(map, minX, minY, maxX, maxY);
  drawMapObjects(map, minX, minY, maxX, maxY);
  drawDynamicObjects(minX, minY, maxX, maxY);
  drawNpcs(minX, minY, maxX, maxY);
  drawPlayer();
  drawObjects(map, "front", minX, minY, maxX, maxY);
  drawGameplayToolOverlay(map, minX, minY, maxX, maxY);
  drawBuildPlacementOverlay(map, minX, minY, maxX, maxY);
  drawMinimapTargetOverlay(map, minX, minY, maxX, maxY);
  drawVisualEffects();
  drawToolFeedbacks();
  drawEditorOverlay(map, minX, minY, maxX, maxY);
  drawDebug(map, minX, minY, maxX, maxY);
  ctx.restore();

  drawTimeOfDayOverlay(viewW, viewH);
  drawScreenEffects(viewW, viewH);
  drawMinimap(map, viewW, viewH);
  drawFishingOverlay(viewW, viewH);
  drawGameMinimapOverlay(viewW, viewH);

  const tile = tileAtPixel(state.player.x, state.player.y);
  ui.mapName.textContent = map.name;
  ui.tileReadout.textContent = `${tile.x}, ${tile.y}`;
  ui.facingReadout.textContent = state.player.facing;
  updateEditorReadout();
  updateActionHint();
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  updateFishing(dt);
  motion.playerMoving = false;
  motion.playerRunning = false;
  if (
    !fishing.active &&
    !editor.enabled &&
    !state.build.placing &&
    ui.dialogBox.hidden &&
    !systemMenuOpen &&
    !taskOverlayOpen &&
    !journalOverlayOpen &&
    !buildOverlayOpen
  ) {
    movePlayer(dt);
    checkAutoWarp(dt);
  }
  updateMotion(dt);
  render();
  requestAnimationFrame(loop);
}

on(window, "keydown", (event) => {
  const key = event.key.toLowerCase();
  const targetTag = event.target?.tagName?.toLowerCase();
  const isTypingField = ["input", "select", "textarea"].includes(targetTag);
  keys.add(key);
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "tab"].includes(key)) event.preventDefault();
  if (editor.enabled && !isTypingField && (event.metaKey || event.ctrlKey) && key === "z") {
    event.preventDefault();
    if (event.shiftKey) redoEditorChange();
    else undoEditorChange();
    return;
  }
  if (editor.enabled && !isTypingField && (event.metaKey || event.ctrlKey) && key === "y") {
    event.preventDefault();
    redoEditorChange();
    return;
  }
  if (!isTypingField && key === "f2") {
    event.preventDefault();
    toggleDevPanel();
    return;
  }
  if (!isTypingField && key === "tab") {
    event.preventDefault();
    if (journalOverlayOpen) setJournalOverlayVisible(false);
    else if (
      !systemMenuOpen &&
      !taskOverlayOpen &&
      !buildOverlayOpen &&
      !fishing.active &&
      ui.dialogBox.hidden &&
      !inventoryOverlayOpen &&
      !state.build.placing
    ) {
      setJournalOverlayVisible(true, "calendar");
    }
    return;
  }
  if (!isTypingField && key === "p") {
    event.preventDefault();
    if (systemMenuOpen) setSystemMenuVisible(false);
    else if (!closeTopOverlay()) setSystemMenuVisible(true);
    return;
  }
  if (!isTypingField && key === "escape") {
    event.preventDefault();
    if (!closeTopOverlay()) setSystemMenuVisible(true);
    return;
  }
  if (systemMenuOpen) return;
  if (fishing.active) return;
  if (!ui.dialogBox.hidden) {
    if (["e", "enter", " "].includes(key)) advanceDialog();
    return;
  }
  if (!isTypingField && key === "q") {
    event.preventDefault();
    if (taskOverlayOpen) setTaskOverlayVisible(false);
    else if (!journalOverlayOpen && !buildOverlayOpen && !inventoryOverlayOpen && !state.build.placing) setTaskOverlayVisible(true, "current");
    return;
  }
  if (taskOverlayOpen) return;
  if (journalOverlayOpen) return;
  if (buildOverlayOpen) {
    if (!isTypingField && key === "b") setBuildOverlayVisible(false);
    return;
  }
  if (!isTypingField && key === "m") {
    event.preventDefault();
    toggleGameMinimap();
    return;
  }
  if (!isTypingField && key === "i") {
    event.preventDefault();
    toggleInventoryOverlay();
    return;
  }
  if (key === "u") {
    unstuckPlayer();
    return;
  }
  if (editor.enabled) return;
  if (state.build.placing) {
    if (key === "escape" || key === "b") setBuildPlacement(false);
    return;
  }
  if (key === "b") {
    toggleBuildOverlay();
    return;
  }
  if (toolsByKey[key]) selectTool(toolsByKey[key].id);
  if (key === "e" || key === "enter") interact();
  if (key === " ") useSelectedTool();
  if (key === "c") {
    debug.collision = !debug.collision;
    addLog(`碰撞层：${debug.collision ? "显示" : "隐藏"}`);
  }
  if (key === "g") {
    debug.grid = !debug.grid;
    addLog(`网格：${debug.grid ? "显示" : "隐藏"}`);
  }
});

on(window, "keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

on(canvas, "pointerdown", () => {
  canvas.focus();
});

on(canvas, "contextmenu", (event) => {
  if (editor.enabled || state.build.placing) event.preventDefault();
});

on(ui.minimap, "contextmenu", (event) => {
  event.preventDefault();
});

on(ui.minimap, "pointermove", (event) => {
  minimapState.hoverTile = minimapTileFromPointer(event);
  updateMinimapReadout();
});

on(ui.minimap, "pointerleave", () => {
  minimapState.hoverTile = null;
  updateMinimapReadout();
});

on(ui.minimap, "pointerdown", (event) => {
  event.preventDefault();
  const tile = minimapTileFromPointer(event);
  if (event.button === 2) {
    clearMinimapTarget();
    return;
  }
  setMinimapTarget(tile);
});

on(canvas, "pointerdown", (event) => {
  canvas.focus();
  if (systemMenuOpen || taskOverlayOpen || journalOverlayOpen || buildOverlayOpen) {
    event.preventDefault();
    return;
  }
  if (state.build.placing && !editor.enabled) {
    event.preventDefault();
    if (event.button === 2) {
      setBuildPlacement(false);
      return;
    }
    state.build.hoverTile = tileFromPointer(event);
    updateCanvasCursor();
    placeSelectedBuildable(state.build.hoverTile);
    return;
  }
  if (!editor.enabled) return;
  event.preventDefault();
  editor.isPainting = true;
  editor.tool = event.button === 2 ? "erase" : ui.toolSelect.value;
  syncEditorControls();
  const tile = tileFromPointer(event);
  editor.hoverTile = tile;
  beginEditorHistory(editorActionLabel());
  applyEditorTool(tile);
});

on(canvas, "pointermove", (event) => {
  if (systemMenuOpen || taskOverlayOpen || journalOverlayOpen || buildOverlayOpen) return;
  if (state.build.placing && !editor.enabled) {
    state.build.hoverTile = tileFromPointer(event);
    updateCanvasCursor();
    return;
  }
  if (!editor.enabled) return;
  editor.hoverTile = tileFromPointer(event);
  if (editor.isPainting) applyEditorTool(editor.hoverTile);
});

on(canvas, "pointerleave", () => {
  if (editor.isPainting) endEditorHistory();
  state.build.hoverTile = null;
  editor.hoverTile = null;
  editor.isPainting = false;
  updateCanvasCursor();
});

on(window, "pointerup", () => {
  if (editor.isPainting) endEditorHistory();
  editor.isPainting = false;
});

on(window, "resize", resizeCanvas);
on(window, "beforeunload", () => {
  if (!autosaveTimer) return;
  cancelAutosave();
  writeSave({ label: "自动保存" });
});
on(ui.saveBtn, "click", saveGame);
on(ui.loadBtn, "click", loadGame);
on(ui.unstuckBtn, "click", unstuckPlayer);
on(ui.skipTestBtn, "click", runSelectedTestSkip);
on(ui.resetBtn, "click", resetGame);
on(ui.clearMinimapTargetBtn, "click", clearMinimapTarget);
on(ui.saveSlotSelect, "change", () => selectSaveSlot(ui.saveSlotSelect.value));
on(ui.exportSaveBtn, "click", exportSaveJson);
on(ui.importSaveBtn, "click", importSaveJson);
on(ui.clearSlotBtn, "click", clearCurrentSaveSlot);
on(ui.refreshAssetAuditBtn, "click", refreshAssetAudit);
on(ui.copyAssetManifestBtn, "click", copyAssetManifest);
on(ui.sleepBtn, "click", sleepToNextDay);
on(ui.seedSelect, "change", () => selectSeed(ui.seedSelect.value));
on(ui.buildItemSelect, "change", () => selectBuildItem(ui.buildItemSelect.value));
on(ui.buildModeBtn, "click", toggleBuildPlacement);
on(ui.buildShopBtn, "click", openBuildShopFromHud);
on(ui.quickBuyBuildOneBtn, "click", () => buySelectedBuildable(1));
on(ui.quickBuyBuildFiveBtn, "click", () => buySelectedBuildable(5));
on(ui.soundToggle, "change", () => setSoundEnabled(ui.soundToggle.checked));
on(ui.editorToggle, "change", () => setEditorEnabled(ui.editorToggle.checked));
on(ui.editorUndoBtn, "click", undoEditorChange);
on(ui.editorRedoBtn, "click", redoEditorChange);
on(ui.layerSelect, "change", () => {
  editor.layer = ui.layerSelect.value;
  if (editor.layer === "collision") debug.collision = false;
  updateObjectReadout();
});
on(ui.toolSelect, "change", () => {
  editor.tool = ui.toolSelect.value;
  updateObjectReadout();
});
on(ui.objectSelect, "change", () => {
  editor.objectType = ui.objectSelect.value;
  updateObjectReadout();
});
on(ui.applyObjectBtn, "click", applyObjectProperties);
on(ui.exportBtn, "click", writeExport);
on(ui.importBtn, "click", importMapJson);
on(ui.resetMapBtn, "click", resetCurrentMap);
on(ui.copyJsonBtn, "click", copyExport);
on(ui.dialogNextBtn, "click", advanceDialog);
on(ui.dialogCloseBtn, "click", closeDialog);
on(ui.inventoryOverlayCloseBtn, "click", () => setInventoryOverlayVisible(false));
on(ui.systemMenuOverlay, "pointerdown", (event) => {
  if (event.target === ui.systemMenuOverlay) setSystemMenuVisible(false);
});
on(ui.systemMenuCloseBtn, "click", () => setSystemMenuVisible(false));
on(ui.systemContinueBtn, "click", () => setSystemMenuVisible(false));
on(ui.systemSaveBtn, "click", saveGame);
on(ui.systemLoadBtn, "click", () => {
  setSystemMenuVisible(false);
  loadGame();
});
on(ui.systemSleepBtn, "click", () => {
  setSystemMenuVisible(false);
  sleepToNextDay();
});
on(ui.systemUnstuckBtn, "click", () => {
  setSystemMenuVisible(false);
  unstuckPlayer();
});
on(ui.systemSoundBtn, "click", () => setSoundEnabled(!state.settings.soundEnabled));
on(ui.systemDevPanelBtn, "click", toggleDevPanel);
on(ui.journalOverlay, "pointerdown", (event) => {
  if (event.target === ui.journalOverlay) setJournalOverlayVisible(false);
});
on(ui.journalCloseBtn, "click", () => setJournalOverlayVisible(false));
on(ui.journalTabs, "click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("button[data-tab]") : null;
  if (!button) return;
  selectJournalTab(button.dataset.tab);
});
on(ui.buildOverlay, "pointerdown", (event) => {
  if (event.target === ui.buildOverlay) setBuildOverlayVisible(false);
});
on(ui.buildOverlayCloseBtn, "click", () => setBuildOverlayVisible(false));
on(ui.taskOverlay, "pointerdown", (event) => {
  if (event.target === ui.taskOverlay) setTaskOverlayVisible(false);
});
on(ui.taskOverlayCloseBtn, "click", () => setTaskOverlayVisible(false));
on(ui.taskOverlayTabs, "click", (event) => {
  const button = event.target instanceof Element ? event.target.closest("button[data-tab]") : null;
  if (!button) return;
  selectTaskTab(button.dataset.tab);
});

initializeSaveSystem();
setDevPanelVisible(false, { silent: true });
updateVersionHud();
resizeCanvas();
renderToolButtons();
updateAllHud();
renderTilePalette();
syncEditorControls();
canvas.focus();
addLog("系统已启动：地图由 ground/buildings/front/collision 多层数据渲染。");
hideBootOverlay();
requestAnimationFrame(loop);
