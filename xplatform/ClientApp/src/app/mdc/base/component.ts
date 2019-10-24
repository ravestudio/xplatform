import { ElementRef } from '@angular/core';

export class MDCComponent<FoundationType extends any> {

  protected _elementRef: ElementRef;
  protected _foundation: FoundationType;

  constructor(
    elemantRef: ElementRef,
    foundation?: FoundationType,
    ...args: Array<unknown>

  ) {
    this._elementRef = elemantRef;
    this.initialize(...args);

    this._foundation = foundation === undefined ? this.getDefaultFoundation() : foundation;

  }

  initialize(..._args: Array<unknown>) {

  }

  getDefaultFoundation(): FoundationType {

    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' +
      'foundation class');
  }

  destroy() {
    // Subclasses may implement this method to release any resources / deregister any listeners they have
    // attached. An example of this might be deregistering a resize event from the window object.
    this._foundation.destroy();
  }

}
