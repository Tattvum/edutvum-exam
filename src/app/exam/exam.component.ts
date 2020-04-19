import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { Lib } from '../model/lib';
import { EMPTY_EXAM_RESULT, ExamResult } from 'app/model/exam-result';
import { Question } from 'app/model/question';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  isResultsPage = false
  isLocked = false
  result: ExamResult = EMPTY_EXAM_RESULT
  qid: string
  question: Question

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      if (Lib.isNil(eid)) return
      this.result = this.service.getExam(eid)
      this.isLocked = this.result.isLocked()
      this.qid = params['qid']
      this.isResultsPage = (Lib.isNil(this.qid))
      if (this.isResultsPage) this.question = null
      else this.question = this.service.getQuestion(eid, this.qid)
    })
  }
}
