extends Area2D

const TILE_SIZE := 16
const TERRAIN_TEXTURE := preload("res://assets/pixel/terrain/terrain_p0_strict_tiles.png")

enum PlotState {
	DRY,
	WET,
}

var state := PlotState.DRY
var _sprite: Sprite2D

func setup(initial_state: int) -> void:
	add_to_group("p0_interactables")
	state = initial_state
	_sprite = Sprite2D.new()
	_sprite.texture = TERRAIN_TEXTURE
	_sprite.region_enabled = true
	add_child(_sprite)
	_update_sprite()

	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(TILE_SIZE, TILE_SIZE)
	shape.shape = rect
	add_child(shape)

func p0_interact() -> void:
	state = PlotState.WET if state == PlotState.DRY else PlotState.DRY
	_update_sprite()
	print("Farm plot state: wet" if state == PlotState.WET else "Farm plot state: dry")

func _update_sprite() -> void:
	var tile_index := 5 if state == PlotState.WET else 4
	_sprite.region_rect = Rect2(tile_index * TILE_SIZE, 0, TILE_SIZE, TILE_SIZE)
