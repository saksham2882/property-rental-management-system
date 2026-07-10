import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, IconComponent],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {
  
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() closeOnBackdrop = true;

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if (this.closeOnBackdrop) {
      this.close.emit();
    }
  }
}
