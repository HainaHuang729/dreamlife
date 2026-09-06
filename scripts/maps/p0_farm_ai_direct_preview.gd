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
const GRASS_CLUSTER := preload("res://assets/ai_direct/run_005/processed/grass_cluster_ai_direct.png")
const FLOWER_WHITE := preload("res://assets/ai_direct/run_005/processed/flower_cluster_white_ai_direct.png")
const FLOWER_YELLOW := preload("res://assets/ai_direct/run_005/processed/flower_cluster_yellow_ai_direct.png")
const ROCKS := preload("res://assets/ai_direct/run_005/processed/rocks_ai_direct.png")
const PLAYER := preload("res://assets/ai_direct/run_005/processed/player_down_idle_ai_direct.png")

const BACKGROUND_SCALE := Vector2(1280.0 / 1672.0, 720.0 / 941.0)

var _y_sort_layer: Node2D

func _ready() -> void:
	_draw_terrain()
	_create_y_sort_layer()
	_add_world_props()
	_add_camera()

func _draw_terrain() -> void:
	var terrain := Sprite2D.new()
	terrain.name = "AI_Direct_Terrain_Layer"
	terrain.texture = TERRAIN
	terrain.centered = false
	terrain.scale = BACKGROUND_SCALE
	add_child(terrain)

func _create_y_sort_layer() -> void:
	_y_sort_layer = Node2D.new()
	_y_sort_layer.name = "AI_Direct_YSort_Props"
	_y_sort_layer.y_sort_enabled = true
	add_child(_y_sort_layer)

func _add_world_props() -> void:
	_add_prop("SeedStall", SEED_STALL, Vector2(222, 152), 0.28, Vector2(0, -10))
	_add_prop("NoticeBoard", NOTICE_BOARD, Vector2(962, 161), 0.22, Vector2(0, -8))
	_add_prop("ShippingBox", SHIPPING_BOX, Vector2(590, 425), 0.22, Vector2(0, -5))
	_add_prop("WaterWell", WATER_WELL, Vector2(1040, 404), 0.26, Vector2(0, -6))
	_add_prop("Fence", FENCE, Vector2(344, 152), 0.20, Vector2(0, 0))
	_add_prop("Barrel", BARREL, Vector2(704, 430), 0.18, Vector2(0, -4))
	_add_prop("CrateHoe", CRATE_HOE, Vector2(500, 430), 0.20, Vector2(0, -4))
	_add_prop("WateringCan", WATERING_CAN, Vector2(1090, 505), 0.15, Vector2(0, -2))
	_add_prop("GrassClusterA", GRASS_CLUSTER, Vector2(1130, 145), 0.16, Vector2.ZERO)
	_add_prop("GrassClusterB", GRASS_CLUSTER, Vector2(205, 560), 0.14, Vector2.ZERO)
	_add_prop("FlowerWhite", FLOWER_WHITE, Vector2(755, 246), 0.13, Vector2.ZERO)
	_add_prop("FlowerYellow", FLOWER_YELLOW, Vector2(980, 540), 0.14, Vector2.ZERO)
	_add_prop("Rocks", ROCKS, Vector2(825, 352), 0.13, Vector2.ZERO)
	_add_prop("Player", PLAYER, Vector2(528, 338), 0.25, Vector2(0, -12))

func _add_prop(name: String, texture: Texture2D, position: Vector2, scale_value: float, offset: Vector2) -> void:
	var sprite := Sprite2D.new()
	sprite.name = name
	sprite.texture = texture
	sprite.position = position
	sprite.scale = Vector2(scale_value, scale_value)
	sprite.offset = offset
	_y_sort_layer.add_child(sprite)

func _add_camera() -> void:
	var camera := Camera2D.new()
	camera.name = "Camera2D"
	camera.position = Vector2(640, 360)
	camera.enabled = true
	add_child(camera)
