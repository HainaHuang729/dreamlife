from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs/run_019_ai_npc_individuals"
SOURCE = RUN_DIR / "source"
PROCESSED = RUN_DIR / "processed"
DEST = ROOT / "stardew-tilemap-from-zero/assets/game/npcs"
PREVIEW = RUN_DIR / "npc_design_contact.png"

NPCS = [
    ("mira", "lin_lan", 96),
    ("theo", "he_tao", 96),
    ("lina", "liu_qing", 96),
    ("nannan", "nannan", 78),
    ("uncleChen", "uncle_chen", 96),
]

SPRITE_WIDTH = 96
SPRITE_HEIGHT = 120
ANCHOR_X = 48
ANCHOR_Y = 108
MAX_VISIBLE_WIDTH = 76
STATE_SUFFIXES = ["active", "ready", "completed"]
IDLE_FRAME_COUNT = 2
TALK_FRAME_COUNT = 2
LEGACY_ALIASES = {
    "mira": ["lin_lan"],
}


def is_key_pixel(r, g, b):
    return g > 135 and r < 95 and b < 95 and g - max(r, b) > 80


def remove_chroma_key(image):
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, _ = pixels[x, y]
            if is_key_pixel(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (r, g, b, 255)
    return rgba


def alpha_bbox(image):
    return image.getchannel("A").getbbox()


def quantize_opaque(image, colors=32):
    alpha = image.getchannel("A")
    rgb = Image.new("RGB", image.size, (0, 0, 0))
    rgb.paste(image.convert("RGB"), mask=alpha)
    quantized = rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert("RGBA")
    quantized.putalpha(alpha.point(lambda value: 255 if value > 0 else 0))
    return quantized


def normalized_sprite(image, target_visible_height):
    bbox = alpha_bbox(image)
    if not bbox:
        raise RuntimeError("No character pixels found in source image")

    character = image.crop(bbox)
    scale = min(target_visible_height / character.height, MAX_VISIBLE_WIDTH / character.width)
    width = max(1, round(character.width * scale))
    height = max(1, round(character.height * scale))
    character = character.resize((width, height), Image.Resampling.NEAREST)
    character = quantize_opaque(character)

    canvas = Image.new("RGBA", (SPRITE_WIDTH, SPRITE_HEIGHT), (0, 0, 0, 0))
    x = ANCHOR_X - width // 2
    y = ANCHOR_Y - height
    canvas.alpha_composite(character, (x, y))
    return canvas


def tint_pixel(pixel, delta):
    r, g, b, a = pixel
    if a == 0:
        return pixel
    return (
        max(0, min(255, r + delta)),
        max(0, min(255, g + delta)),
        max(0, min(255, b + delta)),
        a,
    )


def breathing_variant(frame):
    variant = frame.copy()
    bbox = alpha_bbox(frame)
    if not bbox:
        return variant

    left, top, right, bottom = bbox
    width = right - left
    height = bottom - top
    pixels = variant.load()

    # Keep the silhouette fixed and only move small internal cloth pixels.
    for y in (top + int(height * 0.45), top + int(height * 0.52)):
        for x in range(left + int(width * 0.34), right - int(width * 0.34) + 1):
            if 0 <= x < variant.width and 0 <= y < variant.height:
                pixels[x, y] = tint_pixel(pixels[x, y], 10)
            if 0 <= x < variant.width and 0 <= y + 1 < variant.height:
                pixels[x, y + 1] = tint_pixel(pixels[x, y + 1], -8)
    return variant


def talk_frame(frame, index):
    variant = breathing_variant(frame) if index else frame.copy()
    bbox = alpha_bbox(frame)
    if not bbox:
        return variant

    left, top, right, bottom = bbox
    height = bottom - top
    face_y = top + int(height * 0.24)
    mouth_y = top + int(height * 0.31)
    center_x = (left + right) // 2
    draw = ImageDraw.Draw(variant)

    if index:
        draw.rectangle((center_x - 3, mouth_y, center_x + 3, mouth_y + 1), fill=(74, 45, 43, 255))
        draw.point((center_x - 4, mouth_y - 1), fill=(222, 156, 116, 255))
        draw.point((center_x + 4, mouth_y - 1), fill=(222, 156, 116, 255))
    else:
        draw.line((center_x - 2, face_y + 7, center_x + 2, face_y + 7), fill=(93, 58, 51, 255), width=1)
    return variant


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

    sprites = []
    for npc_id, output_name, target_height in NPCS:
        source_path = SOURCE / f"{npc_id}.png"
        keyed = remove_chroma_key(Image.open(source_path))
        keyed.save(PROCESSED / f"{output_name}_alpha_source.png")

        sprite = normalized_sprite(keyed, target_height)
        out = PROCESSED / f"{output_name}.png"
        sprite.save(out)
        sprites.append((npc_id, sprite))

        (DEST / f"{npc_id}.png").write_bytes(out.read_bytes())
        for alias in LEGACY_ALIASES.get(npc_id, []):
            (DEST / f"{alias}.png").write_bytes(out.read_bytes())
        for suffix in STATE_SUFFIXES:
            (DEST / f"{npc_id}--{suffix}.png").write_bytes(out.read_bytes())
            for frame_index, idle_frame in enumerate([sprite, breathing_variant(sprite)]):
                idle_out = PROCESSED / f"{output_name}_{suffix}_{frame_index:02d}.png"
                idle_frame.save(idle_out)
                (DEST / f"{npc_id}--{suffix}_{frame_index:02d}.png").write_bytes(idle_out.read_bytes())
        for frame_index in range(TALK_FRAME_COUNT):
            talk = talk_frame(sprite, frame_index)
            talk_out = PROCESSED / f"{output_name}_talk_down_{frame_index:02d}.png"
            talk.save(talk_out)
            (DEST / f"{npc_id}--talk_down_{frame_index:02d}.png").write_bytes(talk_out.read_bytes())
            if frame_index == 0:
                (DEST / f"{npc_id}--talk_down.png").write_bytes(talk_out.read_bytes())

    contact = checker(len(sprites) * SPRITE_WIDTH, SPRITE_HEIGHT)
    for index, (_, sprite) in enumerate(sprites):
        contact.alpha_composite(sprite, (index * SPRITE_WIDTH, 0))
    contact.save(PREVIEW)

    talk_contact = checker(len(sprites) * SPRITE_WIDTH * TALK_FRAME_COUNT, SPRITE_HEIGHT)
    for npc_index, (_, sprite) in enumerate(sprites):
        for frame_index in range(TALK_FRAME_COUNT):
            talk_contact.alpha_composite(talk_frame(sprite, frame_index), ((npc_index * TALK_FRAME_COUNT + frame_index) * SPRITE_WIDTH, 0))
    talk_contact.save(RUN_DIR / "npc_talk_down_contact.png")

    for npc_id, sprite in sprites:
        print(f"{npc_id}: {sprite.size}, alpha_bbox={alpha_bbox(sprite)}")


if __name__ == "__main__":
    main()
