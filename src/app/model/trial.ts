export abstract class Bingo {
  abstract get bang(): string
}

class BingoClass extends Bingo {
  get bang(): string {
    return ""
  }
}

console.log("bingo!")
