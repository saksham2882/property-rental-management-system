import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceFormatPipe } from '../../../../../shared/pipes/price-format-pipe';

interface MonthBar {
  month: string;
  amount: number;
  pct: number;
}

@Component({
  selector: 'app-revenue-chart',
  imports: [CommonModule, PriceFormatPipe],
  templateUrl: './revenue-chart.html',
  styleUrl: './revenue-chart.css'
})
export class RevenueChartComponent implements OnChanges {

  @Input() monthlyRevenue: Record<string, number> = {};

  bars: MonthBar[] = [];
  maxAmount = 0;

  private readonly months = [
    'Sec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  private readonly monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
  ];


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthlyRevenue']) {
      this.buildBars();
    }
  }

  private buildBars(): void {
    const values = new Array<number>(13).fill(0);

    Object.entries(this.monthlyRevenue || {}).forEach(([key, value]) => {
      if (key.toLowerCase().includes('security')) {
        values[0] = value;
        return;
      }

      const monthIndex = this.getMonthIndex(key);
      if (monthIndex !== -1) {
        values[monthIndex + 1] += Number(value);
      }
    });

    this.maxAmount = Math.max(...values);
    this.bars = this.months.map((label, index) => ({
      month: label,
      amount: values[index],
      pct: this.maxAmount ? Math.round(values[index] / this.maxAmount * 100) : 0
    }));
  }


  private getMonthIndex(key: string): number {
    const text = key.toLowerCase().trim();

    for (let i = 0; i < this.monthNames.length; i++) {
      if (text.includes(this.monthNames[i]) || text.includes(this.monthNames[i].substring(0, 3))) {
        return i;
      }
    }

    const dash = text.match(/\d{4}-(\d{2})/);
    if (dash) {
      return Number(dash[1]) - 1;
    }

    const date = new Date(key);
    if (!isNaN(date.getTime())) {
      return date.getMonth();
    }

    return -1;
  }
}