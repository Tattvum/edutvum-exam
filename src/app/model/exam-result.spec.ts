import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { ExamResult } from './exam-result';
import { Score } from './score';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = "TEST Q..."): Question => {
  return new Question(title, type, choices, sols)
}
let createR = (questions: Question[], title = "TEST E...", id: string = '00'): ExamResult => {
  let e = new Exam(id, title, questions)
  return new ExamResult(e.id, e.title, new Date(), e)
}
let doR = (questions: Question[], answers: number[][]): ExamResult => {
  let e = createR(questions)
  return new ExamResult(e.id, e.title, new Date(), e, answers)
}

let tfq = () => createQ(AnswerType.TFQ, ["C1", "C2"], [0])
let mcq = () => createQ(AnswerType.MCQ, ["C1", "C2", "C3"], [2])
let arq = () => createQ(AnswerType.ARQ, ["C1", "C2", "C3", "C4", "C5"], [3])
let maq = () => createQ(AnswerType.MAQ, ["C1", "C2", "C3"], [0, 2])
let questions0 = () => []
let questions1 = () => [tfq()]
let questions2 = () => [tfq(), maq()]
let questions8 = () => [tfq(), tfq(), mcq(), mcq(), arq(), arq(), maq(), maq()]

let choices0: string[] = []
let choices1: string[] = ["choice 1"]
let choices2: string[] = ["choice 1", "choice 2"]
let choices3: string[] = ["choice 1", "choice 2", "choice 3"]
let choices5: string[] = ["choice 1", "choice 2", "choice 3", "choice 4", "choice 5"]
let choices6: string[] = ["choice 1", "choice 2", "choice 3", "choice 4", "choice 5", "choice 6"]
let sols0: number[] = []
let sols1: number[] = [0]
let sols2: number[] = [0, 2]
let sols3: number[] = [1, 2, 3]

let create1QR = (type: AnswerType, choices: string[], sols: number[], ans: number[] = [],
  isLocked: boolean = false): ExamResult => {
  let q = [new Question('TEST Q...', type, choices, sols)]
  let e = new Exam('00', "TEST E", q)
  return new ExamResult(e.id, e.title, new Date(), e, [ans], isLocked)
}

let checkScore = (s: Score, t: number, c: number, w: number, l: number, p: number) => {
  expect(s.total).toBe(t)
  expect(s.correct).toBe(c)
  expect(s.wrong).toBe(w)
  expect(s.leftout).toBe(l)
  expect(s.percent()).toBe(p)
}

describe('ExamResult:', () => {
  it('Lock works', () => {
    let r = createR(questions1())
    expect(() => r.clearAnswers(0)).not.toThrow()
    expect(r.isLocked()).toBeFalsy()
    r.lock()
    expect(() => r.lock()).not.toThrow()//Repeated lock is ignored
    expect(r.isLocked()).toBeTruthy()
    expect(() => r.clearAnswers(0)).toThrow()
    expect(() => r.addAnswer(0, 1729)).toThrow()
    expect(() => r.removeAnswer(0, 1729)).toThrow()
  })

  it('Lock works 2', () => {
    let r = createR(questions1())
    r.addAnswer(0, 0)
    r.lock()
    expect(r.isLocked()).toBeTruthy()
    expect(r.isAttempted(0)).toBeTruthy()
  })

  it('none attempted so zero', () => {
    let answersNull = [[], [], [], [], [], [], [], []]
    checkScore(doR(questions8(), answersNull).score(), 8, 0, 0, 8, 0)
  })

  it('none correct so zero', () => {
    let answers0 = [[1], [1], [0], [1], [1], [2], [0, 2, 1], [0]]
    checkScore(doR(questions8(), answers0).score(), 8, 0, 8, 0, 0)
  })

  it('all correct so full', () => {
    let answers8 = [[0], [0], [2], [2], [3], [3], [0, 2], [0, 2]]
    checkScore(doR(questions8(), answers8).score(), 8, 8, 0, 0, 100)
  })

  it('some correct so mixed', () => {
    let answers3 = [[0], [], [2], [1], [], [2], [0, 2], [0, 2, 1]]
    checkScore(doR(questions8(), answers3).score(), 8, 3, 3, 2, 38)
  })
})

