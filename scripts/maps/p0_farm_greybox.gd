extends Node2D

const TILE_SIZE := 16
const MAP_WIDTH := 30
const MAP_HEIGHT := 20

const TERRAIN_TEXTURE := preload("res://assets/pixel/terrain/terrain_p0_ai_v1.png")
const PLAYER_TEXTURE := preload("res://assets/pixel/characters/char_player_down_ai_v1.png")
const SHIPPING_BOX_TEXTURE := preload("res://assets/pixel/y_sort/object_shipping_box_ai_v1.png")
const NOTICE_BOARD_TEXTURE := preload("res://assets/pixel/interaction/interaction_notice_board_empty_ai_v1.png")
const WATER_PICKUP_TEXTURE := preload("res://assets/pixel/water/water_pickup_point_ai_v1.png")
const SEED_STALL_TEXTURE := preload("res://assets/pixel/buildings/building_seed_stall_ai_v1.png")
const TOOLBAR_TEXTURE := preload("res://assets/pixel/ui/ui_toolbar_ai_v1.png")
const PLAYER_CONTROLLER := preload("res://scripts/player/p0_player_controller.gd")
const FARM_PLOT_SCRIPT := preload("res://scripts/maps/p0_farm_plot.gd")
const INTERACTABLE_SCRIPT := preload("res://scripts/maps/p0_interactable.gd")

enum TerrainTile {
	GRASS,
	GRASS_VAR,
	DIRT_PATH,
	DIRT_PATH_EDGE,
	SOIL_DRY,
	SOIL_WET,
}

var _ground_layer: Node2D
var _farm_plot_layer: Node2D
var _water_layer: Node2D
var _world_objects: Node2D
var _ui_layer: CanvasLayer
var _player: CharacterBody2D

func _ready() -> void:
	_create_layers()
	_draw_ground()
	_draw_first_field()
	_draw_water_source()
	_draw_interactables()
	_add_player(Vector2(11 * TILE_SIZE + 8, 10 * TILE_SIZE + 8))
	_draw_ui()
	_add_camera()

func _create_layers() -> void:
	_ground_layer = Node2D.new()
	_ground_layer.name = "Terrain"
	add_child(_ground_layer)

	_farm_plot_layer = Node2D.new()
	_farm_plot_layer.name = "FarmPlot"
	add_child(_farm_plot_layer)

	_water_layer = Node2D.new()
	_water_layer.name = "Water"
	add_child(_water_layer)

	_world_objects = Node2D.new()
	_world_objects.name = "YSortObjects"
	_world_objects.y_sort_enabled = true
	add_child(_world_objects)

	_ui_layer = CanvasLayer.new()
	_ui_layer.name = "UI"
	add_child(_ui_layer)

func _draw_ground() -> void:
	for y in MAP_HEIGHT:
		for x in MAP_WIDTH:
			var tile := TerrainTile.GRASS_VAR if (x + y * 3) % 7 == 0 else TerrainTile.GRASS
			_add_terrain_tile(_ground_layer, Vector2i(x, y), tile)

	for x in range(0, MAP_WIDTH):
		_add_terrain_tile(_ground_layer, Vector2i(x, 14), TerrainTile.DIRT_PATH)
	for y in range(0, MAP_HEIGHT):
		_add_terrain_tile(_ground_layer, Vector2i(22, y), TerrainTile.DIRT_PATH)
	for x in range(0, MAP_WIDTH):
		_add_terrain_tile(_ground_layer, Vector2i(x, 13), TerrainTile.DIRT_PATH_EDGE)

func _draw_first_field() -> void:
	for y in range(6, 11):
		for x in range(6, 13):
			var area := Area2D.new()
			area.name = "FarmPlot_%d_%d" % [x, y]
			area.position = _cell_center(Vector2i(x, y))
			area.collision_layer = 2
			area.collision_mask = 0
			area.script = FARM_PLOT_SCRIPT
			_farm_plot_layer.add_child(area)
			var initial_state := 1 if (x + y) % 4 == 0 else 0
			area.setup(initial_state)

func _draw_water_source() -> void:
	var water := Sprite2D.new()
	water.name = "WaterPickupPoint"
	water.texture = WATER_PICKUP_TEXTURE
	water.position = _cell_center(Vector2i(23, 11))
	_water_layer.add_child(water)
	_add_interaction_area("WaterSourceInteract", water.position, Vector2(32, 32), "Water source")

