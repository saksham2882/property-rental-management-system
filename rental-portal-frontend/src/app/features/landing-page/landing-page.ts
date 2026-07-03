import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeroComponent } from './components/hero/hero';
import { FeaturesComponent } from './components/features/features';
import { ProcessComponent } from './components/process/process';
import { ShowcaseComponent } from './components/showcase/showcase';
import { SocialComponent } from './components/social/social';
import { CalculatorComponent } from './components/calculator/calculator';
import { TourComponent } from './components/tour/tour';
import { NeighborhoodComponent } from './components/neighborhood/neighborhood';
import { ComparisonComponent } from './components/comparison/comparison';
import { RewardsComponent } from './components/rewards/rewards';
import { PropertiesComponent } from './components/properties/properties';
import { CtaComponent } from './components/cta/cta';

@Component({
  selector: 'app-landing-page',
  imports: [
    CommonModule,
    HeroComponent,
    FeaturesComponent,
    ProcessComponent,
    ShowcaseComponent,
    SocialComponent,
    CalculatorComponent,
    TourComponent,
    NeighborhoodComponent,
    ComparisonComponent,
    RewardsComponent,
    PropertiesComponent,
    CtaComponent
  ],
  templateUrl: './landing-page.html'
})
export class LandingPageComponent {

  private router = inject(Router);

  onSearch(event: { searchQuery: string, selectedCity: string, selectedType: string }): void {
    this.router.navigate(['/auth/login'], {
      queryParams: {
        search: event.searchQuery,
        city: event.selectedCity,
        type: event.selectedType
      }
    });
  }
}