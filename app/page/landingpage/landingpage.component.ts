import { Component, OnInit } from '@angular/core';
import { Cart, CartService } from 'src/app/service/cart.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {

  isLoggedIn = false;
  user: any = null;
  cartCount=0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.loadCartCount();
  }

  loadUserInfo() {
    const token = localStorage.getItem('jwtToken');
    console.log('JWT token in localStorage:', token); // 👈 debug

    if (token) {
      try {
        this.user = jwtDecode<any>(token);
        console.log('Decoded user:', this.user); // 👈 debug
        this.isLoggedIn = true;
      } catch (e) {
        console.error('Failed to decode token:', e);
        this.isLoggedIn = false;
      }
    } else {
      this.isLoggedIn = false;
    }
  }

  loadCartCount(): void {
    if (!this.isLoggedIn) return; // only fetch if logged in

    this.cartService.getMyCart().subscribe({
      next: (cart: Cart) => {
        this.cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },
      error: (err) => {
        console.error('Failed to fetch cart', err);
        this.cartCount = 0;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.isLoggedIn = false;
    this.user = null;
    window.location.reload(); // refresh to show login again
  }
}
