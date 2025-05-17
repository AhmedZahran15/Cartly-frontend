import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../user-profile/services/user/user.service';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule,RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit{
sidebarOpen = true;
user: any = {}
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
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

 // Update user profile
  updateUserProfile(id: string, user: any): void {
    console.log(id);
    console.log(user);
    this.userService.updateUserProfile(id, user).subscribe({
      next: (response: any) => {
        console.log('User profile updated:', response);
      },
      error: (error) => {
        console.error('Error updating user profile:', error);
      },
      complete: () => {
        console.log('User profile updated successfully');
      }
    });
  } 

  // profile image change
onProfileImageChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    // Create a FormData object to send the file to the backend
    const formData = new FormData();
    formData.append('profileImage', file);
    console.log(file.name)
    const updatedUser = {
      profileImage:file.name //not working still
    }
    this.updateUserProfile(this.user.id, updatedUser)
  }
}
}
