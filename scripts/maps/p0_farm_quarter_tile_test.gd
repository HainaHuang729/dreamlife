extends Node2D

const TILE_SIZE := 32
const MAP_WIDTH := 40
const MAP_HEIGHT := 23
const GRASS_ATLAS := preload("res://assets/ai_direct/run_007/terrain_tileset_ai_extracted_32.png")
const PATH_QUARTER := preload("res://assets/ai_direct/run_011/path_quarter_bitmask_32.png")
const SOIL_QUARTER := preload("res://assets/ai_direct/run_011/soil_quarter_bitmask_32.png")
const WET_QUARTER := preload("res://assets/ai_direct/run_011/soil_wet_quarter_bitmask_32.png")

var _grass_layer: Node2D
var _path_layer: Node2D
var _soil_layer: Node2D

var _path_quarters := {}
var _soil_quarters := {}
var _wet_quarters := {}

func _ready() -> void:
	_grass_layer = _new_layer("GrassBase")
	_path_layer = _new_layer("PathQuarterTiles")
	_soil_layer = _new_layer("SoilQuarterTiles")
	_build_quarter_maps()
	_draw_grass()
	_draw_quarter_layer(_path_layer, PATH_QUARTER, _path_quarters)
	_draw_quarter_layer(_soil_layer, SOIL_QUARTER, _soil_quarters)
	_draw_quarter_layer(_soil_layer, WET_QUARTER, _wet_quarters)
	_add_camera()
	_add_ui()

func _new_layer(name: String) -> Node2D:
	var layer := Node2D.new()
	layer.name = name
	add_child(layer)
	return layer

func _build_quarter_maps() -> void:
	_add_quarter_rect(_soil_quarters, Rect2i(10, 7, 11, 7))
	_add_quarter_rect(_wet_quarters, Rect2i(14, 10, 4, 4))
	_add_quarter_rect(_path_quarters, Rect2i(0, 15, MAP_WIDTH, 2))
	_add_quarter_rect(_path_quarters, Rect2i(31, 0, 2, MAP_HEIGHT))

func _add_quarter_rect(target: Dictionary, rect: Rect2i) -> void:
	var qx0 := rect.position.x * 2
	var qy0 := rect.position.y * 2
	var qx1 := (rect.position.x + rect.size.x) * 2
	var qy1 := (rect.position.y + rect.size.y) * 2
	for qy in range(qy0, qy1):
		for qx in range(qx0, qx1):
			target[Vector2i(qx, qy)] = true

func _draw_grass() -> void:
	for y in range(MAP_HEIGHT):
		for x in range(MAP_WIDTH):
			var column := _hash_cell(x, y, 1) % 16
			_add_atlas_tile(_grass_layer, GRASS_ATLAS, Vector2i(x, y), Vector2i(column % 8, int(column / 8)))

func _draw_quarter_layer(layer: Node2D, texture: Texture2D, quarters: Dictionary) -> void:
	for y in range(MAP_HEIGHT):
		for x in range(MAP_WIDTH):
			var mask := _quarter_mask_for_cell(Vector2i(x, y), quarters)
			if mask == 0:
				continue
			_add_quarter_tile(layer, texture, Vector2i(x, y), mask)

func _quarter_mask_for_cell(cell: Vector2i, quarters: Dictionary) -> int:
	var qx := cell.x * 2
	var qy := cell.y * 2
	var mask := 0
	if quarters.has(Vector2i(qx, qy)):
		mask |= 1
	if quarters.has(Vector2i(qx + 1, qy)):
		mask |= 2
	if quarters.has(Vector2i(qx, qy + 1)):
		mask |= 4
	if quarters.has(Vector2i(qx + 1, qy + 1)):
		mask |= 8
	return mask

func _add_quarter_tile(parent: Node2D, texture: Texture2D, cell: Vector2i, mask: int) -> void:
	var atlas_cell := Vector2i(mask % 8, int(mask / 8))
	_add_atlas_tile(parent, texture, cell, atlas_cell)

func _add_atlas_tile(parent: Node2D, texture: Texture2D, cell: Vector2i, atlas_cell: Vector2i) -> void:
	var sprite := Sprite2D.new()
	sprite.texture = texture
	sprite.region_enabled = true
	sprite.region_rect = Rect2(atlas_cell.x * TILE_SIZE, atlas_cell.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
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
	layer.name = "Run011UI"
	add_child(layer)
	var panel := ColorRect.new()
	panel.color = Color(0.055, 0.044, 0.030, 0.72)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(458, 68)
	layer.add_child(panel)
	var label := Label.new()
	label.text = "Run011  quarter-tile bitmask\n一格四象限组合生成 15+1 变体"
	label.position = Vector2(38, 34)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)
