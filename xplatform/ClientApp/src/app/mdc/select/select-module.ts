import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MdcFloatingLabelModule} from '../floating-label';
import {MdcLineRippleModule} from '../line-ripple';
import {MdcNotchedOutlineModule} from '../notched-outline';
import {MdcFormFieldModule} from '../form-field';
import {MdcMenuModule} from '../menu';

import {MdcSelect, MdcSelectOption} from './select';
import {MdcSelectIcon} from './select-icon';
import {MDCSelectHelperText} from './select-helper-text';

const SELECT_DECLARATIONS = [
  MdcSelect,
  MDCSelectHelperText,
  MdcSelectIcon,
  MdcSelectOption
];

@NgModule({
  imports: [
    CommonModule,
    MdcMenuModule,
    MdcFormFieldModule,
    MdcFloatingLabelModule,
    MdcNotchedOutlineModule,
    MdcLineRippleModule
  ],
  exports: [
    MdcMenuModule,
    MdcFormFieldModule,
    SELECT_DECLARATIONS
  ],
  declarations: SELECT_DECLARATIONS
})
export class MdcSelectModule { }
