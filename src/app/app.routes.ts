import { Routes } from '@angular/router';
import { UserProfileLayoutComponent } from './features/user-profile/components/user-profile-layout/user-profile-layout.component';
import { OrdersComponent } from './features/user-profile/components/user-profile-layout/orders/orders.component';
import { WishlistComponent } from './features/user-profile/components/user-profile-layout/wishlisht/wishlist/wishlist.component';

export const routes: Routes = [
    {path: 'profile',
    component: UserProfileLayoutComponent,
    children: [
      { path: 'orders', component: OrdersComponent },
      { path: 'wishlist', component: WishlistComponent}
    ]}
]; 
