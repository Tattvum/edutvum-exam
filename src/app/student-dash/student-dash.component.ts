import { Component, OnInit } from '@angular/core';
// http://momentjs.com/docs/
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Exam } from '../model/exam';
import { ExamResult } from '../model/exam-result';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';

import { trigger, transition, style, state, animate } from '@angular/animations';
import { GeneralContext } from 'app/model/general-context';

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

  takeExam(exam: Exam, isPractice: boolean = false) {
    if (exam.isPending()) {
      this.router.navigate(['/results', this.service.pendingId(exam.id)])
    } else {
      if (!this.context.confirm('Ready to start the exam?!')) return
      this.service.startExam(exam.id, isPractice).then(rid => {
        this.router.navigate(['/question', rid, 0])
      })
    }
  }

  showExamResult(result: ExamResult) {
    let er = this.service.getExamResult(result.id)
    if (er.isLocked()) this.router.navigate(['/results', result.id])
    else {
      if (!confirm('Ready to continue the exam?!')) return
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
}
