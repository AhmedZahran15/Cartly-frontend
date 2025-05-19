import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/api/admin';
  private brandUrl = 'http://localhost:5000/api/brands';
  private productType = 'http://localhost:5000/api/product-types';

  constructor(private httpClient:HttpClient) { }
  
  // Method to get all users
  getAllUsers() {
    return this.httpClient.get(`${this.baseUrl}/users`);
  }

  // Method to remove a user
  removeUser(userId: string) {
    return this.httpClient.delete(`${this.baseUrl}/users/${userId}`);
  }

  // Method to create a new product
  createProduct(productData: any) {
    return this.httpClient.post(`${this.baseUrl}/products`, productData);
  }

  // Method to get all products
  getAllProducts() {
    return this.httpClient.get(`${this.baseUrl}/products`);
  }
  // Method to remove a product
  removeProduct(productId: string) {
    return this.httpClient.delete(`${this.baseUrl}/products/${productId}`);
  }

  // Method to update a product
  updateProduct(productId: string, productData: any) {
    return this.httpClient.put(`${this.baseUrl}/products/${productId}`, productData);
  }

  // Method to get all orders
  getAllOrders() {
    return this.httpClient.get(`${this.baseUrl}/orders`);
  }

  // Method to get order details by order ID
  getOrderById(orderId: string) {
    return this.httpClient.get(`${this.baseUrl}/orders/${orderId}`);
  }

  // Method to update order status
  updateOrderStatus(orderId: string, status: string) {
    return this.httpClient.put(`${this.baseUrl}/orders/${orderId}`, { status });
  }

  //method to get all brand 
  getAllBrand(){
    return this.httpClient.get(`${this.brandUrl}`) 
  }

  // method to get all product types
  getAllProductTypes(){
    return this.httpClient.get(`${this.productType}`)
  }

  



}
