import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appScrollAnimate]'
})
export class ScrollAnimateDirective {
  @Input() animationClass: string = 'animate-fade-in';

  private observer: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          this.observer.unobserve(this.el.nativeElement);
        }
      },
      { threshold: 0.1 }
    );
  }

  ngAfterViewInit() {
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
