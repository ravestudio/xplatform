import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues } from "../../../entities/form";
import { login } from "../../auth/store";
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
import { useEffect, useRef } from "react";
import { FinData, selectFinData } from "../store/financialEditSlice";
import { getField, getFinancialModel } from "../model/utils";

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

      dispatch(removeUiAction(action));
    }
  }, [actions]);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await login(values.userName, values.password);

    return result;
  };

  const groups = Object.keys(editConfig).map((gr) => {
    const group = editConfig[gr as keyof EditGroup];
    return {
      caption: group.caption,
      fields: Object.keys(group.items).map((key) => ({
        fieldName: key,
        fieldType: ["NWC", "EquityAndLiabilities", "EBITDA"].includes(key)
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

    const NWC = f("NWC");
    const EquityAndLiabilities = f("EquityAndLiabilities");
    const EBITDA = f("EBITDA");

    return {
      ...acc,
      [NWC]: (values: IValues) => {
        const model = getModel(values);

        const result =
          model.ChangeInPayable +
          model.ChangeInInventory +
          model.ChangeInReceivables +
          model.ChangeInPrepaidAssets;

        return result.toString();
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

        const result =
          model.NetIncome +
          model.TaxProvision +
          model.InterestExpense +
          model.Depreciation;

        return result.toString();
      },
    };
  }, {});

  return (
    <Form
      ref={refCallback}
      defaultValues={
        draft ?? {
          currency: "USD",
          in: "millions",
        }
      }
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
