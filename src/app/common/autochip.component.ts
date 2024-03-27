import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Lib, Selection } from '../model/lib';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpaceComponent } from './sp.component';

@Component({
  selector: 'app-auto-chip',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    SpaceComponent,
    AsyncPipe,
  ],
  template: `
    <mat-form-field style="width: 100%;">
      <mat-chip-grid #chipList>
        @for (selection of old; track selection) {
          <mat-chip-row
            [removable]="true"
            [disabled]="disabled"
            [matTooltip]="selection.title"
            (removed)="removed.emit(selection.id)">
            {{selection.id}}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip-row>
        }
        <input
          [placeholder]="placeholder"
          #inputElement
          [disabled]="disabled"
          [formControl]="inputCtrl"
          [matAutocomplete]="auto"
          [matChipInputFor]="chipList">
      </mat-chip-grid>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="addSelection($event)">
        @for (selection of filteredSelections$ | async; track selection) {
          <mat-option [value]="selection.id">
            <span class="gray">{{selection.id}}</span> <sp></sp><sp></sp>
            <span>{{selection.title}}</span>
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
    `,
  styles: [
    '.gray { color: gray; }',
  ]
})
export class AutoChipComponent implements OnInit {

  inputCtrl = new FormControl();
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete: MatAutocomplete

  @Input() placeholder: string = "Pick one thing"
  @Input() disabled: boolean = false
  @Input() old: Selection[]
  @Input() all: Selection[]

  @Output() added = new EventEmitter<string>()
  @Output() removed = new EventEmitter<string>()

  filteredSelections$: Observable<Selection[]>;

  ngOnInit() {
    this.filteredSelections$ = this.inputCtrl.valueChanges.pipe(
      startWith(''),
      map((title: string | null) => title ? this._filter(title) : this.all.slice()))
  }

  private _filter(title: string): Selection[] {
    const filterValue = title.toLowerCase();
    const contains = (a: string, b: string) => a.toLowerCase().indexOf(b) >= 0
    return this.all.filter(s => contains(s.id + " " + s.title, filterValue))
  }

  addSelection(event: MatAutocompleteSelectedEvent) {
    let id = event.option.value.trim()
    let title = event.option.viewValue
    if (!this.old.map(s => s.id).includes(id)) this.added.emit(id)
    else console.log("selection already added:", id, title)
    this.inputElement.nativeElement.value = ''
    this.inputCtrl.setValue(null)
  }
}
