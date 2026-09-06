from PIL import Image, ImageDraw
import json
from pathlib import Path

ROOT = Path("/Users/amadeus/Documents/New project 2")
RUN = ROOT / "asset_runs/run_004_ai_p0_art_replace"
PIXEL = ROOT / "assets/pixel"

# Palette tightened from the AI reference board direction: warmer, less flat, more rural.
P = {
    "ink": (50, 43, 35, 255),
    "soft_ink": (70, 58, 45, 255),
    "shadow": (38, 34, 31, 85),
    "grass": (105, 166, 83, 255),
    "grass_2": (91, 150, 77, 255),
    "grass_hi": (157, 207, 113, 255),
    "grass_flower": (231, 210, 118, 255),
    "path": (178, 137, 86, 255),
    "path_hi": (209, 166, 105, 255),
    "path_dark": (125, 90, 61, 255),
    "soil": (133, 86, 50, 255),
    "soil_hi": (182, 122, 68, 255),
    "soil_dark": (84, 53, 39, 255),
    "soil_wet": (82, 68, 58, 255),
    "soil_wet_hi": (125, 96, 76, 255),
    "wood": (122, 76, 42, 255),
    "wood_hi": (186, 117, 56, 255),
    "wood_dark": (77, 50, 35, 255),
    "paper": (239, 221, 170, 255),
    "paper_shadow": (211, 184, 132, 255),
    "water": (59, 147, 165, 255),
    "water_dark": (41, 105, 135, 255),
    "water_hi": (129, 213, 211, 255),
    "skin": (219, 163, 111, 255),
    "skin_shadow": (178, 111, 75, 255),
    "hair": (58, 43, 30, 255),
    "shirt": (57, 123, 133, 255),
    "shirt_hi": (82, 157, 158, 255),
    "pants": (45, 57, 76, 255),
    "shoes": (35, 37, 42, 255),
    "ui": (88, 66, 50, 255),
    "ui_dark": (54, 43, 35, 255),
    "ui_hi": (222, 181, 108, 255),
}


def img(w, h):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))


