import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MdcIconModule} from '../icon';
import {MdcTabIndicatorModule} from '../tab-indicator';
import {MdcTab, MdcTabLabel, MdcTabIcon} from './tab';

const TAB_DECLARATIONS = [
  MdcTab,
  MdcTabIcon,
  MdcTabLabel
];

@NgModule({
  imports: [
    CommonModule,
    MdcTabIndicatorModule,
    MdcIconModule
  ],
  exports: TAB_DECLARATIONS,
  declarations: TAB_DECLARATIONS
})
export class MdcTabModule { }
