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
  report = {
    correct: {
      sure: 0,
      guess: 0,
    },
    wrong: {
      sure: 0,
      guess: 0,
    },
    total: {
      correct: 0,
      wrong: 0,
      sure: 0,
      guess: 0,
      skipped: 0,
      attempted: 0,
      total: 0,
    }
  }

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
      this.compute()
    })
  }

  compute() {
    this.exam.answers.forEach((ans, qid) => {
      if (ans !== undefined) {
        if (this.exam.isAttempted(qid)) {
          this.report.total.attempted++
          if (this.exam.isCorrect(qid)) {
            this.report.total.correct++
            if (this.exam.guessings[qid]) {
              this.report.correct.guess++
              this.report.total.guess++
            } else {
              this.report.correct.sure++
              this.report.total.sure++
            }
          } else {
            this.report.total.wrong++
            if (this.exam.guessings[qid]) {
              this.report.wrong.guess++
              this.report.total.guess++
            } else {
              this.report.wrong.sure++
              this.report.total.sure++
            }
          }
        } else this.report.total.skipped++
      }
    })
    let total = this.report.total.total = this.exam.questions.length
    this.report.total.skipped = total - this.report.total.attempted
  }
}
