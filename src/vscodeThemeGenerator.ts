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
    theme.colors['debugToolBar.background'] = lighten(colorSet.base.background, 0.4);
    theme.colors['sideBarSectionHeader.background'] = theme.colors['activityBar.background'];
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
    // Editor marker
    theme.colors['editorMarkerNavigation.background'] = lighten(colorSet.base.background, 0.2);

    // Transparent white to leverage underlying background color
    theme.colors['list.activeSelectionBackground'] = colorSet.base.color1 + '80';
    theme.colors['list.dropBackground'] = colorSet.base.color1 + '80';
    theme.colors['list.focusBackground'] = colorSet.base.color1 + '80';
    theme.colors['list.hoverBackground'] = '#FFFFFF1A';
    theme.colors['list.inactiveSelectionBackground'] = '#FFFFFF33';

    theme.colors['editor.lineHighlightBorder'] = '#FFFFFF1A';
    theme.colors['editor.rangeHighlightBackground'] = '#FFFFFF0D';
    // TODO: Support editorLineHighlight
    theme.colors['editorGroup.dropBackground'] = colorSet.base.color1 + '80';
    theme.colors['activityBar.dropBackground'] = colorSet.base.color1 + '80';
    theme.colors['panelTitle.activeBorder'] = colorSet.base.color1;
    theme.colors['inputOption.activeBorder'] = colorSet.base.color1;

    theme.colors['statusBarItem.hoverBackground'] = '#FFFFFF1A';
    theme.colors['statusBarItem.activeBackground'] = colorSet.base.color1 + '80';
    theme.colors['pickerGroup.border'] = '#FFFFFF1A';
    theme.colors['panel.border'] = '#FFFFFF1A';
    theme.colors['tab.border'] = '#00000033';
    theme.colors['editorLineNumber.foreground'] = '#FFFFFF4D';

    return JSON.stringify(theme, null, 2);
  }
}
