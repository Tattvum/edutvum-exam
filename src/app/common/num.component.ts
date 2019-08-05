import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'num',
  templateUrl: './num.component.html',
  styles: [
    `.numshow {
      background-color: lightyellow;
      font-size: 200%;
      padding: 0px 8px;
      margin: 0px 8px;
      vertical-align: middle;
    }`,
    `.red {color: red;}`,
    `.black {color: black;}`,
    `.hidden {display: none;}`,
  ]
})
export class NumberInputComponent {
  @Input() value = 5;
  @Output() valueChange = new EventEmitter<number>();
  @Input() min = -1;
  @Input() max = 10;
  @Input() allowFractions = false;

  get signValue(): string {
    return this.value < 0 ? '-' : '';
  }

  get intValue(): number {
    return Math.abs(this.value | 0);
  }

  get fracValue(): number {
    let frac = Math.abs(this.value) - this.intValue
    switch (frac * 100) {
      case 25: return 1
      case 50: return 2
      case 75: return 3
      default: return 0
    }
  }

  get isFracOnly() {
    return this.value > -1 && this.value < 1 && this.value != 0
  }

  changeValue(delta: number) {
    this.value = this.value + delta
    this.valueChange.emit(this.value);
  }

  withinLimits(delta: number): boolean {
    let newval = this.value + delta
    return newval >= this.min && newval <= this.max
  }
}
