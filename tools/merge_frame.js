import * as cons from './const.js';
import * as  fs from 'fs'
import * as jsdom from 'jsdom'

const {JSDOM} = jsdom;



const frameFileName = cons.TEMPLATES_SRC_DIR + '/_frame.html';

export function saveAndMerge(fileName, content, breadCrumbs, makeActive = null) {
    fs.writeFileSync(cons.TEMP_DIR + '/' + fileName, content);
    mergeToFrame(fileName, breadCrumbs, makeActive);
}

export function mergeToFrame(pageName, breadCrumbs, makeActive = null) {
    const frame = loadHtml(frameFileName);
    const frameDoc = frame.window.document;
    const page = loadHtml(cons.TEMP_DIR+'/'+pageName);
    const pageDoc = page.window.document;

    swapHead(frameDoc,pageDoc);
    swapMain(frameDoc,pageDoc);
    swapScripts(frameDoc,pageDoc);
    adjustNavBar(frameDoc,pageName,makeActive!=null? makeActive : pageName);
//    adjustImages(frameDoc);
    let str = frame.serialize();
    str = str.replace('{$breadcrumb}', makeBreadCrumbs(breadCrumbs));
    str = str.replace('<meta name="cookieyes">', cons.ENV.cookieyes);
    str = str.replace('{$fb-chat-js}', cons.ENV.fb_chat);

    fs.writeFileSync(cons.ROOT_DIR + '/' + pageName, str);
}

const TEMPLATE_LINK = '<li class="breadcrumb-item"><a href={$html}>{$name}</a></li>';
const TEMPLATE_LAST = '<li class="breadcrumb-item active" aria-current="page">{$name}</li>';

function makeBreadCrumbs(breadCrumbs) {
    let str = '';
    let i = 0;
    const cnt = breadCrumbs.length;
    for (i = 0; i < cnt; i++) {
        const crumb = breadCrumbs[i];
        if (i < cnt - 1) {
            let tmp = TEMPLATE_LINK.replace('{$name}', crumb.name);
            tmp = tmp.replace('{$html}', crumb.html);
            str += tmp;
        } else {
            str += TEMPLATE_LAST.replace('{$name}', crumb.name);
        }
    }
    return str;
}

// function adjustImages(frameDoc){
//     const images = frameDoc.getElementsByTagName("img");
//     let i = 0;
//     for( i=0; i<images.length; i++) {
//         shortenAttribute(images[i], "src");
//     }
// }

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
    const sourceTitle = sourceHead.getElementsByTagName("title")[0];
    const sourceMeta = sourceHead.getElementsByTagName("meta")[0];
    //
    // let i = 0;
    // for( i=0; i<links.length; i++ ){
    //     shortenAttribute(links[i],"href");
    // }
    const targetRoot = targetDoc.getElementsByTagName("html")[0];
    const targetHead = targetRoot.getElementsByTagName("head")[0];
    const targetTitle = targetHead.getElementsByTagName("title")[0];
    const targetMeta = targetDoc.getElementById("metaDesc")
    targetTitle.replaceWith(targetDoc.adoptNode(sourceTitle));
    targetMeta.replaceWith(targetDoc.adoptNode(sourceMeta));

    // const targetStylePlace = targetDoc.getElementById("xxx");
    // const links = sourceHead.getElementsByTagName("link");
    //
    // while (links.length > 0) {
    //     const item = targetDoc.adoptNode(links[0]);
    //     targetHead.insertBefore(item, targetStylePlace);
    // }
    // targetHead.removeChild(targetStylePlace);
}

function swapScripts(targetDoc,sourceDoc){
    const sourceBody = sourceDoc.getElementsByTagName("body")[0];
    const sourceScripts = sourceBody.getElementsByTagName("script");

    const targetBody = targetDoc.getElementsByTagName("body")[0];
    const targetScriptPlace = targetDoc.getElementById("yyy");

    while (sourceScripts.length > 0) {
        const item = targetDoc.adoptNode(sourceScripts[0]);
        targetBody.insertBefore(item, targetScriptPlace);
    }
    targetBody.removeChild(targetScriptPlace);
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