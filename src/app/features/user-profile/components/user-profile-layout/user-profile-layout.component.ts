import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-profile-layout',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './user-profile-layout.component.html',
  styleUrl: './user-profile-layout.component.css'
})
export class UserProfileLayoutComponent {

}
