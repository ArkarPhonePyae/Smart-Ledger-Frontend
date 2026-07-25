import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  /** Original markup ships with `<html class="dark">` i.e. dark mode by default. */
  readonly isDark = signal<boolean>(true);

  toggle(): void {
    this.isDark.update((v) => !v);
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
