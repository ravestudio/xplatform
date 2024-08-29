interface IFieldProps {
  name: string;

  type: "Text" | "Email";
  value: any;

  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextField = (props: IFieldProps) => {
  const { type, name, value, disabled, onChange, onBlur } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const newValue = e.currentTarget.value.replace(/\:/g, "").substring(0, 4);
    const newValue = e.currentTarget.value;

    onChange({
      ...e,
      currentTarget: {
        ...e.currentTarget,
        value: newValue,
      },
    });
  };

  //const sValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  //const sValue = value.replace(/\B(?=(\d{2})+(?!\d))/g, ":");

  return (
    <input
      type={type.toLowerCase()}
      id={name}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

export default TextField;
