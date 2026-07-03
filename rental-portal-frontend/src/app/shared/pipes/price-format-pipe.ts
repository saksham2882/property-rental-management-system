import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {

  transform(value: any, billingPeriod?: string): string {
    if (value === undefined || value === null) return '';

    const val = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(val)) return '';

    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);

    return billingPeriod ? `${formatted}/${billingPeriod}` : formatted;
  }
}
