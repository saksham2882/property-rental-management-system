import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown';
import { cityOptions, typeOptions, stats } from '../mock-data';

@Component({
  selector: 'app-hero',
  imports: [CommonModule, FormsModule, IconComponent, DropdownComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {

  @Output() search = new EventEmitter<{ searchQuery: string, selectedCity: string, selectedType: string }>();

  searchQuery = '';
  selectedCity = '';
  selectedType = '';

  cityOptions = cityOptions;
  typeOptions = typeOptions;
  stats = stats;

  onSubmit(): void {
    this.search.emit({
      searchQuery: this.searchQuery,
      selectedCity: this.selectedCity,
      selectedType: this.selectedType
    });
  }
}
