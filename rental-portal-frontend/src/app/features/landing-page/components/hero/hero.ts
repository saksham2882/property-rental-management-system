import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-landing-hero',

  imports: [CommonModule, FormsModule, IconComponent, DropdownComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {

  @Output() search = new EventEmitter<{ searchQuery: string, selectedCity: string, selectedType: string }>();

  searchQuery = '';
  selectedCity = '';
  selectedType = '';

  cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Pune', label: 'Pune' }
  ];

  typeOptions = [
    { value: '', label: 'Any Type' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Independent House', label: 'House' },
    { value: 'Studio', label: 'Studio' }
  ];

  stats = [
    { value: '2,400+', label: 'Properties Listed', icon: 'building' },
    { value: '18,000+', label: 'Happy Tenants', icon: 'users' },
    { value: '12', label: 'Cities Covered', icon: 'map-pin' },
    { value: '₹0', label: 'Zero Brokerage', icon: 'zap' },
  ];

  onSubmit(): void {
    this.search.emit({
      searchQuery: this.searchQuery,
      selectedCity: this.selectedCity,
      selectedType: this.selectedType
    });
  }
}
