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

## Methods

| Method | Description | Usage | Output |
| --- | --- | --- | --- |
| hex() | Returns color in hex format. | `color("red").hex()` | `"#ff0000"` |
| rgb() | Returns color in RGB format. | `color("red").rgb()` | `"rgb(255, 0, 0)"` |
| rgba() | Returns color in RGBA format. If the color doesn't have <br>alpha value, it is set to 1. | `color("red").rgba()` | `"rgba(255, 0, 0, 1)"` |