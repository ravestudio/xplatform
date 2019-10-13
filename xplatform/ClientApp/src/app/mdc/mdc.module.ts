import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdcButton } from './button/button.component';



@NgModule({
  declarations: [MdcButton],
  imports: [
    CommonModule
  ],
  exports: [MdcButton]
})
export class MDCModule { }
