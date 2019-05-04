import { IColorSet } from './interfaces';

export interface IVscodeJsonThemeSetting {
  name: string;
  scope: string;
  settings: {
    foreground?: string
    fontStyle?: string
  };
}

export type ColorFetcher = (colorSet: IColorSet) => string;
export type ColorGenerator = (color: string) => any;

export interface IRuleGenerator {
  color: ColorFetcher;
  generate: ColorGenerator;
}

const enum FontStyle {
  NONE = 0,
  ITALIC = 1 << 0,
  BOLD = 1 << 1,
  UNDERLINE = 1 << 2
}

function getGlobalSettingGenerator(name: string): ColorGenerator {
  return (color: string) => {
    if (!color) {
      return undefined;
    }
    const result: any = {};
    result[name] = color;
    return result;
  };
}

function getSimpleColorGenerator(name: string, scope: string, fontStyle: number = FontStyle.NONE): ColorGenerator {
  return (color: string) => {
    let colorRule: IVscodeJsonThemeSetting = {
      'name': name,
      'scope': scope,
      'settings': {
        'foreground': color
      }
    };
    let fontStyles: string[] = [];
    if (fontStyle & FontStyle.ITALIC) {
      fontStyles.push('italic');
    }
    if (fontStyle & FontStyle.BOLD) {
      fontStyles.push('bold');
    }
    if (fontStyle & FontStyle.UNDERLINE) {
      fontStyles.push('underline');
    }
    if (fontStyles.length > 0) {
      colorRule.settings.fontStyle = fontStyles.join(' ');
    }
    return colorRule;
  };
}

export const globalRules: IRuleGenerator[] = [
  { color: s => s.base.background, generate: getGlobalSettingGenerator('background') },
  { color: s => s.base.foreground, generate: getGlobalSettingGenerator('foreground') }
];

