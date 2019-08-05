import { AnswerType } from './answer-type'
import { Lib } from './lib';

export enum MarkingSchemeType {
  OLD, // Old default, where NAQ is one
  GENERAL, // All one mark, but NAQ (Done) as specified in solution/answer
  JEE, // All one mark, but NAQ (Done) as specified in solution/answer
  UNKNOWN_LAST // Just tag the end?
}

export const MARKING_SCHEME_TYPES = [
  MarkingSchemeType.OLD,
  MarkingSchemeType.GENERAL,
  MarkingSchemeType.JEE,
]

export const MARKING_SCHEME_TYPE_NAMES = MARKING_SCHEME_TYPES.map(m => MarkingSchemeType[m])

export interface Marks {
  readonly value: number
  readonly max: number
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

function singleCheck(solutions: number[], answers: number[], type: string) {
  Lib.failif(solutions.length !== 1, type + ' should have only one solution')
  Lib.failif(answers.length > 1, type + ' should have maximum one answer')
}

function single(solutions: number[], answers: number[], type: string, pos: number, neg: number): Marks {
  singleCheck(solutions, answers, type)
  return { 'value': solutions[0] === answers[0] ? pos : neg, 'max': pos }
}

export abstract class Marker {
  static get(scheme: MarkingSchemeType): Marker {
    switch (scheme) {
      case MarkingSchemeType.OLD: return new OldMarker()
      case MarkingSchemeType.GENERAL: return new GeneralMarker
      case MarkingSchemeType.JEE: return new JEEMarker
    }
  }
  constructor(readonly right: number, readonly wrong: number) { }
  marks(type: AnswerType, solutions: number[], answers: number[]): Marks {
    if (!answers) answers = []
    switch (type) {
      case AnswerType.MCQ: return this.mcq(solutions, answers)
      case AnswerType.ARQ: return this.arq(solutions, answers)
      case AnswerType.TFQ: return this.tfq(solutions, answers)
      case AnswerType.NCQ: return this.ncq(solutions, answers)
      case AnswerType.MAQ: return this.maq(solutions, answers)
      case AnswerType.NAQ: return this.naq(solutions, answers)
      default: {
        console.log('ERROR: Unknown AnswerType', type)
        return { 'value': -1, 'max': -1 }
      }
    }
  }
  mcq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'MCQ', this.right, this.wrong)
  }
  arq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'ARQ', this.right, this.wrong)
  }
  tfq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'TFQ', this.right, this.wrong)
  }
  ncq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'NCQ', this.right, this.wrong)
  }
  maq(solutions: number[], answers: number[]): Marks {
    Lib.failif(solutions.length < 1, 'MAQ should have atleast one solution')
    Lib.failif(answers.length > solutions.length, 'MAQ cannot have more answers than solutions')
    Lib.failif(!isUnique(answers), 'MAQ answers cannot have duplicates')
    Lib.failif(!isUnique(solutions), 'MAQ solutions cannot have duplicates')
    if (!subset(solutions, answers)) return { 'value': this.wrong, 'max': this.right }
    if (!subset(answers, solutions)) return { 'value': this.wrong, 'max': this.right }
    return { 'value': this.right, 'max': this.right }
  }
  naq(solutions: number[], answers: number[]): Marks {
    singleCheck(solutions, answers, 'NAQ')
    Lib.failif(solutions[0] < answers[0], 'NAQ solution should be grater than answer (it is marks)')
    return { 'value': answers[0], 'max': solutions[0] }
  }
  abstract scheme(): MarkingSchemeType
}

export class OldMarker extends Marker {
  constructor() {
    super(1, 0)
  }
  naq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'NAQ', this.right, this.wrong)
  }
  scheme(): MarkingSchemeType {
    return MarkingSchemeType.OLD
  }
}

export class GeneralMarker extends Marker {
  constructor() {
    super(1, 0)
  }
  scheme(): MarkingSchemeType {
    return MarkingSchemeType.GENERAL
  }
}

export class JEEMarker extends Marker {
  constructor() {
    super(3, 0)
  }
  mcq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'MCQ', this.right, -1)
  }
  maq(solutions: number[], answers: number[]): Marks {
    super.maq(solutions, answers)// ONLY for checks
    if (!subset(solutions, answers)) return { 'value': -2, 'max': 4 }
    if (!subset(answers, solutions)) return { 'value': answers.length, 'max': 4 }
    return { 'value': 4, 'max': 4 }
  }
  scheme(): MarkingSchemeType {
    return MarkingSchemeType.JEE
  }
}
