import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-rented-property-card',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './rented-property-card.html',
  styleUrl: './rented-property-card.css'
})
export class RentedPropertyCardComponent {
  
  @Input({ required: true }) property!: Property;
  @Input() totalTickets = 0;
  @Input() openTickets = 0;
}
