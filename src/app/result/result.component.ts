import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ExamResult } from '../model/exam-result';
import { Lib } from '../model/lib';
import { Bar } from '../common/chart.component';
import { AnswerType, ANSWER_TYPES, ANSWER_TYPE_NAMES } from '../model/answer-type';
import { Question } from '../model/question';
import { Tag } from '../model/tag';
import { TreeTableData } from '../common/treetable.component';

interface ResultObj {
  isOmitted: boolean,
  isAttempted: boolean,
  isGuessing: boolean,
  isCorrect: boolean,
  isPartial: boolean,

  duration: number,
  maxTime: number,
  count: number,

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
    //CAUTION: TBD: simply result.maxDuration is 0! as it is silently inheritred, but broken!
    let maxTime = this.result.exam.maxDuration * 60 * (marks.max / this.result.score.total)
    let count = 1
    let omitted = (isOmitted) ? marks.max : 0
    let skipped = (!isOmitted && !isAttempted) ? marks.max : 0
    let scored = sure + guess
    return {
      isOmitted: isOmitted, isAttempted: isAttempted, isCorrect: isCorrect,
      isPartial: isPartial, isGuessing: isGuessing,
      duration: duration, maxTime: maxTime, count: count,
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
    this.result.questions.forEach((q, qidn) => {
      let ro = this.resultObj(qidn)
      let score = ro.scored + '/' + ro.max
      out.push({
        value: ro.duration,
        color: this.data2color(ro),
        flags: () => ["" + score, Lib.timize(ro.duration), "" + (qidn + 1)],
        action: () => this.router.navigate(['/question', this.result.id, qidn]),
        selected: this.result.isMarked(qidn)
      })
    })
    return out
  }

  get tags(): TreeTableData {
    const marksPercent = (arr: any[]) => Math.round((arr[2] / arr[4]) * 100) + "%"
    const timizesec = (arr: any[]) => Lib.timize(arr[8])
    const timizesectotal = (arr: any[]) => Lib.timize(arr[9])
    const timePercent = (arr: any[]) => Math.round((arr[8] / arr[9]) * 100) + "%"
    const roundOffNote = "There could be round off errors."
    const arrdef = [0, 0, 0, null, 0, 0, 0, 0, 0, 0, null]

    let out: TreeTableData = {
      cols: [
        { name: "Sure", style: "color: black;", },
        { name: "Guess", style: "color: gray;", },
        { name: "Marks", style: "color: green;", },
        { name: "%", style: "color: maroon; font-weight: bold;", format: marksPercent },
        { name: "Total Marks", style: "color: maroon;", },
        { name: "Total #", style: "color: #609;", },
        { name: "Skipped", style: "color: darkblue;", },
        { name: "Omitted", style: "color: red;", },
        { name: "Time", style: "color: blue;", format: timizesec },
        { name: "*Total Time", style: "color: #0AF;", format: timizesectotal, note: roundOffNote },
        { name: "*Time %", style: "color: #069;", format: timePercent, note: roundOffNote },
      ],
      totals: [...arrdef],
      rows: [],
    }

    let o2a = (o: ResultObj) => [
      o.sure, o.guess, o.scored, null, o.max, o.count,
      o.skipped, o.omitted, o.duration, o.maxTime, null,
    ]

    const qtypes: { [key: number]: number[] } = {}
    ANSWER_TYPES.forEach(type => qtypes[type] = [...arrdef])

    this.result.questions.forEach((q, qid) => {
      let ro = this.resultObj(qid)
      Lib.addArrays(out.totals, o2a(ro))
      Lib.addArrays(qtypes[q.type], o2a(ro))
      out.rows.push(...q.tags.map(t => t.title.replace(":", "/")).map(p => ({
        tag: p, values: o2a(ro), node: q.id,
      })))
    })

    ANSWER_TYPES
      .map((typ, i) => ({ name: ANSWER_TYPE_NAMES[i], arr: qtypes[typ] }))
      .filter(obj => obj.arr[5] > 0).forEach(obj => {
        //NOTE: node is not q.id here, it just has to be unique for the roll up to .Type!
        out.rows.push({ tag: ".Type / " + obj.name, values: obj.arr, node: "t" + obj.name })
      })

    return out
  }

}
