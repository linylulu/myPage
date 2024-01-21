const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();
const cons = require("./const");
const Utils = require('./utils')
const utils = new Utils();
const mergeFrame = require("./merge_frame");
const {mergeToFrame} = require("./merge_frame");


module.exports = {makeCennikHtml, makeOfertaGfx, makeOfertaHtml, makeOfertaItems, makeOfertaSrcDir,makeKontakt};


function makeCennikHtml() {
    const ofertaObj = readJson(false);
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR+'/_cennik-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);

    ofertaObj.forEach(item => {
        let tmp = '<li>';
        tmp += '<a href="' + item.id + '.html" class="text-decoration-none">' + item.name;
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
    mergeFrame.saveAndMerge('cennik.html',prefix)
}
/////////////////////////////////////////////////////

function makeOfertaGfx() {
    const ofertaObj = readJson(false);
    ofertaObj.forEach(item => {
        convertOfertaImages(item.id);
    });
}

function convertOfertaImages(subDir) {
    const sourceDir = cons.OFERTA_SOURCE_DIR + '/' +subDir;
    const targetDir = cons.rooted(cons.OFERTA_IMG_DIR) + '/' + subDir;
    const files = fs.readdirSync(sourceDir);
    utils.makeDir(targetDir);
    files.filter(s => s.endsWith('_1x1.jpg')).forEach(s => {
        const newName = targetDir + '/'+ s.replace('_1x1.jpg', '_1024x1024.webp')
        imageUtils.readResizeSaveImg(sourceDir + '/' + s, newName, 1024, 1024);
    });
}

const CARD_TEMPLATE =
    '        <div class="col">\n' +
    '<a class="unset" href="{$id}.html">\n' +
    '            <div class="card h-100">\n' +
    '                <img src="{$image}" class="card-img-top" alt="{$name}">\n' +
    '                <div class="card-body">\n' +
    '                    <h5 class="card-title">{$name}</h5>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            </a>\n' +
    '        </div>\n';

function makeOfertaHtml() {
    const ofertaObj = readJson();
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR +'/_oferta-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    ofertaObj.forEach(item => {
        var imgDir = cons.OFERTA_IMG_DIR + '/' + item.id;
        const mainImage = fs.readdirSync(cons.rooted(imgDir)).filter(s=>s.endsWith("_1024x1024.webp"))[0];

        var str = CARD_TEMPLATE.replace(/\{\$name\}/g, item.name).replace('{$id}',item.id);
        str = str.replace(/\{\$image\}/g, imgDir+"/"+mainImage);
        prefix += str;

    });
    prefix += postfix;
    mergeFrame.saveAndMerge("oferta.html",prefix)
}

function makeOfertaItems(args) {
    const ofertaObj = readJson();
    if (args.length < 1) {
        ofertaObj.forEach(item => makeOneOfertaItem(item, []));
        return;
    }
    if (args[0] == "all") {
        args = args.slice(1, args.length);
        ofertaObj.forEach(item => makeOneOfertaItem(item, args));
        return;
    }
    const itemId = args[0];
    const item = ofertaObj.find(i => i.id == itemId);
    if (item == null) {
        console.log("invalid item id:" + itemId);
        return;
    }
    args = args.slice(1, args.length);
    makeOneOfertaItem(item, args);
}

function makeOneOfertaItem(item, args) {
    makeOfertaItemHtml(item);
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
    item.prices.forEach(pr => {
        tmp += '<li>' + pr.name + ' - ' + pr.price + 'zł</li>\n';
    });
    if( item.options != null){
        item.options.forEach(op=>{
            tmp += '<li>' + op.name + (op.additional ? ' +' :  ' - ') + op.price + 'zł</li>\n';
        });
    }
    return tmp;
}


function makeOfertaItemHtml(item) {
    const pageName = item.id + '.html';
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_oferta-item-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    prefix = prefix.replace(/\{\$name\}/g, item.name);
    let desc = GAL_ITEM_DESC.replace('{$description}', item.description);
    desc = desc.replace('{$prices}', calcPrices(item))
    desc = desc.replace('{$carousel}',galeryItemCarousel(item));
    prefix += desc;
    prefix += postfix;
    mergeFrame.saveAndMerge(pageName,prefix,"oferta.html");
}


function galeryItemCarousel(item) {
    const imgDir = cons.OFERTA_TARGET_IMG_DIR + "/" + item.id + '/';
    const makeCarousel = item.images.length > 1;
    let result = '<div class="product-slick">\n';
    let nr = 0;
    item.images.forEach(image=>{
        result += '<div><img src="{$image}" alt="" class="img-fluid  image_zoom_cls-{$nr}"></div>\n'
            .replace('{$image}',imgDir+image.name)
            .replace('{$nr}',nr)
        nr++;
    })
    result += '</div>';
    result += '<div class="row"><div class="col-12 p-0"><div class="slider-nav">\n';
    item.images.forEach(image=>{
        result += '<div><img src="{$image}" alt="" class="img-fluid "></div>\n'
            .replace('{$image}',imgDir+image.name)
    })
    result += '</div></div></div>\n';
    return result;
}


// const GAL_IT_CAR_IT =
//     '      <div class="carousel-item {$active}">\n' +
//     '        <img src="{$img_dir}{$img_no}" class="d-block w-100" alt="opis">\n' +
//     '        <div class="carousel-caption d-none d-md-block">\n' +
//     '{$image_desc}\n' +
//     '        </div>\n' +
//     '      </div>\n';
//
// function carouselInner(item) {
//     let result = '<div class="carousel-inner">\n';
//     const imgDir = cons.OFERTA_TARGET_IMG_DIR + "/" + item.id + '/';
//
//     for (i = 0; i < item.images.length; i++) {
//         let tmp = GAL_IT_CAR_IT.replace('{$active}', i == 0 ? 'active' : '');
//         tmp = tmp.replace('{$img_dir}', imgDir);
//         tmp = tmp.replace('{$img_no}', item.images[i].name);
//         let d = item.images[i].description;
//         if (d == null) {
//             d = '';
//         }
//         tmp = tmp.replace('{$image_desc}', d);
//         result += tmp;
//     }
//     result += '</div>\n';
//     return result;
// }


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
function readJson(withSources = true) {
    const jsonContent = fs.readFileSync(cons.OFERTA_JSON_NAME, 'utf8');
    const obj = JSON.parse(jsonContent);
    if (withSources) {
        obj.forEach(item => readSourceDirectory(item, cons.rooted(cons.OFERTA_IMG_DIR)));
    }
    return obj;
}

function readSourceDirectory(ofertaObj, sourceGaleryDir) {
    const currentDir = sourceGaleryDir + "/" + ofertaObj.id;
    const files = fs.readdirSync(currentDir);
    const jpegFiles = files.filter(s => s.endsWith("_1024x1024.webp"));
    ofertaObj.images = [];
    jpegFiles.forEach(s => {
        const description = "";
        ofertaObj.images.push({name: s, description: description});
    })
}


function makeKontakt(){
    const name = 'kontakt.html';
    fs.copyFileSync(cons.TEMPLATES_SRC_DIR + '/_kontakt-template.html',cons.TEMP_DIR + '/' + name);
    mergeFrame.mergeToFrame(name);

}
