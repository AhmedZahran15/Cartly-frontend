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
}
