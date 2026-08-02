// theme.service.ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal<boolean>(true);

  constructor() {
    // 👈 App စစချင်း LocalStorage ထဲက Theme ကို ပြန်ဖတ်ရန်
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      const isDarkParsed = JSON.parse(savedTheme);
      this.isDark.set(isDarkParsed);
      this.applyTheme(isDarkParsed);
    } else {
      this.applyTheme(this.isDark());
    }
  }

  toggle(): void {
    this.isDark.update((v) => !v);
    this.applyTheme(this.isDark());
  }

  setDarkMode(isDark: boolean): void {
    this.isDark.set(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean): void {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }
}