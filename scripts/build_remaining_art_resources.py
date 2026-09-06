#!/usr/bin/env python3
"""Build remaining directly readable P1/P2 art resources."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

from build_p0_art_resources import P, canvas, checker, contact_sheet, draw_roof, draw_shadow, line, rect


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs" / "run_023_remaining_art_resources"
PROCESSED_DIR = RUN_DIR / "processed"
ASSET_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game"
BUILDABLES_DIR = ASSET_DIR / "buildables"
OBJECTS_DIR = ASSET_DIR / "objects"
FISH_DIR = ASSET_DIR / "fish"
UI_DIR = ASSET_DIR / "ui"
TOOLS_DIR = ASSET_DIR / "tools"
TILES_DIR = ASSET_DIR / "tiles"

BUILDABLES = {
    "processor": (32, 48),
    "dryer": (64, 48),
    "flowerBox": (32, 32),
    "gardenLamp": (32, 48),
    "bench": (64, 32),
    "fence": (32, 32),
}
STORY_OBJECTS = {
    "springFairStall": {"size": (96, 80), "states": ["locked", "active", "completed"]},
    "springSampleCrate": {"size": (64, 48), "states": ["locked", "active", "ready", "completed"]},
    "landShrine": {"size": (64, 64), "states": ["active", "ready", "completed"]},
    "shop": {"size": (64, 64), "states": ["locked", "repaired"]},
    "cooperativeDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "tourismDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "brandDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "irrigationPump": {"size": (32, 48), "states": ["locked", "repaired", "completed"]},
}
FISH = {
    "waterweed": "#5f9460",
    "crucian": "#d8c17a",
    "snail": "#8a7a66",
    "riverShrimp": "#f0a078",
    "carp": "#e7b34d",
    "loach": "#9b7b54",
    "grassFish": "#70b77e",
    "mountainTrout": "#75b9d8",
    "springRelicFish": "#d8c17a",
}
UI_ICONS = ["gold", "energy", "weather", "quest", "inventory", "calendar", "map", "build", "journal"]
TOOLS = ["hand", "hoe", "seeds", "wateringCan", "scythe", "fishingRod"]
SUPPORT_OBJECTS = [
    "sign",
    "directionSign",
    "chest",
    "mailbox",
    "warp",
    "kitchen",
    "bed",
    "well",
    "upgradeBoard",
    "marketStall",
    "basketPoint",
    "tastingTable",
    "ecommerceDesk",
]
SUPPORT_RUINS = ["processing", "construction", "villageMarket", "cooperative", "tourism", "brand", "irrigation"]
SUPPORT_RUIN_STATES = ["ruin", "repairing"]
SUPPORT_TILES = ["door", "fence", "cropPlot"]


def rgba(hex_color: str) -> tuple[int, int, int, int]:
    text = hex_color.lstrip("#")
    return (int(text[0:2], 16), int(text[2:4], 16), int(text[4:6], 16), 255)


def save(image: Image.Image, directory: Path, filename: str) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    image.save(directory / filename)
    image.save(PROCESSED_DIR / filename)


def draw_buildable(item_id: str, size: tuple[int, int]) -> Image.Image:
    image = canvas(size)
    draw = ImageDraw.Draw(image)
    w, h = size
    draw_shadow(draw, w // 2, h - 5, max(8, w // 3), 3)
    if item_id == "processor":
        rect(draw, (8, 17, 24, 41), P["wood"], outline=True)
        rect(draw, (10, 12, 22, 19), P["wood_light"], outline=True)
        rect(draw, (20, 20, 25, 28), P["metal"], outline=True)
        rect(draw, (12, 31, 20, 37), P["soil_dark"], outline=True)
    elif item_id == "dryer":
        rect(draw, (6, 19, 58, 38), P["wood_light"], outline=True)
        for x in range(11, 55, 9):
            line(draw, [(x, 18), (x - 4, 38)], P["wood_dark"], width=2)
        for x in (17, 31, 45):
            rect(draw, (x - 5, 22, x + 5, 27), P["gold"], outline=True)
    elif item_id == "flowerBox":
        rect(draw, (5, 19, 27, 27), P["wood"], outline=True)
        for x, color in [(10, P["red"]), (16, P["gold"]), (22, P["blue"])]:
            rect(draw, (x - 2, 13, x + 2, 17), color, outline=True)
            line(draw, [(x, 18), (x, 23)], P["leaf_dark"], width=1)
    elif item_id == "gardenLamp":
        rect(draw, (14, 20, 18, 41), P["metal_dark"], outline=True)
        rect(draw, (9, 12, 23, 21), P["gold"], outline=True)
        rect(draw, (12, 15, 20, 19), (248, 224, 130, 255))
    elif item_id == "bench":
        rect(draw, (7, 11, 57, 18), P["wood_light"], outline=True)
        rect(draw, (9, 20, 55, 25), P["wood"], outline=True)
        rect(draw, (13, 18, 17, 29), P["wood_dark"])
        rect(draw, (47, 18, 51, 29), P["wood_dark"])
    elif item_id == "fence":
        for x in (7, 16, 25):
            rect(draw, (x, 9, x + 4, 27), P["wood"], outline=True)
        rect(draw, (4, 14, 29, 17), P["wood_light"], outline=True)
        rect(draw, (4, 22, 29, 25), P["wood_light"], outline=True)
    return image


def draw_stall(draw: ImageDraw.ImageDraw, w: int, h: int, state: str) -> None:
    active = state != "locked"
    completed = state == "completed"
    draw_shadow(draw, w // 2, h - 10, 34, 5)
    rect(draw, (18, 39, 78, 66), P["wood"], outline=True)
    awning = P["gold"] if active else P["stone"]
    rect(draw, (13, 24, 83, 36), awning, outline=True)
    for x in range(18, 82, 16):
        rect(draw, (x, 24, x + 7, 36), P["red"] if active else P["stone_dark"])
    if active:
        rect(draw, (25, 50, 36, 59), P["leaf_light"], outline=True)
        rect(draw, (48, 48, 60, 59), P["red"], outline=True)
    if completed:
        rect(draw, (63, 45, 74, 58), P["green"], outline=True)


def draw_crate(draw: ImageDraw.ImageDraw, w: int, h: int, state: str) -> None:
    draw_shadow(draw, w // 2, h - 6, 22, 4)
    color = P["wood"] if state != "locked" else P["stone"]
    rect(draw, (11, 20, 53, 38), color, outline=True)
    rect(draw, (9, 15, 55, 22), P["wood_light"] if state != "locked" else P["stone_dark"], outline=True)
    if state in {"active", "ready", "completed"}:
        rect(draw, (18, 25, 25, 32), P["leaf_light"], outline=True)
        rect(draw, (31, 24, 38, 32), P["red"], outline=True)
    if state == "ready":
        rect(draw, (42, 21, 50, 29), P["gold"], outline=True)
    if state == "completed":
        rect(draw, (42, 23, 50, 32), P["green"], outline=True)


def draw_shrine(draw: ImageDraw.ImageDraw, w: int, h: int, state: str) -> None:
    draw_shadow(draw, w // 2, h - 8, 22, 4)
    rect(draw, (16, 28, 48, 55), P["stone"], outline=True)
    draw.polygon([(10, 28), (32, 13), (54, 28)], fill=P["red"] if state != "active" else P["wood"], outline=P["outline"])
    rect(draw, (26, 36, 38, 54), P["gold"], outline=True)
    if state == "ready":
        draw.ellipse((24, 18, 40, 34), fill=P["cream"], outline=P["outline"])
    if state == "completed":
        draw.ellipse((20, 15, 44, 39), fill=(216, 193, 122, 150), outline=P["gold"])
        rect(draw, (14, 51, 50, 56), P["green"], outline=True)


def draw_shop(draw: ImageDraw.ImageDraw, w: int, h: int, state: str) -> None:
    draw_shadow(draw, w // 2, h - 8, 24, 4)
    repaired = state == "repaired"
    rect(draw, (12, 27, 52, 56), P["wood"] if repaired else P["stone_dark"], outline=True)
    draw_roof(draw, 8, 18, 48, P["green"] if repaired else P["stone"], damaged=not repaired)
    rect(draw, (26, 39, 38, 56), P["wood_dark"], outline=True)
    if repaired:
        rect(draw, (14, 44, 24, 52), P["leaf_light"], outline=True)
        rect(draw, (42, 42, 52, 51), P["gold"], outline=True)


def draw_desk(draw: ImageDraw.ImageDraw, w: int, h: int, state: str, accent: tuple[int, int, int, int]) -> None:
    draw_shadow(draw, w // 2, h - 5, 22, 4)
    locked = state == "locked"
    completed = state == "completed"
    rect(draw, (8, 22, 56, 39), P["wood"] if not locked else P["stone_dark"], outline=True)
    rect(draw, (10, 15, 54, 24), P["wood_light"] if not locked else P["stone"], outline=True)
    if not locked:
        rect(draw, (16, 16, 25, 22), accent, outline=True)
        rect(draw, (37, 17, 49, 22), P["paper"], outline=True)
    if completed:
        rect(draw, (26, 12, 36, 20), P["green"], outline=True)


def draw_pump(draw: ImageDraw.ImageDraw, w: int, h: int, state: str) -> None:
    draw_shadow(draw, w // 2, h - 5, 11, 3)
    locked = state == "locked"
    rect(draw, (10, 18, 22, 41), P["metal_dark"] if locked else P["metal"], outline=True)
    line(draw, [(16, 17), (24, 11), (27, 17)], P["metal_dark"], width=2, outline=True)
    if state == "completed":
        rect(draw, (7, 39, 25, 43), P["water"], outline=True)
    elif state == "repaired":
        rect(draw, (10, 39, 22, 41), P["water_dark"], outline=True)


def draw_story_object(object_id: str, state: str, size: tuple[int, int]) -> Image.Image:
    image = canvas(size)
    draw = ImageDraw.Draw(image)
    w, h = size
    if object_id == "springFairStall":
        draw_stall(draw, w, h, state)
    elif object_id == "springSampleCrate":
        draw_crate(draw, w, h, state)
    elif object_id == "landShrine":
        draw_shrine(draw, w, h, state)
    elif object_id == "shop":
        draw_shop(draw, w, h, state)
    elif object_id == "cooperativeDesk":
        draw_desk(draw, w, h, state, P["green"])
    elif object_id == "tourismDesk":
        draw_desk(draw, w, h, state, P["blue"])
    elif object_id == "brandDesk":
        draw_desk(draw, w, h, state, P["gold"])
    elif object_id == "irrigationPump":
        draw_pump(draw, w, h, state)
    return image


def draw_fish(fish_id: str, color: tuple[int, int, int, int]) -> Image.Image:
    image = canvas((32, 32))
    draw = ImageDraw.Draw(image)
    if fish_id == "waterweed":
        for x in (10, 15, 20):
            line(draw, [(x, 24), (x - 2, 14), (x + 1, 8)], color, width=2)
            rect(draw, (x - 4, 13, x + 3, 16), P["leaf_light"], outline=True)
        return image
    if fish_id == "snail":
        draw.ellipse((9, 12, 23, 25), fill=color, outline=P["outline"])
        draw.arc((11, 14, 21, 23), 20, 330, fill=P["cream"], width=2)
        rect(draw, (20, 20, 27, 24), P["stone"], outline=True)
        return image
    if fish_id == "riverShrimp":
        draw.arc((7, 10, 25, 27), 10, 300, fill=color, width=4)
        for x in (14, 18, 22):
            line(draw, [(x, 21), (x + 3, 26)], P["red"], width=1)
        rect(draw, (22, 13, 25, 16), P["cream"], outline=True)
        return image
    draw.ellipse((7, 11, 25, 22), fill=color, outline=P["outline"])
    draw.polygon([(6, 16), (2, 11), (2, 22)], fill=color, outline=P["outline"])
    draw.polygon([(23, 16), (30, 10), (29, 22)], fill=color, outline=P["outline"])
    rect(draw, (22, 14, 24, 16), P["outline"])
    if fish_id in {"carp", "springRelicFish"}:
        rect(draw, (11, 9, 17, 12), P["red"], outline=True)
    if fish_id in {"mountainTrout", "grassFish"}:
        rect(draw, (10, 18, 21, 19), P["cream"])
    return image


def draw_ui_icon(icon_id: str) -> Image.Image:
    image = canvas((24, 24))
    draw = ImageDraw.Draw(image)
    if icon_id == "gold":
        draw.ellipse((5, 5, 19, 19), fill=P["gold"], outline=P["outline"])
        rect(draw, (10, 8, 14, 16), (246, 218, 110, 255))
    elif icon_id == "energy":
        draw.polygon([(12, 3), (18, 12), (13, 12), (15, 21), (6, 10), (11, 10)], fill=P["green"], outline=P["outline"])
    elif icon_id == "weather":
        draw.ellipse((5, 5, 14, 14), fill=P["gold"], outline=P["outline"])
        rect(draw, (9, 13, 20, 17), P["blue"], outline=True)
    elif icon_id == "quest":
        rect(draw, (6, 4, 18, 20), P["paper"], outline=True)
        rect(draw, (9, 8, 15, 10), P["gold"])
        rect(draw, (9, 13, 16, 15), P["green"])
    elif icon_id == "inventory":
        rect(draw, (5, 7, 19, 19), P["wood"], outline=True)
        rect(draw, (8, 4, 16, 9), P["wood_light"], outline=True)
    elif icon_id == "calendar":
        rect(draw, (5, 5, 19, 20), P["paper"], outline=True)
        rect(draw, (5, 5, 19, 9), P["red"])
        for x in (8, 12, 16):
            rect(draw, (x, 12, x + 1, 13), P["stone_dark"])
    elif icon_id == "map":
        draw.polygon([(4, 6), (10, 4), (16, 7), (20, 5), (20, 18), (14, 20), (8, 17), (4, 19)], fill=P["paper"], outline=P["outline"])
        line(draw, [(9, 5), (8, 17)], P["green"], width=1)
        line(draw, [(15, 7), (14, 19)], P["blue"], width=1)
    elif icon_id == "build":
        rect(draw, (5, 12, 19, 20), P["wood"], outline=True)
        draw.polygon([(4, 12), (12, 5), (20, 12)], fill=P["red"], outline=P["outline"])
    elif icon_id == "journal":
        rect(draw, (6, 4, 18, 20), P["paper"], outline=True)
        rect(draw, (8, 7, 16, 8), P["green"])
        rect(draw, (8, 11, 15, 12), P["wood"])
        rect(draw, (8, 15, 16, 16), P["blue"])
    return image


def draw_tool_icon(tool_id: str) -> Image.Image:
    image = canvas((32, 32))
    draw = ImageDraw.Draw(image)
    if tool_id == "hand":
        rect(draw, (12, 10, 19, 23), (209, 137, 91, 255), outline=True)
        for x in (9, 13, 17, 21):
            rect(draw, (x, 8, x + 3, 17), (222, 156, 116, 255), outline=True)
    elif tool_id == "hoe":
        line(draw, [(10, 25), (22, 7)], P["wood"], width=3, outline=True)
        rect(draw, (20, 6, 29, 10), P["metal"], outline=True)
    elif tool_id == "seeds":
        rect(draw, (9, 9, 23, 24), P["paper"], outline=True)
        rect(draw, (10, 9, 22, 14), P["green"])
        for x, y in [(13, 18), (17, 20), (20, 17)]:
            rect(draw, (x, y, x + 2, y + 2), P["soil_dark"])
    elif tool_id == "wateringCan":
        rect(draw, (8, 13, 22, 23), P["metal"], outline=True)
        rect(draw, (11, 9, 18, 13), P["metal_dark"], outline=True)
        rect(draw, (22, 15, 29, 18), P["metal_dark"], outline=True)
        rect(draw, (25, 21, 27, 25), P["water"])
    elif tool_id == "scythe":
        line(draw, [(10, 25), (22, 7)], P["wood"], width=3, outline=True)
        draw.arc((15, 3, 31, 17), 160, 330, fill=P["metal"], width=3)
    elif tool_id == "fishingRod":
        line(draw, [(9, 25), (24, 5)], P["wood"], width=2, outline=True)
        line(draw, [(24, 5), (26, 23)], P["metal"], width=1)
        rect(draw, (24, 23, 27, 26), P["water"], outline=True)
    return image


def draw_support_object(object_id: str) -> Image.Image:
    image = canvas((32, 32))
    draw = ImageDraw.Draw(image)
    draw_shadow(draw, 16, 28, 11, 3)
    if object_id == "sign":
        rect(draw, (14, 14, 17, 27), P["wood_dark"], outline=True)
        rect(draw, (6, 8, 26, 17), P["wood_light"], outline=True)
        line(draw, [(9, 12), (23, 12)], P["wood_dark"], width=1)
    elif object_id == "directionSign":
        rect(draw, (15, 9, 18, 28), P["wood_dark"], outline=True)
        draw.polygon([(5, 8), (22, 8), (27, 12), (22, 16), (5, 16)], fill=P["wood_light"], outline=P["outline"])
        draw.polygon([(27, 17), (10, 17), (5, 21), (10, 25), (27, 25)], fill=P["wood"], outline=P["outline"])
    elif object_id == "chest":
        rect(draw, (6, 13, 26, 25), P["wood"], outline=True)
        rect(draw, (8, 9, 24, 14), P["wood_light"], outline=True)
        rect(draw, (14, 15, 18, 19), P["gold"], outline=True)
    elif object_id == "mailbox":
        rect(draw, (14, 17, 17, 28), P["wood_dark"], outline=True)
        rect(draw, (8, 9, 25, 17), P["metal"], outline=True)
        rect(draw, (21, 7, 25, 12), P["red"], outline=True)
    elif object_id == "warp":
        draw.ellipse((6, 16, 26, 28), fill=P["water_dark"], outline=P["outline"])
        draw.ellipse((10, 18, 22, 25), fill=(117, 185, 216, 190))
        rect(draw, (13, 8, 19, 17), P["blue"], outline=True)
    elif object_id == "kitchen":
        rect(draw, (5, 14, 27, 25), P["stone"], outline=True)
        rect(draw, (8, 9, 18, 15), P["red"], outline=True)
        rect(draw, (20, 11, 25, 15), P["metal"], outline=True)
    elif object_id == "bed":
        rect(draw, (5, 12, 27, 25), P["wood"], outline=True)
        rect(draw, (8, 14, 14, 19), P["paper"], outline=True)
        rect(draw, (14, 14, 25, 23), P["blue"], outline=True)
    elif object_id == "well":
        draw.ellipse((7, 13, 25, 27), fill=P["stone"], outline=P["outline"])
        draw.ellipse((10, 16, 22, 23), fill=P["water_dark"], outline=P["outline"])
        line(draw, [(9, 13), (13, 6), (23, 13)], P["wood_dark"], width=2, outline=True)
    elif object_id == "upgradeBoard":
        rect(draw, (7, 8, 25, 25), P["wood_light"], outline=True)
        line(draw, [(11, 14), (20, 14)], P["wood_dark"], width=1)
        line(draw, [(13, 19), (23, 10)], P["metal"], width=2, outline=True)
    elif object_id == "marketStall":
        rect(draw, (5, 16, 27, 25), P["wood"], outline=True)
        rect(draw, (4, 9, 28, 15), P["gold"], outline=True)
        for x in (8, 16, 24):
            rect(draw, (x - 3, 9, x + 2, 15), P["red"])
    elif object_id == "basketPoint":
        rect(draw, (7, 16, 25, 25), P["wood"], outline=True)
        draw.arc((7, 9, 25, 23), 195, 345, fill=P["wood_dark"], width=2)
        rect(draw, (10, 13, 15, 18), P["leaf_light"], outline=True)
        rect(draw, (17, 12, 22, 18), P["red"], outline=True)
    elif object_id == "tastingTable":
        rect(draw, (5, 16, 27, 23), P["wood_light"], outline=True)
        rect(draw, (8, 11, 13, 16), P["paper"], outline=True)
        rect(draw, (18, 10, 24, 15), P["green"], outline=True)
        rect(draw, (9, 23, 12, 28), P["wood_dark"])
        rect(draw, (22, 23, 25, 28), P["wood_dark"])
    elif object_id == "ecommerceDesk":
        rect(draw, (5, 16, 27, 25), P["wood"], outline=True)
        rect(draw, (8, 9, 18, 16), P["metal_dark"], outline=True)
        rect(draw, (20, 11, 26, 17), P["paper"], outline=True)
    return image


def draw_support_ruin(feature_id: str, state: str) -> Image.Image:
    image = canvas((32, 32))
    draw = ImageDraw.Draw(image)
    draw_shadow(draw, 16, 28, 11, 3)
    accent = {
        "processing": P["copper"],
        "construction": P["wood_light"],
        "villageMarket": P["red"],
        "cooperative": P["green"],
        "tourism": P["blue"],
        "brand": P["gold"],
        "irrigation": P["water"],
    }.get(feature_id, P["stone"])
    base = P["stone"] if state == "ruin" else P["wood"]
    rect(draw, (7, 16, 25, 25), base, outline=True)
    draw.polygon([(5, 16), (16, 8), (27, 16)], fill=P["stone_dark"], outline=P["outline"])
    line(draw, [(9, 22), (15, 18), (21, 24)], P["outline"], width=1)
    if state == "repairing":
        rect(draw, (11, 11, 20, 15), accent, outline=True)
        line(draw, [(22, 10), (26, 15)], P["metal"], width=2, outline=True)
    else:
        rect(draw, (19, 18, 24, 24), P["soil_dark"])
        rect(draw, (9, 12, 13, 15), P["stone_dark"])
    return image


def draw_support_tile(tile_id: str) -> Image.Image:
    image = canvas((32, 32))
    draw = ImageDraw.Draw(image)
    if tile_id == "door":
        rect(draw, (8, 5, 24, 31), P["wood_dark"], outline=True)
        rect(draw, (11, 8, 21, 30), P["wood"], outline=True)
        rect(draw, (19, 18, 21, 20), P["gold"])
    elif tile_id == "fence":
        for x in (5, 15, 23):
            rect(draw, (x, 5, x + 4, 30), P["wood"], outline=True)
        rect(draw, (3, 12, 28, 16), P["wood_light"], outline=True)
        rect(draw, (3, 23, 28, 27), P["wood_light"], outline=True)
    elif tile_id == "cropPlot":
        draw.ellipse((3, 18, 29, 30), fill=P["soil_dark"])
        rect(draw, (4, 10, 28, 27), P["soil"], outline=True)
        rect(draw, (8, 14, 13, 15), P["soil_dark"])
        rect(draw, (18, 20, 25, 21), P["soil_dark"])
    return image


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    buildable_frames = []
    for item_id, size in BUILDABLES.items():
        frame = draw_buildable(item_id, size)
        save(frame, BUILDABLES_DIR, f"{item_id}--active.png")
        buildable_frames.append((item_id, frame))
    contact_sheet(buildable_frames, 6, (64, 48), RUN_DIR / "p1_buildables_contact.png")

    story_frames = []
    for object_id, spec in STORY_OBJECTS.items():
        for state in spec["states"]:
            frame = draw_story_object(object_id, state, spec["size"])
            save(frame, OBJECTS_DIR, f"{object_id}--{state}.png")
            story_frames.append((f"{object_id}--{state}", frame))
    contact_sheet(story_frames, 6, (96, 80), RUN_DIR / "p1_story_objects_contact.png")

    fish_frames = []
    for fish_id, color in FISH.items():
        frame = draw_fish(fish_id, rgba(color))
        save(frame, FISH_DIR, f"{fish_id}.png")
        fish_frames.append((fish_id, frame))
    contact_sheet(fish_frames, 9, (32, 32), RUN_DIR / "p1_fish_contact.png")

    ui_frames = []
    for icon_id in UI_ICONS:
        frame = draw_ui_icon(icon_id)
        save(frame, UI_DIR, f"{icon_id}.png")
        ui_frames.append((icon_id, frame))
    contact_sheet(ui_frames, 9, (24, 24), RUN_DIR / "p2_ui_contact.png")

    tool_frames = []
    for tool_id in TOOLS:
        frame = draw_tool_icon(tool_id)
        save(frame, TOOLS_DIR, f"{tool_id}.png")
        tool_frames.append((tool_id, frame))
    contact_sheet(tool_frames, 6, (32, 32), RUN_DIR / "p2_tools_contact.png")

    support_frames = []
    for object_id in SUPPORT_OBJECTS:
        frame = draw_support_object(object_id)
        save(frame, OBJECTS_DIR, f"{object_id}.png")
        support_frames.append((object_id, frame))
    for feature_id in SUPPORT_RUINS:
        for state in SUPPORT_RUIN_STATES:
            frame = draw_support_ruin(feature_id, state)
            save(frame, OBJECTS_DIR, f"ruin-{feature_id}--{state}.png")
            support_frames.append((f"ruin-{feature_id}--{state}", frame))
    contact_sheet(support_frames, 7, (32, 32), RUN_DIR / "support_objects_contact.png")

    tile_frames = []
    for tile_id in SUPPORT_TILES:
        frame = draw_support_tile(tile_id)
        save(frame, TILES_DIR, f"{tile_id}.png")
        tile_frames.append((tile_id, frame))
    contact_sheet(tile_frames, 3, (32, 32), RUN_DIR / "support_tiles_contact.png")

    contacts = [Image.open(path).convert("RGBA") for path in [
        RUN_DIR / "p1_buildables_contact.png",
        RUN_DIR / "p1_story_objects_contact.png",
        RUN_DIR / "p1_fish_contact.png",
        RUN_DIR / "p2_ui_contact.png",
        RUN_DIR / "p2_tools_contact.png",
        RUN_DIR / "support_objects_contact.png",
        RUN_DIR / "support_tiles_contact.png",
    ]]
    width = max(contact.width for contact in contacts)
    height = sum(contact.height + 10 for contact in contacts) - 10
    combined = checker(width, height)
    y = 0
    for contact in contacts:
        combined.alpha_composite(contact, (0, y))
        y += contact.height + 10
    combined.save(RUN_DIR / "remaining_art_resources_contact.png")

    print(f"buildables: {len(buildable_frames)} files")
    print(f"story objects: {len(story_frames)} files")
    print(f"fish: {len(fish_frames)} files")
    print(f"ui: {len(ui_frames)} files")
    print(f"tools: {len(tool_frames)} files")
    print(f"support objects: {len(support_frames)} files")
    print(f"support tiles: {len(tile_frames)} files")


if __name__ == "__main__":
    main()
