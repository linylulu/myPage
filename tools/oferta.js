import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';


export {makeCennikHtml, makeOfertaGfx, makeOfertaHtml, makeOfertaItems, makeOfertaSrcDir, makeKontakt};

function makeCennikHtml() {
    const ofertaObj = utils.readJson(cons.OFERTA_JSON_NAME);
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR+'/_cennik-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);

    ofertaObj.forEach(item => {
        let tmp = '<li>';
        tmp += '<a href="' + item.id + '.html" class="link-black">' + item.name;
        if (item.prices === undefined) {
            tmp += ' - ' + item.price_string;
        } else if (item.prices.length == 1) {
            tmp += " - " + item.prices[0].price + 'zł';
        } else {
            let desc = '';
            let price = '';
            let prefix = '';
            item.prices.forEach(pr => {
                desc += prefix + pr.name;
                price += prefix + pr.price + 'zł';
                prefix = '/';
            });
            tmp += ' ' + desc + ' - ' + price;
        }
        if (item.options != null && item.options.length>0) {
            tmp += ' (';
            let first = true;
            item.options.forEach(option=>{
                if( !first){
                    tmp += ', ';
                }
                tmp += option.name +  (option.additional ? ' +' : ' '   )+ option.price + 'zł'
                first = false;
            });
            tmp += ')';
        }
        tmp += '</a>\n';
        tmp += '</li>';
        prefix += tmp;
    });
    prefix += postfix;
    mergeFrame.saveAndMerge('cennik.html', prefix,
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Cennik',
                'html': 'cennik.html'
            }
        ]);

}
/////////////////////////////////////////////////////

async function makeOfertaGfx() {
    const ofertaObj = utils.readJson(cons.OFERTA_JSON_NAME);
    let i = 0;
    for (i = 0; i < ofertaObj.length; i++) {
        const item = ofertaObj[i];
        await convertOfertaImages(item);
    }
}

function newW(w, h, newH) {
    return Math.round((w * newH) / h);
}

async function convertOfertaImages(item) {
    const sourceDir = cons.OFERTA_SRC_DIR + '/' + item.id;
    const targetDir = cons.OFERTA_IMG_DIR + '/' + item.id
    const targetRootedDir = cons.rooted(targetDir);
    const images = utils.readJson(sourceDir + '/' + cons.IMG_JSON_NAME);
    utils.makeDir(targetRootedDir);
    utils.makeDir(targetRootedDir + '/thumb');
    utils.makeDir(targetRootedDir + "/big");
    const img = [];

    let i = 0;
    for (i = 0; i < images.length; i++) {
        const image = images[i];
        const w = image.width;
        const h = image.height;

        const main = await makeOneSize(image, newW(w, h, 440), 440, sourceDir, targetRootedDir, '');
        main.fileName = image.fileName;
        main.thumb = await makeOneSize(image, newW(w, h, 240), 240, sourceDir, targetRootedDir, 'thumb/');
        main.big = await makeOneSize(image, newW(w, h, 1024), 1024, sourceDir, targetRootedDir, 'big/');

        img.push(main);
    }
    img.sort((a, b) => {
        return a.fileName.localeCompare(b.fileName);
    });
    utils.saveJson(targetRootedDir + '/' + cons.IMG_JSON_NAME, img);
}


async function makeOneSize(image, width, height, sourceDir, targetDir, targetSubdir) {
    const newName = targetSubdir + image.newName + '.jpg';

    await imageUtils.readResizeSaveImg(sourceDir + '/' + image.fileName,
        targetDir + '/' + newName, width, height);

    return {
        'alt': image.alt,
        'width': width,
        'height': height,
        'name': newName
    };
}

const CARD_TEMPLATE =
    '        <div class="col">\n' +
    '<a class="unset" href="{$id}.html">\n' +
    '            <div class="card h-100">\n' +
    '                <img src="/{$image}" width="{$width}" height="{$height}" class="img-fluid" loading="lazy" alt="{$alt}">\n' +
    '                <div class="card-body">\n' +
    '                    <h5 class="card-title">{$name}</h5>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            </a>\n' +
    '        </div>\n';

function makeOfertaHtml() {
    const ofertaObj = utils.readJson(cons.OFERTA_JSON_NAME);
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR +'/_oferta-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    ofertaObj.forEach(item => {
        const itemDir = cons.OFERTA_IMG_DIR + '/' + item.id;
        const itemImages = utils.readJson(cons.rooted(itemDir) + '/' + cons.IMG_JSON_NAME);
        const image = itemImages[0];
        let str = CARD_TEMPLATE.replace('{$name}', item.name).replace('{$id}', item.id);
        str = imageUtils.replaceWidthHeightAltName(str, image, itemDir);
        prefix += str;
    });
    prefix += postfix;
    mergeFrame.saveAndMerge("oferta.html", prefix,
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Oferta',
                'html': 'oferta.html'
            }
        ]);
}

