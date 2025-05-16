import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, Carousel } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule, CarouselModule, TagModule, ButtonModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent {
  @Input() products: any[] = [];
  @ViewChild('carousel') carousel!: Carousel;

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 }
  ];

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK': return 'success';
      case 'LOWSTOCK': return 'warning';
      case 'OUTOFSTOCK': return 'danger';
      default: return 'info';
    }
  }

  isFirstPage(): boolean {
    return this.carousel?.page === 0;
  }

  isLastPage(): boolean {
    if (!this.carousel?.totalDots) return true;
    const totalPages = Number(this.carousel.totalDots);
    return this.carousel.page === totalPages - 1;
  }
}