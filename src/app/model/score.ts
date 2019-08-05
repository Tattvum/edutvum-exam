import { Lib } from './lib';

export class Score {
  constructor(
    public sure = 0,
    public guess = 0,
    public total = 0,
    public skipped = 0,
    public omitted = 0,
  ) { }
  get marks() { return (this.sure + this.guess) }
  get percent() { return (this.marks / this.total) * 100 }
}

