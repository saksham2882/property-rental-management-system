import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'dashboard-analytics-section',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './analytics-section.html',
  styleUrl: './analytics-section.css'
})
export class AnalyticsSectionComponent {
  @Input() chartPayments: any[] = [];
  @Input() chartLinePath: string = '';
  @Input() chartAreaPath: string = '';
  @Input() nextRentAmount: number = 0;
  @Input() nextDueDate: string = '';
  @Input() daysRemaining: number = 0;
  @Input() paymentCountdownPercent: number = 0;
}
