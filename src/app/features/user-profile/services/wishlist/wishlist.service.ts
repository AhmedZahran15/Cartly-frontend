import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Wishlist } from '../../components/user-profile-layout/wishlisht/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl = "http://localhost:5000/api/wishlist"
  constructor(private _httpClient:HttpClient) { }
  // Get All wishlist for a user
  getWishlist() {
    return this._httpClient.get<Wishlist>(`${this.baseUrl}`);
  }

  // Add a product to the wishlist
  addToWishlist(productId: string) {
    return this._httpClient.post(`${this.baseUrl}/add`, { productId });
  }

  // Remove a product from the wishlist
  removeFromWishlist(productId: string) {
    return this._httpClient.delete(`${this.baseUrl}/remove/${productId}`);
  }
}
