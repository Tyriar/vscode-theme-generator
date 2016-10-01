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

export interface IVscodeJsonGlobalSetting {
  name: string;
  settings: {
    background?: string
    foreground?: string
  };
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
    let globalSetting: IVscodeJsonGlobalSetting = {
      'name': name,
      'settings': {}
    };
    (<any>globalSetting.settings)[name] = color;
    return globalSetting;
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

// An ordered list of rules to be applied if the source conditions are met
const vscodeJsonThemeRules: IRuleGenerator[] = [
  // Global settings
  { source: set => set.ui.background,
    generate: getGlobalSettingGenerator('background') },
  { source: set => set.ui.foreground,
    generate: getGlobalSettingGenerator('foreground') },

  // Syntax
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Identifier', 'variable') },
  { source: set => set.syntax.string,
    generate: getSimpleColorGenerator('String', 'string') },
  { source: set => set.syntax.number,
    generate: getSimpleColorGenerator('Number', 'constant.numeric') },
  { source: set => set.syntax.keyword,
    generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, language.this') },
  // support.function: eg. join in path.join in TypeScript
  { source: set => set.syntax.functionCall,
    generate: getSimpleColorGenerator('Function call', 'entity.name.function, support.function') },
  { source: set => set.syntax.storage,
    generate: getSimpleColorGenerator('Storage', 'storage.type') },
  // module.support: imported modules in TypeScript
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Modules', 'module.support', FontStyle.ITALIC) },
  { source: set => set.syntax.type,
    generate: getSimpleColorGenerator('Type', 'type, declaration.entity.name.class') },
  { source: set => set.syntax.comment,
    generate: getSimpleColorGenerator('Comment', 'comment', FontStyle.ITALIC) },
  { source: set => set.syntax.class,
    generate: getSimpleColorGenerator('Class', 'entity.name.class', FontStyle.UNDERLINE) }
];

export class VscodeThemeGenerator implements IThemeGenerator {
  public generateTheme(name: string, colorSet: IColorSet): string {
    let theme: IVscodeJsonTheme = {};
    theme.name = name;
    theme.settings = [];
    vscodeJsonThemeRules.forEach(ruleGenerator => {
      try {
        let color = <string>ruleGenerator.source(colorSet);
        theme.settings.push(ruleGenerator.generate(color));
      } catch (ex) {
        // Ignore when source color does not exist
      }
    });
    return JSON.stringify(theme);
  }
}
