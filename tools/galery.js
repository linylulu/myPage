const fs = require('fs');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();

const MAIN_IMAGE_NAME = "_main.jpg"


const sourceGaleryDir = "source/galery/";
const jsonName = sourceGaleryDir + "galeria.json";

const targetGaleryImgDir = "img/galery/"

const MAIN_IMAGE_W = 200;
const MAIN_IMAGE_H = 200;

const GALERY_IMAGE_W = 768;
const GALERY_IMAGE_H = 380;

const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';

const CARD_TEMPLATE =
    '        <div class="col">\n' +
    '            <div class="card h-100">\n' +
    '                <img src="/img/galery/{$name}.jpg" class="card-img-top" alt="{$name}">\n' +
    '                <div class="card-body">\n' +
    '                    <h5 class="card-title">{$name}</h5>\n' +
    '                    <p class="card-text">{$description}</p>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n';


main()

function main() {
    const galeryObj = readJson();
    makeGaleryPage(galeryObj);
//    doDirs(galeryObj);
    //console.log(galeryObj);
     //make_galery_dirs(sourceGaleryDir);
//     make_galery_dirs(galeryObj,targetGaleryImgDir);

}

function makeGaleryPage(galeryObj){
    // make_directories(galeryObj,targetGaleryImgDir);
    // galeryObj.forEach(item=>readSourceDirectory(item,sourceGaleryDir));
    // scaleAndCopyImages(galeryObj,sourceGaleryDir,targetGaleryImgDir);
    makeGaleryHtml(galeryObj);
}


function makeGaleryHtml(galeryObj){
    const template =  readDescriptionFromFile("source/_galery-template.html");
    let prefix = template.substring(0,template.indexOf(TEMPLATE_START));
    const postfix = template.substring(template.indexOf(TEMPLATE_END)+TEMPLATE_END.length);
    galeryObj.forEach(item=>{
        let str = CARD_TEMPLATE.replace(/\{\$name\}/g,item.name);
        str = str.replace('{$description}',item.description);
        prefix += str;

    });
    prefix+=postfix;
    fs.writeFileSync("source/galeria.html",prefix);
}

function scaleAndCopyImages(galeryObj,sourceGaleryDir,targetGaleryImgDir){
    for( i=0; i<galeryObj.length;i++){
        scaleAndCopyImagesForOneDir(galeryObj[i],sourceGaleryDir,targetGaleryImgDir);
    }
}
function scaleAndCopyImagesForOneDir(item,sourceGaleryDir,targetGaleryImgDir){
    const sourceDir = sourceGaleryDir + item.name+ '/';
    imageUtils.readResizeSaveImg(sourceDir+item.mainImage,targetGaleryImgDir+item.name+".jpg",
        MAIN_IMAGE_W,MAIN_IMAGE_H);
    const targetDir = targetGaleryImgDir+item.name+'/';
    let cnt = 1;
    item.images.forEach(im=>{
        imageUtils.readResizeSaveImg(sourceDir+im.name,targetDir+cnt+".jpg",
            GALERY_IMAGE_W,GALERY_IMAGE_H);
        cnt++;
    });
}

function readSourceDirectory(galeryObj,sourceGaleryDir){
    const currentDir = sourceGaleryDir+galeryObj.name;
    const files = fs.readdirSync(currentDir);
    const jpegFiles = files.filter(s=>s.endsWith(".jpg"));
    const o = jpegFiles.find(s=>s==MAIN_IMAGE_NAME);
    galeryObj.mainImage = o!=null ? o : jpegFiles[0];
    galeryObj.images = [];
    jpegFiles.forEach(s=>{
        const description = readDescriptionFromFile((currentDir+'/'+s).replace('.jpg','.txt'))
        galeryObj.images.push({name: s, description: description});
    })
}

function readDescriptionFromFile(fileName){
    if (!fs.existsSync(fileName)) {
        return null;
    }
    return fs.readFileSync(fileName, 'utf8');
}

async function doDirs(galeryObj) {
    for (i = 0; i < galeryObj.length; i++) {
        await doOneItem(galeryObj[i]);
    }
}

async function doOneItem(item){
    const name = item.name;
    const dir = sourceGaleryDir + name;
    dirObj = fs.readdirSync(dir);
    const fileName = dir+"/"+dirObj[0];
    console.log(fileName);
    const image = await imageUtils.read_jpg(fileName);

    console.log("awaited")
}
function make_directories(galeryObj,prefix) {
    galeryObj.forEach(item=>{
        const name = item.name;
        const dir = prefix + name;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    })
}

function readJson() {
    const jsonContent = fs.readFileSync(jsonName, 'utf8');
    const obj = JSON.parse(jsonContent);
    return obj;
}


function readSourceXml() {
    const xmlContent = fs.readFileSync(jsonName, 'utf8');


    const DOM = new JSDOM(xmlContent, {contentType: "application/xhtml+xml"});
    const doc = DOM.window.document;
    return doc;
}