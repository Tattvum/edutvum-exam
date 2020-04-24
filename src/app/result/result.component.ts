import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../model/exam-result';
import { Lib } from '../model/lib';
import { Marks } from 'app/model/marks';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  @Input() result: ExamResult
  chartArray = []

  constructor(private router: Router) { }

  ngOnInit() {
    this.prepareChart()
  }

  private prepareChart() {
    let defval = (a: number | boolean, b: number | boolean) => Lib.isNil(a) ? b : a
    this.chartArray = []
    this.result.questions.forEach((q, qid) => {
      let marks = this.result.marks(qid)
      this.chartArray.push({
        value: defval(this.result.durations[qid], 0),
        attempted: defval(this.result.isAttempted(qid), false),
        correct: defval(this.result.isCorrect(qid), false),
        partial: defval(this.result.isPartial(qid), false),
        guess: defval(this.result.guessings[qid], false),
        marks: defval(marks.value, 0),
        max: defval(marks.max, 1),
        action: () => {
          console.log('action', qid)
          this.router.navigate(['/question', this.result.id, qid])
        }
      })
    })
  }

  assess(omitted: boolean, attempted: boolean, guessed: boolean, marks: Marks): any[] {
    let obj = { Sure: 0, Guess: 0, Marks: 0, Total: 0, Skipped: 0, Omitted: 0 }
    obj.Total = marks.max
    if (omitted) obj.Omitted = marks.max
    else if (!attempted) obj.Skipped = marks.max
    else if (guessed) obj.Guess = marks.value
    else obj.Sure = marks.value
    obj.Marks = obj.Sure + obj.Guess
    return [obj.Sure, obj.Guess, obj.Marks, "percent", obj.Total, obj.Skipped, obj.Omitted]
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
        "percent": (arr) => (arr[2] / arr[4]) * 100
      }
    }

    let defval = (a: boolean, b: boolean) => Lib.isNil(a) ? b : a
    let isNum = (o) => typeof (o) === "number"
    let addArrays = (d: any[], s: any[]) => d.forEach((v, i) => { if (isNum(v)) d[i] += s[i] })

    this.result.questions.forEach((q, qid) => {
      let omitted = this.result.isOmitted(qid)
      let attempted = this.result.isAttempted(qid)
      let guess = defval(this.result.guessings[qid], false)
      let marks = this.result.marks(qid)
      addArrays(out.totals, this.assess(omitted, attempted, guess, marks))

      out.leaves.push(...q.tags
        .map(t => t.title.split(":"))
        .map(p => ({
          type: p[0].trim(), name: p[1].trim(),
          values: this.assess(omitted, attempted, guess, marks)
        })))
    })
    return out
  }

}
