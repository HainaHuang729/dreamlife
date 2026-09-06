const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const ui = {
  day: document.querySelector("#dayLabel"),
  phase: document.querySelector("#phaseLabel"),
  money: document.querySelector("#moneyLabel"),
  seeds: document.querySelector("#seedLabel"),
  hotbar: document.querySelector("#hotbar"),
  tasks: document.querySelector("#tasks"),
  inventory: document.querySelector("#inventory"),
  toast: document.querySelector("#toast"),
  nextPhase: document.querySelector("#nextPhase")
};

const solarTerms = [
  "立春", "雨水", "惊蛰", "春分", "清明", "谷雨",
  "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
  "立秋", "处暑", "白露", "秋分", "寒露", "霜降",
  "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"
];
const daysPerTerm = 3;
const daysPerYear = solarTerms.length * daysPerTerm;
const phases = ["清晨", "上午", "中午", "下午", "黄昏", "夜晚", "凌晨"];
const tools = [
  { id: "hoe", name: "锄头", icon: "锄" },
  { id: "seed", name: "种子", icon: "种" },
  { id: "water", name: "水壶", icon: "水" },
  { id: "sickle", name: "镰刀", icon: "收" }
];
const laneY = [316, 354, 392];
const plotXs = [72, 134, 196, 258, 320, 382];
const plotSurfaceY = 328;
const worldSize = { width: 960, height: 540 };
const camera = { x: 0, y: 0, zoom: 1.45 };
const worldBounds = { minX: 56, maxX: 520 };
const yBounds = { min: 310, max: 402 };
const cropStages = [
  { name: "空地", color: "#715137" },
  { name: "幼苗", color: "#76bc69" },
  { name: "长叶", color: "#4d9c55" },
  { name: "成熟", color: "#f0c64e" }
];
const spriteDefinitions = {
  layerBack: "assets/sideview/ai/layer-back-2x.png",
  layerMid: "assets/sideview/ai/layer-mid-2x.png",
  layerFront: "assets/sideview/ai/layer-front-2x.png",
  sceneBg: "assets/sideview/ai/scene-bg.png",
  npcAuntie: "assets/sideview/ai/npc-auntie-sheet.png",
  cropPlot: "assets/sideview/ai/crop-sheet.png",
  cropPlotWet: "assets/sideview/ai/crop-sheet-wet.png",
  aiFarmhouse: "assets/sideview/ai/farmhouse-2x.png",
  aiTeahouse: "assets/sideview/ai/teahouse-2x.png",
  aiMarketStall: "assets/sideview/ai/market-stall-2x.png",
  aiSeedCrate: "assets/sideview/ai/seed-crate-2x.png",
  aiOrderCrate: "assets/sideview/ai/order-crate-2x.png",
  farmhouse: "assets/sideview/farmhouse.svg",
  teahouse: "assets/sideview/teahouse.svg",
  marketStall: "assets/sideview/market-stall.svg",
  seedBox: "assets/sideview/seed-box.svg",
  orderCrate: "assets/sideview/order-crate.svg",
  player8bit: "assets/sideview/player-ai-walk-sheet-v3.png"
};
const sprites = Object.fromEntries(Object.entries(spriteDefinitions).map(([id, src]) => {
  const image = new Image();
  image.src = src;
  return [id, image];
}));

const defaultState = {
  day: 1,
  year: 1,
  phase: 0,
  money: 120,
  seeds: 6,
  harvest: 0,
  villageTrust: 0,
  activeTool: "hoe",
  message: "回到老宅，先整理门前这块菜地。",
  player: { x: 150, y: laneY[1], lane: 1, dir: 1, moving: false, walkFrame: 0 },
  plots: plotXs.map((x) => ({ x, tilled: false, watered: false, crop: null, stage: 0 })),
  flags: {
    tilled: false,
    planted: false,
    watered: false,
    harvested: false,
    delivered: false,
    metAuntie: false
  }
};

