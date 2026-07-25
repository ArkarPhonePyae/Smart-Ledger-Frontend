import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './groups.component.html',
})
export class GroupsComponent {
  private toast = inject(ToastService);

  createGroup(): void {
    this.toast.show('Group creation wizard opened', 'success');
  }

  manageGroup(name: string): void {
    this.toast.show(`Opening ${name} details...`, 'success');
  }
}
