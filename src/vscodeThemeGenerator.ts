import { IColorSet, IThemeGenerator } from './interfaces'

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

const vscodeJsonGlobalThemeRules: IRuleGenerator[] = [
  // Global settings
  { source: set => set.base.background, generate: getGlobalSettingGenerator('background') },
  { source: set => set.base.foreground, generate: getGlobalSettingGenerator('foreground') }
];

const vscodeColorRules: IRuleGenerator[] = [
  { source: set => set.base.background, generate: getGlobalSettingGenerator('editorBackground') },
  { source: set => set.base.foreground, generate: getGlobalSettingGenerator('editorForeground') },
  { source: set => set.ui.cursor, generate: getGlobalSettingGenerator('editorCaret') },
  { source: set => set.ui.guide, generate: getGlobalSettingGenerator('editorGuide') },
  { source: set => set.ui.invisibles, generate: getGlobalSettingGenerator('editorInvisibles') },
  { source: set => set.ui.findMatchHighlight, generate: getGlobalSettingGenerator('editorFindMatchHighlight') },
  { source: set => set.ui.currentFindMatchHighlight, generate: getGlobalSettingGenerator('editorCurrentFindMatchHighlight') },
  { source: set => set.ui.findRangeHighlight, generate: getGlobalSettingGenerator('editorFindRangeHighlight') },
  { source: set => set.ui.rangeHighlight, generate: getGlobalSettingGenerator('editorRangeHighlight') },
  { source: set => set.ui.selection, generate: getGlobalSettingGenerator('editorSelection') },
  { source: set => set.ui.selectionHighlight, generate: getGlobalSettingGenerator('editorSelectionHighlight') },
  { source: set => set.ui.wordHighlight, generate: getGlobalSettingGenerator('editorWordHighlight') },
  { source: set => set.ui.wordHighlightStrong, generate: getGlobalSettingGenerator('editorWordHighlightStrong') },
  { source: set => set.ui.activeLinkForeground, generate: getGlobalSettingGenerator('editorActiveLinkForeground') },
  // Terminal
  { source: set => set.terminal.black, generate: getGlobalSettingGenerator('terminalAnsiBlack') },
  { source: set => set.terminal.red, generate: getGlobalSettingGenerator('terminalAnsiRed') },
  { source: set => set.terminal.green, generate: getGlobalSettingGenerator('terminalAnsiGreen') },
  { source: set => set.terminal.yellow, generate: getGlobalSettingGenerator('terminalAnsiYellow') },
  { source: set => set.terminal.blue, generate: getGlobalSettingGenerator('terminalAnsiBlue') },
  { source: set => set.terminal.magenta, generate: getGlobalSettingGenerator('terminalAnsiMagenta') },
  { source: set => set.terminal.cyan, generate: getGlobalSettingGenerator('terminalAnsiCyan') },
  { source: set => set.terminal.white, generate: getGlobalSettingGenerator('terminalAnsiWhite') },
  { source: set => set.terminal.brightBlack, generate: getGlobalSettingGenerator('terminalAnsiBrightBlack') },
  { source: set => set.terminal.brightRed, generate: getGlobalSettingGenerator('terminalAnsiBrightRed') },
  { source: set => set.terminal.brightGreen, generate: getGlobalSettingGenerator('terminalAnsiBrightGreen') },
  { source: set => set.terminal.brightYellow, generate: getGlobalSettingGenerator('terminalAnsiBrightYellow') },
  { source: set => set.terminal.brightBlue, generate: getGlobalSettingGenerator('terminalAnsiBrightBlue') },
  { source: set => set.terminal.brightMagenta, generate: getGlobalSettingGenerator('terminalAnsiBrightMagenta') },
  { source: set => set.terminal.brightCyan, generate: getGlobalSettingGenerator('terminalAnsiBrightCyan') },
  { source: set => set.terminal.brightWhite, generate: getGlobalSettingGenerator('terminalAnsiBrightWhite') },
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
    const theme: IVscodeJsonTheme = {};
    theme.name = name;
    theme.tokenColors = [];

    const globalSetting: any = {
      name: 'Global settings',
      settings: {}
    };
    vscodeJsonGlobalThemeRules.forEach(ruleGenerator => {
      const color = <string>ruleGenerator.source(colorSet);
      if (color) {
        const generated = ruleGenerator.generate(color);
        globalSetting.settings[Object.keys(generated)[0]] = color;
      }
    });
    theme.tokenColors.push(globalSetting);

    vscodeJsonThemeRules.forEach(ruleGenerator => {
      const color = <string>ruleGenerator.source(colorSet);
      if (color) {
        theme.tokenColors.push(ruleGenerator.generate(color));
      }
    });

    theme.colors = {};
    vscodeColorRules.forEach(ruleGenerator => {
      const color = <string>ruleGenerator.source(colorSet);
      if (color) {
        const generated = ruleGenerator.generate(color);
        theme.colors[Object.keys(generated)[0]] = color;
      }
    });

    theme.colors['tabsContainerBackground'] = this._lighten(colorSet.base.background, 0.2);
    theme.colors['inactiveTabBackground'] = this._lighten(colorSet.base.background, 0.4);
    theme.colors['sideBarBackground'] = this._lighten(colorSet.base.background, 0.2);
    theme.colors['panelBackground'] = this._lighten(colorSet.base.background, 0.2);
    theme.colors['activityBarBackground'] = this._lighten(colorSet.base.background, 0.4);
    theme.colors['statusBarBackground'] = this._darken(colorSet.base.background, 0.2);
    // Peek editor
    theme.colors['editorPeekEditorBackground'] = this._darken(colorSet.base.background, 0.2);

    return JSON.stringify(theme);
  }

  private _lighten(color: string, amount: number): string {
    const MAX = 255;
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);
    r = Math.floor(r + (r * amount));
    g = Math.floor(g + (g * amount));
    b = Math.floor(b + (b * amount));
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

  private _darken(color: string, amount: number): string {
    return this._lighten(color, -amount);
  }
}
