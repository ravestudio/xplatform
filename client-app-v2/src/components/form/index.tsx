import * as React from "react";
import "./form.scss";

interface IFormContext {
  values: IValues;
  setValue?: (fieldName: string, value: any) => void;
}

const FormContext = React.createContext<IFormContext>({
  values: {},
});

export interface IValues {
  [key: string]: any;
}

interface IFieldProps {
  name: string;
  label: string;
  type?: "Text" | "Email" | "Select" | "TextArea";
  options?: string[];
}

export interface ISubmitResult {
  success: boolean;
}

interface IFormProps {
  defaultValues: IValues;
  onSubmit: (values: IValues) => Promise<ISubmitResult>;
}
interface IState {
  values: IValues;
  submitting: boolean;
  submitted: boolean;
}

export class Form extends React.Component<IFormProps, IState> {
  public static Field: React.FC<IFieldProps> = (props) => {
    const { name, label, type, options } = props;

    const handleChange = (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
      context: IFormContext
    ) => {
      if (context.setValue) {
        context.setValue(props.name, e.currentTarget.value);
      }
    };

    return (
      <FormContext.Consumer>
        {(context) => (
          <div className="form-group">
            <label htmlFor={name}>{label}</label>
            {(type === "Text" || type === "Email") && (
              <input
                type={type.toLowerCase()}
                id={name}
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
              />
            )}

            {type === "TextArea" && (
              <textarea
                id={name}
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
              />
            )}

            {type === "Select" && (
              <select
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
              >
                {options &&
                  options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}
          </div>
        )}
      </FormContext.Consumer>
    );
  };

  constructor(props: IFormProps) {
    super(props);
    this.state = {
      submitted: false,
      submitting: false,
      values: props.defaultValues,
    };
  }

  private setValue = (fieldName: string, value: any) => {
    const newValues = { ...this.state.values, [fieldName]: value };
    this.setState({ values: newValues });
  };

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ submitting: true });
    const result = await this.props.onSubmit(this.state.values);
    this.setState({
      submitted: result.success,
      submitting: false,
    });
  };

  public render() {
    const context: IFormContext = {
      setValue: this.setValue,
      values: this.state.values,
    };

    return (
      <FormContext.Provider value={context}>
        <form className="form" noValidate={true} onSubmit={this.handleSubmit}>
          {this.props.children}
          <div className="form-group">
            <button
              type="submit"
              disabled={this.state.submitting || this.state.submitted}
            >
              Submit
            </button>
          </div>
        </form>
      </FormContext.Provider>
    );
  }
}

Form.Field.defaultProps = {
  type: "Text",
};
