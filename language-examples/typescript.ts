import { a } from 'some-file';

class Example {
  private static readonly _a: string = 'foo';

  private get a() {
    return this._a;
  }

  public b(arg1: number, arg2: boolean): string {
    return `${arg1} ${arg2}`;
  }
}
