import { Component, OnInit } from '@angular/core';
// http://momentjs.com/docs/
import * as moment from 'moment';
import { Router } from '@angular/router';

import { Exam } from '../model/exam';
import { ExamResult } from '../model/exam-result';
import { DataService } from '../model/data.service';

@Component({
  selector: 'app-student-dash',
  templateUrl: './student-dash.component.html',
  styleUrls: ['./student-dash.component.scss'],
})
export class StudentDashComponent {

  public pageExam
  public pageResult

  constructor(
    public service: DataService,
    private router: Router) { }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  takeExam(exam: Exam) {
    if (!confirm('Ready to start the exam?!')) return
    let rid = this.service.startExam(exam.id)
    this.router.navigate(['/question', rid, 0])
  }

  showExamResult(result: ExamResult) {
    this.router.navigate(['/results', result.id])
  }
}
