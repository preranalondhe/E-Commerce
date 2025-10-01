import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CartService, Cart } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  isLoggedIn = false;
  user: any = null;
  cartCount = 0;
  // products not needed here if we navigate to category page
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadCartCount();
  }

  loadUserInfo() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        this.user = jwtDecode<any>(token);
        this.isLoggedIn = true;
      } catch (e) {
        console.error('Failed to decode token', e);
        this.isLoggedIn = false;
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  loadCartCount(): void {
    if (!this.isLoggedIn) return;
    this.cartService.getMyCart().subscribe({
      next: (cart: Cart) => this.cartCount = cart.items.reduce((s, i) => s + i.quantity, 0),
      error: err => { console.error(err); this.cartCount = 0; }
    });
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.isLoggedIn = false;
    this.user = null;
    window.location.reload();
  }

  // navigate to category page (recommended)
 goToCategory(id: number, name: string) {
  this.router.navigate(['/category', id], { queryParams: { name } });
}
  // optional: if you prefer to render on same component you can call productService.getProductsByCategory(...)
}
