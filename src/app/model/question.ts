import { AnswerType } from './answer-type';
import { Lib } from './lib';

export class Question {
  constructor(
    public readonly id: string,
    public title: string,
    public type: AnswerType,
    public readonly choices: string[],
    public solutions: number[],
    public readonly notes = '',
    public explanation = '',
    public readonly eid = '',
  ) {
    Lib.failif(Lib.isNil(id), 'id cannot be undefined')
    Lib.failif(Lib.isNil(title), 'title cannot be undefined')
    Lib.failif(Lib.isNil(type), 'Type cannot be undefined')
    Lib.failif(solutions.length < 1, 'There should be atleast one solution', id)

    if (choices == null) {
      console.log(id, AnswerType[type])
    }

    if (type !== AnswerType.NCQ) {
      Lib.failif(choices.length < 1, 'There should be atleast one choice', id, type)
      solutions.forEach((sol, i) => {
        Lib.failif(sol > choices.length - 1 || sol < 0, 'solution (' + i + ') out of bounds')
      })
    }

    switch (type) {
      case AnswerType.TFQ:
        Lib.failif(choices.length !== 2, 'TFQ should have only two choices')
        Lib.failif(solutions.length !== 1, 'TFQ should have only one solution')
        break
      case AnswerType.MCQ:
        Lib.failif(choices.length < 2, 'MCQ should have more than one choice')
        Lib.failif(solutions.length !== 1, 'MCQ should have only one solution')
        break
      case AnswerType.ARQ:
        Lib.failif(choices.length !== 5, 'ARQ should have exactly 5 choices')
        Lib.failif(solutions.length !== 1, 'MCQ should have only one solution')
        break
      case AnswerType.MAQ:
        Lib.failif(choices.length < 2, 'MAQ should have more than one choice')
        Lib.failif(solutions.length > choices.length, 'MAQ cannot have more solutions than choices')
        break
      case AnswerType.NCQ:
        Lib.failif(choices.length !== 0, 'NCQ should have no choice')
        Lib.failif(solutions.length !== 1, 'NCQ should have only one solution')
        break
    }
  }

  public setSolutions(solutions) {
    Lib.failif(solutions.length < 1, 'There should be atleast one solution', this.id)

    if (this.type !== AnswerType.NCQ) {
      Lib.failif(this.choices.length < 1, 'There should be atleast one choice', this.id, this.type)
      solutions.forEach((sol, i) => {
        Lib.failif(sol > this.choices.length - 1 || sol < 0, 'solution (' + i + ') out of bounds')
      })
    }

    switch (this.type) {
      case AnswerType.TFQ:
        Lib.failif(solutions.length !== 1, 'TFQ should have only one solution')
        break
      case AnswerType.MCQ:
        Lib.failif(solutions.length !== 1, 'MCQ should have only one solution')
        break
      case AnswerType.ARQ:
        Lib.failif(solutions.length !== 1, 'MCQ should have only one solution')
        break
      case AnswerType.MAQ:
        Lib.failif(solutions.length > this.choices.length, 'MAQ cannot have more solutions than choices')
        break
      case AnswerType.NCQ:
        Lib.failif(solutions.length !== 1, 'NCQ should have only one solution')
        break
    }

    this.solutions = solutions
  }

  public fullid(): string {
    return this.eid + '.' + this.id
  }

  public isSolution(n: number): boolean {
    return this.solutions.indexOf(n) > -1
  }
}

export const EMPTY_QUESTION = new Question('00', 'Qbing', AnswerType.TFQ, ['A', 'B'], [0])
