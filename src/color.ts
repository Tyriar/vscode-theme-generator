import { IColorSet, IBaseColorSet } from "./interfaces";

export function lighten(color: string, amount: number): string {
  const MAX = 255;
  let r = parseInt(color.substr(1, 2), 16);
  let g = parseInt(color.substr(3, 2), 16);
  let b = parseInt(color.substr(5, 2), 16);
  r = Math.min(Math.floor(r + (r * amount)), MAX);
  g = Math.min(Math.floor(g + (g * amount)), MAX);
  b = Math.min(Math.floor(b + (b * amount)), MAX);
  let rs = r.toString(16);
  if (rs.length === 1) {
    rs = '0' + rs;
  }
  let gs = g.toString(16);
  if (gs.length === 1) {
    gs = '0' + gs;
  }
  let bs = b.toString(16);
  if (bs.length === 1) {
    bs = '0' + bs;
  }
  return `#${rs}${gs}${bs}`;
}

export function darken(color: string, amount: number): string {
  return lighten(color, -amount);
}

export function addAlpha(color: string, alpha: number): string {
  if (color.length !== 7) {
    throw new Error('addAlpha only supports adding to #rrggbb format colors');
  }
  let alphaHex = Math.round(alpha * 255).toString(16);
  if (alphaHex.length === 1) {
    alphaHex = '0' + alphaHex;
  }
  return color + alphaHex;
}

export function generateFallbackColorSet(s: IBaseColorSet): IColorSet {
  return {
    base: {
      background: null,
      foreground: null,
      color1: null,
      color2: null,
      color3: null,
      color4: null
    },
    syntax: {
      boolean: s.color1,
      function: s.color3,
      functionCall: s.color4,
      identifier: lighten(s.color1, 0.5),
      keyword: s.color1,
      number: s.color4,
      storage: s.color1,
      string: s.color2,
      comment: lighten(s.background, 2.0),
      class: s.color3,
      classMember: s.color3,
      type: s.color3,
      modifier: null,
      cssClass: s.color1,
      cssId: s.color2,
      cssTag: s.color3,
      markdownQuote: null
    },
    ui: {
      cursor: null,
      invisibles: lighten(s.background, 0.2),
      guide: lighten(s.background, 0.2),
      lineHighlight: null,
      findMatchHighlight: null,
      currentFindMatchHighlight: null,
      findRangeHighlight: null,
      rangeHighlight: null,
      selectionHighlight: null,
      selection: null,
      wordHighlight: null,
      wordHighlightStrong: null,
      activeLinkForeground: null
    },
    terminal: {
      black: null,
      red: null,
      green: null,
      yellow: null,
      blue: null,
      magenta: null,
      cyan: null,
      white: null,
      brightBlack: null,
      brightRed: null,
      brightGreen: null,
      brightYellow: null,
      brightBlue: null,
      brightMagenta: null,
      brightCyan: null,
      brightWhite: null
    }
  };
}
