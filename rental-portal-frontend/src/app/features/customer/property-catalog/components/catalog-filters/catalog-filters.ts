import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-catalog-filters',
  imports: [CommonModule, FormsModule, IconComponent, DropdownComponent],
  templateUrl: './catalog-filters.html',
  styleUrl: './catalog-filters.css'
})
export class CatalogFiltersComponent {

  @Input() search = '';
  @Input() city = '';
  @Input() type = '';
  @Input() furnishing = '';
  @Input() bedrooms: number | null = null;
  @Input() minRent: number | null = null;
  @Input() maxRent: number | null = null;
  @Input() minArea: number | null = null;
  @Input() maxArea: number | null = null;
  @Input() available: boolean | null = null;
  @Input() favoritesOnly = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() cityChange = new EventEmitter<string>();
  @Output() typeChange = new EventEmitter<string>();
  @Output() furnishingChange = new EventEmitter<string>();
  @Output() bedroomsChange = new EventEmitter<number | null>();
  @Output() minRentChange = new EventEmitter<number | null>();
  @Output() maxRentChange = new EventEmitter<number | null>();
  @Output() minAreaChange = new EventEmitter<number | null>();
  @Output() maxAreaChange = new EventEmitter<number | null>();
  @Output() availableChange = new EventEmitter<boolean | null>();
  @Output() favoritesOnlyChange = new EventEmitter<boolean>();

  @Output() filterChange = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  @Input() cityOptions: any[] = [];
  @Input() typeOptions: any[] = [];
  @Input() bedroomOptions: any[] = [];
  @Input() furnishingOptions: any[] = [];
  @Input() availabilityOptions: any[] = [];

  onRentChange(): void {
    if (this.minRent !== null && this.minRent < 0) this.minRent = 0;
    if (this.maxRent !== null && this.maxRent < 0) this.maxRent = 0;
    this.minRentChange.emit(this.minRent);
    this.maxRentChange.emit(this.maxRent);
    this.filterChange.emit();
  }

  onAreaChange(): void {
    if (this.minArea !== null && this.minArea < 0) this.minArea = 0;
    if (this.maxArea !== null && this.maxArea < 0) this.maxArea = 0;
    this.minAreaChange.emit(this.minArea);
    this.maxAreaChange.emit(this.maxArea);
    this.filterChange.emit();
  }

  onSearchChange(val: string): void {
    this.search = val;
    this.searchChange.emit(val);
    this.filterChange.emit();
  }

  onCityChange(val: string): void {
    this.city = val;
    this.cityChange.emit(val);
    this.filterChange.emit();
  }

  onTypeChange(val: string): void {
    this.type = val;
    this.typeChange.emit(val);
    this.filterChange.emit();
  }

  onBedroomsChange(val: number | null): void {
    this.bedrooms = val;
    this.bedroomsChange.emit(val);
    this.filterChange.emit();
  }

  onFurnishingChange(val: string): void {
    this.furnishing = val;
    this.furnishingChange.emit(val);
    this.filterChange.emit();
  }

  onAvailabilityChange(val: boolean | null): void {
    this.available = val;
    this.availableChange.emit(val);
    this.filterChange.emit();
  }

  onFavoritesToggle(val: boolean): void {
    this.favoritesOnly = val;
    this.favoritesOnlyChange.emit(val);
    this.filterChange.emit();
  }

  resetFilters(): void {
    this.reset.emit();
  }
}