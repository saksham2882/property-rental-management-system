import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalApplication } from '../../../../../core/models/application-model';
import { Property } from '../../../../../core/models/property-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-application-table-list',
  imports: [CommonModule, IconComponent, PriceFormatPipe, LoadingSpinnerComponent, EmptyStateComponent, DropdownComponent],
  templateUrl: './application-table-list.html',
  styleUrl: './application-table-list.css'
})
export class ApplicationTableListComponent {

  @Input() applications: RentalApplication[] = [];
  @Input() propertiesMap = new Map<string, Property>();
  @Input() loading = false;

  @Output() approve = new EventEmitter<RentalApplication>();
  @Output() reject = new EventEmitter<string>();
  @Output() waitlist = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<RentalApplication>();


  getActionOptions(app: RentalApplication): { value: string; label: string }[] {
    if (app.status === 'under_review' || app.status === 'waitlisted') {
      return [
        { value: 'view', label: 'View Details' },
        { value: 'approve', label: 'Approve' },
        { value: 'waitlist', label: 'Waitlist' },
        { value: 'reject', label: 'Reject' }
      ];
    } 
    else {
      return [
        { value: 'view', label: 'View Details' }
      ];
    }
  }


  onActionSelected(action: string, app: RentalApplication): void {
    if (action === 'view') {
      this.viewDetails.emit(app);
    } 
    else if (action === 'approve') {
      this.approve.emit(app);
    } 
    else if (action === 'waitlist') {
      this.waitlist.emit(app.id!);
    } 
    else if (action === 'reject') {
      this.reject.emit(app.id!);
    }
  }


  getPropertyTitle(propertyId: string): string {
    return this.propertiesMap.get(propertyId)?.title || 'Rental Space';
  }
}
