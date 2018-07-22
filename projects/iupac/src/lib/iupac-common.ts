let units = [
  '^',
  'meth',
  'eth',
  'prop',
  'but',
  'pent',
  'hex',
  'hept',
  'oct',
  'non',
]

let prefix = [
  '',
  'hen',
  'do',
  'tri',
  'tetra',
  'penta',
  'hexa',
  'hepta',
  'octa',
  'nona',
]

let retained = {
  '1-methylethyl': 'isopropyl',
  '2-methylpropyl': 'isobutyl',
  '3-methylbutyl': 'isopentyl',
  '4-methylpentyl': 'isohexyl',
  '1-methylpropyl': 'sec-butyl',
  '1,1-dimethylethyl': 'tert-butyl',
  '1,1-dimethylpropyl': 'tert-pentyl',
  '2,2-dimethylpropyl': 'neopentyl',
}

let noname = [
  '',
  '',
  'di',
  'tri',
  'tetra',
  'penta',
  'hexa',
  'hepta',
  'octa',
  'nona',
  'deca',
]

let noname2 = [
  '',
  '',
  'bis',
  'tris',
  'tetrakis',
  'pentakis',
  'hexakis',
  'heptakis',
  'octakis',
  'nonakis',
  'decakis',
]

//-----------------------------------------------------------------------------

export enum SmilesKind {
  CARBON = 2,
  BOPEN = 3, BCLOSE = 5,
  UNKNOWN = 7
}

export class SmilesToken {
  constructor(public kind: SmilesKind, public ch: string, public x: string = null) { }
  load(kind: SmilesKind, ch: string, x: string = null): SmilesToken {
    this.kind = kind
    this.ch = ch
    this.x = x
    return this
  }
  private kindString(): string {
    switch (this.kind) {
      case SmilesKind.CARBON: return 'CORBON'
      case SmilesKind.BOPEN: return '('
      case SmilesKind.BCLOSE: return ')'
      default: return ' '
    }
  }
  toString(): string {
    return '"' + this.ch + '" : ' + this.kindString() + (this.x !== null ? ' (' + this.x + ')' : '')
  }
}

export class SmilesTokenizer {
  private LEN = 0
  private token: SmilesToken = new SmilesToken(SmilesKind.UNKNOWN, null)
  private n = 0
  constructor(public smiles: string) {
    this.LEN = smiles.length
  }
  private peek(): string {
    if (this.n >= this.LEN) return null
    return this.smiles.charAt(this.n)
  }
  private pop(): string {
    if (this.n >= this.LEN) return null
    let ch = this.smiles.charAt(this.n)
    this.n++
    return ch
  }
  private popLoad(kind: SmilesKind, ch: string, x?: string): SmilesToken {
    this.pop()
    return this.token.load(kind, ch, x)
  }
  public next(): SmilesToken {
    let ch = this.pop()
    if (ch === null) return null
    switch (ch) {
      case '(': return this.token.load(SmilesKind.BOPEN, ch)
      case ')': return this.token.load(SmilesKind.BCLOSE, ch)
      case 'C':
        let ch1 = this.peek()
        let match = /[1-9]/.test(ch1)
        if (match) return this.popLoad(SmilesKind.CARBON, 'C' + ch1, ch1)
        else return this.token.load(SmilesKind.CARBON, 'C')
      default: return this.token.load(SmilesKind.UNKNOWN, ch)
    }
  }
}

export class Namer {
  public static synonym(name: string): string {
    let syn = retained[name]
    if (syn === undefined) return name
    //console.log('synonym: ' + name + ' -> ' + syn)
    return syn
  }

