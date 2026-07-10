import { IconComponent } from '../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectSelectedProperty, selectPropertyReviews, selectPropertiesLoading } from '../../../store/properties/properties.selectors';
import { selectCurrentUser } from '../../../store/auth/auth.selectors';
import { selectAllApplications } from '../../../store/applications/applications.selectors';
import { loadPropertyById, loadReviews, addReview } from '../../../store/properties/properties.actions';
import { loadApplications } from '../../../store/applications/applications.actions';
import { User } from '../../../core/models/user-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { PropertyGalleryComponent } from './components/property-gallery/property-gallery';
import { PropertyReviewsComponent } from './components/property-reviews/property-reviews';
import { PropertySidebarComponent } from './components/property-sidebar/property-sidebar';

@Component({
  selector: 'app-property-detail',
  imports: [
    CommonModule,
    RouterLink,
    IconComponent,
    LoadingSpinnerComponent,
    PropertyGalleryComponent,
    PropertyReviewsComponent,
    PropertySidebarComponent
  ],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  property$ = this.store.select(selectSelectedProperty);
  reviews$ = this.store.select(selectPropertyReviews);
  loading$ = this.store.select(selectPropertiesLoading);
  currentUser$ = this.store.select(selectCurrentUser);
  applications$ = this.store.select(selectAllApplications);

  propertyId = '';
  currentUser: User | null = null;
  hasAlreadyApplied = false;

  allReviews: any[] = [];
  private applicationsLoaded = false;

  
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.propertyId = params['id'];
      if (this.propertyId) {
        this.store.dispatch(loadPropertyById({ id: this.propertyId }));
        this.store.dispatch(loadReviews({ propertyId: this.propertyId }));
      }
    });

    // Check if user has already applied for this property
    combineLatest([this.currentUser$, this.applications$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([user, apps]) => {
        this.currentUser = user;
        if (user) {
          // Trigger loading of customer's applications if not loaded yet (only dispatch once)
          if (!this.applicationsLoaded && (apps.length === 0 || !apps.some(a => a.customerId === user.id))) {
            this.applicationsLoaded = true;
            this.store.dispatch(loadApplications({ customerId: user.id }));
          }
          this.hasAlreadyApplied = apps.some(app => app.propertyId === this.propertyId && app.customerId === user.id);
        }
      });

    // Populate reviews local copy
    this.reviews$.pipe(takeUntil(this.destroy$)).subscribe(revs => {
      this.allReviews = revs || [];
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPostReview(event: { rating: number, comment: string }): void {
    if (!this.currentUser) return;
    const reviewPayload = {
      userId: this.currentUser.id,
      userName: this.currentUser.name || 'Verified Tenant',
      rating: event.rating,
      comment: event.comment
    };
    this.store.dispatch(addReview({ propertyId: this.propertyId, review: reviewPayload }));
  }
}
