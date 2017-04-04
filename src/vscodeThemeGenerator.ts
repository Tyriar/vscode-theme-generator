import { IColorSet, IThemeGenerator, IBaseColorSet } from './interfaces'
import { darken, lighten, generateFallbackColorSet } from './color';
import { tokenRules, terminalRules, colorRules, globalRules, IVscodeJsonThemeSetting } from './rules';

export interface IVscodeJsonTheme {
  name?: string;
  settings?: IVscodeJsonThemeSetting[];
  tokenColors?: IVscodeJsonThemeSetting[];
  colors?: {[key: string]: string};
}

export class VscodeThemeGenerator implements IThemeGenerator {
  public generateTheme(name: string, colorSet: IColorSet): string {
    // Fill in missing subsets to prevent NPEs
    if (!colorSet.syntax) colorSet.syntax = {};
    if (!colorSet.terminal) colorSet.terminal = {};
    if (!colorSet.ui) colorSet.ui = {};

    const fallbackColorSet = generateFallbackColorSet(colorSet.base);

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
      const color = generator.color(colorSet) || generator.color(fallbackColorSet);
      if (color) {
        theme.tokenColors.push(generator.generate(color));
      }
    });

    colorRules.concat(terminalRules).forEach(generator => {
      const color = generator.color(colorSet) || generator.color(fallbackColorSet);
      if (color) {
        const generated = generator.generate(color);
        theme.colors[Object.keys(generated)[0]] = color;
      }
    });

    globalRules.forEach(generator => {
      const color = generator.color(colorSet) || generator.color(fallbackColorSet);
      if (color) {
        const generated = generator.generate(color);
        globalSettings.settings[Object.keys(generated)[0]] = color;
      }
    });
    theme.tokenColors.push(globalSettings);

    // TODO: Expose details options on IColorSet
    theme.colors['tabsContainerBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['inactiveTabBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['sideBarBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['panelBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['activityBarBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['activityBadgeBackground'] = colorSet.base.color1;
    theme.colors['inputBoxBackground'] = lighten(colorSet.base.background, 0.6);
    theme.colors['dropdownBackground'] = lighten(colorSet.base.background, 0.6);
    theme.colors['statusBarBackground'] = darken(colorSet.base.background, 0.2);
    theme.colors['focusedElementOutline'] = colorSet.base.color1;
    // Peek editor
    theme.colors['editorPeekEditorBackground'] = darken(colorSet.base.background, 0.2);
    theme.colors['editorPeekTitleBackground'] = colorSet.base.background;
    theme.colors['editorPeekBorder'] = colorSet.base.color1;
    theme.colors['editorPeekResultsBackground'] = lighten(colorSet.base.background, 0.2);
    // Find widget
    theme.colors['editorFindWidgetBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['editorFindInputBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['editorFindCheckedBorders'] = colorSet.base.color1;
    // Editor marker
    theme.colors['editorMarkerNavigationBackground'] = lighten(colorSet.base.background, 0.2);

    return JSON.stringify(theme);
  }
}
