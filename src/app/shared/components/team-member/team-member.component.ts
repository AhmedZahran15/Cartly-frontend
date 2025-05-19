import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-member',
  imports: [CommonModule],
  templateUrl: './team-member.component.html',
  styleUrls: ['./team-member.component.css']
})
export class TeamMemberComponent {
  @Input() name: string = '';
  @Input() position: string = '';
  @Input() imageUrl: string = '';
}