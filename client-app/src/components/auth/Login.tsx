import * as React from "react";

import { Field, change, reduxForm, formValueSelector } from "redux-form";

interface LoginProps {
  open: boolean;
}

interface TFProps {
  label: any;
  input: any;
  meta: any;
  custom: any;
}

const renderTextField: React.FC<TFProps> = (props) => {
  const {
    input,
    label,
    meta: { touched, invalid, error },
    ...custom
  } = props;
  return (
    <div>
      <label>{label}</label>
      <div>
        <input placeholder={label} {...input} {...custom} />
      </div>
    </div>
  );
};

export default reduxForm({
  // a unique name for the form
  form: "authForm",
})(() => {
  return (
    <form>
      <Field
        fullWidth
        name="userName"
        component={renderTextField}
        label="User Name"
      />

      <Field
        fullWidth
        name="password"
        component={renderTextField}
        label="Password"
      />
    </form>
  );
});
