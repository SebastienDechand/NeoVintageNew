import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { CardsServicesComponent } from "../cards-services/cards-services.component";

@Component({
  selector: 'app-services',
  imports: [CardsServicesComponent, CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  @Output() toggleServices = new EventEmitter<string>();

  services = [
    {
      image: 'assets/images/friperie.png',
      title: 'Friperie en ligne',
      description: 'Découvrez une sélection de vêtements vintage.',
      component: 'app-photo-gallery'
    },
    {
      image: 'assets/images/creators.png',
      title: 'Créateurs',
      description: 'Découvrez des créations uniques et artisanales.',
      component: 'app-creators-gallery'
    },
    {
      image: 'assets/images/cart.png',
      title: 'Panier personnalisé',
      description: 'Composez votre propre sélection.',
      component: 'app-custom-shopping'
    }
  ];

  onServicesClick(component: string): void {
    this.toggleServices.emit(component);
  }
}
