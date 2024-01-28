import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';
import {GALERY_IMG_DIR} from "./const.js";

const GALERY_THUMB_H = 200;
const THUMB_POSTIX = '_h200.webp';



async function makeThumb(directory, name) {
    const oldName = directory + "/" + name;
    let img = await imageUtils.read_jpg(oldName);
    const metadata = await img.metadata();
    const w = metadata.width;
    const h = metadata.height;
    const newW = Math.round((w * GALERY_THUMB_H) / h);
    const newName = name.replace(".jpg", THUMB_POSTIX);

    const newImage = await img.resize(newW, GALERY_THUMB_H);
    await newImage.toFile(cons.rooted(cons.GALERY_IMG_DIR) + '/' + newName);
    console.log("WRITTEN " + newName)

}

async function makeBig(directory, name) {
    const oldName = directory + "/" + name;
    let img = await imageUtils.read_jpg(oldName);
    const metadata = await img.metadata();
    const w = metadata.width;
    const h = metadata.height;

    let newW = w;
    let newH = h;
    if (h > 800) {
        newW = Math.round((w * 800) / h);
        newH = 800;
    }
    const newImage = await img.resize(newW, newH);
    const newName = cons.rooted(cons.GALERY_IMG_DIR) + '/' + name.replace('.jpg', '.webp')
    await newImage.toFile(newName);
    console.log("WRITTEN " + newName)
}

async function proceedOneImage(directory, name) {
    await makeThumb(directory, name);
    await makeBig(directory, name);
}

export async function makeGfx() {
    utils.makeDir(cons.rooted(cons.GALERY_IMG_DIR));
    const images = utils.readImagesList(cons.GALERY_SRC_DIR, ".jpg");
    let i = 0;
    for (i = 0; i < images.length; i++) {
        await proceedOneImage(cons.GALERY_SRC_DIR, images[i].name);
    }
}

const ITEM =
    '        <button type="button" class="m-0 p-0" data-bs-toggle="modal" data-bs-target="#exampleModal"\n' +
    '                data-big-pic="{$bigpic}">\n' +
    '          <div class="m-1"><img src="{$pic}" alt="" class=""></div>\n' +
    '        </button>\n';

function makeGaleryItem(name) {
    const pic = cons.GALERY_IMG_DIR + '/' + name;
    const bigpic = pic.replace(THUMB_POSTIX, '.webp')
    let result = ITEM.replace('{$pic}', pic);
    result = result.replace('{$bigpic}', bigpic)
    return result;
}

export async function makeHtml() {
    const images = utils.readImagesList(cons.rooted(cons.GALERY_IMG_DIR), THUMB_POSTIX)
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_galeria-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    images.forEach(img => {
        prefix += makeGaleryItem(img.name);
    });
    prefix += postfix;

    mergeFrame.saveAndMerge('galeria.html', prefix,
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Galeria',
                'html': 'galeria.html'
            }
        ]);

}