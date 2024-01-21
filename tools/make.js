const cons = require("./const");
const Utils = require('./utils')
const utils = new Utils();

const oferta = require("./oferta");
const mergeFrame = require("./merge_frame");
const index = require("./index");

make(process.argv);

function make(argv){
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
//        index.makeCarouselGfx();
        index.makeIndex(params);
        return;
    }

    if( command === "cennik"){
        oferta.makeCennikHtml();
        return;
    }

    if( command == "oferta"){
//        oferta.makeOfertaGfx();
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