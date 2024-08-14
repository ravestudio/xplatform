import React from "react";
import { NumericFormat } from "react-number-format";

interface Props {
  value?: any;
}

const valueRenderer = ({ value }: Props): JSX.Element => (
  <NumericFormat
    value={value ? value.raw / 1000 : undefined}
    defaultValue={"-"}
    displayType={"text"}
    thousandSeparator={true}
  />
);

export default valueRenderer;
