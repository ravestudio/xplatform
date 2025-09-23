import { Form } from "../../../entities/form";

export const CommonInfo = () => {
  return (
    <div className="container column">
      <div>Common</div>
      <div className="container">
        <Form.Field name="code" label="code" />
        <Form.Field name="cur" label="currency" />
        <Form.Field
          type="Select"
          options={["template1", "template2"]}
          name="template"
          label="template"
        />
      </div>
    </div>
  );
};
