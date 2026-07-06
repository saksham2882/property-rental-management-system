import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { Property } from '../../../../../core/models/property-model';

@Component({
  selector: 'app-property-card',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './property-card.html',
  styleUrl: './property-card.css'
})
export class PropertyCardComponent {

  @Input({ required: true }) property!: Property;
  @Input() isGridView = true;
  @Input() isWishlisted = false;

  @Output() toggleWishlist = new EventEmitter<Event>();

  onWishlistClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggleWishlist.emit(event);
  }
}