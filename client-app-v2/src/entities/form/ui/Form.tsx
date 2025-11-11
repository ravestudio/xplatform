import * as React from "react";
import css from "./form.module.css";
import TextField from "./TextField";
import clsx from "clsx";
import NumberField from "./NumberField";

export interface IFormContext {
  errors: IErrors;
  values: IValues;
  setValue?: (fieldName: string, value: any) => void;
  validate?: (fieldName: string, value: any) => void;
  calc?: (fieldName: string) => string;
  reset?: (fieldNameList: string[]) => void;
}

export const FormContext = React.createContext<IFormContext>({
  errors: {},
  values: {},
});

export interface IValues {
  [key: string]: any;
}

interface IFieldProps {
  name: string;
  label: string;
  className?: string;
  type?: "Text" | "Number" | "Email" | "Select" | "TextArea" | "Computed";
  options?: string[];
  disabled?: boolean;
}

export interface ISubmitResult {
  success: boolean;
  errors?: IErrors;
}

export type Validator = (
  fieldName: string,
  values: IValues,
  args?: any
) => string;

export const required: Validator = (
  fieldName: string,
  values: IValues,
  args?: any
): string =>
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === ""
    ? "This must be populated"
    : "";

export const minLength: Validator = (
  fieldName: string,
  values: IValues,
  length: number
): string =>
  values[fieldName] && values[fieldName].length < length
    ? `This must be at least ${length} characters`
    : "";

interface IValidation {
  validator: Validator;
  arg?: any;
}

interface IValidationProp {
  [key: string]: IValidation | IValidation[];
}

interface IComputedProp {
  [key: string]: (values: IValues) => string;
}

interface IErrors {
  [key: string]: string[];
}

interface IFormProps {
  defaultValues: IValues;
  validationRules: IValidationProp;
  computed?: IComputedProp;
  onSubmit: (values: IValues) => Promise<ISubmitResult>;
  children: any;
}
interface IState {
  values: IValues;
  errors: IErrors;
  submitting: boolean;
  submitted: boolean;
}

export class Form extends React.Component<IFormProps, IState> {
  public static Field: React.FC<IFieldProps> = (props) => {
    const { name, label, className, type = "Text", options, disabled } = props;

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

    const handleBlur = (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
        | React.FocusEvent<HTMLSelectElement>,
      context: IFormContext
    ) => {
      if (context.validate) {
        context.validate(props.name, e.currentTarget.value);
      }
    };

    const withLabel = label !== "";

    return (
      <FormContext.Consumer>
        {(context) => (
          <div className={clsx(css.formGroup, className)}>
            {withLabel && <label htmlFor={name}>{label}</label>}
            {(type === "Text" || type === "Email") && (
              <TextField
                type={type}
                name={name}
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
                onBlur={(e) => handleBlur(e, context)}
                disabled={disabled}
              />
            )}

            {type === "Number" && (
              <NumberField
                name={name}
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
                onBlur={(e) => handleBlur(e, context)}
                disabled={disabled}
              />
            )}

            {type === "Computed" && (
              <NumberField
                name={name}
                value={context.calc?.(name)}
                onChange={(e) => handleChange(e, context)}
                onBlur={(e) => handleBlur(e, context)}
                disabled={true}
              />
            )}

            {type === "TextArea" && (
              <textarea
                id={name}
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
                onBlur={(e) => handleBlur(e, context)}
              />
            )}

            {type === "Select" && (
              <select
                value={context.values[name]}
                onChange={(e) => handleChange(e, context)}
                onBlur={(e) => handleBlur(e, context)}
              >
                {options &&
                  options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}

            {context.errors[name] &&
              context.errors[name].length > 0 &&
              context.errors[name].map((error) => (
                <span key={error} className="form-error">
                  {error}
                </span>
              ))}
          </div>
        )}
      </FormContext.Consumer>
    );
  };

  constructor(props: IFormProps) {
    super(props);

    const errors: IErrors = {};

    Object.keys(props.defaultValues).forEach((fieldName) => {
      errors[fieldName] = [];
    });

    this.state = {
      submitted: false,
      submitting: false,
      errors,
      values: props.defaultValues,
    };
  }

  public componentDidUpdate(prevProps: IFormProps, prevState: IState) {
    if (this.props.defaultValues !== prevProps.defaultValues) {
      this.setState((prev) => ({
        values: this.props.defaultValues,
      }));
    }
  }

  private setValue = (fieldName: string, value: any) => {
    const newValues = { ...this.state.values, [fieldName]: value };
    this.setState({ values: newValues });
  };

  private reset = (fieldNameList: string[]) => {
    const newValues = Object.keys(this.state.values)
      .filter((key) => !fieldNameList.includes(key))
      .reduce(
        (acc, current) => ({ ...acc, [current]: this.state.values[current] }),
        {}
      );

    this.setState({ values: newValues });
  };

  private validateForm(): boolean {
    const errors: IErrors = {};
    let haveError: boolean = false;
    Object.keys(this.props.defaultValues).map((fieldName) => {
      errors[fieldName] = this.validate(
        fieldName,
        this.state.values[fieldName]
      );
      if (errors[fieldName].length > 0) {
        haveError = true;
      }
    });
    this.setState({ errors });
    return !haveError;
  }

  private handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.validateForm()) {
      this.setState({ submitting: true });
      const result = await this.props.onSubmit(this.state.values);
      this.setState({
        errors: result.errors || {},
        submitted: result.success,
        submitting: false,
      });
    }
  };

  private validate = (fieldName: string, value: any): string[] => {
    const rules = this.props.validationRules[fieldName];
    const errors: string[] = [];

    if (Array.isArray(rules)) {
      rules.forEach((rule) => {
        const error = rule.validator(fieldName, this.state.values, rule.arg);
        if (error) {
          errors.push(error);
        }
      });
    } else {
      if (rules) {
        const error = rules.validator(fieldName, this.state.values, rules.arg);
        if (error) {
          errors.push(error);
        }
      }
    }

    const newErrors = { ...this.state.errors, [fieldName]: errors };
    this.setState({ errors: newErrors });

    return errors;
  };

  private calc = (fieldName: string): string => {
    const calcFunc = this.props.computed?.[fieldName];

    if (!calcFunc) {
      return "";
    }

    return calcFunc(this.state.values);
  };

  public getValues = () => {
    return this.state.values;
  };

  public render() {
    const context: IFormContext = {
      errors: this.state.errors,
      setValue: this.setValue,
      reset: this.reset,
      validate: this.validate,
      calc: this.calc,
      values: this.state.values,
    };

    return (
      <FormContext.Provider value={context}>
        <form noValidate={true} onSubmit={this.handleSubmit}>
          {this.props.children}
          <div className={css.formGroup}>
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
