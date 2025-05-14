import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address',
  imports: [CommonModule,FormsModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit{
  adress:any ={}
  constructor(private userService:UserService){}
  
  ngOnInit() {
    this.getUserAdderess();
  }

  // get user address
  getUserAdderess(){
    this.userService.getUserProfile().subscribe(
      {
        next: (response: any) => {
          this.adress = response.user.shippingAddresses;
          console.log('User address:', this.adress);
        },
        error: (error) => {
          console.error('Error fetching user address:', error);
        },
        complete: () => {
          console.log('User address fetched successfully');
        }
      }
    );
  }
  

}
