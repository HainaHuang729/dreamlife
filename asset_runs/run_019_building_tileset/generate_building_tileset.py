from pathlib import Path
import json

from PIL import Image, ImageDraw


ROOT = Path("/Users/amadeus/Documents/New project 2")
RUN = ROOT / "asset_runs/run_019_building_tileset"
ASSET = ROOT / "assets/pixel/buildings/building_tiles_32_v1.png"
TILE = 32
COLS = 8
ROWS = 8


P = {
    "clear": (0, 0, 0, 0),
    "ink": (48, 42, 34, 255),
    "ink_soft": (74, 61, 47, 255),
    "shadow": (37, 32, 29, 92),
    "shadow_light": (37, 32, 29, 48),
    "roof": (158, 63, 48, 255),
    "roof_dark": (103, 48, 45, 255),
    "roof_hi": (211, 101, 64, 255),
    "roof_blue": (72, 112, 139, 255),
    "roof_blue_dark": (45, 74, 103, 255),
    "roof_blue_hi": (122, 165, 178, 255),
    "wood": (127, 79, 43, 255),
    "wood_dark": (80, 52, 36, 255),
    "wood_hi": (187, 124, 67, 255),
    "plaster": (221, 198, 151, 255),
    "plaster_dark": (177, 143, 103, 255),
    "plaster_hi": (241, 225, 176, 255),
    "stone": (110, 105, 96, 255),
    "stone_dark": (73, 73, 68, 255),
    "stone_hi": (162, 154, 135, 255),
    "glass": (86, 145, 159, 255),
    "glass_dark": (49, 88, 111, 255),
    "glass_hi": (160, 216, 211, 255),
    "door": (99, 59, 34, 255),
    "door_hi": (153, 92, 48, 255),
    "cloth": (206, 164, 72, 255),
    "cloth_dark": (156, 95, 52, 255),
    "flower_red": (214, 79, 70, 255),
    "leaf": (80, 136, 69, 255),
    "grass": (103, 166, 83, 255),
    "grass_hi": (154, 207, 112, 255),
}


TILE_NAMES = [
    "roof_red_tl",
    "roof_red_top",
    "roof_red_top_var",
    "roof_red_tr",
    "ridge_left",
    "ridge_mid",
    "ridge_right",
    "chimney",
    "roof_red_left",
    "roof_red_fill",
    "roof_red_fill_var",
    "roof_red_right",
    "eave_left",
    "eave_mid",
    "eave_right",
    "shadow_blob",
    "wood_top_left",
    "wood_top",
    "wood_top_var",
    "wood_top_right",
    "plaster_top",
    "plaster_mid",
    "stone_foundation",
    "stair",
    "wood_left",
    "wood_fill",
    "wood_fill_var",
    "wood_right",
    "plaster_left",
    "plaster_right",
    "stone_left",
    "stone_right",
    "wood_bottom_left",
    "wood_bottom",
    "single_door",
    "wood_bottom_right",
    "small_window",
    "shop_window_left",
    "shop_window_right",
    "blank_sign",
    "barn_left",
    "barn_fill",
    "barn_right",
    "barn_door_left",
    "barn_door_right",
    "hayloft_window",
    "awning_left",
    "awning_right",
    "porch_left",
    "porch_mid",
    "porch_right",
    "fence",
    "crate",
    "barrel",
    "flower_box",
    "lamp",
    "grass_pad",
    "shadow_left",
    "shadow_mid",
    "shadow_right",
    "roof_blue_top",
    "roof_blue_fill",
    "roof_blue_eave",
    "empty",
]


def new_image(w, h):
    return Image.new("RGBA", (w, h), P["clear"])


