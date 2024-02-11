import * as  fs from 'fs'
import * as cons from "./const.js";


export function readFileContent(fileName) {
        if (!fs.existsSync(fileName)) {
            return null;
        }
        return fs.readFileSync(fileName, 'utf8');
    }

export function makeDir(dir) {
        if (!fs.existsSync(dir)) {
            console.log("making: " + dir);
            fs.mkdirSync(dir,{ recursive: true });
        } else {
            console.log(dir + " existed");
        }
    }

export function copyDir(src, dest) {
        this.makeDir(dest);
        fs.cpSync(src,dest,{ recursive: true });
    };

export function saveJson(fileName, object) {
    fs.writeFileSync(fileName, JSON.stringify(object));
}

export function readJson(fileName) {
    const jsonContent = fs.readFileSync(fileName, 'utf8');
    return JSON.parse(jsonContent);
}


export function readImagesList(dir, postfix) {
        let filesList = [];
        const files = fs.readdirSync(dir, {withFileTypes: true});
        let i = 0;
        for (i = 0; i < files.length; i++) {
            const s = files[i];
            if (s.isDirectory()) {
                const next = this.readImagesList(dir + "/" + s.name,postfix);
                filesList = filesList.concat(next);
            } else {
                if (s.name.endsWith(postfix)) {
                    filesList.push(s);
                }
            }
        }
    // console.log("filesList",filesList);
        return filesList;
    }

