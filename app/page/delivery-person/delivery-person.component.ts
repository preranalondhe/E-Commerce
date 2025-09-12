import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  availablity: string;
  area: string;
  deliverycount:number;
}

@Component({
  selector: 'app-delivery-person',
  templateUrl: './delivery-person.component.html',
  styleUrls: ['./delivery-person.component.css']
})
export class DeliveryPersonComponent implements OnInit {

  constructor(private userService: UserService) {}

  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedUsers: User[] = [];

  ngOnInit(): void {
    this.findAllUser();
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
        // ✅ Only delivery boys
        this.users = response.filter((u: any) => u.role === 'DELIVERY');

        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      }
    });
  }
}
