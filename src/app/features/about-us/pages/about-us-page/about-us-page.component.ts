import { Component } from '@angular/core';
import { TestimonialsComponent } from '../../../home/components/testimonials/testimonials.component';
import { TeamMemberComponent } from '../../../../shared/components/team-member/team-member.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-about-us-page',
  imports: [ TestimonialsComponent ,TeamMemberComponent , CommonModule , RouterLink ,ButtonModule],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.css'
})
export class AboutUsPageComponent {
  aboutImage = '/image.png'
    watches = [
    { type: 'classic',  src: '/about-us3.png' },
    { type: 'analog', src: '/about-us4.png' },
    { type: 'antique', src: '/about-us5.png' },
  ];
}
