import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages = 0;
  @Input() currentPage = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }

  handlePageChange(index: number) {
    this.pageChange.emit(index);
  }
}