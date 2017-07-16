import { AnswerType } from './answer-type';

export class Question {
  constructor(
    public readonly title: string,
    public readonly type: AnswerType,
    public readonly choices: string[],
    public readonly solutions: number[],
    public readonly answers: number[] = [],
    private _isLocked = false
  ) {
    if (title == undefined) throw Error("title cannot be undefined")
    if (type == undefined) throw Error("Type cannot be undefined")
    if (choices.length < 1) throw new Error("There should be atleast one choice")
    if (solutions.length < 1) throw new Error("There should be atleast one solution")
    solutions.forEach((sol, i) => {
      if (sol > choices.length - 1 || sol < 0) throw new Error("solution (" + i + ") out of bounds")
    })
    switch (type) {
      case AnswerType.TFQ:
        if (choices.length != 2) throw new Error("TFQ should have only two choices")
        if (solutions.length != 1) throw new Error("TFQ should have only one solution")
        break
      case AnswerType.MCQ:
        if (choices.length < 2) throw new Error("MCQ should have more than one choice")
        if (solutions.length != 1) throw new Error("MCQ should have only one solution")
        break
      case AnswerType.ARQ:
        if (choices.length != 5) throw new Error("ARQ should have exactly 5 choices")
        if (solutions.length != 1) throw new Error("MCQ should have only one solution")
        break
      case AnswerType.MAQ:
        if (choices.length < 2) throw new Error("MAQ should have more than one choice")
        if (solutions.length > choices.length) throw new Error("MAQ cannot have more solutions than choices")
        break
    }
    if (answers != undefined) {
      answers.forEach((ans, i) => {
        if (ans > choices.length - 1 || ans < 0) throw new Error("answer (" + i + ") out of bounds")
      })
      switch (type) {
        case AnswerType.TFQ:
          if (answers.length > 1) throw new Error("TFQ cannot have more than one answer")
          break
        case AnswerType.MCQ:
          if (answers.length > 1) throw new Error("MCQ cannot have more than one answer")
          break
        case AnswerType.ARQ:
          if (answers.length > 1) throw new Error("ARQ cannot have more than one answer")
          break
        case AnswerType.MAQ:
          if (answers.length > choices.length) throw new Error("MAQ cannot have more answers than choices")
          break
      }
    }
  }

  public isLocked(): boolean {
    return this._isLocked;
  }
  // NOTE: no unlock for now
  public lock() {
    if (this._isLocked) return
    this._isLocked = true
  }

  public isAttempted(): boolean {
    return this.answers.length > 0
  }
  public clearAnswers() {
    if (this._isLocked) throw new Error("Locked question cannot be cleared")
    this.answers.length = 0
    // this.answers.splice(0)
  }
  public addAnswer(n: number) {
    if (this._isLocked) throw new Error("Locked question cannot add answer")
    this.answers.push(n)
  }
  public removeAnswer(n: number): boolean {
    if (this._isLocked) throw new Error("Locked question cannot remove answer")
    let index = this.answers.indexOf(n);
    let removed = index > -1
    if (removed) this.answers.splice(index, 1)
    // else console.log("WARNING: Answer not available")
    return removed
  }
  public isCorrect(): boolean {
    // no answers so not correct (also, solutions can never be empty)
    if (!this.isAttempted()) return false
    // given answers are correct
    // CAUTION: donot use return inside forEach - does not return
    for (let ans of this.answers) if (!this.solutions.includes(ans)) return false
    //all answers are given
    for (let ans of this.solutions) if (!this.answers.includes(ans)) return false
    return true
  }
}

