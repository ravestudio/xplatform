import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues, required } from "../../../entities/form";
import { login } from "../../auth/store";

const FinancialEdit: React.FC = () => {
  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await login(values.userName, values.password);

    return result;
  };

  return (
    <Form
      defaultValues={{
        totalRevenue1: "100",
        totalRevenue2: "120",
        costOfRevenue: "",
        totalOperatingExpenses: "",
        netIncome: "",
      }}
      validationRules={{}}
      onSubmit={handleSubmit}
    >
      <div className={css.row}>
        <div>Total Revenue</div>
        <Form.Field name="totalRevenue1" label="totalRevenue" />
        <Form.Field name="totalRevenue2" label="totalRevenue" />
      </div>
      <Form.Field name="costOfRevenue" label="costOfRevenue" />
      <Form.Field
        name="totalOperatingExpenses"
        label="totalOperatingExpenses"
      />
      <Form.Field name="netIncome" label="netIncome" />
    </Form>
  );
};

export default FinancialEdit;
