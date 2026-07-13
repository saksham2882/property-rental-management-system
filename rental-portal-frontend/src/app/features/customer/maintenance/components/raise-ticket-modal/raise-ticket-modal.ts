import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UploadService } from '../../../../../core/services/upload-service';
import { ToastService } from '../../../../../core/services/toast-service';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { ModalComponent } from '../../../../../shared/components/modal/modal';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-raise-ticket-modal',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, ModalComponent, DropdownComponent],
  templateUrl: './raise-ticket-modal.html',
  styleUrl: './raise-ticket-modal.css'
})
export class RaiseTicketModalComponent {

  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);

  @Input() isOpen = false;
  @Input() propertyId = '';
  @Input() userId = '';

  @Output() close = new EventEmitter<void>();
  @Output() submitRequest = new EventEmitter<any>();

  uploadedImages: string[] = [];
  uploadingFile = false;


  categoryOptions = [
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Electrical', label: 'Electrical' },
    { value: 'Appliance', label: 'Appliance' },
    { value: 'HVAC', label: 'Heating & Cooling' },
    { value: 'Structural', label: 'Structural' },
    { value: 'Other', label: 'Other' }
  ];

  urgencyOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];


  maintenanceForm: FormGroup = this.fb.group({
    category: ['Plumbing', Validators.required],
    urgency: ['medium', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingFile = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploadedImages.push(res.url);
        this.toast.success('Photo attached successfully!');
        this.uploadingFile = false;
      },
      error: () => {
        this.toast.error('Failed to attach photo.');
        this.uploadingFile = false;
      }
    });
  }


  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }


  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }
    if (!this.propertyId) {
      this.toast.error('No property context selected to submit the request.');
      return;
    }

    const payload = {
      ...this.maintenanceForm.value,
      propertyId: this.propertyId,
      tenantId: this.userId,
      images: this.uploadedImages
    };

    this.submitRequest.emit(payload);
    this.closeModal();
  }

  
  closeModal(): void {
    this.close.emit();
    this.maintenanceForm.reset({
      category: 'Plumbing',
      urgency: 'medium',
      description: ''
    });
    this.uploadedImages = [];
  }
}