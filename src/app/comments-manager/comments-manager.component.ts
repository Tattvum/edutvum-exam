import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { CommentList } from 'app/model/comment';
import { ExamResult, EMPTY_EXAM_RESULT } from '../model/exam-result';
import { GeneralContext } from 'app/model/general-context';
import { DataService } from 'app/model/data.service';

@Component({
  selector: 'app-comments-manager',
  templateUrl: './comments-manager.component.html',
  styleUrls: ['./comments-manager.component.scss']
})
export class CommentsManagerComponent implements OnInit {

  @Input() qid: number
  @Input() result: ExamResult = EMPTY_EXAM_RESULT

  newcomment = ''

  constructor(
    private context: GeneralContext,
    public service: DataService) { }

  ngOnInit(): void {
    this.setComment()
  }

  formatWhen(dt: Date): string {
    return moment(dt).format('llll')
  }

  showWhen(dt: Date): string {
    return moment(dt).fromNow();
  }

  setComment() {
    let cl = this.result.commentLists[this.qid]
    this.newcomment = '#' + (cl == null ? 0 : cl.length)
  }

  get comments(): CommentList {
    let revChron = (a, b) => b.when.getTime() - a.when.getTime()
    let list = this.result.commentLists[this.qid]
    if (list) list = list.sort(revChron)
    return list
  }

  addComment(newtext) {
    try {
      this.service.addComment(newtext, this.qid).then(x => {
        this.setComment()
      })
    } catch (error) {
      console.log(newtext)
      this.context.alert(error)
    }
  }

}
