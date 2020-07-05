import { AnswerType } from './answer-type';
import { Question } from './question';
import { QuestionGroup } from '../model/question-group';

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
  let tfq = () => createQ(AnswerType.TFQ, ['C1', 'C2'], [0])
  let mcq = () => createQ(AnswerType.MCQ, ['C1', 'C2', 'C3'], [2])
  let arq = () => createQ(AnswerType.ARQ, ['C1', 'C2', 'C3', 'C4', 'C5'], [3])
  let maq = () => createQ(AnswerType.MAQ, ['C1', 'C2', 'C3'], [0, 2])
  let ncq = () => createQ(AnswerType.NCQ, [], [-3.141])

  let createQ = (type: AnswerType, choices: string[], sols: number[], title = 'TEST...') => {
    return new Question('00', title, type, choices, sols)
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
    expect(() => createQ(AnswerType.NCQ, choices1, [1])).toThrow()
  })

  it('isSolution works', () => {
    expect(tfq().isSolution(0)).toBeTruthy()
    expect(tfq().isSolution(1)).toBeFalsy()
    expect(mcq().isSolution(2)).toBeTruthy()
    expect(mcq().isSolution(1)).toBeFalsy()
    expect(arq().isSolution(3)).toBeTruthy()
    expect(arq().isSolution(6)).toBeFalsy()
    expect(maq().isSolution(2)).toBeTruthy()
    expect(maq().isSolution(0)).toBeTruthy()
    expect(maq().isSolution(4)).toBeFalsy()
    expect(ncq().isSolution(-3.141)).toBeTruthy()
    expect(ncq().isSolution(4)).toBeFalsy()
  })

  it('fullid checks -', () => {
    let g1 = new QuestionGroup('GID1', 'PATH', '', 'EID')
    let g2 = new QuestionGroup('GID2', 'PATH', '', 'EID')
    let q = new Question('ID', '', AnswerType.TFQ, ['', ''], [0], '', '', 'EID', null, [g1, g2])
    expect(q.fullid()).toBe('EID.GID1.GID2.ID')
  })

  it('fullid null path checks -', () => {
    let q = new Question('ID', '', AnswerType.TFQ, ['', ''], [0], '', '', 'EID', null)
    expect(q.fullid()).toBe('EID.ID')
  })

})
