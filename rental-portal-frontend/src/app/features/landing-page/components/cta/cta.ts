import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-cta',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './cta.html',
  styleUrl: './cta.css'
})
export class CtaComponent { }
