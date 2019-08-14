import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmitentListComponent } from './cmpt/emitent-list/emitent-list.component';
import { FinancialEditComponent } from './cmpt/financial-edit/financial-edit.component';
import { EmitentDetailsComponent } from './cmpt/emitent-details/emitent-details.component';
import { DealAddComponent } from './cmpt/deal-add/deal-add.component';


const routes: Routes = [
  { path: '', component: EmitentListComponent },
  { path: 'financial/create', component: FinancialEditComponent },
  { path: 'financial/edit/:id', component: FinancialEditComponent },
  { path: 'deal/add', component: DealAddComponent },
  { path: 'emitent/detail', component: EmitentDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
