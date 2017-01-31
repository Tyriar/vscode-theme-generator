import { IColorSet, IThemeGenerator } from './themeGenerator'

export interface IVscodeJsonTheme {
  name?: string;
  include?: string;
  globalSettings?: {
    background?: string
    foreground?: string
  };
  settings?: IVscodeJsonThemeSetting[];
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

const vscodeJsonGlobalThemeRules: IRuleGenerator[] = [
  // Global settings
  { source: set => set.ui.background, generate: getGlobalSettingGenerator('background') },
  { source: set => set.ui.foreground, generate: getGlobalSettingGenerator('foreground') },
  { source: set => set.ui.cursor,     generate: getGlobalSettingGenerator('caret') },
  { source: set => set.ui.invisibles, generate: getGlobalSettingGenerator('invisibles') },
  { source: set => set.ui.findMatchHighlight, generate: getGlobalSettingGenerator('findMatchHighlight') },
  { source: set => set.ui.currentFindMatchHighlight, generate: getGlobalSettingGenerator('currentFindMatchHighlight') },
  { source: set => set.ui.findRangeHighlight, generate: getGlobalSettingGenerator('findRangeHighlight') },
  { source: set => set.ui.rangeHighlight, generate: getGlobalSettingGenerator('rangeHighlight') },
  { source: set => set.ui.selection, generate: getGlobalSettingGenerator('selection') },
  { source: set => set.ui.selectionHighlight, generate: getGlobalSettingGenerator('selectionHighlight') },
  { source: set => set.ui.wordHighlight, generate: getGlobalSettingGenerator('wordHighlight') },
  { source: set => set.ui.wordHighlightStrong, generate: getGlobalSettingGenerator('wordHighlightStrong') },
  { source: set => set.ui.activeLinkForeground, generate: getGlobalSettingGenerator('activeLinkForeground') }
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
    generate: getSimpleColorGenerator('Identifier', 'variable, support.variable, support.class, support.constant') },
  { source: set => set.syntax.keyword,
    generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, language.this') },
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
    generate: getSimpleColorGenerator('Type', 'support.type', FontStyle.BOLD) },
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
    generate: getSimpleColorGenerator('JSON key', 'meta.object-literal.key') },
  // modifier: This includes things like access modifiers, static, readonly, etc.
  { source: set => set.syntax.modifier,
    generate: getSimpleColorGenerator('Modifier', 'modifier') },
  { source: set => set.syntax.this,
    generate: getSimpleColorGenerator('This variable', 'variable.language.this') },
  { source: set => set.syntax.cssClass,
    generate: getSimpleColorGenerator('CSS class', 'entity.other.attribute-name.class') },
  { source: set => set.syntax.cssId,
    generate: getSimpleColorGenerator('CSS ID', 'entity.other.attribute-name.id') }
];

export class VscodeThemeGenerator implements IThemeGenerator {
  public generateTheme(name: string, colorSet: IColorSet): string {
    const theme: IVscodeJsonTheme = {};
    theme.name = name;
    theme.settings = [];

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
    theme.settings.push(globalSetting);

    vscodeJsonThemeRules.forEach(ruleGenerator => {
      const color = <string>ruleGenerator.source(colorSet);
      if (color) {
        theme.settings.push(ruleGenerator.generate(color));
      }
    });
    return JSON.stringify(theme);
  }
}
