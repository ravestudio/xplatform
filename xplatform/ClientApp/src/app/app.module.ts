import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { NgxMaskModule } from 'ngx-mask';
import { NgxCurrencyModule } from "ngx-currency";
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatTableModule, MatSidenavModule, MatStepperModule } from '@angular/material';

import { AppComponent } from './app.component';
import { EmitentListComponent } from './cmpt/emitent-list/emitent-list.component';
import { FinancialEditComponent } from './cmpt/financial-edit/financial-edit.component';
import { EmitentDetailsComponent } from './cmpt/emitent-details/emitent-details.component';

@NgModule({
  declarations: [
    AppComponent,
    EmitentListComponent,
    FinancialEditComponent,
    EmitentDetailsComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatTableModule,
    MatSidenavModule,
    MatStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
