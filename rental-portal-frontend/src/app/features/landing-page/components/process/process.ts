import { Component, ElementRef, AfterViewInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-process',
  imports: [CommonModule, IconComponent],
  templateUrl: './process.html',
  styleUrl: './process.css'
})
export class ProcessComponent implements AfterViewInit {

  private el = inject(ElementRef);

  steps = [
    { step: '01', title: 'Search & Discover', desc: 'Filter 2,400+ properties by city, BHK count, budget, and amenities.', icon: 'search' },
    { step: '02', title: 'Apply Online', desc: 'Fill out the digital application form with your income and documents.', icon: 'file-text' },
    { step: '03', title: 'Get Approved', desc: 'The admin reviews your profile and approves or requests more documents.', icon: 'check-circle' },
    { step: '04', title: 'Sign Digitally', desc: 'Draw your signature on our canvas to activate your lease agreement.', icon: 'pen' },
    { step: '05', title: 'Pay & Move In', desc: 'Make your first rent payment securely and collect your keys!', icon: 'credit-card' },
  ];

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      const items = this.el.nativeElement.querySelectorAll('.card');
      items.forEach((item: Element) => observer.observe(item));
    } 
    else {
      const items = this.el.nativeElement.querySelectorAll('.card');
      items.forEach((item: Element) => item.classList.add('visible'));
    }

    this.updateProgressLine();
  }
  

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.updateProgressLine();
  }


  private updateProgressLine(): void {
    if (typeof window === 'undefined') return;

    const pipeline = this.el.nativeElement.querySelector('.pipeline');
    const progress = this.el.nativeElement.querySelector('.pipeline-progress');

    if (pipeline && progress) {
      const rect = pipeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const startTrigger = viewportHeight * 0.8;
      const scrolledPast = startTrigger - rect.top;

      let scrollPercent = (scrolledPast / rect.height) * 100;
      scrollPercent = Math.max(0, Math.min(100, scrollPercent));

      progress.style.height = `${scrollPercent}%`;
    }
  }
}
