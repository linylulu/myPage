const Jimp = require("jimp");

module.exports = class ImageUtils {
    async readResizeSaveImg(oldName, newName, newW, newH) {
        const img = await this.read_jpg(oldName);
        const newImage = this.resizeImg(img,newW,newH);
        newImage.write(newName);
        console.log("WRITTEN " + newName)
    }

     async  read_jpg(name) {
        let x = null;
        await Jimp.read(name)
            .then(result => {
                console.log("wczytano "+name);
                x = result;
            })
            .catch(err => {
                console.log('Oh noes!! Error: ', err.code)
            });

        return x;
    }

    resizeImg(img, newWidth, newHeight) {
        const width = img.getWidth();
        const height = img.getHeight();
        const scaleX = newWidth / width;
        const scaleY = newHeight / height;
        let nW = 0;
        let nH = 0;
        if (scaleX > scaleY) {
            nW = newWidth;
            nH = height * scaleX;
        } else {
            nH = newHeight;
            nW = width * scaleY;
        }

        img.resize(nW, nH);
        const x = (nW - newWidth) / 2;
        const y = (nH - newHeight) / 2;
        img.crop(x, y, newWidth, newHeight);
        return img;
    }
}
