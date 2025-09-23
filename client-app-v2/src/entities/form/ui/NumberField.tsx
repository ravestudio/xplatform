interface IFieldProps {
  name: string;

  value: any;

  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const NumberField = (props: IFieldProps) => {
  const { name, value, disabled, onChange, onBlur } = props;

  const clear = (value: string) => {
    return (
      value
        // Keep only digits, hyphen  and decimal points:
        .replace(/[^-\d.]/g, "")
        // Remove duplicated decimal point, if one exists:
        .replace(/^(\d*\.)(.*)\.(.*)$/, "$1$2$3")
        // Keep only two digits past the decimal point:
        .replace(/\.(\d{2})\d+/, ".$1")
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = clear(e.currentTarget.value);

    onChange({
      ...e,
      currentTarget: {
        ...e.currentTarget,
        value: newValue,
      },
    });

    console.log(newValue);
  };

  const sValue = value
    ? value
        // Add thousands separators:
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";

  return (
    <input
      id={name}
      value={sValue}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};

export default NumberField;