let state = loadState();
let lastTime = performance.now();
let currentNearInteractableId = null;
let interactionHintUntil = 0;
let toastVisibleUntil = performance.now() + 4200;
const keys = new Set();
state.year ??= 1;
state.day = clamp(Math.floor(state.day || 1), 1, daysPerYear);
state.phase = clamp(Math.floor(state.phase || 0), 0, phases.length - 1);
state.player.y ??= state.player.visualY ?? laneY[state.player.lane ?? 1];
if (Array.isArray(state.plots) && state.plots.length === plotXs.length) {
  state.plots.forEach((plot, index) => {
    plot.x = plotXs[index];
  });
}

const interactables = [
  {
    id: "crate",
    x: 330,
    lane: 1,
    label: "助农货箱",
    interact() {
      if (state.harvest >= 3 && !state.flags.delivered) {
        state.harvest -= 3;
        state.money += 90;
        state.villageTrust += 1;
        state.flags.delivered = true;
        say("完成茶铺试吃订单。村口挂起了助农集市的临时牌。");
      } else if (state.flags.delivered) {
        const extra = state.harvest;
        if (extra > 0) {
          state.money += extra * 20;
          state.harvest = 0;
          say(`额外卖出 ${extra} 份蔬菜，货箱里留下了新的订货便条。`);
        } else {
          say("货箱旁贴着茶铺试吃订单的回执。");
        }
      } else {
        say("茶铺试吃订单需要 3 份蔬菜。");
      }
    }
  },
  {
    id: "house",
    x: 190,
    lane: 1,
    label: "老宅",
    interact() {
      advancePhase("在老宅休息了一会儿");
    }
  },
  {
    id: "seedBox",
    x: 278,
    lane: 1,
    label: "种子箱",
    interact() {
      if (state.money >= 20) {
        state.money -= 20;
        state.seeds += 3;
        say("买入 3 份本地菜种。");
      } else {
        say("金币不够，先把收获卖出去。");
      }
    }
  }
];

function loadState() {
  try {
    const saved = localStorage.getItem("chengu-sideview-mvp");
    return saved ? { ...structuredClone(defaultState), ...JSON.parse(saved) } : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem("chengu-sideview-mvp", JSON.stringify(state));
}

function say(text) {
  state.message = text;
  toastVisibleUntil = performance.now() + 3200;
  ui.toast.textContent = text;
  ui.toast.classList.remove("hidden");
  renderUi();
  saveState();
}

function screenYForLane(lane) {
  return laneY[lane];
}

function playerScreenY() {
  return state.player.y ?? screenYForLane(state.player.lane);
}

function nearestLaneFromY(y) {
  let bestLane = 0;
  let bestDistance = Infinity;
  laneY.forEach((laneValue, laneIndex) => {
    const distance = Math.abs(y - laneValue);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestLane = laneIndex;
    }
  });
  return bestLane;
}

function nearestPlot() {
  const px = state.player.x;
  const py = playerScreenY();
  let best = null;
  for (const plot of state.plots) {
    const dx = Math.abs(plot.x - px);
    const dy = Math.abs(plotSurfaceY + 12 - py);
    if (dx < 30 && dy < 56) best = plot;
  }
  return best;
}

