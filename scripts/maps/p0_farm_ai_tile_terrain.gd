extends Node2D

const TILE_SIZE := 32
const MAP_WIDTH := 40
const MAP_HEIGHT := 23
const TERRAIN_ATLAS := preload("res://assets/ai_direct/run_007/terrain_tileset_ai_extracted_32.png")

enum Tile {
	GRASS_00,
	GRASS_01,
	GRASS_02,
	GRASS_03,
	GRASS_04,
	GRASS_05,
	GRASS_06,
	GRASS_07,
	GRASS_08,
	GRASS_09,
	GRASS_10,
	GRASS_11,
	GRASS_12,
	GRASS_13,
	GRASS_14,
	GRASS_15,
	PATH_H,
	PATH_H_ROUGH,
	PATH_V,
	PATH_CROSS,
	SOIL_00,
	SOIL_01,
	SOIL_02,
	SOIL_03,
	SOIL_04,
	SOIL_05,
	SOIL_06,
	SOIL_07,
	WATER,
	WATER_EDGE,
	DIRT_PATCH,
	GRASS_BORDER,
}

var _terrain_layer: Node2D

func _ready() -> void:
	_terrain_layer = Node2D.new()
	_terrain_layer.name = "TileTerrainLayer_32px"
	add_child(_terrain_layer)
	_draw_tile_map()
	_add_camera()
	_add_ui()

func _draw_tile_map() -> void:
	for y in MAP_HEIGHT:
		for x in MAP_WIDTH:
			_add_tile(Vector2i(x, y), _tile_for_cell(x, y))

func _tile_for_cell(x: int, y: int) -> int:
	if x >= 10 and x <= 20 and y >= 7 and y <= 13:
		return Tile.SOIL_00 + _hash_cell(x, y, 9) % 8

	if x >= 31 and x <= 33 and y >= 12 and y <= 14:
		if x == 31 or y == 12:
			return Tile.WATER_EDGE
		return Tile.WATER

	var in_h_path := y >= 15 and y <= 16
	var in_v_path := x >= 31 and x <= 32
	if in_h_path and in_v_path:
		return Tile.PATH_CROSS
	if in_h_path:
		return Tile.PATH_H_ROUGH if _hash_cell(x, y, 3) % 3 == 0 else Tile.PATH_H
	if in_v_path:
		return Tile.PATH_V

	if (x == 6 and y == 5) or (x == 21 and y == 18) or (x == 34 and y == 5):
		return Tile.DIRT_PATCH

	return Tile.GRASS_00 + _hash_cell(x, y, 0) % 16

func _hash_cell(x: int, y: int, salt: int) -> int:
	var value := x * 374761393 + y * 668265263 + salt * 1442695041
	value = int((value ^ (value >> 13)) * 1274126177)
	return abs(value ^ (value >> 16))

func _add_tile(cell: Vector2i, tile_index: int) -> void:
	var sprite := Sprite2D.new()
	sprite.texture = TERRAIN_ATLAS
	sprite.region_enabled = true
	sprite.region_rect = Rect2((tile_index % 8) * TILE_SIZE, int(tile_index / 8) * TILE_SIZE, TILE_SIZE, TILE_SIZE)
	sprite.centered = false
	sprite.position = Vector2(cell.x * TILE_SIZE, cell.y * TILE_SIZE)
	_terrain_layer.add_child(sprite)

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(640, 360)
	camera.enabled = true
	add_child(camera)

func _add_ui() -> void:
	var layer := CanvasLayer.new()
	layer.name = "Run007UI"
	add_child(layer)

	var panel := ColorRect.new()
	panel.color = Color(0.055, 0.044, 0.030, 0.72)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(394, 68)
	layer.add_child(panel)

	var label := Label.new()
	label.text = "Run007  瓦片地形图\n32px AI提取tile，可局部改图"
	label.position = Vector2(38, 34)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)
