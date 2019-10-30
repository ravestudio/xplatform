import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MdcFloatingLabelModule} from '../floating-label';
import {MdcLineRippleModule} from '../line-ripple';
import {MdcNotchedOutlineModule} from '../notched-outline';
import {MdcFormFieldModule} from '../form-field';

import {MdcTextField} from './text-field';
import {MdcTextarea} from './textarea';
import {MdcTextFieldIcon} from './text-field-icon';

const TEXTFIELD_DECLARATIONS = [
  MdcTextarea,
  MdcTextField,
  MdcTextFieldIcon
];

@NgModule({
  imports: [
    CommonModule,
    MdcFormFieldModule,
    MdcLineRippleModule,
    MdcFloatingLabelModule,
    MdcNotchedOutlineModule
  ],
  exports: [
    MdcFormFieldModule,
    TEXTFIELD_DECLARATIONS
  ],
  declarations: TEXTFIELD_DECLARATIONS
})
export class MdcTextFieldModule { }
