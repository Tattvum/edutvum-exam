import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StudentService, Exam, Results } from '../model/student.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  exam: Exam
  results: Results

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: StudentService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      this.exam = this.service.getExam(eid)
      this.results = this.exam.scoreResults()
    })
  }

}
