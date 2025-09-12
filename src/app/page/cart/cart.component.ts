import { Component, OnInit } from '@angular/core';
import { CartService, CartItem, Cart } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  selectedProducts: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getMyCart().subscribe({
      next: (data) => {
        this.cart = data;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
      }
    });
  }

  addToSelected(item: CartItem) {
    if (!this.selectedProducts.includes(item)) {
      this.selectedProducts.push(item);
    }
  }

  closeModal() {
    const modal = document.getElementById("orderModal");
    if (modal) modal.style.display = "none";
  }

  removeItem(id: number) {
    if (this.cart) {
      this.cart.items = this.cart.items.filter(item => item.id !== id);
    }
    this.selectedProducts = this.selectedProducts.filter(item => item.id !== id);
  }

  placeOrder() {
    alert('Order placed successfully!');
    this.cart = { id: 0, items: [], totalAmount: 0 };
    this.selectedProducts = [];
  }



toggleSelection(item: any) {
  if (this.selectedProducts.includes(item)) {
    this.selectedProducts = this.selectedProducts.filter(p => p !== item);
  } else {
    this.selectedProducts.push(item);
  }
}
}
