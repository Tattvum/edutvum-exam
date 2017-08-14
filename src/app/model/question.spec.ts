import { AnswerType } from './answer-type';
import { Question } from './question';

describe('Question - declaration tests:', () => {
  let choices0: string[] = []
  let choices1: string[] = ['choice 1']
  let choices2: string[] = ['choice 1', 'choice 2']
  let choices3: string[] = ['choice 1', 'choice 2', 'choice 3']
  let choices5: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4', 'choice 5']
  let choices6: string[] = ['choice 1', 'choice 2', 'choice 3', 'choice 4', 'choice 5', 'choice 6']
  let sols0: number[] = []
  let solsX: number[] = [-3.14]
  let sols1: number[] = [0]
  let sols2: number[] = [0, 2]
  let sols3: number[] = [1, 2, 3]
  let createQ = (type: AnswerType, choices: string[], sols: number[], title = 'TEST...') => {
    return new Question(title, type, choices, sols)
  }

  it('Question should have title', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, sols1, null)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1, 'Not null')).not.toThrow()
  })
  it('Question should have type', () => {
    expect(() => createQ(null, choices2, sols1)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
  })

  it('Every solution should be a choice, but for NCQ', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, [1])).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, [2])).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, [2])).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, [3])).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices5, [1, 4])).not.toThrow()
    expect(() => createQ(AnswerType.MAQ, choices6, [6])).toThrow()
  })

  it('Question should have atleast one choice, but for NCQ', () => {
    expect(() => createQ(AnswerType.TFQ, choices0, sols1)).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices0, sols1)).toThrow()
    expect(() => createQ(AnswerType.ARQ, choices0, sols1)).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices0, sols1)).toThrow()
    expect(() => createQ(AnswerType.NCQ, choices0, [1])).not.toThrow()
  })

  it('TFQ can have only two choices', () => {
    expect(() => createQ(AnswerType.TFQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices3, sols1)).toThrow()
  })
  it('TFQ can have only one solution', () => {
    expect(() => createQ(AnswerType.TFQ, choices2, sols0)).toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.TFQ, choices2, [0, 1])).toThrow()
  })

  it('MCQ should have more than one choice', () => {
    expect(() => createQ(AnswerType.MCQ, choices1, sols1)).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices3, sols1)).not.toThrow()
  })
  it('MCQ can have only one solution', () => {
    expect(() => createQ(AnswerType.MCQ, choices2, sols0)).toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, sols1)).not.toThrow()
    expect(() => createQ(AnswerType.MCQ, choices2, [0, 1])).toThrow()
  })

  it('ARQ should have exactly 5 choices', () => {
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

  it('MAQ should have more than one choice', () => {
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
  it('MAQ cannot have more solutions than choices', () => {
    expect(() => createQ(AnswerType.MAQ, choices2, [0, 1, 1])).toThrow()
    expect(() => createQ(AnswerType.MAQ, choices3, [0, 1, 1, 2])).toThrow()
  })
  it('NCQ cannot have any choice and only one solutions', () => {
    expect(() => createQ(AnswerType.NCQ, choices0, [-3.14])).not.toThrow()
    expect(() => createQ(AnswerType.NCQ, choices0, [1, 2])).toThrow()
    expect(() => createQ(AnswerType.NCQ, choices0, [])).toThrow()
  })

})