function makeOfertaItems() {
    const ofertaObj = utils.readJson(cons.OFERTA_JSON_NAME);
    ofertaObj.forEach(item => makeOfertaItemHtml(item));
}


const GAL_ITEM_DESC =
    '  <div class="row m-0">\n' +
    '    <div class="col-lg-4">\n' +
    '{$carousel}' +
    '    </div>\n' +
    '    <div class="col-8 p-4 fw-semibold fs-5">\n' +
    '      <div class="pt-3 pt-sm-0">\n' +
    '        <p class="">Cena:</p>\n' +
    '        <ul class="text-lowercase">\n' +
    '          {$prices}' +
    '        </ul>\n' +
    '      </div>\n' +
    '      <p class="m-0">{$description}</p>\n' +
    '    </div>\n' +
    '  </div>\n';

function calcPrices(item) {
    let tmp = '';
    if (item.prices === undefined) {
        tmp += '<li>' + item.price_string + '</li>\n';
    } else {
    item.prices.forEach(pr => {
        tmp += '<li>' + pr.name + ' - ' + pr.price + 'zł</li>\n';
    });
        if (item.options != null) {
            item.options.forEach(op => {
                tmp += '<li>' + op.name + (op.additional ? ' +' : ' - ') + op.price + 'zł</li>\n';
        });
    }
    }
    return tmp;
}


function makeOfertaItemHtml(item) {
    const pageName = item.id + '.html';
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_oferta-item-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    prefix = prefix.replace('{$name}', item.name);
    prefix = prefix.replace('{$meta}', item.meta);
    let desc = GAL_ITEM_DESC.replace('{$description}', item.description);
    desc = desc.replace('{$prices}', calcPrices(item))
    desc = desc.replace('{$carousel}',galeryItemCarousel(item));
    prefix += desc;
    prefix += postfix;
    mergeFrame.saveAndMerge(pageName, prefix,
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Oferta',
                'html': 'oferta.html'
            },
            {
                'name': item.name,
                'html': pageName
            }
        ],
        "oferta.html");
}


function galeryItemCarousel(item) {
    const imgDir = cons.OFERTA_IMG_DIR + '/' + item.id;
    let images = utils.readJson(cons.rooted(imgDir) + '/' + cons.IMG_JSON_NAME)


    if (item.fixed_images !== undefined) {
        images = images.filter(img => item.fixed_images.includes(img.alt));
    }

    const makeCarousel = images.length > 1;
    let result = '<div class="product-slick">\n';
    let nr = 0;
    images.forEach(image => {
        let item = '<div><img src="/{$image}" width="{$width}" height="{$height}" alt="{$alt}" loading="lazy" class="img-fluid  image_zoom_cls-{$nr}"></div>\n';
        item = imageUtils.replaceWidthHeightAltName(item, image.big, imgDir)
            .replace('{$nr}', nr);
        result += item;
        nr++;
    })
    result += '</div>';
    if (images.length > 1) {

    result += '<div class="row"><div class="col-12 p-0"><div class="slider-nav">\n';
        images.forEach(image => {
            result += imageUtils.replaceWidthHeightAltName(
                '<div><img data-lazy="/{$image}" width="{$width}" height="{$height}" alt="{$alt}" class="img-fluid "></div>\n',
                image.thumb,
                imgDir);

    })
    result += '</div></div></div>\n';
    }
    return result;
}



function makeOfertaSrcDir() {
    const ofertaObj = readJson(false);
    ofertaObj.forEach(item => {
        const dir = cons.OFERTA_SOURCE_DIR + item.id;
        if (!fs.existsSync(dir)) {
            console.log("making: " + dir);
            fs.mkdirSync(dir);
        } else {
            console.log(dir + " existed");
        }
    });
}

/////////////////////////////////////////////////////

function readSourceDirectory(ofertaObj, sourceGaleryDir) {
    const currentDir = sourceGaleryDir + "/" + ofertaObj.id;
    const files = fs.readdirSync(currentDir);
    ofertaObj.images = files.filter(s => s.endsWith("_1024x1024.webp"));
}


function makeKontakt(){
    const name = 'kontakt.html';
    fs.copyFileSync(cons.TEMPLATES_SRC_DIR + '/_kontakt-template.html',cons.TEMP_DIR + '/' + name);
    mergeFrame.mergeToFrame(name,
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Kontakt',
                'html': 'kontakt.html'
            }
        ]);


}

