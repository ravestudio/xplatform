import {NgModule} from '@angular/core';

import {MdcTabIndicatorModule} from '../tab-indicator';
import {MdcTabModule} from '../tab';
import {MdcTabScrollerModule} from '../tab-scroller';

import {MdcTabBar} from './tab-bar';

@NgModule({
  imports: [
    MdcTabIndicatorModule,
    MdcTabModule,
    MdcTabScrollerModule
  ],
  exports: [
    MdcTabBar,
    MdcTabIndicatorModule,
    MdcTabModule,
    MdcTabScrollerModule
  ],
  declarations: [MdcTabBar]
})
export class MdcTabBarModule { }
