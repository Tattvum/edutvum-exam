import { Marker, OldMarker, GeneralMarker, JEEMarker } from './marks';

fdescribe('Default Marker tests:', () => {
  let marker = new OldMarker()
  it('mcq-arq-tfq-ncq works', () => {
    expect(marker.mcq([1], [2]).value).toBe(0)
    expect(marker.tfq([1, 2], [2]).value).toBe(0)
    expect(marker.arq([1], [2, 1]).value).toBe(0)
    expect(marker.arq([], []).value).toBe(0)
    expect(marker.mcq([0], [2]).value).toBe(0)
    expect(marker.arq([0], [0]).value).toBe(1)
    expect(marker.ncq([23.5], [23.5]).value).toBe(1)
  })
  it('naq works', () => {
    expect(marker.naq([3], [6]).value).toBe(0)
    expect(marker.naq([3], [3]).value).toBe(1)
  })
  it('maq works', () => {
    expect(marker.maq([1], [2]).value).toBe(0)
    expect(marker.maq([], [2]).value).toBe(0)
    expect(marker.maq([1], [2, 3]).value).toBe(0)
    expect(marker.maq([1, 1], [2]).value).toBe(0)
    expect(marker.maq([1, 2], [2, 2]).value).toBe(0)
    expect(marker.maq([1, 2], [2, 1]).value).toBe(1)
    expect(marker.maq([1, 2, 3], [2, 1]).value).toBe(0)
    expect(marker.maq([1, 2, 3], [2, 3]).value).toBe(0)
  })
})

fdescribe('General Marker tests:', () => {
  let marker = new GeneralMarker()
  it('naq works', () => {
    expect(marker.naq([3], [3]).value).toBe(3)
    expect(marker.naq([3], [6]).value).toBe(0)
    expect(marker.naq([6], [3]).value).toBe(3)
  })
})

fdescribe('JEE Marker tests:', () => {
  let marker = new JEEMarker()
  it('mcq works', () => {
    expect(marker.mcq([0], [0]).value).toBe(3)
    expect(marker.mcq([0], [2]).value).toBe(-1)
  })
  it('ncq works', () => {
    expect(marker.ncq([23.1], [23.1]).value).toBe(3)
    expect(marker.ncq([25], [23.1]).value).toBe(0)
  })
  it('maq works', () => {
    expect(marker.maq([1, 2], [2, 1]).value).toBe(4)
    expect(marker.maq([1, 2, 3], [2]).value).toBe(1)
    expect(marker.maq([1, 2, 3], [2, 1]).value).toBe(2)
    expect(marker.maq([1, 2, 3], [2, 5]).value).toBe(-2)
  })
})
