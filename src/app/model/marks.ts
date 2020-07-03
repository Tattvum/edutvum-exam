import { AnswerType } from './answer-type'
import { Lib } from './lib'

//------------------------------------------------------------------------------

export enum MarkingSchemeType {
  OLD, // Old default, where NAQ is one
  GENERAL, // All one mark, but NAQ (Done) as specified in solution/answer
  NSEJS, // Also BITSAT. All 3 marks, Almost all are MCQ, wrong -1
  JEEMAIN, // All 4 marks, Almost all are MCQ, wrong -1
  NSEP, // Like BITSAT and NSEJS, but for MAQ all corect +6, even one wrong 0
  JEEADV, // mcq +3/-1, numerical +3/0, maq +4**/-2
  UNKNOWN_LAST // Just tag the end?
}

export const MARKING_SCHEME_TYPES = Lib.enumValues<MarkingSchemeType>(MarkingSchemeType)

export const MARKING_SCHEME_TYPE_NAMES = Lib.enumNames(MarkingSchemeType)

export interface Marks {
  value: number
  max: number
}

//------------------------------------------------------------------------------

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

function single(solutions: number[], answers: number[], type: string, pos: number, neg: number): Marks {
  let nope = { 'value': neg, 'max': pos }
  if (answers.length == 0) return { 'value': 0, 'max': pos }
  if (solutions.length !== 1) return nope //should have only one solution
  if (answers.length > 1) return nope //should have maximum one answer
  return { 'value': solutions[0] === answers[0] ? pos : neg, 'max': pos }
}

function maqAllOrNothing(solutions: number[], answers: number[]): boolean {
  if (answers.length == 0) return false
  if (solutions.length < 1) return false //MAQ should have atleast one solution
  if (answers.length > solutions.length) return false //MAQ cannot have more answers than solutions
  if (!isUnique(answers)) return false // MAQ answers cannot have duplicates
  if (!isUnique(solutions)) return false // MAQ solutions cannot have duplicates
  if (!subset(solutions, answers)) return false
  if (!subset(answers, solutions)) return false
  return true
}

const MARKER_MAKER = [
  () => new OldMarker(),
  () => new GeneralMarker(),
  () => new NSEJSMarker(),
  () => new JEEMainMarker(),
  () => new NSEPMarker(),
  () => new JEEAdvMarker(),
]

//------------------------------------------------------------------------------

export abstract class Marker {
  private static markers: Marker[] = []
  static get(scheme: MarkingSchemeType): Marker {
    let marker = Marker.markers[scheme]
    if (marker == null) Marker.markers[scheme] = marker = MARKER_MAKER[scheme]()
    return marker
  }
  constructor(readonly right: number, readonly wrong: number,
    readonly markingSchemeType: MarkingSchemeType) { }
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
    let nope = { 'value': this.wrong, 'max': this.right }
    if (answers.length == 0) return { 'value': 0, 'max': this.right }
    if (solutions.length < 1) return nope //MAQ should have atleast one solution
    if (answers.length > solutions.length) return nope //MAQ cannot have more answers than solutions
    if (!isUnique(answers)) return nope // MAQ answers cannot have duplicates
    if (!isUnique(solutions)) return nope // MAQ solutions cannot have duplicates
    if (!subset(solutions, answers)) return nope
    if (!subset(answers, solutions)) return nope
    return { 'value': this.right, 'max': this.right }
  }
  naq(solutions: number[], answers: number[]): Marks {
    let nope = { 'value': 0, 'max': solutions[0] }
    if (solutions.length !== 1) return nope // should have only one solution
    if (answers.length > 1) return nope // should have maximum one answer
    if (solutions[0] < answers[0]) return nope // NAQ solution should be grater than answer (it is marks)
    return { 'value': answers[0], 'max': solutions[0] }
  }
}

//------------------------------------------------------------------------------

class OldMarker extends Marker {
  constructor() {
    super(1, 0, MarkingSchemeType.OLD)
  }
  naq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'NAQ', this.right, this.wrong)
  }
}

class GeneralMarker extends Marker {
  constructor() {
    super(1, 0, MarkingSchemeType.GENERAL)
  }
}

class JEEAdvMarker extends Marker {
  constructor() {
    super(3, 0, MarkingSchemeType.JEEADV)
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
}

class NSEJSMarker extends Marker {
  constructor() {
    super(3, 0, MarkingSchemeType.NSEJS)
  }
  mcq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'MCQ', this.right, -1)
  }
}

class NSEPMarker extends Marker {
  constructor() {
    super(3, 0, MarkingSchemeType.NSEP)
  }
  mcq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'MCQ', this.right, -1)
  }
  maq(solutions: number[], answers: number[]): Marks {
    return { 'value': maqAllOrNothing(solutions, answers) ? 6 : 0, 'max': 6 }
  }
}

class JEEMainMarker extends Marker {
  constructor() {
    super(4, 0, MarkingSchemeType.JEEMAIN)
  }
  mcq(solutions: number[], answers: number[]): Marks {
    return single(solutions, answers, 'MCQ', this.right, -1)
  }
}

