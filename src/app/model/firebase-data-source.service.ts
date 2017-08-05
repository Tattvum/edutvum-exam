import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { DataSource, Holders } from './data.service'

import { Lib } from './lib';

import { AnswerType, TFQChoices, ARQChoices } from './answer-type';
import { Question } from './question';
import { Exam } from './exam';
import { ExamResult } from './exam-result';
import { User } from './user';

const URL_VER = 'ver3/'
const EXAMS_URL = URL_VER + 'exams'
const RESULTS_URL = URL_VER + 'results/'
const QUESTION_URL = URL_VER + 'questions'

function fbObjToArr(obj): any[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach(function (key, index) {
    arr[+key] = obj[key]
  })
  return arr
}

function createA(type: AnswerType, given): string[] {
  let choices = given !== undefined ? fbObjToArr(given).slice(0) : null
  switch (type) {
    case AnswerType.TFQ:
      choices = TFQChoices.slice(0)
      break;
    case AnswerType.ARQ:
      choices = ARQChoices.slice(0)
      break;
  }
  return choices
}

function createQ(obj): Question {
  let title = obj.display
  let type = AnswerType['' + obj.type]
  let choices = createA(type, obj.choices)
  // console.log('question:', obj.$key, type, obj.solutions.length)
  let solutions = fbObjToArr(obj.solutions)
  return new Question(title, type, choices, solutions)
}

function createE(obj, qs): Exam {
  let id = obj.$key
  let title = obj.name
  let when = new Date(obj.when)
  let questions = []
  obj.questions.forEach(qid => questions.push(qs[qid]))
  return new Exam(id, title, questions, when)
}

function createR(obj, es): ExamResult {
  let id = obj.$key
  let exam = es[obj.exam]
  let title = exam.title
  let when = new Date(obj.when)
  let answers: number[][] = fbObjToArr(obj.answers)
  // console.log(id, answers.length)
  return new ExamResult(id, title, when, exam, answers, true)
}


@Injectable()
export class FirebaseDataSource implements DataSource {
  private holders = new Holders()

  private readonly revwhen = { query: { orderByChild: 'revwhen' } }
  private allqs = {}
  private alles = {}

  constructor(private afDb: AngularFireDatabase) { }

  getHolders(user: User): Promise<Holders> {
    Lib.assert(Lib.isNil(user), 'User should be authenticated')
    return this.fetchAll(user).then(() => {
      return Promise.resolve(this.holders)
    })
  }

  private resultsUrl(user: User): string {
    return RESULTS_URL + user.uid + '/'
  }

  private fetch(title: string, url: string,
    doit: (thing: any) => void,
    sayit: () => void): Observable<void> {
    // console.log(title, '-------', url);
    return this.afDb.list(url, this.revwhen).first().map(things => {
      // console.log('computing ' + title + '... ', things.length)
      things.forEach(thing => doit(thing))
      // console.log('all ' + title + ': ', sayit())
    })
  }

  private fetchAll(user: User): Promise<void> {
    this.allqs = {}
    this.alles = {}
    return this.fetchQ().flatMap(() => {
      return this.fetchE()
    }).flatMap(() => {
      return this.fetchR(user)
    }).toPromise()
  }

  private fetchQ(): Observable<void> {
    return this.fetch('questions', QUESTION_URL,
      q => this.allqs[q.$key] = createQ(q),
      () => Object.keys(this.allqs).length)
  }

  private fetchE(): Observable<void> {
    return this.fetch('exams', EXAMS_URL,
      e => {
        let exam = createE(e, this.allqs)
        this.alles[e.$key] = exam
        this.holders.exams.push(exam)
      },
      () => this.holders.exams.length)
  }

  private fetchR00(user: User): Observable<void> {
    return this.fetch('results', this.resultsUrl(user),
      userRs => {
        fbObjToArr(userRs).forEach(r => this.holders.results.push(createR(r, this.alles)))
      },
      () => this.holders.results.length)
  }

  private fetchR(user: User): Observable<void> {
    return this.afDb.list(this.resultsUrl(user), this.revwhen).first().map(userRs => {
      fbObjToArr(userRs).forEach(r => this.holders.results.push(createR(r, this.alles)))
      // console.log('all ' + 'results' + ': ', this.holders.results.length)
    })
  }

  public saveExam(user: User, result: ExamResult): Promise<void> {
    let ro = {}
    ro['exam'] = result.exam.id
    ro['answers'] = result.answers
    ro['when'] = Date.now()
    ro['revwhen'] = -Date.now()
    console.log('saveResult', ro, this.resultsUrl(user))
    return new Promise<void>(resolve => {
      this.afDb.list(this.resultsUrl(user)).push(ro).then((call) => {
        console.log(call)
        resolve()
      })
    })
  }
}
