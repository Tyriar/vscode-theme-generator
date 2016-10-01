///<reference path="../typings/globals/node/index.d.ts"/>

import * as fs from 'fs';
import * as path from 'path';
import { IColorSet } from './themeGenerator'
import { VscodeThemeGenerator } from './vscodeThemeGenerator'

const colorSet: IColorSet = {
  syntax: {
    identifier: '#ffffff',
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
const themeJson = new VscodeThemeGenerator().generateTheme('Generated theme 2', colorSet);
const outputFile = path.join(__dirname, '..', 'out', 'theme.json')

fs.writeFileSync(outputFile, themeJson);
