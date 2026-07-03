import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format-pipe';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule, FormsModule, IconComponent, PriceFormatPipe],
  templateUrl: './calculator.html',
  styleUrl: './calculator.css'
})
export class CalculatorComponent {

  monthlyRent = 30000;
  bhk = 2;

  get brokerFee() {
    return this.monthlyRent;
  }

  get traditionalDeposit() {
    return this.monthlyRent * 6;
  }

  get renteaseDeposit() {
    return this.monthlyRent * 2;
  }

  get totalSavings() {
    return this.brokerFee + (this.traditionalDeposit - this.renteaseDeposit);
  }

  selectBhk(value: number): void {
    this.bhk = value;
    switch (value) {
      case 1:
        this.monthlyRent = 15000;
        break;
      case 2:
        this.monthlyRent = 30000;
        break;
      case 3:
        this.monthlyRent = 55000;
        break;
      case 4:
        this.monthlyRent = 95000;
        break;
    }
  }
}
