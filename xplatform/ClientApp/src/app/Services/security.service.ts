import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { security } from '../Entity/Security';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private securityUrl = 'api/security';

  constructor(private http: HttpClient) { }

  getAll(): Observable<security[]> {
    return this.http.get<security[]>(this.securityUrl);
  }
}
