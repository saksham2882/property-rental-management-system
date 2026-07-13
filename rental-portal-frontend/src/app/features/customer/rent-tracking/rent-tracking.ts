import { Component, OnInit, OnDestroy, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectAllRents, selectRentLoading } from '../../../store/rent/rent.selectors';
import { loadRents, verifyPayment } from '../../../store/rent/rent.actions';
import { selectAllLeases } from '../../../store/leases/leases.selectors';
import { loadLeases } from '../../../store/leases/leases.actions';
import { selectAllProperties } from '../../../store/properties/properties.selectors';
import { loadProperties } from '../../../store/properties/properties.actions';
import { RentService } from '../../../core/services/rent-service';
import { ToastService } from '../../../core/services/toast-service';
import { Rent } from '../../../core/models/rent-model';
import { Lease } from '../../../core/models/lease-model';
import { Property } from '../../../core/models/property-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { RentSummaryComponent } from './components/rent-summary/rent-summary';
import { RentCardComponent } from './components/rent-card/rent-card';
import { RentLeaseCardComponent } from './components/lease-card/lease-card';
import { IconComponent } from '../../../shared/components/icon/icon';
import { PriceFormatPipe } from '../../../shared/pipes/price-format-pipe';

declare var Razorpay: any;

@Component({
  selector: 'app-rent-tracking',
  imports: [ CommonModule, LoadingSpinnerComponent, EmptyStateComponent, RentSummaryComponent, RentCardComponent, RentLeaseCardComponent, IconComponent, PriceFormatPipe ],
  templateUrl: './rent-tracking.html',
  styleUrl: './rent-tracking.css'
})
export class RentTracking implements OnInit, OnDestroy {

  private store = inject(Store);
  private rentService = inject(RentService);
  private toast = inject(ToastService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);
  rents$ = this.store.select(selectAllRents);
  leases$ = this.store.select(selectAllLeases);
  properties$ = this.store.select(selectAllProperties);
  loading$ = this.store.select(selectRentLoading);

  userId = '';
  myRents: Rent[] = [];
  activeLeases: Lease[] = [];
  propertiesMap = new Map<string, Property>();
  selectedLeaseId: string | null = null;
  payingRentId: string | null = null;

  totalPendingAmount = 0;
  pendingBillsCount = 0;
  nextDueDate: Date | null = null;


