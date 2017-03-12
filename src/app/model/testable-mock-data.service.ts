import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
  DataService,
  Exam, ExamResult, Question, AnswerType,
  Lib
} from './data.service'

@Injectable()
export class TestableMockDataService extends DataService {

  private examNames = [
    'Test1',
    'Test2',
    'Test3',
    'Test4',
  ]

  private rndExamName(): string {
    let name = this.examNames[Lib.rndn(this.examNames.length)]
    let year = Lib.rndn(10, 2009)
    return name + " " + year
  }

  cache = {}

  private rndQuestion(): Question {
    let q = new Question()
    q.type = Lib.rndn(AnswerType.UNKNOWN_LAST)
    let n = (q.type === AnswerType.TFQ) ? 2 : Lib.rndn(5, 2)
    q.html = "some <b>bold</b> \\(\\frac{(n^{" + n + "}+n)(2n+" + n + ")}{" + n + "}\\)test"
    for (var i = 0; i < n; i++) {
      q.choices[i] = "choice " + i + " \\(\\frac{0}{1}\\)"
    }
    //anyway there will be one solution
    q.solutions[Lib.rndn(n)] = true
    switch (q.type) {
      case AnswerType.MAQ:
        Lib.times(n).forEach(i => q.solutions[i] = Lib.toss())
    }
    return q
  }

  private rndExam(qcount = 10): Exam {
    let e = new Exam(this.rndExamName(), Lib.rndDate())
    let n = Lib.rndn(qcount, 5)
    for (var i = 0; i < n; i++) {
      e.qs[i] = this.rndQuestion()
    }
    return e
  }

  _es: Exam[]
  _rs: ExamResult[]

  constructor() {
    super()
    this._es = Lib.rndArray<Exam>(10,
      () => this.rndExam(3), (t) => this.cache[t.id] = t)
    this.exams$ = Observable.of(this._es)

    this._rs = []
    this.results$ = Observable.of(this._rs);
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
    this._rs.push(examResult)
    this.cache[examResult.id] = examResult
    return examResult
  }

}
