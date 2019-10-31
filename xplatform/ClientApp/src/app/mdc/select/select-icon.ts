import {Directive} from '@angular/core';
import {MdcIcon} from '../icon';

@Directive({
  selector: '[mdcSelectIcon]',
  exportAs: 'mdcSelectIcon',
  host: { 'class': 'mdc-select__icon' }
})
export class MdcSelectIcon extends MdcIcon { }
