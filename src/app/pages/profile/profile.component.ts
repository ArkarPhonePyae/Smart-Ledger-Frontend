import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {}
