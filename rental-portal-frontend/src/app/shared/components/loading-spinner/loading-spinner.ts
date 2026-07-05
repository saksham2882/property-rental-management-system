import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinnerComponent {
  
  @Input() message: string = '';
  @Input() overlay: boolean = false;
  @Input() size: 'md' | 'lg' | 'xl' = 'lg';
  @Input() color: 'primary' | 'accent' = 'primary';

  get wrapperClass(): string {
    return this.overlay ? 'spinner-overlay' : 'spinner-inline';
  }
}
