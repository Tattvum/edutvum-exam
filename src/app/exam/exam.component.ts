import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService, Exam } from '../model/data.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  exam: Exam
  isResultsPage = false

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.exam = this.service.getExam(eid)
        //console.log('BASE EXAM', eid, this.exam)
        this.isResultsPage = this.exam.isResultsPage()
      })
  }

  gotoDash() {
    if (!this.exam.inAnswerMode
      && !confirm("Cancel the exam: Sure?!"))
      return
    this.router.navigate(['/student-dash'])
  }
}
