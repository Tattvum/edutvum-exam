import * as iupac from './iupac-new'

fdescribe('iupac-new.ts', function () {

  it('hash', () => {
    expect(iupac.hash([{id: 1}, {id: 2}], 2)).toBe('001002')
    expect(iupac.hash([{id: 2}, {id: 1}], 2)).toBe('001002')
    expect(() => iupac.hash([{id: 2}, {id: 1}, {id: 3}], 1)).toThrow()
    expect(() => iupac.hash([{id: 2}], 3)).toThrow()
  })

  it('class MultiMap', () => {
    class K {
      constructor(public id: number, public symbol: string) {
      }
    }
    let k1 = new K(1, "A")
    let k2 = new K(2, "B")
    let k3 = new K(3, "B")
    let mm = new iupac.MultiMap<K, string>(2)
    expect(mm.set([k1, k2], "k1k2")).toBe('001002')
    expect(mm.get([k1, k2])).toBe('k1k2')
    expect(mm.get([k2, k1])).toBe('k1k2')
    expect(mm.size()).toBe(1)
    expect(mm.set([k2, k1], "k2k1")).toBe('001002')
    expect(mm.get([k1, k2])).toBe('k2k1')
    expect(mm.size()).toBe(1)
    expect(mm.set([k2, k3], "k2k3")).toBe('002003')
    expect(mm.get([k2, k3])).toBe('k2k3')
    expect(mm.size()).toBe(2)
  })

})
