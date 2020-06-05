import { Component, Input } from '@angular/core';
import { DataService, DetailsDisplayContext } from '../model/data.service';
import { Question } from '../model/question';
import { ExamResult } from 'app/model/exam-result';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  @Input() qid: number
  @Input() result: ExamResult
  @Input() question: Question

  context: DetailsDisplayContext

  constructor(service: DataService) {
    this.context = service
  }

  editExplanationQ(newtext) {
    this.question.explanation = newtext
    this.context.editQuestionExplanation(newtext, this.qid)
  }

  editExplanationE(newtext) {
    this.result.exam.explanation = newtext
    this.context.editExamExplanation(newtext, this.question.eid)
  }

  editNotesQ(newtext) {
    this.question.notes = newtext
    this.context.editQuestionNotes(newtext, this.qid)
  }

  editNotesE(newtext) {
    this.result.exam.notes = newtext
    this.context.editExamNotes(newtext, this.question.eid)
  }

}
