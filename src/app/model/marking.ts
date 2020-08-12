import { AbstractThing } from './abstract-thing';
import { Marks } from './marks';
import { AnswerType } from './answer-type';
import { Lib } from './lib';

export interface QType {
  right: number
  wrong: number
  partial?: boolean
}

function unique(array: number[]): number[] {
  return [...new Set(array)]
}

function isUnique(array: number[]): boolean {
  return array.length === unique(array).length
}

function subset(sup: number[], sub: number[]): boolean {
  if (sub.length > sup.length) return false
  for (let x of sub) if (!sup.includes(x)) return false
  return true
}

export class Marking extends AbstractThing {
  public static readonly OLD: Marking = new Marking("OLD")
  public static readonly GENERAL: Marking = new Marking("GENERAL")
  public static readonly Defaults: Marking[] = [Marking.OLD, Marking.GENERAL]

  constructor(
    id: string,
    public title: string = "",
    public readonly when: Date = new Date(),
    public types: { [id: string]: QType } = { "-": { "right": 1, "wrong": 0 } }
  ) {
    super(id, title, when)
  }

  private qttext(key: string, qt: QType): string {
    const name = key === "-" ? "Default" : key
    const marks = `${qt.right}/${qt.wrong}`
    const partials = !Lib.isNil(qt.partial) ? "(with Partials)" : ""
    return `${name} type carries ${marks} marks ${partials}. `
  }

  get description(): string {
    const findqtt = (key: string) => this.qttext(key, this.types[key])
    return `${this.id} -- ` + Object.keys(this.types).map(findqtt).join(' ')
  }

  qtype(type: AnswerType): QType {
    const typeName = AnswerType[type]
    return this.types[typeName]
  }

  marks(type: AnswerType, solutions: number[], answers: number[]): Marks {
    if (type === AnswerType.NAQ) return this.naq(solutions, answers)
    const def: QType = this.types["-"]
    let qt: QType = this.qtype(type)
    if (Lib.isNil(qt)) qt = def
    const nope = { 'value': qt.wrong, 'max': qt.right }
    if (Lib.isNil(answers)) return nope
    const partialValue = Lib.isNil(qt.partial) ? qt.wrong : answers.length
    if (answers.length == 0) return { 'value': 0, 'max': qt.right }
    if (solutions.length < 1) return nope //Question should have atleast one solution
    if (answers.length > solutions.length) return nope //Question cannot have more answers than solutions
    if (!isUnique(answers)) return nope // Question answers cannot have duplicates
    if (!isUnique(solutions)) return nope // Question solutions cannot have duplicates
    if (!subset(solutions, answers)) return nope
    if (!subset(answers, solutions)) return { 'value': partialValue, 'max': qt.right }
    return { 'value': qt.right, 'max': qt.right }
  }

  private naq(solutions: number[], answers: number[]): Marks {
    let nope = { 'value': 0, 'max': solutions[0] }
    if (Lib.isNil(answers)) return nope// TBD: When will it be so?!
    if (solutions.length !== 1) return nope // should have only one solution
    if (answers.length > 1) return nope // should have maximum one answer
    if (solutions[0] < answers[0]) return nope // NAQ solution should be grater than answer (it is marks)
    return { 'value': answers[0], 'max': solutions[0] }
  }
}
