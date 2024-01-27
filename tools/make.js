import * as cons from './const.js';
import * as utils from './utils.js';

import * as oferta from './oferta.js';
import * as galeria from './galeria.js';
import * as mergeFrame from './merge_frame.js';
import * as index from './index.js';
import {dirToLower} from "./index.js";

make(process.argv);

function mkdirs() {
    utils.makeDir(cons.ROOT_DIR);
    utils.makeDir(cons.TEMP_DIR);
    utils.copyDir(cons.ROOT_SRC_DIR, cons.ROOT_DIR);
}

async function prep_gfx() {
    await index.dirToLower(cons.IMAGES_SRC_DIR);
    await index.addSizesToNames(cons.CAROUSEL_SRC_DIR);
    await index.addSizesToNames(cons.OFERTA_SRC_DIR);
}

async function makeIndex() {
    await index.makeCarouselGfx();
    await index.makeIndex();

}


async function make(argv){
    const command = argv[2];
//    const params = argv.slice(3,argv.length);

    if (command == 'all') {
        mkdirs();
        await prep_gfx();
        await makeIndex();
        await oferta.makeCennikHtml();
        await oferta.makeOfertaGfx();
        oferta.makeOfertaHtml();
        oferta.makeOfertaItems();
        oferta.makeKontakt();
        await galeria.makeGfx();
        galeria.makeHtml();
        return;
    }

    if( command == "mkdirs"){
        mkdirs();
        return;
    }

    if( command == "prep_gfx"){
        await prep_gfx();
        return;
    }

    if( command == "index"){
        await makeIndex();
        return;
    }

    if( command === "cennik"){
        await oferta.makeCennikHtml();
        return;
    }

    if( command == "oferta"){
        await oferta.makeOfertaGfx();
        oferta.makeOfertaHtml();
        return;
    }

    if( command == "ofitem"){
        oferta.makeOfertaItems();
        return;
    }

    if( command == "kontakt"){
        oferta.makeKontakt();
        return;
    }

    if (command == "galeria") {
        await galeria.makeGfx();
        galeria.makeHtml();
        return;
    }

    if( command == "gsrcdir"){
        oferta.makeOfertaSrcDir();
        return;
    }


    if(command === 'frame'){
        mergeFrame.mergeToFrame(params[0]+".html");
        return;
    }

    console.log("invalid command "+command);
}