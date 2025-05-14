import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import(
        './features/home/pages/home-page/home-page.component'
      ).then((m) => m.HomePageComponent)
  },
  {
    path: 'shop',
    loadComponent: () =>
      import(
        './features/products/pages/product-list-page/product-list-page.component'
      ).then((m) => m.ProductListPageComponent)
  },
  {
    path: 'collections',
    loadComponent: () =>
      import(
        './features/collections/pages/collections-page/collections-page.component'
      ).then((m) => m.CollectionsPageComponent)
  },
  {
    path: 'blog',
    loadComponent: () =>
      import(
        './features/blog/pages/blog-page/blog-page.component'
      ).then((m) => m.BlogPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () =>
      import(
        './features/contact/pages/contact-page/contact-page.component'
      ).then((m) => m.ContactPageComponent)
  },
  {
    path: 'cart',
    loadComponent: () =>
      import(
        './features/cart/pages/cart-page/cart-page.component'
      ).then((m) => m.CartPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
