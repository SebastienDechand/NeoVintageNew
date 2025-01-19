import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-services',
  imports: [],
  templateUrl: './cards-services.component.html',
  styleUrl: './cards-services.component.scss'
})
export class CardsServicesComponent {
  @Input() image: string = '';
  @Input() srcset: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() link: string = '';

  handleLinkClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollTo(sectionId);
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
