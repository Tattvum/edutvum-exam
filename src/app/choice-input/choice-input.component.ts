import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { DataService, ChoiceInputDisplayContext } from '../model/data.service';
import { AnswerType, ANSWER_TYPE_NAMES, ANSWER_TYPES } from '../model/answer-type';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Question, EMPTY_QUESTION } from '../model/question';
import { GeneralContext } from 'app/model/general-context';
import { ExamStatus } from 'app/model/exam';
import { MarkingSchemeType } from 'app/model/marks';

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

  @Input() qid: string
  @Input() question: Question = EMPTY_QUESTION
  @Input() result: ExamResult = EMPTY_EXAM_RESULT

  get solutions(): string {
    return JSON.stringify(this.question.solutions)
  }
  get type(): string {
    return AnswerType[this.question.type]
  }

  context: ChoiceInputDisplayContext

  AAA = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  mytype = ANSWER_TYPE_NAMES

  @ViewChild('first', { static: true }) private elementRef: ElementRef;

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.context.disableHotkeys) return
    // if (Lib.isPlainKey(event, KEY.ARROW_UP)) this.elementRef.nativeElement.focus()
    // else if (Lib.isPlainKey(event, KEY.ARROW_DOWN)) this.elementRef.nativeElement.focus()
  }

  constructor(private generalContext: GeneralContext, service: DataService) {
    this.context = service
  }

  ngOnInit() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }

  clearAll() {
    if (!this.result.isLocked()) this.result.clearAnswers(+this.qid)
  }

  get isPending(): boolean {
    return this.result.exam.status === ExamStatus.PENDING && this.context.isAdmin
  }

  get qidn(): number {
    return +this.qid
  }

  get ctype(): string {
    switch (this.question.type) {
      case AnswerType.NCQ: return 'number'
      case AnswerType.MAQ: return 'checkbox'
      default: return 'radio'
    }
  }

  getAnswer(i: number): number {
    let q = this.result.answers[+this.qid]
    let ans = 0
    if (q != null && q.length > 0) ans = q[i]
    return ans
  }

  colors(i: number) {
    if (!this.result.showSolution(this.qidn)) return {}
    let ans = (i != null) ? i : this.getAnswer(0)
    let isans = this.result.isAnswer(this.qidn, ans)
    let issol = this.result.isSolution(this.qidn, ans)
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
    if (!this.result.showSolution(this.qidn)) return ''
    return this.getAnswer(0) + ''
  }
  set ncqtext(t: string) {
    this.result.setAnswer(+this.qid, +t)
    this.context.saveExam()
  }

  get canEditMarks(): boolean {
    return this.question.type == 5 && this.result.isLocked()
  }
  get schemeOLD(): boolean {
    return this.result.exam.markingScheme === 0
  }

  get marks(): number {
    let ans = this.getAnswer(0)
    return this.schemeOLD ? (ans == 0 ? 0 : 1) : ans
  }
  set marks(m: number) {
    if (!this.context.isAdmin && !this.result.isLocked()) return
    try {
      m = this.schemeOLD ? (m == 0 ? 0 : -1) : m
      this.result.setMarksAdminNAQ(+this.qid, m)
      this.context.saveExamAdmin()
    } catch (error) {
      this.generalContext.alert(error)
    }
  }

  get omission(): boolean {
    return this.result.isOmitted(+this.qid)
  }

  toggleOmission() {
    if (!this.context.isAdmin && !this.result.isLocked()) return
    try {
      this.result.toggleOmission(+this.qid)
      this.context.saveExamAdmin()
    } catch (error) {
      this.generalContext.alert(error)
    }
  }

  setNaqDone() {
    this.result.setAnswer(+this.qid, 0)
    if (this.result.exam.markingScheme !== MarkingSchemeType.OLD) {
      this.result.setAnswer(+this.qid, this.result.marks(+this.qid).max)
    }
    this.context.saveExam()
  }

  choiceClicked(event, cid: number) {
    if (event.target.checked) this.result.setAnswer(+this.qid, cid)
    else this.result.removeAnswer(+this.qid, cid)
    this.context.saveExam()
  }

  editOption(newtext, i: number) {
    this.question.choices[i] = newtext
    this.context.editQuestionChoice(newtext, +this.qid, i)
  }

  editSolution(newtext) {
    try {
      let arr = JSON.parse(newtext)
      this.question.setSolutions(arr)
      this.context.editQuestionSolution(arr, +this.qid)
    } catch (error) {
      console.log(newtext)
      this.generalContext.alert(error)
    }
  }

  editType(newtext) {
    try {
      this.question.setType(newtext)
      this.context.editQuestionType(newtext, +this.qid)
      if (this.result.exam.markingScheme !== MarkingSchemeType.OLD && newtext === 'NAQ') {
        this.editSolution('[1]');
      }
    } catch (error) {
      console.log(newtext)
      this.generalContext.alert(error)
    }
  }

  removeChoice(i: number) {
    if (!this.context.isAdmin) return
    if (this.generalContext.confirm('Remove choice #' + i + ': Sure?!')) {
      try {
        this.question.removeChoice(i)
        this.context.editQuestionChoicesAll(this.question.choices, +this.qid)
      } catch (error) {
        this.generalContext.alert(error)
      }
    }
  }

  addChoice() {
    if (!this.context.isAdmin) return
    try {
      let choicestr = Question.createChoice(this.question.choices.length + 1)
      this.question.addChoice(choicestr)
      this.context.editQuestionChoicesAll(this.question.choices, +this.qid)
    } catch (error) {
      this.generalContext.alert(error)
    }
  }

}
