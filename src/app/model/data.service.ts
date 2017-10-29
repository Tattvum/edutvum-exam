import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { Question } from './question';
import { Exam } from './exam';
import { ExamResult, ExamResultStatus } from './exam-result';
import { User, UserRole, EMPTY_USER } from './user';

// NOTE: Not used anywhere but in tests, just for sample testing
export function isin<T>(arr: Array<T>, val: T): boolean {
  return arr.indexOf(val) > -1
}

export class Holders {
  constructor(
    public exams: Exam[] = [],
    public results: ExamResult[] = [],
    public users: User[] = [],
  ) { }
}

export enum ExamEditType {
  QuestionDisplay,
  QuestionExplanation,
  ExamExplanation,
  QuestionChoice,
  UNKNOWN_LAST // Just tag the end?
}

export abstract class DataSource {
  abstract getHolders(user: User): Promise<Holders>
  abstract createExam(user: User, eid: string): Promise<ExamResult>
  abstract updateExam(user: User, result: ExamResult): Promise<boolean>
  abstract deleteExam(user: User, rid: string): Promise<boolean>
  abstract editExamDetail(user: User, type: ExamEditType, diff: string, eid: string,
    qid?: string, cid?: number): Promise<boolean>
}

export abstract class SecuritySource {
  abstract user(): User
  abstract userWait(): Promise<User>
  abstract isLoggedIn(): boolean
  abstract login(): Promise<any>
  abstract logout(): Promise<void>
}

interface UserCache {
  [id: string]: User
}

interface Cache {
  [id: string]: Exam
}

@Injectable()
export class DataService {
  private userCache: UserCache = {}
  private cache: Cache = {}
  private pendingResult: ExamResult

  public exams: Exam[] = []
  public results: ExamResult[] = []
  public users: User[] = []
  public isAdmin = false
  public loading = false
  public activeUser: string
  public disableHotkeys = false

  private globalTimerAction: (number) => void
  private globalTimer = Observable.interval(1000).subscribe(t => {
    if (this.globalTimerAction) this.globalTimerAction(t)
  })

  init(user: User, dolast = () => { }) {
    Lib.assert(Lib.isNil(user), 'user cannot be null')
    this.loading = true
    this.activeUser = user.uid
    this.dataSource.getHolders(user).then(hs => {
      this.userCache = {}
      this.cache = {}
      this.users = hs.users
      this.users.forEach(u => this.userCache[u.uid] = u)
      this.exams = hs.exams
      this.exams.forEach(e => this.cache[e.id] = e)
      this.results = hs.results
      this.results.forEach(r => this.cache[r.id] = r)
      Lib.assert(Object.keys(this.cache).length <= 0, 'cache cannot be empty')
    }).then(dolast).then(() => this.loading = false)
  }

  constructor(private dataSource: DataSource, private securitySource: SecuritySource) {
    console.clear()
    this.isAdmin = false
    this.userWait().then(user => {
      // this.init(user)
      this.init(user, () => {
        let u = this.userCache[user.uid]
        if (u) this.isAdmin = u.role === UserRole.ADMIN
      })
    })
  }

  public timerOnlyMe(onlyMe: (number) => void) {
    this.globalTimerAction = onlyMe
  }

  public listResults(eid: string): ExamResult[] {
    return this.results
      .filter(r => r.exam.id === eid)
      .sort((a, b) => b.when.getTime() - a.when.getTime())
  }

  public switchUser(uid: string) {
    this.init(this.userCache[uid])
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
      // console.log(result.id, 'exam started!')
      this.cache[result.id] = result
      this.results.splice(0, 0, result)
      this.pendingResult = result
      return this.pendingResult.id
    })
  }

  public finishExam(): Promise<ExamResult> {
    this.globalTimerAction = null
    this.pendingResult.lock()
    let call = u => this.dataSource.updateExam(u, this.pendingResult)
    return this.withUserPromise(call, ok => {
      // console.log(this.pendingResult.id, 'exam finished!')
      return this.pendingResult
    })
  }

  public pauseExam(): Promise<ExamResult> {
    this.globalTimerAction = null
    return this.saveExam()
  }

  public saveExam(): Promise<ExamResult> {
    // DO NOT LOCK!
    let call = u => this.dataSource.updateExam(u, this.pendingResult)
    return this.withUserPromise(call, ok => {
      // console.log(this.pendingResult.id, 'exam saved!')
      return this.pendingResult
    })
  }

  public editExamDetail(type: ExamEditType, diff: string, qidn: string, cid?: number): Promise<boolean> {
    let q = this.pendingResult.questions[qidn]
    let eid = q.eid
    if (type === ExamEditType.ExamExplanation) eid = this.pendingResult.exam.id
    let call = u => this.dataSource.editExamDetail(u, type, diff, eid, q.id, cid)
    return this.withUserPromise(call, ok => {
      console.log(ExamEditType[type], 'edit saved!', ok)
      return ok
    })
  }

  public cancelExam(): Promise<boolean> {
    this.globalTimerAction = null
    let rid = this.pendingResult.id
    let call = u => this.dataSource.deleteExam(u, rid)
    return this.withUserPromise(call, ok => {
      // console.log(rid, 'exam canceled!')
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
  private userWait(): Promise<User> {
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

  // NOTE: Not used anywhere but in tests, just for sample testing
  public testMe(n: number): number {
    return n * 2
  }

}
