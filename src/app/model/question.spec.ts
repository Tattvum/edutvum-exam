import { AnswerType } from './answer-type';
import { Question } from './question';

describe('Question - declaration tests:', () => {
  let choices1: string[] = ["choice 1"]
  let choices2: string[] = ["choice 1", "choice 2"]
  let choices3: string[] = ["choice 1", "choice 2", "choice 3"]
  let choices5: string[] = ["choice 1", "choice 2", "choice 3", "choice 4", "choice 5"]
  let choices6: string[] = ["choice 1", "choice 2", "choice 3", "choice 4", "choice 5", "choice 6"]
  let sols0: number[] = []
  let sols1: number[] = [0]
  let sols2: number[] = [0, 2]
  let createQ = function (type: AnswerType, choices: string[], sols: number[], title = "TEST...") {
    let q = new Question(title, type, choices, sols)
    return q
  }

  it('Question should have title', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, sols1, null)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1, "Not null")).not.toThrow()
  })
  it('Question should have type', () => {
    expect(() => createQ(null, choices2, sols1)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
  })
  it('Every solution should be a choice', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, [1])).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, [2])).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, [2])).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, [3])).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices5, [1, 4])).not.toThrow()
    expect(() => createQ(AnswerType.MAQ, choices6, [6])).toThrow()
  })

  it('TFQ can have only two choices', () => {
    expect(() => createQ(AnswerType.TFQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices3, sols1)).toThrow()
  })
  it('TFQ can have only one solution', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, sols0)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols2)).toThrow()
  })

  it('MCQ hould have more than one choice', () => {
    expect(() => createQ(AnswerType.MCQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, sols1)).not.toThrow()
  })
  it('MCQ can have only one solution', () => {
    expect(() => createQ(AnswerType.MCQ, choices2, sols0)).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, sols2)).toThrow()
  })

  it('ARQ hould have exactly 5 choices', () => {
    expect(() => createQ(AnswerType.ARQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.ARQ, choices3, sols1)).toThrow()
    expect(() => createQ(AnswerType.ARQ, choices5, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.ARQ, choices6, sols1)).toThrow()
  })
  it('ARQ can have only one solution', () => {
    expect(() => createQ(AnswerType.ARQ, choices5, sols0)).toThrow()
    expect(() => createQ(AnswerType.ARQ, choices5, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.ARQ, choices5, sols2)).toThrow()
  })

  it('MAQ hould have more than one choice', () => {
    expect(() => createQ(AnswerType.MAQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MAQ, choices6, sols1)).not.toThrow()
  })
  it('MAQ can have more than one solution', () => {
    expect(() => createQ(AnswerType.MAQ, choices6, sols0)).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices6, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MAQ, choices6, sols2)).not.toThrow()
    expect(() => createQ(AnswerType.MAQ, choices2, [0, 1])).not.toThrow()
  })
})

describe('Question - single sol tests:', () => {
  let choices: string[] = ["choice 1", "choice 2"]
  let sols: number[] = [0]
  let q = new Question("TESTING...", AnswerType.TFQ, choices, sols)

  it('No answers, so not attempted', () => {
    expect(q.isAttempted()).toBeFalsy()
  })
  it('Some answers, so attempted', () => {
    q.addAnswer(1)
    expect(q.isAttempted()).toBeTruthy()
  })
  it('Clear answers - working', () => {
    q.clearAnswers()
    expect(q.isAttempted()).toBeFalsy()
  })
  it('No answers, so not correct', () => {
    expect(q.isCorrect()).toBeFalsy()
  })
  it('Right answer so correct', () => {
    q.addAnswer(0)
    expect(q.isCorrect()).toBeTruthy()
    q.clearAnswers()
  })
  it('Wrong answer so not correct', () => {
    q.addAnswer(1)
    expect(q.isCorrect()).toBeFalsy()
    q.clearAnswers()
  })
})

describe('Question - many sol tests:', () => {
  let choices: string[] = ["choice 1", "choice 2", "choice 3"]
  let sols: number[] = [0, 2]
  let q = new Question("TESTING...", AnswerType.MAQ, choices, sols)

  it('One wrong answer alone so not correct', () => {
    q.addAnswer(1)
    expect(q.isCorrect()).toBeFalsy()
    q.clearAnswers()
  })
  it('One right answer alone so not correct', () => {
    q.addAnswer(0)
    expect(q.isCorrect()).toBeFalsy()
  })
  it('All and only right answers, so correct', () => {
    q.addAnswer(2)
    expect(q.isCorrect()).toBeTruthy()
  })
  it('All right but one wrong answer too, so not correct', () => {
    q.addAnswer(1)
    expect(q.isCorrect()).toBeFalsy()
  })
  it('All and only right answers, so correct - remove working', () => {
    q.removeAnswer(1)
    expect(q.isCorrect()).toBeTruthy()
    q.clearAnswers()
  })
})


