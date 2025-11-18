import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues } from "../../../entities/form";
import { YearAdd } from "./YearAdd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadForm, removeUiAction, selectActions, selectYears } from "../store";
import { CommonInfo } from "./CommonInfo";
import {
  editConfigV2 as editConfig,
  EditGroup,
  FinancialModel,
  viewKeysV2 as viewKeys,
} from "../../../entities/financial";
import { useEffect, useMemo, useRef } from "react";
import {
  FinancialPayload,
  FinData,
  loadStoredAsync,
  saveFinancial,
  selectFinData,
} from "../store/financialEditSlice";
import {
  getEBITDA,
  getFCF,
  getField,
  getFinancialModel,
  getNWC,
  getOCF,
} from "../model/utils";

const defValues = {
  currency: "USD",
  unit: "millions",
};

export const FinancialEdit: React.FC = () => {
  const dispatch = useAppDispatch();
  const years = useAppSelector(selectYears);
  const actions = useAppSelector(selectActions);
  const draft = useAppSelector(selectFinData);

  const formRef = useRef<Form | null>();

  useEffect(() => {
    if (actions.length > 0) {
      const action = actions[0];
      if (action.type === "saveDraft") {
        localStorage.setItem(
          "financialDraft",
          JSON.stringify({
            years,
            values: formRef.current?.getValues(),
          })
        );
      }

      if (action.type === "loadDraft") {
        const jsonValue = localStorage.getItem("financialDraft");
        const value: FinData | null = jsonValue ? JSON.parse(jsonValue) : null;

        if (value) {
          dispatch(loadForm(value));
        }
      }

      if (action.type === "loadStored") {
        const values = formRef.current?.getValues();

        if (!values) return;

        dispatch(
          loadStoredAsync({
            code: String(values["code"]),
            unit: String(values["unit"]),
            years: years.reduce<number[]>(
              (acc, current) => [...acc, values[`year${current}`]],
              []
            ),
          })
        );
      }

      dispatch(removeUiAction(action));
    }
  }, [actions]);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const payload = years.reduce<FinancialPayload>(
      (acc, year) => {
        return {
          ...acc,
          financials: [
            ...acc.financials,
            {
              year: values[`year${year}`],
              data: getFinancialModel<FinancialModel>(values, year),
            },
          ],
        };
      },
      {
        code: String(values["code"]),
        currency: String(values["currency"]),
        unit: String(values["unit"]),
        financials: [],
      }
    );

    const result = await saveFinancial(payload);

    return result;
  };

  const groups = Object.keys(editConfig).map((gr) => {
    const group = editConfig[gr as keyof EditGroup];
    return {
      caption: group.caption,
      fields: Object.keys(group.items).map((key) => ({
        fieldName: key,
        fieldType: [
          "GrossProfit",
          "SellingGeneralAndAdministration",
          "NWC",
          "EquityAndLiabilities",
          "EBITDA",
          "OCF",
          "FCF",
        ].includes(key)
          ? "Computed"
          : "Number",
        caption: group.items[key as viewKeys],
      })),
    };
  });

  const refCallback = (el: Form | null) => {
    formRef.current = el;
  };

  const computed = years.reduce((acc, y) => {
    const getModel = (values: IValues) =>
      getFinancialModel<FinancialModel>(values, y);

    const f = (field: viewKeys) => getField(field, y);

    const GrossProfit = f("GrossProfit");
    const SGA = f("SellingGeneralAndAdministration");
    const NWC = f("NWC");
    const EquityAndLiabilities = f("EquityAndLiabilities");
    const EBITDA = f("EBITDA");
    const OCF = f("OCF");
    const FCF = f("FCF");

    return {
      ...acc,
      [GrossProfit]: (values: IValues) => {
        const model = getModel(values);

        const result = model.TotalRevenue - model.CostOfRevenue;

        return result.toString();
      },
      [SGA]: (values: IValues) => {
        const model = getModel(values);

        const result =
          model.TotalRevenue - model.CostOfRevenue - model.OperatingIncome;

        return result.toString();
      },
      [NWC]: (values: IValues) => {
        const model = getModel(values);

        const nwc = getNWC(model);

        return nwc.toString();
      },

      [EquityAndLiabilities]: (values: IValues) => {
        const model = getModel(values);

        const result =
          model.TotalLiabilitiesNetMinorityInterest +
          model.StockholdersEquity +
          model.MinorityInterest;

        return result.toString();
      },

      [EBITDA]: (values: IValues) => {
        const model = getModel(values);

        const ebitda = getEBITDA(model);

        return ebitda.toString();
      },

      [OCF]: (values: IValues) => {
        const model = getModel(values);

        const ocf = getOCF(model);

        return ocf.toString();
      },
      [FCF]: (values: IValues) => {
        const model = getModel(values);

        const fcf = getFCF(model);

        return fcf.toString();
      },
    };
  }, {});

  return (
    <Form
      ref={refCallback}
      defaultValues={draft ?? defValues}
      validationRules={{}}
      computed={computed}
      onSubmit={handleSubmit}
    >
      <CommonInfo />
      <YearAdd />

      <div className={css.groupList}>
        {groups.map((gr, grIndex) => (
          <div key={grIndex} className={css.group}>
            <div className={css.groupCaption}>{gr.caption}</div>

            <div className={css.groupBody}>
              {gr.fields.map((field) => {
                return (
                  <div key={field.fieldName} className={css.row}>
                    <div className={css.fieldTitle}>{field.caption}</div>

                    {years.map((year) => {
                      return (
                        <Form.Field
                          key={field.fieldName + year}
                          name={field.fieldName + year}
                          type={
                            field.fieldType === "Computed"
                              ? "Computed"
                              : "Number"
                          }
                          label=""
                          className={css.field}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};
