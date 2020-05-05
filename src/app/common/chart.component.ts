import 'rxjs'
import { fromEvent } from 'rxjs'
import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core'

interface Point {
  x: number,
  y: number
}

export interface Bar {
  value: number,
  color?: string;
  flags?: () => string[],
  action?: () => void,
  selected?: boolean
}

const XMARGIN = 10
const YMARGIN = XMARGIN

const XGAP = 4
const YGAP = XGAP

const SELHEIGHT = 10

@Component({
  selector: 'app-chart',
  template: `
    <canvas #canvas></canvas>
  `,
  styles: [
    'canvas { cursor: pointer; }'
  ]
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) public canvas: ElementRef

  private flag = (n: number) => () => ["Boo: " + n, "ting"]
  private action = (n: number) => () => console.log("Bingo action", n)

  @Input() public width = 800
  @Input() public height = 400

  private _bars: Bar[] = [
    { value: 10, color: "0,128,0", flags: this.flag(0), action: this.action(0) },
    { value: 2, color: "49,176,213,1", flags: this.flag(1), action: this.action(1) },
    { value: 1, color: "0,128,0", flags: this.flag(2), action: this.action(2), selected: true },
    { value: 5, color: "49,176,213,1", flags: this.flag(3), action: this.action(3), selected: true },
    { value: 9, color: "255,165,0", flags: this.flag(4), action: this.action(4) },
    { value: 8, color: "0,128,0", flags: this.flag(5), action: this.action(5), selected: true },
    { value: 3, color: "0,128,0", flags: this.flag(6), action: this.action(6) },
    { value: 7, color: "255,165,0", flags: this.flag(7), action: this.action(7), selected: true },
    { value: 10, color: "49,176,213,1", flags: this.flag(8), action: this.action(8) },
    { value: 2, color: "255,165,0", flags: this.flag(9), action: this.action(9) },
  ]
  get bars(): Bar[] {
    return this._bars
  }
  @Input() set bars(value: Bar[]) {
    this._bars = value
    //NOTE: Important hack, as otherwise, mosemove is not triggered?!
    if (!this.mouseInside) this.drawBars()
  }

  private mouseInside = false
  private ctx: CanvasRenderingContext2D

  private x2n(x: number): number {
    let w = (this.width - 40) / this.bars.length
    return Math.floor((x - XMARGIN) / w)
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement
    this.ctx = canvasEl.getContext('2d')

    canvasEl.width = this.width
    canvasEl.height = this.height

    this.drawBars()

    fromEvent<MouseEvent>(canvasEl, 'mousemove').subscribe((event: MouseEvent) => {
      this.mouseInside = true
      this.drawBars()
      let px = event.offsetX
      let n = this.x2n(px)
      if (px > XMARGIN) this.drawFlag(n)
    })

    fromEvent<MouseEvent>(canvasEl, 'mouseleave').subscribe((event: MouseEvent) => {
      this.mouseInside = false
      this.drawBars()
    })

    fromEvent<MouseEvent>(canvasEl, 'click').subscribe((event: MouseEvent) => {
      let n = this.x2n(event.offsetX)
      if (n >= 0 && n < this.bars.length) {
        this.bars[n].action()
      }
    })
  }

  private line(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawFlag(n: number) {
    if (!this.ctx) return

    let bar = this.bars[n]
    if (!bar) return

    let w = (this.width - 40) / this.bars.length

    const LINE_HEIGHT = 16
    this.ctx.fillStyle = 'blue'
    let x = XMARGIN + n * w
    this.line(x, 0, x, this.height - YMARGIN)
    let yh = 6 + bar.flags().length * LINE_HEIGHT
    this.ctx.fillRect(x, yh, 50, -yh)
    this.ctx.fillStyle = 'white'
    this.ctx.font = '14px Arial'
    let y = (i: number) => yh - (i + 1) * LINE_HEIGHT + 10
    bar.flags().forEach((f, i) => this.ctx.fillText(' ' + f, x, y(i)))
  }

  private drawBars() {
    if (!this.ctx) { return }

    let wide = (this.width - 40) / this.bars.length
    let max = Math.max(...this.bars.map(x => x.value))

    this.ctx.clearRect(0, 0, this.width, this.height)
    //this.ctx.strokeRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = 'black'
    this.bars.forEach((bar, i) => {
      this.ctx.fillStyle = 'rgba(' + bar.color + ')'
      let h = (this.height - YMARGIN - SELHEIGHT) * (bar.value / max)
      let w = (i: number) => XMARGIN + i * wide
      this.ctx.fillRect(w(i), this.height - SELHEIGHT - h, wide - XGAP, h)
      this.ctx.fillStyle = 'maroon'
      let hh = this.height - SELHEIGHT + YGAP
      if (bar.selected) this.ctx.fillRect(w(i), hh, wide - XGAP, SELHEIGHT)
    })
  }

}
