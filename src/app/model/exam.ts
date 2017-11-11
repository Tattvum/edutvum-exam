import { AnswerType } from './answer-type';
import { Question, EMPTY_QUESTION } from './question';
import { Score } from './score';
import { AbstractThing } from './abstract-thing';
import { Lib } from './lib';

export class Exam extends AbstractThing {
  constructor(
    id: string,
    public title: string,
    public readonly questions: Question[],
    public readonly when: Date = new Date(),
    public readonly notes = '',
    public explanation = ''
  ) {
    super(id, title, when)
    Lib.failif(Lib.isNil(questions), 'Exam questions cannot be undefined')
    Lib.failif(questions.length < 1, 'Exam questions should be atleaset one')
  }

  protected get qcount(): number {
    return this.questions.length
  }
  public nextq(qidn: number): number {
    if (Lib.isNil(qidn) || qidn < 0 || qidn > this.qcount - 1) return 0
    if (qidn === this.qcount - 1) return null
    return qidn + 1
  }
  public prevq(qidn: number): number {
    if (Lib.isNil(qidn) || qidn < 0 || qidn > this.qcount - 1) return this.qcount - 1
    if (qidn === 0) return null
    return qidn - 1
  }

  public isSolution(qid: number, n: number): boolean {
    return this.questions[qid].isSolution(n)
  }
}

export const EMPTY_EXAM = new Exam('00', 'Bingo', [EMPTY_QUESTION])
