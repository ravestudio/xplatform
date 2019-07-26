import { Component, OnInit } from '@angular/core';

import { emitent } from '../../Entity/Emitent';

import { EmitentService } from '../../Services/emitent.service';

@Component({
  selector: 'app-emitent-list',
  templateUrl: './emitent-list.component.html',
  styleUrls: ['./emitent-list.component.css']
})
export class EmitentListComponent implements OnInit {

  displayedColumns: string[] = ['name'];
  emitents: emitent[] = [];

  constructor(private emitentService: EmitentService) { }

  ngOnInit() {

    this.emitentService.get().subscribe(data => this.emitents = data);

  }

}
