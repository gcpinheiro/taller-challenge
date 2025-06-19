import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule, SkeletonComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
  userService = inject(UsersService);
  users = signal<User[]>([]);
  usersFiltered = signal<User[]>([]);
  searchInput$ = new Subject<string>();
  searchText = '';
  isLoading = signal(true);
  errorMessage = signal<string | null>('');
  private sub = new Subscription();

  ngOnInit(): void {
    this.isLoading.update(() => true);

    const searchSub = this.searchInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const search = value.toLowerCase().trim();
        const filtered = this.users().filter(user =>
          user.name.toLowerCase().includes(search)
        );
        this.usersFiltered.update(() => filtered);
    });

    this.sub.add(searchSub);


    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users.update(() => response);
        this.usersFiltered.update(() => response);
        this.isLoading.update(() => false);
        this.errorMessage.update(() => null);
      },
      error: () => {
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
