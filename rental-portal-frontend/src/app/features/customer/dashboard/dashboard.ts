import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectAllLeases } from '../../../store/leases/leases.selectors';
import { selectAllApplications } from '../../../store/applications/applications.selectors';
import { selectAllRents } from '../../../store/rent/rent.selectors';
import { selectAllProperties } from '../../../store/properties/properties.selectors';
import { selectAllMaintenanceRequests } from '../../../store/maintenance/maintenance.selectors';
import { loadLeases } from '../../../store/leases/leases.actions';
import { loadApplications } from '../../../store/applications/applications.actions';
import { loadRents } from '../../../store/rent/rent.actions';
import { loadProperties } from '../../../store/properties/properties.actions';
import { loadMaintenanceRequests } from '../../../store/maintenance/maintenance.actions';
import { User } from '../../../core/models/user-model';
import { Property } from '../../../core/models/property-model';

import { WelcomeBannerComponent } from './components/welcome-banner/welcome-banner';
import { StatsCardsComponent } from './components/stats-cards/stats-cards';
import { AnalyticsSectionComponent } from './components/analytics-section/analytics-section';
import { UtilityPanelsComponent } from './components/utility-panels/utility-panels';
import { EmergencyContactsComponent } from './components/emergency-contacts/emergency-contacts';
import { DashboardActiveLeasesComponent } from './components/dashboard-active-leases/dashboard-active-leases';
import { DashboardRecentEventsComponent } from './components/dashboard-recent-events/dashboard-recent-events';
import { DashboardSavedPropertiesComponent } from './components/dashboard-saved-properties/dashboard-saved-properties';
import { DashboardService, ActivityItem, ChartItem } from './services/dashboard-service';