def save(image, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def dither_points(d, x, pts, colors):
    for i, (px, py) in enumerate(pts):
        d.point((x + px, py), fill=colors[i % len(colors)])


def terrain():
    out = img(96, 16)
    d = ImageDraw.Draw(out)
    # grass base
    d.rectangle([0, 0, 15, 15], fill=P["grass"])
    dither_points(d, 0, [(2, 3), (9, 2), (5, 9), (13, 11), (7, 14)], [P["grass_hi"], P["grass_2"]])
    # grass variation
    d.rectangle([16, 0, 31, 15], fill=P["grass"])
    dither_points(d, 16, [(3, 12), (4, 4), (11, 8), (14, 2), (8, 13)], [P["grass_2"], P["grass_hi"], P["grass_flower"]])
    # dirt path center
    d.rectangle([32, 0, 47, 15], fill=P["path"])
    dither_points(d, 32, [(2, 5), (6, 11), (12, 3), (14, 13)], [P["path_dark"], P["path_hi"]])
    # dirt path edge
    d.rectangle([48, 0, 63, 15], fill=P["path"])
    d.rectangle([48, 0, 63, 3], fill=P["grass"])
    d.line([48, 4, 63, 4], fill=P["path_dark"])
    dither_points(d, 48, [(3, 11), (9, 7), (13, 14)], [P["path_hi"], P["path_dark"]])
    # dry soil
    d.rectangle([64, 0, 79, 15], fill=P["soil"])
    for yy in [2, 6, 10, 14]:
        d.line([66, yy, 77, yy], fill=P["soil_dark"])
        d.point((68, max(0, yy - 1)), fill=P["soil_hi"])
        d.point((74, min(15, yy + 1)), fill=P["soil_hi"])
    # wet soil
    d.rectangle([80, 0, 95, 15], fill=P["soil_wet"])
    for yy in [2, 6, 10, 14]:
        d.line([82, yy, 93, yy], fill=P["soil_dark"])
        d.point((84, max(0, yy - 1)), fill=P["soil_wet_hi"])
        d.point((90, min(15, yy + 1)), fill=P["soil_wet_hi"])
    save(out, PIXEL / "terrain/terrain_p0_ai_v1.png")
    return out


def player_frame(d, x, step):
    foot = [-1, 0, 1, 0, -1][step]
    d.ellipse([x + 3, 27, x + 13, 31], fill=P["shadow"])
    # legs/feet
    d.rectangle([x + 5 + foot, 24, x + 7 + foot, 28], fill=P["pants"])
    d.rectangle([x + 9 - foot, 24, x + 11 - foot, 28], fill=P["pants"])
    d.rectangle([x + 5 + foot, 28, x + 7 + foot, 29], fill=P["shoes"])
    d.rectangle([x + 9 - foot, 28, x + 11 - foot, 29], fill=P["shoes"])
    # body
    d.rectangle([x + 4, 14, x + 12, 23], fill=P["shirt"])
    d.line([x + 5, 14, x + 11, 14], fill=P["shirt_hi"])
    d.point((x + 8, 18), fill=P["shirt_hi"])
    # arms
    arm_shift = [0, 1, 0, -1, 0][step]
    d.rectangle([x + 3, 15 + arm_shift, x + 4, 22 + arm_shift], fill=P["skin"])
    d.rectangle([x + 12, 15 - arm_shift, x + 13, 22 - arm_shift], fill=P["skin_shadow"])
    # head
    d.rectangle([x + 5, 7, x + 11, 13], fill=P["skin"])
    d.rectangle([x + 5, 5, x + 11, 8], fill=P["hair"])
    d.point((x + 6, 10), fill=P["ink"])
    d.point((x + 10, 10), fill=P["ink"])
    d.line([x + 7, 13, x + 9, 13], fill=P["skin_shadow"])


def player():
    out = img(80, 32)
    d = ImageDraw.Draw(out)
    for i in range(5):
        player_frame(d, i * 16, i)
    save(out, PIXEL / "characters/char_player_down_ai_v1.png")
    return out


def shipping_box():
    out = img(16, 24)
    d = ImageDraw.Draw(out)
    d.ellipse([1, 17, 15, 22], fill=P["shadow"])
    d.polygon([(2, 8), (13, 8), (14, 18), (1, 18)], fill=P["wood"])
    d.line([2, 8, 13, 8], fill=P["wood_hi"])
    d.line([3, 13, 13, 13], fill=P["wood_dark"])
    d.rectangle([5, 6, 11, 10], fill=P["paper"])
    d.line([6, 7, 10, 7], fill=P["paper_shadow"])
    d.line([2, 18, 14, 18], fill=P["ink"])
    save(out, PIXEL / "y_sort/object_shipping_box_ai_v1.png")
    return out


def notice():
    out = img(32, 48)
    d = ImageDraw.Draw(out)
    d.ellipse([4, 39, 28, 45], fill=P["shadow"])
    d.rectangle([5, 11, 26, 31], fill=P["wood_dark"])
    d.rectangle([7, 13, 24, 28], fill=P["wood"])
    d.rectangle([9, 15, 22, 26], fill=P["paper"])
    d.rectangle([14, 31, 18, 42], fill=P["wood"])
    d.line([7, 13, 24, 13], fill=P["wood_hi"])
    d.point((11, 17), fill=P["paper_shadow"])
    d.point((20, 22), fill=P["paper_shadow"])
    save(out, PIXEL / "interaction/interaction_notice_board_empty_ai_v1.png")
    return out


def water():
    out = img(32, 32)
    d = ImageDraw.Draw(out)
    d.ellipse([3, 17, 29, 28], fill=P["water_dark"])
    d.ellipse([5, 16, 27, 25], fill=P["water"])
    d.arc([7, 17, 25, 25], 0, 180, fill=P["water_hi"])
    d.point((11, 20), fill=P["water_hi"])
    d.point((21, 21), fill=P["water_hi"])
    d.rectangle([6, 8, 10, 22], fill=P["wood_dark"])
    d.rectangle([22, 8, 25, 22], fill=P["wood_dark"])
    d.rectangle([8, 6, 24, 10], fill=P["wood"])
    d.line([8, 6, 24, 6], fill=P["wood_hi"])
    save(out, PIXEL / "water/water_pickup_point_ai_v1.png")
    return out


def seed_stall():
    out = img(48, 40)
    d = ImageDraw.Draw(out)
    d.ellipse([8, 31, 40, 38], fill=P["shadow"])
    d.polygon([(7, 7), (41, 7), (36, 17), (12, 17)], fill=(157, 62, 43, 255))
    d.line([8, 7, 40, 7], fill=(211, 102, 62, 255))
    d.rectangle([13, 17, 35, 30], fill=P["wood"])
    d.line([13, 18, 35, 18], fill=P["wood_hi"])
    d.rectangle([16, 21, 23, 27], fill=(103, 142, 64, 255))
    d.rectangle([26, 20, 32, 27], fill=P["paper"])
    d.point((29, 23), fill=P["grass_2"])
    d.rectangle([14, 30, 17, 34], fill=P["wood_dark"])
    d.rectangle([32, 30, 35, 34], fill=P["wood_dark"])
    save(out, PIXEL / "buildings/building_seed_stall_ai_v1.png")
    return out


def toolbar():
    out = img(96, 20)
    d = ImageDraw.Draw(out)
    for i in range(6):
        x = i * 16
        fill = P["ui_hi"] if i == 0 else P["ui"]
        d.rectangle([x, 2, x + 15, 17], fill=P["ui_dark"])
        d.rectangle([x + 1, 3, x + 14, 16], fill=fill)
        d.line([x + 1, 3, x + 14, 3], fill=(242, 205, 134, 255) if i == 0 else (128, 96, 69, 255))
    # hoe
    d.line([4, 6, 11, 14], fill=P["wood_dark"])
    d.line([10, 6, 14, 6], fill=P["ink"])
    d.point((13, 7), fill=P["ink"])
    # watering can
    x = 16
    d.rectangle([x + 5, 8, x + 11, 13], fill=P["water"])
    d.point((x + 7, 7), fill=P["water_hi"])
    d.arc([x + 9, 7, x + 15, 13], 270, 90, fill=P["ink"])
    # seed bag
    x = 32
    d.rectangle([x + 5, 6, x + 11, 14], fill=P["paper"])
    d.line([x + 5, 6, x + 11, 6], fill=P["paper_shadow"])
    d.point((x + 8, 10), fill=P["grass_2"])
    # hand
    x = 48
    d.rectangle([x + 6, 7, x + 11, 13], fill=P["skin"])
    d.line([x + 5, 9, x + 5, 12], fill=P["skin_shadow"])
    save(out, PIXEL / "ui/ui_toolbar_ai_v1.png")
    return out


def contact_sheet(items):
    out = img(260, 150)
    d = ImageDraw.Draw(out)
    y = 8
    for name, im in items:
        scaled = im.resize((im.width * 2, im.height * 2), Image.Resampling.NEAREST)
        out.alpha_composite(scaled, (8, y))
        d.text((8 + scaled.width + 8, y + 2), name, fill=(30, 28, 24, 255))
        y += max(scaled.height + 8, 24)
    save(out, RUN / "contact_sheet.png")


def metadata():
    data = {
        "run_id": "run_004_ai_p0_art_replace",
        "status": "generated",
        "source_reference": "asset_runs/run_004_ai_p0_art_replace/ai_p0_art_reference_board_v1.png",
        "assets": [
            {"asset_id": "terrain_p0_ai_v1", "file_path": "assets/pixel/terrain/terrain_p0_ai_v1.png", "replaces": "terrain_p0_strict_tiles", "sprite_size": "96x16", "tile_size": "16x16"},
            {"asset_id": "char_player_down_ai_v1", "file_path": "assets/pixel/characters/char_player_down_ai_v1.png", "replaces": "char_player_down_p0", "sprite_size": "80x32", "frame_size": "16x32", "pivot": "feet_center"},
            {"asset_id": "object_shipping_box_ai_v1", "file_path": "assets/pixel/y_sort/object_shipping_box_ai_v1.png", "replaces": "object_shipping_box_v1", "sprite_size": "16x24", "pivot": "bottom_center"},
            {"asset_id": "interaction_notice_board_empty_ai_v1", "file_path": "assets/pixel/interaction/interaction_notice_board_empty_ai_v1.png", "replaces": "interaction_notice_board_empty_v1", "sprite_size": "32x48", "pivot": "bottom_center"},
            {"asset_id": "water_pickup_point_ai_v1", "file_path": "assets/pixel/water/water_pickup_point_ai_v1.png", "replaces": "water_pickup_point_v1", "sprite_size": "32x32", "pivot": "bottom_center"},
            {"asset_id": "building_seed_stall_ai_v1", "file_path": "assets/pixel/buildings/building_seed_stall_ai_v1.png", "replaces": "programmatic_seed_stall_placeholder", "sprite_size": "48x40", "pivot": "bottom_center"},
            {"asset_id": "ui_toolbar_ai_v1", "file_path": "assets/pixel/ui/ui_toolbar_ai_v1.png", "replaces": "ui_toolbar_p0", "sprite_size": "96x20"}
        ]
    }
    (RUN / "metadata.json").write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")


def main():
    items = [
        ("terrain_ai_v1", terrain()),
        ("player_ai_v1", player()),
        ("shipping_box_ai_v1", shipping_box()),
        ("notice_ai_v1", notice()),
        ("water_ai_v1", water()),
        ("seed_stall_ai_v1", seed_stall()),
        ("toolbar_ai_v1", toolbar()),
    ]
    contact_sheet(items)
    metadata()


if __name__ == "__main__":
    main()
