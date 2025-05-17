import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-data',
  imports: [CommonModule, ReactiveFormsModule, ToastModule,ConfirmDialogModule],
  providers:[ConfirmationService, MessageService],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  user: any = {};
  profileForm!: FormGroup;

  constructor(private userService: UserService,  private messageService: MessageService) {}

  ngOnInit(): void {
    this.getUserProfile(); // Fetch the user profile
    this.initForm(); // Initialize the form
  }

  // Get user profile
  getUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (response: any) => {
         
        this.user = response.user;
        console.log('User profile:', this.user);
        this.setFormData(); // Populate form with fetched user data
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      },
      complete: () => {
        console.log('User profile fetched successfully');
      }
    });
  }

  // Initialize the form
  initForm(): void {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
    });
  }

  // Set the form data after fetching user profile
  setFormData(): void {
    if (this.user) {
      this.profileForm.setValue({
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        phone: this.user.phone || '',
        gender: this.user.gender || '',
        dateOfBirth: this.user.dateOfBirth || '',
      });
    }
  }
// Submit profile update
  submitProfileUpdate(): void {
    console.log("could you see")
    if (this.profileForm.valid) {
      const updatedUser = {
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        gender: this.profileForm.value.gender.toLowerCase(),
        dateOfBirth: this.profileForm.value.dateOfBirth,
      };
      console.log('Updated user data:', updatedUser);
      this.updateUserProfile(this.user.id, updatedUser);
    }else{
      console.log('Form is invalid');
    }
  }
  // Update user profile
  updateUserProfile(id: string, user: any): void {
    console.log(id);
    console.log(user);
    this.userService.updateUserProfile(id, user).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User profile updated successfully!',
        });
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

  
}
