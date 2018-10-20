export interface UID {
  id: number
}

export function hash(key: UID[], COUNT: number = 1): string {
  if (key.length !== COUNT) throw new Error("UID hash error: invalid key size")
  let pad = n => ('000' + n).slice(-3)
  return key.sort((a, b) => a.id - b.id).map(x => pad(x.id)).reduce((cc, x) => cc + x)
}

export class MultiMap<K extends UID, V> {
  private data = {}
  public constructor(readonly COUNT: number) {
  }

  public get(key: K[]): V {
    let h = hash(key, this.COUNT)
    return this.data[h]
  }

  public set(key: K[], value: V): string {
    let h = hash(key, this.COUNT)
    this.data[h] = value
    return h
  }

  public size(): number {
    return Object.keys(this.data).length
  }
}

//-----------------------------------------------------------------------------

export class Atm implements UID {
  private static _count = 0;
  readonly id: number
  constructor(readonly symbol: string) {
    this.id = Atm._count++
  }
}

export class Mol {
  private _atoms: Atm[] = []
  private _bonds = new MultiMap<Atm, number>(2)

  public addAtom(symbol: string): Atm {
    let atm = new Atm(symbol)
    this._atoms.push(atm)
    return atm
  }

  public addBond(atm1: Atm, atm2: Atm, type = 1): string {
    return this._bonds.set([atm1, atm2], type)
  }
}
