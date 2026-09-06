extends Node2D

const TILE_SIZE := 32
const SOURCE_TILE := 16
const MAP_WIDTH := 40
const MAP_HEIGHT := 23

const GRASS_TILES_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Environment/Tilesets/Grass_Tileset.png"
const TILLED_TILES_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Environment/Tilesets/Tilled_Ground_Tileset.png"
const WATER_TILES_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Environment/Tilesets/Water_Tileset.png"
const PROPS_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Environment/Props/Static/ALL_Props.png"
const FENCES_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Environment/Props/Static/Fences.png"
const PLAYER_WALK_DOWN_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Character/Female_Body/Walk/Walk_Down.png"
const CHICKEN_IDLE_DOWN_PATH := "res://assets/third_party/temp/bloomseed/source/Bloomseed - Free Asset Pack/Mobs/Animals/Chicken/Chicken_Idle_Down.png"
const FARMHOUSE_TEXTURE := preload("res://assets/concept/farm_layers/farmhouse-trim.png")
const PLAYER_CONTROLLER := preload("res://scripts/player/bloomseed_temp_player_controller.gd")

var _world: Node2D
var _collision_body: StaticBody2D
var _grass_tiles: Texture2D
var _tilled_tiles: Texture2D
var _water_tiles: Texture2D
var _props: Texture2D
var _fences: Texture2D
var _player_walk_down: Texture2D
var _chicken_idle_down: Texture2D

func _ready() -> void:
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	_load_textures()
	_create_layers()
	_add_world_objects()
	_add_collision()
	_add_player()
	_add_camera()
	_add_ui()

func _load_textures() -> void:
	_grass_tiles = _load_png_texture(GRASS_TILES_PATH)
	_tilled_tiles = _load_png_texture(TILLED_TILES_PATH)
	_water_tiles = _load_png_texture(WATER_TILES_PATH)
	_props = _load_png_texture(PROPS_PATH)
	_fences = _load_png_texture(FENCES_PATH)
	_player_walk_down = _load_png_texture(PLAYER_WALK_DOWN_PATH)
	_chicken_idle_down = _load_png_texture(CHICKEN_IDLE_DOWN_PATH)

func _load_png_texture(path: String) -> Texture2D:
	var image := Image.load_from_file(path)
	if image == null:
		push_error("Cannot load Bloomseed texture: %s" % path)
		return PlaceholderTexture2D.new()
	return ImageTexture.create_from_image(image)

func _draw() -> void:
	_draw_ground()
	_draw_paths()
	_draw_field(Vector2i(7, 8), Vector2i(12, 8))
	_draw_pond(Vector2i(29, 12))
	_draw_farmyard_fences()

func _create_layers() -> void:
	_collision_body = StaticBody2D.new()
	_collision_body.name = "BloomseedCollision"
	add_child(_collision_body)

	_world = Node2D.new()
	_world.name = "BloomseedYSortObjects"
	_world.y_sort_enabled = true
	add_child(_world)

func _draw_ground() -> void:
	for y in MAP_HEIGHT:
		for x in MAP_WIDTH:
			var source_cell := Vector2i(0, 4)
			var roll := int((x * 37 + y * 19) % 17)
			if roll == 0:
				source_cell = Vector2i(1, 0)
			elif roll == 1:
				source_cell = Vector2i(0, 1)
			elif roll == 2:
				source_cell = Vector2i(5, 0)
			elif roll == 3:
				source_cell = Vector2i(6, 1)
			_draw_tile(_grass_tiles, source_cell, Vector2i(x, y))

func _draw_paths() -> void:
	for x in MAP_WIDTH:
		_draw_path_tile(Vector2i(x, 17))
	for y in MAP_HEIGHT:
		_draw_path_tile(Vector2i(31, y))
	for x in range(15, 32):
		_draw_path_tile(Vector2i(x, 5))
	for y in range(5, 18):
		_draw_path_tile(Vector2i(15, y))
	for x in range(4, 16):
		_draw_path_tile(Vector2i(x, 4))

func _draw_path_tile(cell: Vector2i) -> void:
	var variants := [
		Vector2i(2, 8),
		Vector2i(3, 8),
		Vector2i(4, 8),
		Vector2i(2, 9),
		Vector2i(3, 9),
	]
	_draw_tile(_grass_tiles, variants[abs(cell.x * 7 + cell.y * 11) % variants.size()], cell)

func _draw_field(origin: Vector2i, size: Vector2i) -> void:
	for y in size.y:
		for x in size.x:
			var wet := (x + y) % 5 == 0 or (x > 7 and y > 4)
			_draw_tilled_tile(origin + Vector2i(x, y), Vector2i(x, y), size, wet)

