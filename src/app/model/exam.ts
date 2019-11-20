import { Question, EMPTY_QUESTION } from './question';
import { AbstractThing } from './abstract-thing';
import { Lib } from './lib';
import { MarkingSchemeType, Marker } from './marks';

export enum ExamStatus {
  PENDING, DONE
}

export class Exam extends AbstractThing {
  constructor(
    id: string,
    public title: string,
    public readonly questions: Question[],
    public readonly when: Date = new Date(),
    public notes = '',
    public explanation = '',
    public status = ExamStatus.DONE,
    public markingScheme = MarkingSchemeType.GENERAL,
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

  public get markingSchemeName(): string {
    return MarkingSchemeType[this.markingScheme]
  }

  public maxMarks(qid: number): number {
    let q = this.questions[qid]
    let sol = q.solutions
    return Marker.get(this.markingScheme).marks(q.type, sol, []).max
  }
  private _totalMarks: number;
  public get totalMarks(): number {
    if (this._totalMarks == undefined) {
      this._totalMarks = 0
      this.questions.forEach((_, qid) => {
        this._totalMarks += this.maxMarks(qid)
      })
    }
    return this._totalMarks
  }

  public isSolution(qid: number, n: number): boolean {
    return this.questions[qid].isSolution(n)
  }

  public isPending(): boolean {
    return this.status === ExamStatus.PENDING
  }
}

export const EMPTY_EXAM = new Exam('00', 'Bingo', [EMPTY_QUESTION])
