// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export enum KEY {
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
}

export class Lib {
  static times(n: number): number[] {
    let arr = []
    for (let i = 0; i < n; i++) arr[i] = i
    return arr
  }
  static rndn(ncount: number, nmin = 0): number {
    let rndi = Math.random() * ncount
    return Math.floor(rndi) + nmin
  }
  static rnd<T>(arr: Array<T>): T {
    return arr[Lib.rndn(arr.length)]
  }
  // default is 50% probability
  static toss(b = 2, a = 1): boolean {
    return Lib.rndn(b) < a
  }

  // un-testable !!
  static rndDate(): Date {
    let y = Lib.rndn(2, 2015)
    let m = Lib.rndn(12, 1)
    let d = Lib.rndn(28, 1)
    return new Date(y + '-' + m + '-' + d)
  }

  static rndTrial(genfun: () => number, N = 1000): number {
    let arr = Lib.times(N)
    let n1 = () => arr.reduce((xx, x) => xx + genfun()) / N
    let n2 = () => arr.reduce((xx, x) => xx + n1()) / N
    // return Math.round(n2() * 100)
    return n2()
  }

  static timize(t: number) {
    let pad2 = x => ('0' + x).slice(-2)
    let h = Math.trunc(t / 3600)
    let hr = t % 3600
    let m = Math.trunc(hr / 60)
    let mr = t % 60
    let s = mr
    if (h === 0) return m + ':' + pad2(s)
    else return h + ':' + pad2(m) + ':' + pad2(s)
  }

  // TBD: NOTE: bad name, same as failif.
  static failifold(condition: boolean, message: string, ...things) {
    if (condition) {
      console.log('Assertion failed: ', message, ...things)
      throw new Error('Assertion failed: ' + message)
    }
  }
  static failif(condition: boolean, message: string, ...things) {
    if (condition) throw new Error('Assertion failed: ' + message + ': ' + things.join(', '))
  }

  static assert(condition: boolean, message: string, ...things) {
    if (!condition) throw new Error('Assertion failed: ' + message + ': ' + things.join(', '))
  }

  static isNil(obj): boolean {
    // tslint:disable-next-line:triple-equals
    return obj == undefined
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
  static isPlainKey(ev: KeyboardEvent, k: KEY): boolean {
    return ev.key === k && ev.metaKey === false
      && ev.altKey === false && ev.shiftKey === false && ev.ctrlKey === false
  }

  public static n2s(n: number) {
    return ('0' + n).slice(-2);
  }

  public static n9(d: string) {
    if (d === '-' || d === 'T' || d === ':' || d === '.' || d === 'Z') return d
    else return 9 - (+d)
  }

  public static d2rev(d: string) {
    let dd = []
    d.split('').forEach(c => dd.push(this.n9(c)));
    return dd.join('')
  }

}
