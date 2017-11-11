import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService, ExamEditType } from '../model/data.service';
import { Question } from '../model/question';
import { Lib } from '../model/lib';
import { EMPTY_EXAM_RESULT, ExamResult } from 'app/model/exam-result';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  qid
  exam: ExamResult
  question: Question

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.qid = params['qid']
        this.exam = this.service.getExam(eid)
        this.question = this.service.getQuestion(eid, this.qid)
      })
  }

  onEditQE(newtext) {
    this.question.explanation = newtext
    this.service.editQuestionExplanation(newtext, this.qid)
  }

  onEditEE(newtext) {
    this.exam.exam.explanation = newtext
    this.service.editExamExplanation(newtext, this.question.eid)
  }

}
