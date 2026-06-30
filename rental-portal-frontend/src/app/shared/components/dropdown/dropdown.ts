import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon';
import { ClickOutsideDirective } from '../../directives/click-outside-directive';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule, IconComponent, ClickOutsideDirective],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css'
})
export class DropdownComponent {

  @Input() options: { value: any; label: string }[] = [];
  @Input() value: any = '';
  @Input() placeholder: string = 'Select option';
  @Input() iconName?: string;

  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;

  get selectedLabel(): string {
    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(optValue: any): void {
    this.value = optValue;
    this.valueChange.emit(optValue);
    this.isOpen = false;
  }
}