import sharp from 'sharp';


export async function readResizeSaveImg(oldName, newName, newW, newH) {
        const img = await this.read_jpg(oldName);
        const newImage = await this.resizeImg(img,newW,newH);
        await newImage.toFile(newName);
        console.log("WRITTEN " + newName)
    }

export async function readRotateResizeSaveImg(oldName, newName, newW, newH) {
        let img = await this.read_jpg(oldName);
        const metadata = await img.metadata();
        console.log("size " + metadata.width + " " + metadata.height);
        if( newW > newH && metadata.width < metadata.height){

            img = img.rotate(90);
        }
        const newImage = this.resizeImg(img,newW,newH);
        newImage.toFile(newName);
        console.log("WRITTEN " + newName)
    }

export async function read_jpg(name) {
    return new sharp(name);
    }

export async function resizeImg(img, newWidth, newHeight) {
        return img.resize(newWidth,newHeight);
}
