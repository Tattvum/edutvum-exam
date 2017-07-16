export class Score {
  public readonly leftout: number
  constructor(
    public readonly total: number,
    public readonly correct: number,
    public readonly wrong: number
  ) {
    if ((correct + wrong) > total) throw Error("correct+wrong cannot be grater than total")
    this.leftout = total - correct - wrong
  }
  percent(): number {
    let pc = Math.round((this.correct / this.total) * 100)
    return pc
  }
}

