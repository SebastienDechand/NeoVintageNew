import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { EditContentComponent } from '../edit-content/edit-content.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  imports: [FormsModule, EditContentComponent],
  standalone: true,
  providers: [provideAnimations()],
  animations: [
    trigger('crossFadeZoom', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translate3d(15px, 0, 0)'
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)'
          })
        )
      ])
    ]),
    trigger('crossFadeZoomInv', [
      transition('* => *', [
        style({
          opacity: 0,
          transform: 'translate3d(-15px, 0, 0)'
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({
            opacity: 1,
            transform: 'translate3d(0, 0, 0)'
          })
        )
      ])
    ])
  ]
})
export class PhotoGalleryComponent implements OnInit {
  photos: any[] = [];
  selectedPhoto: any;
  currentIndex = 0;

  private readonly API_URL = `${environment.apiUrl}/photos`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadPhotos();
    }
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
}
