import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  Optional,
  Output,
  QueryList,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Platform} from '@angular/cdk/platform';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {MdcRipple} from '../ripple';
import {MdcNotchedOutline} from '../notched-outline';
import {MdcFloatingLabel} from '../floating-label';
import {MdcMenu} from '../menu';
import {MdcLineRipple} from '../line-ripple';
import {
  MdcFormField,
  MdcFormFieldControl,
  ErrorStateMatcher,
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  mixinErrorState
} from '../form-field';
import {MdcList, MdcListItemChange} from '../list';

import {MdcSelectIcon} from './select-icon';
import {MDCSelectHelperText} from './select-helper-text';

import {cssClasses, MDCSelectFoundation} from '@material/select';

/**
 * Represents the default options for mdc-select that can be configured
 * using an `MDC_SELECT_DEFAULT_OPTIONS` injection token.
 */
export interface MdcSelectDefaultOptions {
  outlined?: boolean;
}

/**
 * Injection token that can be used to configure the default options for all
 * mdc-select usage within an app.
 */
export const MDC_SELECT_DEFAULT_OPTIONS =
  new InjectionToken<MdcSelectDefaultOptions>('MDC_SELECT_DEFAULT_OPTIONS');

class MdcSelectBase {
  constructor(
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl) {}
}

const _MdcSelectMixinBase: CanUpdateErrorStateCtor & typeof MdcSelectBase =
  mixinErrorState(MdcSelectBase);

export class MdcSelectChange {
  constructor(
    public source: MdcSelect,
    public index: number,
    public value: any) {}
}

@Directive({
  selector: 'option',
  exportAs: 'mdcSelectOption',
})
export class MdcSelectOption {}

let nextUniqueId = 0;

