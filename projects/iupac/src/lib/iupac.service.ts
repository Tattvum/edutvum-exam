import { Injectable } from '@angular/core';

import { Chain, Stack } from './common'
import { Namer, SmilesKind, SmilesTokenizer } from './iupac-common'

class Carbon {
  readonly id: number
  readonly bonds: Carbon[] = []

  private fixedDeg: number = 0
  public fixedDegree(): number {
    return this.fixedDeg
  }
  public fixDegree(): number {
    return this.fixedDeg = this.bonds.length
  }

  constructor(_id: number) {
    this.id = _id
  }
  public bond(other: Carbon) {
    //console.log('bond: ' + this + ' - ' + other);
    other.bonds.push(this)
    this.bonds.push(other)
  }
  public equals(other: Carbon): boolean {
    return this.id === other.id
  }
  public _shrink1(): Carbon {
    if (this.bonds.length !== 1) return null
    //console.log('removing ' + this.id() + '-' + this.bonds[0].id())
    let bs = this.bonds[0].bonds
    bs.splice(bs.indexOf(this), 1)
    return this.bonds.splice(0, 1)[0]
  }
  public degree(): number {
    return this.bonds.length
  }
  public toString(): string {
    return '' + this.id
  }
}

//-----------------------------------------------------------------------------

class ChainGluer {
  private cache: { [key: string]: Carbon } = {}
  public note(key: string, c: Carbon): ChainGluer {
    if (key === null || key == undefined) return this
    console.log('CG: C' + key + ' = ' + c);
    let _c = this.cache[key]
    if (_c === undefined || _c === null) this.cache[key] = c
    else _c.bond(c)
    return this
  }
}

//-----------------------------------------------------------------------------

class SemiPath {
  public totalDegrees = 0
  private chain = new Chain<Carbon>()
  public alive = true
  constructor(c: Carbon) {
    this.chain.push(c)
  }
  public size(): number {
    return this.chain.size()
  }
  private sign(x: number): number {
    return (x > 0) ? 1 : (x === 0) ? 0 : -1
  }
  public compare(other: SemiPath): number {
    return this.sign(this.totalDegrees - other.totalDegrees)
  }
  public build(builder: (c: Carbon) => Carbon): boolean {
    if (!this.alive) return false
    let c = builder(this.chain.peek())
    if (c !== null) {
      this.chain.push(c)
      this.totalDegrees += c.fixedDegree()
      if (c.degree() > 1) this.alive = false
      return true
    }
    return false
  }
  public end(): Carbon {
    return this.chain.peek()
  }
  public iupac(): string {
    return Namer.numix(this.size() - 1)
  }
  public carbons(): Carbon[] {
    return this.chain.list()
  }
  public toString(): string {
    return '(' + this.totalDegrees + ') ' + this.chain
      + (this.alive ? '' : '*')
  }
}

//-----------------------------------------------------------------------------

type SideChains = { [id: number]: string[] }
type ChainLink = [number, string]
type IUPACInfo = [string, number[]]

class SemiPaths {
  private paths: SemiPath[] = []
  constructor(tips: Carbon[]) {
    tips.forEach(c => this.paths.push(new SemiPath(c)))
  }

  public reveal() {
    this.paths.forEach(path => console.log('' + path))
    console.log('--------')
  }

  public build() {
    //this.reveal()
    let todo = false
    this.paths.sort((a, b) => a.compare(b)).forEach(path => {
      //todo = todo || this.buildChain(chn)
      let t = path.build(c => c._shrink1())
      todo = todo || t
    })
    if (todo) this.build()
  }

  private addSideChain(sides: SideChains, id: number, name: string) {
    if (sides[id] === undefined) sides[id] = []
    sides[id].push(Namer.synonym(name))
    console.log(JSON.stringify(sides));
  }

  //-----------------------------------------------------------------------------

  private popChains(sides: SideChains, cid: number): string[] {
    let chains = sides[cid]
    sides[cid] = undefined
    if (chains === undefined) chains = []
    return chains
  }

  private linksPlain(sides: SideChains, cs: Carbon[]): ChainLink[] {
    let links: ChainLink[] = []
    cs.forEach((c, i) => {
      let chains = this.popChains(sides, c.id)
      chains.forEach(s => {
        if (s.search('[0-9]') >= 0) s = '(' + s + ')'
        links.push([i + 1, s])
      })
    })
    return links
  }

  private joinLinks(links: ChainLink[]): string[] {
    let names: string[] = []
    links.forEach(lnk => names.push(lnk[0] + '-' + lnk[1]))
    return names
  }

  private links(sides: SideChains, cs: Carbon[]): string[] {
    return this.joinLinks(this.linksPlain(sides, cs))
  }

  private makeName(names: string[], len: number, suffix: string): string {
    let name = Namer.normalize(names).join('-')
    name += Namer.numix(len) + suffix
    return name
  }

  private buildSideChain(sides: SideChains, cs: Carbon[], id: number) {
    //console.log('buildSideChain');
    let names = this.links(sides, cs)
    let name = this.makeName(names, cs.length, 'yl')
    this.addSideChain(sides, id, name)
  }

