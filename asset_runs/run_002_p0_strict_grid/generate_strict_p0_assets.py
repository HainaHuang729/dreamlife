from PIL import Image, ImageDraw
import json
from pathlib import Path

ROOT = Path("/Users/amadeus/Documents/New project 2")
RUN = ROOT / "asset_runs/run_002_p0_strict_grid"
PIXEL = ROOT / "assets/pixel"

PALETTE = {
    "outline": (57, 52, 43, 255),
    "shadow": (45, 38, 35, 95),
    "grass": (112, 173, 86, 255),
    "grass_dark": (74, 133, 73, 255),
    "grass_light": (151, 205, 112, 255),
    "soil": (139, 91, 55, 255),
    "soil_dark": (98, 62, 43, 255),
    "soil_wet": (88, 68, 55, 255),
    "soil_wet_hi": (117, 91, 71, 255),
    "path": (174, 135, 84, 255),
    "path_dark": (123, 91, 61, 255),
    "wood": (126, 83, 48, 255),
    "wood_hi": (178, 121, 67, 255),
    "paper": (238, 222, 177, 255),
    "water": (72, 155, 167, 255),
    "water_hi": (125, 203, 203, 255),
    "shirt": (63, 117, 129, 255),
    "pants": (49, 61, 78, 255),
    "skin": (216, 166, 116, 255),
    "hair": (57, 42, 30, 255),
    "ui": (91, 72, 56, 255),
    "ui_hi": (217, 181, 114, 255),
}


def img(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))


