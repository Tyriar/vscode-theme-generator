import { IColorSet, IThemeGenerator, IBaseColorSet } from './interfaces';
import { darken, lighten, generateFallbackColorSet, addAlpha, contast as contrast } from './color';
import { tokenRules, globalRules, IVscodeJsonThemeSetting } from './rules';

export interface IVscodeJsonTheme {
  name?: string;
  settings?: IVscodeJsonThemeSetting[];
  tokenColors?: IVscodeJsonThemeSetting[];
  colors?: {[key: string]: string};
}

export class VscodeThemeGenerator implements IThemeGenerator {
  public generateTheme(name: string, colorSet: IColorSet): string {
    // Fill in missing subsets to prevent NPEs
    if (!colorSet.type) colorSet.type = 'dark';
    if (!colorSet.syntax) colorSet.syntax = {};
    if (!colorSet.terminal) colorSet.terminal = {};
    if (!colorSet.ui) colorSet.ui = {};

    const fallbackColorSet = generateFallbackColorSet(colorSet.base, colorSet.type);

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

    globalRules.forEach(generator => {
      const color = generator.color(colorSet) || generator.color(fallbackColorSet);
      if (color) {
        const generated = generator.generate(color);
        globalSettings.settings[Object.keys(generated)[0]] = color;
      }
    });
    theme.tokenColors.push(globalSettings);

    this._applyWorkbenchColors(theme, colorSet);

    return JSON.stringify(theme, null, 2);
  }

