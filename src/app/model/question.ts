import { AnswerType } from './answer-type';

export class Question {
  public readonly answers: number[] = []
  constructor(
    public readonly html: string,
    public readonly type: AnswerType,
    public readonly choices: string[],
    public readonly solutions: number[],
  ) {
    if (html == undefined) throw Error("html cannot be undefined")
    if (type == undefined) throw Error("Type cannot be undefined")
    if (choices.length < 1) throw new Error("There should be atleast one choice")
    if (solutions.length < 1) throw new Error("There should be atleast one solution")
    solutions.forEach( (sol, i) => {
      if (sol > choices.length-1 || sol < 0) throw new Error("solution ("+i+") out of bounds")
    })
    switch (type) {
      case AnswerType.TFQ:
        if (choices.length != 2) throw new Error("TFQ should have only two choices")
        if (solutions.length != 1) throw new Error("TFQ should have only one solution")
        break
      case AnswerType.MCQ :
        if (choices.length < 2) throw new Error("MCQ should have more than one choice")
        if (solutions.length != 1) throw new Error("MCQ should have only one solution")
        break
      case AnswerType.ARQ :
        if (choices.length != 5) throw new Error("ARQ should have exactly 5 choices")
        if (solutions.length != 1) throw new Error("MCQ should have only one solution")
        break
      case AnswerType.MAQ:
        if (choices.length < 2) throw new Error("MAQ should have more than one choice")
        break
    }
  }
  public isAttempted(): boolean {
    return this.answers.length > 0
  }
  public clearAnswers() {
    //this.answers.length = 0
    this.answers.splice(0)
  }
  public addAnswer(n: number) {
    this.answers.push(n)
  }
  public removeAnswer(n: number) {
    let index = this.answers.indexOf(n);
    if (index > -1) this.answers.splice(index, 1)
    else console.log("WARNING: Answer not available")
  }
  public isCorrect(): boolean {
    //no answers so not correct (also, solutions can never be empty)
    if (!this.isAttempted()) return false
    //given answers are correct
    //CAUTION: donot use return inside forEach - does not return
    for (let ans of this.answers) if (!this.solutions.includes(ans)) return false
    //all answers are given
    for (let ans of this.solutions) if (!this.answers.includes(ans)) return false
    return true
  }
}

