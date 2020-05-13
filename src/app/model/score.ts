import { Lib } from './lib';

export class Score {
  constructor(
    public total = 0,
    public skipped = 0,
    public omitted = 0,
    public sureCorrect = 0,
    public surePartial = 0,
    public sureWrong = 0,
    public guessCorrect = 0,
    public guessPartial = 0,
    public guessWrong = 0,
  ) { }
  get marks() { return (this.sure + this.guess) }
  get percent() { return (this.marks / this.total) * 100 }
  get guess() { return this.guessCorrect + this.guessPartial + this.guessWrong }
  get sure() { return this.sureCorrect + this.surePartial + this.sureWrong }
}

