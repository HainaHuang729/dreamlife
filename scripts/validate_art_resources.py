#!/usr/bin/env python3
"""Validate runtime art resources beyond character sprites."""

from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image
except ModuleNotFoundError:  # pragma: no cover - system python may not have Pillow.
    Image = None

from validate_character_assets import alpha_bbox, read_png_without_pillow


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "stardew-tilemap-from-zero" / "assets" / "game"
CROPS_DIR = ASSET_DIR / "crops"
BUILDABLES_DIR = ASSET_DIR / "buildables"
OBJECTS_DIR = ASSET_DIR / "objects"
FISH_DIR = ASSET_DIR / "fish"
UI_DIR = ASSET_DIR / "ui"
TOOLS_DIR = ASSET_DIR / "tools"
TILES_DIR = ASSET_DIR / "tiles"

CROPS = {
    "radish": (32, 32),
    "bokChoy": (32, 32),
    "wheat": (32, 48),
    "bean": (32, 48),
    "tomato": (32, 48),
    "corn": (32, 48),
    "sweetPotato": (32, 32),
    "spinach": (32, 32),
}
CROP_STATES = ["active", "watered", "ready"]

COMMUNITY_FACILITY_IDS = ["childCare", "youthWorkshop", "elderCare", "clinicRoute", "coldChain", "waterCleanup"]
COMMUNITY_FACILITY_STATES = ["ruin", "repaired", "upgrade1", "upgrade2"]

RESOURCE_NODES = {
    "quarry": (64, 64),
    "forestEdge": (64, 64),
    "toolShed": (96, 80),
}
RESOURCE_NODE_STATES = ["locked", "active", "depleted"]

BUILDABLES = {
    "processor": (32, 48),
    "dryer": (64, 48),
    "flowerBox": (32, 32),
    "gardenLamp": (32, 48),
    "bench": (64, 32),
    "fence": (32, 32),
}

STORY_OBJECTS = {
    "springFairStall": {"size": (96, 80), "states": ["locked", "active", "completed"]},
    "springSampleCrate": {"size": (64, 48), "states": ["locked", "active", "ready", "completed"]},
    "landShrine": {"size": (64, 64), "states": ["active", "ready", "completed"]},
    "shop": {"size": (64, 64), "states": ["locked", "repaired"]},
    "cooperativeDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "tourismDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "brandDesk": {"size": (64, 48), "states": ["locked", "repaired", "completed"]},
    "irrigationPump": {"size": (32, 48), "states": ["locked", "repaired", "completed"]},
}

FISH_IDS = [
    "waterweed",
    "crucian",
    "snail",
    "riverShrimp",
    "carp",
    "loach",
    "grassFish",
    "mountainTrout",
    "springRelicFish",
]

UI_ICONS = ["gold", "energy", "weather", "quest", "inventory", "calendar", "map", "build", "journal"]
TOOLS = ["hand", "hoe", "seeds", "wateringCan", "scythe", "fishingRod"]
SUPPORT_OBJECTS = [
    "sign",
    "directionSign",
    "chest",
    "mailbox",
    "warp",
    "kitchen",
    "bed",
    "well",
    "upgradeBoard",
    "marketStall",
    "basketPoint",
    "tastingTable",
    "ecommerceDesk",
]
SUPPORT_RUINS = ["processing", "construction", "villageMarket", "cooperative", "tourism", "brand", "irrigation"]
SUPPORT_RUIN_STATES = ["ruin", "repairing"]
SUPPORT_TILES = ["door", "fence", "cropPlot"]

CONTACT_SHEETS = [
    ROOT / "asset_runs" / "run_022_p0_art_resources" / "p0_crops_contact.png",
    ROOT / "asset_runs" / "run_022_p0_art_resources" / "p0_community_facilities_contact.png",
    ROOT / "asset_runs" / "run_022_p0_art_resources" / "p0_resource_nodes_contact.png",
    ROOT / "asset_runs" / "run_022_p0_art_resources" / "p0_art_resources_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "p1_buildables_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "p1_story_objects_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "p1_fish_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "p2_ui_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "p2_tools_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "support_objects_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "support_tiles_contact.png",
    ROOT / "asset_runs" / "run_023_remaining_art_resources" / "remaining_art_resources_contact.png",
]


