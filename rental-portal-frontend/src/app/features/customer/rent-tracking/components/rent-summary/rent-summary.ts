import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-rent-summary',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './rent-summary.html',
  styleUrl: './rent-summary.css'
})
export class RentSummaryComponent {
  
  @Input() totalPendingAmount = 0;
  @Input() pendingBillsCount = 0;
  @Input() nextDueDate: Date | null = null;
}
