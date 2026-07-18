import { Injectable } from '@angular/core';
import { Lease } from '../../../../core/models/lease-model';
import { Rent } from '../../../../core/models/rent-model';
import { RentalApplication } from '../../../../core/models/application-model';
import { Property } from '../../../../core/models/property-model';
import { MaintenanceRequest } from '../../../../core/models/maintenance-model';


export interface ActivityItem {
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: string;
  date: Date;
}

export interface ChartItem {
  month: string;
  amount: number;
  leaseName: string;
  status: string;
  percent: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Calculates lease progress and remaining days for the latest active lease.
  calculateLeaseProgress(activeLease: Lease | null): { progress: number; daysRemaining: number } {
    if (!activeLease) {
      return { progress: 0, daysRemaining: 0 };
    }

    const start = new Date(activeLease.startDate).getTime();
    const end = new Date(activeLease.endDate).getTime();
    const now = new Date().getTime();

    if (now >= start && now <= end) {
      const total = end - start;
      const elapsed = now - start;
      const progress = Math.round((elapsed / total) * 100);
      const remainingMs = end - now;
      const daysRemaining = Math.round(remainingMs / (1000 * 60 * 60 * 24));
      return { progress, daysRemaining };
    }
    return { progress: 0, daysRemaining: 0 };
  }


  // Determines the next rent bill details and due date status.
  determineNextRentBill(pendingRents: Rent[]): { amount: number; dueDate: string; countdownPercent: number } {
    const sortedBills = [...pendingRents].sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime());
    
    if (sortedBills.length > 0 && sortedBills[0].dueDate) {
      const amount = sortedBills[0].amount || 0;
      const dueDate = new Date(sortedBills[0].dueDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      // Calculate countdown circle percent
      const dueTime = new Date(sortedBills[0].dueDate).getTime();
      const nowTime = new Date().getTime();
      const diffDays = Math.max(0, Math.round((dueTime - nowTime) / (1000 * 60 * 60 * 24)));
      const countdownPercent = Math.min(100, Math.max(0, Math.round(((30 - diffDays) / 30) * 100)));
      
      return { amount, dueDate, countdownPercent };
    }
    
    return { amount: 0, dueDate: 'No outstanding bills', countdownPercent: 0 };
  }


  // Compiles recent activities list feed sorted descending by event dates.
  compileRecentActivities(
    pendingRents: Rent[],
    applications: RentalApplication[],
    requests: MaintenanceRequest[],
    properties: Property[]
  ): ActivityItem[] {
    const list: ActivityItem[] = [];

    // 1. Unpaid bills
    pendingRents.forEach(r => {
      list.push({
        title: 'Invoice Unpaid',
        desc: `Rent invoice of ₹${r.amount?.toLocaleString('en-IN')} is outstanding.`,
        time: r.dueDate ? new Date(r.dueDate).toLocaleDateString() : 'Due Soon',
        type: 'warning',
        icon: 'credit-card',
        date: r.dueDate ? new Date(r.dueDate) : new Date(0)
      });
    });

    // 2. Applications
    applications.forEach(app => {
      const matchedProperty = properties.find(p => p.id === app.propertyId);
      list.push({
        title: `Application ${app.status}`,
        desc: `Submitted for "${matchedProperty?.title || 'Property'}"`,
        time: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent',
        type: app.status?.toLowerCase() === 'approved' ? 'success' : app.status?.toLowerCase() === 'rejected' ? 'danger' : 'info',
        icon: 'home',
        date: app.appliedAt ? new Date(app.appliedAt) : new Date(0)
      });
    });

    // 3. Maintenance
    requests.forEach(req => {
      list.push({
        title: `Request Raised: ${req.category || 'Maintenance'}`,
        desc: `Issue category: ${req.category}. Status is ${req.status}.`,
        time: req.raisedAt ? new Date(req.raisedAt).toLocaleDateString() : 'Recent',
        type: req.status?.toLowerCase() === 'resolved' ? 'success' : 'info',
        icon: 'wrench',
        date: req.raisedAt ? new Date(req.raisedAt) : new Date(0)
      });
    });

    // Sort by date descending
    list.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Default item if feed is empty
    if (list.length === 0) {
      list.push({
        title: 'Welcome onboard!',
        desc: 'Your RentEase tenant dashboard is setup and active.',
        time: 'Just Now',
        type: 'info',
        icon: 'sparkles',
        date: new Date()
      });
    }

    return list;
  }


