import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive, CommonModule],
  templateUrl: './user-profile-layout.component.html',
  styleUrl: './user-profile-layout.component.css'
})
export class UserProfileLayoutComponent implements OnInit{
user: any = {}
constructor(private userService: UserService) {}

ngOnInit() {
  this.getUserProfile();
}

// get user profile
getUserProfile() {
   this.userService.getUserProfile().subscribe({
    next: (response: any) => {
      this.user = response.user;
      console.log('User profile:', this.user);
    },error: (error) => {
      console.error('Error fetching user profile:', error);
    },complete: () => {
      console.log('User profile fetched successfully');
    }
  });
}
}
