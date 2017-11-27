import { AnswerType, TFQChoices, ARQChoices } from './answer-type';
import { Lib } from './lib';
import { FileLink } from 'app/model/data.service';

export class Question {
  constructor(
    public readonly id: string,
    public title: string,
    public type: AnswerType,
    public choices: string[],
    public solutions: number[],
    public notes = '',
    public explanation = '',
    public readonly eid = '',
    public files: FileLink[] = [],
  ) {
    this.validate(id, title, type, choices, solutions)
  }

  validate(
    id: string,
    title: string,
    type: AnswerType,
    choices: string[],
    solutions: number[],
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
    this.validate(this.id, this.title, this.type, this.choices, solutions)
    this.solutions = solutions
  }

  setType(typestr: string) {
    let type = AnswerType['' + typestr]
    if (type === AnswerType.TFQ || type === AnswerType.ARQ) {
      if (type === AnswerType.TFQ) this.choices = TFQChoices
      else if (type === AnswerType.ARQ) this.choices = ARQChoices
      this.solutions = [0]
    } else {
      this.validate(this.id, this.title, type, this.choices, this.solutions)
    }
    this.type = type
  }

  removeChoice(i: number) {
    let tempChoices = [...this.choices]
    tempChoices.splice(i, 1)
    this.validate(this.id, this.title, this.type, tempChoices, this.solutions)
    this.choices.splice(i, 1)
  }

  addChoice(choicestr: string) {
    let tempChoices = [...this.choices]
    tempChoices.push(choicestr)
    this.validate(this.id, this.title, this.type, tempChoices, this.solutions)
    this.choices.push(choicestr)
  }

  public fullid(): string {
    return this.eid + '.' + this.id
  }

  public isSolution(n: number): boolean {
    return this.solutions.indexOf(n) > -1
  }
}

export const EMPTY_QUESTION = new Question('00', 'Qbing', AnswerType.TFQ, ['A', 'B'], [0])
