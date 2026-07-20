import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { User } from '../../../../../core/models/user-model';
import { ModalComponent } from '../../../../../shared/components/modal/modal';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-create-rent-modal',
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, DropdownComponent],
  templateUrl: './create-rent-modal.html',
  styleUrl: './create-rent-modal.css'
})
export class CreateRentModalComponent {

  @Input() isOpen = false;
  @Input() rentForm!: FormGroup;
  @Input() tenants: User[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submitRent = new EventEmitter<void>();


  monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  get tenantOptions(): { value: string; label: string }[] {
    return this.tenants.map(t => ({
      value: t.id,
      label: `${t.name} (${t.email})`
    }));
  }

  get monthOptions(): { value: string; label: string }[] {
    return this.monthsList.map(m => ({
      value: m,
      label: m
    }));
  }

  onTenantChange(tenantId: string): void {
    this.rentForm.patchValue({ tenantId });
    this.rentForm.get('tenantId')?.markAsTouched();
  }

  onMonthChange(month: string): void {
    this.rentForm.patchValue({ month });
    this.rentForm.get('month')?.markAsTouched();
  }
}
