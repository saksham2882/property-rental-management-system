import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icon-img';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.css'
})
export class IconComponent implements OnChanges {
  @Input() name: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' = 'md';

  private sanitizer = inject(DomSanitizer);
  svgContent: SafeHtml = '';
  sizeClass: string = 'icon-md';

  ngOnChanges(): void {
    const rawSvg = ICONS[this.name] || ICONS['info'];
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(rawSvg);
    this.sizeClass = `icon-${this.size}`;
  }
}