  private buildSideChains(sides: SideChains) {
    let nas = this.paths.filter(p => !p.alive)
    let snas = nas.sort((a, b) => a.compare(b))
    snas.forEach(p => {
      console.log('snas: ' + p);
      let cs = p.carbons().reverse().splice(1)
      this.buildSideChain(sides, cs, p.end().id)
    })
  }

  //-----------------------------------------------------------------------------

  private mainAlive(sides: SideChains): Carbon[] {
    //TBD : ASSUME exactly two paths in filter
    let alives = this.paths.filter(p => p.alive)
    console.log('alives: ' + alives);
    if (alives.length < 2) return null
    let a0 = alives[0].carbons()
    let a1 = alives[1].carbons()
    return a0.concat(a1.reverse().splice(1))
  }

  private locants(sides: SideChains, main: Carbon[]): number[] {
    let locs: number[] = []
    main.forEach((c, i) => {
      if (sides[c.id] !== undefined) locs.push(i + 1)
    })
    return locs
  }

  public checkReverseLocants(links: ChainLink[]) {
    links = links.sort((a, b) => Namer.compare(a[0], b[0]))
    //console.log('1- ' + links);
    let len = Math.floor(links.length / 2)
    for (let i = 0; i < len; i++) {
      let oend = links.length - i - 1
      if (links[i][1] > links[oend][1]) {
        let temp = links[i][0]
        links[i][0] = links[oend][0]
        links[oend][0] = temp
      }
    }
  }

  private mainChain(sides: SideChains, main: Carbon[]) {
    let locs = this.locants(sides, main)
    console.log('main. ' + main);
    let links: any = null
    let loccomp = Namer.compareLocants(locs, main.length + 1)
    if (loccomp > 0) main = main.reverse()
    else if (loccomp === 0) {
      console.log('TBD  iupac2:  loccomp === 0');
      links = this.linksPlain(sides, main)
      this.checkReverseLocants(links)
    }
    if (links === null) links = this.linksPlain(sides, main)
    return links
  }

  public iupac(): IUPACInfo {
    let sides: { [id: number]: string[] } = {}
    this.buildSideChains(sides)

    let main = this.mainAlive(sides)
    if (main === null) {
      console.log('CHAIN AHOY!');
      return ['CHAIN AHOY!', []]
    }
    let names = this.joinLinks(this.mainChain(sides, main))
    let mainIds: number[] = []
    main.forEach(c => mainIds.push(c.id))
    return [this.makeName(names, main.length, 'ane'), mainIds]
  }
}

//-----------------------------------------------------------------------------

class Molecule {
  private all: Carbon[] = []
  private reveal() {
    console.log('Carbons: [' + this.all.join(',') + ']')
    this.all.forEach(c => {
      console.log(c.id + ' - ' + c.bonds.length)
    })
    console.log(',,,,,,,,,,,')
  }
  private tips(): Carbon[] {
    return this.all.filter(c => c.bonds.length === 1)
  }
  private fixDegrees(): number {
    let total = 0
    this.all.forEach(c => total += c.fixDegree())
    return total
  }

  private past: Stack<Carbon> = new Stack<Carbon>()
  private cgluer: ChainGluer = new ChainGluer()

  private tokens: SmilesTokenizer
  private peer: Carbon = null

  private restart() {
    this.all = []
    this.all.push(new Carbon(null)) //dummy - to make it start from 1
    this.tokens = new SmilesTokenizer(this.smiles)
    this.peer = null
  }
  constructor(private smiles: string) {
    this.restart()
  }

  private open(): Molecule {
    this.past.push(this.peer)
    return this
  }
  private close(): Molecule {
    this.peer = this.past.pop()
    return this
  }
  private make(x: string): Molecule {
    let c = new Carbon(this.all.length)
    this.all.push(c)
    if (this.peer !== null) c.bond(this.peer)

    this.peer = c
    this.cgluer.note(x, this.peer)
    return this
  }

  private build() {
    let tok = this.tokens.next()
    //console.log('build2: {' + tok + '} ' + peer + ' ' + past)
    if (tok === null) return
    switch (tok.kind) {
      case SmilesKind.BOPEN: return this.open().build()
      case SmilesKind.BCLOSE: return this.close().build()
      case SmilesKind.CARBON: return this.make(tok.x).build()
      default: return this.build()
    }
  }

  public iupac(): IUPACInfo {
    this.restart()
    this.build()
    this.fixDegrees()
    this.reveal()
    //console.log('----iupac----')
    let paths = new SemiPaths(this.tips())
    paths.build()
    paths.reveal()
    return paths.iupac()
  }
}

//-----------------------------------------------------------------------------

function main(smiles: string): IUPACInfo {
  //console.clear()
  console.log(smiles)
  let m = new Molecule(smiles)
  return m.iupac()
}

@Injectable({
  providedIn: 'root'
})
export class IupacService {
  public iupac(smiles: string): string {
    return main(smiles)[0];
  }
}
