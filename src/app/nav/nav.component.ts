import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { Lib } from '../model/lib';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESCAPE = 27,
  ENTER = 13,
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  isResultsPage = false
  qidn: number
  whatTime = Observable.interval(1000).map(x => new Date()).share();

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.next()
    }
    if (event.keyCode === KEY_CODE.ENTER) {
      this.markGuess(event.altKey === true)
    }
    if (event.keyCode === KEY_CODE.ENTER && event.ctrlKey === true) {
      this.results()
    }
    if (event.keyCode === KEY_CODE.ESCAPE && event.ctrlKey === true) {
      this.gotoDash()
    }
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private context: GeneralContext,
    private service: DataService) { }

  ngOnInit() {
    //    console.log('ngOnInit')
    this.route.params.subscribe((params: Params) => {
      this.exam = EMPTY_EXAM_RESULT
      this.isResultsPage = false
      this.qidn = -1
      let eid = params['eid']
      let exam = this.service.getExam(eid)
      if (Lib.isNil(exam)) return
      this.exam = exam
      let qid = params['qid']
      this.isResultsPage = (Lib.isNil(qid))
      if (this.isResultsPage) return
      this.qidn = +qid
      this.isResultsPage = false
    })
  }

  markGuess(guessed: boolean) {
    if (!this.exam.isAttempted(this.qidn) || this.exam.isLocked()) return
    this.exam.guessings[this.qidn] = guessed
    this.next()
  }

  next() {
    let qid = this.exam.nextq(this.qidn)
    if (qid == null) this.results()
    else this.select(+qid)
  }

  select(qid: number) {
    this.router.navigate(['/question', this.exam.id, qid])
  }

  results() {
    if (Lib.isNil(this.exam)) return
    if (!this.exam.isLocked()) {
      if (!this.context.confirm('Done with the exam?!')) return
      this.service.saveExam().then(er => {
        this.exam = er
        this.router.navigate(['/results', this.exam.id])
      })
    } else {
      this.router.navigate(['/results', this.exam.id])
    }
  }

  gotoDash() {
    if (!this.exam.isLocked() && !this.context.confirm('Cancel the exam: Sure?!')) return
    this.router.navigate(['/student-dash'])
  }
}
