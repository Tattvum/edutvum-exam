export class Chars {
  private LEN = 0
  private n = 0
  constructor(public src: string) {
    this.LEN = src.length
  }
  public next(): string {
    if (this.n >= this.LEN) return null
    let ch = this.src.charAt(this.n)
    this.n++
    return ch
  }
}

export class List<T> {
  constructor(protected arr: T[] = []) { }
  public size(): number {
    return this.arr.length
  }
  public list(): T[] {
    return this.arr.filter(() => true)//returns a copy
  }
  public toString(): string {
    return '[' + this.arr + ']'
  }
}

export class Chain<T> extends List<T> {
  protected current: T = null
  constructor(protected arr: T[] = []) {
    super(arr)
  }
  public push(t: T): Chain<T> {
    this.current = t
    this.arr.push(t)
    return this
  }
  public peek(): T {
    return this.arr[this.arr.length - 1]
  }
}

export class Stack<T> extends Chain<T> {
  constructor(protected arr: T[] = []) {
    super(arr)
  }
  public push(t: T): Stack<T> {
    return <Stack<T>>super.push(t)
  }
  public pop(): T {
    this.current = this.arr.pop()
    return this.current
  }
}
