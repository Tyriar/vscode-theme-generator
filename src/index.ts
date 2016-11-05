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
const themeJson = new VscodeThemeGenerator().generateTheme('Generated theme 2', glacierColorSet);
const outputFile = path.join(__dirname, '..', 'out', 'theme.json')

fs.writeFileSync(outputFile, themeJson);
