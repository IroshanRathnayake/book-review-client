import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit{
  isMenuOpen: boolean = false;
  isAuthenticated: boolean = false;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  onToggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; 
  }

  selectedTab: string = 'Top Books';
  
  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  onLogout(): void{
    this.authService.logout();
  }
}
