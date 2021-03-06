(function (window) {
    
    /* ==================== Helper Functions ==================== */
    
    function random() {
        if (arguments.length > 2) {
            return 0;
        }
        switch (arguments.length) {
            case 0:
                return Math.random();
            case 1:
                return Math.round(Math.random() * arguments[0]);
            case 2:
                var min = Math.min(arguments[0], arguments[1]);
                var max = Math.max(arguments[0], arguments[1]);
                return Math.round(min + Math.random() * (max - min));
        }
    }
    
    Number.prototype.between = function between(a, b, inclusive) {
        var min = Math.min(a, b);
        var max = Math.max(a, b);
        if (inclusive) {
            if (min <= this && this <= max) return true;
        } else {
            if (min < this && this < max) return true;
        }
        return false;
    };
    
    Number.prototype.clamp = function clamp(min, max) {
        return Math.min(Math.max(this, min), max);
    };
    
    Number.prototype.loop = function loop(min, max) {
        var num = this % max;
        if (num < min) {
            num += max;
        }
        return num;
    };
    
    Number.prototype.precision = function getSetPecision() {
        if (arguments.length == 1 && Number.isInteger(arguments[0])) {
            return parseFloat(this.toFixed(arguments[0]));
        } else {
            var value = parseFloat(this);
            if (Number.isFloat(value)) {
                return value.toString().split(".")[1].length;
            }
            return 0;
        }
    };
    
    /* ==================== Parsing CSS Color Strings ==================== */
    
    function parseHEX(input) {
        var match;
        if (match = input.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i)) {
            var hex;
            switch (match[1].length) {
                case 3: hex = match[1].match(/.{1,1}/g); break;
                case 6: hex = match[1].match(/.{1,2}/g); break;
            }
            return hex;
        }
        return null;
    }
    
    function parseRGB(input) {
        var match;
        if (match = input.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)) {
            var values = match.slice(1).map(function (num) {
                return parseInt(num, 10);
            }).filter(function (num) {
                if (num.between(0, 255, true)) {
                    return true;
                }
            });
            if (values.length == 3) {
                return values;
            }
            return null;
        }
        else if (match = input.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+|\d+\.\d+|\.\d+)\s*\)$/i)) {
            var values = [match[1], match[2], match[3]].map(function (num) {
                return parseInt(num, 10);
            }).filter(function (num) {
                if (num.between(0, 255, true)) {
                    return true;
                }
            });
            var alpha = parseFloat(match[4]);
            if (alpha.between(0, 1, true)) {
                values.push(alpha);
                if (values.length == 4) {
                    return values;
                }
            }
            return null;
        }
        return null;
    }
    
    function parseHSL(input) {
        var match;
        if (match = input.match(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i)) {
            var values = match.slice(1).map(function (item) {
                return parseInt(item, 10);
            });
            if (values[0].between(0, 360, true) && values[1].between(0, 100, true) && values[2].between(0, 100, true)) {
                return values;
            }
            return null;
        }
        else if (match = input.match(/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+|\d+\.\d+|\.\d+)\s*\)$/i)) {
            var values = [match[1], match[2], match[3]].map(function (num) {
                return parseInt(num, 10);
            });
            if (values[0].between(0, 360, true) && values[1].between(0, 100, true) && values[2].between(0, 100, true)) {
                var alpha = parseFloat(match[4]);
                if (alpha.between(0, 1, true)) {
                    values.push(alpha);
                    return values;
                }
            }
            return null;
        }
        return null;
    }
    
    /* ==================== Conversion Between Colors ==================== */
    
    function hex2rgb(RH, GH, BH) {
        return [
            parseInt(RH, 16),
            parseInt(GH, 16),
            parseInt(BH, 16),
        ];
    }
    function hex2hsl(RH, GH, BH) {
        var rgb = hex2rgb(RH, GH, BH);
        rgb.push(true);
        return rgb2hsl.apply(null, rgb);
    }
    
    function rgb2hex(r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        r = r.length < 2 ? "0" + r : r;
        g = g.length < 2 ? "0" + g : g;
        b = b.length < 2 ? "0" + b : b;
        return [r, g, b];
    }
    function rgb2hsl(r, g, b, round) {
        r /= 255,
        g /= 255,
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var lum = (max + min) / 2;
        var c   = max - min;
        var hue, sat;
        if (c == 0) {
            hue = sat = 0;
        } else {
            sat = c / (1 - Math.abs(2 * lum - 1));
            switch (max) {
                case r:
                    hue = (g - b) / c + (g < b ? (360/60) : (0/60));
                    break;
                case g:
                    hue = (b - r) / c + (120 / 60);
                    break;
                case b:
                    hue = (r - g) / c + (240 / 60);
                    break;
            }
        }
        hue *= 60;
        sat *= 100;
        lum *= 100;
        if (round) {
            return [
                Math.round(hue),
                Math.round(sat),
                Math.round(lum),
            ];
        }
        return [hue.precision(1), sat.precision(1), lum.precision(1)];
    }
    
    function hsl2hex(h, s, l) {
        return rgb2hex.apply(null, hsl2rgb(h, s, l));
    }
    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
    function hsl2rgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        var r, g, b;
        if (s == 0) {
            r = g = b = l;
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255),
        ];
    }
    
    /* ==================== Named HTML Colors ==================== */
    
    function keySearch(obj, key) {
        for (var prop in obj) {
            if (prop.toLowerCase() == key.toLowerCase()) {
                return prop;
            }
        }
        return null;
    }
    
    var namedColors = {
        "AliceBlue"             : [240, 248, 255],
        "AntiqueWhite"          : [250, 235, 215],
        "Aqua"                  : [0,   255, 255],
        "Aquamarine"            : [127, 255, 212],
        "Azure"                 : [240, 255, 255],
        "Beige"                 : [245, 245, 220],
        "Bisque"                : [255, 228, 196],
        "Black"                 : [0, 0, 0],
        "BlanchedAlmond"        : [255, 235, 205],
        "Blue"                  : [0, 0, 255],
        "BlueViolet"            : [138, 43, 226],
        "Brown"                 : [165, 42, 42],
        "BurlyWood"             : [222, 184, 135],
        "CadetBlue"             : [95, 158, 160],
        "Chartreuse"            : [127, 255, 0],
        "Chocolate"             : [210, 105, 30],
        "Coral"                 : [255, 127, 80],
        "CornflowerBlue"        : [100, 149, 237],
        "Cornsilk"              : [255, 248, 220],
        "Crimson"               : [220, 20, 60],
        "Cyan"                  : [0, 255, 255],
        "DarkBlue"              : [0, 0, 139],
        "DarkCyan"              : [0, 139, 139],
        "DarkGoldenRod"         : [184, 134, 11],
        "DarkGray"              : [169, 169, 169],
        "DarkGreen"             : [0, 100, 0],
        "DarkKhaki"             : [189, 183, 107],
        "DarkMagenta"           : [139, 0, 139],
        "DarkOliveGreen"        : [85, 107, 47],
        "DarkOrange"            : [255, 140, 0],
        "DarkOrchid"            : [153, 50, 204],
        "DarkRed"               : [139, 0, 0],
        "DarkSalmon"            : [233, 150, 122],
        "DarkSeaGreen"          : [143, 188, 143],
        "DarkSlateBlue"         : [72, 61, 139],
        "DarkSlateGray"         : [47, 79, 79],
        "DarkTurquoise"         : [0, 206, 209],
        "DarkViolet"            : [148, 0, 211],
        "DeepPink"              : [255, 20, 147],
        "DeepSkyBlue"           : [0, 191, 255],
        "DimGray"               : [105, 105, 105],
        "DodgerBlue"            : [30, 144, 255],
        "FireBrick"             : [178, 34, 34],
        "FloralWhite"           : [255, 250, 240],
        "ForestGreen"           : [34, 139, 34],
        "Fuchsia"               : [255, 0, 255],
        "Gainsboro"             : [220, 220, 220],
        "GhostWhite"            : [248, 248, 248],
        "Gold"                  : [255, 215, 0],
        "GoldenRod"             : [218, 165, 32],
        "Gray"                  : [128, 128, 128],
        "Green"                 : [0, 128, 0],
        "GreenYellow"           : [173, 255, 47],
        "HoneyDew"              : [240, 255, 240],
        "HotPink"               : [255, 105, 180],
        "IndianRed"             : [205, 92, 92],
        "Indigo"                : [75, 0, 130],
        "Ivory"                 : [255, 255, 240],
        "Khaki"                 : [240, 230, 140],
        "Lavender"              : [230, 230, 250],
        "LavenderBlush"         : [255, 240, 245],
        "LawnGreen"             : [124, 252, 0],
        "LemonChiffon"          : [255, 250, 205],
        "LightBlue"             : [173, 216, 230],
        "LightCoral"            : [240, 128, 128],
        "LightCyan"             : [224, 255, 255],
        "LightGoldenRodYellow"  : [250, 250, 210],
        "LightGray"             : [211, 211, 211],
        "LightGreen"            : [144, 238, 144],
        "LightPink"             : [255, 182, 193],
        "LightSalmon"           : [255, 160, 122],
        "LightSeaGreen"         : [32, 178, 170],
        "LightSkyBlue"          : [135, 206, 250],
        "LightSlateGray"        : [119, 136, 153],
        "LightSteelBlue"        : [176, 196, 222],
        "LightYellow"           : [255, 255, 224],
        "Lime"                  : [0, 255, 0],
        "LimeGreen"             : [50, 205, 50],
        "Linen"                 : [250, 240, 230],
        "Magenta"               : [255, 0, 255],
        "Maroon"                : [128, 0, 0],
        "MediumAquaMarine"      : [102, 205, 170],
        "MediumBlue"            : [0, 0, 205],
        "MediumOrchid"          : [186, 85, 211],
        "MediumPurple"          : [147, 112, 219],
        "MediumSeaGreen"        : [60, 179, 113],
        "MediumSlateBlue"       : [123, 104, 238],
        "MediumSpringGreen"     : [0, 250, 154],
        "MediumTurquoise"       : [72, 209, 204],
        "MediumVioletRed"       : [199, 21, 133],
        "MidnightBlue"          : [25, 25, 112],
        "MintCream"             : [245, 255, 250],
        "MistyRose"             : [255, 228, 225],
        "Moccasin"              : [255, 228, 181],
        "NavajoWhite"           : [255, 222, 173],
        "Navy"                  : [0, 0, 128],
        "OldLace"               : [253, 245, 230],
        "Olive"                 : [107, 142, 35],
        "OliveDrab"             : [128, 128, 0],
        "Orange"                : [255, 165, 0],
        "OrangeRed"             : [255, 69, 0],
        "Orchid"                : [218, 112, 214],
        "PaleGoldenRod"         : [238, 232, 170],
        "PaleGreen"             : [152, 251, 152],
        "PaleTurquoise"         : [175, 238, 238],
        "PaleVioletRed"         : [219, 112, 147],
        "PapayaWhip"            : [255, 239, 213],
        "PeachPuff"             : [255, 218, 185],
        "Peru"                  : [205, 133, 63],
        "Pink"                  : [255, 192, 203],
        "Plum"                  : [221, 160, 221],
        "PowderBlue"            : [176, 224, 230],
        "Purple"                : [128, 0, 128],
        "Red"                   : [255, 0, 0],
        "RosyBrown"             : [188, 143, 143],
        "RoyalBlue"             : [65, 105, 225],
        "SaddleBrown"           : [139, 69, 19],
        "Salmon"                : [250, 128, 114],
        "SandyBrown"            : [244, 164, 96],
        "SeaGreen"              : [46, 139, 87],
        "Seashell"              : [255, 245, 238],
        "Sienna"                : [160, 82, 45],
        "Silver"                : [192, 192, 192],
        "SkyBlue"               : [135, 206, 235],
        "SlateBlue"             : [106, 90, 205],
        "SlateGray"             : [112, 128, 144],
        "Snow"                  : [255, 250, 250],
        "SpringGreen"           : [0, 255, 127],
        "SteelBlue"             : [70, 130, 180],
        "Tan"                   : [210, 180, 140],
        "Teal"                  : [0, 128, 128],
        "Thistle"               : [216, 191, 216],
        "Tomato"                : [255, 99, 71],
        "Turquoise"             : [64, 224, 208],
        "Violet"                : [238, 130, 238],
        "Wheat"                 : [245, 222, 179],
        "White"                 : [255, 255, 255],
        "WhiteSmoke"            : [245, 245, 245],
        "Yellow"                : [255, 255, 0],
        "YellowGreen"           : [154, 205, 50],
    };
    
    /* ==================== Color Object ==================== */
    
    function color() {
        return new color.prototype.init(arguments);
    }
    
    color.prototype.init = function (args) {
        this.parse.apply(this, args);
    }
    
    color.prototype.init.prototype = color.prototype;
    
    color.random = function randomColor() {
        var r = random(0, 255);
        var g = random(0, 255);
        var b = random(0, 255);
        var a = parseFloat(random().toFixed(2));
        return color(r, g, b, a);
    }
    
    color.prototype.copy = function copyFrom(c) {
        if (c.input instanceof Array) {
            this.input = c.input.slice();
        } else {
           this.input = c.input; 
        }
        this.type   = c.type;
        this.values = c.values.slice();
    };
    
    color.prototype.clone = function clone() {
        var c = color();
        c.copy(this);
        return c;
    };
    
    color.prototype.parse = function () {
        this.input  = null;
        this.type   = null;
        this.values = [];
        var input   = null;
        switch (arguments.length) {
            case 0:
                this.copy(color.random());
                break;
            case 1:
                this.input = input = arguments[0];
                if (typeof input == "number" && input.between(0, 255, true)) {
                    this.type   = "rgb";
                    this.values = [input, input, input];
                }
                else if (typeof input == "string") {
                    var result, key;
                    if (result = parseHEX(input)) {
                        this.type   = "hex";
                        this.values = result;
                    }
                    else if (result = parseRGB(input)) {
                        switch (result.length) {
                            case 3: this.type = "rgb"; break;
                            case 4: this.type = "rgba"; break;
                        }
                        this.values = result;
                    }
                    else if (result = parseHSL(input)) {
                        switch (result.length) {
                            case 3: this.type = "hsl"; break;
                            case 4: this.type = "hsla"; break;
                        }
                        this.values = result;
                    }
                    else if (key = keySearch(namedColors, input)) {
                        this.type   = "rgb";
                        this.values = namedColors[key];
                    }
                }
                else if (input instanceof Array) {
                    if (input.length == 3 || input.length == 4) {
                        var rgb = input.slice().splice(0, 3).map(function (num) {
                            return parseInt(num, 10);
                        }).filter(function (num) {
                            if (num.between(0, 255)) {
                                return true;
                            }
                        });
                        if (rgb.length == 3) {
                            var alpha = input.slice().splice(3, 1);
                            if (alpha.length) {
                                alpha = parseFloat(alpha[0]);
                                if (alpha.between(0, 1, true)) {
                                    this.type   = "rgba";
                                    this.values = input;
                                }
                            } else {
                                this.type   = "rgb";
                                this.values = rgb;
                            }
                        }
                    }
                }
                break;
            case 3:
                this.input = input = Array.from(arguments);
                var rgb = input.map(function (num) {
                    return parseInt(num, 10);
                }).filter(function (num) {
                    if (num.between(0, 255, true)) {
                        return true;
                    }
                });
                if (rgb.length == 3) {
                    this.type = "rgb";
                    this.values = rgb;
                }
                break;
            case 4:
                this.input = input = Array.from(arguments);
                var rgba = [input[0], input[1], input[2]].map(function (num) {
                    return parseInt(num, 10);
                }).filter(function (num) {
                    if (num.between(0, 255, true)) {
                        return true;
                    }
                });
                if (rgba.length == 3) {
                    var alpha = parseFloat(input[3]);
                    if (alpha.between(0, 1, true)) {
                        rgba.push(alpha);
                        this.type = "rgba";
                        this.values = rgba;
                    }
                }
                break;
        }
    };
    
    color.prototype.hex = function toHex(valuesOnly) {
        var hex;
        switch (this.type) {
            case "hex":
                hex = this.values.slice();
                break;
            case "rgb":
            case "rgba":
                hex = rgb2hex.apply(null, this.values);
                break;
            case "hsl":
            case "hsla":
                hex = hsl2hex.apply(null, this.values);
                break;
        }
        if (valuesOnly) {
            return hex;
        }
        return "#" + hex.join("");
    };
    
    color.prototype.rgb = function toRGB(valuesOnly) {
        var rgb;
        switch (this.type) {
            case "hex":
                rgb = hex2rgb.apply(null, this.values);
                break;
            case "rgb":
                rgb = this.values.slice();
                break;
            case "rgba":
                rgb = this.values.slice().splice(0,3);
                break;
            case "hsl":
                var rgb = hsl2rgb.apply(null, this.values);
                break;
            case "hsla":
                var rgb = hsl2rgb.apply(null, this.values);
                break;
        }
        if (valuesOnly) {
            return rgb;
        }
        return "rgb(" + rgb.join(", ") + ")";
    };
    
    color.prototype.rgba = function toRGBA(valuesOnly) {
        var rgba;
        switch (this.type) {
            case "hex":
                rgba = hex2rgb.apply(null, this.values);
                rgba.push(1);
                break;
            case "rgb":
                rgba = this.values.slice();
                rgba.push(1);
                break;
            case "rgba":
                rgba = this.values.slice();
                break;
            case "hsl":
                rgba = hsl2rgb.apply(null, this.values);
                rgba.push(1);
                break;
            case "hsla":
                rgba = hsl2rgb.apply(null, this.values);
                rgba.push(this.values[3]);
                break;
        }
        if (valuesOnly) {
            return rgba;
        }
        return "rgba(" + rgba.join(", ") + ")";
    };
    
    color.prototype.hsl = function toHSL(valuesOnly) {
        var hsl;
        switch (this.type) {
            case "hex":
                hsl = hex2hsl.apply(null, this.values);
                break;
            case "rgb":
            case "rgba":
                var rgb = this.values.slice();
                if (this.type == "rgba") {
                   rgb.pop();
                }
                rgb.push(true);
                hsl = rgb2hsl.apply(null, rgb);
                break;
            case "hsl":
                hsl = this.values.slice();
                break;
            case "hsla":
                hsl = this.values.slice().splice(0,3);
                break;
        }
        if (valuesOnly) {
            return hsl;
        }
        return "hsl(" + hsl[0] + ", " + hsl[1] + "%, " + hsl[2] + "%)";
    };
    
    color.prototype.hsla = function toHSLA(valuesOnly) {
        var hsla;
        switch (this.type) {
            case "hex":
                hsla = hex2hsl.apply(null, this.values);
                hsla.push(1);
                break;
            case "rgb":
                var rgb = this.values.slice();
                rgb.push(true);
                hsla = rgb2hsl.apply(null, rgb);
                hsla.push(1);
                break;
            case "rgba":
                var rgb = this.values.slice();
                var alpha = rgb.pop();
                rgb.push(true);
                hsla = rgb2hsl.apply(null, rgb);
                hsla.push(alpha);
                break;
            case "hsl":
                hsla = this.values.slice();
                hsla.push(1);
                break;
            case "hsla":
                hsla = this.values.slice();
                break;
        }
        if (valuesOnly) {
            return hsla;
        }
        return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    
    color.prototype.hue = function hue(change) {
        if (this.values.length) {
            var temp;
            if (this.values.length == 4) {
                temp = color(this.hsla());
                temp.values[0] = (temp.values[0] + change).loop(0, 360);
                temp = color(temp.hsla());
            } else {
                temp = color(this.hsl());
                temp.values[0] = (temp.values[0] + change).loop(0, 360);
                temp = color(temp.hsl());
            }
            this.copy(temp);
        }
        return this;
    }
    
    color.prototype.sat = function saturation(change) {
        if (this.values.length) {
            var temp;
            if (this.values.length == 4) {
                temp = color(this.hsla());
                temp.values[1] = (temp.values[1] + change).clamp(0, 100);
                temp = color(temp.hsla());
            } else {
                temp = color(this.hsl());
                temp.values[1] = (temp.values[1] + change).clamp(0, 100);
                temp = color(temp.hsl());
            }
            this.copy(temp);
        }
        return this;
    }
    
    color.prototype.lum = function luminosity(change) {
        if (this.values.length) {
            var temp;
            if (this.values.length == 4) {
                temp = color(this.hsla());
                temp.values[2] = (temp.values[2] + change).clamp(0, 100);
                temp = color(temp.hsla());
            } else {
                temp = color(this.hsl());
                temp.values[2] = (temp.values[2] + change).clamp(0, 100);
                temp = color(temp.hsl());
            }
            this.copy(temp);
        }
        return this;
    }
    
    color.prototype.alpha = function alpha(change) {
        var temp = color(this.rgba());
        temp.values[3] = (temp.values[3] + change).clamp(0, 1);
        temp = color(temp.rgba());
        this.copy(temp);
        return this;
    }
    
    window.color = color;
    
})(window);