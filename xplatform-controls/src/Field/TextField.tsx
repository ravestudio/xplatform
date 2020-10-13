import React from "react";

import {

    TextField

  } from "@material-ui/core";

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
      <TextField
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        {...input}
        {...custom}
      />
    );
  };

  export default renderTextField;