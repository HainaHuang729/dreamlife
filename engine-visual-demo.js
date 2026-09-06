const demos = [...document.querySelectorAll(".engine-card")].map((card) => {
  const canvas = card.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return { engine: card.dataset.engine, canvas, ctx };
});

const lockedCanvas = document.querySelector("#lockedView");
const lockedCtx = lockedCanvas?.getContext("2d");
if (lockedCtx) lockedCtx.imageSmoothingEnabled = false;

const viewDemos = [...document.querySelectorAll(".perspective-card")].map((card) => {
  const canvas = card.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return { view: card.dataset.view, canvas, ctx };
});

const LOGICAL_WIDTH = 480;
const LOGICAL_HEIGHT = 320;
const VIEW_WIDTH = 360;
const VIEW_HEIGHT = 240;

let scene = "day";
let motion = true;
let frozenTime = 0;
let lastFrameTime = performance.now();
let cameraZoom = 1;
let currentMap = "village";

const keys = new Set();
const villagePlayer = {
  x: 238,
  y: 226,
  dirX: 0,
  dirY: 1,
  moving: 0
};

const villageColliders = [
  { x: 44, y: 128, w: 96, h: 38 },
  { x: 174, y: 112, w: 110, h: 50 },
  { x: 326, y: 124, w: 94, h: 40 },
  { x: 48, y: 222, w: 78, h: 34 },
  { x: 310, y: 226, w: 112, h: 34 },
  { x: 218, y: 188, w: 42, h: 24 }
];

const homeColliders = [
  { x: 42, y: 92, w: 66, h: 48 },
  { x: 150, y: 118, w: 62, h: 40 },
  { x: 280, y: 76, w: 92, h: 52 },
  { x: 56, y: 214, w: 84, h: 36 },
  { x: 312, y: 214, w: 70, h: 34 },
  { x: 208, y: 72, w: 38, h: 30 }
];

const mapStartPositions = {
  village: { x: 238, y: 226 },
  home: { x: 234, y: 212 }
};

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
    event.preventDefault();
    keys.add(event.key.toLowerCase());
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

const sceneSettings = {
  day: {
    skyTop: "#7ec9df",
    skyBottom: "#d6f0cf",
    haze: "rgba(255, 244, 187, 0.12)",
    tint: null,
    rain: false,
    sun: "#ffe68a"
  },
  dusk: {
    skyTop: "#e38d66",
    skyBottom: "#f5c985",
    haze: "rgba(250, 144, 79, 0.24)",
    tint: "rgba(92, 47, 82, 0.2)",
    rain: false,
    sun: "#ffd06d"
  },
  rain: {
    skyTop: "#708798",
    skyBottom: "#b8c2ac",
    haze: "rgba(161, 190, 205, 0.18)",
    tint: "rgba(39, 55, 70, 0.24)",
    rain: true,
    sun: "#dbe8df"
  }
};

const engineSettings = {
  godot: {
    scale: 1,
    palette: {
      grass: "#66a84f",
      grass2: "#78b95b",
      dirt: "#a66e42",
      dirt2: "#bd8450",
      roof: "#b84f43",
      wall: "#e0c588",
      trim: "#775035",
      shadow: "rgba(26, 43, 24, 0.34)",
      water: "#4aa4b7"
    },
    outline: true,
    bloom: false,
    scanlines: false,
    saturation: 0,
    softness: 0
  },
  unity: {
    scale: 1,
    palette: {
      grass: "#5f9d49",
      grass2: "#7bc35b",
      dirt: "#9b6840",
      dirt2: "#c48b55",
      roof: "#c65545",
      wall: "#e3c681",
      trim: "#6b4932",
      shadow: "rgba(15, 28, 20, 0.42)",
      water: "#4fb5c8"
    },
    outline: true,
    bloom: true,
    scanlines: false,
    saturation: 0.08,
    softness: 0.18
  },
  gamemaker: {
    scale: 1,
    palette: {
      grass: "#68b94a",
      grass2: "#83cc5d",
      dirt: "#a85d37",
      dirt2: "#c77840",
      roof: "#bc463c",
      wall: "#e2bd72",
      trim: "#6f462b",
      shadow: "rgba(27, 38, 20, 0.24)",
      water: "#409fbb"
    },
    outline: false,
    bloom: false,
    scanlines: false,
    saturation: 0.14,
    softness: 0
  },
  monogame: {
    scale: 1,
    palette: {
      grass: "#5f8f47",
      grass2: "#76a756",
      dirt: "#8f6142",
      dirt2: "#b5784b",
      roof: "#9f4b43",
      wall: "#cdb879",
      trim: "#594634",
      shadow: "rgba(11, 17, 16, 0.38)",
      water: "#3e879e"
    },
    outline: true,
    bloom: false,
    scanlines: true,
    saturation: -0.08,
    softness: 0
  }
};

document.querySelectorAll(".mode").forEach((button) => {
  button.addEventListener("click", () => {
    scene = button.dataset.scene;
    document.querySelectorAll(".mode").forEach((item) => item.classList.toggle("active", item === button));
    drawAll(performance.now());
  });
});

document.querySelector("#motionToggle").addEventListener("click", (event) => {
  motion = !motion;
  frozenTime = performance.now() * 0.001;
  event.currentTarget.setAttribute("aria-pressed", String(motion));
  event.currentTarget.textContent = motion ? "动画开" : "动画关";
  drawAll(performance.now());
});

const zoomControl = document.querySelector("#zoomControl");
const zoomOut = document.querySelector("#zoomOut");
const zoomIn = document.querySelector("#zoomIn");

function setCameraZoom(value) {
  cameraZoom = Math.max(0.75, Math.min(1.65, Number(value)));
  if (zoomControl) zoomControl.value = String(cameraZoom);
  drawAll(performance.now());
}

zoomControl?.addEventListener("input", (event) => {
  setCameraZoom(event.currentTarget.value);
});

zoomOut?.addEventListener("click", () => {
  setCameraZoom(cameraZoom - 0.1);
});

zoomIn?.addEventListener("click", () => {
  setCameraZoom(cameraZoom + 0.1);
});

document.querySelectorAll(".map-button").forEach((button) => {
  button.addEventListener("click", () => {
    const map = button.dataset.map;
    const start = mapStartPositions[map];
    setCurrentMap(map, start.x, start.y);
    drawAll(performance.now());
  });
});

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function poly(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(Math.round(points[0][0]), Math.round(points[0][1]));
  points.slice(1).forEach(([x, y]) => ctx.lineTo(Math.round(x), Math.round(y)));
  ctx.closePath();
  ctx.fill();
}

function drawAll(time) {
  updateVillagePlayer(time);
  if (lockedCtx) drawLockedView(time);
  demos.forEach((demo) => drawDemo(demo, time));
  viewDemos.forEach((demo) => drawViewDemo(demo, time));
}

function updateVillagePlayer(time) {
  const dt = Math.min(0.05, (time - lastFrameTime) / 1000);
  lastFrameTime = time;
  let dx = 0;
  let dy = 0;
  if (keys.has("arrowleft") || keys.has("a")) dx -= 1;
  if (keys.has("arrowright") || keys.has("d")) dx += 1;
  if (keys.has("arrowup") || keys.has("w")) dy -= 1;
  if (keys.has("arrowdown") || keys.has("s")) dy += 1;

  if (dx || dy) {
    const length = Math.hypot(dx, dy);
    const speed = 86;
    dx /= length;
    dy /= length;
    villagePlayer.dirX = dx;
    villagePlayer.dirY = dy;
    villagePlayer.moving += dt * 12;
    moveVillagePlayer(dx * speed * dt, dy * speed * dt);
  } else {
    villagePlayer.moving = 0;
  }
}

function moveVillagePlayer(dx, dy) {
  const nextX = villagePlayer.x + dx;
  if (canStandAt(nextX, villagePlayer.y)) villagePlayer.x = nextX;
  const nextY = villagePlayer.y + dy;
  if (canStandAt(villagePlayer.x, nextY)) villagePlayer.y = nextY;
  checkMapTransition();
}

function setCurrentMap(map, x, y) {
  currentMap = map;
  villagePlayer.x = x;
  villagePlayer.y = y;
  villagePlayer.moving = 0;
  document.querySelectorAll(".map-button").forEach((item) => {
    item.classList.toggle("active", item.dataset.map === map);
  });
}

function checkMapTransition() {
  if (currentMap === "village" && pointInRect(villagePlayer.x, villagePlayer.y, { x: 76, y: 146, w: 30, h: 20 })) {
    setCurrentMap("home", 234, 244);
  } else if (currentMap === "home" && pointInRect(villagePlayer.x, villagePlayer.y, { x: 202, y: 252, w: 58, h: 34 })) {
    setCurrentMap("village", 90, 174);
  }
}

function pointInRect(x, y, box) {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
}

