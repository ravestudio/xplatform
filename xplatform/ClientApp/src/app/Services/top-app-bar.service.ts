import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopAppBarService {

  constructor() {

  }

    tabs: Subject<any> = new BehaviorSubject<any>(null);
    activeTabIndex: Subject<number> = new BehaviorSubject<number>(0);

  public SetTabs(newTabs: any): void {
    this.tabs.next(newTabs);
  }

    public SetActiveTab(index: number): void {
        this.activeTabIndex.next(index);
    }


}
