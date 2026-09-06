# Quarter Tile Text Spec

状态：这是文字版规范，用来先确认自动瓦片生成逻辑。确认前不继续生成图片。

## 单格定义

每个完整 tile 是 `32x32`。

先把它切成 4 个 `16x16` 象限：

```text
+----+----+
| TL | TR |
+----+----+
| BL | BR |
+----+----+
```

bit 定义：

```text
TL = 1
TR = 2
BL = 4
BR = 8
```

每个 mask 是这四个象限的组合。

```text
0  = 0000 = 全草地
15 = 1111 = 全填充地形
```

## 16 个 mask

图例：

```text
. = grass / empty
# = filled terrain, such as dirt road / soil / water
```

### 0

```text
..
..
```

### 1 = TL

```text
#.
..
```

### 2 = TR

```text
.#
..
```

### 3 = TL + TR

```text
##
..
```

### 4 = BL

```text
..
#.
```

### 5 = TL + BL

```text
#.
#.
```

### 6 = TR + BL

```text
.#
#.
```

### 7 = TL + TR + BL

```text
##
#.
```

### 8 = BR

```text
..
.# 
```

### 9 = TL + BR

```text
#.
.# 
```

### 10 = TR + BR

```text
.#
.# 
```

### 11 = TL + TR + BR

```text
##
.# 
```

### 12 = BL + BR

```text
..
##
```

### 13 = TL + BL + BR

```text
#.
##
```

### 14 = TR + BL + BR

```text
.#
##
```

### 15 = TL + TR + BL + BR

```text
##
##
```

## 4x4 atlas 顺序

按 `0-15` 从左到右、从上到下排列：

```text
00 01 02 03
04 05 06 07
08 09 10 11
12 13 14 15
```

对应视觉：

```text
00: ..   01: #.   02: .#   03: ##
    ..       ..       ..       ..

04: ..   05: #.   06: .#   07: ##
    #.       #.       #.       #.

08: ..   09: #.   10: .#   11: ##
    .#       .#       .#       .#

12: ..   13: #.   14: .#   15: ##
    ##       ##       ##       ##
```

## 拼贴算法

地图编辑层不直接记录 `32x32 tile`，而是记录更细的 `16x16 quarter grid`。

例如完整 tile 坐标是：

```text
tile = (x, y)
```

它对应的 quarter 坐标是：

```text
TL = (x * 2,     y * 2)
TR = (x * 2 + 1, y * 2)
BL = (x * 2,     y * 2 + 1)
BR = (x * 2 + 1, y * 2 + 1)
```

生成 mask：

```text
mask = 0
if TL filled: mask += 1
if TR filled: mask += 2
if BL filled: mask += 4
if BR filled: mask += 8
```

然后从 atlas 里取：

```text
atlas_col = mask % 4
atlas_row = mask / 4
```

## 美术生成要求

AI 生成时不应该理解为“道路方向连接”。

它只需要画：

```text
一个 tile 内四个象限的填充组合
```

要求：

- 启用的象限是地形材质。
- 未启用的象限是草地或底层材质。
- 相邻启用象限之间必须无缝连成一块。
- 启用象限和未启用象限之间才画边缘过渡。
- `15` 必须是完整填充 tile，不能有草地边。
- `0` 必须是完整底层 tile，不能有目标地形。

## 后续流程

确认这份文字版后，再按每个地形种类分别生成：

```text
path_quarter_4x4.png
soil_dry_quarter_4x4.png
soil_wet_quarter_4x4.png
water_quarter_4x4.png
```

每个都是独立 `4x4`、`16 mask`。
