import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalState, LegalDocumentType } from '../models/legal-modal.model';

@Injectable({
  providedIn: 'root'
})
export class LegalModalService {
  private modalState = new BehaviorSubject<ModalState>({
    isOpen: false,
    documentType: null
  });

  openModal(documentType: LegalDocumentType): void {
    this.modalState.next({
      isOpen: true,
      documentType
    });
  }

  closeModal(): void {
    this.modalState.next({
      isOpen: false,
      documentType: null
    });
  }

  getModalState(): Observable<ModalState> {
    return this.modalState.asObservable();
  }
}
