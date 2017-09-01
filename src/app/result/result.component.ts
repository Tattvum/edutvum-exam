import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Score } from '../model/score';
import { Lib } from '../model/lib';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  results: Score

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      let exam = this.service.getExam(eid)
      this.results = null
      if (Lib.isNil(exam)) return
      this.exam = exam
      this.results = this.exam.score()
    })
  }

}
