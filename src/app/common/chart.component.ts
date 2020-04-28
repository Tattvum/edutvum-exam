import 'rxjs'
import { fromEvent } from 'rxjs'
import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core'

interface Point {
  x: number,
  y: number
}

export interface Bar {
  value: number,
  color: string;
  flags: (n: number) => string[],
  action: () => void,
}

const XOFFSET = 10

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

  @Input() public width = 800
  @Input() public height = 200
  @Input() public bars: Bar[] = []

  private w = 0
  private max = 0

  private ctx: CanvasRenderingContext2D

  private x2n(x: number): number {
    return Math.floor((x - XOFFSET) / this.w)
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement
    this.ctx = canvasEl.getContext('2d')

    canvasEl.width = this.width
    canvasEl.height = this.height

    this.w = (this.width - 40) / this.bars.length
    this.max = Math.max(...this.bars.map(x => x.value))

    this.drawBars()

    fromEvent<MouseEvent>(canvasEl, 'mousemove').subscribe((event: MouseEvent) => {
      this.drawBars()
      let px = event.offsetX
      let n = this.x2n(px)
      if (px > XOFFSET) this.drawFlag(n)
    })

    fromEvent<MouseEvent>(canvasEl, 'mouseleave').subscribe((event: MouseEvent) => {
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

    const LINE_HEIGHT = 16
    this.ctx.fillStyle = 'blue'
    let x = XOFFSET + n * this.w
    this.line(x, 0, x, this.height)
    let yh = 6 + 3 * LINE_HEIGHT
    this.ctx.fillRect(x, yh, 50, -yh)
    this.ctx.fillStyle = 'white'
    this.ctx.font = '14px Arial'
    let y = (i: number) => yh - (i + 1) * LINE_HEIGHT + 10
    bar.flags(n).forEach((f, i) => this.ctx.fillText(' ' + f, x, y(i)))
  }

  private drawBars() {
    if (!this.ctx) { return }

    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = 'black'
    this.bars.forEach((bar, i) => {
      this.ctx.fillStyle = 'rgba(' + bar.color + ')'
      let h = (this.height - 10) * (bar.value / this.max)
      let w = (i: number) => XOFFSET + i * this.w
      this.ctx.fillRect(w(i), this.height - h, this.w - 5, h)
    })
  }

}
