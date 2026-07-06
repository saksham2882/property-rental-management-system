import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-property-sidebar',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './property-sidebar.html',
  styleUrl: './property-sidebar.css'
})
export class PropertySidebarComponent {
  
  @Input({ required: true }) property!: Property;
  @Input() hasAlreadyApplied = false;
}
