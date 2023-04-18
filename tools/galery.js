const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();
const cons = require("./const");
const mergeFrame = require("./merge_frame");


module.exports = {makeCennikHtml, makeGalery, makeGaleryItems, makeGalerySrcDir};
const MAIN_IMAGE_NAME = "_main.jpg"


const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';

const CARD_TEMPLATE =
    '        <div class="col">\n' +
    '<a class="unset" href="{$name}.html">\n' +
    '            <div class="card h-100">\n' +
    '                <img src="/img/galery/{$name}.webp" class="card-img-top" alt="{$name}">\n' +
    '                <div class="card-body">\n' +
    '                    <h5 class="card-title">{$name}</h5>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            </a>\n' +
    '        </div>\n';


function makeGaleryItems(args) {
    const galeryObj = readJson();
    if (args.length < 1) {
        galeryObj.forEach(item => makeOneGaleryItem(item, []));
        return;
    }
    if (args[0] == "all") {
        args = args.slice(1, args.length);
        galeryObj.forEach(item => makeOneGaleryItem(item, args));
        return;
    }
    const itemId = args[0];
    const item = galeryObj.find(i => i.id == itemId);
    if (item == null) {
        console.log("invalid item id:" + itemId);
        return;
    }
    args = args.slice(1, args.length);
    makeOneGaleryItem(item, args);
}

function makeOneGaleryItem(item, args) {
    let command;
    if (args.length == 0) {
        command = 'all';
    } else {
        command = args[0];
    }

    if (command === 'all') {
        const galeryObj = readJson();
        makeGaleryItemGfx(item);
        makeGaleryItemHtml(item);
        return;
    }

    if (command === 'gfx') {
        const galeryObj = readJson();
        makeGaleryItemGfx(item);
        return;
    }

    if (command === 'html') {
        const galeryObj = readJson();
        makeGaleryItemHtml(item);
        return;
    }
    console.log("invalid parameter: " + args);
}

/*
    <div class="row p-4 fw-semibold fs-5">
        <p class="col-sm-9 m-0">Halter treningowy basic, przeznaczony do pracy z ziemi lub jazdy, wykonany z liny
            poliestrowej o średnicy 6mm. Rozmiarówka standardowa: shetty, pony, cob, full, xfull. Istnieje również
            możliwość wykonania haltera na wymiar. Zadaj nam pytanie o aktualnie dostępne kolory.</p>
        <div class="pt-3 pt-sm-0 col-sm-3">
            <p class="text-center">Cena:</p>
            <ul>
                <li>wodze zwykle – 75zł</li>
                <li>z karabińczykami ze stali nierdzewnej 95zł)</li>
            </ul>
        </div>
    </div>

*/


const GAL_ITEM_DESC = "  <div class=\"row p-4 fw-semibold fs-5\">\n" +
    "    <p class=\"col-sm-9 m-0\">{$description}</p>\n" +
    "        <div class=\"pt-3 pt-sm-0 col-sm-3\">\n" +
    "            <p class=\"text-center\">Cena:</p>\n" +
    "            <ul class=\"text-lowercase\">\n{$prices}" +
    "            </ul>\n" +
    "        </div>\n" +
    "  </div>\n";

function calcPrices(item) {
    if (item.prices.length == 1) {
        let tmp = '<li>' + item.name + ' - ' + item.prices[0].price + 'zł</li>';
        if (item.option != null) {
            tmp += '<li>' + item.option.name + ' - ' + item.option.price + 'zł</li>'
        }
        return tmp;
    }
    let tmp = '';
    item.prices.forEach(pr => {
        tmp += '<li>' + pr.name + ' - ' + pr.price + 'zł</li>\n';
    });
    return tmp;
}

function makeGaleryItemHtml(item) {
    const pageName = item.name + ".html";
    const template = readFileContent("source/_galery-item-template.html");
    let prefix = template.substring(0, template.indexOf(TEMPLATE_START));
    const postfix = template.substring(template.indexOf(TEMPLATE_END) + TEMPLATE_END.length);
    prefix = prefix.replace(/\{\$name\}/g, item.name);
    prefix += galeryItemCarousel(item);
    let desc = GAL_ITEM_DESC.replace('{$description}', item.description);
    desc = desc.replace('{$prices}', calcPrices(item))
    prefix += desc;
    prefix += postfix;
    fs.writeFileSync("source/" + pageName, prefix);
    mergeFrame.mergeToFrame(pageName, "galeria.html");
}


const GITEM_CAR_BEGIN = '<div id="carouselExampleCaptions" class="carousel slide">';

const GITEM_CAR_END = '    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">\n' +
    '      <span class="carousel-control-prev-icon" aria-hidden="true"></span>\n' +
    '      <span class="visually-hidden">Previous</span>\n' +
    '    </button>\n' +
    '    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">\n' +
    '      <span class="carousel-control-next-icon" aria-hidden="true"></span>\n' +
    '      <span class="visually-hidden">Next</span>\n' +
    '    </button>\n';

function galeryItemCarousel(item) {
    const makeCarousel = item.images.length > 1;
    let result = makeCarousel ? GITEM_CAR_BEGIN : '';
    if (makeCarousel) {
        result += carouselIndicators(item);
    }
    result += carouselInner(item);
    if (makeCarousel) {
        result += GITEM_CAR_END;
    }
    result += '</div>\n';
    return result;
}

function carouselIndicators(item) {
    let result = "    <div class=\"carousel-indicators\">\n";
    for (i = 0; i < item.images.length; i++) {
        if (i == 0) {
            result += '<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>\n';
        } else {
            result += '<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="' + i + '" aria-label="Slide ' + (i + 1) + '"></button>\n';
        }
    }
    result += "</div>\n";
    return result;
}

