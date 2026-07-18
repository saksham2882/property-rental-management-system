import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'dashboard-utility-panels',

  imports: [CommonModule, RouterLink, IconComponent, DropdownComponent],
  templateUrl: './utility-panels.html',
  styleUrl: './utility-panels.css'
})
export class UtilityPanelsComponent implements OnChanges {
  @Input() activeLeasesList: any[] = [];
  @Input() selectedLeaseId: string = '';
  @Input() selectedLeaseRent: number = 15000;
  @Input() selectedLeaseBedrooms: number = 2;
  @Input() roommateCount: number = 2;
  @Input() calculatedShare: number = 0;
  @Input() latestRequestTitle: string = '';
  @Input() latestRequestStage: number = 0;

  @Output() leaseChange = new EventEmitter<string>();
  @Output() roommateCountChange = new EventEmitter<number>();

  leaseOptions: { value: any; label: string }[] = [];

  ngOnChanges(): void {
    if (this.activeLeasesList) {
      this.leaseOptions = this.activeLeasesList.map(l => ({
        value: l.id,
        label: `${l.propertyTitle || 'Residential Unit'} (₹${(l.monthlyRent || 0).toLocaleString('en-IN')}/mo)`
      }));
    }
  }

  onLeaseSelect(leaseId: string): void {
    this.leaseChange.emit(leaseId);
  }

  onRoommatesSliderChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10) || 1;
    this.roommateCountChange.emit(val);
  }
}
