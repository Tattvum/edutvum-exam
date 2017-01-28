import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class StudentService {

  public results$
  public exams$

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

  private rndExam(): string {
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

  constructor() {
    let _results = []
    for (var i = 0; i < 45; i++) {
      _results.push({
        id: 'r'+i,
        exam: this.rndExam(),
        percent: this.rndn(100, 5),
        when: this.rndDate(),
      })

      this.cache['r'+i] = {0: "beep-"+i}
    }
    this.results$ = Observable.of(_results);

    let _exams = []
    for (var i = 0; i < 25; i++) {
      _exams.push({
        id: 'e'+i,
        exam: this.rndExam(),
        percent: this.rndn(100, 5),
        when: this.rndDate(),
      })

      this.cache['e'+i] = {0: "some \\(\\frac{(n^{"+i+"}+n)(2n+"+i+")}{"+i+"}\\)test"}
    }
    this.exams$ = Observable.of(_exams);

    this.cache['e1']
  }

  public getQuestion(eid: string, qid: string): string {
//    return "some \\(\\frac{(n^2+n)(2n+1)}{8}\\)test $$\\sum_{i=0}^n i^2 = \\frac{(n^5+n)(2n+1)}{7}$$ beep"
    let q = this.cache[eid][qid]
    return q == undefined ? "-nope" : q
  }

}
