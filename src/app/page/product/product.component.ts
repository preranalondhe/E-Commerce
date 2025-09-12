import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-products', // this can be any selector; keep or change as needed
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  products:any[] = [];
  constructor(private productService: ProductService){}

  
  
  

  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit(): void { this.getProduct();}
  getProduct()
  {
    this.productService.getProduct().subscribe(
      (response: any)=>{
        this.products=response;
      },
      (error:any)=>{
        console.error('Error fetching products:',error);
      }
    );
  }
 


  get paginatedProducts(): typeof this.products {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.itemsPerPage);
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