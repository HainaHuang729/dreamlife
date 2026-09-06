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

var _grass_layer: Node2D
var _path_layer: Node2D
var _farm_layer: Node2D
var _water_layer: Node2D
var _detail_layer: Node2D

func _ready() -> void:
	_create_layers()
	_draw_grass_base()
	_draw_path_network()
	_draw_farm_plot()
	_draw_water_source()
	_draw_detail_pass()
	_add_camera()
	_add_ui()

func _create_layers() -> void:
	_grass_layer = _new_layer("GrassBase")
	_path_layer = _new_layer("PathLayer")
	_farm_layer = _new_layer("FarmSoilLayer")
	_water_layer = _new_layer("WaterLayer")
	_detail_layer = _new_layer("TerrainDetailLayer")

func _new_layer(name: String) -> Node2D:
	var layer := Node2D.new()
	layer.name = name
	add_child(layer)
	return layer

func _draw_grass_base() -> void:
	for y in MAP_HEIGHT:
		for x in MAP_WIDTH:
			_add_tile(_grass_layer, Vector2i(x, y), Tile.GRASS_00 + _hash_cell(x, y, 0) % 16)

func _draw_path_network() -> void:
	for x in MAP_WIDTH:
		_add_tile(_path_layer, Vector2i(x, 15), _path_h_tile(x, 15))
		_add_tile(_path_layer, Vector2i(x, 16), _path_h_tile(x, 16))
	for y in MAP_HEIGHT:
		_add_tile(_path_layer, Vector2i(31, y), _path_v_tile(31, y))
		_add_tile(_path_layer, Vector2i(32, y), _path_v_tile(32, y))

	for x in range(0, MAP_WIDTH):
		if _hash_cell(x, 14, 4) % 9 == 0:
			_add_tile(_detail_layer, Vector2i(x, 14), Tile.GRASS_BORDER)
		if _hash_cell(x, 17, 5) % 9 == 0:
			_add_tile(_detail_layer, Vector2i(x, 17), Tile.GRASS_BORDER)
	for y in range(0, MAP_HEIGHT):
		if _hash_cell(30, y, 6) % 10 == 0:
			_add_tile(_detail_layer, Vector2i(30, y), Tile.GRASS_BORDER)
		if _hash_cell(33, y, 7) % 10 == 0:
			_add_tile(_detail_layer, Vector2i(33, y), Tile.GRASS_BORDER)

func _draw_farm_plot() -> void:
	for y in range(7, 14):
		for x in range(10, 21):
			_add_tile(_farm_layer, Vector2i(x, y), Tile.SOIL_00 + _hash_cell(x, y, 8) % 8)

	for x in range(9, 22):
		if _hash_cell(x, 6, 2) % 5 == 0:
			_add_tile(_detail_layer, Vector2i(x, 6), Tile.DIRT_PATCH)
		elif _hash_cell(x, 6, 12) % 7 == 0:
			_add_tile(_detail_layer, Vector2i(x, 6), Tile.GRASS_BORDER)
		if _hash_cell(x, 14, 3) % 5 == 0:
			_add_tile(_detail_layer, Vector2i(x, 14), Tile.DIRT_PATCH)
		elif _hash_cell(x, 14, 13) % 7 == 0:
			_add_tile(_detail_layer, Vector2i(x, 14), Tile.GRASS_BORDER)
	for y in range(7, 14):
		if _hash_cell(9, y, 14) % 4 == 0:
			_add_tile(_detail_layer, Vector2i(9, y), Tile.GRASS_BORDER)
		if _hash_cell(21, y, 15) % 4 == 0:
			_add_tile(_detail_layer, Vector2i(21, y), Tile.GRASS_BORDER)

func _draw_water_source() -> void:
	for y in range(11, 15):
		for x in range(31, 35):
			var tile := Tile.WATER
			if x == 31 or x == 34 or y == 11 or y == 14:
				tile = Tile.WATER_EDGE
			_add_tile(_water_layer, Vector2i(x, y), tile)

	for cell in [
		Vector2i(30, 11), Vector2i(30, 12), Vector2i(30, 13), Vector2i(30, 14),
		Vector2i(31, 10), Vector2i(32, 10), Vector2i(33, 10), Vector2i(34, 10),
		Vector2i(35, 11), Vector2i(35, 12), Vector2i(35, 13), Vector2i(35, 14),
		Vector2i(31, 15), Vector2i(32, 15), Vector2i(33, 15), Vector2i(34, 15),
	]:
		if _hash_cell(cell.x, cell.y, 16) % 3 == 0:
			_add_tile(_detail_layer, cell, Tile.GRASS_BORDER)

func _draw_detail_pass() -> void:
	var sparse_details := [
		Vector2i(6, 5),
		Vector2i(21, 18),
		Vector2i(34, 5),
		Vector2i(5, 18),
		Vector2i(24, 4),
		Vector2i(37, 19),
	]
	for cell in sparse_details:
		_add_tile(_detail_layer, cell, Tile.DIRT_PATCH)

	for y in MAP_HEIGHT:
		for x in MAP_WIDTH:
			if _is_reserved_for_major_terrain(x, y):
				continue
			if _hash_cell(x, y, 13) % 46 == 0:
				_add_tile(_detail_layer, Vector2i(x, y), Tile.GRASS_BORDER)

func _is_reserved_for_major_terrain(x: int, y: int) -> bool:
	if y >= 14 and y <= 17:
		return true
	if x >= 30 and x <= 33:
		return true
	if x >= 9 and x <= 21 and y >= 6 and y <= 14:
		return true
	if x >= 30 and x <= 35 and y >= 10 and y <= 15:
		return true
	return false

func _path_h_tile(x: int, y: int) -> int:
	if x >= 31 and x <= 32:
		return Tile.PATH_CROSS
	return Tile.PATH_H_ROUGH if _hash_cell(x, y, 9) % 3 == 0 else Tile.PATH_H

func _path_v_tile(x: int, y: int) -> int:
	if y >= 15 and y <= 16:
		return Tile.PATH_CROSS
	return Tile.PATH_V

func _add_tile(parent: Node2D, cell: Vector2i, tile_index: int) -> void:
	if cell.x < 0 or cell.y < 0 or cell.x >= MAP_WIDTH or cell.y >= MAP_HEIGHT:
		return
	var sprite := Sprite2D.new()
	sprite.texture = TERRAIN_ATLAS
	sprite.region_enabled = true
	sprite.region_rect = Rect2((tile_index % 8) * TILE_SIZE, int(tile_index / 8) * TILE_SIZE, TILE_SIZE, TILE_SIZE)
	sprite.centered = false
	sprite.position = Vector2(cell.x * TILE_SIZE, cell.y * TILE_SIZE)
	parent.add_child(sprite)

func _hash_cell(x: int, y: int, salt: int) -> int:
	var value := x * 374761393 + y * 668265263 + salt * 1442695041
	value = int((value ^ (value >> 13)) * 1274126177)
	return abs(value ^ (value >> 16))

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(640, 360)
	camera.enabled = true
	add_child(camera)

func _add_ui() -> void:
	var layer := CanvasLayer.new()
	layer.name = "Run008UI"
	add_child(layer)

	var panel := ColorRect.new()
	panel.color = Color(0.055, 0.044, 0.030, 0.72)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(438, 68)
	layer.add_child(panel)

	var label := Label.new()
	label.text = "Run008  分层瓦片地形\n草地 / 道路 / 农田 / 水源可独立修改"
	label.position = Vector2(38, 34)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)