  // Maps recently paid rents to chart payment history items.
  mapChartPayments(rents: Rent[]): ChartItem[] {
    const paidRents = rents.filter(r => r.status?.toLowerCase() === 'paid');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    let chartData = paidRents.slice(0, 5).reverse().map((r) => {
      const date = r.paidDate ? new Date(r.paidDate) : new Date();
      const amount = r.amount || 0;
      const maxVal = 100000;
      const percent = Math.min(Math.round((amount / maxVal) * 80), 80);
      return {
        month: months[date.getMonth()],
        amount,
        leaseName: r.leaseId ? `Lease Ref: #${r.leaseId.slice(-6).toUpperCase()}` : 'Standard Residential Lease',
        status: 'Paid',
        percent
      };
    });

    if (chartData.length === 0) {
      chartData = [
        { month: 'Jan', amount: 15000, leaseName: 'Apartment 4B - Green Glen (Lease #1142)', status: 'Paid', percent: 12 },
        { month: 'Feb', amount: 15000, leaseName: 'Apartment 4B - Green Glen (Lease #1142)', status: 'Paid', percent: 12 },
        { month: 'Mar', amount: 32000, leaseName: 'Premium 1BHK - Koramangala (Lease #2409)', status: 'Paid', percent: 26 },
        { month: 'Apr', amount: 45000, leaseName: 'Premium 1BHK - Koramangala (Lease #2409)', status: 'Paid', percent: 36 },
        { month: 'May', amount: 60000, leaseName: 'Luxury Villa - Indira Nagar (Lease #9952)', status: 'Paid', percent: 48 }
      ];
    }

    return chartData;
  }


  // Computes Bezier line and area path commands from chart items list.
  calculateChartPaths(chartData: ChartItem[]): { linePath: string; areaPath: string } {
    if (chartData.length === 0) {
      return { linePath: 'M 50 150 L 450 150', areaPath: 'M 50 150 L 450 150 L 450 150 L 50 150 Z' };
    }

    const x = [50, 150, 250, 350, 450];
    const y = chartData.map(c => 150 - (c.percent * 1.5));

    const linePath = `M ${x[0]} ${y[0]} ` +
      `C ${x[0] + 45} ${y[0]}, ${x[1] - 45} ${y[1]}, ${x[1]} ${y[1]} ` +
      `S ${x[2] - 45} ${y[2]}, ${x[2]} ${y[2]} ` +
      `S ${x[3] - 45} ${y[3]}, ${x[3]} ${y[3]} ` +
      `S ${x[4] - 45} ${y[4]}, ${x[4]} ${y[4]}`;

    const areaPath = `${linePath} L ${x[4]} 150 L ${x[0]} 150 Z`;

    return { linePath, areaPath };
  }


  // Resolves the most recent maintenance request status step.
  mapLatestMaintenanceStage(requests: MaintenanceRequest[]): { title: string; stage: number } {
    const sortedRequests = [...requests].sort((a, b) => new Date(b.raisedAt || '').getTime() - new Date(a.raisedAt || '').getTime());
    
    if (sortedRequests.length > 0) {
      const latestReq = sortedRequests[0];
      const title = latestReq.category || 'General Maintenance';
      const stat = latestReq.status?.toLowerCase();

      let stage = 0;
      if (stat === 'pending') {
        stage = 1;
      } else if (stat === 'in_progress') {
        stage = 3;
      } else if (stat === 'resolved') {
        stage = 4;
      } else {
        stage = 2;
      }
      return { title, stage };
    }
    return { title: 'No pending issues', stage: 0 };
  }
}