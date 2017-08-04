import { Exam, EMPTY_EXAM } from './exam';
import { Question, EMPTY_QUESTION } from './question';
import { Score, EMPTY_SCORE } from "app/model/score";

export class ExamResult extends Exam {
  constructor(id: string, title: string, when: Date,
    readonly exam: Exam,
    public answers: number[][] = [],
    protected _isLocked: boolean = false,
  ) {
    super(id, title, exam.questions, when)
  }


  public isLocked(): boolean {
    return this._isLocked;
  }
  public lock() {
    if (this._isLocked) return
    this._isLocked = true
  }

  public isAttempted(qid: number): boolean {
    let qans = this.answers[qid]
    return qans && qans.length > 0
  }
  public isSolution(qid: number, n: number): boolean {
    return this.questions[qid].solutions.indexOf(n) > -1
  }
  public clearAnswers(qid: number) {
    if (this._isLocked) throw new Error("Locked question cannot be cleared")
    this.answers[qid] = []
  }
  public addAnswer(qid: number, n: number) {
    if (this._isLocked) throw new Error("Locked question cannot add answer")
    if (!this.answers[qid]) this.answers[qid] = []
    this.answers[qid].push(n)
  }
  public isAnswer(qid: number, n: number): boolean {
    let ans = this.answers[qid]
    return ans && ans.indexOf(n) > -1
  }
  public removeAnswer(qid: number, n: number): boolean {
    if (this._isLocked) throw new Error("Locked question cannot remove answer")
    if (!this.answers[qid]) this.answers[qid] = []
    let index = this.answers[qid].indexOf(n);
    let removed = index > -1
    if (removed) this.answers[qid].splice(index, 1)
    // else console.log("WARNING: Answer not available")
    return removed
  }
  public isCorrect(qid: number): boolean {
    // no answers so not correct (also, solutions can never be empty)
    if (!this.isAttempted(qid)) return false
    // given answers are correct
    // CAUTION: donot use return inside forEach - does not return
    let sols = this.questions[qid].solutions
    for (let ans of this.answers[qid]) if (!sols.includes(ans)) return false
    //all answers are given
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
