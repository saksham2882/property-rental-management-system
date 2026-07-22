import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestModalService {
  private showModalSource = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSource.asObservable();

  open(): void {
    this.showModalSource.next(true);
  }

  close(): void {
    this.showModalSource.next(false);
  }
}
