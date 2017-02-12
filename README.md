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