
import { interval as observableInterval } from 'rxjs';
import 'rxjs';


import { Injectable } from '@angular/core';

import { Lib } from './lib';
import { Question } from './question';
import { Exam, ExamStatus } from './exam';
import { ExamResult } from './exam-result';
import { User, UserRole, EMPTY_USER } from './user';
import { AnswerType } from '../model/answer-type';
import { GeneralContext } from '../model/general-context';
import { QuestionGroup } from '../model/question-group';
import { Comment } from '../model/comment';
import { Chart } from '../model/chart';
import { Tag } from './tag';
import { Marking } from './marking';
import { Upload } from './upload';

// NOTE: Not used anywhere but in tests, just for sample testing
export function isin<T>(arr: Array<T>, val: T): boolean {
  return arr.indexOf(val) > -1
}

export class ArrayCache<T> {
  constructor(
    public array: T[] = [],
    public cache: { [id: string]: T } = {},
  ) { }
}

export class Holders {
  public exams = new ArrayCache<Exam>()
  public results = new ArrayCache<ExamResult>()
  public users = new ArrayCache<User>()
  public tags = new ArrayCache<Tag>()
  public charts = new ArrayCache<Chart>()
  public markings = new ArrayCache<Marking>()
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
  QuestionTagsAll,
  QuestionGroupDisplay,
  ExamMarkingScheme,
  ExamMaxDuration,
  ExamTagsAll,
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
  abstract createExam(user: User, eid: string, isPractice?: boolean): Promise<ExamResult>
  abstract updateExam(user: User, result: ExamResult): Promise<boolean>
  abstract deleteExam(user: User, rid: string): Promise<boolean>
  abstract editExamDetail(user: User, type: ExamEditType, diff: any,
    fullid: string, cid?: number): Promise<boolean>
  abstract defineExam(user: User, exam: Exam): Promise<boolean>
  abstract addQuestion(user: User, eid: string, question: Question): Promise<boolean>
  abstract addLinkQuestion(user: User, eid: string, qid: string, leid: string, lqid: string): Promise<boolean>
  abstract publishExam(user: User, eid: string): Promise<boolean>
  abstract saveFile(user: User, question: Question, fileLink: FileLink): Promise<string>
  abstract deleteFile(user: User, eid: string, qid: string, fid: string): Promise<boolean>
  abstract addGroup(user: User, eid: string, qgroup: QuestionGroup): Promise<boolean>
  abstract deleteQuestion(user: User, fullid: string): Promise<boolean>
  abstract createTag(user: User, title: string): Promise<Tag>
  abstract updateTag(user: User, tag: Tag): Promise<boolean>
  abstract createChart(user: User): Promise<Chart>
  abstract updateChart(user: User, chart: Chart): Promise<boolean>
  abstract deleteChart(user: User, cid: string): Promise<boolean>
}

export abstract class SecurityAPI {
  abstract user(): User
  abstract userWait(): Promise<User>
  abstract isLoggedIn(): boolean
  abstract login(): Promise<any>
  abstract logout(): Promise<void>
}

export abstract class UploaderAPI {
  abstract uploadUrl(upload: Upload): Promise<string>
  // abstract deleteFileStorage(eid: string, qidn: number, f: FileLink): Promise<boolean>
}

export interface UserDisplayContext {
  user(): User
  logout(): Promise<void>
}

export interface TagsDisplayContext {
  tags: Tag[]
  isAdmin: boolean
  disableHotkeys: boolean
  getTag(tid: string): Tag
  editTagsAll(diff: Tag[], id: number | string): Promise<boolean>
  createTag(title: string): Promise<Tag>
  updateTag(tag: Tag): Promise<boolean>
}

export interface QuestionDisplayContext {
  editQuestionDisplay(diff: any, qidn: number): Promise<boolean>
  editQuestionGroupDisplay(diff: any, fullid: string): Promise<boolean>
}

export interface QuestionsManagerDisplayContext {
  disableHotkeys: boolean
  saveExam(): Promise<boolean>
  finishExam(): Promise<ExamResult>
}

