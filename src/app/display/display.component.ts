import { Component, Input } from '@angular/core';

import { DataService, QuestionDisplayContext } from '../model/data.service';
import { Question } from '../model/question';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent {

  @Input() qid: string
  @Input() question: Question

  private context: QuestionDisplayContext

  constructor(service: DataService) {
    this.context = service
  }

  onEdit(newtext) {
    this.question.title = newtext
    this.context.editQuestionDisplay(newtext, +this.qid)
  }

  onQgEdit(i: number, newtext) {
    let group = this.question.groups[i]
    group.title = newtext
    console.log('TBD onQgEdit', i, group.fullid(), newtext)
    this.context.editQuestionGroupDisplay(newtext, group.fullid())
  }

}
