import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';
import sharp from 'sharp';
import * as util from "util";
export {makeIndex, makeCarouselGfx, addSizesToNames};


async function makeCarouselGfx() {
    utils.makeDir(cons.rooted(cons.CAROUSEL_IMG_DIR));
    const images = utils.readJson(cons.CAROUSEL_SRC_DIR + '/' + cons.IMG_JSON_NAME);
    let img = [];
    let i = 0;
    for (i = 0; i < images.length; i++) {
        const s = images[i];
        const newName = cons.rooted(cons.CAROUSEL_IMG_DIR) + '/' + s.newName + '.jpg';
        await imageUtils.readResizeSaveImg(cons.CAROUSEL_SRC_DIR + '/' + s.fileName, newName, 440, 440);
        img.push({
            'fileName': s.fileName,
            'width': 440,
            'height': 440,
            'alt': s.alt,
            'name': s.newName + '.jpg'
        });
    }
    utils.saveJson(cons.rooted(cons.CAROUSEL_IMG_DIR) + '/' + cons.IMG_JSON_NAME, img);
}

function makeIndex() {
    const images = utils.readJson(cons.rooted(cons.CAROUSEL_IMG_DIR) + '/' + cons.IMG_JSON_NAME);
    images.sort((a, b) => {
        return a.fileName.localeCompare(b.fileName);
    });
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_index-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    images.forEach(img => {
        prefix += makeCarouselItem(img);
    });
    prefix += postfix;
    mergeFrame.saveAndMerge('index.html', prefix, [{'name': 'Strona główna', 'html': 'index.html'}])
}

const CAROUSEL_ITEM_TEMPLATE =
    '        <div class="">\n' +
    '            <img class="img-fluid" width="{$width}" height="{$height}" data-lazy="/{$image}" alt="{$alt}">\n' +
    '        </div>\n';


function makeCarouselItem(img) {
    let response = CAROUSEL_ITEM_TEMPLATE;
    response = imageUtils.replaceWidthHeightAltName(response, img, cons.CAROUSEL_IMG_DIR);
    return response;
}


export function dirToLower(dir) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    console.log(files);
    files.forEach(s => {
        if (s.isDirectory()) {
            dirToLower(dir + "/" + s.name);
        }
        const oldName = dir + "/" + s.name;
        const name = dir + "/" + s.name.toLowerCase();
        fs.renameSync(oldName, name);
    });
}


async function addSizesToNames(dir) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    let images = [];
    let i = 0;
    for (i = 0; i < files.length; i++) {
        const s = files[i];
        if (s.isDirectory()) {
            addSizesToNames(dir + "/" + s.name);
        } else {
            const nameToLower = s.name.toLowerCase();
            if (isGfxFile(s.name)) {
                const fileName = dir + "/" + s.name;
                const altName = getAltName(s.name);
                const newName = altName;//getNewName(s.name);
                let img = await new sharp(fileName);
                const metadata = await img.metadata();
                const width = metadata.width;
                const heigt = metadata.height;
                images.push(
                    {
                        'fileName': s.name,
                        'alt': altName,
                        'newName': newName,
                        'width': width,
                        'height': heigt
                    }
                );
            }
        }
    }
    if (images.length > 0) {
        utils.saveJson(dir + '/' + cons.IMG_JSON_NAME, images);
    }
}

function getAltName(name) {
    let s = name.replace(/\d+\s/, '');
    s = s.replace('_ ', '');
    s = s.replace(/\.((jpg)|(jpeg)|(webp))$/i, '');
    return s;
}

function isGfxFile(name) {
    name = name.toLowerCase();
    if (name.endsWith('.jpeg') || name.endsWith('.jpg') || name.endsWith('.webp')) {
        return true;
    }
    return false;
}