  ngOnInit(): void {
    this.store.dispatch(loadProperties({}));

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.store.dispatch(loadRents({ tenantId: user.id }));
        this.store.dispatch(loadLeases({ tenantId: user.id }));
      }
    });

    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(props => {
      props.forEach(p => this.propertiesMap.set(p.id, p));
    });

    // Combine route parameters with rents & leases state to resolve the selected view state
    combineLatest([this.route.params, this.leases$, this.rents$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, leases, rents]) => {
        this.myRents = rents || [];
        this.processActiveLeases(leases || [], rents || []);

        const leaseId = params['leaseId'];
        if (leaseId) {
          this.selectedLeaseId = leaseId;
          this.updateSelectedLeaseMetrics();
        } 
        else {
          this.selectedLeaseId = null;
        }
      });

    this.loadRazorpayScript();
  }


  processActiveLeases(leases: Lease[], rents: Rent[]): void {
    const active = leases.filter(l => l.status === 'active');

    this.activeLeases = [...active].sort((a, b) => {
      const rentsA = rents.filter(r => r.leaseId === a.id);
      const rentsB = rents.filter(r => r.leaseId === b.id);

      const unpaidA = rentsA.filter(r => r.status !== 'paid');
      const unpaidB = rentsB.filter(r => r.status !== 'paid');

      const hasUnpaidA = unpaidA.length > 0;
      const hasUnpaidB = unpaidB.length > 0;

      // 1. Unpaid/pending/late leases first
      if (hasUnpaidA && !hasUnpaidB) return -1;
      if (!hasUnpaidA && hasUnpaidB) return 1;

      if (hasUnpaidA && hasUnpaidB) {
        const now = new Date().getTime();
        const hasOverdueA = unpaidA.some(r => r.dueDate && new Date(r.dueDate).getTime() < now);
        const hasOverdueB = unpaidB.some(r => r.dueDate && new Date(r.dueDate).getTime() < now);

        // 2. Overdue/late leases first
        if (hasOverdueA && !hasOverdueB) return -1;
        if (!hasOverdueA && hasOverdueB) return 1;

        // 3. Sort by earliest due date
        const dateA = unpaidA.map(r => r.dueDate ? new Date(r.dueDate).getTime() : Infinity).sort((x, y) => x - y)[0];
        const dateB = unpaidB.map(r => r.dueDate ? new Date(r.dueDate).getTime() : Infinity).sort((x, y) => x - y)[0];
        return dateA - dateB;
      }

      // 4. Default: newest created leases first
      const timeA = new Date(a.createdAt || a.startDate).getTime();
      const timeB = new Date(b.createdAt || b.startDate).getTime();
      return timeB - timeA;
    });

    this.cdr.detectChanges();
  }


  getPropertyDetails(propertyId: string): Property | undefined {
    return this.propertiesMap.get(propertyId);
  }


  getUnpaidCount(leaseId: string): number {
    return this.myRents.filter(r => r.leaseId === leaseId && r.status !== 'paid').length;
  }


  getUnpaidAmount(leaseId: string): number {
    return this.myRents.filter(r => r.leaseId === leaseId && r.status !== 'paid')
                       .reduce((sum, r) => sum + (r.amount || 0), 0);
  }


  getNextDueDateForLease(leaseId: string): string | null {
    const unpaid = this.myRents.filter(r => r.leaseId === leaseId && r.status !== 'paid')
                             .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime());
    return unpaid.length > 0 ? unpaid[0].dueDate : null;
  }


  selectLease(leaseId: string): void {
    this.router.navigate(['/customer/rent', leaseId]);
  }


  deselectLease(): void {
    this.router.navigate(['/customer/rent']);
  }


  private updateSelectedLeaseMetrics(): void {
    if (!this.selectedLeaseId) return;
    const leaseRents = this.selectedLeaseRents;
    const unpaid = leaseRents.filter(r => r.status !== 'paid');

    this.totalPendingAmount = unpaid.reduce((sum, r) => sum + (r.amount || 0), 0);
    this.pendingBillsCount = unpaid.length;

    if (unpaid.length > 0) {
      const sortedUnpaid = [...unpaid].sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime());
      this.nextDueDate = sortedUnpaid[0].dueDate ? new Date(sortedUnpaid[0].dueDate) : null;
    } 
    else {
      this.nextDueDate = null;
    }
    this.cdr.detectChanges();
  }


  get selectedLease(): Lease | undefined {
    return this.activeLeases.find(l => l.id === this.selectedLeaseId);
  }


  get selectedLeaseRents(): Rent[] {
    if (!this.selectedLeaseId) return [];
    return this.myRents.filter(r => r.leaseId === this.selectedLeaseId).sort((a, b) => {
      const aUnpaid = a.status !== 'paid';
      const bUnpaid = b.status !== 'paid';
      if (aUnpaid && !bUnpaid) return -1;
      if (!aUnpaid && bUnpaid) return 1;

      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return dateB - dateA;
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  loadRazorpayScript(): void {
    if (typeof Razorpay !== 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }


  payRent(rent: Rent): void {
    this.payingRentId = rent.id;
    this.cdr.detectChanges();

    // Initiate Razorpay checkout order from backend
    this.rentService.initiateOrder(rent.id).subscribe({
      next: (order) => {
        this.openRazorpayModal(order, rent);
      },
      error: () => {
        this.toast.error('Failed to initiate Razorpay checkout order.');
        this.payingRentId = null;
        this.cdr.detectChanges();
      }
    });
  }


  openRazorpayModal(order: any, rent: Rent): void {
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'RentEase Portal',
      description: `Rent payment for ${rent.month}`,
      order_id: order.razorpayOrderId,
      handler: (response: any) => {
        this.zone.run(() => {
          const verifyPayload = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          };

          this.toast.info('Verifying checkout transaction...');
          // Dispatch verify action to store
          this.store.dispatch(verifyPayment({ id: rent.id, payload: verifyPayload }));
          this.payingRentId = null;
          this.cdr.detectChanges();
        });
      },
      prefill: {
        name: this.userId,
        email: ''
      },
      theme: {
        color: '#0d9488'
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.toast.info('Payment checkout dismissed.');
            this.payingRentId = null;
            this.cdr.detectChanges();
          });
        }
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  }


  downloadReceipt(rentId: string): void {
    this.toast.info('Generating invoice PDF...');
    this.rentService.downloadInvoice(rentId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Receipt_${rentId}.pdf`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.toast.success('Invoice receipt PDF downloaded.');
      },
      error: () => {
        this.toast.error('Failed to generate invoice receipt PDF.');
      }
    });
  }
}