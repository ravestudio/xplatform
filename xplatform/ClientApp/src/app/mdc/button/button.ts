import { Component, OnInit, Input } from '@angular/core';

import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
    selector: 'button[mdc-button]',
    exportAs: 'mdcButton',
    host: {
        'class': 'mdc-button',
        '[class.ngx-mdc-button--primary]': 'primary',
        '[class.ngx-mdc-button--secondary]': 'secondary'
    },
    template: `
  <ng-content></ng-content>
  `
})
export class MdcButton implements OnInit {

    @Input()
    get primary(): boolean {
        return this._primary;
    }
    set primary(value: boolean) {
        this._primary = coerceBooleanProperty(value);
    }
    private _primary: boolean = false;

    @Input()
    get secondary(): boolean {
        return this._secondary;
    }
    set secondary(value: boolean) {
        this._secondary = coerceBooleanProperty(value);
    }
    private _secondary: boolean = false;


    constructor() { }

    ngOnInit() {
    }

}

