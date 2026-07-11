import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { Lease } from '../../../../../core/models/lease-model';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-lease-card',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './lease-card.html',
  styleUrl: '../../../rental-application/application-list/components/application-card/application-card.css'
})
export class LeaseCardComponent {
  
  @Input({ required: true }) lease!: Lease;
  @Input() propertyDetails: Property | undefined;
}
