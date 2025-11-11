import { FinancialModel } from "../../../entities/financial";
import { IValues } from "../../../entities/form";

import { viewKeysV2 as viewKeys } from "../../../entities/financial";

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
