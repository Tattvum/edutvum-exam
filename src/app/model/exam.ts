import { AnswerType } from './answer-type';
import { Question, EMPTY_QUESTION } from './question';
import { Score } from './score';
import { AbstractThing } from './abstract-thing';

export class Exam extends AbstractThing {
  constructor(
    id: string,
    title: string,
    public readonly questions: Question[],
    when: Date = new Date()
  ) {
    super(id, title, when)
    if (questions == undefined) throw Error("Exam questions cannot be undefined")
    if (questions.length < 1) throw Error("Exam questions should be atleaset one")
  }

  protected get qcount(): number {
    return this.questions.length
  }
  public nextq(qidn: number): number {
    if (qidn == undefined || qidn < 0) return 0
    if (qidn >= this.qcount - 1) return null
    return qidn + 1
  }

}

export const EMPTY_EXAM = new Exam('00', 'Bingo', [EMPTY_QUESTION])
