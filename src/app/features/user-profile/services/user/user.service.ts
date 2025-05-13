import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5000/api/users';
  constructor(private _httpClient: HttpClient) { }

  // Get User profile 
  getUserProfile() {
    return this._httpClient.get(`${this.baseUrl}/me`);
  }

  // Update User profile
  updateUserProfile(id:string ,data: any) {
    return this._httpClient.patch(`${this.baseUrl}/${id}`, data);
  }
}
