import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Review } from '../model/review.model';
import { Observable, tap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly API_URL = `${environment.BASE_URL}/api/v1/reviews`;

  constructor(private http: HttpClient) {}

  async addReview(review: Review): Promise<Observable<Review>> {
    return this.http
      .post<Review>(`${this.API_URL}`, review, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  async getAllReviews(): Promise<Observable<Review[]>> {
    return this.http
      .get<Review[]>(`${this.API_URL}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  async deleteReview(id: number): Promise<boolean> {
    return firstValueFrom(
      this.http
      .delete<boolean>(`${this.API_URL}/${id}`, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      )
    );
  }

  async updateReview(
    id: number,
    newReview: Review
  ): Promise<Observable<Review>> {
    return this.http
      .put<Review>(`${this.API_URL}/${id}`, newReview, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }
}
