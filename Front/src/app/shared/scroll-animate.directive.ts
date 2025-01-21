import { Directive, ElementRef, Renderer2, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollAnimate]'
})
export class ScrollAnimateDirective {
  @Input() animationClass: string = 'animate-fade-in';

  private observer: IntersectionObserver | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.renderer.addClass(this.el.nativeElement, this.animationClass);
      return;
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.renderer.addClass(this.el.nativeElement, this.animationClass);
            this.observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      this.observer.observe(this.el.nativeElement);
    } else {
      this.renderer.addClass(this.el.nativeElement, this.animationClass);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
