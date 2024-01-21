
const ROOT_DIR = 'root';
const IMG_DIR =  'img';
const CAROUSEL_IMG_DIR = IMG_DIR + '/carousel'
const OFERTA_IMG_DIR = IMG_DIR + '/oferta'


const ROOT_SRC_DIR = 'source/root';
const TEMP_DIR = '.tmp';
const OFERTA_SOURCE_DIR = '.oferta';
const CAROUSEL_SRC_DIR = OFERTA_SOURCE_DIR + '/_karuzelka';
const TEMPLATES_SRC_DIR = 'source';

const OFERTA_JSON_NAME = "source/oferta.json";
const OFERTA_TARGET_IMG_DIR = "img/oferta";


const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';


module.exports = {
    rooted,
    ROOT_DIR,
    IMG_DIR,
    CAROUSEL_IMG_DIR,
    OFERTA_IMG_DIR,

    ROOT_SRC_DIR,
    CAROUSEL_SRC_DIR,
    TEMPLATES_SRC_DIR,
    TEMP_DIR,

    TEMPLATE_START,
    TEMPLATE_END,

    OFERTA_SOURCE_DIR,
    OFERTA_JSON_NAME,
    OFERTA_TARGET_IMG_DIR


};
function rooted(path){
    return ROOT_DIR + '/' + path;
}
