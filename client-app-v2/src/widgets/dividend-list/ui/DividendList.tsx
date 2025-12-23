import { useEffect } from "react";

import { ActionProps, StateProps } from "../model/model";
import DividendItem from "../../../entities/dividend/ui/DividendItem";
import css from "./DividendList.module.css";

type DividendListProps = StateProps & ActionProps;

export const DividendList = ({
  code,
  dividends,
  requestDividends,
  reset,
}: DividendListProps) => {
  useEffect(() => {
    if (code) {
      requestDividends(code);
    }

    return () => {
      reset();
    };
  }, [code]);

  if (!dividends) {
    return null;
  }

  return (
    <div className={css.container}>
      <div className={css.title}>DividendList</div>
      <div className={css.dividends}>
        {dividends.map((dividend, index) => (
          <DividendItem key={index} dividend={dividend} />
        ))}
      </div>
    </div>
  );
};
