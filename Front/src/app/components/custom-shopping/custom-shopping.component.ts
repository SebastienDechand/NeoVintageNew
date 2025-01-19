import { Component } from '@angular/core';
import { CarouselComponent } from "../carousel/carousel.component";

@Component({
  selector: 'app-custom-shopping',
  imports: [CarouselComponent],
  templateUrl: './custom-shopping.component.html',
  styleUrl: './custom-shopping.component.scss'
})
export class CustomShoppingComponent {
  public slides = [
    {
      src: 'assets/images/moodboard1-1920w.webp',
      srcset: `
        assets/images/moodboard1-480w.webp 480w,
        assets/images/moodboard1-768w.webp 768w,
        assets/images/moodboard1-1920w.webp 1920w
      `,
    },
    {
      src: 'assets/images/moodboard2-1920w.webp',
      srcset: `
        assets/images/moodboard2-480w.webp 480w,
        assets/images/moodboard2-768w.webp 768w,
        assets/images/moodboard2-1920w.webp 1920w
      `,
    },
    {
      src: 'assets/images/moodboard3-1920w.webp',
      srcset: `
        assets/images/moodboard3-480w.webp 480w,
        assets/images/moodboard3-768w.webp 768w,
        assets/images/moodboard3-1920w.webp 1920w
      `,
    }
  ];
}
