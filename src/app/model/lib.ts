export enum KEY_CODE {
  ENTER = 13,
  ESCAPE = 27,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  RIGHT_ARROW = 39,
  DOWN_ARROW = 40,
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
  static rndDate(): Date {
    let y = Lib.rndn(2, 2015)
    let m = Lib.rndn(12, 1)
    let d = Lib.rndn(28, 1)
    return new Date(y + '-' + m + '-' + d)
  }

  static assert(condition: boolean, message: string, ...things) {
    if (condition) {
      console.log('Assertion failed: ', message, ...things)
      throw new Error('Assertion failed: ' + message)
    }
  }
  static failif(condition: boolean, message: string, ...things) {
    if (condition) throw new Error('Assertion failed: ' + message + ': ' + things.join(', '))
  }

  static isNil(obj): boolean {
    // tslint:disable-next-line:triple-equals
    return obj == undefined
  }

  static noExtra(ev: KeyboardEvent, kc: KEY_CODE): boolean {
    return ev.keyCode === kc && ev.metaKey === false
      && ev.altKey === false && ev.shiftKey === false && ev.ctrlKey === false
  }
}
