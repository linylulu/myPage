const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();
const cons = require("./const");
const mergeFrame = require("./merge_frame");


module.exports = {makeGalery,makeGaleryItems,makeGalerySrcDir};
const MAIN_IMAGE_NAME = "_main.jpg"



const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';

const CARD_TEMPLATE =
    '        <div class="col">\n' +
    '<a class="unset" href="{$name}.html">\n'+
    '            <div class="card h-100">\n' +
    '                <img src="/img/galery/{$name}.jpg" class="card-img-top" alt="{$name}">\n' +
    '                <div class="card-body">\n' +
    '                    <h5 class="card-title">{$name}</h5>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            </a>\n'+
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
    console.log("makeOneGaleryItem:" + item.id + args);
}

function makeGalerySrcDir() {
    const galeryObj = readJson(false);
    galeryObj.forEach(item => {
        const dir = cons.GALERY_SOURCE_DIR + item.id;
        if (!fs.existsSync(dir)) {
            console.log("making: "+dir);
            fs.mkdirSync(dir);
        }else{
            console.log(dir + " existed");
        }
    });
}



function makeGalery(args){
    let command;
    if( args.length == 0 || args[0] == 'all'){
        command = 'all';
    }else{
        command = args[0];
    }
    if( command === 'all' ){
        const galeryObj = readJson();
        makeGaleryHtml(galeryObj);
        return;
    }
    if( command === 'gfx'){
        const galeryObj = readJson();
        makeGaleryGfx(galeryObj);
    }
    if( command === 'html'){
        const galeryObj = readJson();
        makeGaleryHtml(galeryObj);
        return;
    }
    console.log("invalid parameter: "+args);

}

function makeGaleryGfx(galeryObj){
    galeryObj.forEach(item=>{
        const sourceDir = cons.GALERY_SOURCE_DIR + item.id + '/';
        imageUtils.readResizeSaveImg(sourceDir + item.mainImage, cons.GALERY_TARGET_IMG_DIR + item.name + ".jpg",
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

function scaleAndCopyImages(galeryObj, sourceGaleryDir, targetGaleryImgDir) {
    for (i = 0; i < galeryObj.length; i++) {
        scaleAndCopyImagesForOneDir(galeryObj[i], sourceGaleryDir, targetGaleryImgDir);
    }
}

function scaleAndCopyImagesForOneDir(item, sourceGaleryDir, targetGaleryImgDir) {
    const sourceDir = sourceGaleryDir + item.name + '/';
    imageUtils.readResizeSaveImg(sourceDir + item.mainImage, targetGaleryImgDir + item.name + ".jpg",
        MAIN_IMAGE_W, MAIN_IMAGE_H);
    const targetDir = targetGaleryImgDir + item.name + '/';
    let cnt = 1;
    item.images.forEach(im => {
        imageUtils.readResizeSaveImg(sourceDir + im.name, targetDir + cnt + ".jpg",
            GALERY_IMAGE_W, GALERY_IMAGE_H);
        cnt++;
    });
}



async function doDirs(galeryObj) {
    for (i = 0; i < galeryObj.length; i++) {
        await doOneItem(galeryObj[i]);
    }
}

async function doOneItem(item) {
    const name = item.name;
    const dir = sourceGaleryDir + name;
    dirObj = fs.readdirSync(dir);
    const fileName = dir + "/" + dirObj[0];
    console.log(fileName);
    const image = await imageUtils.read_jpg(fileName);

    console.log("awaited")
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



