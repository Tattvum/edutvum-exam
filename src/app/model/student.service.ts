import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

class NavState {
  constructor(public done = false, public selected = false) { }
}

export class Question {
  public display: string
  public answer: number
  public choices: string[] = [] //zeroth is answer
  constructor() { }
  public done(): boolean {
    return this.answer !== null || this.answer !== undefined
  }
  public selected: boolean
}

class Id {
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
  constructor(public name: string = null, public when: Date = new Date()) {
    super("ee")
  }
}

class ExamResult extends Id {
  constructor(public exam: Exam, public percent: number, public when: Date = new Date()) {
    super("rr")
  }
}

@Injectable()
export class StudentService {

  public exams$
  public results$

  public selected = 0
  public qs: NavState[] = [
    new NavState(false, true),
    new NavState(),
    new NavState(),
    new NavState(true),
    new NavState(),
    new NavState(true),
    new NavState(true),
    new NavState(),
    new NavState(),
    new NavState(true),
    new NavState(true),
    new NavState(true),
    new NavState(),
  ]

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

  private rndb(): boolean {
    return this.rndn(2) == 0
  }

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
    let i = this.rndn(5, 2)
    q.display = "some \\(\\frac{(n^{" + i + "}+n)(2n+" + i + ")}{" + i + "}\\)test"
    q.choices[0] = "choice X (psst.) \\(\\frac{0}{1}\\)"
    q.choices[1] = "choice A is \\(\\frac{1}{2}\\)"
    q.choices[2] = "choice B is \\(\\frac{2}{3}\\)"
    q.choices[3] = "choice C is \\(\\frac{3}{4}\\)"
    if (this.rndb()) {
      q.answer = this.rndn(q.choices.length)
    }
    return q
  }

  private rndExam(): Exam {
    let e = new Exam(this.rndExamName(), this.rndDate())
    let n = this.rndn(10, 10)
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
    let _es = this.rndArray(10, () => this.rndExam())
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
