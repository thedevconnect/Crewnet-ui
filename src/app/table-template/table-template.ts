import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule, NgClass, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '../shared/user-service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

export interface TableColumn {
  key: string;
  header: string;
  isSortable?: boolean;
  isVisible?: boolean;
  isCustom?: boolean;
}

export interface TableDataFetchParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TableDataFetchResult {
  data: any[];
  total: number;
}

export type DataFetchFunction = (
  params: TableDataFetchParams
) => Promise<TableDataFetchResult> | any;

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
export class TableTemplate implements OnInit, OnChanges, OnDestroy {
  // Legacy inputs (for backward compatibility)
  @Input() data: any[] = [];
  @Input() totalCount = 0;
  @Input() isLoading: boolean = false;
  @Input() currentPage = 1;
  @Input() searchText = '';
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  // New inputs for automatic data fetching
  @Input() fetchData?: DataFetchFunction;
  @Input() dataTransform?: (data: any) => any[];
  @Input() totalTransform?: (response: any) => number;

  // Common inputs
  @Input() columns: TableColumn[] = [];
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100, 500];
  @Input() showRefresh: boolean = true;
  @Input() enableSearch: boolean = true;
  @Input() autoLoad: boolean = true;

  // Template inputs
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

  // Internal state
  private internalPage = signal(1);
  private internalSearchText = signal('');
  private internalSortColumn = signal<string | null>(null);
  private internalSortDirection = signal<'asc' | 'desc'>('asc');
  private internalIsLoading = signal(false);
  private internalData = signal<any[]>([]);
  private internalTotalCount = signal(0);
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  // Outputs (for backward compatibility)
  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() refresh = new EventEmitter<void>();
  @Output() dataLoaded = new EventEmitter<any[]>();

  paginatedData: any[] = [];
  totalPages = 1;
  Math = Math;

  get skeletonRows(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // Setup search debouncing
    this.searchSubject
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchText) => {
        this.internalSearchText.set(searchText);
        if (this.fetchData) {
          this.loadData();
        } else {
          this.searchChange.emit(searchText);
        }
      });

    // Auto load data if fetchData is provided
    if (this.autoLoad && this.fetchData) {
      this.loadData();
    } else if (this.data && this.data.length > 0) {
      // Use provided data
      this.paginatedData = this.data;
      this.internalData.set(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If using legacy mode (data passed directly)
    if (!this.fetchData) {
      if (changes['data']) {
        this.paginatedData = this.data;
        this.internalData.set(this.data);
      }
      if (changes['totalCount'] || changes['pageSize']) {
        this.totalPages = Math.ceil(this.totalCount / this.pageSize) || 1;
        this.internalTotalCount.set(this.totalCount);
      }
      if (changes['isLoading']) {
        this.internalIsLoading.set(this.isLoading);
      }
      if (changes['currentPage']) {
        this.internalPage.set(this.currentPage);
      }
      if (changes['searchText']) {
        this.internalSearchText.set(this.searchText);
      }
    } else {
      // If using fetchData, recalculate totalPages when totalCount changes
      if (changes['totalCount'] || changes['pageSize']) {
        this.totalPages = Math.ceil(this.internalTotalCount() / this.pageSize) || 1;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async loadData(): Promise<void> {
    if (!this.fetchData) return;

    this.internalIsLoading.set(true);
    try {
      const params: TableDataFetchParams = {
        page: this.internalPage(),
        limit: this.pageSize,
        search: this.internalSearchText() || undefined,
        sortBy: this.internalSortColumn() || undefined,
        sortOrder: this.internalSortDirection(),
      };

      const result = await this.fetchData(params);

      // Handle different response formats
      let data: any[] = [];
      let total = 0;

      if (result && typeof result.subscribe === 'function') {
        // Observable
        result.subscribe({
          next: (response: any) => {
            data = this.extractData(response);
            total = this.extractTotal(response);
            this.updateData(data, total);
          },
          error: (error: any) => {
            console.error('Error loading data:', error);
            this.internalIsLoading.set(false);
            this.updateData([], 0);
          },
        });
      } else {
        // Promise or direct data
        data = this.extractData(result);
        total = this.extractTotal(result);
        this.updateData(data, total);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      this.internalIsLoading.set(false);
      this.updateData([], 0);
    }
  }

  private extractData(response: any): any[] {
    if (this.dataTransform) {
      return this.dataTransform(response);
    }

    // Default extraction logic
    if (Array.isArray(response)) {
      return response;
    }
    if (response?.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data?.employees) {
        return response.data.employees;
      }
      if (response.data?.leaves) {
        return response.data.leaves;
      }
    }
    if (response?.employees) {
      return response.employees;
    }
    if (response?.leaves) {
      return response.leaves;
    }
    return [];
  }

  private extractTotal(response: any): number {
    if (this.totalTransform) {
      return this.totalTransform(response);
    }

    // Default extraction logic
    if (response?.total) {
      return response.total;
    }
    if (response?.data?.total) {
      return response.data.total;
    }
    if (response?.data?.pagination?.total) {
      return response.data.pagination.total;
    }
    if (Array.isArray(response)) {
      return response.length;
    }
    return 0;
  }

  private updateData(data: any[], total: number): void {
    this.paginatedData = data;
    this.internalData.set(data);
    this.internalTotalCount.set(total);
    this.totalPages = Math.ceil(total / this.pageSize) || 1;
    this.internalIsLoading.set(false);
    this.dataLoaded.emit(data);
  }

  // Getters for template
  get currentPageValue(): number {
    return this.fetchData ? this.internalPage() : this.currentPage;
  }

  get searchTextValue(): string {
    return this.fetchData ? this.internalSearchText() : this.searchText;
  }

  get isLoadingValue(): boolean {
    return this.fetchData ? this.internalIsLoading() : this.isLoading;
  }

  get totalCountValue(): number {
    return this.fetchData ? this.internalTotalCount() : this.totalCount;
  }

  get dataValue(): any[] {
    return this.fetchData ? this.internalData() : this.data;
  }

  getSortColumn(): string | null {
    return this.fetchData ? this.internalSortColumn() : this.sortColumn;
  }

  getSortDirection(): 'asc' | 'desc' {
    return this.fetchData ? this.internalSortDirection() : this.sortDirection;
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
    if (this.fetchData) {
      this.loadData();
    } else {
      if (!this.isLoading) {
        this.refresh.emit();
      }
    }
  }

  // Calculate visible page numbers for pagination
  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPageValue;
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
      if (this.fetchData) {
        this.internalPage.set(page);
        this.loadData();
      } else {
        this.currentPage = page;
        this.pageChange.emit(page);
      }
    }
  }

  goToFirst(): void {
    const current = this.fetchData ? this.internalPage() : this.currentPage;
    if (current !== 1) {
      this.changePage(1);
    }
  }

  goToLast(): void {
    const current = this.fetchData ? this.internalPage() : this.currentPage;
    if (current !== this.totalPages) {
      this.changePage(this.totalPages);
    }
  }

  changePageSize(newSize: number): void {
    if (this.fetchData) {
      this.pageSize = newSize;
      this.internalPage.set(1);
      this.loadData();
    } else {
      this.pageSizeChange.emit(newSize);
    }
  }

  onSearch(): void {
    if (this.fetchData) {
      this.searchSubject.next(this.searchTextValue);
    } else {
      this.searchChange.emit(this.searchText);
    }
  }

  onSort(columnKey: string): void {
    if (this.fetchData) {
      const currentSort = this.internalSortColumn();
      const currentDir = this.internalSortDirection();

      let newDirection: 'asc' | 'desc' = 'asc';
      if (currentSort === columnKey && currentDir === 'asc') {
        newDirection = 'desc';
      }

      this.internalSortColumn.set(columnKey);
      this.internalSortDirection.set(newDirection);
      this.internalPage.set(1);
      this.loadData();
    } else {
      let newDirection: 'asc' | 'desc' = 'asc';
      if (this.sortColumn === columnKey && this.sortDirection === 'asc') {
        newDirection = 'desc';
      }
      this.sortChange.emit({ column: columnKey, direction: newDirection });
    }
  }

  getDeepValue(o: any, key: string): any {
    return key.split('.').reduce((o, i) => (o && o[i] !== undefined ? o[i] : null), o);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
