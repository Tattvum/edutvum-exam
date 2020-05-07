import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Lib, Selection } from '../model/lib';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-auto-input',
  template: `
    <mat-form-field style="width: 100%;">
      <input type="text" #inputElement matInput
        [placeholder]="placeholder"
        [disabled]="disabled"
        [formControl]="inputCtrl"
        [matAutocomplete]="auto" >
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="addSelection($event)">
        <mat-option *ngFor="let selection of filteredSelections$ | async" [value]="selection.id">
          <span class="gray">{{selection.id}}</span> <sp></sp><sp></sp>
          <span>{{selection.title}}</span>
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    '.gray { color: gray; }',
  ]
})
export class AutoInputComponent implements OnInit {

  inputCtrl = new FormControl();
  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>
  @ViewChild('auto') matAutocomplete: MatAutocomplete

  @Input() placeholder: string = "Pick one thing"
  @Input() disabled: boolean = false
  @Input() list: Selection[]

  @Output() added = new EventEmitter<string>()

  filteredSelections$: Observable<Selection[]>;

  ngOnInit() {
    this.filteredSelections$ = this.inputCtrl.valueChanges.pipe(
      startWith(''),
      map((title: string | null) => title ? this._filter(title) : this.list.slice()))
  }

  private _filter(title: string): Selection[] {
    const filterValue = title.toLowerCase();
    const contains = (a: string, b: string) => a.toLowerCase().indexOf(b) >= 0
    return this.list.filter(s => contains(s.id + " " + s.title, filterValue))
  }

  addSelection(event: MatAutocompleteSelectedEvent) {
    let id = event.option.value.trim()
    this.added.emit(id)
    this.inputElement.nativeElement.value = ''
    this.inputCtrl.setValue(null)
  }
}
