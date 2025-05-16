import { Component, inject } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { BestSellersComponent } from '../../components/best-sellers/best-sellers.component';
import { HeroSectionComponent } from './../../components/hero-section/hero-section.component';
import { GenderCategoriesComponent } from '../../components/gender-categories/gender-categories.component';
import { FeaturesHighlightComponent } from '../../components/features-highlight/features-highlight.component';

@Component({
  selector: 'app-home-page',
  imports: [BestSellersComponent ,HeroSectionComponent,GenderCategoriesComponent,FeaturesHighlightComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  private _productService = inject(ProductService);
  products = this._productService.getProducts();
}