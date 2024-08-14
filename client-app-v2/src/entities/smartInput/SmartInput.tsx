import React, { useState, useRef } from "react";

export interface ISmartInputProps {
  defaultValue: string;
  onSave: (value: string) => void;
}

const SmartInput: React.FC<ISmartInputProps> = (props: ISmartInputProps) => {
  const [value, setValue] = useState<string>(props.defaultValue);
  const [position, setPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const getNewPosition = (val: string) => {
    if (inputRef.current) {
      const _input = inputRef.current;
      const selectionEnd = _input.selectionEnd ?? 0;

      /*const template = "00:00".indexOf(":");
      const flag = val.indexOf(":");

      
      const selectionEnd = _input.selectionEnd ?? 0;

      if (flag > template && selectionEnd === template)
        return 5 - selectionEnd - 1;
      if (flag < template && selectionEnd === template)
        return 5 - selectionEnd + 1;

      return 5 - selectionEnd;
    }*/

      //const corr = val.length > 5 ? -1 : val.length < 5 ? 1 : 0;
      const corr = 5 - val.length;
      return val.length - selectionEnd + corr;
    }

    return 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setPosition(getNewPosition(value));

    const newValue = value
      .replace(/\D/g, "")
      .substring(0, 4)
      .padEnd(4, "0")
      .replace(/(\d{2})$/, "00");

    setValue(newValue);
  };

  const onSaveHandle = () => {
    props.onSave(value);
  };

  const sValue = value.replace(/\B(?=(\d{2})+(?!\d))/g, ":");

  React.useLayoutEffect(() => {
    if (inputRef && sValue) {
      const xpos = sValue.length >= position ? sValue.length - position : 0;
      inputRef.current?.setSelectionRange(xpos, xpos);
    }
  });
  return (
    <div className="container">
      <input
        ref={inputRef}
        type="text"
        value={sValue}
        onChange={handleChange}
      />
      <button onClick={onSaveHandle}>save</button>
    </div>
  );
};

export default SmartInput;
