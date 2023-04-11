const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


const sourceDir = "source/"
const frameName = "_frame.html";
const frameFileName = sourceDir+frameName;
const cennikName = "cennik.html"

main();

function main(){
    make_page(cennikName);
    make_page("index.html");
    make_page("galeria.html");
}

function make_page(pageName){
    const frame = loadHtml(frameFileName);
    const frameDoc = frame.window.document;
    const page = loadHtml(sourceDir+pageName);
    const pageDoc = page.window.document;

    swapHead(frameDoc,pageDoc);
    swapMain(frameDoc,pageDoc);
    swapScripts(frameDoc,pageDoc);
    adjustNavBar(frameDoc,pageName);
    adjustImages(frameDoc);
    saveHtml(frame,pageName);
}

function adjustImages(frameDoc){
    const images = frameDoc.getElementsByTagName("img");
    for( i=0; i<images.length; i++) {
        shortenAttribute(images[i], "src");
    }
}

function adjustNavBar(frameDoc,makeActive){
    const navBar = frameDoc.getElementById("navBarContainer");
    const as = navBar.getElementsByTagName("a");
    for( i=0; i<as.length; i++){
        const aa = as[i];
        let href = shortenAttribute(aa,"href");
        if( href === makeActive){
            aa.setAttribute("href","#");
            aa.setAttribute("class",aa.getAttribute("class") + " active");
            aa.setAttribute("aria-current","page");
        }
    }
}
function swapHead(targetDoc,sourceDoc) {
    const sourceRoot = sourceDoc.getElementsByTagName("html")[0];
    const sourceHead = sourceRoot.getElementsByTagName("head")[0];
    const links = sourceHead.getElementsByTagName("link");
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