import { Component } from '@angular/core';

import { TopAppBarService } from './Services/top-app-bar.service';
import { MdcTabActivatedEvent } from './mdc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClientApp';

    constructor(private topAppBarService: TopAppBarService) { }

    setActiveTab(event: MdcTabActivatedEvent): void {
        console.log(event.index);

        this.topAppBarService.SetActiveTab(event.index);
    }
}
