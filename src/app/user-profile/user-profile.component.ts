import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../model/data.service';
import { Lib, Selection } from '../model/lib';
import { Bar } from '../common/chart.component';
import { ExamResult } from '../model/exam-result';
import { Exam } from 'app/model/exam';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('chartEditTitleTemplate') chartEditTitleTemplate: TemplateRef<any>
  @ViewChild('chartConfigTemplate') chartConfigTemplate: TemplateRef<any>
  @ViewChild('chartRemoveTemplate') chartRemoveTemplate: TemplateRef<any>

  currentUser: string

  charts = [
  ]

  constructor(private router: Router, public service: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.service.activeUser
  }

  addExam(eid: string, n: number) {
    const ers = this.service.listResults(eid)
    this.charts[n].some.push(...ers)
    console.log("add:", eid, ers.length, this.charts[n].some.length)
  }

  removeExam(id: string, n: number) {
    const i = this.charts[n].some.findIndex(e => e.exam.id === id)
    if (i >= 0) this.charts[n].some.splice(i, 1)
    console.log("remove:", i, this.charts[n].some.length)
  }

  examListing() {
    this.router.navigate(['/exam-list'])
  }

  timize(secs: number) {
    return Lib.timize(secs)
  }

  userChanged() {
    if (this.currentUser) this.service.switchUser(this.currentUser)
  }

  convert(s: Selection) {
    let er = <ExamResult>s
    return {
      value: er.score.percent,
      color: "0,128,10",
      flags: () => [er.score.percent + "", er.exam.id.substr(0, 5) + "..."],
      action: () => this.router.navigate(['/results', er.id]),
      selected: false
    }
  }

  addChart() {
    this.charts.push({ title: "Chart " + this.charts.length, some: [] })
  }

}
