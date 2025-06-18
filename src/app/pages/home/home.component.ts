import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/types/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  userService = inject(UsersService);
  // document = inject(Document);
  users = signal<User[]>([]);
  usersFiltered = signal<User[]>([]);
  searchInput$ = new Subject<string>();
  searchText = '';

  ngOnInit(): void {
    this.searchInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const search = value.toLowerCase().trim();
        console.log('Valor captado com debounce:', value);
        const filtered = this.users().filter(user =>
          user.name.toLowerCase().includes(search)
        );
        this.usersFiltered.update(() => filtered);
    });

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.update(() => response);
        this.usersFiltered.update(() => response);
        console.log("usersFiltered: ", this.usersFiltered)
      }
    })
  }

  firstLetter(name: string){
    return name.charAt(0).toLocaleUpperCase();
  }

  onInputChange() {
   this.searchInput$.next(this.searchText);
  }

}
