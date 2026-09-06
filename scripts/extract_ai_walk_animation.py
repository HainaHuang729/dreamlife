#!/usr/bin/env python3
"""Extract AI-generated walk atlas into 96x120 runtime animation frames."""

from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs" / "run_017_ai_walk_animation"
SOURCE = RUN_DIR / "source" / "walk_atlas.png"
PROCESSED_DIR = RUN_DIR / "processed"
PLAYER_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game" / "player"
TARGET_SIZE = (96, 120)
ANCHOR_Y = 108
SOURCE_DIRECTIONS = ["down", "up", "right"]
FRAME_COUNT = 4


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
            r, g, b, a = pixels[x, y]
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


def normalize_cell(cell: Image.Image) -> Image.Image:
    clean = remove_green(cell)
    box = alpha_bbox(clean)
    out = Image.new("RGBA", TARGET_SIZE, (0, 0, 0, 0))
    if not box:
        return out

    box = pad_box(box, 8, clean.size)
    subject = clean.crop(box)
    src_w, src_h = subject.size
    scale = min(76 / src_w, 96 / src_h)
    dest_w = max(1, round(src_w * scale))
    dest_h = max(1, round(src_h * scale))
    subject = subject.resize((dest_w, dest_h), Image.Resampling.NEAREST)

    paste_x = (TARGET_SIZE[0] - dest_w) // 2
    paste_y = max(0, ANCHOR_Y - dest_h)
    out.alpha_composite(subject, (paste_x, paste_y))
    return out


def crop_grid_cell(image: Image.Image, row: int, col: int, rows: int, cols: int) -> Image.Image:
    width, height = image.size
    left = round(col * width / cols)
    right = round((col + 1) * width / cols)
    top = round(row * height / rows)
    bottom = round((row + 1) * height / rows)
    return image.crop((left, top, right, bottom))


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
                if px < min_x:
                    min_x = px
                if px > max_x:
                    max_x = px
                if py < min_y:
                    min_y = py
                if py > max_y:
                    max_y = py

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
    if len(boxes) != len(SOURCE_DIRECTIONS) * FRAME_COUNT:
        raise RuntimeError(f"expected 12 walk components, found {len(boxes)}: {boxes}")

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

    if len(rows) != len(SOURCE_DIRECTIONS) or any(len(row) != FRAME_COUNT for row in rows):
        raise RuntimeError(f"unexpected row grouping: {[len(row) for row in rows]} from {boxes}")

    cells: dict[tuple[int, int], Image.Image] = {}
    width, height = atlas.size
    for row_index, row in enumerate(rows):
        for col_index, box in enumerate(sorted(row, key=lambda item: (item[0] + item[2]) / 2)):
            expanded = pad_box(box, 35, (width, height))
            cells[(row_index, col_index)] = atlas.crop(expanded)
    return cells


def save_frame(frame: Image.Image, direction: str, index: int) -> None:
    name = f"walk_{direction}_{index:02d}.png"
    frame.save(PLAYER_DIR / name)
    frame.save(PROCESSED_DIR / name)
    if index == 0:
        frame.save(PLAYER_DIR / f"walk_{direction}.png")


def make_contact(frames: dict[tuple[str, int], Image.Image]) -> Image.Image:
    directions = ["down", "up", "left", "right"]
    cell_w, cell_h = 100, 124
    sheet = Image.new("RGBA", (cell_w * FRAME_COUNT, cell_h * len(directions)), (0, 0, 0, 0))
    for row, direction in enumerate(directions):
        for index in range(FRAME_COUNT):
            frame = frames[(direction, index)]
            sheet.alpha_composite(frame, (index * cell_w + 1, row * cell_h + 1))
    return sheet


def make_gif(frames: list[Image.Image], out: Path) -> None:
    scaled = [frame.resize((192, 240), Image.Resampling.NEAREST) for frame in frames]
    scaled[0].save(out, save_all=True, append_images=scaled[1:], duration=135, loop=0, disposal=2)


def main() -> None:
    PLAYER_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    atlas = Image.open(SOURCE).convert("RGB")
    frames: dict[tuple[str, int], Image.Image] = {}
    component_cells = subject_cells_from_components(atlas)

    for row, direction in enumerate(SOURCE_DIRECTIONS):
        for index in range(FRAME_COUNT):
            cell = component_cells[(row, index)]
            frame = normalize_cell(cell)
            frames[(direction, index)] = frame
            save_frame(frame, direction, index)

    for index in range(FRAME_COUNT):
        frame = frames[("right", index)].transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        frames[("left", index)] = frame
        save_frame(frame, "left", index)

    contact = make_contact(frames)
    contact.save(RUN_DIR / "walk_animation_contact.png")
    for direction in ["down", "up", "left", "right"]:
        make_gif([frames[(direction, index)] for index in range(FRAME_COUNT)], RUN_DIR / f"walk_{direction}.gif")

    print("extracted AI walk animation: 4 directions x 4 frames")
    print(f"contact sheet: {RUN_DIR / 'walk_animation_contact.png'}")


if __name__ == "__main__":
    main()
