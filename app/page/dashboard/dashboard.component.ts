import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { apiurl } from 'src/app/service/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  totalOrders: number = 0;
  totalProducts: number = 0;
  totalUsers: number = 0;
  recentOrders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCounts();
    this.loadRecentOrders();
  }

  ngAfterViewInit(): void {
    this.loadSalesChart();  // ✅ call after DOM is ready
  }

  loadCounts(): void {
    // Products
    this.http.get<any[]>(`${apiurl.url}/product/`).subscribe({
      next: (res) => this.totalProducts = res.length,
      error: (err) => console.error("Error fetching products", err)
    });

    // Orders
    this.http.get<any>(`${apiurl.url}/order/getallorders`).subscribe({
      next: (res) => {
        // if backend returns { data: [...] }
        this.totalOrders = res.data ? res.data.length : res.length || 0;
      },
      error: (err) => console.error("Error fetching orders", err)
    });

    // Users
    this.http.get<any[]>(`${apiurl.url}/alluser`).subscribe({
      next: (res) => this.totalUsers = res.length,
      error: (err) => console.error("Error fetching users", err)
    });
  }

  loadRecentOrders(): void {
    this.http.get<any>(`${apiurl.url}/order/getallorders`).subscribe(res => {
      const orders = res.data ? res.data : res;  // handle both cases
      this.recentOrders = orders.slice(-5).reverse();
    });
  }

  loadSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error("Canvas not found");
      return;
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
          label: "Sales",
          data: [12, 19, 3, 5, 2, 3], // replace with API data later
          borderColor: "#3e95cd",
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }
}
