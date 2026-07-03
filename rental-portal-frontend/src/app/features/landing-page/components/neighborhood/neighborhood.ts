import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { Destination, Category, categories } from '../mock-data';

@Component({
  selector: 'app-neighborhood',
  imports: [CommonModule, IconComponent],
  templateUrl: './neighborhood.html',
  styleUrl: './neighborhood.css'
})
export class NeighborhoodComponent {

  activeCategoryId = 'transit';
  hoveredDest: Destination | null = null;
  categories: Category[] = categories;

  get currentCategory(): Category {
    return this.categories.find(c => c.id === this.activeCategoryId) || this.categories[0];
  }

  selectCategory(id: string): void {
    this.activeCategoryId = id;
    this.hoveredDest = null;
  }
}