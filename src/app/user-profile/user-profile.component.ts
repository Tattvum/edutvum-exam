import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralContext } from 'app/model/general-context';
import { DataService } from 'app/model/data.service';
import { Lib } from 'app/model/lib';
import { Exam } from 'app/model/exam';
import { Selection } from 'app/common/autochip.component';
import { Bar } from 'app/common/chart.component';
import { ExamResult } from 'app/model/exam-result';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  private examResults: ExamResult[] = []

  public currentUser

  ngOnInit(): void {
    this.currentUser = this.service.activeUser
  }

  constructor(public service: DataService, private context: GeneralContext, private router: Router) {
  }

  get oldExamResults(): Selection[] {
    //CAUTION: with map, it hangs! 460 elements can hang it?!
    return this.examResults//.map(e => ({ id: e.id, title: e.title }))
  }

  get allTakenExams(): Selection[] {
    //CAUTION: with map, it hangs! 460 elements can hang it?!
    return this.service.filterExams()//.map(e => ({ id: e.id, title: e.title }))
  }

  addExam(eid: string) {
    const ers = this.service.listResults(eid)
    this.examResults.push(...ers)
    console.log("add:", eid, ers.length, this.examResults.length)
  }

  removeExam(id: string) {
    const i = this.examResults.findIndex(e => e.exam.id === id)
    if (i >= 0) this.examResults.splice(i, 1)
    console.log("remove:", i, this.examResults.length)
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

  get bars(): Bar[] {
    return this.examResults.map((er, i) => ({
      value: er.score.percent,
      color: "0,128,10",
      flags: () => [er.score.percent + "", er.exam.id.substr(0, 5) + "..."],
      action: () => console.log(er),
      selected: false
    }))
  }

}
