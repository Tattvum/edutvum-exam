import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import {
  DataService, Id, Exam, ExamResult, Question, AnswerType, Lib
} from './data.service'

class ExamImpl extends Exam {
  constructor(e: any) {
    super()
    this.name = e.name
    this.id = e.$key
    e.questions.forEach(qid => this.qs.push(new QuestionImpl(qid)))
  }
}

class QuestionImpl extends Question {
  constructor(public qid: string) {
    super()
  }
  setObj(q: any) {
    this.html = q.display
    this.type = AnswerType["" + q.type]
    this.choices = q.choices
    q.solutions.forEach(n => this.solutions[n] = true)
  }
}

class ResultImpl extends ExamResult {
  public answers = []
  public eid = null
  constructor(r: any) {
    super()
    this.id = r.$key
    this.eid = r.exam
    this.name = "Result for " + this.id + ":" + this.eid
    this.answers = r.answers
  }
}

const URL_VER = "ver3/"
const EXAMS_URL = URL_VER + "exams"
const RESULTS_URL = URL_VER + "results/u1"
const QUESTION_URL = URL_VER + "questions"

@Injectable()
export class FirebaseDataService extends DataService {
  af: AngularFire
  cache = {}

  private cacheObj(i: Id): any {
    if(this.cache[i.id] == undefined) this.cache[i.id] = i
    return this.cache[i.id]
  }

  private copy(src, target: Exam) {
    target.name = src.name
    target.inAnswerMode = src.inAnswerMode
    src.qs.forEach((q, i) => {
      target.qs[i] = new Question()
      let thisq = target.qs[i]
      thisq.html = q.html
      thisq.type = q.type
      q.choices.forEach((_, j) => {
        thisq.choices[j] = q.choices[j]
        thisq.solutions[j] = q.solutions[j]
        thisq.answers[j] = q.answers[j]
      })
    })
  }

  constructor(af: AngularFire) {
    super()
    this.af = af

    console.log("LISTTTTT---")
    this.exams$ = af.database.list(EXAMS_URL).map(arr => {
      console.log('exams map *')
      return arr.map(o => this.cacheObj(new ExamImpl(o)))
    })

    this.results$ = af.database.list(RESULTS_URL).map(arr => {
      console.log('results map *')
      return arr.map(o => this.cacheObj(new ResultImpl(o)))
    })

    this.exams$.subscribe(es => {
      console.log("computing exams... " + es.length)
      es.forEach(e => {
        //console.log("- exam question... ", e.qs.length)
        e.qs.forEach((q, i) => {
          af.database.object(QUESTION_URL + "/" + q.qid).subscribe(o => {
            e.qs[i].setObj(o)
            //console.log("- - exam question id " + q.qid, e.qs[i].answers.length)
          })
        })
      })

      //console.log(this.cache)
      this.results$.subscribe(rs => {
        console.log("computing results... " + rs.length)
        rs.forEach(r => {
          let e = this.cache[r.eid]
          this.copy(e, r)
          //console.log(r)
          r.answers.forEach((ans, i) => {
            ans.forEach(j => r.qs[i].answers[j] = true)
          })
          //console.log(e.name, "-", r.name)
        })
      },null,()=>console.log("results completed"))

    })

  }

  public getExam(eid: string): Exam {
    let e: Exam = this.cache[eid]
    //console.log("getExam", eid, e)
    return e
  }

  public getQuestion(eid: string, qid: string): Question {
    let q = this.getExam(eid).qs[qid]
    //console.log("getQuestion", eid, qid, q)
    return q
  }

  public saveExam(exam: Exam) {
    let examResult = new ExamResult(exam)
    exam.reset()
    //this._rs.push(examResult)
    this.cache[examResult.id] = examResult
    return examResult
  }

}