  public static numix(n: number): string {
    let selfn = Namer.numix
    if (n <= 0) return ''

    let oo = n % 10
    if (n < 10) return units[oo]
    if (n === 10) return 'dec'
    if (n === 11) return 'undec'
    if (n < 20) return prefix[oo] + 'dec'
    if (n === 20) return 'icos'
    if (n === 21) return 'henicos'
    if (n < 30) return prefix[oo] + 'cos'

    let t = Math.floor(n / 10)
    if (n < 100) return prefix[oo] + prefix[t] + 'cont'
    if (n === 100) return 'hect'

    let tt = n % 100
    if (n < 200) return selfn(tt) + 'a' + 'hect'
    if (n === 200) return 'dict'
    if (n < 300) return selfn(tt) + 'a' + 'dict'

    let h = Math.floor(t / 10)
    if (n < 1000 && tt == 0) return prefix[h] + 'ct'
    if (n < 1000) return selfn(tt) + 'a' + prefix[h] + 'ct'
    if (n === 1000) return 'kili'

    let hh = n % 1000
    if (n < 2000) return selfn(hh) + 'a' + 'kili'
    if (n === 2000) return 'dili'
    if (n < 3000) return selfn(hh) + 'a' + 'dili'

    let th = Math.floor(h / 10)
    if (n < 10000) return selfn(hh) + 'a' + prefix[th] + 'li'
    return '' + n
  }

  private static subCore(s: string): string {
    if (s === '' || s === undefined || s === null) return ''
    return s.substr(s.indexOf('-') + 1)
  }
  private static subCorePrefix(s: string): string {
    if (s === '' || s === undefined || s === null) return ''
    return s.substring(s.indexOf('-'), 0)
  }
  //a>b is 1, a=b is 0, a<b is -1
  public static compare(a, b): number {
    return (a > b) ? 1 : (a === b) ? 0 : -1
  }
  private static coreCompare(a, b): number {
    //console.log('comp 1: ', a, b)
    //second subcore call is to catch sec- and tert-
    let aa = Namer.subCore(Namer.subCore(a))
    let bb = Namer.subCore(Namer.subCore(b))
    //console.log('comp 2: ', aa, bb)
    return Namer.compare(aa, bb)
  }
  private static coreEquals(a, b): boolean {
    return this.coreCompare(a, b) === 0
  }

  private static unify(sames: string[]): string {
    if (sames === null || sames.length < 1) return ''
    if (sames.length === 1) return sames[0]
    let numul = noname[sames.length]
    if (sames[0].indexOf('(') >= 0) numul = noname2[sames.length]
    let base = this.subCore(sames[0])
    let locants = []
    sames.forEach(s => locants.push(this.subCorePrefix(s)))
    let locant = locants.join(',')
    //console.log('prefix: ' + prefix + ' suffix: ' + suffix + ' locant: ' + locant);
    return locant + '-' + numul + base
  }

  public static sort(subs: string[]): string[] {
    let check = Namer.coreCompare
    return subs.sort((a, b) => check(a, b))
  }

  public static normalize(subs: string[]): string[] {
    subs = Namer.sort(subs)
    //console.log('[' + subs + ']');
    let newSubs = []
    let sames = []
    let prev = null
    subs.forEach(s => {
      let eq = this.coreEquals(s, prev)
      if ((sames.length > 0) && !eq) {
        newSubs.push(this.unify(sames))
        sames = []
      }
      prev = s
      sames.push(s)
    })
    newSubs.push(this.unify(sames))
    console.log('norm: ' + subs)
    return newSubs
  }

  public static compareLocants(locs: number[], n: number): number {
    console.log('FPOD: ' + locs + ' -- (' + n + ')');
    let comp = 0
    let len = locs.length - 1
    locs.forEach((l, i) => {
      let ll = n - locs[len - i]
      let newComp = this.compare(l, ll)
      console.log("cL: " + l + ' .. ' + ll);
      //console.log(":::: " + comp + ' -- ' + newComp);
      if (comp === 0) console.log('*')
      if (comp === 0) comp = newComp
    })
    console.log('-- cL: ' + ' ------- ' + comp);
    return comp
  }

}
