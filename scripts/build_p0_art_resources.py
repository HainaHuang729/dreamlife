#!/usr/bin/env python3
"""Build P0 runtime art resources for crops, community facilities, and resource nodes."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs" / "run_022_p0_art_resources"
PROCESSED_DIR = RUN_DIR / "processed"
ASSET_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game"
CROPS_DIR = ASSET_DIR / "crops"
OBJECTS_DIR = ASSET_DIR / "objects"

P = {
    "outline": (44, 32, 27, 255),
    "shadow": (43, 34, 28, 75),
    "soil": (122, 79, 48, 255),
    "soil_dark": (83, 58, 41, 255),
    "wet": (64, 98, 117, 255),
    "wet_light": (89, 133, 147, 255),
    "leaf_dark": (55, 98, 55, 255),
    "leaf": (91, 151, 76, 255),
    "leaf_light": (142, 190, 93, 255),
    "wood_dark": (86, 55, 35, 255),
    "wood": (134, 88, 48, 255),
    "wood_light": (180, 125, 64, 255),
    "paper": (236, 222, 172, 255),
    "paper_dim": (191, 169, 117, 255),
    "gold": (225, 179, 77, 255),
    "red": (211, 86, 76, 255),
    "blue": (117, 185, 216, 255),
    "green": (112, 183, 126, 255),
    "teal": (61, 129, 144, 255),
    "stone": (115, 112, 102, 255),
    "stone_dark": (73, 73, 68, 255),
    "metal": (140, 183, 215, 255),
    "metal_dark": (86, 104, 113, 255),
    "coal": (54, 51, 49, 255),
    "copper": (192, 138, 74, 255),
    "water": (58, 158, 192, 255),
    "water_dark": (50, 105, 126, 255),
    "cream": (244, 236, 216, 255),
}

CROPS = {
    "radish": {"size": (32, 32), "kind": "radish"},
    "bokChoy": {"size": (32, 32), "kind": "bokChoy"},
    "wheat": {"size": (32, 48), "kind": "wheat"},
    "bean": {"size": (32, 48), "kind": "bean"},
    "tomato": {"size": (32, 48), "kind": "tomato"},
    "corn": {"size": (32, 48), "kind": "corn"},
    "sweetPotato": {"size": (32, 32), "kind": "sweetPotato"},
    "spinach": {"size": (32, 32), "kind": "spinach"},
}
CROP_STATES = ["active", "watered", "ready"]

FACILITIES = {
    "childCare": {"color": P["blue"], "accent": P["gold"], "motif": "classroom"},
    "youthWorkshop": {"color": P["green"], "accent": P["metal"], "motif": "workshop"},
    "elderCare": {"color": P["gold"], "accent": P["red"], "motif": "kitchen"},
    "clinicRoute": {"color": (217, 135, 119, 255), "accent": P["blue"], "motif": "clinic"},
    "coldChain": {"color": (140, 183, 215, 255), "accent": P["cream"], "motif": "cold"},
    "waterCleanup": {"color": P["teal"], "accent": P["water"], "motif": "water"},
}
FACILITY_STATES = ["ruin", "repaired", "upgrade1", "upgrade2"]
RESOURCE_NODES = {
    "quarry": {"size": (64, 64), "motif": "quarry"},
    "forestEdge": {"size": (64, 64), "motif": "forestEdge"},
    "toolShed": {"size": (96, 80), "motif": "toolShed"},
}
RESOURCE_STATES = ["locked", "active", "depleted"]


def canvas(size: tuple[int, int]) -> Image.Image:
    return Image.new("RGBA", size, (0, 0, 0, 0))


def rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: tuple[int, int, int, int], outline: bool = False) -> None:
    if outline:
        x0, y0, x1, y1 = box
        draw.rectangle((x0 - 1, y0 - 1, x1 + 1, y1 + 1), fill=P["outline"])
    draw.rectangle(box, fill=fill)


def line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]] | tuple[int, int, int, int], fill: tuple[int, int, int, int], width: int = 1, outline: bool = False) -> None:
    if outline and width > 0:
        draw.line(points, fill=P["outline"], width=width + 2)
    draw.line(points, fill=fill, width=width)


def draw_shadow(draw: ImageDraw.ImageDraw, cx: int, cy: int, rx: int, ry: int) -> None:
    draw.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=P["shadow"])


def save_runtime(image: Image.Image, group_dir: Path, filename: str) -> None:
    group_dir.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    image.save(group_dir / filename)
    image.save(PROCESSED_DIR / filename)


def draw_soil(draw: ImageDraw.ImageDraw, w: int, h: int, watered: bool = False) -> None:
    y = h - 8
    draw.ellipse((4, y - 2, w - 4, h - 1), fill=P["soil_dark"])
    rect(draw, (5, y, w - 6, h - 3), P["wet" if watered else "soil"], outline=True)
    if watered:
        rect(draw, (8, h - 5, 15, h - 4), P["wet_light"])
        rect(draw, (19, h - 6, 24, h - 5), P["wet_light"])
    else:
        rect(draw, (9, h - 5, 13, h - 4), P["soil_dark"])
        rect(draw, (20, h - 6, 24, h - 5), P["soil_dark"])


def draw_leaves(draw: ImageDraw.ImageDraw, stems: list[tuple[int, int, int, int]], light: bool = False) -> None:
    for x0, y0, x1, y1 in stems:
        line(draw, [(x0, y0), (x1, y1)], P["leaf_dark"], width=2)
        leaf_color = P["leaf_light"] if light else P["leaf"]
        rect(draw, (x1 - 3, y1 - 3, x1 + 2, y1 + 1), leaf_color, outline=True)


def draw_crop(kind: str, state: str, size: tuple[int, int]) -> Image.Image:
    image = canvas(size)
    draw = ImageDraw.Draw(image)
    w, h = size
    draw_soil(draw, w, h, watered=state == "watered")
    ready = state == "ready"
    light = state == "watered"

    if kind == "radish":
        draw_leaves(draw, [(16, h - 10, 12, h - 20), (16, h - 10, 18, h - 22), (16, h - 10, 22, h - 18)], light)
        if ready:
            rect(draw, (11, h - 17, 20, h - 7), (240, 127, 120, 255), outline=True)
            rect(draw, (14, h - 13, 20, h - 7), (246, 229, 203, 255))
            rect(draw, (10, h - 12, 12, h - 9), (188, 78, 82, 255))
    elif kind == "bokChoy":
        for x, y in [(11, h - 16), (16, h - 20), (21, h - 16), (14, h - 13), (19, h - 13)]:
            rect(draw, (x - 3, y - 4, x + 3, y + 3), P["leaf_light" if ready else "leaf"], outline=True)
        rect(draw, (13, h - 14, 19, h - 6), (228, 238, 187, 255), outline=True)
    elif kind == "wheat":
        for x in (10, 14, 18, 22):
            line(draw, [(16, h - 8), (x, h - (31 if ready else 23))], P["leaf_dark"], width=1)
            top = h - (35 if ready else 25)
            color = (247, 223, 136, 255) if ready else P["leaf_light"]
            rect(draw, (x - 2, top, x + 2, top + 9), color, outline=True)
    elif kind == "bean":
        line(draw, [(9, h - 8), (9, h - 36)], P["wood"], width=2, outline=True)
        line(draw, [(23, h - 8), (23, h - 36)], P["wood"], width=2, outline=True)
        line(draw, [(9, h - 34), (23, h - 34)], P["wood"], width=2)
        draw_leaves(draw, [(15, h - 8, 10, h - 24), (17, h - 8, 22, h - 25), (16, h - 18, 14, h - 31), (16, h - 18, 20, h - 31)], light)
        if ready:
            for x, y in [(12, h - 26), (21, h - 22), (17, h - 31)]:
                rect(draw, (x - 2, y - 4, x + 2, y + 3), (213, 240, 160, 255), outline=True)
    elif kind == "tomato":
        line(draw, [(16, h - 8), (16, h - 33)], P["leaf_dark"], width=2)
        draw_leaves(draw, [(16, h - 16, 10, h - 25), (16, h - 18, 22, h - 27), (16, h - 26, 12, h - 33), (16, h - 25, 21, h - 34)], light)
        if ready:
            for x, y in [(11, h - 23), (21, h - 24), (16, h - 31)]:
                rect(draw, (x - 3, y - 3, x + 3, y + 3), (217, 87, 79, 255), outline=True)
    elif kind == "corn":
        line(draw, [(16, h - 8), (16, h - 39)], P["leaf_dark"], width=3, outline=True)
        for dx, y in [(-7, h - 25), (7, h - 28), (-6, h - 34), (6, h - 36)]:
            rect(draw, (16 + dx - 4, y - 2, 16 + dx + 4, y + 2), P["leaf" if not light else "leaf_light"], outline=True)
        if ready:
            rect(draw, (19, h - 32, 24, h - 21), (231, 196, 81, 255), outline=True)
            rect(draw, (8, h - 28, 13, h - 18), (231, 196, 81, 255), outline=True)
    elif kind == "sweetPotato":
        for x, y in [(10, h - 15), (16, h - 18), (22, h - 15), (13, h - 12), (19, h - 12)]:
            rect(draw, (x - 4, y - 3, x + 4, y + 2), P["leaf" if not ready else "leaf_light"], outline=True)
        if ready:
            rect(draw, (8, h - 10, 15, h - 5), (185, 107, 88, 255), outline=True)
            rect(draw, (18, h - 11, 25, h - 5), (210, 122, 90, 255), outline=True)
    elif kind == "spinach":
        for x, y in [(11, h - 15), (16, h - 20), (21, h - 15), (13, h - 11), (19, h - 11)]:
            rect(draw, (x - 4, y - 4, x + 4, y + 3), (79, 150, 96, 255) if ready else P["leaf"], outline=True)
            rect(draw, (x - 1, y - 3, x + 1, y + 2), (217, 240, 162, 255) if ready else P["leaf_light"])
    return image


def draw_roof(draw: ImageDraw.ImageDraw, x: int, y: int, w: int, color: tuple[int, int, int, int], damaged: bool = False) -> None:
    rect(draw, (x, y, x + w, y + 8), color, outline=True)
    if damaged:
        rect(draw, (x + 10, y + 1, x + 18, y + 8), P["stone_dark"])
        rect(draw, (x + w - 18, y + 3, x + w - 11, y + 8), P["soil_dark"])
    else:
        for sx in range(x + 6, x + w - 2, 12):
            rect(draw, (sx, y + 2, sx + 5, y + 3), P["cream"])


def draw_facility_motif(draw: ImageDraw.ImageDraw, motif: str, state: str, x: int, y: int, w: int, h: int, accent: tuple[int, int, int, int]) -> None:
    upgraded = state in {"upgrade1", "upgrade2"}
    full = state == "upgrade2"
    if motif == "classroom":
        for px in (x + 14, x + 35):
            rect(draw, (px, y + 16, px + 11, y + 25), P["paper"], outline=True)
        if upgraded:
            rect(draw, (x + 56, y + 18, x + 76, y + 28), P["wood_light"], outline=True)
            rect(draw, (x + 60, y + 14, x + 71, y + 17), accent, outline=True)
        if full:
            rect(draw, (x + 8, y + h - 9, x + 24, y + h - 5), P["leaf"], outline=True)
            rect(draw, (x + 60, y + h - 10, x + 78, y + h - 5), P["leaf_light"], outline=True)
    elif motif == "workshop":
        rect(draw, (x + 14, y + 24, x + 46, y + 31), P["wood_light"], outline=True)
        for px in (x + 20, x + 31, x + 40):
            line(draw, [(px, y + 16), (px - 4, y + 26)], P["metal"], width=2, outline=True)
        if upgraded:
            rect(draw, (x + 56, y + 18, x + 77, y + 29), accent, outline=True)
            rect(draw, (x + 61, y + 22, x + 72, y + 25), P["outline"])
        if full:
            rect(draw, (x + 8, y + 15, x + 15, y + 28), P["metal_dark"], outline=True)
            line(draw, [(x + 76, y + 11), (x + 82, y + 28)], P["wood"], width=2, outline=True)
    elif motif == "kitchen":
        rect(draw, (x + 13, y + 20, x + 32, y + 32), P["stone"], outline=True)
        rect(draw, (x + 18, y + 14, x + 27, y + 21), P["red"], outline=True)
        rect(draw, (x + 38, y + 23, x + 63, y + 31), P["wood_light"], outline=True)
        if upgraded:
            for px in (x + 44, x + 54, x + 67):
                draw.ellipse((px - 3, y + 16, px + 3, y + 20), fill=P["cream"], outline=P["outline"])
        if full:
            rect(draw, (x + 66, y + 21, x + 79, y + 31), P["paper"], outline=True)
    elif motif == "clinic":
        rect(draw, (x + 14, y + 17, x + 34, y + 32), P["paper"], outline=True)
        line(draw, [(x + 18, y + 28), (x + 29, y + 19)], accent, width=2)
        rect(draw, (x + 50, y + 22, x + 66, y + 31), P["metal"], outline=True)
        rect(draw, (x + 56, y + 18, x + 60, y + 25), P["cream"])
        rect(draw, (x + 52, y + 21, x + 64, y + 23), P["cream"])
        if upgraded:
            line(draw, [(x + 37, y + 19), (x + 47, y + 27), (x + 58, y + 18)], P["red"], width=2)
        if full:
            rect(draw, (x + 71, y + 14, x + 79, y + 30), P["blue"], outline=True)
    elif motif == "cold":
        rect(draw, (x + 12, y + 15, x + 33, y + 33), P["metal"], outline=True)
        rect(draw, (x + 16, y + 19, x + 29, y + 27), P["water"], outline=True)
        for px in (x + 44, x + 58):
            rect(draw, (px, y + 25, px + 10, y + 32), P["wood_light"], outline=True)
        if upgraded:
            line(draw, [(x + 35, y + 24), (x + 45, y + 17), (x + 56, y + 17)], P["metal_dark"], width=2)
            rect(draw, (x + 66, y + 18, x + 78, y + 31), P["cream"], outline=True)
        if full:
            rect(draw, (x + 9, y + 35, x + 80, y + 38), P["water_dark"])
    elif motif == "water":
        draw.ellipse((x + 9, y + 21, x + 41, y + 36), fill=P["water_dark"], outline=P["outline"])
        draw.ellipse((x + 13, y + 23, x + 39, y + 33), fill=P["water"])
        line(draw, [(x + 48, y + 13), (x + 55, y + 31)], P["wood"], width=3, outline=True)
        line(draw, [(x + 63, y + 15), (x + 58, y + 31)], P["wood"], width=3, outline=True)
        if upgraded:
            rect(draw, (x + 57, y + 25, x + 78, y + 32), P["stone"], outline=True)
            rect(draw, (x + 17, y + 19, x + 31, y + 20), P["water"])
        if full:
            rect(draw, (x + 7, y + 36, x + 80, y + 39), (112, 183, 126, 255), outline=True)


def draw_facility(goal_id: str, state: str) -> Image.Image:
    image = canvas((96, 80))
    draw = ImageDraw.Draw(image)
    spec = FACILITIES[goal_id]
    x, y, w, h = 9, 16, 78, 49
    stage = FACILITY_STATES.index(state)
    draw_shadow(draw, 48, 67, 36, 6)
    if state == "ruin":
        rect(draw, (x + 3, y + 16, x + w - 6, y + h), P["stone_dark"], outline=True)
        draw_roof(draw, x, y + 9, w, P["stone"], damaged=True)
        rect(draw, (x + 13, y + 34, x + 23, y + 49), P["wood_dark"], outline=True)
        rect(draw, (x + 44, y + 28, x + 64, y + 33), P["soil_dark"], outline=True)
        line(draw, [(x + 26, y + 44), (x + 36, y + 52)], P["stone"], width=2)
        return image

    body_color = spec["color"]
    if stage == 1:
        body_color = tuple(max(0, int(c * 0.78)) for c in body_color[:3]) + (255,)
    rect(draw, (x + 3, y + 17, x + w - 4, y + h), (82, 62, 46, 255), outline=True)
    rect(draw, (x + 6, y + 20, x + w - 7, y + h - 4), (198, 172, 118, 255), outline=False)
    draw_roof(draw, x, y + 9, w, body_color)
    rect(draw, (x + 41, y + 34, x + 54, y + h), P["wood_dark"], outline=True)
    rect(draw, (x + 12, y + 27, x + 27, y + 37), P["paper"], outline=True)
    rect(draw, (x + 62, y + 27, x + 76, y + 37), P["paper"], outline=True)
    if stage >= 2:
        rect(draw, (x - 2, y + 45, x + 17, y + 56), P["wood"], outline=True)
        rect(draw, (x + 61, y + 45, x + 83, y + 56), P["wood_light"], outline=True)
    if stage >= 3:
        rect(draw, (x + 6, y + 4, x + w - 7, y + 8), spec["accent"], outline=True)
        rect(draw, (x + 25, y + 48, x + 36, y + 56), P["green"], outline=True)
    draw_facility_motif(draw, spec["motif"], state, x, y, w, h, spec["accent"])
    return image


def draw_resource_node(resource_id: str, state: str) -> Image.Image:
    size = RESOURCE_NODES[resource_id]["size"]
    image = canvas(size)
    draw = ImageDraw.Draw(image)
    w, h = size
    draw_shadow(draw, w // 2, h - 9, max(16, w // 3), 5)
    active = state == "active"
    depleted = state == "depleted"
    locked = state == "locked"

    if resource_id == "quarry":
        rocks = [(10, h - 25, 23, h - 12), (24, h - 33, 41, h - 11), (40, h - 27, 55, h - 12)]
        for index, box in enumerate(rocks):
            fill = P["stone"] if active else P["stone_dark"] if locked else (94, 91, 83, 255)
            rect(draw, box, fill, outline=True)
            if active and index >= 1:
                rect(draw, (box[0] + 5, box[1] + 4, box[0] + 9, box[1] + 7), P["copper"])
                rect(draw, (box[2] - 6, box[3] - 5, box[2] - 2, box[3] - 3), P["coal"])
        if depleted:
            for x, y in [(16, h - 10), (33, h - 12), (49, h - 10)]:
                rect(draw, (x, y, x + 4, y + 2), P["stone_dark"])
    elif resource_id == "forestEdge":
        trunks = [(13, h - 33, 19, h - 10), (40, h - 36, 46, h - 10)]
        for box in trunks:
            rect(draw, box, P["wood_dark"], outline=True)
        leaf_color = P["leaf"] if active else P["stone"] if locked else (71, 97, 63, 255)
        for cx, cy in [(14, h - 38), (23, h - 42), (42, h - 43), (50, h - 37)]:
            rect(draw, (cx - 8, cy - 6, cx + 8, cy + 6), leaf_color, outline=True)
        if active:
            rect(draw, (17, h - 14, 35, h - 10), P["wood_light"], outline=True)
            rect(draw, (38, h - 18, 47, h - 13), P["leaf_light"], outline=True)
        if depleted:
            rect(draw, (20, h - 12, 34, h - 10), P["wood_dark"])
    else:
        x, y = 14, 17
        body = P["wood_dark"] if locked else P["wood"] if active else (96, 72, 52, 255)
        rect(draw, (x, y + 18, x + 68, y + 50), body, outline=True)
        draw_roof(draw, x - 3, y + 10, 74, P["stone"] if locked else P["metal_dark"], damaged=depleted)
        if active:
            rect(draw, (x + 9, y + 31, x + 23, y + 45), P["metal"], outline=True)
            rect(draw, (x + 42, y + 29, x + 55, y + 45), P["copper"], outline=True)
            line(draw, [(x + 28, y + 20), (x + 39, y + 43)], P["wood_light"], width=3, outline=True)
        elif depleted:
            rect(draw, (x + 12, y + 35, x + 24, y + 45), P["stone_dark"], outline=True)
            rect(draw, (x + 46, y + 34, x + 58, y + 45), P["wood_dark"], outline=True)
        else:
            rect(draw, (x + 27, y + 30, x + 42, y + 48), P["stone_dark"], outline=True)
            rect(draw, (x + 31, y + 35, x + 38, y + 40), P["metal_dark"], outline=True)

    if locked:
        rect(draw, (w - 21, 8, w - 10, 18), P["metal_dark"], outline=True)
        rect(draw, (w - 18, 5, w - 13, 11), P["stone"], outline=True)
    return image


def checker(width: int, height: int) -> Image.Image:
    image = Image.new("RGBA", (width, height), (235, 228, 209, 255))
    draw = ImageDraw.Draw(image)
    size = 8
    for y in range(0, height, size):
        for x in range(0, width, size):
            if (x // size + y // size) % 2:
                draw.rectangle((x, y, x + size - 1, y + size - 1), fill=(211, 202, 181, 255))
    return image


def contact_sheet(frames: list[tuple[str, Image.Image]], columns: int, cell_size: tuple[int, int], out: Path) -> None:
    rows = (len(frames) + columns - 1) // columns
    cell_w, cell_h = cell_size[0] + 8, cell_size[1] + 8
    sheet = checker(columns * cell_w, rows * cell_h)
    for index, (_name, frame) in enumerate(frames):
        col = index % columns
        row = index // columns
        x = col * cell_w + (cell_w - frame.width) // 2
        y = row * cell_h + (cell_h - frame.height) // 2
        sheet.alpha_composite(frame, (x, y))
    sheet.save(out)


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    CROPS_DIR.mkdir(parents=True, exist_ok=True)
    OBJECTS_DIR.mkdir(parents=True, exist_ok=True)

    crop_frames: list[tuple[str, Image.Image]] = []
    for crop_id, spec in CROPS.items():
        for state in CROP_STATES:
            frame = draw_crop(spec["kind"], state, spec["size"])
            save_runtime(frame, CROPS_DIR, f"{crop_id}--{state}.png")
            crop_frames.append((f"{crop_id}--{state}", frame))
    contact_sheet(crop_frames, 8, (32, 48), RUN_DIR / "p0_crops_contact.png")

    facility_frames: list[tuple[str, Image.Image]] = []
    for goal_id in FACILITIES:
        for state in FACILITY_STATES:
            frame = draw_facility(goal_id, state)
            save_runtime(frame, OBJECTS_DIR, f"communityFacility-{goal_id}--{state}.png")
            facility_frames.append((f"{goal_id}--{state}", frame))
    contact_sheet(facility_frames, 4, (96, 80), RUN_DIR / "p0_community_facilities_contact.png")

    node_frames: list[tuple[str, Image.Image]] = []
    for resource_id in RESOURCE_NODES:
        for state in RESOURCE_STATES:
            frame = draw_resource_node(resource_id, state)
            save_runtime(frame, OBJECTS_DIR, f"resourceNode-{resource_id}--{state}.png")
            node_frames.append((f"{resource_id}--{state}", frame))
    contact_sheet(node_frames, 3, (96, 80), RUN_DIR / "p0_resource_nodes_contact.png")

    all_contacts = [
        Image.open(RUN_DIR / "p0_crops_contact.png").convert("RGBA"),
        Image.open(RUN_DIR / "p0_community_facilities_contact.png").convert("RGBA"),
        Image.open(RUN_DIR / "p0_resource_nodes_contact.png").convert("RGBA"),
    ]
    width = max(image.width for image in all_contacts)
    height = sum(image.height + 10 for image in all_contacts) - 10
    combined = checker(width, height)
    y = 0
    for contact in all_contacts:
        combined.alpha_composite(contact, (0, y))
        y += contact.height + 10
    combined.save(RUN_DIR / "p0_art_resources_contact.png")

    print(f"crops: {len(crop_frames)} files")
    print(f"community facilities: {len(facility_frames)} files")
    print(f"resource nodes: {len(node_frames)} files")
    print(f"contact: {RUN_DIR / 'p0_art_resources_contact.png'}")


if __name__ == "__main__":
    main()
