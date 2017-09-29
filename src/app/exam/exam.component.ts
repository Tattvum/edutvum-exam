import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';
import { EMPTY_EXAM_RESULT, ExamResult } from 'app/model/exam-result';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  isResultsPage = false
  isLocked = false
  exam: ExamResult = EMPTY_EXAM_RESULT

  constructor(private route: ActivatedRoute,
    private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let qid = params['qid']
        this.isResultsPage = (Lib.isNil(qid))
        let eid = params['eid']
        if (Lib.isNil(eid)) return
        this.exam = this.service.getExam(eid)
        this.isLocked = this.exam.isLocked()
      })
  }
}
