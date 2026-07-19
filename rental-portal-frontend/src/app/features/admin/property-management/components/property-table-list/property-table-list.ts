import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Property } from '../../../../../core/models/property-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-property-table-list',
  imports: [CommonModule, FormsModule, IconComponent, PriceFormatPipe, LoadingSpinnerComponent, EmptyStateComponent, DropdownComponent],
  templateUrl: './property-table-list.html',
  styleUrl: './property-table-list.css'
})
export class PropertyTableListComponent {

  @Input() properties: Property[] = [];
  @Input() loading = false;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Property>();
  @Output() delete = new EventEmitter<string>();


  statusOptions = [
    { value: 'all', label: 'All Listings' },
    { value: 'available', label: 'Available Only' },
    { value: 'rented', label: 'Rented Only' }
  ];

  searchText = '';
  statusFilter: 'all' | 'available' | 'rented' = 'all';

  
  get totalListedCount(): number {
    return this.properties.length;
  }

  get availableCount(): number {
    return this.properties.filter(p => p.available).length;
  }

  get rentedCount(): number {
    return this.properties.filter(p => !p.available).length;
  }

  get filteredProperties(): Property[] {
    let result = [...this.properties];

    if (this.searchText.trim()) {
      const query = this.searchText.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.locality.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter === 'available') {
      result = result.filter(p => p.available);
    } 
    else if (this.statusFilter === 'rented') {
      result = result.filter(p => !p.available);
    }

    result.sort((a, b) => {
      const dateA = a.postedAt || '';
      const dateB = b.postedAt || '';
      return dateB.localeCompare(dateA);
    });

    return result;
  }
}