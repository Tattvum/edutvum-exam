import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { DataService, ChoiceInputDisplayContext, TagsDisplayContext, TagsDisplayContextImpl } from '../model/data.service';
import { AnswerType, ANSWER_TYPE_NAMES, ANSWER_TYPES } from '../model/answer-type';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { Question, EMPTY_QUESTION } from '../model/question';
import { GeneralContext } from '../model/general-context';
import { ExamStatus } from '../model/exam';
import { Marking } from '../model/marking';
import { SpaceComponent } from '../common/sp.component';
import { EditorComponent } from '../editor/editor.component';
import { SmallIntInputComponent } from '../common/smallint.component';
import { ListInputComponent } from '../common/list.component';
import { CommentsManagerComponent } from '../comments-manager/comments-manager.component';
import { TagsManagerComponent } from '../tags-manager/tags-manager.component';
import { NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-choice-input',
  standalone: true,
  imports: [
    NgClass, FormsModule, MatFormFieldModule, MatSelectModule,
    SpaceComponent, EditorComponent, SmallIntInputComponent, CommentsManagerComponent,
    TagsManagerComponent, ListInputComponent,
  ],
  templateUrl: './choice-input.component.html',
  styles: [
    'div { font-size: 110%; }',
    '#clear-all { @apply text-sm text-center text-gray-500 border border-slate-500 px-1.5 py-px; }',
  ]
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
  tagsQuestionContext: TagsDisplayContext

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
    this.tagsQuestionContext = new TagsDisplayContextImpl(service, "question")
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
      'text-green-600': issol,
      'text-teal-500': isans && issol,
      'text-red-600': isans && !issol
    }
    return result
  }

  debug(obj) {
    console.log(obj)
  }

  get ncqtext(): string {
    if (!this.result.showAnswer(this.qidn)) return ''
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
    return this.result.exam.marking === Marking.OLD
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
    if (this.result.exam.marking !== Marking.OLD) {
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
      if (this.result.exam.marking !== Marking.OLD && newtext === 'NAQ') {
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
