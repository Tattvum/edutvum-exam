import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { AnswerType } from '../model/answer-type';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Question, EMPTY_QUESTION } from '../model/question';
import { Lib } from '../model/lib';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-choice-input',
  templateUrl: './choice-input.component.html',
  styleUrls: ['./choice-input.component.css']
})
export class ChoiceInputComponent implements OnInit {

  qid: string
  question: Question = EMPTY_QUESTION
  exam: ExamResult = EMPTY_EXAM_RESULT
  AAA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      this.qid = params['qid']
      if (Lib.isNil(eid) || Lib.isNil(this.qid)) return
      this.exam = this.service.getExam(eid)
      this.question = this.service.getQuestion(eid, this.qid)
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    })
  }

  clearAll() {
    if (!this.exam.isLocked()) this.exam.clearAnswers(+this.qid)
  }
}
