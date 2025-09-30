import { current } from "@reduxjs/toolkit";
import { BalancingLog } from "../model/model";
import css from "./BalancingLogView.module.css";

type LogItemProps = {
  value: BalancingLog;
};

export const BalancingLogViewSammary = ({ value }: LogItemProps) => {
  //  const portfolioList = value.
  const flow = value.balancingLogItems.reduce((acc, current) => {
    return current.operation === "Buy"
      ? (acc -= current.cost)
      : (acc += current.cost);
  }, 0);
  const viewFlow = flow < 0 ? `(${(flow * -1).toFixed(2)})` : flow.toFixed(2);
  return (
    <div className={css.sammary}>
      <div className={css.sammaryItem}>
        <div className={css.sammaryItemLabel}>CashFlow:</div>
        <div className={css.sammaryItemValue}>{viewFlow}</div>
      </div>
    </div>
  );
};
