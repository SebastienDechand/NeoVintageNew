import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly DURATION = 4000;
  private nextId = 0;
  private toastsSignal = signal<ToastItem[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  dismiss(id: number): void {
    this.toastsSignal.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  private show(message: string, type: ToastType): void {
    const id = this.nextId++;
    this.toastsSignal.update(toasts => [...toasts, { id, message, type }]);
    setTimeout(() => this.dismiss(id), this.DURATION);
  }
}
