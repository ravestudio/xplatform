import { ArrowDropDown } from "@material-ui/icons";
import React, { useState, useRef, useEffect } from "react";
import "./dropdown.css";

interface IDropdownProps {
  options: any;
  id: any;
  label: any;
  prompt: string;
  value: any;
  onChange: (option: any) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({
  options,
  id,
  label,
  prompt,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    ["click", "touched"].forEach((e) => {
      document.addEventListener(e, toggle);
    });

    return () =>
      ["click", "touched"].forEach((e) => {
        document.removeEventListener(e, toggle);
      });
  }, []);

  function toggle(e: any) {
    setOpen(e && e.target === ref.current);
  }

  function filter(options: any) {
    return options.filter(
      (option: any) =>
        option[label].toLowerCase().indexOf(query.toLocaleLowerCase()) > -1
    );
  }

  function displayValue() {
    if (query.length > 0) return query;
    if (value) return value[label];
    return "";
  }

  function selectOption(option: any) {
    setQuery("");
    onChange(option);
    setOpen(false);
  }

  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            type="text"
            ref={ref}
            placeholder={value ? value[label] : prompt}
            value={displayValue()}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(null);
            }}
            onClick={toggle}
            onTouchEnd={toggle}
          />
        </div>
        <div className={`arrow ${open ? "open" : null}`}></div>
      </div>
      <div className={`options ${open ? "open" : null}`}>
        {filter(options).map((option: any) => (
          <div
            key={option[id]}
            className={`option ${value === option ? "selected" : null}`}
            onClick={() => selectOption(option)}
            onTouchEnd={() => selectOption(option)}
          >
            {option[label]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
