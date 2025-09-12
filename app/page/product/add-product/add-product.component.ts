import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/service/product.service';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  postProduct: any;
  categories: any[] = [];  // store categories

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.postProduct = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      brand: ['', Validators.required],
      discountPercent: ['', Validators.required],
      colour: ['', Validators.required],
      quantity: ['', Validators.required],
      sizes: ['', Validators.required],
      categoryId: ['', Validators.required],
      images: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategory().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });
  }
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.postProduct.patchValue({ images: file });
  }
}


 PostingProduct() {
  if (this.postProduct.valid) {
    const formData = new FormData();

    // ✅ Create product JSON
    const product = {
      name: this.postProduct.get('name').value,
      description: this.postProduct.get('description').value,
      price: this.postProduct.get('price').value,
      brand: this.postProduct.get('brand').value,
      discountPercent: this.postProduct.get('discountPercent').value,
      colour: this.postProduct.get('colour').value,
      quantity: this.postProduct.get('quantity').value,
      sizes: this.postProduct.get('sizes').value.split(',').map((s: string) => s.trim()),
      categoryId: this.postProduct.get('categoryId').value
    };

    // ✅ Append product JSON as Blob
    formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

    // ✅ Append file(s)
    const file = this.postProduct.get('images').value;
    if (file) {
      formData.append('images', file); // if multiple, loop and append
    }

    // ✅ Send FormData
    this.productService.postProduct(formData).subscribe({
      next: (response) => {
        console.log('Product added successfully:', response);
        alert('Product Added Successfully');
        this.postProduct.reset();
      },
      error: (err) => {
        console.error('Error adding product', err);
        alert('Error adding product');
      }
    });
  }
}


}