function useTool() {
  const plot = nearestPlot();
  if (!plot) {
    say("靠近菜地再使用工具。");
    return;
  }

  if (state.activeTool === "hoe") {
    plot.tilled = true;
    state.flags.tilled = true;
    say("翻好一格地。侧视角下，田块需要用更清楚的前后边缘来表达。");
  }

  if (state.activeTool === "seed") {
    if (!plot.tilled) {
      say("先用锄头翻地。");
      return;
    }
    if (plot.crop) {
      say("这格已经种下了菜。");
      return;
    }
    if (state.seeds <= 0) {
      say("种子用完了，去种子箱补一点。");
      return;
    }
    state.seeds -= 1;
    plot.crop = "greens";
    plot.stage = 1;
    plot.watered = false;
    state.flags.planted = true;
    say("种下本地青菜。");
  }

  if (state.activeTool === "water") {
    if (!plot.crop) {
      say("这格还没有作物。");
      return;
    }
    plot.watered = true;
    state.flags.watered = true;
    say("浇水完成。明天清晨会长高一阶段。");
  }

  if (state.activeTool === "sickle") {
    if (plot.crop && plot.stage >= 3) {
      plot.crop = null;
      plot.stage = 0;
      plot.watered = false;
      state.harvest += 1;
      state.flags.harvested = true;
      say("收获 1 份新鲜蔬菜。攒够 3 份可以交给茶铺试吃订单。");
    } else {
      say("成熟后才能收获。");
    }
  }

  renderUi();
  saveState();
}

function interact() {
  const found = interactables.find((item) => {
    return Math.abs(item.x - state.player.x) < 44 && Math.abs(screenYForLane(item.lane) - playerScreenY()) < 56;
  });
  if (found) {
    interactionHintUntil = performance.now() + 1200;
    found.interact();
  }
  else say("附近没有可以互动的对象。");
}

function advancePhase(reason = null) {
  state.phase += 1;
  if (state.phase >= phases.length) {
    state.phase = 0;
    state.day += 1;
    if (state.day > daysPerYear) {
      state.day = 1;
      state.year += 1;
    }
    growCrops();
    say(reason ? `${reason}。新的一天开始，浇过水的作物长高了。` : "新的一天开始。浇过水的作物长高了。");
  } else {
    say(reason ? `${reason}，时间来到${phases[state.phase]}。` : `时间来到${phases[state.phase]}。`);
  }
  renderUi();
  saveState();
}

function growCrops() {
  for (const plot of state.plots) {
    if (plot.crop && plot.watered && plot.stage < 3) {
      plot.stage += 1;
      plot.watered = false;
    }
  }
}

function update(dt) {
  const speed = 142;
  const verticalSpeed = 118;
  let moving = false;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) {
    state.player.x -= speed * dt;
    state.player.dir = -1;
    moving = true;
  }
  if (keys.has("ArrowRight") || keys.has("KeyD")) {
    state.player.x += speed * dt;
    state.player.dir = 1;
    moving = true;
  }
  if (keys.has("ArrowUp") || keys.has("KeyW")) {
    state.player.y -= verticalSpeed * dt;
    moving = true;
  }
  if (keys.has("ArrowDown") || keys.has("KeyS")) {
    state.player.y += verticalSpeed * dt;
    moving = true;
  }
  state.player.x = Math.max(worldBounds.minX, Math.min(worldBounds.maxX, state.player.x));
  state.player.y = Math.max(yBounds.min, Math.min(yBounds.max, state.player.y));
  state.player.lane = nearestLaneFromY(state.player.y);
  state.player.moving = moving;
  if (moving) state.player.walkFrame += dt * 10;
  updateCamera(dt);
}

