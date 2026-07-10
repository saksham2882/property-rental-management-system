import { IconComponent } from '../../../../shared/components/icon/icon';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { selectCurrentUser } from '../../../../store/auth/auth.selectors';
import { selectSelectedProperty, selectPropertiesLoading } from '../../../../store/properties/properties.selectors';
import { loadPropertyById } from '../../../../store/properties/properties.actions';
import { submitApplication } from '../../../../store/applications/applications.actions';
import { UploadService } from '../../../../core/services/upload-service';
import { ToastService } from '../../../../core/services/toast-service';
import { PriceFormatPipe } from '../../../../shared/pipes/price-format-pipe';
import { Property } from '../../../../core/models/property-model';
import { User } from '../../../../core/models/user-model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner';
import { PendingChanges } from '../../../../core/guards/unsaved-changes-guard';
import { ApplyPropertyPreviewComponent } from './components/apply-property-preview/apply-property-preview';
import { phoneValidator, moveInDateValidator, incomeVsRentValidator, occupancyLimitValidator, requiredDocumentsValidator } from '../../../../shared/validators/rental-validators';

@Component({
  selector: 'app-apply',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, PriceFormatPipe, LoadingSpinnerComponent, ApplyPropertyPreviewComponent],
  templateUrl: './application-apply.html',
  styleUrl: './application-apply.css'
})
export class ApplyComponent implements OnInit, OnDestroy, PendingChanges {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private uploadService = inject(UploadService);
  private toast = inject(ToastService);
  private destroy$ = new Subject<void>();

  property$ = this.store.select(selectSelectedProperty).pipe(delay(0));
  loading$ = this.store.select(selectPropertiesLoading).pipe(delay(0));
  currentUser$ = this.store.select(selectCurrentUser).pipe(delay(0));

  propertyId = '';
  currentUser: User | null = null;
  property: Property | null = null;

  activeStep = 1;
  uploadedDocuments: string[] = [];
  uploadingFile = false;
  private formSubmitted = false;


  applyForm: FormGroup = this.fb.group({
    applicantName: ['', Validators.required],
    applicantEmail: ['', [Validators.required, Validators.email]],
    applicantPhone: ['', [Validators.required, phoneValidator()]],
    moveInDate: ['', [Validators.required, moveInDateValidator()]],
    monthlyIncome: [null, [Validators.required, Validators.min(1)]],
    occupants: [1, [Validators.required, Validators.min(1)]],
    message: [''],
    documents: [[], requiredDocumentsValidator()]
  });


  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.propertyId = params['propertyId'];
      if (this.propertyId) {
        this.store.dispatch(loadPropertyById({ id: this.propertyId }));
      }
    });

    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.applyForm.patchValue({
          applicantName: user.name,
          applicantEmail: user.email,
          applicantPhone: user.phone || ''
        });
      }
    });

    this.property$.pipe(takeUntil(this.destroy$)).subscribe(prop => {
      this.property = prop;
      if (prop) {
        this.applyForm.get('monthlyIncome')?.setValidators([
          Validators.required,
          Validators.min(1),
          incomeVsRentValidator(prop.rent)
        ]);
        this.applyForm.get('occupants')?.setValidators([
          Validators.required,
          Validators.min(1),
          occupancyLimitValidator((prop.bedrooms || 1) * 2)
        ]);
        this.applyForm.get('monthlyIncome')?.updateValueAndValidity();
        this.applyForm.get('occupants')?.updateValueAndValidity();
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  nextStep(): void {
    if (this.activeStep === 1) {
      const name = this.applyForm.get('applicantName');
      const email = this.applyForm.get('applicantEmail');
      const phone = this.applyForm.get('applicantPhone');

      if (name?.invalid || email?.invalid || phone?.invalid) {
        name?.markAsTouched();
        email?.markAsTouched();
        phone?.markAsTouched();
        return;
      }
    } 
    else if (this.activeStep === 2) {
      const date = this.applyForm.get('moveInDate');
      const income = this.applyForm.get('monthlyIncome');
      const occupants = this.applyForm.get('occupants');

      if (date?.invalid || income?.invalid || occupants?.invalid) {
        date?.markAsTouched();
        income?.markAsTouched();
        occupants?.markAsTouched();
        return;
      }
    } 
    else if (this.activeStep === 3) {
      const docs = this.applyForm.get('documents');
      if (docs?.invalid) {
        docs.markAsTouched();
        this.toast.error('Please upload at least one identification document.');
        return;
      }
    }
    this.activeStep++;
  }


  prevStep(): void {
    this.activeStep--;
  }


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.uploadingFile = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.uploadedDocuments.push(res.url);
        this.applyForm.patchValue({ documents: this.uploadedDocuments });
        this.applyForm.get('documents')?.markAsDirty();
        this.applyForm.get('documents')?.updateValueAndValidity();

        this.toast.success('Document uploaded successfully!');
        this.uploadingFile = false;
      },
      error: () => {
        this.toast.error('Failed to upload document.');
        this.uploadingFile = false;
      }
    });
  }


  removeDocument(index: number): void {
    this.uploadedDocuments.splice(index, 1);
    this.applyForm.patchValue({ documents: this.uploadedDocuments });
    this.applyForm.get('documents')?.markAsDirty();
    this.applyForm.get('documents')?.updateValueAndValidity();
  }


  onSubmit(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    this.formSubmitted = true;
    const applicationPayload = {
      ...this.applyForm.value,
      propertyId: this.propertyId,
      customerId: this.currentUser?.id || '',
      documents: this.uploadedDocuments,
      status: 'under_review'
    };

    this.store.dispatch(submitApplication({ application: applicationPayload }));
    this.router.navigate(['/customer/applications']);
  }
  

  hasUnsavedChanges(): boolean {
    return this.applyForm.dirty && !this.formSubmitted;
  }
}