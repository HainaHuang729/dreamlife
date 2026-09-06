#!/usr/bin/env python3
"""Validate runtime character PNG contracts for player and NPC sprites."""

from __future__ import annotations

from pathlib import Path
import struct
import zlib

try:
    from PIL import Image
except ModuleNotFoundError:  # pragma: no cover - exercised on machines without Pillow.
    Image = None


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game"
PLAYER_DIR = ASSET_DIR / "player"
NPC_DIR = ASSET_DIR / "npcs"

TARGET_SIZE = (96, 120)
ANCHOR_Y = 108
DIRECTIONS = ["down", "up", "left", "right"]
NPC_IDS = ["mira", "theo", "lina", "nannan", "uncleChen"]
NPC_STATES = ["active", "ready", "completed"]
COMMON_PLAYER_ACTIONS = [
    "seeds",
    "sleep",
    "warp",
]
PLAYER_FRAME_COUNTS = {
    "idle": 2,
    "walk": 4,
    "run": 6,
    "inspect": 4,
    "hoe": 5,
    "wateringCan": 5,
    "scythe": 6,
    "fishingRod": 6,
    "fishingCatch": 6,
    "harvest": 5,
}
CONTACT_SHEETS = [
    ROOT / "asset_runs" / "run_020_player_motion_96" / "player_idle_contact.png",
    ROOT / "asset_runs" / "run_020_player_motion_96" / "player_walk_contact.png",
    ROOT / "asset_runs" / "run_020_player_motion_96" / "player_run_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_inspect_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_hoe_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_wateringCan_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_scythe_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_fishingRod_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_fishingCatch_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_harvest_contact.png",
    ROOT / "asset_runs" / "run_021_player_tool_actions_96" / "player_tools_contact.png",
    ROOT / "asset_runs" / "run_019_ai_npc_individuals" / "npc_talk_down_contact.png",
]


def paeth_predictor(left: int, up: int, up_left: int) -> int:
    estimate = left + up - up_left
    left_distance = abs(estimate - left)
    up_distance = abs(estimate - up)
    up_left_distance = abs(estimate - up_left)
    if left_distance <= up_distance and left_distance <= up_left_distance:
        return left
    if up_distance <= up_left_distance:
        return up
    return up_left