function updateCamera(dt) {
  const viewWidth = canvas.width / camera.zoom;
  const viewHeight = canvas.height / camera.zoom;
  const maxX = Math.max(0, worldSize.width - viewWidth);
  const maxY = Math.max(0, worldSize.height - viewHeight);
  const targetX = clamp(state.player.x - viewWidth * 0.5, 0, maxX);
  const targetY = clamp(state.player.y - viewHeight * 0.62, 0, maxY);
  const follow = Math.min(1, 8 * dt);
  camera.x += (targetX - camera.x) * follow;
  camera.y += (targetY - camera.y) * follow;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(camera.zoom, camera.zoom);
  ctx.translate(-camera.x, -camera.y);
  if (sprites.layerBack?.complete && sprites.layerBack.naturalWidth > 0) {
    ctx.drawImage(sprites.layerBack, 0, 0, worldSize.width, worldSize.height);
    if (sprites.layerMid?.complete && sprites.layerMid.naturalWidth > 0) {
      ctx.drawImage(sprites.layerMid, 0, 0, worldSize.width, worldSize.height);
    }
    drawWorldObjects();
  } else {
    if (sprites.sceneBg?.complete && sprites.sceneBg.naturalWidth > 0) {
      ctx.drawImage(sprites.sceneBg, 0, 0, worldSize.width, worldSize.height);
    } else {
      drawSky();
      drawFarScene();
      drawGround();
      drawBuildings();
    }
  }
  drawPlots();
  drawInteractables();
  drawPlayer();
  if (sprites.layerFront?.complete && sprites.layerFront.naturalWidth > 0) {
    ctx.drawImage(sprites.layerFront, 0, 0, worldSize.width, worldSize.height);
  } else if (!sprites.sceneBg?.complete || sprites.sceneBg.naturalWidth === 0) {
    drawForeground();
  }
  ctx.restore();
  requestAnimationFrame(tick);
}

function drawWorldObjects() {
  drawSprite("aiFarmhouse", 58, 130, 260, 190, () => drawHouse(42, 153));
  drawSprite("aiSeedCrate", 244, 302, 64, 56, () => drawSeedBox(519, 294));
  drawSprite("aiOrderCrate", 300, 302, 64, 56, () => drawCrate(856, 345));
}

function drawSky() {
  const g = ctx.createLinearGradient(0, 0, 0, 260);
  g.addColorStop(0, "#9fd3d1");
  g.addColorStop(0.7, "#dfe8c0");
  g.addColorStop(1, "#f0d9a0");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 960, 540);
  pixelCloud(120, 70, 3);
  pixelCloud(730, 58, 2);
}

function drawFarScene() {
  ctx.fillStyle = "#6fa56b";
  poly([[0, 246], [110, 184], [220, 240], [320, 160], [470, 250], [640, 172], [820, 252], [960, 190], [960, 300], [0, 300]]);
  ctx.fillStyle = "#4f8b62";
  for (let x = 0; x < 960; x += 42) {
    poly([[x, 250], [x + 18, 204], [x + 36, 250]]);
  }
  ctx.fillStyle = "#60885a";
  ctx.fillRect(0, 242, 960, 36);
}

function drawGround() {
  ctx.fillStyle = "#5f8f50";
  ctx.fillRect(0, 278, 960, 262);
  ctx.fillStyle = "#78a85d";
  for (let x = 0; x < 960; x += 48) {
    ctx.fillRect(x + 8, 292 + (x % 96 ? 12 : 0), 18, 4);
    ctx.fillRect(x + 28, 304 + (x % 144 ? 6 : 0), 10, 4);
  }
  ctx.fillStyle = "#a88658";
  ctx.fillRect(0, 374, 960, 56);
  ctx.fillStyle = "#c09a66";
  for (let x = 0; x < 960; x += 42) {
    ctx.fillRect(x, 383, 18, 4);
    ctx.fillRect(x + 20, 412, 14, 3);
  }
  ctx.fillStyle = "#8d6f48";
  ctx.fillRect(0, 422, 960, 18);
  ctx.fillStyle = "rgba(47, 70, 45, 0.34)";
  ctx.fillRect(0, 318, 960, 6);
  ctx.fillRect(0, 356, 960, 6);
  ctx.fillRect(0, 394, 960, 6);

  for (let x = 8; x < 960; x += 34) {
    ctx.fillStyle = x % 68 === 0 ? "#bed482" : "#7fab62";
    ctx.fillRect(x, 454 + ((x / 34) % 3) * 10, 10, 5);
  }
}

