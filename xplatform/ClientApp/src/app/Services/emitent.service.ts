import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { emitent } from '../Entity/Emitent';

@Injectable({
  providedIn: 'root'
})
export class EmitentService {

  private emitentUrl = 'api/emitent';

  constructor(private http: HttpClient) { }

  get(): Observable<emitent[]> {

    return this.http.get<emitent[]>(this.emitentUrl);
  }
}
