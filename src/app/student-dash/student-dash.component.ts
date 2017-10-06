import { Component, OnInit } from '@angular/core';
// http://momentjs.com/docs/
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Exam } from '../model/exam';
import { ExamResult } from '../model/exam-result';
import { DataService } from '../model/data.service';

import { trigger, transition, style, state, animate } from '@angular/animations';

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
    ])
  ]
})
export class StudentDashComponent implements OnInit {

  public pageExam
  public pageResult
  public currentUser

  public ok = false

  toggleOK() {
    this.ok = !this.ok
  }

  constructor(public service: DataService, private router: Router) { }

  ngOnInit(): void {
    this.currentUser = this.service.user().uid
  }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  userChanged() {
    console.log(this.currentUser)
    if (this.currentUser) this.service.switchUser(this.currentUser)
  }

  takeExam(exam: Exam) {
    if (!confirm('Ready to start the exam?!')) return
    this.service.startExam(exam.id).then(rid => {
      this.router.navigate(['/question', rid, 0])
    })
  }

  showExamResult(result: ExamResult) {
    let er = this.service.getExam(result.id)
    if (er.isLocked()) this.router.navigate(['/results', result.id])
    else {
      if (!confirm('Ready to continue the exam?!')) return
      this.router.navigate(['/question', result.id, 0])
    }
  }
}
