#!/usr/bin/env python3
"""Build 96x120 multi-frame player tool/action sprites.

This keeps the current AI-generated farmer body as the source silhouette and
adds deterministic pixel-clean tool poses for runtime actions. Source previews
and GIFs are archived under asset_runs; runtime PNGs are written to assets/game.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
RUN_DIR = ROOT / "asset_runs" / "run_021_player_tool_actions_96"
PROCESSED_DIR = RUN_DIR / "processed"
PLAYER_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game" / "player"

TARGET_SIZE = (96, 120)
DIRECTIONS = ["down", "up", "left", "right"]
ACTION_FRAME_COUNTS = {
    "inspect": 4,
    "hoe": 5,
    "wateringCan": 5,
    "scythe": 6,
    "fishingRod": 6,
    "fishingCatch": 6,
    "harvest": 5,
}

PALETTE = {
    "outline": (44, 32, 27, 255),
    "wood_dark": (92, 58, 35, 255),
    "wood": (142, 91, 47, 255),
    "metal_dark": (96, 105, 108, 255),
    "metal": (168, 176, 172, 255),
    "metal_light": (222, 226, 214, 255),
    "water_dark": (45, 126, 174, 255),
    "water": (86, 177, 214, 255),
    "water_light": (163, 226, 235, 255),
    "crop_dark": (88, 103, 48, 255),
    "crop": (210, 151, 54, 255),
    "crop_light": (242, 198, 84, 255),
    "paper": (236, 220, 171, 255),
    "paper_dark": (159, 129, 73, 255),
    "skin": (208, 137, 91, 255),
}


def open_base(direction: str, index: int = 0) -> Image.Image:
    path = PLAYER_DIR / f"idle_{direction}_{index:02d}.png"
    if not path.exists():
        path = PLAYER_DIR / f"idle_{direction}.png"
    return Image.open(path).convert("RGBA")


def save_frame(action: str, direction: str, frame: Image.Image, index: int | None = None) -> None:
    suffix = f"_{index:02d}" if index is not None else ""
    name = f"{action}_{direction}{suffix}.png"
    frame.save(PLAYER_DIR / name)
    frame.save(PROCESSED_DIR / name)


def draw_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str, width: int = 2) -> None:
    draw.line(points, fill=PALETTE[color], width=width)


def draw_polyline_with_outline(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: str, width: int = 2) -> None:
    draw.line(points, fill=PALETTE["outline"], width=width + 2)
    draw.line(points, fill=PALETTE[color], width=width)


def draw_rect(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], color: str, outline: bool = True) -> None:
    if outline:
        left, top, right, bottom = box
        draw.rectangle((left - 1, top - 1, right + 1, bottom + 1), fill=PALETTE["outline"])
    draw.rectangle(box, fill=PALETTE[color])


def draw_handle(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], width: int = 3) -> None:
    draw_polyline_with_outline(draw, [start, end], "wood", width)


def draw_hoe_head(draw: ImageDraw.ImageDraw, center: tuple[int, int], horizontal: bool = True) -> None:
    cx, cy = center
    if horizontal:
        draw_rect(draw, (cx - 8, cy - 2, cx + 8, cy + 2), "metal")
        draw_rect(draw, (cx + 5, cy - 2, cx + 9, cy + 5), "metal_dark", outline=False)
    else:
        draw_rect(draw, (cx - 2, cy - 8, cx + 2, cy + 8), "metal")
        draw_rect(draw, (cx - 5, cy + 5, cx + 2, cy + 9), "metal_dark", outline=False)


def draw_scythe_blade(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]]) -> None:
    draw.line(points, fill=PALETTE["outline"], width=4)
    draw.line(points, fill=PALETTE["metal_light"], width=2)
    if len(points) >= 2:
        draw.line([points[-2], points[-1]], fill=PALETTE["metal"], width=2)


def draw_crop_bundle(draw: ImageDraw.ImageDraw, x: int, y: int, lifted: bool = False) -> None:
    for offset in (-4, 0, 4):
        draw.line((x, y + 8, x + offset, y - 6), fill=PALETTE["crop_dark"], width=2)
        draw.rectangle((x + offset - 2, y - 8, x + offset + 2, y - 4), fill=PALETTE["crop_light"])
    if lifted:
        draw_rect(draw, (x - 7, y - 3, x + 7, y + 4), "crop", outline=True)


def draw_water_drops(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]]) -> None:
    for i, (x, y) in enumerate(points):
        color = "water_light" if i % 2 else "water"
        draw.rectangle((x, y, x + 1, y + 3), fill=PALETTE[color])


def draw_watering_can(draw: ImageDraw.ImageDraw, x: int, y: int, direction: str, pouring: bool = False) -> None:
    draw_rect(draw, (x - 8, y - 6, x + 6, y + 6), "metal")
    draw.rectangle((x - 5, y - 9, x + 2, y - 6), fill=PALETTE["metal_dark"])
    if direction == "left":
        draw_rect(draw, (x - 16, y - 4, x - 8, y), "metal_dark", outline=True)
        stream = [(x - 22, y + 4), (x - 25, y + 10), (x - 28, y + 16), (x - 30, y + 22)]
    elif direction == "right":
        draw_rect(draw, (x + 6, y - 4, x + 14, y), "metal_dark", outline=True)
        stream = [(x + 16, y + 4), (x + 18, y + 10), (x + 20, y + 16), (x + 22, y + 22)]
    elif direction == "up":
        draw_rect(draw, (x - 2, y - 15, x + 4, y - 7), "metal_dark", outline=True)
        stream = [(x, y - 21), (x - 2, y - 26), (x + 2, y - 31), (x, y - 36)]
    else:
        draw_rect(draw, (x - 2, y + 6, x + 4, y + 14), "metal_dark", outline=True)
        stream = [(x, y + 14), (x - 2, y + 20), (x + 2, y + 26), (x, y + 30)]
    if pouring:
        draw_water_drops(draw, stream)


def draw_fishing_rod(draw: ImageDraw.ImageDraw, start: tuple[int, int], rod_points: list[tuple[int, int]], line_end: tuple[int, int] | None, bent: bool = False) -> None:
    points = [start, *rod_points]
    draw.line(points, fill=PALETTE["outline"], width=3)
    draw.line(points, fill=PALETTE["wood"], width=1 if bent else 2)
    if line_end:
        tip = rod_points[-1]
        draw.line((tip[0], tip[1], line_end[0], line_end[1]), fill=PALETTE["metal_light"], width=1)
        draw.rectangle((line_end[0] - 1, line_end[1] - 1, line_end[0] + 1, line_end[1] + 1), fill=PALETTE["water"])


def draw_inspect_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    lift = [0, -3, -1, 0][frame_index]
    if direction == "down":
        draw_rect(draw, (39, 54 + lift, 55, 66 + lift), "paper")
        draw.line((43, 58 + lift, 51, 58 + lift), fill=PALETTE["paper_dark"], width=1)
        draw.line((43, 62 + lift, 49, 62 + lift), fill=PALETTE["paper_dark"], width=1)
    elif direction == "up":
        draw_rect(draw, (40, 42 + lift, 54, 54 + lift), "paper")
        draw.line((43, 46 + lift, 50, 46 + lift), fill=PALETTE["paper_dark"], width=1)
    elif direction == "right":
        draw_rect(draw, (56, 53 + lift, 70, 64 + lift), "paper")
        draw.line((59, 57 + lift, 67, 57 + lift), fill=PALETTE["paper_dark"], width=1)
    else:
        draw_rect(draw, (26, 53 + lift, 40, 64 + lift), "paper")
        draw.line((29, 57 + lift, 37, 57 + lift), fill=PALETTE["paper_dark"], width=1)


def draw_hoe_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    down = [
        ((53, 56), (66, 28), (70, 27), True),
        ((55, 60), (76, 44), (78, 43), True),
        ((51, 61), (57, 91), (57, 92), True),
        ((50, 62), (42, 91), (42, 92), True),
        ((54, 58), (66, 72), (67, 73), True),
    ]
    up = [
        ((43, 57), (33, 29), (29, 27), True),
        ((40, 58), (22, 44), (20, 43), True),
        ((47, 60), (42, 79), (42, 81), True),
        ((51, 61), (60, 83), (60, 85), True),
        ((42, 58), (30, 72), (29, 73), True),
    ]
    right = [
        ((59, 58), (75, 33), (78, 31), False),
        ((61, 60), (85, 53), (86, 53), False),
        ((61, 62), (79, 85), (80, 86), True),
        ((60, 62), (68, 92), (68, 93), True),
        ((60, 58), (76, 68), (78, 68), False),
    ]
    poses = {"down": down, "up": up, "right": right, "left": right}
    start, end, head, horizontal = poses[direction][frame_index]
    if direction == "left":
        start = (96 - start[0], start[1])
        end = (96 - end[0], end[1])
        head = (96 - head[0], head[1])
    draw_handle(draw, start, end)
    draw_hoe_head(draw, head, horizontal=horizontal)


def draw_watering_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    pouring = frame_index in {2, 3}
    offsets = {
        "down": [(56, 62), (60, 66), (58, 73), (56, 74), (55, 64)],
        "up": [(40, 54), (36, 50), (36, 43), (39, 42), (40, 53)],
        "right": [(61, 59), (66, 62), (70, 66), (70, 68), (62, 60)],
        "left": [(35, 59), (30, 62), (26, 66), (26, 68), (34, 60)],
    }
    x, y = offsets[direction][frame_index]
    draw_watering_can(draw, x, y, direction, pouring)


def draw_scythe_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    if direction in {"left", "right"}:
        sign = 1 if direction == "right" else -1
        hand = (48 + sign * 11, 61)
        ends = [
            (48 + sign * 4, 35),
            (48 + sign * 24, 43),
            (48 + sign * 38, 58),
            (48 + sign * 30, 80),
            (48 + sign * 10, 91),
            (48 + sign * 18, 68),
        ]
        end = ends[frame_index]
        draw_handle(draw, hand, end, 3)
        blade_tip = (max(4, min(91, end[0] + sign * 15)), end[1] - (6 if frame_index < 3 else -2))
        blade_mid = (max(4, min(91, end[0] + sign * 8)), end[1] - (14 if frame_index < 3 else 8))
        draw_scythe_blade(draw, [end, blade_mid, blade_tip])
        return

    hand = (53, 60) if direction == "down" else (43, 58)
    ends = {
        "down": [(67, 33), (80, 50), (80, 70), (63, 88), (38, 88), (59, 70)],
        "up": [(29, 33), (18, 50), (18, 70), (33, 84), (58, 85), (36, 68)],
    }[direction]
    end = ends[frame_index]
    draw_handle(draw, hand, end, 3)
    if direction == "down":
        blade = [end, (min(91, end[0] + 10), max(18, end[1] - 10)), (min(92, end[0] + 19), end[1] - 2)]
    else:
        blade = [end, (max(4, end[0] - 10), max(18, end[1] - 10)), (max(4, end[0] - 19), end[1] - 2)]
    draw_scythe_blade(draw, blade)


def draw_fishing_cast_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    if direction == "right":
        start = (61, 57)
        poses = [
            [(70, 34), (77, 18)],
            [(78, 38), (92, 30)],
            [(82, 52), (91, 60)],
            [(78, 64), (88, 82)],
            [(75, 58), (84, 76)],
            [(75, 57), (88, 73)],
        ]
        line_ends = [None, (90, 34), (89, 69), (84, 91), (82, 94), (82, 94)]
    elif direction == "left":
        start = (35, 57)
        poses = [[(96 - x, y) for x, y in pose] for pose in [
            [(70, 34), (77, 18)],
            [(78, 38), (92, 30)],
            [(82, 52), (91, 60)],
            [(78, 64), (88, 82)],
            [(75, 58), (84, 76)],
            [(75, 57), (88, 73)],
        ]]
        line_ends = [None, (6, 34), (7, 69), (12, 91), (14, 94), (14, 94)]
    elif direction == "up":
        start = (44, 54)
        poses = [[(37, 35), (32, 17)], [(31, 33), (23, 24)], [(35, 25), (42, 9)], [(49, 27), (56, 12)], [(52, 35), (61, 20)], [(56, 42), (64, 28)]]
        line_ends = [None, (24, 26), (42, 8), (57, 12), (62, 18), (62, 18)]
    else:
        start = (52, 58)
        poses = [[(63, 35), (70, 20)], [(74, 45), (87, 42)], [(72, 62), (83, 78)], [(64, 72), (67, 95)], [(60, 68), (60, 94)], [(58, 64), (58, 92)]]
        line_ends = [None, (86, 44), (81, 84), (66, 100), (60, 100), (60, 100)]
    draw_fishing_rod(draw, start, poses[frame_index], line_ends[frame_index])


def draw_fishing_reel_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    bend = [0, 3, 7, 9, 5, 2][frame_index]
    if direction == "right":
        start = (61, 57)
        rod = [(76, 56 - bend), (90, 68 + bend // 2)]
        end = (84 - frame_index, 94 - frame_index * 3)
    elif direction == "left":
        start = (35, 57)
        rod = [(20, 56 - bend), (6, 68 + bend // 2)]
        end = (12 + frame_index, 94 - frame_index * 3)
    elif direction == "up":
        start = (44, 54)
        rod = [(50 + bend // 2, 34), (57 + bend, 16)]
        end = (58, 22 + frame_index * 4)
    else:
        start = (52, 58)
        rod = [(58 + bend // 2, 74), (58 + bend, 96)]
        end = (58, 100 - frame_index * 3)
    draw_fishing_rod(draw, start, rod, end, bent=True)
    if frame_index in {1, 3, 5}:
        draw.rectangle((46, 59, 50, 63), fill=PALETTE["metal"])


def draw_harvest_overlay(draw: ImageDraw.ImageDraw, direction: str, frame_index: int) -> None:
    if direction == "right":
        x = [66, 72, 76, 67, 60][frame_index]
        y = [82, 78, 72, 62, 57][frame_index]
    elif direction == "left":
        x = [30, 24, 20, 29, 36][frame_index]
        y = [82, 78, 72, 62, 57][frame_index]
    elif direction == "up":
        x = [41, 36, 34, 42, 46][frame_index]
        y = [72, 63, 53, 48, 55][frame_index]
    else:
        x = [55, 60, 62, 54, 48][frame_index]
        y = [78, 82, 88, 68, 59][frame_index]
    if frame_index < 3:
        draw_crop_bundle(draw, x, y)
        if direction in {"left", "right"}:
            sign = 1 if direction == "right" else -1
            draw.line((48 + sign * 7, 62, x, y - 4), fill=PALETTE["metal_light"], width=2)
        else:
            draw.line((50, 62, x, y - 4), fill=PALETTE["metal_light"], width=2)
    else:
        draw_crop_bundle(draw, x, y, lifted=True)


def render_action_frame(action: str, direction: str, frame_index: int) -> Image.Image:
    base = open_base(direction, frame_index % 2).copy()
    draw = ImageDraw.Draw(base)
    if action == "inspect":
        draw_inspect_overlay(draw, direction, frame_index)
    elif action == "hoe":
        draw_hoe_overlay(draw, direction, frame_index)
    elif action == "wateringCan":
        draw_watering_overlay(draw, direction, frame_index)
    elif action == "scythe":
        draw_scythe_overlay(draw, direction, frame_index)
    elif action == "fishingRod":
        draw_fishing_cast_overlay(draw, direction, frame_index)
    elif action == "fishingCatch":
        draw_fishing_reel_overlay(draw, direction, frame_index)
    elif action == "harvest":
        draw_harvest_overlay(draw, direction, frame_index)
    return base


def checker(width: int, height: int) -> Image.Image:
    image = Image.new("RGBA", (width, height), (235, 228, 209, 255))
    draw = ImageDraw.Draw(image)
    size = 8
    for y in range(0, height, size):
        for x in range(0, width, size):
            if (x // size + y // size) % 2:
                draw.rectangle((x, y, x + size - 1, y + size - 1), fill=(211, 202, 181, 255))
    return image


def make_contact(action: str, frames: dict[tuple[str, int], Image.Image], frame_count: int) -> Path:
    cell_w, cell_h = TARGET_SIZE[0] + 4, TARGET_SIZE[1] + 4
    sheet = checker(cell_w * frame_count, cell_h * len(DIRECTIONS))
    for row, direction in enumerate(DIRECTIONS):
        for index in range(frame_count):
            sheet.alpha_composite(frames[(direction, index)], (index * cell_w + 2, row * cell_h + 2))
    out = RUN_DIR / f"player_{action}_contact.png"
    sheet.save(out)
    return out


def make_combined_contact(paths: list[Path]) -> None:
    sheets = [Image.open(path).convert("RGBA") for path in paths]
    width = max(sheet.width for sheet in sheets)
    height = sum(sheet.height + 8 for sheet in sheets) - 8
    combined = checker(width, height)
    y = 0
    for sheet in sheets:
        combined.alpha_composite(sheet, (0, y))
        y += sheet.height + 8
    combined.save(RUN_DIR / "player_tools_contact.png")


def make_gif(action: str, direction: str, frames: list[Image.Image], duration: int) -> None:
    scaled = [frame.resize((192, 240), Image.Resampling.NEAREST) for frame in frames]
    scaled[0].save(RUN_DIR / f"{action}_{direction}.gif", save_all=True, append_images=scaled[1:], duration=duration, loop=0, disposal=2)


def main() -> None:
    RUN_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    PLAYER_DIR.mkdir(parents=True, exist_ok=True)

    contact_paths: list[Path] = []
    for action, frame_count in ACTION_FRAME_COUNTS.items():
        frames: dict[tuple[str, int], Image.Image] = {}
        for direction in DIRECTIONS:
            sequence: list[Image.Image] = []
            for index in range(frame_count):
                frame = render_action_frame(action, direction, index)
                frames[(direction, index)] = frame
                sequence.append(frame)
                save_frame(action, direction, frame, index)
            save_frame(action, direction, sequence[0])
            make_gif(action, direction, sequence, 110 if action in {"scythe", "fishingRod", "fishingCatch"} else 125)
        contact_paths.append(make_contact(action, frames, frame_count))
        print(f"{action}: {frame_count} frames x {len(DIRECTIONS)} directions")
    make_combined_contact(contact_paths)


if __name__ == "__main__":
    main()
