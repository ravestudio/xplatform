import * as React from "react";
import css from "./FinancialEdit.module.css";
import {
  Form,
  FormContext,
  ISubmitResult,
  IValues,
  required,
} from "../../../entities/form";
import { login } from "../../auth/store";
import { config } from "../model";
import { YearAdd } from "./YearAdd";
import { useAppSelector } from "../../../app/hooks";
import { selectActions, selectYears } from "../store";
import { CommonInfo } from "./CommonInfo";
import { editConfig, viewKeys } from "../../../entities/financial";
import { useContext, useEffect } from "react";

export const FinancialEdit: React.FC = () => {
  const years = useAppSelector(selectYears);
  const actions = useAppSelector(selectActions);
  const context = useContext(FormContext);

  useEffect(() => {
    if (actions.length > 0) {
      console.log(context);
    }
  }, [actions]);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await login(values.userName, values.password);

    return result;
  };

  const fields = Object.keys(editConfig).map((key) => ({
    fieldName: key,
    caption: editConfig[key as viewKeys],
  }));

  return (
    <Form
      defaultValues={{
        year1: 2023,
        totalRevenue1: "100",
        costOfRevenue1: "",
        totalOperatingExpenses1: "",
        netIncome1: "",
      }}
      validationRules={{}}
      onSubmit={handleSubmit}
    >
      <CommonInfo />
      <YearAdd />

      {fields.map((field) => {
        return (
          <div className={css.row}>
            <div className={css.fieldTitle}>{field.caption}</div>

            {years.map((year) => {
              return (
                <Form.Field
                  name={field.fieldName + year}
                  type="Number"
                  label=""
                  className={css.field}
                />
              );
            })}
          </div>
        );
      })}
    </Form>
  );
};
