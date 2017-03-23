export interface IThemeGenerator {
  generateTheme(name: string, colorSet: IColorSet): string;
}

export interface IColorSet {
  base: {
    /** The default background color */
    background: string;
    /** The default foreground color */
    foreground: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
  },
  syntax?: {
    boolean?: string;
    function?: string;
    functionCall?: string;
    identifier?: string;
    keyword?: string;
    number?: string;
    storage?: string;
    string?: string;
    comment?: string;
    class?: string;
    classMember?: string;
    type?: string;
    modifier?: string;
    this?: string;
    cssClass?: string;
    cssId?: string;
    cssTag?: string;
    markdownQuote?: string;
  }
  ui?: {
    /** The color of the editor cursor/caret */
    cursor?: string;
    /** Visible whitespace (editor.renderWhitespace) */
    invisibles?: string;
    /** Indent guide */
    guide?: string;
    /** Line highlight, this will remove the line borders in favor of a solid highlight */
    lineHighlight?: string;

    findMatchHighlight?: string;
    currentFindMatchHighlight?: string;
    findRangeHighlight?: string;
    /** Highlights the line(s) of the current find match, this also applies to things like find symbol */
    rangeHighlight?: string;
    /** Highlights strings that match the current selection, excluding the selection itself */
    selectionHighlight?: string;

    selection?: string;
    wordHighlight?: string;
    wordHighlightStrong?: string;
    activeLinkForeground?: string;
  },
  terminal: {
    black?: string;
    red?: string;
    green?: string;
    yellow?: string;
    blue?: string;
    magenta?: string;
    cyan?: string;
    white?: string;
    brightBlack?: string;
    brightRed?: string;
    brightGreen?: string;
    brightYellow?: string;
    brightBlue?: string;
    brightMagenta?: string;
    brightCyan?: string;
    brightWhite?: string;
  }
}
