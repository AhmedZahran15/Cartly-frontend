import { Routes } from '@angular/router';

export const userProfileRoutes: Routes =[
   { path: 'account',
    loadComponent: ()=> 
        import('./components/user-profile-layout/user-data/user-data.component').then(
            (m)=>m.UserDataComponent
        ),
        title: 'My Account'
   },
    { path: 'orders',
    loadComponent: ()=> 
        import('./components/user-profile-layout/orders/orders.component').then(
            (m)=>m.OrdersComponent
        ),
        title: 'My Orders'
   },
    { path: 'wishlist',
    loadComponent: ()=> 
        import('./components/user-profile-layout/wishlisht/wishlist/wishlist.component').then(
            (m)=>m.WishlistComponent
        ),
        title: 'My Wishlist'
   },
    { path: 'returns',
    loadComponent: ()=> 
        import('./components/user-profile-layout/returns/returns.component').then(
            (m)=>m.ReturnsComponent
        ),
        title: 'My Returns'
   },
    { path: 'address',
    loadComponent: ()=> 
        import('./components/user-profile-layout/address/address.component').then(
            (m)=>m.AddressComponent
        ),
        title: 'My Addresses'
   },
    { path: 'payment',
    loadComponent: ()=> 
        import('./components/user-profile-layout/payment/payment.component').then(
            (m)=>m.PaymentComponent
        ),
        title: 'My Payment'
   },

]