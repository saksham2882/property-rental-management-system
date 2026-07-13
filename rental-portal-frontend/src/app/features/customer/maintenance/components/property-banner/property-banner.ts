import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-property-banner',
  imports: [CommonModule, IconComponent],
  templateUrl: './property-banner.html',
  styleUrl: './property-banner.css'
})
export class PropertyBannerComponent {
  
  @Input({ required: true }) property!: Property;
  @Output() raiseTicket = new EventEmitter<void>();
}
