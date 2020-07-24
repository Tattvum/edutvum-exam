import { Component, OnInit } from '@angular/core';
// http://momentjs.com/docs/
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Exam } from '../model/exam';
import { ExamResult } from '../model/exam-result';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';

import { trigger, transition, style, state, animate } from '@angular/animations';
import { GeneralContext } from '../model/general-context';
import { TreeTableData } from 'app/common/treetable.component';
import { NO_TAG } from 'app/model/tag';

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
    const arrdef = [0, 0]

    let out: TreeTableData = {
      cols: [
        { name: "Available", style: "color: black;", },
        { name: "Taken", style: "color: green; font-weight: bold;", },
      ],
      totals: [...arrdef],
      rows: [],
    }

    const untagged = [...arrdef]

    this.service.filteredExams().forEach((ex, i) => {
      const taken = this.service.listResults(ex.id).length
      Lib.addArrays(out.totals, [1, taken])
      if (ex.tags.length === 0) Lib.addArrays(untagged, [1, taken])
      else out.rows.push(...ex.tags.map(t => t.title.replace(":", "/")).map(p => ({
        tag: p, values: [1, taken], node: ex.id,
      })))
    })

    out.rows.push({ tag: NO_TAG, values: untagged, node: "-" })

    return out
  }

}
