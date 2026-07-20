import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/components/modal/modal';

@Component({
  selector: 'app-lease-generation-modal',
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './lease-generation-modal.html',
  styleUrl: './lease-generation-modal.css'
})
export class LeaseGenerationModalComponent {
  
  @Input() isOpen = false;
  @Input() leaseForm!: FormGroup;
  @Input() applicantName = '';

  @Output() close = new EventEmitter<void>();
  @Output() submitLease = new EventEmitter<void>();
}
