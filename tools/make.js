const galery = require("./galery");
const mergeFrame = require("./merge_frame");
const index = require("./index");

make(process.argv);

function make(argv){
    const command = argv[2];
    const params = argv.slice(3,argv.length);

    if( command == "gitem"){
        galery.makeGaleryItems(params);
        return;
    }
    if( command == "galery"){
        galery.makeGalery(params);
        return;
    }
    if( command == "index"){
        index.makeIndex(params);
        return;
    }


    if( command == "gsrcdir"){
        galery.makeGalerySrcDir();
        return;
    }

    if( command === "cennik"){
        galery.makeCennikHtml();
        return;
    }

    if(command === 'frame'){
        mergeFrame.mergeToFrame(params[0]+".html");
        return;
    }

    if(command === "tolowercase"){
        index.lowerCase();
        return;
    }

    if(command === "addsizes"){
        index.addSizesToNames();
        return;
    }

    console.log("invalid command "+command);
}