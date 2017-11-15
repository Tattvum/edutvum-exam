import { Injectable } from '@angular/core';

import 'rxjs/Rx';
import { Subject, Observable } from 'rxjs/Rx';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { DataSource, Holders, ExamEditType } from './data.service'

import { Lib } from './lib';

import { AnswerType, TFQChoices, ARQChoices } from './answer-type';
import { Question } from './question';
import { Exam, ExamStatus } from './exam';
import { ExamResult } from './exam-result';
import { User, UserRole } from './user';

const URL_VER = 'ver5/'
const EXAMS_URL = URL_VER + 'exams/'
const RESULTS_URL = URL_VER + 'results/'
const USERS_URL = URL_VER + 'users/'

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
    case AnswerType.NCQ:
      choices = []
      break;
  }
  return choices
}

let qcache: { [key: string]: Question } = {}

function createQ(obj, key: string, eid: string): Question {
  if (obj.kind) {
    let linkid = obj.eid.trim() + '.' + obj.qid.trim()
    let linkq = qcache[linkid]
    //    console.log('question link', linkid, linkq)
    return linkq
  }
  let id = key
  let title = obj.display
  let notes = obj.notes
  let explanation = obj.explanation
  let type = AnswerType['' + obj.type]
  let choices = createA(type, obj.choices)
  let solutions = fbObjToArr(obj.solutions)
  let q = new Question(id, title, type, choices, solutions, notes, explanation, eid)
  qcache[q.fullid()] = q
  return q
}

function createE(obj): Exam {
  let id = obj.$key
  let title = obj.name
  let notes = obj.notes
  let explanation = obj.explanation
  let when = new Date(obj.when)
  let questions = []
  let qobj = obj.questions
  let qkeys = Object.keys(qobj).sort()
  qkeys.forEach(key => questions.push(createQ(qobj[key], key, id)))
  return new Exam(id, title, questions, when, notes, explanation)
}

function createR(obj, es: { [key: string]: Exam }): ExamResult {
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
  let status = ExamStatus.DONE
  if (obj.status) status = ExamStatus['' + obj.status]
  if (status !== ExamStatus.DONE) console.log('status', id, obj.status)
  return new ExamResult(id, title, when, exam, answers, status, guessings, durations)
}

function createU(obj): User {
  let uid = obj.localId
  let name = obj.displayName
  let email = obj.email
  let role = UserRole.USER
  if (obj.role && obj.role === UserRole[UserRole.ADMIN]) role = UserRole.ADMIN
  return { uid: uid, name: name, email: email, role: role }
}

@Injectable()
export class FirebaseDataSource implements DataSource {
  private holders = new Holders()

  private readonly revwhenOrder = { query: { orderByChild: 'revwhen' } }
  private readonly whenOrder = { query: { orderByChild: 'when' } }
  private alles: { [key: string]: Exam } = {}

  constructor(private afDb: AngularFireDatabase) { }

  getHolders(user: User): Promise<Holders> {
    Lib.assert(Lib.isNil(user), 'User should be authenticated')
    this.holders = new Holders()
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
    return this.afDb.list(url, this.revwhenOrder).first().map(things => {
      // console.log('computing ' + title + '... ', things.length)
      things.forEach(thing => doit(thing))
      // console.log('all ' + title + ': ', sayit())
    })
  }

  private fetchAll(user: User): Promise<void> {
    this.alles = {}
    return this.fetchE().flatMap(() => {
      return this.fetchR(user)
    }).flatMap(() => {
      return this.fetchU()
    }).toPromise()
  }

  private fetchU(): Observable<void> {
    return this.afDb.object(USERS_URL).first().map(
      us => us.forEach(u => this.holders.users.push(createU(u)))
    )
  }

  private fetchE(): Observable<void> {
    return this.afDb.list(EXAMS_URL, this.whenOrder).first().map(exs => {
      exs.forEach(e => {
        let exam = createE(e)
        this.alles[e.$key] = exam
        this.holders.exams.push(exam)
      })
      this.holders.exams.reverse()
    })
  }

  private fetchR(user: User): Observable<void> {
    return this.afDb.list(this.resultsUrl(user), this.revwhenOrder).first().map(
      userRs => {
        fbObjToArr(userRs).forEach(
          r => this.holders.results.push(createR(r, this.alles))
        )
      }
    )
  }

  private convertExam(result: ExamResult): any {
    let ro = {}
    ro['exam'] = result.exam.id
    let roanss = ro['answers'] = {}
    let qs = result.exam.questions
    result.answers.forEach((ans: number[], i) => roanss[qs[i].id] = ans)
    let roguss = ro['guessings'] = {}
    result.guessings.forEach((isGuess: boolean, i) => roguss[qs[i].id] = isGuess)
    let rodurs = ro['durations'] = {}
    result.durations.forEach((secs: number, i) => rodurs[qs[i].id] = secs)
    ro['when'] = result.when.getTime()
    ro['revwhen'] = -result.when.getTime()
    ro['status'] = result.isLocked() ? 'DONE' : 'PENDING'
    return ro
  }

