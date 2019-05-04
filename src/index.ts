import * as fs from 'fs';
import { IColorSet } from './interfaces';
import { VscodeThemeGenerator } from './vscodeThemeGenerator';

export function generateTheme(themeName: string, colorSet: IColorSet, outputFile: string): void {
  const themeJson = new VscodeThemeGenerator().generateTheme(themeName, colorSet);
  fs.writeFileSync(outputFile, themeJson);
}

export { IColorSet } from './interfaces';
