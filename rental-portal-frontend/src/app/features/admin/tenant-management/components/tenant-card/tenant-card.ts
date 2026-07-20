import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../core/models/user-model';
import { Lease } from '../../../../../core/models/lease-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-tenant-card',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './tenant-card.html',
  styleUrl: './tenant-card.css'
})
export class TenantCardComponent {
  
  @Input({ required: true }) tenant!: User;
  @Input() activeLease?: Lease;
  @Input() leasesCount = 0;

  @Output() select = new EventEmitter<User>();

  onCardClick(): void {
    this.select.emit(this.tenant);
  }
}
