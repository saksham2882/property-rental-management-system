import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'dashboard-saved-properties',
  imports: [CommonModule, RouterLink, PriceFormatPipe, EmptyStateComponent, IconComponent],
  templateUrl: './dashboard-saved-properties.html',
  styleUrl: './dashboard-saved-properties.css'
})
export class DashboardSavedPropertiesComponent {

  @Input() properties: Property[] = [];
}