export interface ChoiceInputDisplayContext {
  isAdmin: boolean
  disableHotkeys: boolean
  saveExam(): Promise<boolean>
  saveExamAdmin(): Promise<boolean>
  editQuestionChoice(diff: any, qidn: number, cid: number): Promise<boolean>
  editQuestionSolution(diff: any, qidn: number): Promise<boolean>
  editQuestionType(diff: any, qidn: number): Promise<boolean>
  editQuestionChoicesAll(diff: any, qidn: number): Promise<boolean>
}

export interface DetailsDisplayContext {
  isAdmin: boolean
  editQuestionExplanation(diff: any, qidn: number): Promise<boolean>
  editQuestionNotes(diff: any, qidn: number): Promise<boolean>
  editExamExplanation(diff: any, eid: string): Promise<boolean>
  editExamNotes(diff: any, eid: string): Promise<boolean>
}

export interface NavDisplayContext {
  isAdmin: boolean
  disableHotkeys: boolean
  timerOnlyMe(onlyMe: (i: number) => void): void
  finishExam(): Promise<ExamResult>
  finishExamYetContinue(): Promise<ExamResult>
  pauseExam(): Promise<boolean>
  saveExam(): Promise<boolean>
  cancelExam(): Promise<boolean>
  editExamTitle(diff: any, eid: string): Promise<boolean>
  editExamMarkingScheme(diff: any, eid: string): Promise<boolean>
  editExamMaxDuration(diff: any, eid: string): Promise<boolean>
  addQuestion(qidn: number, groups?: QuestionGroup[]): Promise<number>
  addLinkQuestion(fullid: string): Promise<boolean>
  startGroup(qidn: number): Promise<boolean>
  deleteQuestion(qidn: number): Promise<boolean>
  getResultSnapshots(rid: string): ExamResult[]
}

export interface UploadContext {
  getQuestionId(qidn: number): string
  saveFile(qidn: number, fileLink: FileLink): Promise<string>
}

