import { Component } from '@angular/core';
import { LegalModalComponent } from "../legal-modal/legal-modal.component";
import { CommonModule } from '@angular/common';
import { LegalModalService } from '../../services/legal-modal.service';
import { LegalDocumentType } from '../../models/legal-modal.model';

@Component({
  selector: 'app-footer',
  imports: [LegalModalComponent, CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(private legalModalService: LegalModalService) {}

  openModal(event: Event, type: LegalDocumentType): void {
    event.preventDefault();
    this.legalModalService.openModal(type);
  }
}
