import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  imports: [ CommonModule ],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  activeIndex = 0;
  
  testimonials = [
    {
      text: 'Ut consequat semper viverra nam libero justo laoreet sit. Nunc congue nisi vitae suscipit tellus mauris a diam maecenas. Sit amet mattis vulputate enim.',
      userName: 'Hendry Richard',
      userTitle: 'Designer',
      userImage: '/user1.png'
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      userName: 'Sarah Johnson',
      userTitle: 'Developer',
      userImage: '/user2.png'
    },
    {
      text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      userName: 'Michael Chen',
      userTitle: 'Product Manager',
      userImage: '/user3.png'
    }
  ];

  next() {
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  previous() {
    this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  goToIndex(index: number) {
    this.activeIndex = index;
  }
}