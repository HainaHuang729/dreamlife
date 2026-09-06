extends CharacterBody2D

@export var speed := 140.0

var _nearby_farm_cells: Array[Area2D] = []

@onready var _interact_area: Area2D = $InteractArea

func _ready() -> void:
	_interact_area.area_entered.connect(_on_interact_area_entered)
	_interact_area.area_exited.connect(_on_interact_area_exited)

func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	if direction.length() > 1.0:
		direction = direction.normalized()

	velocity = direction * speed
	move_and_slide()

func _unhandled_input(event: InputEvent) -> void:
	if event.is_action_pressed("interact"):
		_interact_with_nearest_farm_cell()

func _on_interact_area_entered(area: Area2D) -> void:
	if area.is_in_group("farm_cells") and not _nearby_farm_cells.has(area):
		_nearby_farm_cells.append(area)

func _on_interact_area_exited(area: Area2D) -> void:
	_nearby_farm_cells.erase(area)

func _interact_with_nearest_farm_cell() -> void:
	var nearest := _nearest_farm_cell()
	if nearest == null:
		return
	if nearest.has_method("till"):
		nearest.till()

func _nearest_farm_cell() -> Area2D:
	var nearest: Area2D = null
	var nearest_distance := INF
	for cell in _nearby_farm_cells:
		if not is_instance_valid(cell):
			continue
		var distance := global_position.distance_squared_to(cell.global_position)
		if distance < nearest_distance:
			nearest = cell
			nearest_distance = distance
	return nearest
