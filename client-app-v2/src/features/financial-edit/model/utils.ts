import { FinancialModel } from "../../../entities/financial";
import { IValues } from "../../../entities/form";

import { viewKeysV2 as viewKeys } from "../../../entities/financial";
import { FinancialPayload } from "../store/financialEditSlice";

//type modelKeys = keyof FinancialModel;

export const getField = (field: viewKeys, year: number) => `${field}${year}`;

export const getFinancialModel = <T>(values: IValues, year: number): T => {
  const keys = Object.keys(values).filter((key) =>
    key.endsWith(year.toString())
  );

  const value = keys.reduce((acc, key: string) => {
    const modelKey = key.substring(0, key.length - year.toString().length);

    return {
      ...acc,
      [modelKey]: Number.parseFloat(values[key]),
    };
  }, {} as T);

  return value;
};

export const getFinancialFormValues = (
  model: FinancialModel,
  yearIndex: number
): IValues => {
  const values = Object.keys(model).reduce((acc, current) => {
    return {
      ...acc,
      [getField(current as viewKeys, yearIndex)]: String(
        model[current as keyof FinancialModel]
      ),
    };
  }, {} as IValues);

  return values;
};

export const GetFormValues = (payload: FinancialPayload): IValues => {
  const values = payload.financials.reduce((acc, current, index) => {
    return { ...acc, ...getFinancialFormValues(current.data, index + 1) };
  }, {} as IValues);

  const yearsValue = payload.financials.reduce((acc, current, index) => {
    return { ...acc, [`year${index + 1}`]: String(current.year) };
  }, {} as IValues);

  return { code: payload.code, unit: payload.unit, ...yearsValue, ...values };
};

export const getNWC = (model: FinancialModel) => {
  return (
    model.ChangeInPayable +
    model.ChangeInInventory +
    model.ChangeInReceivables +
    model.ChangeInPrepaidAssets
  );
};

export const getEBITDA = (model: FinancialModel) => {
  return (
    model.NetIncome +
    model.TaxProvision +
    model.InterestExpense -
    model.InterestIncome +
    model.Depreciation +
    model.ImpairmentOfCapitalAssets
  );
};

export const getOCF = (model: FinancialModel) => {
  return getEBITDA(model) + getNWC(model);
};

export const getFCF = (model: FinancialModel) => {
  return getOCF(model) + model.CapitalExpenditure;
};
