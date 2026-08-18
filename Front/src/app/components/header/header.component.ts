import { Component } from '@angular/core';
import { CardsBannerComponent } from '../cards-banner/cards-banner.component';

@Component({
  selector: 'app-header',
  imports: [CardsBannerComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  cards = [
    {
      icon: 'leaf',
      accent: 'fuchsia' as const,
      title: 'Mode Responsable',
      description:
        "Nos vêtements et accessoires de seconde main sont sélectionnés avec soin pour réduire l'impact environnemental et sensibiliser à la fast fashion.",
    },
    {
      icon: 'recycle',
      accent: 'orange' as const,
      title: 'Économie Circulaire',
      description:
        'Donnez une nouvelle vie à des vêtements et accessoires uniques. Ensemble, promouvons une économie durable qui encourage le réemploi et valorise le partage.',
    },
    {
      icon: 'heart',
      accent: 'yellow' as const,
      title: 'Confiance & Solidarité',
      description:
        "Neo Vintage est plus qu'une boutique. C'est un espace chaleureux, où chacun peut s'exprimer, échanger et retrouver confiance en soi grâce à la mode.",
    },
  ];
}