function canStandAt(x, y) {
  const bounds = currentMap === "home"
    ? { left: 28, right: LOGICAL_WIDTH - 28, top: 74, bottom: LOGICAL_HEIGHT - 32 }
    : { left: 22, right: LOGICAL_WIDTH - 26, top: 136, bottom: LOGICAL_HEIGHT - 34 };
  if (x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom) return false;
  const colliders = currentMap === "home" ? homeColliders : villageColliders;
  return !colliders.some((box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h);
}

function applyVillageCamera(ctx) {
  if (cameraZoom === 1) return;
  const focusX = villagePlayer.x + 6;
  const focusY = villagePlayer.y + 10;
  ctx.translate(LOGICAL_WIDTH / 2, LOGICAL_HEIGHT / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-focusX, -focusY);
}

function drawDemo({ ctx, canvas, engine }, time) {
  const settings = engineSettings[engine];
  const current = sceneSettings[scene];
  const t = motion ? time * 0.001 : frozenTime;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(canvas.width / LOGICAL_WIDTH, canvas.height / LOGICAL_HEIGHT);
  drawSky(ctx, current, settings, t);
  drawHills(ctx, settings, current, t);
  drawField(ctx, settings, current, t);
  drawFarm(ctx, settings, current, t);
  drawCharacters(ctx, settings, t);
  drawForeground(ctx, settings, current, t);
  drawEngineFinish(ctx, engine, settings, current, t, canvas);
  ctx.restore();
}

function drawLockedView(time) {
  const t = motion ? time * 0.001 : frozenTime;
  const ctx = lockedCtx;
  ctx.save();
  ctx.clearRect(0, 0, lockedCanvas.width, lockedCanvas.height);
  ctx.scale(lockedCanvas.width / LOGICAL_WIDTH, lockedCanvas.height / LOGICAL_HEIGHT);
  applyVillageCamera(ctx);

  const hero = {
    x: villagePlayer.x,
    y: villagePlayer.y,
    depthY: villagePlayer.y + 26
  };
  const objects = currentMap === "home"
    ? homeObjects(ctx, hero, t)
    : villageObjects(ctx, hero, t);

  objects
    .sort((a, b) => a.depthY - b.depthY || a.order - b.order)
    .forEach((object) => object.draw());

  ctx.restore();
  drawVillageHudOverlay(hero);
}

function villageObjects(ctx, hero, t) {
  drawVillageGround(ctx, t);
  return [
    { depthY: 138, order: 1, draw: () => drawVillageBuilding(ctx, 44, 66, 96, 94, "#bd5646", "#dfc683", "茶铺") },
    { depthY: 142, order: 2, draw: () => drawVillageBuilding(ctx, 174, 52, 110, 104, "#7f9b64", "#d8c68a", "卫生站") },
    { depthY: 154, order: 3, draw: () => drawVillageBuilding(ctx, 326, 70, 94, 88, "#b64f42", "#e1be76", "杂货") },
    { depthY: 174, order: 4, draw: () => drawVillageBoard(ctx, 214, 146, "公告") },
    { depthY: 188, order: 5, draw: () => drawVillageTree(ctx, 18, 106, t) },
    { depthY: 204, order: 6, draw: () => drawVillageTree(ctx, 434, 124, t + 1.4) },
    { depthY: 216, order: 7, draw: () => drawCourierStation(ctx, 48, 188) },
    { depthY: 224, order: 8, draw: () => drawVisitorKiosk(ctx, 310, 190) },
    { depthY: hero.depthY, order: 20, draw: () => drawLockedHero(ctx, hero.x, hero.y, t) },
    { depthY: 292, order: 40, draw: () => drawVillageForeground(ctx, t) }
  ];
}

function homeObjects(ctx, hero, t) {
  drawHomeGround(ctx, t);
  return [
    { depthY: 122, order: 1, draw: () => drawHomeWindow(ctx, 210, 42) },
    { depthY: 138, order: 2, draw: () => drawHomeBed(ctx, 42, 82) },
    { depthY: 146, order: 3, draw: () => drawHomeStove(ctx, 294, 70) },
    { depthY: 164, order: 4, draw: () => drawHomeTable(ctx, 150, 118) },
    { depthY: 208, order: 5, draw: () => drawHomeBookshelf(ctx, 56, 190) },
    { depthY: 234, order: 6, draw: () => drawHomePetCorner(ctx, 312, 202, t) },
    { depthY: hero.depthY, order: 20, draw: () => drawLockedHero(ctx, hero.x, hero.y, t) },
    { depthY: 292, order: 40, draw: () => drawHomeForeground(ctx) }
  ];
}

function drawLockedGround(ctx, t) {
  const gradient = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
  gradient.addColorStop(0, "#9bd4df");
  gradient.addColorStop(0.48, "#d5e7be");
  gradient.addColorStop(0.49, "#73ad56");
  gradient.addColorStop(1, "#5b9548");
  rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, gradient);
  poly(ctx, [[0, 132], [62, 104], [138, 132], [210, 100], [290, 134], [370, 106], [480, 134], [480, 166], [0, 166]], "#557c4d");
  for (let x = -10; x < 500; x += 42) drawPine(ctx, x, 118 + Math.sin(t + x) * 1.4, 0.78, "#385f3d", "#2f5235");
  for (let y = 156; y < 316; y += 10) {
    for (let x = (y / 10) % 2 ? 4 : 14; x < 480; x += 24) {
      rect(ctx, x, y, 6, 2, "#88bf64");
      if ((x + y) % 72 === 0) rect(ctx, x + 8, y + 2, 3, 3, "#f0d66a");
    }
  }
  drawLockedStonePath(ctx);
  drawLockedFlowerStrip(ctx, 20, 230, t);
}

function drawVillageGround(ctx, t) {
  const gradient = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
  gradient.addColorStop(0, "#9bd4df");
  gradient.addColorStop(0.46, "#d5e7be");
  gradient.addColorStop(0.47, "#72ad56");
  gradient.addColorStop(1, "#5c9748");
  rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, gradient);
  poly(ctx, [[0, 128], [58, 104], [128, 130], [205, 98], [286, 132], [360, 104], [480, 132], [480, 162], [0, 162]], "#557c4d");
  for (let x = -18; x < 500; x += 48) drawPine(ctx, x, 118 + Math.sin(t + x) * 1.2, 0.74, "#385f3d", "#2f5235");

  for (let y = 152; y < 316; y += 10) {
    for (let x = (y / 10) % 2 ? 4 : 14; x < 480; x += 24) {
      rect(ctx, x, y, 6, 2, "#88bf64");
      if ((x + y) % 84 === 0) rect(ctx, x + 8, y + 2, 3, 3, "#f0d66a");
    }
  }

  drawVillageRoad(ctx);
  drawVillageGarden(ctx, 348, 174, t);
  drawVillageGarden(ctx, 124, 196, t + 1);
}

function drawHomeGround(ctx, t) {
  rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, "#2f3c32");
  rect(ctx, 24, 42, 432, 244, "#9b7248");
  rect(ctx, 24, 42, 432, 26, "#73533a");
  rect(ctx, 24, 260, 432, 26, "#6c4930");
  for (let y = 72; y < 260; y += 20) {
    rect(ctx, 30, y, 420, 2, "rgba(255, 220, 151, 0.14)");
    rect(ctx, 30, y + 12, 420, 1, "rgba(65, 43, 28, 0.2)");
  }
  for (let x = 44; x < 440; x += 42) {
    rect(ctx, x, 74, 2, 184, "rgba(77, 50, 32, 0.16)");
  }
  rect(ctx, 154, 176, 82, 54, "#7a4543");
  rect(ctx, 160, 182, 70, 42, "#8e5650");
  rect(ctx, 200 + Math.sin(t) * 1, 268, 54, 12, "#c79a5d");
  rect(ctx, 214, 260, 26, 20, "#5a3c2a");
}

function drawHomeWindow(ctx, x, y) {
  rect(ctx, x, y, 40, 32, "#6c4930");
  rect(ctx, x + 5, y + 5, 30, 22, "#aee1e8");
  rect(ctx, x + 9, y + 8, 7, 18, "rgba(255, 255, 255, 0.44)");
  rect(ctx, x + 19, y + 5, 2, 22, "#6aa4ad");
  rect(ctx, x + 5, y + 15, 30, 2, "#6aa4ad");
}

function drawHomeBed(ctx, x, y) {
  rect(ctx, x + 4, y + 42, 88, 8, "rgba(31, 27, 20, 0.24)");
  rect(ctx, x, y, 96, 54, "#6f472c");
  rect(ctx, x + 8, y + 8, 80, 38, "#d8b15a");
  rect(ctx, x + 8, y + 8, 34, 24, "#f4f1df");
  rect(ctx, x + 43, y + 10, 42, 32, "#7b5fa3");
  rect(ctx, x + 4, y + 44, 88, 7, "#5a3927");
}

