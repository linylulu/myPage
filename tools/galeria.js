import * as cons from './const.js';
import * as utils from './utils.js';
import * as mergeFrame from './merge_frame.js';
import * as imageUtils from './image_utils.js';

const GALERY_THUMB_H = 200;


async function proceedOneImage(directory, img) {
    const fileName = cons.GALERY_SRC_DIR + "/" + img.fileName;
    const newW = Math.round((img.width * GALERY_THUMB_H) / img.height);
    const thumbName = img.newName + '.jpg';
    await imageUtils.readResizeSaveImg(fileName, cons.rooted(cons.GALERY_IMG_DIR) + '/' + thumbName, newW, GALERY_THUMB_H);

    let bigW = img.width;
    let bigH = img.height;
    if (bigH > 800) {
        bigW = Math.round((bigW * 800) / bigH);
        bigH = 800;
    }
    const bigName = 'big/' + thumbName;
    await imageUtils.readResizeSaveImg(fileName, cons.rooted(cons.GALERY_IMG_DIR) + '/' + bigName, bigW, bigH);

    return {
        'fileName': img.fileName,
        'alt': img.alt,
        'width': newW,
        'height': GALERY_THUMB_H,
        'name': thumbName,
        'bigName': bigName,
        'bigWidth': bigW,
        'bigHeight': bigH
    };
}




export async function makeGfx() {
    utils.makeDir(cons.rooted(cons.GALERY_IMG_DIR));
    utils.makeDir(cons.rooted(cons.GALERY_IMG_DIR) + '/big');

    const images = utils.readJson(cons.GALERY_SRC_DIR + '/' + cons.IMG_JSON_NAME);
    let img = [];
    let i = 0;
    for (i = 0; i < images.length; i++) {
        const obj = await proceedOneImage(cons.GALERY_SRC_DIR, images[i]);
        img.push(obj);
    }
    utils.saveJson(cons.rooted(cons.GALERY_IMG_DIR) + '/' + cons.IMG_JSON_NAME, img);
}

const ITEM =
    '        <button type="button" class="m-0 p-0" data-bs-toggle="modal" data-bs-target="#exampleModal"\n' +
    '                data-big-pic="/{$bigImage}" data-width="{$bigWidth}" data-height="{$bigHeight}">\n' +
    '          <div class="m-1"><img src="/{$image}" width="{$width}" height="{$height}"  loading="lazy" alt="{$alt}" class=""></div>\n' +
    '        </button>\n';


function makeGaleryItem(img) {
    let result = imageUtils.replaceWidthHeightAltName(ITEM, img, cons.GALERY_IMG_DIR);
    result = imageUtils.replaceBig(result, img, cons.GALERY_IMG_DIR);
    return result;
}

export async function makeHtml() {
    const img = utils.readJson(cons.rooted(cons.GALERY_IMG_DIR) + '/' + cons.IMG_JSON_NAME);
    img.sort((a, b) => {
        return -a.fileName.localeCompare(b.fileName);
    });

    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_galeria-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    img.forEach(i => {
        prefix += makeGaleryItem(i);
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