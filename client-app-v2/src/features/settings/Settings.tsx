import { FC, useEffect } from "react";
import styles from "./Settings.module.css";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { loadAsync, saveAsync, selectSettings } from "./settingsSlice";
import {
  Form,
  ISubmitResult,
  IValues,
  minLength,
  required,
} from "../../entities/form";
import { toFormData } from "./model";

export const Settings: FC = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAsync());
  }, []);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    await dispatch(saveAsync());

    return { success: true };
  };

  return (
    <div>
      <div>Settings</div>

      {settings && (
        <Form
          defaultValues={toFormData(settings)}
          validationRules={{
            userName: { validator: required },
            password: [{ validator: required }],
          }}
          onSubmit={handleSubmit}
        >
          <Form.Field
            name="loadEmitentProfile"
            label="Load emitent profile"
            type="Select"
            options={["yes", "no"]}
          />
          <Form.Field
            name="loadEmitentFinancial"
            label="Load emitent financial"
            type="Select"
            options={["yes", "no"]}
          />
        </Form>
      )}
    </div>
  );
};
