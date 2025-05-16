import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gender-categories',
  imports: [RouterLink],
  templateUrl: './gender-categories.component.html',
  styleUrls: ['./gender-categories.component.css']
})
export class GenderCategoriesComponent implements AfterViewInit {
  @ViewChild('menSection') menSection!: ElementRef;
  @ViewChild('womenSection') womenSection!: ElementRef;

  isMenVisible = false;
  isWomenVisible = false;

  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.target === this.menSection.nativeElement) {
            this.isMenVisible = entry.isIntersecting;
          } else if (entry.target === this.womenSection.nativeElement) {
            this.isWomenVisible = entry.isIntersecting;
          }
        });
      },
      {
        threshold: 0.4
      }
    );

    if (this.menSection) {
      observer.observe(this.menSection.nativeElement);
    }
    if (this.womenSection) {
      observer.observe(this.womenSection.nativeElement);
    }
  }
}
