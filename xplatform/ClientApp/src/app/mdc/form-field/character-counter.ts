import {
  Component,
  ElementRef,
  OnDestroy
} from '@angular/core';

import { MDCComponent } from '../base';


import {
  MDCTextFieldCharacterCounterFoundation,
  MDCTextFieldCharacterCounterAdapter
} from '@material/textfield';

@Component({
  selector: '[mdcCharacterCounter]',
  exportAs: 'mdcCharacterCounter',
  host: { 'class': 'mdc-text-field-character-counter' },
  template: '<ng-content></ng-content>'
})
export class MdcCharacterCounter extends MDCComponent<MDCTextFieldCharacterCounterFoundation> implements OnDestroy {
  getDefaultFoundation() {
    const adapter: MDCTextFieldCharacterCounterAdapter = {
      setContent: (content: string) => this.elementRef.nativeElement.textContent = content
    };
    return new MDCTextFieldCharacterCounterFoundation(adapter);
  }

  constructor(public elementRef: ElementRef<HTMLElement>) {
    super(elementRef);
  }

  ngOnDestroy(): void {
    this.getDefaultFoundation().destroy();
  }
}
