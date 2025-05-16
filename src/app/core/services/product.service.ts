import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
    private products = [
      { 
        name: 'Classic Silver', 
        price: 150, 
        imageUrl: '/watch1.png',
        inventoryStatus: 'INSTOCK'
      },
      { 
        name: 'Rose Gold', 
        price: 200, 
        imageUrl: '/watch2.png',
        inventoryStatus: 'LOWSTOCK'
      },
      { 
        name: 'Midnight Black', 
        price: 180, 
        imageUrl: '/watch1.png',
        inventoryStatus: 'INSTOCK'
      },
      { 
        name: 'Ocean Blue', 
        price: 170, 
        imageUrl: '/watch2.png',
        inventoryStatus: 'OUTOFSTOCK'
      }
    ];
getProducts() {
 return this.products; // Direct return for synchronous data
}
}