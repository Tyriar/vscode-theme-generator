// An exceptionally useful comment
function func(param: string): object {
    var text = 'string';
    for (var i = 0; i < param.length; i++) {
        text += i;
    }
    var number = 0;
    var templateLiterals = `a ${text} b ${1 + 2} c`;
    return {
        "text": text,
        "boolean": false,
        "number": 231
    };
}
func('abc');

import { a } from 'some-file';

/**
 * Comment
 */
class Example {
  private static readonly _a: string = 'foo';

  private _c: boolean = true;

  private get a() {
    return Example._a;
  }

  public b(arg1: number, arg2: boolean): string {
    return `${arg1} ${arg2}`;
  }
}

function someFunction(arg1, arg2) {
}

var a = {
  a: 1,
  b: 2,
  "c": true
}
