import { IColorSet, IThemeGenerator } from './themeGenerator'

export interface IVscodeJsonTheme {
  name?: string;
  include?: string;
  globalSettings?: {
    background?: string;
    foreground?: string;
  };
  settings?: any[];
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

function getSimpleColorGenerator(name: string, scope: string, fontStyle: number = FontStyle.NONE): (color: string) => any {
  return (color: string) => {
    let colorRule: any = {
      'name': name,
      'scope': scope,
      'settings': {
        'foreground': color
      }
    };
    let fontStyleValue = '';
    if (fontStyle & FontStyle.ITALIC) {
      fontStyleValue += ' italic';
    }
    if (fontStyle & FontStyle.BOLD) {
      fontStyleValue += ' bold';
    }
    if (fontStyle & FontStyle.UNDERLINE) {
      fontStyleValue += ' underline';
    }
    if (fontStyleValue.length > 0) {
      colorRule.settings.fontStyle = fontStyleValue.trim();
    }
    return colorRule;
  }
}

// An ordered list of rules to be applied if the source conditions are met
const vscodeJsonThemeRules: IRuleGenerator[] = [
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Identifier', 'variable') },
  { source: set => set.syntax.string,
    generate: getSimpleColorGenerator('String', 'string') },
  { source: set => set.syntax.number,
    generate: getSimpleColorGenerator('Number', 'constant.numeric') },
  { source: set => set.syntax.keyword,
    generate: getSimpleColorGenerator('Keyword', 'keyword, modifier, language.this') },
  // support/module function calls (eg. join in path.join) are colored as function calls
  { source: set => set.syntax.functionCall,
    generate: getSimpleColorGenerator('Function call', 'entity.name.function, support.function') },
  { source: set => set.syntax.storage,
    generate: getSimpleColorGenerator('Storage', 'storage.type') },
  // TypeScript modules are colored as variables
  { source: set => set.syntax.identifier,
    generate: getSimpleColorGenerator('Modules', 'module.support', FontStyle.ITALIC) },
  { source: set => set.syntax.type,
    generate: getSimpleColorGenerator('Type', 'type') },
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
    if (colorSet.ui.background) {
      theme.settings.push({
        'name': 'background',
        'settings': {
          'background': colorSet.ui.background
        }
      });
    }
    if (colorSet.ui.foreground) {
      theme.settings.push({
        'name': 'foreground',
        'settings': {
          'foreground': colorSet.ui.foreground
        }
      });
    }
    vscodeJsonThemeRules.forEach(ruleGenerator => {
      try {
        let color = ruleGenerator.source(colorSet);
        theme.settings.push(ruleGenerator.generate(<string>color));
      } catch (ex) {
        // Ignore when source color does not exist
      }
    });
    return JSON.stringify(theme);
  }
}
