import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';

interface FeatureComparison {
  name: string;
  desc: string;
  traditional: { text: string; available: boolean };
  rentease: { text: string; available: boolean };
}

@Component({
  selector: 'app-comparison',
  imports: [CommonModule, IconComponent],
  templateUrl: './comparison.html',
  styleUrl: './comparison.css'
})
export class ComparisonComponent {

  comparisons: FeatureComparison[] = [
    {
      name: 'Brokerage Commission',
      desc: 'Commission fees charged for viewing or closing a property lease.',
      traditional: { text: '1 Month Rent (upfront)', available: false },
      rentease: { text: '₹0 Commission (Direct)', available: true }
    },
    {
      name: 'Security Deposit',
      desc: 'Funds held by the landlord as deposit throughout the lease.',
      traditional: { text: '6 to 10 Months Rent', available: false },
      rentease: { text: 'Flat 2 Months Rent', available: true }
    },
    {
      name: 'Lease Agreement Processing',
      desc: 'Creation, stamping, and digital/physical signing of rental leases.',
      traditional: { text: 'Physical notary, days of delay', available: false },
      rentease: { text: 'Instant Digital E-Sign', available: true }
    },
    {
      name: 'Maintenance Resolution',
      desc: 'Reporting and tracking maintenance issues and contractor dispatch.',
      traditional: { text: 'Manual call-and-beg landlord', available: false },
      rentease: { text: '24/7 Portal Ticket Tracking', available: true }
    },
    {
      name: 'Rent Payment Options',
      desc: 'Supported channels for paying rent and auto-pay setups.',
      traditional: { text: 'Checks, manual bank transfers', available: false },
      rentease: { text: 'Credit Cards, UPI, Auto-debit', available: true }
    },
    {
      name: 'Rent Receipt Ledger',
      desc: 'Access to historical payments and reporting to credit bureaus.',
      traditional: { text: 'Handwritten receipts or none', available: false },
      rentease: { text: 'Downloadable Credit Builder Ledger', available: true }
    }
  ];
}
