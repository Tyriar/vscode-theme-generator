import * as fs from 'fs';
import * as path from 'path';
import { IColorSet } from './interfaces'
import { VscodeThemeGenerator } from './vscodeThemeGenerator'

export function generateTheme(themeName: string, colorSet: IColorSet, outputFile: string) {
  const themeJson = new VscodeThemeGenerator().generateTheme(themeName, colorSet);
  fs.writeFileSync(outputFile, themeJson);
}

export { IColorSet } from './interfaces';
