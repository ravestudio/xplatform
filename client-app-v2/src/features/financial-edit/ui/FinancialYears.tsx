import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues, required } from "../../../entities/form";
import { resolve } from "dns";

const FinancialYars: React.FC = () => {
  const handleSubmit = (values: IValues): Promise<ISubmitResult> => {
    return new Promise<ISubmitResult>((resolve) =>
      resolve({
        success: true,
      })
    );
  };

  return (
    <Form
      defaultValues={{
        year1: "2021",
        year2: "2022",
        code: "",
      }}
      validationRules={{}}
      onSubmit={handleSubmit}
    >
      <div className="container">
        <div className="container column">
          <div className="container justify_sb">
            <div>Years</div>
            <button>+</button>
          </div>
          <Form.Field name="year1" label="year" />
          <Form.Field name="year2" label="year" />
        </div>

        <div className="container column">
          <div>Common</div>
          <Form.Field name="code" label="code" />
        </div>
      </div>
    </Form>
  );
};

export default FinancialYars;
