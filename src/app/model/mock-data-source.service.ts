import { Injectable } from '@angular/core';

import { DataSource, Holders, ExamEditType } from './data.service'

import { Lib } from './lib';

import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { User, UserRole } from './user';
import { ExamResult } from './exam-result';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = 'TEST Q...'): Question => {
  return new Question('00', title, type, choices, sols)
}
let createE = (questions: Question[], title = 'TEST E...', id = '99'): Exam => {
  return new Exam(id, title, questions)
}

const Q: (() => Question)[] = []
Q[0] = () => createQ(AnswerType.TFQ, ['C1', 'C2'], [0])
Q[1] = () => createQ(AnswerType.MCQ, ['C1', 'C2', 'C3'], [2])
Q[2] = () => createQ(AnswerType.ARQ, ['C1', 'C2', 'C3', 'C4', 'C5'], [3])
Q[3] = () => createQ(AnswerType.MAQ, ['C1', 'C2', 'C3'], [0, 2])
Q[4] = () => createQ(AnswerType.NCQ, [], [-3.141])

const ADJ = [
  'Clean',
  'Good',
  'Beautiful',
  'Vibrant',
  'Great'
]

const NOUN = [
  'Garuda',
  'John',
  'Ninja',
  'Cat',
  'Donkey'
]

export const USERS: User[] = [
  { uid: 'u1', name: 'Bingo User', email: 'bingo@gmail.com', role: UserRole.USER },
  { uid: 'u2', name: 'User Two', email: 'cisco@gmail.com', role: UserRole.ADMIN },
  { uid: 'u3', name: '3rd User', email: 'django@gmail.com', role: UserRole.USER },
]

let alles: { [key: string]: Exam } = {}

let makeExamRnd = (qs: number): Exam => {
  let questions = []
  for (let i = 0; i < qs; i++) questions.push(Lib.rnd(Q)())
  let title = Lib.rnd(ADJ) + ' ' + Lib.rnd(NOUN)
  let exam = new Exam('' + Lib.rndn(100, 500), title, questions)
  alles[exam.id] = exam
  return exam
}

let makeExamsRnd = (es: number): Exam[] => {
  let examHolders = []
  for (let i = 0; i < es; i++) examHolders.push(makeExamRnd(Lib.rndn(5, 5)))
  return examHolders
}

@Injectable()
export class MockDataSource implements DataSource {
  private holders = new Holders()

  constructor() {
    this.holders.exams = makeExamsRnd(10)
    this.holders.users = USERS
  }

  public getHolders(user: User): Promise<Holders> {
    return Promise.resolve(this.holders)
  }

  public createExam(user: User, eid: string): Promise<ExamResult> {
    console.log('starting exam!', eid)
    Lib.assert(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = alles[eid]
    Lib.assert(Lib.isNil(exam), 'exam cannot be undefined', eid)
    let result = new ExamResult(eid, exam.title, new Date(), exam)
    return Promise.resolve(result)
  }

  public updateExam(user: User, result: ExamResult): Promise<boolean> {
    return Promise.resolve(true)
  }

  public deleteExam(user: User, rid: string): Promise<boolean> {
    return Promise.resolve(true) // TBD
  }

  public editExamDetail(user: User, type: ExamEditType, diff: string, eid: string,
    qid: string): Promise<boolean> {
    return Promise.resolve(true) // TBD
  }
}
