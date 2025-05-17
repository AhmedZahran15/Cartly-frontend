import { Routes } from '@angular/router';

export const adminProfileRoutes: Routes =[
   { path: 'users',
    loadComponent: ()=> 
        import('./admin-layout/view-all-users/view-all-users.component').then(
            (m)=>m.ViewAllUsersComponent
        ),
        title: 'User Accounts'
   },
    { path: 'orders',
    loadComponent: ()=> 
        import('./admin-layout/view-all-orders/view-all-orders.component').then(
            (m)=>m.ViewAllOrdersComponent
        ),
        title: 'ALL Orders'
   },
    { path: 'products',
    loadComponent: ()=> 
        import('./admin-layout/view-all-products/view-all-products.component').then(
            (m)=>m.ViewAllProductsComponent
        ),
        title: 'All Products'
   },
    { path: 'products/add',
    loadComponent: ()=> 
        import('./admin-layout/add-product/add-product.component').then(
            (m)=>m.AddProductComponent
        ),
        title: 'ADD product'
   }

]