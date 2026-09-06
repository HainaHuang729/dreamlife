extends Area2D

@export var message := "Interact"

func _ready() -> void:
	add_to_group("p0_interactables")

func p0_interact() -> void:
	print(message)
