import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() servicesClick = new EventEmitter<void>();

  onServicesClick(event: Event): void {
    event.stopPropagation();
    this.servicesClick.emit();
  }
}