func _draw_interactables() -> void:
	_add_sprite_object("ShippingBox", SHIPPING_BOX_TEXTURE, Vector2(18 * TILE_SIZE + 8, 13 * TILE_SIZE + 8), Vector2(0, -4))
	_add_interaction_area("ShippingBoxInteract", Vector2(18 * TILE_SIZE + 8, 13 * TILE_SIZE + 8), Vector2(24, 28), "Shipping box")
	_add_sprite_object("NoticeBoard", NOTICE_BOARD_TEXTURE, Vector2(22 * TILE_SIZE + 8, 5 * TILE_SIZE + 8), Vector2(0, -12))
	_add_interaction_area("NoticeBoardInteract", Vector2(22 * TILE_SIZE + 8, 5 * TILE_SIZE + 8), Vector2(48, 44), "Notice board")
	_add_seed_stall(Vector2(4 * TILE_SIZE + 8, 4 * TILE_SIZE + 8))

func _add_seed_stall(position: Vector2) -> void:
	var stall := Sprite2D.new()
	stall.name = "SeedStall"
	stall.texture = SEED_STALL_TEXTURE
	stall.position = position
	stall.offset = Vector2(0, -8)
	_world_objects.add_child(stall)
	_add_interaction_area("SeedStallInteract", position, Vector2(40, 32), "Seed stall")

func _add_player(position: Vector2) -> void:
	_player = CharacterBody2D.new()
	_player.name = "Player"
	_player.position = position
	_player.script = PLAYER_CONTROLLER

	var sprite := Sprite2D.new()
	sprite.name = "Sprite"
	sprite.texture = PLAYER_TEXTURE
	sprite.region_enabled = true
	sprite.region_rect = Rect2(0, 0, 16, 32)
	sprite.position = Vector2(0, -16)
	_player.add_child(sprite)

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(12, 8)
	shape.shape = rect
	shape.position = Vector2(0, -4)
	_player.add_child(shape)

	var interact_area := Area2D.new()
	interact_area.name = "InteractArea"
	interact_area.position = Vector2(0, -8)
	interact_area.collision_mask = 2
	var interact_shape := CollisionShape2D.new()
	var circle := CircleShape2D.new()
	circle.radius = 18.0
	interact_shape.shape = circle
	interact_area.add_child(interact_shape)
	_player.add_child(interact_area)
	_world_objects.add_child(_player)

func _draw_ui() -> void:
	var toolbar := Sprite2D.new()
	toolbar.name = "Toolbar"
	toolbar.texture = TOOLBAR_TEXTURE
	toolbar.scale = Vector2(2, 2)
	toolbar.position = Vector2(136, 680)
	_ui_layer.add_child(toolbar)

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(MAP_WIDTH * TILE_SIZE * 0.5, MAP_HEIGHT * TILE_SIZE * 0.5)
	camera.zoom = Vector2(2, 2)
	camera.enabled = true
	add_child(camera)

func _add_terrain_tile(parent: Node2D, cell: Vector2i, tile: int) -> void:
	var sprite := Sprite2D.new()
	sprite.texture = TERRAIN_TEXTURE
	sprite.region_enabled = true
	sprite.region_rect = Rect2(tile * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
	sprite.position = _cell_center(cell)
	parent.add_child(sprite)

func _add_sprite_object(name: String, texture: Texture2D, position: Vector2, offset: Vector2) -> void:
	var sprite := Sprite2D.new()
	sprite.name = name
	sprite.texture = texture
	sprite.position = position
	sprite.offset = offset
	_world_objects.add_child(sprite)

func _add_interaction_area(name: String, position: Vector2, size: Vector2, message: String) -> void:
	var area := Area2D.new()
	area.name = name
	area.position = position
	area.collision_layer = 2
	area.collision_mask = 0
	area.script = INTERACTABLE_SCRIPT
	area.message = message
	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = size
	shape.shape = rect
	area.add_child(shape)
	add_child(area)

func _cell_center(cell: Vector2i) -> Vector2:
	return Vector2(cell.x * TILE_SIZE + TILE_SIZE * 0.5, cell.y * TILE_SIZE + TILE_SIZE * 0.5)
