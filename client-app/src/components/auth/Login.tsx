import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Field, change, reduxForm, formValueSelector } from "redux-form";
import { ApplicationState } from "../../store";
import * as AuthStore from "../../store/Auth";

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

type AuthProps = AuthStore.AuthState & typeof AuthStore.actionCreators;

const LoginForm = reduxForm({
  // a unique name for the form
  form: "authForm",
})((props: any) => {
  return (
    <form onSubmit={props.handleSubmit}>
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

      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
});

const Login = (props: AuthProps) => {
  const onSubmit = (values: any) => {
    props.Login(values.userName, values.password);
  };

  return <LoginForm onSubmit={onSubmit} />;
};

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(AuthStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.auth,
  mapDispatchToProps
)(Login);
