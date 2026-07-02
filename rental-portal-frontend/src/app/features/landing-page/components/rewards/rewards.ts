import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-rewards',
  imports: [CommonModule, IconComponent],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css'
})
export class RewardsComponent {

  referralCode = 'RENTEASE-NEW-5K';
}
