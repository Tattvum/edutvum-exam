import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import {
  DataService, Exam, ExamResult, Question, AnswerType, Lib
} from './data.service'

class ExamImpl extends Exam {
  constructor(e: any) {
    super()
    this.name = e.name
    this.id = e.$key
  }
}

class QuestionImpl extends Question {
  constructor(q: any) {
    super()
    this.html = q.display
    this.type = AnswerType["" + q.type]
    this.choices = q.choices
    q.solutions.forEach(n => this.solutions[n] = true)
  }
}

@Injectable()
export class FirebaseData1Service extends DataService {
  af: AngularFire

  cache = {}

  constructor(af: AngularFire) {
    super()
    this.af = af
    this.exams$ = af.database.list('ver1/exams').map(arr => {
      return arr.map(o => new ExamImpl(o))
    })

    this.exams$.subscribe(es =>
      es.forEach(e => {
        this.cache[e.id] = e
        af.database.list("ver1/exam-questions/" + e.id).subscribe(arr =>
          arr.forEach(o => {
            let q = new QuestionImpl(o)
            e.qs.push(q)
          })
        )
      })
    )
  }

  public getExam(eid: string): Exam {
    let e: Exam = this.cache[eid]
    return e
  }

  public getQuestion(eid: string, qid: string): Question {
    let q = this.getExam(eid).qs[qid]
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
