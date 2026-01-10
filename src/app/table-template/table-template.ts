import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  signal,
} from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../shared/user-service';

export interface TableColumn {
  key: string;
  header: string;
  isSortable?: boolean;
  isVisible?: boolean;
  isCustom?: boolean;
}

@Component({
  selector: 'app-table-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    NgIf,
    // NgFor,
    SkeletonModule,
  ],
  templateUrl: './table-template.html',
  styleUrls: ['./table-template.scss'],
})
export class TableTemplate implements OnChanges {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize = 5;
  @Input() totalCount = 0;
  @Input() isLoading: boolean = false;
  @Input() actionTemplate!: TemplateRef<any>;
  @Input() customTemplate!: TemplateRef<any>;
  @Input() headerCheckbox!: TemplateRef<any>;
  @Input() jsonTemplate!: TemplateRef<any>;
  @Input() jsonTemplate1!: TemplateRef<any>;
  @Input() jsonTemplate2!: TemplateRef<any>;
  @Input() jsonTemplate3!: TemplateRef<any>;
  @Input() jsonTemplate4!: TemplateRef<any>;
  @Input() jsonTemplate5!: TemplateRef<any>;
  @Input() jsonTemplate6!: TemplateRef<any>;
  @Input() jsonTemplate7!: TemplateRef<any>;
  @Input() jsonTemplate8!: TemplateRef<any>;
  @Input() jsonTemplate9!: TemplateRef<any>;

  @Input() currentPage = 1;
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() searchText = '';
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100, 500];
  @Input() showRefresh: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();

  paginatedData: any[] = [];
  totalPages = 1;
  Math = Math;

  get skeletonRows(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      // Data is already paginated by the parent, so we use it directly
      this.paginatedData = this.data;
    }
    // Recalculate totalPages if totalCount or pageSize changes
    if (changes['totalCount'] || changes['pageSize']) {
      this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
    }
  }

  // private sidebarState = signal(true);
  isSidebarOpen() {
    return this.userService.sidebarState();
  }

  get tableWidth() {
    return this.isSidebarOpen() ? 'calc(100vw - 250px)' : 'calc(100vw - 80px)';
  }
  // Calculate the number of visible columns for the skeleton loader
  get visibleColumnsCount(): number {
    return this.columns.filter((col) => col.isVisible).length;
  }



  onRefreshClick(): void {
    if (!this.isLoading) {
      this.refresh.emit();
    }
  }

  // Calculate visible page numbers for pagination
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxVisible = 5; // Number of page buttons to show

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = Math.max(current - Math.floor(maxVisible / 2), 1);
    let end = Math.min(start + maxVisible - 1, total);

    if (end - start + 1 < maxVisible) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      // Update local currentPage so disabled states and visiblePages update immediately
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }

  goToFirst(): void {
    if (this.currentPage !== 1) {
      this.currentPage = 1;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToLast(): void {
    if (this.currentPage !== this.totalPages) {
      this.currentPage = this.totalPages;
      this.pageChange.emit(this.currentPage);
    }
  }

  changePageSize(newSize: number): void {
    this.pageSizeChange.emit(newSize);
  }

  onSearch(): void {
    this.searchChange.emit(this.searchText);
  }

  onSort(columnKey: string): void {
    let newDirection: 'asc' | 'desc' = 'asc';
    if (this.sortColumn === columnKey && this.sortDirection === 'asc') {
      newDirection = 'desc';
    }
    this.sortChange.emit({ column: columnKey, direction: newDirection });
  }

  getDeepValue(o: any, key: string): any {
    return key.split('.').reduce((o, i) => (o && o[i] !== undefined ? o[i] : null), o);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
