import { QuestionGroup } from './question-group';

describe('QuestionGroup -', () => {
  it('fullid checks -', () => {
    let qg = new QuestionGroup('ID', 'PATH', '', 'EXAM_ID')
    expect(qg.fullid()).toBe('EXAM_ID.PATH.ID')
  })
  it('fullid with null path checks -', () => {
    let qg = new QuestionGroup('ID', '', '', 'EXAM_ID')
    expect(qg.fullid()).toBe('EXAM_ID.ID')
  })
})

