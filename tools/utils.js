const fs = require('fs');

module.exports = class Utils {
    readFileContent(fileName) {
        if (!fs.existsSync(fileName)) {
            return null;
        }
        return fs.readFileSync(fileName, 'utf8');
    }
    readImagesList(dir,postfix) {
        let filesList = [];
        const files = fs.readdirSync(dir, {withFileTypes: true});
        console.log("files",files);
        let i = 0;
        for (i = 0; i < files.length; i++) {
            const s = files[i];
            if (s.isDirectory()) {
                const next = this.readImagesList(dir + "/" + s.name,postfix);
                filesList = filesList.concat(next);

            } else {
                if (s.name.endsWith(postfix)) {

                    filesList.push("/"+s.path+"/"+s.name);
                }
            }
        }
        console.log("filesList",filesList);
        return filesList;
    }
}
