import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-view-all-orders',
  imports: [DatePipe, TitleCasePipe, CommonModule], 
  templateUrl: './view-all-orders.component.html',
  styleUrl: './view-all-orders.component.css'
})
export class ViewAllOrdersComponent implements OnInit{
orders: any[] = []
constructor(private adminService: AdminService) { }

ngOnInit() {
  this.getAllUserOrder();
}


getAllUserOrder(){
  this.adminService.getAllOrders().subscribe({
    next: (response: any) => {
      this.orders = response;
      console.log(this.orders);
    },
    error: (error) => {
      console.error('Error fetching orders:', error);
    },complete: () => {
      console.log('All orders fetched successfully');
    }
  })
}
 statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled'];

getStatusClass(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'Processing':
      return 'bg-blue-100 text-blue-700';
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return '';
  } 
}
 
openDropdownIndex: string | null = null;

updateOrderStatus(orderId: any,status:string) {
  this.adminService.updateOrderStatus(orderId, status).subscribe({
    next: (response) => {
      console.log('Order status updated successfully:', response);
      // Optionally, refresh the order list or update the UI
      this.getAllUserOrder();
    },
    error: (error) => {
      console.error('Error updating order status:', error);
    }
  });
}
}
