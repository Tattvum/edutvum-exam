import { Namer } from './iupac-common'

describe('iupac-common.ts', function () {

  it('Namer.compare works', () => {
    expect(Namer.compare(1, 1)).toBe(0)
    expect(Namer.compare(1, 2)).toBe(-1)
    expect(Namer.compare(2, 1)).toBe(1)
    expect(Namer.compare(67, 45)).toBe(1)
    expect(Namer.compare(67, 145)).toBe(-1)
    expect(Namer.compare(0, 0)).toBe(0)
  })

  it('Namer.sort works', () => {
    expect(Namer.sort(['1-a', '1-b']).toString())
      .toBe('1-a,1-b')
    expect(Namer.sort(['13-aa', '5-bb-bb']).toString())
      .toBe('13-aa,5-bb-bb')
    expect(Namer.sort(['1-b', '1-a']).toString())
      .toBe('1-a,1-b')
    expect(Namer.sort(['3-c', '31-a', '1-bx']).toString())
      .toBe('31-a,1-bx,3-c')
    expect(Namer.sort(['3-c', '31-a', '1-a']).toString())
      .toBe('31-a,1-a,3-c')
  })


  it('Namer.synonym works', () => {
    expect(Namer.synonym('junk').toString())
      .toBe('junk')

    expect(Namer.synonym('1-methylethyl').toString())
      .toBe('isopropyl')
    expect(Namer.synonym('2-methylpropyl').toString())
      .toBe('isobutyl')
    expect(Namer.synonym('3-methylbutyl').toString())
      .toBe('isopentyl')
    expect(Namer.synonym('4-methylpentyl').toString())
      .toBe('isohexyl')
    expect(Namer.synonym('5-methylhexyl').toString())
      .toBe('5-methylhexyl')

    expect(Namer.synonym('1-methylpropyl').toString())
      .toBe('sec-butyl')
    expect(Namer.synonym('1-methylbutyl').toString())
      .toBe('1-methylbutyl')

    expect(Namer.synonym('1,1-dimethylethyl').toString())
      .toBe('tert-butyl')
    expect(Namer.synonym('1,1-dimethylpropyl').toString())
      .toBe('tert-pentyl')
    expect(Namer.synonym('1,1-dimethylbutyl').toString())
      .toBe('1,1-dimethylbutyl')

    expect(Namer.synonym('2,2-dimethylpropyl').toString())
      .toBe('neopentyl')
  })


  //TODO
  it('Namer.compareLocants works', () => {
    //expect(Namer.compareLocants([2, 3], 5)).toBe(0)
  })


  it('Namer.numix works', () => {
    expect(Namer.numix(1)).toBe('meth')
    expect(Namer.numix(2)).toBe('eth')
    expect(Namer.numix(3)).toBe('prop')
    expect(Namer.numix(4)).toBe('but')
    expect(Namer.numix(5)).toBe('pent')
    expect(Namer.numix(6)).toBe('hex')
    expect(Namer.numix(7)).toBe('hept')
    expect(Namer.numix(8)).toBe('oct')
    expect(Namer.numix(9)).toBe('non')
    expect(Namer.numix(10)).toBe('dec')
    expect(Namer.numix(11)).toBe('undec')
    expect(Namer.numix(12)).toBe('dodec')
    expect(Namer.numix(13)).toBe('tridec')
    expect(Namer.numix(14)).toBe('tetradec')
    expect(Namer.numix(15)).toBe('pentadec')
    expect(Namer.numix(16)).toBe('hexadec')
    expect(Namer.numix(17)).toBe('heptadec')
    expect(Namer.numix(18)).toBe('octadec')
    expect(Namer.numix(19)).toBe('nonadec')
    expect(Namer.numix(20)).toBe('icos')
    expect(Namer.numix(21)).toBe('henicos')
    expect(Namer.numix(22)).toBe('docos')
    expect(Namer.numix(23)).toBe('tricos')

    expect(Namer.numix(30)).toBe('tricont')
    expect(Namer.numix(31)).toBe('hentricont')
    expect(Namer.numix(32)).toBe('dotricont')
    expect(Namer.numix(36)).toBe('hexatricont')

    expect(Namer.numix(40)).toBe('tetracont')
    expect(Namer.numix(41)).toBe('hentetracont')
    expect(Namer.numix(42)).toBe('dotetracont')
    expect(Namer.numix(45)).toBe('pentatetracont')

    expect(Namer.numix(90)).toBe('nonacont')
    expect(Namer.numix(91)).toBe('hennonacont')
    expect(Namer.numix(92)).toBe('dononacont')
    expect(Namer.numix(94)).toBe('tetranonacont')

    expect(Namer.numix(100)).toBe('hect')
    expect(Namer.numix(101)).toBe('methahect')
    expect(Namer.numix(130)).toBe('tricontahect')
    expect(Namer.numix(145)).toBe('pentatetracontahect')

    expect(Namer.numix(200)).toBe('dict')
    expect(Namer.numix(245)).toBe('pentatetracontadict')
    expect(Namer.numix(300)).toBe('trict')
    expect(Namer.numix(345)).toBe('pentatetracontatrict')
    expect(Namer.numix(400)).toBe('tetract')
    expect(Namer.numix(421)).toBe('henicosatetract')

    expect(Namer.numix(1000)).toBe('kili')
    expect(Namer.numix(1001)).toBe('methakili')
    expect(Namer.numix(1100)).toBe('hectakili')
    expect(Namer.numix(1110)).toBe('decahectakili')
    expect(Namer.numix(1111)).toBe('undecahectakili')

    expect(Namer.numix(1421)).toBe('henicosatetractakili')
  })

})
