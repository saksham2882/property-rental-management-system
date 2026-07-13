import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-emergency-policy-sidebar',
  imports: [CommonModule, IconComponent],
  templateUrl: './emergency-policy-sidebar.html',
  styleUrl: './emergency-policy-sidebar.css'
})
export class EmergencyPolicySidebarComponent { }
