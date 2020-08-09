import { Marking, QType } from './marking';
import { AnswerType } from './answer-type';

describe('Marking marks tests:', () => {
  const types: { [id: string]: QType } = {
    "-": { "right": 3, "wrong": -1 },
    "MAQ": { "right": 6, "wrong": 0 },
    "MCQ": { "right": 5, "wrong": -2, "partial": true },//Test sake
  }
  const def = types["-"]
  const maq = types["MAQ"]
  const mcq = types["MCQ"]

  const marking = new Marking("TEST", "blah blah", new Date(), types)

  it('test input', () => {
    expect(def.right).toBe(3)
    expect(def.wrong).toBe(-1)
  })
  it('qtype', () => {
    expect(marking.qtype(AnswerType.MAQ)).toEqual(maq)
    expect(marking.qtype(AnswerType.NCQ)).toEqual(undefined)
    expect(marking.qtype(AnswerType.MCQ)).toEqual(mcq)
  })
  it('check existant type multiple', () => {
    const nope = { 'value': maq.wrong, 'max': maq.right }
    const zero = { 'value': 0, 'max': maq.right }
    const yay = { 'value': maq.right, 'max': maq.right }
    expect(marking.marks(AnswerType.MAQ, [1, 2], [3])).toEqual(nope)
    expect(marking.marks(AnswerType.MAQ, [1, 2], [2])).toEqual(nope)
    expect(marking.marks(AnswerType.MAQ, [1, 2], [2])).toEqual(zero)
    expect(marking.marks(AnswerType.MAQ, [1, 2], [1, 2])).toEqual(yay)
  })
  it('check existant type multiple - with partials', () => {
    const nope = { 'value': mcq.wrong, 'max': mcq.right }
    const zero = { 'value': 0, 'max': mcq.right }
    const yay = { 'value': mcq.right, 'max': mcq.right }
    const p1 = { 'value': 1, 'max': mcq.right }
    const p2 = { 'value': 2, 'max': mcq.right }
    expect(marking.marks(AnswerType.MCQ, [1, 2], [3])).toEqual(nope)
    expect(marking.marks(AnswerType.MCQ, [1, 2], [2])).toEqual(p1)
    expect(marking.marks(AnswerType.MCQ, [1, 2, 3], [2])).toEqual(p1)
    expect(marking.marks(AnswerType.MCQ, [1, 2, 3], [2, 1])).toEqual(p2)
    expect(marking.marks(AnswerType.MCQ, [1, 2], [1, 2])).toEqual(yay)
  })
  it('check non-existant type - single - defaults', () => {
    const nope = { 'value': def.wrong, 'max': def.right }
    const zero = { 'value': 0, 'max': def.right }
    const yay = { 'value': def.right, 'max': def.right }
    expect(marking.marks(AnswerType.NCQ, [1], [2])).toEqual(nope)
    expect(marking.marks(AnswerType.NCQ, [1], [2, 3])).toEqual(nope)
    expect(marking.marks(AnswerType.NCQ, [1], [])).toEqual(zero)
    expect(marking.marks(AnswerType.NCQ, [1], [1])).toEqual(yay)
  })
})
