extends CharacterBody2D

@export var speed := 72.0

const FRAME_SIZE := Vector2(16, 32)
const FRAME_ORIGIN_X := 16
const FRAME_STRIDE_X := 32
const IDLE_FRAME := 2

var _nearby_interactables: Array[Area2D] = []
var _walk_time := 0.0

@onready var _sprite: Sprite2D = $Sprite
@onready var _interact_area: Area2D = $InteractArea

func _ready() -> void:
	_interact_area.area_entered.connect(_on_interact_area_entered)
	_interact_area.area_exited.connect(_on_interact_area_exited)
	_set_frame(IDLE_FRAME)

func _physics_process(delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	if direction.length() > 1.0:
		direction = direction.normalized()

	velocity = direction * speed
	move_and_slide()
	_update_walk_frame(delta, direction)

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("interact"):
		var nearest := _nearest_interactable()
		if nearest != null:
			print("Interact: %s" % nearest.get_meta("message", nearest.name))

func _on_interact_area_entered(area: Area2D) -> void:
	if area.is_in_group("p0_interactables") and not _nearby_interactables.has(area):
		_nearby_interactables.append(area)

func _on_interact_area_exited(area: Area2D) -> void:
	_nearby_interactables.erase(area)

func _nearest_interactable() -> Area2D:
	var nearest: Area2D = null
	var nearest_distance := INF
	for area in _nearby_interactables:
		if not is_instance_valid(area):
			continue
		var distance := global_position.distance_squared_to(area.global_position)
		if distance < nearest_distance:
			nearest = area
			nearest_distance = distance
	return nearest

func _update_walk_frame(delta: float, direction: Vector2) -> void:
	if direction.is_zero_approx():
		_walk_time = 0.0
		_set_frame(IDLE_FRAME)
		return
	_walk_time += delta
	_set_frame(int(_walk_time * 8.0) % 6)

func _set_frame(frame: int) -> void:
	_sprite.region_rect = Rect2(FRAME_ORIGIN_X + frame * FRAME_STRIDE_X, 0, FRAME_SIZE.x, FRAME_SIZE.y)
