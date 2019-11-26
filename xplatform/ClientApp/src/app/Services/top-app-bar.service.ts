import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopAppBarService {

  constructor() {

  }

  tabs : Subject<any> = new BehaviorSubject<any>(null);

  public SetTabs(newTabs: any): void {
    this.tabs.next(newTabs);
  }


}
