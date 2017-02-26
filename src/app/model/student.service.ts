import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export enum AnswerType { TFQ, MCQ, MAQ, UNKNOWN_LAST }

export class Question {
  public html: string
  public type = AnswerType.MCQ
  public answers: boolean[] = []
  public choices: string[] = []
  constructor() { }
  public done(): boolean {
    return this.answers.length > 0
  }
  public hasAnswer(i: number): boolean {
    return this.answers[i] == true
  }
  public selected = false
}

export class Id {
  protected static _count = 0
  public readonly id: string
  constructor(prefix: string) {
    this.id = prefix + Id._count
    Id._count++
  }
}

export class Exam extends Id {
  public qs: Question[] = []
  private selected: number = 0
  public select(n: number) {
    this.qs[this.selected].selected = false
    this.selected = n
    this.qs[this.selected].selected = true
  }

  public next(): number {
    let out: number = null;
    if (this.selected < this.qs.length - 1) {
      out = this.selected * 1 + 1// WHY?!
    }
    console.log("next: " + out)
    return out
  }

  constructor(public name: string = null, public when: Date = new Date()) {
    super("ee")
  }
}

export class ExamResult extends Id {
  constructor(public exam: Exam, public percent: number, public when: Date = new Date()) {
    super("rr")
  }
}

@Injectable()
export class StudentService {

  public exams$
  public results$

  private examNames = [
    'NMTC Junior Scr.',
    'NMTC Junior Final',
    'NMTC Sub-Junior Scr.',
    'NMTC Sub-Junior Final',
    'NMTC Primary Scr.',
    'NMTC Primary Final',
    'NSEJS',
    'NIOS Maths',
    'NIOS Science',
  ]

  private rndn(ncount: number, nmin: number = 0): number {
    let rndi = Math.random() * ncount
    return Math.floor(rndi) + nmin
  }

  //default is 50% probability
  private toss(b: number = 2, a: number = 1): boolean {
    return this.rndn(b) < a
  }

  /*
  private tosses(n: number, b: number = 2, a: number = 1): Tosses {
    let arr = []
    for (var i = 0; i < n; i++) arr[i] = this.toss(b, a);
    return new Tosses(arr)
  }
  */

  private rndExamName(): string {
    let name = this.examNames[this.rndn(this.examNames.length)]
    let year = this.rndn(10, 2009)
    return name + " " + year
  }

  private rndDate(): Date {
    let y = this.rndn(2, 2015)
    let m = this.rndn(12, 1)
    let d = this.rndn(28, 1)
    return new Date(y + '-' + m + '-' + d)
  }

  cache = {}

  private rndQuestion(): Question {
    let q = new Question()
    q.type = this.rndn(AnswerType.UNKNOWN_LAST)
    let n = (q.type === AnswerType.TFQ) ? 2 : this.rndn(5, 2)
    q.html = "some <b>bold</b> \\(\\frac{(n^{" + n + "}+n)(2n+" + n + ")}{" + n + "}\\)test"
    for (var i = 0; i < n; i++) {
      q.choices[i] = "choice " + i + " \\(\\frac{0}{1}\\)"
    }
    return q
  }

  private rndExam(qcount = 10): Exam {
    let e = new Exam(this.rndExamName(), this.rndDate())
    let n = this.rndn(qcount, 10)
    for (var i = 0; i < n; i++) {
      e.qs[i] = this.rndQuestion()
    }
    return e
  }

  private rndExamResult(e: Exam): ExamResult {
    let er = new ExamResult(e, this.rndn(100, 5), this.rndDate())
    return er
  }

  private rndArray<T extends Id>(total: number, f: () => T): T[] {
    let arr: T[] = []
    for (var i = 0; i < total; i++) {
      let t = f()
      this.cache[t.id] = t
      arr.push(t)
    }
    return arr;
  }

  constructor() {
    let _es = this.rndArray(10, () => this.rndExam(50))
    this.exams$ = Observable.of(_es)

    let _rs = this.rndArray(10, () => {
      let e = _es[this.rndn(_es.length)]
      let r = this.rndExamResult(e)
      return r
    })
    this.results$ = Observable.of(_rs);
  }

  public getExam(eid: string): Exam {
    let e: Exam = this.cache[eid]
    return e
  }

  public getQuestion(eid: string, qid: string): Question {
    let q = this.getExam(eid).qs[qid]
    return q
  }

}
