import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-property-form-panel',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, DropdownComponent],
  templateUrl: './property-form-panel.html',
  styleUrl: './property-form-panel.css'
})
export class PropertyFormPanelComponent {

  @Input() propertyForm!: FormGroup;
  @Input() isEditMode = false;
  @Input() uploadedImages: string[] = [];
  @Input() uploadingFile = false;

  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Output() uploadPhoto = new EventEmitter<any>();
  @Output() removePhoto = new EventEmitter<number>();


  cityOptions = [
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Pune', label: 'Pune' }
  ];

  typeOptions = [
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Independent House', label: 'Independent House' },
    { value: 'Studio', label: 'Studio' }
  ];

  furnishingOptions = [
    { value: 'Fully-Furnished', label: 'Fully-Furnished' },
    { value: 'Semi-Furnished', label: 'Semi-Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' }
  ];
}