describe('ExamResult - Question - declaration tests:', () => {

  it('Answers are checked fine', () => {
    expect(() => create1QR(AnswerType.TFQ, choices2, [0], [2])).toThrow()
    expect(() => create1QR(AnswerType.TFQ, choices2, [0], [1])).not.toThrow()
    expect(() => create1QR(AnswerType.TFQ, choices2, [0], [1, 1])).toThrow()
    expect(() => create1QR(AnswerType.MCQ, choices3, [0], [1])).not.toThrow()
    expect(() => create1QR(AnswerType.MCQ, choices3, [0], [1, 1])).toThrow()
    expect(() => create1QR(AnswerType.ARQ, choices5, [0], [1])).not.toThrow()
    expect(() => create1QR(AnswerType.ARQ, choices5, [0], [1, 1])).toThrow()
    expect(() => create1QR(AnswerType.MAQ, choices2, [0, 1], [1, 1])).not.toThrow()
    expect(() => create1QR(AnswerType.MAQ, choices2, [0, 1], [1, 1, 0])).toThrow()
  })

  it('Lock works on create', () => {
    let r = create1QR(AnswerType.MAQ, choices6, sols1, [], true)
    expect(r.isLocked()).toBeTruthy()
    expect(() => r.clearAnswers(0)).toThrow()
    expect(() => r.addAnswer(0, 1729)).toThrow()
    expect(() => r.removeAnswer(0, 1729)).toThrow()
  })
})

describe('Question - single sol tests:', () => {
  let choices: string[] = ["choice 1", "choice 2"]
  let sols: number[] = [0]
  let r = create1QR(AnswerType.TFQ, choices, sols)

  it('No answers, so not attempted', () => {
    expect(r.isAttempted(0)).toBeFalsy()
  })
  it('Some answers, so attempted', () => {
    r.addAnswer(0, 1)
    expect(r.isAttempted(0)).toBeTruthy()
  })
  it('Clear answers - working', () => {
    r.clearAnswers(0)
    expect(r.isAttempted(0)).toBeFalsy()
  })
  it('No answers, so not correct', () => {
    expect(r.isCorrect(0)).toBeFalsy()
  })
  it('Right answer so correct', () => {
    r.addAnswer(0, 0)
    expect(r.isCorrect(0)).toBeTruthy()
    r.clearAnswers(0)
  })
  it('Wrong answer so not correct', () => {
    r.addAnswer(0, 1)
    expect(r.isCorrect(0)).toBeFalsy()
    r.clearAnswers(0)
  })
  it('isAnswer working', () => {
    expect(r.isAnswer(0, 0)).toBeFalsy()
    r.addAnswer(0, 0)
    expect(r.isAnswer(0, 1)).toBeFalsy()
    expect(r.isAnswer(0, 0)).toBeTruthy()
    r.clearAnswers(0)
  })
})

describe('Question - many sol tests:', () => {
  let choices: string[] = ["choice 1", "choice 2", "choice 3"]
  let sols: number[] = [0, 2]
  let r = create1QR(AnswerType.MAQ, choices, sols)

  it('One wrong answer alone so not correct', () => {
    r.addAnswer(0, 1)
    expect(r.isCorrect(0)).toBeFalsy()
    r.clearAnswers(0)
  })
  it('One right answer alone so not correct', () => {
    r.addAnswer(0, 0)
    expect(r.isCorrect(0)).toBeFalsy()
  })
  it('All and only right answers, so correct', () => {
    r.addAnswer(0, 2)
    expect(r.isCorrect(0)).toBeTruthy()
  })
  it('All right but one wrong answer too, so not correct', () => {
    r.addAnswer(0, 1)
    expect(r.isCorrect(0)).toBeFalsy()
  })
  it('Remove Answer exception - working', () => {
    expect(r.removeAnswer(0, 21)).toBeFalsy()
  })
  it('All and only right answers, so correct - remove working', () => {
    r.removeAnswer(0, 1)
    expect(r.isCorrect(0)).toBeTruthy()
    r.clearAnswers(0)
  })
})