function drawHomeStove(ctx, x, y) {
  rect(ctx, x + 6, y + 48, 80, 8, "rgba(31, 27, 20, 0.24)");
  rect(ctx, x, y + 18, 92, 38, "#8f8878");
  rect(ctx, x + 8, y + 26, 28, 22, "#3b2a1d");
  rect(ctx, x + 46, y + 26, 30, 8, "#c8c2af");
  rect(ctx, x + 52, y + 10, 12, 16, "#6c4930");
  rect(ctx, x + 56, y, 5, 12, "#5f5b50");
  rect(ctx, x + 13, y + 31, 18, 3, "#f0c76c");
}

function drawHomeTable(ctx, x, y) {
  rect(ctx, x + 2, y + 36, 62, 8, "rgba(31, 27, 20, 0.24)");
  rect(ctx, x, y + 12, 66, 28, "#8b613c");
  rect(ctx, x + 7, y + 7, 52, 10, "#b3844d");
  rect(ctx, x + 10, y + 36, 5, 18, "#6c4930");
  rect(ctx, x + 50, y + 36, 5, 18, "#6c4930");
  rect(ctx, x + 26, y + 3, 13, 8, "#f4f1df");
  rect(ctx, x + 30, y, 5, 5, "#f0c76c");
}

function drawHomeBookshelf(ctx, x, y) {
  rect(ctx, x + 2, y + 36, 86, 8, "rgba(31, 27, 20, 0.24)");
  rect(ctx, x, y, 90, 48, "#6c4930");
  rect(ctx, x + 8, y + 7, 74, 10, "#9b6c3e");
  rect(ctx, x + 8, y + 25, 74, 10, "#9b6c3e");
  const colors = ["#7b5fa3", "#d8b15a", "#5f8ed6", "#d95a65"];
  for (let i = 0; i < 14; i += 1) {
    rect(ctx, x + 12 + i * 5, y + 8 + (i % 2) * 18, 3, 9, colors[i % colors.length]);
  }
}

function drawHomePetCorner(ctx, x, y, t) {
  rect(ctx, x + 2, y + 34, 74, 8, "rgba(31, 27, 20, 0.24)");
  rect(ctx, x, y + 14, 44, 25, "#7b5fa3");
  rect(ctx, x + 7, y + 20, 30, 12, "#d8b15a");
  rect(ctx, x + 54, y + 22, 22, 12, "#c8c2af");
  rect(ctx, x + 59, y + 25, 12, 4, "#d8b15a");
  rect(ctx, x + 16 + Math.sin(t * 4) * 2, y + 4, 7, 7, "#f0c76c");
}

function drawHomeForeground(ctx) {
  rect(ctx, 24, 282, 432, 4, "rgba(18, 14, 10, 0.32)");
}

function drawVillageRoad(ctx) {
  poly(ctx, [[0, 176], [480, 176], [480, 220], [0, 220]], "#b99b68");
  poly(ctx, [[218, 118], [260, 118], [286, 320], [170, 320]], "#b99b68");
  rect(ctx, 0, 198, 480, 4, "rgba(89, 69, 44, 0.18)");
  for (let x = 14; x < 470; x += 28) {
    rect(ctx, x, 188 + (x % 56 ? 0 : 10), 14, 6, "#d4bd84");
  }
  for (let y = 132; y < 310; y += 24) {
    rect(ctx, 218 + (y % 48 ? 10 : -6), y, 13, 7, "#d4bd84");
  }
}

function drawVillageBuilding(ctx, x, y, w, h, roof, wall, label) {
  rect(ctx, x - 6, y + h - 6, w + 14, 10, "rgba(31, 43, 25, 0.28)");
  rect(ctx, x, y + 38, w, h - 38, wall);
  for (let row = y + 48; row < y + h - 6; row += 10) {
    rect(ctx, x + 5, row, w - 10, 2, "rgba(255, 239, 183, 0.24)");
    rect(ctx, x + 5, row + 6, w - 10, 1, "rgba(101, 68, 40, 0.15)");
  }
  rect(ctx, x - 8, y + 26, w + 16, 26, roof);
  rect(ctx, x + 9, y + 10, w - 18, 24, roof);
  drawRoofTiles(ctx, x - 8, y + 26, w + 16, 26);
  drawRoofTiles(ctx, x + 9, y + 10, w - 18, 24);
  rect(ctx, x + 18, y + h - 38, 22, 38, "#754e35");
  rect(ctx, x + 35, y + h - 20, 3, 3, "#d9bd78");
  rect(ctx, x + w - 34, y + h - 48, 22, 20, "#aee1e8");
  rect(ctx, x + w - 31, y + h - 45, 4, 16, "rgba(255, 255, 255, 0.48)");
  rect(ctx, x + w - 34, y + h - 39, 22, 2, "#6aa4ad");
  drawVillageSign(ctx, x + w / 2 - 18, y + h - 18, label);
}

function drawVillageSign(ctx, x, y, label) {
  rect(ctx, x, y, 36, 14, "#c89954");
  rect(ctx, x + 3, y + 3, 30, 8, "#f0d28a");
  ctx.fillStyle = "#5f3f28";
  ctx.font = "8px sans-serif";
  ctx.fillText(label, x + 7, y + 10);
}

function drawVillageBoard(ctx, x, y, label) {
  rect(ctx, x + 18, y + 32, 5, 26, "#6c4b31");
  rect(ctx, x, y, 42, 34, "#c89954");
  rect(ctx, x + 5, y + 5, 32, 22, "#f0d28a");
  rect(ctx, x + 10, y + 10, 20, 2, "#8b613c");
  rect(ctx, x + 10, y + 16, 16, 2, "#8b613c");
  ctx.fillStyle = "#5f3f28";
  ctx.font = "9px sans-serif";
  ctx.fillText(label, x + 10, y + 26);
}

function drawCourierStation(ctx, x, y) {
  rect(ctx, x + 2, y + 42, 86, 8, "rgba(31, 43, 25, 0.26)");
  rect(ctx, x + 10, y + 14, 68, 30, "#dca954");
  rect(ctx, x, y + 4, 88, 16, "#7b4d2d");
  rect(ctx, x + 12, y + 26, 18, 16, "#5f412c");
  rect(ctx, x + 38, y + 26, 24, 10, "#f0d28a");
  ctx.fillStyle = "#5f3f28";
  ctx.font = "8px sans-serif";
  ctx.fillText("快递", x + 40, y + 34);
}

function drawVisitorKiosk(ctx, x, y) {
  rect(ctx, x + 2, y + 42, 92, 8, "rgba(31, 43, 25, 0.26)");
  rect(ctx, x + 8, y + 16, 78, 30, "#d8c68a");
  rect(ctx, x, y + 4, 94, 16, "#5f8f72");
  rect(ctx, x + 15, y + 26, 20, 18, "#6f472c");
  rect(ctx, x + 50, y + 24, 20, 14, "#aee1e8");
  ctx.fillStyle = "#315f36";
  ctx.font = "8px sans-serif";
  ctx.fillText("游客", x + 50, y + 18);
}

function drawVillageTree(ctx, x, y, t) {
  const sway = Math.sin(t * 1.4) * 2;
  rect(ctx, x + 18, y + 58, 14, 48, "#654b31");
  poly(ctx, [[x + 25 + sway, y], [x - 4 + sway, y + 54], [x + 54 + sway, y + 54]], "#315f36");
  poly(ctx, [[x + 25 + sway, y + 20], [x + 2 + sway, y + 78], [x + 50 + sway, y + 78]], "#3f7842");
  rect(ctx, x + 18 + sway, y + 35, 12, 4, "rgba(185, 221, 138, 0.24)");
}

function drawVillageGarden(ctx, x, y, t) {
  for (let i = 0; i < 12; i += 1) {
    const px = x + (i % 4) * 13;
    const py = y + Math.floor(i / 4) * 12 + Math.round(Math.sin(t * 2 + i) * 1);
    rect(ctx, px + 4, py + 4, 2, 8, "#3f7f3f");
    rect(ctx, px + 1, py + 1, 4, 4, i % 2 ? "#f0d66a" : "#f1a5b8");
    rect(ctx, px + 6, py + 1, 4, 4, i % 3 ? "#f4f1df" : "#8cc7ef");
  }
}

function drawVillageForeground(ctx, t) {
  for (let x = -5; x < 490; x += 18) {
    const y = 294 + Math.sin(t + x) * 2;
    rect(ctx, x, y, 13, 28, "#3d7c38");
    rect(ctx, x + 5, y - 9, 9, 20, "#4f9141");
    rect(ctx, x + 9, y - 14, 8, 24, "#5aa148");
  }
}

function drawVillageHud(ctx, hero) {
  rect(ctx, 12, 12, 196, 58, "rgba(18, 27, 21, 0.72)");
  ctx.fillStyle = "#f5efd4";
  ctx.font = "11px sans-serif";
  ctx.fillText("WASD / 方向键移动", 22, 30);
  ctx.fillText("Y-sort 锚点：脚底 / 物件底边", 22, 47);
  ctx.fillStyle = "#d9c37a";
  ctx.fillText(`角色 depthY ${Math.round(hero.depthY)}`, 22, 64);
  rect(ctx, hero.x - 3, hero.depthY - 2, 18, 3, "#f1d56c");
}

