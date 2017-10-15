import 'rxjs/Rx'
import { Observable } from 'rxjs/Rx'

import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core'
import { Lib } from '../model/lib';

interface Point {
  x: number,
  y: number
}

export interface Data {
  value: number,
  color: string,
  attempted: boolean,
  correct: boolean,
  guess: boolean,
  action: () => void
}

const XOFFSET = 10

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('canvas') public canvas: ElementRef

  @Input() public width = 800
  @Input() public height = 200
  @Input() public array: Data[] = []

  private p: Point = { x: 0, y: 0 }
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

    this.w = (this.width - 40) / this.array.length
    this.max = Math.max(...this.array.map(x => x.value))

    this.draw()

    Observable.fromEvent<MouseEvent>(canvasEl, 'mousemove')
      .subscribe((event: MouseEvent) => {
        this.p = { x: event.offsetX, y: event.offsetY }
        this.drawMouseMove()
      })
    Observable.fromEvent<MouseEvent>(canvasEl, 'mouseleave')
      .subscribe((event: MouseEvent) => {
        this.draw()
      })
    Observable.fromEvent<MouseEvent>(canvasEl, 'click')
      .subscribe((event: MouseEvent) => {
        let n = this.x2n(event.offsetX)
        if (n >= 0 && n < this.array.length) {
          this.array[n].action()
        }
      })
  }

  private line(x1: number, y1: number, x2: number, y2: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawMouseMove() {
    if (!this.ctx) { return }

    this.draw()
    let n = this.x2n(this.p.x)
    if (this.p.x > XOFFSET && n >= 0 && n < this.array.length) {
      this.ctx.fillStyle = 'blue'
      let x = XOFFSET + n * this.w
      this.line(x, 0, x, this.height)
      let hh = 38
      this.ctx.fillRect(x, hh, 50, -hh)
      this.ctx.fillStyle = 'white'
      this.ctx.font = '14px Arial'
      let val = Lib.timize(this.array[n].value)
      this.ctx.fillText(' ' + (n + 1), x, hh - 22)
      this.ctx.fillText(' ' + val, x, hh - 6)
    }
  }

  private draw() {
    if (!this.ctx) { return }

    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.fillStyle = 'black'
    this.array.forEach((obj, i) => {
      let color = '49,176,213,1' // blue
      if (obj.attempted) {
        if (obj.correct) color = '0,128,0'
        else color = '255,0,0'
        if (obj.guess) color += ',0.7'
        else color += ',1'
      }
      this.ctx.fillStyle = 'rgba(' + color + ')'
      let h = (this.height - 10) * (obj.value / this.max)
      this.ctx.fillRect(XOFFSET + i * this.w, this.height - h, this.w - 5, h)
    })
  }

}
