import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StudentService } from '../student.service';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  @ViewChild('question') question: ElementRef;

  private html = "this is <b>html</b>"
  private qstring = ''

  constructor(private route: ActivatedRoute, private service: StudentService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        this.qstring = this.service.getQuestion(eid, qid)

        console.log('param: ' + eid + ' ' + qid + ' ' + this.qstring)
        this.question.nativeElement.innerHTML = this.qstring;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.question.nativeElement]);
      })
  }

}
