import { BalancingLogItem } from "../model/model";
import css from "./BalancingLogView.module.css";

type LogViewItemProps = {
  value: BalancingLogItem;
};

export const BalancingLogViewItem = ({ value }: LogViewItemProps) => {
  const viewCost = value.operation === "Buy" ? `(${value.cost})` : value.cost;
  return (
    <div className={css.logItem}>
      <div className={css.itemCell}>{value.code}</div>
      <div className={css.itemCell}>{value.dealNumber}</div>
      <div className={css.itemCell}>{value.operation}</div>
      <div className={css.itemCell}>{value.count}</div>
      <div className={css.itemCell}>{value.price}</div>
      <div className={css.itemCell}>{viewCost}</div>
      <div className={css.itemCell}>{value.account}</div>
    </div>
  );
};
