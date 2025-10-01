import { BalancingLog } from "../model/model";
import css from "./BalancingLogView.module.css";
import { BalancingLogViewHeader } from "./BalancingLogViewHeader";
import { BalancingLogViewItem } from "./BalancingLogViewItem";
import { BalancingLogViewSammary } from "./BalancinglogViewSammary";

type LogItemProps = {
  value: BalancingLog;
};
export const BalancingLogView = ({ value }: LogItemProps) => {
  return (
    <div className={css.balancingLog}>
      <div className={css.title}>
        {new Date(value.changeDate).toDateString()}
      </div>
      <div className={css.logViewBody}>
        <BalancingLogViewHeader />
        {value.balancingLogItems.map((item) => (
          <BalancingLogViewItem value={item} />
        ))}
      </div>
      <BalancingLogViewSammary value={value} />
    </div>
  );
};
