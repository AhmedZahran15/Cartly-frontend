import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../../../services/wishlist/wishlist.service';
import { CommonModule } from '@angular/common';
import { Wishlist } from '../wishlist';
import { DataViewModule } from 'primeng/dataview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
  
@Component({
  selector: 'app-wishlist',
  imports: [ CommonModule, CardModule, ButtonModule, DividerModule, RippleModule, InputTextModule ],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
}) 
export class WishlistComponent implements OnInit{
wishlist: Wishlist = {
    _id: '',
    user: '',
    items: [],
    createdAt: '',
    updatedAt: '',
    __v: 0
  };

constructor(private wishlistService: WishlistService) { }
ngOnInit() {
  this.getWishlist();
}

// Fetch the wishlist from the server
getWishlist() {
  this.wishlistService.getWishlist().subscribe({
      next: (res: Wishlist) => {
        this.wishlist = res;
        console.log('Wishlist:', this.wishlist);
      // For each item, fetch the actual product data using the product ID
    },
    error: (err) => console.error('Failed to load wishlist:', err),
    complete: () => console.log('Wishlist loaded successfully')
  });
}
 
// remove prouduct from the wishlist
removeFromWishlist(id: string) {
  this.wishlistService.removeFromWishlist(id).subscribe({
      next: () => {
        this.wishlist.items = this.wishlist.items.filter(item => item._id !== id);
      },
      error: (err) => console.error('Failed to remove item:', err)
    });
}
}