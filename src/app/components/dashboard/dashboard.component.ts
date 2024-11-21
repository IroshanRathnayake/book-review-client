import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../shared/nav-bar/nav-bar.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Alert, AlertService } from '../../shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavBarComponent, AlertComponent, RouterOutlet, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe((alerts) => {
      this.alerts = alerts;
    });
    setTimeout(() => {
      if (sessionStorage.getItem('oneTimeData') == 'false') {
        this.alertService.showAlert('success', 'Successfully logged in.');
        sessionStorage.setItem('oneTimeData', 'true');
      }
    }, 200);
  }
}
