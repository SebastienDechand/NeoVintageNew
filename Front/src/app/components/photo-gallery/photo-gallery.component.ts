import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { EditContentComponent } from '../edit-content/edit-content.component';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  imports: [CommonModule, FormsModule, EditContentComponent],
  standalone: true
})
export class PhotoGalleryComponent implements OnInit {
  photos: any[] = [];
  selectedPhoto: any;
  currentIndex = 0;
  isExpanded: {[key: string]: boolean} = {};

  private readonly API_URL = `${environment.apiUrl}/photos` || process.env['API_URL_PHOTOS'] || '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.http.get<any[]>(this.API_URL).subscribe({
      next: (data) => {
        this.photos = data;
        this.selectedPhoto = this.photos[0];
      },
      error: (error) => alert('Erreur : ' + (error.error?.error || 'Erreur inconnue'))
    });
  }

  selectPhoto(photo: any): void {
    this.selectedPhoto = photo;
    this.currentIndex = this.photos.indexOf(photo);
  }

  getThumbnails(): any[] {
    return this.photos.filter(photo => photo !== this.selectedPhoto);
  }

  moveCarousel(direction: 'prev' | 'next'): void {
    this.currentIndex = direction === 'prev'
      ? (this.currentIndex - 1 + this.photos.length) % this.photos.length
      : (this.currentIndex + 1) % this.photos.length;
    this.selectedPhoto = this.photos[this.currentIndex];
  }

  toggleExpand(section: string): void {
    this.isExpanded[section] = !this.isExpanded[section];
  }
}
