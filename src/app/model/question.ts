import { AnswerType, TFQChoices, ARQChoices } from './answer-type';
import { Lib } from './lib';
import { FileLink } from './data.service';
import { QuestionGroup } from './question-group';
import { Tag } from './tag';

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
    public groups: QuestionGroup[] = [],
    public tags: Tag[] = [],
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
    Lib.failif(Lib.isNil(title), 'title cannot be undefined', id)
    Lib.failif(Lib.isNil(type), 'Type cannot be undefined')
    Lib.failif(solutions.length < 1, 'There should be atleast one solution', id)

    if (choices == null) {
      console.log(id, AnswerType[type])
    }

    if (type !== AnswerType.NCQ && type !== AnswerType.NAQ) {
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
      case AnswerType.NAQ:
        Lib.failif(choices.length !== 0, 'NAQ should have no choice')
        Lib.failif(solutions.length !== 1, 'NAQ should have only one solution')
        break
    }
  }

  public setSolutions(solutions) {
    this.validate(this.id, this.title, this.type, this.choices, solutions)
    this.solutions = solutions
  }

  setType(typestr: string) {
    let type = AnswerType['' + typestr]
    let choices = this.choices
    let solutions = this.solutions
    if (type === AnswerType.TFQ || type === AnswerType.ARQ
      || type === AnswerType.NCQ || type === AnswerType.NAQ) {
      if (type === AnswerType.TFQ) choices = TFQChoices
      else if (type === AnswerType.ARQ) choices = ARQChoices
      else if (type === AnswerType.NCQ) choices = []
      else if (type === AnswerType.NAQ) choices = []
      solutions = [0]
    } else {
      this.validate(this.id, this.title, type, choices, solutions)
    }
    this.type = type
    this.choices = choices
    this.solutions = solutions
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

  public path(): string {
    return this.groups.map(g => g.id).join('.')
  }

  public fullid(): string {
    let out = this.eid + '.'
    let p = this.path()
    if (p && p !== '') out += p + '.'
    return out + this.id
  }

  public isSolution(n: number): boolean {
    return this.solutions.indexOf(n) > -1
  }
}

export const EMPTY_QUESTION = new Question('00', 'Qbing', AnswerType.TFQ, ['A', 'B'], [0])
