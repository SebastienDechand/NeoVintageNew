export interface CompanyInfo {
  name: string;
  legalStatus: string;
  capital: string;
  rcs: string;
  siret: string;
  vatNumber: string;
  address: string;
  email: string;
  phone: string;
  director: string;
}

export interface HostingInfo {
  name: string;
  company: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface LegalMentionsData {
  company: CompanyInfo;
  hosting: HostingInfo;
  lastUpdate: Date;
}
