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
import { FirebaseAPI } from 'app/model/firebase-api.service';
import { QuestionGroup } from 'app/model/question-group';
import { CommentList, Comment } from './comment';

const URL_VER = 'ver5/'
const EXAMS_URL = URL_VER + 'exams/'
const RESULTS_URL = URL_VER + 'results/'
const USERS_URL = URL_VER + 'users/'

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToArr(obj): any[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach(function (key, index) {
    arr[+key] = obj[key]
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function fbObjToFLArr(obj): FileLink[] {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach(function (key, index) {
    let fl = obj[key]
    fl.id = key
    arr[index] = fl
    // console.log(index, key, obj[key].file, arr[index].file)
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
  let q = new Question(id, title, type, choices,
    solutions, notes, explanation, eid, files, groups.slice(0))
  qcache[q.fullid()] = q
  // if (groups.length > 0) console.log('createQ GROUP', eid, q.fullid())
  return [q]
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
  qkeys.forEach(key => questions.push(...createQ(qobj[key], key, id)))
  let status = ExamStatus.DONE
  if (obj.status) status = ExamStatus['' + obj.status]
  return new Exam(id, title, questions, when, notes, explanation, status)
}

// NOTE: PUBLIC for TEST sake ONLY
export function asCList(obj): CommentList {
  if (Lib.isNil(obj)) return []
  let arr = []
  Object.keys(obj).forEach(function (key, index) {
    let cl = obj[key]
    //CAUTION: This typecasting is essential. Typescript is unaware, till last moment.
    cl.when = new Date(cl.when)
    arr[index] = cl
    // console.log(index, key, obj[key].file, arr[index].file)
  })
  return arr
}

// NOTE: PUBLIC for TEST sake ONLY
export function createR(obj, es: { [key: string]: Exam }, user: User): ExamResult {
  let id = obj.$key
  let exam = es[obj.exam]
  let title = exam.title
  let when = new Date(obj.when)
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
  return new ExamResult(id, title, when, exam, answers, status, guessings, durations, commentlists, user, omissions)
}

// NOTE: PUBLIC for TEST sake ONLY
export function createU(obj): User {
  let uid = obj.localId
  let name = obj.displayName
  let email = obj.email
  let role = UserRole.USER
  if (obj.role && obj.role === UserRole[UserRole.ADMIN]) role = UserRole.ADMIN
  return { uid: uid, name: name, email: email, role: role }
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertQuestion(question: Question): any {
  let qo = {}
  qo['display'] = question.title
  qo['notes'] = question.notes
  qo['explanation'] = question.explanation
  qo['choices'] = question.choices
  qo['solutions'] = question.solutions
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
  return eo
}

// NOTE: PUBLIC for TEST sake ONLY
export function convertComment(comment: Comment): any {
  let co = {}
  co['title'] = comment.title
  co['when'] = comment.when.toISOString()
  co['user'] = comment.user.name
  co['uid'] = comment.user.uid
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
  return ro
}

@Injectable()
export class FirebaseDataSource implements DataSource {
  private holders = new Holders()

  private alles: { [key: string]: Exam } = {}

  constructor(private afbapi: FirebaseAPI) { }

  async getHolders(user: User): Promise<Holders> {
    Lib.failifold(Lib.isNil(user), 'User should be authenticated')
    this.holders = new Holders()
    await this.fetchU()
    await this.fetchE()
    await this.fetchR(user)
    return this.holders
  }

  private resultsUrl(user: User): string {
    return RESULTS_URL + user.uid + '/'
  }

  private async fetchU(): Promise<void> {
    let uobjs = await this.afbapi.objectFirstMap(USERS_URL)
    uobjs.forEach(u => this.holders.users.push(createU(u)))
  }

  private async fetchE(): Promise<void> {
    let eobjs = await this.afbapi.listFirstMap(EXAMS_URL)
    eobjs.forEach(e => {
      let exam = createE(e)
      this.alles[e.$key] = exam
      this.holders.exams.push(exam)
    })
    this.holders.exams.reverse()
  }

  private async fetchR(user: User): Promise<void> {
    let robjs = await this.afbapi.listFirstMapR(this.resultsUrl(user))
    fbObjToArr(robjs).forEach(
      r => this.holders.results.push(createR(r, this.alles, user))
    )
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

  public createExam(user: User, eid: string): Promise<ExamResult> {
    Lib.failifold(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = this.alles[eid]
    Lib.failifold(Lib.isNil(exam), 'exam cannot be undefined', eid)
    let er = new ExamResult(eid, exam.title, new Date(), exam)
    let ro = convertExamResult(er)
    let url = this.resultsUrl(user)
    return this.afbapi.listPush<ExamResult>(url, ro, call => {
      let key = call.key
      let result = new ExamResult(key, er.title, er.when, er.exam, er.answers, ExamStatus.PENDING, er.guessings)
      this.alles[key] = result
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
      default:
        console.log('editUrl', 'Unknown type', type)
        return null
    }
  }

  public editExamDetail(user: User, type: ExamEditType, diff: any,
    fullid: string, cid?: number): Promise<boolean> {
    console.log(' - editExamDetail', ExamEditType[type], fullid, diff)
    let url = this.editUrl(type, fullid, cid)
    // console.log(' - ', editurl)
    Lib.failif(Lib.isNil(url), 'Invalid ExamEditType', type)
    return this.afbapi.objectSetBool(url, diff)
  }

  public addComment(user: User, eid: string, euid: string, qid: string, comment: Comment): Promise<boolean> {
    let url = RESULTS_URL + euid + "/" + eid + "/commentlists/" + qid
    let co = convertComment(comment)
    //console.log(' - ', url, co)
    return this.afbapi.listPush<boolean>(url, co, call => {
      //console.log('firebase datasource addComment saved!')
      return true
    })
  }

  public defineExam(user: User, exam: Exam): Promise<boolean> {
    Lib.failifold(Lib.isNil(exam), 'exam cannot be undefined')
    let eocover = {}
    eocover[exam.id] = convertPureExam(exam, user)
    let url = EXAMS_URL
    return this.afbapi.objectUpdate<boolean>(url, eocover, call => {
      this.alles[exam.id] = exam
      this.holders.exams.push(exam)
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

  public saveFile(user: User, eid: string, qid: string, fileLink: FileLink): Promise<string> {
    let url = EXAMS_URL + eid + '/questions/' + qid + '/files/'
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

}
