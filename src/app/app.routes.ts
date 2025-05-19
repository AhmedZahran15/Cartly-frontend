import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { guestGuard } from '@core/auth/guards/guest.guard';
import { MainLayoutComponent } from '@core/layout/main-layout/main-layout.component';
import {userProfileRoutes} from './features/user-profile/userProfile.routes'
import { UserProfileLayoutComponent } from '@features/user-profile/components/user-profile-layout/user-profile-layout.component';
import { AdminLayoutComponent } from '@features/admin-dashboard/admin-layout/admin-layout.component';
import { adminProfileRoutes } from './features/admin-dashboard/admin.routes'
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/home/pages/home-page/home-page.component').then(
            (m) => m.HomePageComponent
          ),
        title: 'Home - Cartly',
      },
    ],
    
    },
    {
    path: 'profile',
    component: UserProfileLayoutComponent,
    loadChildren: () => 
      import('./features/user-profile/userProfile.routes').then((m)=>m.userProfileRoutes)
    }, 
     
    {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.authRoutes),
    },
    {
    path: 'admin',
    component: AdminLayoutComponent,
    loadChildren: () => 
      import('./features/admin-dashboard/admin.routes').then((m)=>m.adminProfileRoutes)
    }, 
    {
    path: 'forbidden',
    loadComponent: () =>
      import('./core/layout/forbidden/forbidden.component').then(
      (m) => m.ForbiddenComponent
      ),
    title: 'Access Denied - Cartly',
    },
  {
    path: 'contact',
    loadComponent: () =>
      import(
        './features/contact/pages/contact-page/contact-page.component'
      ).then((m) => m.ContactPageComponent)
  },
  {
    path: 'about-us',
    loadComponent: () =>
      import(
        './features/about-us/pages/about-us-page/about-us-page.component'
      ).then((m) => m.AboutUsPageComponent)

  },
  {
    path: '**',
    redirectTo: '',
  },
];
