import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditContentComponent implements OnInit {
  @Input() photos: any[] = [];
  @Input() creators: any[] = [];
  @Output() photosChange = new EventEmitter<any[]>();
  @Output() creatorsChange = new EventEmitter<any[]>();

  email = '';
  password = '';
  editMode = false;
  showLoginModal = false;

  private readonly BASE_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    this.http.get<any[]>(`${this.BASE_URL}/photos`).subscribe(
      photos => this.photos = photos
    );
    this.http.get<any[]>(`${this.BASE_URL}/creators`).subscribe(
      creators => this.creators = creators
    );
  }

  closeModals(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showLoginModal = false;
      this.editMode = false;
      this.resetForm();
    }
  }

  resetForm(): void {
    this.email = '';
    this.password = '';
  }

  enableEdit(): void {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.editMode = true;
        this.showLoginModal = false;
        this.resetForm();
      },
      error: (error) => this.handleError(error)
    });
  }

  saveAll(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.token}`
    });

    forkJoin({
      photos: this.http.put(`${this.BASE_URL}/photos`, this.photos, { headers }),
      creators: this.http.put(`${this.BASE_URL}/creators`, this.creators, { headers })
    }).subscribe({
      next: () => {
        this.photosChange.emit(this.photos);
        this.creatorsChange.emit(this.creators);
        alert('Contenu mis à jour avec succès !');
        this.editMode = false;
      },
      error: this.handleError.bind(this)
    });
  }

  private handleError(error: any): void {
    if (error.status === 401) {
      alert('Identifiants incorrects !');
      this.authService.logout();
    } else {
      alert('Erreur : ' + (error.error?.error || 'Erreur inconnue'));
    }
  }
}