function drawBuildings() {
  drawSprite("farmhouse", 32, 200, 192, 176, () => drawHouse(42, 205));
  drawSprite("seedBox", 507, 286, 72, 88, () => drawSeedBox(519, 294));
  drawSprite("teahouse", 606, 214, 216, 172, () => drawTeaShop(614, 218));
  drawSprite("marketStall", 796, 258, 160, 132, () => drawAwning(810, 258));
  if (state.flags.delivered) drawMarketSign(740, 288);
}

function drawSprite(id, x, y, width, height, fallback) {
  const image = sprites[id];
  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, width, height);
  } else if (fallback) {
    fallback();
  }
}

function drawHouse(x, y) {
  ctx.fillStyle = "#b84d3c";
  poly([[x + 12, y + 48], [x + 92, y], [x + 172, y + 48]]);
  ctx.fillStyle = "#e6cf9c";
  ctx.fillRect(x + 28, y + 48, 128, 104);
  ctx.fillStyle = "#805139";
  ctx.fillRect(x + 78, y + 94, 36, 58);
  ctx.fillStyle = "#80aeb0";
  ctx.fillRect(x + 42, y + 78, 28, 26);
  ctx.fillRect(x + 120, y + 78, 24, 26);
  ctx.fillStyle = "#6c8c60";
  ctx.fillRect(x + 25, y + 152, 134, 8);
}

function drawTeaShop(x, y) {
  ctx.fillStyle = "#70513a";
  ctx.fillRect(x + 18, y + 42, 152, 96);
  ctx.fillStyle = "#d4ba7a";
  ctx.fillRect(x + 28, y + 54, 132, 84);
  ctx.fillStyle = "#8f3f33";
  ctx.fillRect(x, y + 24, 188, 28);
  ctx.fillStyle = "#f2d37d";
  for (let i = 0; i < 5; i += 1) ctx.fillRect(x + 12 + i * 34, y + 52, 18, 14);
  ctx.fillStyle = "#5b3e2f";
  ctx.fillRect(x + 82, y + 88, 34, 50);
  ctx.fillStyle = "#79a778";
  ctx.fillRect(x + 32, y + 82, 34, 28);
}

function drawAwning(x, y) {
  ctx.fillStyle = "#7a5135";
  ctx.fillRect(x, y + 48, 128, 10);
  ctx.fillStyle = "#eec55c";
  for (let i = 0; i < 4; i += 1) {
    ctx.fillRect(x + i * 32, y + 26, 32, 24);
    ctx.fillStyle = i % 2 === 0 ? "#d85c45" : "#eec55c";
  }
  ctx.fillStyle = "#6b4930";
  ctx.fillRect(x + 10, y + 58, 10, 62);
  ctx.fillRect(x + 106, y + 58, 10, 62);
  ctx.fillStyle = "#b9753d";
  ctx.fillRect(x + 26, y + 82, 76, 26);
  ctx.fillStyle = "#83bd63";
  ctx.fillRect(x + 34, y + 74, 18, 10);
  ctx.fillRect(x + 60, y + 72, 18, 12);
  ctx.fillRect(x + 84, y + 76, 14, 8);
}

function drawSeedBox(x, y) {
  ctx.fillStyle = "#6f4a2d";
  ctx.fillRect(x, y + 32, 50, 34);
  ctx.fillStyle = "#ba8a49";
  ctx.fillRect(x + 5, y + 22, 40, 16);
  ctx.fillStyle = "#9bc268";
  ctx.fillRect(x + 10, y + 14, 9, 12);
  ctx.fillRect(x + 24, y + 10, 9, 16);
}

function drawMarketSign(x, y) {
  ctx.fillStyle = "#8f3f33";
  ctx.fillRect(x, y, 74, 20);
  ctx.fillStyle = "#f5d27b";
  ctx.fillRect(x + 8, y + 6, 58, 8);
}

