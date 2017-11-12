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

  constructor(private route: ActivatedRoute, public service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        this.qid = params['qid']
        this.exam = this.service.getExam(eid)
        this.question = this.service.getQuestion(eid, this.qid)
      })
  }

  editExplanationQ(newtext) {
    this.question.explanation = newtext
    this.service.editQuestionExplanation(newtext, this.qid)
  }

  editExplanationE(newtext) {
    this.exam.exam.explanation = newtext
    this.service.editExamExplanation(newtext, this.question.eid)
  }

  editNotesQ(newtext) {
    this.question.notes = newtext
    this.service.editQuestionNotes(newtext, this.qid)
  }

  editNotesE(newtext) {
    this.exam.exam.notes = newtext
    this.service.editExamNotes(newtext, this.question.eid)
  }

}
