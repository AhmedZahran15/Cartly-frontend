import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carousel, CarouselModule, CarouselPageEvent } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-best-sellers',
  imports: [CommonModule, CarouselModule, TagModule, ButtonModule],
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css'],
})
export class BestSellersComponent implements AfterViewInit {
  @Input() products: any[] = [];
  @ViewChild('carousel') carousel!: Carousel;

  currentPage = 0;
  isFirst = true;
  isLast = false;

  responsiveOptions = [
    { breakpoint: '1400px', numVisible: 3, numScroll: 1 },
    { breakpoint: '1199px', numVisible: 2, numScroll: 1 },
    { breakpoint: '767px', numVisible: 2, numScroll: 1 },
    { breakpoint: '575px', numVisible: 1, numScroll: 1 },
  ];

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateNavStates();
      this.cd.detectChanges();
    });
  }

  onPageChange(event: CarouselPageEvent) {
    this.currentPage = event.page ?? 0;
    this.updateNavStates();
  }

  private updateNavStates() {
    if (!this.carousel) {
      return;
    }
    const totalPages = Number(this.carousel.totalDots ?? 0);
    this.isFirst = this.carousel.page === 0;
    this.isLast = this.carousel.page === totalPages - 1;
  }

  goToPrevious() {
    (this.carousel as any).navBackward(1);
    setTimeout(() => this.updateNavStates());
  }

  goToNext() {
    (this.carousel as any).navForward(1);
    setTimeout(() => this.updateNavStates());
  }

  getSeverity(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }
}
