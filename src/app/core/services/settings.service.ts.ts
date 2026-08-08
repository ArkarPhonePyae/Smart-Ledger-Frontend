import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  currency = signal<string>(localStorage.getItem('aurapay_currency') || 'USD ($)');

  setCurrency(curr: string): void {
    this.currency.set(curr);
    localStorage.setItem('aurapay_currency', curr);
  }

  getSymbol(): string {
    const curr = this.currency();
    if (curr.includes('EUR')) return '€';
    if (curr.includes('MMK')) return 'Ks';
    return '$';
  }
}