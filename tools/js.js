const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


console.log ( "Hello World");
try {
    const newMain = new JSDOM(fs.readFileSync('index.html', 'utf8')).window.document.querySelector("main");
    console.log(newMain);
    const pustakFile = fs.readFileSync('pustak.html', 'utf8');
    const dom = new JSDOM(pustakFile);
    const document = dom.window.document;
    const body = document.querySelector("body");
    const oldMain = document.querySelector("main");
//    body.replaceChild(newMain,oldMain);
    console.log(dom.serialize());
    fs.writeFileSync('dupa.html',dom.serialize());

//    const document = new DOMParser().parseFromString(pustakFile);
    // const one = new DOMParser();
//     let xmlDoc = null;//one.parseFromString(pustakFile);
//     //xmlDoc.getElementsByName("main");
//     JSDOM.fromFile("pustak.html", {}).then(dom => {
//         const document = dom.window.document;
// //        xmlDoc = dom;
//         let oldMain = document.getElementsByName("body");
//         console.log(document);
//     });
//    console.log(xmlDoc.serialize());
//    let oldMain = xmlDoc.getElementsByName("main");
    // xmlDoc.
} catch (err) {
    console.error(err);
}
