import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { Score } from './score';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = "TEST Q..."): Question => {
  return new Question(title, type, choices, sols)
}
let createE = (questions: Question[], title = "TEST E..."): Exam => {
  return new Exam(title, questions)
}
let doE = (questions: Question[], answers: number[][]): Exam => {
  let e = createE(questions)
  e.questions.forEach((q, i) => {
    q.answers.push(...answers[i])
  })
  return e
}

let tfq = () => createQ(AnswerType.TFQ, ["C1", "C2"], [0])
let mcq = () => createQ(AnswerType.MCQ, ["C1", "C2", "C3"], [2])
let arq = () => createQ(AnswerType.ARQ, ["C1", "C2", "C3", "C4", "C5"], [3])
let maq = () => createQ(AnswerType.MAQ, ["C1", "C2", "C3"], [0, 2])
let questions0 = () => []
let questions1 = () => [tfq()]
let questions2 = () => [tfq(), maq()]
let questions8 = () => [tfq(), tfq(), mcq(), mcq(), arq(), arq(), maq(), maq()]

let checkScore = (s: Score, t: number, c: number, w: number, l: number, p: number) => {
  expect(s.total).toBe(t)
  expect(s.correct).toBe(c)
  expect(s.wrong).toBe(w)
  expect(s.leftout).toBe(l)
  expect(s.percent()).toBe(p)
}

describe('Exam:', () => {
  it('should have title', () => {
    expect(() => createE(questions1(), null)).toThrow()
    expect(() => createE(questions1())).not.toThrow()
  })
  it('should have questions', () => {
    expect(() => createE(null)).toThrow()
    expect(() => createE(questions0())).toThrow()
    expect(() => createE(questions1())).not.toThrow()
  })

  it('Lock works', () => {
    let e = createE(questions1())
    let q = e.questions[0]
    expect(() => q.clearAnswers()).not.toThrow()
    expect(e.isLocked()).toBeFalsy()
    expect(q.isLocked()).toBeFalsy()
    e.lock()
    expect(() => e.lock()).not.toThrow()//Repeated lock is ignored
    expect(() => q.lock()).not.toThrow()//Repeated lock is ignored
    expect(e.isLocked()).toBeTruthy()
    expect(q.isLocked()).toBeTruthy()
    expect(() => q.clearAnswers()).toThrow()
    expect(() => q.addAnswer(1729)).toThrow()
    expect(() => q.removeAnswer(1729)).toThrow()
  })

  it('none attempted so zero', () => {
    let answersNull = [[], [], [], [], [], [], [], []]
    checkScore(doE(questions8(), answersNull).score(), 8, 0, 0, 8, 0)
  })

  it('none correct so zero', () => {
    let answers0 = [[1], [2], [0], [1], [1], [2], [0, 2, 1], [0]]
    checkScore(doE(questions8(), answers0).score(), 8, 0, 8, 0, 0)
  })

  it('all correct so full', () => {
    let answers8 = [[0], [0], [2], [2], [3], [3], [0, 2], [0, 2]]
    checkScore(doE(questions8(), answers8).score(), 8, 8, 0, 0, 100)
  })

  it('some correct so mixed', () => {
    let answers3 = [[0], [], [2], [1], [], [2], [0, 2], [0, 2, 1]]
    checkScore(doE(questions8(), answers3).score(), 8, 3, 3, 2, 38)
  })
})
