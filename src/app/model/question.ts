import { AnswerType } from './answer-type';
import { Lib } from './lib';

export class Question {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly type: AnswerType,
    public readonly choices: string[],
    public readonly solutions: number[],
  ) {
    if (Lib.isNil(id)) throw Error('id cannot be undefined')
    if (Lib.isNil(title)) throw Error('title cannot be undefined')
    if (Lib.isNil(type)) throw Error('Type cannot be undefined')
    if (solutions.length < 1) throw new Error('There should be atleast one solution')

    if (type !== AnswerType.NCQ) {
      if (choices.length < 1) throw new Error('There should be atleast one choice')
      solutions.forEach((sol, i) => {
        if (sol > choices.length - 1 || sol < 0) throw new Error('solution (' + i + ') out of bounds')
      })
    }

    switch (type) {
      case AnswerType.TFQ:
        if (choices.length !== 2) throw new Error('TFQ should have only two choices')
        if (solutions.length !== 1) throw new Error('TFQ should have only one solution')
        break
      case AnswerType.MCQ:
        if (choices.length < 2) throw new Error('MCQ should have more than one choice')
        if (solutions.length !== 1) throw new Error('MCQ should have only one solution')
        break
      case AnswerType.ARQ:
        if (choices.length !== 5) throw new Error('ARQ should have exactly 5 choices')
        if (solutions.length !== 1) throw new Error('MCQ should have only one solution')
        break
      case AnswerType.MAQ:
        if (choices.length < 2) throw new Error('MAQ should have more than one choice')
        if (solutions.length > choices.length) throw new Error('MAQ cannot have more solutions than choices')
        break
      case AnswerType.NCQ:
        if (choices.length !== 0) throw new Error('NCQ should have no choice')
        if (solutions.length !== 1) throw new Error('NCQ should have only one solution')
        break
    }
  }

  public isSolution(n: number): boolean {
    return this.solutions.indexOf(n) > -1
  }
}

export const EMPTY_QUESTION = new Question('00', 'Qbing', AnswerType.TFQ, ['A', 'B'], [0])
