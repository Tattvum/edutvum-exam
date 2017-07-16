import { AnswerType } from './answer-type';
import { Question } from './question';
import { Score } from './score';

export class Exam {
  constructor(
    public readonly title: string,
    public readonly questions: Question[]
  ) {
    if (title == undefined) throw Error("Exam title cannot be undefined")
    if (questions == undefined) throw Error("Exam questions cannot be undefined")
    if (questions.length < 1) throw Error("Exam questions should be atleaset one")
  }

  private _isLocked: boolean = false;
  public isLocked(): boolean {
    return this._isLocked;
  }
  //NOTE: no unlock for now
  public lock() {
    if(this._isLocked) return
    this._isLocked = true
    this.questions.forEach(q => q.lock())
  }

  public score(): Score {
    let correct = 0
    let wrong = 0
    this.questions.forEach(q => {
      if (q.isAttempted()) {
        if (q.isCorrect()) correct++
        else wrong++
      }
    })
    let total = this.questions.length
    return new Score(total, correct, wrong)
  }
}
