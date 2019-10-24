import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdcButton } from './button/button';
import { MDCComponent } from './base/component';
import { MDCDataTable } from './data-table/data-table';

import { MDCDataTableRow } from './data-table/data-table.directives';



@NgModule({
  declarations: [MdcButton, MDCComponent, MDCDataTable, MDCDataTableRow],
  imports: [
    CommonModule
  ],
  exports: [MdcButton]
})
export class MDCModule { }
