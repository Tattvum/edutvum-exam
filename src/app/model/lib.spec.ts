import { Lib, KEY } from './lib';

describe('Lib tests:', () => {
  it('times works', () => {
    expect(Lib.times(10).reduce((xx, x) => xx + x)).toBe(45)
    expect(Lib.times(101).reduce((xx, x) => xx + x)).toBe(5050)
  })
  it('rnd toss trial works', () => {
    expect(Lib.rndTrial(() => Lib.toss() ? 1 : 0)).toBeCloseTo(0.50)
    expect(Lib.rndTrial(() => Lib.toss(4) ? 1 : 0)).toBeCloseTo(0.25)
    expect(Lib.rndTrial(() => Lib.toss(4, 2) ? 1 : 0)).toBeCloseTo(0.50)
    expect(Lib.rndTrial(() => Lib.toss(3, 2) ? 1 : 0)).toBeCloseTo(0.67, .01)
  })
  it('timize works', () => {
    expect(Lib.timize(0)).toBe('0:00')
    expect(Lib.timize(1)).toBe('0:01')
    expect(Lib.timize(59)).toBe('0:59')
    expect(Lib.timize(60)).toBe('1:00')
    expect(Lib.timize(61)).toBe('1:01')
    expect(Lib.timize(72)).toBe('1:12')
    expect(Lib.timize(119)).toBe('1:59')
    expect(Lib.timize(120)).toBe('2:00')
    expect(Lib.timize(125)).toBe('2:05')
    expect(Lib.timize(3599)).toBe('59:59')
    expect(Lib.timize(3600)).toBe('1:00:00')
    expect(Lib.timize(3601)).toBe('1:00:01')
    expect(Lib.timize(3672)).toBe('1:01:12')
    expect(Lib.timize(5000)).toBe('1:23:20')
  })
  it('assert works', () => {
    expect(() => Lib.assert(false, 'BINGO')).not.toThrow()
    console.log = jasmine.createSpy('log').and.stub();
    expect(() => Lib.assert(true, 'BINGO')).toThrow()
    expect(console.log).toHaveBeenCalledTimes(1);
  })
  it('failif works', () => {
    expect(() => Lib.failif(false, 'BINGO')).not.toThrow()
    expect(() => Lib.failif(true, 'BINGO')).toThrow()
  })
  it('isNil works', () => {
    expect(Lib.isNil(0)).toBeFalsy()
    let num = 0
    expect(Lib.isNil(num)).toBeFalsy()
    let obj = {}
    expect(Lib.isNil(obj)).toBeFalsy()
    let arr = []
    expect(Lib.isNil(arr)).toBeFalsy()
    let str = ''
    expect(Lib.isNil(str)).toBeFalsy()
    let fun = () => void
      expect(Lib.isNil(fun)).toBeFalsy()
    expect(Lib.isNil(null)).toBeTruthy()
    expect(Lib.isNil(undefined)).toBeTruthy()
  })
})