function drawPlots() {
  for (const plot of state.plots) {
    if (!plot.tilled && !plot.crop) continue;
    const cropSprite = plot.watered ? sprites.cropPlotWet : sprites.cropPlot;
    const spriteStage = plot.crop ? plot.stage : plot.tilled ? 0 : -1;
    if (cropSprite?.complete && cropSprite.naturalWidth > 0 && spriteStage >= 0) {
      const frame = Math.max(0, Math.min(3, spriteStage));
      ctx.drawImage(cropSprite, frame * 64, 0, 64, 64, plot.x - 30, plotSurfaceY - 6, 60, 60);
    } else {
      const x = plot.x - 18;
      const y = plotSurfaceY;
      ctx.fillStyle = plot.tilled ? "#7b5739" : "#5f8f50";
      ctx.fillRect(x, y, 38, 28);
      ctx.fillStyle = plot.watered ? "#4f6e5e" : "#9a7148";
      if (plot.tilled) ctx.fillRect(x + 2, y + 18, 34, 6);
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(x, y + 26, 38, 4);
      if (plot.crop) drawCrop(plot.x, y + 23, plot.stage);
    }
  }
}

function drawCrop(x, y, stage) {
  const spec = cropStages[stage];
  ctx.fillStyle = spec.color;
  if (stage === 1) {
    ctx.fillRect(x - 3, y - 8, 6, 8);
    ctx.fillRect(x + 3, y - 5, 5, 4);
  } else if (stage === 2) {
    ctx.fillRect(x - 5, y - 15, 10, 15);
    ctx.fillRect(x - 12, y - 10, 10, 6);
    ctx.fillRect(x + 4, y - 12, 11, 7);
  } else {
    ctx.fillRect(x - 7, y - 18, 14, 18);
    ctx.fillStyle = "#6da94f";
    ctx.fillRect(x - 16, y - 12, 11, 8);
    ctx.fillRect(x + 6, y - 15, 12, 8);
    ctx.fillStyle = "#f4dd69";
    ctx.fillRect(x - 4, y - 22, 8, 6);
  }
}

function drawInteractables() {
  drawInteractionHints();
}

function drawNpc(x, y, shirt, skin) {
  const npcSprite = sprites.npcAuntie;
  if (npcSprite?.complete && npcSprite.naturalWidth > 0) {
    const frameWidth = 64;
    const frameHeight = 96;
    const frameIndex = Math.floor(performance.now() / 700) % 3;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,0.23)";
    ctx.fillRect(-18, 22, 36, 6);
    ctx.drawImage(npcSprite, frameIndex * frameWidth, 0, frameWidth, frameHeight, -27, -58, 54, 82);
    ctx.restore();
    return;
  }

  const bob = Math.sin(performance.now() / 420) * 2;
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(x - 14, y + 21, 28, 6);
  ctx.fillStyle = "#573727";
  ctx.fillRect(x - 11, y - 39 + bob, 22, 9);
  ctx.fillStyle = skin;
  ctx.fillRect(x - 8, y - 34 + bob, 16, 16);
  ctx.fillStyle = "#2b241f";
  ctx.fillRect(x - 3, y - 29 + bob, 3, 3);
  ctx.fillRect(x + 5, y - 29 + bob, 3, 3);
  ctx.fillStyle = "#d88968";
  ctx.fillRect(x + 1, y - 24 + bob, 5, 2);
  ctx.fillStyle = shirt;
  ctx.fillRect(x - 10, y - 18 + bob, 20, 28);
  ctx.fillStyle = "#e8d5a2";
  ctx.fillRect(x - 14, y - 14 + bob, 5, 17);
  ctx.fillRect(x + 10, y - 14 + bob, 5, 17);
  ctx.fillStyle = "#f3c486";
  ctx.fillRect(x - 15, y + 3 + bob, 5, 5);
  ctx.fillRect(x + 10, y + 3 + bob, 5, 5);
  ctx.fillStyle = "#3b4b42";
  ctx.fillRect(x - 9, y + 10 + bob, 7, 18);
  ctx.fillRect(x + 3, y + 10 + bob, 7, 18);
  ctx.fillStyle = "#2e332e";
  ctx.fillRect(x - 10, y + 28 + bob, 9, 4);
  ctx.fillRect(x + 2, y + 28 + bob, 9, 4);
}

