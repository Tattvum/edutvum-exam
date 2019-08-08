import { AnswerType } from './answer-type';
import { Exam, ExamStatus, EMPTY_EXAM } from './exam';
import { Question } from './question';
import { Lib } from '../model/lib';
import { CommentList, Comment } from './comment';
import { EMPTY_USER, User } from './user';
import { Score } from './score';
import { GeneralMarker, Marker, MarkingSchemeType } from './marks';

export class ExamResult extends Exam {
  private _secondsTotal = 0
  constructor(id: string, title: string, when: Date,
    readonly exam: Exam,
    readonly answers: number[][] = [],
    status: ExamStatus = ExamStatus.PENDING,
    public guessings: boolean[] = [],
    readonly durations: number[] = [],
    readonly commentLists: CommentList[] = [],
    readonly user: User = EMPTY_USER,
    public omissions: boolean[] = [],
  ) {
    super(id, title, exam.questions, when, '', '', status)
    this._secondsTotal = durations.filter(x => !Lib.isNil(x)).reduce((t, s) => t + s, 0)
    if (!Lib.isNil(answers)) {
      Lib.failif(answers.length > this.questions.length, 'Too many answers', answers.length, this.questions.length)
      let ctx = this.id + ' ' + this.exam.id
      answers.forEach((qans, i) => {
        if (!Lib.isNil(qans)) this.checkAnsInChoice(qans, this.questions[i], ctx)
      })
    }
  }

  private checkAnsInChoice(qans: any[], q: Question, ctx: string) {
    let chlen = q.choices.length
    ctx += '.' + q.id
    if (q.type !== AnswerType.NCQ && q.type !== AnswerType.NAQ) {
      qans.forEach((ans, j) => {
        let error = ctx + ', a[' + j + ']=' + ans + ', len:' + chlen
        Lib.failif(ans > chlen - 1 || ans < 0, 'Ans out-of-choice', ctx)
      })
    }
    this.checkAnsByType(q.type, qans.length, chlen, ctx)
  }

  private checkAnsByType(type: AnswerType, alen: number, chlen: number, ctx: string) {
    switch (type) {
      case AnswerType.TFQ:
        Lib.failif(alen > 1, 'TFQ cannot have more than one answer', ctx)
        break
      case AnswerType.MCQ:
        Lib.failif(alen > 1, 'MCQ cannot have more than one answer', ctx)
        break
      case AnswerType.ARQ:
        Lib.failif(alen > 1, 'ARQ cannot have more than one answer', ctx)
        break
      case AnswerType.NCQ:
        Lib.failif(alen > 1, 'NCQ cannot have more than one answer', ctx)
        break
      case AnswerType.MAQ:
        Lib.failif(alen > chlen, 'MAQ cannot have more answers than choices')
        break
      case AnswerType.NAQ:
        Lib.failif(alen > 1, 'NAQ cannot have more than one answer', ctx)
        break
    }
  }

  public isLocked(): boolean {
    return this.status === ExamStatus.DONE;
  }
  public lock() {
    // Repeated lock is ignored
    if (this.isLocked()) return
    this.status = ExamStatus.DONE
  }

  public durationTotal(): number {
    return this._secondsTotal
  }
  public duration(qid: number): number {
    let s = this.durations[qid]
    if (Lib.isNil(s)) s = 0
    return s
  }
  public durationInc(qid: number) {
    this._secondsTotal++
    this.durations[qid] = this.duration(qid) + 1
  }

  public isAttempted(qid: number): boolean {
    let qans = this.answers[qid]
    return qans && qans.length > 0
  }
  public clearAnswers(qid: number) {
    Lib.failif(this.isLocked(), 'Locked question cannot be cleared')
    this.answers[qid] = []
  }
  public setAnswer(qid: number, n: number) {
    Lib.failif(this.isLocked(), 'Locked question cannot set answer')
    let q = this.questions[qid]
    switch (q.type) {
      case AnswerType.TFQ:
      case AnswerType.MCQ:
      case AnswerType.ARQ:
        Lib.failif(n >= q.choices.length, 'Answer out-of-bounds', n, q.choices.length)
        // previous answers thrown away
        this.answers[qid] = [n]
        break;
      case AnswerType.MAQ:
        // console.log(this.isAnswer(qid, n))
        Lib.failif(n >= q.choices.length, 'Answer out-of-bounds', n, q.choices.length)
        Lib.failif(this.isAnswer(qid, n), 'Duplicate answer', qid, n, '' + this.answers[qid])
        if (!this.answers[qid]) this.answers[qid] = []
        this.answers[qid].push(n)
        break;
      case AnswerType.NCQ:
        this.answers[qid] = [n]
        break;
      case AnswerType.NAQ:
        this.answers[qid] = [n]
        break;
      default:
        Lib.failif(true, 'This should never execute!')
        break;
    }
  }
  public isAnswer(qid: number, n: number): boolean {
    let ans = this.answers[qid]
    return ans && ans.indexOf(n) > -1
  }
  public removeAnswer(qid: number, n: number): boolean {
    Lib.failif(this.isLocked(), 'Locked question cannot remove answer')
    if (!this.answers[qid]) this.answers[qid] = []
    let index = this.answers[qid].indexOf(n);
    let removed = index > -1
    if (removed) {
      this.answers[qid].splice(index, 1)
    }
    return removed
  }
  public isCorrect(qid: number): boolean {
    // no answers so not correct (also, solutions can never be empty)
    if (!this.isAttempted(qid)) return false
    // given answers are correct
    // CAUTION: donot use return inside forEach - does not return
    let sols = this.questions[qid].solutions
    for (let ans of this.answers[qid]) if (!sols.includes(ans)) return false
    // all answers are given
    for (let ans of sols) if (!this.answers[qid].includes(ans)) return false
    return true
  }

  public isPartial(qid: number): boolean {
    // no answers so not correct (also, solutions can never be empty)
    if (!this.isAttempted(qid)) return false
    if (this.exam.markingScheme === MarkingSchemeType.OLD) return false
    if (this.questions[qid].type !== AnswerType.NAQ) return false
    let total = this.questions[qid].solutions[0]
    let mark = this.answers[qid][0]
    return mark < total && mark > 0
  }

  public isOmitted(qid: number) {
    let curr = false
    if (this.omissions) curr = this.omissions[qid]
    return curr
  }

  public toggleOmission(qid: number) {
    this.omissions[qid] = !this.isOmitted(qid)
  }

  public setMarksAdminNAQ(qid: number, marks: number) {
    let q = this.questions[qid]
    let max = q.solutions[0]
    Lib.failif(marks > max, 'Marks cannot be more than max')
    this.answers[qid] = [marks]
  }

  public addComment(qid: number, c: Comment) {
    let cl = this.commentLists[qid]
    if (!cl) cl = this.commentLists[qid] = []
    cl.push(c)
  }

  public get score(): Score {
    let sc = new Score()
    let marker = Marker.get(this.exam.markingScheme)
    let total = 0
    this.questions.forEach((q, qid) => {
      let marks = marker.marks(q.type, this.questions[qid].solutions, this.answers[qid])
      if (!this.omissions[qid]) {
        sc.total += marks.max
        if (this.guessings[qid]) sc.guess += marks.value
        else sc.sure += marks.value
      } else {
        sc.omitted += marks.max
      }
    })
    return sc
  }

}

export const EMPTY_EXAM_RESULT = new ExamResult('00', 'Bingo', new Date(), EMPTY_EXAM)
