import { AnswerType, ANSWER_TYPE_NAMES } from './answer-type';
import { Exam, ExamStatus, EMPTY_EXAM } from './exam';
import { Question } from './question';
import { Lib } from '../model/lib';
import { CommentList, Comment } from './comment';
import { EMPTY_USER, User } from './user';
import { Score } from './score';
import { Marker, Marks } from './marks';
import { NO_TAG, TYPE_TAG } from './tag';

export class ExamResult extends Exam {
  private _secondsTotal = 0
  constructor(id: string, title: string, when: Date,
    readonly exam: Exam,
    readonly isPracticeMode: boolean = false,
    readonly answers: number[][] = [],
    status: ExamStatus = ExamStatus.PENDING,
    public guessings: boolean[] = [],
    readonly durations: number[] = [],
    readonly commentLists: CommentList[] = [],
    readonly user: User = EMPTY_USER,
    public omissions: boolean[] = [],
    public readonly snapshotIds: string[] = [],
    public snapshot: boolean = false,
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
    let mks = this.marks(qid)
    return mks.value < mks.max && mks.value > 0
    //This takes of negative marks too, as anything below zero is minimum
  }

  public isOmitted(qid: number): boolean {
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

  public marks(qid: number): Marks {
    let q = this.questions[qid]
    let sol = q.solutions
    let ans = this.answers[qid]
    return Marker.get(this.exam.markingScheme).marks(q.type, sol, ans)
  }

  public get score(): Score {
    let sc = new Score()
    let total = 0
    this.questions.forEach((q, qid) => {
      let marks = this.marks(qid)
      if (!this.omissions[qid]) {
        sc.total += marks.max
        if (this.isAttempted(qid)) {
          if (this.guessings[qid]) {
            if (this.isPartial(qid)) sc.guessPartial += marks.value
            else if (this.isCorrect(qid)) sc.guessCorrect += marks.value
            else sc.guessWrong += marks.value
          } else {
            if (this.isPartial(qid)) sc.surePartial += marks.value
            else if (this.isCorrect(qid)) sc.sureCorrect += marks.value
            else sc.sureWrong += marks.value
          }
        } else {
          sc.skipped += marks.max
          marks.value = 0 // NOTE: would be null otherwise
        }
      } else {
        sc.omitted += marks.max
      }
    })
    return sc
  }

  public static clone(r: ExamResult, rid: string): ExamResult {
    return new ExamResult(
      rid, r.title, r.when, r.exam, r.isPracticeMode,
      [...r.answers], r.status, [...r.guessings], [...r.durations],
      [...r.commentLists], r.user, [...r.omissions])
  }

  //----------------------------------------------------------------------------
  // Temporary browser session storage
  //----------------------------------------------------------------------------

  private states = {}

  get review(): boolean { return this.states['review'] ?? true }
  set review(val: boolean) { this.states['review'] = val }

  get tab(): number { return this.states['tab'] ?? 0 }
  set tab(val: number) { this.states['tab'] = val }

  get selection(): string { return this.states['selection'] ?? "JUNK : u7JqNwfU3W" }
  set selection(val: string) { this.states['selection'] = val }

  public isMarked(qidn: number): boolean {
    let prefix = this.selection
    let q = this.questions[qidn]
    const parts = prefix.split("/").map(p => p.trim())
    if (prefix.startsWith(NO_TAG)) {
      return q.tags.length === 0
    } else if (prefix.startsWith(TYPE_TAG)) {
      if (parts.length === 2) return ANSWER_TYPE_NAMES[q.type] === parts[1]
      return true// select all!
    } else {
      return q.tags.map(t => t.title.replace(":", "/")).filter(t => t.startsWith(prefix)).length > 0
    }
  }

  //Since we now have Topic and .Type level by default!
  get level(): number { return this.states['level'] ?? 2 }
  set level(val: number) { this.states['level'] = val }

  getReveal(qidn: number): boolean {
    if (!this.review) return true
    const reveal = this.states['reveal']
    if (!reveal) return false
    return reveal['' + qidn] ?? false
  }
  setReveal(qidn: number, val: boolean) {
    let reveal = this.states['reveal']
    if (!reveal) reveal = this.states['reveal'] = {}
    reveal['' + qidn] = val
    console.log(this.states)
  }

  //----------------------------------------------------------------------------

  get isFuture(): boolean {
    return this.exam.isPending()
  }
  get isPresent(): boolean {
    return !this.isLocked()
  }
  get isPast(): boolean {
    return !this.isFuture && !this.isPresent
  }

  allowEdit(qidn: number): boolean {
    return this.isPresent && !this.showSolution(qidn)
  }
  //Show Solution, shows Answer too
  showSolution(qidn: number): boolean {
    if (this.isPresent && this.isPracticeMode) return this.guessings[qidn] != null
    return this.isFuture || this.isPast && this.getReveal(qidn)
  }
  //Show Answer need not show solution (while taking an exam)
  showAnswer(qidn: number): boolean {
    return this.isPresent || this.isPast && this.getReveal(qidn)
  }

  get name(): string {
    return this.isPracticeMode ? 'practice' : 'exam'
  }

}

export const EMPTY_EXAM_RESULT = new ExamResult('00', 'Bingo', new Date(), EMPTY_EXAM)
