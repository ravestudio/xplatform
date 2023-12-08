import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Form,
  ISubmitResult,
  IValues,
  minLength,
  required,
} from "../../../entities/form";
import { ApplicationState } from "../../../store";
import * as AuthStore from "../store";
import { login } from "../store";

const mapDispatchToProps = (dispatch: any) => {
  return { actions: bindActionCreators(AuthStore.actionCreators, dispatch) };
};

type AuthProps = AuthStore.AuthState & ReturnType<typeof mapDispatchToProps>;

const Login: React.FC<AuthProps> = (props: AuthProps) => {
  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await login(values.userName, values.password);

    props.actions.SetToken(result);

    return result;
  };

  return (
    <Form
      defaultValues={{ userName: "", password: "" }}
      validationRules={{
        userName: { validator: required },
        password: [{ validator: required }],
      }}
      onSubmit={handleSubmit}
    >
      <Form.Field name="userName" label="User Name" />
      <Form.Field name="password" label="Password" />
    </Form>
  );
};

export default connect(
  (state: ApplicationState) => state.auth,
  mapDispatchToProps
)(Login);