function drawVillageHudOverlay(hero) {
  const ctx = lockedCtx;
  ctx.save();
  ctx.clearRect(0, 0, 0, 0);
  ctx.scale(lockedCanvas.width / LOGICAL_WIDTH, lockedCanvas.height / LOGICAL_HEIGHT);
  rect(ctx, 12, 12, 216, 72, "rgba(18, 27, 21, 0.72)");
  ctx.fillStyle = "#f5efd4";
  ctx.font = "11px sans-serif";
  ctx.fillText("WASD / 方向键移动", 22, 30);
  ctx.fillText(currentMap === "home" ? "走到门口回村子" : "走到茶铺门口进我家", 22, 47);
  ctx.fillStyle = "#d9c37a";
  ctx.fillText(`缩放 ${cameraZoom.toFixed(2)}x · depthY ${Math.round(hero.depthY)}`, 22, 64);
  ctx.restore();
}

function drawLockedStonePath(ctx) {
  const stones = [
    [230, 196], [246, 201], [262, 207], [280, 212], [298, 216], [316, 219],
    [204, 214], [188, 226], [174, 240], [158, 252], [144, 266]
  ];
  for (const [x, y] of stones) {
    rect(ctx, x, y, 13, 7, "#d5bb82");
    rect(ctx, x + 1, y + 5, 11, 2, "rgba(90, 70, 45, 0.22)");
  }
}

function drawLockedFarmhouse(ctx, x, y) {
  rect(ctx, x - 8, y + 122, 148, 12, "rgba(31, 43, 25, 0.32)");
  rect(ctx, x, y + 52, 118, 76, "#dfc683");
  for (let row = y + 60; row < y + 122; row += 10) {
    rect(ctx, x + 5, row, 108, 2, "rgba(255, 239, 183, 0.24)");
    rect(ctx, x + 5, row + 6, 108, 1, "rgba(101, 68, 40, 0.15)");
  }
  rect(ctx, x - 8, y + 38, 134, 28, "#b64f42");
  rect(ctx, x + 12, y + 20, 94, 27, "#c45b48");
  drawRoofTiles(ctx, x - 8, y + 38, 134, 28);
  drawRoofTiles(ctx, x + 12, y + 20, 94, 27);
  rect(ctx, x + 36, y + 86, 24, 42, "#754e35");
  rect(ctx, x + 55, y + 105, 3, 3, "#d9bd78");
  rect(ctx, x + 80, y + 80, 24, 22, "#aee1e8");
  rect(ctx, x + 83, y + 83, 5, 17, "rgba(255, 255, 255, 0.48)");
  rect(ctx, x + 80, y + 91, 24, 2, "#6aa4ad");
}

function drawLockedGreenhouse(ctx, x, y) {
  rect(ctx, x + 2, y + 62, 88, 9, "rgba(31, 43, 25, 0.25)");
  rect(ctx, x + 8, y + 24, 74, 42, "rgba(170, 218, 190, 0.78)");
  poly(ctx, [[x + 45, y], [x + 88, y + 26], [x + 2, y + 26]], "rgba(235, 248, 224, 0.9)");
  rect(ctx, x + 20, y + 34, 9, 28, "#5d9b68");
  rect(ctx, x + 45, y + 34, 9, 28, "#5d9b68");
  rect(ctx, x + 14, y + 26, 62, 3, "rgba(255, 255, 255, 0.48)");
}

function drawLockedTree(ctx, x, y, t) {
  const sway = Math.sin(t * 1.4) * 2;
  rect(ctx, x + 18, y + 58, 14, 48, "#654b31");
  poly(ctx, [[x + 25 + sway, y], [x - 4 + sway, y + 54], [x + 54 + sway, y + 54]], "#315f36");
  poly(ctx, [[x + 25 + sway, y + 20], [x + 2 + sway, y + 78], [x + 50 + sway, y + 78]], "#3f7842");
  rect(ctx, x + 18 + sway, y + 35, 12, 4, "rgba(185, 221, 138, 0.24)");
}

function drawLockedMarket(ctx, x, y) {
  rect(ctx, x + 2, y + 38, 68, 8, "rgba(31, 43, 25, 0.26)");
  rect(ctx, x + 8, y + 15, 54, 28, "#dca954");
  rect(ctx, x, y + 4, 70, 16, "#7b4d2d");
  rect(ctx, x + 8, y + 6, 58, 3, "#9b673d");
  rect(ctx, x + 20, y + 24, 24, 16, "#5f412c");
}

function drawLockedFenceRun(ctx, x, y, width) {
  for (let i = 0; i < width; i += 24) {
    rect(ctx, x + i, y, 6, 24, "#6e4c2f");
    rect(ctx, x + i + 1, y + 2, 2, 17, "rgba(255, 222, 151, 0.16)");
  }
  rect(ctx, x, y + 7, width, 5, "#9b6c3e");
  rect(ctx, x, y + 17, width, 5, "#9b6c3e");
}

function drawLockedCropBlock(ctx, x, y, t) {
  rect(ctx, x, y, 152, 76, "#7e5234");
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 6; col += 1) {
      const px = x + 12 + col * 22;
      const py = y + 15 + row * 20;
      rect(ctx, px - 4, py + 13, 18, 3, "rgba(31, 52, 24, 0.22)");
      const sway = Math.round(Math.sin(t * 2 + col) * 1);
      rect(ctx, px + 4 + sway, py + 3, 4, 16, "#2f763d");
      rect(ctx, px - 1 + sway, py + 1, 12, 6, "#78c25c");
      rect(ctx, px + 8 + sway, py - 2, 10, 7, "#6eb657");
      rect(ctx, px + 5 + sway, py - 6, 6, 6, "#f1d56c");
    }
  }
}

function drawLockedPond(ctx, x, y, t) {
  rect(ctx, x, y, 148, 38, "#4aa4b7");
  rect(ctx, x, y - 4, 148, 6, "#8ad3d7");
  for (let i = 0; i < 6; i += 1) {
    rect(ctx, x + 12 + i * 22 + Math.sin(t + i) * 2, y + 16, 14, 3, "rgba(220, 251, 247, 0.56)");
  }
  rect(ctx, x + 10, y - 4, 12, 6, "#6ea24f");
  rect(ctx, x + 14, y - 8, 5, 5, "#f2e37f");
}

function drawLockedHero(ctx, x, y, t) {
  const bob = Math.sin(t * 6) * 1.5;
  rect(ctx, x - 8, y + 18, 20, 5, "rgba(0, 0, 0, 0.25)");
  rect(ctx, x, y + bob, 12, 18, "#326aa0");
  rect(ctx, x + 2, y + 4 + bob, 8, 4, "#4c86bd");
  rect(ctx, x + 2, y - 10 + bob, 8, 10, "#d99a63");
  rect(ctx, x - 1, y - 14 + bob, 14, 5, "#5a3927");
  rect(ctx, x - 5, y + 4 + bob, 5, 13, "#d99a63");
  rect(ctx, x + 12, y + 4 + bob, 5, 13, "#d99a63");
  rect(ctx, x + 1, y + 18 + bob, 4, 10, "#5a473a");
  rect(ctx, x + 8, y + 18 + bob, 4, 10, "#5a473a");
}

function drawLockedDog(ctx, x, y, t) {
  const wag = Math.round(Math.sin(t * 8) * 2);
  rect(ctx, x - 14, y + 10, 28, 5, "rgba(0, 0, 0, 0.22)");
  rect(ctx, x - 10, y - 2, 22, 13, "#a87342");
  rect(ctx, x - 9, y + 10, 4, 6, "#6f472c");
  rect(ctx, x + 6, y + 10, 4, 6, "#6f472c");
  rect(ctx, x - 8, y - 13, 15, 12, "#be8b55");
  rect(ctx, x - 11, y - 11, 5, 9, "#6f472c");
  rect(ctx, x + 5, y - 11, 5, 9, "#6f472c");
  rect(ctx, x - 4, y - 9, 2, 2, "#2a2f38");
  rect(ctx, x + 3, y - 9, 2, 2, "#2a2f38");
  rect(ctx, x - 1, y - 5, 3, 2, "#2a2f38");
  rect(ctx, x - 7, y, 14, 3, "#d75d55");
  rect(ctx, x + 11, y + 1 + wag, 11, 4, "#a87342");
  rect(ctx, x + 20, y - 1 + wag, 5, 4, "#be8b55");
}

function drawLockedFlowerStrip(ctx, x, y, t) {
  for (let i = 0; i < 18; i += 1) {
    const px = x + (i % 6) * 13;
    const py = y + Math.floor(i / 6) * 12 + Math.round(Math.sin(t * 2 + i) * 1);
    rect(ctx, px + 4, py + 4, 2, 8, "#3f7f3f");
    rect(ctx, px + 1, py + 1, 4, 4, i % 2 ? "#f0d66a" : "#f1a5b8");
    rect(ctx, px + 6, py + 1, 4, 4, i % 3 ? "#f4f1df" : "#8cc7ef");
    rect(ctx, px + 5, py + 2, 2, 2, "#f8ef9a");
  }
}

