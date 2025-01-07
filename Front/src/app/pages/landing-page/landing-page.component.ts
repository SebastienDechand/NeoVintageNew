import { Component } from '@angular/core';
import { AboutComponent } from "../../components/about/about.component";
import { CreatorsGalleryComponent } from "../../components/creators-gallery/creators-gallery.component";
import { CustomShoppingComponent } from "../../components/custom-shopping/custom-shopping.component";
import { PhotoGalleryComponent } from "../../components/photo-gallery/photo-gallery.component";
import { ReviewsComponent } from "../../components/reviews/reviews.component";
import { ServicesComponent } from "../../components/services/services.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [ServicesComponent, AboutComponent, ReviewsComponent, CommonModule, CreatorsGalleryComponent, CustomShoppingComponent, PhotoGalleryComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  activeDropdown: string | null = null;

  onToggleServices(componentName: string): void {
    console.log('Avant mise à jour :', this.activeDropdown);
    this.activeDropdown = this.activeDropdown === componentName ? null : componentName;
    console.log('Après mise à jour :', this.activeDropdown);
  }
}
