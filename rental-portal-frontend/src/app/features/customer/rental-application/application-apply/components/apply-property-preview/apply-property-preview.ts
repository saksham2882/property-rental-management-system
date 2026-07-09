import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../../shared/pipes/price-format-pipe';
import { Property } from '../../../../../../core/models/property-model';

@Component({
  selector: 'app-apply-property-preview',
  imports: [CommonModule, IconComponent, PriceFormatPipe],
  templateUrl: './apply-property-preview.html',
  styleUrl: './apply-property-preview.css'
})
export class ApplyPropertyPreviewComponent {
  
  @Input({ required: true }) property!: Property;
}
