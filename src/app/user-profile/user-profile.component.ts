import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralContext } from 'app/model/general-context';
import { DataService } from 'app/model/data.service';
import { Lib, Selection } from 'app/model/lib';
import { Bar } from 'app/common/chart.component';
import { ExamResult } from 'app/model/exam-result';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('chartEditTitleTemplate') chartEditTitleTemplate: TemplateRef<any>
  @ViewChild('chartConfigTemplate') chartConfigTemplate: TemplateRef<any>
  @ViewChild('chartRemoveTemplate') chartRemoveTemplate: TemplateRef<any>

  private examResults: ExamResult[] = []

  currentUser: string
  chart = {
    title: "Bingo"
  }

  ngOnInit(): void {
    this.currentUser = this.service.activeUser
  }

  constructor(public service: DataService, private context: GeneralContext,
    private router: Router, public dialog: MatDialog) {
  }

  get oldExamResults(): Selection[] {
    //CAUTION: with map, it hangs! 460 elements can hang it?!
    return this.examResults//.map(e => ({ id: e.id, title: e.title }))
  }

  get allTakenExams(): Selection[] {
    //CAUTION: with map, it hangs! 460 elements can hang it?!
    return this.service.filterExams(false)//.map(e => ({ id: e.id, title: e.title }))
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
      action: () => this.router.navigate(['/results', er.id]),
      selected: false
    }))
  }


  chartConfig(): void {
    const dialogRef = this.dialog.open(this.chartConfigTemplate);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  chartEditTitle(): void {
    const config = {
      width: '250px',
      data: { value: 5 }
    }
    const dialogRef = this.dialog.open(this.chartEditTitleTemplate, config);
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  chartRemove(): void {
    const dialogRef = this.dialog.open(this.chartRemoveTemplate, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Not Implemented yet!', result);
    });
  }

  doit(n: number) {
    console.log(n)
  }

  onNoClick() {
    console.log("No clicked!")
  }

}
