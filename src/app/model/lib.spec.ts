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
    expect(() => Lib.failifold(false, 'BINGO')).not.toThrow()
    console.log = jasmine.createSpy('log').and.stub();
    expect(() => Lib.failifold(true, 'BINGO')).toThrow()
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

describe('array indexOf test', () => {
  let arr = [
    { id: 'nsejs1', title: 'NSEJS exam 2011' },
    { id: 'ncert1', title: 'NCERT exam 2011' },
    { id: 'nsejs2', title: 'class 10 NSEJS exam 2012' },
  ]
  let check = query => arr.filter(o => o.title.toUpperCase().indexOf(query.toUpperCase()) !== -1)
  it('all', () => {
    expect(check('nsej').length).toBe(2)
    expect(check('nce').length).toBe(1)
    expect(check('prmo').length).toBe(0)
  })
})

describe('repeat test', () => {
  it('basic', () => {
    expect(Lib.repeat('a', 4)).toBe('aaaa')
    expect(Lib.repeat('abc', 4)).toBe('abca')
    expect(Lib.repeat('abcde', 4)).toBe('abcd')
    expect(() => Lib.repeat('', 4)).toThrow()
    expect(() => Lib.repeat('a', 0)).toThrow()
  })
})

describe('n2s test', () => {
  it('basic', () => {
    expect(Lib.n2s(3)).toBe('03')
    expect(Lib.n2s(3, 3)).toBe('003')
    expect(Lib.n2s(12)).toBe('12')
    expect(Lib.n2s(12, 3)).toBe('012')
    expect(Lib.n2s(0)).toBe('00')
    expect(Lib.n2s(123)).toBe('123')
  })
})

describe('numNext test', () => {
  it('basic', () => {
    expect(() => Lib.numNext('ab')).toThrow()
    expect(Lib.numNext('0')).toBe('1')
    expect(Lib.numNext('123')).toBe('124')
    expect(Lib.numNext('003')).toBe('004')
  })
})

describe('numBetween test', () => {
  it('basic', () => {
    expect(Lib.numBetween('', '')).toBe('4')
    expect(Lib.numBetween('01', '10')).toBe('05')
    expect(Lib.numBetween('04', '05')).toBe('045')
    expect(Lib.numBetween('12', '13')).toBe('125')
    expect(Lib.numBetween('012', Lib.numNext('012'))).toBe('0125')
    expect(Lib.numBetween('1', '23')).toBe('16')
  })
})
