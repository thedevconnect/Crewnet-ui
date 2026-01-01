import { Component, Input, Output, EventEmitter, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  width?: string;
  template?: TemplateRef<any>;
}

export interface SortEvent {
  field: string;
  order: 1 | -1;
}

@Component({
  selector: 'app-table-template',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    TooltipModule,
  ],
  templateUrl: './table-template.html',
  styleUrl: './table-template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTemplate {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() totalRecords: number = 0;
  @Input() isLoading: boolean = false;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50, 100];
  @Input() rows: number = 10;
  @Input() first: number = 0;
  @Input() globalFilter: string = '';
  @Input() sortField: string = '';
  @Input() sortOrder: number = 0;
  @Input() actionTemplate?: TemplateRef<any>;
  @Input() emptyMessage: string = 'No records found';

  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() globalFilterChange = new EventEmitter<string>();

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.pageChange.emit(event);
  }

  onSort(event: any): void {
    this.sortField = event.field;
    this.sortOrder = event.order;
    this.sortChange.emit({
      field: event.field,
      order: event.order as 1 | -1,
    });
  }

  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.globalFilter = value;
    this.globalFilterChange.emit(value);
  }

  clearFilter(): void {
    this.globalFilter = '';
    this.globalFilterChange.emit('');
  }
}

