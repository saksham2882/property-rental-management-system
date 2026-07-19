import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RentalApplication } from '../../../../../core/models/application-model';
import { ModalComponent } from '../../../../../shared/components/modal/modal';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-application-details-modal',
  imports: [CommonModule, ModalComponent, IconComponent, PriceFormatPipe],
  templateUrl: './application-details-modal.html',
  styleUrl: './application-details-modal.css'
})
export class ApplicationDetailsModalComponent {

  @Input() isOpen = false;
  @Input() application: RentalApplication | null = null;
  @Input() propertyTitle = '';

  @Output() close = new EventEmitter<void>();
  @Output() approve = new EventEmitter<RentalApplication>();
  @Output() reject = new EventEmitter<string>();
  @Output() waitlist = new EventEmitter<string>();


  isImage(docUrl: string): boolean {
    if (!docUrl) return false;
    const lower = docUrl.toLowerCase();
    return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp');
  }

  getFileName(docUrl: string): string {
    if (!docUrl) return 'Document';
    const parts = docUrl.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.split('?')[0] || 'Document';
  }
}