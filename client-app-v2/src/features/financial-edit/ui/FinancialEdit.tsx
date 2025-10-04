import * as React from "react";
import css from "./FinancialEdit.module.css";
import { Form, ISubmitResult, IValues } from "../../../entities/form";
import { login } from "../../auth/store";
import { YearAdd } from "./YearAdd";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { loadForm, removeUiAction, selectActions, selectYears } from "../store";
import { CommonInfo } from "./CommonInfo";
import { editConfig, viewKeys } from "../../../entities/financial";
import { useEffect, useRef } from "react";
import { FinData, selectFinData } from "../store/financialEditSlice";

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

  const fields = Object.keys(editConfig).map((key) => ({
    fieldName: key,
    caption: editConfig[key as viewKeys],
  }));

  const refCallback = (el: Form | null) => {
    formRef.current = el;
  };

  return (
    <Form
      ref={refCallback}
      defaultValues={draft ?? {}}
      validationRules={{}}
      onSubmit={handleSubmit}
    >
      <CommonInfo />
      <YearAdd />

      {fields.map((field) => {
        return (
          <div key={field.fieldName} className={css.row}>
            <div className={css.fieldTitle}>{field.caption}</div>

            {years.map((year) => {
              return (
                <Form.Field
                  key={field.fieldName + year}
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
