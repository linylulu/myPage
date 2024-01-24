import * as cons from './const.js';
import * as utils from './utils.js';

import * as oferta from './oferta.js';
import * as mergeFrame from './merge_frame.js';
import * as index from './index.js';

make(process.argv);

async function make(argv){
    const command = argv[2];
    const params = argv.slice(3,argv.length);


    if( command == "mkdirs"){
        utils.makeDir(cons.ROOT_DIR);
        utils.makeDir(cons.TEMP_DIR);
        utils.copyDir(cons.ROOT_SRC_DIR,cons.ROOT_DIR);
        return;
    }

    if( command == "prep_gfx"){
        index.lowerCase();
        index.addSizesToNames();
        return;
    }

    if( command == "index"){
        await index.makeCarouselGfx();
        await index.makeIndex(params);
        return;
    }

    if( command === "cennik"){
        oferta.makeCennikHtml();
        return;
    }

    if( command == "oferta"){
        await oferta.makeOfertaGfx();
        oferta.makeOfertaHtml();
        return;
    }

    if( command == "ofitem"){
        oferta.makeOfertaItems(params);
        return;
    }

    if( command == "kontakt"){
        oferta.makeKontakt();
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