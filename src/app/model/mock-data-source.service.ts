import { Injectable } from '@angular/core';

import { DataSource, Holders } from './data.service'

import { Lib } from './lib';

import { AnswerType } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { User } from './user';
import { ExamResult } from './exam-result';

let createQ = (type: AnswerType, choices: string[], sols: number[], title = 'TEST Q...'): Question => {
  return new Question(title, type, choices, sols)
}
let createE = (questions: Question[], title = 'TEST E...', id = '99'): Exam => {
  return new Exam(id, title, questions)
}

const Q: (() => Question)[] = []
Q[0] = () => createQ(AnswerType.TFQ, ['C1', 'C2'], [0])
Q[1] = () => createQ(AnswerType.MCQ, ['C1', 'C2', 'C3'], [2])
Q[2] = () => createQ(AnswerType.ARQ, ['C1', 'C2', 'C3', 'C4', 'C5'], [3])
Q[3] = () => createQ(AnswerType.MAQ, ['C1', 'C2', 'C3'], [0, 2])

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

let makeExamRnd = (qs: number): Exam => {
  let questions = []
  for (let i = 0; i < qs; i++) questions.push(Lib.rnd(Q)())
  let title = Lib.rnd(ADJ) + ' ' + Lib.rnd(NOUN)
  let exam = new Exam('' + Lib.rndn(100, 500), title, questions)
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
  }

  public getHolders(user: User): Promise<Holders> {
    return Promise.resolve(this.holders)
  }

  public saveExam(user: User, result: ExamResult): Promise<string> {
    return Promise.resolve('#' + result.id)
  }
}
