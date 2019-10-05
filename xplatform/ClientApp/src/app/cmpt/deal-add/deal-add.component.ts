import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { security } from '../../Entity/Security';
import { account } from '../../Entity/Account';
import { OperationEnum } from '../../Entity/OperationEnum';

import { SecurityService } from '../../Services/security.service';
import { AccountService } from '../../Services/account.service';
import { combineLatest } from 'rxjs';


@Component({
  selector: 'app-deal-add',
  templateUrl: './deal-add.component.html',
  styleUrls: ['./deal-add.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DealAddComponent implements OnInit {

  securities: security[];
  accounts: account[];

  dealForm: FormGroup;

  operations = OperationEnum;

  constructor(private fb: FormBuilder,
    private securityService: SecurityService,
    private accountService: AccountService) {
    this.dealForm = fb.group({
      'securityId': ['', Validators.required],
      'accountId': ['', Validators.required],
      'operation': ['', Validators.required],
      'price': ['', Validators.required],
      'count': ['', Validators.required],
      'volume': [{ value: '', disabled: true }]
    });

    let priceObs = this.dealForm.controls['price'].valueChanges;
    let countObs = this.dealForm.controls['count'].valueChanges;

    combineLatest(priceObs, countObs).subscribe(([price, count]) => {
      this.dealForm.controls['volume'].setValue(price * count);
    });

  }

  ngOnInit() {
    this.securityService.getAll().subscribe(data => {
      this.securities = data;
    });

    this.accountService.getAll().subscribe(data => {
      this.accounts = data;
    });
  }

}
