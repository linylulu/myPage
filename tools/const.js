const ROOT_DIR = 'public_html';
const IMG_DIR =  'img';
const CAROUSEL_IMG_DIR = IMG_DIR + '/carousel';
const OFERTA_IMG_DIR = IMG_DIR + '/oferta';
const GALERY_IMG_DIR = IMG_DIR + '/galeria';

const ROOT_SRC_DIR = 'source/root';
const TEMP_DIR = 'tmp';
const IMAGES_SRC_DIR = TEMP_DIR + '/na_strone';

const OFERTA_SRC_DIR = IMAGES_SRC_DIR + '/oferta';
const CAROUSEL_SRC_DIR = IMAGES_SRC_DIR + '/_karuzelka';
const GALERY_SRC_DIR = IMAGES_SRC_DIR + '/galeria';

const TEMPLATES_SRC_DIR = 'source';

const OFERTA_JSON_NAME = "source/oferta.json";

const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';


export {
    rooted,
    ROOT_DIR,
    IMG_DIR,
    CAROUSEL_IMG_DIR,
    OFERTA_IMG_DIR,
    GALERY_IMG_DIR,

    TEMP_DIR,
    IMAGES_SRC_DIR,
    CAROUSEL_SRC_DIR,
    OFERTA_SRC_DIR,
    GALERY_SRC_DIR,


    ROOT_SRC_DIR,
    TEMPLATES_SRC_DIR,
    TEMPLATE_START,
    TEMPLATE_END,

    OFERTA_JSON_NAME



};
function rooted(path){
    return ROOT_DIR + '/' + path;
}
