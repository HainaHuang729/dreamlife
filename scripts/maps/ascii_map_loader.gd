extends Node2D

const TILE_SIZE := 32
const MAP_FILE := "res://maps/main_farm_ascii.txt"

const PLAYER_SCENE := preload("res://scenes/player/Player.tscn")
const FARM_CELL_SCRIPT := preload("res://scripts/maps/farm_cell.gd")
const FARMHOUSE_TEXTURE := preload("res://assets/concept/farm_layers/farmhouse-trim.png")
const GREENHOUSE_TEXTURE := preload("res://assets/concept/farm_layers/greenhouse-trim.png")
const CHICKEN_COOP_TEXTURE := preload("res://assets/concept/farm_layers/chicken-coop-trim.png")
const TOOL_SHED_TEXTURE := preload("res://assets/concept/farm_layers/tool-shed-trim.png")
const SHIPPING_BOX_TEXTURE := preload("res://assets/concept/farm_layers/shipping-box-trim.png")

const BLOCKING_TILES := ["#", "W"]
const BUILDING_TILES := ["A", "D", "X", "R", "K"]
const EXIT_TILES := ["V", "M"]
const FARM_TILES := ["F", "T"]

var _world_objects: Node2D
var _collision_body: StaticBody2D
var _exit_layer: Node2D
var _farm_layer: Node2D
var _debug_layer: Node2D
var _tile_textures := {}

func _ready() -> void:
	_load_tile_textures()
	_generate_from_ascii()

func _load_tile_textures() -> void:
	_tile_textures = {
		"grass": _load_png_texture("res://assets/tiles/farm_ascii/grass.png"),
		"platform_grass": _load_png_texture("res://assets/tiles/farm_ascii/platform_grass.png"),
		"path": _load_png_texture("res://assets/tiles/farm_ascii/path.png"),
		"soil": _load_png_texture("res://assets/tiles/farm_ascii/soil.png"),
		"terrace_soil": _load_png_texture("res://assets/tiles/farm_ascii/terrace_soil.png"),
		"water": _load_png_texture("res://assets/tiles/farm_ascii/water.png"),
		"wall": _load_png_texture("res://assets/tiles/farm_ascii/wall.png"),
		"stairs": _load_png_texture("res://assets/tiles/farm_ascii/stairs.png"),
		"exit": _load_png_texture("res://assets/tiles/farm_ascii/exit.png"),
	}

func _load_png_texture(path: String) -> Texture2D:
	var image := Image.load_from_file(path)
	if image == null:
		push_error("Cannot load tile texture: %s" % path)
		return PlaceholderTexture2D.new()
	return ImageTexture.create_from_image(image)

func _generate_from_ascii() -> void:
	var lines := _read_map_lines()
	if lines.is_empty():
		return

	var ground_layer := Node2D.new()
	ground_layer.name = "GeneratedGround"
	add_child(ground_layer)

	_collision_body = StaticBody2D.new()
	_collision_body.name = "GeneratedCollision"
	add_child(_collision_body)

	_exit_layer = Node2D.new()
	_exit_layer.name = "GeneratedExits"
	add_child(_exit_layer)

	_farm_layer = Node2D.new()
	_farm_layer.name = "GeneratedFarmCells"
	add_child(_farm_layer)

	_debug_layer = Node2D.new()
	_debug_layer.name = "GeneratedDebug"
	add_child(_debug_layer)

	_world_objects = Node2D.new()
	_world_objects.name = "GeneratedWorldObjects"
	_world_objects.y_sort_enabled = true
	add_child(_world_objects)

	var building_cells := {}
	var exit_cells := {}
	var player_spawn := Vector2.ZERO
	var found_player_spawn := false

	for y in lines.size():
		var line := lines[y]
		for x in line.length():
			var tile := line[x]
			var position := Vector2(x * TILE_SIZE, y * TILE_SIZE)
			_add_ground_tile(ground_layer, tile, position)

			if tile in BLOCKING_TILES:
				_add_rect_collision(position + Vector2(TILE_SIZE * 0.5, TILE_SIZE * 0.5), Vector2(TILE_SIZE, TILE_SIZE))

			if tile in BUILDING_TILES:
				if not building_cells.has(tile):
					building_cells[tile] = []
				building_cells[tile].append(Vector2i(x, y))

			if tile in EXIT_TILES:
				if not exit_cells.has(tile):
					exit_cells[tile] = []
				exit_cells[tile].append(Vector2i(x, y))

			if tile in FARM_TILES:
				_add_farm_cell(tile, Vector2i(x, y), position)

			if tile == "@":
				player_spawn = position + Vector2(TILE_SIZE * 0.5, TILE_SIZE * 0.5)
				found_player_spawn = true

	for marker in building_cells.keys():
		_add_building(marker, building_cells[marker])

	for marker in exit_cells.keys():
		_add_exit(marker, exit_cells[marker])

	if not found_player_spawn:
		player_spawn = Vector2(24 * TILE_SIZE, 12 * TILE_SIZE)
	_add_player(player_spawn)

