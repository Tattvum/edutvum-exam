import { Component, OnInit, ViewChild } from '@angular/core';
// http://momentjs.com/docs/
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Exam } from '../model/exam';
import { ExamResult, ResultObj } from '../model/exam-result';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';

import { trigger, transition, style, state, animate } from '@angular/animations';
import { GeneralContext } from '../model/general-context';
import { TreeTableData } from '../common/treetable.component';
import { NO_TAG, TYPE_TAG } from '../model/tag';
import { ANSWER_TYPES, ANSWER_TYPE_NAMES } from 'app/model/answer-type';

@Component({
  selector: 'app-student-dash',
  templateUrl: './student-dash.component.html',
  styleUrls: ['./student-dash.component.scss'],
  animations: [
    trigger('testAnim', [
      state('false', style({
        transform: 'scale(1)',
      })),
      state('true', style({
        color: 'blue',
        transform: 'scale(1.01)',
      })),
      transition('* => *', animate('200ms ease')),
    ]),
  ]
})
export class StudentDashComponent implements OnInit {

  public pageExam
  public pageResult
  public ok = false

  toggleOK() {
    this.ok = !this.ok
  }

  constructor(public service: DataService,
    private context: GeneralContext,
    private router: Router) { }

  ngOnInit(): void { }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  public isMarked(eid: string): boolean {
    let prefix = this.service.selection
    if (this.service.isUnselected) return true
    let e = this.service.getPureExam(eid)
    const parts = prefix.split("/").map(p => p.trim())
    if (prefix.startsWith(NO_TAG)) {
      return e.tags.length === 0
    } else {
      return e.tags.map(t => t.title.replace(":", "/")).filter(t => t.startsWith(prefix)).length > 0
    }
  }

  get tagFilteredExams(): Exam[] {
    return this.service.filteredExams().filter(e => this.isMarked(e.id))
  }

  takeExam(exam: Exam, isPractice: boolean = false) {
    if (exam.isPending()) {
      this.router.navigate(['/results', this.service.pendingId(exam.id)])
    } else {
      const name = isPractice ? 'practice' : 'exam'
      if (!this.context.confirm(`Ready to start the ${name}?!`)) return
      this.service.startExam(exam.id, isPractice).then(rid => {
        this.router.navigate(['/question', rid, 0])
      })
    }
  }

  showExamResult(result: ExamResult) {
    let er = this.service.getExamResult(result.id)
    if (er.isLocked()) this.router.navigate(['/results', result.id])
    else {
      if (!confirm(`Ready to continue the ${result.name}?!`)) return
      this.router.navigate(['/question', result.id, 0])
    }
  }

  createExam() {
    let eid = this.context.prompt('Please enter the Exam ID')
    if (eid && eid.length > 0) {
      try {
        this.service.defineExam(eid)
        //this.service.validateExamId(eid)
      } catch (e) {
        this.context.alert(e.message)
        this.createExam()// call myself again...
      }
    }
  }

  publishExam(eid: string) {
    if (this.context.confirm('Published exam cannot add questions.\n OK to proceed?')) {
      this.service.publishExam(eid).then(ok => {
        console.log('Exam Published!', eid)
      })
    }
  }

  get tags(): TreeTableData {
    const timizesec = (arr: any[]) => Lib.timize(arr[3])
    const arrdef = [0, 0, 0, 0]

    let out: TreeTableData = {
      cols: [
        { name: "Available", style: "color: black;", },
        { name: "Questions", style: "color: maroon;", },
        { name: "Taken", style: "color: green; font-weight: bold;", },
        { name: "Time", style: "color: blue;", format: timizesec },
      ],
      totals: [...arrdef],
      rows: [],
    }

    const untagged = [...arrdef]

    this.service.filteredExams().forEach((ex, i) => {
      const questions = ex.questions.length
      const taken = this.service.listResults(ex.id).length
      const time = this.service.listResults(ex.id)
        .map(er => er.durationTotal())
        .reduce((sum, dur) => sum + dur, 0)
      const values = [1, questions, taken, time]
      Lib.addArrays(out.totals, [...values])
      if (ex.tags.length === 0) Lib.addArrays(untagged, [...values])
      else out.rows.push(...ex.tags.map(t => t.title.replace(":", "/")).map(p => ({
        tag: p, values: [...values], node: ex.id,
      })))
    })

    out.rows.push({ tag: NO_TAG, values: untagged, node: "-" })

    return out
  }

  get chartTags(): TreeTableData {
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

    const untagged = [...arrdef]

    const chart = this.service.chartSelection
    chart?.results?.forEach(cr => {
      cr.questions.forEach((q, qidn) => {
        let o2ao = o2a(cr.asObj(qidn))
        Lib.addArrays(out.totals, o2ao)
        Lib.addArrays(qtypes[q.type], o2ao)
        if (q.tags.length === 0) Lib.addArrays(untagged, o2ao)
        else out.rows.push(...q.tags.map(t => t.title.replace(":", "/")).map(p => ({
          tag: p, values: o2ao, node: q.id,
        })))
      })
    })

    ANSWER_TYPES
      .map((typ, i) => ({ name: ANSWER_TYPE_NAMES[i], arr: qtypes[typ] }))
      .filter(obj => obj.arr[5] > 0).forEach(obj => {
        //NOTE: node is not q.id here, it just has to be unique for the roll up to .Type!
        out.rows.push({ tag: TYPE_TAG + " / " + obj.name, values: obj.arr, node: "t" + obj.name })
      })

    out.rows.push({ tag: NO_TAG, values: untagged, node: "-" })

    return out
  }

}