function drawLockedForegroundGrass(ctx, t) {
  for (let x = -5; x < 490; x += 18) {
    const y = 294 + Math.sin(t + x) * 2;
    rect(ctx, x, y, 13, 28, "#3d7c38");
    rect(ctx, x + 5, y - 9, 9, 20, "#4f9141");
    rect(ctx, x + 9, y - 14, 8, 24, "#5aa148");
  }
}

function lockedHeroPosition(t) {
  if (!motion) return { x: 208, y: 171, depthY: 199 };
  const phase = (t * 0.18) % 1;
  const points = [
    { x: 118, y: 152, depthY: 180 },
    { x: 214, y: 164, depthY: 192 },
    { x: 312, y: 188, depthY: 216 },
    { x: 220, y: 236, depthY: 264 },
    { x: 112, y: 214, depthY: 242 }
  ];
  const index = Math.floor(phase * points.length);
  const next = (index + 1) % points.length;
  const local = phase * points.length - index;
  const a = points[index];
  const b = points[next];
  return {
    x: a.x + (b.x - a.x) * local,
    y: a.y + (b.y - a.y) * local,
    depthY: a.depthY + (b.depthY - a.depthY) * local
  };
}

function drawYSortGuide(ctx, hero) {
  rect(ctx, 12, 12, 174, 48, "rgba(18, 27, 21, 0.72)");
  ctx.fillStyle = "#f5efd4";
  ctx.font = "11px sans-serif";
  ctx.fillText("Y-sort 锚点：脚底 / 物件底边", 22, 30);
  ctx.fillStyle = "#d9c37a";
  ctx.fillText(`角色 depthY ${Math.round(hero.depthY)}`, 22, 47);
  rect(ctx, hero.x - 3, hero.depthY - 2, 18, 3, "#f1d56c");
}

function drawViewDemo({ ctx, canvas, view }, time) {
  const t = motion ? time * 0.001 : frozenTime;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.scale(canvas.width / VIEW_WIDTH, canvas.height / VIEW_HEIGHT);
  if (view === "topdown") drawTopdownView(ctx, t);
  if (view === "threequarter") drawThreeQuarterView(ctx, t);
  if (view === "isometric") drawIsometricView(ctx, t);
  if (view === "side") drawSideView(ctx, t);
  if (view === "low25d") drawLow25dView(ctx, t);
  drawViewLabel(ctx, view);
  ctx.restore();
}

function drawSky(ctx, current, settings, t) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 146);
  gradient.addColorStop(0, current.skyTop);
  gradient.addColorStop(1, current.skyBottom);
  rect(ctx, 0, 0, 480, 156, gradient);

  const sunX = scene === "dusk" ? 390 : 82;
  const sunY = scene === "dusk" ? 82 : 50;
  rect(ctx, sunX, sunY, 28, 28, current.sun);
  rect(ctx, sunX + 4, sunY - 4, 20, 4, current.sun);
  rect(ctx, sunX + 4, sunY + 28, 20, 4, current.sun);

  const cloudShift = (t * 8) % 520;
  drawCloud(ctx, 112 - cloudShift * 0.18, 44, settings);
  drawCloud(ctx, 340 - cloudShift * 0.12, 62, settings);
}

function drawMiniSky(ctx, top = "#8fcfdf", bottom = "#cfe8bc") {
  const gradient = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.58, bottom);
  gradient.addColorStop(0.59, "#73ad56");
  gradient.addColorStop(1, "#4f8a3f");
  rect(ctx, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, gradient);
}

function drawViewLabel(ctx, view) {
  const labels = {
    topdown: "layout first",
    threequarter: "recommended",
    isometric: "premium look",
    side: "exploration",
    low25d: "showcase"
  };
  rect(ctx, 8, 8, labels[view].length * 7 + 14, 18, "rgba(19, 29, 22, 0.72)");
  ctx.fillStyle = "#f5efd4";
  ctx.font = "10px sans-serif";
  ctx.fillText(labels[view], 15, 21);
}

function drawTopdownView(ctx, t) {
  rect(ctx, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, "#69aa4f");
  for (let y = 0; y < VIEW_HEIGHT; y += 16) {
    for (let x = 0; x < VIEW_WIDTH; x += 16) {
      rect(ctx, x + 3, y + 4, 5, 2, "#83bf62");
      if ((x + y) % 48 === 0) rect(ctx, x + 10, y + 10, 3, 3, "#f0d66a");
    }
  }

  rect(ctx, 28, 36, 108, 88, "#8f5a38");
  for (let y = 42; y < 118; y += 16) {
    for (let x = 36; x < 130; x += 18) {
      rect(ctx, x, y, 12, 10, "#b97849");
      rect(ctx, x + 4, y - 3, 4, 12, "#3f7f3f");
      rect(ctx, x + 1, y - 2, 10, 4, "#78c25c");
    }
  }

  rect(ctx, 222, 30, 74, 58, "#b74d40");
  rect(ctx, 228, 36, 62, 46, "#dfc683");
  rect(ctx, 246, 50, 16, 18, "#754e35");
  rect(ctx, 272, 48, 12, 12, "#b9e9ef");
  rect(ctx, 216, 100, 98, 26, "#4aa4b7");
  for (let x = 220; x < 308; x += 18) rect(ctx, x, 112, 10, 2, "#d7f5ed");
  drawTopTrees(ctx);
  rect(ctx, 152 + Math.sin(t) * 20, 138, 10, 14, "#326aa0");
  rect(ctx, 154 + Math.sin(t) * 20, 132, 6, 6, "#d99a63");
}

function drawTopTrees(ctx) {
  for (let i = 0; i < 16; i += 1) {
    const x = 12 + i * 22;
    rect(ctx, x, 192 + (i % 2) * 8, 13, 13, "#3d7c38");
    rect(ctx, x + 4, 196 + (i % 2) * 8, 5, 5, "#2f5c30");
  }
}

function drawThreeQuarterView(ctx, t) {
  const p = engineSettings.godot.palette;
  ctx.save();
  ctx.scale(VIEW_WIDTH / LOGICAL_WIDTH, VIEW_HEIGHT / LOGICAL_HEIGHT);
  drawSky(ctx, sceneSettings.day, engineSettings.godot, t);
  drawHills(ctx, engineSettings.godot, sceneSettings.day, t);
  drawField(ctx, engineSettings.godot, sceneSettings.day, t);
  drawFarm(ctx, engineSettings.godot, sceneSettings.day, t);
  drawCharacters(ctx, engineSettings.godot, t);
  drawForeground(ctx, engineSettings.godot, sceneSettings.day, t);
  rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, "rgba(255, 245, 190, 0.04)");
  ctx.restore();
}

function isoToScreen(x, y, z = 0) {
  return [180 + (x - y) * 17, 72 + (x + y) * 9 - z];
}

function drawIsoTile(ctx, x, y, color, edge = "#477a3e") {
  const [sx, sy] = isoToScreen(x, y);
  poly(ctx, [[sx, sy], [sx + 17, sy + 9], [sx, sy + 18], [sx - 17, sy + 9]], color);
  rect(ctx, sx - 2, sy + 7, 4, 2, "rgba(255, 246, 190, 0.14)");
  poly(ctx, [[sx - 17, sy + 9], [sx, sy + 18], [sx, sy + 23], [sx - 17, sy + 14]], edge);
  poly(ctx, [[sx + 17, sy + 9], [sx, sy + 18], [sx, sy + 23], [sx + 17, sy + 14]], "#3f6e38");
}

function drawIsometricView(ctx, t) {
  drawMiniSky(ctx, "#97d2e2", "#d9e8bd");
  poly(ctx, [[24, 64], [74, 39], [124, 66], [124, 95], [24, 95]], "#53784c");
  poly(ctx, [[236, 58], [284, 35], [342, 67], [342, 99], [236, 99]], "#567d4e");
  for (let y = -4; y < 10; y += 1) {
    for (let x = -4; x < 10; x += 1) {
      drawIsoTile(ctx, x, y, (x + y) % 2 ? "#6cad52" : "#77b85a");
    }
  }
  for (let y = 1; y < 6; y += 1) {
    for (let x = -2; x < 3; x += 1) {
      drawIsoTile(ctx, x, y, "#a86a3d", "#704a31");
      const [sx, sy] = isoToScreen(x, y, 8);
      rect(ctx, sx - 10, sy + 7, 20, 3, "rgba(70, 43, 27, 0.26)");
      rect(ctx, sx - 3, sy, 6, 9, "#2f763d");
      rect(ctx, sx - 7, sy - 2, 14, 5, "#7fc65f");
      rect(ctx, sx - 2, sy - 5, 4, 4, "#f1d56c");
    }
  }
  drawIsoFence(ctx, -3, 0, 8);
  drawIsoPond(ctx, 4, 4);
  drawIsoGreenhouse(ctx, 0, -2);
  drawIsoHouse(ctx, 4, -1);
  drawIsoTree(ctx, -4, 5, t);
  drawIsoTree(ctx, 7, 1, t + 1.5);
  const [px, py] = isoToScreen(2 + Math.sin(t) * 0.5, 5, 6);
  rect(ctx, px - 7, py + 11, 14, 4, "rgba(31, 48, 26, 0.32)");
  rect(ctx, px - 4, py, 8, 12, "#326aa0");
  rect(ctx, px - 2, py + 3, 4, 3, "#4c86bd");
  rect(ctx, px - 3, py - 6, 6, 6, "#d99a63");
  rect(ctx, px - 4, py - 9, 8, 3, "#5a3927");
}

