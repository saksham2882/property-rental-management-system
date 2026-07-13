import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { Rent } from '../../../../../core/models/rent-model';

@Component({
  selector: 'app-rent-card',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './rent-card.html',
  styleUrl: './rent-card.css'
})
export class RentCardComponent {
  
  @Input({ required: true }) rent!: Rent;
  @Input() payingRentId: string | null = null;

  @Output() pay = new EventEmitter<Rent>();
  @Output() download = new EventEmitter<string>();

  onPayClick(): void {
    this.pay.emit(this.rent);
  }

  onDownloadClick(): void {
    this.download.emit(this.rent.id);
  }
}