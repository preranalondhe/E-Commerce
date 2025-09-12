import { Component } from '@angular/core';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
  searchTerm: string = '';
  stockList: any[] = [];
  products: any[] = [];   // ✅ Declare products array

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getStock();
    this.loadProducts();  // ✅ Call products method inside ngOnInit
  }

  // ✅ Fetch stock list
  getStock(): void {
    this.stockService.getStock().subscribe({
      next: (data: any[]) => {
        this.stockList = data;
      },
      error: (err: any) => {
        console.error('Error fetching stock:', err);
      }
    });
  }

  // ✅ Fetch products list
  loadProducts(): void {
    this.stockService.getProducts().subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      error: (err: any) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  // ✅ Pagination helpers
  get totalPages(): number {
    return Math.ceil(this.filteredStock.length / this.itemsPerPage);
  }

  get filteredStock(): any[] {
    if (!this.searchTerm) return this.stockList;
    return this.stockList.filter(stock =>
      stock.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedStock(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredStock.slice(start, start + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
