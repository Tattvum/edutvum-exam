export class Lib {
  static times(n: number): number[] {
    let arr = []
    for (var i = 0; i < n; i++) arr[i] = i
    return arr
  }
  static rndn(ncount: number, nmin: number = 0): number {
    let rndi = Math.random() * ncount
    return Math.floor(rndi) + nmin
  }
  static rnd<T>(arr: Array<T>): T {
    return arr[Lib.rndn(arr.length)]
  }
  //default is 50% probability
  static toss(b: number = 2, a: number = 1): boolean {
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
}
