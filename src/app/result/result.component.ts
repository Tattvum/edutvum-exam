import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Data } from '../chart/chart.component';
import { Score } from '../model/score';
import { Lib } from '../model/lib';
import { AnswerType } from '../model/answer-type';
import { Question } from '../model/question';
import { Scorer, Modes } from './scorer';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT

  unit = 0
  unitName = ""
  scorer: Scorer = null
  array = []

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      let exam = this.service.getExam(eid)
      if (Lib.isNil(exam)) return
      this.exam = exam
      this.prepareChart()
      this.scorer = new Scorer(exam)
      this.changeUnit()
    })
  }

  changeUnit() {
    //let pcent = (q: number) => (q / this.r3.q) * 100
    //WARNING: This + is required!!
    switch(+this.unit) {
      case 0: {
        this.scorer.mode = Modes.Simple
        this.unitName = "Questions"
        break
      }
      case 1: {
        this.scorer.mode = Modes.JEE
        this.unitName = "Marks"
        break;
      }
      case 2: {
        this.scorer.mode = Modes.Percent
        this.unitName = "Percentage %"
        break;
      }
    }
  }

  private prepareChart() {
    let defval = (a, b) => Lib.isNil(a) ? b : a
    this.array = []
    this.exam.questions.forEach((q, qid) => {
      let d = this.exam.durations[qid]
      this.array.push({
        value: defval(this.exam.durations[qid], 0),
        attempted: defval(this.exam.isAttempted(qid), false),
        correct: defval(this.exam.isCorrect(qid), false),
        guess: defval(this.exam.guessings[qid], false),
        action: () => {
          console.log('action', qid)
          this.router.navigate(['/question', this.exam.id, qid])
        }
      })
    })
  }

}
