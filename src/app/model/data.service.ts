
import { interval as observableInterval, Observable } from 'rxjs';
import 'rxjs';


import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { Question } from './question';
import { Exam, ExamStatus } from './exam';
import { ExamResult } from './exam-result';
import { User, UserRole, EMPTY_USER } from './user';
import { AnswerType } from 'app/model/answer-type';
import { GeneralContext } from 'app/model/general-context';
import { QuestionGroup } from 'app/model/question-group';
import { Comment } from 'app/model/comment';

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
  ExamName,
  QuestionSolution,
  QuestionType,
  QuestionNotes,
  ExamNotes,
  QuestionChoicesAll,
  QuestionGroupDisplay,
  UNKNOWN_LAST // Just tag the end?
}

export class FileLink {
  constructor(
    public path: string,
    public url: string,
    public file: string,
    public id: string = null,
  ) { }
}

export abstract class DataSource {
  abstract getHolders(user: User): Promise<Holders>
  abstract createExam(user: User, eid: string): Promise<ExamResult>
  abstract updateExam(user: User, result: ExamResult): Promise<boolean>
  abstract deleteExam(user: User, rid: string): Promise<boolean>
  abstract editExamDetail(user: User, type: ExamEditType, diff: any,
    fullid: string, cid?: number): Promise<boolean>
  abstract addComment(user: User, eid: string, euid: string, qid: string, comment: Comment): Promise<boolean>
  abstract defineExam(user: User, exam: Exam): Promise<boolean>
  abstract addQuestion(user: User, eid: string, question: Question): Promise<boolean>
  abstract addLinkQuestion(user: User, eid: string, qid: string, leid: string, lqid: string): Promise<boolean>
  abstract publishExam(user: User, eid: string): Promise<boolean>
  abstract saveFile(user: User, eid: string, qid: string, fileLink: FileLink): Promise<string>
  abstract deleteFile(user: User, eid: string, qid: string, fid: string): Promise<boolean>
  abstract addGroup(user: User, eid: string, qgroup: QuestionGroup): Promise<boolean>
  abstract deleteQuestion(user: User, fullid: string): Promise<boolean>
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
  public titleFilter = ''
  public showAll = false

  private globalTimerAction: (number) => void
  private globalTimer = observableInterval(1000).subscribe(t => {
    if (this.globalTimerAction) this.globalTimerAction(t)
  })

  public filteredExams(): Exam[] {
    let revChron = (a, b) => b.when.getTime() - a.when.getTime()
    let cistrcomp = (a, b) => a.toUpperCase().indexOf(b.toUpperCase()) !== -1
    let tFilter = (e: Exam) => cistrcomp(e.title, this.titleFilter)
    if (this.showAll) {
      return this.exams.filter(tFilter)
    } else {
      let eids = [...new Set(this.results.map(r => r.exam.id))]
      let topr = eid => this.results.filter(r => r.exam.id === eid).sort(revChron)[0]
      return eids.map(topr).sort(revChron).map(r => r.exam).filter(tFilter)
    }
  }

  init(user: User, dolast = () => { }) {
    Lib.failifold(Lib.isNil(user), 'user cannot be null')
    this.loading = true
    this.activeUser = user.uid
    this.dataSource.getHolders(user).then(hs => {
      this.userCache = {}
      this.cache = {}
      this.users = hs.users
      this.users.forEach(u => this.userCache[u.uid] = u)
      this.exams = hs.exams
      this.exams.forEach(e => this.cache[e.id] = e)
      this.exams.filter(e => e.isPending()).forEach(e => this.shadowPendingExam(e.id))
      this.results = hs.results
      this.results.forEach(r => this.cache[r.id] = r)
      Lib.failifold(Object.keys(this.cache).length <= 0, 'cache cannot be empty')
    }).then(dolast).then(() => this.loading = false)
  }

