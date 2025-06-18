import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../enviroments/enviroment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  httpClient = inject(HttpClient);

  getUsers(){
    return this.httpClient.get<User[]>(`${enviroment.baseUrl}/users`);
  }
}
