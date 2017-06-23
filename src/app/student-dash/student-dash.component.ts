import { Component, OnInit } from '@angular/core';
//http://momentjs.com/docs/
import * as moment from 'moment';
import { DataService } from '../model/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dash',
  templateUrl: './student-dash.component.html',
  styleUrls: ['./student-dash.component.css'],
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

  takeExam(exam) {
    if(!confirm("Ready to start the exam?!")) return
    console.log(exam.name)
    this.router.navigate(['/question', exam.id, 0])
  }

  showExamResult(exam) {
    console.log(exam.name + " " + exam.percent())
    this.router.navigate(['/question', exam.id, 0])
  }
}
