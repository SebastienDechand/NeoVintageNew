import { trigger, transition, style, animate } from '@angular/animations';
import { Component, Inject, Input, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CarouselComponent implements OnInit, OnDestroy {
  @Input() slides: any = [];

  currentSlide = 0;
  private autoplayInterval: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.stopAutoplay();
  }

  startAutoplay() {
    if (!this.isBrowser) {
      return;
    }
    this.autoplayInterval = setInterval(() => {
      this.onNextClick();
    }, 3000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
    this.stopAutoplay();
    this.startAutoplay();
  }

  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
    this.stopAutoplay();
    this.startAutoplay();
  }
}
