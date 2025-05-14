import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-data',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-data.component.html',
  styleUrl: './user-data.component.css'
})
export class UserDataComponent implements OnInit{
user : any = {}
constructor(private userService:UserService) {}

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
updateUserProfile(id: string, user:any) {
  console.log(id)
  console.log(user)
  this.userService.updateUserProfile(id,user).subscribe({
    next: (response: any) => {
      console.log('User profile updated:', response);
    },error: (error) => {
      console.error('Error updating user profile:', error);
      
    },complete: () => {
      console.log('User profile updated successfully');
    }
  });  
}
submitProfileUpdate() {
  const updatedUser = {
    firstName: this.user.firstName,
    lastName: this.user.lastName,
    phone: this.user.phone,
  };

  this.updateUserProfile(this.user._id, updatedUser);
}

}
