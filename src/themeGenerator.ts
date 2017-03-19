export interface IThemeGenerator {
  generateTheme(name: string, colorSet: IColorSet): string;
}

export interface IColorSet {
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
    /** The default background color */
    background?: string;
    /** The default foreground color */
    foreground?: string;
    /** The accent color */
    accent?: string;
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

    ansiBlack?: string;
    ansiRed?: string;
    ansiGreen?: string;
    ansiYellow?: string;
    ansiBlue?: string;
    ansiMagenta?: string;
    ansiCyan?: string;
    ansiWhite?: string;
    ansiBrightBlack?: string;
    ansiBrightRed?: string;
    ansiBrightGreen?: string;
    ansiBrightYellow?: string;
    ansiBrightBlue?: string;
    ansiBrightMagenta?: string;
    ansiBrightCyan?: string;
    ansiBrightWhite?: string;
  }
}
