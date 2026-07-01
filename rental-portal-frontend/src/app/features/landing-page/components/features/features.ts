import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-landing-features',

  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './features.html',
  styleUrl: './features.css'
})
export class FeaturesComponent {

  features = [
    { icon: 'search', title: 'Smart Search', desc: 'Advanced filters by budget, city, BHK, and amenities. Save your wishlist.' },
    { icon: 'file-text', title: 'Digital Leases', desc: 'Draw your signature on an interactive canvas to digitally sign lease agreements.' },
    { icon: 'credit-card', title: 'Secure Payments', desc: 'Pay rent via UPI, credit card, or net banking through Razorpay checkout.' },
    { icon: 'wrench', title: 'Maintenance Desk', desc: 'Raise tickets with photos, track work order stages, and get resolution notes.' },
    { icon: 'bell', title: 'Instant Alerts', desc: 'Real-time notifications for rent due, application status, and broadcasts.' },
    { icon: 'shield', title: 'Verified Listings', desc: 'All properties are admin-verified. No fraud, no hidden charges.' },
  ];

  propertyTypes = [
    { type: 'Apartment', icon: 'building', desc: 'Modern high-rise flats with society amenities', count: '840+' },
    { type: 'Villa', icon: 'home', desc: 'Independent bungalows with private gardens', count: '210+' },
    { type: 'Studio', icon: 'key', desc: 'Compact 1-room setups perfect for solo living', count: '560+' },
    { type: 'Independent House', icon: 'home', desc: 'Spacious floors in standalone residential homes', count: '390+' },
  ];

  whyUs = [
    { title: 'Zero Brokerage', desc: 'No hidden agent fees. List or find properties completely free.', icon: 'dollar-sign' },
    { title: '24/7 Support', desc: 'Our chat support is always available to resolve tenant issues.', icon: 'message-square' },
    { title: 'Instant Approvals', desc: 'Typical lease approval takes under 48 hours with our system.', icon: 'zap' },
    { title: 'Legal Compliance', desc: 'All lease agreements are digitally certified.', icon: 'lock' },
  ];

  cities = [
    {
      name: 'Bangalore',
      properties: 780,
      avgRent: '₹32,500',
      tag: 'Tech Hub',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Mumbai',
      properties: 640,
      avgRent: '₹38,000',
      tag: 'Financial Capital',
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Delhi',
      properties: 520,
      avgRent: '₹22,000',
      tag: 'National Capital',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Pune',
      properties: 410,
      avgRent: '₹15,000',
      tag: 'Rising IT City',
      image: 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?auto=format&fit=crop&w=600&q=80'
    },
  ];
}
