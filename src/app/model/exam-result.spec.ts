import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam, ExamStatus } from './exam';
import { ExamResult } from './exam-result';
import { MarkingSchemeType } from './marks';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = 'TEST Q...'): Question => {
  return new Question('00', title, type, choices, sols)
}
let createE = (questions: Question[], title = 'TEST E...', id = '00'): Exam => {
  return new Exam(id, title, questions)
}
let createR = (questions: Question[], title = 'TEST E...', id = '00', answers: number[][] = []): ExamResult => {
  let e = createE(questions, title, id)
  return new ExamResult(e.id, e.title, new Date(), e, false, answers)
}
let createR2 = (questions: Question[], answers: number[][], durations: number[] = []): ExamResult => {
  let e = createE(questions)
  return new ExamResult(e.id, e.title, new Date(), e, false, answers, null, null, durations)
}

let tfq = () => createQ(AnswerType.TFQ, ['C1', 'C2'], [0])
let mcq = () => createQ(AnswerType.MCQ, ['C1', 'C2', 'C3'], [2])
let arq = () => createQ(AnswerType.ARQ, ['C1', 'C2', 'C3', 'C4', 'C5'], [3])
let maq = () => createQ(AnswerType.MAQ, ['C1', 'C2', 'C3'], [0, 2])
let ncq = () => createQ(AnswerType.NCQ, [], [10])//sols is THE answer
let naq = () => createQ(AnswerType.NAQ, [], [10])//sols is max marks

let questions0 = () => []
let questions1 = () => [tfq()]
let questions2 = () => [tfq(), maq()]
let questions10 = () => [
  tfq(), tfq(),
  mcq(), mcq(),
  arq(), arq(),
  maq(), maq(),
  ncq(), ncq(),
]

let choices0: string[] = []
let choices1: string[] = ['choice 1']
let choices2: string[] = ['choice 1', 'choice 2']
let choices3: string[] = ['choice 1', 'choice 2', 'choice 3']
let choices5: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4', 'choice 5']
let choices6: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4', 'choice 5', 'choice 6']
let sols0: number[] = []
let sols1: number[] = [0]
let sols2: number[] = [0, 2]
let sols3: number[] = [1, 2, 3]

let create1QR = (type: AnswerType, choices: string[], sols: number[], ans: number[] = [],
  status = ExamStatus.PENDING): ExamResult => {
  let q = [new Question('00', 'TEST Q...', type, choices, sols)]
  let e = new Exam('00', 'TEST E', q)
  return new ExamResult(e.id, e.title, new Date(), e, false, [ans], status)
}

describe('ExamResult1:', () => {
  it('TFQ Creation checks works', () => {
    expect(() => createR2([tfq()], [])).not.toThrow()
    expect(() => createR2([tfq()], [[0, 1]])).toThrow()
    expect(() => createR2([tfq()], [[2]])).toThrow()
    expect(() => createR2([tfq()], [[0]])).not.toThrow()
    expect(() => createR2([tfq()], [[1]])).not.toThrow()
  })
  it('MCQ Creation checks works', () => {
    expect(() => createR2([mcq()], [])).not.toThrow()
    expect(() => createR2([mcq()], [[0, 1]])).toThrow()
    expect(() => createR2([mcq()], [[3]])).toThrow()
    expect(() => createR2([mcq()], [[1], []])).toThrow()
    expect(() => createR2([mcq()], [[2]])).not.toThrow()
  })
  it('MAQ Creation checks works', () => {
    expect(() => createR2([maq()], [])).not.toThrow()
    expect(() => createR2([maq()], [[3]])).toThrow()
    expect(() => createR2([maq()], [[1], []])).toThrow()
    expect(() => createR2([maq()], [[2]])).not.toThrow()
    expect(() => createR2([maq()], [[0, 1, 2]])).not.toThrow()
  })
  it('ARQ Creation checks works', () => {
    expect(() => createR2([arq()], [])).not.toThrow()
    expect(() => createR2([arq()], [[0, 1]])).toThrow()
    expect(() => createR2([arq()], [[5]])).toThrow()
    expect(() => createR2([arq()], [[1], []])).toThrow()
    expect(() => createR2([arq()], [[4]])).not.toThrow()
  })
})