function drawCrate(x, y) {
  ctx.fillStyle = "#6f4527";
  ctx.fillRect(x - 24, y - 28, 58, 34);
  ctx.fillStyle = "#b9793f";
  ctx.fillRect(x - 18, y - 22, 46, 22);
  ctx.fillStyle = "#7dbb5c";
  ctx.fillRect(x - 12, y - 32, 12, 10);
  ctx.fillRect(x + 6, y - 34, 14, 12);
}

function drawInteractionHints() {
  const near = interactables.find((item) => Math.abs(item.x - state.player.x) < 44 && Math.abs(screenYForLane(item.lane) - playerScreenY()) < 56);
  if (!near) {
    currentNearInteractableId = null;
    return;
  }
  const now = performance.now();
  if (near.id !== currentNearInteractableId) {
    currentNearInteractableId = near.id;
    interactionHintUntil = now + 2200;
  }
  const remaining = interactionHintUntil - now;
  if (remaining <= 0) return;
  const alpha = Math.max(0, Math.min(1, remaining / 500));
  const y = screenYForLane(near.lane) - 76;
  const x = Math.max(52, Math.min(908, near.x));
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(26, 36, 25, 0.88)";
  ctx.fillRect(x - 48, y, 96, 26);
  ctx.strokeStyle = "#e5c66b";
  ctx.strokeRect(x - 48, y, 96, 26);
  ctx.fillStyle = "#fff1c8";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`E ${near.label}`, x, y + 17);
  ctx.textAlign = "left";
  ctx.restore();
}

function drawPlayer() {
  const p = state.player;
  const x = p.x;
  const y = playerScreenY();
  const bob = p.moving ? Math.sin(p.walkFrame) * 2 : Math.sin(performance.now() / 600) * 1;
  const playerSprite = sprites.player8bit;

  if (playerSprite?.complete && playerSprite.naturalWidth > 0) {
    const frameWidth = 64;
    const frameHeight = 96;
    const walkFrame = 1 + (Math.floor(p.walkFrame) % 4);
    const sourceX = (p.moving ? walkFrame : 0) * frameWidth;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(p.dir, 1);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(-18, 22, 36, 6);
    ctx.drawImage(playerSprite, sourceX, 0, frameWidth, frameHeight, -25, -54, 50, 76);
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.scale(p.dir, 1);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(-16, 22, 32, 6);
  ctx.fillStyle = "#2e2821";
  ctx.fillRect(-10, -48, 20, 10);
  ctx.fillStyle = "#f1bf87";
  ctx.fillRect(-8, -42, 16, 16);
  ctx.fillStyle = "#2b231e";
  ctx.fillRect(-3, -36, 3, 3);
  ctx.fillRect(5, -36, 3, 3);
  ctx.fillStyle = "#d77c62";
  ctx.fillRect(0, -30, 6, 2);
  ctx.fillStyle = "#f2eee0";
  ctx.fillRect(-11, -24, 22, 29);
  ctx.fillStyle = "#78a65d";
  ctx.fillRect(-11, -10, 22, 5);
  ctx.fillStyle = "#e9b858";
  ctx.fillRect(-16, -20, 6, 22);
  ctx.fillRect(10, -20, 6, 22);
  ctx.fillStyle = "#f1bf87";
  ctx.fillRect(-17, 0, 6, 5);
  ctx.fillRect(11, 0, 6, 5);
  ctx.fillStyle = "#456fb3";
  ctx.fillRect(-10, 5, 8, 20);
  ctx.fillRect(3, 5, 8, 20);
  ctx.fillStyle = "#28333c";
  ctx.fillRect(-11, 24, 10, 4);
  ctx.fillRect(2, 24, 10, 4);
  ctx.fillStyle = "#d6a64d";
  ctx.fillRect(8, -12, 13, 5);
  ctx.restore();
}

function drawForeground() {
  ctx.fillStyle = "rgba(34, 55, 35, 0.42)";
  ctx.fillRect(0, 430, 960, 110);
  ctx.fillStyle = "#375f3f";
  for (let x = 4; x < 960; x += 28) {
    ctx.fillRect(x, 438 + (x % 4), 5, 18);
    ctx.fillRect(x + 7, 448, 8, 5);
  }
}

function pixelCloud(x, y, scale) {
  ctx.fillStyle = "rgba(255, 247, 219, 0.8)";
  ctx.fillRect(x, y, 22 * scale, 8 * scale);
  ctx.fillRect(x + 10 * scale, y - 8 * scale, 28 * scale, 16 * scale);
  ctx.fillRect(x + 34 * scale, y, 20 * scale, 8 * scale);
}

function poly(points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points.slice(1)) ctx.lineTo(point[0], point[1]);
  ctx.closePath();
  ctx.fill();
}

