import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { User } from '../../../../../core/models/user-model';

@Component({
  selector: 'app-profile-summary',
  imports: [CommonModule, IconComponent],
  templateUrl: './profile-summary.html',
  styleUrl: './profile-summary.css'
})
export class ProfileSummaryComponent {
  
  @Input() user!: User;
}
