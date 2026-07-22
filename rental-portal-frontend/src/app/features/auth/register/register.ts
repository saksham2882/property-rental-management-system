import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../../shared/components/icon/icon';
import { selectAuthLoading, selectAuthError } from '../../../store/auth/auth.selectors';
import { register, loginAsGuest } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {

  private fb = inject(FormBuilder);
  private store = inject(Store);

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    role: ['customer', Validators.required],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    city: [''],
    preferredLocations: [''],
    budgetMin: [null],
    budgetMax: [null],
    emailAlerts: [true],
    smsAlerts: [false]
  }, { validators: this.passwordMatchValidator });

  
  ngOnInit(): void {
    this.updateStep3Validators(this.registerForm.get('role')?.value);
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateStep3Validators(role);
    });
  }


  updateStep3Validators(role: string): void {
    const city = this.registerForm.get('city');
    const locs = this.registerForm.get('preferredLocations');
    const budget = this.registerForm.get('budgetMax');

    if (role === 'customer') {
      city?.setValidators([Validators.required, Validators.minLength(3)]);
      locs?.setValidators([Validators.required, Validators.minLength(3)]);
      budget?.setValidators([Validators.required, Validators.min(10000)]);
    } 
    else {
      city?.clearValidators();
      locs?.clearValidators();
      budget?.clearValidators();
    }

    city?.updateValueAndValidity();
    locs?.updateValueAndValidity();
    budget?.updateValueAndValidity();
  }


  showPassword = false;
  showConfirmPassword = false;
  currentStep = 1;
  maxSteps = 3;

  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  togglePassword(): void { 
    this.showPassword = !this.showPassword; 
  }

  toggleConfirmPassword(): void { 
    this.showConfirmPassword = !this.showConfirmPassword; 
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      const email = this.registerForm.get('email');
      const pwd = this.registerForm.get('password');
      const confirmPwd = this.registerForm.get('confirmPassword');
      const role = this.registerForm.get('role');

      email?.markAsTouched();
      pwd?.markAsTouched();
      confirmPwd?.markAsTouched();
      role?.markAsTouched();

      if (email?.invalid || pwd?.invalid || confirmPwd?.invalid || this.registerForm.hasError('mismatch')) {
        return;
      }
    }

    if (this.currentStep === 2) {
      const name = this.registerForm.get('name');
      const phone = this.registerForm.get('phone');

      name?.markAsTouched();
      phone?.markAsTouched();

      if (name?.invalid || phone?.invalid) {
        return;
      }
    }

    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }


  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }


  onSubmit(): void {
    if (this.registerForm.invalid || this.registerForm.hasError('mismatch')) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const formValues = this.registerForm.value;
    const preferredLocations = formValues.preferredLocations
      ? formValues.preferredLocations.split(',').map((loc: string) => loc.trim()).filter((loc: string) => loc)
      : [];

    const userData = {
      ...formValues,
      preferredLocations,
      budgetMin: formValues.budgetMin || 0,
      budgetMax: formValues.budgetMax || 10000000
    };
    
    delete userData.confirmPassword;
    this.store.dispatch(register({ userData }));
  }

  onGuestLogin(role: string): void {
    this.store.dispatch(loginAsGuest({ role }));
  }
}