import {
  Component,
  ContentChildren,
  AfterViewInit,
  OnDestroy,
  QueryList
} from '@angular/core';

import {
  MDCDataTableAdapter,
  MDCDataTableFoundation
} from '@material/data-table';

import { Observable, from } from 'rxjs';
import { MDCComponent } from '../base/component';

import {
  MDCDataTableRow
} from './data-table.directives'

@Component({
  selector: 'mdc-data-table',
  exportAs: 'mdcDataTable',
  host: {'class': 'mdc-data-table'},
  template: '<ng-content></ng-content>'
})
export class MDCDataTable extends MDCComponent<MDCDataTableFoundation>  {

  @ContentChildren(MDCDataTableRow, {descendants: true}) rows!: QueryList<MDCDataTableRow>;

  getDefaultFoundation() {

    const adapter: MDCDataTableAdapter = {
      addClassAtRowIndex: (rowIndex: number, className: string) =>
        this.getRows()[rowIndex].getNativeElement().classList.add(className)

    }

    return new MDCDataTableFoundation(adapter);

  }

  getRows(): MDCDataTableRow[] {
    return this.rows.toArray();
  }




}
