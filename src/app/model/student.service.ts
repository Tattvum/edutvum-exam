import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

export enum AnswerType { TFQ, MCQ, MAQ, UNKNOWN_LAST }

export class Question {
  public html: string
  public type = AnswerType.MCQ
  public solutions: boolean[] = []
  public answers: boolean[] = []
  public choices: string[] = []
  constructor() { }
  public isDone(): boolean {
    let done = false
    this.answers.forEach(a => done = done || a)
    return done
  }
  public setAnswer(n: number) {
    if (this.type !== AnswerType.MAQ)
      this.choices.forEach((_, i) => this.answers[i] = false)
    this.answers[n] = true
  }
  public hasAnswer(i: number): boolean {
    return this.answers[i] == true
  }
  public isWrong(): boolean {
    let wrong = false
    if (this.isDone()) {
      this.choices.forEach((_, i) => {
        let sol = this.solutions[i]
        if (sol == null) sol = false
        let ans = this.answers[i]
        if (ans == null) ans = false
        wrong = wrong || (sol !== ans)
      })
    }
    return wrong
  }
  public isSelected = false
}

export class Id {
  protected static _count = 0
  public readonly id: string
  constructor(private prefix: string) {
    this.id = prefix + Id._count
    Id._count++
  }
}

export class Results {
  total: number = 0
  leftout: number = 0
  correct: number = 0
  wrong: number = 0
  percent(): number {
    let pc = Math.ceil((this.correct / this.total) * 100)
    return pc
  }
}

export class Exam extends Id {
  public qs: Question[] = []
  public inAnswerMode = false
  private selected: number = 0
  constructor(public name: string = null, public when: Date = new Date()) {
    super("ee")
  }
  static copy(src, target: Exam) {
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
  reset() {
    Exam.static_reset(this)
  }
  static static_reset(exam: Exam) {
    exam.inAnswerMode = false
    exam.qs.forEach((q, i) => {
      q.answers = []
    })
  }
  static clone(exam: Exam, shallow = true) {
    let newExam = new Exam()
    Exam.copy(exam, newExam)
    if (shallow) Exam.static_reset(newExam)
    return newExam
  }

  public select(n: number) {
    if (this.selected != null) this.qs[this.selected].isSelected = false
    this.selected = n
    this.qs[this.selected].isSelected = true
  }
  public selectNone() {
    this.selected = null
    this.qs.forEach(q => q.isSelected = false)
  }
  public isResultsPage(): boolean {
    return this.selected == null
  }
  public next(): number {
    if (this.selected == null) return 0
    if (this.selected < this.qs.length - 1) {
      return this.selected * 1 + 1// WHY?!
    }
  }
  public scoreResults(): Results {
    let results = new Results();
    this.qs.forEach(q => {
      results.total++
      if (q.isDone()) {
        if (q.isWrong()) results.wrong++
        else results.correct++
      } else results.leftout++
    })
    return results
  }
}

export class ExamResult extends Exam {
  constructor(readonly exam: Exam,
    readonly when: Date = new Date()) {
    super("rr")
    Exam.copy(exam, this)
  }
  percent(): number {
    return this.scoreResults().percent()
  }
}

class Lib {
  static times(n: number): number[] {
    let arr = []
    for (var i = 0; i < n; i++) arr[i] = i
    return arr
  }
}

@Injectable()
export class StudentService {

  public exams$: Observable<Exam[]>
  public results$: Observable<ExamResult[]>

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
    //anyway there will be one solution
    //    q.solutions[0] = true
    q.solutions[this.rndn(n)] = true
    switch (q.type) {
      case AnswerType.MAQ:
        Lib.times(n).forEach(i => q.solutions[i] = this.toss())
    }
    return q
  }

  private rndExam(qcount = 10): Exam {
    let e = new Exam(this.rndExamName(), this.rndDate())
    let n = this.rndn(qcount, 5)
    for (var i = 0; i < n; i++) {
      e.qs[i] = this.rndQuestion()
    }
    return e
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

  _es: Exam[]
  _rs: ExamResult[]

  constructor() {
    this._es = this.rndArray<Exam>(10, () => this.rndExam(3))
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
