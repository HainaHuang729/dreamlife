from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "asset_runs/run_018_ai_npc_designs/source/npc_design_atlas.png"
PROCESSED = ROOT / "asset_runs/run_018_ai_npc_designs/processed"
DEST = ROOT / "stardew-tilemap-from-zero/assets/game/npcs"
PREVIEW = ROOT / "asset_runs/run_018_ai_npc_designs/npc_design_contact.png"

NPCS = [
    ("mira", "lin_lan", 68),
    ("theo", "he_tao", 68),
    ("lina", "liu_qing", 68),
    ("nannan", "nannan", 55),
    ("uncleChen", "uncle_chen", 68),
]

SPRITE_WIDTH = 64
SPRITE_HEIGHT = 80
ANCHOR_X = 32
ANCHOR_Y = 72
MAX_VISIBLE_WIDTH = 54
STATE_SUFFIXES = ["active", "ready", "completed"]


def is_key_pixel(r, g, b):
    return g > 135 and r < 95 and b < 95 and g - max(r, b) > 85


def with_chroma_alpha(image):
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if is_key_pixel(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def alpha_bbox(image):
    alpha = image.getchannel("A")
    return alpha.getbbox()


def normalized_sprite(cell, target_visible_height):
    bbox = alpha_bbox(cell)
    if not bbox:
        raise RuntimeError("No character pixels found in atlas cell")

    character = cell.crop(bbox)
    scale = min(target_visible_height / character.height, MAX_VISIBLE_WIDTH / character.width)
    width = max(1, round(character.width * scale))
    height = max(1, round(character.height * scale))
    character = character.resize((width, height), Image.Resampling.NEAREST)

    canvas = Image.new("RGBA", (SPRITE_WIDTH, SPRITE_HEIGHT), (0, 0, 0, 0))
    x = ANCHOR_X - width // 2
    y = ANCHOR_Y - height
    canvas.alpha_composite(character, (x, y))
    return canvas


def checker(width, height):
    image = Image.new("RGBA", (width, height), (235, 228, 209, 255))
    draw = ImageDraw.Draw(image)
    size = 8
    for y in range(0, height, size):
        for x in range(0, width, size):
            if (x // size + y // size) % 2:
                draw.rectangle((x, y, x + size - 1, y + size - 1), fill=(211, 202, 181, 255))
    return image


def main():
    PROCESSED.mkdir(parents=True, exist_ok=True)
    DEST.mkdir(parents=True, exist_ok=True)

    source = with_chroma_alpha(Image.open(SOURCE))
    source.save(PROCESSED / "npc_design_atlas_alpha.png")

    cell_width = source.width / len(NPCS)
    sprites = []
    for index, (npc_id, source_name, target_height) in enumerate(NPCS):
        left = round(index * cell_width)
        right = round((index + 1) * cell_width)
        cell = source.crop((left, 0, right, source.height))
        sprite = normalized_sprite(cell, target_height)
        sprites.append((npc_id, sprite))

        source_out = PROCESSED / f"{source_name}.png"
        sprite.save(source_out)
        (DEST / f"{npc_id}.png").write_bytes(source_out.read_bytes())
        for suffix in STATE_SUFFIXES:
            (DEST / f"{npc_id}--{suffix}.png").write_bytes(source_out.read_bytes())

    contact = checker(len(sprites) * SPRITE_WIDTH, SPRITE_HEIGHT)
    for index, (_, sprite) in enumerate(sprites):
        contact.alpha_composite(sprite, (index * SPRITE_WIDTH, 0))
    contact.save(PREVIEW)

    for npc_id, sprite in sprites:
        bbox = alpha_bbox(sprite)
        print(f"{npc_id}: {sprite.size}, alpha_bbox={bbox}")


if __name__ == "__main__":
    main()
