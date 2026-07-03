import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon';
import { testimonials, faqs } from '../mock-data';

@Component({
  selector: 'app-social',
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './social.html',
  styleUrl: './social.css'
})
export class SocialComponent {
  
  activeFaqIndex: number | null = null;
  emailAddress = '';
  subscribed = false;

  testimonials = testimonials;
  faqs = faqs;

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? null : index;
  }

  getStars(count: number): number[] {
    return Array(count).fill(0);
  }

  onSubscribe(): void {
    if (this.emailAddress) {
      this.subscribed = true;
      setTimeout(() => {
        this.subscribed = false;
        this.emailAddress = '';
      }, 3000);
    }
  }
}