  public deleteExam(user: User, rid: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.afDb.object(this.resultsUrl(user) + rid + '/').remove().then((call) => {
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  }

  public updateExam(user: User, result: ExamResult): Promise<boolean> {
    let ro = this.convertExam(result)
    // TBD NOTE: This null trsformation is required!
    // https://github.com/firebase/quickstart-js/issues/64
    ro = JSON.parse(JSON.stringify(ro))
    // console.log(JSON.stringify(ro))
    return new Promise<boolean>(resolve => {
      this.afDb.object(this.resultsUrl(user) + result.id + '/').set(ro).then((call) => {
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  }

  public createExam(user: User, eid: string): Promise<ExamResult> {
    Lib.assert(Lib.isNil(eid), 'eid cannot be undefined')
    let exam = this.alles[eid]
    Lib.assert(Lib.isNil(exam), 'exam cannot be undefined', eid)
    let er = new ExamResult(eid, exam.title, new Date(), exam)
    let ro = this.convertExam(er)
    return new Promise<ExamResult>(resolve => {
      this.afDb.list(this.resultsUrl(user)).push(ro).then((call) => {
        let key = call.key
        let result = new ExamResult(key, er.title, er.when, er.exam, er.answers, ExamStatus.PENDING, er.guessings)
        this.alles[key] = result
        resolve(result)
      }).catch(err => {
        console.log(err)
        resolve(null)
      })
    })
  }

  private editUrl(type: ExamEditType, eid: string, qid: string, cid: number): string {
    let editurl = EXAMS_URL
    switch (type) {
      case ExamEditType.QuestionDisplay: return editurl + eid + '/questions/' + qid + '/display/'
      case ExamEditType.QuestionExplanation: return editurl + eid + '/questions/' + qid + '/explanation/'
      case ExamEditType.ExamExplanation: return editurl + eid + '/explanation/'
      case ExamEditType.QuestionChoice: return editurl + eid + '/questions/' + qid + '/choices/' + cid
      case ExamEditType.ExamName: return editurl + eid + '/name/'
      case ExamEditType.QuestionSolution: return editurl + eid + '/questions/' + qid + '/solutions/'
      case ExamEditType.QuestionType: return editurl + eid + '/questions/' + qid + '/type/'
      case ExamEditType.QuestionNotes: return editurl + eid + '/questions/' + qid + '/notes/'
      case ExamEditType.ExamNotes: return editurl + eid + '/notes/'
      case ExamEditType.QuestionChoicesAll: return editurl + eid + '/questions/' + qid + '/choices/'
      default:
        console.log('editUrl', 'Unknown type', type)
        return null
    }
  }

  public editExamDetail(user: User, type: ExamEditType, diff: any,
    eid: string, qid?: string, cid?: number): Promise<boolean> {
    console.log(' - editExamDetail', ExamEditType[type], eid, qid, diff)
    let editurl = this.editUrl(type, eid, qid, cid)
    // console.log(' - ', editurl)
    Lib.failif(Lib.isNil(editurl), 'Invalid ExamEditType', type)
    return new Promise<boolean>(resolve => {
      this.afDb.object(editurl).set(diff).then((call) => {
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  }

  private convertQuestion(question: Question): any {
    let qo = {}
    qo['display'] = question.title
    qo['notes'] = question.notes
    qo['explanation'] = question.explanation
    qo['choices'] = question.choices
    qo['solutions'] = question.solutions
    qo['type'] = AnswerType[question.type]
    return qo
  }

  private convertPureExam(exam: Exam, user: User): any {
    let eo = {}
    eo['by'] = user.uid
    eo['name'] = exam.title
    eo['notes'] = exam.notes
    eo['explanation'] = exam.explanation
    let when = eo['when'] = exam.when.toISOString()
    eo['revwhen'] = Lib.d2rev(when)
    // console.log(when, eo['revwhen'])
    let qs = {}
    exam.questions.forEach(q => qs[q.id] = this.convertQuestion(q))
    eo['questions'] = qs
    eo['status'] = ExamStatus[exam.status]
    let eocover = {}
    eocover[exam.id] = eo
    return eocover
  }

  public defineExam(user: User, exam: Exam): Promise<boolean> {
    Lib.assert(Lib.isNil(exam), 'exam cannot be undefined')
    let eocover = this.convertPureExam(exam, user)
    return new Promise<boolean>(resolve => {
      this.afDb.object(EXAMS_URL).update(eocover).then((call) => {
        this.alles[exam.id] = exam
        this.holders.exams.push(exam)
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  }

  public addQuestion(user: User, eid: string, question: Question): Promise<boolean> {
    Lib.assert(Lib.isNil(question), 'question cannot be undefined')
    let qocover = {}
    qocover[question.id] = this.convertQuestion(question)
    let editurl = EXAMS_URL + eid + '/questions/'
    return new Promise<boolean>(resolve => {
      this.afDb.object(editurl).update(qocover).then((call) => {
        resolve(true)
      }).catch(err => {
        console.log(err)
        resolve(false)
      })
    })
  }

}
