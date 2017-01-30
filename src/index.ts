import * as fs from 'fs';
import * as path from 'path';
import { IColorSet } from './themeGenerator'
import { VscodeThemeGenerator } from './vscodeThemeGenerator'

const colorSet1: IColorSet = {
  syntax: {
    identifier: '#ffffff',
    boolean: '#be84ff',
    string: '#87d75f',
    number: '#ffcc66',
    keyword: '#ff8f7e',
    functionCall: '#cae682',
    storage: '#88b8f6',
    comment: '#989898',
    class: '#cae682',
    type: '#88b8f6'
  },
  ui: {
    background: '#151515'
  }
};

const glacierColorSet: IColorSet = {
  syntax: {
    identifier: '#d73c4d', // Should be bold in Glacier
    // boolean: '#',
    string: '#ffe792',
    // number: '#',
    keyword: '#d7503c',
    // functionCall: '#',
    storage: '#3cadd7',
    comment: '#515c68',
    // class: '#',
    // type: '#',
    modifier: '#3cadd7'
  },
  ui: {
    background: '#0e151b',
    foreground: '#efefef',
    cursor: '#ffe792'
  }
};

const colorset2colors = {
  red: '#DA6771',
  redLight: '#e5949b',
  green: '#4EB071',
  yellow: '#fff099',
  blue: '#399EF4',
  blueLight: '#9fcff9',
  pink: '#B168DF',
  teal: '#21C5C7',
  grey: '#4A5160'
}

const colorSet2: IColorSet = {
  syntax: {
    identifier: colorset2colors.blueLight,
    string: colorset2colors.red,
    number: colorset2colors.redLight,
    keyword: colorset2colors.blue,
    boolean: colorset2colors.blue,
    function: colorset2colors.teal,
    functionCall: colorset2colors.yellow,
    storage: colorset2colors.blue,
    comment: colorset2colors.grey,
    class: colorset2colors.teal,
    classMember: colorset2colors.teal,
    type: colorset2colors.green,
    this: colorset2colors.blue
  },
  ui: {
    background: '#151B24',
    foreground: '#efefef',
    cursor: '#ffffff'
  }
};
const themeJson = new VscodeThemeGenerator().generateTheme('Generated theme 2', colorSet2);
const outputFile = path.join(__dirname, '..', 'out', 'theme.json')

fs.writeFileSync(outputFile, themeJson);
