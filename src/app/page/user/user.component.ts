import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  address: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor(private userService:UserService){}

users:[]=[];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedUsers: User[] = [];

  ngOnInit(): void {
    this.findAllUser();

    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    this.updatePaginatedUsers();
  }

  updatePaginatedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  findAllUser() {
  this.userService.findAllUser().subscribe((response: any) => {
    if (response) {
      // ✅ Filter only users with role USER
      this.users = response.filter((u: any) => u.role === 'USER');

      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePaginatedUsers();
    }
  });
}

}
