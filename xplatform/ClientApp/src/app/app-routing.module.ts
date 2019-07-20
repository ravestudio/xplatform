import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmitentListComponent } from './cmpt/emitent-list/emitent-list.component';


const routes: Routes = [
  { path: '', component: EmitentListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
