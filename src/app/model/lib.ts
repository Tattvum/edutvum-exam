// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
export enum KEY {
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
}

export interface Selection {
  id: string
  title: string
}

//E404 - '@types/mudder@latest' is not in the npm registry.
const mudder = require('mudder');
const mudnum = new mudder.SymbolTable('0123456789')
const mudhex = new mudder.SymbolTable('0123456789abcdefg')

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
    let sign = t < 0 ? "- " : ""
    let abst = Math.abs(t)
    let pad2 = x => ('0' + x).slice(-2)
    let h = Math.trunc(abst / 3600)
    let hr = abst % 3600
    let m = Math.trunc(hr / 60)
    let mr = abst % 60
    let s = mr
    if (h === 0) return sign + m + ':' + pad2(s)
    else return sign + h + ':' + pad2(m) + ':' + pad2(s)
  }

  // TBD: NOTE: bad name, same as failif.
  static failifold(condition: boolean, message: string, ...things) {
    if (condition) {
      console.log('Assertion failed: ', message, ...things)
      throw new Error('Assertion ERROR: ' + message)
    }
  }
  static failif(condition: boolean, message: string, ...things) {
    if (condition) throw new Error('Assertion ERROR: ' + message + ': ' + things.join(', '))
  }

  static assert(condition: boolean, message: string, ...things) {
    if (!condition) throw new Error('Assertion ERROR: ' + message + ': ' + things.join(', '))
  }

  static warn(condition: boolean, message: string, ...things) {
    if (condition) throw console.log('Assertion WARNING: ' + message + ': ' + things.join(', '))
  }

  static isNil(obj): boolean {
    // tslint:disable-next-line:triple-equals
    return obj == undefined
  }

  static isNum(obj: any): boolean {
    return typeof (obj) === "number"
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
  static isPlainKey(ev: KeyboardEvent, k: KEY): boolean {
    return ev.key === k && ev.metaKey === false
      && ev.altKey === false && ev.shiftKey === false && ev.ctrlKey === false
  }

  static isCtrlKey(ev: KeyboardEvent, k: KEY): boolean {
    return ev.key === k && ev.metaKey === false
      && ev.altKey === false && ev.shiftKey === false && ev.ctrlKey === true
  }

  public static range(len: number): number[] {
    let arr = []
    for (let i = 0; i < len; i++) arr.push(i)
    return arr
  }

  public static repeat(str: string, size: number): string {
    Lib.assert(str != null && str !== "", "The input repeat string cannot be null or empty.")
    Lib.assert(size > 0, "The repeat size cannot be zero or negative.")
    let n = size / str.length
    let out = ""
    for (let i = 0; i < n; i++) out += str
    return out.slice(0, size)
  }

  public static n2s(n: number, size: number = 2): string {
    Lib.assert(n >= 0, "n2s: The n cannot be negative.")
    Lib.assert(size > 0, "n2s: The size cannot be zero or negative.")
    let ns = "" + n
    if (ns.length >= size) return ns
    ns = Lib.repeat("0", size) + ns
    return ns.slice(-size);
  }

  public static numNext(ns: string): string {
    let n = parseInt(ns)//Can Throw error!
    return Lib.n2s(n + 1, ns.length)
  }

  public static numBetween(as: string, bs: string, n: number = 1) {
    return mudnum.mudder(as, bs, n)[0]
  }

  public static newqid(names: string[], qidn: number): string {
    Lib.assert(qidn >= -1, "newqid: qidn should be -1, 0 or positive", qidn)
    Lib.assert(qidn < names.length, "newqid: qidn should be inside names", qidn, names.length)

    const isEnd = qidn < 0 || qidn === names.length - 1

    const split = (name: string) => {
      const re = /(.*)q([0-9]+)/
      const rer = re.exec(name)
      Lib.assert(rer.length === 3, "newqid: A name should of the form /(.*)q([0-9]+)/", name, rer)
      return { prefix: rer[1], num: rer[2] }
    }

    if (isEnd) {
      const ss = split(names[names.length - 1])
      return ss.prefix + 'q' + Lib.numNext(ss.num)
    } else {
      const sst = split(names[qidn])
      const ssn = split(names[qidn + 1])
      const prefix = sst.prefix.length < ssn.prefix.length ? sst.prefix : ssn.prefix
      return prefix + 'q' + Lib.numBetween(sst.num, ssn.num)
    }
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

  public static dtstrISO(dt?: Date): string {
    if (dt == null) dt = new Date()
    return dt.toISOString().replace(/-/g, '').replace(/:/g, '').replace(/\..+/, '')
  }

  //----------------------------------------------------------------------------
  //enum MyTypes { Alpha, Bravo, Charlie, Delta }
  //Lib.enumLen(MyTypes)

  public static enumLen(enumObj: Object): number {
    return Object.values(enumObj).filter(k => typeof k !== 'number').length
  }

  public static enumNames(enumObj: Object): string[] {
    const sz = this.enumLen(enumObj)
    return Object.keys(enumObj).slice(-sz)
  }

  public static enumValues<E>(enumObj: Object): E[] {
    const sz = this.enumLen(enumObj)
    return Object.values(enumObj).slice(-sz)
  }

  public static enumK2V(enumObj: Object, key: string): string {
    return '' + enumObj[key]
  }

  //----------------------------------------------------------------------------

  public static addArrays(d: any[], s: any[]): any[] {
    return d.map((v, i, arr) => Lib.isNum(v) ? arr[i] += s[i] : arr[i])
  }

}
