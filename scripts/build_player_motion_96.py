#!/usr/bin/env python3
"""Build 96x120 player runtime sprites from the current AI source assets."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs" / "run_020_player_motion_96"
PROCESSED_DIR = RUN_DIR / "processed"
PLAYER_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game" / "player"
WALK_SOURCE = ROOT / "asset_runs" / "run_017_ai_walk_animation" / "source" / "walk_atlas.png"

TARGET_SIZE = (96, 120)
ANCHOR_X = 48
ANCHOR_Y = 108
VISIBLE_HEIGHT = 96
MAX_VISIBLE_WIDTH = 76
SOURCE_DIRECTIONS = ["down", "up", "right"]
DIRECTIONS = ["down", "up", "left", "right"]
WALK_FRAME_COUNT = 4
RUN_FRAME_COUNT = 6
RUN_SOURCE_SEQUENCE = [0, 1, 2, 3, 2, 1]
COMMON_ACTIONS = [
    "inspect",
    "hoe",
    "seeds",
    "wateringCan",
    "scythe",
    "fishingRod",
    "fishingCatch",
    "harvest",
    "sleep",
    "warp",
]


def is_chroma_green(r: int, g: int, b: int) -> bool:
    if g >= 115 and r <= 120 and b <= 120 and g >= r * 1.35 and g >= b * 1.35:
        return True
    return g >= 42 and g - r >= 16 and g - b >= 16 and g >= r * 1.18 and g >= b * 1.18


def remove_green(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if is_chroma_green(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
    return rgba


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int] | None:
    return image.getchannel("A").getbbox()


def pad_box(box: tuple[int, int, int, int], pad: int, size: tuple[int, int]) -> tuple[int, int, int, int]:
    left, top, right, bottom = box
    width, height = size
    return (
        max(0, left - pad),
        max(0, top - pad),
        min(width, right + pad),
        min(height, bottom + pad),
    )


def quantize_opaque(image: Image.Image, colors: int = 32) -> Image.Image:
    alpha = image.getchannel("A")
    rgb = Image.new("RGB", image.size, (0, 0, 0))
    rgb.paste(image.convert("RGB"), mask=alpha)
    quantized = rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT).convert("RGBA")
    quantized.putalpha(alpha.point(lambda value: 255 if value > 0 else 0))
    return quantized


def normalize_subject(subject: Image.Image, visible_height: int = VISIBLE_HEIGHT, max_width: int = MAX_VISIBLE_WIDTH) -> Image.Image:
    clean = subject.convert("RGBA")
    box = alpha_bbox(clean)
    out = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
    if not box:
        return out

    cropped = clean.crop(box)
    src_w, src_h = cropped.size
    scale = min(max_width / src_w, visible_height / src_h)
    dest_w = max(1, round(src_w * scale))
    dest_h = max(1, round(src_h * scale))
    cropped = cropped.resize((dest_w, dest_h), Image.Resampling.NEAREST)
    cropped = quantize_opaque(cropped)

    paste_x = ANCHOR_X - dest_w // 2
    paste_y = ANCHOR_Y - dest_h
    out.alpha_composite(cropped, (paste_x, paste_y))
    return out


def normalize_atlas_cell(cell: Image.Image) -> Image.Image:
    clean = remove_green(cell)
    box = alpha_bbox(clean)
    if not box:
        return Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
    box = pad_box(box, 8, clean.size)
    return normalize_subject(clean.crop(box))


def component_boxes(image: Image.Image) -> list[tuple[int, int, int, int]]:
    clean = remove_green(image)
    alpha = clean.getchannel("A")
    width, height = alpha.size
    data = alpha.load()
    seen = bytearray(width * height)
    boxes: list[tuple[int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if seen[idx] or data[x, y] == 0:
                continue

            stack = [(x, y)]
            seen[idx] = 1
            min_x = max_x = x
            min_y = max_y = y
            count = 0

            while stack:
                px, py = stack.pop()
                count += 1
                min_x = min(min_x, px)
                max_x = max(max_x, px)
                min_y = min(min_y, py)
                max_y = max(max_y, py)

                for nx, ny in ((px - 1, py), (px + 1, py), (px, py - 1), (px, py + 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nidx = ny * width + nx
                    if seen[nidx] or data[nx, ny] == 0:
                        continue
                    seen[nidx] = 1
                    stack.append((nx, ny))

            box = (min_x, min_y, max_x + 1, max_y + 1)
            box_w = box[2] - box[0]
            box_h = box[3] - box[1]
            if count >= 600 and box_w >= 45 and box_h >= 70:
                boxes.append(box)

    return boxes


def subject_cells_from_components(atlas: Image.Image) -> dict[tuple[int, int], Image.Image]:
    boxes = component_boxes(atlas)
    expected = len(SOURCE_DIRECTIONS) * WALK_FRAME_COUNT
    if len(boxes) != expected:
        raise RuntimeError(f"expected {expected} walk components, found {len(boxes)}: {boxes}")

    rows: list[list[tuple[int, int, int, int]]] = []
    for box in sorted(boxes, key=lambda item: (item[1] + item[3]) / 2):
        center_y = (box[1] + box[3]) / 2
        for row in rows:
            row_center = sum((item[1] + item[3]) / 2 for item in row) / len(row)
            if abs(center_y - row_center) < 130:
                row.append(box)
                break
        else:
            rows.append([box])

    if len(rows) != len(SOURCE_DIRECTIONS) or any(len(row) != WALK_FRAME_COUNT for row in rows):
        raise RuntimeError(f"unexpected row grouping: {[len(row) for row in rows]} from {boxes}")

    cells: dict[tuple[int, int], Image.Image] = {}
    width, height = atlas.size
    for row_index, row in enumerate(rows):
        for col_index, box in enumerate(sorted(row, key=lambda item: (item[0] + item[2]) / 2)):
            expanded = pad_box(box, 35, (width, height))
            cells[(row_index, col_index)] = atlas.crop(expanded)
    return cells


def save_player_frame(action: str, direction: str, frame: Image.Image, index: int | None = None) -> None:
    suffix = f"_{index:02d}" if index is not None else ""
    name = f"{action}_{direction}{suffix}.png"
    frame.save(PLAYER_DIR / name)
    frame.save(PROCESSED_DIR / name)


def breathing_variant(frame: Image.Image) -> Image.Image:
    return frame.copy()


def checker(width: int, height: int) -> Image.Image:
    image = Image.new("RGBA", (width, height), (235, 228, 209, 255))
    draw = ImageDraw.Draw(image)
    size = 8
    for y in range(0, height, size):
        for x in range(0, width, size):
            if (x // size + y // size) % 2:
                draw.rectangle((x, y, x + size - 1, y + size - 1), fill=(211, 202, 181, 255))
    return image


def make_contact(frames: dict[tuple[str, int], Image.Image], action: str, frame_count: int) -> None:
    cell_w, cell_h = TARGET_SIZE[0] + 4, TARGET_SIZE[1] + 4
    sheet = checker(cell_w * frame_count, cell_h * len(DIRECTIONS))
    for row, direction in enumerate(DIRECTIONS):
        for index in range(frame_count):
            sheet.alpha_composite(frames[(direction, index)], (index * cell_w + 2, row * cell_h + 2))
    sheet.save(RUN_DIR / f"player_{action}_contact.png")


def make_gif(frames: list[Image.Image], out: Path, duration: int) -> None:
    scaled = [frame.resize((192, 240), Image.Resampling.NEAREST) for frame in frames]
    scaled[0].save(out, save_all=True, append_images=scaled[1:], duration=duration, loop=0, disposal=2)


def build_walk_frames() -> dict[tuple[str, int], Image.Image]:
    atlas = Image.open(WALK_SOURCE).convert("RGB")
    cells = subject_cells_from_components(atlas)
    frames: dict[tuple[str, int], Image.Image] = {}

    for row, direction in enumerate(SOURCE_DIRECTIONS):
        for index in range(WALK_FRAME_COUNT):
            frame = normalize_atlas_cell(cells[(row, index)])
            frames[(direction, index)] = frame

    for index in range(WALK_FRAME_COUNT):
        frames[("left", index)] = frames[("right", index)].transpose(Image.Transpose.FLIP_LEFT_RIGHT)

    for direction in DIRECTIONS:
        for index in range(WALK_FRAME_COUNT):
            save_player_frame("walk", direction, frames[(direction, index)], index)
        save_player_frame("walk", direction, frames[(direction, 0)])

    make_contact(frames, "walk", WALK_FRAME_COUNT)
    for direction in DIRECTIONS:
        make_gif([frames[(direction, index)] for index in range(WALK_FRAME_COUNT)], RUN_DIR / f"walk_{direction}.gif", 135)
    return frames


def build_idle_frames(walk_frames: dict[tuple[str, int], Image.Image]) -> None:
    frames: dict[tuple[str, int], Image.Image] = {}
    for direction in DIRECTIONS:
        base = walk_frames[(direction, 0)]
        frames[(direction, 0)] = base
        frames[(direction, 1)] = breathing_variant(base)
        save_player_frame("idle", direction, frames[(direction, 0)], 0)
        save_player_frame("idle", direction, frames[(direction, 1)], 1)
        save_player_frame("idle", direction, frames[(direction, 0)])

    make_contact(frames, "idle", 2)
    for direction in DIRECTIONS:
        make_gif([frames[(direction, index)] for index in range(2)], RUN_DIR / f"idle_{direction}.gif", 520)


def build_run_frames(walk_frames: dict[tuple[str, int], Image.Image]) -> None:
    frames: dict[tuple[str, int], Image.Image] = {}
    for direction in DIRECTIONS:
        for index, source_index in enumerate(RUN_SOURCE_SEQUENCE):
            frame = walk_frames[(direction, source_index)]
            frames[(direction, index)] = frame
            save_player_frame("run", direction, frame, index)
        save_player_frame("run", direction, frames[(direction, 0)])

    make_contact(frames, "run", RUN_FRAME_COUNT)
    for direction in DIRECTIONS:
        make_gif([frames[(direction, index)] for index in range(RUN_FRAME_COUNT)], RUN_DIR / f"run_{direction}.gif", 90)


def migrate_common_actions() -> None:
    for action in COMMON_ACTIONS:
        for direction in DIRECTIONS:
            source_path = PLAYER_DIR / f"{action}_{direction}.png"
            if not source_path.exists():
                continue
            frame = normalize_subject(Image.open(source_path), visible_height=96, max_width=88)
            save_player_frame(action, direction, frame)


def main() -> None:
    PLAYER_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    RUN_DIR.mkdir(parents=True, exist_ok=True)

    walk_frames = build_walk_frames()
    build_idle_frames(walk_frames)
    build_run_frames(walk_frames)
    migrate_common_actions()

    print("built player runtime sprites at 96x120")
    print(f"contact sheets: {RUN_DIR}")


if __name__ == "__main__":
    main()
