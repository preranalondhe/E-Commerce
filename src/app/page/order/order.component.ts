import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  orders: any[] = [];   // ✅ keep it as any[]
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrders().subscribe(
      (response: any) => {
        this.orders = response.data;  // ✅ extract the array
      },
      (error: any) => {
        console.error('Error Fetching Orders:', error);
      }
    );
  }

  get paginatedOrders(): any[] {   // ✅ return any[]
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.orders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.orders.length / this.itemsPerPage);
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

  showReceipt(id: number) {
    alert(`Showing receipt for Order ID: ${id}`);
  }

  viewMore(id: number) {
    alert(`Viewing more details for Order ID: ${id}`);
  }
}
