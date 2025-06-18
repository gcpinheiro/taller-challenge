import { Component, inject, OnInit, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/types/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  userService = inject(UsersService);
  users = signal<User[]>([]);
  usersFiltered = signal<User[]>([]);
  searchInput$ = new Subject<string>();
  searchText = '';
  isLoading = signal(true);
  errorMessage = signal<string | null>('');

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
    this.isLoading.update(() => true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.update(() => response);
        this.usersFiltered.update(() => response);
        console.log("usersFiltered: ", this.usersFiltered())
        this.isLoading.update(() => false);
        this.errorMessage.update(() => null);
      },
      error: (error) => {
        this.isLoading.update(() => false);
        this.errorMessage.update(() => 'An error occurred while loading the data. Please try again.')
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
