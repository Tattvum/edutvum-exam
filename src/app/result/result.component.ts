import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { StudentService, Exam } from '../model/student.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: StudentService) { }

  ngOnInit() {
    console.log(this.router.url, this.router.url.indexOf("results"))
  }

}
