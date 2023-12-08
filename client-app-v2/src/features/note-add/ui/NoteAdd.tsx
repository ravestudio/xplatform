import * as React from "react";
import { Form, ISubmitResult, IValues, required } from "../../../entities/form";

import * as AddNoteStore from "../store";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(AddNoteStore.actionCreators, dispatch),
  };
};

type InitProps = {
  code: string;
};

type AddProps = InitProps & ReturnType<typeof mapDispatchToProps>;

const NoteAdd: React.FC<AddProps> = (props: AddProps) => {
  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const result = await props.actions.addNote({
      code: props.code,
      data: values["data"],
    });
    //props.actions.SetToken(result);

    return { success: true };
  };

  return (
    <Form
      defaultValues={{ data: "" }}
      validationRules={{
        data: { validator: required },
      }}
      onSubmit={handleSubmit}
    >
      <Form.Field name="data" label="Оставить заметку" />
    </Form>
  );
};

export default connect(null, mapDispatchToProps)(NoteAdd);
