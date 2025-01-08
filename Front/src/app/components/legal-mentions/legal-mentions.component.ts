import { Component, OnInit } from '@angular/core';
import { LegalMentionsData } from '../../interfaces/legal-mentions.interface';
import { Meta, Title } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-legal-mentions',
  templateUrl: './legal-mentions.component.html',
  styleUrls: ['./legal-mentions.component.scss'],
  standalone: true,
  imports: [DatePipe]
})
export class LegalMentionsComponent implements OnInit {
  public legalData: LegalMentionsData = {
    company: {
      name: '[Nom de la société]',
      legalStatus: '[Forme juridique]',
      capital: '[Montant du capital] euros',
      rcs: '[Numéro RCS]',
      siret: '[Numéro SIRET]',
      vatNumber: '[Numéro TVA]',
      address: '[Adresse complète]',
      email: '[Email de contact]',
      phone: '[Téléphone]',
      director: '[Nom du directeur de publication]'
    },
    hosting: {
      name: "[Nom de l'hébergeur]",
      company: "[Raison sociale de l'hébergeur]",
      address: "[Adresse de l'hébergeur]",
      phone: "[Téléphone de l'hébergeur]",
      email: "[Email de l'hébergeur]",
      website: "[Site web de l'hébergeur]"
    },
    lastUpdate: new Date()
  };

  constructor(
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags(): void {
    this.title.setTitle('Mentions Légales - ' + this.legalData.company.name);
    this.meta.updateTag({ name: 'description', content: 'Mentions légales de ' + this.legalData.company.name });
  }
}
