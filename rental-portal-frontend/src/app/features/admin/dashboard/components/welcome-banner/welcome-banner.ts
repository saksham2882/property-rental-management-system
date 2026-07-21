import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-admin-welcome-banner',
  imports: [CommonModule, IconComponent],
  templateUrl: './welcome-banner.html',
  styleUrl: './welcome-banner.css'
})
export class AdminWelcomeBannerComponent {
  
  @Input() adminName = 'Administrator';
}
