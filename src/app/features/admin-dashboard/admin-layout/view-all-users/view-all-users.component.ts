import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-all-users',
  imports: [TableModule, CommonModule,ToastModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './view-all-users.component.html',
  styleUrl: './view-all-users.component.css'
})
export class ViewAllUsersComponent implements OnInit{
users: any[] = []
constructor(private adminService: AdminService,  private confirmationService: ConfirmationService,
    private messageService: MessageService) {}
 ngOnInit() {
  this.getAllUsers();
 }

// Fetch all users when the component is initialized
getAllUsers() {
  this.adminService.getAllUsers().subscribe({
    next: (response: any) => {
      this.users = response.users;
      console.log(this.users);
    },
    error: (error) => {
      console.error('Error fetching users:', error);
    },complete: () => {
      console.log('User fetching completed');
    }
  });
}

// Call this method to confirm deletion of a user
 confirmDelete(userId: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(userId);
      }
    });
}
 
// Call this method to remove a user
deleteUser(userId: any): void {
  this.adminService.removeUser(userId).subscribe({
    next: (response) => {
      this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User deleted successfully`
        });
      this.getAllUsers(); // Refresh the user list after removal
    },
    error: (error) => {
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not delete user'
        });
      console.error('Error removing user:', error);
    },
    complete: () => {
      console.log('User removal completed');
    }
  });
}

}