def read_png(path: Path) -> tuple[tuple[int, int], str, bytearray]:
    if Image is not None:
        image = Image.open(path)
        mode = image.mode
        if mode != "RGBA":
            converted = image.convert("RGBA")
            return converted.size, mode, bytearray(converted.getchannel("A").tobytes())
        return image.size, mode, bytearray(image.getchannel("A").tobytes())
    return read_png_without_pillow(path)


def expected_assets() -> dict[Path, tuple[int, int]]:
    assets: dict[Path, tuple[int, int]] = {}
    for crop_id, size in CROPS.items():
        for state in CROP_STATES:
            assets[CROPS_DIR / f"{crop_id}--{state}.png"] = size

    for goal_id in COMMUNITY_FACILITY_IDS:
        for state in COMMUNITY_FACILITY_STATES:
            assets[OBJECTS_DIR / f"communityFacility-{goal_id}--{state}.png"] = (96, 80)

    for resource_id, size in RESOURCE_NODES.items():
        for state in RESOURCE_NODE_STATES:
            assets[OBJECTS_DIR / f"resourceNode-{resource_id}--{state}.png"] = size

    for item_id, size in BUILDABLES.items():
        assets[BUILDABLES_DIR / f"{item_id}--active.png"] = size

    for object_id, spec in STORY_OBJECTS.items():
        size = spec["size"]
        for state in spec["states"]:
            assets[OBJECTS_DIR / f"{object_id}--{state}.png"] = size

    for fish_id in FISH_IDS:
        assets[FISH_DIR / f"{fish_id}.png"] = (32, 32)

    for icon_id in UI_ICONS:
        assets[UI_DIR / f"{icon_id}.png"] = (24, 24)

    for tool_id in TOOLS:
        assets[TOOLS_DIR / f"{tool_id}.png"] = (32, 32)

    for object_id in SUPPORT_OBJECTS:
        assets[OBJECTS_DIR / f"{object_id}.png"] = (32, 32)

    for ruin_id in SUPPORT_RUINS:
        for state in SUPPORT_RUIN_STATES:
            assets[OBJECTS_DIR / f"ruin-{ruin_id}--{state}.png"] = (32, 32)

    for tile_id in SUPPORT_TILES:
        assets[TILES_DIR / f"{tile_id}.png"] = (32, 32)
    return assets


def validate_asset(path: Path, expected_size: tuple[int, int]) -> list[str]:
    errors: list[str] = []
    if not path.exists():
        return [f"missing: {path.relative_to(ROOT)}"]

    try:
        (width, height), mode, alpha = read_png(path)
    except ValueError as exc:
        return [f"{path.relative_to(ROOT)} cannot be parsed: {exc}"]

    if (width, height) != expected_size:
        errors.append(f"{path.relative_to(ROOT)} size {(width, height)}, expected {expected_size}")
    if mode != "RGBA":
        errors.append(f"{path.relative_to(ROOT)} mode {mode}, expected RGBA")

    corners = [alpha[0], alpha[width - 1], alpha[(height - 1) * width], alpha[height * width - 1]]
    if any(value != 0 for value in corners):
        errors.append(f"{path.relative_to(ROOT)} has non-transparent corner alpha {corners}")

    bbox = alpha_bbox(alpha, width, height)
    if not bbox:
        errors.append(f"{path.relative_to(ROOT)} has empty alpha")
        return errors
    left, top, right, _bottom = bbox
    if left <= 0 or top <= 0 or right >= width:
        errors.append(f"{path.relative_to(ROOT)} bbox touches side/top edge: {bbox}")
    return errors


def main() -> None:
    errors: list[str] = []
    assets = expected_assets()
    for path, size in assets.items():
        errors.extend(validate_asset(path, size))
    for path in CONTACT_SHEETS:
        if not path.exists():
            errors.append(f"missing contact sheet: {path.relative_to(ROOT)}")
        elif path.stat().st_size <= 0:
            errors.append(f"empty contact sheet: {path.relative_to(ROOT)}")

    if errors:
        for error in errors:
            print(error)
        raise SystemExit(1)
    print(f"validated {len(assets)} runtime art resources and {len(CONTACT_SHEETS)} contact sheets")


if __name__ == "__main__":
    main()
