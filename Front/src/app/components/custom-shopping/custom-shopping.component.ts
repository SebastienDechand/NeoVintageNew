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
    { src: 'assets/images/moodboard1.jpg' },
    { src: 'assets/images/moodboard2.jpg' },
    { src: 'assets/images/moodboard3.jpeg' }
  ];
}
