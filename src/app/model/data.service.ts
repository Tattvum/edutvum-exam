import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { Question } from './question';
import { Exam } from './exam';
import { ExamResult, ExamResultStatus } from './exam-result';
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
  abstract createExam(user: User, eid: string): Promise<ExamResult>
  abstract updateExam(user: User, result: ExamResult): Promise<boolean>
  abstract deleteExam(user: User, rid: string): Promise<boolean>
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

  public getExam(eid: string): ExamResult {
    Lib.assert(Lib.isNil(eid), 'eid cannot be undefined')
    if (this.pendingResult && this.pendingResult.id === eid) return this.pendingResult

    let result = <ExamResult>this.cache[eid]
    Lib.assert(Lib.isNil(result), 'exam result cannot be undefined', eid)
    Lib.assert(!(result instanceof ExamResult), 'Either pendingResult of ExamResult', result)
    this.pendingResult = result
    return result
  }

  public getQuestion(eid: string, qid: string): Question {
    return this.getExam(eid).questions[+qid]
  }

  private withUserPromise<A, B>(call: (u: User) => Promise<A>, act: (a: A) => B): Promise<B> {
    return new Promise<B>(resolve => {
      this.userWait().then(user => {
        Lib.assert(Lib.isNil(user), 'user cannot be null')
        call(user).then((a: A) => resolve(act(a)))
      })
    })
  }

  public startExam(eid: string): Promise<string> {
    let call = u => this.dataSource.createExam(u, eid)
    return this.withUserPromise(call, result => {
      console.log(result.id, 'exam started!')
      this.cache[result.id] = result
      this.results.splice(0, 0, result)
      this.pendingResult = result
      return this.pendingResult.id
    })
  }

  public finishExam(): Promise<ExamResult> {
    this.pendingResult.lock()
    let call = u => this.dataSource.updateExam(u, this.pendingResult)
    return this.withUserPromise(call, ok => {
      console.log(this.pendingResult.id,  'exam finished!')
      return this.pendingResult
    })
  }

  public saveExam(): Promise<ExamResult> {
    // DO NOT LOCK!
    let call = u => this.dataSource.updateExam(u, this.pendingResult)
    return this.withUserPromise(call, ok => {
      console.log(this.pendingResult.id,  'exam saved!')
      return this.pendingResult
    })
  }

  public cancelExam(): Promise<boolean> {
    let rid = this.pendingResult.id
    let call = u => this.dataSource.deleteExam(u, rid)
    return this.withUserPromise(call, ok => {
      console.log(rid, 'exam canceled!')
      this.pendingResult = null
      delete this.cache[rid]
      let i = this.results.findIndex(er => er.id === rid)
      this.results.splice(i, 1)
      return true
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
