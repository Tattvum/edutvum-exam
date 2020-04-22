import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ExamResult } from '../model/exam-result';
import { Router } from '@angular/router';
import { Lib, KEY } from 'app/model/lib';
import { GeneralContext } from 'app/model/general-context';
import { DataService, QuestionsManagerDisplayContext } from 'app/model/data.service';

@Component({
  selector: 'app-questions-manager',
  templateUrl: './questions-manager.component.html',
  styleUrls: ['./questions-manager.component.scss']
})
export class QuestionsManagerComponent {

  @Input() result: ExamResult
  @Input() qidn: number

  @Output() clicked = new EventEmitter<number>()

  click(i: number) {
    this.clicked.emit(i);
  }

  isResultsPage = false
  context: QuestionsManagerDisplayContext

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.context.disableHotkeys) return
    // console.log('window:keydown', event, event.key)
    if (Lib.isCtrlKey(event, KEY.ARROW_RIGHT)) this.next()
    else if (Lib.isCtrlKey(event, KEY.ARROW_LEFT)) this.prev()
    else if (event.key === KEY.ENTER) {
      if (event.ctrlKey === true) this.results()
      else this.markGuess(event.altKey === true)
    }
  }

  constructor(private router: Router,
    private generalContext: GeneralContext, service: DataService) {
    this.context = service
  }

  ngOnInit() {
    this.isResultsPage = this.qidn < 0
  }

  results() {
    if (Lib.isNil(this.result)) return
    if (!this.result.isLocked()) {
      if (!this.generalContext.confirm('Done with the exam?!')) return
      this.context.finishExam().then(er => {
        this.result = er
        this.click(-1)
      })
    } else {
      this.click(-1)
    }
  }

  markGuess(guessed: boolean) {
    if (!this.result.isAttempted(this.qidn) || this.result.isLocked()) return
    this.result.guessings[this.qidn] = guessed
    this.context.saveExam()
    this.next()
  }

  next() {
    let qid = this.result.nextq(this.qidn)
    if (qid == null) this.results()
    else this.select(+qid)
  }

  prev() {
    let qid = this.result.prevq(this.qidn)
    if (qid == null) this.results()
    else this.select(+qid)
  }

  select(qidn: number) {
    this.click(qidn)
  }

}
