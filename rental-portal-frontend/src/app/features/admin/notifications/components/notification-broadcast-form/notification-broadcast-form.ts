import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { User } from '../../../../../core/models/user-model';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { DropdownComponent } from '../../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-notification-broadcast-form',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, DropdownComponent],
  templateUrl: './notification-broadcast-form.html',
  styleUrl: './notification-broadcast-form.css'
})
export class NotificationBroadcastFormComponent implements OnChanges {

  @Input() broadcastForm!: FormGroup;
  @Input() tenants: User[] = [];

  @Output() submitBroadcast = new EventEmitter<void>();


  typeOptions = [
    { value: 'info', label: 'Information (Blue)' },
    { value: 'success', label: 'Success / Settled (Green)' },
    { value: 'warning', label: 'Warning / Action (Yellow)' },
    { value: 'error', label: 'Critical / Error (Red)' }
  ];


  targetUserOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'Broadcast to All Active Tenants' }
  ];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tenants']) {
      this.updateTargetUserOptions();
    }
  }


  private updateTargetUserOptions(): void {
    const list = [{ value: 'all', label: 'Broadcast to All Active Tenants' }];
    if (this.tenants && this.tenants.length > 0) {
      this.tenants.forEach(t => {
        list.push({
          value: t.id,
          label: `${t.name} (${t.email || 'Tenant'})`
        });
      });
    }
    this.targetUserOptions = list;
  }


  onTargetUserChange(value: string): void {
    this.broadcastForm.patchValue({ targetUser: value });
    this.broadcastForm.get('targetUser')?.markAsTouched();
  }


  onTypeChange(value: string): void {
    this.broadcastForm.patchValue({ type: value });
    this.broadcastForm.get('type')?.markAsTouched();
  }
}