@Component({
  selector: 'mdc-select',
  exportAs: 'mdcSelect',
  host: {
    '[id]': 'id',
    'class': 'mdc-select',
    '[class.mdc-select--disabled]': 'disabled',
    '[class.mdc-select--outlined]': 'outlined',
    '[class.mdc-select--required]': 'required',
    '[class.mdc-select--with-leading-icon]': 'leadingIcon',
    '[class.mdc-select--invalid]': 'errorState && !focused'
  },
  template: `
  <ng-content select="mdc-icon"></ng-content>
  <ng-container *ngIf="_list">
    <div #selectedText class="mdc-select__selected-text"
      [tabindex]="disabled ? '-1' : '0'"
      (blur)="onBlur()"
      (change)="onChange($event)"
      (focus)="onFocus()"
      (keydown)="onKeydown($event)"
      (click)="onInteraction($event)">{{_enhancedSelectedText}}</div>
    <ng-content select="mdc-menu"></ng-content>
  </ng-container>
  <i class="mdc-select__dropdown-icon"></i>
  <select #nativeSelect *ngIf="!_list"
   class="mdc-select__native-control"
   [attr.aria-describedby]="_ariaDescribedby || null"
   [required]="required"
   [value]="value"
   (click)="onInteraction($event)"
   (blur)="onBlur()"
   (change)="onChange($event)"
   (focus)="onFocus()">
    <ng-content></ng-content>
  </select>
  <label mdcFloatingLabel *ngIf="!outlined" [for]="id">{{placeholderText}}</label>
  <mdc-line-ripple *ngIf="!outlined"></mdc-line-ripple>
  <mdc-notched-outline *ngIf="outlined" [label]="placeholderText" [for]="id"></mdc-notched-outline>
  `,
  providers: [
    MdcRipple,
    {provide: MdcFormFieldControl, useExisting: MdcSelect}
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdcSelect extends _MdcSelectMixinBase implements AfterContentInit, AfterViewInit, DoCheck,
  OnDestroy, ControlValueAccessor, CanUpdateErrorState {
  /** Emits whenever the component is destroyed. */
  private _destroyed = new Subject<void>();

  private _uniqueId: string = `mdc-select-${++nextUniqueId}`;

  controlType: string = 'mdc-select';
  _enhancedSelectedText: string = '';
  focused: boolean = false;

  @Input() id: string = this._uniqueId;
  @Input() name: string | null = null;

  /** The aria-describedby attribute on the input for improved a11y. */
  _ariaDescribedby?: string;

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
  }
  private _placeholder: string = '';

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this.setDisabledState(value);
  }
  private _disabled: boolean = false;

  @Input()
  get floatLabel(): boolean {
    return this._floatLabel;
  }
  set floatLabel(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._floatLabel) {
      this._floatLabel = newValue;
      this.layout();
    }
  }
  private _floatLabel: boolean = true;

  @Input()
  get outlined(): boolean {
    return this._outlined;
  }
  set outlined(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._outlined) {
      this._outlined = newValue || (this._defaults && this._defaults.outlined) || false;
      this.layout();
    }
  }
  private _outlined: boolean = false;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._required) {
      this._required = newValue;
      if (this._foundation) {
        if (!this._required) {
          this.valid = true;
          this._changeDetectorRef.markForCheck();
        }

        if (this.ngControl && !this._isEnhancedVariant()) {
          this._required ? this._getInputElement().setAttribute('required', '') :
            this._getInputElement().removeAttribute('required');
        }
      }
    }
  }
  private _required: boolean = false;

  @Input()
  get valid(): boolean | undefined {
    return this._valid;
  }
  set valid(value: boolean | undefined) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._valid) {
      this._valid = newValue;

      if (this._foundation && this._valid !== undefined) {
        this._foundation.setValid(this._valid);
      }
    }
  }
  private _valid: boolean | undefined;

  @Input()
  get autosize(): boolean {
    return this._autosize;
  }
  set autosize(value: boolean) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._autosize) {
      this._autosize = newValue;
      this._setWidth();
    }
  }
  private _autosize: boolean = false;

  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    this._compareWith = fn;
  }
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** Value of the select control. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    this.setSelectionByValue(newValue);
  }
  private _value: any = '';

  @Input()
  get helperText(): MDCSelectHelperText | null {
    return this._helperText;
  }
  set helperText(helperText: MDCSelectHelperText | null) {
    if (this._helperText !== helperText) {
      this._helperText = helperText;
      this._initHelperText();
    }
  }
  private _helperText: MDCSelectHelperText | null = null;

  /** An object used to control when error messages are shown. */
  @Input() errorStateMatcher?: ErrorStateMatcher;

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange: EventEmitter<MdcSelectChange> =
    new EventEmitter<MdcSelectChange>();

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   */
  @Output() readonly valueChange:
    EventEmitter<{index: number, value: any}> = new EventEmitter<any>();
  @Output() readonly blur = new EventEmitter<any>();

  @ViewChild(MdcFloatingLabel, {static: false}) _floatingLabel?: MdcFloatingLabel;
  @ViewChild(MdcLineRipple, {static: false}) _lineRipple?: MdcLineRipple;
  @ViewChild(MdcNotchedOutline, {static: false}) _notchedOutline?: MdcNotchedOutline;
  @ViewChild('nativeSelect', {static: false}) _nativeSelect!: ElementRef<HTMLSelectElement>;
  @ViewChild('selectedText', {static: false}) _selectedText!: ElementRef<HTMLElement>;
  @ContentChild(MdcMenu, {static: false}) _menu!: MdcMenu;
  @ContentChild(MdcSelectIcon, {static: false}) leadingIcon?: MdcSelectIcon;
  @ContentChild(MdcList, {static: false}) _list!: MdcList;

  @ContentChildren(MdcSelectOption) _options!: QueryList<MdcSelectOption>;

  /** View to model callback called when value changes */
  _onChange: (value: any) => void = () => {};

  /** View to model callback called when select has been touched */
  _onTouched = () => {};

  get placeholderText(): string {
    return !this._hasFloatingLabel() && this.getValue() ? '' : this.placeholder;
  }

  private _createAdapter() {
    return Object.assign(
      this._isEnhancedVariant() ? this._getEnhancedSelectAdapterMethods() : this._getNativeSelectAdapterMethods(),
      this._getCommonAdapterMethods(),
      this._getOutlineAdapterMethods(),
      this._getLabelAdapterMethods()
    );
  }

  private _getCommonAdapterMethods() {
    return {
      addClass: (className: string) => this._getHostElement().classList.add(className),
      removeClass: (className: string) => this._getHostElement().classList.remove(className),
      hasClass: (className: string) => this._getHostElement().classList.contains(className),
      setRippleCenter: (normalizedX: number) => this._lineRipple && this._lineRipple.setRippleCenter(normalizedX),
      activateBottomLine: () => {
        if (this._lineRipple) {
          this._lineRipple.activate();
        }
      },
      deactivateBottomLine: () => {
        if (this._lineRipple) {
          this._lineRipple.deactivate();
        }
      },
      notifyChange: (value: any) =>
        this.selectionChange.emit(new MdcSelectChange(this, this.getSelectedIndex(), value))
    };
  }

  private _getNativeSelectAdapterMethods() {
    return {
      getValue: () => this._platform.isBrowser ? this._getInputElement().value : '',
      setValue: (value: any) => this._getInputElement().value = value,
      isMenuOpen: () => false,
      setSelectedIndex: (index: number) => this._getInputElement().selectedIndex = index,
      setDisabled: (isDisabled: boolean) => this._getInputElement().disabled = isDisabled,
      setValid: (isValid: boolean) => {
        if (this.ngControl) {
          return;
        }

        isValid ? this._getHostElement().classList.remove(cssClasses.INVALID) :
          this._getHostElement().classList.add(cssClasses.INVALID);
      },
      checkValidity: () => this._getInputElement().checkValidity()
    };
  }

  private _getEnhancedSelectAdapterMethods() {
    return {
      getValue: () => this.getValue() || '',
      openMenu: () => {
        if (this._menu && !this._menu.open) {
          this._menu.open = true;
          this._selectedText!.nativeElement.setAttribute('aria-expanded', 'true');
        }
      },
      closeMenu: () => {
        if (this._menu && this._menu.open) {
          this._menu.open = false;
        }
      },
      isMenuOpen: () => this._menu && this._menu.open,
      setDisabled: (isDisabled: boolean) => {
        this._selectedText.nativeElement.setAttribute('aria-disabled', isDisabled.toString());
      },
      checkValidity: () => this._isValid(),
      setValid: (isValid: boolean) => {
        this._selectedText.nativeElement.setAttribute('aria-invalid', (!isValid).toString());
        this._valid = isValid;
        isValid ? this._getHostElement().classList.remove(cssClasses.INVALID) :
          this._getHostElement().classList.add(cssClasses.INVALID);
      }
    };
  }

  private _getOutlineAdapterMethods() {
    return {
      hasOutline: () => !!this._notchedOutline,
      notchOutline: (labelWidth: number) => this._notchedOutline!.notch(labelWidth),
      closeOutline: () => this._notchedOutline!.closeNotch()
    };
  }

  private _getLabelAdapterMethods() {
    return {
      floatLabel: (shouldFloat: boolean) => this._getFloatingLabel().float(shouldFloat),
      getLabelWidth: () => this._hasFloatingLabel() ? this._getFloatingLabel()!.getWidth() : 0
    };
  }

  /** Returns a map of all subcomponents to subfoundations.*/
  private _getFoundationMap() {
    return {
      helperText: this._helperText ? this._helperText.foundation : undefined
    };
  }

  private _foundation!: {
    setSelectedIndex(index: number): void,
    setValue(value: any): void,
    setDisabled(isDisabled: boolean): void,
    notchOutline(openNotch: boolean): void,
    handleChange(didChange?: boolean): void,
    handleFocus(): void,
    handleBlur(): void,
    handleClick(normalizedX: number): void,
    handleKeydown(event: KeyboardEvent): void,
    setValid(isValid: boolean): void,
    layout(): void,
    handleMenuOpened(): void,
    handleMenuClosed(): void
  };

  constructor(
    private _platform: Platform,
    private _changeDetectorRef: ChangeDetectorRef,
    public elementRef: ElementRef<HTMLElement>,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() private _parentFormField: MdcFormField,
    @Optional() private _ripple: MdcRipple,
    @Self() @Optional() public ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    @Optional() @Inject(MDC_SELECT_DEFAULT_OPTIONS) private _defaults: MdcSelectDefaultOptions) {

    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    if (this._parentFormField) {
      _parentFormField.elementRef.nativeElement.classList.add('ngx-form-field-select');
    }

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngAfterContentInit(): void {
    this._setDefaultOptions();
  }

  ngAfterViewInit(): void {
    this.init();

    if (!this._isEnhancedVariant()) {
      this._options.changes.pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          this._getFloatingLabel().float(!!this.getValue());

          if (this.outlined) {
            this.getValue() ?
              this._notchedOutline!.notch(this._getFloatingLabel().getWidth()) : this._notchedOutline!.closeNotch();
          }
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy();
  }

  ngDoCheck(): void {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }

  init(): void {
    this._foundation = new MDCSelectFoundation(this._createAdapter(), this._getFoundationMap());
    this._changeDetectorRef.detectChanges();

    // initialize after running a detectChanges()
    if (!this.outlined) {
      this._ripple = new MdcRipple(this._nativeSelect ? this._nativeSelect : this._selectedText);
    }
    this._initializeSelection();
    this._setWidth();
    this._enhancedSelectSetup();
    this._foundation.handleChange(false);
  }

  writeValue(value: any): void {
    this.setSelectionByValue(value, false);
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onChange(event: Event): void {
    this.setSelectionByValue((<any>event.target).value);
    event.stopPropagation();
  }

  onBlur(): void {
    if (!this.disabled) {
      this._foundation.handleBlur();
      this._onTouched();
      this.focused = false;
      this.blur.emit(this.value);
    }
  }

  onFocus(): void {
    if (!this.disabled) {
      this._foundation.handleFocus();
      this._onTouched();
      this.focused = true;
    }
  }

  onInteraction(evt: MouseEvent | TouchEvent): void {
    if (this._selectedText) {
      this._selectedText.nativeElement.focus();
    }
    this._foundation.handleClick(this._getNormalizedXCoordinate(evt));
  }

  onKeydown(evt: KeyboardEvent): void {
    this._foundation.handleKeydown(evt);
  }

  getValue(): any {
    return this._value;
  }

  getSelectedIndex(): number {
    if (this._isEnhancedVariant()) {
      return this._list ? this._list.getSelectedIndex() : -1;
    }

    return (<HTMLSelectElement>this._getInputElement()).selectedIndex || -1;
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  setSelectionByValue(value: any, isUserInput: boolean = true): void {
    if (!this._foundation) {
      return;
    }

    this._setEnhancedSelection(value); // if enhanced select, perform selection

    this._value = value !== null ? value : '';
    if (!this.isValueEmpty()) {
      this._foundation.setValue(this._value);
    }

    this.valueChange.emit({index: this.getSelectedIndex(), value: this._value});

    if (isUserInput) {
      this._onChange(this._value);
    }

    if (this.isValueEmpty()) {
      this._getFloatingLabel().float(false);
      this._foundation.notchOutline(false);
    }
    this._changeDetectorRef.markForCheck();
  }

  setSelectedIndex(index: number): void {
    if (this._isEnhancedVariant()) {
      this._list.setSelectedIndex(index);
      this._getEnhancedSelectAdapterMethods().closeMenu();
    } else {
      this._getNativeSelectAdapterMethods().setSelectedIndex(index);
    }

    const value = this._isEnhancedVariant() ? this._list.getSelectedValue() : this._getInputElement().value;
    this.setSelectionByValue(value);
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    if (this._foundation) {
      this._foundation.setDisabled(this._disabled);
    }
    this._changeDetectorRef.markForCheck();
  }

  focus(): void {
    if (!this.disabled) {
      this._isEnhancedVariant() ? this._selectedText.nativeElement.focus() : this._getInputElement().focus();
    }
  }

  reset(): void {
    if (this._isEnhancedVariant()) {
      this._enhancedSelectedText = '';
      this._list.reset();
    }
    this._value = '';
    this.setSelectedIndex(-1);
    this._foundation.setValid(true);
  }

  isValueEmpty(): boolean {
    return (this._value === undefined || this._value === null) || this._value.length === 0 ? true : false;
  }

  /** Initialize Select internal state based on the environment state */
  private layout(): void {
    if (this._foundation) {
      this._destroy();
    }

    this.init();
    this._changeDetectorRef.markForCheck();

    if (this._outlined) {
      this._foundation.layout();
    }
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      const value = this.ngControl ? this.ngControl.value : this._value;
      if (value) {
        this.setSelectionByValue(value, false);
        this._foundation.layout();
      }
    });
  }

  private _initHelperText(): void {
    const helper = this.helperText;
    if (helper) {
      helper.init();
    }
  }

  /** Set the default options. */
  private _setDefaultOptions(): void {
    if (this._defaults && this._defaults.outlined) {
      this._outlined = this._defaults.outlined;
    }
  }

  private _destroy(): void {
    this._destroyed.next();
    this._destroyed.complete();

    if (this._lineRipple) {
      this._lineRipple.destroy();
    }
    if (this._ripple) {
      this._ripple.destroy();
    }
  }

  private _isEnhancedVariant(): boolean {
    return !!this._list;
  }

  private _setEnhancedSelection(value: any): void {
    if (this._isEnhancedVariant()) {
      this._list.setSelectedValue(value);
      this._enhancedSelectedText = this._list.getSelectedText();
      this._menu.open = false;
    }
  }

  private _enhancedSelectSetup(): void {
    if (this._isEnhancedVariant()) {
      this._menu.elementRef.nativeElement.classList.add('mdc-select__menu');
      this._menu.hoistToBody = true;
      this._menu.anchorElement = this._getHostElement();
      this._menu.wrapFocus = false;

      this._list.useSelectedClass = true;
      this._list.singleSelection = true;

      // Subscribe to menu opened event
      this._menu.opened.pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          this._foundation.handleMenuOpened();
          const selectedIndex = this._list.getSelectedIndex();
          if (selectedIndex > -1) {
            this._list.items.toArray()[selectedIndex].focus();
          }
        });

      // Subscribe to menu closed event
      this._menu.closed.pipe(takeUntil(this._destroyed))
        .subscribe(() => {
          this._foundation.handleMenuClosed();
          this._selectedText.nativeElement.removeAttribute('aria-expanded');
          if (this._platform.isBrowser) {
            if (document.activeElement !== this._selectedText.nativeElement) {
              this._foundation.handleBlur();
            }
          }
        });

      // Subscribe to menu selected event
      this._list.selectionChange.pipe(takeUntil(this._destroyed))
        .subscribe((evt: MdcListItemChange) => {
          this.setSelectionByValue(evt.option.value, true);
        });
    }
  }

  private _isValid(): boolean {
    if (this.ngControl) {
      return !this.errorState;
    }

    if (this.required && !this.disabled) {
      return this.getSelectedIndex() !== -1 && (this.getSelectedIndex() !== 0 || !this.isValueEmpty());
    }
    return true;
  }

  private _hasFloatingLabel(): boolean {
    return (this.placeholder && this.floatLabel) || this._required
      && (this._floatingLabel || this._notchedOutline) ? true : false;
  }

  private _getFloatingLabel(): MdcFloatingLabel {
    return this._floatingLabel || this._notchedOutline!.floatingLabel;
  }

  /**
   * Calculates where the line ripple should start based on the x coordinate within the component.
   */
  private _getNormalizedXCoordinate(evt: MouseEvent | TouchEvent): number {
    const targetClientRect = (<HTMLElement>evt.target).getBoundingClientRect();
    if (evt instanceof MouseEvent) {
      return evt.clientX - targetClientRect.left;
    }
    const clientX = evt.touches[0] && evt.touches[0].clientX;
    return clientX - targetClientRect.left;
  }

  private _setWidth(): void {
    if (this.placeholder && this.autosize) {
      const labelLength = this.placeholder.length;
      this._getHostElement().style.setProperty('width', `${labelLength}rem`);
    } else {
      this._getHostElement().style.removeProperty('width');
    }
  }

  /** Retrieves the select input element. */
  private _getInputElement(): HTMLSelectElement {
    return this._nativeSelect.nativeElement;
  }

  /** Retrieves the DOM element of the component host. */
  private _getHostElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
