import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-profile-form',
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './profile-form.html',
  styleUrl: './profile-form.css'
})
export class ProfileFormComponent {

  @Input() profileForm!: FormGroup;
  @Input() loading: boolean | null = false;
  
  @Output() save = new EventEmitter<void>();
}
