import { Component } from '@angular/core';
import { CardsServicesComponent } from "../cards-services/cards-services.component";

@Component({
  selector: 'app-services',
  imports: [CardsServicesComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  services = [
    {
      image: 'assets/images/friperie-1920w.webp',
      srcset: `
        assets/images/friperie-480w.webp 480w,
        assets/images/friperie-768w.webp 768w,
        assets/images/friperie-1920w.webp 1920w
      `,
      title: 'Friperie en ligne',
      description: 'Découvrez une sélection de vêtements vintage.',
      link: 'photos',
      accent: 'fuchsia' as const,
    },
    {
      image: 'assets/images/creators-1920w.webp',
      srcset: `
        assets/images/creators-480w.webp 480w,
        assets/images/creators-768w.webp 768w,
        assets/images/creators-1920w.webp 1920w
      `,
      title: 'Créateurs',
      description: 'Découvrez des créations uniques et artisanales.',
      link: 'creators',
      accent: 'orange' as const,
    },
    {
      image: 'assets/images/cart-1920w.webp',
      srcset: `
        assets/images/cart-480w.webp 480w,
        assets/images/cart-768w.webp 768w,
        assets/images/cart-1920w.webp 1920w
      `,
      title: 'Panier personnalisé',
      description: 'Composez votre propre sélection.',
      link: 'custom-shopping',
      accent: 'yellow' as const,
    },
  ];
}