function tick(now) {
  const dt = Math.min(0.04, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  updateToastVisibility(now);
  draw();
}

function updateToastVisibility(now) {
  ui.toast.classList.toggle("hidden", now > toastVisibleUntil);
}

function renderUi() {
  ui.day.textContent = formatCalendarLabel();
  ui.phase.textContent = phases[state.phase];
  ui.money.textContent = `金币 ${state.money}`;
  ui.seeds.textContent = `种子 ${state.seeds}`;
  ui.toast.textContent = state.message;
  ui.inventory.innerHTML = `
    <div>新鲜蔬菜：${state.harvest}</div>
    <div>村庄信任：${state.villageTrust}</div>
    <div>当前工具：${tools.find((tool) => tool.id === state.activeTool).name}</div>
  `;

  const tasks = [
    ["翻一格菜地", state.flags.tilled],
    ["种下一粒本地菜种", state.flags.planted],
    ["给作物浇水", state.flags.watered],
    ["收获 3 份新鲜蔬菜", state.harvest >= 3 || state.flags.delivered],
    ["把 3 份蔬菜交给助农货箱", state.flags.delivered],
    ["确认助农集市方向", state.flags.delivered]
  ];
  ui.tasks.innerHTML = tasks.map(([label, done]) => `<li class="${done ? "done" : ""}">${label}</li>`).join("");
}

function formatCalendarLabel() {
  const normalizedDay = clamp(Math.floor(state.day || 1), 1, daysPerYear);
  const termIndex = Math.floor((normalizedDay - 1) / daysPerTerm);
  const dayInTerm = ((normalizedDay - 1) % daysPerTerm) + 1;
  const yearPrefix = state.year > 1 ? `第${state.year}年 ` : "";
  return `${yearPrefix}${solarTerms[termIndex]} 第${dayInTerm}日`;
}

function renderHotbar() {
  ui.hotbar.innerHTML = tools.map((tool, index) => `
    <button class="slot ${state.activeTool === tool.id ? "active" : ""}" type="button" data-tool="${tool.id}">
      <small>${index + 1}</small>
      <b>${tool.icon}</b>
    </button>
  `).join("");
  ui.hotbar.querySelectorAll(".slot").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTool = button.dataset.tool;
      renderHotbar();
      renderUi();
      saveState();
    });
  });
}

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) {
    event.preventDefault();
  }
  keys.add(event.code);
  if (event.code === "Space") useTool();
  if (event.code === "KeyE") interact();
  if (event.code === "KeyN") advancePhase();
  const number = Number(event.key);
  if (number >= 1 && number <= tools.length) {
    state.activeTool = tools[number - 1].id;
    renderHotbar();
    renderUi();
    saveState();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

ui.nextPhase.addEventListener("click", advancePhase);

renderHotbar();
renderUi();
requestAnimationFrame(tick);
