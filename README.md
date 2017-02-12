# color.js

A tiny library for color management.

**Example usage**

```javascript
var myColor = color("red");

/*	
	myColor = {
		input	: "red",
		type	: "rgb",
		values	: [255, 0, 0],
	}
*/
```

## Properties

| Property | Description |
| --- | --- | --- | --- |
| input | The argument passed to the color function. |
| type | Type of the color, e.g., "rgb", "rgba", "hsl", "hsla". |
| values | Color values for the given type of color, e.g., [255, 0, 0] for "rgb" of "red". |



## Methods

| Method | Description | Usage | Output |
| --- | --- | --- | --- |
| hex() | Returns color in hex format. | `color("red").hex()` | `"#ff0000"` |
| rgb() | Returns color in RGB format. | `color("red").rgb()` | `"rgb(255, 0, 0)"` |
| rgba() | Returns color in RGBA format. <br> If the color doesn't have alpha value, it is set to 1. | `color("red").rgba()` | `"rgba(255, 0, 0, 1)"` |
| hsl() | Returns color in HSL format. | `color("red").hsl()` | `"hsl(0, 100%, 50%)"` |
| hsla() | Returns color in HSLA format. <br> If the color doesn't have alpha value, it is set to 1. | `color("red").hsla()` | `"hsla(0, 100%, 50%, 1)"` |

