import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { User } from '../../../../../core/models/user-model';

@Component({
  selector: 'dashboard-welcome-banner',
  imports: [CommonModule, IconComponent],
  templateUrl: './welcome-banner.html',
  styleUrl: './welcome-banner.css'
})
export class WelcomeBannerComponent {
  
  @Input() currentUser: User | null = null;
  @Input() leaseProgress: number = 0;
  @Input() activeLeaseTitle: string = '';
  @Input() daysRemaining: number = 0;
}
