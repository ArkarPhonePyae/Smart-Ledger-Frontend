import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './friends.component.html',
})
export class FriendsComponent {
  private toast = inject(ToastService);

  addFriend(): void {
    this.toast.show('Friend invitation link copied!', 'success');
  }

  remind(name: string): void {
    this.toast.show(`Reminder sent to ${name}!`, 'success');
  }

  settle(name: string): void {
    this.toast.show(`Settlement initiated with ${name}!`, 'success');
  }
}
