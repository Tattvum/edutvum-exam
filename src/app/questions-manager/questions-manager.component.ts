import { Component, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ExamResult } from '../model/exam-result';
import { Router } from '@angular/router';
import { Lib, KEY } from '../model/lib';
import { GeneralContext } from '../model/general-context';
import { DataService, QuestionsManagerDisplayContext } from '../model/data.service';
import { AnswerType } from '../model/answer-type';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaceComponent } from '../common/sp.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-questions-manager',
  standalone: true,
  imports: [
    SpaceComponent,
    MatTooltipModule, MatSlideToggleModule,
  ],
  templateUrl: './questions-manager.component.html',
  styleUrls: ['./questions-manager.component.scss']
})
export class QuestionsManagerComponent {

  @Input() result: ExamResult

  isResultsPage = false

  private _qidn: number
  get qidn(): number {
    return this._qidn
  }
  @Input() set qidn(value: number) {
    this._qidn = value
    this.isResultsPage = this.qidn < 0
  }

  @Output() clicked = new EventEmitter<number>()
  click(i: number) {
    this.clicked.emit(i);
  }

  context: QuestionsManagerDisplayContext

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.context.disableHotkeys) return
    // console.log('window:keydown', event, event.key)
    if (Lib.isPlainKey(event, KEY.ARROW_RIGHT)) this.next()
    else if (Lib.isPlainKey(event, KEY.ARROW_LEFT)) this.prev()
    else if (event.key === KEY.ENTER) {
      if (event.ctrlKey === true) this.results()
      else this.markGuess(event.altKey === true)
    }
  }

  constructor(private router: Router,
    private generalContext: GeneralContext, service: DataService) {
    this.context = service
  }

  ngOnInit() { }

  async results() {
    if (Lib.isNil(this.result)) return
    if (!this.result.isLocked() && !this.result.isPracticeMode) {
      if (!this.generalContext.confirm('Done with the exam?!')) return
      this.result = await this.context.finishExam()
    }
    this.click(-1)
  }

  markGuess(guessed: boolean) {
    if (!this.result.isAttempted(this.qidn) || this.result.isLocked()) return
    this.result.guessings[this.qidn] = guessed
    this.context.saveExam()
    if (!this.result.isPracticeMode) this.next()
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

  isGrouped(qidn: number): boolean {
    return this.result.exam.questions[qidn].groups.length > 0
  }

  info(qidn: number): string {
    if (!this.result.isLocked()) return ""
    const q = this.result.questions[qidn]
    const marks = this.result.marks(qidn)
    return `${qidn + 1} | ${q.id} | ${AnswerType[q.type]} -- Marks : ${marks.value}/${marks.max}`
  }

}