function drawIsoHouse(ctx, x, y) {
  const [sx, sy] = isoToScreen(x, y, 4);
  rect(ctx, sx - 34, sy + 42, 70, 8, "rgba(31, 45, 25, 0.34)");
  poly(ctx, [[sx, sy - 43], [sx + 48, sy - 16], [sx, sy + 12], [sx - 48, sy - 16]], "#bd5646");
  poly(ctx, [[sx - 38, sy - 12], [sx, sy + 8], [sx, sy + 51], [sx - 38, sy + 31]], "#d9bf7d");
  poly(ctx, [[sx + 38, sy - 12], [sx, sy + 8], [sx, sy + 51], [sx + 38, sy + 31]], "#caa96f");
  for (let i = 0; i < 5; i += 1) {
    poly(ctx, [[sx - 39 + i * 10, sy - 12 + i * 5], [sx - 28 + i * 10, sy - 7 + i * 5], [sx - 28 + i * 10, sy - 5 + i * 5], [sx - 39 + i * 10, sy - 10 + i * 5]], "rgba(255, 236, 178, 0.2)");
    poly(ctx, [[sx + 39 - i * 10, sy - 12 + i * 5], [sx + 28 - i * 10, sy - 7 + i * 5], [sx + 28 - i * 10, sy - 5 + i * 5], [sx + 39 - i * 10, sy - 10 + i * 5]], "rgba(93, 54, 34, 0.13)");
  }
  for (let i = 0; i < 5; i += 1) {
    poly(ctx, [[sx - 36 + i * 7, sy - 28 + i * 4], [sx - 19 + i * 7, sy - 18 + i * 4], [sx - 18 + i * 7, sy - 16 + i * 4], [sx - 35 + i * 7, sy - 26 + i * 4]], "rgba(255, 196, 139, 0.22)");
  }
  rect(ctx, sx - 10, sy + 18, 13, 27, "#714b33");
  rect(ctx, sx - 6, sy + 30, 2, 2, "#d9bd78");
  rect(ctx, sx + 12, sy + 11, 13, 12, "#aee1e8");
  rect(ctx, sx + 13, sy + 12, 3, 10, "rgba(255, 255, 255, 0.45)");
  rect(ctx, sx + 12, sy + 17, 13, 2, "#6aa4ad");
}

function drawIsoFence(ctx, startX, startY, length) {
  for (let i = 0; i < length; i += 1) {
    const [sx, sy] = isoToScreen(startX + i, startY, 2);
    rect(ctx, sx - 2, sy + 4, 4, 16, "#775035");
    rect(ctx, sx - 10, sy + 9, 20, 3, "#b3844d");
  }
}

function drawIsoPond(ctx, x, y) {
  for (let iy = 0; iy < 2; iy += 1) {
    for (let ix = 0; ix < 3; ix += 1) {
      drawIsoTile(ctx, x + ix, y + iy, "#4aa4b7", "#337b8a");
      const [sx, sy] = isoToScreen(x + ix, y + iy, 5);
      rect(ctx, sx - 5, sy + 9, 10, 2, "rgba(215, 245, 237, 0.68)");
    }
  }
}

function drawIsoGreenhouse(ctx, x, y) {
  const [sx, sy] = isoToScreen(x, y, 4);
  poly(ctx, [[sx - 30, sy], [sx, sy + 16], [sx, sy + 48], [sx - 30, sy + 32]], "rgba(200, 231, 205, 0.78)");
  poly(ctx, [[sx + 30, sy], [sx, sy + 16], [sx, sy + 48], [sx + 30, sy + 32]], "rgba(165, 210, 185, 0.72)");
  poly(ctx, [[sx, sy - 18], [sx + 34, sy], [sx, sy + 18], [sx - 34, sy]], "rgba(235, 248, 224, 0.86)");
  rect(ctx, sx - 18, sy + 18, 6, 22, "#5d9b68");
  rect(ctx, sx + 10, sy + 18, 6, 22, "#5d9b68");
  rect(ctx, sx - 22, sy + 4, 43, 2, "rgba(255, 255, 255, 0.44)");
}

function drawIsoTree(ctx, x, y, t) {
  const [sx, sy] = isoToScreen(x, y, 4);
  rect(ctx, sx - 4, sy + 14, 8, 20, "#66492f");
  const sway = Math.sin(t) * 2;
  poly(ctx, [[sx + sway, sy - 12], [sx - 24 + sway, sy + 18], [sx + 24 + sway, sy + 18]], "#315f36");
  poly(ctx, [[sx + sway, sy + 4], [sx - 20 + sway, sy + 30], [sx + 20 + sway, sy + 30]], "#3f7842");
  rect(ctx, sx - 5 + sway, sy + 7, 10, 3, "rgba(185, 221, 138, 0.26)");
}

function drawSideView(ctx, t) {
  drawMiniSky(ctx, "#86cde4", "#d2ecbd");
  poly(ctx, [[0, 156], [46, 128], [98, 158], [152, 120], [218, 160], [288, 124], [360, 156], [360, 190], [0, 190]], "#587a50");
  rect(ctx, 0, 158, 360, 82, "#67a94e");
  rect(ctx, 34, 166, 122, 20, "#8f5a38");
  for (let x = 42; x < 150; x += 18) {
    rect(ctx, x, 158, 5, 18, "#326f35");
    rect(ctx, x - 4, 153 + Math.sin(t + x) * 1, 13, 7, "#72bd58");
  }
  rect(ctx, 212, 104, 82, 58, "#dfc683");
  rect(ctx, 202, 91, 102, 22, "#b74d40");
  rect(ctx, 232, 127, 16, 35, "#754e35");
  rect(ctx, 268, 122, 15, 14, "#b9e9ef");
  rect(ctx, 230, 162, 118, 23, "#4aa4b7");
  rect(ctx, 172 + Math.sin(t) * 18, 146, 9, 17, "#326aa0");
  rect(ctx, 173 + Math.sin(t) * 18, 138, 7, 8, "#d99a63");
  for (let x = 0; x < 360; x += 18) rect(ctx, x, 210, 11, 30, "#3d7c38");
}

function drawLow25dView(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_HEIGHT);
  sky.addColorStop(0, "#86c6dc");
  sky.addColorStop(0.58, "#d8e8bf");
  sky.addColorStop(1, "#6daa50");
  rect(ctx, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, sky);
  poly(ctx, [[0, 132], [38, 110], [80, 134], [124, 104], [176, 135], [232, 106], [292, 132], [360, 110], [360, 160], [0, 160]], "#557c4d");
  poly(ctx, [[0, 151], [360, 132], [360, 240], [0, 240]], "#68a850");
  poly(ctx, [[0, 174], [360, 145], [360, 240], [0, 240]], "#5e9b49");

  for (let i = 0; i < 11; i += 1) {
    const y = 164 + i * 8;
    const spread = i * 8;
    poly(ctx, [[0, y + 12], [160 - spread, y], [360, y - 17], [360, y - 14], [160 - spread, y + 3], [0, y + 15]], "rgba(91, 75, 48, 0.22)");
  }

  poly(ctx, [[28, 146], [160, 136], [176, 214], [24, 226]], "#8f5a38");
  for (let row = 0; row < 4; row += 1) {
    const baseY = 150 + row * 16;
    for (let col = 0; col < 6; col += 1) {
      const x = 44 + col * 19 + row * 5;
      const y = baseY + col * -1;
      rect(ctx, x, y, 8, 34, "#2f763d");
      rect(ctx, x - 8, y - 6 + Math.sin(t + x) * 1, 24, 11, "#76c15c");
      rect(ctx, x - 2, y - 11, 8, 7, "#f0d66a");
      rect(ctx, x + 2, y - 9, 4, 3, "#fff0a7");
    }
  }

  rect(ctx, 198, 92, 108, 76, "#dfc683");
  for (let y = 101; y < 160; y += 10) {
    rect(ctx, 202, y, 100, 2, "rgba(255, 238, 178, 0.26)");
    rect(ctx, 202, y + 6, 100, 1, "rgba(102, 67, 40, 0.14)");
  }
  rect(ctx, 188, 70, 128, 30, "#b74d40");
  rect(ctx, 204, 56, 92, 22, "#c45b48");
  for (let y = 76; y < 98; y += 7) {
    rect(ctx, 194, y, 115, 2, "rgba(91, 43, 34, 0.24)");
    for (let x = 204; x < 304; x += 14) rect(ctx, x, y - 2, 2, 4, "rgba(255, 197, 139, 0.2)");
  }
  rect(ctx, 222, 120, 24, 48, "#754e35");
  rect(ctx, 227, 124, 6, 37, "rgba(255, 226, 156, 0.16)");
  rect(ctx, 240, 143, 3, 3, "#d9bd78");
  rect(ctx, 268, 112, 22, 20, "#b9e9ef");
  rect(ctx, 271, 115, 4, 16, "rgba(255, 255, 255, 0.45)");
  rect(ctx, 268, 122, 22, 2, "#6aa4ad");

  rect(ctx, 310, 126, 36, 43, "#dca954");
  rect(ctx, 304, 115, 48, 15, "#7b4d2d");
  rect(ctx, 319, 144, 16, 25, "#5f412c");
  rect(ctx, 214, 168, 128, 36, "#4aa4b7");
  rect(ctx, 214, 167, 128, 5, "#8ad3d7");
  for (let x = 224; x < 330; x += 26) rect(ctx, x, 184, 15, 3, "rgba(220, 251, 247, 0.55)");

  const px = 172 + Math.sin(t) * 16;
  rect(ctx, px - 8, 176, 22, 5, "rgba(31, 48, 26, 0.34)");
  rect(ctx, px, 150, 13, 26, "#326aa0");
  rect(ctx, px + 3, 155, 8, 4, "#4c86bd");
  rect(ctx, px + 2, 138, 9, 12, "#d99a63");
  rect(ctx, px, 134, 13, 4, "#5a3927");

  for (let x = -6; x < 370; x += 18) {
    const h = 34 + (x % 36 === 0 ? 10 : 0);
    rect(ctx, x, 212 - h * 0.2, 12, h, "#3d7c38");
    rect(ctx, x + 4, 202 - h * 0.2, 10, h * 0.7, "#4f9141");
  }
  rect(ctx, 0, 218, 360, 22, "rgba(35, 67, 32, 0.34)");
}

