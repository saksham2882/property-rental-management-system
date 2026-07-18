import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'dashboard-stats-cards',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.css'
})
export class StatsCardsComponent {
  
  @Input() stats = {
    activeLeasesCount: 0,
    pendingRentAmount: 0,
    pendingRequestsCount: 0,
    activeApplicationsCount: 0
  };
}
