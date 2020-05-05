import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Lib } from '../model/lib';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-auto-input',
  template: `
    <div style="margin: 20px;">
      <mat-form-field>
        <input type="text" [placeholder]="placeholder" matInput
              [formControl]="autoCtrl" [matAutocomplete]="auto">
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="optionSelected($event)">
          <mat-option *ngFor="let option of filteredOptions | async" [value]="option">
            {{option}}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
  styles: [
    '.actionable:hover { color: blue; }',
  ]
})
export class AutoInputComponent implements OnInit {

  autoCtrl = new FormControl()
  options: string[] = ['One', 'Two', 'Three']
  filteredOptions: Observable<string[]>

  @Input() placeholder: string = "Pick one thing"
  @Output() selected0 = new EventEmitter<string>()

  ngOnInit() {
    this.filteredOptions = this.autoCtrl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  optionSelected(selection: string) {
    this.selected0.emit(selection)
  }
}
