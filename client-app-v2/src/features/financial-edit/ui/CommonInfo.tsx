import { Form } from "../../../entities/form";
import css from "./FinancialEdit.module.css";

export const CommonInfo = () => {
  return (
    <div className="container column">
      <div>Common</div>
      <div className={css.row}>
        <Form.Field name="code" label="code" className={css.fieldTitle} />
        <Form.Field
          type="Select"
          name="currency"
          options={["RUB", "USD"]}
          label="currency"
          className={css.field}
        />
        <Form.Field
          type="Select"
          options={["thousands", "millions"]}
          name="unit"
          label="unit"
          className={css.field}
        />
      </div>
    </div>
  );
};
