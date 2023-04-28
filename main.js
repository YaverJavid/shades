function getHSLFromHex(hex) {
    var r = parseInt(hex.substring(1, 3), 16) / 255;
    var g = parseInt(hex.substring(3, 5), 16) / 255;
    var b = parseInt(hex.substring(5, 7), 16) / 255;
    var cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        hue = 0,
        saturation = 0,
        lightness = 0;
    if (delta === 0) {
        hue = 0;
    } else if (cmax === r) {
        hue = ((g - b) / delta) % 6;
    } else if (cmax === g) {
        hue = (b - r) / delta + 2;
    } else {
        hue = (r - g) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) {
        hue += 360;
    }
    lightness = (cmax + cmin) / 2;
    if (delta === 0) {
        saturation = 0;
    } else {
        saturation = delta / (1 - Math.abs(2 * lightness - 1));
    }
    return { hue: hue, saturation: saturation * 100, lightness: lightness * 100 };
}


let psedoElementForColorConversion = document.getElementById("psedo")

function cssToRGBAOrRgb(color) {
    psedoElementForColorConversion.style.background = color
    return window.getComputedStyle(
        psedoElementForColorConversion, true
    ).getPropertyValue("background-color")
}


function convertRGBAStrToObj(rgbaStr) {
    const rgbaArr = rgbaStr.match(/\d+/g).map(Number);
    if (rgbaArr[3] == undefined) rgbaArr[3] = 1
    return { r: rgbaArr[0], g: rgbaArr[1], b: rgbaArr[2], a: rgbaArr[3] };
}

function downloadImage(dataUrl, fileName = 'pixmacr-yj-') {
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function canvasToImage(canvas) {
    var img = new Image();
    img.src = canvas.toDataURL("image/png");
    return img;
}

function rgbaToHex(rgbaColor) {
    let rgbaValues = rgbaColor.substring(rgbaColor.indexOf('(') + 1, rgbaColor.lastIndexOf(')')).split(',');
    let r = parseInt(rgbaValues[0]);
    let g = parseInt(rgbaValues[1]);
    let b = parseInt(rgbaValues[2]);
    let a = parseFloat(rgbaValues[3]);

    let hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    if (!isNaN(a)) {
        let alpha = Math.round(a * 255).toString(16);
        hex += alpha.length === 1 ? '0' + alpha : alpha;
    }
    return hex;
}

function rgbToHex(str) {
    if (str.includes("rgba")) {
        return rgbaToHex(str)
    }
    str = str.replace('rgb(', '').replace(')').split(',')
    let r = parseInt(str[0])
    let g = parseInt(str[1])
    let b = parseInt(str[2])
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


let colorValue = color.value
let lightingColorValue = lighting_color.value

color.addEventListener("input", ()=>{
    colorValue = color.value
})
lighting_color.addEventListener("input", ()=>{
    lightingColorValue = lighting_color.value
})
color_string.addEventListener("input", ()=>{
    colorValue = rgbToHex(cssToRGBAOrRgb(color_string.value)) || color.value
    if(colorValue.length == 7) color.value =  colorValue
})

lighting_color_string.addEventListener("input", () => {
    lightingColorValue = rgbToHex(cssToRGBAOrRgb(lighting_color_string.value)) || lighting_color.value
    if(lightingColorValue.length == 7) lighting_color.value = lightingColorValue
})

document.querySelector("button").onclick = () => {
    let colors = [colorValue]
    let c1 = getHSLFromHex(colorValue)
    let lc = getHSLFromHex(lightingColorValue)
    let hueSpeed = parseFloat(hue_speed.value) * (lc.hue < c1.hue ? -1 : 1)
    console.log(hueSpeed);
    let brightnessSpeed = parseFloat(brightness_speed.value)
    while (true) {
        if (c1.hue + hueSpeed > 360 || c1.lightness + brightnessSpeed > 100) break
        colors.push(`hsl(${c1.hue += hueSpeed}, ${c1.saturation}%, ${c1.lightness += brightnessSpeed}%)`)
    }
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    canvas.height = 200
    canvas.width = colors.length * 200
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i]
        ctx.fillRect(200 * i, 0, 200, 200)
    }
    downloadImage(canvas.toDataURL(), "pallatte.shadesmacr.syn")
    document.body.append(canvas)
}

hue_speed.addEventListener("input", ()=>{
    hue_speed_shower.innerHTML = `(${hue_speed.value}&deg;)`
})

brightness_speed.addEventListener("input", ()=>{
    brightness_speed_shower.innerHTML = `(${brightness_speed.value}%)`
})
