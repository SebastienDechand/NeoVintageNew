export type LegalDocumentType = 'legal-mentions' | 'privacy-policy' | 'cookies-policy';

export interface ModalState {
  isOpen: boolean;
  documentType: LegalDocumentType | null;
}
