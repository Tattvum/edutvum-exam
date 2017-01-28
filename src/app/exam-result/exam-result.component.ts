import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-exam-result',
  templateUrl: './exam-result.component.html',
  styleUrls: ['./exam-result.component.css']
})
export class ExamResultComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        console.log('param: '+params['id'])
      })
      /*
.switchMap((params: Params) => this.service.getHero(+params['id']))
    .subscribe((hero: Hero) => this.hero = hero);      */
  }

}
