import { Component } from '@angular/core';
import { MainLayoutComponent } from "./core/layout/main-layout/main-layout.component";

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
