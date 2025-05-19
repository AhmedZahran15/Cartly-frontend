import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-gender-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gender-categories.component.html',
  styleUrls: ['./gender-categories.component.css'],
})
export class GenderCategoriesComponent implements AfterViewInit {
  @ViewChild('menSection', { static: true }) menSection!: ElementRef;
  @ViewChild('womenSection', { static: true }) womenSection!: ElementRef;

  isMenVisible = false;
  isWomenVisible = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    // detect if we're running in the browser
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    // only create/observe in the browser
    if (!this.isBrowser) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === this.menSection.nativeElement) {
            this.isMenVisible = entry.isIntersecting;
          }
          if (entry.target === this.womenSection.nativeElement) {
            this.isWomenVisible = entry.isIntersecting;
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(this.menSection.nativeElement);
    observer.observe(this.womenSection.nativeElement);
  }
}
