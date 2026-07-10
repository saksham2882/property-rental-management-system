import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-lease-timeline',
  imports: [CommonModule, IconComponent],
  templateUrl: './lease-timeline.html',
  styleUrl: './lease-timeline.css'
})
export class LeaseTimelineComponent {
  
  @Input({ required: true }) status = 'pending_signature';
}
