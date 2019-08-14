import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { deal } from '../Entity/Deal';

@Injectable({
  providedIn: 'root'
})
export class DealService {

  private dealUrl = 'api/deal';

  constructor(private http: HttpClient) { }

  getAll(): Observable<deal[]> {
    return this.http.get<deal[]>(this.dealUrl);
  }
}
