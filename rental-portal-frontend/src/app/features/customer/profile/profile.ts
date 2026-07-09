import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectCurrentUser, selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';
import { updateProfile } from '../../../store/auth/auth.actions';
import { User } from '../../../core/models/user-model';
import { ProfileSummaryComponent } from './components/profile-summary/profile-summary';
import { ProfileFormComponent } from './components/profile-form/profile-form';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ProfileSummaryComponent, ProfileFormComponent, IconComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private fb = inject(FormBuilder);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  currentUser$ = this.store.select(selectCurrentUser);
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  userId = '';
  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern('^[0-9]{10}$')]],
    city: [''],
    preferredLocations: [''],
    budgetMin: [null],
    budgetMax: [null],
    emailAlerts: [true],
    smsAlerts: [false]
  });

  
  ngOnInit(): void {
    this.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.userId = user.id;
        const locationsStr = user.preferredLocations ? user.preferredLocations.join(', ') : '';
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          city: user.city || '',
          preferredLocations: locationsStr,
          budgetMin: user.budgetMin || null,
          budgetMax: user.budgetMax || null,
          emailAlerts: user.emailAlerts !== undefined ? user.emailAlerts : true,
          smsAlerts: user.smsAlerts !== undefined ? user.smsAlerts : false
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formValues = this.profileForm.value;
    const preferredLocations = formValues.preferredLocations
      ? formValues.preferredLocations.split(',').map((loc: string) => loc.trim()).filter((loc: string) => loc)
      : [];

    const updatedData: Partial<User> = {
      name: formValues.name,
      phone: formValues.phone,
      city: formValues.city,
      preferredLocations,
      budgetMin: formValues.budgetMin || 0,
      budgetMax: formValues.budgetMax || 1000000,
      emailAlerts: formValues.emailAlerts,
      smsAlerts: formValues.smsAlerts
    };

    this.store.dispatch(updateProfile({ userId: this.userId, data: updatedData }));
  }
}
