import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { features, propertyTypes, whyUs, cities } from '../mock-data';

@Component({
  selector: 'app-features',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './features.html',
  styleUrl: './features.css'
})
export class FeaturesComponent {
  
  features = features;
  propertyTypes = propertyTypes;
  whyUs = whyUs;
  cities = cities;
}
