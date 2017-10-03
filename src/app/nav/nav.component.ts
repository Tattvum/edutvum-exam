import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from '../model/data.service';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { Lib, KEY } from '../model/lib';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  exam: ExamResult = EMPTY_EXAM_RESULT
  isResultsPage = false
  qidn: number

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log('window:keydown', event, event.key)
    if (Lib.isPlainKey(event, KEY.ARROW_RIGHT)) this.next()
    else if (Lib.isPlainKey(event, KEY.ARROW_LEFT)) this.prev()
    else if (event.key === KEY.ENTER) {
      if (event.ctrlKey === true) this.results()
      else this.markGuess(event.altKey === true)
    } if (event.key === KEY.ESCAPE) {
      this.gotoDash()
    }
  }

  public timerAction(t: number) {
    if (this.exam && !this.exam.isLocked()) this.exam.durationInc(this.qidn)
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private context: GeneralContext,
    private service: DataService) {
  }

  ngOnInit() {
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
      this.service.timerOnlyMe(t => this.timerAction(t))
    })
  }

  isBelowVer6(): boolean {
    if (this.exam) return this.exam.durationTotal() < 1
    else return true
  }

  private seconds(): number {
    if (Lib.isNil(this.exam)) return 0
    let s = this.exam.duration(this.qidn)
    if (Lib.isNil(s)) return 0
    if (s === NaN) return 0
    return s
  }
  qsec() {
    if (this.isResultsPage) return ''
    else return Lib.timize(this.seconds())
  }

  private secondsTotal(): number {
    if (this.exam) return this.exam.durationTotal()
    else return 0
  }
  tsec() {
    return Lib.timize(this.secondsTotal())
  }

  markGuess(guessed: boolean) {
    if (!this.exam.isAttempted(this.qidn) || this.exam.isLocked()) return
    this.exam.guessings[this.qidn] = guessed
    this.service.saveExam()
    this.next()
  }

  next() {
    let qid = this.exam.nextq(this.qidn)
    if (qid == null) this.results()
    else this.select(+qid)
  }

  prev() {
    let qid = this.exam.prevq(this.qidn)
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
      this.service.finishExam().then(er => {
        this.exam = er
        this.router.navigate(['/results', this.exam.id])
      })
    } else {
      this.router.navigate(['/results', this.exam.id])
    }
  }

  pauseExam() {
    if (!this.exam.isLocked()) {
      this.service.pauseExam().then(ok => {
        this.context.alert('The exam will be paused now. \nYou can resume from the dashboard.')
        this.router.navigate(['/student-dash'])
      })
    }
  }

  gotoDash() {
    if (this.exam.isLocked()) {
      this.router.navigate(['/student-dash'])
    } else if (this.context.confirm('Cancel the exam: Sure?!')) {
      this.service.cancelExam().then(ok => {
        this.router.navigate(['/student-dash'])
      })
    }
  }
}
