import { Score } from './score';

let checkScore = (s: Score, t: number, c: number, w: number, l: number, p: number) => {
  expect(s.total).toBe(t)
  expect(s.correct).toBe(c)
  expect(s.wrong).toBe(w)
  expect(s.leftout).toBe(l)
  expect(s.percent()).toBe(p)
}

let createCheckScore = (t: number, c: number, w: number, l: number, p: number) => {
  let s = new Score(t, c, w)
  checkScore(s, t, c, w, l, p)
}

describe('Score:', () => {
  it('create works', () => {
    expect(() => new Score(100, 61, 30)).not.toThrow()
    expect(() => new Score(100, 91, 30)).toThrow()
    expect(() => new Score(100, 61, 140)).toThrow()
  })
  it('percent works', () => {
    createCheckScore(100, 61, 30, 9, 61)
    createCheckScore(10, 1, 1, 8, 10)
    createCheckScore(10, 1, 2, 7, 10)
    createCheckScore(10, 3, 2, 5, 30)
    createCheckScore(3, 1, 2, 0, 33)
    createCheckScore(23, 5, 2, 16, 22)
  })
})