const GAL_IT_CAR_IT =
    '      <div class="carousel-item {$active}">\n' +
    '        <img src="{$img_dir}{$img_no}.webp" class="d-block w-100" alt="opis">\n' +
    '        <div class="carousel-caption d-none d-md-block">\n' +
    '{$image_desc}\n' +
    '        </div>\n' +
    '      </div>\n';

function carouselInner(item) {
    let result = '<div class="carousel-inner">\n';
    const imgDir = cons.GALERY_TARGET_IMG_DIR + item.name + '/';

    for (i = 0; i < item.images.length; i++) {
        let tmp = GAL_IT_CAR_IT.replace('{$active}', i == 0 ? 'active' : '');
        tmp = tmp.replace('{$img_dir}', imgDir);
        tmp = tmp.replace('{$img_no}', i + 1);
        let d = item.images[i].description;
        if (d == null) {
            d = '';
        }
        tmp = tmp.replace('{$image_desc}', d);
        result += tmp;
    }
    result += '</div>\n';
    return result;
}

function makeGaleryItemGfx(item) {
    const sourceDir = cons.GALERY_SOURCE_DIR + item.id + '/';
    const targetDir = cons.GALERY_TARGET_IMG_DIR + item.name + '/';
    if (!fs.existsSync(targetDir)) {
        console.log("making: " + targetDir);
        fs.mkdirSync(targetDir);
    } else {
        console.log(targetDir + " existed");
    }

    let cnt = 1;
    item.images.forEach(im => {
        imageUtils.readResizeSaveImg(sourceDir + im.name, targetDir + cnt + ".webp",
            cons.GALERY_IMAGE_W, cons.GALERY_IMAGE_H);
        cnt++;
    });
}


function makeGalerySrcDir() {
    const galeryObj = readJson(false);
    galeryObj.forEach(item => {
        const dir = cons.GALERY_SOURCE_DIR + item.id;
        if (!fs.existsSync(dir)) {
            console.log("making: " + dir);
            fs.mkdirSync(dir);
        } else {
            console.log(dir + " existed");
        }
    });
}


function makeGalery(args) {
    let command;
    if (args.length == 0) {
        command = 'all';
    } else {
        command = args[0];
    }
    if (command === 'all') {
        const galeryObj = readJson();
        makeGaleryGfx(galeryObj);
        makeGaleryHtml(galeryObj);
        return;
    }
    if (command === 'gfx') {
        const galeryObj = readJson();
        makeGaleryGfx(galeryObj);
    }
    if (command === 'html') {
        const galeryObj = readJson();
        makeGaleryHtml(galeryObj);
        return;
    }
    console.log("invalid parameter: " + args);

}

function makeGaleryGfx(galeryObj) {
    galeryObj.forEach(item => {
        const sourceDir = cons.GALERY_SOURCE_DIR + item.id + '/';
        imageUtils.readResizeSaveImg(sourceDir + item.mainImage, cons.GALERY_TARGET_IMG_DIR + item.name + ".webp",
            cons.MAIN_IMAGE_W, cons.MAIN_IMAGE_H);
    });
}

function makeGaleryHtml(galeryObj) {
    const template = readFileContent("source/_galery-template.html");
    let prefix = template.substring(0, template.indexOf(TEMPLATE_START));
    const postfix = template.substring(template.indexOf(TEMPLATE_END) + TEMPLATE_END.length);
    galeryObj.forEach(item => {
        let str = CARD_TEMPLATE.replace(/\{\$name\}/g, item.name);
        str = str.replace('{$description}', item.description);
        prefix += str;

    });
    prefix += postfix;
    fs.writeFileSync("source/galeria.html", prefix);
    mergeFrame.mergeToFrame("galeria.html")
}

function makeCennikHtml() {
    const galeryObj = readJson();
    const template = readFileContent("source/_cennik-template.html");
    let prefix = template.substring(0, template.indexOf(TEMPLATE_START));
    const postfix = template.substring(template.indexOf(TEMPLATE_END) + TEMPLATE_END.length);

    galeryObj.forEach(item => {
        let tmp = '<li>';
        tmp += '<a href="' + item.name + '.html">' + item.name;
        if (item.prices.length == 1) {
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
        if (item.option != null) {
            tmp += ' (' + item.option.name + ' ' + item.option.price + 'zł)';
        }
        tmp += '</a>\n';
        tmp += '</li>';
        prefix += tmp;
    });
    prefix += postfix;
    fs.writeFileSync("source/cennik.html", prefix);
    mergeFrame.mergeToFrame("cennik.html")
}

function readJson(withSources = true) {
    const jsonContent = fs.readFileSync(cons.GALERY_JSON_NAME, 'utf8');
    const obj = JSON.parse(jsonContent);
    if (withSources) {
        obj.forEach(item => readSourceDirectory(item, cons.GALERY_SOURCE_DIR));
    }
    return obj;
}

function readSourceDirectory(galeryObj, sourceGaleryDir) {
    const currentDir = sourceGaleryDir + galeryObj.id;
    const files = fs.readdirSync(currentDir);
    const jpegFiles = files.filter(s => s.endsWith(".jpg"));
    const o = jpegFiles.find(s => s == MAIN_IMAGE_NAME);
    galeryObj.mainImage = o != null ? o : jpegFiles[0];
    galeryObj.images = [];
    jpegFiles.forEach(s => {
        const description = readFileContent((currentDir + '/' + s).replace('.jpg', '.txt'))
        galeryObj.images.push({name: s, description: description});
    })
}

function readFileContent(fileName) {
    if (!fs.existsSync(fileName)) {
        return null;
    }
    return fs.readFileSync(fileName, 'utf8');
}



