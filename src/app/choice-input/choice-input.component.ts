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

  get ctype(): string {
    switch (this.question.type) {
      case AnswerType.NCQ: return 'number'
      case AnswerType.MAQ: return 'checkbox'
      default: return 'radio'
    }
  }

  choiceClicked(event, cid: number) {
    if (event.target.checked) this.exam.setAnswer(+this.qid, cid)
    else this.exam.removeAnswer(+this.qid, cid)
  }

  getAnswer(i: number): number {
    let q = this.exam.answers[+this.qid]
    let ans = 0
    if (q != null && q.length > 0) ans = q[i]
    return ans
  }

  colors(i: number) {
    if (!this.exam.isLocked()) return {}
    let qidn = +this.qid
    let ans = (i != null) ? i : this.getAnswer(0)
    let isans = this.exam.isAnswer(qidn, ans)
    let issol = this.exam.isSolution(qidn, ans)
    let result = {
      'correct': issol,
      'done': isans && issol,
      'notcorrect': isans && !issol
    }
    return result
  }

  debug(obj) {
    console.log(obj)
  }

  get ncqtext(): string {
    return this.getAnswer(0) + ''
  }
  set ncqtext(t: string) {
    this.exam.setAnswer(+this.qid, +t)
  }

  markGuess(guessed: boolean) {
    if (!this.exam.isAttempted(+this.qid) || this.exam.isLocked()) return
    this.exam.guessings[+this.qid] = guessed
  }

}
