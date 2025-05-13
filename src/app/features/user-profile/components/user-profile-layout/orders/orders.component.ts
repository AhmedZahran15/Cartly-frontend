import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../../services/orders.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, CommonModule,DataViewModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
orders: any[] = [];
 
constructor(private orderService: OrdersService) { }

ngOnInit() {
  this.orderService.getOrders().subscribe({
    next: (response: any) => {
      this.orders = response;
      console.log('Orders:', this.orders);
    },
    error: (error) => {
      console.error('Error fetching orders:', error);
    },
    complete: () => {
      console.log('Orders fetched successfully');
    }
  });
}
}