def save(image, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def tile_box(tile_id):
    x = (tile_id % COLS) * TILE
    y = (tile_id // COLS) * TILE
    return x, y, x + TILE - 1, y + TILE - 1


def local_draw(sheet, tile_id):
    x, y, _, _ = tile_box(tile_id)
    return ImageDraw.Draw(sheet), x, y


def rect(d, x, y, xy, fill):
    x0, y0, x1, y1 = xy
    d.rectangle([x + x0, y + y0, x + x1, y + y1], fill=fill)


def line(d, x, y, xy, fill):
    x0, y0, x1, y1 = xy
    d.line([x + x0, y + y0, x + x1, y + y1], fill=fill)


def point(d, x, y, px, py, fill):
    d.point((x + px, y + py), fill=fill)


def poly(d, x, y, pts, fill):
    d.polygon([(x + px, y + py) for px, py in pts], fill=fill)


def draw_red_roof_base(d, x, y, left=False, right=False, top=False, variant=False):
    rect(d, x, y, [0, 0, 31, 31], P["roof"])
    for yy in [8, 17, 26]:
        line(d, x, y, [0, yy, 31, yy], P["roof_dark"])
        line(d, x, y, [0, max(0, yy - 1), 31, max(0, yy - 1)], P["roof_hi"])
    if top:
        line(d, x, y, [0, 0, 31, 0], P["ink"])
        line(d, x, y, [0, 1, 31, 1], P["roof_hi"])
    if left:
        line(d, x, y, [0, 0, 0, 31], P["ink"])
        line(d, x, y, [1, 1, 1, 30], P["roof_dark"])
    if right:
        line(d, x, y, [31, 0, 31, 31], P["ink"])
        line(d, x, y, [30, 1, 30, 30], P["roof_dark"])
    if variant:
        for px, py in [(7, 6), (20, 12), (13, 23), (28, 4)]:
            point(d, x, y, px, py, P["roof_hi"])
            point(d, x, y, px, min(31, py + 1), P["roof_dark"])


def draw_blue_roof(d, x, y, kind):
    rect(d, x, y, [0, 0, 31, 31], P["roof_blue"])
    for yy in [9, 18, 27]:
        line(d, x, y, [0, yy, 31, yy], P["roof_blue_dark"])
        line(d, x, y, [0, yy - 1, 31, yy - 1], P["roof_blue_hi"])
    if kind == "top":
        line(d, x, y, [0, 0, 31, 0], P["ink"])
    elif kind == "eave":
        rect(d, x, y, [0, 24, 31, 31], P["roof_blue_dark"])
        line(d, x, y, [0, 24, 31, 24], P["ink"])
        line(d, x, y, [0, 31, 31, 31], P["ink"])


def draw_eave(d, x, y, left=False, right=False):
    rect(d, x, y, [0, 0, 31, 19], P["roof"])
    rect(d, x, y, [0, 20, 31, 27], P["roof_dark"])
    line(d, x, y, [0, 20, 31, 20], P["ink"])
    line(d, x, y, [0, 27, 31, 27], P["ink"])
    if left:
        line(d, x, y, [0, 0, 0, 27], P["ink"])
    if right:
        line(d, x, y, [31, 0, 31, 27], P["ink"])
    for px in [6, 17, 28]:
        line(d, x, y, [px, 21, px, 26], P["roof_hi"])


def draw_wood_wall(d, x, y, left=False, right=False, top=False, bottom=False, variant=False):
    rect(d, x, y, [0, 0, 31, 31], P["wood"])
    for px in [7, 15, 23]:
        line(d, x, y, [px, 0, px, 31], P["wood_dark"])
        line(d, x, y, [px + 1, 0, px + 1, 31], P["wood_hi"])
    if top:
        line(d, x, y, [0, 0, 31, 0], P["ink_soft"])
        line(d, x, y, [0, 2, 31, 2], P["wood_hi"])
    if bottom:
        line(d, x, y, [0, 31, 31, 31], P["ink"])
        line(d, x, y, [0, 28, 31, 28], P["wood_dark"])
    if left:
        line(d, x, y, [0, 0, 0, 31], P["ink"])
    if right:
        line(d, x, y, [31, 0, 31, 31], P["ink"])
    if variant:
        for yy in [8, 19]:
            line(d, x, y, [3, yy, 26, yy], P["wood_dark"])
            point(d, x, y, 9, yy - 1, P["wood_hi"])


def draw_plaster(d, x, y, left=False, right=False, top=False):
    rect(d, x, y, [0, 0, 31, 31], P["plaster"])
    if top:
        line(d, x, y, [0, 0, 31, 0], P["ink_soft"])
        line(d, x, y, [0, 2, 31, 2], P["plaster_hi"])
    if left:
        line(d, x, y, [0, 0, 0, 31], P["ink"])
    if right:
        line(d, x, y, [31, 0, 31, 31], P["ink"])
    for px, py in [(5, 8), (18, 14), (25, 5), (11, 25)]:
        point(d, x, y, px, py, P["plaster_hi"])
        point(d, x, y, px + 1, py + 1, P["plaster_dark"])


def draw_stone(d, x, y, left=False, right=False):
    rect(d, x, y, [0, 0, 31, 31], P["stone"])
    for yy in [10, 21]:
        line(d, x, y, [0, yy, 31, yy], P["stone_dark"])
    for px in [9, 20]:
        line(d, x, y, [px, 1, px, 9], P["stone_dark"])
        line(d, x, y, [px - 4, 11, px - 4, 20], P["stone_dark"])
        line(d, x, y, [px, 22, px, 30], P["stone_dark"])
    line(d, x, y, [0, 1, 31, 1], P["stone_hi"])
    if left:
        line(d, x, y, [0, 0, 0, 31], P["ink"])
    if right:
        line(d, x, y, [31, 0, 31, 31], P["ink"])


def draw_window(d, x, y, wide_side=None):
    rect(d, x, y, [0, 0, 31, 31], P["wood"])
    for px in [7, 23]:
        line(d, x, y, [px, 0, px, 31], P["wood_dark"])
    if wide_side == "left":
        rect(d, x, y, [5, 8, 31, 24], P["glass_dark"])
        rect(d, x, y, [8, 10, 31, 21], P["glass"])
        line(d, x, y, [5, 8, 31, 8], P["ink"])
        line(d, x, y, [5, 24, 31, 24], P["ink"])
        line(d, x, y, [15, 9, 15, 23], P["ink_soft"])
    elif wide_side == "right":
        rect(d, x, y, [0, 8, 26, 24], P["glass_dark"])
        rect(d, x, y, [0, 10, 23, 21], P["glass"])
        line(d, x, y, [0, 8, 26, 8], P["ink"])
        line(d, x, y, [0, 24, 26, 24], P["ink"])
        line(d, x, y, [14, 9, 14, 23], P["ink_soft"])
    else:
        rect(d, x, y, [8, 8, 23, 23], P["glass_dark"])
        rect(d, x, y, [10, 10, 21, 20], P["glass"])
        line(d, x, y, [8, 8, 23, 8], P["ink"])
        line(d, x, y, [8, 23, 23, 23], P["ink"])
        line(d, x, y, [15, 9, 15, 22], P["ink_soft"])
    line(d, x, y, [10, 11, 20, 11], P["glass_hi"])


def draw_single_door(d, x, y):
    rect(d, x, y, [0, 0, 31, 31], P["wood"])
    rect(d, x, y, [8, 4, 23, 31], P["door"])
    line(d, x, y, [8, 4, 23, 4], P["door_hi"])
    line(d, x, y, [8, 4, 8, 31], P["ink"])
    line(d, x, y, [23, 4, 23, 31], P["ink"])
    line(d, x, y, [8, 31, 23, 31], P["ink"])
    point(d, x, y, 20, 18, P["cloth"])


def draw_barn_wall(d, x, y, left=False, right=False):
    rect(d, x, y, [0, 0, 31, 31], P["wood_dark"])
    for px in [5, 15, 25]:
        rect(d, x, y, [px, 0, px + 3, 31], P["wood"])
        line(d, x, y, [px + 1, 0, px + 1, 31], P["wood_hi"])
    if left:
        line(d, x, y, [0, 0, 0, 31], P["ink"])
    if right:
        line(d, x, y, [31, 0, 31, 31], P["ink"])


def draw_barn_door(d, x, y, side):
    draw_barn_wall(d, x, y)
    if side == "left":
        rect(d, x, y, [6, 5, 31, 31], P["door"])
        line(d, x, y, [6, 5, 31, 5], P["door_hi"])
        line(d, x, y, [6, 5, 6, 31], P["ink"])
        line(d, x, y, [7, 26, 30, 8], P["wood_hi"])
    else:
        rect(d, x, y, [0, 5, 25, 31], P["door"])
        line(d, x, y, [0, 5, 25, 5], P["door_hi"])
        line(d, x, y, [25, 5, 25, 31], P["ink"])
        line(d, x, y, [1, 8, 24, 26], P["wood_hi"])


def draw_prop_tiles(sheet):
    d, x, y = local_draw(sheet, 7)
    rect(d, x, y, [10, 9, 22, 29], P["stone"])
    rect(d, x, y, [8, 6, 24, 12], P["stone_dark"])
    line(d, x, y, [9, 6, 23, 6], P["stone_hi"])

    d, x, y = local_draw(sheet, 15)
    d.ellipse([x + 3, y + 16, x + 29, y + 28], fill=P["shadow_light"])
    d.ellipse([x + 8, y + 18, x + 31, y + 31], fill=P["shadow"])

    d, x, y = local_draw(sheet, 23)
    rect(d, x, y, [4, 7, 27, 13], P["stone_hi"])
    rect(d, x, y, [2, 14, 29, 20], P["stone"])
    rect(d, x, y, [0, 21, 31, 28], P["stone_dark"])
    line(d, x, y, [0, 21, 31, 21], P["ink_soft"])

    d, x, y = local_draw(sheet, 39)
    rect(d, x, y, [0, 0, 31, 31], P["wood"])
    rect(d, x, y, [6, 9, 25, 21], P["plaster"])
    line(d, x, y, [6, 9, 25, 9], P["ink"])
    line(d, x, y, [6, 21, 25, 21], P["ink"])
    line(d, x, y, [15, 3, 15, 9], P["ink_soft"])

    d, x, y = local_draw(sheet, 45)
    draw_barn_wall(d, x, y)
    rect(d, x, y, [9, 7, 22, 19], P["glass_dark"])
    rect(d, x, y, [11, 9, 20, 16], P["glass"])
    line(d, x, y, [9, 7, 22, 7], P["ink"])

    d, x, y = local_draw(sheet, 46)
    rect(d, x, y, [0, 8, 31, 18], P["cloth"])
    rect(d, x, y, [0, 18, 31, 23], P["cloth_dark"])
    line(d, x, y, [0, 8, 31, 8], P["ink"])
    line(d, x, y, [31, 8, 31, 23], P["ink"])

    d, x, y = local_draw(sheet, 47)
    rect(d, x, y, [0, 8, 31, 18], P["cloth"])
    rect(d, x, y, [0, 18, 31, 23], P["cloth_dark"])
    line(d, x, y, [0, 8, 31, 8], P["ink"])
    line(d, x, y, [0, 8, 0, 23], P["ink"])

    for tile_id, left, right in [(48, True, False), (49, False, False), (50, False, True)]:
        d, x, y = local_draw(sheet, tile_id)
        rect(d, x, y, [0, 10, 31, 31], P["wood_dark"])
        rect(d, x, y, [0, 6, 31, 21], P["wood"])
        for px in [7, 15, 23]:
            line(d, x, y, [px, 7, px, 21], P["wood_dark"])
        if left:
            line(d, x, y, [0, 6, 0, 31], P["ink"])
        if right:
            line(d, x, y, [31, 6, 31, 31], P["ink"])

    d, x, y = local_draw(sheet, 51)
    rect(d, x, y, [0, 15, 31, 20], P["wood"])
    rect(d, x, y, [5, 9, 9, 26], P["wood_dark"])
    rect(d, x, y, [22, 9, 26, 26], P["wood_dark"])

    d, x, y = local_draw(sheet, 52)
    rect(d, x, y, [7, 10, 25, 26], P["wood"])
    line(d, x, y, [7, 10, 25, 10], P["wood_hi"])
    line(d, x, y, [7, 18, 25, 18], P["wood_dark"])
    line(d, x, y, [7, 26, 25, 26], P["ink"])

    d, x, y = local_draw(sheet, 53)
    d.ellipse([x + 8, y + 7, x + 24, y + 13], fill=P["wood_hi"])
    rect(d, x, y, [8, 10, 24, 26], P["wood"])
    d.ellipse([x + 8, y + 22, x + 24, y + 30], fill=P["wood_dark"])
    line(d, x, y, [9, 16, 23, 16], P["ink_soft"])
    line(d, x, y, [9, 23, 23, 23], P["ink_soft"])

    d, x, y = local_draw(sheet, 54)
    rect(d, x, y, [4, 16, 27, 23], P["wood_dark"])
    for px in [8, 14, 20, 25]:
        point(d, x, y, px, 13, P["flower_red"])
        point(d, x, y, px - 1, 15, P["leaf"])
        point(d, x, y, px + 1, 15, P["leaf"])

    d, x, y = local_draw(sheet, 55)
    rect(d, x, y, [14, 8, 17, 28], P["wood_dark"])
    rect(d, x, y, [10, 6, 21, 13], P["cloth"])
    line(d, x, y, [10, 6, 21, 6], P["ink"])

    d, x, y = local_draw(sheet, 56)
    rect(d, x, y, [0, 0, 31, 31], P["grass"])
    for px, py in [(3, 5), (14, 12), (26, 7), (9, 25), (22, 24)]:
        point(d, x, y, px, py, P["grass_hi"])

    for tile_id, kind in [(57, "left"), (58, "mid"), (59, "right")]:
        d, x, y = local_draw(sheet, tile_id)
        if kind == "left":
            d.pieslice([x + 4, y + 14, x + 43, y + 31], 90, 270, fill=P["shadow_light"])
        elif kind == "right":
            d.pieslice([x - 12, y + 14, x + 27, y + 31], 270, 90, fill=P["shadow_light"])
        else:
            rect(d, x, y, [0, 17, 31, 28], P["shadow_light"])


def make_sheet():
    sheet = new_image(COLS * TILE, ROWS * TILE)
    specs = {
        0: ("roof", {"left": True, "top": True}),
        1: ("roof", {"top": True}),
        2: ("roof", {"top": True, "variant": True}),
        3: ("roof", {"right": True, "top": True}),
        8: ("roof", {"left": True}),
        9: ("roof", {}),
        10: ("roof", {"variant": True}),
        11: ("roof", {"right": True}),
    }
    for tile_id, (_, kwargs) in specs.items():
        d, x, y = local_draw(sheet, tile_id)
        draw_red_roof_base(d, x, y, **kwargs)
    for tile_id, label in [(4, "left"), (5, "mid"), (6, "right")]:
        d, x, y = local_draw(sheet, tile_id)
        draw_red_roof_base(d, x, y)
        if label == "left":
            poly(d, x, y, [(0, 15), (31, 9), (31, 15), (0, 22)], P["roof_hi"])
        elif label == "right":
            poly(d, x, y, [(0, 9), (31, 15), (31, 22), (0, 15)], P["roof_hi"])
        else:
            rect(d, x, y, [0, 10, 31, 16], P["roof_hi"])
        line(d, x, y, [0, 17, 31, 17], P["roof_dark"])
    for tile_id, left, right in [(12, True, False), (13, False, False), (14, False, True)]:
        d, x, y = local_draw(sheet, tile_id)
        draw_eave(d, x, y, left, right)

    wall_specs = [
        (16, True, False, True, False, False),
        (17, False, False, True, False, False),
        (18, False, False, True, False, True),
        (19, False, True, True, False, False),
        (24, True, False, False, False, False),
        (25, False, False, False, False, False),
        (26, False, False, False, False, True),
        (27, False, True, False, False, False),
        (32, True, False, False, True, False),
        (33, False, False, False, True, False),
        (35, False, True, False, True, False),
    ]
    for tile_id, left, right, top, bottom, variant in wall_specs:
        d, x, y = local_draw(sheet, tile_id)
        draw_wood_wall(d, x, y, left, right, top, bottom, variant)
    for tile_id, left, right, top in [(20, False, False, True), (21, False, False, False), (28, True, False, False), (29, False, True, False)]:
        d, x, y = local_draw(sheet, tile_id)
        draw_plaster(d, x, y, left, right, top)
    for tile_id, left, right in [(22, False, False), (30, True, False), (31, False, True)]:
        d, x, y = local_draw(sheet, tile_id)
        draw_stone(d, x, y, left, right)

    d, x, y = local_draw(sheet, 34)
    draw_single_door(d, x, y)
    d, x, y = local_draw(sheet, 36)
    draw_window(d, x, y)
    d, x, y = local_draw(sheet, 37)
    draw_window(d, x, y, "left")
    d, x, y = local_draw(sheet, 38)
    draw_window(d, x, y, "right")

    for tile_id, left, right in [(40, True, False), (41, False, False), (42, False, True)]:
        d, x, y = local_draw(sheet, tile_id)
        draw_barn_wall(d, x, y, left, right)
    d, x, y = local_draw(sheet, 43)
    draw_barn_door(d, x, y, "left")
    d, x, y = local_draw(sheet, 44)
    draw_barn_door(d, x, y, "right")

    for tile_id, kind in [(60, "top"), (61, "fill"), (62, "eave")]:
        d, x, y = local_draw(sheet, tile_id)
        draw_blue_roof(d, x, y, kind)

    draw_prop_tiles(sheet)
    save(sheet, ASSET)
    return sheet


def crop_tile(sheet, tile_id):
    x0, y0, x1, y1 = tile_box(tile_id)
    return sheet.crop((x0, y0, x1 + 1, y1 + 1))


def paste_grid(canvas, sheet, tile_map, ox, oy):
    for row, ids in enumerate(tile_map):
        for col, tile_id in enumerate(ids):
            if tile_id is None or tile_id == 63:
                continue
            canvas.alpha_composite(crop_tile(sheet, tile_id), (ox + col * TILE, oy + row * TILE))


def make_shadow(width):
    if width <= 2:
        return [[57, 59]]
    return [[57] + [58] * (width - 2) + [59]]


def building_maps():
    cottage = [
        [0, 1, 2, 1, 3],
        [8, 9, 10, 9, 11],
        [12, 13, 13, 13, 14],
        [16, 17, 36, 17, 19],
        [24, 25, 34, 36, 27],
        [32, 33, 23, 33, 35],
    ]
    farmhouse = [
        [60, 60, 60, 60, 60, 60],
        [61, 61, 61, 61, 61, 61],
        [62, 62, 62, 62, 62, 62],
        [28, 20, 21, 36, 21, 29],
        [28, 21, 34, 21, 36, 29],
        [30, 22, 23, 22, 22, 31],
        [48, 49, 49, 49, 49, 50],
    ]
    barn = [
        [0, 1, 1, 2, 1, 1, 3],
        [8, 9, 9, 10, 9, 9, 11],
        [12, 13, 13, 13, 13, 13, 14],
        [40, 41, 41, 45, 41, 41, 42],
        [40, 41, 43, 44, 41, 41, 42],
        [40, 41, 43, 44, 41, 41, 42],
        [32, 33, 43, 44, 33, 33, 35],
    ]
    shop = [
        [60, 60, 60, 60, 60],
        [61, 61, 61, 61, 61],
        [62, 62, 62, 62, 62],
        [28, 39, 21, 36, 29],
        [28, 46, 37, 38, 47],
        [30, 22, 34, 22, 31],
    ]
    return {
        "cottage": cottage,
        "farmhouse": farmhouse,
        "barn": barn,
        "shop": shop,
    }


def make_preview(sheet):
    bg = (229, 221, 202, 255)
    canvas = Image.new("RGBA", (860, 620), bg)
    d = ImageDraw.Draw(canvas)
    positions = {
        "cottage": (48, 48),
        "farmhouse": (350, 48),
        "barn": (48, 330),
        "shop": (420, 330),
    }
    maps = building_maps()
    for name, tile_map in maps.items():
        ox, oy = positions[name]
        width = max(len(row) for row in tile_map)
        height = len(tile_map)
        for y in range(oy - 16, oy + (height + 1) * TILE + 16, TILE):
            d.line([ox - 16, y, ox + width * TILE + 16, y], fill=(205, 196, 174, 255))
        for x in range(ox - 16, ox + width * TILE + 17, TILE):
            d.line([x, oy - 16, x, oy + (height + 1) * TILE + 16], fill=(205, 196, 174, 255))
        paste_grid(canvas, sheet, make_shadow(width), ox, oy + height * TILE - 12)
        paste_grid(canvas, sheet, tile_map, ox, oy)
    save(canvas, RUN / "test_buildings_preview.png")
    return canvas


def make_contact(sheet, preview):
    contact = Image.new("RGBA", (900, 540), (229, 221, 202, 255))
    contact.alpha_composite(sheet.resize((sheet.width * 2, sheet.height * 2), Image.Resampling.NEAREST), (20, 16))
    thumb = preview.resize((344, 248), Image.Resampling.NEAREST)
    contact.alpha_composite(thumb, (536, 70))
    save(contact, RUN / "contact_sheet.png")


def tile_id(name):
    return TILE_NAMES.index(name)


def write_metadata():
    rules = {
        "tile_size": [32, 32],
        "sheet_size": [COLS * TILE, ROWS * TILE],
        "columns": COLS,
        "rows": ROWS,
        "source_png": str(ASSET.relative_to(ROOT)),
        "tiled_tileset": str((RUN / "building_tiles_32_v1.tsj").relative_to(ROOT)),
        "tiled_test_map": str((RUN / "test_buildings.tmj").relative_to(ROOT)),
        "principles": [
            "All modules are exactly 32x32 pixels.",
            "Horizontal joins use matching full-height edge pixels for roof, wall, foundation, porch, and shadow rows.",
            "Corners are explicit tiles; center tiles can repeat between corners.",
            "Openings are replacement wall tiles, not arbitrary overpainted pixels.",
            "Roofs, walls, foundation, porch, props, and shadows remain separate rule groups.",
            "Upper-left light source and right/down shadow direction are consistent.",
        ],
        "tiles": [
            {
                "id": i,
                "name": name,
                "coord": [i % COLS, i // COLS],
                "pixel_rect": [(i % COLS) * TILE, (i // COLS) * TILE, TILE, TILE],
            }
            for i, name in enumerate(TILE_NAMES)
        ],
        "recipes": {
            "cottage": {
                "footprint_tiles": [5, 2],
                "sprite_tiles": [5, 6],
                "entrance_tile": [2, 5],
            },
            "farmhouse": {
                "footprint_tiles": [6, 2],
                "sprite_tiles": [6, 7],
                "entrance_tile": [2, 5],
            },
            "barn": {
                "footprint_tiles": [7, 2],
                "sprite_tiles": [7, 7],
                "entrance_tile": [3, 6],
            },
            "shop": {
                "footprint_tiles": [5, 2],
                "sprite_tiles": [5, 6],
                "entrance_tile": [2, 5],
            },
        },
    }
    (RUN / "building_tile_rules.json").write_text(json.dumps(rules, indent=2) + "\n")


def write_tiled_files():
    tsj = {
        "type": "tileset",
        "version": "1.10",
        "tiledversion": "1.10.2",
        "name": "building_tiles_32_v1",
        "tilewidth": TILE,
        "tileheight": TILE,
        "spacing": 0,
        "margin": 0,
        "columns": COLS,
        "tilecount": COLS * ROWS,
        "image": "../../assets/pixel/buildings/building_tiles_32_v1.png",
        "imagewidth": COLS * TILE,
        "imageheight": ROWS * TILE,
        "tiles": [{"id": i, "type": name} for i, name in enumerate(TILE_NAMES)],
    }
    (RUN / "building_tiles_32_v1.tsj").write_text(json.dumps(tsj, indent=2) + "\n")

    width = 30
    height = 22
    layers = []
    data = [0] * (width * height)
    shadow = [0] * (width * height)
    placements = {
        "cottage": (2, 2),
        "farmhouse": (14, 2),
        "barn": (2, 12),
        "shop": (17, 13),
    }
    for name, tile_map in building_maps().items():
        ox, oy = placements[name]
        b_width = max(len(row) for row in tile_map)
        b_height = len(tile_map)
        for row, ids in enumerate(make_shadow(b_width)):
            for col, tid in enumerate(ids):
                shadow[(oy + b_height) * width + ox + col] = tid + 1
        for row, ids in enumerate(tile_map):
            for col, tid in enumerate(ids):
                if tid is not None and tid != 63:
                    data[(oy + row) * width + ox + col] = tid + 1
    layers.append({"id": 1, "name": "shadow", "type": "tilelayer", "width": width, "height": height, "x": 0, "y": 0, "opacity": 1, "visible": True, "data": shadow})
    layers.append({"id": 2, "name": "building", "type": "tilelayer", "width": width, "height": height, "x": 0, "y": 0, "opacity": 1, "visible": True, "data": data})
    tmj = {
        "type": "map",
        "version": "1.10",
        "tiledversion": "1.10.2",
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "width": width,
        "height": height,
        "tilewidth": TILE,
        "tileheight": TILE,
        "infinite": False,
        "nextlayerid": 3,
        "nextobjectid": 1,
        "layers": layers,
        "tilesets": [{"firstgid": 1, "source": "building_tiles_32_v1.tsj"}],
    }
    (RUN / "test_buildings.tmj").write_text(json.dumps(tmj, indent=2) + "\n")


def validate_outputs():
    sheet = Image.open(ASSET)
    preview = Image.open(RUN / "test_buildings_preview.png")
    checks = {
        "sheet_size": sheet.size == (COLS * TILE, ROWS * TILE),
        "sheet_divisible_by_32": sheet.width % TILE == 0 and sheet.height % TILE == 0,
        "preview_exists": preview.size == (860, 620),
        "tile_count": len(TILE_NAMES) == COLS * ROWS,
        "metadata_exists": (RUN / "building_tile_rules.json").exists(),
        "tiled_map_exists": (RUN / "test_buildings.tmj").exists(),
        "tiled_tileset_exists": (RUN / "building_tiles_32_v1.tsj").exists(),
    }
    failed = [name for name, ok in checks.items() if not ok]
    if failed:
        raise SystemExit(f"Validation failed: {failed}")
    (RUN / "validation.json").write_text(json.dumps(checks, indent=2) + "\n")


def write_run_result():
    text = """# Run 019 Building Tileset Result

Status: generated a strict 32x32 modular building tileset and assembled four test buildings.

## Outputs

| File | Purpose |
| --- | --- |
| `assets/pixel/buildings/building_tiles_32_v1.png` | 8x8 tilesheet, 64 tiles, each 32x32 |
| `asset_runs/run_019_building_tileset/building_tile_rules.json` | Tile ids, naming, recipes, and join rules |
| `asset_runs/run_019_building_tileset/building_tiles_32_v1.tsj` | Tiled external tileset |
| `asset_runs/run_019_building_tileset/test_buildings.tmj` | Tiled map with four assembled buildings |
| `asset_runs/run_019_building_tileset/test_buildings_preview.png` | Rendered preview of cottage, farmhouse, barn, and shop |
| `asset_runs/run_019_building_tileset/contact_sheet.png` | Tilesheet plus preview overview |
| `asset_runs/run_019_building_tileset/validation.json` | Size and file validation |

## Rule Summary

- Tile size is fixed at 32x32.
- Roof, wall, foundation, porch, prop, and shadow groups are separated.
- Corners are explicit tiles; middle tiles repeat horizontally.
- Doors and windows are replacement wall tiles, so they still snap to the same grid.
- The test map uses the same source PNG through a Tiled `.tsj` tileset.

## Current Art Quality

This pass prioritizes strict modularity over final art polish. The tiles can be sliced and assembled predictably, but the roof/body language can still be refined after checking the Tiled preview.
"""
    (RUN / "run_result.md").write_text(text)


def main():
    sheet = make_sheet()
    preview = make_preview(sheet)
    make_contact(sheet, preview)
    write_metadata()
    write_tiled_files()
    validate_outputs()
    write_run_result()


if __name__ == "__main__":
    main()
