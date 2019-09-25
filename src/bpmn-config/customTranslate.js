import translations from './translations';

 function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = translations[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function (_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
const customTranslateModule = {
  translate: ["value", customTranslate]
};

export default customTranslateModule;
