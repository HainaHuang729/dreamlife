extends Area2D

const UNTILLED_COLOR := Color(1.0, 0.9, 0.45, 0.18)
const TILLED_COLOR := Color(0.25, 0.13, 0.06, 0.75)

var state := "untilled"
var _overlay: Polygon2D
var _tilled_sprite: Sprite2D

func setup(cell: Vector2i, farm_kind: String, tile_size: int) -> void:
	set_meta("cell", cell)
	set_meta("farm_kind", farm_kind)
	add_to_group("farm_cells")

	_overlay = Polygon2D.new()
	_overlay.name = "StateOverlay"
	_overlay.position = Vector2(-tile_size * 0.5, -tile_size * 0.5)
	_overlay.polygon = PackedVector2Array([
		Vector2.ZERO,
		Vector2(tile_size, 0),
		Vector2(tile_size, tile_size),
		Vector2(0, tile_size),
	])
	_overlay.color = UNTILLED_COLOR
	add_child(_overlay)

	_tilled_sprite = Sprite2D.new()
	_tilled_sprite.name = "TilledTile"
	_tilled_sprite.texture = _load_png_texture("res://assets/tiles/farm_ascii/tilled_soil.png")
	_tilled_sprite.visible = false
	add_child(_tilled_sprite)

func _load_png_texture(path: String) -> Texture2D:
	var image := Image.load_from_file(path)
	if image == null:
		push_error("Cannot load farm cell texture: %s" % path)
		return PlaceholderTexture2D.new()
	return ImageTexture.create_from_image(image)

func till() -> void:
	if state != "untilled":
		return
	state = "tilled"
	set_meta("state", state)
	if _overlay != null:
		_overlay.visible = false
	if _tilled_sprite != null:
		_tilled_sprite.visible = true
