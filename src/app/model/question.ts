import { AnswerType } from './answer-type';

export class Question {
  constructor(
    public readonly title: string,
    public readonly type: AnswerType,
    public readonly choices: string[],
    public readonly solutions: number[],
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
  }
}

export const EMPTY_QUESTION = new Question('Qbing', AnswerType.TFQ, ['A', 'B'], [0])
