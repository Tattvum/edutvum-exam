import { Chars, List, Chain, Stack } from './common'

describe('common.ts', function () {

  it('Chars class works', () => {
    let chars = new Chars('Ramanujan 1729')
    expect(chars.next()).toBe('R')
    expect(chars.next()).toBe('a')
    for (var i = 0; i < 7; i++) chars.next()
    expect(chars.next()).toBe(' ')
    expect(chars.next()).toBe('1')
    chars.next()
    chars.next()
    expect(chars.next()).toBe('9')
    expect(chars.next()).toBe(null)
    expect(chars.next()).toBe(null)
  });

  function checkArrayEquality(arr: Array<number>, arr0: Array<number>) {
    expect(arr.length).toBe(arr0.length)
    expect(arr.toString()).toBe(arr0.toString())
    expect(arr[3]).toBe(arr0[3])
    let i = arr0.length - 1
    expect(arr[i]).toBe(arr0[i])
  }

  function tests(x: any, arr0: Array<number>) {
    if (x instanceof List) {
      expect(x.size()).toBe(5)
      checkArrayEquality(x.list(), arr0)
      if (x instanceof Chain) {
        x.push(13)
        checkArrayEquality(x.list(), arr0)
        expect(x.peek()).toBe(13)
        checkArrayEquality(x.list(), arr0)
        if (x instanceof Stack) {
          expect(x.pop()).toBe(13)
          checkArrayEquality(x.list(), arr0)
          expect(x.peek()).toBe(11)
        }
      }
    }
  }

  it('List class works', () => {
    let arr0 = [2, 3, 5, 7, 11]
    let list = new List(arr0)
    tests(list, arr0)
  });

  it('Chain class works', () => {
    let arr0 = [2, 3, 5, 7, 11]
    let chain = new Chain(arr0)
    tests(chain, arr0)
  });

  it('Stack class works', () => {
    let arr0 = [2, 3, 5, 7, 11]
    let stack = new Stack(arr0)
    tests(stack, arr0)
  });

});
