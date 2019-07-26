import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { financial } from '../Entity/Financial';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  private financialUrl = 'api/financial';

  constructor(private http: HttpClient) { }

  get(id: number): Observable<financial> {

    const url = `${this.financialUrl}/${id}`;

    return this.http.get<financial>(url);
  }

  post(fin: financial) {
    return this.http.post(this.financialUrl, fin, httpOptions);
  }

  update(fin: financial) {
    return this.http.put(this.financialUrl, fin, httpOptions);
  }
}
