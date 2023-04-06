const Jimp = require("jimp");

const sourcePath="source/images/karuzela-main/";
const targetPath="img/karuzela/";
const desiredWidths = [540,720,960,1140,1320];
const images = ["k1","k2","k3","k4","k5","k6","k7","k8","k9"];



main();

async function main() {

    images.forEach(name=>doOneImage(name,440,0.5));
    //images.forEach(name=>printImage(name));
    const ratio = 1.5;
    // images.forEach(name=>{
    //     printImage(name)
//      desiredWidths.forEach(width=>{
//            doOneImage(name,width,ratio);
//      })
//     });
}


function targetFilename(name,width){
    return targetPath+name+"_"+width+".jpg";
}

function printImage(name) {
    let img = "<img ";
    img += "srcset=\"";
    for( i=0; i<desiredWidths.length; i++){
        const w = desiredWidths[i];
        img += targetFilename(name,w)+" "+w+"w";
        if( i< desiredWidths.length-1){
            img +=" ,";
        }
    }
    img +="\" ";


    img += "/>"
    console.log(img);
}

async function doOneImage(imgName,newWidth, ratio){
    const newHeight = Math.trunc(newWidth * ratio);
    const img = await read_jpg(sourcePath+imgName+".jpg");
    const newImage = await resizeImg(img,newWidth,newHeight);
    await newImage.write(targetPath+imgName+"_"+newWidth+".jpg");
}

async function resizeImg(img, newWidth, newHeight){
    const width = img.getWidth();
    const height = img.getHeight();
    const scaleX = newWidth/width;
    const scaleY = newHeight/height;
    let nW = 0;
    let nH = 0;
    if(scaleX > scaleY){
        nW = newWidth;
        nH = height*scaleX;
    }else{
        nH = newHeight;
        nW = width*scaleY;
    }

    await img.resize(nW,nH);
    const x = (nW-newWidth)/2;
    const y = (nH-newHeight)/2;
    await img.crop(x,y,newWidth,newHeight);
    return img;
}

async function read_jpg(name) {
    console.log(name);
    let x = null;
    await Jimp.read(name)
        .then(result => {
            console.log("b");
            x = result;
        })
        .catch(err => {
            console.log('Oh noes!! Error: ', err.code)
        });

    return x;
}

