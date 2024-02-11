import sharp from 'sharp';


export async function readResizeSaveImg(oldName, newName, newW, newH) {
    await new sharp(oldName)
        .resize(newW, newH)
        .jpeg({
            quality: 50,
            progressive: true,
            optimiseScans: true,
            fporce: true
        })
        .toFile(newName);
        console.log("WRITTEN " + newName)
}


export async function read_jpg(name) {
    return new sharp(name);
    }

export async function resizeImg(img, newWidth, newHeight) {
        return img.resize(newWidth,newHeight);
}

export function replaceWidthHeightAlt(str, img) {
    let ret = str.replaceAll('{$width}', img.width);
    ret = ret.replaceAll('{$height}', img.height);
    ret = ret.replaceAll('{$alt}', img.alt);
    return ret;
}

export function replaceWidthHeightAltName(str, img, dir) {
    let ret = replaceWidthHeightAlt(str, img);
    ret = ret.replaceAll('{$image}', dir + '/' + img.name);
    return ret;
}

export function replaceBig(str, img, dir) {
    let ret = str.replaceAll('{$bigWidth}', img.bigWidth);
    ret = ret.replaceAll('{$bigHeight}', img.bigHeight);
    ret = ret.replaceAll('{$bigImage}', dir + '/' + img.bigName);
    return ret;
}

