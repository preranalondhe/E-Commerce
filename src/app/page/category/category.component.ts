import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  products: any[] = [];
  categoryId!: number;
  categoryName: string = '';

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getCategory();

    // ✅ Fetch category id from route
    this.route.paramMap.subscribe(params => {
      this.categoryId = Number(params.get('id'));
      this.categoryName = params.get('name') || '';
      this.loadProducts();
    });
  }

  getCategory() {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.categories = response; // Assuming API returns an array
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  loadProducts() {
    if (!this.categoryId) return;
    this.productService.getProductsByCategory(this.categoryId).subscribe(
      (data: any[]) => {
        this.products = data;
        console.log('Products for category:', this.categoryId, data);
      },
      error => {
        console.error('Error fetching products by category:', error);
      }
    );
  }

}