function drawCloud(ctx, x, y, settings) {
  const color = settings.bloom ? "rgba(255, 252, 225, 0.86)" : "rgba(246, 247, 220, 0.72)";
  rect(ctx, x, y + 8, 48, 12, color);
  rect(ctx, x + 10, y, 20, 12, color);
  rect(ctx, x + 28, y + 4, 28, 12, color);
}

function drawHills(ctx, settings, current, t) {
  poly(ctx, [[0, 140], [74, 118], [138, 135], [206, 104], [294, 136], [372, 112], [480, 138], [480, 170], [0, 170]], "#587a50");
  poly(ctx, [[0, 154], [54, 134], [132, 146], [224, 122], [322, 150], [404, 130], [480, 150], [480, 176], [0, 176]], "#41643f");
  for (let x = -32; x < 520; x += 54) {
    drawPine(ctx, x, 122 + Math.sin(t + x) * 2, 0.72, "#456e46", "#314f34");
    drawPine(ctx, x + 24, 106 + Math.cos(t + x) * 2, 0.88, "#3f6642", "#2e4c31");
  }
  rect(ctx, 0, 154, 480, 18, current.haze);
}

function drawPine(ctx, x, y, scale, leaf, dark) {
  const s = scale;
  rect(ctx, x + 17 * s, y + 32 * s, 6 * s, 24 * s, "#654b31");
  poly(ctx, [[x + 20 * s, y], [x, y + 30 * s], [x + 40 * s, y + 30 * s]], leaf);
  poly(ctx, [[x + 20 * s, y + 12 * s], [x - 4 * s, y + 44 * s], [x + 44 * s, y + 44 * s]], dark);
  rect(ctx, x + 15 * s, y + 23 * s, 10 * s, 4 * s, "rgba(180, 215, 139, 0.22)");
}

function drawField(ctx, settings, current, t) {
  const p = settings.palette;
  rect(ctx, 0, 158, 480, 162, p.grass);

  for (let y = 162; y < 318; y += 10) {
    for (let x = (y / 10) % 2 ? 0 : 8; x < 480; x += 22) {
      const color = (x + y) % 44 === 0 ? "#9bce68" : p.grass2;
      rect(ctx, x, y, 6, 2, color);
      if ((x + y) % 66 === 0) {
        rect(ctx, x + 8, y + 5, 3, 3, "#f0d66a");
        rect(ctx, x + 12, y + 4, 3, 3, "#f1a5b8");
      }
    }
  }

  drawPebblePath(ctx, p);
  drawFlowerPatch(ctx, 22, 250, t);

  rect(ctx, 42, 188, 184, 88, "#7e5234");
  for (let y = 190; y < 274; y += 16) {
    rect(ctx, 45, y, 178, 3, p.dirt2);
  }
  for (let y = 196; y < 268; y += 24) {
    for (let x = 50; x < 216; x += 24) {
      rect(ctx, x, y, 18, 14, p.dirt);
      rect(ctx, x + 2, y + 2, 14, 2, "rgba(246, 201, 125, 0.22)");
      drawCrop(ctx, x + 3, y - 5, p, t + x * 0.02 + y * 0.01);
    }
  }

  rect(ctx, 286, 214, 146, 30, p.water);
  rect(ctx, 286, 210, 146, 5, "#8ad3d7");
  rect(ctx, 286, 241, 146, 4, "rgba(24, 74, 86, 0.28)");
  for (let x = 292; x < 426; x += 28) {
    rect(ctx, x + Math.sin(t + x) * 2, 226, 14, 3, "rgba(220, 251, 247, 0.55)");
  }
  rect(ctx, 296, 209, 12, 6, "#6ea24f");
  rect(ctx, 300, 205, 6, 6, "#f2e37f");
  rect(ctx, 410, 214, 10, 4, "#6ea24f");

  drawFence(ctx, 26, 178, 220, p);
  drawFence(ctx, 270, 198, 178, p);
}

function drawPebblePath(ctx, p) {
  for (let i = 0; i < 34; i += 1) {
    const x = 236 + i * 8;
    const y = 256 + Math.sin(i * 0.7) * 10;
    rect(ctx, x, y, 7, 4, i % 3 === 0 ? "#d2b47c" : "#b99b68");
  }
  for (let i = 0; i < 12; i += 1) {
    rect(ctx, 228 + i * 12, 274 + (i % 2) * 4, 8, 3, "rgba(103, 77, 48, 0.34)");
  }
}

function drawFlowerPatch(ctx, x, y, t) {
  const colors = ["#f1a5b8", "#f0d66a", "#8cc7ef", "#f4f1df"];
  for (let i = 0; i < 18; i += 1) {
    const px = x + (i % 6) * 13;
    const py = y + Math.floor(i / 6) * 12 + Math.round(Math.sin(t * 2 + i) * 1);
    rect(ctx, px + 4, py + 4, 2, 8, "#3f7f3f");
    rect(ctx, px + 1, py + 1, 4, 4, colors[i % colors.length]);
    rect(ctx, px + 6, py + 1, 4, 4, colors[(i + 1) % colors.length]);
    rect(ctx, px + 4, py - 1, 4, 4, colors[(i + 2) % colors.length]);
    rect(ctx, px + 5, py + 2, 2, 2, "#f8ef9a");
  }
}

function drawCrop(ctx, x, y, p, t) {
  const sway = motion ? Math.round(Math.sin(t * 2) * 1) : 0;
  rect(ctx, x + 3, y + 18, 14, 3, "rgba(31, 52, 24, 0.22)");
  rect(ctx, x + 6 + sway, y + 6, 5, 15, "#2f763d");
  rect(ctx, x + 1 + sway, y + 5, 10, 7, "#58a54a");
  rect(ctx, x + 9 + sway, y + 2, 9, 8, "#71bd59");
  rect(ctx, x + 3 + sway, y + 10, 7, 5, "#7fc65f");
  rect(ctx, x + 12 + sway, y + 9, 5, 5, "#4f9b47");
  rect(ctx, x + 6 + sway, y, 5, 5, "#f0d66a");
  rect(ctx, x + 8 + sway, y + 1, 3, 3, "#fff0a7");
}

function drawFence(ctx, x, y, w, p) {
  for (let i = 0; i < w; i += 24) {
    rect(ctx, x + i, y, 6, 24, p.trim);
    rect(ctx, x + i + 1, y + 2, 2, 18, "rgba(255, 222, 151, 0.16)");
  }
  rect(ctx, x, y + 6, w, 5, "#9c7448");
  rect(ctx, x, y + 16, w, 5, "#9c7448");
  rect(ctx, x, y + 10, w, 2, "rgba(58, 39, 24, 0.24)");
}

