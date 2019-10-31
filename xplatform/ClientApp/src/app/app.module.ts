import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatToolbarModule, MatTableModule, MatSidenavModule, MatStepperModule } from '@angular/material';


import { MdcButtonModule, MdcFormFieldModule, MdcTextFieldModule, MdcListModule, MdcMenuModule, MdcSelectModule  } from "./mdc";

import { AppComponent } from './app.component';
import { EmitentListComponent } from './cmpt/emitent-list/emitent-list.component';
import { FinancialEditComponent } from './cmpt/financial-edit/financial-edit.component';
import { EmitentDetailsComponent } from './cmpt/emitent-details/emitent-details.component';
import { DealAddComponent } from './cmpt/deal-add/deal-add.component';

@NgModule({
  declarations: [
    AppComponent,
    EmitentListComponent,
    FinancialEditComponent,
    EmitentDetailsComponent,
    DealAddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,

    MdcButtonModule,
    MdcFormFieldModule,
    MdcTextFieldModule,
    MdcListModule,
    MdcMenuModule,
    MdcSelectModule,

    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatTableModule,
    MatSidenavModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
