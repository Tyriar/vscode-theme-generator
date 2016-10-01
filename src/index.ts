///<reference path="../typings/globals/node/index.d.ts"/>

import * as fs from 'fs';
import * as path from 'path';

console.log('test');

interface IColorSet {
    ansiGroups?: {
        ansiNormal?: IAnsiColorSet;
        ansiBright?: IAnsiColorSet;
    }
    syntaxGroups?: {
        constant?: string;
        identifier?: string;
        statement?: string;
        type?: string;
        global?: string;
        emphasis?: string;
        special?: string;
        trivial?: string;
    }
    uiGroups?: {
        userActionNeeded?: string;
        userCurrentState?: string;
        backgroundState?: string;
        background?: string;
        foreground?: string;
    }
}

interface IAnsiColorSet {
    black?: string;
    red?: string;
    green?: string;
    yellow?: string;
    blue?: string;
    magenta?: string;
    cyan?: string;
    white?: string;
}

interface IThemeGenerator {
    generateTheme(colorSet: IColorSet): string;
}

interface IVscodeJsonTheme {
    name?: string;
    include?: string;
    settings?: any[];
}

class VscodeThemeGenerator implements IThemeGenerator {
    public generateTheme(colorSet: IColorSet): string {
        let theme: IVscodeJsonTheme = {};
        theme.name = 'Generated theme';
        theme.settings = [];
        if (colorSet.syntaxGroups.identifier) {
            theme.settings.push({
                'name': 'Function declarations',
                'scope': 'entity.name.function',
                'settings': {
                    'foreground': colorSet.syntaxGroups.identifier
                }
            });
        }
        return JSON.stringify(theme);
    }
}

const colorSet: IColorSet = {
    syntaxGroups: {
        identifier: '#F00'
    }
}; 
const themeJson = new VscodeThemeGenerator().generateTheme(colorSet);
const outputFile = path.join(__dirname, '..', 'out', 'theme.json') 
fs.writeFileSync(outputFile, themeJson);