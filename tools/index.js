const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();
const cons = require("./const");
const fs = require("fs");

const IM_W = 440;
const IM_H = 220;


const sourcePath = "source/images/karuzela-main/";
const targetPath = "img/karuzela/";
const images = ["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8", "k9"];
module.exports = {makeIndex, lowerCase, addSizesToNames};

const robo_dir = "/img/hgw/";

function doDir() {
    const files = fs.readdirSync(robo_dir).filter(s => s.endsWith(".jpg"));
    console.log(files);
    //const jpegFiles = files
    files.forEach(s => {
        const name = s.replace(".JPG", "");
        const n = robo_dir + name;
        doOneImage(n, 440, 247);
        doOneImage(n, 400, 400);
//        doOneImage(n, 800,400);

    });
}

function makeIndex(args) {
//    images.forEach(im => doOneImage(im,IM_W,IM_H));
    doDir();
}


function doOneImage(name, w, h) {
    imageUtils.readRotateResizeSaveImg(name + '.jpg',
        name + '_' + w + '.webp',
        w, h);
}

function lowerCase() {
    dirToLower("/source/zdjecia")
}

function dirToLower(dir) {
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

async function addSizesToNames() {
    await _addSizesToNames("/source/zdjecia")
}

async function _addSizesToNames(dir) {
    const files = fs.readdirSync(dir, {withFileTypes: true});
    let i = 0;
    for (i = 0; i < files.length; i++) {
        const s = files[i];
        if (s.isDirectory()) {
            _addSizesToNames(dir + "/" + s.name);
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
                    if( w== 3024 && h==3024){
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
