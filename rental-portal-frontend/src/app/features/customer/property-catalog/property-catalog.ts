import { IconComponent } from '../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectAllProperties, selectPropertiesLoading } from '../../../store/properties/properties.selectors';
import { selectUserWishlist } from '../../../store/auth/auth.selectors';
import { loadProperties } from '../../../store/properties/properties.actions';
import { addToWishlist, removeFromWishlist } from '../../../store/auth/auth.actions';
import { Property, PropertyFilter } from '../../../core/models/property-model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { CatalogFiltersComponent } from './components/catalog-filters/catalog-filters';
import { PropertyCardComponent } from './components/property-card/property-card';

@Component({
  selector: 'app-property-catalog',
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    CatalogFiltersComponent,
    PropertyCardComponent
  ],
  templateUrl: './property-catalog.html',
  styleUrl: './property-catalog.css'
})
export class PropertyCatalogComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  properties$ = this.store.select(selectAllProperties);
  loading$ = this.store.select(selectPropertiesLoading);
  wishlist$ = this.store.select(selectUserWishlist);

  search = '';
  city = '';
  type = '';
  furnishing = '';
  bedrooms: number | null = null;
  minRent: number | null = null;
  maxRent: number | null = null;
  minArea: number | null = null;
  maxArea: number | null = null;
  available: boolean | null = null;
  favoritesOnly = false;

  isGridView = true;
  showMobileFilters = false;
  userWishlist: string[] = [];
  filteredProperties: Property[] = [];

  currentPage = 1;
  pageSize = 9;


  cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Noida', label: 'Noida' },
    { value: 'Gurgaon', label: 'Gurgaon' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Jaipur', label: 'Jaipur' }
  ];

  typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Independent House', label: 'Independent House' }
  ];

  furnishingOptions = [
    { value: '', label: 'All Furnishings' },
    { value: 'Fully-Furnished', label: 'Fully-Furnished' },
    { value: 'Semi-Furnished', label: 'Semi-Furnished' },
    { value: 'Unfurnished', label: 'Unfurnished' }
  ];

  bedroomOptions = [
    { value: null, label: 'Any Bedrooms' },
    { value: 1, label: '1 BHK' },
    { value: 2, label: '2 BHK' },
    { value: 3, label: '3 BHK' },
    { value: 4, label: '4 BHK' }
  ];

  availabilityOptions = [
    { value: null, label: 'Any Status' },
    { value: true, label: 'Available Only' },
    { value: false, label: 'Occupied' }
  ];


  ngOnInit(): void {
    // Read route query parameters (from landing search)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.search = params['search'] || '';
      this.city = params['city'] || '';
      this.type = params['type'] || '';
      this.applyFilters();
    });

    // Sub to wishlist updates
    this.wishlist$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.userWishlist = list || [];
      this.processFiltering();
    });

    // Sub to loaded properties
    combineLatest([this.properties$, this.wishlist$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.processFiltering();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRentChange(): void {
    if (this.minRent !== null && this.minRent < 0) this.minRent = 0;
    if (this.maxRent !== null && this.maxRent < 0) this.maxRent = 0;
    this.applyFilters();
  }

  onAreaChange(): void {
    if (this.minArea !== null && this.minArea < 0) this.minArea = 0;
    if (this.maxArea !== null && this.maxArea < 0) this.maxArea = 0;
    this.processFiltering();
  }

  applyFilters(): void {
    this.currentPage = 1;
    const filters: PropertyFilter = {
      search: this.search || undefined,
      city: this.city || undefined,
      type: this.type || undefined,
      furnishing: this.furnishing || undefined,
      bedrooms: this.bedrooms !== null ? this.bedrooms : undefined,
      minRent: this.minRent || undefined,
      maxRent: this.maxRent || undefined,
      available: this.available !== null ? this.available : undefined
    };
    this.store.dispatch(loadProperties({ filters }));
  }

  resetFilters(): void {
    this.search = '';
    this.city = '';
    this.type = '';
    this.furnishing = '';
    this.bedrooms = null;
    this.minRent = null;
    this.maxRent = null;
    this.minArea = null;
    this.maxArea = null;
    this.available = null;
    this.favoritesOnly = false;
    this.applyFilters();
  }

  toggleView(gridView: boolean): void {
    this.isGridView = gridView;
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  toggleFavorite(propertyId: string, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.userWishlist.includes(propertyId)) {
      this.store.dispatch(removeFromWishlist({ propertyId }));
    } else {
      this.store.dispatch(addToWishlist({ propertyId }));
    }
  }

  processFiltering(): void {
    this.currentPage = 1;
    this.properties$.pipe(takeUntil(this.destroy$)).subscribe(props => {
      let result = props || [];
      if (this.favoritesOnly) {
        result = result.filter(p => this.userWishlist.includes(p.id));
      }
      
      result = [...result].sort((a, b) => {
        const dateA = a.postedAt || '';
        const dateB = b.postedAt || '';
        return dateB.localeCompare(dateA);
      });
      
      if (this.minArea !== null) {
        result = result.filter(p => p.area >= (this.minArea || 0));
      }
      if (this.maxArea !== null) {
        result = result.filter(p => p.area <= (this.maxArea || 99999));
      }
      this.filteredProperties = result;
    });
  }


  get totalPages(): number {
    return Math.ceil(this.filteredProperties.length / this.pageSize) || 1;
  }

  get paginatedProperties(): Property[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProperties.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    const list: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      list.push(i);
    }
    return list;
  }

  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.scrollToTop();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.scrollToTop();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
