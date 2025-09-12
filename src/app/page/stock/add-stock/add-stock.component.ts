import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StockService } from 'src/app/service/stock.service';

@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {

  postStock: any;
  products: any[] = [];

  constructor(private stockService: StockService, private fb: FormBuilder) {
    this.postStock = this.fb.group({
      productId: ['', Validators.required],     // product name
      quantity: ['', Validators.required]  // quantity
    });
  }

  ngOnInit(): void {
    // load all products so we can map name -> id
    this.stockService.getProducts().subscribe({
      next: (res) => this.products = res,
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  PostingStock() {
  if (this.postStock.valid) {
    const productId = this.postStock.value.productId;
    const quantity = Number(this.postStock.value.quantity);

    this.stockService.postStock(productId, quantity).subscribe({
      next: (res) => {
        console.log('Stock added successfully:', res);
        alert('Stock added successfully!');
        this.postStock.reset();
      },
      error: (err) => {
        console.error('Error adding stock:', err);
        alert('Error adding stock!');
      }
    });
  }
}

}
