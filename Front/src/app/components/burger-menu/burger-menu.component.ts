import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-burger-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './burger-menu.component.html',
  styleUrl: './burger-menu.component.scss',
})
export class BurgerMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toggleButton') toggleButtonRef?: ElementRef<HTMLButtonElement>;
  @ViewChild('menuPanel') menuPanelRef?: ElementRef<HTMLElement>;

  isMenuOpen = false;
  activeSection = 'banner';
  sections = [
    { id: 'banner', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'services', label: 'Nos Services' },
    { id: 'photos', label: 'Friperie en ligne' },
    { id: 'creators', label: 'Créateurs du mois' },
    { id: 'custom-shopping', label: 'Shopping personnalisé' },
    { id: 'reviews', label: 'Avis clients' },
  ];

  private isBrowser: boolean;
  private sectionObserver?: IntersectionObserver;
  private readonly visibleSections = new Map<string, number>();

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.observeSections();
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      setTimeout(() => this.focusFirstLink());
    }
  }

  closeMenu(): void {
    if (!this.isMenuOpen) {
      return;
    }
    this.isMenuOpen = false;
    this.toggleButtonRef?.nativeElement.focus();
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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }

  private focusFirstLink(): void {
    const target = this.menuPanelRef?.nativeElement.querySelector<HTMLElement>(
      '.navbar__menu-close, .navbar__menu-link'
    );
    target?.focus();
  }

  private observeSections(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.visibleSections.set(entry.target.id, entry.intersectionRatio);
        }
        let topSection = this.activeSection;
        let topRatio = 0;
        for (const [id, ratio] of this.visibleSections) {
          if (ratio > topRatio) {
            topRatio = ratio;
            topSection = id;
          }
        }
        if (topRatio > 0) {
          this.activeSection = topSection;
        }
      },
      { threshold: [0.25, 0.5, 0.75] }
    );

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        this.sectionObserver.observe(element);
      }
    }
  }
}
