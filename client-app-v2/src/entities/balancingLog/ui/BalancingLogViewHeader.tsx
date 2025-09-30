import { BalancingLogItem } from "../model/model";
import css from "./BalancingLogView.module.css";

export const BalancingLogViewHeader = () => {
  return (
    <div className={css.logItem}>
      <div className={css.itemCell}>Code</div>
      <div className={css.itemCell}>Deal</div>
      <div className={css.itemCell}>Operation</div>
      <div className={css.itemCell}>Count</div>
      <div className={css.itemCell}>Price</div>
      <div className={css.itemCell}>Cost</div>
      <div className={css.itemCell}>Account</div>
    </div>
  );
};
