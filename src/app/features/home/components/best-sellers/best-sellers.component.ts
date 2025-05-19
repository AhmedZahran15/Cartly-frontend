import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule, CarouselModule, ProductCardComponent],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css'],
})
export class BestSellersComponent {
  @Input() products: any[] = [];

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ];

  handleAddToCart(product: any) {
    console.log('Add to cart:', product);
  }

  handleAddToWishlist(product: any) {
    console.log('Add to wishlist:', product);
  }
}
