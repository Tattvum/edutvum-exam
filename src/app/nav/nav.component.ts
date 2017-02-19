import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private service: StudentService) { }

  ngOnInit() {
  }

  select(i: number) {
    console.log(this.service.qs.length)
    this.service.qs[this.service.selected].selected = false
    this.service.selected = i
    this.service.qs[this.service.selected].selected = true
  }
}
