import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues, required } from "../../../entities/form";
import { login } from "../../auth/store";
import { config } from "../model";
import { YearAdd } from "./YearAdd";
import { useAppSelector } from "../../../app/hooks";
import { selectYears } from "../store";
import { CommonInfo } from "./CommonInfo";

const FinancialEdit: React.FC = () => {
  const years = useAppSelector(selectYears);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await login(values.userName, values.password);

    return result;
  };

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

      {config.fields.map((field) => {
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

export default FinancialEdit;
