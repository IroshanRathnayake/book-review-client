import { Component, Input } from '@angular/core';
import { Book } from '../../model/book.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-books.component.html',
  styleUrl: './top-books.component.css'
})
export class TopBooksComponent {
}
