import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-input',
  standalone: true,
  imports: [],
  template: `
    <div>
      @for (txt of array; track txt; let i = $index) {
        <span>
          <button
            class="btn"
            style="margin: 2px; color: black;"
            [class.btn-warning]="i == value"
            (click)="changeValue(i)"
          >{{txt}}</button>
        </span>
      }
    </div>
    `,
  styles: []
})
export class ListInputComponent {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  @Input() array = []

  changeValue(n: number) {
    this.value = n
    this.valueChange.emit(this.value);
  }
}
