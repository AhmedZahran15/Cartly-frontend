import { Component, Input } from '@angular/core';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-exclusive-products',
  imports: [ProductCardComponent, CommonModule , CarouselModule],
  templateUrl: './exclusive-products.component.html',
  styleUrls: ['./exclusive-products.component.css'],
})
export class ExclusiveProductsComponent {
  @Input() products: any[] = [];

  handleAddToCart(product: any) {
    console.log('Add to cart:', product);
  }

  handleAddToWishlist(product: any) {
    console.log('Add to wishlist:', product);
  }
}