import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { EditContentComponent } from '../edit-content/edit-content.component';

@Component({
 selector: 'app-creators-gallery',
 standalone: true,
 imports: [EditContentComponent],
 templateUrl: './creators-gallery.component.html',
 styleUrls: ['./creators-gallery.component.scss']
})
export class CreatorsGalleryComponent implements OnInit {
 creators: any[] = [];
 private readonly API_URL = `${environment.apiUrl}/creators` || process.env['API_URL_CREATORS'] || '';

 constructor(
   private http: HttpClient,
   @Inject(PLATFORM_ID) private platformId: Object
 ) {}

 ngOnInit(): void {
   if (isPlatformBrowser(this.platformId)) {
     this.loadCreators();
   }
 }

 loadCreators(): void {
   this.http.get<any[]>(this.API_URL).subscribe({
     next: (data) => this.creators = data,
     error: (error) => alert('Erreur : ' + (error.error?.error || 'Erreur inconnue'))
   });
 }
}
