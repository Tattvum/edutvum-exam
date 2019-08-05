import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService, ExamEditType } from '../model/data.service';
import { AnswerType, ANSWER_TYPE_NAMES } from '../model/answer-type';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Question, EMPTY_QUESTION } from '../model/question';
import { Lib, KEY } from '../model/lib';
import { GeneralContext } from 'app/model/general-context';
import { Comment, CommentList } from 'app/model/comment';
import * as moment from 'moment';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-choice-input',
  templateUrl: './choice-input.component.html',
  styleUrls: ['./choice-input.component.scss']
})

export class ChoiceInputComponent implements OnInit {

  qid: string
  question: Question = EMPTY_QUESTION
  exam: ExamResult = EMPTY_EXAM_RESULT
  AAA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  solutions = ''
  mytype = ANSWER_TYPE_NAMES
  type = 'MCQ'
  newcomment = ''

  @ViewChild('first', { static: true }) private elementRef: ElementRef;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.service.disableHotkeys) return
    if (Lib.isPlainKey(event, KEY.ARROW_UP)) this.elementRef.nativeElement.focus()
    else if (Lib.isPlainKey(event, KEY.ARROW_DOWN)) this.elementRef.nativeElement.focus()
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private context: GeneralContext,
    public service: DataService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let eid = params['eid']
      this.qid = params['qid']
      if (Lib.isNil(eid) || Lib.isNil(this.qid)) return
      this.exam = this.service.getExam(eid)
      this.question = this.service.getQuestion(eid, this.qid)
      this.setSolutions()
      this.setType()
      this.setComment()
      MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    })
  }

  clearAll() {
    if (!this.exam.isLocked()) this.exam.clearAnswers(+this.qid)
  }

  setComment() {
    let cl = this.exam.commentLists[+this.qid]
    this.newcomment = '#' + (cl == null ? 0 : cl.length)
  }

  setSolutions() {
    this.solutions = JSON.stringify(this.question.solutions)
  }

  setType() {
    this.type = AnswerType[this.question.type]
  }

  get ctype(): string {
    switch (this.question.type) {
      case AnswerType.NCQ: return 'number'
      case AnswerType.MAQ: return 'checkbox'
      default: return 'radio'
    }
  }

  getAnswer(i: number): number {
    let q = this.exam.answers[+this.qid]
    let ans = 0
    if (q != null && q.length > 0) ans = q[i]
    return ans
  }

  colors(i: number) {
    if (!this.exam.isLocked()) return {}
    let qidn = +this.qid
    let ans = (i != null) ? i : this.getAnswer(0)
    let isans = this.exam.isAnswer(qidn, ans)
    let issol = this.exam.isSolution(qidn, ans)
    let result = {
      'correct': issol,
      'done': isans && issol,
      'notcorrect': isans && !issol
    }
    return result
  }

  debug(obj) {
    console.log(obj)
  }

  get ncqtext(): string {
    return this.getAnswer(0) + ''
  }
  set ncqtext(t: string) {
    this.exam.setAnswer(+this.qid, +t)
    this.service.saveExam()
  }

  get canEditMarks(): boolean {
    return this.question.type == 5 && this.exam.isLocked() && this.exam.exam.markingScheme != 0
  }

  get marks(): number {
    return this.getAnswer(0)
  }
  set marks(m: number) {
    if (!this.service.isAdmin && !this.exam.isLocked()) return
    try {
      this.exam.setMarksAdminNAQ(+this.qid, m)
      this.service.saveExamAdmin()
    } catch (error) {
      this.context.alert(error)
    }
  }

  formatWhen(dt: Date): string {
    return moment(dt).format('llll')
  }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  get omission(): boolean {
    return this.exam.isOmitted(+this.qid)
  }

  toggleOmission() {
    if (!this.service.isAdmin && !this.exam.isLocked()) return
    try {
      this.exam.toggleOmission(+this.qid)
      this.service.saveExamAdmin()
    } catch (error) {
      this.context.alert(error)
    }
  }

  get comments(): CommentList {
    let revChron = (a, b) => b.when.getTime() - a.when.getTime()
    let list = this.exam.commentLists[+this.qid]
    if (list) list = list.sort(revChron)
    return list
  }

  addComment(newtext) {
    try {
      this.service.addComment(newtext, +this.qid).then(x => {
        this.setComment()
      })
    } catch (error) {
      console.log(newtext)
      this.context.alert(error)
    }
  }

  setNaqDone() {
    this.exam.setAnswer(+this.qid, 0)
    this.service.saveExam()
  }

  choiceClicked(event, cid: number) {
    if (event.target.checked) this.exam.setAnswer(+this.qid, cid)
    else this.exam.removeAnswer(+this.qid, cid)
    this.service.saveExam()
  }

  editOption(newtext, i: number) {
    this.question.choices[i] = newtext
    this.service.editQuestionChoice(newtext, +this.qid, i)
  }

  editSolution(newtext) {
    try {
      let arr = JSON.parse(newtext)
      this.question.setSolutions(arr)
      this.service.editQuestionSolution(arr, +this.qid)
    } catch (error) {
      console.log(newtext)
      this.context.alert(error)
    }
    this.setSolutions()
  }

  editType(newtext) {
    try {
      this.question.setType(newtext)
      this.service.editQuestionType(newtext, +this.qid)
    } catch (error) {
      console.log(newtext)
      this.context.alert(error)
    }
    this.setType()
  }

  removeChoice(i: number) {
    if (!this.service.isAdmin) return
    if (this.context.confirm('Remove choice #' + i + ': Sure?!')) {
      try {
        this.question.removeChoice(i)
        this.service.editQuestionChoicesAll(this.question.choices, +this.qid)
      } catch (error) {
        this.context.alert(error)
      }
    }
  }

  addChoice() {
    if (!this.service.isAdmin) return
    try {
      let choicestr = 'New Choice'
      this.question.addChoice(choicestr)
      this.service.editQuestionChoicesAll(this.question.choices, +this.qid)
    } catch (error) {
      this.context.alert(error)
    }
  }

}
