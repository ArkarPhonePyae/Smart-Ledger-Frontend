import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FadeInViewDirective } from '../../shared/directives/fade-in-view.directive';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FadeInViewDirective],
  templateUrl: './admin.component.html',
})
export class AdminComponent {}
