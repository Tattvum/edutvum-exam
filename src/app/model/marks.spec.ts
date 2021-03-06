import {
  Marker, OldMarker, GeneralMarker, JEEAdvMarker, JEEAdv2015Marker, JEEAdv2014Marker,
  NSEJSMarker, JEEMainMarker, NSEPMarker
} from './marks';

describe('Default Marker tests:', () => {
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

describe('General Marker tests:', () => {
  let marker = new GeneralMarker()
  it('naq works', () => {
    expect(marker.naq([3], [3]).value).toBe(3)
    expect(marker.naq([3], [6]).value).toBe(0)
    expect(marker.naq([6], [3]).value).toBe(3)
  })
})

describe('JEE Adv. Marker tests:', () => {
  let marker = new JEEAdvMarker()
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

describe('JEE Adv. 2015 Marker tests:', () => {
  let marker = new JEEAdv2015Marker()
  it('mcq works', () => {
    expect(marker.mcq([0], [0]).value).toBe(3)
    expect(marker.mcq([0], [2]).value).toBe(-1)
  })
  it('ncq works', () => {
    expect(marker.ncq([23.1], [23.1]).value).toBe(4)
    expect(marker.ncq([25], [23.1]).value).toBe(0)
  })
  //2015 alone did this!
  //https://qr.ae/pNK0Ax ("It was +4 -2 in multiple correct")
  //https://qr.ae/pNK0AD ("After seeing the paper 1 marking scheme (+4 and -2)
  // ... every one in the hall gave a scary smile to each other
  //...(having an obvious feeling that we're all f*****)..")
  it('maq works', () => {
    expect(marker.maq([1, 2], [2, 1]).value).toBe(4)
    expect(marker.maq([1, 2, 3], [2]).value).toBe(-2)
    expect(marker.maq([1, 2, 3], [2, 1]).value).toBe(-2)
    expect(marker.maq([1, 2, 3], [2, 5]).value).toBe(-2)
  })
})

describe('JEE Adv. 2014 Marker tests:', () => {
  let marker = new JEEAdv2014Marker()
  it('mcq works', () => {
    expect(marker.mcq([0], [0]).value).toBe(3)
    expect(marker.mcq([0], [2]).value).toBe(0)
  })
  it('ncq works', () => {
    expect(marker.ncq([23.1], [23.1]).value).toBe(3)
    expect(marker.ncq([25], [23.1]).value).toBe(0)
  })
  it('maq works', () => {
    expect(marker.maq([1, 2], [2, 1]).value).toBe(3)
    expect(marker.maq([1, 2, 3], [2]).value).toBe(0)
    expect(marker.maq([1, 2, 3], [2, 1]).value).toBe(0)
    expect(marker.maq([1, 2, 3], [2, 5]).value).toBe(0)
  })
})

describe('NSEJS & BITSAT Marker tests:', () => {
  let marker = new NSEJSMarker()
  it('mcq works', () => {
    expect(marker.mcq([0], [0]).value).toBe(3)
    expect(marker.mcq([0], [2]).value).toBe(-1)
  })
})

describe('JEE Main Marker tests:', () => {
  let marker = new JEEMainMarker()
  it('mcq works', () => {
    expect(marker.mcq([0], [0]).value).toBe(4)
    expect(marker.mcq([0], [2]).value).toBe(-1)
  })
})

describe('NSEP Marker tests:', () => {
  let marker = new NSEPMarker()
  it('maq works', () => {
    expect(marker.maq([1], [2]).value).toBe(0)
    expect(marker.maq([], [2]).value).toBe(0)
    expect(marker.maq([1], [2, 3]).value).toBe(0)
    expect(marker.maq([1, 1], [2]).value).toBe(0)
    expect(marker.maq([1, 2], [2, 2]).value).toBe(0)
    expect(marker.maq([1, 2], [2, 1]).value).toBe(6)
    expect(marker.maq([1, 2, 3], [2, 1]).value).toBe(0)
    expect(marker.maq([1, 2, 3], [2, 3]).value).toBe(0)
  })
})
