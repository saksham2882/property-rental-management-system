import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-gallery',
  imports: [CommonModule],
  templateUrl: './property-gallery.html',
  styleUrl: './property-gallery.css'
})
export class PropertyGalleryComponent {
  
  @Input() images: string[] = [];
  @Input() type = '';
  @Input() title = '';

  activeImageIndex = 0;

  setImage(index: number): void {
    this.activeImageIndex = index;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement) {
      imgElement.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
    }
  }
}
