import React from "react";
import { Dividend } from "../model/model";
import css from "./DividendItem.module.css";
import { format } from "date-fns";

interface Props {
  dividend: Dividend;
}

const DividendItem: React.FC<Props> = ({ dividend }: Props) => {
  return (
    <div className={css.dividend}>
      <div>{format(new Date(dividend.lastBuyDate), "dd-MM-yyyy")}</div>
      <div>{dividend.dividendNet}</div>
    </div>
  );
};

export default DividendItem;
