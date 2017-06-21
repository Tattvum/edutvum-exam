import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../model/data.service';

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

  constructor(private route: ActivatedRoute, private service: DataService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        let eid = params['eid']
        let qid = params['qid']
        let question = this.service.getQuestion(eid, qid)

        this.question.nativeElement.innerHTML = question.html
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.question.nativeElement]);
      })
  }

}
