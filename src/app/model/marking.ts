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
  public static readonly OLD: string = "OLD"
  public static readonly GENERAL: string = "GENERAL"

  constructor(
    id: string,
    public title: string,
    public readonly when: Date = new Date(),
    public types: { [id: string]: QType }
  ) {
    super(id, title, when)
  }

  qtype(type: AnswerType): QType {
    const typeName = AnswerType[type]
    return this.types[typeName]
  }

  marks(type: AnswerType, solutions: number[], answers: number[]): Marks {
    const def: QType = this.types["-"]
    let qt: QType = this.qtype(type)
    if(Lib.isNil(qt)) qt = def
    const nope = { 'value': qt.wrong, 'max': qt.right }
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
}
