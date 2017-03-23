import { IColorSet, IThemeGenerator, IBaseColorSet } from './interfaces'

export interface IVscodeJsonTheme {
  name?: string;
  settings?: IVscodeJsonThemeSetting[];
  tokenColors?: IVscodeJsonThemeSetting[];
  colors?: {[key: string]: string};
}

export interface IVscodeJsonThemeSetting {
  name: string;
  scope: string;
  settings: {
    foreground?: string
    fontStyle?: string
  };
}

type SourceFetcher = (colorSet: IColorSet) => string;
type ColorGenerator = (color: string) => any;

interface IRuleGenerator {
  source: SourceFetcher;
  generate: ColorGenerator;
}

type ColorFetcher = (colorSet: IColorSet) => string;
type FallbackFetcher = (baseColorSet: IBaseColorSet) => string;

interface IRuleGenerator2 {
  color: ColorFetcher;
  fallback: FallbackFetcher;
  generate: ColorGenerator;
}

enum FontStyle {
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
    return result
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
  }
}

function getFontStyleGenerator(name: string, scope: string, fontStyle: number = FontStyle.NONE): ColorGenerator {
  return () => {
    let colorRule: IVscodeJsonThemeSetting = {
      'name': name,
      'scope': scope,
      'settings': {}
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
  }
}

const globalRules: IRuleGenerator2[] = [
  { color: s => s.base.background, fallback: s => null, generate: getGlobalSettingGenerator('background') },
  { color: s => s.base.foreground, fallback: s => null, generate: getGlobalSettingGenerator('foreground') }
];

const terminalRules: IRuleGenerator2[] = [
  { color: s => s.terminal.black, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBlack') },
  { color: s => s.terminal.red, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiRed') },
  { color: s => s.terminal.green, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiGreen') },
  { color: s => s.terminal.yellow, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiYellow') },
  { color: s => s.terminal.blue, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBlue') },
  { color: s => s.terminal.magenta, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiMagenta') },
  { color: s => s.terminal.cyan, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiCyan') },
  { color: s => s.terminal.white, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiWhite') },
  { color: s => s.terminal.brightBlack, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightBlack') },
  { color: s => s.terminal.brightRed, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightRed') },
  { color: s => s.terminal.brightGreen, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightGreen') },
  { color: s => s.terminal.brightYellow, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightYellow') },
  { color: s => s.terminal.brightBlue, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightBlue') },
  { color: s => s.terminal.brightMagenta, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightMagenta') },
  { color: s => s.terminal.brightCyan, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightCyan') },
  { color: s => s.terminal.brightWhite, fallback: s => null, generate: getGlobalSettingGenerator('terminalAnsiBrightWhite') }
];

const colorRules: IRuleGenerator2[] = [
  { color: s => s.base.background, fallback: s => null, generate: getGlobalSettingGenerator('editorBackground') },
  { color: s => s.base.foreground, fallback: s => null, generate: getGlobalSettingGenerator('editorForeground') },
  { color: s => s.ui.cursor, fallback: s => null, generate: getGlobalSettingGenerator('editorCaret') },
  { color: s => s.ui.guide, fallback: s => lighten(s.background, 0.2), generate: getGlobalSettingGenerator('editorGuide') },
  { color: s => s.ui.invisibles, fallback: s => lighten(s.background, 0.2), generate: getGlobalSettingGenerator('editorInvisibles') },
  { color: s => s.ui.findMatchHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorFindMatchHighlight') },
  { color: s => s.ui.currentFindMatchHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorCurrentFindMatchHighlight') },
  { color: s => s.ui.findRangeHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorFindRangeHighlight') },
  { color: s => s.ui.rangeHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorRangeHighlight') },
  { color: s => s.ui.selection, fallback: s => null, generate: getGlobalSettingGenerator('editorSelection') },
  { color: s => s.ui.selectionHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorSelectionHighlight') },
  { color: s => s.ui.wordHighlight, fallback: s => null, generate: getGlobalSettingGenerator('editorWordHighlight') },
  { color: s => s.ui.wordHighlightStrong, fallback: s => null, generate: getGlobalSettingGenerator('editorWordHighlightStrong') },
  { color: s => s.ui.activeLinkForeground, fallback: s => null, generate: getGlobalSettingGenerator('editorActiveLinkForeground') },
];

const tokenRules: IRuleGenerator2[] = [
  // string: It's important that string is put first so that other scopes can override strings
  // within template expressions
  { color: s => s.syntax.string,       fallback: s => s.color2, generate: getSimpleColorGenerator('String', 'string') },
  { color: s => s.syntax.boolean,      fallback: s => s.color1, generate: getSimpleColorGenerator('Boolean', 'constant.language.boolean') },
  { color: s => s.syntax.number,       fallback: s => s.color4, generate: getSimpleColorGenerator('Number', 'constant.numeric') },
  { color: s => s.syntax.identifier,   fallback: s => lighten(s.color1, 0.5), generate: getSimpleColorGenerator('Identifier', 'variable, support.variable, support.class, support.constant, meta.definition.variable entity.name.function') },
  // support.type.object: module.exports (ts)
  { color: s => s.syntax.keyword,      fallback: s => s.color1, generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, variable.language.this, support.type.object, constant.language') },
  // support.function: eg. join in path.join in TypeScript
  { color: s => s.syntax.functionCall, fallback: s => s.color4, generate: getSimpleColorGenerator('Function call', 'entity.name.function, support.function') },
  // storage.type: var (ts)
  // storage.modifier: private (ts)
  { color: s => s.syntax.storage,      fallback: s => s.color1, generate: getSimpleColorGenerator('Storage', 'storage.type, storage.modifier') },
  // module.support: imported modules in TypeScript
  { color: s => s.syntax.identifier,   fallback: s => lighten(s.color1, 0.5), generate: getSimpleColorGenerator('Modules', 'support.module, support.node', FontStyle.ITALIC) },
  // support.type: `boolean` (ts)
  { color: s => s.syntax.type,         fallback: s => s.color3, generate: getSimpleColorGenerator('Type', 'support.type') },
  // entity.name.type: `: SomeType` (ts)
  { color: s => s.syntax.type,         fallback: s => s.color3, generate: getSimpleColorGenerator('Type', 'entity.name.type, entity.other.inherited-class') },
  { color: s => s.syntax.comment,      fallback: s => lighten(s.background, 2.0), generate: getSimpleColorGenerator('Comment', 'comment', FontStyle.ITALIC) },
  { color: s => s.syntax.class,        fallback: s => s.color3, generate: getSimpleColorGenerator('Class', 'entity.name.type.class', FontStyle.UNDERLINE) },
  { color: s => s.syntax.classMember,  fallback: s => s.color3, generate: getSimpleColorGenerator('Class variable', 'variable.object.property') },
  { color: s => s.syntax.classMember,  fallback: s => s.color3, generate: getSimpleColorGenerator('Class method', 'meta.definition.method entity.name.function') },
  { color: s => s.syntax.function,     fallback: s => s.color3, generate: getSimpleColorGenerator('Function definition', 'meta.function entity.name.function') },
  { color: s => s.syntax.keyword,      fallback: s => s.color1, generate: getSimpleColorGenerator('Template expression', 'template.expression.begin, template.expression.end') },
  { color: s => s.syntax.identifier,   fallback: s => lighten(s.color1, 0.5), generate: getSimpleColorGenerator('YAML key', 'entity.name.tag.yaml') },
  // modifier: This includes things like access modifiers, static, readonly, etc.
  { color: s => s.syntax.modifier,     fallback: s => null, generate: getSimpleColorGenerator('Modifier', 'modifier') },
  /**
   * JSON
   */
  { color: s => s.syntax.identifier, fallback: s => lighten(s.color1, 0.5), generate: getSimpleColorGenerator('JSON key', 'meta.object-literal.key, meta.object-literal.key string, support.type.property-name.json') },
  { color: s => s.syntax.keyword,    fallback: s => s.color1,    generate: getSimpleColorGenerator('JSON constant', 'constant.language.json') },
  /**
   * CSS
   */
  { color: s => s.syntax.cssClass, fallback: s => s.color1, generate: getSimpleColorGenerator('CSS class', 'entity.other.attribute-name.class') },
  { color: s => s.syntax.cssId,    fallback: s => s.color2,    generate: getSimpleColorGenerator('CSS ID', 'entity.other.attribute-name.id') },
  { color: s => s.syntax.cssTag,   fallback: s => s.color3,   generate: getSimpleColorGenerator('CSS tag', 'source.css entity.name.tag') },
  /**
   * HTML
   */
  { color: s => s.syntax.keyword,      fallback: s => s.color1,      generate: getSimpleColorGenerator('HTML tag outer', 'meta.tag, punctuation.definition.tag') },
  { color: s => s.syntax.identifier,   fallback: s => lighten(s.color1, 0.5),   generate: getSimpleColorGenerator('HTML tag inner', 'entity.name.tag') },
  { color: s => s.syntax.functionCall, fallback: s => s.color4, generate: getSimpleColorGenerator('HTML tag attribute', 'entity.other.attribute-name') },
  /**
   * Markdown
   */
  { color: s => s.syntax.keyword,       fallback: s => s.color1,       generate: getSimpleColorGenerator('Markdown heading', 'markup.heading') },
  { color: s => s.syntax.identifier,    fallback: s => lighten(s.color1, 0.5),    generate: getSimpleColorGenerator('Markdown link text', 'text.html.markdown meta.link.inline, meta.link.reference') },
  { color: s => s.syntax.markdownQuote, fallback: s => darken(s.foreground, 0.5), generate: getSimpleColorGenerator('Markdown block quote', 'text.html.markdown markup.quote') },
  { color: s => s.syntax.keyword,       fallback: s => s.color1,       generate: getSimpleColorGenerator('Markdown list item', 'text.html.markdown beginning.punctuation.definition.list') },
  { color: s => s.syntax.identifier,    fallback: s => lighten(s.color1, 0.5),    generate: getSimpleColorGenerator('Markdown italic', 'markup.italic', FontStyle.ITALIC) },
  { color: s => s.syntax.identifier,    fallback: s => lighten(s.color1, 0.5),    generate: getSimpleColorGenerator('Markdown bold', 'markup.bold', FontStyle.BOLD) },
  { color: s => s.syntax.identifier,    fallback: s => lighten(s.color1, 0.5),    generate: getSimpleColorGenerator('Markdown bold italic', 'markup.bold markup.italic, markup.italic markup.bold', FontStyle.BOLD | FontStyle.ITALIC) },
  /**
   * Ini
   */
  { color: s => s.syntax.identifier, fallback: s => lighten(s.color1, 0.5), generate: getSimpleColorGenerator('INI property name', 'keyword.other.definition.ini') },
  { color: s => s.syntax.keyword,    fallback: s => s.color1,    generate: getSimpleColorGenerator('INI section title', 'entity.name.section.group-title.ini') },
  /**
   * C#
   */
  { color: s => s.syntax.class,        fallback: s => s.color3, generate: getSimpleColorGenerator('C# class',         'source.cs meta.class.identifier storage.type', FontStyle.UNDERLINE) },
  { color: s => s.syntax.classMember,  fallback: s => s.color3, generate: getSimpleColorGenerator('C# class method',  'source.cs meta.method.identifier entity.name.function') },
  { color: s => s.syntax.functionCall, fallback: s => s.color4, generate: getSimpleColorGenerator('C# function call', 'source.cs meta.method-call meta.method, source.cs entity.name.function') },
  { color: s => s.syntax.type,         fallback: s => s.color3, generate: getSimpleColorGenerator('C# type',          'source.cs storage.type') },
  { color: s => s.syntax.type,         fallback: s => s.color3, generate: getSimpleColorGenerator('C# return type',   'source.cs meta.method.return-type') }, // Lambda function returns do not use storage.type scope
  { color: s => s.syntax.comment,      fallback: s => lighten(s.background, 2.0), generate: getSimpleColorGenerator('C# preprocessor',  'source.cs meta.preprocessor') },
  { color: s => s.base.foreground,     fallback: s => null, generate: getSimpleColorGenerator('C# namespace',     'source.cs entity.name.type.namespace') } // Override generic entity.name.type rule
];

// An ordered list of rules to be applied if the source conditions are met
const vscodeJsonThemeRules: IRuleGenerator[] = [
  // string: It's important that string is put first so that other scopes can override strings
  // within template expressions
  { source: set => set.syntax.string,
    generate: getSimpleColorGenerator('String', 'string') },
  { source: set => set.syntax.boolean,
    generate: getSimpleColorGenerator('Boolean', 'constant.language.boolean') },
  { source: set => set.syntax.number,
    generate: getSimpleColorGenerator('Number', 'constant.numeric') },
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Identifier', 'variable, support.variable, support.class, support.constant, meta.definition.variable entity.name.function') },
  // support.type.object: module.exports (ts)
  { source: set => set.syntax.keyword,
    generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, variable.language.this, support.type.object, constant.language') },
  // support.function: eg. join in path.join in TypeScript
  { source: set => set.syntax.functionCall,
    generate: getSimpleColorGenerator('Function call', 'entity.name.function, support.function') },
  // storage.type: var (ts)
  // storage.modifier: private (ts)
  { source: set => set.syntax.storage,
    generate: getSimpleColorGenerator('Storage', 'storage.type, storage.modifier') },
  // module.support: imported modules in TypeScript
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Modules', 'support.module, support.node', FontStyle.ITALIC) },
  // support.type: `boolean` (ts)
  { source: set => set.syntax.type,
    generate: getSimpleColorGenerator('Type', 'support.type') },
  // entity.name.type: `: SomeType` (ts)
  { source: set => set.syntax.type,
    generate: getSimpleColorGenerator('Type', 'entity.name.type, entity.other.inherited-class') },
  { source: set => set.syntax.comment,
    generate: getSimpleColorGenerator('Comment', 'comment', FontStyle.ITALIC) },
  { source: set => set.syntax.class,
    generate: getSimpleColorGenerator('Class', 'entity.name.type.class', FontStyle.UNDERLINE) },
  { source: set => set.syntax.classMember,
    generate: getSimpleColorGenerator('Class variable', 'variable.object.property') },
  { source: set => set.syntax.classMember,
    generate: getSimpleColorGenerator('Class method', 'meta.definition.method entity.name.function') },
  { source: set => set.syntax.function,
    generate: getSimpleColorGenerator('Function definition', 'meta.function entity.name.function') },
  { source: set => set.syntax.keyword,
    generate: getSimpleColorGenerator('Template expression', 'template.expression.begin, template.expression.end') },
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('YAML key', 'entity.name.tag.yaml') },
  // modifier: This includes things like access modifiers, static, readonly, etc.
  { source: set => set.syntax.modifier,
    generate: getSimpleColorGenerator('Modifier', 'modifier') },
  /**
   * JSON
   */
  { source: set => set.syntax.identifier, generate: getSimpleColorGenerator('JSON key', 'meta.object-literal.key, meta.object-literal.key string, support.type.property-name.json') },
  { source: set => set.syntax.keyword,    generate: getSimpleColorGenerator('JSON constant', 'constant.language.json') },
  /**
   * CSS
   */
  { source: set => set.syntax.cssClass, generate: getSimpleColorGenerator('CSS class', 'entity.other.attribute-name.class') },
  { source: set => set.syntax.cssId,    generate: getSimpleColorGenerator('CSS ID', 'entity.other.attribute-name.id') },
  { source: set => set.syntax.cssTag,   generate: getSimpleColorGenerator('CSS tag', 'source.css entity.name.tag') },
  /**
   * HTML
   */
  { source: set => set.syntax.keyword,      generate: getSimpleColorGenerator('HTML tag outer', 'meta.tag, punctuation.definition.tag') },
  { source: set => set.syntax.identifier,   generate: getSimpleColorGenerator('HTML tag inner', 'entity.name.tag') },
  { source: set => set.syntax.functionCall, generate: getSimpleColorGenerator('HTML tag attribute', 'entity.other.attribute-name') },
  /**
   * Markdown
   */
  { source: set => set.syntax.keyword,       generate: getSimpleColorGenerator('Markdown heading', 'markup.heading') },
  { source: set => set.syntax.identifier,    generate: getSimpleColorGenerator('Markdown link text', 'text.html.markdown meta.link.inline, meta.link.reference') },
  { source: set => set.syntax.markdownQuote, generate: getSimpleColorGenerator('Markdown block quote', 'text.html.markdown markup.quote') },
  { source: set => set.syntax.keyword,       generate: getSimpleColorGenerator('Markdown list item', 'text.html.markdown beginning.punctuation.definition.list') },
  { source: set => set.syntax.identifier,    generate: getSimpleColorGenerator('Markdown italic', 'markup.italic', FontStyle.ITALIC) },
  { source: set => set.syntax.identifier,    generate: getSimpleColorGenerator('Markdown bold', 'markup.bold', FontStyle.BOLD) },
  { source: set => set.syntax.identifier,    generate: getSimpleColorGenerator('Markdown bold italic', 'markup.bold markup.italic, markup.italic markup.bold', FontStyle.BOLD | FontStyle.ITALIC) },
  /**
   * Ini
   */
  { source: set => set.syntax.identifier, generate: getSimpleColorGenerator('INI property name', 'keyword.other.definition.ini') },
  { source: set => set.syntax.keyword,    generate: getSimpleColorGenerator('INI section title', 'entity.name.section.group-title.ini') },
  /**
   * C#
   */
  { source: set => set.syntax.class,        generate: getSimpleColorGenerator('C# class',         'source.cs meta.class.identifier storage.type', FontStyle.UNDERLINE) },
  { source: set => set.syntax.classMember,  generate: getSimpleColorGenerator('C# class method',  'source.cs meta.method.identifier entity.name.function') },
  { source: set => set.syntax.functionCall, generate: getSimpleColorGenerator('C# function call', 'source.cs meta.method-call meta.method, source.cs entity.name.function') },
  { source: set => set.syntax.type,         generate: getSimpleColorGenerator('C# type',          'source.cs storage.type') },
  { source: set => set.syntax.type,         generate: getSimpleColorGenerator('C# return type',   'source.cs meta.method.return-type') }, // Lambda function returns do not use storage.type scope
  { source: set => set.syntax.comment,      generate: getSimpleColorGenerator('C# preprocessor',  'source.cs meta.preprocessor') },
  { source: set => set.base.foreground,     generate: getSimpleColorGenerator('C# namespace',     'source.cs entity.name.type.namespace') } // Override generic entity.name.type rule
];

export class VscodeThemeGenerator implements IThemeGenerator {
  public generateTheme(name: string, colorSet: IColorSet): string {
    // Fill in missing subsets to prevent NPEs
    if (!colorSet.syntax) colorSet.syntax = {};
    if (!colorSet.terminal) colorSet.terminal = {};
    if (!colorSet.ui) colorSet.ui = {};

    const theme: IVscodeJsonTheme = {
      name: name,
      tokenColors: [],
      colors: {}
    };
    const globalSettings: any = {
      name: 'Global settings',
      settings: {}
    };
    theme.tokenColors.push(globalSettings);

    tokenRules.forEach(generator => {
      const color = generator.color(colorSet) || generator.fallback(colorSet.base);
      if (color) {
        theme.tokenColors.push(generator.generate(color));
      }
    });

    // vscodeJsonThemeRules.forEach(ruleGenerator => {
    //   const color = <string>ruleGenerator.source(colorSet);
    //   if (color) {
    //     theme.tokenColors.push(ruleGenerator.generate(color));
    //   }
    // });

    colorRules.concat(terminalRules).forEach(generator => {
      const color = generator.color(colorSet) || generator.fallback(colorSet.base);
      if (color) {
        const generated = generator.generate(color);
        theme.colors[Object.keys(generated)[0]] = color;
      }
    });

    globalRules.forEach(generator => {
      const color = generator.color(colorSet) || generator.fallback(colorSet.base);
      if (color) {
        const generated = generator.generate(color);
        globalSettings.settings[Object.keys(generated)[0]] = color;
      }
    });
    theme.tokenColors.push(globalSettings);

    theme.colors['tabsContainerBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['inactiveTabBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['sideBarBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['panelBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['activityBarBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['statusBarBackground'] = darken(colorSet.base.background, 0.2);
    // Peek editor
    theme.colors['editorPeekEditorBackground'] = darken(colorSet.base.background, 0.2);

    return JSON.stringify(theme);
  }
}

function lighten(color: string, amount: number): string {
  const MAX = 255;
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);
  r = Math.min(Math.floor(r + (r * amount)), MAX);
  g = Math.min(Math.floor(g + (g * amount)), MAX);
  b = Math.min(Math.floor(b + (b * amount)), MAX);
  let rs = r.toString(16);
  if (rs.length === 1) {
    rs = '0' + rs;
  }
  let gs = g.toString(16);
  if (gs.length === 1) {
    gs = '0' + gs;
  }
  let bs = b.toString(16);
  if (bs.length === 1) {
    bs = '0' + bs;
  }
  return `#${rs}${gs}${bs}`;
}

function darken(color: string, amount: number): string {
  return lighten(color, -amount);
}