@Injectable()
export class DataService
  implements UserDisplayContext, QuestionDisplayContext, NavDisplayContext,
  ChoiceInputDisplayContext, DetailsDisplayContext,
  QuestionsManagerDisplayContext, UploadContext {

  private holders: Holders // set it in constructor
  private cache: { [id: string]: Exam } = {}
  private pendingResult: ExamResult

  public isAdmin = false
  public loading = false
  public activeUser: User
  public disableHotkeys = false
  public titleFilter = ''
  public showAll = false

  public get charts() { return this.holders.charts.array }
  public get tags() { return this.holders.tags.array }
  public get results() { return this.holders.results.array }
  public get exams() { return this.holders.exams.array }
  public get users() { return this.holders.users.array }

  public getTag(tid: string): Tag {
    return this.holders.tags.cache[tid]
  }

  private globalTimerAction: (i: number) => void
  private globalTimer = observableInterval(1000).subscribe(t => {
    if (this.globalTimerAction) this.globalTimerAction(t)
  })

  public filterExams(all: boolean = true, filter: string = ""): Exam[] {
    let revChron = (a, b) => b.when.getTime() - a.when.getTime()
    let cistrcomp = (a, b) => a.toUpperCase().indexOf(b.toUpperCase()) !== -1
    let tFilter = (e: Exam) => cistrcomp(e.title, filter)
    if (all) {
      return this.holders.exams.array.filter(tFilter)
    } else {
      let eids = [...new Set(this.holders.results.array.map(r => r.exam.id))]
      let topr = eid => this.holders.results.array.filter(r => r.exam.id === eid).sort(revChron)[0]
      return eids.map(topr).sort(revChron).map(r => r.exam).filter(tFilter)
    }
  }

  public filterExamResults(all: boolean = true, filter: string = ""): Exam[] {
    let revChron = (a, b) => b.when.getTime() - a.when.getTime()
    let cistrcomp = (a, b) => a.toUpperCase().indexOf(b.toUpperCase()) !== -1
    let tFilter = (e: Exam) => cistrcomp(e.title, filter)
    if (all) {
      return this.holders.exams.array.filter(tFilter)
    } else {
      let eids = [...new Set(this.holders.results.array.map(r => r.exam.id))]
      let topr = eid => this.holders.results.array.filter(r => r.exam.id === eid).sort(revChron)[0]
      return eids.map(topr).sort(revChron).map(r => r.exam).filter(tFilter)
    }
  }

  public examStats() {
    return {
      all: this.filterExams(true).length,
      taken: this.holders.results.array.length,
      timeTaken: this.holders.results.array.map(r => r.durationTotal()).reduce((tot, d) => tot + d, 0),
      pending: this.holders.results.array.filter(r => r.status === ExamStatus.PENDING).length,
    }
  }

  public filteredExams(): Exam[] {
    return this.filterExams(this.showAll, this.titleFilter)
  }

  init(user: User, dolast = () => { }) {
    Lib.failifold(Lib.isNil(user), 'user cannot be null')
    this.loading = true
    this.activeUser = user
    this.dataSource.getHolders(user).then(hs => {
      this.holders = hs
      this.holders.exams.array.forEach(e => this.cache[e.id] = e)
      this.holders.exams.array.filter(e => e.isPending()).forEach(e => this.shadowPendingExam(e.id))
      this.holders.results.array.forEach(r => this.cache[r.id] = r)
      console.log(this.holders.markings.array)
      Lib.failifold(Object.keys(this.cache).length <= 0, 'cache cannot be empty')
    }).then(dolast).then(() => this.loading = false)
  }

  constructor(private dataSource: DataSource,
    private context: GeneralContext,
    private securitySource: SecurityAPI) {
    //console.clear()
    this.isAdmin = false
    this.userWait().then(user => {
      this.init(user, () => {
        let u = this.holders.users.cache[user.uid]
        if (u) {
          this.isAdmin = u.role === UserRole.ADMIN
          this.showAll = this.isAdmin
          this.holders.exams.array = this.holders.exams.array.filter(e => !e.isPending() || this.isAdmin)
        }
      })
    })
  }

  public timerOnlyMe(onlyMe: (i: number) => void): void {
    this.globalTimerAction = onlyMe
  }

  public listResults(eid: string): ExamResult[] {
    return this.holders.results.array
      .filter(r => r.exam.id === eid && !r.snapshot)
      .sort((a, b) => b.when.getTime() - a.when.getTime())
  }

  public switchUser(uid: string) {
    this.init(this.holders.users.cache[uid])
  }

  public getExamResult(eid: string): ExamResult {
    Lib.failifold(Lib.isNil(eid), 'eid cannot be undefined')
    if (this.pendingResult && this.pendingResult.id === eid) return this.pendingResult

    let result = <ExamResult>this.cache[eid]
    Lib.failifold(Lib.isNil(result), 'exam result cannot be undefined', eid)
    Lib.failifold(!(result instanceof ExamResult), 'Either pendingResult of ExamResult', result)
    this.pendingResult = result
    return result
  }

  public getPureExam(eid: string): Exam {
    Lib.failifold(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = this.cache[eid]
    Lib.failifold(Lib.isNil(exam), 'exam cannot be undefined', eid)
    return exam
  }

  public getQuestion(eid: string, qid: string): Question {
    return this.getExamResult(eid).questions[+qid]
  }

  public getResultSnapshots(rid: string): ExamResult[] {
    let out: ExamResult[] = (<ExamResult>this.cache[rid]).snapshotIds.map(srid => <ExamResult>this.cache[srid])
    out.push(<ExamResult>this.cache[rid])
    return out
  }

  private withUserPromise<A, B>(call: (u: User) => Promise<A>, act: (a: A) => B): Promise<B> {
    return new Promise<B>(resolve => {
      this.userWait().then(user => {
        Lib.failifold(Lib.isNil(user), 'user cannot be null')
        call(user).then((a: A) => resolve(act(a)))
      })
    })
  }

  public startExam(eid: string, isPractice: boolean = false): Promise<string> {
    let call = u => this.dataSource.createExam(u, eid, isPractice)
    return this.withUserPromise(call, result => {
      // console.log(result.id, 'exam started!')
      this.cache[result.id] = result
      this.holders.results.array.splice(0, 0, result)
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

  public async finishExamYetContinue(): Promise<ExamResult> {
    try {
      //Get current user
      let user = await this.userWait()
      Lib.failif(Lib.isNil(user), 'user cannot be null')
      //Create new exam result id
      let result = await this.dataSource.createExam(user, this.pendingResult.exam.id)
      result = ExamResult.clone(this.pendingResult, result.id)
      result.snapshot = true
      result.lock()
      this.cache[result.id] = result
      this.holders.results.array.splice(0, 0, result)
      //Save current result as is
      let ok = await this.dataSource.updateExam(user, result)
      Lib.failif(!ok, "Some error while saving the snapshot")
      //Save pending result too with snapshot links
      this.pendingResult.snapshotIds.push(result.id)
      ok = await this.dataSource.updateExam(user, this.pendingResult)
      Lib.failif(!ok, "Some error while the current exam result")
      //pretend like nothing happened
      return result
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public pauseExam(): Promise<boolean> {
    this.globalTimerAction = null
    return this.saveExam()
  }

  public saveExam(): Promise<boolean> {
    // DO NOT LOCK!
    let call = u => this.dataSource.updateExam(u, this.pendingResult)
    return this.withUserPromise(call, ok => {
      // console.log(this.pendingResult.id, 'exam saved!')
      return ok
    })
  }

  public saveExamAdmin(fn: (u: User) => void = (u) => { }): Promise<boolean> {
    // DO NOT LOCK!
    let r = this.pendingResult
    let call = u => {
      fn(u)
      return this.dataSource.updateExam(r.user, this.pendingResult)
    }
    return this.withUserPromise(call, ok => {
      console.log(this.pendingResult.id, 'saved as admin!')
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
      let i = this.holders.results.array.findIndex(er => er.id === rid)
      this.holders.results.array.splice(i, 1)
      return true
    })
  }

  public async createChart(): Promise<Chart> {
    try {
      let user = await this.userWait()
      Lib.failif(Lib.isNil(user), 'user cannot be null')
      if (this.isAdmin) user = this.activeUser
      let chart = await this.dataSource.createChart(user)
      Lib.failif(!chart, "Some error while updating the chart", chart)
      this.holders.charts.cache[chart.id] = chart
      this.holders.charts.array.push(chart)
      console.log("Chart Created:", chart.id)
      return chart
    } catch (error) {
      console.log(error)
      return null
    }
  }

  public async updateChart(chart: Chart): Promise<boolean> {
    try {
      let user = await this.userWait()
      Lib.failif(Lib.isNil(user), 'user cannot be null')
      if (this.isAdmin) user = this.activeUser
      let ok = await this.dataSource.updateChart(user, chart)
      Lib.failif(!ok, "Some error while updating the chart", chart)
      console.log("Chart Updated:", chart.id)
      return ok
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public async deleteChart(cid: string): Promise<boolean> {
    try {
      let user = await this.userWait()
      Lib.failif(Lib.isNil(user), 'user cannot be null')
      if (this.isAdmin) user = this.activeUser
      let ok = await this.dataSource.deleteChart(user, cid)
      Lib.failif(!ok, "Some error while deleting the chart", cid)
      const index = this.holders.charts.array.indexOf(this.holders.charts.cache[cid]);
      Lib.failif(index < 0, "Some error, the chart is missing!!", cid)
      this.holders.charts.array.splice(index, 1);
      delete this.holders.charts.cache[cid]
      console.log("Chart Deleted:", cid)
      return ok
    } catch (error) {
      console.log(error)
      return false
    }
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
  public editQuestionTagsAll(diff: Tag[], qidn: number): Promise<boolean> {
    let objdiff = diff.map(t => t.id)
    return this.editQuestionDetail(objdiff, qidn, ExamEditType.QuestionTagsAll)
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
  public editExamMarkingScheme(diff: any, eid: string): Promise<boolean> {
    return this.editExamDetail(diff, eid, ExamEditType.ExamMarkingScheme)
  }
  public editExamMaxDuration(diff: any, eid: string): Promise<boolean> {
    return this.editExamDetail(diff, eid, ExamEditType.ExamMaxDuration)
  }
  public editExamTagsAll(diff: Tag[], eid: string): Promise<boolean> {
    let objdiff = diff.map(t => t.id)
    return this.editExamDetail(objdiff, eid, ExamEditType.ExamTagsAll)
  }

  public createTag(title: string): Promise<Tag> {
    let call = u => this.dataSource.createTag(u, title)
    return this.withUserPromise(call, tag => {
      console.log('global tag saved!')
      this.holders.tags.array.push(tag)
      this.holders.tags.cache[tag.id] = tag
      return tag
    })
  }

  public async updateTag(tag: Tag): Promise<boolean> {
    try {
      let user = await this.userWait()
      Lib.failif(Lib.isNil(user), 'user cannot be null')
      if (!this.isAdmin) throw new Error("Only Admin can update Tag: " + this.activeUser.uid)
      let ok = await this.dataSource.updateTag(this.activeUser, tag)
      Lib.failif(!ok, "Some error while updating the tag", tag)
      console.log("Tag Updated:", tag.id, tag.title)
      return ok
    } catch (error) {
      console.log(error)
      return false
    }
  }

  public addComment(title: string, qidn: number): Promise<boolean> {
    let addCommentInternally = (u: User) => {
      let comment = new Comment(title, new Date(), u)
      this.pendingResult.addComment(qidn, comment)
    }
    return this.saveExamAdmin(addCommentInternally)
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
    this.holders.results.array.splice(0, 0, er)
  }

  validateExamId(eid: string) {
    if (!(/^[A-Za-z0-9]+$/i.test(eid))) throw new Error('Invaid: ' + eid + ' - Only alphanumeric')
    let exam = this.cache[eid]
    if (exam != null) throw new Error('Duplicate: ' + eid + ' - ' + exam.title)
  }

  defineExam(eid: string): Promise<boolean> {
    this.validateExamId(eid)
    let newExam = Exam.create(eid)
    let call = u => this.dataSource.defineExam(u, newExam)
    return this.withUserPromise(call, ok => {
      console.log('pure exam saved!')
      this.holders.exams.array.splice(0, 0, newExam)
      this.cache[newExam.id] = newExam
      this.shadowPendingExam(newExam.id)
      return ok
    })
  }

  addQuestion(qidn: number, groups: QuestionGroup[] = []): Promise<number> {
    let exam = this.pendingResult.exam
    let eid = exam.id
    console.log('addQuestion1:', qidn, QuestionGroup.path(groups), groups.length)
    if (qidn >= 0) groups = exam.questions[qidn].groups.slice(0)
    // let newqid = eid + 'q' + Lib.n2s(exam.questions.length + 1)
    let newqid = Exam.newqid(exam, qidn)
    let newQuestion = Question.create(newqid, eid, groups)
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
      console.log('addQuestion2:', 'new question saved!', newn, newQuestion.fullid())
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
    let call = u => this.dataSource.saveFile(u, q, fileLink)
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

  public pendingqidn2id(qidn: number): string {
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
    let qgid = Exam.newqid(exam, qidn)
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

  //----------------------------------------------------------------------------
  // Temporary browser session storage
  //----------------------------------------------------------------------------

  private states = {}

  get tab(): number { return this.states['tab'] ?? 0 }
  set tab(val: number) { this.states['tab'] = val }


  private NO_SELECTION: string = "JUNK : u7JqNwfU3W"
  get selection(): string { return this.states['selection'] ?? this.NO_SELECTION }
  get isUnselected(): boolean { return this.selection === this.NO_SELECTION }
  set selection(val: string) { this.states['selection'] = val }

  //Since we now have Topic and .Type level by default!
  get level(): number { return this.states['level'] ?? 2 }
  set level(val: number) { this.states['level'] = val }


}

export class TagsDisplayContextImpl implements TagsDisplayContext {
  constructor(private service: DataService, private type: "question" | "exam" = "question") { }
  get tags(): Tag[] { return this.service.tags }
  get isAdmin(): boolean { return this.service.isAdmin }
  get disableHotkeys(): boolean { return this.service.disableHotkeys }
  set disableHotkeys(value: boolean) { this.service.disableHotkeys = value }

  getTag(tid: string): Tag { return this.service.getTag(tid) }
  createTag(title: string): Promise<Tag> { return this.service.createTag(title) }
  updateTag(tag: Tag): Promise<boolean> { return this.service.updateTag(tag) }
  editTagsAll(diff: Tag[], id: number | string): Promise<boolean> {
    switch (this.type) {
      case "exam": return this.service.editExamTagsAll(diff, '' + id)
      case "question": return this.service.editQuestionTagsAll(diff, +id)
    }
  }
}
