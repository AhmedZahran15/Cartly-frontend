import { Component } from '@angular/core';
import { HeroSectionComponent } from "../../components/hero-section/hero-section.component";
import { BestSellersComponent } from '../../components/best-sellers/best-sellers.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionComponent,BestSellersComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
 
}
