import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { TopBooksComponent } from './components/top-books/top-books.component';
import { ReviewComponent } from './components/review/review.component';

export const routes: Routes = [
    {
        path: '',
        component: HomePageComponent
    },
    {
        path: 'auth/login',
        component: LoginComponent
    },
    {
        path: 'auth/signup',
        component: SignupComponent
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: DashboardComponent,
        children: [
            {
                path:'',
                component: TopBooksComponent
            },
            {
                path: 'review',
                component: ReviewComponent
            }
        ]
    }
];
