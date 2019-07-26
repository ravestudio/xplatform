import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { emitent } from '../../Entity/Emitent';
import { financial } from '../../Entity/Financial';

import { EmitentService } from '../../Services/emitent.service';
import { FinancialService } from '../../Services/financial.service';

@Component({
  selector: 'app-financial-edit',
  templateUrl: './financial-edit.component.html',
  styleUrls: ['./financial-edit.component.css']
})
export class FinancialEditComponent implements OnInit {

  financial: financial;

  commonForm: FormGroup;
  incomesForm: FormGroup;
  assetsForm: FormGroup;
  flowForm: FormGroup;

  emitents: emitent[];

  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private emitentService: EmitentService,
    private financialService: FinancialService) {

    this.commonForm = fb.group({
      'emitentId': ['', Validators.required],
      'year': ['', Validators.required]
    });

    this.incomesForm = fb.group({
      'revenue': ['', Validators.required],
      'operatingIncome': ['', Validators.required],
      'operatingExpenses': [{ value: '', disabled: true }],
      'netIncome': ['', Validators.required],
      'earningsPerShare': ['', Validators.required],
      'price': ['', Validators.required]
    });

    this.assetsForm = fb.group({
      'currentAssets': ['', Validators.required],
      'fixedAssets': ['', Validators.required],
      'totalAssets': { value: '', disabled: true },

      'currentLiabilities': ['', Validators.required],
      'longTermLiabilities': ['', Validators.required],
      'totalLiabilities': { value: '', disabled: true },

      'equity': { value: '', disabled: true }
    });

    this.flowForm = fb.group({
      'flowOperatingActivities': ['', Validators.required],
      'amortization': ['', Validators.required],
      'nwc': ['', Validators.required],
      'flowInvestingActivities': ['', Validators.required],
      'capex': ['', Validators.required],
      'incomeTaxPaid': ['', Validators.required],
      'flowFinancingActivities': ['', Validators.required],
      'stockIssuance': ['', Validators.required],
      'dividendsPaid': ['', Validators.required],
      'ebitda': { value: '', disabled: true },
      'fcf': { value: '', disabled: true }
    });

    let revenueObs = this.incomesForm.controls['revenue'].valueChanges;
    let incomeObs = this.incomesForm.controls['operatingIncome'].valueChanges;

    let currAssetsObs = this.assetsForm.controls['currentAssets'].valueChanges;
    let fixAssetsObs = this.assetsForm.controls['fixedAssets'].valueChanges;
    //let totalAssetsObs = this.assetsForm.controls['totalAssets'].valueChanges;

    let currentLiabObs = this.assetsForm.controls['currentLiabilities'].valueChanges;
    let longTermLiabObs = this.assetsForm.controls['longTermLiabilities'].valueChanges;
    //let totalLiabObs = this.assetsForm.controls['totalLiabilities'].valueChanges;

    let amortizObs = this.flowForm.controls['amortization'].valueChanges;

    let incomeTaxObs = this.flowForm.controls['incomeTaxPaid'].valueChanges;
    let ebitdaObs = this.flowForm.controls['ebitda'].valueChanges;
    let capexObs = this.flowForm.controls['capex'].valueChanges;
    let nwcObs = this.flowForm.controls['nwc'].valueChanges;

    combineLatest(revenueObs, incomeObs).subscribe(([rev, inc]) => {
      this.incomesForm.controls['operatingExpenses'].setValue(rev - inc);
    });

    combineLatest(currAssetsObs, fixAssetsObs).subscribe(([curr, fix]) => {
      this.assetsForm.controls['totalAssets'].setValue(curr + fix);
    });

    combineLatest(currentLiabObs, longTermLiabObs).subscribe(([curr, long]) => {
      this.assetsForm.controls['totalLiabilities'].setValue(curr + long);
    });

    combineLatest(currAssetsObs, fixAssetsObs, currentLiabObs, longTermLiabObs).subscribe(([asset1, asset2, liab1, liab2]) => {
      this.assetsForm.controls['equity'].setValue(asset1 + asset2 - liab1 - liab2);
    });

    combineLatest(incomeObs, amortizObs).subscribe(([income, amort]) => {
      this.flowForm.controls['ebitda'].setValue(income + amort);
    });

    combineLatest(ebitdaObs, incomeTaxObs, capexObs, nwcObs)
      .subscribe(([ebitda, incomeTax, capex, nwc]) => {
        this.flowForm.controls['fcf'].setValue(ebitda - incomeTax - capex + nwc);
    })


  }

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap((_param) => {
        const Id = Number(_param.get("id"));

        let finObs: Observable<financial> = null;

        if (Id == 0) {
          finObs = of(new financial());
        }
        else {
          finObs = this.financialService.get(Id);
        }
        return finObs;

      })).subscribe(fin => {

        this.financial = fin;

        this.commonForm.patchValue(fin);
        this.incomesForm.patchValue(fin);
        this.assetsForm.patchValue(fin);
        this.flowForm.patchValue(fin);
      });

    this.emitentService.get().subscribe(data => {
      this.emitents = data;
    });
  }

  Save(): void {

    let _commonInfo = this.commonForm.getRawValue();
    let _income = this.incomesForm.getRawValue();
    let _assets = this.assetsForm.getRawValue();
    let _flows = this.flowForm.getRawValue();

    this.financial.emitentId = _commonInfo.emitentId;
    this.financial.year = _commonInfo.year;

    this.financial.revenue = _income.revenue;
    this.financial.operatingIncome = _income.operatingIncome;
    this.financial.netIncome = _income.netIncome;
    this.financial.earningsPerShare = _income.earningsPerShare;
    this.financial.price = _income.price;

    this.financial.currentAssets = _assets.currentAssets;
    this.financial.fixedAssets = _assets.fixedAssets;

    this.financial.currentLiabilities = _assets.currentLiabilities;
    this.financial.longTermLiabilities = _assets.longTermLiabilities;

    this.financial.flowOperatingActivities = _flows.flowOperatingActivities;
    this.financial.amortization = _flows.amortization;
    this.financial.nwc = _flows.nwc;

    this.financial.flowInvestingActivities = _flows.flowInvestingActivities;
    this.financial.capex = _flows.capex;

    this.financial.flowFinancingActivities = _flows.flowFinancingActivities;
    this.financial.incomeTaxPaid = _flows.incomeTaxPaid;
    this.financial.stockIssuance = _flows.stockIssuance;
    this.financial.dividendsPaid = _flows.dividendsPaid;

    if (this.financial.id == undefined) {

      this.financialService.post(this.financial).subscribe(r => {
        console.log(r);
      });
    }

    if (this.financial.id > 0) {

      this.financialService.update(this.financial).subscribe(r => {
        console.log(r);
      });
    }

  }

}
