import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-empty-state',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css'
})
export class EmptyStateComponent {
  
  @Input() icon: string = 'info';
  @Input() title: string = 'No records found';
  @Input() description: string = '';
  @Input() actionText: string = '';
  @Input() actionLink: string = '';
}
