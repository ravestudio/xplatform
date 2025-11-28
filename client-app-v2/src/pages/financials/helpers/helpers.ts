export const val = (value: any) => {
  return value?.raw ?? 0;
};

export function calcGross(inc: any) {
  return {
    raw: val(inc?.totalRevenue) - val(inc?.costOfRevenue),
  };
}

export function calcSGA(inc: any) {
  return {
    raw: val(calcGross(inc)) - val(inc?.operatingIncome),
  };
}

export function calcEBITDA(inc: any, fl: any) {
  /*model.NetIncome +
    model.TaxProvision +
    model.InterestExpense -
    model.InterestIncome +
    model.Depreciation +
    model.ImpairmentOfCapitalAssets*/

  return {
    raw:
      val(inc?.netIncome) +
      val(inc?.incomeTaxExpense) +
      val(inc?.interestExpense) -
      val(inc?.interestIncome) +
      val(fl?.depreciation) +
      val(fl?.impairmentOfCapitalAssets),
  };
}

export function calcNWC(fl: any) {
  return {
    raw:
      val(fl.changeToLiabilities) +
      val(fl.changeToInventory) +
      val(fl.changeToAccountReceivables) +
      val(fl.changeToOperatingActivities),
  };
}

export function calcOCF(inc: any, fl: any) {
  return {
    raw:
      val(calcEBITDA(inc, fl)) +
      val(calcNWC(fl)) -
      val(inc.incomeTaxExpense) -
      val(inc.interestExpense),
  };
}

export function calcFCF(inc: any, fl: any) {
  return {
    raw: val(calcOCF(inc, fl)) + val(fl.capitalExpenditures),
  };
}
