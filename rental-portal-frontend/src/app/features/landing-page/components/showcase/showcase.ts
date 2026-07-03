import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { leaseFeatures, paymentModes, maintenanceFeatures, ticketSteps } from '../mock-data';

@Component({
  selector: 'app-showcase',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './showcase.html',
  styleUrl: './showcase.css'
})
export class ShowcaseComponent {
  
  leaseFeatures = leaseFeatures;
  paymentModes = paymentModes;
  maintenanceFeatures = maintenanceFeatures;
  ticketSteps = ticketSteps;
}
