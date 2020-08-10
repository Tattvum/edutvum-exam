import { Injectable } from '@angular/core';

import 'rxjs'
import { Subject, Observable } from 'rxjs';

import { DataSource, Holders, ExamEditType, FileLink } from './data.service'

import { Lib } from './lib';

import { AnswerType, TFQChoices, ARQChoices } from './answer-type';
import { Question } from './question';
import { Exam, ExamStatus } from './exam';
import { ExamResult } from './exam-result';
import { User, UserRole } from './user';
import { QuestionGroup } from '../model/question-group';
import { CommentList, Comment } from './comment';
import { MarkingSchemeType } from './marks';
import { Tag } from './tag';
import { Chart } from './chart';
import { Marking } from './marking';

const URL_VER = 'ver5/'
const EXAMS_URL = URL_VER + 'exams/'
const RESULTS_URL = URL_VER + 'results/'
const USERS_URL = URL_VER + 'users/'
const TAGS_URL = URL_VER + 'tags/'
const CHARTS_URL = URL_VER + 'charts/'
const MARKINGS_URL = URL_VER + 'markings/'

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToArr(obj): any[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach((key, index) => {
    arr[+key] = obj[key]
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToKeyArr(obj): any[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach((key, index) => {
    let ko = obj[key]
    ko.id = key
    arr[index] = ko
    // console.log(index, key, obj[key].file, arr[index].file)
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToFLArr(obj): FileLink[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach((key, index) => {
    let fl = obj[key]
    fl.id = key
    arr[index] = fl
    // console.log(index, key, obj[key].file, arr[index].file)
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToTArr(obj): Tag[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach((key, index) => {
    let tid = obj[key]
    arr[+key] = holders.tags.cache[tid]
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function createA(type: AnswerType, given): string[] {
  let choices = given !== undefined ? fbObjToArr(given).slice(0) : null
  switch (type) {
    case AnswerType.TFQ:
      choices = TFQChoices.slice(0)
      break;
    case AnswerType.ARQ:
      choices = ARQChoices.slice(0)
      break;
    case AnswerType.NCQ:
      choices = []
      break;
    case AnswerType.NAQ:
      choices = []
      break;
  }
  return choices
}

let qcache: { [key: string]: Question } = {}

// NOTE: PUBLIC for TEST sake ONLY
export function createQ(obj, key: string, eid: string, groups: QuestionGroup[] = []): Question[] {
  let qarr = []
  if (obj.kind === 'LINK') {
    let linkid = obj.eid.trim() + '.' + obj.qid.trim()
    let linkq = qcache[linkid]
    //    console.log('question link', linkid, linkq)
    return [linkq]
  } else if (obj.kind === 'GROUP') {
    let path = groups.map(g => g.id).join('.')
    let group = new QuestionGroup(key, path, obj.display, eid)
    groups.push(group)
    let qobj = obj.questions
    if (qobj) {
      let qkeys = Object.keys(qobj).sort()
      for (let i = 0; i < qkeys.length; i++) {
        let k = qkeys[i]
        let qs = createQ(qobj[k], k, eid, groups.slice(0))
        qarr.push(...qs)
      }
    }
    groups.pop()
    return qarr
  }
  let id = key
  let title = obj.display
  let notes = obj.notes
  let explanation = obj.explanation
  let type = AnswerType['' + obj.type]
  let choices = createA(type, obj.choices)
  let solutions = fbObjToArr(obj.solutions)
  let files = fbObjToFLArr(obj.files)
  let tags = fbObjToTArr(obj.tags)
  let q = new Question(id, title, type, choices,
    solutions, notes, explanation, eid, files, groups.slice(0), tags)
  qcache[q.fullid()] = q
  // if (groups.length > 0) console.log('createQ GROUP', eid, q.fullid())
  return [q]
}

// NOTE: PUBLIC for TEST sake ONLY
export function createT(obj): Tag {
  let id = obj.$key
  let title = obj.title
  return new Tag(id, title)
}

// NOTE: PUBLIC for TEST sake ONLY
export function createE(obj): Exam {
  let id = obj.$key
  let title = obj.name
  let notes = obj.notes
  let explanation = obj.explanation
  let when = new Date(obj.when)
  let questions = []
  let qobj = obj.questions
  let qkeys = Object.keys(qobj).sort()
  qkeys.forEach(key => questions.push(...createQ(qobj[key], key, id, [])))
  let status = ExamStatus.DONE
  if (obj.status) status = ExamStatus['' + obj.status]
  let markingScheme = MarkingSchemeType.OLD
  if (obj.markingscheme) markingScheme = MarkingSchemeType['' + obj.markingscheme]
  let maxDuration = obj.maxduration
//  let tags = fbObjToTArr(obj.tags, ts)
  let tags = fbObjToTArr(obj.tags)
  return new Exam(id, title, questions, when, notes, explanation, status, markingScheme, maxDuration, tags)
}

// NOTE: PUBLIC for TEST sake ONLY
export function asCList(obj): CommentList {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach(function (key, index) {
    let cl = obj[key]
    //CAUTION: This typecasting is essential. Typescript is unaware, till last moment.
    cl.when = new Date(cl.when)
    cl.user = { uid: cl?.uid, name: cl?.user }
    arr[index] = cl
    // console.log(index, key, obj[key].file, arr[index].file)
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function createR(obj, user: User): ExamResult {
  let id = obj.$key
  let exam = holders.exams.cache[obj.exam]
  let title = exam.title
  let when = new Date(obj.when)
  let isPracticeMode: boolean = obj.practice
  let aobj = obj.answers
  let answers: number[][] = []
  if (aobj) exam.questions.forEach((q, i) => answers[i] = aobj[q.id])
  let gobj = obj.guessings
  let guessings: boolean[] = []
  if (gobj) exam.questions.forEach((q, i) => guessings[i] = gobj[q.id])
  let dobj = obj.durations
  let durations: number[] = []
  if (dobj) exam.questions.forEach((q, i) => durations[i] = dobj[q.id])
  let clobj = obj.commentlists
  let commentlists: CommentList[] = []
  if (clobj) exam.questions.forEach((q, i) => commentlists[i] = asCList(clobj[q.id]))
  let oobj = obj.omissions
  let omissions: boolean[] = []
  if (oobj) exam.questions.forEach((q, i) => omissions[i] = oobj[q.id])
  let status = ExamStatus.DONE
  if (obj.status) status = ExamStatus['' + obj.status]
  if (status !== ExamStatus.DONE) console.log('status', id, obj.status)
  let snapshot: boolean = obj.snapshot
  let snapshotIds = fbObjToArr(obj.snapshots)
  return new ExamResult(id, title, when, exam, isPracticeMode, answers, status, guessings, durations,
    commentlists, user, omissions, snapshotIds, snapshot)
}

// NOTE: PUBLIC for TEST sake ONLY
export function createC(obj, rs: { [key: string]: ExamResult }): Chart {
  let id = obj.$key
  let when = new Date(obj.when)
  let title = obj.title
  let results = fbObjToArr(obj.results).map(rid => rs[rid])
  return new Chart(id, title, when, results)
}

// NOTE: PUBLIC for TEST sake ONLY
export function createU(obj): User {
  let uid = obj.uid
  let name = obj.displayName
  let email = obj.email
  let role = UserRole.USER
  if (obj.role && obj.role === UserRole[UserRole.ADMIN]) role = UserRole.ADMIN
  return { uid: uid, name: name, email: email, role: role }
}

// NOTE: PUBLIC for TEST sake ONLY
export function createM(obj): Marking {
  let id = obj.id
  let title = obj.title
  let when = new Date(obj.when)
  let types = obj.types
  return new Marking(id, title, when, types)
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertQuestion(question: Question): any {
  let qo = {}
  qo['display'] = question.title
  qo['notes'] = question.notes
  qo['explanation'] = question.explanation
  qo['choices'] = question.choices
  qo['solutions'] = question.solutions
  qo['tags'] = question.tags
  qo['type'] = AnswerType[question.type]
  return qo
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertPureExam(exam: Exam, user: User): any {
  let eo = {}
  eo['by'] = user.uid
  eo['name'] = exam.title
  eo['notes'] = exam.notes
  eo['explanation'] = exam.explanation
  let when = eo['when'] = exam.when.toISOString()
  eo['revwhen'] = Lib.d2rev(when)
  // console.log(when, eo['revwhen'])
  let qs = {}
  exam.questions.forEach(q => qs[q.id] = convertQuestion(q))
  eo['questions'] = qs
  eo['status'] = ExamStatus[exam.status]
  eo['markingscheme'] = MarkingSchemeType[exam.markingScheme]
  eo['maxduration'] = exam.maxDuration
  return eo
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertComment(comment: Comment): any {
  let co = {}
  co['title'] = comment.title
  co['when'] = comment.when.toISOString()
  if (comment.user) {
    co['user'] = comment.user.name
    co['uid'] = comment.user.uid
  } else {
    //NOTE: Maybe due to older comments?
    console.log('WARNING: No user!', comment)
  }
  //console.log(JSON.stringify(co))
  return co
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertCommentList(commentList: CommentList): any {
  let clo = []
  commentList.forEach(c => clo.push(convertComment(c)));
  //console.log(JSON.stringify(clo))
  return clo
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertExamResult(result: ExamResult): any {
  let ro = {}
  ro['exam'] = result.exam.id
  ro['practice'] = result.isPracticeMode
  let roanss = ro['answers'] = {}
  let qs = result.exam.questions
  result.answers.forEach((ans: number[], i) => roanss[qs[i].id] = ans)
  let roguss = ro['guessings'] = {}
  result.guessings.forEach((isGuess: boolean, i) => roguss[qs[i].id] = isGuess)
  let rodurs = ro['durations'] = {}
  result.durations.forEach((secs: number, i) => rodurs[qs[i].id] = secs)
  let rocls = ro['commentlists'] = {}
  result.commentLists.forEach((cls: CommentList, i) => rocls[qs[i].id] = convertCommentList(cls))
  let roomis = ro['omissions'] = {}
  result.omissions.forEach((isOmitted: boolean, i) => roomis[qs[i].id] = isOmitted)
  ro['when'] = result.when.getTime()
  ro['revwhen'] = -result.when.getTime()
  ro['status'] = result.isLocked() ? 'DONE' : 'PENDING'
  ro['snapshot'] = result.snapshot
  ro['snapshots'] = result.snapshotIds
  return ro
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertChart(chart: Chart): any {
  let co = {}
  co['title'] = chart.title
  co['when'] = chart.when.toISOString()
  co['results'] = chart.results.map(r => r.id)
  return co
}

export abstract class AbstractFirebaseAPI {
  abstract objectFirstMap(url: string): Promise<any>
  abstract listFirstMap(url: string): Promise<any>
  abstract listFirstMapR(url: string): Promise<any>
  abstract objectRemoveBool(url: string): Promise<boolean>
  abstract objectSetBool(url: string, obj: any): Promise<boolean>
  abstract objectUpdate<T>(url: string, obj: any, fn: (x) => T): Promise<T>
  abstract objectUpdateBool(url: string, obj: any): Promise<boolean>
  abstract listPush<T>(url: string, obj: any, fn: (x) => T): Promise<T>
}

//NOTE: Global!
const holders = new Holders()

@Injectable()
export class FirebaseDataSource implements DataSource {

  constructor(private afbapi: AbstractFirebaseAPI) {
    //this.tempMarkings();
  }

  private async tempMarkings(): Promise<boolean> {
    //CAUTION:TEMP!
    let mo = {}
    mo['title'] = "Dummy"
    mo = JSON.parse(JSON.stringify(mo))
    let url = MARKINGS_URL
    return this.afbapi.listPush(url, mo, call => {
      let key = call.key
      console.log(key)
      return true
    })
  }

  async getHolders(user: User): Promise<Holders> {
    Lib.failifold(Lib.isNil(user), 'User should be authenticated')
    //NOTE: the below order of calls is important
    //exams need tags, and results need exams
    await this.fetchM()
    await this.fetchU()
    await this.fetchT()
    await this.fetchE()
    await this.fetchR(user)
    await this.fetchC(user)
    return holders
  }

  private resultsUrl(user: User): string {
    return RESULTS_URL + user.uid + '/'
  }

  private chartsUrl(user: User): string {
    return CHARTS_URL + user.uid + '/'
  }

  private async fetchM(): Promise<void> {
    let mobjs = await this.afbapi.objectFirstMap(MARKINGS_URL)
    mobjs = fbObjToKeyArr(mobjs)
    mobjs.forEach(m => {
      let marking = createM(m)
      holders.markings.cache[marking.id] = marking
      holders.markings.array.push(marking)
    })
  }

  private async fetchU(): Promise<void> {
    let uobjs = await this.afbapi.objectFirstMap(USERS_URL)
    uobjs.forEach(u => {
      let user = createU(u)
      holders.users.cache[user.uid] = user
      holders.users.array.push(user)
    })
  }

  private async fetchT(): Promise<void> {
    let tobjs = await this.afbapi.listFirstMap(TAGS_URL)
    tobjs.forEach(t => {
      let tag = createT(t)
      holders.tags.cache[tag.id] = tag
      holders.tags.array.push(tag)
    })
  }

  private async fetchE(): Promise<void> {
    let eobjs = await this.afbapi.listFirstMap(EXAMS_URL)
    eobjs.forEach(e => {
      let exam = createE(e)
      holders.exams.cache[exam.id] = exam
      holders.exams.array.push(exam)
    })
    holders.exams.array.reverse()
  }

  private async fetchR(user: User): Promise<void> {
    let robjs = await this.afbapi.listFirstMapR(this.resultsUrl(user))
    fbObjToArr(robjs).forEach(r => {
      let result = createR(r, user)
      holders.results.cache[result.id] = result
      holders.results.array.push(result)
    })
  }

  private async fetchC(user: User): Promise<void> {
    let cobjs = await this.afbapi.listFirstMapR(this.chartsUrl(user))
    fbObjToArr(cobjs).forEach(c => {
      let chart = createC(c, holders.results.cache)
      holders.charts.cache[chart.id] = chart
      holders.charts.array.push(chart)
    })
  }

  public deleteChart(user: User, cid: string): Promise<boolean> {
    let url = this.chartsUrl(user) + cid + '/'
    return this.afbapi.objectRemoveBool(url)
  }

  public updateChart(user: User, chart: Chart): Promise<boolean> {
    let co = convertChart(chart)
    // TBD NOTE: This null trsformation is required!
    // https://github.com/firebase/quickstart-js/issues/64
    co = JSON.parse(JSON.stringify(co))
    // console.log(JSON.stringify(ro))
    let url = this.chartsUrl(user) + chart.id + '/'
    return this.afbapi.objectSetBool(url, co)
  }

  public createChart(user: User): Promise<Chart> {
    let c = new Chart("-", "Chart Title", new Date(), [])
    let co = convertChart(c)
    let url = this.chartsUrl(user)
    return this.afbapi.listPush<Chart>(url, co, call => {
      let key = call.key
      let chart = new Chart(key, c.title, c.when, c.results)
      holders.charts.cache[key] = chart
      return chart
    })
  }

  public deleteExam(user: User, rid: string): Promise<boolean> {
    let url = this.resultsUrl(user) + rid + '/'
    return this.afbapi.objectRemoveBool(url)
  }

  public updateExam(user: User, result: ExamResult): Promise<boolean> {
    let ro = convertExamResult(result)
    // TBD NOTE: This null trsformation is required!
    // https://github.com/firebase/quickstart-js/issues/64
    ro = JSON.parse(JSON.stringify(ro))
    // console.log(JSON.stringify(ro))
    let url = this.resultsUrl(user) + result.id + '/'
    return this.afbapi.objectSetBool(url, ro)
  }

  public createExam(user: User, eid: string, isPractice: boolean = false): Promise<ExamResult> {
    Lib.failifold(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = holders.exams.cache[eid]
    Lib.failifold(Lib.isNil(exam), 'exam cannot be undefined', eid)
    let er = new ExamResult(eid, exam.title, new Date(), exam, isPractice)
    let ro = convertExamResult(er)
    let url = this.resultsUrl(user)
    return this.afbapi.listPush<ExamResult>(url, ro, call => {
      let key = call.key
      let result = new ExamResult(key, er.title, er.when, er.exam, er.isPracticeMode,
        er.answers, ExamStatus.PENDING, er.guessings)
      holders.exams.cache[key] = result
      return result
    })
  }

  private editUrl(type: ExamEditType, fullid: string, cid: number): string {
    let editurl = EXAMS_URL + fullid.replace(/\./g, '/questions/')
    switch (type) {
      case ExamEditType.QuestionDisplay: return editurl + '/display/'
      case ExamEditType.QuestionExplanation: return editurl + '/explanation/'
      case ExamEditType.ExamExplanation: return editurl + '/explanation/'
      case ExamEditType.QuestionChoice: return editurl + '/choices/' + cid
      case ExamEditType.ExamName: return editurl + '/name/'
      case ExamEditType.QuestionSolution: return editurl + '/solutions/'
      case ExamEditType.QuestionType: return editurl + '/type/'
      case ExamEditType.QuestionNotes: return editurl + '/notes/'
      case ExamEditType.ExamNotes: return editurl + '/notes/'
      case ExamEditType.QuestionChoicesAll: return editurl + '/choices/'
      case ExamEditType.QuestionGroupDisplay: return editurl + '/display/'
      case ExamEditType.ExamMarkingScheme: return editurl + '/markingscheme/'
      case ExamEditType.QuestionTagsAll: return editurl + '/tags/'
      case ExamEditType.ExamMaxDuration: return editurl + '/maxduration/'
      case ExamEditType.ExamTagsAll: return editurl + '/tags/'
      default:
        console.log('editUrl', 'Unknown type', type)
        return null
    }
  }

  public editExamDetail(user: User, type: ExamEditType, diff: any,
    fullid: string, cid?: number): Promise<boolean> {
    // console.log(' - editExamDetail', ExamEditType[type], fullid, diff)
    let url = this.editUrl(type, fullid, cid)
    // console.log(' - ', editurl)
    Lib.failif(Lib.isNil(url), 'Invalid ExamEditType', type)
    return this.afbapi.objectSetBool(url, diff)
  }

  public defineExam(user: User, exam: Exam): Promise<boolean> {
    Lib.failifold(Lib.isNil(exam), 'exam cannot be undefined')
    let eocover = {}
    eocover[exam.id] = convertPureExam(exam, user)
    let url = EXAMS_URL
    // console.log("defineExam", Object.keys(eocover))
    return this.afbapi.objectUpdate<boolean>(url, eocover, call => {
      holders.exams.cache[exam.id] = exam
      holders.exams.array.push(exam)
      return true
    })
  }

  public addQuestion(user: User, eid: string, question: Question): Promise<boolean> {
    Lib.failifold(Lib.isNil(question), 'question cannot be undefined')
    let qo = convertQuestion(question)
    let path = question.fullid().replace(/\./g, '/questions/')
    let url = EXAMS_URL + path + '/'
    console.log('addQuestion', question.fullid(), url)
    return this.afbapi.objectUpdateBool(url, qo)
  }

  public addLinkQuestion(user: User, eid: string, qid: string, leid: string, lqid: string): Promise<boolean> {
    Lib.assert(eid != null, 'eid cannot be null or undefined')
    let url = EXAMS_URL + eid + '/questions/'
    let linkq = {}
    linkq[qid] = { 'kind': 'LINK', 'eid': leid, 'qid': lqid }
    return this.afbapi.objectUpdateBool(url, linkq)
  }

  public publishExam(user: User, eid: string): Promise<boolean> {
    let url = EXAMS_URL + eid + '/status/'
    return this.afbapi.objectSetBool(url, 'DONE')
  }

  public saveFile(user: User, question: Question, fileLink: FileLink): Promise<string> {
    let path = question.fullid().replace(/\./g, '/questions/')
    let url = EXAMS_URL + path + '/files/'
    return this.afbapi.listPush<string>(url, fileLink, call => {
      let key = call.key + ''
      console.log('saved fileLink', url, key)
      return key
    })
  }

  public deleteFile(user: User, eid: string, qid: string, fid: string): Promise<boolean> {
    let url = EXAMS_URL + eid + '/questions/' + qid + '/files/' + fid + '/'
    return this.afbapi.objectRemoveBool(url)
  }

  public addGroup(user: User, eid: string, qgroup: QuestionGroup): Promise<boolean> {
    Lib.failifold(Lib.isNil(qgroup), 'question group cannot be undefined')
    let path = qgroup.fullid().replace(/\./g, '/questions/')
    console.log(qgroup.fullid(), path)
    let url = EXAMS_URL + path + '/'
    let go = {}
    go['kind'] = 'GROUP'
    go['display'] = qgroup.title
    console.log('firebase addGroup', eid, url)
    return this.afbapi.objectUpdateBool(url, go)
  }

  public deleteQuestion(user: User, fullid: string): Promise<boolean> {
    let url = EXAMS_URL + fullid.replace(/\./g, '/questions/') + '/'
    return this.afbapi.objectRemoveBool(url)
  }

  public createTag(user: User, title: string): Promise<Tag> {
    Lib.failifold(Lib.isNil(title) || title.trim() === "", 'tag cannot be undefined or empty')
    let to = {}
    to['title'] = title
    let url = TAGS_URL
    return this.afbapi.listPush<Tag>(url, to, call => {
      let key = call.key
      //console.log('saved tag', url, key)
      let tag = new Tag(key, title)
      holders.tags.array.push(tag)
      return tag
    })
  }

  public updateTag(user: User, tag: Tag): Promise<boolean> {
    let url = TAGS_URL + tag.id + '/title/'
    //console.log("updateTag:", url, tag.title)
    return this.afbapi.objectSetBool(url, tag.title)
  }

}