func _read_map_lines() -> PackedStringArray:
	var file := FileAccess.open(MAP_FILE, FileAccess.READ)
	if file == null:
		push_error("Cannot open ASCII map: %s" % MAP_FILE)
		return PackedStringArray()

	var lines := file.get_as_text().strip_edges(false, true).split("\n", false)
	var width := lines[0].length()
	for i in lines.size():
		if lines[i].length() != width:
			push_error("ASCII map line %d has width %d, expected %d" % [i + 1, lines[i].length(), width])
			return PackedStringArray()
	return lines

func _add_ground_tile(parent: Node2D, tile: String, position: Vector2) -> void:
	var sprite := Sprite2D.new()
	sprite.position = position + Vector2(TILE_SIZE * 0.5, TILE_SIZE * 0.5)
	sprite.texture = _texture_for_tile(tile)
	parent.add_child(sprite)

	if tile in ["#", "S", "W", "F", "T", "V", "M"]:
		_add_tile_debug_outline(tile, position)

func _texture_for_tile(tile: String) -> Texture2D:
	match tile:
		"#":
			return _tile_textures["wall"]
		"S":
			return _tile_textures["stairs"]
		"W":
			return _tile_textures["water"]
		"=":
			return _tile_textures["path"]
		"F", "@":
			return _tile_textures["soil"]
		"T":
			return _tile_textures["terrace_soil"]
		"H", "G", "C", "A", "D", "X", "R", "K":
			return _tile_textures["platform_grass"]
		"V", "M":
			return _tile_textures["exit"]
		_:
			return _tile_textures["grass"]

func _add_rect_collision(center: Vector2, size: Vector2) -> void:
	var shape := RectangleShape2D.new()
	shape.size = size

	var collision := CollisionShape2D.new()
	collision.position = center
	collision.shape = shape
	_collision_body.add_child(collision)

func _add_farm_cell(tile: String, cell: Vector2i, position: Vector2) -> void:
	var area := Area2D.new()
	area.name = "FarmCell_%d_%d" % [cell.x, cell.y]
	area.position = position + Vector2(TILE_SIZE * 0.5, TILE_SIZE * 0.5)
	area.collision_layer = 2
	area.collision_mask = 0
	area.script = FARM_CELL_SCRIPT

	var shape := RectangleShape2D.new()
	shape.size = Vector2(TILE_SIZE, TILE_SIZE)

	var collision := CollisionShape2D.new()
	collision.shape = shape
	area.add_child(collision)
	_farm_layer.add_child(area)
	area.setup(cell, "terrace" if tile == "T" else "main_field", TILE_SIZE)

func _add_tile_debug_outline(tile: String, position: Vector2) -> void:
	var line := Line2D.new()
	line.position = position
	line.width = 1.0
	line.closed = true
	line.points = PackedVector2Array([
		Vector2.ZERO,
		Vector2(TILE_SIZE, 0),
		Vector2(TILE_SIZE, TILE_SIZE),
		Vector2(0, TILE_SIZE),
	])
	line.default_color = _debug_color_for_tile(tile)
	_debug_layer.add_child(line)

