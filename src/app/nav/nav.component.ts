import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, NavDisplayContext, TagsDisplayContextImpl, TagsDisplayContext } from '../model/data.service';
import { ExamResult } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { Lib, KEY } from '../model/lib';

import { MARKING_SCHEME_TYPE_NAMES, MarkingSchemeType } from '../model/marks';
import { Question } from '../model/question';
import { SpaceComponent } from '../common/sp.component';
import { EditorComponent } from '../editor/editor.component';
import { TagsManagerComponent } from '../tags-manager/tags-manager.component';
import { TimerComponent } from '../common/timer.component';
import { DatePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    SpaceComponent, EditorComponent, TagsManagerComponent, TimerComponent,
    MatFormFieldModule, MatChipsModule, MatSelectModule, MatSlideToggleModule, DatePipe,
    FormsModule,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() result: ExamResult
  @Input() qidn: number
  @Input() question: Question
  @Input() isResultsPage: boolean = false

  @Input() snapshots: ExamResult[]
  @Output() snapshotSelected = new EventEmitter<number>();
  @Input() sidn: number = -1
  @Input() tagsExamContext: TagsDisplayContext

  selectSnapshot(i: number) {
    this.sidn = i
    this.snapshotSelected.emit(i);
  }

  // readonly schemes = MARKING_SCHEME_TYPE_NAMES

  public timerAction(t: number) {
    if (!this.result || !!this.result.isLocked()) return
    this.result.durationInc(this.qidn)

    if (this.result.exam.maxDuration < 1) return
    let durTotal = this.result.durationTotal()
    if (durTotal % 60 !== 0) return
    let mins = Math.trunc(durTotal / 60)
    console.log(mins + " minutes..",
      this.result.exam.maxDuration === mins,
      mins - this.result.exam.maxDuration >= 0.1)

    //CAUTION: simple one, mins !== this.result.exam.maxDuration, is never true!?
    if (mins < this.result.exam.maxDuration) return
    if (mins - this.result.exam.maxDuration >= 0.1) return
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
    this.tagsExamContext = new TagsDisplayContextImpl(service, "exam")
  }

  ngOnInit() {
    this.context.timerOnlyMe(t => this.timerAction(t))
  }

  get isPending(): boolean {
    return this.result.exam.isPending() && this.context.isAdmin
  }

  isBelowVer6(): boolean {
    if (this.result) return this.result.durationTotal() < 1
    else return true
  }

  private seconds(): number {
    if (Lib.isNil(this.result)) return 0
    let s = this.result.duration(this.qidn)
    if (Lib.isNil(s)) return 0
    if (Number.isNaN(s)) return 0
    return s
  }
  get qsec(): number {
    if (this.isResultsPage) return 0
    else return this.seconds()
  }

  private secondsTotal(): number {
    if (this.result) return this.result.durationTotal()
    else return 0
  }
  get tsec(): number {
    return this.secondsTotal()
  }

  timize(secs: number) {
    return Lib.timize(secs)
  }

  results() {
    if (Lib.isNil(this.result)) return
    if (!this.result.isLocked()) {
      if (!this.generalContext.confirm(`Done with the ${this.result.name}?!`)) return
      this.context.finishExam().then(er => {
        this.result = er
        this.router.navigate(['/results', this.result.id])
      })
    } else {
      console.log("navigate:", '/results', this.result.id)
      this.router.navigate(['/results', this.result.id])
    }
  }

  pauseExam() {
    if (!this.result.isLocked()) {
      this.context.pauseExam().then(ok => {
        this.generalContext.alert(`The ${this.result.name} will be paused now. \nYou can resume from the dashboard.`)
        this.router.navigate(['/student-dash'])
      })
    }
  }

  gotoDash() {
    if (this.result.isLocked()) {
      this.router.navigate(['/student-dash'])
    } else {
      if (this.result.isPracticeMode) {
        // CAUTION: If allowed to cancel, there is no record of seeing the exam. So, will fail for now.
        // TBD: practice cancel needs permenant solution. (4.9.2)
        this.generalContext.alert('Cancel Failed.')
      } else if (this.generalContext.confirm(`Cancel the exam: Sure?!`)) {
        this.context.cancelExam().then(ok => {
          this.router.navigate(['/student-dash'])
        })
      }
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

  get markingSchemes(): string[] {
    return this.context.markings.map(m => m.id)
  }

  get markingScheme(): string {
    return this.result.exam.marking.id
  }
  set markingScheme(value: string) {
    this.result.exam.marking = this.context.getMarking(value)
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
    if (this.result.questions.length <= 1) {
      this.generalContext.alert("At least one question should be there.")
    } else {
      if (this.generalContext.confirm('Question deletion is irretrievable! Continue?!')) {
        this.context.deleteQuestion(this.qidn).then(ok => {
          this.router.navigate(['/results', this.result.id])
        })
      }
    }
  }

}
