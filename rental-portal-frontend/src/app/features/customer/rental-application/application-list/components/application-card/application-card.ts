import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../../shared/pipes/price-format-pipe';
import { RentalApplication } from '../../../../../../core/models/application-model';
import { Property } from '../../../../../../core/models/property-model';

@Component({
  selector: 'app-application-card',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './application-card.html',
  styleUrl: './application-card.css'
})
export class ApplicationCardComponent {
  
  @Input({ required: true }) application!: RentalApplication;
  @Input() propertyTitle = 'Rental Space';
  @Input() propertyDetails: Property | undefined;

  @Output() cancel = new EventEmitter<void>();

  onCancelClick(): void {
    this.cancel.emit();
  }
}