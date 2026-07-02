import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { FeatureComparison, comparisons } from '../mock-data';

@Component({
  selector: 'app-comparison',
  imports: [CommonModule, IconComponent],
  templateUrl: './comparison.html',
  styleUrl: './comparison.css'
})
export class ComparisonComponent {
  
  comparisons: FeatureComparison[] = comparisons;
}
