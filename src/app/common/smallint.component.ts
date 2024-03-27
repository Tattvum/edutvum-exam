import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'smallint',
  standalone: true,
  imports: [],
  templateUrl: './smallint.component.html',
  styles: []
})
export class SmallIntInputComponent {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();

  _min = 0;
  _max = 10;
  array = []

  @Input() set min(mn: number) {
    this._min = mn
    this.updateArray()
  }

  @Input() set max(mx: number) {
    this._max = mx
    this.updateArray()
  }

  updateArray() {
    this.array = []
    for (let i = this._min; i <= this._max; i++) this.array.push(i)
  }

  changeValue(n: number) {
    this.value = n
    this.valueChange.emit(this.value);
  }
}