describe('ExamResult2:', () => {
  it('Lock works', () => {
    let r = createR(questions1())
    expect(() => r.clearAnswers(0)).not.toThrow()
    expect(r.isLocked()).toBeFalsy()
    r.lock()
    expect(() => r.lock()).not.toThrow()// Repeated lock is ignored
    expect(r.isLocked()).toBeTruthy()
    expect(() => r.clearAnswers(0)).toThrow()
    expect(() => r.setAnswer(0, 1729)).toThrow()
    expect(() => r.removeAnswer(0, 1729)).toThrow()
  })

  it('Lock works 2', () => {
    let r = createR(questions1())
    r.setAnswer(0, 0)
    r.lock()
    expect(r.isLocked()).toBeTruthy()
    expect(r.isAttempted(0)).toBeTruthy()
  })

  describe('ExamResult - duration tests:', () => {
    let er = createR2(questions2(), [[0], [1, 2]], [2, 5])
    xit('duration works', () => {
      expect(er.duration(0)).toBe(2)
      expect(er.duration(1)).toBe(5)
    })
    xit('duration total works', () => {
      expect(er.durationTotal()).toBe(7)
    })
    it('duration inc works', () => {
      er.durationInc(0)
      expect(er.duration(0)).toBe(3)
      expect(er.duration(1)).toBe(5)
      er.durationInc(1)
      expect(er.duration(0)).toBe(3)
      expect(er.duration(1)).toBe(6)
      er.durationInc(1)
      expect(er.duration(0)).toBe(3)
      expect(er.duration(1)).toBe(7)
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
      let r = create1QR(AnswerType.MAQ, choices6, sols1, [], ExamStatus.DONE)
      expect(r.isLocked()).toBeTruthy()
      expect(() => r.clearAnswers(0)).toThrow()
      expect(() => r.setAnswer(0, 1729)).toThrow()
      expect(() => r.removeAnswer(0, 1729)).toThrow()
    })
  })

  describe('ExamResult - single sol tests:', () => {
    let choices: string[] = ['choice 1', 'choice 2']
    let sols: number[] = [0]
    let r = create1QR(AnswerType.TFQ, choices, sols)

    xit('No answers, so not attempted', () => {
      expect(r.isAttempted(0)).toBeFalsy()
    })
    it('Some answers, so attempted', () => {
      r.setAnswer(0, 1)
      expect(r.isAttempted(0)).toBeTruthy()
    })
    it('Multiple answers for tfq, mcq and arq, not alllowed', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 1)
      expect(r.isAnswer(0, 1)).toBeTruthy()
      r.setAnswer(0, 0)
      expect(r.isAnswer(0, 0)).toBeTruthy()
      expect(r.isAnswer(0, 1)).toBeFalsy()
    })
    it('Out-of-bounds answer not allowed', () => {
      r.clearAnswers(0)
      expect(() => r.setAnswer(0, 2)).toThrow()
    })
    it('Clear answers - working', () => {
      r.clearAnswers(0)
      expect(r.isAttempted(0)).toBeFalsy()
    })
    xit('No answers, so not correct', () => {
      expect(r.isCorrect(0)).toBeFalsy()
    })
    it('Right answer so correct', () => {
      r.setAnswer(0, 0)
      expect(r.isCorrect(0)).toBeTruthy()
      r.clearAnswers(0)
    })
    it('Wrong answer so not correct', () => {
      r.setAnswer(0, 1)
      expect(r.isCorrect(0)).toBeFalsy()
      r.clearAnswers(0)
    })
  })

  describe('ExamResult - many sol tests::', () => {
    let choices: string[] = ['choice 1', 'choice 2', 'choice 3']
    let sols: number[] = [0, 2]
    let r = create1QR(AnswerType.MAQ, choices, sols)

    it('Out-of-bounds answer not allowed', () => {
      r.clearAnswers(0)
      expect(() => r.setAnswer(0, 3)).toThrow()
    })
    it('Duplicate answer not allowed', () => {
      r.clearAnswers(0)
      expect(() => r.setAnswer(0, 1)).not.toThrow()
      expect(() => r.setAnswer(0, 1)).toThrow()
    })
    it('One wrong answer alone so not correct', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 1)
      expect(r.isCorrect(0)).toBeFalsy()
    })
    it('One right answer alone, so not correct', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 0)
      expect(r.isCorrect(0)).toBeFalsy()
    })
    it('All and only right answers, so correct', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 0)
      r.setAnswer(0, 2)
      expect(r.isCorrect(0)).toBeTruthy()
    })
    it('All right but one wrong answer too, so not correct', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 0)
      r.setAnswer(0, 2)
      r.setAnswer(0, 1)
      expect(r.isCorrect(0)).toBeFalsy()
    })
    it('Remove Answer exception - working', () => {
      expect(r.removeAnswer(0, 21)).toBeFalsy()
    })
    it('All and only right answers, so correct - remove working', () => {
      r.clearAnswers(0)
      r.setAnswer(0, 0)
      r.setAnswer(0, 2)
      r.setAnswer(0, 1)
      r.removeAnswer(0, 1)
      expect(r.isCorrect(0)).toBeTruthy()
      r.clearAnswers(0)
    })
  })

  describe('ExamResult - no choice tests:', () => {
    let r = create1QR(AnswerType.NCQ, [], [-3.141])

    it('accept any one answer', () => {
      r.clearAnswers(0)
      expect(() => r.setAnswer(0, 3)).not.toThrow()
      expect(() => r.setAnswer(0, -3.141)).not.toThrow()
    })
    it('isAttempted working', () => {
      r.clearAnswers(0)
      expect(r.isAttempted(0)).toBeFalsy()
      expect(() => r.setAnswer(0, 3)).not.toThrow()
      expect(r.isAttempted(0)).toBeTruthy()
    })
    it('isCorrect working', () => {
      r.clearAnswers(0)
      expect(() => r.setAnswer(0, 3)).not.toThrow()
      expect(r.isCorrect(0)).toBeFalsy()
      expect(() => r.setAnswer(0, -3.141)).not.toThrow()
      expect(r.isCorrect(0)).toBeTruthy()
    })
  })

  describe('ExamResult - marks :', () => {
    let er = (q: Question, ans: number[], ms: MarkingSchemeType = MarkingSchemeType.GENERAL) => {
      let e = new Exam('00', 'TEST E', [q], new Date(), "", "", ExamStatus.DONE, ms)
      return new ExamResult(e.id, e.title, new Date(), e, false, [ans], ExamStatus.DONE)
    }
    let JA = MarkingSchemeType.JEEADV

    it('isPartial works', () => {
      expect(er(tfq(), [0]).isPartial(0)).toBeFalse()
      expect(er(tfq(), [1]).isPartial(0)).toBeFalse()
      expect(er(mcq(), [2]).isPartial(0)).toBeFalse()
      expect(er(mcq(), [1]).isPartial(0)).toBeFalse()

      expect(er(naq(), [5]).isPartial(0)).toBeTrue()
      expect(er(naq(), [0]).isPartial(0)).toBeFalse()
      expect(er(naq(), [10]).isPartial(0)).toBeFalse()
      //No change for NAQ
      expect(er(naq(), [5], JA).isPartial(0)).toBeTrue()
      expect(er(naq(), [0], JA).isPartial(0)).toBeFalse()
      expect(er(naq(), [10], JA).isPartial(0)).toBeFalse()

      expect(er(maq(), [0, 2]).isPartial(0)).toBeFalse()
      expect(er(maq(), [0, 1]).isPartial(0)).toBeFalse()
      expect(er(maq(), [0]).isPartial(0)).toBeFalse()
      //changes for JEE ADV
      expect(er(maq(), [0, 2], JA).isPartial(0)).toBeFalse()
      expect(er(maq(), [0, 1], JA).isPartial(0)).toBeFalse()
      expect(er(maq(), [0], JA).isPartial(0)).toBeTrue()//ONLY CHANGE!
    })
  })
})
