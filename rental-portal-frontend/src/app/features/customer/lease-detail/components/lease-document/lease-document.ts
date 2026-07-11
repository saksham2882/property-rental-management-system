import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { Lease } from '../../../../../core/models/lease-model';
import { User } from '../../../../../core/models/user-model';
import { LeaseSignaturePadComponent } from '../lease-signature-pad/lease-signature-pad';

@Component({
  selector: 'app-lease-document',
  imports: [CommonModule, IconComponent, LeaseSignaturePadComponent],
  templateUrl: './lease-document.html',
  styleUrl: './lease-document.css'
})
export class LeaseDocumentComponent {
  
  @Input({ required: true }) lease!: Lease;
  @Input() currentUser: User | null = null;

  @Output() sign = new EventEmitter<string>();

  onSignSubmit(signatureBase64: string): void {
    this.sign.emit(signatureBase64);
  }
}