@Component({
  selector: 'app-dashboard',
  imports: [ CommonModule, WelcomeBannerComponent, StatsCardsComponent, AnalyticsSectionComponent, UtilityPanelsComponent, EmergencyContactsComponent, DashboardActiveLeasesComponent, DashboardRecentEventsComponent, DashboardSavedPropertiesComponent ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  private store = inject(Store);
  private dashboardService = inject(DashboardService);
  private destroy$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);
  leases$ = this.store.select(selectAllLeases);
  applications$ = this.store.select(selectAllApplications);
  rents$ = this.store.select(selectAllRents);
  allProperties$ = this.store.select(selectAllProperties);
  maintenanceRequests$ = this.store.select(selectAllMaintenanceRequests);

  currentUser: User | null = null;
  wishlistedProperties: Property[] = [];
  allPropertiesList: Property[] = [];

  // Live calculated metrics signals
  stats = signal<{
    activeLeasesCount: number;
    pendingRentAmount: number;
    pendingRequestsCount: number;
    activeApplicationsCount: number;
  }>({
    activeLeasesCount: 0,
    pendingRentAmount: 0,
    pendingRequestsCount: 0,
    activeApplicationsCount: 0
  });

  // Lease progress signals
  leaseProgress = signal<number>(0);
  daysRemaining = signal<number>(0);
  nextDueDate = signal<string>('No outstanding bills');
  nextRentAmount = signal<number>(0);
  activeLeaseTitle = signal<string>('No Active Lease');
  recentActivities = signal<ActivityItem[]>([]);

  // Chart data signals
  chartPayments = signal<ChartItem[]>([]);
  chartLinePath = signal<string>('M 50 150 L 450 150');
  chartAreaPath = signal<string>('M 50 150 L 450 150 L 450 150 L 50 150 Z');

  // Roommate Split signals
  activeLeasesList = signal<any[]>([]);
  selectedLeaseId = signal<string>('');
  selectedLeaseRent = signal<number>(15000);
  selectedLeaseBedrooms = signal<number>(2);
  roommateCount = signal<number>(2);
  calculatedShare = signal<number>(0);

  // Maintenance Tracker Stage signals
  latestRequestTitle = signal<string>('No pending issues');
  latestRequestStage = signal<number>(0);

  // Next Payment Countdown Ring signals
  paymentCountdownPercent = signal<number>(0);


  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.store.dispatch(loadLeases({ tenantId: user.id }));
        this.store.dispatch(loadApplications({ customerId: user.id }));
        this.store.dispatch(loadRents({ tenantId: user.id }));
        this.store.dispatch(loadMaintenanceRequests({ tenantId: user.id }));
      }
    });

    combineLatest([this.allProperties$, this.currentUser$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([properties, user]) => {
        this.allPropertiesList = properties || [];
        if (properties && user && user.wishlist) {
          const wishlist = user.wishlist || [];
          this.wishlistedProperties = properties
            .filter(p => wishlist.includes(p.id))
            .sort((a, b) => wishlist.indexOf(b.id) - wishlist.indexOf(a.id));
        } 
        else {
          this.wishlistedProperties = [];
        }
      });

    // Compute live stats and metrics using DashboardService
    combineLatest([
      this.leases$,
      this.rents$,
      this.applications$,
      this.maintenanceRequests$,
      this.allProperties$
    ]).pipe(takeUntil(this.destroy$))
      .subscribe(([leases, rents, applications, requests, properties]) => {
        const activeLeases = [...leases]
          .filter(l => l.status?.toLowerCase() === 'active' || l.status?.toLowerCase() === 'signed')
          .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        this.activeLeasesList.set(activeLeases);

        // Pre-select first lease roommate metrics
        if (activeLeases.length > 0 && !this.selectedLeaseId()) {
          const firstLease = activeLeases[0];
          this.selectedLeaseId.set(firstLease.id);
          const rent = firstLease.monthlyRent || 15000;
          this.selectedLeaseRent.set(rent);

          const prop = properties.find(p => p.id === firstLease.propertyId);
          const beds = prop?.bedrooms || 2;
          this.selectedLeaseBedrooms.set(beds);
          this.roommateCount.set(beds);
          this.calculatedShare.set(Math.round(rent / beds));
        }

        const activeLeasesCount = activeLeases.length;
        const activeLease = activeLeases.length > 0 ? activeLeases[0] : null;

        const activeLeaseIds = activeLeases.map(l => l.id);
        const pendingRents = rents.filter(r => activeLeaseIds.includes(r.leaseId) && 
          (r.status?.toLowerCase() === 'unpaid' || r.status?.toLowerCase() === 'pending' || r.status?.toLowerCase() === 'overdue'));


        let pendingRentAmount = 0;
        if (pendingRents.length > 0) {
          const sorted = [...pendingRents].sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime());
          pendingRentAmount = sorted[0].amount || 0;
        }

        const pendingRequestsCount = requests.filter(req => req.status?.toLowerCase() !== 'resolved').length;
        const activeApplicationsCount = applications.filter(app => app.status?.toLowerCase() === 'under_review' || app.status?.toLowerCase() === 'waitlisted').length;

        this.stats.set({
          activeLeasesCount,
          pendingRentAmount,
          pendingRequestsCount,
          activeApplicationsCount
        });

        // 1. Calculate lease progress
        this.activeLeaseTitle.set(activeLease ? (activeLease.propertyTitle || 'Residential Unit') : 'No Active Lease');
        
        const leaseProgInfo = this.dashboardService.calculateLeaseProgress(activeLease);
        this.leaseProgress.set(leaseProgInfo.progress);
        this.daysRemaining.set(leaseProgInfo.daysRemaining);

        // 2. Next Rent bill
        const nextBillInfo = this.dashboardService.determineNextRentBill(pendingRents);
        this.nextRentAmount.set(nextBillInfo.amount);
        this.nextDueDate.set(nextBillInfo.dueDate);
        this.paymentCountdownPercent.set(nextBillInfo.countdownPercent);

        // 3. Compile activities feed
        const activities = this.dashboardService.compileRecentActivities(pendingRents, applications, requests, properties);
        this.recentActivities.set(activities);

        // 4. Map Chart payments
        const chartData = this.dashboardService.mapChartPayments(rents);
        this.chartPayments.set(chartData);

        // 5. SVG paths calculations
        const paths = this.dashboardService.calculateChartPaths(chartData);
        this.chartLinePath.set(paths.linePath);
        this.chartAreaPath.set(paths.areaPath);

        // 6. Maintenance Tracker stages mapping
        const maintStageInfo = this.dashboardService.mapLatestMaintenanceStage(requests);
        this.latestRequestTitle.set(maintStageInfo.title);
        this.latestRequestStage.set(maintStageInfo.stage);
      });
  }


  // Roommate lease selector dropdown handler
  onLeaseChange(leaseId: string): void {
    this.selectedLeaseId.set(leaseId);

    this.leases$.pipe(take(1)).subscribe(leases => {
      const lease = leases.find(l => l.id === leaseId);
      if (lease) {
        const rent = lease.monthlyRent || 15000;
        this.selectedLeaseRent.set(rent);

        const prop = this.wishlistedProperties.concat(this.allPropertiesList).find(p => p.id === lease.propertyId);
        const beds = prop?.bedrooms || 2;
        this.selectedLeaseBedrooms.set(beds);
        this.roommateCount.set(beds);
        this.calculatedShare.set(Math.round(rent / beds));
      }
    });
  }

  
  // Roommate quantity adjuster
  onRoommatesChange(count: number): void {
    this.roommateCount.set(count);
    const rent = this.selectedLeaseRent();
    this.calculatedShare.set(Math.round(rent / count));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}