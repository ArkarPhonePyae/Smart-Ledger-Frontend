import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { UiStateService } from '../../../core/services/ui-state.service';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './command-palette.component.html',
})
export class CommandPaletteComponent implements AfterViewChecked {
  private ui = inject(UiStateService);
  private router = inject(Router);
  private focused = false;

  @ViewChild('commandInput') commandInput?: ElementRef<HTMLInputElement>;

  readonly isOpen = this.ui.isCommandPaletteOpen;

  ngAfterViewChecked(): void {
    if (this.isOpen() && this.commandInput && !this.focused) {
      this.commandInput.nativeElement.focus();
      this.focused = true;
    }
    if (!this.isOpen()) {
      this.focused = false;
    }
  }

  goTo(view: string): void {
    this.router.navigate(['/', view]);
    this.close();
  }

  close(): void {
    this.ui.closeCommandPalette();
  }
}
