import {
    Directive,
    ElementRef

} from '@angular/core';

let uniqueIdCounter = 0;

export class MDCDataTableRow {
    private _id = `mdc-data-table-row-${uniqueIdCounter++}`;

    get id(): string {
        return this._id;
    }

    constructor(public elementRef: ElementRef<HTMLElement>) {}

    getNativeElement(): HTMLElement {
        return this.elementRef.nativeElement;
    }
}