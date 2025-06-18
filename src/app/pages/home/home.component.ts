import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  userService = inject(UsersService);
  users = [];

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        console.log("Response: ", response);
      }
    })
  }
}