func _draw_tilled_tile(cell: Vector2i, local: Vector2i, field_size: Vector2i, wet: bool) -> void:
	var base_x := 6 if wet else 1
	var source_x := base_x + 1 + int((local.x + local.y) % 2)
	var source_y := 2 + int((local.x * 3 + local.y) % 2)

	if local.x == 0:
		source_x = base_x
	elif local.x == field_size.x - 1:
		source_x = base_x + 3

	if local.y == 0:
		source_y = 1
	elif local.y == field_size.y - 1:
		source_y = 4

	_draw_tile(_tilled_tiles, Vector2i(source_x, source_y), cell)

func _draw_pond(origin: Vector2i) -> void:
	for y in 7:
		for x in 7:
			_draw_tile(_water_tiles, Vector2i(x, y), origin + Vector2i(x, y))

func _draw_farmyard_fences() -> void:
	for x in range(6, 20):
		_draw_tile(_fences, Vector2i(4, 1), Vector2i(x, 7))
		_draw_tile(_fences, Vector2i(4, 6), Vector2i(x, 16))
	for y in range(8, 16):
		_draw_tile(_fences, Vector2i(2, 4), Vector2i(6, y))
		_draw_tile(_fences, Vector2i(6, 4), Vector2i(19, y))

	for x in range(3, 8):
		_draw_tile(_fences, Vector2i(4, 1), Vector2i(x, 13))
		_draw_tile(_fences, Vector2i(4, 6), Vector2i(x, 18))
	for y in range(14, 18):
		_draw_tile(_fences, Vector2i(2, 4), Vector2i(3, y))
		_draw_tile(_fences, Vector2i(6, 4), Vector2i(7, y))

func _draw_tile(texture: Texture2D, source_cell: Vector2i, target_cell: Vector2i) -> void:
	draw_texture_rect_region(
		texture,
		Rect2(target_cell.x * TILE_SIZE, target_cell.y * TILE_SIZE, TILE_SIZE, TILE_SIZE),
		Rect2(source_cell.x * SOURCE_TILE, source_cell.y * SOURCE_TILE, SOURCE_TILE, SOURCE_TILE)
	)

func _add_world_objects() -> void:
	_add_farmhouse()
	_add_prop("TreeNorthWest", _props, Rect2(11 * 16, 0, 64, 64), Vector2(122, 118), 2.0, Vector2(48, 28), "")
	_add_prop("TreeSouthEast", _props, Rect2(15 * 16, 0, 64, 64), Vector2(1160, 610), 2.0, Vector2(48, 28), "")
	_add_prop("ShippingCrates", _props, Rect2(0, 12 * 16, 32, 32), Vector2(640, 556), 2.0, Vector2(44, 30), "出货箱")
	_add_prop("SeedCrates", _props, Rect2(5 * 16, 12 * 16, 32, 32), Vector2(402, 184), 2.0, Vector2(44, 28), "种子和农具")
	_add_prop("Barrels", _props, Rect2(0, 4 * 16, 48, 48), Vector2(714, 570), 2.0, Vector2(72, 38), "")
	_add_prop("RockPile", _props, Rect2(3 * 16, 0, 64, 32), Vector2(255, 655), 2.0, Vector2(72, 28), "")
	_add_prop("Bushes", _props, Rect2(5 * 16, 2 * 16, 96, 32), Vector2(1010, 190), 2.0, Vector2(92, 24), "")
	_add_prop("Workbench", _props, Rect2(23 * 16, 10 * 16, 48, 32), Vector2(888, 558), 2.0, Vector2(76, 26), "临时加工台")
	_add_prop("WaterPoint", _props, Rect2(1 * 16, 17 * 16, 48, 16), Vector2(1008, 410), 2.0, Vector2(86, 22), "池塘取水点")
	_add_chickens()

func _add_farmhouse() -> void:
	var sprite := Sprite2D.new()
	sprite.name = "FarmhousePlaceholder"
	sprite.texture = FARMHOUSE_TEXTURE
	sprite.scale = Vector2(0.19, 0.19)
	sprite.position = Vector2(235, 160)
	sprite.offset = Vector2(0, -FARMHOUSE_TEXTURE.get_height() * 0.5)
	_world.add_child(sprite)

	_add_rect_collision(Vector2(235, 134), Vector2(176, 62))
	_add_interaction_area("FarmhouseDoor", Vector2(235, 177), Vector2(70, 50), "老宅入口")

