import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';

const HOME = {
    'name': 'Strona główna',
    'html': 'index.html'
};
const INFO = {
    'name': 'Informacje',
    'html': 'informacje.html'
}

const FAQ = {
    'name': 'FAQ',
    'html': 'faq.html'
};

const REGULAMIN = {
    'name': 'Regulamin',
    'html': 'regulamin.html'
};

const POMIAR = {
    'name': 'Pomiar',
    'html': 'pomiarhtml'
};

export function makeAll() {
    makeInformacje();
    // makeRegulamin();
    makePomiar();
    makeFaqHtml();
}


const QUA =
    '<div class="m-2">' +
    '<button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#{$id}" aria-expanded="false" aria-controls="collapse">\n' +
    '{$question}' +
    '  </button>' +
    '<div class="collapse" id="{$id}">\n' +
    '  <div class="card card-body">\n' +
    '{$answer}' +
    '  </div>\n' +
    '</div>' +
    '</div>';

export function makeFaqHtml() {
    const template = utils.readFileContent(cons.TEMPLATES_SRC_DIR + '/_faq-template.html');
    let prefix = template.substring(0, template.indexOf(cons.TEMPLATE_START));
    const postfix = template.substring(template.indexOf(cons.TEMPLATE_END) + cons.TEMPLATE_END.length);
    const jsonContent = fs.readFileSync(cons.FAQ_JSON_NAME, 'utf8');
    const faq = JSON.parse(jsonContent);

    let i = 0;
    for (i = 0; i < faq.length; i++) {
        const item = faq[i];
        let qa = QUA.replaceAll('{$question}', item.q);
        qa = qa.replaceAll('{$answer}', item.a)
        qa = qa.replaceAll('{$id}', 'id' + i);
        prefix += qa;
    }
    prefix += postfix;
    mergeFrame.saveAndMerge('faq.html', prefix,
        [HOME, INFO, FAQ], 'informacje.html');
}

function makeTxt(template, bread, active) {
    const name = template + '.html';
    fs.copyFileSync(cons.TEMPLATES_SRC_DIR + '/_' + template + '-template.html', cons.TEMP_DIR + '/' + name);
    mergeFrame.mergeToFrame(name, bread, active);

}

export function makeInformacje() {
    makeTxt('informacje', [HOME, INFO], null);
}

export function makeRegulamin() {
    makeTxt('regulamin', [HOME, INFO, REGULAMIN], 'informacje.html');

}

export function makePomiar() {
    makeTxt('pomiar', [HOME, INFO, POMIAR], 'informacje.html');
}
