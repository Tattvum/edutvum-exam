import { ExamResult } from './exam-result';
import { AbstractThing } from './abstract-thing';

export interface QType {
  right: number
  wrong: number
  partial?: number
}

export class Marking extends AbstractThing {
  constructor(
    id: string,
    public title: string,
    public readonly when: Date = new Date(),
    public types: { [id: string]: QType }
  ) {
    super(id, title, when)
  }
}
