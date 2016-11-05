export interface IThemeGenerator {
  generateTheme(name: string, colorSet: IColorSet): string;
}

export interface IColorSet {
  syntax?: {
    boolean?: string;
    functionCall?: string;
    identifier?: string;
    keyword?: string;
    number?: string;
    storage?: string;
    string?: string;
    comment?: string;
    class?: string;
    type?: string;
  }
  ui?: {
    /** The default background color */
    background?: string;
    /** The default foreground color */
    foreground?: string;
    /** The color of the editor cursor/caret */
    cursor?: string;

    selectionHighlight?: string;
  }
}
