import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';
import { AppComponent } from './app.component';
import {userProfileRoutes} from './features/user-profile/userProfile.routes'
import { UserProfileLayoutComponent } from '@features/user-profile/components/user-profile-layout/user-profile-layout.component';
import { AdminLayoutComponent } from '@features/admin-dashboard/admin-layout/admin-layout.component';
import { adminProfileRoutes } from './features/admin-dashboard/admin.routes'
export const routes: Routes = [
  {
    path: '',
    // This will be your home or dashboard component
    component: AppComponent,
    
    },
    {
    path: 'profile',
    component: UserProfileLayoutComponent,
    loadChildren: () => 
      import('./features/user-profile/userProfile.routes').then((m)=>m.userProfileRoutes)
    }, 
     
    {
    path: 'auth',
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
  // {
  //   path: '**',
  //   redirectTo: '/auth/login',
  // },
];
