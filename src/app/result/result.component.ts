import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../model/exam-result';
import { Lib } from '../model/lib';
import { Marks } from 'app/model/marks';
import { Bar } from 'app/common/chart.component';

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

  private data2color(attempted: boolean, correct: boolean, partial: boolean, guess: boolean): string {
    let color = '49,176,213,1' // blue
    if (attempted) {
      if (correct) color = '0,128,0'
      else if (partial) color = '255,165,0'
      else color = '255,0,0'
      if (guess) color += ',0.7'
      else color += ',1'
    }
    return color
  }

  private prepareChart() {
    let defbool = (a: boolean, b: boolean) => Lib.isNil(a) ? b : a
    let defnum = (a: number, b: number) => Lib.isNil(a) ? b : a
    this.chartArray = []
    this.result.questions.forEach((q, qid) => {
      let marksobj = this.result.marks(qid)
      let value = defnum(this.result.durations[qid], 0)
      let attempted = defbool(this.result.isAttempted(qid), false)
      let correct = defbool(this.result.isCorrect(qid), false)
      let partial = defbool(this.result.isPartial(qid), false)
      let guess = defbool(this.result.guessings[qid], false)
      let marks = defnum(marksobj.value, 0)
      let max = defnum(marksobj.max, 1)
      let color = this.data2color(attempted, correct, partial, guess)
      let flags = (n: number) => [
        marks + '/' + max,
        Lib.timize(value),
        (n + 1),
      ]
      let action = () => {
        console.log('action', qid)
        this.router.navigate(['/question', this.result.id, qid])
      }
      this.chartArray.push({ value: value, color: color, flags: flags, action: action })
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
        "percent": (arr: any[]) => (arr[2] / arr[4]) * 100
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
