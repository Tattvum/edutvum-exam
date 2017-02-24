import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { StudentService } from '../model/student.service';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  @ViewChild('question') question: ElementRef;

  private qstring = ''

  constructor(private route: ActivatedRoute, private service: StudentService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        this.qstring = this.service.getQuestion(eid, qid).html

        this.question.nativeElement.innerHTML = this.qstring;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.question.nativeElement]);
      })
  }

}
