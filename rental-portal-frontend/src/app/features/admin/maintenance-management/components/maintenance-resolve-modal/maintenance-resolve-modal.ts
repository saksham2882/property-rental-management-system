import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MaintenanceRequest } from '../../../../../core/models/maintenance-model';
import { ModalComponent } from '../../../../../shared/components/modal/modal';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-maintenance-resolve-modal',
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, DropdownComponent],
  templateUrl: './maintenance-resolve-modal.html',
  styleUrl: './maintenance-resolve-modal.css'
})
export class MaintenanceResolveModalComponent {

  @Input() isOpen = false;
  @Input() resolveForm!: FormGroup;
  @Input() request: MaintenanceRequest | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submitResolution = new EventEmitter<void>();


  statusOptions = [
    { value: 'pending', label: 'Pending Review' },
    { value: 'in_progress', label: 'Work In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];


  onStatusChange(status: string): void {
    this.resolveForm.patchValue({ status });
    this.resolveForm.get('status')?.markAsTouched();
  }
}
