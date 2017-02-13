# color.js

A tiny library for color management.

**Example usage**

```javascript
var myColor = color("red");
```

## Properties

| Property | Description |
| --- | --- | --- | --- |
| `input` | The argument passed to the color function. It can be a color string or an RGB array. |
| `type` | Type of the color, e.g., `"rgb"`, `"rgba"`, `"hsl"`, `"hsla"`. |
| `values` | Color values for the given type of color, e.g., `[255, 0, 0]` for `"rgb"` of `"red"`. |



## Methods

| Conversion | Description | Usage | Output |
| --- | --- | --- | --- |
| `hex()` | Returns color in hex format. | `color("red").hex()` | `"#ff0000"` |
| `rgb()` | Returns color in RGB format. | `color("red").rgb()` | `"rgb(255, 0, 0)"` |
| `rgba()` | Returns color in RGBA format. <br> If the color doesn't have alpha value, it is set to 1. | `color("red").rgba()` | `"rgba(255, 0, 0, 1)"` |
| `hsl()` | Returns color in HSL format. | `color("red").hsl()` | `"hsl(0, 100%, 50%)"` |
| `hsla()` | Returns color in HSLA format. <br> If the color doesn't have alpha value, it is set to 1. | `color("red").hsla()` | `"hsla(0, 100%, 50%, 1)"` |

<table>
	<tr>
		<th>Modification</th>
		<th>Description</th>
		<th>Usage</th>
		<th>After Mod.</th>
	</tr>
	<tr>
		<td><code>hue()</code></td>
		<td>Shifts the hue by the entered amount. Since hue is a part of HSL, now the color is converted to HSL.</td>
		<td><code>color("red").hue(70)</code></td>
		<td><pre>{
	input  : "hsl(70, 100%, 50%)"
	type   : "hsl"
	values : [70, 100, 50])"
}</pre></td>
	</tr>
	<tr>
		<td><code>sat()</code></td>
		<td>Increases/decreases the saturation by the entered amount. ... color is converted to HSL.</td>
		<td><code>color("slateblue").sat(20)</code></td>
		<td><pre>{
	input  : "hsl(248, 73%, 58%)"
	type   : "hsl"
	values : [248, 73, 58])"
}</pre></td>
	</tr>
	<tr>
		<td><code>lum()</code></td>
		<td>Increases/decreases the luminosity by the entered amount. ... color is converted to HSL.</td>
		<td><code>color("slateblue").lum(20)</code></td>
		<td><pre>{
	input  : "hsl(248, 53%, 88%)"
	type   : "hsl"
	values : [248, 53, 78])"
}</pre></td>
	</tr>
</table>



