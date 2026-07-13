import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { Lease } from '../../../../../core/models/lease-model';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-rent-lease-card',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './lease-card.html',
  styleUrl: './lease-card.css'
})
export class RentLeaseCardComponent {
  
  @Input({ required: true }) lease!: Lease;
  @Input() property: Property | undefined;
  @Input() unpaidCount = 0;
  @Input() unpaidAmount = 0;
  @Input() dueDate: string | null = null;

  @Output() selectLease = new EventEmitter<string>();

  onClick(): void {
    this.selectLease.emit(this.lease.id);
  }
}
