import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../model/exam-result';
import { Lib } from '../model/lib';
import { Marks } from 'app/model/marks';
import { Bar } from 'app/common/chart.component';

interface ResultObj {
  isOmitted: boolean,
  isAttempted: boolean,
  isGuessing: boolean,
  isCorrect: boolean,
  isPartial: boolean,

  duration: number,

  max: number,
  omitted: number,
  skipped: number,
  guess: number,
  sure: number,
  scored: number,
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() result: ExamResult

  constructor(private router: Router) { }

  ngOnInit() { }

  private resultObj(qid: number): ResultObj {
    let defbool = (a: boolean, b: boolean) => Lib.isNil(a) ? b : a
    let defnum = (a: number, b: number) => Lib.isNil(a) ? b : a
    let isOmitted = this.result.isOmitted(qid)
    let isAttempted = defbool(this.result.isAttempted(qid), false)
    let isCorrect = defbool(this.result.isCorrect(qid), false)
    let isPartial = defbool(this.result.isPartial(qid), false)
    let isGuessing = defbool(this.result.guessings[qid], false)
    let marks = this.result.marks(qid)
    let guess = (!isOmitted && isAttempted && isGuessing) ? marks.value : 0
    let sure = (!isOmitted && isAttempted && !isGuessing) ? marks.value : 0
    let duration = defnum(this.result.durations[qid], 0)
    let omitted = (isOmitted) ? marks.max : 0
    let skipped = (!isOmitted && !isAttempted) ? marks.max : 0
    let scored = sure + guess
    return {
      isOmitted: isOmitted, isAttempted: isAttempted, isCorrect: isCorrect,
      isPartial: isPartial, isGuessing: isGuessing,
      duration: duration,
      max: marks.max, omitted: omitted, skipped: skipped,
      guess: guess, sure: sure, scored: scored
    }
  }

  private data2color(ro: ResultObj): string {
    let color = '49,176,213,1' // blue
    if (ro.isAttempted) {
      if (ro.isCorrect) color = '0,128,0'
      else if (ro.isPartial) color = '255,165,0'
      else color = '255,0,0'
      if (ro.isGuessing) color += ',0.7'
      else color += ',1'
    }
    return color
  }

  get bars() {
    let out: Bar[] = []
    this.result.questions.forEach((q, qid) => {
      let ro = this.resultObj(qid)
      let score = ro.scored + '/' + ro.max
      let prefix = this.result.selection
      // console.log(qid, prefix, q.tags.map(t => t.title))
      out.push({
        value: ro.duration,
        color: this.data2color(ro),
        flags: () => ["" + score, Lib.timize(ro.duration), "" + (qid + 1)],
        action: () => this.router.navigate(['/question', this.result.id, qid]),
        selected: q.tags.filter(t => t.title.startsWith(prefix)).length > 0
      })
    })
    return out
  }

  get data() {
    let out = {
      styles: ["color: black;", "color: gray;", "color: green;",
        "color: maroon; font-weight: bold;",
        "color: maroon;", "color: darkblue;", "color: red;"],
      names: ["Sure", "Guess", "Marks", "%", "Total", "Skipped", "Omitted"],
      suffixes: ["", "", "", "%", "", "", ""],
      totals: [0, 0, 0, "percent", 0, 0, 0],
      leaves: [],
      functions: {
        "percent": (arr: any[]) => (arr[2] / arr[4]) * 100
      }
    }

    let isNum = (o: any) => typeof (o) === "number"
    let addArrays = (d: any[], s: any[]) => d.forEach((v, i) => { if (isNum(v)) d[i] += s[i] })
    let o2a = (o: ResultObj) => [
      o.sure, o.guess, o.scored, "percent", o.max, o.skipped, o.isOmitted
    ]

    this.result.questions.forEach((q, qid) => {
      let ro = this.resultObj(qid)
      addArrays(out.totals, o2a(ro))

      out.leaves.push(...q.tags.map(t => t.title.split(":")).map(p => ({
        type: p[0].trim(), name: p[1].trim(),
        values: o2a(ro)
      })))
    })
    return out
  }

}
