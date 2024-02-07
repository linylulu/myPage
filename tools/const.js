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
const FAQ_JSON_NAME = "source/faq.json";

const TEMPLATE_START = '<!--template-start-->';
const TEMPLATE_END = '<!--template-end-->';

const PROD = {
    'cookieyes': '<script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/20346a785abe28b258d98db3/script.js"></script>',
    'fb_chat': '/js/fb-chat-prod.js'
};

const DEVEL = {
//    'cookieyes': '<script id="cookieyes" type="text/javascript" src="https://cdn-cookieyes.com/client_data/3f5feb70fddce494fd5ecfe0/script.js"></script>',
//    'fb_chat': '/js/fb-chat-devel.js'
    'cookieyes': '',
    'fb_chat': ''
};

let ENV = PROD;

function setDevel() {
    ENV = DEVEL;
}

export {
    setDevel,
    ENV,
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

    OFERTA_JSON_NAME,
    FAQ_JSON_NAME



};
function rooted(path){
    return ROOT_DIR + '/' + path;
}
