import 'rxjs'

import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, NavDisplayContext } from '../model/data.service';
import { ExamStatus } from '../model/exam';
import { ExamResult } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { Lib, KEY } from '../model/lib';

import { MARKING_SCHEME_TYPE_NAMES, MarkingSchemeType } from 'app/model/marks';
import { Question, EMPTY_QUESTION } from 'app/model/question';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() result: ExamResult
  @Input() qidn: number
  @Input() question: Question

  isResultsPage = false
  // readonly schemes = MARKING_SCHEME_TYPE_NAMES

  public timerAction(t: number) {
    if (!this.result || !!this.result.isLocked()) return
    this.result.durationInc(this.qidn)

    if (this.result.exam.maxDuration < 1) return
    let durTotal = this.result.durationTotal()
    if (durTotal % 60 !== 0) return
    let mins = durTotal / 60
    console.log(mins + " minutes..")

    if (mins < this.result.exam.maxDuration) return
    console.log("EVENT!!")
    if (this.generalContext.confirm('Time is up. Stop exam?')) {
      this.context.finishExam().then(er => {
        this.result = er
        this.router.navigate(['/results', this.result.id])
      })
    } else {
      this.context.finishExamYetContinue()
    }
  }

  snapshot() {
    if (this.result.isLocked()) return
    console.log("CAUTION: TBD: What if a snapshot is taken but then the exam is cancelled?")
    return // CAUTION: TBD: What if a snapshot is taken but then the exam is cancelled?
    //this.context.finishExamYetContinue()
  }

  showSnapshot(i: number) {
    if (!this.result.isLocked()) return
    console.log("showSnapshot:", i)
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.context.disableHotkeys) return
    if (event.key === KEY.ESCAPE) {
      this.gotoDash()
    }
  }

  context: NavDisplayContext

  constructor(private router: Router,
    private generalContext: GeneralContext, service: DataService) {
    this.context = service
  }

  ngOnInit() {
    this.isResultsPage = this.qidn < 0
    this.context.timerOnlyMe(t => this.timerAction(t))
    if (!this.isResultsPage) this.question = this.result.questions[this.qidn]
    else this.question = EMPTY_QUESTION
  }

  get isPending(): boolean {
    return this.result.exam.status === ExamStatus.PENDING && this.context.isAdmin
  }

  isBelowVer6(): boolean {
    if (this.result) return this.result.durationTotal() < 1
    else return true
  }

  private seconds(): number {
    if (Lib.isNil(this.result)) return 0
    let s = this.result.duration(this.qidn)
    if (Lib.isNil(s)) return 0
    if (s === NaN) return 0
    return s
  }
  qsec() {
    if (this.isResultsPage) return ''
    else return Lib.timize(this.seconds())
  }

  private secondsTotal(): number {
    if (this.result) return this.result.durationTotal()
    else return 0
  }
  tsec() {
    return Lib.timize(this.secondsTotal())
  }

  mins(secs: number) {
    return Lib.timize(secs)
  }

  results() {
    if (Lib.isNil(this.result)) return
    if (!this.result.isLocked()) {
      if (!this.generalContext.confirm('Done with the exam?!')) return
      this.context.finishExam().then(er => {
        this.result = er
        this.router.navigate(['/results', this.result.id])
      })
    } else {
      this.router.navigate(['/results', this.result.id])
    }
  }

  pauseExam() {
    if (!this.result.isLocked()) {
      this.context.pauseExam().then(ok => {
        this.generalContext.alert('The exam will be paused now. \nYou can resume from the dashboard.')
        this.router.navigate(['/student-dash'])
      })
    }
  }

  gotoDash() {
    if (this.result.isLocked()) {
      this.router.navigate(['/student-dash'])
    } else if (this.generalContext.confirm('Cancel the exam: Sure?!')) {
      this.context.cancelExam().then(ok => {
        this.router.navigate(['/student-dash'])
      })
    }
  }

  get maxDuration(): number {
    let value = this.result.exam.maxDuration
    return value ? value : 0
  }

  maxDurationChange(value: number) {
    this.result.exam.maxDuration = value
    this.context.editExamMaxDuration(value, this.result.exam.id)
  }

  get markingScheme(): string {
    return MARKING_SCHEME_TYPE_NAMES[this.result.exam.markingScheme]
  }
  set markingScheme(value: string) {
    console.log(value, (<any>MarkingSchemeType)[value])
    this.result.exam.markingScheme = (<any>MarkingSchemeType)[value]
    this.context.editExamMarkingScheme(value, this.result.exam.id)
  }

  onEditTitle(newtext) {
    this.result.exam.title = newtext
    this.context.editExamTitle(newtext, this.result.exam.id)
  }

  addQuestion() {
    this.context.addQuestion(this.qidn).then(n => {
      this.router.navigate(['/question', this.result.id, n])
    })
  }

  addLinkQuestion() {
    let fullid = this.generalContext.prompt('Please enter the LINK ExamID.QuestionID')
    if (fullid && fullid.length > 0) {
      this.context.addLinkQuestion(fullid).then(ok => {
        this.router.navigate(['/question', this.result.id, this.result.questions.length - 1])
      })
    }
  }

  startGroup() {
    this.context.startGroup(this.qidn).then(ok => {
      this.router.navigate(['/question', this.result.id, this.result.questions.length - 1])
    })
  }

  deleteQuestion() {
    if (this.generalContext.confirm('Question deletion is irretrievable! Continue?!')) {
      this.context.deleteQuestion(this.qidn).then(ok => {
        this.router.navigate(['/results', this.result.id])
      })
    }
  }

}
