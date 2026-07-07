import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../../shared/components/icon/icon';
import { EmptyStateComponent } from '../../../../../shared/components/empty-state/empty-state';
import { User } from '../../../../../core/models/user-model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-property-reviews',
  imports: [CommonModule, FormsModule, IconComponent, EmptyStateComponent, RouterLink],
  templateUrl: './property-reviews.html',
  styleUrl: './property-reviews.css'
})
export class PropertyReviewsComponent {

  @Input() reviews: any[] = [];
  @Input() currentUser: User | null = null;
  @Output() postReview = new EventEmitter<{ rating: number, comment: string }>();

  showAllReviews = false;
  newRating = 5;
  newComment = '';

  get displayedReviews(): any[] {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 3);
  }

  toggleShowAllReviews(): void {
    this.showAllReviews = !this.showAllReviews;
  }

  submitReview(): void {
    if (!this.newComment.trim()) return;
    this.postReview.emit({
      rating: this.newRating,
      comment: this.newComment.trim()
    });
    this.newComment = '';
    this.newRating = 5;
  }
}