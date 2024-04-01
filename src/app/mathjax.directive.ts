import { Directive, OnChanges, Input, ElementRef } from '@angular/core';

declare var MathJax: {
  Hub: {
    Queue: (p: Object[]) => void
  }
}

// http://ruinshe.moe/2016/05/31/support-mathjax-in-angular2/
// https://stackoverflow.com/questions/36370826/how-to-get-mathjax-working-with-angular2
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[MathJax]',
  standalone: true,
})
export class MathJaxDirective implements OnChanges {
  @Input('MathJax') private MathJax = ''

  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.element.nativeElement.innerHTML = this.MathJax;
    // http://docs.mathjax.org/en/latest/api/hub.html
    // "If no element is provided, the whole document is processed"
    // NOTE: This speeded up quite a bit!
    MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
  }
}