def save(image, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def draw_tile_grass(d, x, variant=False):
    d.rectangle([x, 0, x + 15, 15], fill=PALETTE["grass"])
    dots = [(2, 3), (11, 4), (7, 10), (14, 13)] if not variant else [(3, 12), (5, 5), (10, 9), (13, 2)]
    for dx, dy in dots:
        d.point((x + dx, dy), fill=PALETTE["grass_light"])
        d.point((x + dx, min(15, dy + 1)), fill=PALETTE["grass_dark"])


def draw_tile_path(d, x, edge=False):
    d.rectangle([x, 0, x + 15, 15], fill=PALETTE["path"])
    if edge:
        d.rectangle([x, 0, x + 15, 3], fill=PALETTE["grass"])
        d.line([x, 4, x + 15, 4], fill=PALETTE["path_dark"])
    for dx, dy in [(4, 6), (10, 11), (13, 3)]:
        d.point((x + dx, dy), fill=PALETTE["path_dark"])


def draw_tile_soil(d, x, wet=False):
    base = PALETTE["soil_wet"] if wet else PALETTE["soil"]
    hi = PALETTE["soil_wet_hi"] if wet else PALETTE["path"]
    d.rectangle([x, 0, x + 15, 15], fill=base)
    for yy in [3, 7, 11]:
        d.line([x + 2, yy, x + 13, yy], fill=PALETTE["soil_dark"])
        d.point((x + 4, yy - 1), fill=hi)
        d.point((x + 10, yy + 1), fill=hi)


def terrain_sheet():
    out = img(16 * 6, 16)
    d = ImageDraw.Draw(out)
    draw_tile_grass(d, 0)
    draw_tile_grass(d, 16, True)
    draw_tile_path(d, 32)
    draw_tile_path(d, 48, True)
    draw_tile_soil(d, 64, False)
    draw_tile_soil(d, 80, True)
    save(out, PIXEL / "terrain/terrain_p0_strict_tiles.png")
    return out


def draw_player_frame(d, x, step):
    # Frame box intentionally not drawn in final asset.
    ox = x
    # shadow and feet
    d.ellipse([ox + 4, 27, ox + 12, 31], fill=PALETTE["shadow"])
    foot_offset = [-1, 0, 1, 0, -1][step]
    d.rectangle([ox + 5 + foot_offset, 25, ox + 7 + foot_offset, 28], fill=PALETTE["pants"])
    d.rectangle([ox + 9 - foot_offset, 25, ox + 11 - foot_offset, 28], fill=PALETTE["pants"])
    # body
    d.rectangle([ox + 5, 13, ox + 11, 24], fill=PALETTE["shirt"])
    d.line([ox + 5, 13, ox + 11, 13], fill=PALETTE["outline"])
    d.rectangle([ox + 4, 15, ox + 5, 22], fill=PALETTE["skin"])
    d.rectangle([ox + 11, 15, ox + 12, 22], fill=PALETTE["skin"])
    # head/hair
    d.rectangle([ox + 5, 6, ox + 11, 12], fill=PALETTE["skin"])
    d.rectangle([ox + 5, 4, ox + 11, 7], fill=PALETTE["hair"])
    d.point((ox + 6, 10), fill=PALETTE["outline"])
    d.point((ox + 10, 10), fill=PALETTE["outline"])
    d.point((ox + 8, 12), fill=PALETTE["outline"])


def player_sheet():
    out = img(16 * 5, 32)
    d = ImageDraw.Draw(out)
    for i in range(5):
        draw_player_frame(d, i * 16, i)
    save(out, PIXEL / "characters/char_player_down_p0.png")
    return out


def shipping_box():
    out = img(16, 24)
    d = ImageDraw.Draw(out)
    d.ellipse([2, 17, 14, 22], fill=PALETTE["shadow"])
    d.rectangle([2, 8, 13, 19], fill=PALETTE["wood"])
    d.line([2, 8, 13, 8], fill=PALETTE["wood_hi"])
    d.rectangle([5, 6, 10, 9], fill=PALETTE["paper"])
    d.rectangle([2, 19, 13, 20], fill=PALETTE["outline"])
    save(out, PIXEL / "y_sort/object_shipping_box_v1.png")
    return out


def notice_board():
    out = img(32, 48)
    d = ImageDraw.Draw(out)
    d.ellipse([5, 39, 27, 45], fill=PALETTE["shadow"])
    d.rectangle([6, 12, 25, 30], fill=PALETTE["wood"])
    d.rectangle([8, 14, 23, 26], fill=PALETTE["paper"])
    d.rectangle([15, 30, 17, 41], fill=PALETTE["wood"])
    d.line([6, 12, 25, 12], fill=PALETTE["wood_hi"])
    d.line([6, 30, 25, 30], fill=PALETTE["outline"])
    save(out, PIXEL / "interaction/interaction_notice_board_empty_v1.png")
    return out


def water_pickup():
    out = img(32, 32)
    d = ImageDraw.Draw(out)
    d.ellipse([4, 17, 28, 27], fill=PALETTE["water"])
    d.arc([6, 18, 26, 27], 0, 180, fill=PALETTE["water_hi"])
    d.rectangle([7, 8, 10, 22], fill=PALETTE["wood"])
    d.rectangle([21, 8, 24, 22], fill=PALETTE["wood"])
    d.rectangle([8, 7, 23, 10], fill=PALETTE["wood_hi"])
    save(out, PIXEL / "water/water_pickup_point_v1.png")
    return out


def toolbar():
    out = img(16 * 6, 20)
    d = ImageDraw.Draw(out)
    for i in range(6):
        x = i * 16
        fill = PALETTE["ui_hi"] if i == 0 else PALETTE["ui"]
        d.rectangle([x, 2, x + 15, 17], fill=fill)
        d.rectangle([x + 1, 3, x + 14, 16], outline=PALETTE["outline"])
    # hoe
    d.line([4, 6, 10, 14], fill=PALETTE["wood"])
    d.line([10, 6, 14, 6], fill=PALETTE["outline"])
    # watering can
    x = 16
    d.rectangle([x + 5, 8, x + 11, 13], fill=PALETTE["water"])
    d.arc([x + 9, 7, x + 15, 13], 270, 90, fill=PALETTE["outline"])
    # seed bag
    x = 32
    d.rectangle([x + 5, 6, x + 11, 14], fill=PALETTE["paper"])
    d.point((x + 8, 10), fill=PALETTE["grass_dark"])
    # hand
    x = 48
    d.rectangle([x + 6, 7, x + 11, 13], fill=PALETTE["skin"])
    d.line([x + 5, 9, x + 5, 12], fill=PALETTE["skin"])
    save(out, PIXEL / "ui/ui_toolbar_p0.png")
    return out


def contact_sheet(assets):
    out = img(220, 140)
    d = ImageDraw.Draw(out)
    y = 8
    for name, im in assets:
        out.alpha_composite(im.resize((im.width * 2, im.height * 2), Image.Resampling.NEAREST), (8, y))
        d.text((8 + im.width * 2 + 8, y + 2), name, fill=(30, 28, 24, 255))
        y += max(im.height * 2 + 8, 24)
    save(out, RUN / "contact_sheet.png")


def metadata():
    data = {
        "run_id": "run_002_p0_strict_grid",
        "status": "generated",
        "assets": [
            {"asset_id": "terrain_p0_strict_tiles", "file_path": "assets/pixel/terrain/terrain_p0_strict_tiles.png", "layer": "Terrain", "priority": "P0", "sprite_size": "96x16", "tile_size": "16x16", "tiles": ["grass", "grass_var", "dirt_path", "dirt_path_edge", "soil_dry", "soil_wet"]},
            {"asset_id": "char_player_down_p0", "file_path": "assets/pixel/characters/char_player_down_p0.png", "layer": "YSortObjects", "priority": "P0", "sprite_size": "80x32", "frame_size": "16x32", "frames": 5, "pivot": "feet_center", "collision_rect": "x2 y24 w12 h8"},
            {"asset_id": "object_shipping_box_v1", "file_path": "assets/pixel/y_sort/object_shipping_box_v1.png", "layer": "YSortObjects", "priority": "P0", "sprite_size": "16x24", "pivot": "bottom_center", "collision_rect": "x2 y12 w12 h8", "interaction_rect": "x-4 y-4 w24 h28"},
            {"asset_id": "interaction_notice_board_empty_v1", "file_path": "assets/pixel/interaction/interaction_notice_board_empty_v1.png", "layer": "Interaction", "priority": "P0", "sprite_size": "32x48", "pivot": "bottom_center", "collision_rect": "x4 y32 w24 h8", "interaction_rect": "x-8 y8 w48 h44"},
            {"asset_id": "water_pickup_point_v1", "file_path": "assets/pixel/water/water_pickup_point_v1.png", "layer": "Water", "priority": "P0", "sprite_size": "32x32", "pivot": "bottom_center", "interaction_rect": "x0 y0 w32 h32"},
            {"asset_id": "ui_toolbar_p0", "file_path": "assets/pixel/ui/ui_toolbar_p0.png", "layer": "UI", "priority": "P0", "sprite_size": "96x20"}
        ]
    }
    (RUN / "metadata.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def main():
    assets = [
        ("terrain", terrain_sheet()),
        ("player", player_sheet()),
        ("shipping_box", shipping_box()),
        ("notice_board", notice_board()),
        ("water_pickup", water_pickup()),
        ("toolbar", toolbar()),
    ]
    contact_sheet(assets)
    metadata()


if __name__ == "__main__":
    main()