def read_png_without_pillow(path: Path) -> tuple[tuple[int, int], str, bytearray]:
    data = path.read_bytes()
    if not data.startswith(b"\x89PNG\r\n\x1a\n"):
        raise ValueError("not a PNG file")

    offset = 8
    width = height = bit_depth = color_type = interlace = None
    idat_parts: list[bytes] = []
    while offset < len(data):
        length = struct.unpack(">I", data[offset : offset + 4])[0]
        chunk_type = data[offset + 4 : offset + 8]
        chunk_data = data[offset + 8 : offset + 8 + length]
        offset += 12 + length
        if chunk_type == b"IHDR":
            width, height, bit_depth, color_type, _compression, _filter, interlace = struct.unpack(">IIBBBBB", chunk_data)
        elif chunk_type == b"IDAT":
            idat_parts.append(chunk_data)
        elif chunk_type == b"IEND":
            break

    if width is None or height is None or bit_depth is None or color_type is None:
        raise ValueError("missing PNG IHDR")
    if bit_depth != 8 or interlace != 0:
        raise ValueError(f"unsupported PNG format: bit_depth={bit_depth}, interlace={interlace}")

    channels_by_color_type = {2: 3, 4: 2, 6: 4}
    mode_by_color_type = {2: "RGB", 4: "LA", 6: "RGBA"}
    channels = channels_by_color_type.get(color_type)
    if channels is None:
        raise ValueError(f"unsupported PNG color type {color_type}")

    raw = zlib.decompress(b"".join(idat_parts))
    stride = width * channels
    previous = bytearray(stride)
    pixels = bytearray()
    source_offset = 0
    for _y in range(height):
        filter_type = raw[source_offset]
        source_offset += 1
        scanline = bytearray(raw[source_offset : source_offset + stride])
        source_offset += stride
        for i, value in enumerate(scanline):
            left = scanline[i - channels] if i >= channels else 0
            up = previous[i]
            up_left = previous[i - channels] if i >= channels else 0
            if filter_type == 1:
                scanline[i] = (value + left) & 0xFF
            elif filter_type == 2:
                scanline[i] = (value + up) & 0xFF
            elif filter_type == 3:
                scanline[i] = (value + ((left + up) // 2)) & 0xFF
            elif filter_type == 4:
                scanline[i] = (value + paeth_predictor(left, up, up_left)) & 0xFF
            elif filter_type != 0:
                raise ValueError(f"unsupported PNG filter {filter_type}")
        pixels.extend(scanline)
        previous = scanline

    alpha = bytearray(width * height)
    if color_type == 6:
        for i in range(width * height):
            alpha[i] = pixels[i * 4 + 3]
    elif color_type == 4:
        for i in range(width * height):
            alpha[i] = pixels[i * 2 + 1]
    else:
        alpha[:] = b"\xff" * (width * height)
    return (width, height), mode_by_color_type[color_type], alpha


def alpha_bbox(alpha: bytearray, width: int, height: int) -> tuple[int, int, int, int] | None:
    left = width
    top = height
    right = bottom = 0
    found = False
    for y in range(height):
        for x in range(width):
            if alpha[y * width + x] == 0:
                continue
            found = True
            left = min(left, x)
            top = min(top, y)
            right = max(right, x + 1)
            bottom = max(bottom, y + 1)
    if not found:
        return None
    return left, top, right, bottom


def expected_player_paths() -> list[Path]:
    paths: list[Path] = []
    for direction in DIRECTIONS:
        for action, frame_count in PLAYER_FRAME_COUNTS.items():
            paths.append(PLAYER_DIR / f"{action}_{direction}.png")
            paths.extend(PLAYER_DIR / f"{action}_{direction}_{index:02d}.png" for index in range(frame_count))

        for action in COMMON_PLAYER_ACTIONS:
            paths.append(PLAYER_DIR / f"{action}_{direction}.png")
    return paths


def expected_npc_paths() -> list[Path]:
    paths: list[Path] = []
    for npc_id in NPC_IDS:
        paths.append(NPC_DIR / f"{npc_id}.png")
        for state in NPC_STATES:
            paths.append(NPC_DIR / f"{npc_id}--{state}.png")
            paths.extend(NPC_DIR / f"{npc_id}--{state}_{index:02d}.png" for index in range(2))
        paths.append(NPC_DIR / f"{npc_id}--talk_down.png")
        paths.extend(NPC_DIR / f"{npc_id}--talk_down_{index:02d}.png" for index in range(2))
    paths.append(NPC_DIR / "lin_lan.png")
    return paths


def validate_png(path: Path) -> list[str]:
    errors: list[str] = []
    if not path.exists():
        return [f"missing: {path.relative_to(ROOT)}"]

    if Image is not None:
        image = Image.open(path)
        width, height = image.size
        mode = image.mode
        if mode != "RGBA":
            errors.append(f"{path.relative_to(ROOT)} mode {mode}, expected RGBA")
            image = image.convert("RGBA")
            mode = image.mode
        alpha_image = image.getchannel("A")
        alpha = bytearray(alpha_image.tobytes())
    else:
        try:
            (width, height), mode, alpha = read_png_without_pillow(path)
        except ValueError as exc:
            return [f"{path.relative_to(ROOT)} cannot be parsed: {exc}"]
        if mode != "RGBA":
            errors.append(f"{path.relative_to(ROOT)} mode {mode}, expected RGBA")

    if (width, height) != TARGET_SIZE:
        errors.append(f"{path.relative_to(ROOT)} size {(width, height)}, expected {TARGET_SIZE}")

    corners = [alpha[0], alpha[width - 1], alpha[(height - 1) * width], alpha[height * width - 1]]
    if any(value != 0 for value in corners):
        errors.append(f"{path.relative_to(ROOT)} has non-transparent corner alpha {corners}")

    bbox = alpha_bbox(alpha, width, height)
    if not bbox:
        errors.append(f"{path.relative_to(ROOT)} has empty alpha")
        return errors

    left, top, right, bottom = bbox
    if left <= 0 or top <= 0 or right >= width or bottom >= height:
        errors.append(f"{path.relative_to(ROOT)} bbox touches edge: {bbox}")
    if bottom > ANCHOR_Y:
        errors.append(f"{path.relative_to(ROOT)} bbox bottom {bottom} exceeds anchor y={ANCHOR_Y}")
    if bottom < ANCHOR_Y - 8:
        errors.append(f"{path.relative_to(ROOT)} bbox bottom {bottom} is too far above anchor y={ANCHOR_Y}")
    return errors


def main() -> None:
    errors: list[str] = []
    for path in expected_player_paths() + expected_npc_paths():
        errors.extend(validate_png(path))
    for path in CONTACT_SHEETS:
        if not path.exists():
            errors.append(f"missing contact sheet: {path.relative_to(ROOT)}")
        elif path.stat().st_size <= 0:
            errors.append(f"empty contact sheet: {path.relative_to(ROOT)}")

    if errors:
        for error in errors:
            print(error)
        raise SystemExit(1)

    total = len(expected_player_paths()) + len(expected_npc_paths())
    print(f"validated {total} character assets and {len(CONTACT_SHEETS)} contact sheets at {TARGET_SIZE}, anchor y={ANCHOR_Y}")


if __name__ == "__main__":
    main()