  constructor(private dataSource: DataSource,
    private context: GeneralContext,
    private securitySource: SecuritySource) {
    console.clear()
    this.isAdmin = false
    this.userWait().then(user => {
      this.init(user, () => {
        let u = this.userCache[user.uid]
        if (u) {
          this.isAdmin = u.role === UserRole.ADMIN
          this.showAll = this.isAdmin
          this.exams = this.exams.filter(e => !e.isPending() || this.isAdmin)
        }
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
    Lib.failifold(Lib.isNil(eid), 'eid cannot be undefined')
    if (this.pendingResult && this.pendingResult.id === eid) return this.pendingResult

    let result = <ExamResult>this.cache[eid]
    Lib.failifold(Lib.isNil(result), 'exam result cannot be undefined', eid)
    Lib.failifold(!(result instanceof ExamResult), 'Either pendingResult of ExamResult', result)
    this.pendingResult = result
    return result
  }

  public getQuestion(eid: string, qid: string): Question {
    return this.getExam(eid).questions[+qid]
  }

  private withUserPromise<A, B>(call: (u: User) => Promise<A>, act: (a: A) => B): Promise<B> {
    return new Promise<B>(resolve => {
      this.userWait().then(user => {
        Lib.failifold(Lib.isNil(user), 'user cannot be null')
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

  private editQuestionDetail(diff: any, qidn: number, type: ExamEditType, cid?: number): Promise<boolean> {
    let q = this.pendingResult.questions[qidn]
    let call = u => this.dataSource.editExamDetail(u, type, diff, q.fullid(), cid)
    return this.withUserPromise(call, ok => {
      console.log(ExamEditType[type], 'edit saved!', ok)
      return ok
    })
  }
  public editQuestionDisplay(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionDisplay)
  }
  public editQuestionExplanation(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionExplanation)
  }
  public editQuestionChoice(diff: any, qidn: number, cid: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionChoice, cid)
  }
  public editQuestionSolution(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionSolution)
  }
  public editQuestionType(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionType)
  }
  public editQuestionNotes(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionNotes)
  }
  public editQuestionChoicesAll(diff: any, qidn: number): Promise<boolean> {
    return this.editQuestionDetail(diff, qidn, ExamEditType.QuestionChoicesAll)
  }

  public editQuestionGroupDisplay(diff: any, fullid: string): Promise<boolean> {
    let type = ExamEditType.QuestionGroupDisplay
    let call = u => this.dataSource.editExamDetail(u, type, diff, fullid)
    return this.withUserPromise(call, ok => {
      console.log(ExamEditType[type], 'edit saved!', ok)
      return ok
    })
  }

  private editExamDetail(diff: any, eid: string, type: ExamEditType): Promise<boolean> {
    let call = u => this.dataSource.editExamDetail(u, type, diff, eid)
    return this.withUserPromise(call, ok => {
      console.log(ExamEditType[type], 'edit saved!', ok)
      return ok
    })
  }
  public editExamTitle(diff: any, eid: string): Promise<boolean> {
    return this.editExamDetail(diff, eid, ExamEditType.ExamName)
  }
  public editExamExplanation(diff: any, eid: string): Promise<boolean> {
    return this.editExamDetail(diff, eid, ExamEditType.ExamExplanation)
  }
  public editExamNotes(diff: any, eid: string): Promise<boolean> {
    return this.editExamDetail(diff, eid, ExamEditType.ExamNotes)
  }

  public addComment(title: string, qidn: number): Promise<Comment> {
    let r = this.pendingResult
    let q = r.exam.questions[qidn]
    let comment = null
    let makeComment = (u: User) => {
      comment = new Comment(title, new Date(), u)
      return comment
    }
    let call = u => this.dataSource.addComment(u, r.id, r.user.uid, q.id, makeComment(u))
    return this.withUserPromise(call, ok => {
      return comment
    })
  }

  public pendingId(eid: string) {
    return eid + '.pending'
  }

  private shadowPendingExam(eid: string) {
    let exam = this.cache[eid]
    let rid = this.pendingId(eid)
    let er = new ExamResult(rid, exam.title, new Date(), exam)
    er.lock()
    this.cache[rid] = er
    this.results.splice(0, 0, er)
  }

  defineExam(eid: string): Promise<boolean> {
    let qid = eid + 'q01'
    let newQuestion = new Question(qid, 'New Question', AnswerType.MCQ,
      ['Choice 1', 'Choice 2'], [0], 'Question Notes:', 'Question Explanation', eid)
    let newExam = new Exam(eid, 'New Exam ' + eid, [newQuestion], new Date(),
      'Exam Notes:', 'Exam Explanation', ExamStatus.PENDING)
    let call = u => this.dataSource.defineExam(u, newExam)
    return this.withUserPromise(call, ok => {
      console.log('pure exam saved!')
      this.exams.splice(0, 0, newExam)
      this.cache[newExam.id] = newExam
      this.shadowPendingExam(newExam.id)
      return ok
    })
  }

  addQuestion(qidn: number, groups: QuestionGroup[] = []): Promise<number> {
    let exam = this.pendingResult.exam
    let eid = exam.id
    console.log('addQuestion-1', qidn, QuestionGroup.path(groups), groups.length)
    if (qidn >= 0) groups = exam.questions[qidn].groups.slice(0)
    let qid = eid + 'q' + Lib.n2s(exam.questions.length + 1)
    let newQuestion = new Question(qid, 'New Question', AnswerType.MCQ, ['Choice 1', 'Choice 2'],
      [0], 'Question Notes:', 'Question Explanation', eid, [], groups)
    let call = u => this.dataSource.addQuestion(u, eid, newQuestion)
    return this.withUserPromise(call, ok => {
      let newn = 0
      if (qidn < 0) {
        newn = exam.questions.length
        exam.questions.push(newQuestion)
      } else {
        newn = qidn + 1
        exam.questions.splice(newn, 0, newQuestion)
      }
      console.log('addQuestion-2', 'new question saved!', newn, newQuestion.fullid())
      return newn
    })
  }

  private assertAlert(condition: boolean, message: string, ...things) {
    if (!condition) {
      let errorMsg = message + '\n' + things.join(', ')
      this.context.alert(errorMsg)
      throw new Error(errorMsg)
    }
  }

  addLinkQuestion(fullid: string): Promise<boolean> {
    let result = this.pendingResult
    let eid = result.exam.id
    let qid = eid + 'q' + Lib.n2s(result.questions.length + 1)
    let ids = fullid.split('.')
    this.assertAlert(ids.length === 2, 'eid.qid should have one and only one dot', fullid)
    console.log(ids)
    let leid = ids[0]
    let lqid = ids[1]
    let linkExam = this.cache[leid]
    this.assertAlert(linkExam != null, 'Invalid eid:', leid, fullid)
    let linkQuestion = linkExam.questions.find(q => q.fullid() === fullid)
    this.assertAlert(linkQuestion != null, 'Invalid qid:', lqid, fullid)
    let call = u => this.dataSource.addLinkQuestion(u, eid, qid, leid, lqid)
    return this.withUserPromise(call, ok => {
      this.pendingResult.exam.questions.push(linkQuestion)
      console.log('new LINK question saved!')
      return ok
    })
  }

  public publishExam(eid: string): Promise<boolean> {
    let call = u => this.dataSource.publishExam(u, eid)
    return this.withUserPromise(call, ok => {
      this.cache[eid].status = ExamStatus.DONE
      return true
    })
  }

  public saveFile(qidn: number, fileLink: FileLink): Promise<string> {
    let result = this.pendingResult
    let q = this.pendingResult.questions[qidn]
    let qid = q.id
    let eid = q.eid
    let call = u => this.dataSource.saveFile(u, eid, qid, fileLink)
    return this.withUserPromise(call, fid => {
      fileLink.id = fid
      result.exam.questions[qidn].files.push(fileLink)
      console.log('file link saved!', fileLink)
      return fid
    })
  }

  public deleteFile(qidn: number, fid: string): Promise<boolean> {
    let result = this.pendingResult
    let q = this.pendingResult.questions[qidn]
    let qid = q.id
    let eid = q.eid
    let call = u => this.dataSource.deleteFile(u, eid, qid, fid)
    return this.withUserPromise(call, ok => {
      let files = result.exam.questions[qidn].files
      console.log('file link deleting...', files.length)
      let i = files.findIndex(f => f.id === fid)
      console.log(i, files[i].id)
      if (i >= 0) {
        // https://stackoverflow.com/questions/40462369/remove-item-from-stored-array-in-angular-2
        // "You can't use delete to remove an item from an array."
        files.splice(i, 1)
        console.log('file link deleted!', i, fid, files.length)
      }
      return ok
    })
  }

  public getQuestionId(qidn: number): string {
    return this.pendingResult.exam.questions[qidn].id
  }

  startGroup(qidn: number): Promise<boolean> {
    let exam = this.pendingResult.exam
    let eid = exam.id
    let groups: QuestionGroup[] = []
    let qgpath = ''
    if (qidn >= 0) {
      let q = exam.questions[qidn]
      console.log('startGroup-1', qidn, q.fullid())
      groups = q.groups.slice(0)
      qgpath = QuestionGroup.path(groups)
    }
    let qgid = 'g' + Lib.rndn(899, 100)
    let qg = new QuestionGroup(qgid, qgpath, 'New Group ' + qgid, eid)
    groups.push(qg)
    console.log('startGroup-2', qidn, QuestionGroup.path(groups))
    let call = u => this.dataSource.addGroup(u, eid, qg)
    return this.withUserPromise(call, ok => {
      console.log('startGroup-3', 'new GROUP started!', qidn, qg.fullid())
    }).then(() => {
      return this.addQuestion(qidn, groups).then(n => {
        console.log('startGroup-4', 'addGroup addQuestion done', qidn, n)
        return true
      })
    })
  }

  deleteQuestion(qidn: number): Promise<boolean> {
    let q = this.pendingResult.exam.questions[qidn]
    let call = u => this.dataSource.deleteQuestion(u, q.fullid())
    return this.withUserPromise(call, ok => {
      this.pendingResult.exam.questions.splice(qidn, 1)
      console.log('question deleted!', q.fullid())
      return ok
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
