import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatToolbarModule, MatTableModule, MatSidenavModule, MatStepperModule } from '@angular/material';

import { AppComponent } from './app.component';
import { EmitentListComponent } from './cmpt/emitent-list/emitent-list.component';
import { FinancialEditComponent } from './cmpt/financial-edit/financial-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    EmitentListComponent,
    FinancialEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
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
