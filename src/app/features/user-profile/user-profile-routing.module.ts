import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import path from 'path';
import { UserProfileLayoutComponent } from './components/user-profile-layout/user-profile-layout.component';

const routes: Routes = [
  {path: 'profile', 
  component: UserProfileLayoutComponent,
 
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
