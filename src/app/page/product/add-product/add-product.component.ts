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
  base64Images: ['', Validators.required] // renamed
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
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // strip "data:image/png;base64,"
this.postProduct.patchValue({ base64Images: [base64] }); // ✅ correct key
    };
    reader.readAsDataURL(file);
  }
}
PostingProduct() {
  if (this.postProduct.valid) {
    const product = {
      name: this.postProduct.get('name')?.value,
      description: this.postProduct.get('description')?.value,
      price: this.postProduct.get('price')?.value,
      brand: this.postProduct.get('brand')?.value,
      discountPercent: this.postProduct.get('discountPercent')?.value,
      colour: this.postProduct.get('colour')?.value,
      quantity: this.postProduct.get('quantity')?.value,
      sizes: this.postProduct.get('sizes')?.value.split(',').map((s: string) => s.trim()),
      categoryId: this.postProduct.get('categoryId')?.value,
base64Images: this.postProduct.get('base64Images')?.value // ✅ correct key
    };

    this.productService.postProduct(product).subscribe({
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
