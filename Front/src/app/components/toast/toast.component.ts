import { Component, inject } from '@angular/core';
import { LucideCircleCheck, LucideCircleAlert, LucideX } from '@lucide/angular';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [LucideCircleCheck, LucideCircleAlert, LucideX]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts = this.toastService.toasts;

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
