const ImageUtils = require('./image_utils.js')
const imageUtils = new ImageUtils();
const cons = require("./const");
const fs = require("fs");

const IM_W = 440;
const IM_H = 220;




const sourcePath="source/images/karuzela-main/";
const targetPath="img/karuzela/";
const images = ["k1","k2","k3","k4","k5","k6","k7","k8","k9"];
module.exports = {makeIndex,lowerCase};

const robo_dir = "../img/hgw/";

function doDir(){
    const files = fs.readdirSync(robo_dir).filter(s => s.endsWith(".JPG"));
    console.log(files);
    //const jpegFiles = files
    files.forEach(s=>{
        const name = s.replace(".JPG","");
        const n = robo_dir+name;
        doOneImage(n, 440,247);
        doOneImage(n, 400,400);
//        doOneImage(n, 800,400);

    });
}
function makeIndex(args) {
//    images.forEach(im => doOneImage(im,IM_W,IM_H));
    doDir();
}



function doOneImage(name, w,h){
    imageUtils.readRotateResizeSaveImg(name+'.JPG',
        name+'_'+w+'.webp',
        w,h);
}
function lowerCase(){
    dirToLower("../source/zdjecia")

}
function dirToLower(dir){
    const files = fs.readdirSync(dir);
    console.log(files);
    files.forEach(s=>{
        const name = s.toLowerCase();
        fs.renameSync(dir+"/"+s,dir+"/"+name);
    });
}

//function doOneImage(name, w,h){
//    imageUtils.readRotateResizeSaveImg(sourcePath+name+'.jpg',
//        targetPath+name+'_'+w+'.webp',
//        w,h);
//}
