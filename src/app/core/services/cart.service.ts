import { Injectable } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: CartItem[] = [];

  get itemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateQuantity(item: CartItem, change: number) {
    const index = this.items.findIndex(i => i.id === item.id);
    if (index > -1) {
      this.items[index].quantity += change;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
    }
  }

  addToCart(item: CartItem) {
    const existing = this.items.find(i => i.id === item.id);
    existing ? existing.quantity++ : this.items.push({ ...item, quantity: 1 });
  }
}