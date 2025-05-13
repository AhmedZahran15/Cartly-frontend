import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { UserProfileLayoutComponent } from './components/user-profile-layout/user-profile-layout.component';
import { OrdersComponent } from './components/user-profile-layout/orders/orders.component';

const routes: Routes = [
  {path: 'profile', 
  component: UserProfileLayoutComponent,
    children: [
      {path:'orders', component: OrdersComponent}
    ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
