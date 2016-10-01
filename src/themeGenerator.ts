export interface IThemeGenerator {
  generateTheme(name: string, colorSet: IColorSet): string;
}

export interface IColorSet {
  ansi?: {
    normal?: IAnsiColorSet;
    bright?: IAnsiColorSet;
  }
  syntax?: {
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
    background?: string;
    foreground?: string;
  }
}

export interface IAnsiColorSet {
  black?: string;
  red?: string;
  green?: string;
  yellow?: string;
  blue?: string;
  magenta?: string;
  cyan?: string;
  white?: string;
}
