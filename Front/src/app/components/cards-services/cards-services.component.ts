import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-services',
  imports: [],
  templateUrl: './cards-services.component.html',
  styleUrl: './cards-services.component.scss'
})
export class CardsServicesComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() link: string = '';

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
