import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


export function moveInDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const selected = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 7); 

    if (selected < minDate) {
      return { moveInTooSoon: 'Move-in date must be at least 7 days from today.' };
    }
    return null;
  };
}


export function incomeVsRentValidator(rentAmount: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const income = Number(control.value);
    if (!income) return null;
    if (income < rentAmount * 2.5) {
      return { incomeTooLow: `Monthly income must be at least ₹${(rentAmount * 2.5).toLocaleString('en-IN')} for this property.` };
    }
    return null;
  };
}


export function occupancyLimitValidator(maxOccupants: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const count = Number(control.value);
    if (!count) return null;
    if (count > maxOccupants) {
      return { occupancyExceeded: `Maximum ${maxOccupants} occupants allowed for this unit.` };
    }
    return null;
  };
}


export function requiredDocumentsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const docs: string[] = control.value;
    if (!docs || docs.length === 0) {
      return { noDocuments: 'Please attach at least one supporting document.' };
    }
    return null;
  };
}


export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phone = control.value;
    if (!phone) return null;
    const valid = /^[6-9]\d{9}$/.test(phone);
    if (!valid) {
      return { invalidPhone: 'Enter a valid 10-digit Indian mobile number.' };
    }
    return null;
  };
}
