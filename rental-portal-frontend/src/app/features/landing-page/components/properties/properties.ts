import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { loadProperties } from '../../../../store/properties/properties.actions';
import { selectAllProperties } from '../../../../store/properties/properties.selectors';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format-pipe';
import { fallbackImages, mockProperties } from '../mock-data';

@Component({
  selector: 'app-properties',
  imports: [CommonModule, RouterLink, IconComponent, PriceFormatPipe],
  templateUrl: './properties.html',
  styleUrl: './properties.css'
})
export class PropertiesComponent implements OnInit {

  private store = inject(Store);
  properties$ = this.store.select(selectAllProperties);

  fallbackImages = fallbackImages;
  mockProperties = mockProperties;

  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));
  }

  getFallbackImage(propertyId: string | undefined): string {
    if (!propertyId) return this.fallbackImages[0];
    let hash = 0;
    for (let i = 0; i < propertyId.length; i++) {
      hash = propertyId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % this.fallbackImages.length;
    return this.fallbackImages[index];
  }
}