  private _applyWorkbenchColors(theme: IVscodeJsonTheme,  colorSet: IColorSet): void {
    const background1 = (colorSet.type === 'light' ? lighten : darken)(colorSet.base.background, 0.2);
    const background2 = colorSet.base.background;
    const background3 = (colorSet.type === 'light' ? darken : lighten)(colorSet.base.background, 0.2);
    const background4 = (colorSet.type === 'light' ? darken : lighten)(colorSet.base.background, 0.4);
    const background5 = (colorSet.type === 'light' ? darken : lighten)(colorSet.base.background, 0.6);
    const color1Unfocused = darken(colorSet.base.color1, 0.2);
    const color1Inactive = darken(colorSet.base.color1, 0.4);

    // Contrast colors
    // contrastActiveBorder: An extra border around active elements to separate them from others for greater contrast.
    // contrastBorder: An extra border around elements to separate them from others for greater contrast.

    // Base Colors
    // focusBorder: Overall border color for focused elements. This color is only used if not overridden by a component.
    theme.colors['focusBorder'] = colorSet.base.color1;
    // foreground: Overall foreground color. This color is only used if not overridden by a component.
    theme.colors['foreground'] = colorSet.base.foreground;
    // widget.shadow: Shadow color of widgets such as find/replace inside the editor.

    // Button Control
    // button.background: Button background color.
    theme.colors['button.background'] = colorSet.base.color1;
    // button.foreground: Button foreground color.
    theme.colors['button.foreground'] = contrast(theme.colors['button.background']);
    // button.hoverBackground: Button background color when hovering.

    // Dropdown Control
    // dropdown.background: Dropdown background.
    theme.colors['dropdown.background'] = background5;
    // dropdown.border: Dropdown border.
    // dropdown.foreground: Dropdown foreground.

    // Input Control
    // input.background: Input box background.
    theme.colors['input.background'] = background5;
    // input.border: Input box border.
    // input.foreground: Input box foreground.
    // inputOption.activeBorder: Border color of activated options in input fields.
    theme.colors['inputOption.activeBorder'] = colorSet.base.color1;
    // inputValidation.errorBackground: Input validation background color for error severity.
    // inputValidation.errorBorder: Input validation border color for error severity.
    // inputValidation.infoBackground: Input validation background color for information severity.
    // inputValidation.infoBorder: Input validation border color for information severity.
    // inputValidation.warningBackground: Input validation background color for information warning.
    // inputValidation.warningBorder: Input validation border color for warning severity.

    // Scrollbar Control
    // scrollbar.shadow: Scrollbar shadow to indicate that the view is scrolled.
    // scrollbarSlider.activeBackground: Slider background color when active.
    // scrollbarSlider.background: Slider background color.
    // scrollbarSlider.hoverBackground: Slider background color when hovering.

    // Lists and Trees
    // list.activeSelectionBackground: List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
    theme.colors['list.activeSelectionBackground'] = addAlpha(colorSet.base.color1, 0.5);
    // list.activeSelectionForeground: List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
    theme.colors['list.activeSelectionForeground'] = '#FFFFFF';
    // list.dropBackground: List/Tree drag and drop background when moving items around using the mouse.
    theme.colors['list.dropBackground'] = addAlpha(colorSet.base.color1, 0.5);
    theme.colors['list.focusForeground'] = '#FFFFFF';
    // list.highlightForeground: List/Tree foreground color of the match highlights when searching inside the list/tree.
    theme.colors['list.highlightForeground'] = colorSet.base.color1;
    // list.hoverBackground: List/Tree background when hovering over items using the mouse.
    theme.colors['list.hoverBackground'] = addAlpha('#FFFFFF', 0.1);
    // list.inactiveSelectionBackground: List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
    theme.colors['list.inactiveSelectionBackground'] = addAlpha('#FFFFFF', 0.2);

    // Activity Bar
    // activityBar.background: Activity bar background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.
    theme.colors['activityBar.background'] = background4;
    // activityBar.dropBackground: Drag and drop feedback color for the activity bar items. The activity bar is showing on the far left or right and allows to switch between views of the side bar.
    theme.colors['activityBar.dropBackground'] = addAlpha(colorSet.base.color1, 0.5);
    // activityBar.foreground: Activity bar foreground color (e.g. used for the icons). The activity bar is showing on the far left or right and allows to switch between views of the side bar.
    // activityBarBadge.background: Activity notification badge background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.
    theme.colors['activityBarBadge.background'] = colorSet.base.color1;
    // activityBarBadge.foreground: Activity notification badge foreground color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.
    theme.colors['activityBarBadge.foreground'] = contrast(theme.colors['activityBarBadge.background']);

    // Badge
    theme.colors['badge.background'] = colorSet.base.color1;
    theme.colors['badge.foreground'] = contrast(theme.colors['badge.background']);

    // Side Bar
    // sideBar.background: Side bar background color. The side bar is the container for views like explorer and search.
    theme.colors['sideBar.background'] = background3;
    // sideBarSectionHeader.background: Side bar section header background color. The side bar is the container for views like explorer and search.
    theme.colors['sideBarSectionHeader.background'] = background4;
    // sideBarTitle.foreground: Side bar title foreground color. The side bar is the container for views like explorer and search.

    // Editor Groups & Tabs
    // editorGroup.background: Background color of an editor group. Editor groups are the containers of editors. The background color shows up when dragging editor groups around.
    // editorGroup.border: Color to separate multiple editor groups from each other. Editor groups are the containers of editors.
    // editorGroup.dropBackground: Background color when dragging editors around.
    theme.colors['editorGroup.dropBackground'] = addAlpha(colorSet.base.color1, 0.5);
    theme.colors['editorGroup.focusedEmptyBorder'] = colorSet.base.color1;
    // editorGroupHeader.noTabsBackground: Background color of the editor group title header when tabs are disabled. Editor groups are the containers of editors.
    // editorGroupHeader.tabsBackground: Background color of the tabs container. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    theme.colors['editorGroupHeader.tabsBackground'] = background3;
    // tab.activeBackground: Active tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    // tab.activeForeground: Active tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    // tab.border: Border to separate tabs from each other. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    theme.colors['tab.border'] = addAlpha('#000000', 0.2);
    // tab.inactiveBackground: Inactive tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    theme.colors['tab.activeBorder'] = colorSet.base.color1;
    theme.colors['tab.inactiveBackground'] = background4;
    // tab.inactiveForeground: Inactive tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.
    // tab.activeModifiedBorder: Border on top of the modified (dirty) active tabs in an active group.
    theme.colors['tab.activeModifiedBorder'] = colorSet.base.color1;
    // tab.inactiveModifiedBorder: Border on top of modified (dirty) inactive tabs in an active group.
    theme.colors['tab.inactiveModifiedBorder'] = color1Inactive;
    // tab.unfocusedActiveModifiedBorder: Border on the top of modified (dirty) active tabs in an unfocused group.
    theme.colors['tab.unfocusedActiveModifiedBorder'] = color1Unfocused;
    // tab.unfocusedInactiveModifiedBorder: Border on the top of modified (dirty) inactive tabs in an unfocused group.
    theme.colors['tab.unfocusedInactiveModifiedBorder'] = color1Inactive;

    // Editor Colors
    // editor.background: Editor background color.
    theme.colors['editor.background'] = background2;
    // editor.foreground: Editor default foreground color.
    theme.colors['editor.foreground'] = colorSet.base.foreground;
    // editorLineNumber.foreground: Color of editor line numbers.
    theme.colors['editorLineNumber.foreground'] = addAlpha('#FFFFFF', 0.3);
    theme.colors['editorLineNumber.activeForeground'] = colorSet.base.color1;
    // editorCursor.foreground: Color of the editor cursor.
    if (colorSet.ui.cursor) theme.colors['editorCursor.foreground'] = colorSet.ui.cursor;
    // editor.selectionBackground: Color of the editor selection.
    if (colorSet.ui.selection) theme.colors['editor.selectionBackground'] = colorSet.ui.selection;
    // editor.selectionHighlightBackground: Color for regions with the same content as the selection.
    if (colorSet.ui.selectionHighlight) theme.colors['editor.selectionHighlightBackground'] = colorSet.ui.selectionHighlight;
    // editor.inactiveSelectionBackground: Color of the selection in an inactive editor.
    // editor.wordHighlightBackground: Background color of a symbol during read-access, like reading a variable.
    if (colorSet.ui.wordHighlight) theme.colors['editor.wordHighlightBackground'] = colorSet.ui.wordHighlight;
    // editor.wordHighlightStrongBackground: Background color of a symbol during write-access, like writing to a variable.
    if (colorSet.ui.wordHighlightStrong) theme.colors['editor.wordHighlightStrongBackground'] = colorSet.ui.wordHighlightStrong;
    // editor.findMatchBackground: Color of the current search match.
    if (colorSet.ui.currentFindMatchHighlight) theme.colors['editor.findMatchBackground'] = colorSet.ui.currentFindMatchHighlight;
    // editor.findMatchHighlightBackground: Color of the other search matches.
    if (colorSet.ui.findMatchHighlight) theme.colors['editor.findMatchHighlight'] = colorSet.ui.findMatchHighlight;
    // editor.findRangeHighlightBackground: Color the range limiting the search.
    if (colorSet.ui.findRangeHighlight) theme.colors['editor.findRangeHighlightBackground'] = colorSet.ui.findRangeHighlight;
    // editor.hoverHighlightBackground: Highlight below the word for which a hover is shown.
    // editor.lineHighlightBackground: Background color for the highlight of line at the cursor position.
    // editor.lineHighlightBorder: Background color for the border around the line at the cursor position.
    theme.colors['editor.lineHighlightBorder'] = colorSet.ui.rangeHighlight ? colorSet.ui.rangeHighlight : addAlpha('#FFFFFF', 0.1);
    // editorLink.activeForeground: Color of active links.
    if (colorSet.ui.activeLinkForeground) theme.colors['editorLink.activeForeground'] = colorSet.ui.activeLinkForeground;
    // editor.rangeHighlightBackground: Background color of highlighted ranges, like by quick open and find features.
    theme.colors['editor.rangeHighlightBackground'] = addAlpha('#FFFFFF', 0.05);
    // editorWhitespace.foreground: Color of whitespace characters in the editor.
    if (colorSet.ui.invisibles) theme.colors['editorWhitespace.foreground'] = colorSet.ui.invisibles;
    // editorIndentGuide.background: Color of the editor indentation guides.
    if (colorSet.ui.guide) theme.colors['editorIndentGuide.background'] = colorSet.ui.guide;

    // Diff Editor Colors
    // diffEditor.insertedTextBackground: Background color for text that got inserted.
    // diffEditor.insertedTextBorder: Outline color for the text that got inserted.
    // diffEditor.removedTextBackground: Background color for text that got removed.
    // diffEditor.removedTextBorder: Outline color for text that got removed.

    // Editor Widget Colors
    // editorWidget.background: Background color of editor widgets, such as find/replace.
    theme.colors['editorWidget.background'] = background3;
    // editorSuggestWidget.background: Background color of the suggest widget.
    // editorSuggestWidget.border: Border color of the suggest widget.
    // editorSuggestWidget.foreground: Foreground color of the suggest widget.
    // editorSuggestWidget.highlightForeground: Color of the match highlights in the suggest widget.
    // editorSuggestWidget.selectedBackground: Background color of the selected entry in the suggest widget.
    // editorHoverWidget.background: Background color of the editor hover.
    theme.colors['editorHoverWidget.background'] = background3;
    // editorHoverWidget.border: Border color of the editor hover.
    // debugExceptionWidget.background: Exception widget background color.
    // debugExceptionWidget.border: Exception widget border color.
    // editorMarkerNavigation.background: Editor marker navigation widget background.
    theme.colors['editorMarkerNavigation.background'] = background3;
    // editorMarkerNavigationError.background: Editor marker navigation widget error color.
    // editorMarkerNavigationWarning.background: Editor marker navigation widget warning color.

    // Peek View Colors
    // peekView.border: Color of the peek view borders and arrow.
    theme.colors['peekView.border'] = colorSet.base.color1;
    // peekViewEditor.background: Background color of the peek view editor.
    theme.colors['peekViewEditor.background'] = background1;
    // peekViewEditor.matchHighlightBackground: Match highlight color in the peek view editor.
    // peekViewResult.background: Background color of the peek view result list.
    theme.colors['peekViewResult.background'] = background3;
    // peekViewResult.fileForeground: Foreground color for file nodes in the peek view result list.
    // peekViewResult.lineForeground: Foreground color for line nodes in the peek view result list.
    // peekViewResult.matchHighlightBackground: Match highlight color in the peek view result list.
    // peekViewResult.selectionBackground: Background color of the selected entry in the peek view result list.
    // peekViewResult.selectionForeground: Foreground color of the selected entry in the peek view result list.
    // peekViewTitle.background: Background color of the peek view title area.
    theme.colors['peekViewTitle.background'] = background2;
    // peekViewTitleDescription.foreground: Color of the peek view title info.
    // peekViewTitleLabel.foreground: Color of the peek view title.

    // Panel Colors
    // panel.background: Panel background color. Panels are shown below the editor area and contain views like output and integrated terminal.
    theme.colors['panel.background'] = background3;
    // panel.border: Panel border color on the top separating to the editor. Panels are shown below the editor area and contain views like output and integrated terminal.
    theme.colors['panel.border'] = addAlpha('#FFFFFF', 0.1);
    // panelTitle.activeBorder: Border color for the active panel title. Panels are shown below the editor area and contain views like output and integrated terminal.
    theme.colors['panelTitle.activeBorder'] = addAlpha(colorSet.base.foreground, 0.5);
    // panelTitle.activeForeground: Title color for the active panel. Panels are shown below the editor area and contain views like output and integrated terminal.
    // panelTitle.inactiveForeground: Title color for the inactive panel. Panels are shown below the editor area and contain views like output and integrated terminal.
    theme.colors['panelTitle.inactiveForeground'] = addAlpha(colorSet.base.foreground, 0.5);

    // Status Bar Colors
    // statusBar.background: Standard status bar background color. The status bar is shown in the bottom of the window.
    theme.colors['statusBar.background'] = background1;
    // statusBar.debuggingBackground: Status bar background color when a program is being debugged. The status bar is shown in the bottom of the window
    theme.colors['statusBar.debuggingBackground'] = colorSet.base.color1;
    theme.colors['statusBar.debuggingForeground'] = contrast(theme.colors['statusBar.debuggingBackground']);
    // statusBar.foreground: Status bar foreground color. The status bar is shown in the bottom of the window.
    // statusBar.noFolderBackground: Status bar background color when no folder is opened. The status bar is shown in the bottom of the window.
    theme.colors['statusBar.noFolderBackground'] = background1; // Don't make distinction between folder/no folder
    // statusBarItem.activeBackground: Status bar item background color when clicking. The status bar is shown in the bottom of the window.
    theme.colors['statusBarItem.activeBackground'] = addAlpha(colorSet.base.color1, 0.5);
    // statusBarItem.hoverBackground: Status bar item background color when hovering. The status bar is shown in the bottom of the window.
    theme.colors['statusBarItem.hoverBackground'] = addAlpha('#FFFFFF', 0.1);
    // statusBarItem.prominentBackground: Status bar prominent items background color. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window.
    // statusBarItem.prominentHoverBackground: Status bar prominent items background color when hovering. Prominent items stand out from other status bar entries to indicate importance. The status bar is shown in the bottom of the window.
    theme.colors['statusBarItem.remoteBackground'] = colorSet.base.color1;
    theme.colors['statusBarItem.remoteForeground'] = contrast(theme.colors['statusBarItem.remoteBackground']);

    // Title Bar Colors (macOS)
    // titleBar.activeBackground: Title bar background when the window is active. Note that this color is currently only supported on macOS.
    theme.colors['titleBar.activeBackground'] = background1;
    // titleBar.activeForeground: Title bar foreground when the window is active. Note that this color is currently only supported on macOS.
    // titleBar.inactiveBackground: Title bar background when the window is inactive. Note that this color is currently only supported on macOS.
    // titleBar.inactiveForeground: Title bar foreground when the window is inactive. Note that this color is currently only supported on macOS.

    // Notification Dialog Colors
    // notification.background: Notifications background color. Notifications slide in from the top of the window.
    // notification.foreground: Notifications foreground color. Notifications slide in from the top of the window.

    // Quick Picker
    // pickerGroup.border: Quick picker color for grouping borders.
    theme.colors['pickerGroup.border'] = addAlpha('#FFFFFF', 0.1);
    // pickerGroup.foreground: Quick picker color for grouping labels.

    // Terminal Colors
    // terminal.ansiBlack: 'Black' ansi color in the terminal.
    if (colorSet.terminal.black) theme.colors['terminal.ansiBlack'] = colorSet.terminal.black;
    // terminal.ansiBlue: 'Blue' ansi color in the terminal.
    if (colorSet.terminal.blue) theme.colors['terminal.ansiBlue'] = colorSet.terminal.blue;
    // terminal.ansiBrightBlack: 'BrightBlack' ansi color in the terminal.
    if (colorSet.terminal.brightBlack) theme.colors['terminal.ansiBrightBlack'] = colorSet.terminal.brightBlack;
    // terminal.ansiBrightBlue: 'BrightBlue' ansi color in the terminal.
    if (colorSet.terminal.brightBlue) theme.colors['terminal.ansiBrightBlue'] = colorSet.terminal.brightBlue;
    // terminal.ansiBrightCyan: 'BrightCyan' ansi color in the terminal.
    if (colorSet.terminal.brightCyan) theme.colors['terminal.ansiBrightCyan'] = colorSet.terminal.brightCyan;
    // terminal.ansiBrightGreen: 'BrightGreen' ansi color in the terminal.
    if (colorSet.terminal.brightGreen) theme.colors['terminal.ansiBrightGreen'] = colorSet.terminal.brightGreen;
    // terminal.ansiBrightMagenta: 'BrightMagenta' ansi color in the terminal.
    if (colorSet.terminal.brightMagenta) theme.colors['terminal.ansiBrightMagenta'] = colorSet.terminal.brightMagenta;
    // terminal.ansiBrightRed: 'BrightRed' ansi color in the terminal.
    if (colorSet.terminal.brightRed) theme.colors['terminal.ansiBrightRed'] = colorSet.terminal.brightRed;
    // terminal.ansiBrightWhite: 'BrightWhite' ansi color in the terminal.
    if (colorSet.terminal.brightWhite) theme.colors['terminal.ansiBrightWhite'] = colorSet.terminal.brightWhite;
    // terminal.ansiBrightYellow: 'BrightYellow' ansi color in the terminal.
    if (colorSet.terminal.brightYellow) theme.colors['terminal.ansiBrightYellow'] = colorSet.terminal.brightYellow;
    // terminal.ansiCyan: 'Cyan' ansi color in the terminal.
    if (colorSet.terminal.cyan) theme.colors['terminal.ansiCyan'] = colorSet.terminal.cyan;
    // terminal.ansiGreen: 'Green' ansi color in the terminal.
    if (colorSet.terminal.green) theme.colors['terminal.ansiGreen'] = colorSet.terminal.green;
    // terminal.ansiMagenta: 'Magenta' ansi color in the terminal.
    if (colorSet.terminal.magenta) theme.colors['terminal.ansiMagenta'] = colorSet.terminal.magenta;
    // terminal.ansiRed: 'Red' ansi color in the terminal.
    if (colorSet.terminal.red) theme.colors['terminal.ansiRed'] = colorSet.terminal.red;
    // terminal.ansiWhite: 'White' ansi color in the terminal.
    if (colorSet.terminal.white) theme.colors['terminal.ansiWhite'] = colorSet.terminal.white;
    // terminal.ansiYellow: 'Yellow' ansi color in the terminal.
    if (colorSet.terminal.yellow) theme.colors['terminal.ansiYellow'] = colorSet.terminal.yellow;

    // Debug
    // debugToolBar.background: Debug toolbar background color.
    theme.colors['debugToolBar.background'] = background4;

    // Bracket colorization
		theme.colors['editorBracketHighlight.foreground1'] = lighten(colorSet.base.color1, 0.25);
		theme.colors['editorBracketHighlight.foreground2'] = lighten(colorSet.base.color2, 0.25);
		theme.colors['editorBracketHighlight.foreground3'] = lighten(colorSet.base.color3, 0.25);
		theme.colors['editorBracketHighlight.foreground4'] = lighten(colorSet.base.color4, 0.25);

    theme.colors['selection.background'] = colorSet.base.color1;

    if (colorSet.overrides) {
      const keys = Object.keys(colorSet.overrides);
      keys.forEach(key => {
        theme.colors[key] = colorSet.overrides[key];
      });
    }
  }
}
