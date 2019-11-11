import {NgModule} from '@angular/core';

import {MdcFormFieldModule} from '../form-field';
import {MdcCheckbox} from './checkbox';

@NgModule({
  imports: [MdcFormFieldModule],
  exports: [
    MdcFormFieldModule,
    MdcCheckbox
  ],
  declarations: [MdcCheckbox]
})
export class MdcCheckboxModule { }
