import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../model/data.service';
import { Lib, Selection } from '../model/lib';
import { ExamResult } from '../model/exam-result';
import { Bar } from '../common/chart.component';

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

  constructor(private router: Router, public service: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.service.activeUser.uid
  }

  timize(secs: number) {
    return Lib.timize(secs)
  }

  userChanged() {
    if (this.currentUser) this.service.switchUser(this.currentUser)
  }

  convert(s: Selection): Bar {
    let er = <ExamResult>s
    return {
      value: Math.round(er.score.percent),
      color: "0,128,10",
      flags: () => [er.score.percent + "", er.exam.id.substr(0, 5) + "..."],
      action: () => this.router.navigate(['/results', er.id]),
      selected: false
    }
  }

  show(s: Selection): Selection {
    let er = <ExamResult>s
    return {
      id: er.exam.id,
      title: er.title,
    }
  }

  addExamResult(eid: string, n: number) {
    const ers = this.service.listResults(eid)
    let results = this.service.charts[n].results
    //only unique results are added! alert?
    let notexists = (id: string) => results.filter(r => r.id === id).length < 1
    ers.forEach(er => { if (notexists(er.id)) results.push(er) })
    console.log("added:", eid, ers.length, results.length)
  }

  removeExamResult(eid: string, n: number) {
    const i = this.service.charts[n].results.findIndex(e => e.id === eid)
    if (i >= 0) this.service.charts[n].results.splice(i, 1)
    console.log("removed:", this.service.charts[n].results.length)
  }

  addChart() {
    this.service.createChart()
  }
  deleteChart(n: number) {
    this.service.deleteChart(this.service.charts[n].id)
  }
  updateChart(n: number) {
    this.service.updateChart(this.service.charts[n])
  }

}
