import * as cons from './const.js';
import * as  fs from 'fs'
import * as utils from './utils.js';
import * as imageUtils from './image_utils.js';
import * as mergeFrame from './merge_frame.js';


const QUA =
    '<div class="m-5">' +
    '<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#{$id}" aria-expanded="false" aria-controls="collapse">\n' +
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
        [
            {
                'name': 'Strona główna',
                'html': 'index.html'
            },
            {
                'name': 'Informacje',
                'html': 'informacje.html'
            },
            {
                'name': 'Faq',
                'html': 'faq.html'
            }
        ]);

}
