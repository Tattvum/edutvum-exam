import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { Question } from './question';
import { Exam } from './exam';
import { ExamResult } from './exam-result';
import { User } from './user';

// NOTE: Not used anywhere but in tests, just for sample testing
export function isin<T>(arr: Array<T>, val: T): boolean {
  return arr.indexOf(val) > -1
}

export class Holders {
  constructor(
    public exams: Exam[] = [],
    public results: ExamResult[] = []
  ) { }
}

export abstract class DataSource {
  abstract getHolders(user: User): Promise<Holders>
  abstract saveExam(user: User, result: ExamResult): Promise<string>
}

export abstract class SecuritySource {
  abstract user(): User
  abstract userWait(): Promise<User>
  abstract isLoggedIn(): boolean
  abstract login(): Promise<any>
  abstract logout(): Promise<void>
}

interface Cache {
  [id: string]: Exam
}

@Injectable()
export class DataService {
  private readonly WORKING = ' #pending'
  private cache: Cache = {}
  private currentExamResult: ExamResult

  public exams: Exam[] = []
  public results: ExamResult[] = []

  private pendingResult: ExamResult

  public testMe(n: number): number {
    return n * 2
  }

  constructor(private dataSource: DataSource, private securitySource: SecuritySource) {
    console.clear()
    this.userWait().then(user => {
      Lib.assert(Lib.isNil(user), 'user cannot be null')
      dataSource.getHolders(user).then(hs => {
        this.exams = hs.exams
        this.exams.forEach(e => this.cache[e.id] = e)
        this.results = hs.results
        this.results.forEach(r => this.cache[r.id] = r)
        Lib.assert(Object.keys(this.cache).length <= 0, 'cache cannot be empty')
      })
    })
  }

  public startExam(eid: string): string {
    console.log('starting exam!', eid)
    Lib.assert(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = this.cache[eid]
    Lib.assert(Lib.isNil(exam), 'exam cannot be undefined', eid)
    this.pendingResult = new ExamResult(eid, exam.title, new Date(), exam)
    return this.pendingResult.id
  }

  public getExam(eid: string): ExamResult {
    Lib.assert(Lib.isNil(eid), 'eid cannot be undefined')
    if (this.pendingResult && this.pendingResult.id === eid) return this.pendingResult

    let result = <ExamResult>this.cache[eid]
    Lib.assert(Lib.isNil(result), 'exam result cannot be undefined', eid)
    Lib.assert(!(result instanceof ExamResult), 'Either pendingResult of ExamResult', result)
    return result
  }

  public getQuestion(eid: string, qid: string): Question {
    return this.getExam(eid).questions[+qid]
  }

  public saveExam(): Promise<ExamResult> {
    this.pendingResult.lock()
    return new Promise<ExamResult>(resolve => {
      this.userWait().then(user => {
        Lib.assert(Lib.isNil(user), 'user cannot be null')
        this.dataSource.saveExam(user, this.pendingResult).then(key => {
          console.log(key + ' saved in server!')
          let o = this.pendingResult
          let result = new ExamResult(key, o.title, o.when, o.exam, o.answers, true)
          this.cache[key] = result
          this.results.splice(0, 0, result)
          resolve(result)
        })
      })
    })
  }

  public user(): User {
    return this.securitySource.user()
  }
  public userWait(): Promise<User> {
    return this.securitySource.userWait()
  }
  public isLoggedIn(): boolean {
    return this.securitySource.isLoggedIn()
  }
  public login(): Promise<any> {
    return this.securitySource.login()
  }
  public logout(): Promise<void> {
    return this.securitySource.logout()
  }
}
