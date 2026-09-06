extends Node2D

const TILE_SIZE := 32
const MAP_WIDTH := 40
const MAP_HEIGHT := 23
const ATLAS_COLUMNS := 16
const AUTOTILE_ATLAS := preload("res://assets/ai_direct/run_009/terrain_autotile_atlas_32.png")

const ROW_GRASS := 0
const ROW_PATH := 1
const ROW_SOIL_DRY := 2
const ROW_SOIL_WET := 3
const ROW_WATER := 4
const ROW_DETAIL := 5

var _tile_set: TileSet
var _grass_layer: TileMapLayer
var _path_layer: TileMapLayer
var _farm_layer: TileMapLayer
var _water_layer: TileMapLayer
var _detail_layer: TileMapLayer
var _source_id := 0

var _path_cells := {}
var _farm_cells := {}
var _wet_cells := {}
var _water_cells := {}

func _ready() -> void:
	_build_tile_set()
	_build_cell_sets()
	_create_layers()
	_draw_grass_base()
	_draw_autotile_layer(_path_layer, _path_cells, ROW_PATH)
	_draw_farm_layer()
	_draw_autotile_layer(_water_layer, _water_cells, ROW_WATER)
	_draw_details()
	_add_camera()
	_add_ui()

func _build_tile_set() -> void:
	_tile_set = TileSet.new()
	_tile_set.tile_size = Vector2i(TILE_SIZE, TILE_SIZE)

	var source := TileSetAtlasSource.new()
	source.texture = AUTOTILE_ATLAS
	source.texture_region_size = Vector2i(TILE_SIZE, TILE_SIZE)
	for y in range(0, 6):
		for x in range(0, ATLAS_COLUMNS):
			source.create_tile(Vector2i(x, y))
	_source_id = _tile_set.add_source(source)

func _build_cell_sets() -> void:
	for x in range(0, MAP_WIDTH):
		_path_cells[Vector2i(x, 15)] = true
		_path_cells[Vector2i(x, 16)] = true
	for y in range(0, MAP_HEIGHT):
		_path_cells[Vector2i(31, y)] = true
		_path_cells[Vector2i(32, y)] = true

	for y in range(7, 14):
		for x in range(10, 21):
			var cell := Vector2i(x, y)
			_farm_cells[cell] = true
			if _hash_cell(x, y, 40) % 4 == 0:
				_wet_cells[cell] = true

	for y in range(11, 15):
		for x in range(31, 35):
			_water_cells[Vector2i(x, y)] = true

func _create_layers() -> void:
	_grass_layer = _new_tile_layer("GrassBase")
	_path_layer = _new_tile_layer("PathAutotile")
	_farm_layer = _new_tile_layer("FarmAutotile")
	_water_layer = _new_tile_layer("WaterAutotile")
	_detail_layer = _new_tile_layer("TerrainDetails")

func _new_tile_layer(name: String) -> TileMapLayer:
	var layer := TileMapLayer.new()
	layer.name = name
	layer.tile_set = _tile_set
	add_child(layer)
	return layer

func _draw_grass_base() -> void:
	for y in range(0, MAP_HEIGHT):
		for x in range(0, MAP_WIDTH):
			_set_tile(_grass_layer, Vector2i(x, y), ROW_GRASS, _hash_cell(x, y, 0) % ATLAS_COLUMNS)

func _draw_farm_layer() -> void:
	for cell in _farm_cells.keys():
		var row := ROW_SOIL_WET if _wet_cells.has(cell) else ROW_SOIL_DRY
		_set_tile(_farm_layer, cell, row, _neighbor_bits(cell, _farm_cells))

func _draw_autotile_layer(layer: TileMapLayer, cells: Dictionary, row: int) -> void:
	for cell in cells.keys():
		_set_tile(layer, cell, row, _neighbor_bits(cell, cells))

func _draw_details() -> void:
	for y in range(0, MAP_HEIGHT):
		for x in range(0, MAP_WIDTH):
			var cell := Vector2i(x, y)
			if _path_cells.has(cell) or _farm_cells.has(cell) or _water_cells.has(cell):
				continue
			if _hash_cell(x, y, 55) % 47 == 0:
				_set_tile(_detail_layer, cell, ROW_DETAIL, _hash_cell(x, y, 56) % ATLAS_COLUMNS)

	for cell in _farm_cells.keys():
		if _neighbor_bits(cell, _farm_cells) != 15 and _hash_cell(cell.x, cell.y, 60) % 3 == 0:
			var around: Vector2i = cell + Vector2i(0, -1)
			if not _farm_cells.has(around) and _in_bounds(around):
				_set_tile(_detail_layer, around, ROW_DETAIL, _hash_cell(around.x, around.y, 61) % ATLAS_COLUMNS)

func _neighbor_bits(cell: Vector2i, cells: Dictionary) -> int:
	var bits := 0
	if cells.has(cell + Vector2i(0, -1)):
		bits |= 1
	if cells.has(cell + Vector2i(1, 0)):
		bits |= 2
	if cells.has(cell + Vector2i(0, 1)):
		bits |= 4
	if cells.has(cell + Vector2i(-1, 0)):
		bits |= 8
	return bits

func _set_tile(layer: TileMapLayer, cell: Vector2i, row: int, column: int) -> void:
	layer.set_cell(cell, _source_id, Vector2i(column, row), 0)

func _in_bounds(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.y >= 0 and cell.x < MAP_WIDTH and cell.y < MAP_HEIGHT

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
	layer.name = "Run009UI"
	add_child(layer)

	var panel := ColorRect.new()
	panel.color = Color(0.055, 0.044, 0.030, 0.72)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(456, 68)
	layer.add_child(panel)

	var label := Label.new()
	label.text = "Run009  Godot TileMapLayer\nterrain autotile atlas 已接入"
	label.position = Vector2(38, 34)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)
