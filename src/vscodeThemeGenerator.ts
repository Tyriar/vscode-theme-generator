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
    theme.colors['editor.background'] = colorSet.base.background;
    theme.colors['editorHoverWidget.background'] = lighten(colorSet.base.background, 0.2);
    theme.colors['editorWidget.background'] = lighten(colorSet.base.background, 0.2);
    theme.colors['editorGroupHeader.tabsBackground'] = lighten(colorSet.base.background, 0.2);
    theme.colors['tab.inactiveBackground'] = lighten(colorSet.base.background, 0.4);
    theme.colors['sideBar.background'] = lighten(colorSet.base.background, 0.2);
    theme.colors['panel.background'] = lighten(colorSet.base.background, 0.2);
    theme.colors['activityBar.background'] = lighten(colorSet.base.background, 0.4);
    theme.colors['activityBar.badge.background'] = colorSet.base.color1;
    theme.colors['input.background'] = lighten(colorSet.base.background, 0.6);
    theme.colors['dropdown.background'] = lighten(colorSet.base.background, 0.6);
    theme.colors['statusBar.background'] = darken(colorSet.base.background, 0.2);
    theme.colors['statusBar.noFolderBackground'] = darken(colorSet.base.background, 0.2); // Don't make distinction between folder/no folder
    theme.colors['statusBar.debuggingBackground'] = colorSet.base.color1; // Don't make distinction between folder/no folder
    theme.colors['focusBorder'] = colorSet.base.color1;
    // Peek editor
    theme.colors['peekViewEditor.background'] = darken(colorSet.base.background, 0.2);
    theme.colors['peekViewTitle.background'] = colorSet.base.background;
    theme.colors['peekView.border'] = colorSet.base.color1;
    theme.colors['peekViewResult.background'] = lighten(colorSet.base.background, 0.2);
    // Find widget
    // theme.colors['editorFindWidgetBackground'] = lighten(colorSet.base.background, 0.2);
    // theme.colors['editorFindInputBackground'] = lighten(colorSet.base.background, 0.4);
    // theme.colors['editorFindCheckedBorders'] = colorSet.base.color1;
    // Editor marker
    theme.colors['editorMarkerNavigation.background'] = lighten(colorSet.base.background, 0.2);

    return JSON.stringify(theme);
  }
}
