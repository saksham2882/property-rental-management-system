import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject, interval, of } from 'rxjs';
import { catchError, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { AnalyticsService } from '../../../core/services/analytics-service';
import { AdminWelcomeBannerComponent } from './components/welcome-banner/welcome-banner';
import { StatsRowComponent, DashboardStats } from './components/stats-row/stats-row';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart';
import { MaintenanceOverviewComponent } from './components/maintenance-overview/maintenance-overview';
import { AdminQuickActionsComponent } from './components/quick-actions/quick-actions';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ CommonModule, AdminWelcomeBannerComponent, StatsRowComponent, RevenueChartComponent, MaintenanceOverviewComponent, AdminQuickActionsComponent ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit, OnDestroy {

  private store = inject(Store);
  private analyticsService = inject(AnalyticsService);
  private destroy$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);


  stats = signal<DashboardStats>({
    totalProperties: 0,
    occupiedProperties: 0,
    availableProperties: 0,
    totalRevenue: 0,
    maintenanceOpen: 0,
    activeTenants: 0,
    pendingApplications: 0
  });

  monthlyRevenue = signal<Record<string, number>>({});
  maintenanceStatus = signal<Record<string, number>>({});


  ngOnInit(): void {
    interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.analyticsService.getAdminStats().pipe(catchError(() => of(null)))),
        takeUntil(this.destroy$)
      )
      .subscribe(analytics => {
        if (!analytics) return;
        const mStatus: Record<string, number> = analytics?.maintenanceStatus ?? {};
        const totalProps = analytics?.totalProperties ?? 0;
        const occupiedProps = analytics?.occupiedProperties ?? 0;

        this.stats.set({
          totalProperties: totalProps,
          occupiedProperties: occupiedProps,
          availableProperties: analytics?.availableProperties ?? Math.max(0, totalProps - occupiedProps),
          totalRevenue: analytics?.totalRevenue ?? 0,
          maintenanceOpen: analytics?.maintenanceOpen ?? mStatus['pending'] ?? mStatus['Open'] ?? 0,
          activeTenants: analytics?.activeTenants ?? 0,
          pendingApplications: analytics?.pendingApplications ?? 0
        });

        this.monthlyRevenue.set(analytics?.monthlyRevenue ?? {});
        this.maintenanceStatus.set(mStatus);
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}