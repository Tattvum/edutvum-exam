import { AnswerType } from './answer-type';
import { Exam, EMPTY_EXAM } from './exam';
import { Question, EMPTY_QUESTION } from './question';
import { Score, EMPTY_SCORE } from 'app/model/score';
import { Lib } from '../model/lib';

export class ExamResult extends Exam {
  constructor(id: string, title: string, when: Date,
    readonly exam: Exam,
    public answers: number[][] = [],
    protected _isLocked = false,
    public guessings: boolean[] = []
  ) {
    super(id, title, exam.questions, when)

    if (!Lib.isNil(answers)) {
      Lib.failif(answers.length > this.questions.length, 'Too many answers', answers.length, this.questions.length)
      answers.forEach((qans, i) => {
        let q = this.questions[i]
        let len = q.choices.length
        if (!Lib.isNil(qans)) {
          qans.forEach((ans, j) => {
            // if (ans > len - 1 || ans < 0) throw new Error('q:' + i + ', a[' + j + ']=' + ans + ', len:' + len)
            if (ans > len - 1 || ans < 0) console.log('q:' + i + ', a[' + j + ']=' + ans + ', len:' + len)
          })
          // this.checkAnsType(q.type, qans.length, q.choices.length)
        }
      })
    }
  }

  private checkAnsType(type: AnswerType, alen: number, chlen: number) {
    switch (type) {
      case AnswerType.TFQ:
        Lib.failif(alen > 1, 'TFQ cannot have more than one answer')
        break
      case AnswerType.MCQ:
        Lib.failif(alen > 1, 'MCQ cannot have more than one answer')
        break
      case AnswerType.ARQ:
        Lib.failif(alen > 1, 'ARQ cannot have more than one answer')
        break
      case AnswerType.MAQ:
        Lib.failif(alen > chlen, 'MAQ cannot have more answers than choices')
        break
    }
  }

  public isLocked(): boolean {
    return this._isLocked;
  }
  public lock() {
    // Repeated lock is ignored
    if (this._isLocked) return
    this._isLocked = true
  }

  public isAttempted(qid: number): boolean {
    let qans = this.answers[qid]
    return qans && qans.length > 0
  }
  public clearAnswers(qid: number) {
    Lib.failif(this._isLocked, 'Locked question cannot be cleared')
    this.answers[qid] = []
  }
  public setAnswer(qid: number, n: number) {
    Lib.failif(this._isLocked, 'Locked question cannot set answer')
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
      default:
        Lib.failif(true, 'This should never execute!')
        break;
    }
    // console.log('setAnswer', qid, n, '' + this.answers[qid])
  }
  public isAnswer(qid: number, n: number): boolean {
    let ans = this.answers[qid]
    return ans && ans.indexOf(n) > -1
  }
  public removeAnswer(qid: number, n: number): boolean {
    Lib.failif(this._isLocked, 'Locked question cannot remove answer')
    if (!this.answers[qid]) this.answers[qid] = []
    let index = this.answers[qid].indexOf(n);
    let removed = index > -1
    if (removed) this.answers[qid].splice(index, 1)
    // else console.log("WARNING: Answer not available")
    // console.log('removeAnswer', qid, n, '' + this.answers[qid])
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

  public score(): Score {
    let correct = 0
    let wrong = 0
    this.answers.forEach((ans, qid) => {
      if (ans !== undefined) {
        if (this.isAttempted(qid)) {
          if (this.isCorrect(qid)) correct++
          else wrong++
        }
      }
    })
    let total = this.questions.length
    return new Score(total, correct, wrong)
  }
}

export const EMPTY_EXAM_RESULT = new ExamResult('00', 'Bingo', new Date(), EMPTY_EXAM)
