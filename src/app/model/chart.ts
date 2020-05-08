import { ExamResult } from './exam-result';
import { AbstractThing } from './abstract-thing';

export class Chart extends AbstractThing {
  constructor(
    id: string,
    public title: string,
    public readonly when: Date = new Date(),
    public results: ExamResult[]
  ) {
    super(id, title, when)
  }
}
