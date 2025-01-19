import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',

})
export class BurgerMenuComponent {
  isMenuOpen = false;
  sections = [
    { id: 'banner', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'services', label: 'Nos Services' },
    { id: 'photos', label: 'Friperie en ligne' },
    { id: 'creators', label: 'Créateurs du mois' },
    { id: 'custom-shopping', label: 'Shopping personnalisé' },
    { id: 'reviews', label: 'Avis clients' },
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  handleMenuAction(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollTo(sectionId);
    this.closeMenu();
  }

  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.isMenuOpen = false;
  }
}
