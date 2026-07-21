import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface MaintenanceStatus {
  Open: number;
  'In Progress': number;
  Resolved: number;
}

@Component({
  selector: 'app-maintenance-overview',
  imports: [CommonModule],
  templateUrl: './maintenance-overview.html',
  styleUrl: './maintenance-overview.css'
})
export class MaintenanceOverviewComponent implements OnChanges {

  @Input() status: Record<string, number> = {};

  displayStatus: MaintenanceStatus = { Open: 0, 'In Progress': 0, Resolved: 0 };

  total = 0;
  openPct = 0;
  inProgressPct = 0;
  resolvedPct = 0;


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status']) {
      this.calculate();
    }
  }


  private calculate(): void {
    this.displayStatus = {
      Open: this.status?.['pending'] ?? 0,
      'In Progress': this.status?.['in_progress'] ?? 0,
      Resolved: this.status?.['resolved'] ?? 0
    };

    this.total = this.displayStatus.Open + this.displayStatus['In Progress'] + this.displayStatus.Resolved;
    if (this.total > 0) {
      this.openPct = Math.round((this.displayStatus.Open / this.total) * 100);
      this.inProgressPct = Math.round((this.displayStatus['In Progress'] / this.total) * 100);
      this.resolvedPct = Math.round((this.displayStatus.Resolved / this.total) * 100);
    } 
    else {
      this.openPct = 0;
      this.inProgressPct = 0;
      this.resolvedPct = 0;
    }
  }
}