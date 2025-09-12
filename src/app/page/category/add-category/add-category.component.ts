import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent {
  postCategory: any;
  constructor(private categoryService: CategoryService, private fb: FormBuilder)
  {
    this.postCategory=this.fb.group({
      "name":['',Validators.required],
      "description":['',Validators.required],
      "status":['',Validators.required]
    })
  }
  PostingCategory() {
    if (this.postCategory.valid) {
      this.categoryService.postCategory(this.postCategory.value).subscribe({
        next: (response) => {
          console.log('Category added successfully:', response);
          alert('Category added successfully!');
          this.postCategory.reset(); // Reset the form after submission
        },
        error: (err) => {
          console.error('Error adding category:', err);
          alert('Error adding category');
        }
      });
    }
  }

}