func _debug_color_for_tile(tile: String) -> Color:
	match tile:
		"#":
			return Color(0.16, 0.1, 0.04, 0.55)
		"S":
			return Color(1.0, 0.95, 0.7, 0.85)
		"W":
			return Color(0.18, 0.45, 0.85, 0.7)
		"F", "T":
			return Color(0.95, 0.78, 0.38, 0.35)
		"V", "M":
			return Color(0.35, 1.0, 0.4, 0.8)
		_:
			return Color.TRANSPARENT

func _add_building(marker: String, cells: Array) -> void:
	var center := _average_cell_center(cells)
	var texture: Texture2D
	var scale := 1.0
	var footprint := Vector2(TILE_SIZE, TILE_SIZE)
	var display_name := ""

	match marker:
		"A":
			texture = FARMHOUSE_TEXTURE
			scale = 0.23
			footprint = Vector2(220, 76)
			display_name = "Farmhouse"
		"R":
			texture = GREENHOUSE_TEXTURE
			scale = 0.27
			footprint = Vector2(148, 82)
			display_name = "Greenhouse"
		"K":
			texture = CHICKEN_COOP_TEXTURE
			scale = 0.19
			footprint = Vector2(154, 68)
			display_name = "ChickenCoop"
		"D":
			texture = TOOL_SHED_TEXTURE
			scale = 0.12
			footprint = Vector2(82, 48)
			display_name = "ToolShed"
		"X":
			texture = SHIPPING_BOX_TEXTURE
			scale = 0.07
			footprint = Vector2(54, 38)
			display_name = "ShippingBox"
		_:
			return

	var sprite := Sprite2D.new()
	sprite.name = display_name
	sprite.texture = texture
	sprite.scale = Vector2(scale, scale)
	sprite.position = center + Vector2(0, TILE_SIZE * 0.5)
	sprite.offset = Vector2(0, -texture.get_height() * 0.5)
	sprite.set_meta("marker", marker)
	sprite.set_meta("cells", cells)
	_world_objects.add_child(sprite)

	_add_rect_collision(sprite.position - Vector2(0, footprint.y * 0.45), footprint)

func _add_exit(marker: String, cells: Array) -> void:
	var center := _average_cell_center(cells)
	var area := Area2D.new()
	area.name = "VillageExit" if marker == "V" else "PastureExit"
	area.position = center
	area.set_meta("marker", marker)
	area.set_meta("target_map", "village" if marker == "V" else "pasture")

	var shape := RectangleShape2D.new()
	shape.size = _cell_group_size(cells)

	var collision := CollisionShape2D.new()
	collision.shape = shape
	area.add_child(collision)
	area.body_entered.connect(func(body: Node) -> void:
		if body.name == "Player":
			print("%s reached" % area.name)
	)
	_exit_layer.add_child(area)

func _add_player(position: Vector2) -> void:
	var player := PLAYER_SCENE.instantiate()
	player.name = "Player"
	player.position = position
	_world_objects.add_child(player)

func _average_cell_center(cells: Array) -> Vector2:
	var total := Vector2.ZERO
	for cell: Vector2i in cells:
		total += Vector2(cell.x * TILE_SIZE + TILE_SIZE * 0.5, cell.y * TILE_SIZE + TILE_SIZE * 0.5)
	return total / float(cells.size())

func _cell_group_size(cells: Array) -> Vector2:
	var min_cell := cells[0] as Vector2i
	var max_cell := cells[0] as Vector2i
	for cell: Vector2i in cells:
		min_cell.x = mini(min_cell.x, cell.x)
		min_cell.y = mini(min_cell.y, cell.y)
		max_cell.x = maxi(max_cell.x, cell.x)
		max_cell.y = maxi(max_cell.y, cell.y)
	return Vector2(max_cell.x - min_cell.x + 1, max_cell.y - min_cell.y + 1) * TILE_SIZE
