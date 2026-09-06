extends Node2D

const TERRAIN := preload("res://assets/ai_direct/run_005/terrain_layer_ai_direct.png")
const SEED_STALL := preload("res://assets/ai_direct/run_005/processed/seed_stall_ai_direct.png")
const NOTICE_BOARD := preload("res://assets/ai_direct/run_005/processed/notice_board_ai_direct.png")
const SHIPPING_BOX := preload("res://assets/ai_direct/run_005/processed/shipping_box_ai_direct.png")
const WATER_WELL := preload("res://assets/ai_direct/run_005/processed/water_well_ai_direct.png")
const FENCE := preload("res://assets/ai_direct/run_005/processed/fence_ai_direct.png")
const BARREL := preload("res://assets/ai_direct/run_005/processed/barrel_ai_direct.png")
const CRATE_HOE := preload("res://assets/ai_direct/run_005/processed/crate_hoe_ai_direct.png")
const WATERING_CAN := preload("res://assets/ai_direct/run_005/processed/watering_can_ai_direct.png")
const PLAYER := preload("res://assets/ai_direct/run_005/processed/player_down_idle_ai_direct.png")
const PLAYER_CONTROLLER := preload("res://scripts/player/p0_ai_direct_player_controller.gd")

const BACKGROUND_SCALE := Vector2(1280.0 / 1672.0, 720.0 / 941.0)

var _world: Node2D

func _ready() -> void:
	_draw_terrain()
	_create_world_layer()
	_add_props()
	_add_player()
	_add_collision_bounds()
	_add_ui()
	_add_camera()

func _draw_terrain() -> void:
	var terrain := Sprite2D.new()
	terrain.name = "AI_Direct_Terrain_Layer"
	terrain.texture = TERRAIN
	terrain.centered = false
	terrain.scale = BACKGROUND_SCALE
	add_child(terrain)

func _create_world_layer() -> void:
	_world = Node2D.new()
	_world.name = "AI_Direct_Playable_YSort"
	_world.y_sort_enabled = true
	add_child(_world)

func _add_props() -> void:
	_add_prop("SeedStall", SEED_STALL, Vector2(222, 152), 0.28, Vector2(0, -10), Vector2(84, 28), "种子摊")
	_add_prop("NoticeBoard", NOTICE_BOARD, Vector2(962, 161), 0.22, Vector2(0, -8), Vector2(52, 28), "公告栏")
	_add_prop("ShippingBox", SHIPPING_BOX, Vector2(590, 425), 0.22, Vector2(0, -5), Vector2(50, 30), "出货箱")
	_add_prop("WaterWell", WATER_WELL, Vector2(1040, 404), 0.26, Vector2(0, -6), Vector2(86, 44), "水井")
	_add_prop("Fence", FENCE, Vector2(344, 152), 0.20, Vector2.ZERO, Vector2(70, 18), "")
	_add_prop("Barrel", BARREL, Vector2(704, 430), 0.18, Vector2(0, -4), Vector2(24, 30), "")
	_add_prop("CrateHoe", CRATE_HOE, Vector2(500, 430), 0.20, Vector2(0, -4), Vector2(44, 28), "农具箱")
	_add_prop("WateringCan", WATERING_CAN, Vector2(1090, 505), 0.15, Vector2(0, -2), Vector2(28, 16), "水壶")

func _add_prop(
	name: String,
	texture: Texture2D,
	position: Vector2,
	scale_value: float,
	offset: Vector2,
	collision_size: Vector2,
	message: String
) -> void:
	var sprite := Sprite2D.new()
	sprite.name = name
	sprite.texture = texture
	sprite.position = position
	sprite.scale = Vector2(scale_value, scale_value)
	sprite.offset = offset
	_world.add_child(sprite)

	_add_static_collision(name + "Collision", position, collision_size)
	if message != "":
		_add_interaction_area(name + "Interact", position, collision_size + Vector2(36, 28), message)

func _add_player() -> void:
	var player := CharacterBody2D.new()
	player.name = "Player"
	player.position = Vector2(528, 338)
	player.script = PLAYER_CONTROLLER

	var sprite := Sprite2D.new()
	sprite.name = "Sprite"
	sprite.texture = PLAYER
	sprite.scale = Vector2(0.25, 0.25)
	sprite.position = Vector2(0, -28)
	player.add_child(sprite)

	var body_shape := CollisionShape2D.new()
	var body_rect := RectangleShape2D.new()
	body_rect.size = Vector2(18, 10)
	body_shape.shape = body_rect
	body_shape.position = Vector2(0, -5)
	player.add_child(body_shape)

	var interact_area := Area2D.new()
	interact_area.name = "InteractArea"
	interact_area.collision_mask = 2
	var interact_shape := CollisionShape2D.new()
	var interact_circle := CircleShape2D.new()
	interact_circle.radius = 38.0
	interact_shape.shape = interact_circle
	interact_area.add_child(interact_shape)
	player.add_child(interact_area)
	_world.add_child(player)

func _add_static_collision(name: String, position: Vector2, size: Vector2) -> void:
	var body := StaticBody2D.new()
	body.name = name
	body.position = position
	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = size
	shape.shape = rect
	body.add_child(shape)
	add_child(body)

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

func _add_collision_bounds() -> void:
	_add_static_collision("NorthBounds", Vector2(640, -16), Vector2(1280, 32))
	_add_static_collision("SouthBounds", Vector2(640, 736), Vector2(1280, 32))
	_add_static_collision("WestBounds", Vector2(-16, 360), Vector2(32, 720))
	_add_static_collision("EastBounds", Vector2(1296, 360), Vector2(32, 720))

func _add_ui() -> void:
	var layer := CanvasLayer.new()
	layer.name = "Run006UI"
	add_child(layer)

	var panel := ColorRect.new()
	panel.name = "StatusPanel"
	panel.color = Color(0.055, 0.044, 0.030, 0.72)
	panel.position = Vector2(24, 24)
	panel.size = Vector2(322, 64)
	layer.add_child(panel)

	var label := Label.new()
	label.name = "StatusLabel"
	label.text = "Run006  AI素材可玩化\nWASD移动  E交互"
	label.position = Vector2(38, 34)
	label.add_theme_font_size_override("font_size", 18)
	layer.add_child(label)

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(640, 360)
	camera.enabled = true
	add_child(camera)