func _add_prop(
	name: String,
	texture: Texture2D,
	region: Rect2,
	position: Vector2,
	scale_value: float,
	collision_size: Vector2,
	message: String
) -> Sprite2D:
	var sprite := Sprite2D.new()
	sprite.name = name
	sprite.texture = texture
	sprite.region_enabled = true
	sprite.region_rect = region
	sprite.scale = Vector2(scale_value, scale_value)
	sprite.position = position
	sprite.offset = Vector2(0, -region.size.y * 0.5)
	_world.add_child(sprite)

	if collision_size != Vector2.ZERO:
		_add_rect_collision(position - Vector2(0, collision_size.y * 0.35), collision_size)
	if message != "":
		_add_interaction_area(name + "Interact", position, collision_size + Vector2(42, 34), message)
	return sprite

func _add_chickens() -> void:
	var positions := [
		Vector2(162, 512),
		Vector2(210, 552),
		Vector2(154, 592),
	]
	for i in positions.size():
		var chicken := Sprite2D.new()
		chicken.name = "Chicken%d" % i
		chicken.texture = _chicken_idle_down
		chicken.region_enabled = true
		chicken.region_rect = Rect2((i % 4) * 16, 0, 16, 16)
		chicken.scale = Vector2(2.0, 2.0)
		chicken.position = positions[i]
		chicken.offset = Vector2(0, -8)
		_world.add_child(chicken)

func _add_player() -> void:
	var player := CharacterBody2D.new()
	player.name = "Player"
	player.position = Vector2(502, 384)
	player.script = PLAYER_CONTROLLER

	var sprite := Sprite2D.new()
	sprite.name = "Sprite"
	sprite.texture = _player_walk_down
	sprite.region_enabled = true
	sprite.region_rect = Rect2(16, 0, 16, 32)
	sprite.centered = false
	sprite.position = Vector2(-16, -64)
	sprite.scale = Vector2(2, 2)
	player.add_child(sprite)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(18, 10)
	shape.shape = rect
	shape.position = Vector2(0, -5)
	player.add_child(shape)

	var interact_area := Area2D.new()
	interact_area.name = "InteractArea"
	interact_area.collision_mask = 2
	var interact_shape := CollisionShape2D.new()
	var interact_circle := CircleShape2D.new()
	interact_circle.radius = 44.0
	interact_shape.shape = interact_circle
	interact_area.add_child(interact_shape)
	player.add_child(interact_area)
	_world.add_child(player)

func _add_collision() -> void:
	_add_rect_collision(Vector2(MAP_WIDTH * TILE_SIZE * 0.5, -16), Vector2(MAP_WIDTH * TILE_SIZE, 32))
	_add_rect_collision(Vector2(MAP_WIDTH * TILE_SIZE * 0.5, MAP_HEIGHT * TILE_SIZE + 16), Vector2(MAP_WIDTH * TILE_SIZE, 32))
	_add_rect_collision(Vector2(-16, MAP_HEIGHT * TILE_SIZE * 0.5), Vector2(32, MAP_HEIGHT * TILE_SIZE))
	_add_rect_collision(Vector2(MAP_WIDTH * TILE_SIZE + 16, MAP_HEIGHT * TILE_SIZE * 0.5), Vector2(32, MAP_HEIGHT * TILE_SIZE))
	_add_rect_collision(Vector2(1024, 470), Vector2(204, 130))
	_add_rect_collision(Vector2(160, 540), Vector2(150, 150))

func _add_rect_collision(center: Vector2, size: Vector2) -> void:
	var shape := RectangleShape2D.new()
	shape.size = size
	var collision := CollisionShape2D.new()
	collision.position = center
	collision.shape = shape
	_collision_body.add_child(collision)

func _add_interaction_area(name: String, position: Vector2, size: Vector2, message: String) -> void:
	var area := Area2D.new()
	area.name = name
	area.position = position
	area.collision_layer = 2
	area.collision_mask = 0
	area.add_to_group("p0_interactables")
	area.set_meta("message", message)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = size
	shape.shape = rect
	area.add_child(shape)
	add_child(area)

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(640, 360)
	camera.enabled = true
	add_child(camera)

func _add_ui() -> void:
	var layer := CanvasLayer.new()
	layer.name = "PrototypeUI"
	add_child(layer)

	var panel := ColorRect.new()
	panel.name = "StatusPanel"
	panel.color = Color(0.05, 0.04, 0.03, 0.58)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(286, 58)
	layer.add_child(panel)

	var label := Label.new()
	label.name = "StatusLabel"
	label.text = "Bloomseed 临时农场\nWASD 移动  E 交互"
	label.position = Vector2(38, 32)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)
