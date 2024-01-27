import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';

export {makeIndex, makeCarouselGfx, addSizesToNames};




async function makeCarouselGfx(){
    const images = utils.readImagesList(cons.CAROUSEL_SRC_DIR,"_1x1.jpg");
    utils.makeDir(cons.rooted(cons.CAROUSEL_IMG_DIR));
    let i = 0;
    for (i = 0; i < images.length; i++) {
        const s = images[i];
        const  newName = cons.rooted(cons.CAROUSEL_IMG_DIR) + "/"+ s.name.replace("_1x1.jpg", "_440x440.webp");
        await imageUtils.readResizeSaveImg(s.path + "/" + s.name, newName, 440, 440);
    }
}

function makeIndex() {
    const images = utils.readImagesList(cons.rooted(cons.CAROUSEL_IMG_DIR),'_440x440.webp')
    images.sort((a,b)=>{
        return a.name.localeCompare(b.name);
    })
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_index-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    images.forEach(img=>{
        prefix += makeCarouselItem(cons.CAROUSEL_IMG_DIR+"/"+img.name);
    });
    prefix += postfix;
    mergeFrame.saveAndMerge('index.html',prefix)
}

const CAROUSEL_ITEM_TEMPLATE =
    '        <div>\n' +
    '            <img class="img-fluid" src="{$image}">\n' +
    '        </div>\n';


function makeCarouselItem(image, active){
    let response = CAROUSEL_ITEM_TEMPLATE;
    response = response.replace('{$image}', image);
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
    let i = 0;
    for (i = 0; i < files.length; i++) {
        const s = files[i];
        if (s.isDirectory()) {
            addSizesToNames(dir + "/" + s.name);
        } else {
            if (s.name.endsWith(".jpg")) {
                if (!(s.name.endsWith("_1x1.jpg") || s.name.endsWith("_16x9.jpg"))) {
                    const oldName = dir + "/" + s.name;
                    let img = await imageUtils.read_jpg(oldName);
                    const metadata = await img.metadata();
                    const w = metadata.width;
                    const h = metadata.height;
                    let sizeOk = false;
                    let newEnd = "";
                    if( w==h){
                        sizeOk = true;
                        newEnd = "_1x1.jpg";
                    }else if( w==4032 && h==2268){
                        sizeOk = true;
                        newEnd = "_16x9.jpg";
                    }else{
                        console.log("format?? " + oldName+" " + w + " " + h);
                    }
                    if( sizeOk ){
                        const newName = oldName.replace(".jpg",newEnd);
                        fs.renameSync(oldName, newName);
                    }
                }
            }
        }
    }
}
