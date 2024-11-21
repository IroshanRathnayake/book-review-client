import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../model/review.model';
import { ReviewService } from '../../services/review.service';
import { Alert, AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  alerts: Alert[] = [];
  searchText: string = '';
  selectedRow: any = null;
  showFilters: boolean = false;
  selectedFilter: string = '';
  showAddReviewModal: boolean = false;
  isEditing: boolean = false;
  editReviewIndex: number | null = null;
  data: Review[] = [];

  filteredReviews = [...this.data];

  constructor(
    private reviewService: ReviewService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe((alerts) => {
      this.alerts = alerts;
    });

    this.fetchData();
  }

  // Filter Data
  filteredData() {
    return this.data.filter((row) =>
      Object.values(row)
        .join(' ')
        .toLowerCase()
        .includes(this.searchText.toLowerCase())
    );
  }

  // Open Modal
  openModal(row: any) {
    this.selectedRow = row;
  }

  // Close Modal
  closeModal() {
    this.selectedRow = null;
  }

  // New review object
  newReview: Review = {
    id: 0,
    title: '',
    author: '',
    rating: 0,
    review: '',
  };

  // Reset the new review object
  resetNewReview() {
    this.newReview = {
      id: 0,
      title: '',
      author: '',
      review: '',
      rating: 0,
    };
  }

  //Fetch Data
  async fetchData() {
    (await this.reviewService.getAllReviews()).subscribe(
      (next: Review[]) => {
        this.data = next;
        this.filteredData();
      },
      (error: any) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  // Add new review
  addReview() {
    if (
      this.newReview.title &&
      this.newReview.author &&
      this.newReview.review
    ) {
      this.reviewService.addReview(this.newReview).then(
        () => {
          this.alertService.showAlert('success', 'Review Added!');
          this.closeAddReviewModal();

          this.fetchData();
        },
        (error) => {
          console.error('Error adding review:', error);
          this.alertService.showAlert('error', 'Failed to add review.');
        }
      );
    } else {
      alert('Please fill in all the fields.');
    }
  }

  //Delete Review
  deleteReview(id: number) {
    this.reviewService.deleteReview(id).then(
      () => {
        this.alertService.showAlert('success', 'Review Deleted!');
        this.fetchData();
      },
      (error) => {
        console.error('Error deleting review:', error);
        this.alertService.showAlert('error', 'Failed to delete review.');
      }
    );
  }

  // Open Modal
  openAddReviewModal(review?: Review, index?: number) {
    this.isEditing = !!review; 
    this.showAddReviewModal = true;
    this.editReviewIndex = index ?? null;

    if (review) {
      this.newReview = { ...review };
    } else {
      this.newReview = { id: 0, title: '', author: '', review: '', rating: 0 };
    }
  }

  // Close Modal
  closeAddReviewModal() {
    this.showAddReviewModal = false;
    this.isEditing = false;
    this.editReviewIndex = null;
    this.newReview = { id: 0, title: '', author: '', review: '', rating: 0 };
  }

  // Add or Update Review
  async saveReview() {
    if (
      this.newReview.title &&
      this.newReview.author &&
      this.newReview.review &&
      this.newReview.rating
    ) {
      if (this.isEditing && this.editReviewIndex !== null) {
        // Update existing review
        (await this.reviewService.updateReview(this.editReviewIndex,this.newReview)).subscribe(
          (next) => {
            this.fetchData();
            this.alertService.showAlert('success', 'Review Updated!');
          },
          (error) => {
            this.alertService.showAlert('error', error.message);
          }
        )
      } else {
        // Add new review
        (await this.reviewService.addReview(this.newReview)).subscribe(
          (next) => {
            this.fetchData();
            this.alertService.showAlert('success', 'Review Added!');
          },
          (error) => {
            this.alertService.showAlert('error', error.message);
          }
        );
      }

      this.closeAddReviewModal();
    } else {
      alert('Please fill in all the fields.');
    }
  }
}
