import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

import { Selection } from '../model/lib';
import { Bar } from '../common/chart.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-results-chart',
  templateUrl: './results-chart.component.html',
  styleUrls: ['./results-chart.component.scss']
})
export class ResultsChartComponent implements OnInit {
  @ViewChild('chartConfigTemplate') chartConfigTemplate: TemplateRef<any>
  @ViewChild('chartRemoveTemplate') chartRemoveTemplate: TemplateRef<any>

  @Input() width = 800
  @Input() height = 400

  @Input() all: Selection[]
  @Input() some: Selection[]

  @Input() convert: (s: Selection) => Bar
  @Input() show: (s: Selection) => Selection

  @Output() titleChange = new EventEmitter<string>()
  @Input() title: string

  @Output() added = new EventEmitter<string>()
  @Output() removed = new EventEmitter<string>()
  @Output() updated = new EventEmitter()
  @Output() deleted = new EventEmitter()

  @Output() selected = new EventEmitter()

  constructor(private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  get bars(): Bar[] {
    return this.some.map((s, i) => this.convert(s))
  }

  chartConfig(): void {
    const dialogRef = this.dialog.open(this.chartConfigTemplate, { width: '600px' });
    dialogRef.afterClosed().subscribe(ok => {
      this.titleChange.emit(this.title)
      this.updated.emit()
    });
  }

  chartRemove(): void {
    const dialogRef = this.dialog.open(this.chartRemoveTemplate, { width: '250px' });
    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.deleted.emit()
    });
  }

  selectionRemove(sid: string) {
    this.removed.emit(sid)
    this.snackBar.open(`Selection (${sid}) Removed!`, "", { duration: 2000 })
  }

  chartSelected() {
    this.selected.emit()
  }

}
