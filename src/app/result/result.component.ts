import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Lib } from '../model/lib';
import { MarkingSchemeType } from 'app/model/marks';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  array = []

  get examMarkingScheme(): string {
    return MarkingSchemeType[this.exam.exam.markingScheme]
  }

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
    })
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
