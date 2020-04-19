import 'rxjs'
import { Observable } from 'rxjs';

import { Component, OnInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService, ExamEditType, FileLink } from '../model/data.service';
import { ExamStatus } from '../model/exam';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { GeneralContext } from '../model/general-context';
import { Lib, KEY } from '../model/lib';

import { Upload } from '../model/upload';
import { FirebaseUpload } from '../model/firebase-upload.service';
import { EMPTY_QUESTION } from 'app/model/question';
import { MARKING_SCHEME_TYPE_NAMES, MarkingSchemeType } from 'app/model/marks';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() result: ExamResult

  question = EMPTY_QUESTION
  isResultsPage = false
  qidn: number
  // readonly schemes = MARKING_SCHEME_TYPE_NAMES

  selectedFiles: FileList;
  currentUpload: Upload;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.service.disableHotkeys) return
    // console.log('window:keydown', event, event.key)
    if (Lib.isCtrlKey(event, KEY.ARROW_RIGHT)) this.next()
    else if (Lib.isCtrlKey(event, KEY.ARROW_LEFT)) this.prev()
    else if (event.key === KEY.ENTER) {
      if (event.ctrlKey === true) this.results()
      else this.markGuess(event.altKey === true)
    } if (event.key === KEY.ESCAPE) {
      this.gotoDash()
    }
  }

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
      this.service.finishExam().then(er => {
        this.result = er
        this.router.navigate(['/results', this.result.id])
      })
    } else {
      this.service.finishExamYetContinue()
    }
  }

  snapshot() {
    if (this.result.isLocked()) return
    console.log("CAUTION: TBD: What if a snapshot is taken but then the exam is cancelled?")
    return // CAUTION: TBD: What if a snapshot is taken but then the exam is cancelled?
    //this.service.finishExamYetContinue()
  }

  showSnapshot(i: number) {
    if (!this.result.isLocked()) return
    console.log("showSnapshot:", i)
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private generalContext: GeneralContext,
    private uploader: FirebaseUpload,
    public service: DataService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.result = EMPTY_EXAM_RESULT
      this.isResultsPage = false
      this.qidn = -1
      let eid = params['eid']
      let exam = this.service.getExam(eid)
      if (Lib.isNil(exam)) return
      this.result = exam
      let qid = params['qid']
      this.isResultsPage = (Lib.isNil(qid))
      if (this.isResultsPage) return
      this.qidn = +qid
      this.question = this.result.questions[this.qidn]
      this.isResultsPage = false
      console.log("ngOnInit-exam", this.result.id)
      this.service.timerOnlyMe(t => this.timerAction(t))
    })
  }

  get isPending(): boolean {
    return this.result.exam.status === ExamStatus.PENDING && this.service.isAdmin
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

  markGuess(guessed: boolean) {
    if (!this.result.isAttempted(this.qidn) || this.result.isLocked()) return
    this.result.guessings[this.qidn] = guessed
    this.service.saveExam()
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

  select(qid: number) {
    this.router.navigate(['/question', this.result.id, qid])
  }

  results() {
    if (Lib.isNil(this.result)) return
    if (!this.result.isLocked()) {
      if (!this.generalContext.confirm('Done with the exam?!')) return
      this.service.finishExam().then(er => {
        this.result = er
        this.router.navigate(['/results', this.result.id])
      })
    } else {
      this.router.navigate(['/results', this.result.id])
    }
  }

  pauseExam() {
    if (!this.result.isLocked()) {
      this.service.pauseExam().then(ok => {
        this.generalContext.alert('The exam will be paused now. \nYou can resume from the dashboard.')
        this.router.navigate(['/student-dash'])
      })
    }
  }

  gotoDash() {
    if (this.result.isLocked()) {
      this.router.navigate(['/student-dash'])
    } else if (this.generalContext.confirm('Cancel the exam: Sure?!')) {
      this.service.cancelExam().then(ok => {
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
    this.service.editExamMaxDuration(value, this.result.exam.id)
  }

  get markingScheme(): string {
    return MARKING_SCHEME_TYPE_NAMES[this.result.exam.markingScheme]
  }
  set markingScheme(value: string) {
    console.log(value, (<any>MarkingSchemeType)[value])
    this.result.exam.markingScheme = (<any>MarkingSchemeType)[value]
    this.service.editExamMarkingScheme(value, this.result.exam.id)
  }

  onEditTitle(newtext) {
    this.result.exam.title = newtext
    this.service.editExamTitle(newtext, this.result.exam.id)
  }

  addQuestion() {
    this.service.addQuestion(this.qidn).then(n => {
      this.router.navigate(['/question', this.result.id, n])
    })
  }

  addLinkQuestion() {
    let fullid = this.generalContext.prompt('Please enter the LINK ExamID.QuestionID')
    if (fullid && fullid.length > 0) {
      this.service.addLinkQuestion(fullid).then(ok => {
        this.router.navigate(['/question', this.result.id, this.result.questions.length - 1])
      })
    }
  }

  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    console.log(this.selectedFiles)
    Lib.range(this.selectedFiles.length).forEach(i => {
      this.currentUpload = new Upload(this.selectedFiles.item(i));
      this.uploader.pushUpload(this.result.exam.id, this.qidn, this.currentUpload)
    })
  }

  copyUrlToClipboard(f: FileLink, event) {
    let selectbox = event.target.parentNode.querySelector('.selectbox')
    selectbox.select()
    document.execCommand('Copy')
    console.log('copied', f.url)
  }

  removeFile(f: FileLink) {
    if (this.generalContext.confirm(`Delete the file: ${f.file}. Sure?!
      \n Please ensure that your existing tags are not using it.`)) {
      console.log(f.id)
      this.uploader.deleteFileStorage(this.result.exam.id, this.qidn, f)
    }
  }

  startGroup() {
    this.service.startGroup(this.qidn).then(ok => {
      this.router.navigate(['/question', this.result.id, this.result.questions.length - 1])
    })
  }

  deleteQuestion() {
    if (this.generalContext.confirm('Question deletion is irretrievable! Continue?!')) {
      this.service.deleteQuestion(this.qidn).then(ok => {
        this.router.navigate(['/results', this.result.id])
      })
    }
  }

}