export const tokenRules: IRuleGenerator[] = [
  // string: It's important that string is put first so that other scopes can override strings
  // within template expressions
  { color: s => s.syntax.string,       generate: getSimpleColorGenerator('String', 'string') },
  { color: s => s.syntax.stringEscape, generate: getSimpleColorGenerator('String Escape', 'constant.character.escape, text.html constant.character.entity.named, punctuation.definition.entity.html') },
  { color: s => s.syntax.boolean,      generate: getSimpleColorGenerator('Boolean', 'constant.language.boolean') },
  { color: s => s.syntax.number,       generate: getSimpleColorGenerator('Number', 'constant.numeric') },
  { color: s => s.syntax.identifier,   generate: getSimpleColorGenerator('Identifier', 'variable, support.variable, support.class, support.constant, meta.definition.variable entity.name.function') },
  // support.type.object: module.exports (ts)
  { color: s => s.syntax.keyword,      generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, variable.language.this, support.type.object, constant.language') },
  // support.function: eg. join in path.join in TypeScript
  { color: s => s.syntax.functionCall, generate: getSimpleColorGenerator('Function call', 'entity.name.function, support.function') },
  // storage.type: var (ts)
  // storage.modifier: private (ts)
  { color: s => s.syntax.storage,      generate: getSimpleColorGenerator('Storage', 'storage.type, storage.modifier') },
  // module.support: imported modules in TypeScript
  { color: s => s.syntax.identifier,   generate: getSimpleColorGenerator('Modules', 'support.module, support.node', FontStyle.ITALIC) },
  // support.type: `boolean` (ts)
  { color: s => s.syntax.type,         generate: getSimpleColorGenerator('Type', 'support.type') },
  // entity.name.type: `: SomeType` (ts)
  { color: s => s.syntax.type,         generate: getSimpleColorGenerator('Type', 'entity.name.type, entity.other.inherited-class') },
  { color: s => s.syntax.comment,      generate: getSimpleColorGenerator('Comment', 'comment', FontStyle.ITALIC) },
  { color: s => s.syntax.class,        generate: getSimpleColorGenerator('Class', 'entity.name.type.class', FontStyle.UNDERLINE) },
  // variable.object.property: `class A { meth = 0; }` (ts)
  // meta.field.declaration entity.name.function: `class A { meth = () => 0; }` (ts)
  { color: s => s.syntax.classMember,  generate: getSimpleColorGenerator('Class variable', 'variable.object.property, meta.field.declaration entity.name.function') },
  // meta.definition.method entity.name.function: `class A { meth() {} }` (ts)
  { color: s => s.syntax.classMember,  generate: getSimpleColorGenerator('Class method', 'meta.definition.method entity.name.function') },
  { color: s => s.syntax.function,     generate: getSimpleColorGenerator('Function definition', 'meta.function entity.name.function') },
  // punctuation.definition.template-expression: `${}`
  { color: s => s.syntax.keyword,      generate: getSimpleColorGenerator('Template expression', 'template.expression.begin, template.expression.end, punctuation.definition.template-expression.begin, punctuation.definition.template-expression.end') },
  { color: s => s.base.foreground,     generate: getSimpleColorGenerator('Reset embedded/template expression colors', 'meta.embedded, source.groovy.embedded, meta.template.expression') },
  { color: s => s.syntax.identifier,   generate: getSimpleColorGenerator('YAML key', 'entity.name.tag.yaml') },
  // modifier: This includes things like access modifiers, static, readonly, etc.
  { color: s => s.syntax.modifier,     generate: getSimpleColorGenerator('Modifier', 'modifier') },
  /**
   * JSON
   */
  { color: s => s.syntax.identifier, generate: getSimpleColorGenerator('JSON key', 'meta.object-literal.key, meta.object-literal.key string, support.type.property-name.json') },
  { color: s => s.syntax.keyword,    generate: getSimpleColorGenerator('JSON constant', 'constant.language.json') },
  /**
   * CSS
   */
  { color: s => s.syntax.cssClass, generate: getSimpleColorGenerator('CSS class', 'entity.other.attribute-name.class') },
  { color: s => s.syntax.cssId,    generate: getSimpleColorGenerator('CSS ID', 'entity.other.attribute-name.id') },
  { color: s => s.syntax.cssTag,   generate: getSimpleColorGenerator('CSS tag', 'source.css entity.name.tag') },
  /**
   * HTML
   */
  { color: s => s.syntax.keyword,      generate: getSimpleColorGenerator('HTML tag outer', 'meta.tag, punctuation.definition.tag') },
  { color: s => s.syntax.identifier,   generate: getSimpleColorGenerator('HTML tag inner', 'entity.name.tag') },
  { color: s => s.syntax.functionCall, generate: getSimpleColorGenerator('HTML tag attribute', 'entity.other.attribute-name') },
  /**
   * Markdown
   */
  { color: s => s.syntax.keyword,       generate: getSimpleColorGenerator('Markdown heading', 'markup.heading') },
  { color: s => s.syntax.identifier,    generate: getSimpleColorGenerator('Markdown link text', 'text.html.markdown meta.link.inline, meta.link.reference') },
  { color: s => s.syntax.markdownQuote, generate: getSimpleColorGenerator('Markdown block quote', 'text.html.markdown markup.quote') },
  { color: s => s.syntax.keyword,       generate: getSimpleColorGenerator('Markdown list item', 'text.html.markdown beginning.punctuation.definition.list') },
  { color: s => s.syntax.identifier,    generate: getSimpleColorGenerator('Markdown italic', 'markup.italic', FontStyle.ITALIC) },
  { color: s => s.syntax.identifier,    generate: getSimpleColorGenerator('Markdown bold', 'markup.bold', FontStyle.BOLD) },
  { color: s => s.syntax.identifier,    generate: getSimpleColorGenerator('Markdown bold italic', 'markup.bold markup.italic, markup.italic markup.bold', FontStyle.BOLD | FontStyle.ITALIC) },
  { color: s => s.syntax.string,        generate: getSimpleColorGenerator('Markdown code block', 'markup.fenced_code.block.markdown punctuation.definition.markdown') },
  { color: s => s.syntax.string,        generate: getSimpleColorGenerator('Markdown inline code', 'markup.inline.raw.string.markdown') },
  /**
   * Ini
   */
  { color: s => s.syntax.identifier, generate: getSimpleColorGenerator('INI property name', 'keyword.other.definition.ini') },
  { color: s => s.syntax.keyword,    generate: getSimpleColorGenerator('INI section title', 'entity.name.section.group-title.ini') },
  /**
   * C#
   */
  { color: s => s.syntax.class,        generate: getSimpleColorGenerator('C# class',         'source.cs meta.class.identifier storage.type', FontStyle.UNDERLINE) },
  { color: s => s.syntax.classMember,  generate: getSimpleColorGenerator('C# class method',  'source.cs meta.method.identifier entity.name.function') },
  { color: s => s.syntax.functionCall, generate: getSimpleColorGenerator('C# function call', 'source.cs meta.method-call meta.method, source.cs entity.name.function') },
  { color: s => s.syntax.type,         generate: getSimpleColorGenerator('C# type',          'source.cs storage.type') },
  { color: s => s.syntax.type,         generate: getSimpleColorGenerator('C# return type',   'source.cs meta.method.return-type') }, // Lambda function returns do not use storage.type scope
  { color: s => s.syntax.comment,      generate: getSimpleColorGenerator('C# preprocessor',  'source.cs meta.preprocessor') },
  { color: s => s.base.foreground,     generate: getSimpleColorGenerator('C# namespace',     'source.cs entity.name.type.namespace') } // Override generic entity.name.type rule
];
