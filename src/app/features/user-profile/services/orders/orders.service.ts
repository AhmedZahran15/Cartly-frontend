import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl = "http://localhost:5000/api/orders"
  constructor(private http:HttpClient) { }

  // Get All order for a user
  getOrders() {
    return this.http.get(`${this.baseUrl}`);
  }

  // Add new order
  addToOrders(order: any) {
    return this.http.post(`${this.baseUrl}`, order);
  }

  // Remove an order
  removeOrder(orderId: string) {
    return this.http.delete(`${this.baseUrl}/${orderId}`);
  }

  

}
