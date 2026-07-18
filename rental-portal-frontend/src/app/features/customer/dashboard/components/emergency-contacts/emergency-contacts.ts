import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'dashboard-emergency-contacts',
  imports: [CommonModule, IconComponent],
  templateUrl: './emergency-contacts.html',
  styleUrl: './emergency-contacts.css'
})
export class EmergencyContactsComponent {
  
  emergencyList = [
    { name: 'Electrical Support', role: 'Electrician', phone: '+91 9900881122', icon: 'zap' },
    { name: 'Plumbing & Leakages', role: 'Plumber', phone: '+91 9887766554', icon: 'wrench' },
    { name: 'Society Security Guard', role: 'Security', phone: '+91 9110022334', icon: 'shield' }
  ];
}
