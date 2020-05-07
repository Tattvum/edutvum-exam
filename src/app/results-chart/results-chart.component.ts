import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Selection } from '../model/lib';
import { Bar } from '../common/chart.component';

@Component({
  selector: 'app-results-chart',
  templateUrl: './results-chart.component.html',
  styleUrls: ['./results-chart.component.scss']
})
export class ResultsChartComponent implements OnInit {
  @ViewChild('chartEditTitleTemplate') chartEditTitleTemplate: TemplateRef<any>
  @ViewChild('chartConfigTemplate') chartConfigTemplate: TemplateRef<any>
  @ViewChild('chartRemoveTemplate') chartRemoveTemplate: TemplateRef<any>

  @Input() width = 800
  @Input() height = 400

  @Input() all: Selection[] = []
  @Input() some: Selection[] = []

  @Input() convert: (s: Selection) => Bar = (s) => ({
    value: Math.round(Math.random() * 100),
    color: "0,128,10",
    flags: () => [s.id.substr(0, 5) + "...", s.title.substr(0, 5) + "..."],
    action: () => this.router.navigate(['/results', s.id]),
    selected: false
  })

  @Output() titleChange = new EventEmitter<string>()
  @Input() title: string = "<Title>"

  @Output() added = new EventEmitter<string>()
  @Output() removed = new EventEmitter<string>()

  constructor(private router: Router, public dialog: MatDialog) { }

  ngOnInit(): void { }

  get bars(): Bar[] {
    return this.some.map((s, i) => this.convert(s))
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
