import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../../../shared/components/icon/icon';

@Component({
  selector: 'app-admin-quick-actions',
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css'
})
export class AdminQuickActionsComponent {}
