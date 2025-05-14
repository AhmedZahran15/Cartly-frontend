import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:5000/api/products'; 
  constructor(private httpClient: HttpClient) { }

  // Get all products
  getAllProducts() {
    return this.httpClient.get(`${this.baseUrl}`);
  }

  // Get a single product by ID
  getProductById(productId: string) {
    return this.httpClient.get(`${this.baseUrl}/${productId}`);
  }

  
}
