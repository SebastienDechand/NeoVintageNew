import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LegalMentionsComponent } from '../legal-mentions/legal-mentions.component';
import { LegalDocumentType } from '../../models/legal-modal.model';
import { LegalModalService } from '../../services/legal-modal.service';
import { CookiesPolicyComponent } from '../cookies-policy/cookies-policy.component';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

@Component({
  selector: 'app-legal-modal',
  standalone: true,
  imports: [
    CommonModule,
    LegalMentionsComponent,
    PrivacyPolicyComponent,
    CookiesPolicyComponent
  ],
  templateUrl: './legal-modal.component.html',
  styleUrls: ['./legal-modal.component.scss']
})
export class LegalModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  currentDocument: LegalDocumentType | null = null;
  private subscription = new Subscription();

  constructor(private modalService: LegalModalService) { }

  ngOnInit(): void {
    this.subscription = this.modalService.getModalState().subscribe(state => {
      this.isOpen = state.isOpen;
      this.currentDocument = state.documentType;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeModal(): void {
    this.modalService.closeModal();
  }

  getModalTitle(): string {
    switch (this.currentDocument) {
      case 'legal-mentions':
        return 'Mentions Légales';
      case 'privacy-policy':
        return 'Politique de Confidentialité';
      case 'cookies-policy':
        return 'Politique de Cookies';
      default:
        return '';
    }
  }
}
