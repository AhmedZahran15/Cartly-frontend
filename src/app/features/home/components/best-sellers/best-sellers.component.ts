import { Component} from '@angular/core';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-best-sellers',
  imports: [ProductCardComponent ,CommonModule,PaginationComponent],
  templateUrl: './best-sellers.component.html'
})
export class BestSellersComponent {
  products = [
    {
      name: 'Stainless Steel Doil',
      price: 3000,
      image: '/watch1.png'
    },
    {
      name: 'Golden Dial Watch',
      price: 1950,
      image: '/watch2.png'
    },
    {
      name: 'Analog Strap Watch',
      price: 4500,
      image: '/watch1.png'
    },
    {
      name: 'Golden Women Watch',
      price: 2000,
      image: '/watch2.png'
    },
    {
      name: 'Golden Women Watch',
      price: 2000,
      image: '/watch1.png'
    },
    {
      name: 'Golden Women Watch',
      price: 2000,
      image: '/watch2.png'
    },
    {
      name: 'Golden Women Watch',
      price: 2000,
      image: '/watch1.png'
    }
  ];
   itemsPerPage = 4;
  currentPage = 0;

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  get visibleProducts() {
    const start = this.currentPage * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  // chunk array for reference
  chunkArray(arr: any[], size: number): any[][] {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
  }
}