import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { account } from '../Entity/Account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private accountUrl = 'api/account';

  constructor(private http: HttpClient) { }

  getAll(): Observable<account[]> {
    return this.http.get<account[]>(this.accountUrl);
  }
}
