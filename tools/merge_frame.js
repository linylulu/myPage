import * as cons from './const.js';
import * as  fs from 'fs'
import * as jsdom from 'jsdom'
const { JSDOM } = jsdom;



const frameFileName = cons.TEMPLATES_SRC_DIR + '/_frame.html';

export function saveAndMerge(fileName, content, makeActive = null) {
    fs.writeFileSync(cons.TEMP_DIR + '/' + fileName, content);
    mergeToFrame(fileName,makeActive);
}

export function mergeToFrame(pageName, makeActive = null) {
    const frame = loadHtml(frameFileName);
    const frameDoc = frame.window.document;
    const page = loadHtml(cons.TEMP_DIR+'/'+pageName);
    const pageDoc = page.window.document;

    swapHead(frameDoc,pageDoc);
    swapMain(frameDoc,pageDoc);
    swapScripts(frameDoc,pageDoc);
    adjustNavBar(frameDoc,pageName,makeActive!=null? makeActive : pageName);
    adjustImages(frameDoc);
    saveHtml(frame,cons.ROOT_DIR +'/' + pageName);
}

function adjustImages(frameDoc){
    const images = frameDoc.getElementsByTagName("img");
    let i = 0;
    for( i=0; i<images.length; i++) {
        shortenAttribute(images[i], "src");
    }
}

function adjustNavBar(frameDoc,thisPage,makeActive){
    console.log(thisPage,makeActive);
    const navBar = frameDoc.getElementById("navBarContainer");
    const as = navBar.getElementsByTagName("a");
    let i = 0;
    for( i=0; i<as.length; i++){
        const aa = as[i];
        let href = shortenAttribute(aa,"href");
        if( href === thisPage){
            aa.setAttribute("href","#");
            aa.setAttribute("aria-current","page");
        }
        if( href === makeActive) {
            aa.setAttribute("class", aa.getAttribute("class") + " active");
        }
    }
}
function swapHead(targetDoc,sourceDoc) {
    const sourceRoot = sourceDoc.getElementsByTagName("html")[0];
    const sourceHead = sourceRoot.getElementsByTagName("head")[0];
    const links = sourceHead.getElementsByTagName("link");
    let i = 0;
    for( i=0; i<links.length; i++ ){
        shortenAttribute(links[i],"href");
    }
    const targetRoot = targetDoc.getElementsByTagName("html")[0];
    const targetHead = targetRoot.getElementsByTagName("head")[0];
    targetHead.replaceWith(targetDoc.adoptNode(sourceHead));
}

function swapScripts(targetDoc,sourceDoc){
    const sourceHtml = sourceDoc.getElementsByTagName("body")[0];
    const sourceScripts = sourceHtml.getElementsByTagName("script");

    const targetHtml = targetDoc.getElementsByTagName("body")[0];
    const targetScripts = targetHtml.getElementsByTagName("script");
    let i = 0;
    for( i=targetScripts.length-1; i>=0;i--){
        targetHtml.removeChild(targetScripts[i]);
    }
    while( sourceScripts.length > 0){
        const ss = sourceScripts[0];
        shortenAttribute(ss,"src");
        targetHtml.appendChild(targetDoc.adoptNode(ss));
    }
}

function shortenAttribute(element, attr){
    let val = element.getAttribute(attr);
    if( val != null){
        if( val.charAt(0) === '/'){
            val = val.substring(1);
            element.setAttribute(attr,val);
        }
    }
    return val;
}

function swapMain(targetDoc,sourceDoc) {
    const srcBody = sourceDoc.getElementsByTagName("body")[0];
    const srcMain = srcBody.getElementsByTagName("main")[0];

    const trgBody = targetDoc.getElementsByTagName("body")[0];
    const trgMain = trgBody.getElementsByTagName("main")[0];
    trgBody.replaceChild(targetDoc.adoptNode(srcMain),trgMain);
}

function loadHtml(fileName){
    const fileContent = fs.readFileSync(fileName, 'utf8');
    const dom = new JSDOM(fileContent);
    return dom;
}
function saveHtml(dom, fileName){
    fs.writeFileSync(fileName,dom.serialize());
}