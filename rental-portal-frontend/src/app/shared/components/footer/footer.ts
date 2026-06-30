import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { IconComponent } from '../icon/icon';
import { selectIsLoggedIn, selectIsAdmin, selectIsCustomer } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  
  private store = inject(Store);
  
  currentYear = new Date().getFullYear();
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  isAdmin$ = this.store.select(selectIsAdmin);
  isCustomer$ = this.store.select(selectIsCustomer);
}
