import { Component, Input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-cards-banner',
  imports: [LucideDynamicIcon],
  templateUrl: './cards-banner.component.html',
  styleUrl: './cards-banner.component.scss'
})
export class CardsBannerComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() accent: 'fuchsia' | 'orange' | 'yellow' = 'fuchsia';

  expanded = false;

  toggle(): void {
    this.expanded = !this.expanded;
  }
}
