import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/service/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  productForm!: FormGroup;
  selectedFiles: File[] = [];
  productId!: number;
  existingProduct: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    this.loadProduct();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      colour: [''],
      brand: ['']
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe(
      (data) => {
        this.existingProduct = data;
        this.productForm.patchValue(data); // prefill form
      },
      (error) => {
        console.error('Error loading product:', error);
      }
    );
  }

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;

    this.productService.updateProduct(this.productId, productData, this.selectedFiles)
      .subscribe({
        next: (response) => {
          alert('✅ Product updated successfully!');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          alert('❌ Failed to update product.');
        }
      });
  }
}
