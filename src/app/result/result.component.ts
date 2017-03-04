import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService, Exam, Results } from '../model/data.service';

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
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      this.exam = this.service.getExam(eid)
      this.results = this.exam.scoreResults()
    })
  }

}