function drawFarm(ctx, settings, current, t) {
  const p = settings.palette;
  if (settings.outline) {
    rect(ctx, 256, 104, 120, 88, "#4c3429");
    rect(ctx, 270, 82, 92, 42, "#4c3429");
  }
  rect(ctx, 246, 194, 132, 15, p.shadow);
  rect(ctx, 262, 110, 108, 78, p.wall);
  for (let y = 118; y < 184; y += 12) {
    rect(ctx, 266, y, 100, 2, "rgba(255, 239, 183, 0.22)");
    rect(ctx, 266, y + 8, 100, 1, "rgba(111, 76, 43, 0.14)");
  }
  rect(ctx, 262, 110, 5, 78, "rgba(255, 242, 178, 0.28)");
  rect(ctx, 365, 110, 5, 78, "rgba(84, 53, 33, 0.18)");
  rect(ctx, 252, 102, 128, 24, p.roof);
  rect(ctx, 272, 84, 88, 32, p.roof);
  drawRoofTiles(ctx, 252, 102, 128, 24);
  drawRoofTiles(ctx, 272, 84, 88, 32);
  rect(ctx, 286, 136, 24, 52, p.trim);
  rect(ctx, 290, 140, 6, 42, "rgba(255, 226, 156, 0.16)");
  rect(ctx, 305, 160, 3, 3, "#d6b16e");
  rect(ctx, 326, 132, 22, 20, "#7eb4c1");
  rect(ctx, 330, 136, 14, 12, "#d7f1ee");
  rect(ctx, 329, 132, 3, 20, "rgba(255, 255, 255, 0.45)");
  rect(ctx, 326, 141, 22, 2, "rgba(61, 100, 106, 0.4)");
  rect(ctx, 240, 190, 170, 13, "#92714c");
  rect(ctx, 248, 188, 150, 4, "#b69058");

  rect(ctx, 380, 188, 60, 8, p.shadow);
  rect(ctx, 384, 152, 44, 36, "#dca954");
  rect(ctx, 388, 156, 36, 4, "rgba(255, 230, 156, 0.24)");
  rect(ctx, 378, 144, 56, 16, "#7b4d2d");
  rect(ctx, 382, 145, 50, 3, "#9b673d");
  rect(ctx, 394, 166, 22, 22, "#5f412c");
  rect(ctx, 398, 170, 14, 4, "rgba(255, 220, 132, 0.12)");

  rect(ctx, 138, 124, 54, 50, "rgba(189, 218, 192, 0.72)");
  rect(ctx, 132, 116, 66, 14, "#e8f2dc");
  rect(ctx, 136, 119, 58, 4, "rgba(255, 255, 255, 0.42)");
  rect(ctx, 145, 136, 10, 30, "#4b8f57");
  rect(ctx, 166, 136, 10, 30, "#4b8f57");
  rect(ctx, 149, 138, 3, 24, "rgba(196, 236, 202, 0.36)");
  rect(ctx, 170, 138, 3, 24, "rgba(196, 236, 202, 0.36)");
  drawTinySign(ctx, 126, 178, "种");

  rect(ctx, 250, 188, 118, 18, p.shadow);
  rect(ctx, 382, 188, 54, 12, p.shadow);
}

function drawRoofTiles(ctx, x, y, w, h) {
  for (let row = y + 5; row < y + h; row += 7) {
    rect(ctx, x + 4, row, w - 8, 2, "rgba(91, 43, 34, 0.26)");
    for (let col = x + 8 + (row % 2) * 5; col < x + w - 8; col += 14) {
      rect(ctx, col, row - 3, 2, 5, "rgba(255, 197, 139, 0.18)");
    }
  }
  rect(ctx, x + 8, y + 4, w - 18, 3, "rgba(255, 205, 150, 0.28)");
}

function drawTinySign(ctx, x, y, glyph) {
  rect(ctx, x + 10, y + 17, 4, 18, "#6c4b31");
  rect(ctx, x, y, 26, 18, "#c89954");
  rect(ctx, x + 3, y + 3, 20, 12, "#f0d28a");
  ctx.fillStyle = "#5f3f28";
  ctx.font = "10px sans-serif";
  ctx.fillText(glyph, x + 8, y + 13);
}

function drawCharacters(ctx, settings, t) {
  const p = settings.palette;
  const bob = motion ? Math.round(Math.sin(t * 5) * 2) : 0;
  const x = 234 + (motion ? Math.round(Math.sin(t * 0.7) * 16) : 0);
  const y = 238 + bob;
  rect(ctx, x - 7, y + 17, 18, 5, p.shadow);
  rect(ctx, x + 17, y + 8, 3, 18, "#7f5b35");
  rect(ctx, x + 16, y + 5, 8, 4, "#c8c0a8");
  rect(ctx, x, y, 12, 16, "#326aa0");
  rect(ctx, x + 2, y + 3, 8, 3, "#4d86bd");
  rect(ctx, x + 2, y - 10, 8, 10, "#d99a63");
  rect(ctx, x - 1, y - 14, 14, 5, "#5a3927");
  rect(ctx, x + 3, y - 7, 2, 2, "#2f261f");
  rect(ctx, x + 8, y - 7, 2, 2, "#2f261f");
  rect(ctx, x - 7, y + 4, 6, 12, "#d99a63");
  rect(ctx, x + 12, y + 4, 6, 12, "#d99a63");
  rect(ctx, x + 1, y + 16, 4, 10, "#5a473a");
  rect(ctx, x + 8, y + 16, 4, 10, "#5a473a");

  rect(ctx, 102, 286, 20, 6, p.shadow);
  rect(ctx, 108, 270, 16, 12, "#d9a05f");
  rect(ctx, 120, 272, 8, 6, "#c98246");
  rect(ctx, 100, 266, 12, 12, "#f4e6a7");
  rect(ctx, 102, 268, 2, 2, "#6c4a2e");
  rect(ctx, 104, 278, 8, 8, "#5f8f47");
  rect(ctx, 112, 282, 5, 6, "#e9c784");
}

function drawForeground(ctx, settings, current, t) {
  const p = settings.palette;
  for (let x = 0; x < 480; x += 28) {
    const y = 298 + Math.sin(t + x) * 2;
    rect(ctx, x, y, 20, 22, "#3d7c38");
    rect(ctx, x + 5, y - 10, 12, 14, "#4f9141");
    rect(ctx, x + 11, y - 18, 10, 18, "#5aa148");
    rect(ctx, x + 6, y - 6, 5, 8, "rgba(158, 210, 112, 0.24)");
  }
  rect(ctx, 0, 302, 480, 18, "rgba(25, 44, 24, 0.18)");
  drawAmbientParticles(ctx, current, t);

  if (current.rain) {
    for (let i = 0; i < 70; i += 1) {
      const x = (i * 37 + t * 120) % 520 - 24;
      const y = (i * 19 + t * 170) % 340 - 20;
      rect(ctx, x, y, 2, 12, "rgba(210, 235, 244, 0.54)");
    }
  }
}

function drawAmbientParticles(ctx, current, t) {
  if (current.rain) {
    return;
  }
  const color = scene === "dusk" ? "rgba(255, 223, 133, 0.42)" : "rgba(246, 236, 174, 0.34)";
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 47 + Math.sin(t * 0.7 + i) * 18) % 480;
    const y = 72 + ((i * 29 + t * 10) % 210);
    rect(ctx, x, y, 2, 2, color);
  }
}

function drawEngineFinish(ctx, engine, settings, current, t, canvas) {
  if (current.tint) {
    rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, current.tint);
  }

  if (engine === "unity") {
    const glow = ctx.createRadialGradient(335, scene === "dusk" ? 120 : 84, 8, 335, 120, 172);
    glow.addColorStop(0, "rgba(255, 218, 120, 0.32)");
    glow.addColorStop(1, "rgba(255, 218, 120, 0)");
    rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, glow);
    rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, "rgba(255, 244, 211, 0.06)");
    for (let i = 0; i < 24; i += 1) {
      const x = 260 + Math.cos(i * 0.9 + t * 0.2) * 120;
      const y = 112 + Math.sin(i * 0.7) * 46;
      rect(ctx, x, y, 3, 3, "rgba(255, 231, 151, 0.18)");
    }
  }

  if (engine === "gamemaker") {
    posterize(ctx, canvas);
  }

  if (engine === "monogame") {
    rect(ctx, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT, "rgba(23, 32, 29, 0.12)");
    for (let y = 0; y < LOGICAL_HEIGHT; y += 4) {
      rect(ctx, 0, y, LOGICAL_WIDTH, 1, "rgba(0, 0, 0, 0.12)");
    }
    for (let i = 0; i < 110; i += 1) {
      const x = (i * 41 + Math.floor(t * 13)) % LOGICAL_WIDTH;
      const y = (i * 67 + Math.floor(t * 9)) % LOGICAL_HEIGHT;
      rect(ctx, x, y, 1, 1, "rgba(255, 247, 210, 0.18)");
    }
  }
}

function posterize(ctx, canvas) {
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / 24) * 24;
    data[i + 1] = Math.round(data[i + 1] / 24) * 24;
    data[i + 2] = Math.round(data[i + 2] / 24) * 24;
  }
  ctx.putImageData(image, 0, 0);
}

function loop(time) {
  drawAll(time);
  requestAnimationFrame(loop);
}

drawAll(performance.now());
requestAnimationFrame(loop);
