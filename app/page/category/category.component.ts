import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory() {
    this.categoryService.getCategory().subscribe(
      (response: any) => {
        this.categories = response; // Assuming API returns an array
      },
      (error:any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
}
